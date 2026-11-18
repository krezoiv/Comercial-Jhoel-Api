-- Listas Escolares — existencias negativas, abastecimiento FIFO, despacho y anulación
-- (migración 1760008300000-SchoolListSupply). Usa las funciones reales de Compras,
-- Traslados y Ventas. Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/school-supply.test.sql

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

-- Stock of a product in a location.
CREATE FUNCTION pg_temp.qty(p_product UUID, p_location TEXT) RETURNS INT LANGUAGE sql AS $$
  SELECT COALESCE((SELECT s.quantity FROM inventory_stock s JOIN inventory_locations l ON l.id = s.location_id
                    WHERE s.product_id = p_product AND l.name = p_location), 0)
$$;

-- Sets Bodega/Vitrina to known values keeping products.stock = sum of locations (test only).
CREATE FUNCTION pg_temp.set_stock(p_product UUID, p_bodega INT, p_vitrina INT) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  PERFORM ensure_inventory_stock_row(p_product, (SELECT id FROM inventory_locations WHERE name = 'Bodega'));
  PERFORM ensure_inventory_stock_row(p_product, (SELECT id FROM inventory_locations WHERE name = 'Vitrina'));
  UPDATE inventory_stock s SET quantity = CASE l.name WHEN 'Bodega' THEN p_bodega ELSE p_vitrina END
    FROM inventory_locations l WHERE l.id = s.location_id AND s.product_id = p_product AND l.name IN ('Bodega','Vitrina');
  UPDATE products SET stock = (SELECT COALESCE(SUM(quantity), 0) FROM inventory_stock WHERE product_id = p_product) WHERE id = p_product;
END $$;

-- "pendiente asignado comprometido" of one list and product.
CREATE FUNCTION pg_temp.line(p_quotation UUID, p_product UUID) RETURNS TEXT LANGUAGE sql AS $$
  SELECT COALESCE((SELECT pending || ' ' || allocated || ' ' || committed FROM school_supply_commitments
                    WHERE quotation_id = p_quotation AND product_id = p_product), '-')
$$;

-- Invariant: Bodega quantity = free units − pending units (free = quantity + pending ≥ 0).
CREATE FUNCTION pg_temp.free(p_product UUID) RETURNS INT LANGUAGE sql AS $$
  SELECT school_supply_free_units(p_product)
$$;

CREATE FUNCTION pg_temp.list(p_items JSONB, p_key TEXT, p_user UUID) RETURNS UUID LANGUAGE sql AS $$
  SELECT create_school_quotation(jsonb_build_object('grade', 'Primero Básico', 'customerName', 'Cliente Abastecimiento',
                                                    'customerPhone', '5555-0000', 'items', p_items), p_user, p_key)
$$;

CREATE FUNCTION pg_temp.item(p_product UUID, p_qty INT) RETURNS JSONB LANGUAGE sql AS $$
  SELECT jsonb_build_object('productId', p_product, 'productName', (SELECT name FROM products WHERE id = p_product),
                            'quantity', p_qty, 'unitPrice', (SELECT public_price FROM products WHERE id = p_product))
$$;

CREATE FUNCTION pg_temp.pay_all(p_quotation UUID, p_user UUID, p_key TEXT) RETURNS VOID LANGUAGE sql AS $$
  SELECT register_school_quotation_payment(p_quotation, (SELECT total - school_quotation_paid(id) FROM school_quotations WHERE id = p_quotation),
                                           'EFECTIVO', NULL, NULL, NULL, p_user, p_key)
$$;

DO $$
DECLARE
  v_admin UUID := COALESCE(pg_temp.user_with('ADMIN'), pg_temp.user_with('SUPER_ADMIN'));
  v_user UUID := pg_temp.user_with('USER');
  v_supplier UUID := (SELECT id FROM suppliers WHERE is_active ORDER BY created_at LIMIT 1);
  v_bodega UUID := (SELECT id FROM inventory_locations WHERE name = 'Bodega');
  v_vitrina UUID := (SELECT id FROM inventory_locations WHERE name = 'Vitrina');
  p1 UUID; p2 UUID; p3 UUID;
  v_a UUID; v_b UUID; v_c UUID; v_d UUID;
  v_purchase UUID; v_purchase2 UUID;
  v_dispatch UUID;
  v_movements BIGINT;
BEGIN
  SELECT id INTO p1 FROM products WHERE is_active ORDER BY created_at LIMIT 1;
  SELECT id INTO p2 FROM products WHERE is_active ORDER BY created_at OFFSET 1 LIMIT 1;
  SELECT id INTO p3 FROM products WHERE is_active ORDER BY created_at OFFSET 2 LIMIT 1;
  -- Spec example: cuaderno 10, lapicero 5, borrador 0 (Bodega).
  PERFORM pg_temp.set_stock(p1, 10, 4);
  PERFORM pg_temp.set_stock(p2, 5, 4);
  PERFORM pg_temp.set_stock(p3, 0, 0);
  UPDATE school_supply_settings SET allocation_mode = 'FIFO_AUTO' WHERE id = 1;

  -- ── 1. Lista con existencias insuficientes, en cero y en negativo ───────────
  v_a := pg_temp.list(jsonb_build_array(pg_temp.item(p1, 15), pg_temp.item(p2, 10), pg_temp.item(p3, 5),
                                        '{"productName":"Forro plástico","quantity":2,"unitPrice":3}'::jsonb), 'K-SUP-A-0001', v_user);
  PERFORM pg_temp.expect('S1 se confirma aunque no alcance: Bodega 10/5/0 → −5/−5/−5',
    pg_temp.qty(p1, 'Bodega') || '/' || pg_temp.qty(p2, 'Bodega') || '/' || pg_temp.qty(p3, 'Bodega'), '-5/-5/-5');
  PERFORM pg_temp.expect('S1 salidas registradas por la lista, con usuario',
    (SELECT string_agg(quantity_base_units::TEXT || (user_id = v_user)::TEXT, ',' ORDER BY quantity_base_units DESC)
       FROM inventory_movements WHERE reference_type = 'SCHOOL_LIST' AND reference_id = v_a AND movement_type = 'SALIDA_LISTA_ESCOLAR'),
    '15true,10true,5true');
  PERFORM pg_temp.expect('S1 products.stock = suma de ubicaciones',
    ((SELECT stock FROM products WHERE id = p1) = pg_temp.qty(p1, 'Bodega') + pg_temp.qty(p1, 'Vitrina'))::TEXT, 'true');
  PERFORM pg_temp.expect('S2 lo que había en Bodega quedó reservado para la lista (pendiente asignado comprometido)',
    pg_temp.line(v_a, p1) || ' | ' || pg_temp.line(v_a, p2) || ' | ' || pg_temp.line(v_a, p3), '5 10 15 | 5 5 10 | 5 0 5');
  PERFORM pg_temp.expect('S2 estado de abastecimiento parcial', school_quotation_supply_status(v_a), 'PARCIAL');

  v_b := pg_temp.list(jsonb_build_array(pg_temp.item(p1, 5)), 'K-SUP-B-0001', v_user);
  v_c := pg_temp.list(jsonb_build_array(pg_temp.item(p1, 5)), 'K-SUP-C-0001', v_user);
  PERFORM pg_temp.expect('S3 con existencias ya negativas: −15, listas B y C pendientes',
    pg_temp.qty(p1, 'Bodega') || ' ' || school_quotation_supply_status(v_b) || ' ' || school_quotation_supply_status(v_c),
    '-15 PENDIENTE PENDIENTE');
  PERFORM pg_temp.expect('S4 pendiente ≠ existencia: pendiente 15, comprometido 25, asignado 10, libres 0',
    (SELECT SUM(pending) || ' ' || SUM(committed) || ' ' || SUM(allocated) FROM school_supply_commitments WHERE product_id = p1)
      || ' ' || pg_temp.free(p1), '15 25 10 0');

  -- ── 2. Compra por el flujo normal: entra a Bodega y se asigna FIFO ──────────
  SELECT count(*) INTO v_movements FROM inventory_movements;
  v_purchase := confirm_purchase(v_supplier, v_admin, now(),
    jsonb_build_array(jsonb_build_object('productId', p1, 'quantity', 12, 'costPrice', 1, 'publicPrice', (SELECT public_price FROM products WHERE id = p1))));
  PERFORM pg_temp.expect('S5 compra de 12: −15 + 12 = −3 y una sola entrada de compra',
    pg_temp.qty(p1, 'Bodega') || ' ' || ((SELECT count(*) FROM inventory_movements) - v_movements)
      || ' ' || (SELECT movement_type || '=' || quantity_base_units FROM inventory_movements WHERE reference_id = v_purchase),
    '-3 1 ENTRADA_COMPRA=12');
  PERFORM pg_temp.expect('S6 FIFO por fecha de confirmación: A 5, B 5, C 2 (C queda con 3 pendientes)',
    (SELECT string_agg(CASE a.quotation_id WHEN v_a THEN 'A' WHEN v_b THEN 'B' ELSE 'C' END || '=' || a.quantity, ','
                       ORDER BY q.confirmed_at, q.quotation_number)
       FROM school_supply_allocations a JOIN school_quotations q ON q.id = a.quotation_id
      WHERE a.purchase_id = v_purchase), 'A=5,B=5,C=2');
  PERFORM pg_temp.expect('S6 asignaciones enlazadas a la compra y a su movimiento',
    (SELECT count(*) || ' ' || bool_and(source_type = 'COMPRA' AND mode = 'AUTO' AND source_movement_id IS NOT NULL)
       FROM school_supply_allocations WHERE purchase_id = v_purchase), '3 true');
  PERFORM pg_temp.expect('S6 pendientes después de la compra (A, B, C)',
    pg_temp.line(v_a, p1) || ' | ' || pg_temp.line(v_b, p1) || ' | ' || pg_temp.line(v_c, p1), '0 15 15 | 0 5 5 | 3 2 5');
  PERFORM pg_temp.expect('S7 la compra ya no tiene unidades libres: no se asigna dos veces',
    allocate_school_supply_purchase(v_purchase, v_admin)::TEXT || ' ' || pg_temp.free(p1), '0 0');
  PERFORM pg_temp.expect('S7 no se asignan unidades que no existen',
    split_part(pg_temp.err(format($f$SELECT allocate_school_supply_manual(%L, %L, 1, NULL, %L, 'K-SUP-MAN-01')$f$, v_c, p1, v_admin)), ':', 1),
    'SCHOOL_SUPPLY_NO_FREE_UNITS');
  PERFORM pg_temp.expect('S7 no se asigna más de lo pendiente',
    pg_temp.err(format($f$SELECT allocate_school_supply_manual(%L, %L, 4, NULL, %L, 'K-SUP-MAN-02')$f$, v_c, p1, v_admin)),
    'SCHOOL_SUPPLY_OVER_PENDING:3');
  PERFORM pg_temp.expect('S7 un USER no asigna a mano',
    split_part(pg_temp.err(format($f$SELECT allocate_school_supply_manual(%L, %L, 1, NULL, %L, 'K-SUP-MAN-03')$f$, v_c, p1, v_user)), ':', 1),
    'SCHOOL_LIST_FORBIDDEN');

  -- ── 3. Estados de abastecimiento ────────────────────────────────────────────
  PERFORM pg_temp.expect('S8 A parcial (faltan lapicero y borrador), B disponible, C parcial',
    school_quotation_supply_status(v_a) || ' ' || school_quotation_supply_status(v_b) || ' ' || school_quotation_supply_status(v_c),
    'PARCIAL DISPONIBLE PARCIAL');

  -- ── 4. Despacho (= entrega) ─────────────────────────────────────────────────
  PERFORM pg_temp.expect('S9 no se despacha con saldo pendiente',
    split_part(pg_temp.err(format($f$SELECT dispatch_school_quotation(%L, %L, NULL, 'K-SUP-DISP-B0')$f$, v_b, v_user)), ':', 1),
    'SCHOOL_QUOTE_NOT_PAID');
  PERFORM pg_temp.pay_all(v_b, v_user, 'K-SUP-PAY-B01');
  PERFORM pg_temp.pay_all(v_c, v_user, 'K-SUP-PAY-C01');
  PERFORM pg_temp.expect('S9 no se despacha una lista incompleta (nombra el producto)',
    pg_temp.err(format($f$SELECT dispatch_school_quotation(%L, %L, NULL, 'K-SUP-DISP-C0')$f$, v_c, v_user)),
    'SCHOOL_SUPPLY_INCOMPLETE:3:' || (SELECT name FROM products WHERE id = p1));
  SELECT count(*) INTO v_movements FROM inventory_movements;
  v_dispatch := dispatch_school_quotation(v_b, v_user, 'Entregada al encargado', 'K-SUP-DISP-B1');
  PERFORM pg_temp.expect('S10 despacho sin segundo descuento: Bodega y movimientos sin cambio',
    pg_temp.qty(p1, 'Bodega') || ' ' || ((SELECT count(*) FROM inventory_movements) = v_movements), '-3 true');
  PERFORM pg_temp.expect('S10 lista entregada y despachada, reservas entregadas, cantidades registradas',
    (SELECT status FROM school_quotations WHERE id = v_b) || ' ' || school_quotation_supply_status(v_b)
      || ' ' || (SELECT string_agg(DISTINCT status, ',') FROM school_supply_allocations WHERE quotation_id = v_b)
      || ' ' || (SELECT string_agg(requested || '/' || supplied || '/' || delivered, ',') FROM school_dispatch_items WHERE dispatch_id = v_dispatch)
      || ' ' || (SELECT (dispatched_by = v_user)::TEXT FROM school_dispatches WHERE id = v_dispatch),
    'ENTREGADA DESPACHADA ENTREGADA 5/5/5 true');
  PERFORM pg_temp.expect('S10 despachar de nuevo devuelve el mismo despacho',
    (dispatch_school_quotation(v_b, v_user, NULL, 'K-SUP-DISP-B2') = v_dispatch)::TEXT, 'true');
  PERFORM pg_temp.expect('S11 una lista despachada no se anula',
    split_part(pg_temp.err(format($f$SELECT cancel_school_quotation(%L, 'Intento de anular', 'EFECTIVO', NULL, NULL, %L, 'K-SUP-CAN-B1')$f$, v_b, v_admin)), ':', 1),
    'SCHOOL_QUOTE_CLOSED');

  -- ── 5. Anulación de una lista parcialmente abastecida ───────────────────────
  PERFORM cancel_school_quotation(v_a, 'El cliente ya no la quiere', NULL, NULL, NULL, v_admin, 'K-SUP-CAN-A1');
  PERFORM pg_temp.expect('S12 anular devuelve exactamente lo descontado (15/10/5)',
    pg_temp.qty(p1, 'Bodega') || '/' || pg_temp.qty(p2, 'Bodega') || '/' || pg_temp.qty(p3, 'Bodega'), '12/5/0');
  PERFORM pg_temp.expect('S12 sus reservas quedaron liberadas (15 cuadernos, 5 lapiceros)',
    (SELECT string_agg(sum::TEXT, ',') FROM (SELECT SUM(quantity) AS sum FROM school_supply_allocations
                                              WHERE quotation_id = v_a AND status = 'LIBERADA' GROUP BY product_id ORDER BY 1 DESC) x)
      || ' ' || (SELECT count(*) FROM school_supply_allocations WHERE quotation_id = v_a AND status = 'ASIGNADA'),
    '15,5 0');
  PERFORM pg_temp.expect('S12 las unidades liberadas pasan FIFO a la siguiente lista (C completa) sin mover inventario',
    pg_temp.line(v_c, p1) || ' ' || school_quotation_supply_status(v_c) || ' ' || pg_temp.qty(p1, 'Bodega'), '0 5 5 DISPONIBLE 12');
  PERFORM pg_temp.expect('S12 invariante: Bodega = libres − pendientes',
    (pg_temp.qty(p1, 'Bodega') = pg_temp.free(p1) - COALESCE((SELECT SUM(pending) FROM school_supply_commitments WHERE product_id = p1), 0))::TEXT, 'true');
  SELECT count(*) INTO v_movements FROM inventory_movements;
  PERFORM cancel_school_quotation(v_a, 'El cliente ya no la quiere', NULL, NULL, NULL, v_admin, 'K-SUP-CAN-A1');
  PERFORM pg_temp.expect('S13 anular otra vez no devuelve ni libera nada',
    ((SELECT count(*) FROM inventory_movements) = v_movements)::TEXT || ' ' || pg_temp.qty(p1, 'Bodega'), 'true 12');
  PERFORM pg_temp.expect('S13 una anulada no vuelve a descontar',
    school_quotation_sync_inventory(v_a, v_admin, NULL)::TEXT || ' ' || pg_temp.qty(p1, 'Bodega'), '0 12');

  -- ── 6. Los demás módulos conservan sus reglas ───────────────────────────────
  v_d := pg_temp.list(jsonb_build_array(pg_temp.item(p2, 8)), 'K-SUP-D-0001', v_user);
  PERFORM pg_temp.expect('S14 lapicero en Bodega −3 por la lista D', pg_temp.qty(p2, 'Bodega')::TEXT, '-3');
  PERFORM pg_temp.expect('S14 un traslado desde Bodega negativa se rechaza',
    split_part(pg_temp.err(format($f$SELECT register_inventory_transfer(%L, (SELECT pp.id FROM product_presentations pp JOIN presentation_types pt ON pt.id = pp.presentation_type_id WHERE pp.product_id = %L AND pt.name = 'Unidad'), %L, %L, 1, %L)$f$,
      p2, p2, v_bodega, v_vitrina, v_admin)), ':', 1), 'INSUFFICIENT_STOCK');
  PERFORM pg_temp.expect('S14 una venta desde Vitrina con existencias sigue funcionando (aunque Bodega esté negativa)',
    pg_temp.err(format('SELECT confirm_sale(%L, %L::jsonb, NULL, %L)', v_user, jsonb_build_array(jsonb_build_object('productId', p2, 'quantity', 2)), 'PUBLIC'))
      || ' ' || pg_temp.qty(p2, 'Vitrina'), 'OK 2');
  PERFORM pg_temp.expect('S14 Ventas no puede vender más de lo que hay en Vitrina',
    split_part(pg_temp.err(format('SELECT confirm_sale(%L, %L::jsonb, NULL, %L)', v_user, jsonb_build_array(jsonb_build_object('productId', p3, 'quantity', 1)), 'PUBLIC')), ':', 1),
    'INSUFFICIENT_STOCK');
  PERFORM pg_temp.expect('S14 fuera de Listas Escolares nadie deja existencias negativas',
    pg_temp.err(format('UPDATE inventory_stock SET quantity = -1 WHERE product_id = %L AND location_id = %L', p3, v_vitrina)),
    'new row for relation "inventory_stock" violates check constraint "CHK_inventory_stock_quantity_non_negative"');
  PERFORM pg_temp.expect('S14 ni hunde más un negativo existente',
    split_part(pg_temp.err(format('UPDATE inventory_stock SET quantity = quantity - 1 WHERE product_id = %L AND location_id = %L', p2, v_bodega)), ' ', 1),
    'new');
  PERFORM pg_temp.expect('S14 products.stock no puede quedar negativo sin una ubicación negativa',
    split_part(pg_temp.err(format('UPDATE products SET stock = -1 WHERE id = %L', p3)), ' ', 1), 'new');
  PERFORM pg_temp.expect('S14 el permiso de negativos no queda activo en la transacción',
    COALESCE(current_setting('cj.allow_negative_stock', true), ''), '');

  -- ── 7. Modo manual ──────────────────────────────────────────────────────────
  PERFORM pg_temp.expect('S15 un USER no cambia el modo',
    split_part(pg_temp.err(format($f$SELECT set_school_supply_mode('MANUAL', %L)$f$, v_user)), ':', 1), 'SCHOOL_LIST_FORBIDDEN');
  PERFORM set_school_supply_mode('MANUAL', v_admin);
  v_purchase2 := confirm_purchase(v_supplier, v_admin, now(),
    jsonb_build_array(jsonb_build_object('productId', p2, 'quantity', 5, 'costPrice', 1, 'publicPrice', (SELECT public_price FROM products WHERE id = p2))));
  PERFORM pg_temp.expect('S15 en manual la compra solo suma existencias (D sigue pendiente)',
    pg_temp.qty(p2, 'Bodega') || ' ' || pg_temp.line(v_d, p2) || ' ' || school_quotation_supply_status(v_d), '2 3 5 8 PARCIAL');
  PERFORM pg_temp.expect('S15 asignar la compra: FIFO con sus unidades (3 a D)',
    allocate_school_supply_purchase(v_purchase2, v_admin)::TEXT, '3');
  PERFORM pg_temp.expect('S15 D completa y sobran 2 unidades libres',
    pg_temp.line(v_d, p2) || ' ' || pg_temp.free(p2), '0 8 8 2');
  PERFORM pg_temp.expect('S15 asignación manual idempotente por llave',
    pg_temp.err(format($f$SELECT allocate_school_supply_manual(%L, %L, 1, NULL, %L, 'K-SUP-MAN-04')$f$, v_d, p2, v_admin)), 'SCHOOL_SUPPLY_OVER_PENDING:0');

  PERFORM pg_temp.expect('S16 historial de la lista con abastecimiento y despacho',
    (SELECT string_agg(DISTINCT action, ',' ORDER BY action) FROM school_list_history WHERE entity_id = v_b), 'ABASTECIMIENTO,CREADA,DESPACHO,PAGO');
  PERFORM pg_temp.expect('S16 asignaciones y despachos no se editan ni se borran',
    split_part(pg_temp.err(format('UPDATE school_supply_allocations SET quantity = 99 WHERE quotation_id = %L', v_c)), ':', 1) || ' '
      || split_part(pg_temp.err(format('DELETE FROM school_dispatches WHERE id = %L', v_dispatch)), ':', 1),
    'SCHOOL_RECORD_IMMUTABLE SCHOOL_RECORD_IMMUTABLE');

  RAISE NOTICE 'TODAS LAS PRUEBAS DE ABASTECIMIENTO PASARON';
END $$;

ROLLBACK;
