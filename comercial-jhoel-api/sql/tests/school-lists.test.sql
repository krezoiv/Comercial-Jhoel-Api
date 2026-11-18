-- Listas Escolares: plantillas, cotizaciones, estado de cuenta, estados y reversas
-- (migración 1760007900000-SchoolLists).
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/school-lists.test.sql

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

CREATE FUNCTION pg_temp.errfull(p_sql TEXT) RETURNS TEXT LANGUAGE plpgsql AS $$
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

-- "estado pagado saldo" of a quotation.
CREATE FUNCTION pg_temp.state(p_id UUID) RETURNS TEXT LANGUAGE sql AS $$
  SELECT q.status || ' ' || school_quotation_paid(q.id) || ' ' || (q.total - school_quotation_paid(q.id))
    FROM school_quotations q WHERE q.id = p_id
$$;

CREATE FUNCTION pg_temp.quote(p_template UUID, p_items JSONB, p_extra JSONB DEFAULT '{}'::jsonb) RETURNS JSONB
LANGUAGE sql AS $$
  SELECT jsonb_build_object('templateId', p_template, 'customerName', 'María López',
                            'customerPhone', '5555-1234', 'studentName', 'Ana López',
                            'quotationDate', '2099-01-10', 'items', p_items) || p_extra
$$;

DO $$
DECLARE
  v_super UUID := pg_temp.user_with('SUPER_ADMIN');
  v_admin UUID := COALESCE(pg_temp.user_with('ADMIN'), pg_temp.user_with('SUPER_ADMIN'));
  v_user UUID := pg_temp.user_with('USER');
  v_product UUID;
  v_product_price NUMERIC;
  v_tpl UUID;
  v_tpl_copy UUID;
  v_ti_cuaderno UUID;
  v_ti_lapiz UUID;
  v_q UUID;
  v_q2 UUID;
  v_q3 UUID;
  v_p1 UUID;
  v_p2 UUID;
  v_p3 UUID;
  v_void UUID;
  v_items JSONB;
  v_stock_before BIGINT;
  v_sales_before BIGINT;
  v_version INT;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Se necesita un usuario con rol USER para estas pruebas';
  END IF;
  SELECT id, public_price INTO v_product, v_product_price FROM products WHERE is_active ORDER BY created_at LIMIT 1;
  SELECT COALESCE(SUM(stock), 0) INTO v_stock_before FROM products;
  SELECT count(*) INTO v_sales_before FROM sales;

  -- ── Plantillas ──────────────────────────────────────────────────────────
  PERFORM pg_temp.expect('T1 existen las tres plantillas predeterminadas activas',
    (SELECT string_agg(name, ', ' ORDER BY sort_order) FROM school_list_templates
      WHERE name IN ('Primero Básico','Segundo Básico','Tercero Básico') AND is_active),
    'Primero Básico, Segundo Básico, Tercero Básico');

  SELECT id INTO v_tpl FROM school_list_templates WHERE name = 'Primero Básico';
  v_version := (SELECT version FROM school_list_templates WHERE id = v_tpl);
  PERFORM pg_temp.expect('T2 un USER no administra plantillas',
    pg_temp.err(format($f$SELECT save_school_list_template(%L, '{"name":"Primero Básico","grade":"Primero Básico","items":[]}', %L, NULL)$f$, v_tpl, v_user)),
    'SCHOOL_LIST_FORBIDDEN');
  PERFORM save_school_list_template(v_tpl, jsonb_build_object(
    'name', 'Primero Básico', 'grade', 'Primero Básico', 'items', jsonb_build_array(
      jsonb_build_object('productName', 'Cuaderno mediano', 'quantity', 3, 'unitPrice', 15),
      jsonb_build_object('productName', 'Lápiz', 'quantity', 5, 'unitPrice', 2),
      jsonb_build_object('productName', 'Borrador', 'quantity', 2, 'unitPrice', 3),
      jsonb_build_object('productId', v_product, 'productName', 'Del inventario', 'quantity', 1, 'unitPrice', v_product_price))),
    v_admin, v_version);
  PERFORM pg_temp.expect('T2 la plantilla guarda sus líneas y su subtotal',
    (SELECT count(*) || ' ' || SUM(subtotal) FROM school_list_template_items WHERE template_id = v_tpl),
    '4 ' || (45 + 10 + 6 + v_product_price)::NUMERIC(12,2));
  PERFORM pg_temp.expect('T2 versión vieja → conflicto',
    pg_temp.err(format($f$SELECT save_school_list_template(%L, '{"name":"Primero Básico","grade":"Primero Básico","items":[]}', %L, %s)$f$, v_tpl, v_admin, v_version)),
    'SCHOOL_VERSION_CONFLICT');
  PERFORM pg_temp.expect('T2 nombre repetido',
    pg_temp.err(format($f$SELECT save_school_list_template(NULL, '{"name":"Segundo Básico","grade":"Segundo Básico","items":[]}', %L, NULL)$f$, v_admin)),
    'SCHOOL_TEMPLATE_NAME_TAKEN');
  PERFORM pg_temp.expect('T2 cantidad con decimales',
    pg_temp.err(format($f$SELECT save_school_list_template(NULL, '{"name":"Prueba X","grade":"Primero Básico","items":[{"productName":"Lápiz","quantity":1.5,"unitPrice":2}]}', %L, NULL)$f$, v_admin)),
    'SCHOOL_INVALID_QUANTITY');
  PERFORM pg_temp.expect('T2 precio negativo',
    pg_temp.err(format($f$SELECT save_school_list_template(NULL, '{"name":"Prueba X","grade":"Primero Básico","items":[{"productName":"Lápiz","quantity":1,"unitPrice":-2}]}', %L, NULL)$f$, v_admin)),
    'SCHOOL_INVALID_PRICE');

  v_tpl_copy := duplicate_school_list_template(v_tpl, 'Primero Básico 2100', NULL, v_admin);
  PERFORM pg_temp.expect('T3 duplicar copia las líneas y el grado',
    (SELECT grade || ' ' || count(i.*) FROM school_list_templates t JOIN school_list_template_items i ON i.template_id = t.id
      WHERE t.id = v_tpl_copy GROUP BY grade), 'Primero Básico 4');
  PERFORM set_school_list_template_active(v_tpl_copy, FALSE, v_admin);
  PERFORM pg_temp.expect('T3 una plantilla inactiva no cotiza',
    pg_temp.err(format($f$SELECT create_school_quotation(%L, %L, 'K-INACTIVE-1')$f$,
      pg_temp.quote(v_tpl_copy, '[{"productName":"Lápiz","quantity":1,"unitPrice":2}]'), v_admin)),
    'SCHOOL_TEMPLATE_INACTIVE');

  -- ── Cotización desde la plantilla, personalizada ────────────────────────
  SELECT id INTO v_ti_cuaderno FROM school_list_template_items WHERE template_id = v_tpl AND product_name = 'Cuaderno mediano';
  SELECT id INTO v_ti_lapiz FROM school_list_template_items WHERE template_id = v_tpl AND product_name = 'Lápiz';
  -- Cambia el cuaderno mediano por uno grande (línea manual), conserva el lápiz, agrega un juego geométrico.
  v_items := jsonb_build_array(
    jsonb_build_object('productName', 'Cuaderno grande', 'quantity', 1, 'unitPrice', 25),
    jsonb_build_object('templateItemId', v_ti_lapiz, 'productName', 'Lápiz', 'quantity', 5, 'unitPrice', 2),
    jsonb_build_object('productName', 'Juego geométrico', 'quantity', 1, 'unitPrice', 18, 'observations', 'Con transportador'));
  PERFORM pg_temp.expect('T4 un USER no cambia el precio de una línea de plantilla',
    pg_temp.err(format($f$SELECT create_school_quotation(%L, %L, 'K-USER-PRICE')$f$,
      pg_temp.quote(v_tpl, jsonb_build_array(jsonb_build_object('templateItemId', v_ti_lapiz, 'productName', 'Lápiz', 'quantity', 5, 'unitPrice', 1))), v_user)),
    'SCHOOL_PRICE_OVERRIDE_FORBIDDEN');
  PERFORM pg_temp.expect('T4 un USER no aplica descuentos',
    pg_temp.err(format($f$SELECT create_school_quotation(%L, %L, 'K-USER-DISC')$f$,
      pg_temp.quote(v_tpl, '[{"productName":"Lápiz","quantity":5,"unitPrice":2,"discount":1}]'), v_user)),
    'SCHOOL_PRICE_OVERRIDE_FORBIDDEN');
  PERFORM pg_temp.expect('T4 sin teléfono no se cotiza',
    pg_temp.err(format($f$SELECT create_school_quotation(%L, %L, 'K-NO-PHONE-01')$f$,
      pg_temp.quote(v_tpl, v_items, '{"customerPhone":"12"}'), v_user)),
    'SCHOOL_INVALID_PHONE');
  PERFORM pg_temp.expect('T4 sin productos no se cotiza',
    pg_temp.err(format($f$SELECT create_school_quotation(%L, %L, 'K-EMPTY-0001')$f$, pg_temp.quote(v_tpl, '[]'), v_user)),
    'SCHOOL_QUOTE_EMPTY');
  PERFORM pg_temp.expect('T4 línea de plantilla ajena',
    pg_temp.err(format($f$SELECT create_school_quotation(%L, %L, 'K-FOREIGN-01')$f$,
      pg_temp.quote((SELECT id FROM school_list_templates WHERE name = 'Segundo Básico'),
        jsonb_build_array(jsonb_build_object('templateItemId', v_ti_lapiz, 'productName', 'Lápiz', 'quantity', 5, 'unitPrice', 2))), v_user)),
    'SCHOOL_INVALID_TEMPLATE_ITEM');

  -- Total 25 + 10 + 18 = 53; anticipo inicial de 20 en el mismo paso.
  v_q := create_school_quotation(pg_temp.quote(v_tpl, v_items,
    '{"advance":{"amount":20,"paymentMethod":"EFECTIVO"}}'), v_user, 'K-QUOTE-1-' || gen_random_uuid());
  PERFORM pg_temp.expect('T5 cotización por grado: número, grado, totales y orígenes',
    (SELECT left(quotation_number, 3) || ' ' || grade || ' ' || subtotal || ' ' || total || ' '
            || (SELECT string_agg(source, ',' ORDER BY line_no) FROM school_quotation_items WHERE quotation_id = q.id)
       FROM school_quotations q WHERE id = v_q),
    'LE- Primero Básico 53.00 53.00 MANUAL,PLANTILLA,MANUAL');
  PERFORM pg_temp.expect('T5 subtotales por línea', (SELECT string_agg(subtotal::TEXT, ',' ORDER BY line_no) FROM school_quotation_items WHERE quotation_id = v_q),
    '25.00,10.00,18.00');
  PERFORM pg_temp.expect('T6 anticipo inicial', pg_temp.state(v_q), 'ANTICIPO_RECIBIDO 20.00 33.00');
  PERFORM pg_temp.expect('T6 el anticipo queda como ANTICIPO con su saldo',
    (SELECT kind || ' ' || amount || ' ' || balance_after FROM school_quotation_payments WHERE quotation_id = v_q), 'ANTICIPO 20.00 33.00');
  PERFORM pg_temp.expect('T4 la plantilla original no cambió',
    (SELECT string_agg(product_name || '×' || quantity, ',' ORDER BY line_no) FROM school_list_template_items WHERE template_id = v_tpl),
    'Cuaderno mediano×3,Lápiz×5,Borrador×2,Del inventario×1');

  -- Un administrador sí ajusta precio y descuento.
  v_q2 := create_school_quotation(pg_temp.quote(v_tpl, jsonb_build_array(
    jsonb_build_object('templateItemId', v_ti_cuaderno, 'productName', 'Cuaderno mediano', 'quantity', 3, 'unitPrice', 14, 'discount', 2),
    jsonb_build_object('productId', v_product, 'productName', 'Del inventario', 'quantity', 2, 'unitPrice', v_product_price))),
    v_admin, 'K-QUOTE-2-' || gen_random_uuid());
  PERFORM pg_temp.expect('T4 administrador: precio y descuento propios; total = subtotal − descuento',
    (SELECT subtotal || ' ' || discount || ' ' || total FROM school_quotations WHERE id = v_q2),
    (42 + 2 * v_product_price)::NUMERIC(12,2) || ' 2.00 ' || (40 + 2 * v_product_price)::NUMERIC(12,2));

  -- ── Cambiar la plantilla no altera cotizaciones guardadas ────────────────
  PERFORM save_school_list_template(v_tpl, jsonb_build_object('name', 'Primero Básico', 'grade', 'Primero Básico',
    'items', jsonb_build_array(jsonb_build_object('productName', 'Lápiz', 'quantity', 10, 'unitPrice', 3))),
    v_admin, (SELECT version FROM school_list_templates WHERE id = v_tpl));
  PERFORM pg_temp.expect('T3 cambiar la plantilla no altera la cotización',
    (SELECT total || ' ' || (SELECT string_agg(product_name || '×' || quantity || '@' || unit_price, ',' ORDER BY line_no)
                               FROM school_quotation_items WHERE quotation_id = q.id) FROM school_quotations q WHERE id = v_q),
    '53.00 Cuaderno grande×1@25.00,Lápiz×5@2.00,Juego geométrico×1@18.00');

  -- ── Abonos, validaciones e idempotencia ─────────────────────────────────
  PERFORM pg_temp.expect('T7 abono negativo',
    pg_temp.err(format($f$SELECT register_school_quotation_payment(%L, -5, 'EFECTIVO', NULL, NULL, NULL, %L, 'K-NEG-0001')$f$, v_q, v_user)),
    'SCHOOL_INVALID_AMOUNT');
  PERFORM pg_temp.expect('T7 abono con tres decimales',
    pg_temp.err(format($f$SELECT register_school_quotation_payment(%L, 1.005, 'EFECTIVO', NULL, NULL, NULL, %L, 'K-DEC-0001')$f$, v_q, v_user)),
    'SCHOOL_INVALID_AMOUNT');
  PERFORM pg_temp.expect('T7 abono mayor al saldo (con el saldo en el mensaje)',
    pg_temp.errfull(format($f$SELECT register_school_quotation_payment(%L, 33.01, 'EFECTIVO', NULL, NULL, NULL, %L, 'K-OVER-0001')$f$, v_q, v_user)),
    'SCHOOL_PAYMENT_EXCEEDS_BALANCE:33.00');
  PERFORM pg_temp.expect('T7 método de pago inválido',
    pg_temp.err(format($f$SELECT register_school_quotation_payment(%L, 1, 'CHEQUE', NULL, NULL, NULL, %L, 'K-METHOD-01')$f$, v_q, v_user)),
    'SCHOOL_INVALID_PAYMENT_METHOD');

  v_p1 := register_school_quotation_payment(v_q, 10, 'TRANSFERENCIA', NULL, 'TRX-778', 'Primer abono', v_user, 'K-ABONO-0001');
  PERFORM pg_temp.expect('T7 primer abono → pago parcial', pg_temp.state(v_q), 'PAGO_PARCIAL 30.00 23.00');
  PERFORM pg_temp.expect('T10 el mismo abono dos veces devuelve el mismo registro',
    (register_school_quotation_payment(v_q, 10, 'TRANSFERENCIA', NULL, 'TRX-778', 'Primer abono', v_user, 'K-ABONO-0001') = v_p1)::TEXT
      || ' ' || (SELECT count(*) FROM school_quotation_payments WHERE quotation_id = v_q), 'true 2');
  PERFORM pg_temp.expect('T10 la misma llave en otra cotización se rechaza',
    pg_temp.err(format($f$SELECT register_school_quotation_payment(%L, 1, 'EFECTIVO', NULL, NULL, NULL, %L, 'K-ABONO-0001')$f$, v_q2, v_user)),
    'SCHOOL_IDEMPOTENCY_CONFLICT');
  v_p2 := register_school_quotation_payment(v_q, 13, 'EFECTIVO', NULL, NULL, NULL, v_user, 'K-ABONO-0002');
  PERFORM pg_temp.expect('T8 varios abonos: saldo correcto', pg_temp.state(v_q), 'PAGO_PARCIAL 43.00 10.00');

  -- ── Reversa auditada ────────────────────────────────────────────────────
  PERFORM pg_temp.expect('T14 un USER no anula pagos',
    pg_temp.err(format($f$SELECT void_school_quotation_payment(%L, 'Error de digitación', %L, 'K-VOID-USER')$f$, v_p2, v_user)),
    'SCHOOL_LIST_FORBIDDEN');
  PERFORM pg_temp.expect('T14 anular exige motivo',
    pg_temp.err(format($f$SELECT void_school_quotation_payment(%L, 'x', %L, 'K-VOID-0000')$f$, v_p2, v_admin)), 'SCHOOL_REASON_REQUIRED');
  v_void := void_school_quotation_payment(v_p2, 'Monto mal digitado', v_admin, 'K-VOID-0001');
  PERFORM pg_temp.expect('T13 anular crea una ANULACIÓN y restituye el saldo',
    pg_temp.state(v_q) || ' ' || (SELECT kind || ' ' || amount || ' ' || reference FROM school_quotation_payments WHERE id = v_void),
    'PAGO_PARCIAL 30.00 23.00 ANULACION 13.00 ' || (SELECT receipt_number FROM school_quotation_payments WHERE id = v_p2));
  PERFORM pg_temp.expect('T13 el pago original se conserva como ANULADO',
    (SELECT status || ' ' || amount FROM school_quotation_payments WHERE id = v_p2), 'ANULADO 13.00');
  PERFORM pg_temp.expect('T13 anular de nuevo', pg_temp.err(format($f$SELECT void_school_quotation_payment(%L, 'Otra vez anulado', %L, 'K-VOID-0002')$f$, v_p2, v_admin)),
    'SCHOOL_PAYMENT_ALREADY_VOIDED');
  PERFORM pg_temp.expect('T13 una ANULACIÓN no se anula', pg_temp.err(format($f$SELECT void_school_quotation_payment(%L, 'Anular la anulación', %L, 'K-VOID-0003')$f$, v_void, v_admin)),
    'SCHOOL_PAYMENT_NOT_VOIDABLE');
  PERFORM pg_temp.expect('T13 un pago no se edita', pg_temp.err(format('UPDATE school_quotation_payments SET amount = 1 WHERE id = %L', v_p1)), 'SCHOOL_RECORD_IMMUTABLE');
  PERFORM pg_temp.expect('T13 un pago no se borra', pg_temp.err(format('DELETE FROM school_quotation_payments WHERE id = %L', v_p1)), 'SCHOOL_RECORD_IMMUTABLE');
  PERFORM pg_temp.expect('T13 una cotización no se borra', pg_temp.err(format('DELETE FROM school_quotations WHERE id = %L', v_q)), 'SCHOOL_RECORD_IMMUTABLE');
  PERFORM pg_temp.expect('T13 el historial no se edita', pg_temp.err('UPDATE school_list_history SET action = ''X'''), 'SCHOOL_RECORD_IMMUTABLE');

  -- ── Edición ─────────────────────────────────────────────────────────────
  v_version := (SELECT version FROM school_quotations WHERE id = v_q);
  PERFORM pg_temp.expect('T9 editar con versión vieja',
    pg_temp.err(format($f$SELECT update_school_quotation(%L, %L, %L, %s)$f$, v_q, pg_temp.quote(v_tpl, v_items), v_user, v_version - 1)),
    'SCHOOL_VERSION_CONFLICT');
  PERFORM pg_temp.expect('T9 el total no puede quedar por debajo de lo pagado',
    pg_temp.errfull(format($f$SELECT update_school_quotation(%L, %L, %L, %s)$f$, v_q,
      pg_temp.quote(v_tpl, '[{"productName":"Lápiz","quantity":1,"unitPrice":2}]'), v_user, v_version)),
    'SCHOOL_QUOTE_TOTAL_BELOW_PAID:30.00');
  -- Conserva las líneas existentes (itemId) y agrega 2 borradores manuales: 53 + 6 = 59.
  v_items := (SELECT jsonb_agg(jsonb_build_object('itemId', id, 'productId', product_id, 'productName', product_name,
                                                  'quantity', quantity, 'unitPrice', unit_price, 'discount', discount) ORDER BY line_no)
                FROM school_quotation_items WHERE quotation_id = v_q)
             || jsonb_build_array(jsonb_build_object('productName', 'Borrador', 'quantity', 2, 'unitPrice', 3));
  PERFORM update_school_quotation(v_q, pg_temp.quote(v_tpl, v_items, '{"observations":"Cambiar cuadernos medianos por grandes"}'), v_user, v_version);
  PERFORM pg_temp.expect('T9 editar recalcula total y saldo, conserva el origen',
    pg_temp.state(v_q) || ' ' || (SELECT string_agg(source, ',' ORDER BY line_no) FROM school_quotation_items WHERE quotation_id = v_q),
    'PAGO_PARCIAL 30.00 29.00 MANUAL,PLANTILLA,MANUAL,MANUAL');
  PERFORM pg_temp.expect('T15 el historial guarda la versión anterior',
    (SELECT (details->>'totalBefore') || '→' || (details->>'totalAfter') || ' ' || jsonb_array_length(details->'itemsBefore')
       FROM school_list_history WHERE entity_id = v_q AND action = 'EDITADA'), '53.00→59.00 3');

  -- ── Entrega ─────────────────────────────────────────────────────────────
  PERFORM pg_temp.expect('T11 no se entrega con saldo pendiente',
    pg_temp.err(format($f$SELECT change_school_quotation_status(%L, 'ENTREGAR', %L, NULL)$f$, v_q, v_user)),
    'SCHOOL_QUOTE_INVALID_TRANSITION');
  PERFORM change_school_quotation_status(v_q, 'PREPARAR', v_user, NULL);
  PERFORM pg_temp.expect('T11 en preparación con saldo: no se entrega',
    pg_temp.errfull(format($f$SELECT change_school_quotation_status(%L, 'ENTREGAR', %L, NULL)$f$, v_q, v_user)),
    'SCHOOL_QUOTE_NOT_PAID:29.00');
  v_p3 := register_school_quotation_payment(v_q, 29, 'EFECTIVO', NULL, NULL, 'Cancela el saldo', v_user, 'K-ABONO-0003');
  PERFORM pg_temp.expect('T11 en preparación sigue en preparación al pagar todo', pg_temp.state(v_q), 'EN_PREPARACION 59.00 0.00');
  PERFORM change_school_quotation_status(v_q, 'ENTREGAR', v_user, NULL);
  PERFORM pg_temp.expect('T11 entregada', (SELECT status || ' ' || (delivered_by = v_user) FROM school_quotations WHERE id = v_q), 'ENTREGADA true');
  PERFORM pg_temp.expect('T11 una entregada no recibe pagos',
    pg_temp.err(format($f$SELECT register_school_quotation_payment(%L, 1, 'EFECTIVO', NULL, NULL, NULL, %L, 'K-AFTER-001')$f$, v_q, v_user)),
    'SCHOOL_QUOTE_CLOSED');
  PERFORM pg_temp.expect('T11 una entregada no se edita',
    pg_temp.err(format($f$SELECT set_school_quotation_observations(%L, 'x', %L, %s)$f$, v_q, v_user, (SELECT version FROM school_quotations WHERE id = v_q))),
    'SCHOOL_QUOTE_NOT_EDITABLE');

  -- Pago total directo → PAGADA.
  PERFORM register_school_quotation_payment(v_q2, (SELECT total FROM school_quotations WHERE id = v_q2), 'TARJETA', NULL, 'POS-1', NULL, v_admin, 'K-FULL-0001');
  PERFORM pg_temp.expect('T12 un solo pago por el total → PAGADA', split_part(pg_temp.state(v_q2), ' ', 1) || ' ' || split_part(pg_temp.state(v_q2), ' ', 3), 'PAGADA 0.00');

  -- ── Borrador ────────────────────────────────────────────────────────────
  PERFORM pg_temp.expect('T12 un borrador no recibe anticipo',
    pg_temp.err(format($f$SELECT create_school_quotation(%L, %L, 'K-DRAFT-ADV')$f$,
      pg_temp.quote(v_tpl, '[{"productName":"Lápiz","quantity":2,"unitPrice":2}]', '{"asDraft":true,"advance":{"amount":1,"paymentMethod":"EFECTIVO"}}'), v_user)),
    'SCHOOL_QUOTE_DRAFT_NO_PAYMENTS');
  v_q3 := create_school_quotation(pg_temp.quote(NULL, '[{"productName":"Mochila","quantity":1,"unitPrice":150}]', '{"grade":"Segundo Básico","asDraft":true}'), v_user, 'K-DRAFT-0001');
  PERFORM pg_temp.expect('T12 idempotencia al crear: misma llave, misma cotización',
    (create_school_quotation(pg_temp.quote(NULL, '[{"productName":"Mochila","quantity":1,"unitPrice":150}]', '{"grade":"Segundo Básico","asDraft":true}'), v_user, 'K-DRAFT-0001') = v_q3)::TEXT,
    'true');
  PERFORM pg_temp.expect('T12 borrador sin plantilla', pg_temp.state(v_q3), 'BORRADOR 0.00 150.00');
  PERFORM pg_temp.expect('T12 borrador no recibe pagos',
    pg_temp.err(format($f$SELECT register_school_quotation_payment(%L, 1, 'EFECTIVO', NULL, NULL, NULL, %L, 'K-DRAFT-PAY')$f$, v_q3, v_user)),
    'SCHOOL_QUOTE_DRAFT_NO_PAYMENTS');
  PERFORM change_school_quotation_status(v_q3, 'CONFIRMAR', v_user, NULL);
  PERFORM pg_temp.expect('T12 confirmar el borrador', pg_temp.state(v_q3), 'COTIZADA 0.00 150.00');

  -- ── Cancelación con devolución ──────────────────────────────────────────
  PERFORM register_school_quotation_payment(v_q3, 50, 'EFECTIVO', NULL, NULL, NULL, v_user, 'K-Q3-ANT-01');
  PERFORM pg_temp.expect('T14 un USER no cancela',
    pg_temp.err(format($f$SELECT cancel_school_quotation(%L, 'El cliente desiste', 'EFECTIVO', NULL, NULL, %L, 'K-CANCEL-U1')$f$, v_q3, v_user)),
    'SCHOOL_LIST_FORBIDDEN');
  PERFORM pg_temp.expect('T14 cancelar con dinero exige el método de devolución',
    pg_temp.err(format($f$SELECT cancel_school_quotation(%L, 'El cliente desiste', NULL, NULL, NULL, %L, 'K-CANCEL-01')$f$, v_q3, v_admin)),
    'SCHOOL_REFUND_METHOD_REQUIRED');
  PERFORM cancel_school_quotation(v_q3, 'El cliente desiste', 'EFECTIVO', NULL, NULL, v_admin, 'K-CANCEL-01');
  PERFORM pg_temp.expect('T14 cancelada: devolución por lo pagado, historial completo',
    pg_temp.state(v_q3) || ' ' || (SELECT string_agg(kind || '=' || amount || '/' || status, ',' ORDER BY received_at, receipt_number)
                                     FROM school_quotation_payments WHERE quotation_id = v_q3),
    'CANCELADA 0.00 150.00 ANTICIPO=50.00/APLICADO,DEVOLUCION=50.00/APLICADO');
  PERFORM pg_temp.expect('T14 cancelar de nuevo con la misma llave es idempotente',
    (cancel_school_quotation(v_q3, 'El cliente desiste', 'EFECTIVO', NULL, NULL, v_admin, 'K-CANCEL-01') = v_q3)::TEXT
      || ' ' || (SELECT count(*) FROM school_quotation_payments WHERE quotation_id = v_q3 AND kind = 'DEVOLUCION'), 'true 1');
  PERFORM pg_temp.expect('T14 una cancelada no recibe pagos',
    pg_temp.err(format($f$SELECT register_school_quotation_payment(%L, 1, 'EFECTIVO', NULL, NULL, NULL, %L, 'K-Q3-AFTER')$f$, v_q3, v_user)),
    'SCHOOL_QUOTE_CLOSED');

  -- ── Sin impacto en inventario ni ventas ─────────────────────────────────
  PERFORM pg_temp.expect('T15 inventario y ventas intactos',
    ((SELECT COALESCE(SUM(stock), 0) FROM products) = v_stock_before AND (SELECT count(*) FROM sales) = v_sales_before)::TEXT, 'true');
  PERFORM pg_temp.expect('T15 historial de la cotización completo',
    (SELECT string_agg(action, ',' ORDER BY id) FROM school_list_history WHERE entity_id = v_q),
    'CREADA,PAGO,PAGO,PAGO,PAGO_ANULADO,EDITADA,PREPARAR,PAGO,ENTREGAR');

  RAISE NOTICE 'TODAS LAS PRUEBAS DE LISTAS ESCOLARES PASARON';
END $$;

ROLLBACK;
