-- Arqueo de Bodega con diferencia (migración 1760009100000).
-- Es un control: registra teórico, contado, diferencia y estado; nunca escribe
-- el Kardex, nunca ajusta y nunca se vuelve la base del inventario por billete.
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/warehouse-cash-audits.test.sql

BEGIN;

CREATE FUNCTION pg_temp.user_with(p_role TEXT) RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id WHERE r.name = p_role ORDER BY u.created_at LIMIT 1
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

CREATE FUNCTION pg_temp.breakdown(VARIADIC p_pairs NUMERIC[]) RETURNS JSONB LANGUAGE sql AS $$
  SELECT jsonb_agg(jsonb_build_object('denomination', p_pairs[i], 'quantity', p_pairs[i + 1]))
  FROM generate_series(1, array_length(p_pairs, 1), 2) i
$$;

-- Bodega exactamente en p_amount (movimiento dentro de la transacción de prueba).
CREATE FUNCTION pg_temp.set_warehouse(p_amount NUMERIC, p_user UUID) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE v_base NUMERIC := warehouse_cash_balance();
BEGIN
  IF v_base < p_amount THEN
    PERFORM apply_warehouse_cash_movement('ENTREGA_DESDE_CAJA', 'IN', p_amount - v_base, p_user,
      'Prueba arqueo de Bodega', NULL, NULL, NULL, NULL, NULL, 'WCA-SET-' || gen_random_uuid());
  ELSIF v_base > p_amount THEN
    PERFORM apply_warehouse_cash_movement('DEVOLUCION_A_CAJA', 'OUT', v_base - p_amount, p_user,
      'Prueba arqueo de Bodega', NULL, NULL, NULL, NULL, NULL, 'WCA-SET-' || gen_random_uuid());
  END IF;
END $$;

DO $$
DECLARE
  v_admin UUID := pg_temp.user_with('SUPER_ADMIN');
  -- A supervisor when the database has one (same rights as the Arqueo de Caja), else an admin.
  v_supervisor UUID := COALESCE(pg_temp.user_with('SUPERVISOR_DE_TURNO'), pg_temp.user_with('ADMIN'), pg_temp.user_with('SUPER_ADMIN'));
  v_cashier UUID := pg_temp.user_with('USER');
  v_audit UUID;
  v_retry UUID;
  v_cash_rows BIGINT;
  v_wh_rows BIGINT;
  v_cash NUMERIC;
  v_wh NUMERIC;
  v_anchor_counts BIGINT;
BEGIN
  -- (Sin día bancario abierto se rechaza con CASH_CUSTODY_DAY_NOT_OPEN, igual que el Arqueo de Caja.)
  INSERT INTO day_openings (date, opened_by) VALUES (DATE '2099-12-20', v_admin);
  PERFORM pg_temp.set_warehouse(3000, v_admin);
  v_cash := cash_balance();
  v_cash_rows := (SELECT count(*) FROM cash_movements);
  v_wh_rows := (SELECT count(*) FROM warehouse_cash_movements);
  v_anchor_counts := (SELECT count(*) FROM warehouse_cash_counts);

  -- Permisos: cajero no; supervisor y administrador sí (como el Arqueo de Caja).
  PERFORM pg_temp.expect('A1 un cajero no arquea Bodega',
    pg_temp.err(format($f$SELECT register_warehouse_cash_audit(%L, NULL, %L, 'WCA-A1')$f$,
      pg_temp.breakdown(100, 30), v_cashier)),
    'CASH_CUSTODY_FORBIDDEN');

  -- Validaciones del desglose.
  PERFORM pg_temp.expect('A2 sin desglose',
    pg_temp.err(format($f$SELECT register_warehouse_cash_audit('[]', NULL, %L, 'WCA-A2')$f$, v_admin)),
    'CASH_BREAKDOWN_REQUIRED');
  PERFORM pg_temp.expect('A3 denominación inválida',
    pg_temp.err(format($f$SELECT register_warehouse_cash_audit(%L, NULL, %L, 'WCA-A3')$f$,
      pg_temp.breakdown(30, 1), v_admin)),
    'CASH_INVALID_DENOMINATION');
  PERFORM pg_temp.expect('A4 cantidad decimal',
    pg_temp.err(format($f$SELECT register_warehouse_cash_audit(%L, NULL, %L, 'WCA-A4')$f$,
      pg_temp.breakdown(100, 1.5), v_admin)),
    'CASH_INVALID_DENOMINATION');
  PERFORM pg_temp.expect('A5 denominación repetida',
    pg_temp.err(format($f$SELECT register_warehouse_cash_audit(%L, NULL, %L, 'WCA-A5')$f$,
      pg_temp.breakdown(100, 1, 100, 2), v_admin)),
    'CASH_INVALID_DENOMINATION');
  PERFORM pg_temp.expect('A6 sin identificador',
    pg_temp.err(format($f$SELECT register_warehouse_cash_audit(%L, NULL, %L, '  ')$f$,
      pg_temp.breakdown(100, 1), v_admin)),
    'CASH_IDEMPOTENCY_KEY_REQUIRED');

  -- Cuadrado, faltante y sobrante.
  v_audit := register_warehouse_cash_audit(pg_temp.breakdown(200, 10, 100, 10), 'Conteo de cierre', v_supervisor, 'WCA-B1');
  PERFORM pg_temp.expect('B1 cuadrado: diferencia Q0',
    (SELECT theoretical_balance || ' ' || total_counted || ' ' || difference || ' ' || result
     FROM warehouse_cash_audits WHERE id = v_audit), '3000.00 3000.00 0.00 CUADRADO');
  PERFORM pg_temp.expect('B2 guarda cada denominación con su subtotal',
    (SELECT string_agg(denomination || 'x' || quantity || '=' || subtotal, ' ' ORDER BY denomination DESC)
     FROM warehouse_cash_audit_details WHERE audit_id = v_audit), '200.00x10=2000.00 100.00x10=1000.00');
  v_audit := register_warehouse_cash_audit(pg_temp.breakdown(200, 10, 50, 19), NULL, v_admin, 'WCA-B3');
  PERFORM pg_temp.expect('B3 faltante: diferencia negativa',
    (SELECT difference || ' ' || result FROM warehouse_cash_audits WHERE id = v_audit), '-50.00 FALTANTE');
  v_audit := register_warehouse_cash_audit(pg_temp.breakdown(200, 10, 100, 10, 0.05, 1), NULL, v_admin, 'WCA-B4');
  PERFORM pg_temp.expect('B4 sobrante: diferencia positiva (incluye monedas)',
    (SELECT difference || ' ' || result FROM warehouse_cash_audits WHERE id = v_audit), '0.05 SOBRANTE');

  -- Idempotencia: el mismo identificador devuelve el mismo arqueo.
  v_retry := register_warehouse_cash_audit(pg_temp.breakdown(100, 1), NULL, v_admin, 'WCA-B4');
  PERFORM pg_temp.expect('C1 reintento: mismo arqueo, sin duplicado',
    (v_retry = v_audit)::TEXT || ' ' || (SELECT count(*) FROM warehouse_cash_audits WHERE idempotency_key = 'WCA-B4'),
    'true 1');

  -- Nada se mueve: ni Kardex de caja, ni Kardex de Bodega, ni saldos, ni la base del inventario.
  PERFORM pg_temp.expect('D1 el arqueo no escribe ningún Kardex',
    ((SELECT count(*) FROM cash_movements) - v_cash_rows) || ' ' ||
    ((SELECT count(*) FROM warehouse_cash_movements) - v_wh_rows), '0 0');
  PERFORM pg_temp.expect('D2 los saldos no cambian (no hay ajuste automático)',
    (cash_balance() = v_cash AND warehouse_cash_balance() = 3000)::TEXT, 'true');
  PERFORM pg_temp.expect('D3 no crea un conteo base del inventario por billete',
    ((SELECT count(*) FROM warehouse_cash_counts) - v_anchor_counts)::TEXT, '0');

  -- El teórico es el del Kardex en ese momento: un movimiento posterior no cambia el arqueo guardado.
  PERFORM pg_temp.set_warehouse(3500, v_admin);
  PERFORM pg_temp.expect('E1 un arqueo guardado conserva su foto',
    (SELECT theoretical_balance || ' ' || difference FROM warehouse_cash_audits WHERE id = v_audit), '3000.00 0.05');
  v_audit := register_warehouse_cash_audit(pg_temp.breakdown(100, 35), NULL, v_admin, 'WCA-E2');
  PERFORM pg_temp.expect('E2 el siguiente arqueo usa el saldo nuevo',
    (SELECT theoretical_balance || ' ' || result FROM warehouse_cash_audits WHERE id = v_audit), '3500.00 CUADRADO');
  PERFORM pg_temp.expect('E3 guarda la última secuencia de Bodega',
    ((SELECT warehouse_sequence FROM warehouse_cash_audits WHERE id = v_audit)
      = (SELECT max(sequence) FROM warehouse_cash_movements))::TEXT, 'true');

  -- Inmutables.
  PERFORM pg_temp.expect('F1 no se edita',
    pg_temp.err(format($f$UPDATE warehouse_cash_audits SET total_counted = 0 WHERE id = %L$f$, v_audit)),
    'CASH_CUSTODY_IMMUTABLE');
  PERFORM pg_temp.expect('F2 no se borra',
    pg_temp.err(format($f$DELETE FROM warehouse_cash_audits WHERE id = %L$f$, v_audit)),
    'CASH_CUSTODY_IMMUTABLE');
  PERFORM pg_temp.expect('F3 su desglose tampoco',
    pg_temp.err(format($f$DELETE FROM warehouse_cash_audit_details WHERE audit_id = %L$f$, v_audit)),
    'CASH_CUSTODY_IMMUTABLE');

  RAISE NOTICE 'Todas las pruebas del arqueo de Bodega pasaron.';
END $$;

ROLLBACK;
