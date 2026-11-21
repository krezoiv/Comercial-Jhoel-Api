-- Inventario de efectivo por denominación (caja y Bodega) y traslados con desglose
-- (migración 1760007800000-CashDenominationInventoryAndCountDrafts).
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/cash-denomination-inventory.test.sql

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

CREATE FUNCTION pg_temp.errfull(p_sql TEXT) RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE p_sql;
  RETURN 'OK';
EXCEPTION WHEN OTHERS THEN
  RETURN SQLERRM;
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

-- "Q200=3 Q100=2 …" solo con cantidades distintas de cero.
CREATE FUNCTION pg_temp.inv(p_location TEXT) RETURNS TEXT LANGUAGE sql AS $$
  SELECT COALESCE(string_agg(trim_scale(denomination)::TEXT || '=' || quantity, ' ' ORDER BY denomination DESC), '(vacío)')
  FROM cash_location_inventory(p_location) WHERE quantity <> 0
$$;

CREATE FUNCTION pg_temp.summary(p_location TEXT) RETURNS TEXT LANGUAGE sql AS $$
  SELECT has_anchor || '/' || COALESCE(anchor_kind, '-') || ' conocido ' || known_total || ' sin desglosar ' || unbroken || ' saldo ' || balance
  FROM cash_location_inventory_summary(p_location)
$$;

CREATE FUNCTION pg_temp.banks() RETURNS JSONB LANGUAGE sql AS $$
  SELECT COALESCE(jsonb_agg(jsonb_build_object('bankId', b.id,
           'verifiedBalance', CASE WHEN b.special_account = 'GUAYACAN' THEN guayacan_cash_balance() ELSE b.final_balance END)), '[]')
  FROM banks b WHERE b.is_active
$$;

DO $$
DECLARE
  v_super UUID := pg_temp.user_with('SUPER_ADMIN');
  v_user UUID := pg_temp.user_with('USER');
  v_base NUMERIC;
  v_transfer UUID;
  v_withdrawal UUID;
  v_count UUID;
  v_retry UUID;
  v_op UUID;
  v_p1 UUID;
BEGIN
  INSERT INTO day_openings (date, opened_by) VALUES (DATE '2099-11-01', v_super);
  INSERT INTO bank_balances (bank_id, operation_date, previous_balance, final_balance, user_id)
  SELECT id, DATE '2099-11-01', 0, 0, v_super FROM banks WHERE is_active;

  -- Caja en Q2,000 exactos para el escenario.
  v_base := cash_balance();
  IF v_base <> 2000 THEN
    PERFORM apply_cash_movement('AJUSTE', CASE WHEN v_base < 2000 THEN 'IN' ELSE 'OUT' END, abs(2000 - v_base),
      v_super, 'Prueba inventario', NULL, NULL, NULL, 'Prueba', NULL, 'INV-ADJ-' || gen_random_uuid());
  END IF;

  -- ── Sin punto de partida ──────────────────────────────────────────────────────────
  IF NOT EXISTS (SELECT 1 FROM cash_location_anchor('CAJA')) THEN
    -- Since 1760008900000 the arqueo is not required to send cash to Bodega.
    PERFORM pg_temp.expect('P1 sin arqueo previo la caja SÍ puede entregar a Bodega (saldo oficial suficiente)',
      pg_temp.err(format('SELECT register_cash_warehouse_transfer(200, %L, %L, %L, NULL, NULL, %L, %L)',
        pg_temp.breakdown(200, 1), 'Juan Caja', 'Ana Bodega', v_super, 'INV-P1')), 'OK');
    -- Undo it (audited reversal) so the rest of the scenario starts from Q2,000.
    PERFORM void_cash_warehouse_transfer((SELECT id FROM cash_warehouse_transfers WHERE idempotency_key = 'INV-P1'),
      v_super, 'Prueba: deshacer la entrega');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cash_location_anchor('BODEGA')) THEN
    PERFORM pg_temp.expect('P2 Bodega sin conteo inicial: el resumen lo indica',
      (SELECT has_anchor::TEXT FROM cash_location_inventory_summary('BODEGA')), 'false');
  END IF;

  -- ── Arqueo de caja = punto de partida (Q2,000 = 5×200 + 8×100 + 4×50) ─────────────
  PERFORM register_cash_count(pg_temp.breakdown(200, 5, 100, 8, 50, 4), 'Partida', NULL, v_super, 'INV-A1', NULL, NULL);
  PERFORM pg_temp.expect('I1 inventario de caja = desglose del arqueo', pg_temp.inv('CAJA'), '200=5 100=8 50=4');
  PERFORM pg_temp.expect('I2 todo conocido: sin efectivo sin desglosar', pg_temp.summary('CAJA'),
    'true/ARQUEO_CAJA conocido 2000.00 sin desglosar 0.00 saldo 2000.00');

  -- ── Movimiento sin desglose (Transaccionar, CxC, manual…) → "sin desglosar" ───────
  PERFORM register_manual_cash_movement('ENTRADA_MANUAL', 300, v_super, NULL, 'Venta de prueba', 'INV-M1');
  PERFORM pg_temp.expect('I3 una entrada sin desglose no cambia las denominaciones', pg_temp.inv('CAJA'), '200=5 100=8 50=4');
  PERFORM pg_temp.expect('I4 … y suma a "sin desglosar"; conocido + sin desglosar = saldo', pg_temp.summary('CAJA'),
    'true/ARQUEO_CAJA conocido 2000.00 sin desglosar 300.00 saldo 2300.00');

  -- ── Caja → Bodega: solo el saldo oficial limita (1760008900000), nunca el arqueo ──
  PERFORM pg_temp.expect('V1 más que el saldo oficial de caja se rechaza, con el disponible',
    pg_temp.errfull(format('SELECT register_cash_warehouse_transfer(2400, %L, %L, %L, NULL, NULL, %L, %L)',
      pg_temp.breakdown(200, 12), 'Juan Caja', 'Ana Bodega', v_super, 'INV-V1')), 'CASH_WAREHOUSE_TRANSFER_EXCEEDS_CASH:2300.00');
  PERFORM pg_temp.expect('V4 sin desglose se rechaza (también a administradores)',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(200, NULL, %L, %L, NULL, NULL, %L, %L)',
      'Juan Caja', 'Ana Bodega', v_super, 'INV-V4')), 'CASH_CUSTODY_BREAKDOWN_REQUIRED');
  PERFORM pg_temp.expect('V5 cantidades decimales rechazadas',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(300, %L, %L, %L, NULL, NULL, %L, %L)',
      pg_temp.breakdown(200, 1.5), 'Juan Caja', 'Ana Bodega', v_super, 'INV-V5')), 'CASH_INVALID_DENOMINATION');
  PERFORM pg_temp.expect('V6 cantidades negativas rechazadas',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(200, %L, %L, %L, NULL, NULL, %L, %L)',
      pg_temp.breakdown(200, 2, 100, -2), 'Juan Caja', 'Ana Bodega', v_super, 'INV-V6')), 'CASH_INVALID_DENOMINATION');
  PERFORM pg_temp.expect('V7 el desglose debe sumar el monto',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(500, %L, %L, %L, NULL, NULL, %L, %L)',
      pg_temp.breakdown(200, 2), 'Juan Caja', 'Ana Bodega', v_super, 'INV-V7')), 'CASH_BREAKDOWN_MISMATCH');

  v_transfer := register_cash_warehouse_transfer(1400, pg_temp.breakdown(200, 3, 100, 8), 'Juan Caja', 'Ana Bodega',
    NULL, 'Retiro de caja a Bodega', v_super, 'INV-T1');
  PERFORM pg_temp.expect('T1 caja pierde exactamente lo enviado', pg_temp.inv('CAJA'), '200=2 50=4');
  v_retry := register_cash_warehouse_transfer(1400, pg_temp.breakdown(200, 3, 100, 8), 'Juan Caja', 'Ana Bodega',
    NULL, 'Retiro de caja a Bodega', v_super, 'INV-T1');
  PERFORM pg_temp.expect('T2 doble clic: misma entrega, inventario sin duplicar',
    (v_retry = v_transfer)::TEXT || ' ' || pg_temp.inv('CAJA'), 'true 200=2 50=4');

  -- ── Bodega: conteo inicial obligatorio y exacto ───────────────────────────────────
  PERFORM pg_temp.expect('B1 sin conteo de Bodega no se puede retirar por denominación',
    CASE WHEN EXISTS (SELECT 1 FROM cash_location_anchor('BODEGA')) THEN 'WAREHOUSE_COUNT_REQUIRED'
    ELSE pg_temp.err(format('SELECT register_warehouse_withdrawal(%L, 200, %L, NULL, %L, %L, NULL, NULL, %L, %L)',
      'CAJA', pg_temp.breakdown(200, 1), 'Ana Bodega', 'Juan Caja', v_super, 'INV-B1')) END, 'WAREHOUSE_COUNT_REQUIRED');
  PERFORM pg_temp.expect('B2 el conteo debe sumar el saldo de Bodega',
    pg_temp.err(format('SELECT register_warehouse_cash_count(%L, NULL, %L, %L)',
      pg_temp.breakdown(200, 1), v_super, 'INV-C-X')), 'WAREHOUSE_COUNT_MISMATCH');
  IF v_user IS NOT NULL THEN
    PERFORM pg_temp.expect('B3 un cajero no fija el inventario de Bodega',
      pg_temp.err(format('SELECT register_warehouse_cash_count(%L, NULL, %L, %L)',
        pg_temp.breakdown(200, 3, 100, 8), v_user, 'INV-C-U')), 'CASH_CUSTODY_FORBIDDEN');
  END IF;
  v_base := warehouse_cash_balance();
  -- Conteo = saldo actual de Bodega; lo que no son Q200/Q100 de la entrega, en Q50.
  v_count := register_warehouse_cash_count(
    pg_temp.breakdown(200, 3, 100, 8, 50, ((v_base - 1400) / 50)::INT), 'Conteo inicial', v_super, 'INV-C1');
  PERFORM pg_temp.expect('B4 reintento del conteo: mismo registro',
    (register_warehouse_cash_count(pg_temp.breakdown(200, 3, 100, 8, 50, ((v_base - 1400) / 50)::INT), 'Conteo inicial', v_super, 'INV-C1') = v_count)::TEXT, 'true');
  PERFORM pg_temp.expect('B5 Bodega queda totalmente conocida', pg_temp.summary('BODEGA'),
    'true/CONTEO_BODEGA conocido ' || v_base || ' sin desglosar 0.00 saldo ' || v_base);
  PERFORM pg_temp.expect('B6 el conteo es inmutable',
    pg_temp.err(format('UPDATE warehouse_cash_counts SET observations = %L WHERE id = %L', 'x', v_count)), 'CASH_CUSTODY_IMMUTABLE');

  -- ── Bodega → Caja: validación por denominación ────────────────────────────────────
  PERFORM pg_temp.expect('W1 no se retiran más Q100 de los que hay en Bodega',
    pg_temp.errfull(format('SELECT register_warehouse_withdrawal(%L, 900, %L, NULL, %L, %L, NULL, NULL, %L, %L)',
      'CAJA', pg_temp.breakdown(100, 9), 'Ana Bodega', 'Juan Caja', v_super, 'INV-W1')), 'WAREHOUSE_DENOMINATION_NOT_AVAILABLE:100:8:9');
  v_withdrawal := register_warehouse_withdrawal('CAJA', 1000, pg_temp.breakdown(200, 1, 100, 8), NULL, 'Ana Bodega', 'Juan Caja',
    NULL, 'Envío a caja', v_super, 'INV-W2');
  PERFORM pg_temp.expect('W2 Bodega pierde lo enviado', pg_temp.inv('BODEGA'),
    '200=2' || CASE WHEN v_base > 1400 THEN ' 50=' || ((v_base - 1400) / 50)::INT ELSE '' END);
  PERFORM pg_temp.expect('W3 caja recibe exactamente esas denominaciones', pg_temp.inv('CAJA'), '200=3 100=8 50=4');
  PERFORM pg_temp.expect('W4 conocido + sin desglosar = saldo (caja)', pg_temp.summary('CAJA'),
    'true/ARQUEO_CAJA conocido 1600.00 sin desglosar 300.00 saldo 1900.00');

  -- ── Reversión auditada restaura las existencias ───────────────────────────────────
  PERFORM void_warehouse_withdrawal(v_withdrawal, v_super, 'Prueba de reverso');
  PERFORM pg_temp.expect('R1 anular el envío devuelve las denominaciones a Bodega', pg_temp.inv('BODEGA'),
    '200=3 100=8' || CASE WHEN v_base > 1400 THEN ' 50=' || ((v_base - 1400) / 50)::INT ELSE '' END);
  PERFORM pg_temp.expect('R2 … y las quita de caja', pg_temp.inv('CAJA'), '200=2 50=4');
  PERFORM void_cash_warehouse_transfer(v_transfer, v_super, 'Prueba de reverso');
  PERFORM pg_temp.expect('R3 anular la entrega devuelve las denominaciones a caja', pg_temp.inv('CAJA'), '200=5 100=8 50=4');
  PERFORM pg_temp.expect('R4 los movimientos siguen en el historial (ANULADO), nada se borró',
    (SELECT count(*)::TEXT FROM cash_warehouse_transfers WHERE id = v_transfer AND status = 'ANULADA'), '1');

  -- ── Un arqueo más reciente se vuelve el nuevo punto de partida ────────────────────
  PERFORM register_cash_count(pg_temp.breakdown(200, 10, 50, 2), 'Recuento', NULL, v_super, 'INV-A2', NULL, NULL);
  PERFORM pg_temp.expect('A1 el inventario de caja parte del último arqueo', pg_temp.inv('CAJA'), '200=10 50=2');

  -- ── El arqueo de un corte finalizado también es punto de partida ──────────────────
  v_op := open_cash_operational_day(DATE '2099-11-01', v_super, NULL, NULL, '07:00', '13:00', '13:00', '19:00');
  SELECT id INTO v_p1 FROM cash_cut_periods WHERE operational_day_id = v_op AND period_number = 1;
  PERFORM start_cash_cut_period(v_p1, v_super);
  -- Un movimiento después del arqueo: el corte cierra en una secuencia posterior del Kardex.
  PERFORM register_manual_cash_movement('ENTRADA_MANUAL', 50, v_super, NULL, 'Venta durante el corte', 'INV-M2');
  PERFORM finish_cash_cut_period(v_p1, v_super, pg_temp.breakdown(100, 21), pg_temp.banks(), NULL, NULL);
  PERFORM pg_temp.expect('A2 tras finalizar el corte, su arqueo es el punto de partida',
    (SELECT anchor_kind FROM cash_location_inventory_summary('CAJA')) || ' ' || pg_temp.inv('CAJA'), 'CORTE_CAJA 100=21');

  RAISE NOTICE 'TODAS LAS PRUEBAS DEL INVENTARIO POR DENOMINACIÓN PASARON';
END $$;

ROLLBACK;
