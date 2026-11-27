-- Pagos grupales: reserva, entregas individuales, parciales, sin pago, historial, cierre y anulaciones
-- (migración 1760009400000-PaymentGroups).
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK: no deja ningún dato.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/payment-groups.test.sql

BEGIN;

CREATE FUNCTION pg_temp.admin_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name IN ('SUPER_ADMIN', 'ADMIN') AND u.is_active ORDER BY u.created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.cashier_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name = 'USER' AND u.is_active ORDER BY u.created_at LIMIT 1
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

CREATE FUNCTION pg_temp.money(p NUMERIC) RETURNS TEXT LANGUAGE sql AS $$ SELECT p::NUMERIC(14,2)::TEXT $$;

CREATE FUNCTION pg_temp.agent() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_banks WHERE cash_box_code IS NULL AND is_active ORDER BY created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.item(p_group UUID, p_n INT) RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM payment_group_items WHERE group_id = p_group AND item_number = p_n
$$;

CREATE FUNCTION pg_temp.status(p_group UUID, p_n INT) RETURNS TEXT LANGUAGE sql AS $$
  SELECT status FROM payment_group_item_balances WHERE id = pg_temp.item(p_group, p_n)
$$;

CREATE FUNCTION pg_temp.pay(p_group UUID, p_n INT, p_amount NUMERIC, p_key TEXT, p_user UUID DEFAULT NULL) RETURNS TEXT
LANGUAGE sql AS $$
  SELECT pg_temp.err(format('SELECT register_payment_group_delivery(%L, %L, %L, NULL, %L, %L)',
    p_group, pg_temp.item(p_group, p_n), p_amount, COALESCE(p_user, pg_temp.admin_id()), p_key))
$$;

CREATE FUNCTION pg_temp.items(p_n INT, p_amount NUMERIC) RETURNS JSONB LANGUAGE sql AS $$
  SELECT jsonb_agg(jsonb_build_object('expectedAmount', p_amount, 'reference', 'Beneficiario ' || g))
  FROM generate_series(1, p_n) g
$$;

DO $$
DECLARE
  v_admin UUID := pg_temp.admin_id();
  v_cashier UUID := pg_temp.cashier_id();
  v_type UUID;
  v_genesis_type UUID;
  v_group UUID;
  v_group2 UUID;
  v_in_group UUID;
  v_base NUMERIC;
  v_reserved0 NUMERIC;
  v_available0 NUMERIC;
  v_moves BIGINT;
  v_delivery UUID;
  v_op UUID;
  v_row payment_group_balances;
BEGIN
  IF v_cashier IS NULL THEN
    RAISE EXCEPTION 'Falta un usuario con rol USER para las pruebas de permisos';
  END IF;
  -- A type "Pago Varios" that takes cash out and allows groups.
  INSERT INTO transaction_types (name, icon, cash_effect, allows_group_payment, created_by)
  VALUES ('Pago Varios (prueba grupal)', 'wallet', 'OUT', true, v_admin) RETURNING id INTO v_type;
  -- The Caja starts with Q10,000.00 more than whatever this database had.
  PERFORM apply_cash_movement('ENTRADA_MANUAL', 'IN', 10000, v_admin, 'Fondo de prueba', NULL, NULL, NULL, NULL, NULL, 'TEST:PG-FONDO');
  v_base := cash_balance();
  v_reserved0 := cash_reserved_total();
  v_available0 := cash_available();

  -- Validations before anything is reserved.
  PERFORM pg_temp.expect('V1 tipo sin pago grupal rechazado',
    pg_temp.err(format('SELECT create_payment_group(%L, %L, %L, NULL, 100, %L, NULL, %L, %L)',
      (SELECT id FROM transaction_types WHERE NOT allows_group_payment AND is_active LIMIT 1), 'Grupo', pg_temp.agent(),
      pg_temp.items(1, 100), v_admin, 'K:V1')), 'PAYMENT_GROUP_TYPE_NOT_ALLOWED');
  PERFORM pg_temp.expect('V2 montos que superan lo autorizado',
    pg_temp.err(format('SELECT create_payment_group(%L, %L, %L, NULL, 900, %L, NULL, %L, %L)',
      v_type, 'Grupo', pg_temp.agent(), pg_temp.items(2, 500), v_admin, 'K:V2')), 'PAYMENT_GROUP_ITEMS_EXCEED_AUTHORIZED');
  PERFORM pg_temp.expect('V3 monto negativo',
    pg_temp.err(format('SELECT create_payment_group(%L, %L, %L, NULL, 900, %L, NULL, %L, %L)',
      v_type, 'Grupo', pg_temp.agent(), '[{"expectedAmount": -5}]', v_admin, 'K:V3')), 'PAYMENT_GROUP_INVALID_AMOUNT');
  PERFORM pg_temp.expect('V4 reservar más que el disponible',
    pg_temp.err(format('SELECT create_payment_group(%L, %L, %L, NULL, %L, %L, NULL, %L, %L)',
      v_type, 'Grupo', pg_temp.agent(), v_available0 + 1, pg_temp.items(1, 1), v_admin, 'K:V4')),
    'PAYMENT_GROUP_INSUFFICIENT_AVAILABLE');
  IF EXISTS (SELECT 1 FROM transaction_banks WHERE cash_box_code = 'GUAYACAN' AND is_active) THEN
    PERFORM pg_temp.expect('V5 Guayacán tiene su propia caja',
      pg_temp.err(format('SELECT create_payment_group(%L, %L, %L, NULL, 100, %L, NULL, %L, %L)',
        v_type, 'Grupo', (SELECT id FROM transaction_banks WHERE cash_box_code = 'GUAYACAN' LIMIT 1),
        pg_temp.items(1, 100), v_admin, 'K:V5')), 'PAYMENT_GROUP_AGENT_NOT_ALLOWED');
  END IF;

  -- ===== 1–5. Crear un grupo de 10 transacciones reserva Q5,000.00 sin mover el efectivo físico =====
  v_moves := (SELECT count(*) FROM cash_movements);
  v_group := create_payment_group(v_type, '  Pagos varios   del día ', pg_temp.agent(), NULL, 5000,
    pg_temp.items(10, 500), 'Lista del día', v_cashier, 'K:GRUPO-1');
  PERFORM pg_temp.expect('1 grupo creado abierto y pendiente',
    (SELECT status || '/' || display_status || '/' || description || '/' || (code LIKE 'PG-%')::TEXT FROM payment_group_balances WHERE id = v_group),
    'ABIERTO/PENDIENTE/Pagos varios del día/true');
  PERFORM pg_temp.expect('2 diez transacciones numeradas y pendientes',
    (SELECT count(*) || '/' || min(item_number) || '-' || max(item_number) || '/' || bool_and(status = 'PENDIENTE')
     FROM payment_group_item_balances WHERE group_id = v_group), '10/1-10/true');
  PERFORM pg_temp.expect('3 reserva del monto autorizado', pg_temp.money(cash_reserved_total() - v_reserved0), '5000.00');
  PERFORM pg_temp.expect('4 el saldo físico no cambia', pg_temp.money(cash_balance()), pg_temp.money(v_base));
  PERFORM pg_temp.expect('4 ningún movimiento en el Kardex', (SELECT count(*) FROM cash_movements)::TEXT, v_moves::TEXT);
  PERFORM pg_temp.expect('5 el disponible baja Q5,000.00', pg_temp.money(v_available0 - cash_available()), '5000.00');
  PERFORM pg_temp.expect('5 crear con la misma clave no reserva dos veces',
    (create_payment_group(v_type, 'Otro', pg_temp.agent(), NULL, 5000, pg_temp.items(10, 500), NULL, v_cashier, 'K:GRUPO-1') = v_group)::TEXT
      || '/' || pg_temp.money(cash_reserved_total() - v_reserved0), 'true/5000.00');

  -- ===== 6–9. Entregas individuales, parcial y sin pago =====
  PERFORM pg_temp.expect('6 confirmar la 1 (cajero)', pg_temp.pay(v_group, 1, 500, 'K:P1', v_cashier), 'OK');
  PERFORM pg_temp.expect('6 PAGADO', pg_temp.status(v_group, 1), 'PAGADO');
  PERFORM pg_temp.expect('6 salió Q500.00 de Caja', pg_temp.money(v_base - cash_balance()), '500.00');
  PERFORM pg_temp.expect('6 la reserva baja lo mismo: el disponible no cambia', pg_temp.money(v_available0 - cash_available()), '5000.00');
  PERFORM pg_temp.expect('7 confirmar la 2', pg_temp.pay(v_group, 2, 500, 'K:P2'), 'OK');
  PERFORM pg_temp.expect('7 confirmar la 5 sin depender de las demás', pg_temp.pay(v_group, 5, 500, 'K:P5'), 'OK');
  PERFORM pg_temp.expect('8 pago parcial de la 3', pg_temp.pay(v_group, 3, 300, 'K:P3'), 'OK');
  PERFORM pg_temp.expect('8 PARCIAL', pg_temp.status(v_group, 3), 'PARCIAL');
  PERFORM pg_temp.expect('9 sin pago exige observación',
    pg_temp.err(format('SELECT mark_payment_group_item_no_payment(%L, %L, %L, %L)', v_group, pg_temp.item(v_group, 4), 'no', v_admin)),
    'PAYMENT_GROUP_NOTE_REQUIRED');
  v_moves := (SELECT count(*) FROM cash_movements);
  PERFORM mark_payment_group_item_no_payment(v_group, pg_temp.item(v_group, 4), 'El beneficiario no recibió el pago', v_cashier);
  PERFORM pg_temp.expect('9 SIN_PAGO sin movimiento de Caja',
    pg_temp.status(v_group, 4) || '/' || ((SELECT count(*) FROM cash_movements) = v_moves), 'SIN_PAGO/true');
  PERFORM pg_temp.expect('9 sin pago dos veces',
    pg_temp.err(format('SELECT mark_payment_group_item_no_payment(%L, %L, %L, %L)', v_group, pg_temp.item(v_group, 4), 'Otra vez sin pago', v_admin)),
    'PAYMENT_GROUP_ITEM_ALREADY_PROCESSED');

  -- Ejemplo del pedido: pagado Q1,800.00 → físico −1,800, reservado 3,200, disponible igual.
  SELECT * INTO v_row FROM payment_group_balances WHERE id = v_group;
  PERFORM pg_temp.expect('Ej. totales del grupo',
    v_row.paid_amount || '/' || v_row.remaining_amount || '/' || v_row.paid_count || '-' || v_row.partial_count || '-'
      || v_row.no_payment_count || '-' || v_row.pending_count || '/' || v_row.display_status,
    '1800.00/3200.00/3-1-1-5/PARCIAL');
  PERFORM pg_temp.expect('Ej. saldo físico −1,800', pg_temp.money(v_base - cash_balance()), '1800.00');
  PERFORM pg_temp.expect('Ej. reservado 3,200', pg_temp.money(cash_reserved_total() - v_reserved0), '3200.00');
  PERFORM pg_temp.expect('Ej. disponible = físico − reservado', pg_temp.money(cash_available()), pg_temp.money(cash_balance() - cash_reserved_total()));
  PERFORM pg_temp.expect('Ej. disponible sigue −5,000 respecto del inicio', pg_temp.money(v_available0 - cash_available()), '5000.00');

  -- ===== 10–11. Observaciones e historial =====
  PERFORM add_payment_group_note(v_group, pg_temp.item(v_group, 3), 'Faltan Q200.00 por entregar', v_cashier);
  PERFORM add_payment_group_note(v_group, NULL, 'Grupo revisado con el supervisor', v_admin);
  PERFORM pg_temp.expect('10 observación guarda el estado del momento',
    (SELECT item_status || '/' || note FROM payment_group_events WHERE item_id = pg_temp.item(v_group, 3) AND event_type = 'OBSERVACION'),
    'PARCIAL/Faltan Q200.00 por entregar');
  PERFORM pg_temp.expect('11 historial de la transacción en orden',
    (SELECT string_agg(event_type, ',' ORDER BY created_at, event_type) FROM payment_group_events WHERE item_id = pg_temp.item(v_group, 3)),
    'ENTREGA,OBSERVACION');
  PERFORM pg_temp.expect('11 historial del grupo', (SELECT count(*) FROM payment_group_events WHERE group_id = v_group)::TEXT, '8');
  PERFORM pg_temp.expect('11 el historial no se modifica',
    pg_temp.err(format('UPDATE payment_group_events SET note = %L WHERE group_id = %L', 'x', v_group)), 'PAYMENT_GROUP_HISTORY_IMMUTABLE');
  PERFORM pg_temp.expect('11 ni se borra',
    pg_temp.err(format('DELETE FROM payment_group_events WHERE group_id = %L', v_group)), 'PAYMENT_GROUP_HISTORY_IMMUTABLE');
  PERFORM pg_temp.expect('11 un pago confirmado no cambia en silencio',
    pg_temp.err(format('UPDATE payment_group_items SET expected_amount = 1 WHERE group_id = %L', v_group)), 'PAYMENT_GROUP_DIRECT_WRITE');

  -- ===== 12–13. Sin duplicados ni sobrepagos =====
  v_moves := (SELECT count(*) FROM cash_movements);
  v_delivery := (SELECT id FROM payment_group_deliveries WHERE idempotency_key = 'K:P1');
  PERFORM pg_temp.expect('12 reintentar la misma confirmación devuelve la misma entrega',
    (register_payment_group_delivery(v_group, pg_temp.item(v_group, 1), 500, NULL, v_admin, 'K:P1') = v_delivery)::TEXT, 'true');
  PERFORM pg_temp.expect('12 confirmar de nuevo la 1', pg_temp.pay(v_group, 1, 500, 'K:P1-OTRA'), 'PAYMENT_GROUP_ITEM_ALREADY_PAID');
  PERFORM pg_temp.expect('12 sin movimientos nuevos', (SELECT count(*) FROM cash_movements)::TEXT, v_moves::TEXT);
  PERFORM pg_temp.expect('13 pagar más que lo esperado', pg_temp.pay(v_group, 6, 600, 'K:P6-MAS'), 'PAYMENT_GROUP_AMOUNT_EXCEEDS');
  PERFORM pg_temp.expect('13 completar la parcial con más de lo que falta', pg_temp.pay(v_group, 3, 250, 'K:P3-MAS'), 'PAYMENT_GROUP_AMOUNT_EXCEEDS');
  PERFORM pg_temp.expect('13 importe negativo', pg_temp.pay(v_group, 6, -1, 'K:P6-NEG'), 'PAYMENT_GROUP_INVALID_AMOUNT');

  -- ===== 14. Las pendientes conservan su reserva; la reserva bloquea otras salidas =====
  PERFORM pg_temp.expect('14 pendientes reservadas', pg_temp.money(cash_reserved_total() - v_reserved0), '3200.00');
  PERFORM pg_temp.expect('14 una salida que toma dinero reservado se rechaza',
    pg_temp.err(format('SELECT apply_cash_movement(%L, %L, %L, %L, %L, NULL, NULL, NULL, %L, NULL, %L)',
      'SALIDA_MANUAL', 'OUT', cash_available() + 1, v_admin, 'Gasto', 'Gasto', 'TEST:PG-SALIDA')), 'CASH_RESERVED_FUNDS');
  PERFORM pg_temp.expect('14 una salida dentro del disponible pasa',
    pg_temp.err(format('SELECT apply_cash_movement(%L, %L, 10, %L, %L, NULL, NULL, NULL, %L, NULL, %L)',
      'SALIDA_MANUAL', 'OUT', v_admin, 'Gasto chico', 'Gasto chico', 'TEST:PG-SALIDA-OK')), 'OK');
  PERFORM pg_temp.expect('14 un ajuste autorizado (corrección) no se bloquea',
    pg_temp.err(format('SELECT apply_cash_movement(%L, %L, %L, %L, %L, NULL, NULL, NULL, %L, NULL, %L)',
      'AJUSTE', 'OUT', cash_available() + 5, v_admin, 'Faltante contado', 'Arqueo', 'TEST:PG-AJUSTE')), 'OK');
  PERFORM apply_cash_movement('AJUSTE', 'IN', cash_available() * -1 + 10, v_admin, 'Devolver ajuste de prueba', NULL, NULL, NULL, 'Prueba', NULL, 'TEST:PG-AJUSTE-IN');
  PERFORM pg_temp.expect('14 otro grupo no puede reservar el mismo dinero',
    pg_temp.err(format('SELECT create_payment_group(%L, %L, %L, NULL, %L, %L, NULL, %L, %L)',
      v_type, 'Segundo grupo', pg_temp.agent(), cash_available() + 1, pg_temp.items(1, 1), v_admin, 'K:G2-NO')),
    'PAYMENT_GROUP_INSUFFICIENT_AVAILABLE');

  -- ===== 23. Un error no deja nada a medias =====
  v_moves := (SELECT count(*) FROM cash_movements);
  UPDATE transaction_banks SET is_active = false WHERE id = pg_temp.agent();
  PERFORM pg_temp.expect('23 entrega con banco inactivo falla', pg_temp.pay(v_group, 6, 500, 'K:P6-FALLA'), 'TRANSACTION_BANK_INACTIVE');
  UPDATE transaction_banks SET is_active = true WHERE id = (SELECT transaction_bank_id FROM payment_groups WHERE id = v_group);
  PERFORM pg_temp.expect('23 sin entrega, operación, historial ni movimiento',
    ((SELECT count(*) FROM payment_group_deliveries WHERE idempotency_key = 'K:P6-FALLA') = 0
     AND (SELECT count(*) FROM cash_movements) = v_moves
     AND pg_temp.status(v_group, 6) = 'PENDIENTE')::TEXT, 'true');

  -- Anular: una no pagada libera su reserva; una pagada solo si el dinero regresó.
  PERFORM pg_temp.expect('A anular exige administrador',
    pg_temp.err(format('SELECT void_payment_group_item(%L, %L, %L, false, %L)', v_group, pg_temp.item(v_group, 8), 'No se pagará', v_cashier)),
    'CASH_CUSTODY_FORBIDDEN');
  v_moves := (SELECT count(*) FROM cash_movements);
  PERFORM void_payment_group_item(v_group, pg_temp.item(v_group, 8), 'Beneficiario dado de baja', false, v_admin);
  PERFORM pg_temp.expect('A anular la 8 libera Q500.00 sin movimiento',
    pg_temp.status(v_group, 8) || '/' || pg_temp.money(cash_reserved_total() - v_reserved0) || '/' || ((SELECT count(*) FROM cash_movements) = v_moves),
    'ANULADO/2700.00/true');
  PERFORM pg_temp.expect('A la pagada no se anula si el dinero no regresó',
    pg_temp.err(format('SELECT void_payment_group_item(%L, %L, %L, false, %L)', v_group, pg_temp.item(v_group, 5), 'Error', v_admin)),
    'PAYMENT_GROUP_ITEM_HAS_PAYMENTS');
  v_op := (SELECT operation_id FROM payment_group_deliveries WHERE idempotency_key = 'K:P5');
  PERFORM pg_temp.expect('A su operación no se anula directo en Transaccionar',
    pg_temp.err(format('SELECT void_bank_deposit_operation(%L, CURRENT_DATE, %L, %L)', v_op, v_admin, 'Directo')),
    'PAYMENT_GROUP_OPERATION_LOCKED');
  v_base := cash_balance();
  PERFORM void_payment_group_item(v_group, pg_temp.item(v_group, 5), 'Pago duplicado, el beneficiario devolvió el efectivo', true, v_admin);
  PERFORM pg_temp.expect('A el dinero devuelto entra con la reversa de su operación',
    pg_temp.money(cash_balance() - v_base) || '/' || (SELECT is_voided FROM bank_deposit_operations WHERE id = v_op)
      || '/' || (SELECT count(*) FROM cash_movements WHERE reference_id = v_op AND movement_type = 'ANULACION'),
    '500.00/true/1');
  PERFORM pg_temp.expect('A anulada y liberada', pg_temp.status(v_group, 5) || '/' || pg_temp.money(cash_reserved_total() - v_reserved0),
    'ANULADO/2700.00');

  -- ===== 15–17. Resolver, liberar y cerrar =====
  PERFORM pg_temp.pay(v_group, 6, 500, 'K:P6');
  PERFORM pg_temp.pay(v_group, 7, 500, 'K:P7');
  PERFORM mark_payment_group_item_no_payment(v_group, pg_temp.item(v_group, 9), 'Beneficiario no localizado', v_admin);
  PERFORM pg_temp.expect('17 no se cierra con pendientes',
    pg_temp.err(format('SELECT close_payment_group(%L, NULL, %L)', v_group, v_admin)), 'PAYMENT_GROUP_HAS_PENDING');
  PERFORM mark_payment_group_item_no_payment(v_group, pg_temp.item(v_group, 10), 'No se presentó', v_admin);
  PERFORM pg_temp.expect('17 ni con parciales o sin pago sin resolución',
    pg_temp.err(format('SELECT close_payment_group(%L, NULL, %L)', v_group, v_admin)), 'PAYMENT_GROUP_UNRESOLVED');
  PERFORM pg_temp.expect('15 liberar exige administrador',
    pg_temp.err(format('SELECT resolve_payment_group_item(%L, %L, %L, true, %L)', v_group, pg_temp.item(v_group, 4), 'No llegó', v_cashier)),
    'CASH_CUSTODY_FORBIDDEN');
  PERFORM resolve_payment_group_item(v_group, pg_temp.item(v_group, 4), 'El beneficiario no llegó; se libera', true, v_admin);
  PERFORM pg_temp.expect('15 liberar la 4 baja la reserva Q500.00', pg_temp.money(cash_reserved_total() - v_reserved0), '1200.00');
  PERFORM resolve_payment_group_item(v_group, pg_temp.item(v_group, 3), 'Se entregaron Q300.00; Q200.00 quedan para otro día', false, v_cashier);
  PERFORM resolve_payment_group_item(v_group, pg_temp.item(v_group, 9), 'No localizado', false, v_cashier);
  PERFORM resolve_payment_group_item(v_group, pg_temp.item(v_group, 10), 'No se presentó', false, v_cashier);
  PERFORM pg_temp.expect('15 una resolución por transacción',
    pg_temp.err(format('SELECT resolve_payment_group_item(%L, %L, %L, false, %L)', v_group, pg_temp.item(v_group, 9), 'Otra resolución', v_admin)),
    'PAYMENT_GROUP_ITEM_ALREADY_RESOLVED');
  PERFORM pg_temp.expect('16 cerrar exige administrador',
    pg_temp.err(format('SELECT close_payment_group(%L, NULL, %L)', v_group, v_cashier)), 'CASH_CUSTODY_FORBIDDEN');
  v_base := cash_balance();
  v_moves := (SELECT count(*) FROM cash_movements);
  PERFORM close_payment_group(v_group, 'Conciliado con la lista firmada', v_admin);
  SELECT * INTO v_row FROM payment_group_balances WHERE id = v_group;
  PERFORM pg_temp.expect('16 cerrado y conciliado',
    v_row.display_status || '/' || v_row.closing_paid || '/' || v_row.closing_released || '/' || v_row.released_amount,
    'COMPLETADO/2300.00/1200.00/2700.00');
  PERFORM pg_temp.expect('16 pagado + liberado = autorizado', pg_temp.money(v_row.paid_amount + v_row.released_amount), '5000.00');
  PERFORM pg_temp.expect('15 todo lo no usado vuelve al disponible', pg_temp.money(cash_reserved_total() - v_reserved0), '0.00');
  PERFORM pg_temp.expect('16 cerrar no mueve Caja',
    (cash_balance() = v_base AND (SELECT count(*) FROM cash_movements) = v_moves)::TEXT, 'true');
  PERFORM pg_temp.expect('16 un grupo cerrado no recibe entregas', pg_temp.pay(v_group, 3, 100, 'K:P3-TARDE'), 'PAYMENT_GROUP_NOT_OPEN');

  -- ===== 18–21. Solo los pagos reales mueven Caja, una vez, en el Kardex y con su referencia =====
  PERFORM pg_temp.expect('18 Kardex del grupo = lo pagado',
    pg_temp.money((SELECT -sum(CASE m.direction WHEN 'IN' THEN m.amount WHEN 'OUT' THEN -m.amount ELSE 0 END)
       FROM payment_group_deliveries d JOIN cash_movements m ON m.reference_type = 'BANK_DEPOSIT' AND m.reference_id = d.operation_id
       WHERE d.group_id = v_group)), '2300.00');
  PERFORM pg_temp.expect('19 cada entrega es una salida del Kardex ligada a su operación',
    (SELECT count(*) FROM payment_group_deliveries d
     WHERE d.group_id = v_group AND EXISTS (
       SELECT 1 FROM cash_movements m WHERE m.reference_id = d.operation_id AND m.direction = 'OUT' AND m.amount = d.amount))::TEXT,
    (SELECT count(*) FROM payment_group_deliveries WHERE group_id = v_group)::TEXT);
  PERFORM pg_temp.expect('20 la operación lleva el código del grupo y el número',
    (SELECT description LIKE 'Pago grupal PG-% #3 — Pagos varios del día — Beneficiario 3'
     FROM bank_deposit_operations WHERE id = (SELECT operation_id FROM payment_group_deliveries WHERE idempotency_key = 'K:P3'))::TEXT, 'true');
  PERFORM pg_temp.expect('21 una operación y un movimiento original por entrega',
    (SELECT count(*) FROM cash_movements m JOIN payment_group_deliveries d ON d.operation_id = m.reference_id
     WHERE d.group_id = v_group AND m.movement_type <> 'ANULACION')::TEXT,
    (SELECT count(*) FROM payment_group_deliveries WHERE group_id = v_group)::TEXT);

  -- Anular un grupo sin pagos libera todo.
  v_group2 := create_payment_group(v_type, 'Grupo a anular', pg_temp.agent(), NULL, 300, pg_temp.items(2, 100), NULL, v_admin, 'K:G2');
  PERFORM pg_temp.expect('G2 reserva', pg_temp.money(cash_reserved_total() - v_reserved0), '300.00');
  PERFORM pg_temp.pay(v_group2, 1, 100, 'K:G2-P1');
  PERFORM pg_temp.expect('G2 con pagos no se anula completo',
    pg_temp.err(format('SELECT void_payment_group(%L, %L, %L)', v_group2, 'Se cancela', v_admin)), 'PAYMENT_GROUP_HAS_PAYMENTS');
  PERFORM void_payment_group_item(v_group2, pg_temp.item(v_group2, 1), 'Devolvió el efectivo', true, v_admin);
  PERFORM void_payment_group(v_group2, 'La lista se canceló', v_admin);
  PERFORM pg_temp.expect('G2 anulado libera todo',
    (SELECT display_status || '/' || released_amount FROM payment_group_balances WHERE id = v_group2) || '/'
      || pg_temp.money(cash_reserved_total() - v_reserved0), 'ANULADO/300.00/0.00');

  -- Préstamos Génesis = cobrar cuotas: no reserva nada, cada cobro ENTRA a Caja.
  v_genesis_type := (SELECT id FROM transaction_types WHERE balance_effect = 'PAGO_GENESIS' AND is_active ORDER BY created_at LIMIT 1);
  IF v_genesis_type IS NOT NULL AND EXISTS (SELECT 1 FROM banks WHERE special_account = 'GENESIS' AND is_active) THEN
    UPDATE transaction_types SET allows_group_payment = true WHERE id = v_genesis_type;
    -- The Génesis line needs room for payments (it is a credit line, max Q120,000).
    IF (SELECT final_balance FROM banks WHERE special_account = 'GENESIS' AND is_active LIMIT 1) <> 0 THEN
      PERFORM adjust_bank_balance((SELECT id FROM banks WHERE special_account = 'GENESIS' AND is_active LIMIT 1),
        0, CURRENT_DATE, v_admin, 'Base de prueba', NULL);
    END IF;
    -- Since 1760009500000 a Génesis group is approved as a whole (sql/tests/payment-group-approval.test.sql).
    v_in_group := create_payment_group(v_genesis_type, 'Grupo solidario Las Flores', pg_temp.agent(), NULL, 900,
      (SELECT jsonb_agg(e || jsonb_build_object('creditNumber', 'CR-' || n)) FROM jsonb_array_elements(pg_temp.items(3, 300)) WITH ORDINALITY AS t(e, n)),
      NULL, v_cashier, 'K:IN');
    PERFORM pg_temp.expect('IN cobrar no reserva', pg_temp.money(cash_reserved_total() - v_reserved0), '0.00');
    PERFORM pg_temp.expect('IN sin banco agente (línea Génesis)',
      (SELECT (transaction_bank_id IS NULL AND cash_direction = 'IN')::TEXT FROM payment_groups WHERE id = v_in_group), 'true');
    v_base := cash_balance();
    PERFORM pg_temp.expect('IN queda pendiente de aprobación',
      (SELECT display_status FROM payment_group_balances WHERE id = v_in_group), 'PENDIENTE_APROBACION');
    PERFORM pg_temp.expect('IN no se cobra cuota por cuota', pg_temp.pay(v_in_group, 1, 200, 'K:IN-1'), 'PAYMENT_GROUP_PENDING_APPROVAL');
    PERFORM pg_temp.expect('IN pendiente no entra a Caja', pg_temp.money(cash_balance() - v_base), '0.00');
  ELSE
    RAISE NOTICE 'SKIP IN (sin tipo Pago Préstamos Génesis o línea Génesis)';
  END IF;

  -- If a type stops taking cash out, its open group cannot keep delivering.
  v_group2 := create_payment_group(v_type, 'Grupo con tipo cambiado', pg_temp.agent(), NULL, 100, pg_temp.items(1, 100), NULL, v_admin, 'K:G3');
  UPDATE transaction_types SET cash_effect = 'NONE' WHERE id = v_type;
  PERFORM pg_temp.expect('T tipo cambiado', pg_temp.pay(v_group2, 1, 100, 'K:G3-P1'), 'PAYMENT_GROUP_TYPE_CHANGED');
  UPDATE transaction_types SET cash_effect = 'OUT' WHERE id = v_type;
  -- Editing a pending item's expected amount respects the authorized total.
  PERFORM pg_temp.expect('E editar monto por encima de lo autorizado',
    pg_temp.err(format('SELECT update_payment_group_item(%L, %L, 150, NULL, false, NULL, %L)', v_group2, pg_temp.item(v_group2, 1), v_admin)),
    'PAYMENT_GROUP_ITEMS_EXCEED_AUTHORIZED');
  PERFORM update_payment_group_item(v_group2, pg_temp.item(v_group2, 1), 80, 'Juan Pérez', true, NULL, v_cashier);
  PERFORM pg_temp.expect('E monto y referencia editados con historial',
    (SELECT expected_amount || '/' || reference FROM payment_group_items WHERE id = pg_temp.item(v_group2, 1)) || '/'
      || (SELECT count(*) FROM payment_group_events WHERE item_id = pg_temp.item(v_group2, 1) AND event_type = 'MONTO_CAMBIADO'),
    '80.00/Juan Pérez/1');

  -- ===== 24. Consistencia: disponible = físico − reservas; reservas = lo derivado de los registros =====
  PERFORM pg_temp.expect('24 disponible = físico − reservado', pg_temp.money(cash_available()), pg_temp.money(cash_balance() - cash_reserved_total()));
  PERFORM pg_temp.expect('24 reservado = autorizado − pagado − liberado de los grupos abiertos que sacan efectivo',
    pg_temp.money(cash_reserved_total()),
    pg_temp.money((SELECT COALESCE(sum(authorized_amount - paid_amount - released_amount), 0)
       FROM payment_group_balances WHERE status = 'ABIERTO' AND cash_direction = 'OUT')));
  PERFORM pg_temp.expect('24 cadena del Kardex continua',
    (SELECT count(*) FROM (SELECT previous_balance, lag(new_balance) OVER (ORDER BY sequence) AS prior FROM cash_movements) k
     WHERE prior IS NOT NULL AND prior <> previous_balance)::TEXT, '0');
END $$;

ROLLBACK;
