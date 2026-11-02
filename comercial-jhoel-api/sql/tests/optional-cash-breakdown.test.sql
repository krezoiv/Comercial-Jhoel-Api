-- Pruebas de negocio del desglose de efectivo OPCIONAL en Transaccionar
-- (migración 1760006200000-OptionalCashBreakdownInTransaccionar). Todo corre
-- dentro de una transacción que SIEMPRE termina en ROLLBACK: no deja ningún dato.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/optional-cash-breakdown.test.sql

BEGIN;

CREATE FUNCTION pg_temp.admin_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name IN ('SUPER_ADMIN', 'ADMIN') ORDER BY u.created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.type_id(p_effect VARCHAR) RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_types WHERE balance_effect = p_effect AND is_active ORDER BY created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.agent_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_banks WHERE is_active ORDER BY created_at LIMIT 1
$$;

-- Cuenta normal habilitada en Transaccionar, sin límite.
CREATE FUNCTION pg_temp.account_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM banks
  WHERE is_active AND special_account IS NULL AND available_in_transaccionar AND max_balance IS NULL
  ORDER BY created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.balance(p_bank UUID) RETURNS NUMERIC LANGUAGE sql AS $$
  SELECT final_balance FROM banks WHERE id = p_bank
$$;

-- Registra y devuelve el código de error (o 'OK:<id>').
CREATE FUNCTION pg_temp.try_register(
  p_effect VARCHAR, p_total NUMERIC, p_cash JSONB, p_amounts JSONB,
  p_change NUMERIC, p_enabled BOOLEAN
) RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE v_id UUID;
BEGIN
  v_id := register_bank_deposit_operation(
    CASE WHEN p_effect IN ('DESEMBOLSO_GENESIS', 'PAGO_GENESIS') THEN NULL ELSE pg_temp.agent_id() END,
    p_total, CURRENT_DATE, p_cash, p_amounts, pg_temp.admin_id(), pg_temp.type_id(p_effect),
    'Prueba desglose opcional', p_change, NULL,
    CASE WHEN p_effect IN ('DESEMBOLSO_GENESIS', 'PAGO_GENESIS') THEN NULL ELSE pg_temp.account_id() END,
    p_enabled
  );
  RETURN 'OK:' || v_id;
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
  v_account UUID := pg_temp.account_id();
  v_before NUMERIC;
  v_result TEXT;
  v_id UUID;
  v_row RECORD;
BEGIN
  -- CASO 1: Retiro SIN desglose — guarda, total_cash 0, sin denominaciones, saldo +850.
  v_before := pg_temp.balance(v_account);
  v_result := pg_temp.try_register('RETIRO', 850, '[]', '[850]', 0, false);
  PERFORM pg_temp.expect('1 retiro sin desglose se registra', left(v_result, 3), 'OK:');
  v_id := substr(v_result, 4)::UUID;
  SELECT cash_breakdown_enabled, total_cash, total_distributed, transaction_count, change_given
    INTO v_row FROM bank_deposit_operations WHERE id = v_id;
  PERFORM pg_temp.expect('1 marca cash_breakdown_enabled = false', v_row.cash_breakdown_enabled::TEXT, 'false');
  PERFORM pg_temp.expect('1 total_cash = 0 (sin desglose ficticio)', v_row.total_cash::TEXT, '0.00');
  PERFORM pg_temp.expect('1 total_distributed = monto', v_row.total_distributed::TEXT, '850.00');
  PERFORM pg_temp.expect('1 sin filas de denominaciones',
    (SELECT count(*) FROM bank_deposit_cash_details WHERE operation_id = v_id)::TEXT, '0');
  PERFORM pg_temp.expect('1 saldo sube por el monto aplicado',
    (pg_temp.balance(v_account) - v_before)::TEXT, '850.00');

  -- CASO 2: Depósito SIN desglose y con 3 transacciones distribuidas (500+600+400).
  v_before := pg_temp.balance(v_account);
  v_result := pg_temp.try_register('DEPOSITO', 1500 - 650, '[]', '[200, 250, 400]', 0, false);
  PERFORM pg_temp.expect('2 depósito sin desglose, 3 transacciones', left(v_result, 3), 'OK:');
  v_id := substr(v_result, 4)::UUID;
  PERFORM pg_temp.expect('2 transaction_count = 3',
    (SELECT transaction_count FROM bank_deposit_operations WHERE id = v_id)::TEXT, '3');
  PERFORM pg_temp.expect('2 saldo baja por el monto total (no multiplicado)',
    (v_before - pg_temp.balance(v_account))::TEXT, '850.00');

  -- CASO 3: sin desglose pero la distribución no cuadra → rechazado.
  PERFORM pg_temp.expect('3 distribución que no cuadra',
    pg_temp.try_register('RETIRO', 100, '[]', '[60]', 0, false), 'TRANSACTION_TOTAL_MISMATCH');

  -- CASO 4: desglose desactivado pero llegan denominaciones → rechazado.
  PERFORM pg_temp.expect('4 denominaciones con desglose desactivado',
    pg_temp.try_register('RETIRO', 100, '[{"denomination":100,"quantity":1}]', '[100]', 0, false),
    'CASH_BREAKDOWN_NOT_EXPECTED');

  -- CASO 5: desglose desactivado con vuelto → rechazado.
  PERFORM pg_temp.expect('5 vuelto sin desglose',
    pg_temp.try_register('RETIRO', 100, '[]', '[100]', 20, false), 'INVALID_CHANGE_GIVEN');

  -- CASO 6: desglose ACTIVADO sin denominaciones → rechazado.
  PERFORM pg_temp.expect('6 desglose activo vacío',
    pg_temp.try_register('RETIRO', 100, '[]', '[100]', 0, true), 'CASH_BREAKDOWN_REQUIRED');

  -- CASO 7: desglose ACTIVADO que no cuadra → mismas reglas de siempre.
  PERFORM pg_temp.expect('7 desglose activo que no cuadra',
    pg_temp.try_register('RETIRO', 100, '[{"denomination":50,"quantity":1}]', '[100]', 0, true),
    'CASH_TOTAL_MISMATCH');

  -- CASO 8: desglose ACTIVADO con vuelto (Q200 recibido, Q150 aplicado) → igual que antes.
  v_result := pg_temp.try_register('RETIRO', 150, '[{"denomination":200,"quantity":1}]', '[150]', 50, true);
  PERFORM pg_temp.expect('8 desglose activo con vuelto', left(v_result, 3), 'OK:');
  v_id := substr(v_result, 4)::UUID;
  SELECT cash_breakdown_enabled, total_cash, change_given INTO v_row
    FROM bank_deposit_operations WHERE id = v_id;
  PERFORM pg_temp.expect('8 marca true y total_cash = efectivo recibido',
    v_row.cash_breakdown_enabled::TEXT || '/' || v_row.total_cash::TEXT, 'true/200.00');

  -- CASO 9: llamada de 11 argumentos (sin el nuevo parámetro) = desglose obligatorio.
  BEGIN
    PERFORM register_bank_deposit_operation(
      pg_temp.agent_id(), 100, CURRENT_DATE, '[]'::jsonb, '[100]'::jsonb, pg_temp.admin_id(),
      pg_temp.type_id('RETIRO'), NULL, 0, NULL, v_account
    );
    RAISE EXCEPTION 'FALLÓ 9: la llamada de 11 argumentos aceptó un desglose vacío';
  EXCEPTION WHEN OTHERS THEN
    PERFORM pg_temp.expect('9 llamada antigua mantiene desglose obligatorio',
      split_part(SQLERRM, ':', 1), 'CASH_BREAKDOWN_REQUIRED');
  END;

  -- CASO 10: Desembolso Génesis sin desglose (cuenta Génesis resuelta sola).
  PERFORM pg_temp.expect('10 desembolso Génesis sin desglose',
    left(pg_temp.try_register('DESEMBOLSO_GENESIS', 300, '[]', '[300]', 0, false), 3), 'OK:');

  -- CASO 11: Reintegro sin desglose (origen + Génesis, dos movimientos).
  v_result := pg_temp.try_register('REINTEGRO', 100, '[]', '[100]', 0, false);
  PERFORM pg_temp.expect('11 reintegro sin desglose', left(v_result, 3), 'OK:');
  PERFORM pg_temp.expect('11 reintegro genera 2 movimientos',
    (SELECT count(*) FROM bank_account_movements
      WHERE reference_type = 'BANK_DEPOSIT' AND reference_id = substr(v_result, 4)::UUID)::TEXT, '2');

  -- CASO 12: orden de "Últimas transacciones" = created_at DESC, id DESC (todo
  -- en esta transacción comparte now(): el desempate por id es el que decide).
  PERFORM pg_temp.expect('12 desempate estable por id',
    (SELECT string_agg(id::TEXT, ',' ORDER BY rn)
       FROM (SELECT id, row_number() OVER (ORDER BY created_at DESC, id DESC) AS rn
               FROM bank_deposit_operations) t
      WHERE rn <= (SELECT count(*) FROM bank_deposit_operations WHERE created_at = now())),
    (SELECT string_agg(id::TEXT, ',' ORDER BY id DESC)
       FROM bank_deposit_operations WHERE created_at = now()));
END $$;

ROLLBACK;
