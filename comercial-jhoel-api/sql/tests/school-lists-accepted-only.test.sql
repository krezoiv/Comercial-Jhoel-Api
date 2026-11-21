-- Caja de Listas: solo listas ACEPTADAS y pagos reales (migración 1760009000000).
-- Una cotización no es dinero; una lista aceptada tampoco lo es por sí sola.
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/school-lists-accepted-only.test.sql

BEGIN;

CREATE FUNCTION pg_temp.user_with(p_role TEXT) RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id WHERE r.name = p_role AND u.is_active ORDER BY u.created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.err(p_sql TEXT) RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE p_sql;
  RETURN 'OK';
EXCEPTION WHEN OTHERS THEN
  RETURN SQLERRM;
END $$;

CREATE FUNCTION pg_temp.expect(p_label TEXT, p_actual TEXT, p_expected TEXT) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  IF p_actual IS DISTINCT FROM p_expected THEN
    RAISE EXCEPTION 'FALLÓ %: se esperaba %, se obtuvo %', p_label, p_expected, p_actual;
  END IF;
  RAISE NOTICE 'OK  %', p_label;
END $$;

CREATE FUNCTION pg_temp.quote(p_total NUMERIC, p_advance JSONB DEFAULT NULL, p_phone TEXT DEFAULT '5917-1000') RETURNS JSONB LANGUAGE sql AS $$
  SELECT jsonb_build_object('customerName', 'Juan Pérez', 'customerPhone', p_phone,
                            'studentName', 'Luis Pérez', 'grade', 'Primero Básico',
                            'items', jsonb_build_array(jsonb_build_object(
                              'productName', 'Útiles escolares', 'quantity', 1, 'unitPrice', p_total)),
                            'advance', p_advance)
$$;

-- Lo que la Caja de Listas y el tablero cuentan (mismas reglas que el API).
CREATE FUNCTION pg_temp.figures(p_ids UUID[]) RETURNS TEXT LANGUAGE sql AS $$
  SELECT 'aceptado ' || COALESCE(SUM(q.total) FILTER (WHERE school_quotation_status_accepted(q.status)), 0)
      || ' · recaudado ' || COALESCE(SUM(school_quotation_paid(q.id)), 0)
      || ' · pendiente ' || COALESCE(SUM(q.total - school_quotation_paid(q.id))
                                        FILTER (WHERE school_quotation_status_accepted(q.status)), 0)
      || ' · cotizado sin aceptar ' || COALESCE(SUM(q.total) FILTER (WHERE q.status = 'COTIZADA'), 0)
    FROM school_quotations q WHERE q.id = ANY (p_ids)
$$;

DO $$
DECLARE
  v_admin UUID := COALESCE(pg_temp.user_with('ADMIN'), pg_temp.user_with('SUPER_ADMIN'));
  v_user UUID := pg_temp.user_with('USER');
  v_bank UUID;
  v_cash0 NUMERIC := school_cash_balance();
  v_movs0 BIGINT := (SELECT count(*) FROM school_cash_movements);
  v_q UUID;
  v_q2 UUID;
  v_q3 UUID;
  v_qa UUID;
  v_p UUID;
  v_retry UUID;
  v_bank0 NUMERIC;
BEGIN
  IF v_user IS NULL OR v_admin IS NULL THEN
    RAISE EXCEPTION 'Se necesitan usuarios ADMIN/SUPER_ADMIN y USER activos';
  END IF;
  SELECT id INTO v_bank FROM banks WHERE is_active AND special_account IS NULL ORDER BY name, id LIMIT 1;

  -- ── Prueba 1: una cotización de Q1,000 no mueve la caja ─────────────────────────
  v_q := create_school_quotation(pg_temp.quote(1000), v_user, 'SLA-Q1-000001');
  PERFORM pg_temp.expect('P1a la lista nueva es una COTIZACIÓN', (SELECT status FROM school_quotations WHERE id = v_q), 'COTIZADA');
  PERFORM pg_temp.expect('P1b la Caja de Listas sigue igual', (school_cash_balance() = v_cash0 AND
    (SELECT count(*) FROM school_cash_movements) = v_movs0)::TEXT, 'true');
  PERFORM pg_temp.expect('P1c nada vendido, cobrado ni pendiente', pg_temp.figures(ARRAY[v_q]),
    'aceptado 0 · recaudado 0.00 · pendiente 0 · cotizado sin aceptar 1000.00');

  -- ── Prueba 2: varias cotizaciones tampoco suman ─────────────────────────────────
  v_q2 := create_school_quotation(pg_temp.quote(450), v_user, 'SLA-Q2-000001');
  v_q3 := create_school_quotation(pg_temp.quote(275.50), v_user, 'SLA-Q3-000001');
  PERFORM pg_temp.expect('P2 tres cotizaciones: Q0 aceptado, Q0 pendiente', pg_temp.figures(ARRAY[v_q, v_q2, v_q3]),
    'aceptado 0 · recaudado 0.00 · pendiente 0 · cotizado sin aceptar 1725.50');

  -- ── Prueba 7: una cotización no recibe pagos (tampoco por el API) ───────────────
  PERFORM pg_temp.expect('P7 pago a una cotización: rechazado',
    pg_temp.err(format($f$SELECT register_school_quotation_payment(%L, 300, 'EFECTIVO', NULL, NULL, NULL, %L, 'SLA-P7-000001')$f$, v_q, v_user)),
    'SCHOOL_QUOTE_NOT_ACCEPTED:COTIZADA');
  PERFORM pg_temp.expect('P7b … y no dejó rastro', (SELECT count(*)::TEXT FROM school_quotation_payments WHERE quotation_id = v_q), '0');
  PERFORM pg_temp.expect('P7c no se puede preparar una cotización',
    split_part(pg_temp.err(format($f$SELECT change_school_quotation_status(%L, 'PREPARAR', %L, NULL)$f$, v_q, v_user)), ':', 1),
    'SCHOOL_QUOTE_INVALID_TRANSITION');

  -- ── Prueba 3: aceptar no es dinero ──────────────────────────────────────────────
  PERFORM change_school_quotation_status(v_q, 'ACEPTAR', v_user, NULL);
  PERFORM pg_temp.expect('P3a ACEPTAR: COTIZADA → ACEPTADA', (SELECT status FROM school_quotations WHERE id = v_q), 'ACEPTADA');
  PERFORM pg_temp.expect('P3b recaudado Q0 y pendiente Q1,000', pg_temp.figures(ARRAY[v_q]),
    'aceptado 1000.00 · recaudado 0.00 · pendiente 1000.00 · cotizado sin aceptar 0');
  PERFORM pg_temp.expect('P3c la caja no se movió al aceptar', (school_cash_balance() = v_cash0)::TEXT, 'true');
  PERFORM pg_temp.expect('P3d el historial guarda la aceptación con su total',
    (SELECT from_status || '→' || to_status || ' ' || (details->>'total') FROM school_list_history
      WHERE entity_id = v_q AND action = 'ACEPTAR'), 'COTIZADA→ACEPTADA 1000.00');
  PERFORM pg_temp.expect('P3e aceptar dos veces no es válido',
    split_part(pg_temp.err(format($f$SELECT change_school_quotation_status(%L, 'ACEPTAR', %L, NULL)$f$, v_q, v_user)), ':', 1),
    'SCHOOL_QUOTE_INVALID_TRANSITION');

  -- ── Prueba 4: anticipo Q300 ─────────────────────────────────────────────────────
  v_p := register_school_quotation_payment(v_q, 300, 'EFECTIVO', NULL, NULL, NULL, v_user, 'SLA-P4-000001');
  PERFORM pg_temp.expect('P4a recaudado Q300, pendiente Q700', pg_temp.figures(ARRAY[v_q]),
    'aceptado 1000.00 · recaudado 300.00 · pendiente 700.00 · cotizado sin aceptar 0');
  PERFORM pg_temp.expect('P4b la caja sube SOLO Q300', (school_cash_balance() - v_cash0)::TEXT, '300.00');

  -- ── Prueba 8: el mismo pago no se cuenta dos veces ──────────────────────────────
  v_retry := register_school_quotation_payment(v_q, 300, 'EFECTIVO', NULL, NULL, NULL, v_user, 'SLA-P4-000001');
  PERFORM pg_temp.expect('P8 reintento: mismo pago, la caja no se duplica',
    (v_retry = v_p)::TEXT || ' ' || (school_cash_balance() - v_cash0) || ' ' ||
    (SELECT count(*) FROM school_cash_movements WHERE payment_id = v_p), 'true 300.00 1');

  -- ── Prueba 5: abono Q200 ────────────────────────────────────────────────────────
  PERFORM register_school_quotation_payment(v_q, 200, 'EFECTIVO', NULL, NULL, NULL, v_user, 'SLA-P5-000001');
  PERFORM pg_temp.expect('P5 recaudado Q500, pendiente Q500', pg_temp.figures(ARRAY[v_q]),
    'aceptado 1000.00 · recaudado 500.00 · pendiente 500.00 · cotizado sin aceptar 0');

  -- ── Prueba 9: transferencia — banco, no caja; sin duplicar ─────────────────────
  v_bank0 := (SELECT final_balance FROM banks WHERE id = v_bank);
  v_p := register_school_quotation_payment(v_q, 100, 'TRANSFERENCIA', v_bank, 'BI-1', NULL, v_user, 'SLA-P9-000001');
  PERFORM pg_temp.expect('P9a transferencia: el banco sube Q100 y la caja no cambia',
    ((SELECT final_balance FROM banks WHERE id = v_bank) - v_bank0) || ' ' || (school_cash_balance() - v_cash0), '100.00 500.00');
  PERFORM pg_temp.expect('P9b queda pendiente de trasladar (un solo registro)',
    (SELECT count(*) || ' ' || sum(pending) FROM school_cash_pending_receipts WHERE payment_id = v_p), '1 100.00');

  -- ── Prueba 6: pago final ────────────────────────────────────────────────────────
  PERFORM register_school_quotation_payment(v_q, 400, 'EFECTIVO', NULL, NULL, NULL, v_user, 'SLA-P6-000001');
  PERFORM pg_temp.expect('P6a recaudado Q1,000, pendiente Q0', pg_temp.figures(ARRAY[v_q]),
    'aceptado 1000.00 · recaudado 1000.00 · pendiente 0.00 · cotizado sin aceptar 0');
  PERFORM pg_temp.expect('P6b no se puede pagar de más',
    split_part(pg_temp.err(format($f$SELECT register_school_quotation_payment(%L, 1, 'EFECTIVO', NULL, NULL, NULL, %L, 'SLA-P6-000002')$f$, v_q, v_user)), ':', 1),
    'SCHOOL_PAYMENT_EXCEEDS_BALANCE');

  -- ── Con anticipo al crear: aceptada (decisión del dueño) ────────────────────────
  v_qa := create_school_quotation(pg_temp.quote(600, '{"amount": 150, "paymentMethod": "EFECTIVO"}'), v_user, 'SLA-QA-000001');
  PERFORM pg_temp.expect('A1 guardada con anticipo: ACEPTADA con su pago',
    (SELECT status FROM school_quotations WHERE id = v_qa) || ' ' || school_quotation_paid(v_qa), 'ACEPTADA 150.00');
  PERFORM pg_temp.expect('A2 su historial de creación ya dice ACEPTADA',
    (SELECT to_status FROM school_list_history WHERE entity_id = v_qa AND action = 'CREADA'), 'ACEPTADA');
  PERFORM pg_temp.expect('A3 un borrador confirmado es cotización, no aceptada',
    (SELECT change_school_quotation_status(
       create_school_quotation(pg_temp.quote(90) || '{"asDraft": true}'::jsonb, v_user, 'SLA-QD-000001'), 'CONFIRMAR', v_user, NULL)),
    'COTIZADA');

  -- ── Anular todos los pagos de una lista aceptada: sigue aceptada ────────────────
  PERFORM void_school_quotation_payment(
    (SELECT id FROM school_quotation_payments WHERE quotation_id = v_qa AND kind = 'ANTICIPO'), 'Anticipo duplicado', v_admin, 'SLA-V-000001');
  PERFORM pg_temp.expect('L1 sin pagos vuelve a ACEPTADA (nunca a cotización)',
    (SELECT status FROM school_quotations WHERE id = v_qa), 'ACEPTADA');
  -- Lista antigua (flujo de confirmación): su estado de pago la llevaba a ANTICIPO_RECIBIDO.
  PERFORM register_school_quotation_payment(v_qa, 50, 'EFECTIVO', NULL, NULL, NULL, v_user, 'SLA-L2-000001');
  UPDATE school_quotations SET status = 'ANTICIPO_RECIBIDO' WHERE id = v_qa;
  PERFORM void_school_quotation_payment(
    (SELECT id FROM school_quotation_payments WHERE idempotency_key = 'SLA-L2-000001'), 'Pago repetido', v_admin, 'SLA-V-000002');
  PERFORM pg_temp.expect('L2 una lista antigua sin pagos queda ACEPTADA, no COTIZADA',
    (SELECT status FROM school_quotations WHERE id = v_qa), 'ACEPTADA');

  -- ── Devolver a cotización (corrección auditada de las aceptadas por error) ─────
  PERFORM change_school_quotation_status(v_q2, 'ACEPTAR', v_user, NULL);
  PERFORM pg_temp.expect('R1 un cajero no puede devolverla',
    split_part(pg_temp.err(format($f$SELECT revert_school_quotation_to_quote(%L, 'No aceptó', %L, NULL)$f$, v_q2, v_user)), ':', 1),
    'SCHOOL_LIST_FORBIDDEN');
  PERFORM pg_temp.expect('R2 el motivo es obligatorio',
    pg_temp.err(format($f$SELECT revert_school_quotation_to_quote(%L, 'no', %L, NULL)$f$, v_q2, v_admin)), 'SCHOOL_REASON_REQUIRED');
  PERFORM pg_temp.expect('R3 sin pagos ni preparación: vuelve a COTIZADA',
    revert_school_quotation_to_quote(v_q2, 'El cliente solo pidió la cotización', v_admin, NULL), 'COTIZADA');
  PERFORM pg_temp.expect('R4 queda auditado con el motivo',
    (SELECT from_status || '→' || to_status || ' ' || (details->>'reason') FROM school_list_history
      WHERE entity_id = v_q2 AND action = 'DEVUELTA_COTIZACION'), 'ACEPTADA→COTIZADA El cliente solo pidió la cotización');
  PERFORM pg_temp.expect('R5 con pagos no se puede',
    pg_temp.err(format($f$SELECT revert_school_quotation_to_quote(%L, 'No aceptó nunca', %L, NULL)$f$, v_q, v_admin)),
    'SCHOOL_QUOTE_REVERT_NOT_ALLOWED:payments');
  PERFORM change_school_quotation_status(v_q3, 'ACEPTAR', v_user, NULL);
  PERFORM change_school_quotation_status(v_q3, 'PREPARAR', v_user, NULL);
  PERFORM pg_temp.expect('R6 en preparación no se puede',
    pg_temp.err(format($f$SELECT revert_school_quotation_to_quote(%L, 'No aceptó nunca', %L, NULL)$f$, v_q3, v_admin)),
    'SCHOOL_QUOTE_REVERT_NOT_ALLOWED:status');
  PERFORM pg_temp.expect('R7 la lista devuelta ya no es venta ni deuda', pg_temp.figures(ARRAY[v_q2]),
    'aceptado 0 · recaudado 0.00 · pendiente 0 · cotizado sin aceptar 450.00');

  RAISE NOTICE 'Todas las pruebas de "solo listas aceptadas" pasaron.';
END $$;

ROLLBACK;
