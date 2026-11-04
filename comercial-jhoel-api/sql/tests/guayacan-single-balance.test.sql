-- Un solo saldo para Cooperativa Guayacán (migración 1760006700000-GuayacanSingleBalanceFromCashBox):
-- el de la cuenta GUAYACAN en Transaccionar = efectivo del Cuadre de Caja Guayacán.
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK: no deja ningún dato.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/guayacan-single-balance.test.sql

BEGIN;

CREATE FUNCTION pg_temp.admin_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name IN ('SUPER_ADMIN', 'ADMIN') ORDER BY u.created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.type_id(p_effect VARCHAR) RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_types WHERE balance_effect = p_effect AND is_active ORDER BY created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.guayacan() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_banks WHERE cash_box_code = 'GUAYACAN'
$$;

-- La cuenta "Cooperativa Guayacán" de la prueba: una cuenta normal marcada GUAYACAN dentro de esta transacción.
CREATE FUNCTION pg_temp.account() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM banks WHERE special_account = 'GUAYACAN' AND is_active LIMIT 1
$$;

CREATE FUNCTION pg_temp.op(p_effect VARCHAR, p_amount NUMERIC, p_count INT DEFAULT 1) RETURNS UUID LANGUAGE sql AS $$
  SELECT register_bank_deposit_operation(
    pg_temp.guayacan(), p_amount, CURRENT_DATE, '[]'::jsonb,
    (SELECT jsonb_agg(round(p_amount / p_count, 2)) FROM generate_series(1, p_count)),
    pg_temp.admin_id(), pg_temp.type_id(p_effect), NULL, 0, NULL, pg_temp.account(), false
  )
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
  v_base NUMERIC;
  v_op UUID;
  v_count INT;
BEGIN
  IF pg_temp.guayacan() IS NULL THEN
    RAISE EXCEPTION 'No hay banco agente marcado GUAYACAN';
  END IF;
  UPDATE transaction_banks SET commission_per_transaction = 3.00 WHERE id = pg_temp.guayacan();
  IF pg_temp.account() IS NULL THEN
    UPDATE banks SET special_account = 'GUAYACAN'
    WHERE id = (SELECT id FROM banks WHERE is_active AND special_account IS NULL AND available_in_transaccionar
                AND max_balance IS NULL ORDER BY created_at LIMIT 1);
  END IF;

  -- Saldo inicial de la tabla del requerimiento: Q1,000.00 (relativo al saldo actual de la caja de dev).
  v_base := guayacan_cash_balance();
  PERFORM register_guayacan_cash_movement('INGRESO', 1000 - v_base + 1000, CURRENT_DATE, v_admin, 'Base de prueba', NULL, NULL, NULL, NULL);
  PERFORM register_guayacan_cash_movement('EGRESO', 1000, CURRENT_DATE, v_admin, 'Base de prueba', NULL, NULL, NULL, NULL);
  PERFORM pg_temp.expect('P0 saldo inicial Q1,000.00', guayacan_cash_balance()::TEXT, '1000.00');

  -- La tabla del requerimiento.
  PERFORM register_guayacan_cash_movement('INGRESO', 500, CURRENT_DATE, v_admin, 'Ingreso manual', NULL, NULL, NULL, NULL);
  PERFORM pg_temp.expect('P1 ingreso manual +Q500 → Q1,500.00', guayacan_cash_balance()::TEXT, '1500.00');
  PERFORM register_guayacan_cash_movement('EGRESO', 200, CURRENT_DATE, v_admin, 'Egreso manual', NULL, NULL, NULL, NULL);
  PERFORM pg_temp.expect('P2 egreso manual −Q200 → Q1,300.00', guayacan_cash_balance()::TEXT, '1300.00');
  v_op := pg_temp.op('DEPOSITO', 300);
  PERFORM pg_temp.expect('P3 entrada por Transacciones +Q300 → Q1,600.00', guayacan_cash_balance()::TEXT, '1600.00');
  PERFORM pg_temp.op('RETIRO', 100);
  PERFORM pg_temp.expect('P4 salida por Transacciones −Q100 → Q1,500.00', guayacan_cash_balance()::TEXT, '1500.00');

  -- Comisiones: nunca cambian el efectivo.
  PERFORM pg_temp.expect('C1 la comisión de Q3.00 del depósito no tocó el efectivo',
    (SELECT amount::TEXT FROM guayacan_commissions WHERE operation_id = v_op), '3.00');
  PERFORM register_guayacan_cash_movement('INGRESO', 1000, CURRENT_DATE, v_admin, 'Fondo', NULL, NULL, NULL, NULL);
  PERFORM register_guayacan_cash_movement('EGRESO', 1000, CURRENT_DATE, v_admin, 'Fondo', NULL, NULL, NULL, NULL);
  v_base := guayacan_cash_balance();
  v_op := pg_temp.op('DEPOSITO', 100, 10);
  PERFORM pg_temp.expect('C2 diez transacciones = Q30.00 de comisión',
    (SELECT amount::TEXT FROM guayacan_commissions WHERE operation_id = v_op), '30.00');
  PERFORM pg_temp.expect('C2 el efectivo solo sube por el depósito (Q100), no por las comisiones',
    (guayacan_cash_balance() - v_base)::TEXT, '100.00');

  -- Un arqueo no modifica el saldo (la caja no registra ningún movimiento).
  v_count := (SELECT count(*) FROM guayacan_cash_movements);
  INSERT INTO guayacan_cash_counts (business_date, total_counted, system_balance, difference, created_by)
  VALUES (CURRENT_DATE, 0, guayacan_cash_balance(), -guayacan_cash_balance(), v_admin);
  PERFORM pg_temp.expect('A1 un arqueo no crea movimientos', ((SELECT count(*) FROM guayacan_cash_movements) - v_count)::TEXT, '0');

  -- Una consulta repetida no genera movimientos.
  v_count := (SELECT count(*) FROM guayacan_cash_movements);
  PERFORM guayacan_cash_balance(); PERFORM guayacan_cash_balance(); PERFORM guayacan_cash_balance();
  PERFORM pg_temp.expect('Q1 consultar el saldo no crea movimientos', ((SELECT count(*) FROM guayacan_cash_movements) - v_count)::TEXT, '0');

  -- Anulación: revierte el efectivo una sola vez.
  v_base := guayacan_cash_balance();
  PERFORM void_bank_deposit_operation(v_op, CURRENT_DATE, v_admin, 'Prueba de anulación');
  PERFORM pg_temp.expect('V1 anular el depósito de Q100 baja el efectivo Q100', (v_base - guayacan_cash_balance())::TEXT, '100.00');
  PERFORM pg_temp.expect('V1 y anula su comisión', (SELECT status FROM guayacan_commissions WHERE operation_id = v_op), 'ANULADO');

  -- Ajuste autorizado: se refleja en el saldo único.
  v_base := guayacan_cash_balance();
  PERFORM register_guayacan_cash_movement('AJUSTE', -0.05, CURRENT_DATE, v_admin, 'Ajuste por arqueo', 'Faltante de cinco centavos', NULL, NULL, NULL);
  PERFORM pg_temp.expect('J1 ajuste −Q0.05 sin errores de redondeo', (v_base - guayacan_cash_balance())::TEXT, '0.05');

  -- Retiro sin efectivo suficiente: rechazado, sin rastro.
  PERFORM pg_temp.expect('R1 retiro mayor que la caja rechazado', pg_temp.err(format(
    'SELECT pg_temp.op(%L, %s)', 'RETIRO', guayacan_cash_balance() + 1)), 'CASH_BOX_INSUFFICIENT_BALANCE');

  -- Guarda: la cuenta GUAYACAN no admite movimientos bancarios propios.
  PERFORM pg_temp.expect('G1 ajuste bancario sobre la cuenta GUAYACAN rechazado', pg_temp.err(format(
    'SELECT adjust_bank_balance(%L, 999, CURRENT_DATE, %L, ''prueba'')', pg_temp.account(), v_admin)),
    'GUAYACAN_BALANCE_IN_CASH_BOX');
  PERFORM pg_temp.expect('G2 Guayacán no generó movimientos bancarios en esta prueba',
    (SELECT count(*)::TEXT FROM bank_account_movements WHERE bank_id = pg_temp.account() AND created_at = now()), '0');

  -- Integridad: el saldo único es la suma del Kardex.
  PERFORM pg_temp.expect('I1 saldo único = suma de los movimientos del Kardex',
    (guayacan_cash_balance() = (SELECT COALESCE(sum(amount), 0) FROM guayacan_cash_movements))::TEXT, 'true');
END $$;

ROLLBACK;
