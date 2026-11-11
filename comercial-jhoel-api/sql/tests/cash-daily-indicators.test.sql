-- Control de Efectivo — los acumulados diarios se reinician en cada apertura de día bancario
-- (migración 1760007300000-CashDailyIndicatorsFromBankDayOpening). El efectivo físico y el Kardex
-- NO se reinician. Incluye la prueba de aceptación Día 1 / apertura Día 2 / consulta histórica.
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/cash-daily-indicators.test.sql

BEGIN;

CREATE FUNCTION pg_temp.admin_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name IN ('SUPER_ADMIN', 'ADMIN') ORDER BY u.created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.move(p_type VARCHAR, p_direction VARCHAR, p_amount NUMERIC) RETURNS UUID LANGUAGE sql AS $$
  SELECT apply_cash_movement(p_type, p_direction, p_amount, pg_temp.admin_id(), 'Prueba acumulados diarios',
    NULL, NULL, NULL, NULL, NULL, 'CDI-' || gen_random_uuid())
$$;

-- Apertura de día en Agentes Bancarios (lo que hace "Aperturar día"); idempotente como el repositorio.
CREATE FUNCTION pg_temp.open_bank_day(p_date DATE) RETURNS VOID LANGUAGE sql AS $$
  INSERT INTO day_openings (date, opened_by) VALUES (p_date, pg_temp.admin_id()) ON CONFLICT (date) DO NOTHING
$$;

-- Acumulados de un día bancario, igual que el repositorio: rango (inicio, siguiente apertura] del Kardex.
CREATE FUNCTION pg_temp.day(p_date DATE, p_what TEXT) RETURNS TEXT LANGUAGE sql AS $$
  SELECT CASE p_what
    WHEN 'deposits' THEN COALESCE(sum(m.amount) FILTER (WHERE m.movement_type = 'DEPOSITO' AND m.direction = 'IN'), 0)::text
    WHEN 'withdrawals' THEN COALESCE(sum(m.amount) FILTER (WHERE m.movement_type = 'RETIRO' AND m.direction = 'OUT'), 0)::text
    WHEN 'disbursements' THEN COALESCE(sum(m.amount) FILTER (WHERE m.movement_type = 'DESEMBOLSO_GENESIS'), 0)::text
    WHEN 'in' THEN COALESCE(sum(m.amount) FILTER (WHERE m.direction = 'IN'), 0)::text
    WHEN 'out' THEN COALESCE(sum(m.amount) FILTER (WHERE m.direction = 'OUT'), 0)::text
    WHEN 'count' THEN count(m.id)::text
    WHEN 'opening' THEN max(r.opening_cash_balance)::text
    WHEN 'closing' THEN max(CASE WHEN r.end_sequence IS NULL THEN cash_balance() ELSE cash_balance_at(r.end_sequence) END)::text
  END
  FROM cash_bank_day_ranges r
  LEFT JOIN cash_movements m ON m.sequence > r.start_sequence AND (r.end_sequence IS NULL OR m.sequence <= r.end_sequence)
  WHERE r.business_date = p_date
$$;

CREATE FUNCTION pg_temp.kardex_fingerprint(p_up_to BIGINT) RETURNS TEXT LANGUAGE sql AS $$
  SELECT md5(COALESCE(string_agg(to_jsonb(m)::text, ',' ORDER BY sequence), ''))
  FROM cash_movements m WHERE sequence <= p_up_to
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

DO $$
DECLARE
  d1 DATE := DATE '2099-03-01';
  d2 DATE := DATE '2099-03-02';
  v_base NUMERIC;
  v_kardex_rows BIGINT;
  v_day1_end BIGINT;
  v_fp_day1 TEXT;
BEGIN
  -- Punto de partida: efectivo físico inicial = Q100,000 (sea cual sea el saldo de la base).
  v_base := cash_balance();
  IF v_base <> 100000 THEN
    PERFORM pg_temp.move('AJUSTE', CASE WHEN v_base < 100000 THEN 'IN' ELSE 'OUT' END, abs(100000 - v_base));
  END IF;
  PERFORM pg_temp.expect('0 efectivo inicial', cash_balance()::text, '100000.00');

  -- ── Día 1 ─────────────────────────────────────────────────────────────────────────
  PERFORM pg_temp.open_bank_day(d1);
  PERFORM pg_temp.expect('1.1 al aperturar el día 1 los depósitos están en 0', pg_temp.day(d1, 'deposits'), '0');
  PERFORM pg_temp.expect('1.2 entradas/salidas/operaciones en 0',
    pg_temp.day(d1, 'in') || '/' || pg_temp.day(d1, 'out') || '/' || pg_temp.day(d1, 'count'), '0/0/0');
  PERFORM pg_temp.expect('1.3 efectivo inicial del día 1 = Q100,000', pg_temp.day(d1, 'opening'), '100000.00');

  PERFORM pg_temp.move('DEPOSITO', 'IN', 10000);
  PERFORM pg_temp.move('RETIRO', 'OUT', 5000);
  PERFORM pg_temp.expect('1.4 depósitos del día 1', pg_temp.day(d1, 'deposits'), '10000.00');
  PERFORM pg_temp.expect('1.5 retiros del día 1', pg_temp.day(d1, 'withdrawals'), '5000.00');
  PERFORM pg_temp.expect('1.6 efectivo final del día 1 = Q105,000', cash_balance()::text, '105000.00');

  -- Aperturar dos veces el mismo día no duplica ni reinicia.
  PERFORM pg_temp.open_bank_day(d1);
  PERFORM pg_temp.expect('1.7 una sola apertura registrada para el día 1',
    (SELECT count(*)::text FROM cash_bank_day_openings WHERE business_date = d1), '1');
  PERFORM pg_temp.expect('1.8 la segunda apertura no reinicia los acumulados', pg_temp.day(d1, 'deposits'), '10000.00');

  v_kardex_rows := (SELECT count(*) FROM cash_movements);
  v_day1_end := (SELECT max(sequence) FROM cash_movements);
  v_fp_day1 := pg_temp.kardex_fingerprint(v_day1_end);

  -- ── Apertura del día 2 ────────────────────────────────────────────────────────────
  PERFORM pg_temp.open_bank_day(d2);
  PERFORM pg_temp.expect('2.1 depósitos del día 2 = 0', pg_temp.day(d2, 'deposits'), '0');
  PERFORM pg_temp.expect('2.2 retiros del día 2 = 0', pg_temp.day(d2, 'withdrawals'), '0');
  PERFORM pg_temp.expect('2.3 desembolsos del día 2 = 0', pg_temp.day(d2, 'disbursements'), '0');
  PERFORM pg_temp.expect('2.4 entradas / salidas del día 2 = 0',
    pg_temp.day(d2, 'in') || '/' || pg_temp.day(d2, 'out'), '0/0');
  PERFORM pg_temp.expect('2.5 efectivo físico disponible se conserva (Q105,000)', cash_balance()::text, '105000.00');
  PERFORM pg_temp.expect('2.6 efectivo inicial del día 2 = cierre del día 1', pg_temp.day(d2, 'opening'), '105000.00');
  PERFORM pg_temp.expect('2.7 la apertura no crea movimientos en el Kardex',
    (SELECT count(*)::text FROM cash_movements), v_kardex_rows::text);
  PERFORM pg_temp.expect('2.8 el Kardex del día 1 queda idéntico', pg_temp.kardex_fingerprint(v_day1_end), v_fp_day1);

  -- ── Día 2 ─────────────────────────────────────────────────────────────────────────
  PERFORM pg_temp.move('DEPOSITO', 'NONE', 700);  -- operación bancaria sin efectivo físico
  PERFORM pg_temp.expect('3.1 una operación sin efectivo no cambia el efectivo ni entradas/salidas',
    cash_balance() || '/' || pg_temp.day(d2, 'in') || '/' || pg_temp.day(d2, 'out'), '105000.00/0/0');
  PERFORM pg_temp.move('DEPOSITO', 'IN', 8000);
  PERFORM pg_temp.move('RETIRO', 'OUT', 3000);
  PERFORM pg_temp.expect('3.2 depósitos del día 2', pg_temp.day(d2, 'deposits'), '8000.00');
  PERFORM pg_temp.expect('3.3 retiros del día 2', pg_temp.day(d2, 'withdrawals'), '3000.00');
  PERFORM pg_temp.expect('3.4 efectivo final del día 2 = Q110,000', cash_balance()::text, '110000.00');
  PERFORM pg_temp.expect('3.5 el día 2 no incluye operaciones del día 1', pg_temp.day(d2, 'in'), '8000.00');

  -- ── Consulta histórica del día 1 ──────────────────────────────────────────────────
  PERFORM pg_temp.expect('4.1 día 1 conserva sus depósitos', pg_temp.day(d1, 'deposits'), '10000.00');
  PERFORM pg_temp.expect('4.2 día 1 conserva sus retiros', pg_temp.day(d1, 'withdrawals'), '5000.00');
  PERFORM pg_temp.expect('4.3 día 1 conserva su efectivo final', pg_temp.day(d1, 'closing'), '105000.00');
  PERFORM pg_temp.expect('4.4 continuidad: cierre día 1 = apertura día 2', pg_temp.day(d1, 'closing'), pg_temp.day(d2, 'opening'));
  PERFORM pg_temp.expect('4.5 el Kardex conserva todos los movimientos de ambos días, en orden y encadenados',
    (SELECT count(*)::text FROM cash_movements m
      WHERE m.previous_balance <> COALESCE((SELECT p.new_balance FROM cash_movements p WHERE p.sequence < m.sequence ORDER BY p.sequence DESC LIMIT 1), 0)),
    '0');

  -- ── Integridad de las anclas ──────────────────────────────────────────────────────
  PERFORM pg_temp.expect('5.1 un ancla no se modifica',
    pg_temp.err(format('UPDATE cash_bank_day_openings SET opening_cash_balance = 0 WHERE business_date = %L', d1)),
    'CASH_BANK_DAY_OPENING_IMMUTABLE');
  PERFORM pg_temp.expect('5.2 un ancla no se borra',
    pg_temp.err(format('DELETE FROM cash_bank_day_openings WHERE business_date = %L', d1)),
    'CASH_BANK_DAY_OPENING_IMMUTABLE');
  PERFORM pg_temp.expect('5.3 el día actual es el último aperturado',
    (SELECT to_char(business_date, 'YYYY-MM-DD') FROM cash_bank_day_ranges WHERE is_current), '2099-03-02');

  RAISE NOTICE 'Acumulados diarios por apertura bancaria: todas las pruebas pasaron.';
END $$;

ROLLBACK;
