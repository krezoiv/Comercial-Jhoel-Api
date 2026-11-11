-- Q0.01 + desglose del Cuadre de Agentes desde el último Arqueo de Caja
-- (migración 1760007600000-CuadreCashBreakdownAndCentDenomination).
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/cuadre-cash-breakdown.test.sql

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

-- Escenario de aceptación: 12 denominaciones, 100 × Q0.01 → Q4,882.50.
CREATE FUNCTION pg_temp.acceptance(p_cents INT) RETURNS JSONB LANGUAGE sql AS $$
  SELECT pg_temp.breakdown(200, 10, 100, 20, 50, 10, 20, 10, 10, 10, 5, 10,
                           1, 20, 0.50, 10, 0.25, 20, 0.10, 10, 0.05, 10, 0.01, p_cents)
$$;

-- Abre un día bancario de prueba con la foto de saldos de todas las cuentas activas.
CREATE FUNCTION pg_temp.open_day(p_date DATE, p_user UUID) RETURNS VOID LANGUAGE sql AS $$
  INSERT INTO day_openings (date, opened_by) VALUES (p_date, p_user);
  INSERT INTO bank_balances (bank_id, operation_date, previous_balance, final_balance, user_id)
  SELECT id, p_date, 0, 0, p_user FROM banks WHERE is_active;
$$;

-- Huella de lo que el cuadre NO debe tocar: arqueos, Kardex de caja/Bodega y saldos bancarios.
CREATE FUNCTION pg_temp.fingerprint() RETURNS TEXT LANGUAGE sql AS $$
  SELECT md5(
    (SELECT COALESCE(string_agg(c::TEXT, '|' ORDER BY c.id), '') FROM cash_counts c) ||
    (SELECT COALESCE(string_agg(d::TEXT, '|' ORDER BY d.id), '') FROM cash_count_details d) ||
    (SELECT count(*)::TEXT FROM cash_movements) || cash_balance()::TEXT ||
    (SELECT count(*)::TEXT FROM warehouse_cash_movements) || warehouse_cash_balance()::TEXT ||
    (SELECT count(*)::TEXT FROM bank_account_movements) ||
    (SELECT COALESCE(string_agg(b.id || '=' || b.final_balance, '|' ORDER BY b.id), '') FROM banks b)
  )
$$;

CREATE FUNCTION pg_temp.close(p_date DATE, p_total NUMERIC, p_user UUID, p_details JSONB, p_source TEXT, p_count UUID)
RETURNS UUID LANGUAGE sql AS $$
  SELECT close_agent_day_with_cash_breakdown(p_date, p_total, 0, 0, 0, p_total, p_user, 0, p_details, p_source, p_count)
$$;

DO $$
DECLARE
  v_super UUID := pg_temp.user_with('SUPER_ADMIN');
  v_user UUID := pg_temp.user_with('USER');
  v_legacy UUID;
  v_count UUID;
  v_correction UUID;
  v_rec UUID;
  v_row RECORD;
  v_fp TEXT;
BEGIN
  PERFORM pg_temp.open_day(DATE '2099-07-01', v_super);
  PERFORM pg_temp.open_day(DATE '2099-07-02', v_super);
  PERFORM pg_temp.open_day(DATE '2099-07-03', v_super);
  PERFORM pg_temp.open_day(DATE '2099-07-04', v_super);

  -- ── Q0.01 en todas las validaciones de efectivo ───────────────────────────────────
  PERFORM pg_temp.expect('D1 Q0.01 es denominación válida (caja/Bodega/cortes)', cash_valid_denomination(0.01)::TEXT, 'true');
  PERFORM pg_temp.expect('D2 Q0.01 es válida en Caja Guayacán', guayacan_valid_denomination(0.01)::TEXT, 'true');
  PERFORM pg_temp.expect('D3 Q0.02 sigue sin ser válida', cash_valid_denomination(0.02)::TEXT, 'false');

  -- Arqueo "histórico": sin fila de Q0.01 (así quedan los anteriores a la migración).
  v_legacy := register_cash_count(pg_temp.breakdown(200, 10, 0.05, 10), 'Histórico', NULL, v_super, 'CB-LEGACY', NULL, NULL);
  PERFORM pg_temp.expect('D4 arqueo sin Q0.01 conserva su total',
    (SELECT total_counted::TEXT FROM cash_counts WHERE id = v_legacy), '2000.50');

  v_count := register_cash_count(pg_temp.acceptance(100), 'Arqueo con centavos', NULL, v_super, 'CB-COUNT', NULL, NULL);
  PERFORM pg_temp.expect('D5 arqueo con 100 × Q0.01 = Q4,882.50',
    (SELECT total_counted::TEXT FROM cash_counts WHERE id = v_count), '4882.50');
  PERFORM pg_temp.expect('D6 la fila Q0.01 del arqueo vale Q1.00',
    (SELECT subtotal::TEXT FROM cash_count_details WHERE count_id = v_count AND denomination = 0.01), '1.00');
  PERFORM pg_temp.expect('D7 el arqueo rechaza Q0.02',
    pg_temp.err(format('SELECT register_cash_count(%L, NULL, NULL, %L, %L, NULL, NULL)', pg_temp.breakdown(0.02, 1), v_super, 'CB-X')),
    'CASH_INVALID_DENOMINATION');

  v_fp := pg_temp.fingerprint();

  -- ── Validaciones del desglose del cuadre (nada se escribe si fallan) ──────────────
  PERFORM pg_temp.expect('V1 total distinto de la suma del desglose',
    pg_temp.err(format('SELECT pg_temp.close(%L, 4883, %L, %L, %L, NULL)', DATE '2099-07-01', v_super, pg_temp.acceptance(100), 'MANUAL')),
    'CUADRE_CASH_BREAKDOWN_MISMATCH');
  PERFORM pg_temp.expect('V2 denominación desconocida',
    pg_temp.err(format('SELECT pg_temp.close(%L, 0.02, %L, %L, %L, NULL)', DATE '2099-07-01', v_super, pg_temp.breakdown(0.02, 1), 'MANUAL')),
    'CUADRE_CASH_BREAKDOWN_INVALID');
  PERFORM pg_temp.expect('V3 cantidad fraccionaria',
    pg_temp.err(format('SELECT pg_temp.close(%L, 1.5, %L, %L, %L, NULL)', DATE '2099-07-01', v_super, pg_temp.breakdown(1, 1.5), 'MANUAL')),
    'CUADRE_CASH_BREAKDOWN_INVALID');
  PERFORM pg_temp.expect('V4 cantidad negativa',
    pg_temp.err(format('SELECT pg_temp.close(%L, 0, %L, %L, %L, NULL)', DATE '2099-07-01', v_super, pg_temp.breakdown(1, -1, 1, 1), 'MANUAL')),
    'CUADRE_CASH_BREAKDOWN_INVALID');
  PERFORM pg_temp.expect('V5 denominación duplicada',
    pg_temp.err(format('SELECT pg_temp.close(%L, 2, %L, %L, %L, NULL)', DATE '2099-07-01', v_super, pg_temp.breakdown(1, 1, 1, 1), 'MANUAL')),
    'CUADRE_CASH_BREAKDOWN_INVALID');
  PERFORM pg_temp.expect('V6 MANUAL no lleva arqueo de origen',
    pg_temp.err(format('SELECT pg_temp.close(%L, 4882.50, %L, %L, %L, %L)', DATE '2099-07-01', v_super, pg_temp.acceptance(100), 'MANUAL', v_count)),
    'CUADRE_CASH_BREAKDOWN_INVALID');
  PERFORM pg_temp.expect('V7 origen desconocido',
    pg_temp.err(format('SELECT pg_temp.close(%L, 4882.50, %L, %L, %L, NULL)', DATE '2099-07-01', v_super, pg_temp.acceptance(100), 'OTRO')),
    'CUADRE_CASH_BREAKDOWN_INVALID');
  PERFORM pg_temp.expect('V8 arqueo de origen inexistente',
    pg_temp.err(format('SELECT pg_temp.close(%L, 4882.50, %L, %L, %L, %L)', DATE '2099-07-01', v_super, pg_temp.acceptance(100), 'ARQUEO_CAJA', gen_random_uuid())),
    'CUADRE_SOURCE_COUNT_INVALID');
  IF v_user IS NOT NULL THEN
    PERFORM pg_temp.expect('V9 un cajero no usa arqueos de Caja (RBAC en la base)',
      pg_temp.err(format('SELECT pg_temp.close(%L, 4882.50, %L, %L, %L, %L)', DATE '2099-07-01', v_user, pg_temp.acceptance(100), 'ARQUEO_CAJA', v_count)),
      'CASH_CUSTODY_FORBIDDEN');
  END IF;
  PERFORM pg_temp.expect('V10 tras los rechazos el día sigue abierto y sin cuadre',
    (SELECT (closed_at IS NULL)::TEXT || '/' || (SELECT count(*) FROM agent_reconciliations WHERE date = DATE '2099-07-01')
     FROM day_openings WHERE date = DATE '2099-07-01'), 'true/0');

  -- ── Cuadre con el arqueo cargado tal cual ─────────────────────────────────────────
  v_rec := pg_temp.close(DATE '2099-07-01', 4882.50, v_super, pg_temp.acceptance(100), 'ARQUEO_CAJA', v_count);
  SELECT b.*, c.number AS live_number INTO v_row
  FROM agent_reconciliation_cash_breakdowns b JOIN cash_counts c ON c.id = b.source_cash_count_id
  WHERE b.reconciliation_id = v_rec;
  PERFORM pg_temp.expect('A1 origen ARQUEO_CAJA con referencia al arqueo', v_row.source || '/' || (v_row.source_cash_count_id = v_count), 'ARQUEO_CAJA/true');
  PERFORM pg_temp.expect('A2 sin modificaciones', v_row.modified_after_load::TEXT, 'false');
  PERFORM pg_temp.expect('A3 foto del arqueo: número, fecha, usuario y total',
    (v_row.source_count_number = v_row.live_number AND v_row.source_counted_by = v_super
      AND v_row.source_counted_at = (SELECT counted_at FROM cash_counts WHERE id = v_count))::TEXT || '/' || v_row.source_total_counted,
    'true/4882.50');
  PERFORM pg_temp.expect('A4 12 filas guardadas, Q0.01 = 100',
    (SELECT count(*) || '/' || sum(subtotal) || '/' || max(quantity) FILTER (WHERE denomination = 0.01)
     FROM agent_reconciliation_cash_details WHERE reconciliation_id = v_rec), '12/4882.50/100');
  PERFORM pg_temp.expect('A5 el cuadre guarda el total y cierra el día',
    (SELECT total_cash::TEXT FROM agent_reconciliations WHERE id = v_rec) || '/' ||
    (SELECT (closed_at IS NOT NULL)::TEXT FROM day_openings WHERE date = DATE '2099-07-01'), '4882.50/true');

  -- ── Modificado después de cargar: Q0.01 100 → 150 ─────────────────────────────────
  v_rec := pg_temp.close(DATE '2099-07-02', 4883, v_super, pg_temp.acceptance(150), 'ARQUEO_CAJA', v_count);
  PERFORM pg_temp.expect('M1 modificado y conserva la referencia',
    (SELECT modified_after_load || '/' || (source_cash_count_id = v_count) || '/' || total_cash || '/' || source_total_counted
     FROM agent_reconciliation_cash_breakdowns WHERE reconciliation_id = v_rec), 'true/true/4883.00/4882.50');
  PERFORM pg_temp.expect('M2 se guarda el desglose realmente usado (150 × Q0.01)',
    (SELECT quantity::TEXT FROM agent_reconciliation_cash_details WHERE reconciliation_id = v_rec AND denomination = 0.01), '150');

  -- ── Arqueo histórico sin Q0.01, completado con cero en el formulario ──────────────
  v_rec := pg_temp.close(DATE '2099-07-03', 2000.50, v_super,
    pg_temp.breakdown(200, 10, 100, 0, 50, 0, 20, 0, 10, 0, 5, 0, 1, 0, 0.50, 0, 0.25, 0, 0.10, 0, 0.05, 10, 0.01, 0),
    'ARQUEO_CAJA', v_legacy);
  PERFORM pg_temp.expect('H1 cargar un arqueo sin Q0.01 (rellenado con 0) no cuenta como modificado',
    (SELECT modified_after_load::TEXT FROM agent_reconciliation_cash_breakdowns WHERE reconciliation_id = v_rec), 'false');
  PERFORM pg_temp.expect('H2 el arqueo histórico sigue sin fila Q0.01 y con su total',
    (SELECT count(*) FROM cash_count_details WHERE count_id = v_legacy AND denomination = 0.01) || '/' ||
    (SELECT total_counted FROM cash_counts WHERE id = v_legacy), '0/2000.50');

  -- ── Ni arqueos, ni Kardex, ni bancos cambiaron ────────────────────────────────────
  PERFORM pg_temp.expect('K1 arqueos originales, Kardex y saldos bancarios intactos', pg_temp.fingerprint(), v_fp);

  -- ── La foto es inmutable ──────────────────────────────────────────────────────────
  PERFORM pg_temp.expect('I1 no se edita el detalle guardado',
    pg_temp.err(format('UPDATE agent_reconciliation_cash_details SET quantity = 1 WHERE reconciliation_id = %L', v_rec)),
    'CASH_CUSTODY_IMMUTABLE');
  PERFORM pg_temp.expect('I2 no se borra la cabecera',
    pg_temp.err(format('DELETE FROM agent_reconciliation_cash_breakdowns WHERE reconciliation_id = %L', v_rec)),
    'CASH_CUSTODY_IMMUTABLE');

  -- ── Un arqueo reemplazado ya no es válido como origen ─────────────────────────────
  v_correction := register_cash_count(pg_temp.acceptance(100), NULL, NULL, v_super, 'CB-CORR', v_count, 'Corrección de prueba');
  PERFORM pg_temp.expect('R1 arqueo REEMPLAZADO → rechazado',
    pg_temp.err(format('SELECT pg_temp.close(%L, 4882.50, %L, %L, %L, %L)', DATE '2099-07-04', v_super, pg_temp.acceptance(100), 'ARQUEO_CAJA', v_count)),
    'CUADRE_SOURCE_COUNT_INVALID');

  -- ── Cuadre manual y el camino original sin desglose ───────────────────────────────
  v_rec := pg_temp.close(DATE '2099-07-04', 0.33, v_super, pg_temp.breakdown(0.10, 1, 0.05, 4, 0.01, 3), 'MANUAL', NULL);
  PERFORM pg_temp.expect('N1 cuadre manual con centavos exacto (Q0.33)',
    (SELECT source || '/' || total_cash || '/' || modified_after_load FROM agent_reconciliation_cash_breakdowns WHERE reconciliation_id = v_rec),
    'MANUAL/0.33/false');
  PERFORM pg_temp.open_day(DATE '2099-07-05', v_super);
  v_rec := close_agent_day(DATE '2099-07-05', 10, 0, 0, 0, 10, v_super, 0);
  PERFORM pg_temp.expect('N2 close_agent_day sin desglose sigue funcionando (sin foto)',
    (SELECT count(*)::TEXT FROM agent_reconciliation_cash_breakdowns WHERE reconciliation_id = v_rec), '0');

  RAISE NOTICE 'TODAS LAS PRUEBAS DEL DESGLOSE DEL CUADRE PASARON';
END $$;

ROLLBACK;
