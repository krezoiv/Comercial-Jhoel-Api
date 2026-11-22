-- Arqueo de apertura y resolución documentada de diferencias (migración 1760009200000).
-- Nada se cuadra solo: la apertura solo registra evidencia; una diferencia se cierra
-- con causa + explicación (admin) y, si se pide, con el ajuste autorizado exacto.
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/cash-opening-and-resolutions.test.sql

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

-- Caja exactamente en p_amount.
CREATE FUNCTION pg_temp.set_cash(p_amount NUMERIC, p_user UUID) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE v_base NUMERIC := cash_balance();
BEGIN
  IF v_base <> p_amount THEN
    PERFORM apply_cash_movement('AJUSTE', CASE WHEN v_base < p_amount THEN 'IN' ELSE 'OUT' END, abs(p_amount - v_base),
      p_user, 'Prueba apertura', NULL, NULL, NULL, 'Prueba', NULL, 'COR-ADJ-' || gen_random_uuid());
  END IF;
END $$;

DO $$
DECLARE
  v_admin UUID := pg_temp.user_with('SUPER_ADMIN');
  v_operator UUID := COALESCE(pg_temp.user_with('SUPERVISOR_DE_TURNO'), pg_temp.user_with('ADMIN'), pg_temp.user_with('SUPER_ADMIN'));
  v_cashier UUID := pg_temp.user_with('USER');
  v_close_count UUID;
  v_count UUID;
  v_retry UUID;
  v_res UUID;
  v_rows BIGINT;
  v_balance NUMERIC;
  v_audit UUID;
BEGIN
  -- Día 1: cierre con Caja en Q5,000 y un arqueo de cierre cuadrado.
  INSERT INTO day_openings (date, opened_by) VALUES (DATE '2099-11-01', v_admin);
  PERFORM pg_temp.set_cash(5000, v_admin);
  v_close_count := register_cash_count(pg_temp.breakdown(200, 25), 'Cierre', NULL, v_admin, 'COR-CLOSE-1', NULL, NULL);

  -- Día 2: apertura.
  INSERT INTO day_openings (date, opened_by) VALUES (DATE '2099-11-02', v_admin);

  PERFORM pg_temp.expect('A1 un cajero no hace la apertura',
    pg_temp.err(format($f$SELECT register_cash_opening_count(%L, NULL, NULL, NULL, %L, 'COR-A1')$f$,
      pg_temp.breakdown(200, 25), v_cashier)), 'CASH_CUSTODY_FORBIDDEN');
  PERFORM pg_temp.expect('A2 con diferencia exige motivo y responsable',
    pg_temp.err(format($f$SELECT register_cash_opening_count(%L, NULL, NULL, NULL, %L, 'COR-A2')$f$,
      pg_temp.breakdown(200, 24, 50, 3), v_operator)), 'CASH_OPENING_DIFFERENCE_REASON_REQUIRED');
  PERFORM pg_temp.expect('A3 … y no dejó ningún arqueo a medias',
    (SELECT count(*)::TEXT FROM cash_counts WHERE idempotency_key = 'APE:COR-A2'), '0');

  v_rows := (SELECT count(*) FROM cash_movements);
  v_balance := cash_balance();
  v_count := register_cash_opening_count(pg_temp.breakdown(200, 24, 50, 3), 'Apertura', 'Faltan Q50 desde la noche',
    'Supervisor de turno', v_operator, 'COR-A4');
  PERFORM pg_temp.expect('A4 apertura con faltante: cierre oficial, contado y diferencia',
    (SELECT o.previous_close_balance || ' ' || c.total_counted || ' ' || o.difference || ' ' || c.result
     FROM cash_opening_counts o JOIN cash_counts c ON c.id = o.count_id WHERE o.count_id = v_count),
    '5000.00 4950.00 -50.00 FALTANTE');
  PERFORM pg_temp.expect('A5 guarda el último conteo del cierre anterior',
    (SELECT previous_count_id = v_close_count AND previous_counted = 5000 AND previous_difference = 0
     FROM cash_opening_counts WHERE count_id = v_count)::TEXT, 'true');
  PERFORM pg_temp.expect('A6 guarda motivo, responsable y movimientos desde la apertura',
    (SELECT difference_reason || ' | ' || responsible || ' | ' || movements_since_opening
     FROM cash_opening_counts WHERE count_id = v_count), 'Faltan Q50 desde la noche | Supervisor de turno | 0');
  PERFORM pg_temp.expect('A7 no mueve el Kardex ni el saldo (no se cuadra sola)',
    ((SELECT count(*) FROM cash_movements) = v_rows AND cash_balance() = v_balance)::TEXT, 'true');
  v_retry := register_cash_opening_count(pg_temp.breakdown(100, 1), NULL, NULL, NULL, v_operator, 'COR-A4');
  PERFORM pg_temp.expect('A8 reintento: la misma apertura', (v_retry = v_count)::TEXT, 'true');
  PERFORM pg_temp.expect('A9 una sola apertura por día',
    pg_temp.err(format($f$SELECT register_cash_opening_count(%L, NULL, NULL, NULL, %L, 'COR-A9')$f$,
      pg_temp.breakdown(200, 25), v_operator)), 'CASH_OPENING_COUNT_EXISTS');
  PERFORM pg_temp.expect('A10 la apertura es inmutable',
    pg_temp.err(format($f$UPDATE cash_opening_counts SET difference_reason = 'otro' WHERE count_id = %L$f$, v_count)),
    'CASH_CUSTODY_IMMUTABLE');

  -- Día 3: apertura cuadrada, sin motivo.
  INSERT INTO day_openings (date, opened_by) VALUES (DATE '2099-11-03', v_admin);
  PERFORM pg_temp.expect('A11 apertura cuadrada no pide motivo',
    pg_temp.err(format($f$SELECT register_cash_opening_count(%L, NULL, NULL, NULL, %L, 'COR-A11')$f$,
      pg_temp.breakdown(200, 25), v_operator)), 'OK');

  -- Resolución de la diferencia de la apertura del día 2 (faltante Q50).
  PERFORM pg_temp.expect('B1 solo administradores resuelven',
    pg_temp.err(format($f$SELECT resolve_cash_count_difference('ARQUEO_CAJA', %L, 'NO_DETERMINADA',
      'Se revisó y no se encontró la causa', FALSE, %L, 'COR-B1')$f$, v_count, v_cashier)),
    'CASH_CUSTODY_FORBIDDEN');
  PERFORM pg_temp.expect('B2 la explicación es obligatoria',
    pg_temp.err(format($f$SELECT resolve_cash_count_difference('ARQUEO_CAJA', %L, 'NO_DETERMINADA', 'corto',
      FALSE, %L, 'COR-B2')$f$, v_count, v_admin)), 'CASH_RESOLUTION_EXPLANATION_REQUIRED');
  PERFORM pg_temp.expect('B3 la causa debe ser válida',
    pg_temp.err(format($f$SELECT resolve_cash_count_difference('ARQUEO_CAJA', %L, 'FRAUDE', 'Una explicación larga',
      FALSE, %L, 'COR-B3')$f$, v_count, v_admin)), 'CASH_RESOLUTION_INVALID_CAUSE');
  PERFORM pg_temp.expect('B4 un arqueo cuadrado no tiene nada que resolver',
    pg_temp.err(format($f$SELECT resolve_cash_count_difference('ARQUEO_CAJA', %L, 'NO_DETERMINADA',
      'Una explicación larga', FALSE, %L, 'COR-B4')$f$, v_close_count, v_admin)), 'CASH_COUNT_NO_DIFFERENCE');

  v_rows := (SELECT count(*) FROM cash_movements);
  v_balance := cash_balance();
  v_res := resolve_cash_count_difference('ARQUEO_CAJA', v_count, 'DIFERENCIA_ARQUEO',
    'Faltante confirmado al recontar; autoriza la gerencia', TRUE, v_admin, 'COR-B5');
  PERFORM pg_temp.expect('B5 el ajuste autorizado es exactamente la diferencia (salida de Q50)',
    (SELECT m.movement_type || ' ' || m.direction || ' ' || m.amount || ' ' || m.reference_type
     FROM cash_difference_resolutions r JOIN cash_movements m ON m.id = r.adjustment_movement_id WHERE r.id = v_res),
    'AJUSTE OUT 50.00 CASH_COUNT');
  PERFORM pg_temp.expect('B6 un solo movimiento nuevo y el saldo baja Q50',
    ((SELECT count(*) FROM cash_movements) - v_rows) || ' ' || (v_balance - cash_balance()), '1 50.00');
  PERFORM pg_temp.expect('B7 el arqueo conserva su diferencia original (no se edita)',
    (SELECT difference::TEXT FROM cash_counts WHERE id = v_count), '-50.00');
  PERFORM pg_temp.expect('B8 reintento: la misma resolución, sin otro ajuste',
    (resolve_cash_count_difference('ARQUEO_CAJA', v_count, 'DIFERENCIA_ARQUEO', 'Otra vez la misma solicitud',
      TRUE, v_admin, 'COR-B5') = v_res AND (SELECT count(*) FROM cash_movements) - v_rows = 1)::TEXT, 'true');
  PERFORM pg_temp.expect('B9 una diferencia se resuelve una sola vez',
    pg_temp.err(format($f$SELECT resolve_cash_count_difference('ARQUEO_CAJA', %L, 'NO_DETERMINADA',
      'Segunda resolución del mismo arqueo', FALSE, %L, 'COR-B9')$f$, v_count, v_admin)),
    'CASH_DIFFERENCE_ALREADY_RESOLVED');
  PERFORM pg_temp.expect('B10 la resolución es inmutable',
    pg_temp.err(format($f$DELETE FROM cash_difference_resolutions WHERE id = %L$f$, v_res)), 'CASH_CUSTODY_IMMUTABLE');

  -- Sobrante explicado sin ajuste, y Bodega (solo explicación).
  v_count := register_cash_count(pg_temp.breakdown(200, 25, 10, 2), NULL, NULL, v_admin, 'COR-C1', NULL, NULL);
  v_rows := (SELECT count(*) FROM cash_movements);
  PERFORM resolve_cash_count_difference('ARQUEO_CAJA', v_count, 'ERROR_REGISTRO',
    'Un depósito de Q20 se registró como Q0; se corrige en Transaccionar', FALSE, v_admin, 'COR-C1');
  PERFORM pg_temp.expect('C1 explicada sin ajuste: no mueve el Kardex',
    ((SELECT count(*) FROM cash_movements) - v_rows)::TEXT, '0');
  PERFORM apply_warehouse_cash_movement('ENTREGA_DESDE_CAJA', 'IN', 1000, v_admin, 'Prueba', NULL, NULL, NULL, NULL, NULL,
    'COR-WH-' || gen_random_uuid());
  v_audit := register_warehouse_cash_audit(pg_temp.breakdown(100, 1), NULL, v_admin, 'COR-WA');
  PERFORM pg_temp.expect('C2 Bodega no tiene ajuste en este paso',
    pg_temp.err(format($f$SELECT resolve_cash_count_difference('ARQUEO_BODEGA', %L, 'NO_DETERMINADA',
      'Faltante de Bodega en revisión', TRUE, %L, 'COR-C2')$f$, v_audit, v_admin)),
    'CASH_RESOLUTION_ADJUSTMENT_NOT_AVAILABLE');
  PERFORM pg_temp.expect('C3 … pero sí se explica',
    pg_temp.err(format($f$SELECT resolve_cash_count_difference('ARQUEO_BODEGA', %L, 'NO_DETERMINADA',
      'Faltante de Bodega en revisión', FALSE, %L, 'COR-C3')$f$, v_audit, v_admin)), 'OK');

  RAISE NOTICE 'Todas las pruebas de apertura y resoluciones pasaron.';
END $$;

ROLLBACK;
