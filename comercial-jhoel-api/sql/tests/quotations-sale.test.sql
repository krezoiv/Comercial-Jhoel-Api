-- Cotizaciones: cliente capturado a mano, sin efecto en inventario al guardar,
-- y "Confirmar venta" por medio de Ventas (migración 1760008200000).
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/quotations-sale.test.sql

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

DO $$
DECLARE
  v_user UUID := COALESCE(pg_temp.user_with('USER'), pg_temp.user_with('SUPER_ADMIN'));
  v_product UUID;
  v_name TEXT;
  v_vitrina UUID;
  v_q UUID;
  v_q2 UUID;
  v_sale UUID;
  v_clients BIGINT;
  v_movements BIGINT;
  v_stock BIGINT;
  v_sales BIGINT;
  v_customer JSONB := '{"name":"María López","phone":"5555-1234","studentName":"Ana López","grade":"Primero Básico"}';
  v_future DATE := (now() AT TIME ZONE 'America/Guatemala')::DATE + 15;
BEGIN
  SELECT id, name INTO v_product, v_name FROM products WHERE is_active ORDER BY created_at LIMIT 1;
  SELECT id INTO v_vitrina FROM inventory_locations WHERE name = 'Vitrina';
  -- Deterministic: Vitrina 10 units, public price Q25 (rolled back at the end).
  PERFORM ensure_inventory_stock_row(v_product, v_vitrina);
  UPDATE products SET stock = stock - (SELECT quantity FROM inventory_stock WHERE product_id = v_product AND location_id = v_vitrina) + 10,
                      public_price = 25
   WHERE id = v_product;
  UPDATE inventory_stock SET quantity = 10 WHERE product_id = v_product AND location_id = v_vitrina;
  SELECT count(*) INTO v_clients FROM clients;
  SELECT count(*) INTO v_movements FROM inventory_movements;
  SELECT SUM(stock) INTO v_stock FROM products;
  SELECT count(*) INTO v_sales FROM sales;

  -- ── Cliente a mano, sin inventario ──────────────────────────────────────
  PERFORM pg_temp.expect('Q1 sin teléfono no se cotiza',
    split_part(pg_temp.err(format($f$SELECT create_quotation(%L, NULL, '{"name":"María López"}', %L, %L, NULL, NULL, FALSE)$f$,
      v_user, v_future, jsonb_build_array(jsonb_build_object('productId', v_product, 'quantity', 1)))), ':', 1),
    'QUOTATION_INVALID_PHONE');
  v_q := create_quotation(v_user, NULL, v_customer, v_future,
           jsonb_build_array(jsonb_build_object('productId', v_product, 'quantity', 4, 'discount', 5)),
           'Entrega el viernes', NULL, FALSE);
  PERFORM pg_temp.expect('Q2 cotización con cliente capturado a mano, sin registrarlo en clientes',
    (SELECT status || ' ' || customer_name || ' ' || customer_phone || ' ' || student_name || ' ' || grade || ' ' || (client_id IS NULL) || ' ' || total
       FROM quotations WHERE id = v_q) || ' ' || ((SELECT count(*) FROM clients) = v_clients),
    'COTIZADA María López 5555-1234 Ana López Primero Básico true 95.00 true');
  PERFORM pg_temp.expect('Q3 guardar la cotización no toca el inventario',
    ((SELECT count(*) FROM inventory_movements) = v_movements AND (SELECT SUM(stock) FROM products) = v_stock
      AND (SELECT quantity FROM inventory_stock WHERE product_id = v_product AND location_id = v_vitrina) = 10)::TEXT, 'true');

  -- ── Estados ─────────────────────────────────────────────────────────────
  v_q2 := create_quotation(v_user, NULL, v_customer, v_future,
            jsonb_build_array(jsonb_build_object('productId', v_product, 'quantity', 11)), NULL, NULL, TRUE);
  PERFORM pg_temp.expect('Q4 un borrador no se vende',
    split_part(pg_temp.err(format('SELECT convert_quotation_to_sale(%L, %L)', v_q2, v_user)), ':', 1), 'QUOTATION_NOT_SELLABLE');
  PERFORM pg_temp.expect('Q4 confirmar el borrador', change_quotation_status(v_q2, 'CONFIRMAR', v_user, NULL), 'COTIZADA');
  PERFORM pg_temp.expect('Q5 sin existencias en Vitrina: se rechaza nombrando el producto y no cambia nada',
    pg_temp.err(format('SELECT convert_quotation_to_sale(%L, %L)', v_q2, v_user))
      || ' / ' || (SELECT status FROM quotations WHERE id = v_q2)
      || ' / ' || ((SELECT count(*) FROM sales) = v_sales AND (SELECT count(*) FROM inventory_movements) = v_movements),
    'QUOTATION_INSUFFICIENT_STOCK:10:11:' || v_name || ' / COTIZADA / true');
  PERFORM pg_temp.expect('Q6 rechazar exige motivo',
    split_part(pg_temp.err(format($f$SELECT change_quotation_status(%L, 'RECHAZAR', %L, 'no')$f$, v_q2, v_user)), ':', 1),
    'QUOTATION_REASON_REQUIRED');
  PERFORM pg_temp.expect('Q6 rechazada', change_quotation_status(v_q2, 'RECHAZAR', v_user, 'El cliente compró en otro lado'), 'RECHAZADA');
  PERFORM pg_temp.expect('Q6 una rechazada no se vende',
    split_part(pg_temp.err(format('SELECT convert_quotation_to_sale(%L, %L)', v_q2, v_user)), ':', 1), 'QUOTATION_NOT_SELLABLE');

  -- ── Confirmar venta ─────────────────────────────────────────────────────
  PERFORM pg_temp.expect('Q7 aceptar', change_quotation_status(v_q, 'ACEPTAR', v_user, NULL), 'ACEPTADA');
  UPDATE products SET public_price = 30 WHERE id = v_product;  -- the price changes after quoting
  v_sale := convert_quotation_to_sale(v_q, v_user);
  PERFORM pg_temp.expect('Q8 venta con los precios cotizados, enlazada y VENDIDA',
    (SELECT s.total || ' ' || s.status || ' ' || d.quantity || '@' || d.unit_price || '=' || d.total
       FROM sales s JOIN sale_details d ON d.sale_id = s.id WHERE s.id = v_sale)
      || ' ' || (SELECT status || ' ' || (converted_to_sale_id = v_sale) || ' ' || (sold_by = v_user) FROM quotations WHERE id = v_q),
    '95.00 CONFIRMED 4@25.00=95.00 VENDIDA true true');
  PERFORM pg_temp.expect('Q9 la venta descontó Vitrina y registró la salida',
    (SELECT quantity FROM inventory_stock WHERE product_id = v_product AND location_id = v_vitrina)
      || ' ' || (SELECT movement_type || '=' || quantity_base_units FROM inventory_movements WHERE reference_type = 'SALE' AND reference_id = v_sale),
    '6 SALIDA_VENTA=4');
  PERFORM pg_temp.expect('Q10 confirmar de nuevo devuelve la misma venta sin descontar otra vez',
    (convert_quotation_to_sale(v_q, v_user) = v_sale)::TEXT
      || ' ' || ((SELECT count(*) FROM sales) = v_sales + 1)
      || ' ' || (SELECT quantity FROM inventory_stock WHERE product_id = v_product AND location_id = v_vitrina),
    'true true 6');
  PERFORM pg_temp.expect('Q11 una vendida no se cancela ni cambia de estado',
    split_part(pg_temp.err(format($f$SELECT change_quotation_status(%L, 'CANCELAR', %L, 'Anular venta')$f$, v_q, v_user)), ':', 1),
    'QUOTATION_ALREADY_SOLD');
  PERFORM pg_temp.expect('Q12 una venta por cotización: índice único',
    split_part(pg_temp.err(format('UPDATE quotations SET status = %L, converted_to_sale_id = %L WHERE id = %L', 'VENDIDA', v_sale, v_q2)), ' ', 1),
    'duplicate');

  -- ── Vencida ─────────────────────────────────────────────────────────────
  v_q2 := create_quotation(v_user, NULL, v_customer, v_future,
            jsonb_build_array(jsonb_build_object('productId', v_product, 'quantity', 1)), NULL, NULL, FALSE);
  UPDATE quotations SET expiration_date = (now() AT TIME ZONE 'America/Guatemala')::DATE - 1 WHERE id = v_q2;
  PERFORM pg_temp.expect('Q13 una cotización vencida no se vende ni se acepta',
    pg_temp.err(format('SELECT convert_quotation_to_sale(%L, %L)', v_q2, v_user)) || ' '
      || pg_temp.err(format($f$SELECT change_quotation_status(%L, 'ACEPTAR', %L, NULL)$f$, v_q2, v_user)),
    'QUOTATION_EXPIRED QUOTATION_EXPIRED');
  PERFORM pg_temp.expect('Q14 cancelar con motivo', change_quotation_status(v_q2, 'CANCELAR', v_user, 'Cliente no regresó'), 'CANCELADA');

  -- ── Ventas sigue igual ──────────────────────────────────────────────────
  v_sale := confirm_sale(v_user, jsonb_build_array(jsonb_build_object('productId', v_product, 'quantity', 1)), NULL, 'PUBLIC');
  PERFORM pg_temp.expect('Q15 una venta normal sigue cobrando el precio actual',
    (SELECT total::TEXT FROM sales WHERE id = v_sale), '30.00');

  RAISE NOTICE 'TODAS LAS PRUEBAS DE COTIZACIONES PASARON';
END $$;

ROLLBACK;
