-- Cuentas por Cobrar → cancelación individual / múltiple en efectivo o depósito bancario
-- (migración 1760007000000-AccountsReceivableSettlements).
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK: no deja ningún dato.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/ar-settlements.test.sql

BEGIN;

CREATE FUNCTION pg_temp.admin_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name IN ('SUPER_ADMIN', 'ADMIN') ORDER BY u.created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.account() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM banks WHERE is_active AND special_account IS NULL ORDER BY created_at LIMIT 1
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

CREATE FUNCTION pg_temp.charge(p_client UUID, p_amount NUMERIC, p_text VARCHAR) RETURNS UUID LANGUAGE sql AS $$
  SELECT register_account_receivable_movement(p_client, 'CARGO', p_amount, CURRENT_DATE, p_text, pg_temp.admin_id())
$$;

CREATE FUNCTION pg_temp.pending(p_charge UUID) RETURNS TEXT LANGUAGE sql AS $$
  SELECT pending::TEXT FROM ar_charge_balances(ARRAY[(SELECT client_id FROM accounts_receivable WHERE id = p_charge)])
  WHERE charge_id = p_charge
$$;

CREATE FUNCTION pg_temp.client_balance(p_client UUID) RETURNS NUMERIC LANGUAGE sql AS $$
  SELECT COALESCE(sum(CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END), 0)
  FROM accounts_receivable WHERE client_id = p_client AND is_active
$$;

DO $$
DECLARE
  v_admin UUID := pg_temp.admin_id();
  v_bank UUID := pg_temp.account();
  v_a UUID;          -- cliente A
  v_b UUID;          -- cliente B
  v_c1 UUID; v_c2 UUID; v_c3 UUID; v_c4 UUID; v_c5 UUID; v_cb UUID;
  v_op UUID; v_op2 UUID; v_op_bank UUID;
  v_cash NUMERIC;
  v_bank_balance NUMERIC;
  v_row account_receivable_payment_operations;
BEGIN
  INSERT INTO clients (name, created_by) VALUES ('Cliente prueba A', v_admin) RETURNING id INTO v_a;
  INSERT INTO clients (name, created_by) VALUES ('Cliente prueba B', v_admin) RETURNING id INTO v_b;

  -- La caja necesita saldo para que los cargos (gasto por cobrar, OUT) no la dejen negativa.
  PERFORM apply_cash_movement('ENTRADA_MANUAL', 'IN', 100000, v_admin, 'Fondo de prueba', NULL, NULL, NULL, NULL, NULL, 'TEST:FONDO');

  v_c1 := pg_temp.charge(v_a, 500, 'Venta de productos');
  v_c2 := pg_temp.charge(v_a, 1000, 'Servicio');
  v_c3 := pg_temp.charge(v_a, 750, 'Venta de accesorios');
  v_cb := pg_temp.charge(v_b, 300, 'Cargo de otro cliente');

  PERFORM pg_temp.expect('S1 pendiente inicial = monto', pg_temp.pending(v_c2), '1000.00');

  -- Validaciones
  PERFORM pg_temp.expect('S2 clientes distintos rechazados',
    pg_temp.err(format('SELECT settle_accounts_receivable(%L, %L, %L, NULL, NULL, NULL, NULL, %L, %L)',
      v_a, jsonb_build_array(jsonb_build_object('id', v_c1), jsonb_build_object('id', v_cb)), 'EFECTIVO', v_admin, 'T:1')),
    'AR_SETTLEMENT_MIXED_CLIENTS');
  PERFORM pg_temp.expect('S3 total distinto al calculado rechazado',
    pg_temp.err(format('SELECT settle_accounts_receivable(%L, %L, %L, NULL, NULL, NULL, 999, %L, %L)',
      v_a, jsonb_build_array(jsonb_build_object('id', v_c1)), 'EFECTIVO', v_admin, 'T:2')),
    'AR_SETTLEMENT_TOTAL_MISMATCH');
  PERFORM pg_temp.expect('S4 abono parcial en cancelación múltiple rechazado',
    pg_temp.err(format('SELECT settle_accounts_receivable(%L, %L, %L, NULL, NULL, NULL, NULL, %L, %L)',
      v_a, jsonb_build_array(jsonb_build_object('id', v_c1, 'amount', 100), jsonb_build_object('id', v_c2)), 'EFECTIVO', v_admin, 'T:3')),
    'AR_SETTLEMENT_PARTIAL_NOT_ALLOWED');
  PERFORM pg_temp.expect('S5 monto mayor al pendiente rechazado',
    pg_temp.err(format('SELECT settle_accounts_receivable(%L, %L, %L, NULL, NULL, NULL, NULL, %L, %L)',
      v_a, jsonb_build_array(jsonb_build_object('id', v_c1, 'amount', 501)), 'EFECTIVO', v_admin, 'T:4')),
    'AR_SETTLEMENT_AMOUNT_EXCEEDS_PENDING');
  PERFORM pg_temp.expect('S6 depósito sin banco rechazado',
    pg_temp.err(format('SELECT settle_accounts_receivable(%L, %L, %L, NULL, NULL, NULL, NULL, %L, %L)',
      v_a, jsonb_build_array(jsonb_build_object('id', v_c1)), 'DEPOSITO_BANCARIO', v_admin, 'T:5')),
    'AR_SETTLEMENT_BANK_REQUIRED');
  PERFORM pg_temp.expect('S7 cuenta repetida rechazada',
    pg_temp.err(format('SELECT settle_accounts_receivable(%L, %L, %L, NULL, NULL, NULL, NULL, %L, %L)',
      v_a, jsonb_build_array(jsonb_build_object('id', v_c1), jsonb_build_object('id', v_c1)), 'EFECTIVO', v_admin, 'T:6')),
    'AR_SETTLEMENT_DUPLICATE_ITEM');
  PERFORM pg_temp.expect('S8 un rechazo no deja nada aplicado',
    (SELECT count(*) FROM account_receivable_payment_operations WHERE client_id = v_a)::TEXT, '0');

  -- Cancelación múltiple en efectivo (ejemplo del requerimiento: Q2,250).
  v_cash := cash_balance();
  v_op := settle_accounts_receivable(v_a,
    jsonb_build_array(jsonb_build_object('id', v_c1), jsonb_build_object('id', v_c2), jsonb_build_object('id', v_c3)),
    'EFECTIVO', NULL, NULL, 'Pago completo', 2250, v_admin, 'T:CASH');
  SELECT * INTO v_row FROM account_receivable_payment_operations WHERE id = v_op;
  PERFORM pg_temp.expect('M1 total consolidado', v_row.total_amount::TEXT || '/' || v_row.accounts_count, '2250.00/3');
  PERFORM pg_temp.expect('M2 efectivo aumenta exactamente el total', cash_balance()::TEXT, (v_cash + 2250)::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('M3 un solo movimiento de caja, ligado a la operación',
    (SELECT count(*) || '/' || min(movement_type) || '/' || min(direction) FROM cash_movements
     WHERE reference_type = 'ACCOUNT_RECEIVABLE' AND reference_id = v_row.abono_id),
    '1/ABONO_POR_COBRAR/IN');
  PERFORM pg_temp.expect('M3 cash_movement_id guardado', (v_row.cash_movement_id IS NOT NULL)::TEXT, 'true');
  PERFORM pg_temp.expect('M4 un pago por cuenta',
    (SELECT count(*) || ':' || sum(amount_paid) FROM account_receivable_payment_details WHERE payment_operation_id = v_op), '3:2250.00');
  PERFORM pg_temp.expect('M5 cada cuenta queda en 0',
    pg_temp.pending(v_c1) || '/' || pg_temp.pending(v_c2) || '/' || pg_temp.pending(v_c3), '0.00/0.00/0.00');
  PERFORM pg_temp.expect('M6 saldo del cliente = 0', pg_temp.client_balance(v_a)::TEXT, '0.00');
  PERFORM pg_temp.expect('M7 no toca bancos', (v_row.bank_movement_id IS NULL)::TEXT, 'true');
  PERFORM pg_temp.expect('M8 ya canceladas rechazadas',
    pg_temp.err(format('SELECT settle_accounts_receivable(%L, %L, %L, NULL, NULL, NULL, NULL, %L, %L)',
      v_a, jsonb_build_array(jsonb_build_object('id', v_c1)), 'EFECTIVO', v_admin, 'T:7')),
    'AR_SETTLEMENT_ALREADY_SETTLED');

  -- Idempotencia
  v_op2 := settle_accounts_receivable(v_a,
    jsonb_build_array(jsonb_build_object('id', v_c1), jsonb_build_object('id', v_c2), jsonb_build_object('id', v_c3)),
    'EFECTIVO', NULL, NULL, 'Pago completo', 2250, v_admin, 'T:CASH');
  PERFORM pg_temp.expect('I1 reintento devuelve la misma operación', v_op2::TEXT, v_op::TEXT);
  PERFORM pg_temp.expect('I2 sin duplicar efectivo', cash_balance()::TEXT, (v_cash + 2250)::NUMERIC(14,2)::TEXT);

  -- Protección de las filas con pagos
  PERFORM pg_temp.expect('G1 no se desactiva el ABONO de la operación',
    pg_temp.err(format('UPDATE accounts_receivable SET is_active = false WHERE id = %L', v_row.abono_id)), 'AR_PAYMENT_ROW_LOCKED');
  PERFORM pg_temp.expect('G2 no se desactiva un cargo con pagos',
    pg_temp.err(format('UPDATE accounts_receivable SET is_active = false WHERE id = %L', v_c2)), 'AR_CHARGE_HAS_PAYMENTS');
  PERFORM pg_temp.expect('G3 la descripción sí se puede editar',
    pg_temp.err(format('UPDATE accounts_receivable SET description = %L WHERE id = %L', 'Servicio técnico', v_c2)), 'OK');

  -- Anulación (efectivo)
  v_cash := cash_balance();
  PERFORM void_account_receivable_payment(v_op, v_admin, 'Pago registrado por error');
  PERFORM pg_temp.expect('V1 anular retira el efectivo', cash_balance()::TEXT, (v_cash - 2250)::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('V2 las cuentas vuelven a estar pendientes',
    pg_temp.pending(v_c1) || '/' || pg_temp.pending(v_c2) || '/' || pg_temp.pending(v_c3), '500.00/1000.00/750.00');
  PERFORM pg_temp.expect('V3 operación ANULADA, historial intacto',
    (SELECT status FROM account_receivable_payment_operations WHERE id = v_op) || '/' ||
    (SELECT count(*) FROM account_receivable_payment_details WHERE payment_operation_id = v_op), 'ANULADO/3');
  PERFORM pg_temp.expect('V4 doble anulación rechazada',
    pg_temp.err(format('SELECT void_account_receivable_payment(%L, %L, %L)', v_op, v_admin, 'Otra vez')), 'AR_SETTLEMENT_ALREADY_VOIDED');

  -- Depósito bancario: el banco sube, el efectivo NO cambia.
  v_cash := cash_balance();
  v_bank_balance := (SELECT final_balance FROM banks WHERE id = v_bank);
  v_op_bank := settle_accounts_receivable(v_a,
    jsonb_build_array(jsonb_build_object('id', v_c1), jsonb_build_object('id', v_c2), jsonb_build_object('id', v_c3)),
    'DEPOSITO_BANCARIO', v_bank, 'BOL-12345', NULL, 2250, v_admin, 'T:BANK');
  SELECT * INTO v_row FROM account_receivable_payment_operations WHERE id = v_op_bank;
  PERFORM pg_temp.expect('B1 efectivo sin cambio', cash_balance()::TEXT, v_cash::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('B2 sin movimiento de caja para el ABONO',
    (SELECT count(*) FROM cash_movements WHERE reference_type = 'ACCOUNT_RECEIVABLE' AND reference_id = v_row.abono_id)::TEXT, '0');
  PERFORM pg_temp.expect('B3 banco aumenta', (SELECT final_balance FROM banks WHERE id = v_bank)::TEXT,
    (v_bank_balance + 2250)::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('B4 movimiento bancario con referencia',
    (SELECT movement_type || '/' || origin || '/' || reference_text FROM bank_account_movements WHERE id = v_row.bank_movement_id),
    'COBRO_CXC/CUENTAS_POR_COBRAR/BOL-12345');
  PERFORM pg_temp.expect('B5 referencia en la operación', v_row.reference_number, 'BOL-12345');
  PERFORM pg_temp.expect('B6 cuentas canceladas', pg_temp.client_balance(v_a)::TEXT, '0.00');
  PERFORM void_account_receivable_payment(v_op_bank, v_admin, 'Depósito rebotado');
  PERFORM pg_temp.expect('B7 anular revierte el banco', (SELECT final_balance FROM banks WHERE id = v_bank)::TEXT,
    v_bank_balance::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('B7 anular no toca el efectivo', cash_balance()::TEXT, v_cash::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('B8 efectivo sin referencia/banco rechazado',
    pg_temp.err(format('SELECT settle_accounts_receivable(%L, %L, %L, %L, NULL, NULL, NULL, %L, %L)',
      v_a, jsonb_build_array(jsonb_build_object('id', v_c1)), 'EFECTIVO', v_bank, v_admin, 'T:8')),
    'AR_SETTLEMENT_BANK_NOT_ALLOWED');

  -- Abono parcial (cancelación individual)
  v_op := settle_accounts_receivable(v_a, jsonb_build_array(jsonb_build_object('id', v_c2, 'amount', 400)),
    'EFECTIVO', NULL, NULL, NULL, 400, v_admin, 'T:PARTIAL');
  PERFORM pg_temp.expect('P1 pendiente tras abono parcial', pg_temp.pending(v_c2), '600.00');
  PERFORM pg_temp.expect('P2 saldo anterior/posterior del detalle',
    (SELECT previous_balance || '→' || new_balance FROM account_receivable_payment_details WHERE payment_operation_id = v_op),
    '1000.00→600.00');
  PERFORM pg_temp.expect('P3 no se puede bajar el cargo por debajo de lo pagado',
    pg_temp.err(format('UPDATE accounts_receivable SET amount = 300 WHERE id = %L', v_c2)), 'AR_CHARGE_HAS_PAYMENTS');

  -- Abonos generales ("Registrar Abono") se aplican FIFO: la suma de pendientes = saldo del cliente.
  PERFORM register_account_receivable_movement(v_a, 'ABONO', 700, CURRENT_DATE, 'Abono general', v_admin);
  PERFORM pg_temp.expect('F1 FIFO cubre el cargo más antiguo y parte del siguiente',
    pg_temp.pending(v_c1) || '/' || pg_temp.pending(v_c2) || '/' || pg_temp.pending(v_c3), '0.00/400.00/750.00');
  PERFORM pg_temp.expect('F2 suma de pendientes = saldo del cliente',
    (SELECT sum(pending) FROM ar_charge_balances(ARRAY[v_a]))::TEXT, pg_temp.client_balance(v_a)::TEXT);
  PERFORM pg_temp.expect('F3 una cuenta cubierta por abono general no se puede cancelar',
    pg_temp.err(format('SELECT settle_accounts_receivable(%L, %L, %L, NULL, NULL, NULL, NULL, %L, %L)',
      v_a, jsonb_build_array(jsonb_build_object('id', v_c1)), 'EFECTIVO', v_admin, 'T:9')),
    'AR_SETTLEMENT_ALREADY_SETTLED');

  -- Atomicidad: un fallo bancario (cuenta inactiva) no deja cuentas a medias.
  v_c4 := pg_temp.charge(v_a, 100, 'Cargo atomicidad 1');
  v_c5 := pg_temp.charge(v_a, 200, 'Cargo atomicidad 2');
  UPDATE banks SET is_active = false WHERE id = v_bank;
  PERFORM pg_temp.expect('A1 cuenta inactiva rechazada',
    pg_temp.err(format('SELECT settle_accounts_receivable(%L, %L, %L, %L, NULL, NULL, NULL, %L, %L)',
      v_a, jsonb_build_array(jsonb_build_object('id', v_c4), jsonb_build_object('id', v_c5)), 'DEPOSITO_BANCARIO', v_bank, v_admin, 'T:10')),
    'AR_SETTLEMENT_INVALID_BANK');
  UPDATE banks SET is_active = true WHERE id = v_bank;
  PERFORM pg_temp.expect('A2 ninguna cuenta quedó pagada', pg_temp.pending(v_c4) || '/' || pg_temp.pending(v_c5), '100.00/200.00');
  PERFORM pg_temp.expect('A3 ninguna operación quedó registrada',
    (SELECT count(*) FROM account_receivable_payment_operations WHERE idempotency_key = 'T:10')::TEXT, '0');

  RAISE NOTICE 'Cancelación de cuentas por cobrar: todas las pruebas pasaron.';
END $$;

ROLLBACK;
