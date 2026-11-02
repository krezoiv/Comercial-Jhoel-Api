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

CREATE FUNCTION pg_temp.retiro_type() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_types WHERE balance_effect = 'RETIRO' AND is_active ORDER BY created_at LIMIT 1
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

-- Retiro (suma saldo bancario, nunca falla por saldo) con N transacciones de Q10.
CREATE FUNCTION pg_temp.retiro(p_agent UUID, p_count INT) RETURNS UUID LANGUAGE plpgsql AS $$
BEGIN
  RETURN register_bank_deposit_operation(
    p_agent, p_count * 10, CURRENT_DATE, '[]'::jsonb,
    (SELECT jsonb_agg(10) FROM generate_series(1, p_count)),
    pg_temp.admin_id(), pg_temp.retiro_type(), 'Prueba Guayacán', 0, NULL, pg_temp.account_id(), false
  );
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

  -- ===== Comisiones =====
  v_before := pg_temp.cash_balance();
  v_op := pg_temp.retiro(pg_temp.guayacan(), 1);
  PERFORM pg_temp.expect('C1 1 transacción = Q3.00',
    (SELECT amount::TEXT FROM guayacan_cash_movements WHERE reference_id = v_op AND movement_type = 'COMISION_TRANSACCION'), '3.00');
  PERFORM pg_temp.expect('C1 la caja sube Q3.00', (pg_temp.cash_balance() - v_before)::TEXT, '3.00');

  v_op := pg_temp.retiro(pg_temp.guayacan(), 5);
  PERFORM pg_temp.expect('C2 5 transacciones = Q15.00',
    (SELECT amount::TEXT FROM guayacan_cash_movements WHERE reference_id = v_op AND movement_type = 'COMISION_TRANSACCION'), '15.00');

  v_op := pg_temp.retiro(pg_temp.guayacan(), 10);
  SELECT * INTO v_commission FROM guayacan_cash_movements WHERE reference_id = v_op AND movement_type = 'COMISION_TRANSACCION';
  PERFORM pg_temp.expect('C3 10 transacciones = Q30.00', v_commission.amount::TEXT, '30.00');
  PERFORM pg_temp.expect('C3 guarda cantidad y tarifa histórica',
    v_commission.transaction_count || '×' || v_commission.commission_rate, '10×3.00');

  -- Otro banco agente: ninguna comisión.
  v_count := (SELECT count(*) FROM guayacan_cash_movements);
  v_op := pg_temp.retiro(pg_temp.other_agent(), 4);
  PERFORM pg_temp.expect('C4 otro banco no genera comisión',
    ((SELECT count(*) FROM guayacan_cash_movements) - v_count)::TEXT, '0');

  -- Operación fallida (distribución no cuadra): ni operación ni comisión.
  v_count := (SELECT count(*) FROM guayacan_cash_movements);
  PERFORM pg_temp.expect('C5 operación fallida rechazada', pg_temp.err(format(
    'SELECT register_bank_deposit_operation(%L, 100, CURRENT_DATE, ''[]'', ''[50]'', %L, %L, NULL, 0, NULL, %L, false)',
    pg_temp.guayacan(), v_admin, pg_temp.retiro_type(), pg_temp.account_id())), 'TRANSACTION_TOTAL_MISMATCH');
  PERFORM pg_temp.expect('C5 sin comisión por la fallida',
    ((SELECT count(*) FROM guayacan_cash_movements) - v_count)::TEXT, '0');

  -- No duplicar: una segunda comisión para la misma operación viola el índice único.
  PERFORM pg_temp.expect('C6 comisión duplicada imposible', pg_temp.err(format(
    'SELECT apply_guayacan_cash_movement(''COMISION_TRANSACCION'', 30, CURRENT_DATE, %L, ''dup'', NULL, NULL, ''BANK_DEPOSIT'', %L, 10, 3, NULL, NULL, NULL, true)',
    v_admin, (SELECT reference_id FROM guayacan_cash_movements WHERE id = v_commission.id))),
    'duplicate key value violates unique constraint "UQ_guayacan_cash_movements_commission"');

  -- Cambiar la tarifa no altera comisiones históricas.
  UPDATE transaction_banks SET commission_per_transaction = 4.00 WHERE id = pg_temp.guayacan();
  PERFORM pg_temp.expect('C7 tarifa nueva no toca el histórico',
    (SELECT amount::TEXT FROM guayacan_cash_movements WHERE id = v_commission.id), '30.00');
  UPDATE transaction_banks SET commission_per_transaction = 3.00 WHERE id = pg_temp.guayacan();

  -- Anular la operación: reverso independiente, original ANULADO, nada borrado.
  v_before := pg_temp.cash_balance();
  PERFORM void_bank_deposit_operation(v_commission.reference_id, CURRENT_DATE, v_admin, 'Prueba de anulación');
  PERFORM pg_temp.expect('C8 comisión original queda ANULADO',
    (SELECT status FROM guayacan_cash_movements WHERE id = v_commission.id), 'ANULADO');
  PERFORM pg_temp.expect('C8 reverso de -Q30.00 ligado a la comisión',
    (SELECT amount::TEXT FROM guayacan_cash_movements WHERE reversal_of_id = v_commission.id AND movement_type = 'REVERSO_COMISION'), '-30.00');
  PERFORM pg_temp.expect('C8 la caja baja Q30.00', (v_before - pg_temp.cash_balance())::TEXT, '30.00');
  PERFORM pg_temp.expect('C8 anular dos veces no duplica el reverso', pg_temp.err(format(
    'SELECT void_bank_deposit_operation(%L, CURRENT_DATE, %L, ''otra vez'')', v_commission.reference_id, v_admin)),
    'BANK_DEPOSIT_OPERATION_ALREADY_VOIDED');

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
  PERFORM pg_temp.expect('K9 comisión no se anula a mano', pg_temp.err(format(
    'SELECT void_guayacan_cash_movement(%L, CURRENT_DATE, %L, ''manual'')',
    (SELECT id FROM guayacan_cash_movements WHERE movement_type = 'COMISION_TRANSACCION' AND status = 'VIGENTE' LIMIT 1), v_admin)),
    'CASH_MOVEMENT_NOT_VOIDABLE');

  -- ===== Integridad =====
  PERFORM pg_temp.expect('I1 saldo = suma de movimientos',
    (pg_temp.cash_balance() = (SELECT sum(amount) FROM guayacan_cash_movements))::TEXT, 'true');
  PERFORM pg_temp.expect('I2 cadena saldo anterior = saldo posterior previo',
    (SELECT count(*)::TEXT FROM (
       SELECT balance_before, lag(balance_after, 1, 0::NUMERIC) OVER (ORDER BY sequence) AS prev
       FROM guayacan_cash_movements) t WHERE balance_before <> prev), '0');
  PERFORM pg_temp.expect('I3 comisiones vigentes = comisiones − reversos',
    ((SELECT sum(amount) FROM guayacan_cash_movements WHERE movement_type = 'COMISION_TRANSACCION' AND status = 'VIGENTE')
      = (SELECT sum(amount) FROM guayacan_cash_movements WHERE movement_type IN ('COMISION_TRANSACCION', 'REVERSO_COMISION')))::TEXT,
    'true');
  PERFORM pg_temp.expect('I4 cada comisión ligada a una operación Guayacán',
    (SELECT count(*)::TEXT FROM guayacan_cash_movements m
       LEFT JOIN bank_deposit_operations o ON o.id = m.reference_id
       LEFT JOIN transaction_banks t ON t.id = o.transaction_bank_id
      WHERE m.movement_type = 'COMISION_TRANSACCION' AND (o.id IS NULL OR t.cash_box_code IS DISTINCT FROM 'GUAYACAN')), '0');
END $$;

ROLLBACK;
