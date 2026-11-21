-- Caja → Bodega sin depender del Arqueo de Caja (migración 1760008900000).
-- La disponibilidad es el saldo OFICIAL de caja; el desglose es obligatorio y
-- debe sumar el monto; ambos Kardex se escriben en una sola transacción.
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/warehouse-transfer-without-count.test.sql
-- (La concurrencia, caso 8, está en sql/tests/cash-control-concurrency.sh.)

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

-- Caja exactamente en p_amount (ajuste dentro de la transacción de prueba).
CREATE FUNCTION pg_temp.set_cash(p_amount NUMERIC, p_user UUID) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE v_base NUMERIC := cash_balance();
BEGIN
  IF v_base <> p_amount THEN
    PERFORM apply_cash_movement('AJUSTE', CASE WHEN v_base < p_amount THEN 'IN' ELSE 'OUT' END, abs(p_amount - v_base),
      p_user, 'Prueba traslado sin arqueo', NULL, NULL, NULL, 'Prueba', NULL, 'WTC-ADJ-' || gen_random_uuid());
  END IF;
END $$;

DO $$
DECLARE
  v_admin UUID := pg_temp.user_with('SUPER_ADMIN');
  v_t UUID;
  v_retry UUID;
  v_cash_rows BIGINT;
  v_wh_rows BIGINT;
  v_custody NUMERIC;
  v_wh0 NUMERIC;
  v_row RECORD;
BEGIN
  INSERT INTO day_openings (date, opened_by) VALUES (DATE '2099-12-15', v_admin);
  -- Los arqueos de caja existentes no deben importar: se ignoran a propósito.
  PERFORM pg_temp.set_cash(5000, v_admin);
  v_wh0 := warehouse_cash_balance();

  -- ── Caso 1: sin arqueo (o con cualquier arqueo) se puede trasladar ──────────────
  v_custody := cash_balance() + warehouse_cash_balance();
  SELECT count(*) INTO v_cash_rows FROM cash_movements;
  SELECT count(*) INTO v_wh_rows FROM warehouse_cash_movements;
  v_t := register_cash_warehouse_transfer(3000, pg_temp.breakdown(200, 10, 100, 10), 'Juan Caja', 'Ana Bodega',
    'BOL-1', 'Primer traslado', v_admin, 'WTC-1');
  PERFORM pg_temp.expect('C1 traslado permitido solo con el saldo oficial (Q5,000 ≥ Q3,000)', (v_t IS NOT NULL)::TEXT, 'true');

  -- ── Caso 6: Caja baja, Bodega sube, el total se conserva ────────────────────────
  PERFORM pg_temp.expect('C6a caja Q5,000 → Q2,000', cash_balance()::TEXT, '2000.00');
  PERFORM pg_temp.expect('C6b Bodega sube exactamente Q3,000', (warehouse_cash_balance() - v_wh0)::TEXT, '3000.00');
  PERFORM pg_temp.expect('C6c total bajo resguardo sin cambio', ((cash_balance() + warehouse_cash_balance()) = v_custody)::TEXT, 'true');

  -- ── Caso 7: Kardex — un renglón en cada uno, traslado interno ───────────────────
  PERFORM pg_temp.expect('C7a un solo renglón nuevo en caja y uno en Bodega',
    ((SELECT count(*) FROM cash_movements) - v_cash_rows) || '/' || ((SELECT count(*) FROM warehouse_cash_movements) - v_wh_rows), '1/1');
  PERFORM pg_temp.expect('C7b es un traslado interno (no gasto, ingreso ni depósito)',
    (SELECT movement_type || ' ' || direction FROM cash_movements WHERE reference_id = v_t) || ' / ' ||
    (SELECT movement_type || ' ' || direction FROM warehouse_cash_movements WHERE reference_id = v_t),
    'ENTREGA_BODEGA OUT / ENTREGA_DESDE_CAJA IN');
  v_retry := register_cash_warehouse_transfer(3000, pg_temp.breakdown(200, 10, 100, 10), 'Juan Caja', 'Ana Bodega',
    'BOL-1', 'Primer traslado', v_admin, 'WTC-1');
  PERFORM pg_temp.expect('C7c doble envío: mismo traslado, sin duplicar el Kardex',
    (v_retry = v_t)::TEXT || ' ' || ((SELECT count(*) FROM cash_movements) - v_cash_rows), 'true 1');

  -- ── Caso 10: desglose y datos guardados (historial de solo lectura) ─────────────
  SELECT t.*, cm.previous_balance AS cash_before, cm.new_balance AS cash_after,
         wm.previous_balance AS wh_before, wm.new_balance AS wh_after
    INTO v_row
  FROM cash_warehouse_transfers t
  JOIN cash_movements cm ON cm.id = t.cash_movement_id
  JOIN warehouse_cash_movements wm ON wm.id = t.warehouse_movement_id
  WHERE t.id = v_t;
  PERFORM pg_temp.expect('C10a cada denominación con su cantidad y subtotal',
    (SELECT string_agg(trim_scale(denomination) || '×' || quantity || '=' || subtotal, ' ' ORDER BY denomination DESC)
     FROM cash_movement_details WHERE movement_id = v_row.cash_movement_id), '200×10=2000.00 100×10=1000.00');
  PERFORM pg_temp.expect('C10b total, referencia, observaciones, usuario y día operativo',
    v_row.amount || ' ' || left(v_row.reference_number, 4) || ' ' || v_row.voucher_reference || ' ' || v_row.observations || ' ' ||
    (v_row.created_by = v_admin) || ' ' || v_row.business_date, '3000.00 ENT- BOL-1 Primer traslado true 2099-12-15');
  PERFORM pg_temp.expect('C10c saldos antes/después de caja y Bodega desde el Kardex',
    v_row.cash_before || '→' || v_row.cash_after || ' / ' || (v_row.wh_before - v_wh0) || '→' || (v_row.wh_after - v_wh0),
    '5000.00→2000.00 / 0.00→3000.00');
  PERFORM pg_temp.expect('C10d el desglose confirmado no se puede alterar',
    pg_temp.err(format('UPDATE cash_movement_details SET quantity = 1, subtotal = denomination WHERE movement_id = %L', v_row.cash_movement_id)),
    'CASH_CUSTODY_IMMUTABLE');
  PERFORM pg_temp.expect('C10e … ni borrar',
    pg_temp.err(format('DELETE FROM cash_movement_details WHERE movement_id = %L', v_row.cash_movement_id)),
    'CASH_CUSTODY_IMMUTABLE');

  -- ── Caso 2: un arqueo viejo NO limita ───────────────────────────────────────────
  PERFORM pg_temp.set_cash(5000, v_admin);
  -- Arqueo antiguo: Q3,000 en billetes de Q200 (15). Luego entra efectivo sin desglose.
  PERFORM register_cash_count(pg_temp.breakdown(200, 15), 'Arqueo antiguo', NULL, v_admin, 'WTC-OLD', NULL, NULL);
  PERFORM pg_temp.set_cash(5000, v_admin);
  PERFORM pg_temp.expect('C2 con arqueo de Q3,000 y saldo oficial Q5,000 se trasladan Q4,000 (20 × Q200)',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(4000, %L, %L, %L, NULL, NULL, %L, %L)',
      pg_temp.breakdown(200, 20), 'Juan Caja', 'Ana Bodega', v_admin, 'WTC-2')), 'OK');
  PERFORM pg_temp.expect('C2b caja queda en Q1,000 (el arqueo no se usó como límite)', cash_balance()::TEXT, '1000.00');
  PERFORM pg_temp.expect('C2c el arqueo antiguo no se modificó',
    (SELECT total_counted || ' ' || status FROM cash_counts WHERE idempotency_key = 'WTC-OLD'), '3000.00 VIGENTE');

  -- ── Caso 3: más que el saldo oficial se rechaza, con el disponible ──────────────
  PERFORM pg_temp.set_cash(5000, v_admin);
  SELECT count(*) INTO v_cash_rows FROM cash_movements;
  PERFORM pg_temp.expect('C3 Q5,001 con Q5,000 disponibles se rechaza',
    pg_temp.errfull(format('SELECT register_cash_warehouse_transfer(5001, %L, %L, %L, NULL, NULL, %L, %L)',
      pg_temp.breakdown(200, 25, 1, 1), 'Juan Caja', 'Ana Bodega', v_admin, 'WTC-3')),
    'CASH_WAREHOUSE_TRANSFER_EXCEEDS_CASH:5000.00');
  PERFORM pg_temp.expect('C3b nada se escribió', ((SELECT count(*) FROM cash_movements) - v_cash_rows || ' ' || cash_balance()), '0 5000.00');
  PERFORM pg_temp.expect('C3c exactamente todo el saldo sí se permite',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(5000, %L, %L, %L, NULL, NULL, %L, %L)',
      pg_temp.breakdown(200, 25), 'Juan Caja', 'Ana Bodega', v_admin, 'WTC-3B')), 'OK');

  -- ── Casos 4 y 5: el desglose debe sumar el monto ────────────────────────────────
  PERFORM pg_temp.set_cash(5000, v_admin);
  PERFORM pg_temp.expect('C4 desglose que suma el monto (Q2,419.00): permitido',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(2419, %L, %L, %L, NULL, NULL, %L, %L)',
      pg_temp.breakdown(200, 5, 100, 5, 50, 10, 20, 10, 10, 10, 5, 10, 1, 50, 0.50, 20, 0.25, 20, 0.10, 20, 0.05, 20, 0.01, 100),
      'Juan Caja', 'Ana Bodega', v_admin, 'WTC-4')), 'OK');
  PERFORM pg_temp.expect('C5a desglose que no suma el monto: rechazado',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(500, %L, %L, %L, NULL, NULL, %L, %L)',
      pg_temp.breakdown(200, 2), 'Juan Caja', 'Ana Bodega', v_admin, 'WTC-5')), 'CASH_BREAKDOWN_MISMATCH');
  PERFORM pg_temp.expect('C5b sin desglose: rechazado',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(200, NULL, %L, %L, NULL, NULL, %L, %L)',
      'Juan Caja', 'Ana Bodega', v_admin, 'WTC-5B')), 'CASH_CUSTODY_BREAKDOWN_REQUIRED');
  PERFORM pg_temp.expect('C5c denominación inválida: rechazada',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(3, %L, %L, %L, NULL, NULL, %L, %L)',
      pg_temp.breakdown(3, 1), 'Juan Caja', 'Ana Bodega', v_admin, 'WTC-5C')), 'CASH_INVALID_DENOMINATION');

  -- ── Caso 9: si falla el segundo movimiento, nada queda a medias ─────────────────
  PERFORM pg_temp.set_cash(5000, v_admin);
  SELECT count(*) INTO v_cash_rows FROM cash_movements;
  SELECT count(*) INTO v_wh_rows FROM warehouse_cash_movements;
  v_wh0 := warehouse_cash_balance();
  -- Falla simulada al escribir el Kardex de Bodega (el de caja ya se escribió antes).
  CREATE FUNCTION pg_temp.fail_warehouse() RETURNS TRIGGER LANGUAGE plpgsql AS $f$
  BEGIN
    IF NEW.idempotency_key LIKE 'WHT-WH:WTC-9%' THEN
      RAISE EXCEPTION 'FALLA_SIMULADA';
    END IF;
    RETURN NEW;
  END $f$;
  CREATE TRIGGER trg_test_fail_warehouse BEFORE INSERT ON warehouse_cash_movements
    FOR EACH ROW EXECUTE FUNCTION pg_temp.fail_warehouse();
  PERFORM pg_temp.expect('C9a la operación falla',
    pg_temp.err(format('SELECT register_cash_warehouse_transfer(1000, %L, %L, %L, NULL, NULL, %L, %L)',
      pg_temp.breakdown(200, 5), 'Juan Caja', 'Ana Bodega', v_admin, 'WTC-9')), 'FALLA_SIMULADA');
  DROP TRIGGER trg_test_fail_warehouse ON warehouse_cash_movements;
  PERFORM pg_temp.expect('C9b caja sin descuento parcial, Bodega sin aumento parcial, sin renglones sueltos',
    cash_balance() || ' ' || (warehouse_cash_balance() - v_wh0) || ' ' ||
    ((SELECT count(*) FROM cash_movements) - v_cash_rows) || ' ' || ((SELECT count(*) FROM warehouse_cash_movements) - v_wh_rows) || ' ' ||
    (SELECT count(*) FROM cash_warehouse_transfers WHERE idempotency_key = 'WTC-9'),
    '5000.00 0.00 0 0 0');

  RAISE NOTICE 'Todas las pruebas de traslado Caja → Bodega sin arqueo pasaron.';
END $$;

ROLLBACK;
