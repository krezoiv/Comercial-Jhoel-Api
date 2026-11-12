-- "Cargar último arqueo de Caja" = el desglose del Segundo corte · final del día (un solo corte)
-- (migración 1760007700000-CuadreBreakdownFromLatestCut). Nunca la suma de los dos cortes.
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/cuadre-latest-cut.test.sql

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

-- Verificación de TODAS las cuentas activas, con su saldo actual (sin diferencias).
CREATE FUNCTION pg_temp.banks() RETURNS JSONB LANGUAGE sql AS $$
  SELECT COALESCE(jsonb_agg(jsonb_build_object('bankId', b.id,
           'verifiedBalance', CASE WHEN b.special_account = 'GUAYACAN' THEN guayacan_cash_balance() ELSE b.final_balance END)), '[]')
  FROM banks b WHERE b.is_active
$$;

-- "denominación=cantidad" del candidato que cargaría Cuadre de Agentes.
CREATE FUNCTION pg_temp.loaded(p_day DATE) RETURNS TEXT LANGUAGE sql AS $$
  SELECT string_agg(trim_scale((e->>'denomination')::NUMERIC)::TEXT || '=' || (e->>'quantity'), ' ' ORDER BY (e->>'denomination')::NUMERIC DESC)
  FROM cash_latest_count_candidate(p_day) c, json_array_elements(c.details) e
$$;

CREATE FUNCTION pg_temp.open_bank_day(p_date DATE, p_user UUID) RETURNS VOID LANGUAGE sql AS $$
  INSERT INTO day_openings (date, opened_by) VALUES (p_date, p_user);
  INSERT INTO bank_balances (bank_id, operation_date, previous_balance, final_balance, user_id)
  SELECT id, p_date, 0, 0, p_user FROM banks WHERE is_active;
$$;

CREATE FUNCTION pg_temp.fingerprint() RETURNS TEXT LANGUAGE sql AS $$
  SELECT md5(
    (SELECT COALESCE(string_agg(c::TEXT, '|' ORDER BY c.id), '') FROM cash_cut_counts c) ||
    (SELECT COALESCE(string_agg(d::TEXT, '|' ORDER BY d.id), '') FROM cash_cut_count_details d) ||
    (SELECT COALESCE(string_agg(p::TEXT, '|' ORDER BY p.id), '') FROM cash_cut_periods p) ||
    (SELECT COALESCE(string_agg(c::TEXT, '|' ORDER BY c.id), '') FROM cash_counts c) ||
    (SELECT count(*)::TEXT FROM cash_movements) || cash_balance()::TEXT ||
    (SELECT count(*)::TEXT FROM warehouse_cash_movements) || warehouse_cash_balance()::TEXT ||
    (SELECT COALESCE(string_agg(b.id || '=' || b.final_balance, '|' ORDER BY b.id), '') FROM banks b)
  )
$$;

DO $$
DECLARE
  v_admin UUID := pg_temp.user_with('SUPER_ADMIN');
  v_day DATE := DATE '2099-10-01';
  v_op UUID;
  v_p1 UUID;
  v_p2 UUID;
  v_c1 UUID;
  v_c2 UUID;
  v_c2_old UUID;
  v_op2 UUID;
  v_standalone UUID;
  v_rec UUID;
  v_row RECORD;
  v_fp TEXT;
  v_cut1 TEXT := '200=100 100=50 50=20 20=30 10=20';
  v_cut2 TEXT := '200=80 100=40 50=15 20=20 10=10';
BEGIN
  PERFORM pg_temp.open_bank_day(v_day, v_admin);
  PERFORM pg_temp.open_bank_day(v_day + 1, v_admin);
  PERFORM pg_temp.open_bank_day(v_day + 2, v_admin);

  -- Un arqueo independiente ANTERIOR a los cortes (no debe ganarle al último corte).
  v_standalone := register_cash_count(pg_temp.breakdown(200, 1), 'Arqueo suelto', NULL, v_admin, 'LC-STANDALONE', NULL, NULL);

  -- Día operativo de efectivo con sus dos cortes.
  v_op := open_cash_operational_day(v_day, v_admin, NULL, NULL, '07:00', '13:00', '13:00', '19:00');
  SELECT id INTO v_p1 FROM cash_cut_periods WHERE operational_day_id = v_op AND period_number = 1;
  SELECT id INTO v_p2 FROM cash_cut_periods WHERE operational_day_id = v_op AND period_number = 2;

  PERFORM start_cash_cut_period(v_p1, v_admin);
  PERFORM finish_cash_cut_period(v_p1, v_admin,
    pg_temp.breakdown(200, 100, 100, 50, 50, 20, 20, 30, 10, 20), pg_temp.banks(), 'Corte 1', NULL);
  PERFORM start_cash_cut_period(v_p2, v_admin);
  PERFORM finish_cash_cut_period(v_p2, v_admin,
    pg_temp.breakdown(200, 80, 100, 40, 50, 15, 20, 20, 10, 10), pg_temp.banks(), 'Corte 2', NULL);
  SELECT id INTO v_c1 FROM cash_cut_counts WHERE cut_period_id = v_p1 AND is_current;
  SELECT id INTO v_c2 FROM cash_cut_counts WHERE cut_period_id = v_p2 AND is_current;

  -- Horas reales distintas (en una sola transacción now() es igual para todo).
  UPDATE cash_cut_counts SET created_at = now() + interval '1 minute' WHERE id = v_c1;
  UPDATE cash_cut_counts SET created_at = now() + interval '2 minutes' WHERE id = v_c2;

  -- ── Selección: un solo corte, nunca la suma ───────────────────────────────────────
  SELECT * INTO v_row FROM cash_latest_count_candidate(v_day);
  PERFORM pg_temp.expect('S1 se elige el Segundo corte (final del día)', v_row.source || '/' || v_row.cut_number || '/' || (v_row.id = v_c2), 'CORTE_CAJA/2/true');
  PERFORM pg_temp.expect('S2 se cargan exactamente las cantidades del corte 2', pg_temp.loaded(v_day), v_cut2);
  PERFORM pg_temp.expect('S3 nunca la suma de ambos cortes (Q200 ≠ 180)',
    (pg_temp.loaded(v_day) NOT LIKE '%200=180%')::TEXT, 'true');
  PERFORM pg_temp.expect('S4 total del corte 2 (Q21,250.00)', v_row.total_counted::TEXT, '21250.00');
  PERFORM pg_temp.expect('S5 una sola fila por candidato',
    (SELECT count(*)::TEXT FROM cash_latest_count_candidate(v_day)), '1');

  -- ── Siempre el Segundo corte, aunque el primero tenga hora posterior ──────────────
  UPDATE cash_cut_counts SET created_at = now() + interval '3 minutes' WHERE id = v_c1;
  PERFORM pg_temp.expect('S6 el corte 1 registrado después NO se carga: sigue el corte 2',
    (SELECT cut_number::TEXT FROM cash_latest_count_candidate(v_day)), '2');
  PERFORM pg_temp.expect('S7 ... con las cantidades del corte 2', pg_temp.loaded(v_day), v_cut2);
  UPDATE cash_cut_counts SET created_at = now() + interval '1 minute' WHERE id = v_c1;

  -- ── Los arqueos sueltos no se cargan, aunque sean posteriores ─────────────────────
  PERFORM register_cash_count(pg_temp.breakdown(100, 7), 'Arqueo suelto posterior', NULL, v_admin, 'LC-STANDALONE-2', NULL, NULL);
  PERFORM pg_temp.expect('S8 un arqueo suelto no reemplaza al Segundo corte',
    (SELECT source || '/' || (id = v_c2) FROM cash_latest_count_candidate(v_day)), 'CORTE_CAJA/true');
  PERFORM pg_temp.expect('S9 el arqueo suelto anterior tampoco',
    (SELECT (id = v_standalone)::TEXT FROM cash_latest_count_candidate(v_day)), 'false');

  v_fp := pg_temp.fingerprint();

  -- ── Guardar el cuadre con el corte usado: referencia exacta al corte ──────────────
  v_rec := close_agent_day_with_cash_breakdown(v_day, 21250, 0, 0, 0, 21250, v_admin, 0,
    pg_temp.breakdown(200, 80, 100, 40, 50, 15, 20, 20, 10, 10, 5, 0, 1, 0, 0.50, 0, 0.25, 0, 0.10, 0, 0.05, 0, 0.01, 0),
    'CORTE_CAJA', v_c2);
  SELECT * INTO v_row FROM agent_reconciliation_cash_breakdowns WHERE reconciliation_id = v_rec;
  PERFORM pg_temp.expect('C1 origen CORTE_CAJA con el id del arqueo del corte y del corte',
    v_row.source || '/' || (v_row.source_cut_count_id = v_c2) || '/' || (v_row.source_cut_period_id = v_p2) || '/' || v_row.source_cut_number,
    'CORTE_CAJA/true/true/2');
  PERFORM pg_temp.expect('C2 foto: fecha/hora, día, usuario y total del corte',
    ((v_row.source_counted_at = (SELECT created_at FROM cash_cut_counts WHERE id = v_c2))
      AND v_row.source_business_date = v_day AND v_row.source_counted_by = v_admin)::TEXT || '/' || v_row.source_total_counted,
    'true/21250.00');
  PERFORM pg_temp.expect('C3 sin modificaciones (Q0.01 rellenado con 0 no cuenta)', v_row.modified_after_load::TEXT, 'false');
  PERFORM pg_temp.expect('C4 12 filas guardadas, Q200 = 80',
    (SELECT count(*) || '/' || max(quantity) FILTER (WHERE denomination = 200)
     FROM agent_reconciliation_cash_details WHERE reconciliation_id = v_rec), '12/80');

  -- Modificado después de cargar: +100 × Q0.01.
  v_rec := close_agent_day_with_cash_breakdown(v_day + 1, 21251, 0, 0, 0, 21251, v_admin, 0,
    pg_temp.breakdown(200, 80, 100, 40, 50, 15, 20, 20, 10, 10, 0.01, 100), 'CORTE_CAJA', v_c2);
  PERFORM pg_temp.expect('C5 modificado tras cargar el corte, conserva la referencia',
    (SELECT modified_after_load || '/' || (source_cut_count_id = v_c2) || '/' || total_cash
     FROM agent_reconciliation_cash_breakdowns WHERE reconciliation_id = v_rec), 'true/true/21251.00');

  PERFORM pg_temp.expect('C6 cortes, arqueos, Kardex y bancos intactos', pg_temp.fingerprint(), v_fp);

  PERFORM pg_temp.expect('C7 el corte 1 no se acepta como origen',
    pg_temp.err(format('SELECT close_agent_day_with_cash_breakdown(%L, 26800, 0, 0, 0, 26800, %L, 0, %L, %L, %L)',
      v_day + 2, v_admin, pg_temp.breakdown(200, 100, 100, 50, 50, 20, 20, 30, 10, 20), 'CORTE_CAJA', v_c1)),
    'CUADRE_SOURCE_COUNT_INVALID');

  -- ── Segundo corte reabierto (ya no confirmado) → no se toma el corte 1 ────────────
  PERFORM reopen_cash_cut_period(v_p2, v_admin, 'Revisión de arqueo');
  v_c2_old := v_c2;
  PERFORM pg_temp.expect('R1 con el corte 2 reabierto no hay Segundo corte válido ese día (nunca el corte 1)',
    (SELECT count(*)::TEXT FROM cash_latest_count_candidate(v_day)), '0');
  PERFORM pg_temp.expect('R3 el arqueo reemplazado del corte reabierto ya no sirve de origen',
    pg_temp.err(format('SELECT close_agent_day_with_cash_breakdown(%L, 21250, 0, 0, 0, 21250, %L, 0, %L, %L, %L)',
      v_day + 2, v_admin, pg_temp.breakdown(200, 80, 100, 40, 50, 15, 20, 20, 10, 10), 'CORTE_CAJA', v_c2_old)),
    'CUADRE_SOURCE_COUNT_INVALID');
  -- Al volver a finalizarlo, su arqueo NUEVO es el que se carga.
  PERFORM finish_cash_cut_period(v_p2, v_admin,
    pg_temp.breakdown(200, 81, 100, 40, 50, 15, 20, 20, 10, 10, 0.01, 100), pg_temp.banks(), 'Corte 2 corregido', NULL);
  PERFORM pg_temp.expect('R2 el arqueo vigente del corte 2 refinalizado, con Q0.01',
    (SELECT (id <> v_c2_old)::TEXT || '/' || cut_number FROM cash_latest_count_candidate(v_day)) || ' ' || pg_temp.loaded(v_day),
    'true/2 200=81 100=40 50=15 20=20 10=10 0.01=100');
  PERFORM pg_temp.expect('R4 un id de arqueo suelto no se acepta como corte',
    pg_temp.err(format('SELECT close_agent_day_with_cash_breakdown(%L, 200, 0, 0, 0, 200, %L, 0, %L, %L, %L)',
      v_day + 2, v_admin, pg_temp.breakdown(200, 1), 'CORTE_CAJA', v_standalone)),
    'CUADRE_SOURCE_COUNT_INVALID');

  -- ── Día de referencia sin Segundo corte finalizado → el del día anterior (con aviso) ──
  v_op2 := open_cash_operational_day(v_day + 1, v_admin, NULL, NULL, '07:00', '13:00', '13:00', '19:00');
  PERFORM pg_temp.expect('P1 sin corte 2 del día pedido se usa el último Segundo corte anterior',
    (SELECT business_date::TEXT || '/' || cut_number FROM cash_latest_count_candidate(v_day + 1)), v_day::TEXT || '/2');

  RAISE NOTICE 'TODAS LAS PRUEBAS DEL ÚLTIMO CORTE PASARON';
END $$;

ROLLBACK;
