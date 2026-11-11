-- Revisión de días operativos históricos (migración 1760007100000-FinancialDayReview).
-- Incluye la PRUEBA CRÍTICA DE AISLAMIENTO: días A/B/C con saldo Q100,000 / Q120,000 / Q130,000;
-- se abre B, se corrige a Q125,000 y A y C deben quedar exactamente iguales (también para
-- efectivo, CxC, activos, movimientos, cortes y cierres).
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK: no deja ningún dato.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/financial-day-review.test.sql

BEGIN;

CREATE FUNCTION pg_temp.user_with(p_role TEXT, p_offset INT DEFAULT 0) RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name = p_role ORDER BY u.created_at OFFSET p_offset LIMIT 1
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

-- Ejecuta y deshace (subtransacción): 'OK' si la sentencia se aceptó, o el código de error.
CREATE FUNCTION pg_temp.try_undo(p_sql TEXT) RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN
  BEGIN
    EXECUTE p_sql;
    RAISE EXCEPTION 'UNDO_SENTINEL';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM = 'UNDO_SENTINEL' THEN
      RETURN 'OK';
    END IF;
    RETURN split_part(SQLERRM, ':', 1);
  END;
END $$;

-- Huella de TODO lo que pertenece a un día: fotos, cierres, cortes, arqueos, conciliaciones y movimientos.
CREATE FUNCTION pg_temp.day_fingerprint(p_date DATE) RETURNS TEXT LANGUAGE sql AS $$
  SELECT md5(concat_ws('|',
    (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM day_openings t WHERE date = p_date),
    (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM bank_balances t WHERE operation_date = p_date),
    (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM agent_reconciliations t WHERE date = p_date),
    (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM cash_operational_days t WHERE operational_date = p_date),
    (SELECT string_agg(to_jsonb(p)::text, ',' ORDER BY p.id) FROM cash_cut_periods p
       JOIN cash_operational_days d ON d.id = p.operational_day_id WHERE d.operational_date = p_date),
    (SELECT string_agg(to_jsonb(c)::text, ',' ORDER BY c.id) FROM cash_cut_counts c
       JOIN cash_cut_periods p ON p.id = c.cut_period_id
       JOIN cash_operational_days d ON d.id = p.operational_day_id WHERE d.operational_date = p_date),
    (SELECT string_agg(to_jsonb(r)::text, ',' ORDER BY r.id) FROM cash_cut_bank_reconciliations r
       JOIN cash_cut_periods p ON p.id = r.cut_period_id
       JOIN cash_operational_days d ON d.id = p.operational_day_id WHERE d.operational_date = p_date),
    (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM cash_movements t WHERE operational_date = p_date),
    (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM bank_account_movements t WHERE business_date = p_date),
    (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM bank_deposit_operations t WHERE operation_date = p_date),
    (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM accounts_receivable t WHERE date = p_date),
    (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM assets t WHERE date = p_date)
  ))
$$;

-- Huella de los saldos VIVOS (hoy): cuentas, efectivo y saldos de clientes.
CREATE FUNCTION pg_temp.live_fingerprint() RETURNS TEXT LANGUAGE sql AS $$
  SELECT md5(concat_ws('|',
    (SELECT string_agg(id::text || '=' || final_balance::text, ',' ORDER BY id) FROM banks),
    (SELECT cash_balance()::text),
    (SELECT string_agg(client_id::text || '=' || s::text, ',' ORDER BY client_id) FROM (
       SELECT client_id, sum(CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END) s
       FROM accounts_receivable WHERE is_active GROUP BY client_id) x),
    (SELECT string_agg(client_id::text || '=' || s::text, ',' ORDER BY client_id) FROM (
       SELECT client_id, sum(CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END) s
       FROM assets WHERE is_active GROUP BY client_id) x)
  ))
$$;

DO $$
DECLARE
  v_super UUID := pg_temp.user_with('SUPER_ADMIN');
  v_super2 UUID := pg_temp.user_with('SUPER_ADMIN', 1);
  v_admin UUID := pg_temp.user_with('ADMIN');
  v_user UUID := pg_temp.user_with('USER');
  v_bank UUID;
  v_client UUID;
  d_a DATE := DATE '2020-01-10';
  d_b DATE := DATE '2020-01-11';
  d_c DATE := DATE '2020-01-12';
  d_open DATE := DATE '2020-01-14';
  v_bb_a UUID; v_bb_b UUID; v_bb_c UUID;
  v_rec_a UUID; v_rec_b UUID; v_rec_c UUID;
  v_day_a UUID; v_day_b UUID; v_day_c UUID;
  v_cut_b1 UUID; v_cut_b2 UUID;
  v_count_b1 UUID; v_count_b2 UUID; v_brec_b1 UUID;
  v_ar_a UUID; v_ar_b UUID; v_ar_c UUID;
  v_as_b UUID; v_as_c UUID;
  v_bm_b UUID; v_bm_c UUID;
  v_cm_b UUID; v_cm_ref UUID;
  v_session UUID; v_session2 UUID;
  v_corr UUID; v_corr2 UUID;
  fp_a TEXT; fp_c TEXT; fp_live TEXT;
BEGIN
  IF v_super IS NULL OR v_admin IS NULL THEN
    RAISE EXCEPTION 'La base necesita al menos un SUPER_ADMIN y un ADMIN para esta prueba';
  END IF;
  SELECT id INTO v_bank FROM banks WHERE is_active AND special_account IS NULL ORDER BY created_at LIMIT 1;
  SELECT id INTO v_client FROM clients WHERE is_active ORDER BY created_at LIMIT 1;

  -- ── Escenario: tres días cerrados A/B/C con datos en todos los módulos ──────────────
  INSERT INTO day_openings (date, opened_by, closed_at, closed_by)
  SELECT d, v_super, d + TIME '20:00', v_super FROM unnest(ARRAY[d_a, d_b, d_c]) d;
  INSERT INTO day_openings (date, opened_by) VALUES (d_open, v_super);  -- día pasado aún abierto

  INSERT INTO bank_balances (bank_id, operation_date, previous_balance, final_balance, user_id)
  VALUES (v_bank, d_a, 90000, 100000, v_super) RETURNING id INTO v_bb_a;
  INSERT INTO bank_balances (bank_id, operation_date, previous_balance, final_balance, user_id)
  VALUES (v_bank, d_b, 100000, 120000, v_super) RETURNING id INTO v_bb_b;
  INSERT INTO bank_balances (bank_id, operation_date, previous_balance, final_balance, user_id)
  VALUES (v_bank, d_c, 120000, 130000, v_super) RETURNING id INTO v_bb_c;

  INSERT INTO agent_reconciliations (date, total_cash, total_banks, total_assets, total_accounts_receivable, result, created_by)
  VALUES (d_a, 5000, 100000, 2000, 3000, 106000, v_super) RETURNING id INTO v_rec_a;
  INSERT INTO agent_reconciliations (date, total_cash, total_banks, total_assets, total_accounts_receivable, result, created_by)
  VALUES (d_b, 6000, 120000, 2000, 3000, 127000, v_super) RETURNING id INTO v_rec_b;
  INSERT INTO agent_reconciliations (date, total_cash, total_banks, total_assets, total_accounts_receivable, result, created_by)
  VALUES (d_c, 7000, 130000, 2000, 3000, 138000, v_super) RETURNING id INTO v_rec_c;

  INSERT INTO cash_operational_days (operational_date, status, opening_policy, opening_system_cash, opening_physical_cash,
    opened_by, closing_system_cash, closing_physical_cash, closing_difference, closed_by, closed_at, closing_sequence)
  VALUES (d_a, 'CERRADO', 'AUTHORIZED_MANUAL', 4000, 4000, v_super, 5000, 5000, 0, v_super, now(), 0) RETURNING id INTO v_day_a;
  INSERT INTO cash_operational_days (operational_date, status, opening_policy, opening_system_cash, opening_physical_cash,
    opened_by, closing_system_cash, closing_physical_cash, closing_difference, closed_by, closed_at, closing_sequence)
  VALUES (d_b, 'CERRADO', 'INHERITED_FROM_CLOSE', 5000, 5000, v_super, 6000, 6000, 0, v_super, now(), 20) RETURNING id INTO v_day_b;
  INSERT INTO cash_operational_days (operational_date, status, opening_policy, opening_system_cash, opening_physical_cash,
    opened_by, closing_system_cash, closing_physical_cash, closing_difference, closed_by, closed_at, closing_sequence)
  VALUES (d_c, 'CERRADO', 'INHERITED_FROM_CLOSE', 6000, 6000, v_super, 7000, 7000, 0, v_super, now(), 0) RETURNING id INTO v_day_c;

  INSERT INTO cash_cut_periods (operational_day_id, period_number, scheduled_start_at, scheduled_end_at, status,
    actual_started_at, actual_finished_at, start_sequence, closing_sequence, opening_system_cash, opening_physical_cash,
    closing_system_cash, closing_physical_cash, cash_difference, opened_by, closed_by)
  VALUES (v_day_b, 1, d_b + TIME '07:00', d_b + TIME '13:00', 'FINALIZADO', d_b + TIME '07:00', d_b + TIME '13:00',
    0, 10, 5000, 5000, 5500, 5500, 0, v_super, v_super) RETURNING id INTO v_cut_b1;
  INSERT INTO cash_cut_periods (operational_day_id, period_number, scheduled_start_at, scheduled_end_at, status,
    actual_started_at, actual_finished_at, start_sequence, closing_sequence, opening_system_cash, opening_physical_cash,
    closing_system_cash, closing_physical_cash, cash_difference, opened_by, closed_by)
  VALUES (v_day_b, 2, d_b + TIME '13:00', d_b + TIME '20:00', 'FINALIZADO', d_b + TIME '13:00', d_b + TIME '20:00',
    10, 20, 5500, 5500, 6000, 6000, 0, v_super, v_super) RETURNING id INTO v_cut_b2;
  INSERT INTO cash_cut_counts (cut_period_id, total_counted, system_cash, difference, created_by)
  VALUES (v_cut_b1, 5500, 5500, 0, v_super) RETURNING id INTO v_count_b1;
  INSERT INTO cash_cut_counts (cut_period_id, total_counted, system_cash, difference, created_by)
  VALUES (v_cut_b2, 6000, 6000, 0, v_super) RETURNING id INTO v_count_b2;
  INSERT INTO cash_cut_bank_reconciliations (cut_period_id, count_id, bank_id, bank_name, system_balance, verified_balance, difference, created_by)
  VALUES (v_cut_b1, v_count_b1, v_bank, 'Banco prueba', 110000, 110000, 0, v_super) RETURNING id INTO v_brec_b1;

  INSERT INTO accounts_receivable (client_id, date, amount, description, movement_type, created_by)
  VALUES (v_client, d_a, 300, 'CxC día A', 'CARGO', v_super) RETURNING id INTO v_ar_a;
  INSERT INTO accounts_receivable (client_id, date, amount, description, movement_type, created_by)
  VALUES (v_client, d_b, 500, 'CxC día B', 'CARGO', v_super) RETURNING id INTO v_ar_b;
  INSERT INTO accounts_receivable (client_id, date, amount, description, movement_type, created_by)
  VALUES (v_client, d_c, 700, 'CxC día C', 'CARGO', v_super) RETURNING id INTO v_ar_c;
  INSERT INTO assets (client_id, date, amount, description, movement_type, created_by)
  VALUES (v_client, d_b, 800, 'Activo día B', 'CARGO', v_super) RETURNING id INTO v_as_b;
  INSERT INTO assets (client_id, date, amount, description, movement_type, created_by)
  VALUES (v_client, d_c, 900, 'Activo día C', 'CARGO', v_super) RETURNING id INTO v_as_c;

  INSERT INTO bank_account_movements (bank_id, movement_type, origin, amount, balance_before, balance_after, business_date, user_id, concept)
  VALUES (v_bank, 'AJUSTE_MANUAL', 'AJUSTE_MANUAL', 2000, 100000, 102000, d_b, v_super, 'Ajuste día B') RETURNING id INTO v_bm_b;
  INSERT INTO bank_account_movements (bank_id, movement_type, origin, amount, balance_before, balance_after, business_date, user_id, concept)
  VALUES (v_bank, 'AJUSTE_MANUAL', 'AJUSTE_MANUAL', 3000, 120000, 123000, d_c, v_super, 'Ajuste día C') RETURNING id INTO v_bm_c;

  INSERT INTO cash_movements (operational_date, operational_day_id, movement_type, direction, amount, previous_balance,
    new_balance, description, idempotency_key, created_by)
  VALUES (d_b, v_day_b, 'ENTRADA_MANUAL', 'IN', 1000, 5000, 6000, 'Entrada día B', 'FDR-TEST-CM-B', v_super) RETURNING id INTO v_cm_b;
  INSERT INTO cash_movements (operational_date, operational_day_id, movement_type, direction, amount, previous_balance,
    new_balance, description, idempotency_key, created_by, reference_type, reference_id)
  VALUES (d_b, v_day_b, 'ABONO_POR_COBRAR', 'IN', 50, 6000, 6050, 'Con origen', 'FDR-TEST-CM-REF', v_super, 'ACCOUNT_RECEIVABLE', v_ar_b)
  RETURNING id INTO v_cm_ref;

  fp_a := pg_temp.day_fingerprint(d_a);
  fp_c := pg_temp.day_fingerprint(d_c);
  fp_live := pg_temp.live_fingerprint();

  -- ── 1. Apertura y permisos ──────────────────────────────────────────────────────────
  PERFORM pg_temp.expect('P1 ADMIN no puede abrir (financial_days.correct)',
    pg_temp.err(format('SELECT open_financial_day_review(%L, %L, %L)', d_b, v_admin, 'Revisión de descuadre')),
    'FINANCIAL_REVIEW_FORBIDDEN');
  IF v_user IS NOT NULL THEN
    PERFORM pg_temp.expect('P2 USER no puede abrir',
      pg_temp.err(format('SELECT open_financial_day_review(%L, %L, %L)', d_b, v_user, 'Revisión de descuadre')),
      'FINANCIAL_REVIEW_FORBIDDEN');
  END IF;
  PERFORM pg_temp.expect('P3 motivo obligatorio',
    pg_temp.err(format('SELECT open_financial_day_review(%L, %L, %L)', d_b, v_super, 'x')),
    'FINANCIAL_REVIEW_REASON_REQUIRED');
  PERFORM pg_temp.expect('P4 hoy no es un día histórico',
    pg_temp.err(format('SELECT open_financial_day_review(%L, %L, %L)',
      (now() AT TIME ZONE 'America/Guatemala')::date, v_super, 'Revisión de hoy')),
    'FINANCIAL_REVIEW_DATE_NOT_HISTORICAL');
  PERFORM pg_temp.expect('P5 día sin datos',
    pg_temp.err(format('SELECT open_financial_day_review(%L, %L, %L)', DATE '2019-02-03', v_super, 'Revisión sin datos')),
    'FINANCIAL_REVIEW_DAY_NOT_FOUND');
  PERFORM pg_temp.expect('P6 un día aún abierto se cierra por su flujo normal',
    pg_temp.err(format('SELECT open_financial_day_review(%L, %L, %L)', d_open, v_super, 'Revisión día abierto')),
    'FINANCIAL_REVIEW_DAY_STILL_OPEN');

  v_session := open_financial_day_review(d_b, v_super, 'Descuadre en Agentes Bancarios');
  PERFORM pg_temp.expect('P7 sesión abierta en estado OPEN',
    (SELECT status FROM financial_day_review_sessions WHERE id = v_session), 'OPEN');
  PERFORM pg_temp.expect('P8 la apertura no modifica nada del día B',
    (SELECT final_balance::text FROM bank_balances WHERE id = v_bb_b), '120000.00');
  PERFORM pg_temp.expect('P9 segundo usuario no abre el mismo día (concurrencia)',
    pg_temp.err(format('SELECT open_financial_day_review(%L, %L, %L)', d_b, COALESCE(v_super2, v_super), 'Otra revisión')),
    'FINANCIAL_REVIEW_ALREADY_OPEN');

  -- ── 2. PRUEBA CRÍTICA: saldo bancario del día B 120,000 → 125,000 ───────────────────
  v_corr := correct_financial_day_snapshot(v_session, 'BANK_BALANCE', v_bb_b, 'final_balance', 125000,
    'Saldo final mal digitado', NULL, v_super, 'FDR-TEST-1');
  PERFORM pg_temp.expect('C1 día A sigue en 100,000', (SELECT final_balance::text FROM bank_balances WHERE id = v_bb_a), '100000.00');
  PERFORM pg_temp.expect('C2 día B queda en 125,000', (SELECT final_balance::text FROM bank_balances WHERE id = v_bb_b), '125000.00');
  PERFORM pg_temp.expect('C3 día C sigue en 130,000', (SELECT final_balance::text FROM bank_balances WHERE id = v_bb_c), '130000.00');
  PERFORM pg_temp.expect('C4 la apertura del día C NO se ajusta (120,000)',
    (SELECT previous_balance::text FROM bank_balances WHERE id = v_bb_c), '120000.00');
  PERFORM pg_temp.expect('C5 auditoría: original / nuevo / diferencia',
    (SELECT original_value || '/' || new_value || '/' || difference || '/' || module FROM financial_day_corrections WHERE id = v_corr),
    '120000.00/125000.00/5000.00/BANCOS');
  PERFORM pg_temp.expect('C6 versión de la foto conserva el valor anterior',
    (SELECT previous_value || '>' || value || '#' || version_number FROM financial_day_snapshot_versions
     WHERE correction_id = v_corr AND field = 'final_balance'), '120000.00>125000.00#1');
  PERFORM pg_temp.expect('C7 sesión pasa a IN_REVIEW', (SELECT status || corrections_count FROM financial_day_review_sessions WHERE id = v_session), 'IN_REVIEW1');

  -- Duplicados / idempotencia
  v_corr2 := correct_financial_day_snapshot(v_session, 'BANK_BALANCE', v_bb_b, 'final_balance', 125000,
    'Saldo final mal digitado', NULL, v_super, 'FDR-TEST-1');
  PERFORM pg_temp.expect('D1 reintento devuelve la misma corrección', (v_corr2 = v_corr)::text, 'true');
  PERFORM pg_temp.expect('D2 sin corrección duplicada',
    (SELECT count(*) FROM financial_day_corrections WHERE session_id = v_session)::text, '1');
  PERFORM pg_temp.expect('D3 mismo valor = sin cambio',
    pg_temp.err(format('SELECT correct_financial_day_snapshot(%L, %L, %L, %L, %s, %L, NULL, %L, %L)',
      v_session, 'BANK_BALANCE', v_bb_b, 'final_balance', 125000, 'Otra vez lo mismo', v_super, 'FDR-TEST-2')),
    'FINANCIAL_REVIEW_NO_CHANGE');

  -- Fuera del día seleccionado
  PERFORM pg_temp.expect('O1 corregir el saldo del día A desde la sesión de B',
    pg_temp.err(format('SELECT correct_financial_day_snapshot(%L, %L, %L, %L, %s, %L, NULL, %L, %L)',
      v_session, 'BANK_BALANCE', v_bb_a, 'final_balance', 1, 'Intento fuera del día', v_super, 'FDR-TEST-3')),
    'FINANCIAL_REVIEW_OUTSIDE_DAY');
  PERFORM pg_temp.expect('O2 corregir el cierre del día C desde la sesión de B',
    pg_temp.err(format('SELECT correct_financial_day_snapshot(%L, %L, %L, %L, %s, %L, NULL, %L, %L)',
      v_session, 'AGENT_RECONCILIATION', v_rec_c, 'total_cash', 1, 'Intento fuera del día', v_super, 'FDR-TEST-4')),
    'FINANCIAL_REVIEW_OUTSIDE_DAY');
  PERFORM pg_temp.expect('O3 ajustar una CxC del día A',
    pg_temp.err(format('SELECT adjust_financial_day_movement(%L, %L, %L, %s, %L, NULL, %L, %L)',
      v_session, 'ACCOUNT_RECEIVABLE', v_ar_a, 1, 'Intento fuera del día', v_super, 'FDR-TEST-5')),
    'FINANCIAL_REVIEW_OUTSIDE_DAY');
  PERFORM pg_temp.expect('O4 ajustar un movimiento bancario del día C',
    pg_temp.err(format('SELECT adjust_financial_day_movement(%L, %L, %L, %s, %L, NULL, %L, %L)',
      v_session, 'BANK_MOVEMENT', v_bm_c, 1, 'Intento fuera del día', v_super, 'FDR-TEST-6')),
    'FINANCIAL_REVIEW_OUTSIDE_DAY');
  PERFORM pg_temp.expect('O5 la protección no depende de la función: UPDATE marcado de otro día',
    pg_temp.err(format($q$SELECT set_config('app.financial_review_day', %L, true);
      UPDATE bank_balances SET final_balance = 1 WHERE id = %L$q$, d_b::text, v_bb_c)),
    'FINANCIAL_REVIEW_OUTSIDE_DAY');
  PERFORM set_config('app.financial_review_day', '', true);

  -- Permisos y dueño de la sesión
  PERFORM pg_temp.expect('R1 ADMIN no corrige',
    pg_temp.err(format('SELECT correct_financial_day_snapshot(%L, %L, %L, %L, %s, %L, NULL, %L, %L)',
      v_session, 'BANK_BALANCE', v_bb_b, 'previous_balance', 1, 'Sin permiso', v_admin, 'FDR-TEST-7')),
    'FINANCIAL_REVIEW_FORBIDDEN');
  IF v_super2 IS NOT NULL THEN
    PERFORM pg_temp.expect('R2 otro SUPER_ADMIN no corrige la sesión ajena',
      pg_temp.err(format('SELECT correct_financial_day_snapshot(%L, %L, %L, %L, %s, %L, NULL, %L, %L)',
        v_session, 'BANK_BALANCE', v_bb_b, 'previous_balance', 1, 'Sesión ajena', v_super2, 'FDR-TEST-8')),
      'FINANCIAL_REVIEW_NOT_OWNER');
  END IF;

  -- Acciones normales incompatibles sobre el día en revisión
  PERFORM pg_temp.expect('L1 save_bank_balance del día B bloqueado',
    pg_temp.err(format('SELECT save_bank_balance(%L, %L, %s, %L)', v_bank, d_b, 1, v_super)),
    'FINANCIAL_REVIEW_DAY_LOCKED');
  PERFORM pg_temp.expect('L2 editar una CxC del día B por el CRUD bloqueado',
    pg_temp.err(format('UPDATE accounts_receivable SET amount = 1 WHERE id = %L', v_ar_b)),
    'FINANCIAL_REVIEW_DAY_LOCKED');
  PERFORM pg_temp.expect('L3 registrar un movimiento con fecha del día B bloqueado',
    pg_temp.err(format($q$INSERT INTO assets (client_id, date, amount, movement_type, created_by)
      VALUES (%L, %L, 1, 'CARGO', %L)$q$, v_client, d_b, v_super)),
    'FINANCIAL_REVIEW_DAY_LOCKED');
  PERFORM pg_temp.expect('L4 reabrir el día B en Agentes bloqueado',
    pg_temp.err(format('UPDATE day_openings SET closed_at = NULL, closed_by = NULL WHERE date = %L', d_b)),
    'FINANCIAL_REVIEW_DAY_LOCKED');
  PERFORM pg_temp.expect('L5 las operaciones de HOY no se bloquean ni se asignan al día B',
    pg_temp.try_undo(format($q$INSERT INTO accounts_receivable (client_id, date, amount, movement_type, created_by)
      VALUES (%L, (now() AT TIME ZONE 'America/Guatemala')::date, 1, 'CARGO', %L)$q$, v_client, v_super)),
    'OK');

  -- ── 3. Cierre del día (Cuadre de Agentes): resultado recalculado en la misma fila ────
  v_corr := correct_financial_day_snapshot(v_session, 'AGENT_RECONCILIATION', v_rec_b, 'total_cash', 6500,
    'Efectivo contado mal', 'Arqueo físico', v_super, 'FDR-TEST-9');
  PERFORM pg_temp.expect('Q1 resultado B = 6500 + 120000 + 3000 − 2000',
    (SELECT total_cash || '/' || result FROM agent_reconciliations WHERE id = v_rec_b), '6500.00/127500.00');
  PERFORM pg_temp.expect('Q2 versión del resultado registrada',
    (SELECT previous_value || '>' || value FROM financial_day_snapshot_versions WHERE correction_id = v_corr AND field = 'result'),
    '127000.00>127500.00');
  PERFORM pg_temp.expect('Q3 cierres de A y C intactos',
    (SELECT string_agg(result::text, ',' ORDER BY date) FROM agent_reconciliations WHERE id IN (v_rec_a, v_rec_c)),
    '106000.00,138000.00');

  -- ── 4. Cortes: el arqueo del primer corte NO modifica el segundo corte ──────────────
  v_corr := correct_financial_day_snapshot(v_session, 'CASH_CUT_COUNT', v_count_b1, 'total_counted', 5400,
    'Billete de 100 no contado', NULL, v_super, 'FDR-TEST-10');
  PERFORM pg_temp.expect('K1 arqueo del corte 1 corregido con su diferencia',
    (SELECT total_counted || '/' || difference FROM cash_cut_counts WHERE id = v_count_b1), '5400.00/-100.00');
  PERFORM pg_temp.expect('K2 el corte 1 refleja el contado',
    (SELECT closing_physical_cash || '/' || cash_difference FROM cash_cut_periods WHERE id = v_cut_b1), '5400.00/-100.00');
  PERFORM pg_temp.expect('K3 el corte 2 NO cambia (apertura física heredada 5500)',
    (SELECT opening_physical_cash || '/' || closing_physical_cash FROM cash_cut_periods WHERE id = v_cut_b2), '5500.00/6000.00');
  PERFORM pg_temp.expect('K4 el cierre del día B no cambia por el corte 1',
    (SELECT closing_physical_cash::text FROM cash_operational_days WHERE id = v_day_b), '6000.00');
  v_corr := correct_financial_day_snapshot(v_session, 'CASH_CUT_COUNT', v_count_b2, 'total_counted', 5950,
    'Arqueo final corregido', NULL, v_super, 'FDR-TEST-11');
  PERFORM pg_temp.expect('K5 arqueo del corte final actualiza el cierre del MISMO día',
    (SELECT closing_physical_cash || '/' || closing_difference FROM cash_operational_days WHERE id = v_day_b), '5950.00/-50.00');
  PERFORM pg_temp.expect('K6 la apertura del día C conserva su valor (6000)',
    (SELECT opening_physical_cash::text FROM cash_operational_days WHERE id = v_day_c), '6000.00');
  v_corr := correct_financial_day_snapshot(v_session, 'CASH_BANK_RECONCILIATION', v_brec_b1, 'verified_balance', 109000,
    'Saldo verificado mal leído', NULL, v_super, 'FDR-TEST-12');
  PERFORM pg_temp.expect('K7 conciliación bancaria del corte corregida',
    (SELECT verified_balance || '/' || difference FROM cash_cut_bank_reconciliations WHERE id = v_brec_b1), '109000.00/-1000.00');
  v_corr := correct_financial_day_snapshot(v_session, 'CASH_DAY', v_day_b, 'opening_physical_cash', 4950,
    'Apertura física corregida', NULL, v_super, 'FDR-TEST-13');
  PERFORM pg_temp.expect('K8 apertura del día B corregida; el cierre de A intacto',
    (SELECT (SELECT opening_physical_cash FROM cash_operational_days WHERE id = v_day_b) || '/' ||
            (SELECT closing_physical_cash FROM cash_operational_days WHERE id = v_day_a)), '4950.00/5000.00');

  -- ── 5. Movimientos: ajuste vinculado, el ledger no se toca ──────────────────────────
  v_corr := adjust_financial_day_movement(v_session, 'ACCOUNT_RECEIVABLE', v_ar_b, 450,
    'Cargo registrado de más', NULL, v_super, 'FDR-TEST-14');
  PERFORM pg_temp.expect('M1 la CxC original conserva su monto', (SELECT amount::text FROM accounts_receivable WHERE id = v_ar_b), '500.00');
  PERFORM pg_temp.expect('M2 ajuste vinculado con efecto −50 en CxC',
    (SELECT a.delta || '/' || e.scope || '/' || e.amount FROM financial_day_adjustments a
     JOIN financial_day_adjustment_effects e ON e.adjustment_id = a.id WHERE a.correction_id = v_corr AND e.scope = 'AR'),
    '-50.00/AR/-50.00');
  v_corr := adjust_financial_day_movement(v_session, 'ACCOUNT_RECEIVABLE', v_ar_b, 480,
    'Monto real verificado', NULL, v_super, 'FDR-TEST-15');
  PERFORM pg_temp.expect('M3 una segunda corrección reemplaza a la anterior (una sola vigente)',
    (SELECT count(*) FILTER (WHERE status = 'VIGENTE') || '/' || count(*) FILTER (WHERE status = 'REEMPLAZADO')
     FROM financial_day_adjustments WHERE source_id = v_ar_b), '1/1');
  PERFORM pg_temp.expect('M4 auditoría: original 450 → nuevo 480',
    (SELECT original_value || '>' || new_value FROM financial_day_corrections WHERE id = v_corr), '450.00>480.00');
  PERFORM pg_temp.expect('M5 el efecto de la vigente es relativo al registro original (−20)',
    (SELECT e.amount::text FROM financial_day_adjustments a JOIN financial_day_adjustment_effects e ON e.adjustment_id = a.id
     WHERE a.source_id = v_ar_b AND a.status = 'VIGENTE' AND e.scope = 'AR'), '-20.00');

  v_corr := adjust_financial_day_movement(v_session, 'ASSET', v_as_b, 850, 'Activo mal digitado', NULL, v_super, 'FDR-TEST-16');
  PERFORM pg_temp.expect('M6 activo: original intacto, efecto +50',
    (SELECT (SELECT amount FROM assets WHERE id = v_as_b) || '/' || e.amount FROM financial_day_adjustments a
     JOIN financial_day_adjustment_effects e ON e.adjustment_id = a.id WHERE a.correction_id = v_corr AND e.scope = 'ASSET'),
    '800.00/50.00');
  v_corr := adjust_financial_day_movement(v_session, 'BANK_MOVEMENT', v_bm_b, 2500, 'Ajuste real 2500', NULL, v_super, 'FDR-TEST-17');
  PERFORM pg_temp.expect('M7 movimiento bancario: ledger intacto, efecto +500 en su cuenta',
    (SELECT (SELECT amount || '/' || balance_after FROM bank_account_movements WHERE id = v_bm_b) || '/' || e.amount
     FROM financial_day_adjustments a JOIN financial_day_adjustment_effects e ON e.adjustment_id = a.id
     WHERE a.correction_id = v_corr AND e.scope = 'BANK' AND e.bank_id = v_bank), '2000.00/102000.00/500.00');
  v_corr := adjust_financial_day_movement(v_session, 'CASH_MOVEMENT', v_cm_b, 900, 'Entrada real 900', NULL, v_super, 'FDR-TEST-18');
  PERFORM pg_temp.expect('M8 movimiento de efectivo: Kardex intacto, efecto −100 en efectivo',
    (SELECT (SELECT amount || '/' || new_balance FROM cash_movements WHERE id = v_cm_b) || '/' || e.amount
     FROM financial_day_adjustments a JOIN financial_day_adjustment_effects e ON e.adjustment_id = a.id
     WHERE a.correction_id = v_corr AND e.scope = 'CASH'), '1000.00/6000.00/-100.00');
  PERFORM pg_temp.expect('M9 un renglón generado por otra operación se corrige en su origen',
    pg_temp.err(format('SELECT adjust_financial_day_movement(%L, %L, %L, %s, %L, NULL, %L, %L)',
      v_session, 'CASH_MOVEMENT', v_cm_ref, 10, 'Corrección en el Kardex', v_super, 'FDR-TEST-19')),
    'FINANCIAL_REVIEW_MOVEMENT_HAS_SOURCE');

  -- ── 6. Auditoría inmutable ──────────────────────────────────────────────────────────
  PERFORM pg_temp.expect('A1 una corrección no se edita',
    pg_temp.err(format('UPDATE financial_day_corrections SET new_value = 1 WHERE session_id = %L', v_session)),
    'FINANCIAL_REVIEW_AUDIT_IMMUTABLE');
  PERFORM pg_temp.expect('A2 una corrección no se borra',
    pg_temp.err(format('DELETE FROM financial_day_corrections WHERE session_id = %L', v_session)),
    'FINANCIAL_REVIEW_AUDIT_IMMUTABLE');
  PERFORM pg_temp.expect('A3 un ajuste no se borra',
    pg_temp.err(format('DELETE FROM financial_day_adjustments WHERE session_id = %L', v_session)),
    'FINANCIAL_REVIEW_AUDIT_IMMUTABLE');
  PERFORM pg_temp.expect('A4 las versiones no se borran',
    pg_temp.err(format('DELETE FROM financial_day_snapshot_versions WHERE session_id = %L', v_session)),
    'FINANCIAL_REVIEW_AUDIT_IMMUTABLE');
  PERFORM pg_temp.expect('A5 la sesión no se borra',
    pg_temp.err(format('DELETE FROM financial_day_review_sessions WHERE id = %L', v_session)),
    'FINANCIAL_REVIEW_AUDIT_IMMUTABLE');
  PERFORM pg_temp.expect('A6 TRUNCATE de la auditoría rechazado',
    pg_temp.err('TRUNCATE financial_day_adjustment_effects'), 'FINANCIAL_REVIEW_AUDIT_IMMUTABLE');

  -- ── 7. Cierre de la revisión ────────────────────────────────────────────────────────
  PERFORM pg_temp.expect('Z1 cerrar exige el resumen previo (PENDING_CONFIRMATION)',
    pg_temp.err(format('SELECT close_financial_day_review(%L, %L, NULL, false, false, 0, NULL)', v_session, v_super)),
    'FINANCIAL_REVIEW_CONFIRMATION_REQUIRED');
  PERFORM request_financial_day_review_close(v_session, v_super);
  PERFORM pg_temp.expect('Z2 estado PENDING_CONFIRMATION',
    (SELECT status FROM financial_day_review_sessions WHERE id = v_session), 'PENDING_CONFIRMATION');
  PERFORM pg_temp.expect('Z3 con diferencias pendientes hay que aceptarlas explícitamente',
    pg_temp.err(format('SELECT close_financial_day_review(%L, %L, NULL, true, false, 50, NULL)', v_session, v_super)),
    'FINANCIAL_REVIEW_PENDING_DIFFERENCES');
  PERFORM close_financial_day_review(v_session, v_super, 'Queda Q50 por investigar', true, true, 50, '{"ok":true}'::jsonb);
  PERFORM pg_temp.expect('Z4 sesión cerrada con diferencias pendientes',
    (SELECT status || '/' || has_pending_differences || '/' || difference_after FROM financial_day_review_sessions WHERE id = v_session),
    'CLOSED/true/50.00');
  PERFORM pg_temp.expect('Z5 una sesión cerrada no admite correcciones',
    pg_temp.err(format('SELECT correct_financial_day_snapshot(%L, %L, %L, %L, %s, %L, NULL, %L, %L)',
      v_session, 'BANK_BALANCE', v_bb_b, 'final_balance', 1, 'Después del cierre', v_super, 'FDR-TEST-20')),
    'FINANCIAL_REVIEW_SESSION_CLOSED');
  PERFORM pg_temp.expect('Z6 una sesión cerrada no se modifica',
    pg_temp.err(format('UPDATE financial_day_review_sessions SET close_observations = %L WHERE id = %L', 'x', v_session)),
    'FINANCIAL_REVIEW_AUDIT_IMMUTABLE');
  PERFORM pg_temp.expect('Z7 la corrección persiste tras cerrar (B = 125,000)',
    (SELECT final_balance::text FROM bank_balances WHERE id = v_bb_b), '125000.00');

  -- Reapertura = nueva sesión auditada
  v_session2 := open_financial_day_review(d_b, v_super, 'Segunda revisión del día B');
  PERFORM pg_temp.expect('Z8 reabrir crea una sesión nueva', (v_session2 <> v_session)::text, 'true');
  v_corr := correct_financial_day_snapshot(v_session2, 'BANK_BALANCE', v_bb_b, 'final_balance', 124000,
    'Ajuste tras segunda revisión', NULL, v_super, 'FDR-TEST-21');
  PERFORM pg_temp.expect('Z9 la versión continúa la cadena (#2: 125,000 → 124,000)',
    (SELECT previous_value || '>' || value || '#' || version_number FROM financial_day_snapshot_versions
     WHERE correction_id = v_corr AND field = 'final_balance'), '125000.00>124000.00#2');
  PERFORM request_financial_day_review_close(v_session2, v_super);
  PERFORM close_financial_day_review(v_session2, v_super, NULL, false, false, 0, NULL);
  PERFORM pg_temp.expect('Z10 sin sesión activa el día vuelve a aceptar su flujo normal',
    pg_temp.try_undo(format('UPDATE accounts_receivable SET description = %L WHERE id = %L', 'x', v_ar_b)),
    'OK');

  -- ── 8. Aislamiento total ────────────────────────────────────────────────────────────
  PERFORM pg_temp.expect('I1 TODO el día A quedó exactamente igual', pg_temp.day_fingerprint(d_a), fp_a);
  PERFORM pg_temp.expect('I2 TODO el día C quedó exactamente igual', pg_temp.day_fingerprint(d_c), fp_c);
  PERFORM pg_temp.expect('I3 saldos vivos (bancos, efectivo, CxC, activos) sin cambio', pg_temp.live_fingerprint(), fp_live);
  PERFORM pg_temp.expect('I4 resumen A/B/C de saldos',
    (SELECT string_agg(final_balance::text, ',' ORDER BY operation_date) FROM bank_balances WHERE id IN (v_bb_a, v_bb_b, v_bb_c)),
    '100000.00,124000.00,130000.00');

  RAISE NOTICE 'Revisión de días operativos: todas las pruebas pasaron.';
END $$;

ROLLBACK;
