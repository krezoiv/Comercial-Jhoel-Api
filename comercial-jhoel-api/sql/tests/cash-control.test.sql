-- Control de Efectivo (migración 1760006800000-CreateCashControlKardexAndCuts):
-- Kardex oficial de efectivo físico, triggers sobre las operaciones de origen,
-- apertura del día heredada, dos cortes, arqueo, conciliación bancaria y cierre.
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK: no deja ningún dato.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/cash-control.test.sql

BEGIN;

CREATE FUNCTION pg_temp.admin_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name IN ('SUPER_ADMIN', 'ADMIN') ORDER BY u.created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.type_id(p_effect VARCHAR) RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_types WHERE balance_effect = p_effect AND is_active ORDER BY created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.agent() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_banks WHERE cash_box_code IS NULL AND is_active ORDER BY created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.guayacan() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_banks WHERE cash_box_code = 'GUAYACAN'
$$;

CREATE FUNCTION pg_temp.account() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM banks WHERE is_active AND special_account IS NULL AND available_in_transaccionar
  ORDER BY created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.client() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM clients WHERE is_active ORDER BY created_at LIMIT 1
$$;

-- Operación de Transaccionar sin desglose (monto aplicado = total).
CREATE FUNCTION pg_temp.op(p_effect VARCHAR, p_amount NUMERIC, p_agent UUID DEFAULT NULL) RETURNS UUID LANGUAGE sql AS $$
  SELECT register_bank_deposit_operation(
    CASE WHEN p_effect IN ('DESEMBOLSO_GENESIS', 'PAGO_GENESIS') THEN NULL ELSE COALESCE(p_agent, pg_temp.agent()) END,
    p_amount, CURRENT_DATE, '[]'::jsonb, jsonb_build_array(p_amount),
    pg_temp.admin_id(), pg_temp.type_id(p_effect), NULL, 0, NULL,
    CASE WHEN p_effect IN ('DESEMBOLSO_GENESIS', 'PAGO_GENESIS') THEN NULL ELSE pg_temp.account() END, false
  )
$$;

CREATE FUNCTION pg_temp.last_movement() RETURNS cash_movements LANGUAGE sql AS $$
  SELECT * FROM cash_movements ORDER BY sequence DESC LIMIT 1
$$;

CREATE FUNCTION pg_temp.err(p_sql TEXT) RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE p_sql;
  RETURN 'OK';
EXCEPTION WHEN OTHERS THEN
  RETURN split_part(SQLERRM, ':', 1);
END $$;

CREATE FUNCTION pg_temp.expect(p_label TEXT, p_actual TEXT, p_expected TEXT) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  IF p_actual IS DISTINCT FROM p_expected THEN
    RAISE EXCEPTION 'FALLÓ %: se esperaba %, se obtuvo %', p_label, p_expected, p_actual;
  END IF;
  RAISE NOTICE 'OK  %', p_label;
END $$;

DO $$
DECLARE
  v_admin UUID := pg_temp.admin_id();
  v_today DATE := (now() AT TIME ZONE 'America/Guatemala')::date;
  v_base NUMERIC;
  v_op UUID;
  v_id UUID;
  v_id2 UUID;
  v_row cash_movements;
  v_day cash_operational_days;
  v_p1 cash_cut_periods;
  v_p2 cash_cut_periods;
  v_banks JSONB;
  v_count INT;
  v_bank_balance NUMERIC;
BEGIN
  IF pg_temp.agent() IS NULL OR pg_temp.account() IS NULL OR pg_temp.client() IS NULL THEN
    RAISE EXCEPTION 'Faltan datos base (banco agente, cuenta en Transaccionar o cliente)';
  END IF;
  -- Saldo bancario suficiente para los depósitos (el saldo bancario no es efectivo).
  PERFORM adjust_bank_balance(pg_temp.account(), 500000, CURRENT_DATE, v_admin, 'Base de prueba', NULL);
  -- Línea Génesis con espacio para pagos (respeta su máximo de Q120,000).
  IF (SELECT final_balance FROM banks WHERE special_account = 'GENESIS' AND is_active LIMIT 1) <> 0 THEN
    PERFORM adjust_bank_balance((SELECT id FROM banks WHERE special_account = 'GENESIS' AND is_active LIMIT 1),
                                0, CURRENT_DATE, v_admin, 'Base de prueba', NULL);
  END IF;

  -- ===== Clasificación explícita =====
  PERFORM pg_temp.expect('C0 Depósito clasificado IN',
    (SELECT cash_effect FROM transaction_types WHERE id = pg_temp.type_id('DEPOSITO')), 'IN');
  PERFORM pg_temp.expect('C0 Reintegro clasificado NONE',
    (SELECT cash_effect FROM transaction_types WHERE id = pg_temp.type_id('REINTEGRO')), 'NONE');

  -- ===== 1. Saldo inicial autorizado (una sola vez) =====
  v_base := cash_balance();
  PERFORM register_manual_cash_movement('SALDO_INICIAL', 150000, v_admin, NULL, 'Carga inicial de prueba', 'TEST:INITIAL');
  PERFORM pg_temp.expect('T1 saldo inicial +Q150,000', cash_balance()::TEXT, (v_base + 150000)::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('T1 segundo saldo inicial rechazado',
    pg_temp.err(format('SELECT register_manual_cash_movement(%L, 1, %L, NULL, %L, %L)',
      'SALDO_INICIAL', v_admin, 'Otro saldo inicial', 'TEST:INITIAL-2')), 'CASH_INITIAL_BALANCE_EXISTS');
  PERFORM pg_temp.expect('T1 ajuste sin motivo rechazado',
    pg_temp.err(format('SELECT register_manual_cash_movement(%L, 10, %L, NULL, %L, %L)', 'AJUSTE', v_admin, '', 'TEST:ADJ-0')),
    'CASH_REASON_REQUIRED');
  v_base := cash_balance();

  -- ===== Apertura del día (sin cortes previos: saldo del Kardex, no verificado) =====
  v_id := open_cash_operational_day(v_today, v_admin, NULL, NULL, '07:00', '13:00', '13:00', '19:00');
  SELECT * INTO v_day FROM cash_operational_days WHERE id = v_id;
  PERFORM pg_temp.expect('D1 política sin arqueos previos', v_day.opening_policy, 'SYSTEM_UNVERIFIED');
  -- Saldo inicial del día = Kardex ANTES de los movimientos de hoy (los de hoy son entradas/salidas del día).
  PERFORM pg_temp.expect('D1 apertura física = Kardex al cierre de ayer', v_day.opening_physical_cash::TEXT,
    cash_balance_at(COALESCE((SELECT max(sequence) FROM cash_movements WHERE operational_date < v_today), 0))::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('D1 sin diferencia heredada', v_day.inherited_difference::TEXT, '0.00');
  PERFORM pg_temp.expect('D1 apertura idempotente',
    open_cash_operational_day(v_today, v_admin, NULL, NULL, NULL, NULL, NULL, NULL)::TEXT, v_id::TEXT);
  PERFORM pg_temp.expect('D1 dos cortes programados',
    (SELECT count(*) FROM cash_cut_periods WHERE operational_day_id = v_id AND status = 'PROGRAMADO')::TEXT, '2');
  -- 23. Zona horaria: 07:00 Guatemala = 13:00 UTC.
  PERFORM pg_temp.expect('T23 horario programado en America/Guatemala',
    (SELECT to_char(scheduled_start_at AT TIME ZONE 'UTC', 'HH24:MI') FROM cash_cut_periods
     WHERE operational_day_id = v_id AND period_number = 1), '13:00');
  PERFORM pg_temp.expect('T23 hora local del corte',
    (SELECT to_char(scheduled_start_at AT TIME ZONE 'America/Guatemala', 'HH24:MI') FROM cash_cut_periods
     WHERE operational_day_id = v_id AND period_number = 1), '07:00');

  -- ===== Horarios =====
  SELECT * INTO v_p1 FROM cash_cut_periods WHERE operational_day_id = v_id AND period_number = 1;
  SELECT * INTO v_p2 FROM cash_cut_periods WHERE operational_day_id = v_id AND period_number = 2;
  PERFORM pg_temp.expect('H1 fin antes del inicio rechazado',
    pg_temp.err(format('SELECT update_cash_cut_schedule(%L, %L, %L, %L, %L)', v_p1.id, '12:00', '11:00', 'Cambio de turno', v_admin)),
    'CASH_CUT_INVALID_SCHEDULE');
  PERFORM pg_temp.expect('H2 traslape con el segundo corte rechazado',
    pg_temp.err(format('SELECT update_cash_cut_schedule(%L, %L, %L, %L, %L)', v_p1.id, '07:00', '14:00', 'Cambio de turno', v_admin)),
    'CASH_CUT_SCHEDULE_OVERLAP');
  PERFORM pg_temp.expect('H3 cambio sin motivo rechazado',
    pg_temp.err(format('SELECT update_cash_cut_schedule(%L, %L, %L, %L, %L)', v_p1.id, '08:00', '12:00', '', v_admin)),
    'CASH_REASON_REQUIRED');
  PERFORM update_cash_cut_schedule(v_p1.id, '08:00', '12:30', 'Cambio de turno', v_admin);
  PERFORM pg_temp.expect('H4 cambio auditado',
    (SELECT count(*) FROM cash_cut_schedule_changes WHERE cut_period_id = v_p1.id)::TEXT, '1');

  -- ===== 16/15. Orden de los cortes =====
  PERFORM pg_temp.expect('T16 segundo corte antes del primero rechazado',
    pg_temp.err(format('SELECT start_cash_cut_period(%L, %L)', v_p2.id, v_admin)), 'CASH_CUT_FIRST_NOT_FINISHED');
  PERFORM pg_temp.expect('T15 finalizar corte no abierto rechazado',
    pg_temp.err(format('SELECT finish_cash_cut_period(%L, %L, %L, %L, NULL, NULL)', v_p1.id, v_admin, '[]', '[]')),
    'CASH_CUT_NOT_OPEN');
  PERFORM start_cash_cut_period(v_p1.id, v_admin);
  PERFORM pg_temp.expect('T15 iniciar dos veces rechazado',
    pg_temp.err(format('SELECT start_cash_cut_period(%L, %L)', v_p1.id, v_admin)), 'CASH_CUT_ALREADY_STARTED');
  PERFORM pg_temp.expect('T15 foto bancaria inicial guardada',
    (SELECT jsonb_array_length(opening_bank_balances) = (SELECT count(*) FROM banks WHERE is_active)
     FROM cash_cut_periods WHERE id = v_p1.id)::TEXT, 'true');

  -- ===== 2–9. Reglas de afectación =====
  v_base := cash_balance();
  v_op := pg_temp.op('DEPOSITO', 5000);
  v_row := pg_temp.last_movement();
  PERFORM pg_temp.expect('T2 depósito suma', v_row.direction || ' ' || v_row.new_balance, 'IN ' || (v_base + 5000)::NUMERIC(14,2));
  PERFORM pg_temp.expect('T10 saldo anterior/posterior', (v_row.new_balance - v_row.previous_balance)::TEXT, '5000.00');
  PERFORM pg_temp.expect('T2 referencia a la operación', v_row.reference_type || ':' || v_row.reference_id, 'BANK_DEPOSIT:' || v_op);
  PERFORM pg_temp.expect('T2 corte asignado', v_row.cut_period_id::TEXT, v_p1.id::TEXT);
  PERFORM pg_temp.expect('T2 banco relacionado', (v_row.bank_name IS NOT NULL)::TEXT, 'true');

  PERFORM pg_temp.op('RETIRO', 1000);
  v_row := pg_temp.last_movement();
  PERFORM pg_temp.expect('T3 retiro resta', v_row.direction || ' ' || v_row.new_balance, 'OUT ' || (v_base + 4000)::NUMERIC(14,2));

  PERFORM pg_temp.op('DESEMBOLSO_GENESIS', 2000);
  v_row := pg_temp.last_movement();
  PERFORM pg_temp.expect('T4 desembolso Génesis resta', v_row.movement_type || ' ' || v_row.direction, 'DESEMBOLSO_GENESIS OUT');
  PERFORM pg_temp.expect('T4 saldo', cash_balance()::TEXT, (v_base + 2000)::NUMERIC(14,2)::TEXT);

  PERFORM pg_temp.op('PAGO_GENESIS', 3000);
  v_row := pg_temp.last_movement();
  PERFORM pg_temp.expect('T5 pago préstamo Génesis suma', v_row.movement_type || ' ' || v_row.direction, 'PAGO_GENESIS IN');
  PERFORM pg_temp.expect('T5 saldo', cash_balance()::TEXT, (v_base + 5000)::NUMERIC(14,2)::TEXT);

  PERFORM register_account_receivable_movement(pg_temp.client(), 'CARGO', 500, CURRENT_DATE, 'Prueba', v_admin, NULL, NULL);
  v_row := pg_temp.last_movement();
  PERFORM pg_temp.expect('T6 gasto por cobrar resta', v_row.movement_type || ' ' || v_row.direction, 'GASTO_POR_COBRAR OUT');
  PERFORM pg_temp.expect('T6 saldo', cash_balance()::TEXT, (v_base + 4500)::NUMERIC(14,2)::TEXT);

  PERFORM register_asset_movement(pg_temp.client(), 'CARGO', 1500, CURRENT_DATE, 'Prueba', v_admin, NULL, NULL);
  v_row := pg_temp.last_movement();
  PERFORM pg_temp.expect('T7 activo suma', v_row.movement_type || ' ' || v_row.direction, 'ACTIVO IN');
  PERFORM pg_temp.expect('T7 saldo', cash_balance()::TEXT, (v_base + 6000)::NUMERIC(14,2)::TEXT);

  -- Abonos: inverso (decisión del usuario).
  PERFORM register_account_receivable_movement(pg_temp.client(), 'ABONO', 200, CURRENT_DATE, 'Prueba', v_admin, NULL, NULL);
  PERFORM pg_temp.expect('T6b abono CxC suma', (pg_temp.last_movement()).direction, 'IN');
  PERFORM register_asset_movement(pg_temp.client(), 'ABONO', 200, CURRENT_DATE, 'Prueba', v_admin, NULL, NULL);
  PERFORM pg_temp.expect('T7b devolución de activo resta', (pg_temp.last_movement()).direction, 'OUT');
  PERFORM pg_temp.expect('T7b saldo neto sin cambio', cash_balance()::TEXT, (v_base + 6000)::NUMERIC(14,2)::TEXT);

  v_id2 := register_bank_transfer(pg_temp.account(), NULL, 2000, CURRENT_DATE, v_admin, 'RET-1', 'Retiro a caja');
  v_row := pg_temp.last_movement();
  PERFORM pg_temp.expect('T8 retiro bancario hacia caja suma', v_row.movement_type || ' ' || v_row.direction, 'RETIRO_BANCARIO IN');
  PERFORM pg_temp.expect('T8 saldo', cash_balance()::TEXT, (v_base + 8000)::NUMERIC(14,2)::TEXT);

  -- 9. Sin efecto físico: Reintegro (cuenta → Génesis) y Guayacán (caja propia).
  v_base := cash_balance();
  PERFORM pg_temp.op('REINTEGRO', 700);
  v_row := pg_temp.last_movement();
  PERFORM pg_temp.expect('T9 reintegro sin efecto', v_row.direction || ' ' || (v_row.previous_balance = v_row.new_balance), 'NONE true');
  IF pg_temp.guayacan() IS NOT NULL AND EXISTS (SELECT 1 FROM banks WHERE special_account = 'GUAYACAN' AND is_active) THEN
    PERFORM register_bank_deposit_operation(
      pg_temp.guayacan(), 400, CURRENT_DATE, '[]'::jsonb, '[400]'::jsonb, v_admin, pg_temp.type_id('DEPOSITO'),
      NULL, 0, NULL, (SELECT id FROM banks WHERE special_account = 'GUAYACAN' AND is_active LIMIT 1), false);
    PERFORM pg_temp.expect('T9 Guayacán no mueve la caja principal', (pg_temp.last_movement()).direction, 'NONE');
  ELSE
    RAISE NOTICE 'SKIP T9 Guayacán (sin cuenta GUAYACAN activa en esta base)';
  END IF;
  -- Transferencia entre cuentas: no es efectivo físico.
  v_count := (SELECT count(*) FROM cash_movements);
  PERFORM register_bank_transfer(pg_temp.account(),
    (SELECT id FROM banks WHERE is_active AND special_account IS NULL AND id <> pg_temp.account() ORDER BY created_at LIMIT 1),
    100, CURRENT_DATE, v_admin, 'TR-1', 'Entre cuentas');
  PERFORM pg_temp.expect('T9 transferencia bancaria no genera movimiento',
    (SELECT count(*) FROM cash_movements)::TEXT, v_count::TEXT);
  PERFORM pg_temp.expect('T9 saldo intacto', cash_balance()::TEXT, v_base::NUMERIC(14,2)::TEXT);

  -- ===== 13. Idempotencia =====
  v_id := register_manual_cash_movement('ENTRADA_MANUAL', 50, v_admin, NULL, 'Reintento de prueba', 'TEST:RETRY');
  v_id2 := register_manual_cash_movement('ENTRADA_MANUAL', 50, v_admin, NULL, 'Reintento de prueba', 'TEST:RETRY');
  PERFORM pg_temp.expect('T13 reintento devuelve el mismo movimiento', v_id2::TEXT, v_id::TEXT);
  PERFORM pg_temp.expect('T13 un solo movimiento',
    (SELECT count(*) FROM cash_movements WHERE idempotency_key = 'TEST:RETRY')::TEXT, '1');
  PERFORM pg_temp.expect('T13 un solo movimiento por operación',
    (SELECT count(*) FROM cash_movements WHERE reference_id = v_op AND movement_type <> 'ANULACION')::TEXT, '1');

  -- ===== 14. Anulación por movimiento inverso =====
  v_base := cash_balance();
  PERFORM void_bank_deposit_operation(v_op, CURRENT_DATE, v_admin, 'Error de digitación');
  v_row := pg_temp.last_movement();
  PERFORM pg_temp.expect('T14 anulación inversa', v_row.movement_type || ' ' || v_row.direction, 'ANULACION OUT');
  PERFORM pg_temp.expect('T14 saldo revertido', cash_balance()::TEXT, (v_base - 5000)::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('T14 original marcado, no borrado',
    (SELECT status FROM cash_movements WHERE reference_id = v_op AND movement_type = 'DEPOSITO'), 'ANULADO');
  PERFORM pg_temp.expect('T14 motivo en el inverso', v_row.reason, 'Error de digitación');
  PERFORM pg_temp.expect('T14 anulación de origen ajeno rechazada en caja',
    pg_temp.err(format('SELECT void_manual_cash_movement(%L, %L, %L)',
      (SELECT id FROM cash_movements WHERE movement_type = 'RETIRO' ORDER BY sequence DESC LIMIT 1), v_admin, 'No corresponde')),
    'CASH_MOVEMENT_NOT_VOIDABLE');
  PERFORM void_manual_cash_movement(v_id, v_admin, 'Entrada duplicada');
  PERFORM pg_temp.expect('T14 doble anulación rechazada',
    pg_temp.err(format('SELECT void_manual_cash_movement(%L, %L, %L)', v_id, v_admin, 'Otra vez')), 'CASH_MOVEMENT_ALREADY_VOIDED');
  -- Anular el retiro bancario revierte su entrada a caja.
  v_base := cash_balance();
  PERFORM void_bank_transfer(
    (SELECT reference_id FROM bank_account_movements WHERE movement_type = 'RETIRO_EFECTIVO' ORDER BY sequence DESC LIMIT 1),
    CURRENT_DATE, v_admin, 'Prueba');
  PERFORM pg_temp.expect('T14 anular retiro bancario resta', cash_balance()::TEXT, (v_base - 2000)::NUMERIC(14,2)::TEXT);
  -- Desactivar un gasto por cobrar registrado devuelve su efectivo.
  v_base := cash_balance();
  UPDATE accounts_receivable SET is_active = false
  WHERE id = (SELECT reference_id FROM cash_movements WHERE movement_type = 'GASTO_POR_COBRAR' ORDER BY sequence DESC LIMIT 1);
  PERFORM pg_temp.expect('T14 desactivar gasto por cobrar suma', cash_balance()::TEXT, (v_base + 500)::NUMERIC(14,2)::TEXT);

  -- ===== 12. Consulta / continuidad del Kardex =====
  PERFORM pg_temp.expect('T12 cadena de saldos continua', (
    SELECT count(*) FROM (
      SELECT previous_balance, lag(new_balance) OVER (ORDER BY sequence) AS prior FROM cash_movements
    ) k WHERE prior IS NOT NULL AND prior <> previous_balance)::TEXT, '0');

  -- ===== 15. Finalizar el primer corte (arqueo + conciliación) =====
  PERFORM pg_temp.expect('T19 conciliación incompleta rechazada',
    pg_temp.err(format('SELECT finish_cash_cut_period(%L, %L, %L, %L, NULL, NULL)',
      v_p1.id, v_admin, '[{"denomination":100,"quantity":1}]', '[]')), 'CASH_CUT_BANKS_INCOMPLETE');
  PERFORM pg_temp.expect('T15 denominación inválida rechazada',
    pg_temp.err(format('SELECT finish_cash_cut_period(%L, %L, %L, %L, NULL, NULL)',
      v_p1.id, v_admin, '[{"denomination":3,"quantity":1}]', '[]')), 'CASH_INVALID_DENOMINATION');
  SELECT jsonb_agg(jsonb_build_object('bankId', b.id,
           'verifiedBalance', CASE WHEN b.id = pg_temp.account() THEN b.final_balance - 10 ELSE b.final_balance END))
  INTO v_banks FROM banks b WHERE b.is_active AND b.special_account IS DISTINCT FROM 'GUAYACAN';
  SELECT v_banks || COALESCE(jsonb_agg(jsonb_build_object('bankId', b.id, 'verifiedBalance', guayacan_cash_balance())), '[]')
  INTO v_banks FROM banks b WHERE b.is_active AND b.special_account = 'GUAYACAN';
  v_base := cash_balance();
  -- Contado = sistema − Q0.25 (faltante de una moneda de 25 centavos).
  PERFORM finish_cash_cut_period(v_p1.id, v_admin,
    jsonb_build_array(
      jsonb_build_object('denomination', 200, 'quantity', floor((v_base - 0.25) / 200)),
      jsonb_build_object('denomination', 0.05, 'quantity', round(((v_base - 0.25) - floor((v_base - 0.25) / 200) * 200) / 0.05))
    ), v_banks, 'Faltan Q0.25', NULL);
  SELECT * INTO v_p1 FROM cash_cut_periods WHERE id = v_p1.id;
  PERFORM pg_temp.expect('T15 primer corte FINALIZADO', v_p1.status, 'FINALIZADO');
  PERFORM pg_temp.expect('T15 diferencia = contado − sistema', v_p1.cash_difference::TEXT, '-0.25');
  PERFORM pg_temp.expect('T19 diferencia bancaria guardada',
    (SELECT difference FROM cash_cut_bank_reconciliations WHERE cut_period_id = v_p1.id AND bank_id = pg_temp.account())::TEXT, '-10.00');
  PERFORM pg_temp.expect('T15 entradas/salidas del rango',
    (v_p1.total_in > 0 AND v_p1.total_out > 0 AND v_p1.movement_count > 0)::TEXT, 'true');
  PERFORM pg_temp.expect('T15 no se puede finalizar dos veces',
    pg_temp.err(format('SELECT finish_cash_cut_period(%L, %L, %L, %L, NULL, NULL)', v_p1.id, v_admin, '[]', v_banks)),
    'CASH_CUT_NOT_OPEN');
  PERFORM pg_temp.expect('T20 cierre del día antes del segundo corte rechazado',
    pg_temp.err(format('SELECT close_cash_operational_day(%L, %L, NULL)', v_p1.operational_day_id, v_admin)),
    'CASH_DAY_CUTS_PENDING');

  -- Movimiento entre cortes: pertenece al segundo corte.
  PERFORM pg_temp.op('DEPOSITO', 300);
  PERFORM pg_temp.expect('T16 movimiento entre cortes asignado al segundo',
    (pg_temp.last_movement()).cut_period_id::TEXT, v_p2.id::TEXT);

  -- ===== 16/17/18. Segundo corte: hereda lo CONTADO, conserva la diferencia =====
  PERFORM start_cash_cut_period(v_p2.id, v_admin);
  SELECT * INTO v_p2 FROM cash_cut_periods WHERE id = v_p2.id;
  PERFORM pg_temp.expect('T17 físico inicial = contado del primer corte', v_p2.opening_physical_cash::TEXT, v_p1.closing_physical_cash::TEXT);
  PERFORM pg_temp.expect('T17 sistema inicial = sistema al cerrar el primero', v_p2.opening_system_cash::TEXT, v_p1.closing_system_cash::TEXT);
  PERFORM pg_temp.expect('T18 diferencia del primer corte conservada', v_p2.inherited_difference::TEXT, '-0.25');
  PERFORM pg_temp.expect('T18 rango contiguo', v_p2.start_sequence::TEXT, v_p1.closing_sequence::TEXT);

  PERFORM pg_temp.op('RETIRO', 100);
  v_base := cash_balance();
  PERFORM finish_cash_cut_period(v_p2.id, v_admin,
    jsonb_build_array(
      jsonb_build_object('denomination', 200, 'quantity', floor(v_base / 200)),
      jsonb_build_object('denomination', 0.05, 'quantity', round((v_base - floor(v_base / 200) * 200) / 0.05))
    ), v_banks, NULL, 'Cierre de turno');
  SELECT * INTO v_p2 FROM cash_cut_periods WHERE id = v_p2.id;
  PERFORM pg_temp.expect('T16 segundo corte FINALIZADO', v_p2.status, 'FINALIZADO');
  PERFORM pg_temp.expect('T16 segundo corte cuadra', v_p2.cash_difference::TEXT, '0.00');
  PERFORM pg_temp.expect('T16 movimientos del segundo corte (depósito entre cortes + retiro)', v_p2.movement_count::TEXT, '2');
  PERFORM pg_temp.expect('T18 primer corte intacto',
    (SELECT cash_difference FROM cash_cut_periods WHERE id = v_p1.id)::TEXT, '-0.25');

  -- ===== Reapertura (solo el último corte, motivo obligatorio) =====
  PERFORM pg_temp.expect('R1 reabrir primer corte con el segundo hecho rechazado',
    pg_temp.err(format('SELECT reopen_cash_cut_period(%L, %L, %L)', v_p1.id, v_admin, 'Revisión de arqueo')), 'CASH_CUT_LATER_EXISTS');
  PERFORM reopen_cash_cut_period(v_p2.id, v_admin, 'Revisión de arqueo');
  PERFORM pg_temp.expect('R2 reabierto con historial',
    (SELECT count(*) FROM cash_cut_events WHERE cut_period_id = v_p2.id AND action = 'REABIERTO')::TEXT, '1');
  PERFORM pg_temp.expect('R2 arqueo anterior conservado',
    (SELECT count(*) FROM cash_cut_counts WHERE cut_period_id = v_p2.id)::TEXT, '1');
  PERFORM finish_cash_cut_period(v_p2.id, v_admin,
    jsonb_build_array(
      jsonb_build_object('denomination', 200, 'quantity', floor(v_base / 200)),
      jsonb_build_object('denomination', 0.05, 'quantity', round((v_base - floor(v_base / 200) * 200) / 0.05))
    ), v_banks, NULL, 'Cierre de turno (revisado)');
  PERFORM pg_temp.expect('R3 dos arqueos, uno vigente',
    (SELECT count(*) || '/' || count(*) FILTER (WHERE is_current) FROM cash_cut_counts WHERE cut_period_id = v_p2.id), '2/1');

  -- ===== 20. Cierre definitivo consolidado =====
  PERFORM close_cash_operational_day(v_p1.operational_day_id, v_admin, 'Fin del día');
  SELECT * INTO v_day FROM cash_operational_days WHERE id = v_p1.operational_day_id;
  PERFORM pg_temp.expect('T20 día CERRADO', v_day.status, 'CERRADO');
  PERFORM pg_temp.expect('T20 efectivo final = contado del segundo corte', v_day.closing_physical_cash::TEXT, v_p2.closing_physical_cash::TEXT);
  PERFORM pg_temp.expect('T20 sin duplicar operaciones',
    v_day.movement_count::TEXT, ((SELECT movement_count FROM cash_cut_periods WHERE id = v_p1.id) + 2)::TEXT);
  PERFORM pg_temp.expect('T20 cerrar dos veces rechazado',
    pg_temp.err(format('SELECT close_cash_operational_day(%L, %L, NULL)', v_day.id, v_admin)), 'CASH_DAY_ALREADY_CLOSED');
  PERFORM pg_temp.expect('T20 corte de día cerrado no se reabre',
    pg_temp.err(format('SELECT reopen_cash_cut_period(%L, %L, %L)', v_p2.id, v_admin, 'Revisión tardía')), 'CASH_DAY_ALREADY_CLOSED');

  -- ===== 1/3. Día siguiente: hereda el efectivo físico del cierre =====
  v_id := open_cash_operational_day(v_today + 1, v_admin, NULL, NULL, NULL, NULL, NULL, NULL);
  SELECT * INTO v_day FROM cash_operational_days WHERE id = v_id;
  PERFORM pg_temp.expect('T1 apertura hereda el cierre anterior', v_day.opening_policy, 'INHERITED_FROM_CLOSE');
  PERFORM pg_temp.expect('T1 efectivo inicial = físico final anterior', v_day.opening_physical_cash::TEXT, v_p2.closing_physical_cash::TEXT);
  PERFORM pg_temp.expect('T1 trazabilidad con el corte anterior', v_day.previous_cut_id::TEXT, v_p2.id::TEXT);
  PERFORM pg_temp.expect('T1 horario heredado del día anterior',
    (SELECT to_char(scheduled_start_at AT TIME ZONE 'America/Guatemala', 'HH24:MI') FROM cash_cut_periods
     WHERE operational_day_id = v_id AND period_number = 1), '08:00');
  PERFORM pg_temp.expect('T1 no se abre un día anterior a uno ya abierto',
    pg_temp.err(format('SELECT open_cash_operational_day(%L, %L, NULL, NULL, NULL, NULL, NULL, NULL)', v_today - 5, v_admin)),
    'CASH_DAY_LATER_EXISTS');

  -- ===== 22. Un solo corte abierto a la vez =====
  PERFORM start_cash_cut_period((SELECT id FROM cash_cut_periods WHERE operational_day_id = v_id AND period_number = 1), v_admin);
  PERFORM pg_temp.expect('T22 no se abre otro día con un corte abierto',
    pg_temp.err(format('SELECT open_cash_operational_day(%L, %L, NULL, NULL, NULL, NULL, NULL, NULL)', v_today + 2, v_admin)),
    'CASH_CUT_ANOTHER_OPEN');

  RAISE NOTICE 'Control de Efectivo: todas las pruebas pasaron.';
END $$;

ROLLBACK;
