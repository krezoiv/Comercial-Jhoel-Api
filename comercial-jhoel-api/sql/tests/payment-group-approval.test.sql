-- Pagos grupales de Fundación Génesis con aprobación (migración 1760009500000-PaymentGroupApproval):
-- registro con cuotas (crédito, cliente, monto, observación), validaciones de cantidad y suma, nada se mueve
-- mientras está pendiente, corrección con historial, aprobación atómica e idempotente, rechazo.
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK: no deja ningún dato.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/payment-group-approval.test.sql

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

CREATE FUNCTION pg_temp.item(p_group UUID, p_n INT) RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM payment_group_items WHERE group_id = p_group AND item_number = p_n
$$;

-- EL GOLFO: 10 cuotas de Q850.00 + 1 de Q784.00 = Q9,284.00 (11 cuotas).
CREATE FUNCTION pg_temp.golfo(p_extra JSONB DEFAULT '[]'::jsonb) RETURNS JSONB LANGUAGE sql AS $$
  SELECT jsonb_agg(jsonb_build_object(
           'expectedAmount', CASE WHEN g = 11 THEN 784 ELSE 850 END,
           'creditNumber', 'CR-' || (1000 + g),
           'reference', 'Cliente ' || g,
           'observation', CASE WHEN g = 3 THEN 'Pagó con billetes de Q100' END) ORDER BY g)
         || p_extra
  FROM generate_series(1, 11) g
$$;

CREATE FUNCTION pg_temp.genesis_balance() RETURNS NUMERIC LANGUAGE sql AS $$
  SELECT final_balance FROM banks WHERE special_account = 'GENESIS' AND is_active ORDER BY created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.operations(p_type UUID) RETURNS TEXT LANGUAGE sql AS $$
  SELECT count(*) || '/' || COALESCE(SUM(transaction_count), 0) || '/' || pg_temp.money(COALESCE(SUM(total_amount), 0))
  FROM bank_deposit_operations WHERE transaction_type_id = p_type AND NOT is_voided
$$;

DO $$
DECLARE
  v_admin UUID := pg_temp.admin_id();
  v_cashier UUID := pg_temp.cashier_id();
  v_other UUID;
  v_type UUID;
  v_plain_type UUID;
  v_group UUID;
  v_plain UUID;
  v_reject UUID;
  v_small UUID;
  v_cash0 NUMERIC;
  v_genesis0 NUMERIC;
  v_ops0 TEXT;
  v_moves0 BIGINT;
  v_events BIGINT;
  v_op UUID;
  v_max NUMERIC;
BEGIN
  IF v_cashier IS NULL THEN
    RAISE EXCEPTION 'Falta un usuario con rol USER para las pruebas de permisos';
  END IF;
  -- A second cashier (not the creator, not an admin); rolled back with everything else.
  INSERT INTO users (name, password_hash, username, role_id)
  VALUES ('Cajero QA', 'x', 'cajero_qa_aprobacion', (SELECT id FROM roles WHERE name = 'USER'))
  RETURNING id INTO v_other;

  v_type := (SELECT id FROM transaction_types WHERE balance_effect = 'PAGO_GENESIS' AND is_active ORDER BY created_at LIMIT 1);
  IF v_type IS NULL OR NOT EXISTS (SELECT 1 FROM banks WHERE special_account = 'GENESIS' AND is_active) THEN
    RAISE EXCEPTION 'Falta el tipo Pago Préstamos Génesis o la cuenta Génesis';
  END IF;
  UPDATE transaction_types SET allows_group_payment = true WHERE id = v_type;
  IF pg_temp.genesis_balance() <> 0 THEN
    PERFORM adjust_bank_balance((SELECT id FROM banks WHERE special_account = 'GENESIS' AND is_active LIMIT 1),
      0, CURRENT_DATE, v_admin, 'Base de prueba', NULL);
  END IF;

  -- ===== A. Registro y validaciones ===========================================================
  PERFORM pg_temp.expect('A1 cuota sin número de crédito',
    pg_temp.err(format('SELECT create_payment_group(%L, %L, NULL, NULL, 850, %L, NULL, %L, %L)', v_type, 'EL GOLFO',
      '[{"expectedAmount": 850, "reference": "Cliente 1"}]', v_cashier, 'K:A1')), 'PAYMENT_GROUP_CUOTA_INCOMPLETE');
  PERFORM pg_temp.expect('A2 cuota sin nombre del cliente',
    pg_temp.err(format('SELECT create_payment_group(%L, %L, NULL, NULL, 850, %L, NULL, %L, %L)', v_type, 'EL GOLFO',
      '[{"expectedAmount": 850, "creditNumber": "CR-1"}]', v_cashier, 'K:A2')), 'PAYMENT_GROUP_CUOTA_INCOMPLETE');
  PERFORM pg_temp.expect('A3 la suma de cuotas debe ser igual al monto total',
    pg_temp.err(format('SELECT create_payment_group(%L, %L, NULL, NULL, 9300, %L, NULL, %L, %L)', v_type, 'EL GOLFO',
      pg_temp.golfo(), v_cashier, 'K:A3')), 'PAYMENT_GROUP_TOTAL_MISMATCH');
  PERFORM pg_temp.expect('A4 número de crédito demasiado largo',
    pg_temp.err(format('SELECT create_payment_group(%L, %L, NULL, NULL, 850, %L, NULL, %L, %L)', v_type, 'EL GOLFO',
      jsonb_build_array(jsonb_build_object('expectedAmount', 850, 'creditNumber', repeat('9', 41), 'reference', 'Cliente')),
      v_cashier, 'K:A4')), 'PAYMENT_GROUP_TEXT_TOO_LONG');

  v_cash0 := cash_balance();
  v_genesis0 := pg_temp.genesis_balance();
  v_ops0 := pg_temp.operations(v_type);
  v_moves0 := (SELECT count(*) FROM cash_movements);
  v_group := create_payment_group(v_type, '  EL   GOLFO ', NULL, NULL, 9284, pg_temp.golfo(), NULL, v_cashier, 'K:GOLFO');
  PERFORM pg_temp.expect('A5 grupo creado PENDIENTE DE APROBACIÓN con código interno',
    (SELECT display_status || '/' || requires_approval || '/' || (code ~ '^PG-[0-9]{6}$') || '/' || description || '/' || item_count
     FROM payment_group_balances WHERE id = v_group), 'PENDIENTE_APROBACION/true/true/EL GOLFO/11');
  PERFORM pg_temp.expect('A6 cada cuota guarda correlativo, crédito, cliente, monto y observación',
    (SELECT item_number || '|' || credit_number || '|' || reference || '|' || expected_amount || '|' || observation
     FROM payment_group_items WHERE group_id = v_group AND item_number = 3), '3|CR-1003|Cliente 3|850.00|Pagó con billetes de Q100');
  PERFORM pg_temp.expect('A7 guardar no mueve Caja, la línea Génesis ni crea operaciones',
    pg_temp.money(cash_balance() - v_cash0) || '/' || pg_temp.money(pg_temp.genesis_balance() - v_genesis0) || '/'
      || (pg_temp.operations(v_type) = v_ops0) || '/' || ((SELECT count(*) FROM cash_movements) - v_moves0),
    '0.00/0.00/true/0');
  PERFORM pg_temp.expect('A8 un cobro de Génesis no reserva efectivo',
    pg_temp.money((SELECT remaining_amount FROM payment_group_balances WHERE id = v_group)
      * (CASE WHEN (SELECT cash_direction FROM payment_groups WHERE id = v_group) = 'OUT' THEN 1 ELSE 0 END)), '0.00');
  PERFORM pg_temp.expect('A9 historial: CREADO pendiente de aprobación',
    (SELECT event_type || '/' || group_status || '/' || pg_temp.money(amount) FROM payment_group_events WHERE group_id = v_group),
    'CREADO/PENDIENTE_APROBACION/9284.00');
  PERFORM pg_temp.expect('A10 reintento con la misma clave no duplica',
    (create_payment_group(v_type, 'EL GOLFO', NULL, NULL, 9284, pg_temp.golfo(), NULL, v_cashier, 'K:GOLFO') = v_group)::TEXT, 'true');

  -- ===== B. Mientras está pendiente no se procesa cuota por cuota =============================
  PERFORM pg_temp.expect('B1 no se confirma una cuota suelta',
    pg_temp.err(format('SELECT register_payment_group_delivery(%L, %L, 850, NULL, %L, %L)', v_group, pg_temp.item(v_group, 1), v_admin, 'K:B1')),
    'PAYMENT_GROUP_PENDING_APPROVAL');
  PERFORM pg_temp.expect('B2 no se marca sin pago',
    pg_temp.err(format('SELECT mark_payment_group_item_no_payment(%L, %L, %L, %L)', v_group, pg_temp.item(v_group, 2), 'No vino a pagar', v_admin)),
    'PAYMENT_GROUP_PENDING_APPROVAL');
  PERFORM pg_temp.expect('B3 no se cierra a mano',
    pg_temp.err(format('SELECT close_payment_group(%L, NULL, %L)', v_group, v_admin)), 'PAYMENT_GROUP_PENDING_APPROVAL');
  PERFORM pg_temp.expect('B4 no se anula una cuota suelta',
    pg_temp.err(format('SELECT void_payment_group_item(%L, %L, %L, false, %L)', v_group, pg_temp.item(v_group, 1), 'Error de digitación', v_admin)),
    'PAYMENT_GROUP_PENDING_APPROVAL');
  PERFORM pg_temp.expect('B5 la observación de una cuota va en la fila (no como evento)',
    pg_temp.err(format('SELECT add_payment_group_note(%L, %L, %L, %L)', v_group, pg_temp.item(v_group, 1), 'Nota de cuota', v_cashier)),
    'PAYMENT_GROUP_DRAFT_ITEM_NOTE');
  PERFORM pg_temp.expect('B6 la observación del grupo sí se registra',
    pg_temp.err(format('SELECT add_payment_group_note(%L, NULL, %L, %L)', v_group, 'Boleta recibida en ventanilla', v_cashier)), 'OK');
  PERFORM pg_temp.expect('B7 nadie borra cuotas directamente',
    pg_temp.err(format('DELETE FROM payment_group_items WHERE id = %L', pg_temp.item(v_group, 1))), 'PAYMENT_GROUP_DIRECT_WRITE');

  -- ===== C. Corrección mientras está pendiente ================================================
  PERFORM pg_temp.expect('C1 otro cajero (no creador, no admin) no corrige',
    pg_temp.err(format('SELECT update_pending_payment_group(%L, %L, 9284, %L, NULL, %L)', v_group, 'EL GOLFO', pg_temp.golfo(), v_other)),
    'CASH_CUSTODY_FORBIDDEN');
  PERFORM pg_temp.expect('C2 corrección con suma distinta se rechaza',
    pg_temp.err(format('SELECT update_pending_payment_group(%L, %L, 9284, %L, NULL, %L)', v_group, 'EL GOLFO',
      pg_temp.golfo('[{"expectedAmount": 16, "creditNumber": "CR-1012", "reference": "Cliente 12"}]'), v_cashier)),
    'PAYMENT_GROUP_TOTAL_MISMATCH');
  v_events := (SELECT count(*) FROM payment_group_events WHERE group_id = v_group);
  PERFORM update_pending_payment_group(v_group, 'EL GOLFO (Masagua)', 9300,
    pg_temp.golfo('[{"expectedAmount": 16, "creditNumber": "CR-1012", "reference": "Cliente 12", "observation": "Agregada"}]'),
    'Faltaba una cuota', v_cashier);
  PERFORM pg_temp.expect('C3 el creador agrega una cuota y corrige nombre y total',
    (SELECT description || '/' || pg_temp.money(authorized_amount) || '/' || item_count || '/' || pg_temp.money(assigned_amount)
     FROM payment_group_balances WHERE id = v_group), 'EL GOLFO (Masagua)/9300.00/12/9300.00');
  PERFORM pg_temp.expect('C4 correlativos 1..12 sin huecos',
    (SELECT string_agg(item_number::TEXT, ',' ORDER BY item_number) FROM payment_group_items WHERE group_id = v_group),
    '1,2,3,4,5,6,7,8,9,10,11,12');
  PERFORM pg_temp.expect('C5 historial EDITADO con antes y después',
    (SELECT event_type || '/' || (note LIKE '%Cuotas: 11 → 12%') || '/' || (note LIKE '%Faltaba una cuota%') || '/'
       || jsonb_array_length(details -> 'before' -> 'items') || '/' || jsonb_array_length(details -> 'after' -> 'items')
     FROM payment_group_events WHERE group_id = v_group AND event_type = 'EDITADO'),
    'EDITADO/true/true/11/12');
  PERFORM update_pending_payment_group(v_group, 'EL GOLFO', 9284, pg_temp.golfo(), 'Cuota 12 era de otro grupo', v_admin);
  PERFORM pg_temp.expect('C6 un administrador corrige (quita la cuota 12)',
    (SELECT description || '/' || item_count || '/' || pg_temp.money(authorized_amount) FROM payment_group_balances WHERE id = v_group),
    'EL GOLFO/11/9284.00');
  v_events := (SELECT count(*) FROM payment_group_events WHERE group_id = v_group);
  PERFORM update_pending_payment_group(v_group, 'EL GOLFO', 9284, pg_temp.golfo(), NULL, v_cashier);
  PERFORM pg_temp.expect('C7 guardar sin cambios no agrega historial',
    ((SELECT count(*) FROM payment_group_events WHERE group_id = v_group) - v_events)::TEXT, '0');
  PERFORM pg_temp.expect('C8 corregir no mueve nada',
    pg_temp.money(cash_balance() - v_cash0) || '/' || (pg_temp.operations(v_type) = v_ops0), '0.00/true');

  -- ===== D. Aprobación ========================================================================
  PERFORM pg_temp.expect('D1 un cajero no aprueba',
    pg_temp.err(format('SELECT approve_payment_group(%L, 9284, 11, %L, %L)', v_group, v_cashier, 'K:D1')), 'CASH_CUSTODY_FORBIDDEN');
  PERFORM pg_temp.expect('D2 si el grupo cambió desde la revisión, no se aprueba',
    pg_temp.err(format('SELECT approve_payment_group(%L, 9284, 12, %L, %L)', v_group, v_admin, 'K:D2')), 'PAYMENT_GROUP_CHANGED');

  INSERT INTO transaction_types (name, icon, cash_effect, allows_group_payment, created_by)
  VALUES ('Pago Varios QA aprobación', 'wallet', 'NONE', true, v_admin) RETURNING id INTO v_plain_type;
  v_plain := create_payment_group(v_plain_type, 'Pagos varios', (SELECT id FROM transaction_banks WHERE cash_box_code IS NULL AND is_active ORDER BY created_at LIMIT 1),
    NULL, 300, '[{"expectedAmount": 300, "reference": "Proveedor"}]', NULL, v_admin, 'K:PLAIN');
  PERFORM pg_temp.expect('D3 Pago Varios no requiere aprobación (flujo sin cambios)',
    (SELECT requires_approval || '/' || display_status FROM payment_group_balances WHERE id = v_plain), 'false/PENDIENTE');
  PERFORM pg_temp.expect('D4 Pago Varios no se aprueba',
    pg_temp.err(format('SELECT approve_payment_group(%L, 300, 1, %L, %L)', v_plain, v_admin, 'K:D4')), 'PAYMENT_GROUP_NOT_APPROVABLE');

  PERFORM approve_payment_group(v_group, 9284, 11, v_admin, 'K:APPROVE');
  PERFORM pg_temp.expect('D5 aprobado: grupo cerrado con usuario y fecha de aprobación',
    (SELECT display_status || '/' || status || '/' || (closed_by = v_admin) || '/' || (closed_at IS NOT NULL) || '/' || pg_temp.money(paid_amount)
     FROM payment_group_balances WHERE id = v_group), 'APROBADO/CERRADO/true/true/9284.00');
  PERFORM pg_temp.expect('D6 una operación real por cuota: 11 operaciones, 11 transacciones, Q9,284.00',
    split_part(pg_temp.operations(v_type), '/', 1)::INT - split_part(v_ops0, '/', 1)::INT || '/'
      || split_part(pg_temp.operations(v_type), '/', 2)::INT - split_part(v_ops0, '/', 2)::INT || '/'
      || pg_temp.money(split_part(pg_temp.operations(v_type), '/', 3)::NUMERIC - split_part(v_ops0, '/', 3)::NUMERIC),
    '11/11/9284.00');
  PERFORM pg_temp.expect('D7 el efectivo de las cuotas entra a Caja',
    pg_temp.money(cash_balance() - v_cash0), '9284.00');
  PERFORM pg_temp.expect('D8 la línea Génesis se actualiza con las reglas existentes',
    pg_temp.money(pg_temp.genesis_balance() - v_genesis0), '9284.00');
  PERFORM pg_temp.expect('D9 todas las cuotas PAGADO',
    (SELECT string_agg(DISTINCT status, ',') FROM payment_group_item_balances WHERE group_id = v_group), 'PAGADO');
  PERFORM pg_temp.expect('D10 cada operación lleva crédito y cliente',
    (SELECT o.description LIKE '%Crédito CR-1003%' AND o.client_name = 'Cliente 3'
     FROM payment_group_deliveries d JOIN bank_deposit_operations o ON o.id = d.operation_id
     WHERE d.item_id = pg_temp.item(v_group, 3))::TEXT, 'true');
  PERFORM pg_temp.expect('D11 Kardex: un movimiento por cuota',
    (SELECT count(*) FROM cash_movements m JOIN payment_group_deliveries d ON d.operation_id = m.reference_id
     WHERE m.reference_type = 'BANK_DEPOSIT' AND d.group_id = v_group)::TEXT, '11');
  PERFORM pg_temp.expect('D12 historial: 11 cuotas en orden y al final la APROBACION',
    (SELECT string_agg(CASE WHEN event_type = 'ENTREGA' THEN '#' || i.item_number ELSE event_type END, ',' ORDER BY e.created_at, e.id)
     FROM payment_group_events e LEFT JOIN payment_group_items i ON i.id = e.item_id
     WHERE e.group_id = v_group AND e.event_type IN ('ENTREGA', 'APROBACION')),
    '#1,#2,#3,#4,#5,#6,#7,#8,#9,#10,#11,APROBACION');
  PERFORM pg_temp.expect('D12b la APROBACION registra el total',
    (SELECT group_status || '/' || pg_temp.money(amount) FROM payment_group_events WHERE group_id = v_group AND event_type = 'APROBACION'),
    'APROBADO/9284.00');
  v_ops0 := pg_temp.operations(v_type);
  PERFORM pg_temp.expect('D13 reintento con la misma clave: idempotente',
    pg_temp.err(format('SELECT approve_payment_group(%L, 9284, 11, %L, %L)', v_group, v_admin, 'K:APPROVE')), 'OK');
  PERFORM pg_temp.expect('D14 segunda aprobación (otra clave): no contabiliza dos veces',
    pg_temp.err(format('SELECT approve_payment_group(%L, 9284, 11, %L, %L)', v_group, v_admin, 'K:APPROVE-2'))
      || '/' || (pg_temp.operations(v_type) = v_ops0), 'OK/true');
  PERFORM pg_temp.expect('D15 aprobado ya no se corrige',
    pg_temp.err(format('SELECT update_pending_payment_group(%L, %L, 9284, %L, NULL, %L)', v_group, 'EL GOLFO', pg_temp.golfo(), v_admin)),
    'PAYMENT_GROUP_NOT_OPEN');
  PERFORM pg_temp.expect('D16 aprobado ya no se anula como grupo',
    pg_temp.err(format('SELECT void_payment_group(%L, %L, %L)', v_group, 'Ya no aplica', v_admin)), 'PAYMENT_GROUP_NOT_OPEN');
  v_op := (SELECT operation_id FROM payment_group_deliveries WHERE item_id = pg_temp.item(v_group, 1));
  PERFORM pg_temp.expect('D17 una operación del grupo no se anula desde Transaccionar',
    pg_temp.err(format('SELECT void_bank_deposit_operation(%L, CURRENT_DATE, %L, %L)', v_op, v_admin, 'Prueba de anulación')),
    'PAYMENT_GROUP_OPERATION_LOCKED');

  -- ===== E. Rechazo (anular un grupo pendiente) ===============================================
  v_cash0 := cash_balance();
  v_reject := create_payment_group(v_type, 'GRUPO RECHAZADO', NULL, NULL, 500,
    '[{"expectedAmount": 500, "creditNumber": "CR-9", "reference": "Cliente R"}]', NULL, v_cashier, 'K:REJ');
  PERFORM pg_temp.expect('E1 un cajero no rechaza',
    pg_temp.err(format('SELECT void_payment_group(%L, %L, %L)', v_reject, 'No corresponde', v_cashier)), 'CASH_CUSTODY_FORBIDDEN');
  PERFORM void_payment_group(v_reject, 'Boleta duplicada', v_admin);
  PERFORM pg_temp.expect('E2 rechazado: ANULADO sin mover Caja',
    (SELECT display_status FROM payment_group_balances WHERE id = v_reject) || '/' || pg_temp.money(cash_balance() - v_cash0),
    'ANULADO/0.00');
  PERFORM pg_temp.expect('E3 un grupo anulado no se aprueba',
    pg_temp.err(format('SELECT approve_payment_group(%L, 500, 1, %L, %L)', v_reject, v_admin, 'K:E3')), 'PAYMENT_GROUP_NOT_OPEN');

  -- ===== F. Todo o nada =======================================================================
  -- The Génesis line allows Q1,000 more: the second of three Q600 cuotas fails → nothing is booked.
  v_max := (SELECT max_balance FROM banks WHERE special_account = 'GENESIS' AND is_active ORDER BY created_at LIMIT 1);
  UPDATE banks SET max_balance = pg_temp.genesis_balance() + 1000 WHERE special_account = 'GENESIS' AND is_active;
  v_small := create_payment_group(v_type, 'GRUPO SIN CUPO', NULL, NULL, 1800,
    '[{"expectedAmount": 600, "creditNumber": "A1", "reference": "Ana"}, {"expectedAmount": 600, "creditNumber": "A2", "reference": "Beto"}, {"expectedAmount": 600, "creditNumber": "A3", "reference": "Ceci"}]',
    NULL, v_cashier, 'K:SMALL');
  v_cash0 := cash_balance();
  v_ops0 := pg_temp.operations(v_type);
  PERFORM pg_temp.expect('F1 la aprobación falla completa si una cuota no cabe',
    (pg_temp.err(format('SELECT approve_payment_group(%L, 1800, 3, %L, %L)', v_small, v_admin, 'K:F1')) <> 'OK')::TEXT, 'true');
  PERFORM pg_temp.expect('F2 no quedó ninguna cuota contabilizada ni efectivo movido',
    (SELECT display_status || '/' || paid_amount FROM payment_group_balances WHERE id = v_small) || '/'
      || (pg_temp.operations(v_type) = v_ops0) || '/' || pg_temp.money(cash_balance() - v_cash0)
      || '/' || (SELECT count(*) FROM payment_group_deliveries WHERE group_id = v_small),
    'PENDIENTE_APROBACION/0.00/true/0.00/0');
  UPDATE banks SET max_balance = v_max WHERE special_account = 'GENESIS' AND is_active;

  RAISE NOTICE 'OK  pagos grupales Génesis con aprobación: todos los casos pasaron';
END $$;

ROLLBACK;
