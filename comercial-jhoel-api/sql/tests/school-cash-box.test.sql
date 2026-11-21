-- Caja de Listas Escolares (migración 1760008700000-SchoolListCashBox): pagos en efectivo,
-- pagos bancarios pendientes de traslado, traslados (parciales, idempotentes, anulables),
-- anulaciones, devoluciones, salidas, ajustes, arqueos, permisos e inmutabilidad.
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK: no deja ningún dato.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/school-cash-box.test.sql

BEGIN;

CREATE FUNCTION pg_temp.user_with(p_role TEXT) RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id WHERE r.name = p_role AND u.is_active ORDER BY u.created_at LIMIT 1
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

-- A requirement-mode list (no template) for the given total.
CREATE FUNCTION pg_temp.quote(p_total NUMERIC, p_advance JSONB DEFAULT NULL) RETURNS JSONB LANGUAGE sql AS $$
  SELECT jsonb_build_object('customerName', 'María López', 'customerPhone', '5555-1234',
                            'studentName', 'Ana López', 'grade', 'Primero Básico',
                            'items', jsonb_build_array(jsonb_build_object(
                              'productName', 'Útiles escolares', 'quantity', 1, 'unitPrice', p_total)),
                            'advance', p_advance)
$$;

CREATE FUNCTION pg_temp.bank_balance(p_bank UUID) RETURNS NUMERIC LANGUAGE sql AS $$
  SELECT final_balance FROM banks WHERE id = p_bank
$$;

CREATE FUNCTION pg_temp.receipt(p_payment UUID) RETURNS RECORD LANGUAGE sql AS $$
  SELECT id, pending, transfer_status FROM school_cash_pending_receipts WHERE payment_id = p_payment
$$;

DO $$
DECLARE
  v_super UUID := pg_temp.user_with('SUPER_ADMIN');
  v_admin UUID := COALESCE(pg_temp.user_with('ADMIN'), pg_temp.user_with('SUPER_ADMIN'));
  v_user UUID := pg_temp.user_with('USER');
  v_bank UUID;
  v_other_bank UUID;
  v_genesis UUID;
  v_bank0 NUMERIC;
  v_q UUID;
  v_q2 UUID;
  v_cash_payment UUID;
  v_bank_payment UUID;
  v_card_payment UUID;
  v_receipt UUID;
  v_transfer UUID;
  v_transfer_again UUID;
  v_exit UUID;
  v_adjustment UUID;
  v_count UUID;
  v_rows BIGINT;
  v_movements_before BIGINT;
  v_text TEXT;
BEGIN
  IF v_user IS NULL OR v_admin IS NULL THEN
    RAISE EXCEPTION 'Se necesitan usuarios ADMIN/SUPER_ADMIN y USER activos';
  END IF;
  SELECT id INTO v_bank FROM banks WHERE is_active AND special_account IS NULL ORDER BY name, id LIMIT 1;
  SELECT id INTO v_other_bank FROM banks WHERE is_active AND special_account IS NULL AND id <> v_bank ORDER BY name, id LIMIT 1;
  SELECT id INTO v_genesis FROM banks WHERE special_account = 'GENESIS' LIMIT 1;
  v_bank0 := pg_temp.bank_balance(v_bank);
  PERFORM pg_temp.expect('La caja arranca sin movimientos en esta prueba',
    (SELECT count(*) FROM school_cash_movements)::TEXT, (SELECT count(*) FROM school_cash_movements)::TEXT);
  v_movements_before := (SELECT count(*) FROM school_cash_movements);

  -- 1. Anticipo en efectivo al crear: entra a la Caja de Listas.
  v_q := create_school_quotation(pg_temp.quote(850, '{"amount": 300, "paymentMethod": "EFECTIVO"}'), v_user, 'SCB-Q1-0001');
  SELECT id INTO v_cash_payment FROM school_quotation_payments WHERE quotation_id = v_q AND kind = 'ANTICIPO';
  PERFORM pg_temp.expect('1. anticipo en efectivo → PAGO_EFECTIVO entrada 300',
    (SELECT movement_type || ' ' || direction || ' ' || amount FROM school_cash_movements WHERE payment_id = v_cash_payment),
    'PAGO_EFECTIVO IN 300.00');
  PERFORM pg_temp.expect('1. saldo de caja = 300 (+ saldo previo)', (school_cash_balance() -
    COALESCE((SELECT balance_before FROM school_cash_movements WHERE payment_id = v_cash_payment), 0))::TEXT, '300.00');
  PERFORM pg_temp.expect('1. la cotización sigue con saldo 550',
    (SELECT (total - school_quotation_paid(id))::TEXT FROM school_quotations WHERE id = v_q), '550.00');

  -- 2-3. Pago bancario: banco obligatorio y solo cuentas normales.
  PERFORM pg_temp.expect('2. transferencia sin banco',
    pg_temp.err(format($f$SELECT register_school_quotation_payment(%L, 500, 'TRANSFERENCIA', NULL, 'REF1', NULL, %L, 'SCB-P-NOBANK')$f$, v_q, v_user)),
    'SCHOOL_CASH_BANK_REQUIRED');
  IF v_genesis IS NOT NULL THEN
    PERFORM pg_temp.expect('3. transferencia a la línea Génesis',
      pg_temp.err(format($f$SELECT register_school_quotation_payment(%L, 500, 'TRANSFERENCIA', %L, 'REF1', NULL, %L, 'SCB-P-GENESIS')$f$, v_q, v_genesis, v_user)),
      'SCHOOL_CASH_BANK_NOT_ALLOWED');
  END IF;

  -- 4. Transferencia de 500: el banco sube, la caja no; queda pendiente de traslado.
  v_bank_payment := register_school_quotation_payment(v_q, 500, 'TRANSFERENCIA', v_bank, 'BI-778899', NULL, v_user, 'SCB-P-BANK-01');
  PERFORM pg_temp.expect('4. banco +500', (pg_temp.bank_balance(v_bank) - v_bank0)::TEXT, '500.00');
  PERFORM pg_temp.expect('4. movimiento bancario PAGO_LISTA_ESCOLAR',
    (SELECT movement_type || ' ' || origin || ' ' || amount FROM bank_account_movements
      WHERE reference_type = 'SCHOOL_PAYMENT' AND reference_id = v_bank_payment),
    'PAGO_LISTA_ESCOLAR LISTAS_ESCOLARES 500.00');
  PERFORM pg_temp.expect('4. Kardex: PAGO_TRANSFERENCIA sin efecto en el efectivo',
    (SELECT movement_type || ' ' || direction || ' ' || (balance_after - balance_before) FROM school_cash_movements WHERE payment_id = v_bank_payment),
    'PAGO_TRANSFERENCIA NONE 0.00');
  SELECT id INTO v_receipt FROM school_cash_pending_receipts WHERE payment_id = v_bank_payment;
  PERFORM pg_temp.expect('4. pendiente de traslado 500 PENDIENTE',
    (SELECT pending || ' ' || transfer_status FROM school_cash_pending_receipts WHERE id = v_receipt), '500.00 PENDIENTE');

  -- 5. Tarjeta: recaudado, fuera de la caja y sin banco.
  v_rows := (SELECT count(*) FROM bank_account_movements);
  v_card_payment := register_school_quotation_payment(v_q, 50, 'TARJETA', NULL, NULL, NULL, v_user, 'SCB-P-CARD-01');
  PERFORM pg_temp.expect('5. tarjeta → PAGO_OTRO_MEDIO sin efecto',
    (SELECT movement_type || ' ' || direction FROM school_cash_movements WHERE payment_id = v_card_payment), 'PAGO_OTRO_MEDIO NONE');
  PERFORM pg_temp.expect('5. tarjeta no mueve bancos', (SELECT count(*) FROM bank_account_movements)::TEXT, v_rows::TEXT);
  PERFORM pg_temp.expect('5. recaudado de la lista = 850 (pagada)',
    (SELECT school_quotation_paid(v_q)::TEXT), '850.00');

  -- 6. Permisos: un USER no traslada ni ajusta.
  PERFORM pg_temp.expect('6. USER no traslada',
    pg_temp.err(format($f$SELECT register_school_cash_transfer(%L, %L, NULL, NULL, %L, 'SCB-T-USER-1')$f$,
      v_bank, jsonb_build_array(jsonb_build_object('movementId', v_receipt, 'amount', 100)), v_user)),
    'SCHOOL_LIST_FORBIDDEN');
  PERFORM pg_temp.expect('6. USER no ajusta',
    pg_temp.err(format($f$SELECT register_school_cash_adjustment('IN', 10, 'Ajuste de prueba', %L, 'SCB-ADJ-USER')$f$, v_user)),
    'SCHOOL_LIST_FORBIDDEN');

  -- 7. Traslado parcial 200: banco −200, caja +200, pendiente 300.
  v_text := (school_cash_balance())::TEXT;
  v_transfer := register_school_cash_transfer(v_bank,
    jsonb_build_array(jsonb_build_object('movementId', v_receipt, 'amount', 200)), 'BOLETA-1', 'Primer traslado', v_admin, 'SCB-T-0001');
  PERFORM pg_temp.expect('7. banco: +500 −200', (pg_temp.bank_balance(v_bank) - v_bank0)::TEXT, '300.00');
  PERFORM pg_temp.expect('7. caja +200', (school_cash_balance() - v_text::NUMERIC)::TEXT, '200.00');
  PERFORM pg_temp.expect('7. pendiente 300 TRASLADO_PARCIAL',
    (SELECT pending || ' ' || transfer_status FROM school_cash_pending_receipts WHERE id = v_receipt), '300.00 TRASLADO_PARCIAL');
  PERFORM pg_temp.expect('7. el traslado NO cambia lo recaudado', (SELECT school_quotation_paid(v_q)::TEXT), '850.00');
  PERFORM pg_temp.expect('7. traslado ligado al pago original',
    (SELECT count(*)::TEXT FROM school_cash_receipt_applications WHERE transfer_id = v_transfer AND receipt_movement_id = v_receipt), '1');

  -- 8. Idempotencia: la misma solicitud devuelve el mismo traslado.
  v_transfer_again := register_school_cash_transfer(v_bank,
    jsonb_build_array(jsonb_build_object('movementId', v_receipt, 'amount', 200)), 'BOLETA-1', 'Primer traslado', v_admin, 'SCB-T-0001');
  PERFORM pg_temp.expect('8. doble clic: mismo traslado', (v_transfer_again = v_transfer)::TEXT, 'true');
  PERFORM pg_temp.expect('8. doble clic: un solo movimiento de caja',
    (SELECT count(*)::TEXT FROM school_cash_movements WHERE transfer_id = v_transfer), '1');

  -- 9. Nunca más de lo pendiente, ni de otro banco, ni sin fondos en el banco.
  PERFORM pg_temp.expect('9. trasladar 301 de 300 pendientes',
    pg_temp.err(format($f$SELECT register_school_cash_transfer(%L, %L, NULL, NULL, %L, 'SCB-T-OVER-1')$f$,
      v_bank, jsonb_build_array(jsonb_build_object('movementId', v_receipt, 'amount', 301)), v_admin)),
    'SCHOOL_CASH_TRANSFER_EXCEEDS_PENDING');
  IF v_other_bank IS NOT NULL THEN
    PERFORM pg_temp.expect('9. traslado desde otro banco',
      pg_temp.err(format($f$SELECT register_school_cash_transfer(%L, %L, NULL, NULL, %L, 'SCB-T-MISMATCH')$f$,
        v_other_bank, jsonb_build_array(jsonb_build_object('movementId', v_receipt, 'amount', 10)), v_admin)),
      'SCHOOL_CASH_TRANSFER_BANK_MISMATCH');
  END IF;
  PERFORM pg_temp.expect('9. pago repetido en el traslado',
    pg_temp.err(format($f$SELECT register_school_cash_transfer(%L, %L, NULL, NULL, %L, 'SCB-T-DUP-01')$f$,
      v_bank, jsonb_build_array(jsonb_build_object('movementId', v_receipt, 'amount', 10),
                                jsonb_build_object('movementId', v_receipt, 'amount', 10)), v_admin)),
    'SCHOOL_CASH_TRANSFER_DUPLICATE');
  PERFORM adjust_bank_balance(v_bank, 100, CURRENT_DATE, v_admin, 'Prueba: banco sin fondos', NULL);
  PERFORM pg_temp.expect('9. el banco no tiene los 300',
    pg_temp.err(format($f$SELECT register_school_cash_transfer(%L, %L, NULL, NULL, %L, 'SCB-T-NOFUNDS')$f$,
      v_bank, jsonb_build_array(jsonb_build_object('movementId', v_receipt, 'amount', 300)), v_admin)),
    'INSUFFICIENT_BALANCE');
  PERFORM adjust_bank_balance(v_bank, v_bank0 + 300, CURRENT_DATE, v_admin, 'Prueba: saldo restaurado', NULL);

  -- 10. Un pago ya trasladado no se anula.
  PERFORM pg_temp.expect('10. anular un pago con traslado',
    pg_temp.err(format($f$SELECT void_school_quotation_payment(%L, 'Pago duplicado', %L, 'SCB-V-BANK-1')$f$, v_bank_payment, v_admin)),
    'SCHOOL_CASH_PAYMENT_TRANSFERRED');

  -- 11. Anular el traslado (admin): banco +200, caja −200, vuelve a quedar pendiente 500.
  v_text := (school_cash_balance())::TEXT;
  PERFORM pg_temp.expect('11. USER no anula traslados',
    pg_temp.err(format($f$SELECT void_school_cash_transfer(%L, 'Traslado equivocado', %L)$f$, v_transfer, v_user)),
    'SCHOOL_LIST_FORBIDDEN');
  PERFORM void_school_cash_transfer(v_transfer, 'Traslado equivocado', v_admin);
  PERFORM pg_temp.expect('11. banco recupera los 200', (pg_temp.bank_balance(v_bank) - v_bank0)::TEXT, '500.00');
  PERFORM pg_temp.expect('11. caja −200', (v_text::NUMERIC - school_cash_balance())::TEXT, '200.00');
  PERFORM pg_temp.expect('11. pendiente 500 de nuevo',
    (SELECT pending || ' ' || transfer_status FROM school_cash_pending_receipts WHERE id = v_receipt), '500.00 PENDIENTE');
  PERFORM pg_temp.expect('11. reversión auditada (original REVERTIDO + REVERSION)',
    (SELECT string_agg(movement_type || ':' || status, ',' ORDER BY sequence) FROM school_cash_movements WHERE transfer_id = v_transfer),
    'TRASLADO_BANCO:REVERTIDO,REVERSION:APLICADO');
  PERFORM pg_temp.expect('11. no se anula dos veces',
    pg_temp.err(format($f$SELECT void_school_cash_transfer(%L, 'Otra vez', %L)$f$, v_transfer, v_admin)),
    'SCHOOL_CASH_ALREADY_REVERSED');

  -- 12. Anular el pago bancario (sin traslado): banco −500, ya no está pendiente.
  PERFORM void_school_quotation_payment(v_bank_payment, 'Pago registrado por error', v_admin, 'SCB-V-BANK-2');
  PERFORM pg_temp.expect('12. banco vuelve al saldo inicial', (pg_temp.bank_balance(v_bank) - v_bank0)::TEXT, '0.00');
  PERFORM pg_temp.expect('12. recibo ANULADO, nada pendiente',
    (SELECT pending || ' ' || transfer_status FROM school_cash_pending_receipts WHERE id = v_receipt), '0.00 ANULADO');
  PERFORM pg_temp.expect('12. recaudado 350 (300 efectivo + 50 tarjeta)', (SELECT school_quotation_paid(v_q)::TEXT), '350.00');

  -- 13. Salidas: motivo obligatorio, nunca más que el efectivo, depósito a banco suma al banco.
  PERFORM pg_temp.expect('13. salida sin motivo',
    pg_temp.err(format($f$SELECT register_school_cash_exit(10, 'OTRO', NULL, NULL, '', NULL, %L, 'SCB-E-NOREASON')$f$, v_admin)),
    'SCHOOL_REASON_REQUIRED');
  PERFORM pg_temp.expect('13. salida mayor al efectivo',
    pg_temp.err(format($f$SELECT register_school_cash_exit(%s, 'OTRO', NULL, NULL, 'Sin fondos', NULL, %L, 'SCB-E-TOOMUCH')$f$,
      school_cash_balance() + 1, v_admin)),
    'SCHOOL_CASH_INSUFFICIENT');
  PERFORM pg_temp.expect('13. USER no registra salidas',
    pg_temp.err(format($f$SELECT register_school_cash_exit(10, 'OTRO', NULL, NULL, 'Motivo válido', NULL, %L, 'SCB-E-USER-1')$f$, v_user)),
    'SCHOOL_LIST_FORBIDDEN');
  v_text := (school_cash_balance())::TEXT;
  v_exit := register_school_cash_exit(100, 'DEPOSITO_BANCARIO', v_bank, 'Banco', 'Depósito del efectivo de listas', 'DEP-1', v_admin, 'SCB-E-0001');
  PERFORM pg_temp.expect('13. depósito: caja −100', (v_text::NUMERIC - school_cash_balance())::TEXT, '100.00');
  PERFORM pg_temp.expect('13. depósito: banco +100', (pg_temp.bank_balance(v_bank) - v_bank0)::TEXT, '100.00');
  PERFORM void_school_cash_exit(v_exit, 'Depósito no realizado', v_admin);
  PERFORM pg_temp.expect('13. anular salida: caja y banco vuelven', (v_text::NUMERIC - school_cash_balance())::TEXT
    || ' ' || (pg_temp.bank_balance(v_bank) - v_bank0)::TEXT, '0.00 0.00');

  -- 14. Ajuste autorizado y su reversión.
  v_text := (school_cash_balance())::TEXT;
  v_adjustment := register_school_cash_adjustment('IN', 25.50, 'Saldo inicial contado', v_admin, 'SCB-ADJ-0001');
  PERFORM pg_temp.expect('14. ajuste +25.50', (school_cash_balance() - v_text::NUMERIC)::TEXT, '25.50');
  PERFORM void_school_cash_adjustment(v_adjustment, 'Ajuste duplicado', v_admin);
  PERFORM pg_temp.expect('14. ajuste revertido', (school_cash_balance() - v_text::NUMERIC)::TEXT, '0.00');
  PERFORM pg_temp.expect('14. un pago no se revierte como ajuste',
    pg_temp.err(format($f$SELECT void_school_cash_adjustment(%L, 'No permitido', %L)$f$,
      (SELECT id FROM school_cash_movements WHERE payment_id = v_cash_payment), v_admin)),
    'SCHOOL_CASH_NOT_REVERSIBLE');

  -- 15. Arqueo: diferencia visible, sin ajustar nada.
  PERFORM pg_temp.expect('15. USER no hace arqueos',
    pg_temp.err(format($f$SELECT register_school_cash_count('[]', NULL, %L, 'SCB-C-USER-1')$f$, v_user)), 'SCHOOL_LIST_FORBIDDEN');
  v_rows := (SELECT count(*) FROM school_cash_movements);
  v_count := register_school_cash_count('[{"denomination": 100, "quantity": 2}, {"denomination": 50, "quantity": 1}, {"denomination": 0.01, "quantity": 3}]'::jsonb,
    'Conteo de prueba', v_admin, 'SCB-C-0001');
  PERFORM pg_temp.expect('15. arqueo: contado 250.03 vs teórico',
    (SELECT counted_total || ' ' || (difference = counted_total - theoretical_balance) || ' ' || status FROM school_cash_counts WHERE id = v_count),
    '250.03 true ' || CASE WHEN 250.03 = school_cash_balance() THEN 'CUADRADO' WHEN 250.03 < school_cash_balance() THEN 'FALTANTE' ELSE 'SOBRANTE' END);
  PERFORM pg_temp.expect('15. el arqueo no crea movimientos', (SELECT count(*) FROM school_cash_movements)::TEXT, v_rows::TEXT);
  PERFORM pg_temp.expect('15. denominación inválida',
    pg_temp.err(format($f$SELECT register_school_cash_count('[{"denomination": 3, "quantity": 1}]', NULL, %L, 'SCB-C-BAD-1')$f$, v_admin)),
    'SCHOOL_CASH_INVALID_COUNT');
  PERFORM pg_temp.expect('15. el arqueo es inmutable',
    pg_temp.err(format($f$UPDATE school_cash_counts SET counted_total = 0 WHERE id = %L$f$, v_count)), 'SCHOOL_CASH_IMMUTABLE');

  -- 16. El Kardex no se edita ni se borra.
  PERFORM pg_temp.expect('16. UPDATE de monto',
    pg_temp.err(format($f$UPDATE school_cash_movements SET amount = 1 WHERE payment_id = %L$f$, v_cash_payment)), 'SCHOOL_CASH_IMMUTABLE');
  PERFORM pg_temp.expect('16. DELETE',
    pg_temp.err(format($f$DELETE FROM school_cash_movements WHERE payment_id = %L$f$, v_cash_payment)), 'SCHOOL_CASH_IMMUTABLE');

  -- 17. Anular un pago en efectivo cuando el efectivo ya salió: bloqueado.
  v_exit := register_school_cash_exit(school_cash_balance(), 'ENTREGA_ADMINISTRACION', NULL, 'Gerencia', 'Entrega total del día', NULL, v_admin, 'SCB-E-0002');
  PERFORM pg_temp.expect('17. caja vacía', school_cash_balance()::TEXT, '0.00');
  PERFORM pg_temp.expect('17. anular el anticipo sin efectivo en caja',
    pg_temp.err(format($f$SELECT void_school_quotation_payment(%L, 'Anticipo duplicado', %L, 'SCB-V-CASH-1')$f$, v_cash_payment, v_admin)),
    'SCHOOL_CASH_INSUFFICIENT');
  PERFORM void_school_cash_exit(v_exit, 'Entrega revertida', v_admin);
  PERFORM void_school_quotation_payment(v_cash_payment, 'Anticipo duplicado', v_admin, 'SCB-V-CASH-2');
  PERFORM pg_temp.expect('17. con efectivo, la anulación saca los 300',
    (SELECT direction || ' ' || amount FROM school_cash_movements WHERE reversal_of_id =
      (SELECT id FROM school_cash_movements WHERE payment_id = v_cash_payment)), 'OUT 300.00');

  -- 18. Cancelación con devolución por banco: consume lo pendiente de ESA lista en ese banco.
  v_q2 := create_school_quotation(pg_temp.quote(400), v_user, 'SCB-Q2-0001');
  -- Since 1760009000000 a quotation must be accepted before it is paid.
  PERFORM change_school_quotation_status(v_q2, 'ACEPTAR', v_user, NULL);
  v_bank_payment := register_school_quotation_payment(v_q2, 400, 'DEPOSITO', v_bank, 'BOL-55', NULL, v_user, 'SCB-P-BANK-10');
  PERFORM pg_temp.expect('18. cancelación con devolución en efectivo sin caja',
    pg_temp.err(format($f$SELECT cancel_school_quotation(%L, 'Cliente desistió', 'EFECTIVO', NULL, NULL, %L, 'SCB-CANCEL-1')$f$, v_q2, v_admin)),
    'SCHOOL_CASH_INSUFFICIENT');
  PERFORM cancel_school_quotation(v_q2, 'Cliente desistió', 'TRANSFERENCIA', v_bank, 'DEV-1', v_admin, 'SCB-CANCEL-2');
  PERFORM pg_temp.expect('18. devolución por banco: pendiente DEVUELTO',
    (SELECT pending || ' ' || transfer_status FROM school_cash_pending_receipts WHERE payment_id = v_bank_payment), '0.00 DEVUELTO');
  PERFORM pg_temp.expect('18. devolución por banco: el banco queda igual que antes del pago',
    (pg_temp.bank_balance(v_bank) - v_bank0)::TEXT, '0.00');

  -- 19. Una lista con dinero en la caja no se borra.
  PERFORM pg_temp.expect('19. borrar una lista con movimientos de caja',
    pg_temp.err(format($f$SELECT delete_school_quotation(%L, %L, (SELECT quotation_number FROM school_quotations WHERE id = %L))$f$, v_q, v_super, v_q)),
    'SCHOOL_DELETE_HAS_CASH');
  PERFORM pg_temp.expect('19. borrar todas con movimientos de caja',
    pg_temp.err(format($f$SELECT purge_school_quotations(%L, 'BORRAR TODO')$f$, v_super)), 'SCHOOL_PURGE_HAS_CASH');

  -- 20. Pagos anteriores a la caja: su anulación no toca la caja ni el banco.
  ALTER TABLE school_quotation_payments DISABLE TRIGGER trg_school_cash_on_payment;
  v_q2 := create_school_quotation(pg_temp.quote(90), v_user, 'SCB-Q3-0001');
  PERFORM change_school_quotation_status(v_q2, 'ACEPTAR', v_user, NULL);
  v_cash_payment := register_school_quotation_payment(v_q2, 90, 'EFECTIVO', NULL, NULL, NULL, v_user, 'SCB-P-OLD-01');
  ALTER TABLE school_quotation_payments ENABLE TRIGGER trg_school_cash_on_payment;
  v_rows := (SELECT count(*) FROM school_cash_movements);
  PERFORM void_school_quotation_payment(v_cash_payment, 'Pago histórico anulado', v_admin, 'SCB-V-OLD-01');
  PERFORM pg_temp.expect('20. anular un pago histórico no mueve la caja', (SELECT count(*) FROM school_cash_movements)::TEXT, v_rows::TEXT);

  -- 21. Invariantes del Kardex.
  PERFORM pg_temp.expect('21. saldo = Σ entradas − Σ salidas',
    (SELECT (COALESCE(SUM(CASE direction WHEN 'IN' THEN amount WHEN 'OUT' THEN -amount ELSE 0 END), 0)
             + COALESCE((SELECT balance_before FROM school_cash_movements ORDER BY sequence LIMIT 1), 0))::TEXT
       FROM school_cash_movements), school_cash_balance()::TEXT);
  PERFORM pg_temp.expect('21. cadena de saldos sin huecos',
    (SELECT count(*)::TEXT FROM (
       SELECT balance_before, lag(balance_after) OVER (ORDER BY sequence) AS prev FROM school_cash_movements) t
      WHERE prev IS NOT NULL AND prev <> balance_before), '0');
  PERFORM pg_temp.expect('21. pendiente total = Σ pendiente de los recibos',
    school_cash_pending_total()::TEXT, (SELECT COALESCE(SUM(pending), 0)::NUMERIC(14,2)::TEXT FROM school_cash_pending_receipts));

  -- 22. El cuadre de agentes guarda "listas por trasladar" aparte (9.º parámetro).
  PERFORM pg_temp.expect('22. close_agent_day con 9 parámetros',
    (SELECT pronargs::TEXT FROM pg_proc WHERE proname = 'close_agent_day'), '9');
END $$;

ROLLBACK;
