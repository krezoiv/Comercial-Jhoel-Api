-- Retiro de Bodega hacia caja o hacia una cuenta bancaria (migración 1760007500000-WarehouseWithdrawals).
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/warehouse-withdrawals.test.sql

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

CREATE FUNCTION pg_temp.state(p_bank UUID) RETURNS TEXT LANGUAGE sql AS $$
  SELECT 'caja ' || cash_balance() || ' / bodega ' || warehouse_cash_balance() || ' / banco ' ||
         (SELECT final_balance FROM banks WHERE id = p_bank)
$$;

DO $$
DECLARE
  v_super UUID := pg_temp.user_with('SUPER_ADMIN');
  v_user UUID := pg_temp.user_with('USER');
  v_bank UUID;
  v_guayacan UUID;
  v_base NUMERIC;
  v_bank_base NUMERIC;
  v_to_cash UUID;
  v_to_bank UUID;
  v_retry UUID;
  v_row RECORD;
  v_custody_before NUMERIC;
BEGIN
  SELECT id INTO v_bank FROM banks WHERE is_active AND special_account IS NULL ORDER BY created_at LIMIT 1;
  SELECT id INTO v_guayacan FROM banks WHERE special_account = 'GUAYACAN' LIMIT 1;
  v_bank_base := (SELECT final_balance FROM banks WHERE id = v_bank);
  INSERT INTO day_openings (date, opened_by) VALUES (DATE '2099-09-01', v_super);

  -- Caja Q100,000, Bodega Q20,000 + entrega Q15,000 → Bodega Q35,000.
  v_base := cash_balance();
  IF v_base <> 100000 THEN
    PERFORM apply_cash_movement('AJUSTE', CASE WHEN v_base < 100000 THEN 'IN' ELSE 'OUT' END, abs(100000 - v_base),
      v_super, 'Prueba retiros', NULL, NULL, NULL, 'Prueba', NULL, 'WHW-T-' || gen_random_uuid());
  END IF;
  PERFORM register_warehouse_initial_balance(20000, v_super, 'Saldo inicial de prueba', 'WHW-INIT');
  PERFORM register_cash_warehouse_transfer(15000, pg_temp.breakdown(200, 75), 'Juan Caja', 'Ana Bodega', NULL, NULL, v_super, 'WHW-T1');
  PERFORM pg_temp.expect('0 punto de partida', pg_temp.state(v_bank),
    'caja 85000.00 / bodega 35000.00 / banco ' || v_bank_base);

  -- ── Validaciones ──────────────────────────────────────────────────────────────────
  PERFORM pg_temp.expect('V1 destino válido',
    pg_temp.err(format('SELECT register_warehouse_withdrawal(%L, 100, NULL, NULL, %L, %L, NULL, NULL, %L, %L)', 'OTRO', 'Ana Bodega', 'Juan Caja', v_super, 'W-V1')),
    'WAREHOUSE_WITHDRAWAL_INVALID_DESTINATION');
  PERFORM pg_temp.expect('V2 depósito sin cuenta',
    pg_temp.err(format('SELECT register_warehouse_withdrawal(%L, 100, NULL, NULL, %L, %L, NULL, NULL, %L, %L)', 'BANCO', 'Ana Bodega', 'Juan Caja', v_super, 'W-V2')),
    'WAREHOUSE_WITHDRAWAL_BANK_REQUIRED');
  PERFORM pg_temp.expect('V3 a caja no lleva cuenta',
    pg_temp.err(format('SELECT register_warehouse_withdrawal(%L, 100, NULL, %L, %L, %L, NULL, NULL, %L, %L)', 'CAJA', v_bank, 'Ana Bodega', 'Juan Caja', v_super, 'W-V3')),
    'WAREHOUSE_WITHDRAWAL_INVALID_DESTINATION');
  IF v_guayacan IS NOT NULL THEN
    PERFORM pg_temp.expect('V4 Guayacán no recibe depósitos',
      pg_temp.err(format('SELECT register_warehouse_withdrawal(%L, 100, NULL, %L, %L, %L, NULL, NULL, %L, %L)', 'BANCO', v_guayacan, 'Ana Bodega', 'Juan Caja', v_super, 'W-V4')),
      'CASH_DEPOSIT_GUAYACAN_NOT_ALLOWED');
  END IF;
  PERFORM pg_temp.expect('V5 no se retira más de lo que hay en Bodega',
    pg_temp.err(format('SELECT register_warehouse_withdrawal(%L, 35000.01, NULL, NULL, %L, %L, NULL, NULL, %L, %L)', 'CAJA', 'Ana Bodega', 'Juan Caja', v_super, 'W-V5')),
    'WAREHOUSE_INSUFFICIENT_BALANCE');
  PERFORM pg_temp.expect('V6 personas identificadas',
    pg_temp.err(format('SELECT register_warehouse_withdrawal(%L, 100, NULL, NULL, %L, %L, NULL, NULL, %L, %L)', 'CAJA', 'Ana Bodega', 'x', v_super, 'W-V6')),
    'CASH_WAREHOUSE_PEOPLE_REQUIRED');
  PERFORM pg_temp.expect('V7 desglose debe sumar el monto',
    pg_temp.err(format('SELECT register_warehouse_withdrawal(%L, 500, %L, NULL, %L, %L, NULL, NULL, %L, %L)', 'CAJA', pg_temp.breakdown(100, 4), 'Ana Bodega', 'Juan Caja', v_super, 'W-V7')),
    'CASH_BREAKDOWN_MISMATCH');
  IF v_user IS NOT NULL THEN
    PERFORM pg_temp.expect('V8 un cajero no retira de Bodega',
      pg_temp.err(format('SELECT register_warehouse_withdrawal(%L, 100, %L, NULL, %L, %L, NULL, NULL, %L, %L)', 'CAJA', pg_temp.breakdown(100, 1), 'Ana Bodega', 'Juan Caja', v_user, 'W-V8')),
      'CASH_CUSTODY_FORBIDDEN');
  END IF;
  PERFORM pg_temp.expect('V9 nada quedó escrito', pg_temp.state(v_bank) || ' / ' || (SELECT count(*) FROM warehouse_cash_withdrawals),
    'caja 85000.00 / bodega 35000.00 / banco ' || v_bank_base || ' / 0');

  -- ── Retiro a caja Q5,000 (transferencia interna) ──────────────────────────────────
  v_custody_before := cash_balance() + warehouse_cash_balance();
  v_to_cash := register_warehouse_withdrawal('CAJA', 5000, pg_temp.breakdown(100, 50), NULL, 'Ana Bodega', 'Juan Caja',
    'COMP-R1', 'Fondo para la tarde', v_super, 'W-1');
  PERFORM pg_temp.expect('C1 caja +5,000 y Bodega −5,000', pg_temp.state(v_bank),
    'caja 90000.00 / bodega 30000.00 / banco ' || v_bank_base);
  PERFORM pg_temp.expect('C2 total bajo custodia sin cambio', (cash_balance() + warehouse_cash_balance())::text, v_custody_before::text);
  SELECT w.reference_number, c.movement_type AS c_type, c.direction AS c_dir, c.amount AS c_amount,
         m.movement_type AS w_type, m.direction AS w_dir, m.amount AS w_amount,
         (SELECT sum(subtotal) FROM warehouse_cash_movement_details d WHERE d.movement_id = m.id) AS detail_total
  INTO v_row
  FROM warehouse_cash_withdrawals w
  JOIN cash_movements c ON c.id = w.cash_movement_id
  JOIN warehouse_cash_movements m ON m.id = w.warehouse_movement_id
  WHERE w.id = v_to_cash;
  PERFORM pg_temp.expect('C3 movimientos vinculados por el mismo monto, con desglose',
    v_row.c_type || '/' || v_row.c_dir || '/' || v_row.c_amount || ' ↔ ' || v_row.w_type || '/' || v_row.w_dir || '/' || v_row.w_amount || ' · ' || v_row.detail_total,
    'DEVOLUCION_BODEGA/IN/5000.00 ↔ DEVOLUCION_A_CAJA/OUT/5000.00 · 5000.00');
  PERFORM pg_temp.expect('C4 referencia RET-', (v_row.reference_number LIKE 'RET-%')::text, 'true');
  v_retry := register_warehouse_withdrawal('CAJA', 5000, pg_temp.breakdown(100, 50), NULL, 'Ana Bodega', 'Juan Caja',
    'COMP-R1', 'Fondo para la tarde', v_super, 'W-1');
  PERFORM pg_temp.expect('C5 reintento devuelve el mismo retiro, sin duplicar', (v_retry = v_to_cash)::text || ' ' || pg_temp.state(v_bank),
    'true caja 90000.00 / bodega 30000.00 / banco ' || v_bank_base);

  -- ── Retiro a cuenta bancaria Q10,000 (sin desglose: administrador) ────────────────
  v_to_bank := register_warehouse_withdrawal('BANCO', 10000, NULL, v_bank, 'Ana Bodega', 'Mensajero Pedro',
    'BOLETA-778', NULL, v_super, 'W-2');
  PERFORM pg_temp.expect('B1 Bodega −10,000 y la cuenta +10,000; la caja no cambia', pg_temp.state(v_bank),
    'caja 90000.00 / bodega 20000.00 / banco ' || (v_bank_base + 10000));
  PERFORM pg_temp.expect('B2 movimiento bancario DEPOSITO_CAJA vinculado con la boleta',
    (SELECT movement_type || '/' || origin || '/' || amount || '/' || reference_text FROM bank_account_movements
      WHERE reference_type = 'WAREHOUSE_WITHDRAWAL' AND reference_id = v_to_bank), 'DEPOSITO_CAJA/CONTROL_EFECTIVO/10000.00/BOLETA-778');
  PERFORM pg_temp.expect('B3 el depósito no crea movimiento de caja',
    (SELECT count(*)::text FROM cash_movements WHERE reference_id = v_to_bank), '0');
  IF v_user IS NOT NULL THEN
    PERFORM pg_temp.expect('B4 sin desglose solo administradores',
      pg_temp.err(format('SELECT register_warehouse_withdrawal(%L, 100, NULL, %L, %L, %L, NULL, NULL, %L, %L)', 'BANCO', v_bank, 'Ana Bodega', 'Juan Caja', v_user, 'W-B4')),
      'CASH_CUSTODY_FORBIDDEN');
  END IF;

  -- ── Inmutabilidad ─────────────────────────────────────────────────────────────────
  PERFORM pg_temp.expect('I1 un retiro no se edita',
    pg_temp.err(format('UPDATE warehouse_cash_withdrawals SET amount = 1 WHERE id = %L', v_to_cash)), 'CASH_CUSTODY_IMMUTABLE');
  PERFORM pg_temp.expect('I2 su desglose tampoco',
    pg_temp.err('UPDATE warehouse_cash_movement_details SET quantity = 1'), 'CASH_CUSTODY_IMMUTABLE');
  PERFORM pg_temp.expect('I3 ni se borra',
    pg_temp.err(format('DELETE FROM warehouse_cash_withdrawals WHERE id = %L', v_to_cash)), 'CASH_CUSTODY_IMMUTABLE');

  -- ── Anulaciones (revierten ambos lados) ───────────────────────────────────────────
  PERFORM void_manual_cash_movement((SELECT cash_movement_id FROM warehouse_cash_withdrawals WHERE id = v_to_cash), v_super, 'Retiro registrado por error');
  PERFORM pg_temp.expect('A1 anular desde el Kardex de caja: caja −5,000, Bodega +5,000', pg_temp.state(v_bank),
    'caja 85000.00 / bodega 25000.00 / banco ' || (v_bank_base + 10000));
  PERFORM void_warehouse_withdrawal(v_to_bank, v_super, 'Depósito no realizado');
  PERFORM pg_temp.expect('A2 anular el depósito: banco −10,000, Bodega +10,000', pg_temp.state(v_bank),
    'caja 85000.00 / bodega 35000.00 / banco ' || v_bank_base);
  PERFORM pg_temp.expect('A3 ambos retiros ANULADO y sus movimientos visibles como anulados',
    (SELECT string_agg(w.status || '/' || m.status, ',' ORDER BY w.number) FROM warehouse_cash_withdrawals w
       JOIN warehouse_cash_movements m ON m.id = w.warehouse_movement_id), 'ANULADO/ANULADO,ANULADO/ANULADO');
  PERFORM pg_temp.expect('A4 no se anula dos veces',
    pg_temp.err(format('SELECT void_warehouse_withdrawal(%L, %L, %L)', v_to_bank, v_super, 'Otra vez')), 'WAREHOUSE_WITHDRAWAL_ALREADY_VOIDED');
  IF v_user IS NOT NULL THEN
    PERFORM pg_temp.expect('A5 anular requiere autorización',
      pg_temp.err(format('SELECT void_warehouse_withdrawal(%L, %L, %L)', v_to_cash, v_user, 'Sin permiso')), 'CASH_CUSTODY_FORBIDDEN');
  END IF;

  -- ── Sin día abierto no hay retiros ────────────────────────────────────────────────
  UPDATE day_openings SET closed_at = now(), closed_by = v_super WHERE date = DATE '2099-09-01';
  PERFORM pg_temp.expect('D1 retiro sin día abierto rechazado',
    pg_temp.err(format('SELECT register_warehouse_withdrawal(%L, 100, %L, NULL, %L, %L, NULL, NULL, %L, %L)', 'CAJA', pg_temp.breakdown(100, 1), 'Ana Bodega', 'Juan Caja', v_super, 'W-D1')),
    'CASH_CUSTODY_DAY_NOT_OPEN');

  RAISE NOTICE 'Retiros de Bodega: todas las pruebas pasaron.';
END $$;

ROLLBACK;
