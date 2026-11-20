-- Caja y Bodega como dos ubicaciones independientes (migración 1760008800000):
--   · Arqueo de Caja: solo caja; Bodega es su saldo oficial y nunca entra en la diferencia.
--   · Cortes: fotografían el saldo oficial de Bodega; la diferencia del corte es solo de caja.
--   · Cuadre de Agentes → Arqueo de Caja: conteo físico de Caja Y de Bodega, independientes,
--     con teóricos, diferencias individuales y consolidada.
--   · Traslados Caja ↔ Bodega: no cambian el total bajo resguardo ni duplican el Kardex.
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/cash-custody-locations.test.sql

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

CREATE FUNCTION pg_temp.banks() RETURNS JSONB LANGUAGE sql AS $$
  SELECT COALESCE(jsonb_agg(jsonb_build_object('bankId', b.id,
           'verifiedBalance', CASE WHEN b.special_account = 'GUAYACAN' THEN guayacan_cash_balance() ELSE b.final_balance END)), '[]')
  FROM banks b WHERE b.is_active
$$;

CREATE FUNCTION pg_temp.open_bank_day(p_date DATE, p_user UUID) RETURNS VOID LANGUAGE sql AS $$
  INSERT INTO day_openings (date, opened_by) VALUES (p_date, p_user);
  INSERT INTO bank_balances (bank_id, operation_date, previous_balance, final_balance, user_id)
  SELECT id, p_date, 0, 0, p_user FROM banks WHERE is_active;
$$;

CREATE FUNCTION pg_temp.custody() RETURNS NUMERIC LANGUAGE sql AS $$
  SELECT cash_balance() + warehouse_cash_balance()
$$;

DO $$
DECLARE
  v_admin UUID := pg_temp.user_with('SUPER_ADMIN');
  v_day DATE := DATE '2099-12-01';
  v_base NUMERIC;
  v_custody NUMERIC;
  v_cash_rows BIGINT;
  v_wh_rows BIGINT;
  v_transfer UUID;
  v_withdrawal UUID;
  v_count UUID;
  v_op UUID;
  v_p1 UUID;
  v_p2 UUID;
  v_rec UUID;
  v_legacy UUID;
  v_plain UUID;
  v_row RECORD;
  v_cut1 TEXT;
BEGIN
  PERFORM pg_temp.open_bank_day(v_day, v_admin);
  PERFORM pg_temp.open_bank_day(v_day + 1, v_admin);
  PERFORM pg_temp.open_bank_day(v_day + 2, v_admin);

  -- Punto de partida: caja Q8,000 y Bodega Q0 (dentro de la transacción de prueba).
  v_base := warehouse_cash_balance();
  IF v_base > 0 THEN
    PERFORM apply_warehouse_cash_movement('AJUSTE', 'OUT', v_base, v_admin, 'Prueba ubicaciones',
      NULL, NULL, NULL, 'Prueba', NULL, 'LOC-WH-' || gen_random_uuid());
  END IF;
  v_base := cash_balance();
  IF v_base <> 8000 THEN
    PERFORM apply_cash_movement('AJUSTE', CASE WHEN v_base < 8000 THEN 'IN' ELSE 'OUT' END, abs(8000 - v_base),
      v_admin, 'Prueba ubicaciones', NULL, NULL, NULL, 'Prueba', NULL, 'LOC-ADJ-' || gen_random_uuid());
  END IF;
  -- Arqueo de partida (inventario por denominación de la caja): 40 × Q200.
  PERFORM register_cash_count(pg_temp.breakdown(200, 40), 'Partida', NULL, v_admin, 'LOC-A0', NULL, NULL);

  -- ── Traslado Caja → Bodega ────────────────────────────────────────────────────────
  v_custody := pg_temp.custody();
  SELECT count(*) INTO v_cash_rows FROM cash_movements;
  SELECT count(*) INTO v_wh_rows FROM warehouse_cash_movements;
  v_transfer := register_cash_warehouse_transfer(3000, pg_temp.breakdown(200, 15), 'Juan Caja', 'Ana Bodega',
    NULL, NULL, v_admin, 'LOC-T1');
  PERFORM pg_temp.expect('T1 caja baja Q3,000', cash_balance()::TEXT, '5000.00');
  PERFORM pg_temp.expect('T2 Bodega sube Q3,000', warehouse_cash_balance()::TEXT, '3000.00');
  PERFORM pg_temp.expect('T3 Caja → Bodega no cambia el total bajo resguardo', (pg_temp.custody() = v_custody)::TEXT, 'true');
  PERFORM pg_temp.expect('T4 un solo renglón nuevo en el Kardex de caja (sin duplicar)',
    ((SELECT count(*) FROM cash_movements) - v_cash_rows)::TEXT, '1');
  PERFORM pg_temp.expect('T5 un solo renglón nuevo en el Kardex de Bodega (sin duplicar)',
    ((SELECT count(*) FROM warehouse_cash_movements) - v_wh_rows)::TEXT, '1');
  PERFORM pg_temp.expect('T6 es un traslado interno, no un gasto ni un ingreso',
    (SELECT string_agg(movement_type, ',') FROM cash_movements WHERE reference_id = v_transfer) || ' / ' ||
    (SELECT string_agg(movement_type, ',') FROM warehouse_cash_movements WHERE reference_id = v_transfer),
    'ENTREGA_BODEGA / ENTREGA_DESDE_CAJA');

  -- ── Arqueo de Caja: solo caja ─────────────────────────────────────────────────────
  -- Contado Q4,900 contra Q5,000 teóricos: faltante de Q100 aunque Bodega tenga Q3,000.
  v_count := register_cash_count(pg_temp.breakdown(200, 24, 100, 1), 'Arqueo solo caja', NULL, v_admin, 'LOC-A1', NULL, NULL);
  SELECT * INTO v_row FROM cash_counts WHERE id = v_count;
  PERFORM pg_temp.expect('A1 total contado = solo caja', v_row.total_counted::TEXT, '4900.00');
  PERFORM pg_temp.expect('A2 diferencia = contado − teórico de caja (Bodega no entra)', v_row.difference::TEXT, '-100.00');
  PERFORM pg_temp.expect('A3 el faltante de caja sigue visible (no lo compensa Bodega)', v_row.result, 'FALTANTE');
  PERFORM pg_temp.expect('A4 Bodega = saldo oficial fotografiado, sin conteo manual',
    v_row.warehouse_balance || '/' || COALESCE(v_row.warehouse_counted::TEXT, 'sin conteo'), '3000.00/sin conteo');
  PERFORM pg_temp.expect('A5 total bajo resguardo teórico = caja + Bodega', v_row.custody_theoretical::TEXT, '8000.00');
  PERFORM pg_temp.expect('A6 el arqueo no toca saldos', cash_balance() || '/' || warehouse_cash_balance(), '5000.00/3000.00');

  -- ── Cortes del día ────────────────────────────────────────────────────────────────
  v_op := open_cash_operational_day(v_day, v_admin, NULL, NULL, '07:00', '13:00', '13:00', '19:00');
  SELECT id INTO v_p1 FROM cash_cut_periods WHERE operational_day_id = v_op AND period_number = 1;
  SELECT id INTO v_p2 FROM cash_cut_periods WHERE operational_day_id = v_op AND period_number = 2;

  PERFORM start_cash_cut_period(v_p1, v_admin);
  PERFORM finish_cash_cut_period(v_p1, v_admin, pg_temp.breakdown(200, 24, 100, 1), pg_temp.banks(), 'Corte 1', NULL);
  SELECT * INTO v_row FROM cash_cut_periods WHERE id = v_p1;
  PERFORM pg_temp.expect('K1 primer corte: caja contada y Bodega oficial por separado',
    v_row.closing_physical_cash || '/' || v_row.closing_warehouse_balance, '4900.00/3000.00');
  PERFORM pg_temp.expect('K2 total bajo resguardo = caja + Bodega',
    (v_row.closing_physical_cash + v_row.closing_warehouse_balance)::TEXT, '7900.00');
  PERFORM pg_temp.expect('K3 la diferencia del corte es solo de caja (no se compensa con Bodega)',
    v_row.cash_difference::TEXT, '-100.00');
  PERFORM pg_temp.expect('K4 el arqueo del corte guarda el mismo saldo de Bodega',
    (SELECT warehouse_balance::TEXT FROM cash_cut_counts WHERE cut_period_id = v_p1 AND is_current), '3000.00');
  PERFORM pg_temp.expect('K5 el evento FINALIZADO lleva Bodega y el total',
    (SELECT (snapshot->>'closingWarehouseBalance') || '/' || (snapshot->>'closingCustodyTotal')
     FROM cash_cut_events WHERE cut_period_id = v_p1 AND action = 'FINALIZADO'), '3000.00/7900.00');
  v_cut1 := (SELECT closing_physical_cash || '/' || closing_warehouse_balance || '/' || cash_difference
             FROM cash_cut_periods WHERE id = v_p1);

  -- Entre cortes: Bodega → Caja Q1,000. Necesita el conteo de Bodega (inventario por denominación).
  PERFORM register_warehouse_cash_count(pg_temp.breakdown(200, 15), 'Conteo Bodega', v_admin, 'LOC-W1');
  v_custody := pg_temp.custody();
  SELECT count(*) INTO v_cash_rows FROM cash_movements;
  SELECT count(*) INTO v_wh_rows FROM warehouse_cash_movements;
  v_withdrawal := register_warehouse_withdrawal('CAJA', 1000, pg_temp.breakdown(200, 5), NULL, 'Ana Bodega', 'Juan Caja',
    NULL, NULL, v_admin, 'LOC-R1');
  PERFORM pg_temp.expect('T7 Bodega → Caja: Bodega baja y caja sube', cash_balance() || '/' || warehouse_cash_balance(),
    '6000.00/2000.00');
  PERFORM pg_temp.expect('T8 Bodega → Caja no cambia el total bajo resguardo', (pg_temp.custody() = v_custody)::TEXT, 'true');
  PERFORM pg_temp.expect('T9 un renglón en cada Kardex, sin duplicar',
    ((SELECT count(*) FROM cash_movements) - v_cash_rows) || '/' || ((SELECT count(*) FROM warehouse_cash_movements) - v_wh_rows),
    '1/1');
  PERFORM pg_temp.expect('T10 tampoco es ingreso ni gasto',
    (SELECT string_agg(movement_type, ',') FROM cash_movements WHERE reference_id = v_withdrawal) || ' / ' ||
    (SELECT string_agg(movement_type, ',') FROM warehouse_cash_movements WHERE reference_id = v_withdrawal),
    'DEVOLUCION_BODEGA / DEVOLUCION_A_CAJA');
  PERFORM pg_temp.expect('K6 los movimientos entre cortes no alteran el primer corte',
    (SELECT closing_physical_cash || '/' || closing_warehouse_balance || '/' || cash_difference
     FROM cash_cut_periods WHERE id = v_p1), v_cut1);

  PERFORM start_cash_cut_period(v_p2, v_admin);
  PERFORM pg_temp.expect('K7 el segundo corte arranca con lo contado en el primero (continuidad)',
    (SELECT opening_physical_cash || '/' || inherited_difference FROM cash_cut_periods WHERE id = v_p2), '4900.00/-100.00');
  PERFORM finish_cash_cut_period(v_p2, v_admin, pg_temp.breakdown(200, 29, 100, 1), pg_temp.banks(), 'Corte 2', NULL);
  SELECT * INTO v_row FROM cash_cut_periods WHERE id = v_p2;
  PERFORM pg_temp.expect('K8 segundo corte: caja, Bodega oficial y diferencia de caja',
    v_row.closing_physical_cash || '/' || v_row.closing_warehouse_balance || '/' || v_row.cash_difference,
    '5900.00/2000.00/-100.00');
  PERFORM pg_temp.expect('K9 el primer corte sigue intacto', (SELECT closing_physical_cash || '/' || closing_warehouse_balance || '/' || cash_difference
     FROM cash_cut_periods WHERE id = v_p1), v_cut1);

  PERFORM reopen_cash_cut_period(v_p2, v_admin, 'Recontar el segundo corte');
  PERFORM pg_temp.expect('K10 reabrir limpia el saldo de Bodega como las demás cifras de cierre',
    (SELECT COALESCE(closing_warehouse_balance::TEXT, 'NULL') FROM cash_cut_periods WHERE id = v_p2), 'NULL');
  PERFORM pg_temp.expect('K11 el arqueo anterior conserva su foto de Bodega',
    (SELECT warehouse_balance::TEXT FROM cash_cut_counts WHERE cut_period_id = v_p2 AND NOT is_current), '2000.00');
  PERFORM finish_cash_cut_period(v_p2, v_admin, pg_temp.breakdown(200, 29, 100, 1), pg_temp.banks(), 'Corte 2 (recontado)', NULL);
  PERFORM pg_temp.expect('K12 al volver a finalizar se fotografía otra vez',
    (SELECT closing_warehouse_balance::TEXT FROM cash_cut_periods WHERE id = v_p2), '2000.00');

  -- ── Cuadre de Agentes → Arqueo de Caja (Caja + Bodega, contados a mano) ──────────────
  -- Teórico: caja Q6,000 y Bodega Q2,000. Contado: caja Q5,900 (−100) y Bodega Q2,100 (+100).
  PERFORM pg_temp.expect('Q1 Bodega cuyo desglose no suma el total que entra al resultado',
    pg_temp.err(format('SELECT close_agent_day_with_cash_breakdown(%L, 5900, 0, 0, 0, 7900, %L, 2000, %L, %L, NULL, 0, %L, NULL)',
      v_day, v_admin, pg_temp.breakdown(200, 29, 100, 1), 'MANUAL', pg_temp.breakdown(200, 10, 100, 1))),
    'CUADRE_WAREHOUSE_BREAKDOWN_MISMATCH');
  PERFORM pg_temp.expect('Q2 denominación inválida en Bodega',
    pg_temp.err(format('SELECT close_agent_day_with_cash_breakdown(%L, 5900, 0, 0, 0, 7903, %L, 3, %L, %L, NULL, 0, %L, NULL)',
      v_day, v_admin, pg_temp.breakdown(200, 29, 100, 1), 'MANUAL', pg_temp.breakdown(3, 1))),
    'CUADRE_WAREHOUSE_BREAKDOWN_INVALID');
  PERFORM pg_temp.expect('Q3 denominación repetida en Bodega',
    pg_temp.err(format('SELECT close_agent_day_with_cash_breakdown(%L, 5900, 0, 0, 0, 6200, %L, 300, %L, %L, NULL, 0, %L, NULL)',
      v_day, v_admin, pg_temp.breakdown(200, 29, 100, 1), 'MANUAL', pg_temp.breakdown(100, 1, 100, 2))),
    'CUADRE_WAREHOUSE_BREAKDOWN_INVALID');
  PERFORM pg_temp.expect('Q4 conteo de Bodega que no es una lista',
    pg_temp.err(format('SELECT close_agent_day_with_cash_breakdown(%L, 5900, 0, 0, 0, 5900, %L, 0, %L, %L, NULL, 0, %L, NULL)',
      v_day, v_admin, pg_temp.breakdown(200, 29, 100, 1), 'MANUAL', '{}')),
    'CUADRE_WAREHOUSE_BREAKDOWN_INVALID');

  v_custody := pg_temp.custody();
  v_rec := close_agent_day_with_cash_breakdown(v_day, 5900, 0, 0, 0, 8000, v_admin, 2100,
    pg_temp.breakdown(200, 29, 100, 1, 50, 0), 'MANUAL', NULL, 0,
    pg_temp.breakdown(200, 10, 100, 1, 0.01, 0), '  Cierre con Bodega contada  ');
  SELECT * INTO v_row FROM agent_reconciliation_cash_breakdowns WHERE reconciliation_id = v_rec;
  PERFORM pg_temp.expect('Q5 Caja: teórico, contado y diferencia propia',
    v_row.cash_theoretical || '/' || v_row.total_cash || '/' || v_row.cash_difference, '6000.00/5900.00/-100.00');
  PERFORM pg_temp.expect('Q6 Bodega: teórico, contado y diferencia propia',
    v_row.warehouse_theoretical || '/' || v_row.warehouse_counted || '/' || v_row.warehouse_difference, '2000.00/2100.00/100.00');
  PERFORM pg_temp.expect('Q7 consolidado cero, pero las diferencias individuales quedan guardadas',
    v_row.consolidated_difference || ' (' || v_row.cash_difference || ' / ' || v_row.warehouse_difference || ')',
    '0.00 (-100.00 / 100.00)');
  PERFORM pg_temp.expect('Q8 observaciones del arqueo (recortadas)', v_row.observations, 'Cierre con Bodega contada');
  PERFORM pg_temp.expect('Q9 usuario y fecha del arqueo',
    (v_row.created_by = v_admin AND v_row.created_at IS NOT NULL)::TEXT, 'true');
  PERFORM pg_temp.expect('Q10 cada denominación de Caja, aparte',
    (SELECT string_agg(trim_scale(denomination) || '=' || quantity, ' ' ORDER BY denomination DESC)
     FROM agent_reconciliation_cash_details WHERE reconciliation_id = v_rec), '200=29 100=1 50=0');
  PERFORM pg_temp.expect('Q11 cada denominación de Bodega, aparte (no copia la caja)',
    (SELECT string_agg(trim_scale(denomination) || '=' || quantity, ' ' ORDER BY denomination DESC)
     FROM agent_reconciliation_warehouse_details WHERE reconciliation_id = v_rec), '200=10 100=1 0.01=0');
  PERFORM pg_temp.expect('Q12 el resultado usa la Bodega contada',
    (SELECT total_cash || '/' || total_warehouse_cash || '/' || date FROM agent_reconciliations WHERE id = v_rec),
    '5900.00/2100.00/' || v_day);
  PERFORM pg_temp.expect('Q13 el arqueo del cuadre no ajusta ningún saldo ni escribe el Kardex',
    (pg_temp.custody() = v_custody AND cash_balance() = 6000 AND warehouse_cash_balance() = 2000)::TEXT, 'true');
  PERFORM pg_temp.expect('Q14 el día quedó cerrado en la misma operación',
    (SELECT (closed_at IS NOT NULL)::TEXT FROM day_openings WHERE date = v_day), 'true');
  PERFORM pg_temp.expect('Q15 la foto de Bodega es inmutable',
    (pg_temp.err(format('UPDATE agent_reconciliation_warehouse_details SET quantity = 99 WHERE reconciliation_id = %L', v_rec)) <> 'OK')::TEXT,
    'true');
  PERFORM pg_temp.expect('Q16 tampoco se puede borrar',
    (pg_temp.err(format('DELETE FROM agent_reconciliation_warehouse_details WHERE reconciliation_id = %L', v_rec)) <> 'OK')::TEXT,
    'true');

  -- ── Compatibilidad con los cuadres anteriores ─────────────────────────────────────
  v_legacy := close_agent_day_with_cash_breakdown(v_day + 1, 5900, 0, 0, 0, 7900, v_admin, 2000,
    pg_temp.breakdown(200, 29, 100, 1), 'MANUAL', NULL, 0);
  SELECT * INTO v_row FROM agent_reconciliation_cash_breakdowns WHERE reconciliation_id = v_legacy;
  PERFORM pg_temp.expect('H1 la llamada anterior (sin Bodega) sigue funcionando, sin cifras de custodia',
    COALESCE(v_row.warehouse_counted::TEXT, 'NULL') || '/' || COALESCE(v_row.cash_theoretical::TEXT, 'NULL') || '/' ||
    (SELECT count(*) FROM agent_reconciliation_warehouse_details WHERE reconciliation_id = v_legacy),
    'NULL/NULL/0');
  PERFORM pg_temp.expect('H2 sus denominaciones de caja se guardan como antes',
    (SELECT count(*)::TEXT FROM agent_reconciliation_cash_details WHERE reconciliation_id = v_legacy), '2');

  v_plain := close_agent_day(v_day + 2, 100, 0, 0, 0, 100, v_admin, 0, 0);
  PERFORM pg_temp.expect('H3 la base rechaza una foto con diferencias que no cuadran',
    pg_temp.err(format(
      'INSERT INTO agent_reconciliation_cash_breakdowns (reconciliation_id, source, total_cash, created_by, '
      'cash_theoretical, cash_difference, warehouse_theoretical, warehouse_counted, warehouse_difference, consolidated_difference) '
      'VALUES (%L, ''MANUAL'', 100, %L, 100, 0, 50, 60, 10, 0)', v_plain, v_admin)),
    'new row for relation "agent_reconciliation_cash_breakdowns" violates check constraint "CHK_agent_rec_cash_breakdowns_custody"');
  PERFORM pg_temp.expect('H4 ... o con Bodega contada sin su teórico',
    (pg_temp.err(format(
      'INSERT INTO agent_reconciliation_cash_breakdowns (reconciliation_id, source, total_cash, created_by, warehouse_counted) '
      'VALUES (%L, ''MANUAL'', 100, %L, 60)', v_plain, v_admin)) <> 'OK')::TEXT, 'true');

  RAISE NOTICE 'Todas las pruebas de ubicaciones Caja / Bodega pasaron.';
END $$;

ROLLBACK;
