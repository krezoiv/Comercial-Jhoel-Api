-- Cuentas por Cobrar / Activos ↔ Caja: medio de pago, reversas trazables, motivo obligatorio,
-- historial de cambios y anulación en cascada desde Transaccionar
-- (migración 1760009300000-PortfolioCashTraceability).
-- Todo corre dentro de una transacción que SIEMPRE termina en ROLLBACK: no deja ningún dato.
--
--   docker compose exec -T postgres psql -U <user> -d <db> -v ON_ERROR_STOP=1 \
--     < sql/tests/portfolio-cash-traceability.test.sql

BEGIN;

CREATE FUNCTION pg_temp.admin_id() RETURNS UUID LANGUAGE sql AS $$
  SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
  WHERE r.name IN ('SUPER_ADMIN', 'ADMIN') ORDER BY u.created_at LIMIT 1
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

CREATE FUNCTION pg_temp.ar(p_client UUID, p_type VARCHAR, p_amount NUMERIC, p_method VARCHAR) RETURNS UUID LANGUAGE sql AS $$
  SELECT register_account_receivable_movement(p_client, p_type, p_amount, CURRENT_DATE, 'Prueba ' || p_type,
    pg_temp.admin_id(), NULL, NULL, p_method)
$$;

CREATE FUNCTION pg_temp.asset(p_client UUID, p_type VARCHAR, p_amount NUMERIC, p_method VARCHAR) RETURNS UUID LANGUAGE sql AS $$
  SELECT register_asset_movement(p_client, p_type, p_amount, CURRENT_DATE, 'Prueba activo ' || p_type,
    pg_temp.admin_id(), NULL, NULL, p_method)
$$;

-- Net effect the Kardex holds for a record (IN − OUT, reversals included).
CREATE FUNCTION pg_temp.kardex_net(p_ref VARCHAR, p_id UUID) RETURNS TEXT LANGUAGE sql AS $$
  SELECT COALESCE(sum(CASE direction WHEN 'IN' THEN amount WHEN 'OUT' THEN -amount ELSE 0 END), 0)::NUMERIC(14,2)::TEXT
  FROM cash_movements WHERE reference_type = p_ref AND reference_id = p_id
$$;

CREATE FUNCTION pg_temp.moves(p_ref VARCHAR, p_id UUID) RETURNS TEXT LANGUAGE sql AS $$
  SELECT count(*)::TEXT FROM cash_movements WHERE reference_type = p_ref AND reference_id = p_id
$$;

CREATE FUNCTION pg_temp.void(p_table TEXT, p_id UUID, p_reason TEXT) RETURNS TEXT LANGUAGE sql AS $$
  SELECT pg_temp.err(format('SELECT void_portfolio_record(%L, %L, %L, %L)', p_table, p_id, p_reason, pg_temp.admin_id()))
$$;

CREATE FUNCTION pg_temp.edit(p_table TEXT, p_id UUID, p_amount NUMERIC, p_method TEXT, p_reason TEXT,
  p_description TEXT DEFAULT NULL) RETURNS TEXT LANGUAGE sql AS $$
  SELECT pg_temp.err(format('SELECT update_portfolio_record(%L, %L, NULL, NULL, %L, %L, %L, %L, %L, %L)',
    p_table, p_id, p_amount, p_description IS NOT NULL, p_description, p_method, p_reason, pg_temp.admin_id()))
$$;

CREATE FUNCTION pg_temp.agent() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM transaction_banks WHERE cash_box_code IS NULL AND is_active ORDER BY created_at LIMIT 1
$$;

CREATE FUNCTION pg_temp.account() RETURNS UUID LANGUAGE sql AS $$
  SELECT id FROM banks WHERE is_active AND special_account IS NULL AND available_in_transaccionar
  ORDER BY created_at LIMIT 1
$$;

-- Depósito de Transaccionar (entra a Caja) "enviado a Cuentas por Cobrar".
CREATE FUNCTION pg_temp.deposit(p_amount NUMERIC) RETURNS UUID LANGUAGE sql AS $$
  SELECT register_bank_deposit_operation(
    pg_temp.agent(), p_amount, CURRENT_DATE, '[]'::jsonb, jsonb_build_array(p_amount),
    pg_temp.admin_id(), (SELECT id FROM transaction_types WHERE balance_effect = 'DEPOSITO' AND is_active ORDER BY created_at LIMIT 1),
    NULL, 0, NULL, pg_temp.account(), false)
$$;

DO $$
DECLARE
  v_admin UUID := pg_temp.admin_id();
  v_a UUID; v_b UUID; v_c UUID;
  v_cargo_bank UUID; v_cargo_cash UUID; v_abono_cash UUID; v_abono_bank UUID; v_cargo_b UUID;
  v_legacy UUID; v_asset UUID; v_asset_bank UUID; v_devolucion UUID;
  v_op UUID; v_op2 UUID; v_linked UUID; v_linked2 UUID; v_settle UUID;
  v_cash NUMERIC;
  v_count BIGINT;
  v_history portfolio_record_changes;
  v_mov cash_movements;
BEGIN
  INSERT INTO clients (name, created_by) VALUES ('Cliente trazabilidad A', v_admin) RETURNING id INTO v_a;
  INSERT INTO clients (name, created_by) VALUES ('Cliente trazabilidad B', v_admin) RETURNING id INTO v_b;
  INSERT INTO clients (name, created_by) VALUES ('Cliente trazabilidad C', v_admin) RETURNING id INTO v_c;
  PERFORM apply_cash_movement('ENTRADA_MANUAL', 'IN', 100000, v_admin, 'Fondo de prueba', NULL, NULL, NULL, NULL, NULL, 'TEST:FONDO-TRAZA');
  -- Saldo bancario para los depósitos de Transaccionar (el saldo bancario no es efectivo).
  PERFORM adjust_bank_balance(pg_temp.account(), 500000, CURRENT_DATE, v_admin, 'Base de prueba', NULL);

  -- ===== 1. Crear una cuenta por cobrar sin entregar efectivo (banco): Caja no cambia =====
  v_cash := cash_balance();
  v_cargo_bank := pg_temp.ar(v_a, 'CARGO', 1000, 'BANCO');
  PERFORM pg_temp.expect('1 cargo por banco: Caja no cambia', cash_balance()::TEXT, v_cash::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('1 cargo por banco: sin movimiento en el Kardex', pg_temp.moves('ACCOUNT_RECEIVABLE', v_cargo_bank), '0');
  PERFORM pg_temp.expect('1 registro nuevo: medio y rastreo guardados',
    (SELECT payment_method || '/' || cash_tracked FROM accounts_receivable WHERE id = v_cargo_bank), 'BANCO/true');
  -- Un cargo en efectivo (gasto por cobrar) nunca hace entrar dinero: sale de Caja (regla vigente del cuadre).
  v_cargo_cash := pg_temp.ar(v_a, 'CARGO', 500, NULL);
  PERFORM pg_temp.expect('1 cargo en efectivo: sale de Caja, nunca entra', cash_balance()::TEXT, (v_cash - 500)::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('1 sin medio = efectivo',
    (SELECT payment_method FROM accounts_receivable WHERE id = v_cargo_cash), 'EFECTIVO');

  -- ===== 2. Abono en efectivo: Caja aumenta =====
  v_cash := cash_balance();
  v_abono_cash := pg_temp.ar(v_a, 'ABONO', 200, 'EFECTIVO');
  PERFORM pg_temp.expect('2 abono en efectivo: Caja +200', cash_balance()::TEXT, (v_cash + 200)::NUMERIC(14,2)::TEXT);

  -- ===== 3. Abono bancario: Caja no cambia =====
  v_cash := cash_balance();
  v_abono_bank := pg_temp.ar(v_a, 'ABONO', 300, 'BANCO');
  PERFORM pg_temp.expect('3 abono por banco: Caja no cambia', cash_balance()::TEXT, v_cash::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('3 medio inválido rechazado',
    pg_temp.err(format('SELECT register_account_receivable_movement(%L, %L, 1, CURRENT_DATE, NULL, %L, NULL, NULL, %L)',
      v_a, 'ABONO', v_admin, 'CHEQUE')), 'PORTFOLIO_INVALID_PAYMENT_METHOD');

  -- ===== 4. Eliminar una cuenta sin movimientos de efectivo: Caja no cambia =====
  v_cargo_b := pg_temp.ar(v_b, 'CARGO', 250, 'BANCO');
  v_cash := cash_balance();
  PERFORM pg_temp.expect('4 eliminar exige motivo', pg_temp.void('accounts_receivable', v_cargo_b, 'no'), 'PORTFOLIO_CHANGE_REASON_REQUIRED');
  PERFORM pg_temp.expect('4 eliminar cuenta por banco', pg_temp.void('accounts_receivable', v_cargo_b, 'Registrado al cliente equivocado'), 'OK');
  PERFORM pg_temp.expect('4 Caja no cambia', cash_balance()::TEXT, v_cash::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('4 sin movimientos en el Kardex', pg_temp.moves('ACCOUNT_RECEIVABLE', v_cargo_b), '0');
  SELECT * INTO v_history FROM portfolio_record_changes WHERE record_id = v_cargo_b;
  PERFORM pg_temp.expect('4 historial: anulado con motivo, usuario, sin efecto de caja',
    v_history.action || '/' || v_history.reason || '/' || (v_history.changed_by = v_admin) || '/' || v_history.cash_effect_before || '→' || v_history.cash_effect_after,
    'ANULADO/Registrado al cliente equivocado/true/0.00→0.00');
  -- Registro anterior al Control de Efectivo (nunca estuvo en el Kardex): eliminarlo no mueve Caja.
  ALTER TABLE accounts_receivable DISABLE TRIGGER trg_portfolio_before_insert;
  ALTER TABLE accounts_receivable DISABLE TRIGGER trg_cash_accounts_receivable_insert;
  INSERT INTO accounts_receivable (client_id, date, amount, description, movement_type, created_by)
  VALUES (v_b, CURRENT_DATE - 90, 400, 'Registro antiguo', 'CARGO', v_admin) RETURNING id INTO v_legacy;
  UPDATE accounts_receivable SET payment_method = NULL, cash_tracked = NULL WHERE id = v_legacy;
  ALTER TABLE accounts_receivable ENABLE TRIGGER trg_cash_accounts_receivable_insert;
  ALTER TABLE accounts_receivable ENABLE TRIGGER trg_portfolio_before_insert;
  v_cash := cash_balance();
  PERFORM pg_temp.expect('4 antiguo: cambiar monto con motivo', pg_temp.edit('accounts_receivable', v_legacy, 450, NULL, 'Monto mal digitado'), 'OK');
  PERFORM pg_temp.expect('4 antiguo: eliminar', pg_temp.void('accounts_receivable', v_legacy, 'Duplicado del sistema anterior'), 'OK');
  PERFORM pg_temp.expect('4 antiguo: Caja no cambia (su efectivo ya estaba en el saldo inicial)', cash_balance()::TEXT, v_cash::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('4 antiguo: historial marca que no está rastreado',
    (SELECT string_agg(action || ':' || cash_tracked, ',' ORDER BY changed_at, action DESC) FROM portfolio_record_changes WHERE record_id = v_legacy),
    'MODIFICADO:false,ANULADO:false');

  -- ===== 5. Eliminar un abono en efectivo: se revierte su movimiento, ligado al original =====
  v_cash := cash_balance();
  PERFORM pg_temp.expect('5 eliminar abono en efectivo', pg_temp.void('accounts_receivable', v_abono_cash, 'Abono registrado dos veces'), 'OK');
  PERFORM pg_temp.expect('5 Caja −200', cash_balance()::TEXT, (v_cash - 200)::NUMERIC(14,2)::TEXT);
  SELECT * INTO v_mov FROM cash_movements WHERE reference_id = v_abono_cash AND movement_type = 'ANULACION';
  PERFORM pg_temp.expect('5 reversa ligada al original, con motivo y usuario',
    v_mov.direction || '/' || v_mov.amount || '/' || v_mov.reason || '/' || (v_mov.created_by = v_admin) || '/' ||
    ((SELECT status FROM cash_movements WHERE id = v_mov.reversal_of_id) = 'ANULADO'),
    'OUT/200.00/Abono registrado dos veces/true/true');
  PERFORM pg_temp.expect('5 el original se conserva', pg_temp.moves('ACCOUNT_RECEIVABLE', v_abono_cash), '2');
  PERFORM pg_temp.expect('5 historial enlaza la reversa',
    (SELECT cash_movement_ids = ARRAY[v_mov.id] FROM portfolio_record_changes WHERE record_id = v_abono_cash)::TEXT, 'true');

  -- ===== 6. Modificar un abono en efectivo: reversa + nuevo movimiento, sin duplicados =====
  v_abono_cash := pg_temp.ar(v_a, 'ABONO', 150, 'EFECTIVO');
  v_cash := cash_balance();
  PERFORM pg_temp.expect('6 cambiar monto sin motivo rechazado', pg_temp.edit('accounts_receivable', v_abono_cash, 180, NULL, NULL), 'PORTFOLIO_CHANGE_REASON_REQUIRED');
  PERFORM pg_temp.expect('6 cambiar monto con motivo', pg_temp.edit('accounts_receivable', v_abono_cash, 180, NULL, 'El cliente entregó Q180'), 'OK');
  PERFORM pg_temp.expect('6 Caja +30 neto', cash_balance()::TEXT, (v_cash + 30)::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('6 Kardex del registro = nuevo monto', pg_temp.kardex_net('ACCOUNT_RECEIVABLE', v_abono_cash), '180.00');
  PERFORM pg_temp.expect('6 original + reversa + nuevo', pg_temp.moves('ACCOUNT_RECEIVABLE', v_abono_cash), '3');
  PERFORM pg_temp.expect('6 historial: antes → después y sus 2 movimientos',
    (SELECT (changes -> 'amount' ->> 'from') || '→' || (changes -> 'amount' ->> 'to') || '/' || cardinality(cash_movement_ids)
     FROM portfolio_record_changes WHERE record_id = v_abono_cash), '150.00→180.00/2');
  v_count := (SELECT count(*) FROM cash_movements);
  PERFORM pg_temp.expect('6 repetir el mismo cambio no duplica', pg_temp.edit('accounts_receivable', v_abono_cash, 180, NULL, 'El cliente entregó Q180'), 'OK');
  PERFORM pg_temp.expect('6 sin movimientos nuevos', (SELECT count(*) FROM cash_movements)::TEXT, v_count::TEXT);
  PERFORM pg_temp.expect('6 sin historial nuevo', (SELECT count(*) FROM portfolio_record_changes WHERE record_id = v_abono_cash)::TEXT, '1');
  -- Cambiar el medio: efectivo → banco solo revierte; banco → efectivo solo aplica.
  v_cash := cash_balance();
  PERFORM pg_temp.expect('6 efectivo → banco', pg_temp.edit('accounts_receivable', v_abono_cash, NULL, 'BANCO', 'Fue transferencia, no efectivo'), 'OK');
  PERFORM pg_temp.expect('6 efectivo → banco: Caja −180', cash_balance()::TEXT, (v_cash - 180)::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('6 banco → efectivo', pg_temp.edit('accounts_receivable', v_abono_cash, NULL, 'EFECTIVO', 'Sí fue en efectivo'), 'OK');
  PERFORM pg_temp.expect('6 banco → efectivo: Caja vuelve', cash_balance()::TEXT, v_cash::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('6 Kardex del registro coincide con su regla', pg_temp.kardex_net('ACCOUNT_RECEIVABLE', v_abono_cash), '180.00');

  -- ===== 7. Cambios administrativos: Caja no cambia, quedan en el historial =====
  v_cash := cash_balance();
  v_count := (SELECT count(*) FROM cash_movements);
  PERFORM pg_temp.expect('7 cambiar descripción sin motivo',
    pg_temp.edit('accounts_receivable', v_cargo_cash, NULL, NULL, NULL, 'Gasto de transporte del cliente'), 'OK');
  PERFORM pg_temp.expect('7 sin movimientos de caja', (SELECT count(*) FROM cash_movements)::TEXT, v_count::TEXT);
  PERFORM pg_temp.expect('7 historial guarda antes → después',
    (SELECT changes -> 'description' ->> 'to' FROM portfolio_record_changes WHERE record_id = v_cargo_cash), 'Gasto de transporte del cliente');
  PERFORM pg_temp.expect('7 mismo medio (efectivo) no cuenta como cambio',
    pg_temp.edit('accounts_receivable', v_cargo_cash, NULL, 'EFECTIVO', NULL), 'OK');
  PERFORM pg_temp.expect('7 Caja intacta', cash_balance()::TEXT, v_cash::NUMERIC(14,2)::TEXT);

  -- ===== Abonos múltiples / pagos: eliminar un cargo del que dependen abonos se rechaza =====
  -- Cliente A: cargos 1000 (banco) + 500 (efectivo), abonos 300 (banco) + 180 (efectivo) + 800 (banco) → saldo 220.
  PERFORM pg_temp.ar(v_a, 'ABONO', 800, 'BANCO');
  PERFORM pg_temp.expect('Rel cargo con abonos que dependen de él',
    pg_temp.void('accounts_receivable', v_cargo_bank, 'Cargo equivocado'), 'AR_BALANCE_WOULD_BE_NEGATIVE');
  PERFORM pg_temp.expect('Rel bajar el monto por debajo de lo abonado',
    pg_temp.edit('accounts_receivable', v_cargo_bank, 1, NULL, 'Monto corregido'), 'AR_BALANCE_WOULD_BE_NEGATIVE');
  PERFORM pg_temp.expect('Rel el cargo sigue vigente', (SELECT is_active FROM accounts_receivable WHERE id = v_cargo_bank)::TEXT, 'true');
  -- Pago parcial por Cartera: el cargo con pagos no se elimina ni baja de lo pagado.
  v_settle := settle_accounts_receivable(v_a, jsonb_build_array(jsonb_build_object('id', v_cargo_cash, 'amount', 100)),
    'EFECTIVO', NULL, NULL, NULL, 100, v_admin, 'T:TRAZA-PARCIAL');
  PERFORM pg_temp.expect('Rel cobro en efectivo de Cartera guarda su medio',
    (SELECT payment_method FROM accounts_receivable WHERE reference_id = v_settle), 'EFECTIVO');
  PERFORM pg_temp.expect('Rel cargo con pago parcial no se elimina',
    pg_temp.void('accounts_receivable', v_cargo_cash, 'Ya no aplica'), 'AR_CHARGE_HAS_PAYMENTS');
  PERFORM pg_temp.expect('Rel cargo con pago parcial: no baja de lo pagado',
    pg_temp.edit('accounts_receivable', v_cargo_cash, 50, NULL, 'Monto corregido'), 'AR_CHARGE_HAS_PAYMENTS');
  PERFORM pg_temp.expect('Rel cargo con pago parcial: sí baja por encima de lo pagado',
    pg_temp.edit('accounts_receivable', v_cargo_cash, 400, NULL, 'Se cobró menos transporte'), 'OK');
  PERFORM pg_temp.expect('Rel Kardex del cargo = −400', pg_temp.kardex_net('ACCOUNT_RECEIVABLE', v_cargo_cash), '-400.00');
  PERFORM pg_temp.expect('Rel el abono de Cartera no se cambia de medio',
    pg_temp.edit('accounts_receivable', (SELECT abono_id FROM account_receivable_payment_operations WHERE id = v_settle), NULL, 'BANCO', 'Cambio de medio'),
    'AR_PAYMENT_ROW_LOCKED');
  v_cash := cash_balance();
  PERFORM void_account_receivable_payment(v_settle, v_admin, 'Cobro duplicado');
  PERFORM pg_temp.expect('Rel anular cobro de Cartera revierte su efectivo', cash_balance()::TEXT, (v_cash - 100)::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('Rel anular cobro de Cartera queda en el historial con su motivo',
    (SELECT action || '/' || reason FROM portfolio_record_changes
     WHERE record_id = (SELECT abono_id FROM account_receivable_payment_operations WHERE id = v_settle)),
    'ANULADO/Cobro anulado: Cobro duplicado');
  -- Abono bancario eliminado: sin efecto de caja; el efectivo sí se revierte.
  v_cash := cash_balance();
  PERFORM pg_temp.expect('Rel eliminar abono bancario', pg_temp.void('accounts_receivable', v_abono_bank, 'Transferencia rebotada'), 'OK');
  PERFORM pg_temp.expect('Rel abono bancario: Caja no cambia', cash_balance()::TEXT, v_cash::NUMERIC(14,2)::TEXT);

  -- ===== 13. Una misma reversa no se ejecuta dos veces; lo anulado es historia =====
  v_count := (SELECT count(*) FROM cash_movements);
  PERFORM pg_temp.expect('13 eliminar dos veces', pg_temp.void('accounts_receivable', v_abono_bank, 'Otra vez'), 'PORTFOLIO_RECORD_ALREADY_VOIDED');
  PERFORM pg_temp.expect('13 un anulado no se edita', pg_temp.edit('accounts_receivable', v_abono_bank, 5, NULL, 'Corregir monto'), 'PORTFOLIO_RECORD_VOIDED');
  PERFORM pg_temp.expect('13 ni se reactiva directo',
    pg_temp.err(format('UPDATE accounts_receivable SET is_active = true WHERE id = %L', v_abono_bank)), 'PORTFOLIO_RECORD_VOIDED');
  PERFORM pg_temp.expect('13 sin movimientos nuevos', (SELECT count(*) FROM cash_movements)::TEXT, v_count::TEXT);
  PERFORM pg_temp.expect('13 historial inalterable',
    pg_temp.err(format('UPDATE portfolio_record_changes SET reason = %L WHERE record_id = %L', 'x', v_abono_bank)), 'PORTFOLIO_HISTORY_IMMUTABLE');
  PERFORM pg_temp.expect('13 historial no se borra',
    pg_temp.err(format('DELETE FROM portfolio_record_changes WHERE record_id = %L', v_abono_bank)), 'PORTFOLIO_HISTORY_IMMUTABLE');
  PERFORM pg_temp.expect('13 un UPDATE directo sin motivo también se rechaza',
    pg_temp.err(format('UPDATE accounts_receivable SET amount = 999 WHERE id = %L', v_cargo_cash)), 'PORTFOLIO_CHANGE_REASON_REQUIRED');

  -- ===== 8–11. Activos (regla vigente: el activo entra a Caja, su devolución sale) =====
  v_cash := cash_balance();
  v_asset := pg_temp.asset(v_c, 'CARGO', 700, 'EFECTIVO');
  PERFORM pg_temp.expect('8 activo en efectivo: Caja +700', cash_balance()::TEXT, (v_cash + 700)::NUMERIC(14,2)::TEXT);
  v_devolucion := pg_temp.asset(v_c, 'ABONO', 200, 'EFECTIVO');
  PERFORM pg_temp.expect('8 devolución en efectivo: Caja −200', cash_balance()::TEXT, (v_cash + 500)::NUMERIC(14,2)::TEXT);
  v_cash := cash_balance();
  v_asset_bank := pg_temp.asset(v_c, 'CARGO', 900, 'BANCO');
  PERFORM pg_temp.expect('9 activo por banco: Caja no cambia', cash_balance()::TEXT, v_cash::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('10 eliminar activo que movió Caja', pg_temp.void('assets', v_devolucion, 'Devolución no realizada'), 'OK');
  PERFORM pg_temp.expect('10 la reversa devuelve los Q200', cash_balance()::TEXT, (v_cash + 200)::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('10 reversa ligada', (SELECT count(*) FROM cash_movements
    WHERE reference_id = v_devolucion AND movement_type = 'ANULACION' AND reversal_of_id IS NOT NULL AND reason = 'Devolución no realizada')::TEXT, '1');
  v_cash := cash_balance();
  PERFORM pg_temp.expect('11 modificar activo', pg_temp.edit('assets', v_asset, 650, NULL, 'Se recibieron Q650'), 'OK');
  PERFORM pg_temp.expect('11 Caja −50 neto', cash_balance()::TEXT, (v_cash - 50)::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('11 Kardex del activo = 650', pg_temp.kardex_net('ASSET', v_asset), '650.00');
  PERFORM pg_temp.expect('11 activo por banco: cambiar monto no mueve Caja', pg_temp.edit('assets', v_asset_bank, 950, NULL, 'Monto corregido'), 'OK');
  PERFORM pg_temp.expect('11 Caja igual', cash_balance()::TEXT, (v_cash - 50)::NUMERIC(14,2)::TEXT);

  -- ===== Transaccionar: anular la operación anula también su cargo vinculado =====
  v_cash := cash_balance();
  v_op := pg_temp.deposit(300);
  v_linked := register_account_receivable_movement(v_b, 'CARGO', 300, CURRENT_DATE, 'Depósito a crédito', v_admin, 'BANK_DEPOSIT', v_op);
  PERFORM pg_temp.expect('TRX depósito + cargo vinculado: Caja neta igual', cash_balance()::TEXT, v_cash::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('TRX el cargo vinculado no se elimina aparte',
    pg_temp.void('accounts_receivable', v_linked, 'Lo pagó en efectivo'), 'PORTFOLIO_LINKED_TO_OPERATION');
  PERFORM pg_temp.expect('TRX ni cambia su monto',
    pg_temp.edit('accounts_receivable', v_linked, 100, NULL, 'Pagó una parte'), 'PORTFOLIO_LINKED_TO_OPERATION');
  PERFORM pg_temp.expect('TRX su descripción sí',
    pg_temp.edit('accounts_receivable', v_linked, NULL, NULL, NULL, 'Depósito a crédito (cliente B)'), 'OK');
  PERFORM void_bank_deposit_operation(v_op, CURRENT_DATE, v_admin, 'Depósito digitado por error');
  PERFORM pg_temp.expect('TRX anular la operación anula el cargo', (SELECT is_active FROM accounts_receivable WHERE id = v_linked)::TEXT, 'false');
  PERFORM pg_temp.expect('TRX Caja neta igual tras anular', cash_balance()::TEXT, v_cash::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('TRX Kardex del cargo = 0', pg_temp.kardex_net('ACCOUNT_RECEIVABLE', v_linked), '0.00');
  -- Operación anulada ANTES de esta migración (su cargo quedó vigente): el cargo se regulariza anulándolo con motivo.
  v_op := pg_temp.deposit(250);
  v_linked2 := register_account_receivable_movement(v_b, 'CARGO', 250, CURRENT_DATE, 'Depósito a crédito antiguo', v_admin, 'BANK_DEPOSIT', v_op);
  ALTER TABLE bank_deposit_operations DISABLE TRIGGER trg_portfolio_bank_deposit_void;
  PERFORM void_bank_deposit_operation(v_op, CURRENT_DATE, v_admin, 'Anulada sin cascada');
  ALTER TABLE bank_deposit_operations ENABLE TRIGGER trg_portfolio_bank_deposit_void;
  v_cash := cash_balance();
  PERFORM pg_temp.expect('TRX antiguo: su monto sigue bloqueado',
    pg_temp.edit('accounts_receivable', v_linked2, 100, NULL, 'Corregir monto'), 'PORTFOLIO_LINKED_TO_OPERATION');
  PERFORM pg_temp.expect('TRX antiguo: anular el cargo de una operación ya anulada',
    pg_temp.void('accounts_receivable', v_linked2, 'Regularización: la operación ya estaba anulada'), 'OK');
  PERFORM pg_temp.expect('TRX antiguo: Caja recupera la salida que quedó sin respaldo', cash_balance()::TEXT, (v_cash + 250)::NUMERIC(14,2)::TEXT);
  v_op := (SELECT reference_id FROM accounts_receivable WHERE id = v_linked);
  PERFORM pg_temp.expect('TRX historial con el motivo de la operación',
    (SELECT action || '/' || reason FROM portfolio_record_changes WHERE record_id = v_linked AND action = 'ANULADO'),
    'ANULADO/Operación de Transaccionar anulada: Depósito digitado por error');
  -- Con pagos aplicados, la anulación se rechaza completa (nada a medias).
  v_op2 := pg_temp.deposit(400);
  v_linked2 := register_account_receivable_movement(v_b, 'CARGO', 400, CURRENT_DATE, 'Depósito a crédito 2', v_admin, 'BANK_DEPOSIT', v_op2);
  PERFORM settle_accounts_receivable(v_b, jsonb_build_array(jsonb_build_object('id', v_linked2, 'amount', 150)),
    'EFECTIVO', NULL, NULL, NULL, 150, v_admin, 'T:TRAZA-TRX');
  v_cash := cash_balance();
  v_count := (SELECT count(*) FROM cash_movements);
  PERFORM pg_temp.expect('12 anular operación con cargo pagado: rechazada',
    pg_temp.err(format('SELECT void_bank_deposit_operation(%L, CURRENT_DATE, %L, %L)', v_op2, v_admin, 'Error')),
    'BANK_DEPOSIT_LINKED_CHARGE_HAS_PAYMENTS');
  PERFORM pg_temp.expect('12 la operación sigue vigente', (SELECT is_voided FROM bank_deposit_operations WHERE id = v_op2)::TEXT, 'false');
  PERFORM pg_temp.expect('12 sin movimientos parciales', (SELECT count(*) FROM cash_movements)::TEXT, v_count::TEXT);
  PERFORM pg_temp.expect('12 Caja intacta', cash_balance()::TEXT, v_cash::NUMERIC(14,2)::TEXT);
  PERFORM pg_temp.expect('12 cambio rechazado no deja historial',
    (SELECT count(*) FROM portfolio_record_changes WHERE record_id = v_linked2)::TEXT, '0');

  -- ===== 14–15. Una sola lógica: cada registro rastreado = su regla; el saldo = el Kardex =====
  PERFORM pg_temp.expect('14 todo registro nuevo de CxC: Kardex = regla',
    (SELECT count(*) FROM accounts_receivable r
     WHERE r.client_id IN (v_a, v_b, v_c) AND r.cash_tracked
       AND pg_temp.kardex_net('ACCOUNT_RECEIVABLE', r.id)::NUMERIC
           <> portfolio_row_cash_effect('accounts_receivable', r.movement_type, r.amount, r.is_active, r.payment_method, r.reference_type, r.reference_id))::TEXT,
    '0');
  PERFORM pg_temp.expect('14 todo activo nuevo: Kardex = regla',
    (SELECT count(*) FROM assets a
     WHERE a.client_id = v_c AND a.cash_tracked
       AND pg_temp.kardex_net('ASSET', a.id)::NUMERIC
           <> portfolio_row_cash_effect('assets', a.movement_type, a.amount, a.is_active, a.payment_method, a.reference_type, a.reference_id))::TEXT,
    '0');
  PERFORM pg_temp.expect('15 cadena del Kardex continua',
    (SELECT count(*) FROM (
       SELECT previous_balance, lag(new_balance) OVER (ORDER BY sequence) AS prior FROM cash_movements
     ) k WHERE prior IS NOT NULL AND prior <> previous_balance)::TEXT, '0');
  PERFORM pg_temp.expect('15 saldo físico = último saldo del Kardex',
    (cash_balance() = (SELECT new_balance FROM cash_movements ORDER BY sequence DESC LIMIT 1))::TEXT, 'true');
END $$;

ROLLBACK;
