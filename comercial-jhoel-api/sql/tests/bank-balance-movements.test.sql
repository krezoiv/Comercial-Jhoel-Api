-- Pruebas de negocio de saldos bancarios dinámicos (migración
-- 1760005100000-CreateBankAccountMovements). Todo corre dentro de una
-- transacción que SIEMPRE termina en ROLLBACK: no deja ningún dato.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/bank-balance-movements.test.sql
--
-- La prueba de concurrencia (CASO 20) necesita dos sesiones reales y vive
-- en sql/tests/bank-balance-concurrency.sh.

BEGIN;

CREATE FUNCTION pg_temp.admin_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name IN ('SUPER_ADMIN', 'ADMIN') ORDER BY u.created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.bank(p_special VARCHAR, p_name_like VARCHAR DEFAULT NULL) RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM banks
  WHERE is_active = true
    AND (p_special IS NULL OR special_account = p_special)
    AND (p_name_like IS NULL OR search_normalize(name) LIKE p_name_like)
  ORDER BY created_at LIMIT 1
$$;

-- Cuenta "normal" cualquiera (sin regla especial).
CREATE FUNCTION pg_temp.normal_bank(p_offset INT DEFAULT 0) RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM banks WHERE is_active = true AND special_account IS NULL
  ORDER BY created_at OFFSET p_offset LIMIT 1
$$;

CREATE FUNCTION pg_temp.set_balance(p_bank UUID, p_value NUMERIC) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT final_balance FROM banks WHERE id = p_bank) <> p_value THEN
    PERFORM adjust_bank_balance(p_bank, p_value, CURRENT_DATE, pg_temp.admin_id(), 'Preparación de prueba');
  END IF;
END $$;

CREATE FUNCTION pg_temp.balance(p_bank UUID) RETURNS NUMERIC LANGUAGE sql AS $$
  SELECT final_balance FROM banks WHERE id = p_bank
$$;

CREATE FUNCTION pg_temp.assert_eq(p_label TEXT, p_actual NUMERIC, p_expected NUMERIC) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  IF p_actual IS DISTINCT FROM p_expected THEN
    RAISE EXCEPTION 'FALLÓ %: esperado %, obtenido %', p_label, p_expected, p_actual;
  END IF;
  RAISE NOTICE 'OK  %  (= %)', p_label, p_actual;
END $$;

-- Ejecuta un SQL que DEBE fallar con un código concreto; la
-- sub-transacción (bloque EXCEPTION) deshace cualquier efecto parcial.
CREATE FUNCTION pg_temp.assert_rejects(p_label TEXT, p_sql TEXT, p_code TEXT) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  BEGIN
    EXECUTE p_sql;
  EXCEPTION WHEN OTHERS THEN
    IF position(p_code IN SQLERRM) = 1 THEN
      RAISE NOTICE 'OK  % (rechazado: %)', p_label, SQLERRM;
      RETURN;
    END IF;
    RAISE EXCEPTION 'FALLÓ %: se esperaba %, se obtuvo %', p_label, p_code, SQLERRM;
  END;
  RAISE EXCEPTION 'FALLÓ %: la operación debía rechazarse con %', p_label, p_code;
END $$;

-- Registra una operación de Transaccionar con desglose simple.
CREATE FUNCTION pg_temp.transaccionar(p_type_effect VARCHAR, p_account UUID, p_amount NUMERIC, p_cash NUMERIC DEFAULT NULL)
RETURNS UUID LANGUAGE plpgsql AS $$
DECLARE
  v_cash NUMERIC := COALESCE(p_cash, p_amount);
BEGIN
  RETURN register_bank_deposit_operation(
    (SELECT id FROM transaction_banks WHERE is_active = true ORDER BY created_at LIMIT 1),
    p_amount, CURRENT_DATE,
    jsonb_build_array(jsonb_build_object('denomination', v_cash, 'quantity', 1)),
    jsonb_build_array(p_amount),
    pg_temp.admin_id(),
    (SELECT id FROM transaction_types WHERE balance_effect = p_type_effect AND is_active = true LIMIT 1),
    'Cliente prueba', v_cash - p_amount, NULL, p_account
  );
END $$;

DO $$
DECLARE
  v_normal UUID := pg_temp.normal_bank(0);
  v_normal2 UUID := pg_temp.normal_bank(1);
  v_genesis UUID := pg_temp.bank('GENESIS');
  v_industrial UUID := pg_temp.bank('BANCO_INDUSTRIAL');
  v_agro UUID := pg_temp.bank('BANCO_AGROMERCANTIL');
  v_biclub UUID := pg_temp.bank('BI_CLUB');
  v_districol UUID := pg_temp.bank('DISTRICOL');
  v_op UUID;
  v_transfer UUID;
BEGIN
  IF v_normal IS NULL OR v_normal2 IS NULL OR v_genesis IS NULL OR v_industrial IS NULL
     OR v_agro IS NULL OR v_biclub IS NULL OR v_districol IS NULL THEN
    RAISE EXCEPTION 'Faltan cuentas configuradas (special_account) para correr las pruebas';
  END IF;

  -- CASO 1 — Depósito: 1000 − 100 = 900
  PERFORM pg_temp.set_balance(v_normal, 1000);
  PERFORM pg_temp.transaccionar('DEPOSITO', v_normal, 100);
  PERFORM pg_temp.assert_eq('CASO 1 depósito', pg_temp.balance(v_normal), 900);

  -- CASO 2 — Depósito superior al saldo
  PERFORM pg_temp.set_balance(v_normal, 1000);
  PERFORM pg_temp.assert_rejects('CASO 2 depósito > saldo',
    format('SELECT pg_temp.transaccionar(%L, %L, 1001)', 'DEPOSITO', v_normal), 'INSUFFICIENT_BALANCE:DEPOSITO');
  PERFORM pg_temp.assert_eq('CASO 2 saldo intacto', pg_temp.balance(v_normal), 1000);
  -- El rechazo revierte la operación completa (ni cabecera ni detalle).
  PERFORM pg_temp.assert_eq('CASO 2 sin operación huérfana',
    (SELECT COUNT(*) FROM bank_deposit_operations WHERE bank_account_id = v_normal AND total_amount = 1001), 0);

  -- Vuelto — depósito Q890 pagado con Q900: el saldo se mueve solo Q890
  PERFORM pg_temp.set_balance(v_normal, 1000);
  v_op := pg_temp.transaccionar('DEPOSITO', v_normal, 890, 900);
  PERFORM pg_temp.assert_eq('VUELTO saldo', pg_temp.balance(v_normal), 110);
  PERFORM pg_temp.assert_eq('VUELTO change_given', (SELECT change_given FROM bank_deposit_operations WHERE id = v_op), 10);
  PERFORM pg_temp.assert_eq('VUELTO movimiento',
    (SELECT amount FROM bank_account_movements WHERE reference_id = v_op), -890);

  -- ANULACIÓN — genera el movimiento inverso, conserva ambos
  PERFORM void_bank_deposit_operation(v_op, CURRENT_DATE, pg_temp.admin_id(), 'Prueba de anulación');
  PERFORM pg_temp.assert_eq('ANULACIÓN saldo restaurado', pg_temp.balance(v_normal), 1000);
  PERFORM pg_temp.assert_eq('ANULACIÓN conserva historial',
    (SELECT COUNT(*) FROM bank_account_movements WHERE reference_id = v_op), 2);
  PERFORM pg_temp.assert_rejects('ANULACIÓN doble',
    format('SELECT void_bank_deposit_operation(%L, CURRENT_DATE, pg_temp.admin_id(), %L)', v_op, 'x'),
    'BANK_DEPOSIT_OPERATION_ALREADY_VOIDED');

  -- CASO 3 — Retiro: 1000 + 100 = 1100
  PERFORM pg_temp.set_balance(v_normal, 1000);
  PERFORM pg_temp.transaccionar('RETIRO', v_normal, 100);
  PERFORM pg_temp.assert_eq('CASO 3 retiro', pg_temp.balance(v_normal), 1100);

  -- CASO 4 — Génesis desembolso 2000 − 5000 = −3000 (permitido)
  PERFORM pg_temp.set_balance(v_genesis, 2000);
  PERFORM pg_temp.transaccionar('DESEMBOLSO_GENESIS', NULL, 5000);
  PERFORM pg_temp.assert_eq('CASO 4 desembolso', pg_temp.balance(v_genesis), -3000);

  -- CASO 5 — Génesis desembolso con saldo negativo −3000 − 2000 = −5000
  PERFORM pg_temp.transaccionar('DESEMBOLSO_GENESIS', NULL, 2000);
  PERFORM pg_temp.assert_eq('CASO 5 desembolso negativo', pg_temp.balance(v_genesis), -5000);

  -- La cuenta afectada se resuelve sola aunque el cliente envíe otra.
  PERFORM pg_temp.transaccionar('DESEMBOLSO_GENESIS', v_normal, 1);
  PERFORM pg_temp.assert_eq('Génesis ignora cuenta enviada', pg_temp.balance(v_genesis), -5001);
  PERFORM pg_temp.set_balance(v_genesis, -5000);

  -- CASO 6 — Pago Génesis −5000 + 3000 = −2000
  PERFORM pg_temp.transaccionar('PAGO_GENESIS', NULL, 3000);
  PERFORM pg_temp.assert_eq('CASO 6 pago', pg_temp.balance(v_genesis), -2000);

  -- CASO 7 — Pago Génesis −5000 + 10000 = 5000
  PERFORM pg_temp.set_balance(v_genesis, -5000);
  PERFORM pg_temp.transaccionar('PAGO_GENESIS', NULL, 10000);
  PERFORM pg_temp.assert_eq('CASO 7 pago', pg_temp.balance(v_genesis), 5000);

  -- CASO 8 — Límite Génesis 118000 + 2000 = 120000 (permitido)
  PERFORM pg_temp.set_balance(v_genesis, 118000);
  PERFORM pg_temp.transaccionar('PAGO_GENESIS', NULL, 2000);
  PERFORM pg_temp.assert_eq('CASO 8 límite exacto', pg_temp.balance(v_genesis), 120000);

  -- CASO 9 — Excede límite Génesis 118000 + 5000 = 123000
  PERFORM pg_temp.set_balance(v_genesis, 118000);
  PERFORM pg_temp.assert_rejects('CASO 9 excede límite',
    format('SELECT pg_temp.transaccionar(%L, NULL, 5000)', 'PAGO_GENESIS'), 'BALANCE_LIMIT_EXCEEDED:PAGO_GENESIS');
  PERFORM pg_temp.assert_eq('CASO 9 saldo intacto', pg_temp.balance(v_genesis), 118000);

  -- CASO 10 — Reintegro Génesis (abono a la línea, migración 1760005400000):
  -- resta de la cuenta origen Y de Génesis. Origen 10000 − 2000 = 8000,
  -- Génesis 5000 − 2000 = 3000.
  PERFORM pg_temp.set_balance(v_normal, 10000);
  PERFORM pg_temp.set_balance(v_genesis, 5000);
  v_op := pg_temp.transaccionar('REINTEGRO', v_normal, 2000);
  PERFORM pg_temp.assert_eq('CASO 10 reintegro origen', pg_temp.balance(v_normal), 8000);
  PERFORM pg_temp.assert_eq('CASO 10 reintegro Génesis', pg_temp.balance(v_genesis), 3000);
  PERFORM pg_temp.assert_eq('CASO 10 dos movimientos',
    (SELECT COUNT(*) FROM bank_account_movements WHERE reference_id = v_op AND movement_type = 'REINTEGRO'), 2);

  -- Anular el reintegro restaura ambas cuentas
  PERFORM void_bank_deposit_operation(v_op, CURRENT_DATE, pg_temp.admin_id(), 'Prueba de anulación');
  PERFORM pg_temp.assert_eq('CASO 10 anulación origen', pg_temp.balance(v_normal), 10000);
  PERFORM pg_temp.assert_eq('CASO 10 anulación Génesis', pg_temp.balance(v_genesis), 5000);

  -- CASO 11 — Génesis puede quedar negativo (−3000 − 2000 = −5000), la
  -- cuenta origen no: sin saldo se rechaza todo y nada se mueve.
  PERFORM pg_temp.set_balance(v_normal, 10000);
  PERFORM pg_temp.set_balance(v_genesis, -3000);
  PERFORM pg_temp.transaccionar('REINTEGRO', v_normal, 2000);
  PERFORM pg_temp.assert_eq('CASO 11 reintegro Génesis negativo', pg_temp.balance(v_genesis), -5000);
  PERFORM pg_temp.set_balance(v_normal, 1000);
  PERFORM pg_temp.assert_rejects('CASO 11 reintegro > saldo origen',
    format('SELECT pg_temp.transaccionar(%L, %L, 2000)', 'REINTEGRO', v_normal), 'INSUFFICIENT_BALANCE:REINTEGRO');
  PERFORM pg_temp.assert_eq('CASO 11 origen intacto', pg_temp.balance(v_normal), 1000);
  PERFORM pg_temp.assert_eq('CASO 11 Génesis intacto', pg_temp.balance(v_genesis), -5000);

  -- La línea Génesis no puede ser la cuenta origen de su propio reintegro
  PERFORM pg_temp.assert_rejects('CASO 11 origen = Génesis',
    format('SELECT pg_temp.transaccionar(%L, %L, 100)', 'REINTEGRO', v_genesis), 'REINTEGRO_SOURCE_IS_GENESIS');

  -- CASO 12 — Transferencia 5000→10000 por 2000
  PERFORM pg_temp.set_balance(v_normal, 5000);
  PERFORM pg_temp.set_balance(v_normal2, 10000);
  v_transfer := register_bank_transfer(v_normal, v_normal2, 2000, CURRENT_DATE, pg_temp.admin_id(), 'REF-1', 'Prueba');
  PERFORM pg_temp.assert_eq('CASO 12 origen', pg_temp.balance(v_normal), 3000);
  PERFORM pg_temp.assert_eq('CASO 12 destino', pg_temp.balance(v_normal2), 12000);

  -- Anular transferencia: ambos saldos vuelven, 4 movimientos en historial
  PERFORM void_bank_transfer(v_transfer, CURRENT_DATE, pg_temp.admin_id(), 'Prueba');
  PERFORM pg_temp.assert_eq('ANULAR TRANSFERENCIA origen', pg_temp.balance(v_normal), 5000);
  PERFORM pg_temp.assert_eq('ANULAR TRANSFERENCIA destino', pg_temp.balance(v_normal2), 10000);
  PERFORM pg_temp.assert_eq('ANULAR TRANSFERENCIA historial',
    (SELECT COUNT(*) FROM bank_account_movements WHERE reference_id = v_transfer), 4);

  -- CASO 13 — Transferencia superior al saldo
  PERFORM pg_temp.assert_rejects('CASO 13 transferencia > saldo',
    format('SELECT register_bank_transfer(%L, %L, 6000, CURRENT_DATE, pg_temp.admin_id())', v_normal, v_normal2),
    'INSUFFICIENT_BALANCE:TRANSFERENCIA_SALIDA');
  PERFORM pg_temp.assert_eq('CASO 13 origen intacto', pg_temp.balance(v_normal), 5000);
  PERFORM pg_temp.assert_eq('CASO 13 destino intacto', pg_temp.balance(v_normal2), 10000);

  -- CASO 14 — Banco Industrial → BI Club (permitido)
  PERFORM pg_temp.set_balance(v_industrial, 10000);
  PERFORM pg_temp.set_balance(v_biclub, 0);
  PERFORM register_bank_transfer(v_industrial, v_biclub, 1000, CURRENT_DATE, pg_temp.admin_id());
  PERFORM pg_temp.assert_eq('CASO 14 BI Club recibe', pg_temp.balance(v_biclub), 1000);

  -- CASO 15 — Otro banco → BI Club (rechazado)
  PERFORM pg_temp.set_balance(v_normal, 5000);
  PERFORM pg_temp.assert_rejects('CASO 15 otro banco → BI Club',
    format('SELECT register_bank_transfer(%L, %L, 100, CURRENT_DATE, pg_temp.admin_id())', v_normal, v_biclub),
    'TRANSFER_ORIGIN_NOT_ALLOWED:BI_CLUB');
  PERFORM pg_temp.assert_rejects('CASO 15b Agromercantil → BI Club',
    format('SELECT register_bank_transfer(%L, %L, 100, CURRENT_DATE, pg_temp.admin_id())', v_agro, v_biclub),
    'TRANSFER_ORIGIN_NOT_ALLOWED:BI_CLUB');

  -- CASO 16 — BI Club 70000 + 5000 = 75000 (límite exacto)
  PERFORM pg_temp.set_balance(v_industrial, 100000);
  PERFORM pg_temp.set_balance(v_biclub, 70000);
  PERFORM register_bank_transfer(v_industrial, v_biclub, 5000, CURRENT_DATE, pg_temp.admin_id());
  PERFORM pg_temp.assert_eq('CASO 16 BI Club límite', pg_temp.balance(v_biclub), 75000);

  -- CASO 17 — BI Club 70000 + 5001 (excede)
  PERFORM pg_temp.set_balance(v_biclub, 70000);
  PERFORM pg_temp.assert_rejects('CASO 17 BI Club excede',
    format('SELECT register_bank_transfer(%L, %L, 5001, CURRENT_DATE, pg_temp.admin_id())', v_industrial, v_biclub),
    'BALANCE_LIMIT_EXCEEDED:TRANSFERENCIA_ENTRADA');
  PERFORM pg_temp.assert_eq('CASO 17 origen intacto (rollback atómico)', pg_temp.balance(v_industrial), 95000);

  -- CASO 18 — Banco Agromercantil → Districol (permitido)
  PERFORM pg_temp.set_balance(v_agro, 3000);
  PERFORM pg_temp.set_balance(v_districol, 0);
  PERFORM register_bank_transfer(v_agro, v_districol, 1000, CURRENT_DATE, pg_temp.admin_id());
  PERFORM pg_temp.assert_eq('CASO 18 Districol recibe', pg_temp.balance(v_districol), 1000);

  -- CASO 19 — Banco Industrial → Districol (rechazado)
  PERFORM pg_temp.assert_rejects('CASO 19 Industrial → Districol',
    format('SELECT register_bank_transfer(%L, %L, 100, CURRENT_DATE, pg_temp.admin_id())', v_industrial, v_districol),
    'TRANSFER_ORIGIN_NOT_ALLOWED:DISTRICOL');

  -- Cuenta no habilitada para Transaccionar (Sistema → Bancos): rechazada
  -- en el backend aunque la UI la oculte; Génesis no depende del flag.
  UPDATE banks SET available_in_transaccionar = false WHERE id IN (v_normal, v_genesis);
  PERFORM pg_temp.set_balance(v_normal, 1000);
  PERFORM pg_temp.assert_rejects('Cuenta no habilitada en Transaccionar',
    format('SELECT pg_temp.transaccionar(%L, %L, 10)', 'RETIRO', v_normal), 'BANK_ACCOUNT_NOT_AVAILABLE');
  PERFORM pg_temp.assert_eq('Cuenta no habilitada: saldo intacto', pg_temp.balance(v_normal), 1000);
  PERFORM pg_temp.set_balance(v_genesis, 0);
  PERFORM pg_temp.transaccionar('DESEMBOLSO_GENESIS', NULL, 100);
  PERFORM pg_temp.assert_eq('Génesis no depende del flag', pg_temp.balance(v_genesis), -100);
  -- Las transferencias siguen admitiendo cualquier cuenta activa.
  PERFORM register_bank_transfer(v_normal, v_normal2, 10, CURRENT_DATE, pg_temp.admin_id());
  PERFORM pg_temp.assert_eq('Transferencia ignora el flag', pg_temp.balance(v_normal), 990);
  UPDATE banks SET available_in_transaccionar = true WHERE id IN (v_normal, v_genesis);
  PERFORM pg_temp.set_balance(v_normal, 5000);

  -- BI Club como ORIGEN: solo hacia Banco Industrial (ni otro banco ni retiro de efectivo)
  PERFORM pg_temp.set_balance(v_biclub, 1000);
  PERFORM pg_temp.set_balance(v_industrial, 0);
  PERFORM pg_temp.assert_rejects('BI Club → otro banco',
    format('SELECT register_bank_transfer(%L, %L, 100, CURRENT_DATE, pg_temp.admin_id())', v_biclub, v_normal),
    'TRANSFER_DESTINATION_NOT_ALLOWED:BI_CLUB');
  PERFORM pg_temp.assert_rejects('BI Club → retiro de efectivo',
    format('SELECT register_bank_transfer(%L, NULL, 100, CURRENT_DATE, pg_temp.admin_id())', v_biclub),
    'TRANSFER_DESTINATION_NOT_ALLOWED:BI_CLUB');
  PERFORM register_bank_transfer(v_biclub, v_industrial, 400, CURRENT_DATE, pg_temp.admin_id());
  PERFORM pg_temp.assert_eq('BI Club → Banco Industrial (origen)', pg_temp.balance(v_biclub), 600);
  PERFORM pg_temp.assert_eq('BI Club → Banco Industrial (destino)', pg_temp.balance(v_industrial), 400);

  -- Retiro de efectivo en banco: solo resta al origen, nadie recibe
  PERFORM pg_temp.set_balance(v_normal, 5000);
  PERFORM pg_temp.set_balance(v_normal2, 10000);
  v_transfer := register_bank_transfer(v_normal, NULL, 1500, CURRENT_DATE, pg_temp.admin_id(), 'RET-1', 'Retiro en ventanilla');
  PERFORM pg_temp.assert_eq('RETIRO EFECTIVO origen', pg_temp.balance(v_normal), 3500);
  PERFORM pg_temp.assert_eq('RETIRO EFECTIVO no acredita a otra cuenta', pg_temp.balance(v_normal2), 10000);
  PERFORM pg_temp.assert_eq('RETIRO EFECTIVO un solo movimiento',
    (SELECT COUNT(*) FROM bank_account_movements WHERE reference_id = v_transfer AND movement_type = 'RETIRO_EFECTIVO'), 1);
  PERFORM pg_temp.assert_rejects('RETIRO EFECTIVO > saldo',
    format('SELECT register_bank_transfer(%L, NULL, 999999, CURRENT_DATE, pg_temp.admin_id())', v_normal),
    'INSUFFICIENT_BALANCE:RETIRO_EFECTIVO');
  PERFORM pg_temp.set_balance(v_genesis, 100);
  PERFORM pg_temp.assert_rejects('RETIRO EFECTIVO Génesis no queda negativo',
    format('SELECT register_bank_transfer(%L, NULL, 200, CURRENT_DATE, pg_temp.admin_id())', v_genesis),
    'INSUFFICIENT_BALANCE:RETIRO_EFECTIVO');
  PERFORM void_bank_transfer(v_transfer, CURRENT_DATE, pg_temp.admin_id(), 'Prueba');
  PERFORM pg_temp.assert_eq('ANULAR RETIRO EFECTIVO restaura', pg_temp.balance(v_normal), 5000);

  -- Validaciones generales
  PERFORM pg_temp.assert_rejects('Monto cero en transferencia',
    format('SELECT register_bank_transfer(%L, %L, 0, CURRENT_DATE, pg_temp.admin_id())', v_normal, v_normal2),
    'INVALID_MOVEMENT_AMOUNT');
  PERFORM pg_temp.assert_rejects('Transferencia a la misma cuenta',
    format('SELECT register_bank_transfer(%L, %L, 10, CURRENT_DATE, pg_temp.admin_id())', v_normal, v_normal),
    'SAME_ACCOUNT_TRANSFER');
  PERFORM pg_temp.assert_rejects('Depósito sin cuenta',
    format('SELECT pg_temp.transaccionar(%L, NULL, 10)', 'DEPOSITO'), 'BANK_ACCOUNT_REQUIRED');
  PERFORM pg_temp.assert_rejects('Ajuste manual sin motivo',
    format('SELECT adjust_bank_balance(%L, 1, CURRENT_DATE, pg_temp.admin_id(), %L)', v_normal, ' '), 'REASON_REQUIRED');
  PERFORM pg_temp.assert_rejects('Ajuste manual a negativo en cuenta normal',
    format('SELECT adjust_bank_balance(%L, -1, CURRENT_DATE, pg_temp.admin_id(), %L)', v_normal, 'x'),
    'INSUFFICIENT_BALANCE:AJUSTE_MANUAL');

  -- Ajuste manual: queda como movimiento (nunca sobrescritura silenciosa)
  PERFORM adjust_bank_balance(v_normal, 9500, CURRENT_DATE, pg_temp.admin_id(), 'Corrección por diferencia bancaria');
  PERFORM pg_temp.assert_eq('AJUSTE MANUAL saldo', pg_temp.balance(v_normal), 9500);
  PERFORM pg_temp.assert_eq('AJUSTE MANUAL movimiento',
    (SELECT amount FROM bank_account_movements WHERE bank_id = v_normal ORDER BY sequence DESC LIMIT 1), 4500);

  -- Consistencia global: para cada cuenta, la suma del ledger = saldo actual,
  -- y cada movimiento cumple saldo_anterior + monto = saldo_posterior.
  PERFORM pg_temp.assert_eq('CONSISTENCIA ledger = saldo',
    (SELECT COUNT(*) FROM banks b
     WHERE b.final_balance <> (SELECT COALESCE(SUM(m.amount), 0) FROM bank_account_movements m WHERE m.bank_id = b.id)),
    0);
  PERFORM pg_temp.assert_eq('CONSISTENCIA cadena de saldos',
    (SELECT COUNT(*) FROM (
       SELECT balance_before, LAG(balance_after) OVER (PARTITION BY bank_id ORDER BY sequence) AS prev_after
       FROM bank_account_movements
     ) t WHERE prev_after IS NOT NULL AND prev_after <> balance_before),
    0);

  RAISE NOTICE 'TODAS LAS PRUEBAS PASARON';
END $$;

ROLLBACK;
