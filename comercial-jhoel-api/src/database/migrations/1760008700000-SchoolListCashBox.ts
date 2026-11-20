import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Caja de Listas Escolares (owner request, 2026-11-19): an independent cash
 * box for the money collected by school lists, apart from Control de
 * Efectivo, Bodega, Guayacán and the agents' cuadre.
 *
 * One official ledger, `school_cash_movements` (Kardex): every row keeps its
 * balance before/after and the physical balance is ALWAYS its last
 * `balance_after` (`school_cash_balance()`), never a separate counter. Its
 * only writer is `school_cash_apply_movement` (advisory lock
 * `school_cash_box`, balance read under the lock, never negative,
 * idempotency key). Rows are never edited or deleted: a correction is a
 * REVERSION row and the original is marked REVERTIDO.
 *
 * Every list payment is routed automatically, in the SAME transaction, by an
 * AFTER INSERT trigger on `school_quotation_payments` (the existing payment,
 * void and cancel functions are not changed):
 *  - EFECTIVO → PAGO_EFECTIVO (IN): the cash enters the Caja de Listas.
 *  - TRANSFERENCIA / DEPOSITO → the selected bank account goes up
 *    (`apply_bank_account_movement`, type PAGO_LISTA_ESCOLAR) and a NONE row
 *    PAGO_TRANSFERENCIA / PAGO_DEPOSITO is recorded: that row IS the
 *    "dinero pendiente de trasladar" (pending = amount − applications).
 *  - TARJETA / OTRO → PAGO_OTRO_MEDIO (NONE): counted as collected, no cash,
 *    no bank movement (owner decision).
 *  - ANULACION (payment void) → reverses the bank movement (only while
 *    nothing was transferred) and the ledger row.
 *  - DEVOLUCION (cancel with refund) → cash OUT of the caja, or a bank OUT
 *    that first consumes this list's own pending receipts in that bank.
 * Payments registered before this migration have no ledger row and are
 * never touched (owner decision: the caja starts at deploy).
 *
 * "Transferir a Caja de Listas" (`register_school_cash_transfer`): bank −,
 * caja +, linked to the original payment(s) through
 * `school_cash_receipt_applications`. Partial transfers are allowed; a
 * receipt can never be transferred beyond its amount, nor the bank below 0.
 * It is an internal movement: collected money never grows with it.
 *
 * Also: authorized exits (salidas, with destination), authorized
 * adjustments, immutable cash counts (arqueos, never adjust anything), RBAC
 * in SQL (`school_list_assert_permission`), and the agents' cuadre stores
 * "Listas escolares por trasladar" apart (owner decision: it is subtracted
 * from the cuadre result so list money never moves the agents' cuadre).
 */

const PERMISSION_FROM = `ELSE ARRAY[]::TEXT[]`;
const PERMISSION_TO = `WHEN 'school_lists.cash.view'      THEN ARRAY['SUPER_ADMIN','ADMIN','SUPERVISOR_DE_TURNO']
          WHEN 'school_lists.cash.reports'   THEN ARRAY['SUPER_ADMIN','ADMIN','SUPERVISOR_DE_TURNO']
          WHEN 'school_lists.cash.count'     THEN ARRAY['SUPER_ADMIN','ADMIN','SUPERVISOR_DE_TURNO']
          WHEN 'school_lists.cash.transfer'  THEN ARRAY['SUPER_ADMIN','ADMIN']
          WHEN 'school_lists.cash.exit'      THEN ARRAY['SUPER_ADMIN','ADMIN']
          WHEN 'school_lists.cash.adjust'    THEN ARRAY['SUPER_ADMIN','ADMIN']
          WHEN 'school_lists.cash.authorize' THEN ARRAY['SUPER_ADMIN','ADMIN']
          ELSE ARRAY[]::TEXT[]`;

const DELETE_FROM = `IF btrim(COALESCE(p_confirmation, '')) IS DISTINCT FROM v_q.quotation_number THEN`;
const DELETE_TO = `IF EXISTS (SELECT 1 FROM school_cash_movements WHERE quotation_id = p_quotation_id) THEN
          RAISE EXCEPTION 'SCHOOL_DELETE_HAS_CASH:%', v_q.quotation_number;
        END IF;
        ${DELETE_FROM}`;

const PURGE_FROM = `LOCK TABLE school_quotations IN EXCLUSIVE MODE;`;
const PURGE_TO = `${PURGE_FROM}
        -- Money already in the Caja de Listas keeps its lists (financial audit trail).
        IF EXISTS (SELECT 1 FROM school_cash_movements WHERE quotation_id IS NOT NULL) THEN
          RAISE EXCEPTION 'SCHOOL_PURGE_HAS_CASH';
        END IF;`;

const CLOSE_SIGNATURE_FROM = `p_total_warehouse_cash numeric DEFAULT 0)`;
const CLOSE_SIGNATURE_TO = `p_total_warehouse_cash numeric DEFAULT 0, p_total_school_list_pending numeric DEFAULT 0)`;
const CLOSE_COLUMNS_FROM = `result, created_by, total_warehouse_cash)`;
const CLOSE_COLUMNS_TO = `result, created_by, total_warehouse_cash, total_school_list_pending)`;
const CLOSE_VALUES_FROM = `COALESCE(p_total_warehouse_cash, 0))`;
const CLOSE_VALUES_TO = `COALESCE(p_total_warehouse_cash, 0), COALESCE(p_total_school_list_pending, 0))`;

const BREAKDOWN_SIGNATURE_FROM = `p_source_cash_count_id uuid)`;
const BREAKDOWN_SIGNATURE_TO = `p_source_cash_count_id uuid, p_total_school_list_pending numeric DEFAULT 0)`;
const BREAKDOWN_CALL_FROM = `p_result, p_user_id, p_total_warehouse_cash
        );`;
const BREAKDOWN_CALL_TO = `p_result, p_user_id, p_total_warehouse_cash, p_total_school_list_pending
        );`;

const BANK_TYPES_BEFORE = [
  'DEPOSITO',
  'RETIRO',
  'DESEMBOLSO_GENESIS',
  'PAGO_GENESIS',
  'REINTEGRO',
  'TRANSFERENCIA_SALIDA',
  'TRANSFERENCIA_ENTRADA',
  'RETIRO_EFECTIVO',
  'AJUSTE_MANUAL',
  'SALDO_INICIAL',
  'ANULACION',
  'ACREDITACION_SALDO',
  'DEPOSITO_CAJA',
  'COBRO_CXC',
];
const BANK_TYPES_AFTER = [
  ...BANK_TYPES_BEFORE,
  'PAGO_LISTA_ESCOLAR',
  'TRASLADO_CAJA_LISTAS',
  'DEVOLUCION_LISTA_ESCOLAR',
  'DEPOSITO_CAJA_LISTAS',
];
const BANK_ORIGINS_BEFORE = [
  'TRANSACCIONAR',
  'TRANSFERENCIA',
  'AJUSTE_MANUAL',
  'SALDO_INICIAL',
  'ANULACION',
  'ACREDITACION_SALDO',
  'CONTROL_EFECTIVO',
  'CUENTAS_POR_COBRAR',
];
const BANK_ORIGINS_AFTER = [...BANK_ORIGINS_BEFORE, 'LISTAS_ESCOLARES'];

const sqlList = (values: string[]) => values.map((v) => `'${v}'`).join(', ');

async function liveDefinition(
  queryRunner: QueryRunner,
  fn: string,
): Promise<string> {
  const rows = (await queryRunner.query(
    `SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p
     WHERE p.proname = $1 AND p.pronamespace = 'public'::regnamespace`,
    [fn],
  )) as Array<{ def: string }>;
  if (rows.length !== 1) {
    throw new Error(`${fn}: expected exactly one definition`);
  }
  return rows[0].def;
}

function replaceOnce(
  def: string,
  fn: string,
  from: string,
  to: string,
): string {
  if (def.split(from).length !== 2) {
    throw new Error(`${fn}: anchor not found exactly once`);
  }
  return def.replace(from, to);
}

async function patchFunction(
  queryRunner: QueryRunner,
  fn: string,
  from: string,
  to: string,
): Promise<void> {
  const def = await liveDefinition(queryRunner, fn);
  await queryRunner.query(replaceOnce(def, fn, from, to));
}

export class SchoolListCashBox1760008700000 implements MigrationInterface {
  name = 'SchoolListCashBox1760008700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Bank ledger: new movement types and origin (rules unchanged) ───────
    await queryRunner.query(`
      ALTER TABLE bank_account_movements DROP CONSTRAINT "CHK_bank_account_movements_type";
      ALTER TABLE bank_account_movements ADD CONSTRAINT "CHK_bank_account_movements_type"
        CHECK (movement_type IN (${sqlList(BANK_TYPES_AFTER)}));
      ALTER TABLE bank_account_movements DROP CONSTRAINT "CHK_bank_account_movements_origin";
      ALTER TABLE bank_account_movements ADD CONSTRAINT "CHK_bank_account_movements_origin"
        CHECK (origin IN (${sqlList(BANK_ORIGINS_AFTER)}));
    `);

    await patchFunction(
      queryRunner,
      'school_list_assert_permission',
      PERMISSION_FROM,
      PERMISSION_TO,
    );

    // ── Tables ──────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE SEQUENCE school_cash_movement_seq;
      CREATE SEQUENCE school_cash_transfer_seq;
      CREATE SEQUENCE school_cash_exit_seq;
      CREATE SEQUENCE school_cash_count_seq;

      CREATE TABLE school_cash_transfers (
        id UUID PRIMARY KEY,
        transfer_number VARCHAR(20) NOT NULL UNIQUE,
        bank_id UUID NOT NULL REFERENCES banks(id) ON DELETE RESTRICT,
        amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
        business_date DATE NOT NULL,
        reference VARCHAR(100),
        observations VARCHAR(500),
        status VARCHAR(10) NOT NULL DEFAULT 'APLICADO' CHECK (status IN ('APLICADO','ANULADO')),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        voided_at TIMESTAMPTZ,
        voided_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        void_reason VARCHAR(500),
        idempotency_key VARCHAR(120) NOT NULL UNIQUE,
        CONSTRAINT "CHK_school_cash_transfers_void" CHECK (
          (status = 'APLICADO' AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
          OR (status = 'ANULADO' AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL))
      );
      CREATE INDEX "IDX_school_cash_transfers_created" ON school_cash_transfers (created_at);

      CREATE TABLE school_cash_exits (
        id UUID PRIMARY KEY,
        exit_number VARCHAR(20) NOT NULL UNIQUE,
        amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
        destination VARCHAR(30) NOT NULL
          CHECK (destination IN ('ENTREGA_ADMINISTRACION','DEPOSITO_BANCARIO','GASTO_AUTORIZADO','OTRO')),
        bank_id UUID REFERENCES banks(id) ON DELETE RESTRICT,
        recipient_name VARCHAR(120),
        reason VARCHAR(500) NOT NULL,
        reference VARCHAR(100),
        business_date DATE NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'APLICADO' CHECK (status IN ('APLICADO','ANULADO')),
        authorized_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        voided_at TIMESTAMPTZ,
        voided_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        void_reason VARCHAR(500),
        idempotency_key VARCHAR(120) NOT NULL UNIQUE,
        CONSTRAINT "CHK_school_cash_exits_bank" CHECK ((destination = 'DEPOSITO_BANCARIO') = (bank_id IS NOT NULL)),
        CONSTRAINT "CHK_school_cash_exits_void" CHECK (
          (status = 'APLICADO' AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
          OR (status = 'ANULADO' AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL))
      );
      CREATE INDEX "IDX_school_cash_exits_created" ON school_cash_exits (created_at);

      CREATE TABLE school_cash_movements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sequence BIGINT NOT NULL UNIQUE,
        movement_number VARCHAR(20) NOT NULL UNIQUE,
        movement_type VARCHAR(30) NOT NULL CHECK (movement_type IN (
          'PAGO_EFECTIVO','PAGO_DEPOSITO','PAGO_TRANSFERENCIA','PAGO_OTRO_MEDIO',
          'TRASLADO_BANCO','SALIDA','AJUSTE','DEVOLUCION','REVERSION')),
        direction VARCHAR(4) NOT NULL CHECK (direction IN ('IN','OUT','NONE')),
        amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
        balance_before NUMERIC(14,2) NOT NULL,
        balance_after NUMERIC(14,2) NOT NULL,
        payment_method VARCHAR(20),
        quotation_id UUID REFERENCES school_quotations(id) ON DELETE RESTRICT,
        payment_id UUID REFERENCES school_quotation_payments(id) ON DELETE RESTRICT,
        bank_id UUID REFERENCES banks(id) ON DELETE RESTRICT,
        bank_movement_id UUID REFERENCES bank_account_movements(id) ON DELETE RESTRICT,
        transfer_id UUID REFERENCES school_cash_transfers(id) ON DELETE RESTRICT,
        exit_id UUID REFERENCES school_cash_exits(id) ON DELETE RESTRICT,
        quotation_number VARCHAR(20),
        customer_name VARCHAR(150),
        receipt_number VARCHAR(20),
        description VARCHAR(255) NOT NULL,
        reference VARCHAR(100),
        observations VARCHAR(500),
        business_date DATE NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'APLICADO' CHECK (status IN ('APLICADO','REVERTIDO')),
        reversal_of_id UUID REFERENCES school_cash_movements(id) ON DELETE RESTRICT,
        reversed_at TIMESTAMPTZ,
        reversed_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        reverse_reason VARCHAR(500),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        idempotency_key VARCHAR(120) NOT NULL UNIQUE,
        CONSTRAINT "CHK_school_cash_movements_balance" CHECK (balance_after = balance_before
          + CASE direction WHEN 'IN' THEN amount WHEN 'OUT' THEN -amount ELSE 0 END),
        CONSTRAINT "CHK_school_cash_movements_non_negative" CHECK (balance_after >= 0),
        CONSTRAINT "CHK_school_cash_movements_reversal" CHECK ((movement_type = 'REVERSION') = (reversal_of_id IS NOT NULL)),
        CONSTRAINT "CHK_school_cash_movements_reversed" CHECK (
          (status = 'APLICADO' AND reversed_at IS NULL AND reversed_by IS NULL AND reverse_reason IS NULL)
          OR (status = 'REVERTIDO' AND reversed_at IS NOT NULL AND reversed_by IS NOT NULL AND reverse_reason IS NOT NULL)),
        CONSTRAINT "CHK_school_cash_movements_bank_receipt" CHECK (
          movement_type NOT IN ('PAGO_DEPOSITO','PAGO_TRANSFERENCIA') OR (bank_id IS NOT NULL AND bank_movement_id IS NOT NULL))
      );
      CREATE UNIQUE INDEX "UQ_school_cash_movements_payment" ON school_cash_movements (payment_id) WHERE payment_id IS NOT NULL;
      CREATE UNIQUE INDEX "UQ_school_cash_movements_reversal" ON school_cash_movements (reversal_of_id) WHERE reversal_of_id IS NOT NULL;
      CREATE INDEX "IDX_school_cash_movements_created" ON school_cash_movements (created_at);
      CREATE INDEX "IDX_school_cash_movements_quotation" ON school_cash_movements (quotation_id) WHERE quotation_id IS NOT NULL;
      CREATE INDEX "IDX_school_cash_movements_receipts" ON school_cash_movements (bank_id, sequence)
        WHERE movement_type IN ('PAGO_DEPOSITO','PAGO_TRANSFERENCIA');
      CREATE INDEX "IDX_school_cash_movements_transfer" ON school_cash_movements (transfer_id) WHERE transfer_id IS NOT NULL;
      CREATE INDEX "IDX_school_cash_movements_exit" ON school_cash_movements (exit_id) WHERE exit_id IS NOT NULL;

      -- Money of a bank receipt (PAGO_DEPOSITO / PAGO_TRANSFERENCIA row) that
      -- already left the "pending" pool: moved to the caja (TRASLADO) or
      -- refunded to the customer from that bank (DEVOLUCION).
      CREATE TABLE school_cash_receipt_applications (
        id BIGSERIAL PRIMARY KEY,
        receipt_movement_id UUID NOT NULL REFERENCES school_cash_movements(id) ON DELETE RESTRICT,
        kind VARCHAR(12) NOT NULL CHECK (kind IN ('TRASLADO','DEVOLUCION')),
        transfer_id UUID REFERENCES school_cash_transfers(id) ON DELETE RESTRICT,
        refund_movement_id UUID REFERENCES school_cash_movements(id) ON DELETE RESTRICT,
        amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_school_cash_applications_source" CHECK (
          (kind = 'TRASLADO' AND transfer_id IS NOT NULL AND refund_movement_id IS NULL)
          OR (kind = 'DEVOLUCION' AND refund_movement_id IS NOT NULL AND transfer_id IS NULL)),
        CONSTRAINT "UQ_school_cash_applications_transfer" UNIQUE (transfer_id, receipt_movement_id)
      );
      CREATE INDEX "IDX_school_cash_applications_receipt" ON school_cash_receipt_applications (receipt_movement_id);

      CREATE TABLE school_cash_counts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        count_number VARCHAR(20) NOT NULL UNIQUE,
        theoretical_balance NUMERIC(14,2) NOT NULL,
        counted_total NUMERIC(14,2) NOT NULL CHECK (counted_total >= 0),
        difference NUMERIC(14,2) NOT NULL,
        status VARCHAR(10) NOT NULL CHECK (status IN ('CUADRADO','FALTANTE','SOBRANTE')),
        last_movement_id UUID REFERENCES school_cash_movements(id) ON DELETE RESTRICT,
        observations VARCHAR(500),
        business_date DATE NOT NULL,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        idempotency_key VARCHAR(120) NOT NULL UNIQUE,
        CONSTRAINT "CHK_school_cash_counts_difference" CHECK (difference = counted_total - theoretical_balance)
      );
      CREATE INDEX "IDX_school_cash_counts_created" ON school_cash_counts (created_at);

      CREATE TABLE school_cash_count_details (
        count_id UUID NOT NULL REFERENCES school_cash_counts(id) ON DELETE RESTRICT,
        denomination NUMERIC(8,2) NOT NULL,
        quantity INT NOT NULL CHECK (quantity >= 0),
        subtotal NUMERIC(14,2) NOT NULL,
        PRIMARY KEY (count_id, denomination),
        CONSTRAINT "CHK_school_cash_count_details_subtotal" CHECK (subtotal = denomination * quantity)
      );

      ALTER TABLE agent_reconciliations
        ADD COLUMN total_school_list_pending NUMERIC(14,2) NOT NULL DEFAULT 0;
    `);

    // ── Guards: nothing financial is edited or deleted ──────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION school_cash_immutable_guard() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      BEGIN
        RAISE EXCEPTION 'SCHOOL_CASH_IMMUTABLE:%', TG_TABLE_NAME;
      END;
      $$;

      -- Ledger rows: only APLICADO → REVERTIDO with its audit fields.
      CREATE OR REPLACE FUNCTION school_cash_movement_guard() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      BEGIN
        IF TG_OP = 'DELETE' OR OLD.status <> 'APLICADO' OR NEW.status <> 'REVERTIDO'
           OR (to_jsonb(NEW) - ARRAY['status','reversed_at','reversed_by','reverse_reason'])
              <> (to_jsonb(OLD) - ARRAY['status','reversed_at','reversed_by','reverse_reason']) THEN
          RAISE EXCEPTION 'SCHOOL_CASH_IMMUTABLE:%', TG_TABLE_NAME;
        END IF;
        RETURN NEW;
      END;
      $$;

      -- Transfers and exits: only APLICADO → ANULADO with its audit fields.
      CREATE OR REPLACE FUNCTION school_cash_void_only_guard() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      BEGIN
        IF TG_OP = 'DELETE' OR OLD.status <> 'APLICADO' OR NEW.status <> 'ANULADO'
           OR (to_jsonb(NEW) - ARRAY['status','voided_at','voided_by','void_reason'])
              <> (to_jsonb(OLD) - ARRAY['status','voided_at','voided_by','void_reason']) THEN
          RAISE EXCEPTION 'SCHOOL_CASH_IMMUTABLE:%', TG_TABLE_NAME;
        END IF;
        RETURN NEW;
      END;
      $$;

      CREATE TRIGGER trg_school_cash_movements_guard BEFORE UPDATE OR DELETE ON school_cash_movements
        FOR EACH ROW EXECUTE FUNCTION school_cash_movement_guard();
      CREATE TRIGGER trg_school_cash_transfers_guard BEFORE UPDATE OR DELETE ON school_cash_transfers
        FOR EACH ROW EXECUTE FUNCTION school_cash_void_only_guard();
      CREATE TRIGGER trg_school_cash_exits_guard BEFORE UPDATE OR DELETE ON school_cash_exits
        FOR EACH ROW EXECUTE FUNCTION school_cash_void_only_guard();
      CREATE TRIGGER trg_school_cash_applications_guard BEFORE UPDATE OR DELETE ON school_cash_receipt_applications
        FOR EACH ROW EXECUTE FUNCTION school_cash_immutable_guard();
      CREATE TRIGGER trg_school_cash_counts_guard BEFORE UPDATE OR DELETE ON school_cash_counts
        FOR EACH ROW EXECUTE FUNCTION school_cash_immutable_guard();
      CREATE TRIGGER trg_school_cash_count_details_guard BEFORE UPDATE OR DELETE ON school_cash_count_details
        FOR EACH ROW EXECUTE FUNCTION school_cash_immutable_guard();
    `);

    // ── Readers ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION school_cash_today() RETURNS DATE
      LANGUAGE sql STABLE AS $$ SELECT (now() AT TIME ZONE 'America/Guatemala')::DATE $$;

      -- Physical balance of the Caja de Listas: the last row of the Kardex.
      CREATE OR REPLACE FUNCTION school_cash_balance() RETURNS NUMERIC
      LANGUAGE sql STABLE AS $$
        SELECT COALESCE((SELECT balance_after FROM school_cash_movements ORDER BY sequence DESC LIMIT 1), 0)::NUMERIC(14,2)
      $$;

      -- Bank receipts of list payments and how much of each is still in the bank.
      CREATE OR REPLACE VIEW school_cash_pending_receipts AS
      SELECT m.id, m.sequence, m.movement_number, m.movement_type, m.payment_method, m.amount,
             m.bank_id, m.bank_movement_id, m.quotation_id, m.payment_id, m.quotation_number,
             m.customer_name, m.receipt_number, m.reference, m.business_date, m.created_at,
             m.user_id, m.status,
             COALESCE(a.transferred, 0)::NUMERIC(14,2) AS transferred,
             COALESCE(a.refunded, 0)::NUMERIC(14,2) AS refunded,
             (CASE WHEN m.status = 'APLICADO'
                   THEN m.amount - COALESCE(a.transferred, 0) - COALESCE(a.refunded, 0)
                   ELSE 0 END)::NUMERIC(14,2) AS pending,
             CASE WHEN m.status <> 'APLICADO' THEN 'ANULADO'
                  WHEN m.amount - COALESCE(a.transferred, 0) - COALESCE(a.refunded, 0) = 0
                    THEN CASE WHEN COALESCE(a.transferred, 0) = 0 THEN 'DEVUELTO' ELSE 'TRASLADADO' END
                  WHEN COALESCE(a.transferred, 0) + COALESCE(a.refunded, 0) > 0 THEN 'TRASLADO_PARCIAL'
                  ELSE 'PENDIENTE' END AS transfer_status
        FROM school_cash_movements m
        LEFT JOIN LATERAL (
          SELECT SUM(x.amount) FILTER (WHERE x.kind = 'TRASLADO') AS transferred,
                 SUM(x.amount) FILTER (WHERE x.kind = 'DEVOLUCION') AS refunded
            FROM school_cash_receipt_applications x
            LEFT JOIN school_cash_transfers t ON t.id = x.transfer_id
           WHERE x.receipt_movement_id = m.id
             AND (x.kind = 'DEVOLUCION' OR t.status = 'APLICADO')
        ) a ON TRUE
       WHERE m.movement_type IN ('PAGO_DEPOSITO','PAGO_TRANSFERENCIA');

      -- List money still sitting in banks (subtracted by the agents' cuadre).
      CREATE OR REPLACE FUNCTION school_cash_pending_total() RETURNS NUMERIC
      LANGUAGE sql STABLE AS $$
        SELECT COALESCE(SUM(pending), 0)::NUMERIC(14,2) FROM school_cash_pending_receipts
      $$;

      -- Accounts that may receive list money: regular accounts only (no credit
      -- lines, no Districol, no Guayacán — they have their own rules).
      CREATE OR REPLACE FUNCTION school_cash_assert_bank(p_bank_id UUID) RETURNS VOID
      LANGUAGE plpgsql STABLE AS $$
      DECLARE
        v_bank RECORD;
      BEGIN
        SELECT is_active, special_account INTO v_bank FROM banks WHERE id = p_bank_id;
        IF NOT FOUND OR NOT v_bank.is_active THEN
          RAISE EXCEPTION 'SCHOOL_BANK_NOT_FOUND';
        END IF;
        IF v_bank.special_account IN ('GENESIS','BI_CLUB','DISTRICOL','GUAYACAN') THEN
          RAISE EXCEPTION 'SCHOOL_CASH_BANK_NOT_ALLOWED';
        END IF;
      END;
      $$;
    `);

    // ── The only writer of the Kardex ───────────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION school_cash_apply_movement(
        p_type TEXT, p_direction TEXT, p_amount NUMERIC, p_user_id UUID, p_key TEXT, p_description TEXT,
        p_payment_method TEXT DEFAULT NULL, p_quotation_id UUID DEFAULT NULL, p_payment_id UUID DEFAULT NULL,
        p_bank_id UUID DEFAULT NULL, p_bank_movement_id UUID DEFAULT NULL, p_reference TEXT DEFAULT NULL,
        p_observations TEXT DEFAULT NULL, p_transfer_id UUID DEFAULT NULL, p_exit_id UUID DEFAULT NULL,
        p_reversal_of_id UUID DEFAULT NULL
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_id UUID;
        v_before NUMERIC(14,2);
        v_after NUMERIC(14,2);
        v_seq BIGINT;
        v_number TEXT;
        v_customer TEXT;
        v_receipt TEXT;
      BEGIN
        IF p_amount IS NULL OR p_amount <= 0 OR p_amount <> round(p_amount, 2) OR p_amount > 9999999.99 THEN
          RAISE EXCEPTION 'SCHOOL_CASH_INVALID_AMOUNT';
        END IF;
        IF p_key IS NULL OR length(p_key) < 8 THEN
          RAISE EXCEPTION 'SCHOOL_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        SELECT id INTO v_id FROM school_cash_movements WHERE idempotency_key = p_key;
        IF FOUND THEN
          RETURN v_id;
        END IF;

        -- One writer at a time: the balance is read under this lock.
        PERFORM pg_advisory_xact_lock(hashtext('school_cash_box'));
        SELECT id INTO v_id FROM school_cash_movements WHERE idempotency_key = p_key;
        IF FOUND THEN
          RETURN v_id;
        END IF;

        v_before := school_cash_balance();
        v_after := v_before + CASE p_direction WHEN 'IN' THEN p_amount WHEN 'OUT' THEN -p_amount ELSE 0 END;
        IF v_after < 0 THEN
          RAISE EXCEPTION 'SCHOOL_CASH_INSUFFICIENT:%:%',
            to_char(v_before, 'FM9999999990.00'), to_char(p_amount, 'FM9999999990.00');
        END IF;

        IF p_quotation_id IS NOT NULL THEN
          SELECT quotation_number, customer_name INTO v_number, v_customer
            FROM school_quotations WHERE id = p_quotation_id;
        END IF;
        IF p_payment_id IS NOT NULL THEN
          SELECT receipt_number INTO v_receipt FROM school_quotation_payments WHERE id = p_payment_id;
        END IF;

        v_seq := nextval('school_cash_movement_seq');
        INSERT INTO school_cash_movements
          (sequence, movement_number, movement_type, direction, amount, balance_before, balance_after,
           payment_method, quotation_id, payment_id, bank_id, bank_movement_id, transfer_id, exit_id,
           quotation_number, customer_name, receipt_number, description, reference, observations,
           business_date, reversal_of_id, user_id, idempotency_key)
        VALUES (v_seq, 'MCL-' || lpad(v_seq::TEXT, 6, '0'), p_type, p_direction, p_amount, v_before, v_after,
                p_payment_method, p_quotation_id, p_payment_id, p_bank_id, p_bank_movement_id, p_transfer_id, p_exit_id,
                v_number, left(v_customer, 150), v_receipt, left(btrim(p_description), 255),
                NULLIF(left(btrim(COALESCE(p_reference, '')), 100), ''),
                NULLIF(left(btrim(COALESCE(p_observations, '')), 500), ''),
                school_cash_today(), p_reversal_of_id, p_user_id, p_key)
        RETURNING id INTO v_id;
        RETURN v_id;
      END;
      $$;

      -- Audited reversal: inverse row + original marked REVERTIDO.
      CREATE OR REPLACE FUNCTION school_cash_reverse_movement(
        p_movement_id UUID, p_user_id UUID, p_reason TEXT, p_key TEXT, p_payment_id UUID DEFAULT NULL
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_m school_cash_movements%ROWTYPE;
        v_id UUID;
      BEGIN
        SELECT id INTO v_id FROM school_cash_movements WHERE idempotency_key = p_key;
        IF FOUND THEN
          RETURN v_id;
        END IF;
        SELECT * INTO v_m FROM school_cash_movements WHERE id = p_movement_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_CASH_MOVEMENT_NOT_FOUND';
        END IF;
        IF v_m.movement_type = 'REVERSION' THEN
          RAISE EXCEPTION 'SCHOOL_CASH_NOT_REVERSIBLE';
        END IF;
        IF v_m.status <> 'APLICADO' THEN
          RAISE EXCEPTION 'SCHOOL_CASH_ALREADY_REVERSED';
        END IF;
        v_id := school_cash_apply_movement(
          'REVERSION',
          CASE v_m.direction WHEN 'IN' THEN 'OUT' WHEN 'OUT' THEN 'IN' ELSE 'NONE' END,
          v_m.amount, p_user_id, p_key,
          'Reversión de ' || v_m.movement_number || ' — ' || v_m.description,
          v_m.payment_method, v_m.quotation_id, p_payment_id, v_m.bank_id, NULL, v_m.reference,
          btrim(p_reason), v_m.transfer_id, v_m.exit_id, v_m.id);
        UPDATE school_cash_movements
           SET status = 'REVERTIDO', reversed_at = now(), reversed_by = p_user_id,
               reverse_reason = left(btrim(p_reason), 500)
         WHERE id = v_m.id;
        RETURN v_id;
      END;
      $$;
    `);

    // ── Automatic routing of every list payment ─────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION school_cash_on_payment() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      DECLARE
        v_q RECORD;
        v_date DATE := school_cash_today();
        v_label TEXT;
        v_bank_movement UUID;
        v_refund UUID;
        v_orig school_cash_movements%ROWTYPE;
        v_reason TEXT;
        v_left NUMERIC(14,2);
        v_take NUMERIC(14,2);
        v_r RECORD;
      BEGIN
        SELECT quotation_number, customer_name INTO v_q FROM school_quotations WHERE id = NEW.quotation_id;
        v_label := v_q.quotation_number || ' — ' || v_q.customer_name;

        IF NEW.kind IN ('ANTICIPO','ABONO') THEN
          IF NEW.payment_method = 'EFECTIVO' THEN
            PERFORM school_cash_apply_movement(
              'PAGO_EFECTIVO', 'IN', NEW.amount, NEW.received_by, 'PAY:' || NEW.id,
              CASE NEW.kind WHEN 'ANTICIPO' THEN 'Anticipo en efectivo ' ELSE 'Abono en efectivo ' END || v_label,
              NEW.payment_method, NEW.quotation_id, NEW.id, NULL, NULL, NEW.reference, NEW.observations);
          ELSIF NEW.payment_method IN ('TRANSFERENCIA','DEPOSITO') THEN
            IF NEW.bank_id IS NULL THEN
              RAISE EXCEPTION 'SCHOOL_CASH_BANK_REQUIRED';
            END IF;
            PERFORM school_cash_assert_bank(NEW.bank_id);
            v_bank_movement := apply_bank_account_movement(
              NEW.bank_id, 'PAGO_LISTA_ESCOLAR', 'LISTAS_ESCOLARES', NEW.amount, v_date, NEW.received_by,
              'SCHOOL_PAYMENT', NEW.id, left(COALESCE(NEW.reference, NEW.receipt_number), 100),
              left('Pago de lista escolar ' || v_label, 255), NEW.observations, NULL, NULL);
            PERFORM school_cash_apply_movement(
              CASE NEW.payment_method WHEN 'DEPOSITO' THEN 'PAGO_DEPOSITO' ELSE 'PAGO_TRANSFERENCIA' END,
              'NONE', NEW.amount, NEW.received_by, 'PAY:' || NEW.id,
              CASE NEW.payment_method WHEN 'DEPOSITO' THEN 'Pago por depósito ' ELSE 'Pago por transferencia ' END || v_label,
              NEW.payment_method, NEW.quotation_id, NEW.id, NEW.bank_id, v_bank_movement, NEW.reference, NEW.observations);
          ELSE
            PERFORM school_cash_apply_movement(
              'PAGO_OTRO_MEDIO', 'NONE', NEW.amount, NEW.received_by, 'PAY:' || NEW.id,
              CASE NEW.payment_method WHEN 'TARJETA' THEN 'Pago con tarjeta ' ELSE 'Pago por otro medio ' END || v_label,
              NEW.payment_method, NEW.quotation_id, NEW.id, NULL, NULL, NEW.reference, NEW.observations);
          END IF;

        ELSIF NEW.kind = 'ANULACION' THEN
          SELECT * INTO v_orig FROM school_cash_movements WHERE payment_id = NEW.reversal_of_id FOR UPDATE;
          IF NOT FOUND THEN
            -- Registered before the Caja de Listas existed: nothing to reverse here.
            RETURN NEW;
          END IF;
          v_reason := COALESCE(NULLIF(btrim(NEW.observations), ''), 'Anulación de pago');
          IF v_orig.movement_type IN ('PAGO_DEPOSITO','PAGO_TRANSFERENCIA') THEN
            IF EXISTS (SELECT 1 FROM school_cash_pending_receipts
                        WHERE id = v_orig.id AND transferred + refunded > 0) THEN
              RAISE EXCEPTION 'SCHOOL_CASH_PAYMENT_TRANSFERRED:%', v_orig.receipt_number;
            END IF;
            PERFORM reverse_bank_account_movements('SCHOOL_PAYMENT', NEW.reversal_of_id, v_date,
                                                   NEW.received_by, v_reason);
          END IF;
          PERFORM school_cash_reverse_movement(v_orig.id, NEW.received_by, v_reason, 'PAY:' || NEW.id, NEW.id);

        ELSIF NEW.kind = 'DEVOLUCION' THEN
          IF NEW.payment_method = 'EFECTIVO' THEN
            PERFORM school_cash_apply_movement(
              'DEVOLUCION', 'OUT', NEW.amount, NEW.received_by, 'PAY:' || NEW.id,
              'Devolución en efectivo ' || v_label,
              NEW.payment_method, NEW.quotation_id, NEW.id, NULL, NULL, NEW.reference, NEW.observations);
          ELSIF NEW.payment_method IN ('TRANSFERENCIA','DEPOSITO') THEN
            IF NEW.bank_id IS NULL THEN
              RAISE EXCEPTION 'SCHOOL_CASH_BANK_REQUIRED';
            END IF;
            PERFORM school_cash_assert_bank(NEW.bank_id);
            -- Lock order: receipts → bank → caja (same as a transfer).
            PERFORM 1 FROM school_cash_movements
              WHERE quotation_id = NEW.quotation_id AND bank_id = NEW.bank_id AND status = 'APLICADO'
                AND movement_type IN ('PAGO_DEPOSITO','PAGO_TRANSFERENCIA')
              ORDER BY id FOR UPDATE;
            v_bank_movement := apply_bank_account_movement(
              NEW.bank_id, 'DEVOLUCION_LISTA_ESCOLAR', 'LISTAS_ESCOLARES', -NEW.amount, v_date, NEW.received_by,
              'SCHOOL_PAYMENT', NEW.id, left(COALESCE(NEW.reference, NEW.receipt_number), 100),
              left('Devolución de lista escolar ' || v_label, 255), NEW.observations, NULL, NULL);
            v_refund := school_cash_apply_movement(
              'DEVOLUCION', 'NONE', NEW.amount, NEW.received_by, 'PAY:' || NEW.id,
              'Devolución por banco ' || v_label,
              NEW.payment_method, NEW.quotation_id, NEW.id, NEW.bank_id, v_bank_movement, NEW.reference,
              NEW.observations);
            -- The refund returns this customer's own money still pending in that bank first.
            v_left := NEW.amount;
            FOR v_r IN
              SELECT id, pending FROM school_cash_pending_receipts
               WHERE quotation_id = NEW.quotation_id AND bank_id = NEW.bank_id AND pending > 0
               ORDER BY sequence
            LOOP
              EXIT WHEN v_left <= 0;
              v_take := LEAST(v_left, v_r.pending);
              INSERT INTO school_cash_receipt_applications (receipt_movement_id, kind, refund_movement_id, amount)
              VALUES (v_r.id, 'DEVOLUCION', v_refund, v_take);
              v_left := v_left - v_take;
            END LOOP;
          ELSE
            PERFORM school_cash_apply_movement(
              'DEVOLUCION', 'NONE', NEW.amount, NEW.received_by, 'PAY:' || NEW.id,
              'Devolución por otro medio ' || v_label,
              NEW.payment_method, NEW.quotation_id, NEW.id, NULL, NULL, NEW.reference, NEW.observations);
          END IF;
        END IF;
        RETURN NEW;
      END;
      $$;

      CREATE TRIGGER trg_school_cash_on_payment AFTER INSERT ON school_quotation_payments
        FOR EACH ROW EXECUTE FUNCTION school_cash_on_payment();
    `);

    // ── Transfer bank → Caja de Listas ──────────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_school_cash_transfer(
        p_bank_id UUID, p_items JSONB, p_reference TEXT, p_observations TEXT, p_user_id UUID, p_key TEXT
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_id UUID;
        v_ids UUID[];
        v_item JSONB;
        v_amount NUMERIC;
        v_total NUMERIC(14,2) := 0;
        v_r RECORD;
        v_number TEXT;
        v_bank_name TEXT;
        v_bank_movement UUID;
        v_count INT;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.cash.transfer');
        IF p_key IS NULL OR length(p_key) < 8 THEN
          RAISE EXCEPTION 'SCHOOL_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        SELECT id INTO v_id FROM school_cash_transfers WHERE idempotency_key = p_key;
        IF FOUND THEN
          RETURN v_id;
        END IF;
        IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' THEN
          RAISE EXCEPTION 'SCHOOL_CASH_TRANSFER_EMPTY';
        END IF;
        v_count := jsonb_array_length(p_items);
        IF v_count = 0 OR v_count > 200 THEN
          RAISE EXCEPTION 'SCHOOL_CASH_TRANSFER_EMPTY';
        END IF;
        IF (SELECT count(DISTINCT e->>'movementId') FROM jsonb_array_elements(p_items) e) <> v_count THEN
          RAISE EXCEPTION 'SCHOOL_CASH_TRANSFER_DUPLICATE';
        END IF;
        IF length(COALESCE(p_reference, '')) > 100 OR length(COALESCE(p_observations, '')) > 500 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_TEXT';
        END IF;
        PERFORM school_cash_assert_bank(p_bank_id);

        -- Lock order: receipts (id order) → bank → caja.
        SELECT array_agg((e->>'movementId')::UUID ORDER BY (e->>'movementId')::UUID) INTO v_ids
          FROM jsonb_array_elements(p_items) e;
        PERFORM 1 FROM school_cash_movements WHERE id = ANY (v_ids) ORDER BY id FOR UPDATE;

        FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
          v_amount := (v_item->>'amount')::NUMERIC;
          IF v_amount IS NULL OR v_amount <= 0 OR v_amount <> round(v_amount, 2) THEN
            RAISE EXCEPTION 'SCHOOL_CASH_INVALID_AMOUNT';
          END IF;
          SELECT * INTO v_r FROM school_cash_pending_receipts WHERE id = (v_item->>'movementId')::UUID;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'SCHOOL_CASH_RECEIPT_NOT_FOUND';
          END IF;
          IF v_r.bank_id <> p_bank_id THEN
            RAISE EXCEPTION 'SCHOOL_CASH_TRANSFER_BANK_MISMATCH:%', COALESCE(v_r.receipt_number, v_r.movement_number);
          END IF;
          IF v_amount > v_r.pending THEN
            RAISE EXCEPTION 'SCHOOL_CASH_TRANSFER_EXCEEDS_PENDING:%:%',
              COALESCE(v_r.receipt_number, v_r.movement_number), to_char(v_r.pending, 'FM9999999990.00');
          END IF;
          v_total := v_total + v_amount;
        END LOOP;

        v_id := gen_random_uuid();
        v_number := 'TCL-' || lpad(nextval('school_cash_transfer_seq')::TEXT, 6, '0');
        SELECT name INTO v_bank_name FROM banks WHERE id = p_bank_id;
        INSERT INTO school_cash_transfers
          (id, transfer_number, bank_id, amount, business_date, reference, observations, user_id, idempotency_key)
        VALUES (v_id, v_number, p_bank_id, v_total, school_cash_today(),
                NULLIF(btrim(COALESCE(p_reference, '')), ''), NULLIF(btrim(COALESCE(p_observations, '')), ''),
                p_user_id, p_key);
        INSERT INTO school_cash_receipt_applications (receipt_movement_id, kind, transfer_id, amount)
        SELECT (e->>'movementId')::UUID, 'TRASLADO', v_id, (e->>'amount')::NUMERIC
          FROM jsonb_array_elements(p_items) e;

        -- Bank −total (INSUFFICIENT_BALANCE if the account does not have it).
        v_bank_movement := apply_bank_account_movement(
          p_bank_id, 'TRASLADO_CAJA_LISTAS', 'LISTAS_ESCOLARES', -v_total, school_cash_today(), p_user_id,
          'SCHOOL_CASH_TRANSFER', v_id, left(COALESCE(NULLIF(btrim(p_reference), ''), v_number), 100),
          'Traslado a Caja de Listas ' || v_number, p_observations, NULL, NULL);
        -- Caja +total: internal movement, never a new payment.
        PERFORM school_cash_apply_movement(
          'TRASLADO_BANCO', 'IN', v_total, p_user_id, 'TRF:' || v_id,
          'Traslado desde ' || v_bank_name || ' (' || v_number || ')',
          NULL, NULL, NULL, p_bank_id, v_bank_movement, p_reference, p_observations, v_id, NULL, NULL);
        RETURN v_id;
      END;
      $$;

      CREATE OR REPLACE FUNCTION void_school_cash_transfer(
        p_transfer_id UUID, p_reason TEXT, p_user_id UUID
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_t school_cash_transfers%ROWTYPE;
        v_movement UUID;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.cash.authorize');
        IF length(btrim(COALESCE(p_reason, ''))) < 5 OR length(p_reason) > 500 THEN
          RAISE EXCEPTION 'SCHOOL_REASON_REQUIRED';
        END IF;
        SELECT * INTO v_t FROM school_cash_transfers WHERE id = p_transfer_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_CASH_TRANSFER_NOT_FOUND';
        END IF;
        IF v_t.status <> 'APLICADO' THEN
          RAISE EXCEPTION 'SCHOOL_CASH_ALREADY_REVERSED';
        END IF;
        -- Lock order bank → caja (as every writer): bank + first, then caja −,
        -- which rolls everything back when the cash is no longer in the caja.
        PERFORM reverse_bank_account_movements('SCHOOL_CASH_TRANSFER', v_t.id, school_cash_today(),
                                               p_user_id, btrim(p_reason));
        SELECT id INTO v_movement FROM school_cash_movements
         WHERE transfer_id = v_t.id AND movement_type = 'TRASLADO_BANCO';
        PERFORM school_cash_reverse_movement(v_movement, p_user_id, p_reason, 'TRF-VOID:' || v_t.id);
        UPDATE school_cash_transfers
           SET status = 'ANULADO', voided_at = now(), voided_by = p_user_id, void_reason = btrim(p_reason)
         WHERE id = v_t.id;
        RETURN v_t.id;
      END;
      $$;
    `);

    // ── Exits, adjustments and cash counts ──────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_school_cash_exit(
        p_amount NUMERIC, p_destination TEXT, p_bank_id UUID, p_recipient TEXT, p_reason TEXT,
        p_reference TEXT, p_user_id UUID, p_key TEXT
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_id UUID;
        v_number TEXT;
        v_bank_name TEXT;
        v_bank_movement UUID;
        v_label TEXT;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.cash.exit');
        IF p_key IS NULL OR length(p_key) < 8 THEN
          RAISE EXCEPTION 'SCHOOL_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        SELECT id INTO v_id FROM school_cash_exits WHERE idempotency_key = p_key;
        IF FOUND THEN
          RETURN v_id;
        END IF;
        IF p_amount IS NULL OR p_amount <= 0 OR p_amount <> round(p_amount, 2) OR p_amount > 9999999.99 THEN
          RAISE EXCEPTION 'SCHOOL_CASH_INVALID_AMOUNT';
        END IF;
        IF p_destination IS NULL
           OR p_destination NOT IN ('ENTREGA_ADMINISTRACION','DEPOSITO_BANCARIO','GASTO_AUTORIZADO','OTRO') THEN
          RAISE EXCEPTION 'SCHOOL_CASH_INVALID_DESTINATION';
        END IF;
        IF length(btrim(COALESCE(p_reason, ''))) < 5 OR length(p_reason) > 500 THEN
          RAISE EXCEPTION 'SCHOOL_REASON_REQUIRED';
        END IF;
        IF length(COALESCE(p_recipient, '')) > 120 OR length(COALESCE(p_reference, '')) > 100 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_TEXT';
        END IF;
        IF (p_destination = 'DEPOSITO_BANCARIO') <> (p_bank_id IS NOT NULL) THEN
          RAISE EXCEPTION 'SCHOOL_CASH_BANK_REQUIRED';
        END IF;
        IF p_bank_id IS NOT NULL THEN
          PERFORM school_cash_assert_bank(p_bank_id);
          SELECT name INTO v_bank_name FROM banks WHERE id = p_bank_id;
        END IF;

        v_id := gen_random_uuid();
        v_number := 'SCL-' || lpad(nextval('school_cash_exit_seq')::TEXT, 6, '0');
        INSERT INTO school_cash_exits
          (id, exit_number, amount, destination, bank_id, recipient_name, reason, reference, business_date,
           authorized_by, idempotency_key)
        VALUES (v_id, v_number, p_amount, p_destination, p_bank_id,
                NULLIF(btrim(COALESCE(p_recipient, '')), ''), btrim(p_reason),
                NULLIF(btrim(COALESCE(p_reference, '')), ''), school_cash_today(), p_user_id, p_key);
        v_label := CASE p_destination
          WHEN 'ENTREGA_ADMINISTRACION' THEN 'Entrega a administración'
          WHEN 'DEPOSITO_BANCARIO' THEN 'Depósito a ' || v_bank_name
          WHEN 'GASTO_AUTORIZADO' THEN 'Gasto autorizado'
          ELSE 'Salida' END || ' (' || v_number || ')';
        -- Lock order: bank → caja.
        IF p_bank_id IS NOT NULL THEN
          v_bank_movement := apply_bank_account_movement(
            p_bank_id, 'DEPOSITO_CAJA_LISTAS', 'LISTAS_ESCOLARES', p_amount, school_cash_today(), p_user_id,
            'SCHOOL_CASH_EXIT', v_id, left(COALESCE(NULLIF(btrim(p_reference), ''), v_number), 100),
            'Depósito desde Caja de Listas ' || v_number, p_reason, NULL, NULL);
        END IF;
        PERFORM school_cash_apply_movement(
          'SALIDA', 'OUT', p_amount, p_user_id, 'EXIT:' || v_id, v_label,
          NULL, NULL, NULL, p_bank_id, v_bank_movement, p_reference, p_reason, NULL, v_id, NULL);
        RETURN v_id;
      END;
      $$;

      CREATE OR REPLACE FUNCTION void_school_cash_exit(p_exit_id UUID, p_reason TEXT, p_user_id UUID) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_e school_cash_exits%ROWTYPE;
        v_movement UUID;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.cash.authorize');
        IF length(btrim(COALESCE(p_reason, ''))) < 5 OR length(p_reason) > 500 THEN
          RAISE EXCEPTION 'SCHOOL_REASON_REQUIRED';
        END IF;
        SELECT * INTO v_e FROM school_cash_exits WHERE id = p_exit_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_CASH_EXIT_NOT_FOUND';
        END IF;
        IF v_e.status <> 'APLICADO' THEN
          RAISE EXCEPTION 'SCHOOL_CASH_ALREADY_REVERSED';
        END IF;
        -- Bank − (its own rules) → caja +.
        PERFORM reverse_bank_account_movements('SCHOOL_CASH_EXIT', v_e.id, school_cash_today(),
                                               p_user_id, btrim(p_reason));
        SELECT id INTO v_movement FROM school_cash_movements WHERE exit_id = v_e.id AND movement_type = 'SALIDA';
        PERFORM school_cash_reverse_movement(v_movement, p_user_id, p_reason, 'EXIT-VOID:' || v_e.id);
        UPDATE school_cash_exits
           SET status = 'ANULADO', voided_at = now(), voided_by = p_user_id, void_reason = btrim(p_reason)
         WHERE id = v_e.id;
        RETURN v_e.id;
      END;
      $$;

      CREATE OR REPLACE FUNCTION register_school_cash_adjustment(
        p_direction TEXT, p_amount NUMERIC, p_reason TEXT, p_user_id UUID, p_key TEXT
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.cash.adjust');
        IF p_direction IS NULL OR p_direction NOT IN ('IN','OUT') THEN
          RAISE EXCEPTION 'SCHOOL_CASH_INVALID_DIRECTION';
        END IF;
        IF length(btrim(COALESCE(p_reason, ''))) < 5 OR length(p_reason) > 500 THEN
          RAISE EXCEPTION 'SCHOOL_REASON_REQUIRED';
        END IF;
        RETURN school_cash_apply_movement(
          'AJUSTE', p_direction, p_amount, p_user_id, 'ADJ:' || COALESCE(p_key, ''),
          CASE p_direction WHEN 'IN' THEN 'Ajuste autorizado (entrada)' ELSE 'Ajuste autorizado (salida)' END,
          NULL, NULL, NULL, NULL, NULL, NULL, p_reason);
      END;
      $$;

      CREATE OR REPLACE FUNCTION void_school_cash_adjustment(
        p_movement_id UUID, p_reason TEXT, p_user_id UUID
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_type TEXT;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.cash.authorize');
        IF length(btrim(COALESCE(p_reason, ''))) < 5 OR length(p_reason) > 500 THEN
          RAISE EXCEPTION 'SCHOOL_REASON_REQUIRED';
        END IF;
        SELECT movement_type INTO v_type FROM school_cash_movements WHERE id = p_movement_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_CASH_MOVEMENT_NOT_FOUND';
        END IF;
        -- Payments are reversed from the list; transfers and exits from their own records.
        IF v_type <> 'AJUSTE' THEN
          RAISE EXCEPTION 'SCHOOL_CASH_NOT_REVERSIBLE';
        END IF;
        RETURN school_cash_reverse_movement(p_movement_id, p_user_id, p_reason, 'ADJ-VOID:' || p_movement_id);
      END;
      $$;

      -- Physical count: a photograph against the Kardex. Never adjusts anything.
      CREATE OR REPLACE FUNCTION register_school_cash_count(
        p_details JSONB, p_observations TEXT, p_user_id UUID, p_key TEXT
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_id UUID;
        v_theoretical NUMERIC(14,2);
        v_counted NUMERIC(14,2);
        v_last UUID;
        v_difference NUMERIC(14,2);
        v_count INT;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.cash.count');
        IF p_key IS NULL OR length(p_key) < 8 THEN
          RAISE EXCEPTION 'SCHOOL_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        SELECT id INTO v_id FROM school_cash_counts WHERE idempotency_key = p_key;
        IF FOUND THEN
          RETURN v_id;
        END IF;
        IF p_details IS NULL OR jsonb_typeof(p_details) <> 'array' THEN
          RAISE EXCEPTION 'SCHOOL_CASH_INVALID_COUNT';
        END IF;
        v_count := jsonb_array_length(p_details);
        IF v_count > 12
           OR (SELECT count(DISTINCT (e->>'denomination')::NUMERIC) FROM jsonb_array_elements(p_details) e) <> v_count
           OR EXISTS (SELECT 1 FROM jsonb_array_elements(p_details) e
                       WHERE NOT cash_valid_denomination((e->>'denomination')::NUMERIC)
                          OR (e->>'quantity')::NUMERIC IS NULL
                          OR (e->>'quantity')::NUMERIC < 0
                          OR (e->>'quantity')::NUMERIC > 100000
                          OR (e->>'quantity')::NUMERIC <> trunc((e->>'quantity')::NUMERIC)) THEN
          RAISE EXCEPTION 'SCHOOL_CASH_INVALID_COUNT';
        END IF;
        IF length(COALESCE(p_observations, '')) > 500 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_TEXT';
        END IF;

        PERFORM pg_advisory_xact_lock(hashtext('school_cash_box'));
        v_theoretical := school_cash_balance();
        SELECT id INTO v_last FROM school_cash_movements ORDER BY sequence DESC LIMIT 1;
        SELECT COALESCE(SUM((e->>'denomination')::NUMERIC * (e->>'quantity')::INT), 0)
          INTO v_counted FROM jsonb_array_elements(p_details) e;
        v_difference := v_counted - v_theoretical;

        INSERT INTO school_cash_counts
          (count_number, theoretical_balance, counted_total, difference, status, last_movement_id,
           observations, business_date, user_id, idempotency_key)
        VALUES ('ACL-' || lpad(nextval('school_cash_count_seq')::TEXT, 6, '0'), v_theoretical, v_counted,
                v_difference,
                CASE WHEN v_difference = 0 THEN 'CUADRADO' WHEN v_difference < 0 THEN 'FALTANTE' ELSE 'SOBRANTE' END,
                v_last, NULLIF(btrim(COALESCE(p_observations, '')), ''), school_cash_today(), p_user_id, p_key)
        RETURNING id INTO v_id;
        INSERT INTO school_cash_count_details (count_id, denomination, quantity, subtotal)
        SELECT v_id, (e->>'denomination')::NUMERIC, (e->>'quantity')::INT,
               (e->>'denomination')::NUMERIC * (e->>'quantity')::INT
          FROM jsonb_array_elements(p_details) e;
        RETURN v_id;
      END;
      $$;
    `);

    // ── Lists with money in the caja keep their audit trail ────────────────
    await patchFunction(
      queryRunner,
      'delete_school_quotation',
      DELETE_FROM,
      DELETE_TO,
    );
    await patchFunction(
      queryRunner,
      'purge_school_quotations',
      PURGE_FROM,
      PURGE_TO,
    );

    // ── Agents' cuadre: "Listas escolares por trasladar" stored apart ──────
    // Adding a parameter creates a new overload, so the old signature is
    // dropped first and the live body is re-created with the extra column.
    let closeDef = await liveDefinition(queryRunner, 'close_agent_day');
    closeDef = replaceOnce(
      closeDef,
      'close_agent_day',
      CLOSE_SIGNATURE_FROM,
      CLOSE_SIGNATURE_TO,
    );
    closeDef = replaceOnce(
      closeDef,
      'close_agent_day',
      CLOSE_COLUMNS_FROM,
      CLOSE_COLUMNS_TO,
    );
    closeDef = replaceOnce(
      closeDef,
      'close_agent_day',
      CLOSE_VALUES_FROM,
      CLOSE_VALUES_TO,
    );
    await queryRunner.query(
      `DROP FUNCTION close_agent_day(DATE, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, UUID, NUMERIC)`,
    );
    await queryRunner.query(closeDef);

    // Same extra (optional) parameter on the close with a cash breakdown.
    let breakdownDef = await liveDefinition(
      queryRunner,
      'close_agent_day_with_cash_breakdown',
    );
    breakdownDef = replaceOnce(
      breakdownDef,
      'close_agent_day_with_cash_breakdown',
      BREAKDOWN_SIGNATURE_FROM,
      BREAKDOWN_SIGNATURE_TO,
    );
    breakdownDef = replaceOnce(
      breakdownDef,
      'close_agent_day_with_cash_breakdown',
      BREAKDOWN_CALL_FROM,
      BREAKDOWN_CALL_TO,
    );
    await queryRunner.query(
      `DROP FUNCTION close_agent_day_with_cash_breakdown(DATE, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, UUID, NUMERIC, JSONB, VARCHAR, UUID)`,
    );
    await queryRunner.query(breakdownDef);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Money already recorded in the caja is never thrown away.
    const [{ count }] = (await queryRunner.query(
      `SELECT (SELECT count(*) FROM school_cash_movements)
            + (SELECT count(*) FROM school_cash_counts)
            + (SELECT count(*) FROM bank_account_movements WHERE origin = 'LISTAS_ESCOLARES')
            + (SELECT count(*) FROM agent_reconciliations WHERE total_school_list_pending <> 0) AS count`,
    )) as { count: string }[];
    if (Number(count) > 0) {
      throw new Error(
        'SchoolListCashBox: the Caja de Listas already has movements; it cannot be reverted.',
      );
    }

    let breakdownDef = await liveDefinition(
      queryRunner,
      'close_agent_day_with_cash_breakdown',
    );
    breakdownDef = replaceOnce(
      breakdownDef,
      'close_agent_day_with_cash_breakdown',
      BREAKDOWN_CALL_TO,
      BREAKDOWN_CALL_FROM,
    );
    breakdownDef = replaceOnce(
      breakdownDef,
      'close_agent_day_with_cash_breakdown',
      BREAKDOWN_SIGNATURE_TO,
      BREAKDOWN_SIGNATURE_FROM,
    );
    await queryRunner.query(
      `DROP FUNCTION close_agent_day_with_cash_breakdown(DATE, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, UUID, NUMERIC, JSONB, VARCHAR, UUID, NUMERIC)`,
    );
    await queryRunner.query(breakdownDef);

    let closeDef = await liveDefinition(queryRunner, 'close_agent_day');
    closeDef = replaceOnce(
      closeDef,
      'close_agent_day',
      CLOSE_VALUES_TO,
      CLOSE_VALUES_FROM,
    );
    closeDef = replaceOnce(
      closeDef,
      'close_agent_day',
      CLOSE_COLUMNS_TO,
      CLOSE_COLUMNS_FROM,
    );
    closeDef = replaceOnce(
      closeDef,
      'close_agent_day',
      CLOSE_SIGNATURE_TO,
      CLOSE_SIGNATURE_FROM,
    );
    await queryRunner.query(
      `DROP FUNCTION close_agent_day(DATE, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, UUID, NUMERIC, NUMERIC)`,
    );
    await queryRunner.query(closeDef);

    await patchFunction(
      queryRunner,
      'purge_school_quotations',
      PURGE_TO,
      PURGE_FROM,
    );
    await patchFunction(
      queryRunner,
      'delete_school_quotation',
      DELETE_TO,
      DELETE_FROM,
    );

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trg_school_cash_on_payment ON school_quotation_payments;
      DROP FUNCTION IF EXISTS school_cash_on_payment();
      DROP FUNCTION IF EXISTS register_school_cash_count(JSONB, TEXT, UUID, TEXT);
      DROP FUNCTION IF EXISTS void_school_cash_adjustment(UUID, TEXT, UUID);
      DROP FUNCTION IF EXISTS register_school_cash_adjustment(TEXT, NUMERIC, TEXT, UUID, TEXT);
      DROP FUNCTION IF EXISTS void_school_cash_exit(UUID, TEXT, UUID);
      DROP FUNCTION IF EXISTS register_school_cash_exit(NUMERIC, TEXT, UUID, TEXT, TEXT, TEXT, UUID, TEXT);
      DROP FUNCTION IF EXISTS void_school_cash_transfer(UUID, TEXT, UUID);
      DROP FUNCTION IF EXISTS register_school_cash_transfer(UUID, JSONB, TEXT, TEXT, UUID, TEXT);
      DROP FUNCTION IF EXISTS school_cash_reverse_movement(UUID, UUID, TEXT, TEXT, UUID);
      DROP FUNCTION IF EXISTS school_cash_apply_movement(TEXT, TEXT, NUMERIC, UUID, TEXT, TEXT, TEXT, UUID, UUID, UUID, UUID, TEXT, TEXT, UUID, UUID, UUID);
      DROP FUNCTION IF EXISTS school_cash_assert_bank(UUID);
      DROP FUNCTION IF EXISTS school_cash_pending_total();
      DROP VIEW IF EXISTS school_cash_pending_receipts;
      DROP FUNCTION IF EXISTS school_cash_balance();
      DROP FUNCTION IF EXISTS school_cash_today();
      DROP TABLE school_cash_count_details;
      DROP TABLE school_cash_counts;
      DROP TABLE school_cash_receipt_applications;
      DROP TABLE school_cash_movements;
      DROP TABLE school_cash_exits;
      DROP TABLE school_cash_transfers;
      DROP FUNCTION IF EXISTS school_cash_void_only_guard();
      DROP FUNCTION IF EXISTS school_cash_movement_guard();
      DROP FUNCTION IF EXISTS school_cash_immutable_guard();
      DROP SEQUENCE IF EXISTS school_cash_count_seq;
      DROP SEQUENCE IF EXISTS school_cash_exit_seq;
      DROP SEQUENCE IF EXISTS school_cash_transfer_seq;
      DROP SEQUENCE IF EXISTS school_cash_movement_seq;
      ALTER TABLE agent_reconciliations DROP COLUMN total_school_list_pending;
    `);
    await patchFunction(
      queryRunner,
      'school_list_assert_permission',
      PERMISSION_TO,
      PERMISSION_FROM,
    );
    await queryRunner.query(`
      ALTER TABLE bank_account_movements DROP CONSTRAINT "CHK_bank_account_movements_type";
      ALTER TABLE bank_account_movements ADD CONSTRAINT "CHK_bank_account_movements_type"
        CHECK (movement_type IN (${sqlList(BANK_TYPES_BEFORE)}));
      ALTER TABLE bank_account_movements DROP CONSTRAINT "CHK_bank_account_movements_origin";
      ALTER TABLE bank_account_movements ADD CONSTRAINT "CHK_bank_account_movements_origin"
        CHECK (origin IN (${sqlList(BANK_ORIGINS_BEFORE)}));
    `);
  }
}
