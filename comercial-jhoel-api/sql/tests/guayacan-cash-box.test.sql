-- Pruebas de negocio de la Caja Guayacán y su comisión por transacción
-- (migración 1760006300000-CreateGuayacanCashBox). Todo corre dentro de una
-- transacción que SIEMPRE termina en ROLLBACK: no deja ningún dato.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/guayacan-cash-box.test.sql

BEGIN;

CREATE FUNCTION pg_temp.admin_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name IN ('SUPER_ADMIN', 'ADMIN') ORDER BY u.created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.type_id(p_effect VARCHAR) RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_types WHERE balance_effect = p_effect AND is_active ORDER BY created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.retiro_type() RETURNS UUID LANGUAGE sql AS $$
  SELECT pg_temp.type_id('RETIRO')
$$;

CREATE FUNCTION pg_temp.account_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM banks
  WHERE is_active AND special_account IS NULL AND available_in_transaccionar AND max_balance IS NULL
  ORDER BY created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.guayacan() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_banks WHERE cash_box_code = 'GUAYACAN'
$$;

CREATE FUNCTION pg_temp.other_agent() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_banks WHERE is_active AND cash_box_code IS NULL ORDER BY name LIMIT 1
$$;

CREATE FUNCTION pg_temp.cash_balance() RETURNS NUMERIC LANGUAGE sql AS $$
  SELECT COALESCE((SELECT balance_after FROM guayacan_cash_movements ORDER BY sequence DESC LIMIT 1), 0)
$$;

CREATE FUNCTION pg_temp.balance(p_bank UUID) RETURNS NUMERIC LANGUAGE sql AS $$
  SELECT final_balance FROM banks WHERE id = p_bank
$$;

-- Operación que SUMA al saldo de la cuenta (nunca falla por saldo) con N
-- transacciones de Q10: Depósito en Guayacán, Retiro en cualquier otro banco.
CREATE FUNCTION pg_temp.retiro(p_agent UUID, p_count INT) RETURNS UUID LANGUAGE plpgsql AS $$
BEGIN
  RETURN register_bank_deposit_operation(
    p_agent, p_count * 10, CURRENT_DATE, '[]'::jsonb,
    (SELECT jsonb_agg(10) FROM generate_series(1, p_count)),
    pg_temp.admin_id(),
    pg_temp.type_id(CASE WHEN p_agent = pg_temp.guayacan() THEN 'DEPOSITO' ELSE 'RETIRO' END),
    'Prueba Guayacán', 0, NULL, pg_temp.account_id(), false
  );
END $$;

-- Una operación de p_amount con un solo tipo/banco, devuelve el código de error o 'OK'.
CREATE FUNCTION pg_temp.op(p_agent UUID, p_effect VARCHAR, p_amount NUMERIC) RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN
  PERFORM register_bank_deposit_operation(
    p_agent, p_amount, CURRENT_DATE, '[]'::jsonb, jsonb_build_array(p_amount),
    pg_temp.admin_id(), pg_temp.type_id(p_effect), 'Prueba signo', 0, NULL, pg_temp.account_id(), false
  );
  RETURN 'OK';
EXCEPTION WHEN OTHERS THEN
  RETURN split_part(SQLERRM, ':', 1);
END $$;

CREATE FUNCTION pg_temp.op_id(p_agent UUID, p_effect VARCHAR, p_amount NUMERIC) RETURNS UUID LANGUAGE sql AS $$
  SELECT register_bank_deposit_operation(
    p_agent, p_amount, CURRENT_DATE, '[]'::jsonb, jsonb_build_array(p_amount),
    pg_temp.admin_id(), pg_temp.type_id(p_effect), NULL, 0, NULL, pg_temp.account_id(), false
  )
$$;

-- Mismos pasos de reclasificación que la migración 1760006600000 (copia + reverso).
CREATE FUNCTION pg_temp.reclassify() RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
  v_movement RECORD;
BEGIN
  INSERT INTO guayacan_commissions (
    operation_id, business_date, transaction_count, commission_rate, amount,
    status, voided_at, voided_by, void_reason, legacy_movement_id, created_by, created_at
  )
  SELECT m.reference_id, m.business_date, m.transaction_count, m.commission_rate, m.amount,
         CASE WHEN o.is_voided THEN 'ANULADO' ELSE 'VIGENTE' END,
         CASE WHEN o.is_voided THEN COALESCE(o.voided_at, m.voided_at, now()) END,
         CASE WHEN o.is_voided THEN COALESCE(o.voided_by, m.voided_by, m.created_by) END,
         CASE WHEN o.is_voided THEN COALESCE(o.void_reason, m.void_reason) END,
         m.id, m.created_by, m.created_at
  FROM guayacan_cash_movements m
  JOIN bank_deposit_operations o ON o.id = m.reference_id
  WHERE m.movement_type = 'COMISION_TRANSACCION' AND m.reference_type = 'BANK_DEPOSIT'
  ON CONFLICT (operation_id) DO NOTHING;

  FOR v_movement IN
    SELECT id, amount, transaction_count, commission_rate, reference_id, created_by
    FROM guayacan_cash_movements
    WHERE movement_type = 'COMISION_TRANSACCION' AND status = 'VIGENTE'
    ORDER BY sequence
  LOOP
    UPDATE guayacan_cash_movements
    SET status = 'ANULADO', voided_at = now(), voided_by = v_movement.created_by,
        void_reason = 'Reclasificada: las comisiones no son efectivo de caja'
    WHERE id = v_movement.id;
    PERFORM apply_guayacan_cash_movement(
      'REVERSO_COMISION', -v_movement.amount, CURRENT_DATE, v_movement.created_by,
      'Reclasificación — comisión fuera del efectivo de caja',
      'Las comisiones se registran aparte (no son efectivo de caja)', NULL,
      'BANK_DEPOSIT', v_movement.reference_id, v_movement.transaction_count,
      v_movement.commission_rate, v_movement.id, NULL, NULL, true
    );
  END LOOP;
END $$;

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
  v_before NUMERIC;
  v_op UUID;
  v_id UUID;
  v_id2 UUID;
  v_req UUID := gen_random_uuid();
  v_count INT;
  v_commission RECORD;
BEGIN
  IF pg_temp.guayacan() IS NULL THEN
    RAISE EXCEPTION 'No hay banco agente marcado GUAYACAN — márcalo en Sistema → Banco Agente antes de correr esta prueba';
  END IF;
  UPDATE transaction_banks SET commission_per_transaction = 3.00 WHERE id = pg_temp.guayacan();

  -- ===== Comisiones: concepto propio, NUNCA efectivo de caja =====
  v_count := (SELECT count(*) FROM guayacan_cash_movements WHERE movement_type IN ('COMISION_TRANSACCION', 'INGRESO'));
  v_op := pg_temp.retiro(pg_temp.guayacan(), 1);
  PERFORM pg_temp.expect('C1 1 transacción = Q3.00',
    (SELECT amount::TEXT FROM guayacan_commissions WHERE operation_id = v_op), '3.00');
  v_op := pg_temp.retiro(pg_temp.guayacan(), 5);
  PERFORM pg_temp.expect('C2 5 transacciones = Q15.00',
    (SELECT amount::TEXT FROM guayacan_commissions WHERE operation_id = v_op), '15.00');
  v_op := pg_temp.retiro(pg_temp.guayacan(), 10);
  SELECT * INTO v_commission FROM guayacan_commissions WHERE operation_id = v_op;
  PERFORM pg_temp.expect('C3 10 transacciones = Q30.00', v_commission.amount::TEXT, '30.00');
  PERFORM pg_temp.expect('C3 guarda cantidad y tarifa histórica',
    v_commission.transaction_count || '×' || v_commission.commission_rate, '10×3.00');
  PERFORM pg_temp.expect('C4 las comisiones no generan movimientos de caja (ni COMISION ni INGRESO)',
    ((SELECT count(*) FROM guayacan_cash_movements WHERE movement_type IN ('COMISION_TRANSACCION', 'INGRESO')) - v_count)::TEXT, '0');
  PERFORM pg_temp.expect('C4 el efectivo de esas operaciones = solo sus depósitos (Q160), sin comisión',
    (SELECT sum(amount)::TEXT FROM guayacan_cash_movements
      WHERE reference_id IN (SELECT operation_id FROM guayacan_commissions)), '160.00');

  v_count := (SELECT count(*) FROM guayacan_commissions);
  v_op := pg_temp.retiro(pg_temp.other_agent(), 4);
  PERFORM pg_temp.expect('C5 otro banco no genera comisión',
    ((SELECT count(*) FROM guayacan_commissions) - v_count)::TEXT, '0');

  v_count := (SELECT count(*) FROM guayacan_commissions);
  PERFORM pg_temp.expect('C6 operación fallida rechazada', pg_temp.err(format(
    'SELECT register_bank_deposit_operation(%L, 100, CURRENT_DATE, ''[]'', ''[50]'', %L, %L, NULL, 0, NULL, %L, false)',
    pg_temp.guayacan(), v_admin, pg_temp.type_id('DEPOSITO'), pg_temp.account_id())), 'TRANSACTION_TOTAL_MISMATCH');
  PERFORM pg_temp.expect('C6 sin comisión ni efectivo por la fallida',
    ((SELECT count(*) FROM guayacan_commissions) - v_count)::TEXT, '0');

  PERFORM pg_temp.expect('C7 comisión duplicada imposible', pg_temp.err(format(
    'INSERT INTO guayacan_commissions (operation_id, business_date, transaction_count, commission_rate, amount, created_by) VALUES (%L, CURRENT_DATE, 10, 3, 30, %L)',
    v_commission.operation_id, v_admin)),
    'duplicate key value violates unique constraint "UQ_guayacan_commissions_operation"');

  UPDATE transaction_banks SET commission_per_transaction = 4.00 WHERE id = pg_temp.guayacan();
  PERFORM pg_temp.expect('C8 tarifa nueva no toca el histórico',
    (SELECT amount::TEXT FROM guayacan_commissions WHERE id = v_commission.id), '30.00');
  UPDATE transaction_banks SET commission_per_transaction = 3.00 WHERE id = pg_temp.guayacan();

  v_before := pg_temp.cash_balance();
  PERFORM void_bank_deposit_operation(v_commission.operation_id, CURRENT_DATE, v_admin, 'Prueba de anulación');
  PERFORM pg_temp.expect('C9 anular la operación anula su comisión (se conserva)',
    (SELECT status FROM guayacan_commissions WHERE id = v_commission.id), 'ANULADO');
  PERFORM pg_temp.expect('C9 y revierte su efectivo (Q100 del depósito, nunca la comisión)',
    (v_before - pg_temp.cash_balance())::TEXT, '100.00');
  PERFORM pg_temp.expect('C9 anular dos veces no duplica nada', pg_temp.err(format(
    'SELECT void_bank_deposit_operation(%L, CURRENT_DATE, %L, ''otra vez'')', v_commission.operation_id, v_admin)),
    'BANK_DEPOSIT_OPERATION_ALREADY_VOIDED');

  -- ===== Efectivo desde Transaccionar (solo Guayacán) =====
  v_before := pg_temp.cash_balance();
  v_op := register_bank_deposit_operation(pg_temp.guayacan(), 850, CURRENT_DATE, '[]', '[500, 350]', v_admin,
    pg_temp.type_id('DEPOSITO'), 'Cliente', 0, NULL, pg_temp.account_id(), false);
  PERFORM pg_temp.expect('T1 Depósito Guayacán: entra efectivo a la caja',
    (pg_temp.cash_balance() - v_before)::TEXT, '850.00');
  PERFORM pg_temp.expect('T1 un solo movimiento TRANSACCION_DEPOSITO ligado a la operación',
    (SELECT count(*) || ' ' || max(movement_type) FROM guayacan_cash_movements WHERE reference_id = v_op), '1 TRANSACCION_DEPOSITO');
  PERFORM pg_temp.expect('T2 no se puede duplicar el movimiento de la operación', pg_temp.err(format(
    'SELECT apply_guayacan_cash_movement(''TRANSACCION_DEPOSITO'', 850, CURRENT_DATE, %L, ''dup'', NULL, NULL, ''BANK_DEPOSIT'', %L, 2, NULL, NULL, NULL, NULL, true)',
    v_admin, v_op)), 'duplicate key value violates unique constraint "UQ_guayacan_cash_movements_transaction"');

  v_before := pg_temp.cash_balance();
  v_op := register_bank_deposit_operation(pg_temp.guayacan(), 300, CURRENT_DATE, '[]', '[300]', v_admin,
    pg_temp.type_id('RETIRO'), NULL, 0, NULL, pg_temp.account_id(), false);
  PERFORM pg_temp.expect('T3 Retiro Guayacán: sale efectivo de la caja',
    (v_before - pg_temp.cash_balance())::TEXT, '300.00');
  PERFORM pg_temp.expect('T3 tipo TRANSACCION_RETIRO',
    (SELECT movement_type FROM guayacan_cash_movements WHERE reference_id = v_op), 'TRANSACCION_RETIRO');

  -- Depósito con desglose y vuelto: entra el monto APLICADO (no el efectivo bruto).
  v_before := pg_temp.cash_balance();
  PERFORM register_bank_deposit_operation(pg_temp.guayacan(), 150, CURRENT_DATE,
    '[{"denomination":200,"quantity":1}]', '[150]', v_admin,
    pg_temp.type_id('DEPOSITO'), NULL, 50, NULL, pg_temp.account_id(), true);
  PERFORM pg_temp.expect('T4 con vuelto entra el neto (Q150)', (pg_temp.cash_balance() - v_before)::TEXT, '150.00');

  v_count := (SELECT count(*) FROM guayacan_cash_movements);
  PERFORM pg_temp.op(pg_temp.other_agent(), 'DEPOSITO', 40);
  PERFORM pg_temp.op(pg_temp.other_agent(), 'RETIRO', 40);
  PERFORM pg_temp.expect('T5 otros bancos no tocan la caja Guayacán',
    ((SELECT count(*) FROM guayacan_cash_movements) - v_count)::TEXT, '0');

  -- Un Retiro de Transaccionar por más del efectivo en caja se rechaza (y no deja rastro).
  v_before := pg_temp.cash_balance();
  v_count := (SELECT count(*) FROM bank_deposit_operations);
  PERFORM pg_temp.expect('T6 Retiro mayor que la caja rechazado',
    pg_temp.op(pg_temp.guayacan(), 'RETIRO', v_before + 100), 'CASH_BOX_INSUFFICIENT_BALANCE');
  PERFORM pg_temp.expect('T6 ni operación ni movimiento',
    ((SELECT count(*) FROM bank_deposit_operations) - v_count)::TEXT || '/' || (pg_temp.cash_balance() - v_before)::TEXT, '0/0.00');

  -- ===== Reclasificación de comisiones antiguas (simula datos previos) =====
  v_op := pg_temp.op_id(pg_temp.guayacan(), 'DEPOSITO', 20);
  DELETE FROM guayacan_commissions WHERE operation_id = v_op;  -- solo dentro de esta prueba (ROLLBACK)
  v_id := apply_guayacan_cash_movement('COMISION_TRANSACCION', 3, CURRENT_DATE, v_admin, 'Comisión antigua',
    NULL, NULL, 'BANK_DEPOSIT', v_op, 1, 3, NULL, NULL, NULL, true);
  v_before := pg_temp.cash_balance();
  PERFORM pg_temp.reclassify();
  PERFORM pg_temp.expect('R1 comisión antigua copiada a guayacan_commissions',
    (SELECT amount || ' ' || status FROM guayacan_commissions WHERE operation_id = v_op), '3.00 VIGENTE');
  PERFORM pg_temp.expect('R2 movimiento original conservado como ANULADO',
    (SELECT status FROM guayacan_cash_movements WHERE id = v_id), 'ANULADO');
  PERFORM pg_temp.expect('R3 reverso ligado y el efectivo baja Q3.00',
    (SELECT movement_type FROM guayacan_cash_movements WHERE reversal_of_id = v_id) || ' ' ||
    (v_before - pg_temp.cash_balance())::TEXT, 'REVERSO_COMISION 3.00');
  PERFORM pg_temp.reclassify();
  PERFORM pg_temp.expect('R4 reclasificar otra vez no duplica',
    (SELECT count(*) FROM guayacan_cash_movements WHERE reversal_of_id = v_id)::TEXT, '1');

  -- ===== Guayacán no mueve ninguna cuenta bancaria: su saldo es la caja =====
  -- (migración 1760006700000). Se fondea la caja para los retiros.
  PERFORM register_guayacan_cash_movement('INGRESO', 1000, CURRENT_DATE, v_admin, 'Fondo para pruebas S', NULL, NULL, NULL, NULL);
  v_before := pg_temp.balance(pg_temp.account_id());
  v_count := (SELECT count(*) FROM bank_account_movements);
  PERFORM pg_temp.expect('S1 Depósito Guayacán', pg_temp.op(pg_temp.guayacan(), 'DEPOSITO', 200), 'OK');
  PERFORM pg_temp.expect('S2 Retiro Guayacán', pg_temp.op(pg_temp.guayacan(), 'RETIRO', 50), 'OK');
  PERFORM pg_temp.expect('S3 la cuenta bancaria elegida no se mueve',
    (pg_temp.balance(pg_temp.account_id()) - v_before)::TEXT, '0.00');
  PERFORM pg_temp.expect('S3 ningún movimiento bancario nuevo por Guayacán',
    ((SELECT count(*) FROM bank_account_movements) - v_count)::TEXT, '0');
  PERFORM pg_temp.expect('S4 Retiro Guayacán sin efectivo suficiente en caja',
    pg_temp.op(pg_temp.guayacan(), 'RETIRO', pg_temp.cash_balance() + 1), 'CASH_BOX_INSUFFICIENT_BALANCE');
  v_before := pg_temp.balance(pg_temp.account_id());
  PERFORM pg_temp.expect('S5 Retiro de otro banco', pg_temp.op(pg_temp.other_agent(), 'RETIRO', 70), 'OK');
  PERFORM pg_temp.expect('S5 otros bancos sin cambio: el Retiro SUMA',
    (pg_temp.balance(pg_temp.account_id()) - v_before)::TEXT, '70.00');
  v_before := pg_temp.balance(pg_temp.account_id());
  PERFORM pg_temp.expect('S6 Depósito de otro banco', pg_temp.op(pg_temp.other_agent(), 'DEPOSITO', 30), 'OK');
  PERFORM pg_temp.expect('S6 otros bancos sin cambio: el Depósito RESTA',
    (v_before - pg_temp.balance(pg_temp.account_id()))::TEXT, '30.00');

  -- ===== Kardex manual =====
  v_before := pg_temp.cash_balance();
  v_id := register_guayacan_cash_movement('INGRESO', 500, CURRENT_DATE, v_admin, 'Fondo de caja', 'Apertura', NULL, NULL, NULL);
  PERFORM pg_temp.expect('K1 ingreso Q500 guarda saldo anterior/nuevo',
    (SELECT balance_before::TEXT || '→' || balance_after::TEXT FROM guayacan_cash_movements WHERE id = v_id),
    v_before::NUMERIC(14,2)::TEXT || '→' || (v_before + 500)::NUMERIC(14,2)::TEXT);

  v_before := pg_temp.cash_balance();
  v_id := register_guayacan_cash_movement('EGRESO', 300, CURRENT_DATE, v_admin, 'Retiro de efectivo', 'Depósito al banco', NULL, NULL, NULL);
  PERFORM pg_temp.expect('K2 egreso Q300 resta', (v_before - pg_temp.cash_balance())::TEXT, '300.00');

  PERFORM pg_temp.expect('K3 egreso mayor al saldo', pg_temp.err(format(
    'SELECT register_guayacan_cash_movement(''EGRESO'', %s, CURRENT_DATE, %L, ''x'', NULL, NULL, NULL, NULL)',
    pg_temp.cash_balance() + 0.01, v_admin)), 'CASH_BOX_INSUFFICIENT_BALANCE');
  PERFORM pg_temp.expect('K4 importe cero', pg_temp.err(format(
    'SELECT register_guayacan_cash_movement(''INGRESO'', 0, CURRENT_DATE, %L, ''x'', NULL, NULL, NULL, NULL)', v_admin)),
    'INVALID_CASH_MOVEMENT_AMOUNT');
  PERFORM pg_temp.expect('K4 importe negativo', pg_temp.err(format(
    'SELECT register_guayacan_cash_movement(''EGRESO'', -5, CURRENT_DATE, %L, ''x'', NULL, NULL, NULL, NULL)', v_admin)),
    'INVALID_CASH_MOVEMENT_AMOUNT');

  -- Doble clic: mismo client_request_id → mismo movimiento, una sola fila.
  v_id := register_guayacan_cash_movement('INGRESO', 50, CURRENT_DATE, v_admin, 'Doble clic', NULL, NULL, NULL, v_req);
  v_id2 := register_guayacan_cash_movement('INGRESO', 50, CURRENT_DATE, v_admin, 'Doble clic', NULL, NULL, NULL, v_req);
  PERFORM pg_temp.expect('K5 doble registro devuelve el mismo id', (v_id = v_id2)::TEXT, 'true');
  PERFORM pg_temp.expect('K5 una sola fila',
    (SELECT count(*) FROM guayacan_cash_movements WHERE client_request_id = v_req)::TEXT, '1');

  -- Desglose por denominaciones.
  v_id := register_guayacan_cash_movement('INGRESO', 250.50, CURRENT_DATE, v_admin, 'Con desglose', NULL, NULL,
    '[{"denomination":200,"quantity":1},{"denomination":50,"quantity":1},{"denomination":0.5,"quantity":1}]', NULL);
  PERFORM pg_temp.expect('K6 desglose guardado',
    (SELECT sum(subtotal)::TEXT FROM guayacan_cash_movement_details WHERE movement_id = v_id), '250.50');
  PERFORM pg_temp.expect('K6 desglose que no cuadra', pg_temp.err(format(
    'SELECT register_guayacan_cash_movement(''INGRESO'', 100, CURRENT_DATE, %L, ''x'', NULL, NULL, ''[{"denomination":50,"quantity":1}]'', NULL)', v_admin)),
    'CASH_BREAKDOWN_MISMATCH');
  PERFORM pg_temp.expect('K6 denominación inexistente', pg_temp.err(format(
    'SELECT register_guayacan_cash_movement(''INGRESO'', 3, CURRENT_DATE, %L, ''x'', NULL, NULL, ''[{"denomination":3,"quantity":1}]'', NULL)', v_admin)),
    'INVALID_CASH_DENOMINATION');

  -- Ajuste: motivo obligatorio; puede ser negativo.
  PERFORM pg_temp.expect('K7 ajuste sin motivo', pg_temp.err(format(
    'SELECT register_guayacan_cash_movement(''AJUSTE'', -1, CURRENT_DATE, %L, ''Ajuste'', NULL, NULL, NULL, NULL)', v_admin)),
    'CASH_MOVEMENT_REASON_REQUIRED');
  v_before := pg_temp.cash_balance();
  PERFORM register_guayacan_cash_movement('AJUSTE', -0.50, CURRENT_DATE, v_admin, 'Ajuste por arqueo', 'Faltante en conteo físico', NULL, NULL, NULL);
  PERFORM pg_temp.expect('K7 ajuste autorizado aplicado', (v_before - pg_temp.cash_balance())::TEXT, '0.50');

  -- Anular un ingreso: ANULACION inversa, original conservado.
  v_id := register_guayacan_cash_movement('INGRESO', 75, CURRENT_DATE, v_admin, 'Ingreso erróneo', NULL, NULL, NULL, NULL);
  v_before := pg_temp.cash_balance();
  v_id2 := void_guayacan_cash_movement(v_id, CURRENT_DATE, v_admin, 'Registrado por error');
  PERFORM pg_temp.expect('K8 anulación inversa',
    (SELECT movement_type || ' ' || amount FROM guayacan_cash_movements WHERE id = v_id2), 'ANULACION -75.00');
  PERFORM pg_temp.expect('K8 original conservado como ANULADO',
    (SELECT status FROM guayacan_cash_movements WHERE id = v_id), 'ANULADO');
  PERFORM pg_temp.expect('K8 saldo vuelve', (v_before - pg_temp.cash_balance())::TEXT, '75.00');
  PERFORM pg_temp.expect('K9 no se anula dos veces', pg_temp.err(format(
    'SELECT void_guayacan_cash_movement(%L, CURRENT_DATE, %L, ''otra vez'')', v_id, v_admin)), 'CASH_MOVEMENT_ALREADY_VOIDED');
  PERFORM pg_temp.expect('K9 un movimiento de Transaccionar no se anula desde la caja', pg_temp.err(format(
    'SELECT void_guayacan_cash_movement(%L, CURRENT_DATE, %L, ''manual'')',
    (SELECT id FROM guayacan_cash_movements WHERE movement_type = 'TRANSACCION_DEPOSITO' AND status = 'VIGENTE' LIMIT 1), v_admin)),
    'CASH_MOVEMENT_NOT_VOIDABLE');

  -- ===== Integridad =====
  PERFORM pg_temp.expect('I1 saldo = suma de movimientos',
    (pg_temp.cash_balance() = (SELECT sum(amount) FROM guayacan_cash_movements))::TEXT, 'true');
  PERFORM pg_temp.expect('I2 cadena saldo anterior = saldo posterior previo',
    (SELECT count(*)::TEXT FROM (
       SELECT balance_before, lag(balance_after, 1, 0::NUMERIC) OVER (ORDER BY sequence) AS prev
       FROM guayacan_cash_movements) t WHERE balance_before <> prev), '0');
  PERFORM pg_temp.expect('I3 ninguna comisión vigente suma al efectivo',
    (SELECT count(*)::TEXT FROM guayacan_cash_movements WHERE movement_type = 'COMISION_TRANSACCION' AND status = 'VIGENTE'), '0');
  PERFORM pg_temp.expect('I4 cada comisión y cada efectivo de Transaccionar ligado a una operación Guayacán',
    (SELECT count(*)::TEXT FROM (
       SELECT operation_id AS op FROM guayacan_commissions
       UNION ALL
       SELECT reference_id FROM guayacan_cash_movements WHERE movement_type IN ('TRANSACCION_DEPOSITO', 'TRANSACCION_RETIRO')
     ) x
     LEFT JOIN bank_deposit_operations o ON o.id = x.op
     LEFT JOIN transaction_banks t ON t.id = o.transaction_bank_id
     WHERE o.id IS NULL OR t.cash_box_code IS DISTINCT FROM 'GUAYACAN'), '0');
END $$;

ROLLBACK;
