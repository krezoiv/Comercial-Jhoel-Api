-- Arqueo de Caja y Entrega de Efectivo a Bodega (migración 1760007400000-CashCountsAndWarehouseCustody).
-- Escenario de aceptación: caja Q100,000 + Bodega Q20,000 → entrega Q15,000 → arqueo contado Q84,500 (faltante Q500).
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/cash-custody.test.sql

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

-- Desglose JSON de un conteo: pares (denominación, cantidad).
CREATE FUNCTION pg_temp.breakdown(VARIADIC p_pairs NUMERIC[]) RETURNS JSONB LANGUAGE sql AS $$
  SELECT jsonb_agg(jsonb_build_object('denomination', p_pairs[i], 'quantity', p_pairs[i + 1]))
  FROM generate_series(1, array_length(p_pairs, 1), 2) i
$$;

CREATE FUNCTION pg_temp.custody() RETURNS TEXT LANGUAGE sql AS $$
  SELECT cash_balance() || ' + ' || warehouse_cash_balance() || ' = ' || (cash_balance() + warehouse_cash_balance())
$$;

DO $$
DECLARE
  v_super UUID := pg_temp.user_with('SUPER_ADMIN');
  v_user UUID := pg_temp.user_with('USER');
  v_base NUMERIC;
  v_transfer UUID;
  v_retry UUID;
  v_row RECORD;
  v_count UUID;
  v_correction UUID;
  v_kardex_rows BIGINT;
  v_fp TEXT;
BEGIN
  -- Día bancario abierto (el "día operativo" de Control de Efectivo).
  INSERT INTO day_openings (date, opened_by) VALUES (DATE '2099-06-01', v_super);

  -- ── Saldos iniciales: caja Q100,000, Bodega Q20,000 ───────────────────────────────
  v_base := cash_balance();
  IF v_base <> 100000 THEN
    PERFORM apply_cash_movement('AJUSTE', CASE WHEN v_base < 100000 THEN 'IN' ELSE 'OUT' END, abs(100000 - v_base),
      v_super, 'Prueba custodia', NULL, NULL, NULL, 'Prueba', NULL, 'CUST-' || gen_random_uuid());
  END IF;
  IF v_user IS NOT NULL THEN
    PERFORM pg_temp.expect('P1 un cajero no carga el saldo inicial de Bodega',
      pg_temp.err(format('SELECT register_warehouse_initial_balance(20000, %L, %L, %L)', v_user, 'Saldo de prueba', 'WH-INIT-X')),
      'CASH_CUSTODY_FORBIDDEN');
  END IF;
  PERFORM register_warehouse_initial_balance(20000, v_super, 'Saldo inicial de prueba', 'WH-INIT-1');
  PERFORM pg_temp.expect('0 custodia inicial', pg_temp.custody(), '100000.00 + 20000.00 = 120000.00');
  PERFORM pg_temp.expect('0.1 el saldo inicial de Bodega se carga una sola vez',
    pg_temp.err(format('SELECT register_warehouse_initial_balance(5, %L, %L, %L)', v_super, 'Otro saldo', 'WH-INIT-2')),
    'WAREHOUSE_INITIAL_BALANCE_EXISTS');

  -- ── Validaciones de la entrega ────────────────────────────────────────────────────
  PERFORM pg_temp.expect('V1 monto mayor que cero',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(0, NULL, %L, %L, NULL, NULL, %L, %L)', 'Juan Caja', 'Ana Bodega', v_super, 'T-V1')),
    'CASH_INVALID_AMOUNT');
  PERFORM pg_temp.expect('V2 personas identificadas',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(100, NULL, %L, %L, NULL, NULL, %L, %L)', '', 'Ana Bodega', v_super, 'T-V2')),
    'CASH_WAREHOUSE_PEOPLE_REQUIRED');
  PERFORM pg_temp.expect('V3 desglose debe sumar el monto',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(500, %L, %L, %L, NULL, NULL, %L, %L)',
      pg_temp.breakdown(200, 2), 'Juan Caja', 'Ana Bodega', v_super, 'T-V3')),
    'CASH_BREAKDOWN_MISMATCH');
  PERFORM pg_temp.expect('V4 no se entrega más del efectivo en caja',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(100000.01, NULL, %L, %L, NULL, NULL, %L, %L)', 'Juan Caja', 'Ana Bodega', v_super, 'T-V4')),
    'CASH_INSUFFICIENT_BALANCE');
  IF v_user IS NOT NULL THEN
    PERFORM pg_temp.expect('V5 un cajero no registra entregas (RBAC en la base)',
      pg_temp.err(format('SELECT register_cash_warehouse_transfer(100, %L, %L, %L, NULL, NULL, %L, %L)',
        pg_temp.breakdown(100, 1), 'Juan Caja', 'Ana Bodega', v_user, 'T-V5')),
      'CASH_CUSTODY_FORBIDDEN');
  END IF;
  PERFORM pg_temp.expect('V6 una operación fallida no deja nada', pg_temp.custody(), '100000.00 + 20000.00 = 120000.00');
  PERFORM pg_temp.expect('V7 ni entregas a medias',
    (SELECT count(*)::text FROM cash_warehouse_transfers), '0');

  v_kardex_rows := (SELECT count(*) FROM cash_movements);
  v_fp := (SELECT md5(string_agg(to_jsonb(m)::text, ',' ORDER BY sequence)) FROM cash_movements m);

  -- ── Entrega de Q15,000 a Bodega (75 × Q200) ───────────────────────────────────────
  v_transfer := register_cash_warehouse_transfer(15000, pg_temp.breakdown(200, 75), 'Juan Caja', 'Ana Bodega',
    'COMP-001', 'Traslado de mediodía', v_super, 'T-1');
  PERFORM pg_temp.expect('E1 caja Q85,000 / Bodega Q35,000 / custodia Q120,000', pg_temp.custody(),
    '85000.00 + 35000.00 = 120000.00');
  SELECT t.*, c.movement_type AS cash_type, c.direction AS cash_dir, c.amount AS cash_amount, c.reference_id AS cash_ref,
         w.movement_type AS wh_type, w.direction AS wh_dir, w.amount AS wh_amount, w.reference_id AS wh_ref
  INTO v_row
  FROM cash_warehouse_transfers t
  JOIN cash_movements c ON c.id = t.cash_movement_id
  JOIN warehouse_cash_movements w ON w.id = t.warehouse_movement_id
  WHERE t.id = v_transfer;
  PERFORM pg_temp.expect('E2 salida de caja e ingreso a Bodega por el mismo monto y la misma referencia',
    v_row.cash_type || '/' || v_row.cash_dir || '/' || v_row.cash_amount || ' ↔ ' || v_row.wh_type || '/' || v_row.wh_dir || '/' || v_row.wh_amount
      || ' ' || (v_row.cash_ref = v_transfer AND v_row.wh_ref = v_transfer)::text,
    'ENTREGA_BODEGA/OUT/15000.00 ↔ ENTREGA_DESDE_CAJA/IN/15000.00 true');
  PERFORM pg_temp.expect('E3 referencia ENT- y desglose guardado',
    (v_row.reference_number LIKE 'ENT-%')::text || '/' || v_row.has_breakdown || '/' ||
    (SELECT sum(subtotal)::text FROM cash_movement_details WHERE movement_id = v_row.cash_movement_id), 'true/true/15000.00');
  PERFORM pg_temp.expect('E4 no es gasto ni ingreso: tipos de transferencia interna, sin SALIDA_MANUAL/ENTRADA_MANUAL',
    (SELECT count(*)::text FROM cash_movements WHERE sequence > (SELECT max(sequence) - 1 FROM cash_movements)
       AND movement_type IN ('SALIDA_MANUAL', 'ENTRADA_MANUAL', 'GASTO_POR_COBRAR')), '0');
  PERFORM pg_temp.expect('E5 una sola fila nueva en el Kardex de caja',
    (SELECT count(*) FROM cash_movements)::text, (v_kardex_rows + 1)::text);
  PERFORM pg_temp.expect('E6 el Kardex anterior queda intacto',
    (SELECT md5(string_agg(to_jsonb(m)::text, ',' ORDER BY sequence)) FROM cash_movements m WHERE sequence <= (
      SELECT max(sequence) FROM cash_movements) - 1), v_fp);

  v_retry := register_cash_warehouse_transfer(15000, pg_temp.breakdown(200, 75), 'Juan Caja', 'Ana Bodega',
    'COMP-001', 'Traslado de mediodía', v_super, 'T-1');
  PERFORM pg_temp.expect('E7 reintento (doble clic) devuelve la misma entrega', (v_retry = v_transfer)::text, 'true');
  PERFORM pg_temp.expect('E8 sin duplicar dinero', pg_temp.custody(), '85000.00 + 35000.00 = 120000.00');

  -- ── Arqueo de caja: contado Q84,500 (422 × Q200 + 1 × Q100) ──────────────────────
  v_kardex_rows := (SELECT count(*) FROM cash_movements);
  v_count := register_cash_count(
    pg_temp.breakdown(200, 422, 100, 1, 50, 0, 20, 0, 10, 0, 5, 0, 1, 0, 0.50, 0, 0.25, 0, 0.10, 0, 0.05, 0),
    'Arqueo de prueba', NULL, v_super, 'A-1', NULL, NULL);
  SELECT * INTO v_row FROM cash_counts WHERE id = v_count;
  PERFORM pg_temp.expect('A1 teórico Q85,000, contado Q84,500, diferencia −Q500, FALTANTE',
    v_row.system_cash || '/' || v_row.total_counted || '/' || v_row.difference || '/' || v_row.result,
    '85000.00/84500.00/-500.00/FALTANTE');
  PERFORM pg_temp.expect('A2 el arqueo no toca el Kardex ni el saldo de caja',
    (SELECT count(*) FROM cash_movements)::text || ' ' || cash_balance(), v_kardex_rows::text || ' 85000.00');
  PERFORM pg_temp.expect('A3 Bodega sigue en Q35,000 y no entra en el conteo de caja',
    v_row.warehouse_balance || '/' || warehouse_cash_balance() || '/' || v_row.custody_theoretical, '35000.00/35000.00/120000.00');
  PERFORM pg_temp.expect('A4 sin conteo físico de Bodega queda como teórico (sin diferencia consolidada)',
    COALESCE(v_row.warehouse_counted::text, 'NULL') || '/' || COALESCE(v_row.warehouse_difference::text, 'NULL'), 'NULL/NULL');
  PERFORM pg_temp.expect('A5 detalle por denominación guardado (11 filas, subtotales)',
    (SELECT count(*) || '/' || sum(subtotal) FROM cash_count_details WHERE count_id = v_count), '11/84500.00');
  PERFORM pg_temp.expect('A6 cantidades negativas o decimales rechazadas',
    pg_temp.err(format('SELECT register_cash_count(%L, NULL, NULL, %L, %L, NULL, NULL)', pg_temp.breakdown(200, -1), v_super, 'A-X')),
    'CASH_INVALID_DENOMINATION');
  PERFORM pg_temp.expect('A7 denominación inexistente rechazada',
    pg_temp.err(format('SELECT register_cash_count(%L, NULL, NULL, %L, %L, NULL, NULL)', pg_temp.breakdown(3, 1), v_super, 'A-Y')),
    'CASH_INVALID_DENOMINATION');

  -- Sobrante y conteo consolidado con Bodega contada.
  v_correction := register_cash_count(pg_temp.breakdown(200, 426), NULL, 35000, v_super, 'A-2', NULL, NULL);
  PERFORM pg_temp.expect('A8 sobrante + Bodega verificada sin diferencia',
    (SELECT result || '/' || difference || '/' || warehouse_difference FROM cash_counts WHERE id = v_correction),
    'SOBRANTE/200.00/0.00');

  -- Histórico inmutable; corrección auditada conserva la foto original.
  PERFORM pg_temp.expect('H1 un arqueo no se modifica',
    pg_temp.err(format('UPDATE cash_counts SET total_counted = 85000 WHERE id = %L', v_count)), 'CASH_CUSTODY_IMMUTABLE');
  PERFORM pg_temp.expect('H2 su detalle tampoco',
    pg_temp.err(format('UPDATE cash_count_details SET quantity = 1 WHERE count_id = %L', v_count)), 'CASH_CUSTODY_IMMUTABLE');
  PERFORM pg_temp.expect('H3 ni se borra',
    pg_temp.err(format('DELETE FROM cash_counts WHERE id = %L', v_count)), 'CASH_CUSTODY_IMMUTABLE');
  IF v_user IS NOT NULL THEN
    PERFORM pg_temp.expect('H4 corregir requiere autorización',
      pg_temp.err(format('SELECT register_cash_count(%L, NULL, NULL, %L, %L, %L, %L)',
        pg_temp.breakdown(200, 425), v_user, 'A-C0', v_count, 'Conteo mal digitado')), 'CASH_CUSTODY_FORBIDDEN');
  END IF;
  -- Movimiento posterior al arqueo: la corrección debe conservar el teórico ORIGINAL.
  PERFORM apply_cash_movement('ENTRADA_MANUAL', 'IN', 1000, v_super, 'Después del arqueo', NULL, NULL, NULL, 'Prueba', NULL, 'CUST-AFTER');
  v_correction := register_cash_count(pg_temp.breakdown(200, 425), NULL, NULL, v_super, 'A-C1', v_count, 'Se contó mal un fajo');
  PERFORM pg_temp.expect('H5 corrección: misma foto (teórico Q85,000), nuevo conteo → CUADRADO',
    (SELECT system_cash || '/' || total_counted || '/' || result || '/' || (replaces_id = v_count)::text FROM cash_counts WHERE id = v_correction),
    '85000.00/85000.00/CUADRADO/true');
  PERFORM pg_temp.expect('H6 el original queda REEMPLAZADO con sus valores intactos',
    (SELECT status || '/' || total_counted || '/' || difference FROM cash_counts WHERE id = v_count), 'REEMPLAZADO/84500.00/-500.00');
  PERFORM pg_temp.expect('H7 no se corrige dos veces el mismo arqueo',
    pg_temp.err(format('SELECT register_cash_count(%L, NULL, NULL, %L, %L, %L, %L)',
      pg_temp.breakdown(200, 1), v_super, 'A-C2', v_count, 'Otra corrección')), 'CASH_COUNT_ALREADY_REPLACED');

  -- ── Anulación de la entrega: revierte ambos lados ─────────────────────────────────
  PERFORM pg_temp.expect('N1 antes de anular, Bodega no tiene reversas',
    (SELECT count(*)::text FROM warehouse_cash_movements WHERE reference_id = v_transfer AND movement_type = 'ANULACION'), '0');
  PERFORM void_manual_cash_movement((SELECT cash_movement_id FROM cash_warehouse_transfers WHERE id = v_transfer), v_super, 'Entrega registrada por error');
  PERFORM pg_temp.expect('N2 anular desde el Kardex de caja revierte caja y Bodega juntos', pg_temp.custody(),
    '101000.00 + 20000.00 = 121000.00');
  PERFORM pg_temp.expect('N3 entrega ANULADA, ambos movimientos ANULADO con su ANULACION',
    (SELECT t.status || '/' || c.status || '/' || w.status FROM cash_warehouse_transfers t
       JOIN cash_movements c ON c.id = t.cash_movement_id JOIN warehouse_cash_movements w ON w.id = t.warehouse_movement_id
     WHERE t.id = v_transfer), 'ANULADA/ANULADO/ANULADO');
  PERFORM pg_temp.expect('N4 no se anula dos veces',
    pg_temp.err(format('SELECT void_cash_warehouse_transfer(%L, %L, %L)', v_transfer, v_super, 'Otra vez')),
    'CASH_WAREHOUSE_TRANSFER_ALREADY_VOIDED');
  PERFORM pg_temp.expect('N5 los movimientos no se borran',
    pg_temp.err(format('DELETE FROM warehouse_cash_movements WHERE reference_id = %L', v_transfer)), 'CASH_CUSTODY_IMMUTABLE');

  -- Bodega nunca queda negativa.
  PERFORM pg_temp.expect('N6 Bodega no puede quedar negativa (CHECK)',
    pg_temp.err(format($q$SELECT apply_warehouse_cash_movement('ANULACION','OUT',999999,%L,'x',NULL,NULL,NULL,NULL,
      (SELECT id FROM warehouse_cash_movements WHERE movement_type = 'SALDO_INICIAL'),'WH-NEG')$q$, v_super)),
    'WAREHOUSE_INSUFFICIENT_BALANCE');

  -- ── Sin día operativo abierto no hay entregas ─────────────────────────────────────
  UPDATE day_openings SET closed_at = now(), closed_by = v_super WHERE date = DATE '2099-06-01';
  PERFORM pg_temp.expect('D1 entrega sin día abierto rechazada',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(100, %L, %L, %L, NULL, NULL, %L, %L)',
      pg_temp.breakdown(100, 1), 'Juan Caja', 'Ana Bodega', v_super, 'T-D1')), 'CASH_CUSTODY_DAY_NOT_OPEN');

  -- ── Cuadre de Agentes consolidado ─────────────────────────────────────────────────
  PERFORM pg_temp.expect('C1 los cierres históricos conservan su resultado (Bodega = 0)',
    (SELECT count(*)::text FROM agent_reconciliations WHERE total_warehouse_cash <> 0), '0');

  RAISE NOTICE 'Arqueo de caja y entrega a Bodega: todas las pruebas pasaron.';
END $$;

ROLLBACK;
