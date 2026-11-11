-- Transaccionar → "Descripción / Beneficiario" (migración 1760007200000-AddDescriptionToBankDepositOperations).
-- Verifica que la descripción se guarde en la MISMA fila de la operación, para todos los tipos, sin cambiar
-- saldos bancarios, efectivo físico, movimientos ni comisiones (se compara contra la misma operación sin
-- descripción). Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/bank-deposit-description.test.sql

BEGIN;

CREATE FUNCTION pg_temp.admin_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name IN ('SUPER_ADMIN', 'ADMIN') ORDER BY u.created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.type_id(p_effect VARCHAR) RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_types
  WHERE balance_effect IS NOT DISTINCT FROM p_effect AND is_active ORDER BY created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.agent_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_banks WHERE is_active AND cash_box_code IS NULL ORDER BY created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.account_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM banks
  WHERE is_active AND special_account IS NULL AND available_in_transaccionar AND max_balance IS NULL
  ORDER BY created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.is_genesis(p_effect VARCHAR) RETURNS BOOLEAN LANGUAGE sql AS $$
  SELECT COALESCE(p_effect IN ('DESEMBOLSO_GENESIS', 'PAGO_GENESIS'), false)
$$;

-- Registra con la firma nueva (descripción) o la anterior (12 argumentos, como un proceso interno).
CREATE FUNCTION pg_temp.register(p_effect VARCHAR, p_total NUMERIC, p_description VARCHAR, p_use_old_signature BOOLEAN)
RETURNS UUID LANGUAGE plpgsql AS $$
DECLARE
  v_agent UUID := CASE WHEN pg_temp.is_genesis(p_effect) THEN NULL ELSE pg_temp.agent_id() END;
  v_account UUID := CASE WHEN pg_temp.is_genesis(p_effect) OR p_effect IS NULL THEN NULL ELSE pg_temp.account_id() END;
BEGIN
  IF p_use_old_signature THEN
    RETURN register_bank_deposit_operation(v_agent, p_total, CURRENT_DATE, '[]', jsonb_build_array(p_total),
      pg_temp.admin_id(), pg_temp.type_id(p_effect), 'Cliente prueba', 0, NULL, v_account, false);
  END IF;
  RETURN register_bank_deposit_operation(v_agent, p_total, CURRENT_DATE, '[]', jsonb_build_array(p_total),
    pg_temp.admin_id(), pg_temp.type_id(p_effect), 'Cliente prueba', 0, NULL, v_account, false, p_description);
END $$;

-- Efecto observable de una operación: movimientos bancarios (cuenta + monto), efectivo y comisiones.
CREATE FUNCTION pg_temp.effects(p_operation UUID) RETURNS TEXT LANGUAGE sql AS $$
  SELECT concat_ws(' | ',
    (SELECT string_agg(bank_id::text || '=' || amount::text || ':' || movement_type, ',' ORDER BY bank_id, amount)
       FROM bank_account_movements WHERE reference_type = 'BANK_DEPOSIT' AND reference_id = p_operation),
    (SELECT string_agg(direction || '=' || amount::text, ',' ORDER BY sequence)
       FROM cash_movements WHERE reference_type = 'BANK_DEPOSIT' AND reference_id = p_operation),
    (SELECT count(*)::text FROM guayacan_commissions WHERE operation_id = p_operation),
    (SELECT total_amount || '/' || transaction_count || '/' || total_distributed FROM bank_deposit_operations WHERE id = p_operation)
  )
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
  v_effect VARCHAR;
  v_plain UUID;
  v_described UUID;
  v_account UUID := pg_temp.account_id();
  v_balance_before NUMERIC;
  v_cash_before NUMERIC;
  v_ops_before BIGINT;
  v_label TEXT;
BEGIN
  IF pg_temp.agent_id() IS NULL OR v_account IS NULL THEN
    RAISE EXCEPTION 'La base necesita un banco agente activo (no Guayacán) y una cuenta habilitada en Transaccionar';
  END IF;

  -- Fondos para los tipos que restan a la cuenta (Depósito, Reintegro).
  PERFORM pg_temp.register('RETIRO', 5000, 'Fondeo de la prueba', false);

  -- ── Todos los tipos: misma operación con y sin descripción → mismos efectos ──────────
  FOREACH v_effect IN ARRAY ARRAY['DEPOSITO', 'RETIRO', 'DESEMBOLSO_GENESIS', 'PAGO_GENESIS', 'REINTEGRO', NULL] LOOP
    v_label := COALESCE(v_effect, 'SIN_EFECTO');
    CONTINUE WHEN pg_temp.type_id(v_effect) IS NULL;
    v_plain := pg_temp.register(v_effect, 123.45, NULL, true);
    v_described := pg_temp.register(v_effect, 123.45, 'Juan Pérez - ' || v_label, false);
    PERFORM pg_temp.expect(v_label || ': la descripción queda en la fila de la operación',
      (SELECT description FROM bank_deposit_operations WHERE id = v_described), 'Juan Pérez - ' || v_label);
    PERFORM pg_temp.expect(v_label || ': la firma anterior (proceso interno) guarda NULL sin fallar',
      (SELECT COALESCE(description, '<null>') FROM bank_deposit_operations WHERE id = v_plain), '<null>');
    PERFORM pg_temp.expect(v_label || ': saldos, efectivo, movimientos y comisiones idénticos',
      pg_temp.effects(v_described), pg_temp.effects(v_plain));
    PERFORM pg_temp.expect(v_label || ': una sola operación por registro (sin duplicados)',
      (SELECT count(*)::text FROM bank_deposit_operations WHERE id IN (v_plain, v_described)), '2');
  END LOOP;

  -- ── Sanitización en SQL ───────────────────────────────────────────────────────────────
  v_described := pg_temp.register('RETIRO', 10, E'  María López\t-  Retiro\n personal  ', false);
  PERFORM pg_temp.expect('S1 recorta, colapsa espacios y quita caracteres de control',
    (SELECT description FROM bank_deposit_operations WHERE id = v_described), 'María López - Retiro personal');
  v_described := pg_temp.register('RETIRO', 10, '   ', false);
  PERFORM pg_temp.expect('S2 solo espacios = NULL (nunca una cadena vacía)',
    (SELECT COALESCE(description, '<null>') FROM bank_deposit_operations WHERE id = v_described), '<null>');
  v_described := pg_temp.register('RETIRO', 10, 'Distribuidora ABC, S.A. — Pago #45 (servicios) 50% & más', false);
  PERFORM pg_temp.expect('S3 conserva caracteres especiales habituales',
    (SELECT description FROM bank_deposit_operations WHERE id = v_described), 'Distribuidora ABC, S.A. — Pago #45 (servicios) 50% & más');
  v_described := pg_temp.register('RETIRO', 10, repeat('ñ', 250), false);
  PERFORM pg_temp.expect('S4 acepta exactamente 250 caracteres',
    (SELECT char_length(description)::text FROM bank_deposit_operations WHERE id = v_described), '250');

  -- ── Límite: más de 250 se rechaza y no deja nada (ni operación ni saldo ni efectivo) ──
  v_balance_before := (SELECT final_balance FROM banks WHERE id = v_account);
  v_cash_before := cash_balance();
  v_ops_before := (SELECT count(*) FROM bank_deposit_operations);
  PERFORM pg_temp.expect('L1 251 caracteres rechazados',
    pg_temp.err(format('SELECT pg_temp.register(%L, 50, %L, false)', 'RETIRO', repeat('a', 251))),
    'BANK_DEPOSIT_DESCRIPTION_TOO_LONG');
  PERFORM pg_temp.expect('L2 sin operación a medias', (SELECT count(*) FROM bank_deposit_operations)::text, v_ops_before::text);
  PERFORM pg_temp.expect('L3 saldo bancario intacto', (SELECT final_balance FROM banks WHERE id = v_account)::text, v_balance_before::text);
  PERFORM pg_temp.expect('L4 efectivo intacto', cash_balance()::text, v_cash_before::text);
  PERFORM pg_temp.expect('L5 la columna también lo impide (CHECK)',
    pg_temp.err(format('UPDATE bank_deposit_operations SET description = %L WHERE id = %L', repeat('a', 251), v_described)),
    'value too long for type character varying(250)');

  -- ── Compatibilidad con operaciones sin descripción ───────────────────────────────────
  v_plain := pg_temp.register('RETIRO', 20, NULL, true);
  PERFORM pg_temp.expect('H1 una operación sin descripción se anula igual que siempre',
    pg_temp.err(format('SELECT void_bank_deposit_operation(%L, CURRENT_DATE, %L, %L)', v_plain, pg_temp.admin_id(), 'Prueba de anulación')),
    'OK');
  PERFORM pg_temp.expect('H2 y sigue sin descripción (no se inventa)',
    (SELECT COALESCE(description, '<null>') || '/' || is_voided FROM bank_deposit_operations WHERE id = v_plain), '<null>/true');

  -- ── Búsqueda normalizada (la que usa el reporte) ──────────────────────────────────────
  v_described := pg_temp.register('RETIRO', 10, 'Pedro González - Reintegro', false);
  PERFORM pg_temp.expect('B1 encuentra sin acentos ni mayúsculas',
    (SELECT count(*)::text FROM bank_deposit_operations
     WHERE id = v_described AND search_normalize(description) LIKE '%' || search_normalize('pedro gonzalez') || '%'), '1');

  RAISE NOTICE 'Descripción / Beneficiario: todas las pruebas pasaron.';
END $$;

ROLLBACK;
