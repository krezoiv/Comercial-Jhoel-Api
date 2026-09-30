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

  -- ================================================================
  -- BI Club Empresarial = LÍNEA DE CRÉDITO (migración 1760005700000):
  -- saldo entre -max_balance y 0. Recibir de Banco Industrial RESTA,
  -- devolver a Banco Industrial SUMA hacia cero.
  -- ================================================================
  UPDATE banks SET max_balance = 75000 WHERE id = v_biclub;

  -- CASO 14 / A — BI Club Q0, Banco Industrial envía Q75,000 → -75,000
  PERFORM pg_temp.set_balance(v_industrial, 100000);
  PERFORM pg_temp.set_balance(v_biclub, 0);
  v_transfer := register_bank_transfer(v_industrial, v_biclub, 75000, CURRENT_DATE, pg_temp.admin_id(), 'BI-1', 'Uso línea');
  PERFORM pg_temp.assert_eq('CASO A BI Club usa Q75,000', pg_temp.balance(v_biclub), -75000);
  PERFORM pg_temp.assert_eq('CASO A Banco Industrial - 75,000', pg_temp.balance(v_industrial), 25000);
  PERFORM pg_temp.assert_eq('CASO A movimiento BI Club (efecto -75,000)',
    (SELECT amount FROM bank_account_movements WHERE reference_id = v_transfer AND bank_id = v_biclub), -75000);
  PERFORM pg_temp.assert_eq('CASO A movimiento Banco Industrial (efecto -75,000)',
    (SELECT amount FROM bank_account_movements WHERE reference_id = v_transfer AND bank_id = v_industrial), -75000);

  -- CASO D — BI Club -75,000 recibe Q1 → rechazado, nada se mueve
  PERFORM pg_temp.assert_rejects('CASO D BI Club en el límite recibe Q1',
    format('SELECT register_bank_transfer(%L, %L, 1, CURRENT_DATE, pg_temp.admin_id())', v_industrial, v_biclub),
    'CREDIT_LINE_LIMIT_EXCEEDED:TRANSFERENCIA_ENTRADA');
  PERFORM pg_temp.assert_eq('CASO D BI Club intacto', pg_temp.balance(v_biclub), -75000);
  PERFORM pg_temp.assert_eq('CASO D Banco Industrial intacto (rollback atómico)', pg_temp.balance(v_industrial), 25000);

  -- CASO E — BI Club -75,000 devuelve Q50,000 → -25,000; Banco Industrial + 50,000
  v_transfer := register_bank_transfer(v_biclub, v_industrial, 50000, CURRENT_DATE, pg_temp.admin_id(), 'BI-2', 'Devolución');
  PERFORM pg_temp.assert_eq('CASO E BI Club', pg_temp.balance(v_biclub), -25000);
  PERFORM pg_temp.assert_eq('CASO E Banco Industrial', pg_temp.balance(v_industrial), 75000);
  PERFORM pg_temp.assert_eq('CASO E movimiento BI Club (efecto +50,000)',
    (SELECT amount FROM bank_account_movements WHERE reference_id = v_transfer AND bank_id = v_biclub), 50000);
  PERFORM pg_temp.assert_eq('CASO E saldo posterior en historial',
    (SELECT balance_after FROM bank_account_movements WHERE reference_id = v_transfer AND bank_id = v_biclub), -25000);

  -- CASO H — BI Club -25,000 devuelve Q26,000 → rechazado (no puede quedar en +1,000)
  PERFORM pg_temp.assert_rejects('CASO H devolución > deuda',
    format('SELECT register_bank_transfer(%L, %L, 26000, CURRENT_DATE, pg_temp.admin_id())', v_biclub, v_industrial),
    'CREDIT_LINE_OVERPAYMENT:TRANSFERENCIA_SALIDA');
  PERFORM pg_temp.assert_eq('CASO H BI Club intacto', pg_temp.balance(v_biclub), -25000);
  PERFORM pg_temp.assert_eq('CASO H Banco Industrial intacto', pg_temp.balance(v_industrial), 75000);

  -- CASO G — BI Club -25,000 devuelve Q25,000 → 0
  PERFORM register_bank_transfer(v_biclub, v_industrial, 25000, CURRENT_DATE, pg_temp.admin_id(), 'BI-3', 'Devolución final');
  PERFORM pg_temp.assert_eq('CASO G BI Club línea pagada', pg_temp.balance(v_biclub), 0);
  PERFORM pg_temp.assert_eq('CASO G Banco Industrial', pg_temp.balance(v_industrial), 100000);

  -- Sin deuda pendiente: devolver Q1,000 con BI Club en 0 → rechazado
  PERFORM pg_temp.assert_rejects('BI Club Q0 devuelve Q1,000',
    format('SELECT register_bank_transfer(%L, %L, 1000, CURRENT_DATE, pg_temp.admin_id())', v_biclub, v_industrial),
    'CREDIT_LINE_NO_DEBT:TRANSFERENCIA_SALIDA');

  -- CASO B — BI Club -50,000 recibe Q25,000 → -75,000 (límite exacto)
  PERFORM pg_temp.set_balance(v_biclub, -50000);
  PERFORM register_bank_transfer(v_industrial, v_biclub, 25000, CURRENT_DATE, pg_temp.admin_id());
  PERFORM pg_temp.assert_eq('CASO B BI Club límite exacto', pg_temp.balance(v_biclub), -75000);

  -- CASO C — BI Club -50,000 recibe Q25,000.01 / Q25,001 → rechazado
  PERFORM pg_temp.set_balance(v_biclub, -50000);
  PERFORM pg_temp.assert_rejects('CASO C BI Club excede por Q1',
    format('SELECT register_bank_transfer(%L, %L, 25001, CURRENT_DATE, pg_temp.admin_id())', v_industrial, v_biclub),
    'CREDIT_LINE_LIMIT_EXCEEDED:TRANSFERENCIA_ENTRADA');
  PERFORM pg_temp.assert_rejects('CASO C BI Club excede por Q0.01',
    format('SELECT register_bank_transfer(%L, %L, 25000.01, CURRENT_DATE, pg_temp.admin_id())', v_industrial, v_biclub),
    'CREDIT_LINE_LIMIT_EXCEEDED:TRANSFERENCIA_ENTRADA');
  PERFORM pg_temp.assert_eq('CASO C BI Club intacto', pg_temp.balance(v_biclub), -50000);

  -- Uso parcial: -50,000 recibe Q20,000 → -70,000; luego Q30,000 excede
  PERFORM register_bank_transfer(v_industrial, v_biclub, 20000, CURRENT_DATE, pg_temp.admin_id());
  PERFORM pg_temp.assert_eq('USO PARCIAL -70,000', pg_temp.balance(v_biclub), -70000);
  PERFORM pg_temp.assert_rejects('USO PARCIAL Q30,000 excede',
    format('SELECT register_bank_transfer(%L, %L, 30000, CURRENT_DATE, pg_temp.admin_id())', v_industrial, v_biclub),
    'CREDIT_LINE_LIMIT_EXCEEDED');

  -- CASO F — BI Club -75,000 devuelve Q75,000 → 0
  PERFORM pg_temp.set_balance(v_biclub, -75000);
  PERFORM register_bank_transfer(v_biclub, v_industrial, 75000, CURRENT_DATE, pg_temp.admin_id());
  PERFORM pg_temp.assert_eq('CASO F devolución total', pg_temp.balance(v_biclub), 0);

  -- Banco Industrial sin saldo suficiente: BI Club tampoco se mueve (rollback)
  PERFORM pg_temp.set_balance(v_industrial, 100);
  PERFORM pg_temp.assert_rejects('Banco Industrial sin saldo → BI Club',
    format('SELECT register_bank_transfer(%L, %L, 1000, CURRENT_DATE, pg_temp.admin_id())', v_industrial, v_biclub),
    'INSUFFICIENT_BALANCE:TRANSFERENCIA_SALIDA');
  PERFORM pg_temp.assert_eq('ROLLBACK BI Club intacto', pg_temp.balance(v_biclub), 0);
  PERFORM pg_temp.assert_eq('ROLLBACK Banco Industrial intacto', pg_temp.balance(v_industrial), 100);

  -- Monto negativo / cero / más de 2 decimales
  PERFORM pg_temp.set_balance(v_industrial, 100000);
  PERFORM pg_temp.assert_rejects('BI Club monto negativo',
    format('SELECT register_bank_transfer(%L, %L, -100, CURRENT_DATE, pg_temp.admin_id())', v_industrial, v_biclub),
    'INVALID_MOVEMENT_AMOUNT');
  PERFORM pg_temp.assert_rejects('BI Club monto cero',
    format('SELECT register_bank_transfer(%L, %L, 0, CURRENT_DATE, pg_temp.admin_id())', v_industrial, v_biclub),
    'INVALID_MOVEMENT_AMOUNT');
  PERFORM pg_temp.assert_rejects('BI Club monto con 3 decimales',
    format('SELECT register_bank_transfer(%L, %L, 10.005, CURRENT_DATE, pg_temp.admin_id())', v_industrial, v_biclub),
    'INVALID_MOVEMENT_AMOUNT');

  -- Anulaciones: anular un uso regresa la línea hacia 0; anular una
  -- devolución la vuelve a usar; ninguna puede romper -límite ≤ saldo ≤ 0.
  PERFORM pg_temp.set_balance(v_biclub, 0);
  v_transfer := register_bank_transfer(v_industrial, v_biclub, 10000, CURRENT_DATE, pg_temp.admin_id());
  PERFORM void_bank_transfer(v_transfer, CURRENT_DATE, pg_temp.admin_id(), 'Prueba');
  PERFORM pg_temp.assert_eq('ANULAR USO BI Club', pg_temp.balance(v_biclub), 0);
  PERFORM pg_temp.assert_eq('ANULAR USO Banco Industrial', pg_temp.balance(v_industrial), 100000);
  PERFORM pg_temp.set_balance(v_biclub, -30000);
  v_transfer := register_bank_transfer(v_biclub, v_industrial, 30000, CURRENT_DATE, pg_temp.admin_id());
  PERFORM register_bank_transfer(v_industrial, v_biclub, 75000, CURRENT_DATE, pg_temp.admin_id());
  PERFORM pg_temp.assert_rejects('ANULAR DEVOLUCIÓN excedería el límite',
    format('SELECT void_bank_transfer(%L, CURRENT_DATE, pg_temp.admin_id(), %L)', v_transfer, 'x'),
    'CREDIT_LINE_LIMIT_EXCEEDED:ANULACION');
  PERFORM pg_temp.assert_eq('ANULAR DEVOLUCIÓN rechazada: BI Club intacto', pg_temp.balance(v_biclub), -75000);

  -- Transferencia con la semántica anterior (entrada positiva a BI Club):
  -- su anulación se rechaza en vez de invertir un signo que ya no aplica.
  v_transfer := gen_random_uuid();
  INSERT INTO bank_account_movements (bank_id, movement_type, origin, amount, balance_before, balance_after,
    business_date, user_id, reference_type, reference_id, counterpart_bank_id)
  VALUES (v_biclub, 'TRANSFERENCIA_ENTRADA', 'TRANSFERENCIA', 1, -75000, -74999,
    CURRENT_DATE, pg_temp.admin_id(), 'BANK_TRANSFER', v_transfer, v_industrial);
  PERFORM pg_temp.assert_rejects('ANULAR transferencia BI Club previa a la línea',
    format('SELECT void_bank_transfer(%L, CURRENT_DATE, pg_temp.admin_id(), %L)', v_transfer, 'x'),
    'LEGACY_CREDIT_LINE_TRANSFER');
  DELETE FROM bank_account_movements WHERE reference_id = v_transfer; -- solo la fila sintética de esta prueba (todo termina en ROLLBACK)

  -- Ajuste manual y acreditación respetan la línea
  PERFORM pg_temp.assert_rejects('AJUSTE BI Club a positivo',
    format('SELECT adjust_bank_balance(%L, 100, CURRENT_DATE, pg_temp.admin_id(), %L)', v_biclub, 'x'),
    'CREDIT_LINE_OVERPAYMENT:AJUSTE_MANUAL');
  PERFORM pg_temp.assert_rejects('AJUSTE BI Club debajo del límite',
    format('SELECT adjust_bank_balance(%L, -75000.01, CURRENT_DATE, pg_temp.admin_id(), %L)', v_biclub, 'x'),
    'CREDIT_LINE_LIMIT_EXCEEDED:AJUSTE_MANUAL');
  PERFORM pg_temp.set_balance(v_biclub, 0);
  PERFORM pg_temp.assert_rejects('ACREDITAR saldo a BI Club sin deuda',
    format('SELECT * FROM register_bank_balance_credit(%L, 100, CURRENT_DATE, pg_temp.admin_id())', v_biclub),
    'CREDIT_LINE_NO_DEBT:ACREDITACION_SALDO');

  -- Límite configurable: una sola fuente de verdad (banks.max_balance)
  UPDATE banks SET max_balance = 80000 WHERE id = v_biclub;
  PERFORM pg_temp.set_balance(v_industrial, 100000);
  PERFORM register_bank_transfer(v_industrial, v_biclub, 80000, CURRENT_DATE, pg_temp.admin_id());
  PERFORM pg_temp.assert_eq('LÍMITE CONFIGURABLE Q80,000', pg_temp.balance(v_biclub), -80000);
  UPDATE banks SET max_balance = 75000 WHERE id = v_biclub;
  PERFORM pg_temp.set_balance(v_biclub, 0);

  -- La foto diaria del cierre admite el saldo negativo de BI Club
  PERFORM pg_temp.set_balance(v_biclub, -25000);
  PERFORM save_bank_balance(v_biclub, CURRENT_DATE, NULL, pg_temp.admin_id());
  PERFORM pg_temp.assert_eq('FOTO DIARIA BI Club negativa',
    (SELECT final_balance FROM bank_balances WHERE bank_id = v_biclub AND operation_date = CURRENT_DATE), -25000);
  PERFORM pg_temp.assert_rejects('FOTO DIARIA negativa en cuenta normal',
    format('SELECT save_bank_balance(%L, CURRENT_DATE, -1, pg_temp.admin_id())', v_normal),
    'INVALID_FINAL_BALANCE');
  PERFORM pg_temp.set_balance(v_biclub, 0);

  -- CASO 15 — Otro banco → BI Club (rechazado)
  PERFORM pg_temp.set_balance(v_normal, 5000);
  PERFORM pg_temp.assert_rejects('CASO 15 otro banco → BI Club',
    format('SELECT register_bank_transfer(%L, %L, 100, CURRENT_DATE, pg_temp.admin_id())', v_normal, v_biclub),
    'TRANSFER_ORIGIN_NOT_ALLOWED:BI_CLUB');
  PERFORM pg_temp.assert_rejects('CASO 15b Agromercantil → BI Club',
    format('SELECT register_bank_transfer(%L, %L, 100, CURRENT_DATE, pg_temp.admin_id())', v_agro, v_biclub),
    'TRANSFER_ORIGIN_NOT_ALLOWED:BI_CLUB');

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
  PERFORM pg_temp.set_balance(v_biclub, -1000);
  PERFORM pg_temp.set_balance(v_industrial, 0);
  PERFORM pg_temp.assert_rejects('BI Club → otro banco',
    format('SELECT register_bank_transfer(%L, %L, 100, CURRENT_DATE, pg_temp.admin_id())', v_biclub, v_normal),
    'TRANSFER_DESTINATION_NOT_ALLOWED:BI_CLUB');
  PERFORM pg_temp.assert_rejects('BI Club → retiro de efectivo',
    format('SELECT register_bank_transfer(%L, NULL, 100, CURRENT_DATE, pg_temp.admin_id())', v_biclub),
    'TRANSFER_DESTINATION_NOT_ALLOWED:BI_CLUB');
  PERFORM register_bank_transfer(v_biclub, v_industrial, 400, CURRENT_DATE, pg_temp.admin_id());
  PERFORM pg_temp.assert_eq('BI Club → Banco Industrial (origen)', pg_temp.balance(v_biclub), -600);
  PERFORM pg_temp.assert_eq('BI Club → Banco Industrial (destino)', pg_temp.balance(v_industrial), 400);
  PERFORM pg_temp.set_balance(v_biclub, 0);

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
