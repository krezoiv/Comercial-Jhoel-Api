import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Sistema → Administración financiera → Revisión de días operativos.
 *
 * An administrator opens a past operational day in REVIEW MODE (an audited
 * session), inspects every financial figure of that day, diagnoses
 * differences, corrects that day's data and closes the review.
 *
 * Absolute rule: a correction touches ONLY the reviewed day. That is why the
 * two kinds of data are corrected differently:
 *
 * 1. Day-owned snapshot rows (`bank_balances` of that date,
 *    `agent_reconciliations` of that date, the cash day / cut / count /
 *    bank-verification rows of that date) are corrected IN PLACE, and each
 *    change is versioned in `financial_day_snapshot_versions` (previous value
 *    kept) and audited in `financial_day_corrections`. Same-row derived
 *    fields (a reconciliation's `result`, a count's `difference`) are
 *    recalculated; rows of any other day — including the next day's opening
 *    and the second cut of the same day — are never touched.
 *
 * 2. Ledger movements (cash Kardex, bank ledger, Transaccionar operations,
 *    Cuentas por Cobrar, Activos) carry running balances that every later day
 *    builds on. They are NEVER edited: a correction is a
 *    `financial_day_adjustments` row linked to the original record, with its
 *    effects (cash / bank / receivables / assets) derived from the links the
 *    database already has. Adjustments only change the reviewed day's
 *    recalculated photograph; the live balances of today and the stored
 *    balances of other days stay exactly as they are.
 *
 * Isolation is enforced by PostgreSQL, not by the API: every write function
 * checks the target row's date against the session's date, and guard
 * triggers on all day/ledger tables (a) reject any write to a row of another
 * day while a review write is in progress (`app.financial_review_day`) and
 * (b) block normal writes to a day while it is under review.
 *
 * Audit tables are append-only (UPDATE/DELETE/TRUNCATE rejected). `down`
 * drops the functions and triggers only; tables and rows are kept.
 */
export class FinancialDayReview1760007100000 implements MigrationInterface {
  name = 'FinancialDayReview1760007100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Tables ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS financial_day_review_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        review_date DATE NOT NULL,
        status VARCHAR(25) NOT NULL DEFAULT 'OPEN',
        reason VARCHAR(500) NOT NULL,
        opened_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        close_requested_at TIMESTAMPTZ NULL,
        closed_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        closed_at TIMESTAMPTZ NULL,
        close_observations VARCHAR(500) NULL,
        corrections_count INTEGER NOT NULL DEFAULT 0,
        has_pending_differences BOOLEAN NULL,
        difference_before NUMERIC(14,2) NULL,
        difference_after NUMERIC(14,2) NULL,
        snapshot_before JSONB NULL,
        snapshot_after JSONB NULL,
        CONSTRAINT "CHK_fdr_sessions_status" CHECK (status IN ('OPEN','IN_REVIEW','PENDING_CONFIRMATION','CLOSED')),
        CONSTRAINT "CHK_fdr_sessions_reason" CHECK (length(btrim(reason)) >= 5),
        CONSTRAINT "CHK_fdr_sessions_closed" CHECK (
          (status = 'CLOSED') = (closed_at IS NOT NULL AND closed_by IS NOT NULL)
        )
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_fdr_sessions_active_date" ON financial_day_review_sessions (review_date) WHERE status <> 'CLOSED'`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_fdr_sessions_date" ON financial_day_review_sessions (review_date, opened_at DESC)`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS financial_day_corrections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID NOT NULL REFERENCES financial_day_review_sessions(id) ON DELETE RESTRICT,
        review_date DATE NOT NULL,
        module VARCHAR(25) NOT NULL,
        correction_type VARCHAR(25) NOT NULL,
        target_table VARCHAR(60) NOT NULL,
        target_id UUID NOT NULL,
        field VARCHAR(60) NOT NULL,
        original_value NUMERIC(14,2) NOT NULL,
        new_value NUMERIC(14,2) NOT NULL,
        difference NUMERIC(14,2) NOT NULL,
        reason VARCHAR(500) NOT NULL,
        observations VARCHAR(500) NULL,
        original_reference VARCHAR(255) NULL,
        client_request_id VARCHAR(80) NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_fdr_corrections_request" UNIQUE (client_request_id),
        CONSTRAINT "CHK_fdr_corrections_module" CHECK (module IN ('BANCOS','EFECTIVO','CORTES','CUENTAS_POR_COBRAR','ACTIVOS','TRANSACCIONES','CUADRE')),
        CONSTRAINT "CHK_fdr_corrections_type" CHECK (correction_type IN ('SNAPSHOT_VERSION','MOVEMENT_ADJUSTMENT')),
        CONSTRAINT "CHK_fdr_corrections_difference" CHECK (difference = new_value - original_value),
        CONSTRAINT "CHK_fdr_corrections_reason" CHECK (length(btrim(reason)) >= 5)
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_fdr_corrections_date" ON financial_day_corrections (review_date, created_at)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_fdr_corrections_session" ON financial_day_corrections (session_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_fdr_corrections_target" ON financial_day_corrections (target_table, target_id)`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS financial_day_snapshot_versions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        correction_id UUID NOT NULL REFERENCES financial_day_corrections(id) ON DELETE RESTRICT,
        session_id UUID NOT NULL REFERENCES financial_day_review_sessions(id) ON DELETE RESTRICT,
        review_date DATE NOT NULL,
        target_table VARCHAR(60) NOT NULL,
        target_id UUID NOT NULL,
        field VARCHAR(60) NOT NULL,
        version_number INTEGER NOT NULL,
        previous_value NUMERIC(14,2) NULL,
        value NUMERIC(14,2) NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_fdr_versions" UNIQUE (target_table, target_id, field, version_number)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS financial_day_adjustments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        correction_id UUID NOT NULL REFERENCES financial_day_corrections(id) ON DELETE RESTRICT,
        session_id UUID NOT NULL REFERENCES financial_day_review_sessions(id) ON DELETE RESTRICT,
        review_date DATE NOT NULL,
        module VARCHAR(25) NOT NULL,
        source_table VARCHAR(60) NOT NULL,
        source_id UUID NOT NULL,
        original_amount NUMERIC(14,2) NOT NULL,
        corrected_amount NUMERIC(14,2) NOT NULL,
        delta NUMERIC(14,2) NOT NULL,
        status VARCHAR(15) NOT NULL DEFAULT 'VIGENTE',
        replaced_by_id UUID NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_fdr_adjustments_correction" UNIQUE (correction_id),
        CONSTRAINT "FK_fdr_adjustments_replaced_by" FOREIGN KEY (replaced_by_id)
          REFERENCES financial_day_adjustments(id) DEFERRABLE INITIALLY DEFERRED,
        CONSTRAINT "CHK_fdr_adjustments_amount" CHECK (corrected_amount >= 0),
        CONSTRAINT "CHK_fdr_adjustments_delta" CHECK (delta = corrected_amount - original_amount),
        CONSTRAINT "CHK_fdr_adjustments_status" CHECK (status IN ('VIGENTE','REEMPLAZADO')),
        CONSTRAINT "CHK_fdr_adjustments_replaced" CHECK ((status = 'REEMPLAZADO') = (replaced_by_id IS NOT NULL))
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_fdr_adjustments_current" ON financial_day_adjustments (source_table, source_id) WHERE status = 'VIGENTE'`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_fdr_adjustments_date" ON financial_day_adjustments (review_date, status)`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS financial_day_adjustment_effects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        adjustment_id UUID NOT NULL REFERENCES financial_day_adjustments(id) ON DELETE RESTRICT,
        scope VARCHAR(10) NOT NULL,
        bank_id UUID NULL REFERENCES banks(id) ON DELETE RESTRICT,
        client_id UUID NULL REFERENCES clients(id) ON DELETE RESTRICT,
        amount NUMERIC(14,2) NOT NULL,
        CONSTRAINT "CHK_fdr_effects_scope" CHECK (scope IN ('CASH','BANK','AR','ASSET')),
        CONSTRAINT "CHK_fdr_effects_bank" CHECK ((scope = 'BANK') = (bank_id IS NOT NULL)),
        CONSTRAINT "CHK_fdr_effects_client" CHECK ((scope IN ('AR','ASSET')) = (client_id IS NOT NULL))
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_fdr_effects_adjustment" ON financial_day_adjustment_effects (adjustment_id)`,
    );

    // ── Append-only audit ─────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION financial_review_audit_immutable() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      BEGIN
        RAISE EXCEPTION 'FINANCIAL_REVIEW_AUDIT_IMMUTABLE:%', TG_TABLE_NAME;
      END;
      $$
    `);
    for (const table of [
      'financial_day_corrections',
      'financial_day_snapshot_versions',
      'financial_day_adjustment_effects',
    ]) {
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS trg_${table}_immutable ON ${table}`,
      );
      await queryRunner.query(
        `CREATE TRIGGER trg_${table}_immutable BEFORE UPDATE OR DELETE ON ${table} FOR EACH ROW EXECUTE FUNCTION financial_review_audit_immutable()`,
      );
    }
    for (const table of [
      'financial_day_review_sessions',
      'financial_day_corrections',
      'financial_day_snapshot_versions',
      'financial_day_adjustments',
      'financial_day_adjustment_effects',
    ]) {
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS trg_${table}_no_truncate ON ${table}`,
      );
      await queryRunner.query(
        `CREATE TRIGGER trg_${table}_no_truncate BEFORE TRUNCATE ON ${table} FOR EACH STATEMENT EXECUTE FUNCTION financial_review_audit_immutable()`,
      );
    }

    // Adjustments: never deleted; the only allowed change is VIGENTE → REEMPLAZADO.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION financial_review_adjustment_guard() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      BEGIN
        IF TG_OP = 'DELETE' THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_AUDIT_IMMUTABLE:%', TG_TABLE_NAME;
        END IF;
        IF OLD.status <> 'VIGENTE' OR NEW.status <> 'REEMPLAZADO'
           OR (to_jsonb(NEW) - 'status' - 'replaced_by_id') <> (to_jsonb(OLD) - 'status' - 'replaced_by_id') THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_AUDIT_IMMUTABLE:%', TG_TABLE_NAME;
        END IF;
        RETURN NEW;
      END;
      $$
    `);
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_financial_day_adjustments_guard ON financial_day_adjustments`,
    );
    await queryRunner.query(
      `CREATE TRIGGER trg_financial_day_adjustments_guard BEFORE UPDATE OR DELETE ON financial_day_adjustments FOR EACH ROW EXECUTE FUNCTION financial_review_adjustment_guard()`,
    );

    // Sessions: never deleted; frozen once CLOSED.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION financial_review_session_guard() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      BEGIN
        IF TG_OP = 'DELETE' OR OLD.status = 'CLOSED' THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_AUDIT_IMMUTABLE:%', TG_TABLE_NAME;
        END IF;
        IF NEW.review_date <> OLD.review_date OR NEW.opened_by <> OLD.opened_by
           OR NEW.opened_at <> OLD.opened_at OR NEW.reason <> OLD.reason THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_AUDIT_IMMUTABLE:%', TG_TABLE_NAME;
        END IF;
        RETURN NEW;
      END;
      $$
    `);
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_financial_day_review_sessions_guard ON financial_day_review_sessions`,
    );
    await queryRunner.query(
      `CREATE TRIGGER trg_financial_day_review_sessions_guard BEFORE UPDATE OR DELETE ON financial_day_review_sessions FOR EACH ROW EXECUTE FUNCTION financial_review_session_guard()`,
    );

    // ── Day isolation guard on every day / ledger table ──────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION financial_review_row_date(p_mode TEXT, p_row JSONB) RETURNS DATE
      LANGUAGE plpgsql STABLE AS $$
      DECLARE
        v_date DATE;
      BEGIN
        IF p_row IS NULL THEN
          RETURN NULL;
        END IF;
        IF p_mode = 'cut' THEN
          SELECT d.operational_date INTO v_date
          FROM cash_cut_periods p JOIN cash_operational_days d ON d.id = p.operational_day_id
          WHERE p.id = (p_row->>'cut_period_id')::uuid;
          RETURN v_date;
        ELSIF p_mode = 'day' THEN
          SELECT operational_date INTO v_date FROM cash_operational_days
          WHERE id = (p_row->>'operational_day_id')::uuid;
          RETURN v_date;
        END IF;
        RETURN (p_row->>p_mode)::date;
      END;
      $$
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION financial_review_day_guard() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      DECLARE
        v_flag TEXT := NULLIF(current_setting('app.financial_review_day', true), '');
        v_dates DATE[] := ARRAY[]::DATE[];
        v_date DATE;
      BEGIN
        IF TG_OP IN ('UPDATE', 'DELETE') THEN
          v_dates := v_dates || financial_review_row_date(TG_ARGV[0], to_jsonb(OLD));
        END IF;
        IF TG_OP IN ('INSERT', 'UPDATE') THEN
          v_dates := v_dates || financial_review_row_date(TG_ARGV[0], to_jsonb(NEW));
        END IF;

        FOREACH v_date IN ARRAY v_dates LOOP
          CONTINUE WHEN v_date IS NULL;
          IF v_flag IS NOT NULL THEN
            -- A review write: it may only touch rows of the reviewed day.
            IF v_date::text <> v_flag THEN
              RAISE EXCEPTION 'FINANCIAL_REVIEW_OUTSIDE_DAY:%', v_date;
            END IF;
          ELSIF EXISTS (
            SELECT 1 FROM financial_day_review_sessions
            WHERE review_date = v_date AND status <> 'CLOSED'
          ) THEN
            -- A normal write against a day that is under review.
            RAISE EXCEPTION 'FINANCIAL_REVIEW_DAY_LOCKED:%', v_date;
          END IF;
        END LOOP;

        IF TG_OP = 'DELETE' THEN
          RETURN OLD;
        END IF;
        RETURN NEW;
      END;
      $$
    `);
    for (const [table, mode] of GUARDED_TABLES) {
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS trg_financial_review_guard ON ${table}`,
      );
      await queryRunner.query(
        `CREATE TRIGGER trg_financial_review_guard BEFORE INSERT OR UPDATE OR DELETE ON ${table} FOR EACH ROW EXECUTE FUNCTION financial_review_day_guard('${mode}')`,
      );
    }

    // ── Helpers ──────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION financial_review_assert_role(p_user_id UUID, p_permission TEXT) RETURNS VOID
      LANGUAGE plpgsql STABLE AS $$
      DECLARE
        v_role TEXT;
      BEGIN
        SELECT r.name INTO v_role FROM users u JOIN roles r ON r.id = u.role_id WHERE u.id = p_user_id;
        -- financial_days.review → SUPER_ADMIN, ADMIN; financial_days.correct → SUPER_ADMIN.
        IF v_role IS NULL
           OR (p_permission = 'financial_days.correct' AND v_role <> 'SUPER_ADMIN')
           OR (p_permission = 'financial_days.review' AND v_role NOT IN ('SUPER_ADMIN', 'ADMIN')) THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_FORBIDDEN:%', p_permission;
        END IF;
      END;
      $$
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION financial_review_lock_session(p_session_id UUID, p_user_id UUID, p_owner_only BOOLEAN)
      RETURNS financial_day_review_sessions
      LANGUAGE plpgsql AS $$
      DECLARE
        v_session financial_day_review_sessions;
      BEGIN
        SELECT * INTO v_session FROM financial_day_review_sessions WHERE id = p_session_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_SESSION_NOT_FOUND:%', p_session_id;
        END IF;
        IF v_session.status = 'CLOSED' THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_SESSION_CLOSED:%', p_session_id;
        END IF;
        IF p_owner_only AND v_session.opened_by <> p_user_id THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_NOT_OWNER:%', p_session_id;
        END IF;
        RETURN v_session;
      END;
      $$
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION financial_review_validate_request(p_reason VARCHAR, p_request_id VARCHAR) RETURNS VOID
      LANGUAGE plpgsql IMMUTABLE AS $$
      BEGIN
        IF p_reason IS NULL OR length(btrim(p_reason)) < 5 THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_REASON_REQUIRED';
        END IF;
        IF p_request_id IS NULL OR length(btrim(p_request_id)) < 8 THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_REQUEST_ID_REQUIRED';
        END IF;
      END;
      $$
    `);
    // Returns the correction already stored for this request (retry), or NULL.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION financial_review_existing_request(p_request_id VARCHAR, p_session_id UUID) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_existing RECORD;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('financial_review_request:' || p_request_id));
        SELECT id, session_id INTO v_existing FROM financial_day_corrections WHERE client_request_id = p_request_id;
        IF NOT FOUND THEN
          RETURN NULL;
        END IF;
        IF v_existing.session_id <> p_session_id THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_IDEMPOTENCY_CONFLICT:%', p_request_id;
        END IF;
        RETURN v_existing.id;
      END;
      $$
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION financial_review_record_version(
        p_correction_id UUID, p_session financial_day_review_sessions, p_table TEXT, p_target_id UUID,
        p_field TEXT, p_previous NUMERIC, p_value NUMERIC, p_user_id UUID
      ) RETURNS VOID
      LANGUAGE plpgsql AS $$
      BEGIN
        INSERT INTO financial_day_snapshot_versions (
          correction_id, session_id, review_date, target_table, target_id, field,
          version_number, previous_value, value, created_by
        )
        SELECT p_correction_id, p_session.id, p_session.review_date, p_table, p_target_id, p_field,
               COALESCE(max(version_number), 0) + 1, p_previous, p_value, p_user_id
        FROM financial_day_snapshot_versions
        WHERE target_table = p_table AND target_id = p_target_id AND field = p_field;
      END;
      $$
    `);

    // ── Open a review session ─────────────────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION open_financial_day_review(p_date DATE, p_user_id UUID, p_reason VARCHAR)
      RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_today DATE := (now() AT TIME ZONE 'America/Guatemala')::date;
        v_existing RECORD;
        v_id UUID;
      BEGIN
        PERFORM financial_review_assert_role(p_user_id, 'financial_days.correct');
        IF p_reason IS NULL OR length(btrim(p_reason)) < 5 THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_REASON_REQUIRED';
        END IF;
        IF p_date IS NULL OR p_date >= v_today THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_DATE_NOT_HISTORICAL:%', p_date;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM day_openings WHERE date = p_date)
           AND NOT EXISTS (SELECT 1 FROM cash_operational_days WHERE operational_date = p_date)
           AND NOT EXISTS (SELECT 1 FROM bank_balances WHERE operation_date = p_date)
           AND NOT EXISTS (SELECT 1 FROM agent_reconciliations WHERE date = p_date) THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_DAY_NOT_FOUND:%', p_date;
        END IF;
        -- A day still running normally must be closed by its own flow first.
        IF EXISTS (SELECT 1 FROM day_openings WHERE date = p_date AND closed_at IS NULL AND NOT is_cancelled)
           OR EXISTS (SELECT 1 FROM cash_operational_days WHERE operational_date = p_date AND status <> 'CERRADO') THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_DAY_STILL_OPEN:%', p_date;
        END IF;

        PERFORM pg_advisory_xact_lock(hashtext('financial_day_review:' || p_date::text));
        SELECT s.id, u.username, s.opened_at INTO v_existing
        FROM financial_day_review_sessions s JOIN users u ON u.id = s.opened_by
        WHERE s.review_date = p_date AND s.status <> 'CLOSED';
        IF FOUND THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_ALREADY_OPEN:%|%', v_existing.username,
            to_char(v_existing.opened_at AT TIME ZONE 'America/Guatemala', 'DD/MM/YYYY HH24:MI');
        END IF;

        INSERT INTO financial_day_review_sessions (review_date, reason, opened_by)
        VALUES (p_date, btrim(p_reason), p_user_id)
        RETURNING id INTO v_id;
        RETURN v_id;
      END;
      $$
    `);

    // ── Correct a day-owned snapshot value (versioned, in place) ─────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION correct_financial_day_snapshot(
        p_session_id UUID, p_target VARCHAR, p_target_id UUID, p_field VARCHAR, p_new_value NUMERIC,
        p_reason VARCHAR, p_observations VARCHAR, p_user_id UUID, p_request_id VARCHAR
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_session financial_day_review_sessions;
        v_existing UUID;
        v_correction_id UUID := gen_random_uuid();
        v_table TEXT;
        v_module TEXT;
        v_row_date DATE;
        v_original NUMERIC(14,2);
        v_reference TEXT;
        v_row RECORD;
        v_rows INTEGER;
        v_new_result NUMERIC(14,2);
        v_new_difference NUMERIC(14,2);
        v_is_final_cut BOOLEAN;
      BEGIN
        PERFORM financial_review_assert_role(p_user_id, 'financial_days.correct');
        PERFORM financial_review_validate_request(p_reason, p_request_id);
        v_existing := financial_review_existing_request(p_request_id, p_session_id);
        IF v_existing IS NOT NULL THEN
          RETURN v_existing;
        END IF;
        v_session := financial_review_lock_session(p_session_id, p_user_id, true);
        IF p_new_value IS NULL OR abs(p_new_value) >= 1000000000000 THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_INVALID_VALUE';
        END IF;

        IF p_target = 'BANK_BALANCE' THEN
          IF p_field NOT IN ('previous_balance', 'final_balance') THEN
            RAISE EXCEPTION 'FINANCIAL_REVIEW_INVALID_FIELD:%', p_field;
          END IF;
          SELECT bb.operation_date, bb.previous_balance, bb.final_balance, b.name, b.special_account
          INTO v_row FROM bank_balances bb JOIN banks b ON b.id = bb.bank_id
          WHERE bb.id = p_target_id FOR UPDATE OF bb;
          IF NOT FOUND THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_TARGET_NOT_FOUND:%', p_target_id; END IF;
          v_table := 'bank_balances'; v_module := 'BANCOS'; v_row_date := v_row.operation_date;
          v_original := CASE p_field WHEN 'previous_balance' THEN v_row.previous_balance ELSE v_row.final_balance END;
          v_reference := 'Saldo del día — ' || v_row.name;
          IF p_new_value < 0 AND COALESCE(v_row.special_account, '') NOT IN ('GENESIS', 'BI_CLUB') THEN
            RAISE EXCEPTION 'FINANCIAL_REVIEW_INVALID_VALUE';
          END IF;
          IF abs(p_new_value) >= 10000000000 THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_INVALID_VALUE'; END IF;

        ELSIF p_target = 'AGENT_RECONCILIATION' THEN
          IF p_field NOT IN ('total_cash', 'total_banks', 'total_assets', 'total_accounts_receivable') THEN
            RAISE EXCEPTION 'FINANCIAL_REVIEW_INVALID_FIELD:%', p_field;
          END IF;
          SELECT * INTO v_row FROM agent_reconciliations WHERE id = p_target_id FOR UPDATE;
          IF NOT FOUND THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_TARGET_NOT_FOUND:%', p_target_id; END IF;
          v_table := 'agent_reconciliations'; v_module := 'CUADRE'; v_row_date := v_row.date;
          v_original := (to_jsonb(v_row)->>p_field)::numeric;
          v_reference := 'Cuadre de Agentes del día';

        ELSIF p_target = 'CASH_DAY' THEN
          IF p_field NOT IN ('opening_physical_cash', 'closing_physical_cash') THEN
            RAISE EXCEPTION 'FINANCIAL_REVIEW_INVALID_FIELD:%', p_field;
          END IF;
          SELECT * INTO v_row FROM cash_operational_days WHERE id = p_target_id FOR UPDATE;
          IF NOT FOUND THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_TARGET_NOT_FOUND:%', p_target_id; END IF;
          v_table := 'cash_operational_days'; v_module := 'EFECTIVO'; v_row_date := v_row.operational_date;
          v_original := (to_jsonb(v_row)->>p_field)::numeric;
          v_reference := 'Día operativo de efectivo';
          IF v_original IS NULL THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_TARGET_NOT_CORRECTABLE:%', p_field; END IF;

        ELSIF p_target = 'CASH_CUT_PERIOD' THEN
          IF p_field NOT IN ('opening_physical_cash') THEN
            RAISE EXCEPTION 'FINANCIAL_REVIEW_INVALID_FIELD:%', p_field;
          END IF;
          SELECT p.*, d.operational_date INTO v_row
          FROM cash_cut_periods p JOIN cash_operational_days d ON d.id = p.operational_day_id
          WHERE p.id = p_target_id FOR UPDATE OF p;
          IF NOT FOUND THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_TARGET_NOT_FOUND:%', p_target_id; END IF;
          v_table := 'cash_cut_periods'; v_module := 'CORTES'; v_row_date := v_row.operational_date;
          v_original := v_row.opening_physical_cash;
          v_reference := 'Corte ' || v_row.period_number;
          IF v_original IS NULL THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_TARGET_NOT_CORRECTABLE:%', p_field; END IF;

        ELSIF p_target = 'CASH_CUT_COUNT' THEN
          IF p_field NOT IN ('total_counted') THEN
            RAISE EXCEPTION 'FINANCIAL_REVIEW_INVALID_FIELD:%', p_field;
          END IF;
          SELECT c.*, p.period_number, p.status AS cut_status, p.closing_sequence, p.id AS cut_id,
                 d.id AS day_id, d.operational_date, d.status AS day_status, d.closing_sequence AS day_closing_sequence
          INTO v_row
          FROM cash_cut_counts c
          JOIN cash_cut_periods p ON p.id = c.cut_period_id
          JOIN cash_operational_days d ON d.id = p.operational_day_id
          WHERE c.id = p_target_id FOR UPDATE OF c, p;
          IF NOT FOUND THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_TARGET_NOT_FOUND:%', p_target_id; END IF;
          IF NOT v_row.is_current THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_TARGET_NOT_CORRECTABLE:%', p_target_id; END IF;
          v_table := 'cash_cut_counts'; v_module := 'CORTES'; v_row_date := v_row.operational_date;
          v_original := v_row.total_counted;
          v_reference := 'Arqueo del corte ' || v_row.period_number;
          IF p_new_value < 0 THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_INVALID_VALUE'; END IF;

        ELSIF p_target = 'CASH_BANK_RECONCILIATION' THEN
          IF p_field NOT IN ('verified_balance') THEN
            RAISE EXCEPTION 'FINANCIAL_REVIEW_INVALID_FIELD:%', p_field;
          END IF;
          SELECT r.*, p.period_number, d.operational_date INTO v_row
          FROM cash_cut_bank_reconciliations r
          JOIN cash_cut_periods p ON p.id = r.cut_period_id
          JOIN cash_operational_days d ON d.id = p.operational_day_id
          WHERE r.id = p_target_id FOR UPDATE OF r;
          IF NOT FOUND THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_TARGET_NOT_FOUND:%', p_target_id; END IF;
          v_table := 'cash_cut_bank_reconciliations'; v_module := 'CORTES'; v_row_date := v_row.operational_date;
          v_original := v_row.verified_balance;
          v_reference := 'Conciliación corte ' || v_row.period_number || ' — ' || v_row.bank_name;
        ELSE
          RAISE EXCEPTION 'FINANCIAL_REVIEW_INVALID_TARGET:%', p_target;
        END IF;

        -- Isolation: the record must belong to the reviewed day.
        IF v_row_date IS DISTINCT FROM v_session.review_date THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_OUTSIDE_DAY:%', v_row_date;
        END IF;
        IF v_original = p_new_value THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_NO_CHANGE';
        END IF;

        INSERT INTO financial_day_corrections (
          id, session_id, review_date, module, correction_type, target_table, target_id, field,
          original_value, new_value, difference, reason, observations, original_reference,
          client_request_id, created_by
        ) VALUES (
          v_correction_id, v_session.id, v_session.review_date, v_module, 'SNAPSHOT_VERSION', v_table, p_target_id, p_field,
          v_original, p_new_value, p_new_value - v_original, btrim(p_reason), NULLIF(btrim(p_observations), ''),
          left(v_reference, 255), btrim(p_request_id), p_user_id
        );
        PERFORM financial_review_record_version(v_correction_id, v_session, v_table, p_target_id, p_field, v_original, p_new_value, p_user_id);

        -- The write itself, flagged so the guard triggers only accept rows of this day.
        PERFORM set_config('app.financial_review_day', v_session.review_date::text, true);

        IF p_target = 'BANK_BALANCE' THEN
          EXECUTE format('UPDATE bank_balances SET %I = $1, updated_at = now() WHERE id = $2 AND operation_date = $3', p_field)
            USING p_new_value, p_target_id, v_session.review_date;
          GET DIAGNOSTICS v_rows = ROW_COUNT;

        ELSIF p_target = 'AGENT_RECONCILIATION' THEN
          EXECUTE format(
            'UPDATE agent_reconciliations SET %I = $1 WHERE id = $2 AND date = $3 '
            'RETURNING total_cash + total_banks + total_accounts_receivable - total_assets', p_field)
            INTO v_new_result USING p_new_value, p_target_id, v_session.review_date;
          GET DIAGNOSTICS v_rows = ROW_COUNT;
          -- Same-row derived value: result = efectivo + bancos + CxC − activos.
          IF v_new_result IS DISTINCT FROM v_row.result THEN
            UPDATE agent_reconciliations SET result = v_new_result WHERE id = p_target_id AND date = v_session.review_date;
            PERFORM financial_review_record_version(v_correction_id, v_session, v_table, p_target_id, 'result', v_row.result, v_new_result, p_user_id);
          END IF;

        ELSIF p_target = 'CASH_DAY' THEN
          IF p_field = 'closing_physical_cash' THEN
            v_new_difference := p_new_value - v_row.closing_system_cash;
            UPDATE cash_operational_days SET closing_physical_cash = p_new_value, closing_difference = v_new_difference
            WHERE id = p_target_id AND operational_date = v_session.review_date;
            GET DIAGNOSTICS v_rows = ROW_COUNT;
            PERFORM financial_review_record_version(v_correction_id, v_session, v_table, p_target_id, 'closing_difference', v_row.closing_difference, v_new_difference, p_user_id);
          ELSE
            UPDATE cash_operational_days SET opening_physical_cash = p_new_value
            WHERE id = p_target_id AND operational_date = v_session.review_date;
            GET DIAGNOSTICS v_rows = ROW_COUNT;
          END IF;

        ELSIF p_target = 'CASH_CUT_PERIOD' THEN
          UPDATE cash_cut_periods SET opening_physical_cash = p_new_value WHERE id = p_target_id;
          GET DIAGNOSTICS v_rows = ROW_COUNT;

        ELSIF p_target = 'CASH_CUT_COUNT' THEN
          v_new_difference := p_new_value - v_row.system_cash;
          UPDATE cash_cut_counts SET total_counted = p_new_value, difference = v_new_difference WHERE id = p_target_id;
          GET DIAGNOSTICS v_rows = ROW_COUNT;
          PERFORM financial_review_record_version(v_correction_id, v_session, v_table, p_target_id, 'difference', v_row.difference, v_new_difference, p_user_id);
          -- The count's own cut (same day) carries the counted cash; the next cut is NOT touched.
          IF v_row.cut_status = 'FINALIZADO' THEN
            PERFORM financial_review_record_version(v_correction_id, v_session, 'cash_cut_periods', v_row.cut_id, 'closing_physical_cash',
              (SELECT closing_physical_cash FROM cash_cut_periods WHERE id = v_row.cut_id), p_new_value, p_user_id);
            UPDATE cash_cut_periods
            SET closing_physical_cash = p_new_value, cash_difference = p_new_value - closing_system_cash
            WHERE id = v_row.cut_id;
            -- If it is the day's final cut, the day's closing photograph follows (same day only).
            v_is_final_cut := v_row.day_status = 'CERRADO' AND v_row.closing_sequence = v_row.day_closing_sequence;
            IF v_is_final_cut THEN
              PERFORM financial_review_record_version(v_correction_id, v_session, 'cash_operational_days', v_row.day_id, 'closing_physical_cash',
                (SELECT closing_physical_cash FROM cash_operational_days WHERE id = v_row.day_id), p_new_value, p_user_id);
              UPDATE cash_operational_days
              SET closing_physical_cash = p_new_value, closing_difference = p_new_value - closing_system_cash
              WHERE id = v_row.day_id;
            END IF;
          END IF;

        ELSIF p_target = 'CASH_BANK_RECONCILIATION' THEN
          v_new_difference := p_new_value - v_row.system_balance;
          UPDATE cash_cut_bank_reconciliations SET verified_balance = p_new_value, difference = v_new_difference WHERE id = p_target_id;
          GET DIAGNOSTICS v_rows = ROW_COUNT;
          PERFORM financial_review_record_version(v_correction_id, v_session, v_table, p_target_id, 'difference', v_row.difference, v_new_difference, p_user_id);
        END IF;

        PERFORM set_config('app.financial_review_day', '', true);
        IF v_rows <> 1 THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_OUTSIDE_DAY:%', v_row_date;
        END IF;

        UPDATE financial_day_review_sessions
        SET status = 'IN_REVIEW', corrections_count = corrections_count + 1, close_requested_at = NULL
        WHERE id = v_session.id;
        RETURN v_correction_id;
      END;
      $$
    `);

    // ── Correct a movement through a linked adjustment (ledger untouched) ─
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION adjust_financial_day_movement(
        p_session_id UUID, p_source VARCHAR, p_source_id UUID, p_corrected_amount NUMERIC,
        p_reason VARCHAR, p_observations VARCHAR, p_user_id UUID, p_request_id VARCHAR
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_session financial_day_review_sessions;
        v_existing UUID;
        v_correction_id UUID := gen_random_uuid();
        v_adjustment_id UUID := gen_random_uuid();
        v_previous RECORD;
        v_table TEXT;
        v_module TEXT;
        v_row RECORD;
        v_row_date DATE;
        v_stored NUMERIC(14,2);
        v_current NUMERIC(14,2);
        v_delta NUMERIC(14,2);
        v_reference TEXT;
        v_sign INTEGER;
        v_cash NUMERIC(14,2) := 0;
        v_link RECORD;
      BEGIN
        PERFORM financial_review_assert_role(p_user_id, 'financial_days.correct');
        PERFORM financial_review_validate_request(p_reason, p_request_id);
        v_existing := financial_review_existing_request(p_request_id, p_session_id);
        IF v_existing IS NOT NULL THEN
          RETURN v_existing;
        END IF;
        v_session := financial_review_lock_session(p_session_id, p_user_id, true);
        IF p_corrected_amount IS NULL OR p_corrected_amount < 0 OR p_corrected_amount >= 1000000000000 THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_INVALID_VALUE';
        END IF;

        -- FOR SHARE: the original cannot be voided/edited while it is being corrected.
        IF p_source = 'CASH_MOVEMENT' THEN
          SELECT * INTO v_row FROM cash_movements WHERE id = p_source_id FOR SHARE;
          IF NOT FOUND THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_TARGET_NOT_FOUND:%', p_source_id; END IF;
          IF v_row.status <> 'VIGENTE' OR v_row.movement_type = 'ANULACION' THEN
            RAISE EXCEPTION 'FINANCIAL_REVIEW_MOVEMENT_NOT_ADJUSTABLE:%', p_source_id;
          END IF;
          IF v_row.reference_type IS NOT NULL THEN
            -- Generated by another operation: correct that source record instead.
            RAISE EXCEPTION 'FINANCIAL_REVIEW_MOVEMENT_HAS_SOURCE:%', v_row.reference_type;
          END IF;
          v_table := 'cash_movements'; v_module := 'EFECTIVO'; v_row_date := v_row.operational_date;
          v_stored := v_row.amount;
          v_reference := 'Kardex #' || v_row.sequence || ' — ' || v_row.movement_type;

        ELSIF p_source = 'BANK_MOVEMENT' THEN
          SELECT m.*, b.name AS bank_name INTO v_row
          FROM bank_account_movements m JOIN banks b ON b.id = m.bank_id
          WHERE m.id = p_source_id FOR SHARE OF m;
          IF NOT FOUND THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_TARGET_NOT_FOUND:%', p_source_id; END IF;
          IF v_row.status <> 'APLICADO' OR v_row.movement_type = 'ANULACION' THEN
            RAISE EXCEPTION 'FINANCIAL_REVIEW_MOVEMENT_NOT_ADJUSTABLE:%', p_source_id;
          END IF;
          IF v_row.reference_type = 'BANK_DEPOSIT' THEN
            RAISE EXCEPTION 'FINANCIAL_REVIEW_MOVEMENT_HAS_SOURCE:%', v_row.reference_type;
          END IF;
          v_table := 'bank_account_movements'; v_module := 'BANCOS'; v_row_date := v_row.business_date;
          v_stored := abs(v_row.amount);
          v_reference := 'Movimiento bancario #' || v_row.sequence || ' — ' || v_row.movement_type || ' — ' || v_row.bank_name;

        ELSIF p_source = 'TRANSACTION' THEN
          SELECT o.*, tt.name AS type_name INTO v_row
          FROM bank_deposit_operations o LEFT JOIN transaction_types tt ON tt.id = o.transaction_type_id
          WHERE o.id = p_source_id FOR SHARE OF o;
          IF NOT FOUND THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_TARGET_NOT_FOUND:%', p_source_id; END IF;
          IF v_row.is_voided THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_MOVEMENT_NOT_ADJUSTABLE:%', p_source_id; END IF;
          v_table := 'bank_deposit_operations'; v_module := 'TRANSACCIONES'; v_row_date := v_row.operation_date;
          v_stored := v_row.total_amount;
          v_reference := 'Transacción ' || COALESCE(v_row.type_name, '') || ' — ' || to_char(v_row.created_at AT TIME ZONE 'America/Guatemala', 'HH24:MI');

        ELSIF p_source IN ('ACCOUNT_RECEIVABLE', 'ASSET') THEN
          IF p_source = 'ACCOUNT_RECEIVABLE' THEN
            SELECT * INTO v_row FROM accounts_receivable WHERE id = p_source_id FOR SHARE;
            v_table := 'accounts_receivable'; v_module := 'CUENTAS_POR_COBRAR';
          ELSE
            SELECT * INTO v_row FROM assets WHERE id = p_source_id FOR SHARE;
            v_table := 'assets'; v_module := 'ACTIVOS';
          END IF;
          IF NOT FOUND THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_TARGET_NOT_FOUND:%', p_source_id; END IF;
          IF NOT v_row.is_active THEN RAISE EXCEPTION 'FINANCIAL_REVIEW_MOVEMENT_NOT_ADJUSTABLE:%', p_source_id; END IF;
          v_row_date := v_row.date;
          v_stored := v_row.amount;
          v_reference := v_row.movement_type || ' #' || v_row.sequence || COALESCE(' — ' || v_row.description, '');
        ELSE
          RAISE EXCEPTION 'FINANCIAL_REVIEW_INVALID_TARGET:%', p_source;
        END IF;

        IF v_row_date IS DISTINCT FROM v_session.review_date THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_OUTSIDE_DAY:%', v_row_date;
        END IF;

        SELECT * INTO v_previous FROM financial_day_adjustments
        WHERE source_table = v_table AND source_id = p_source_id AND status = 'VIGENTE' FOR UPDATE;
        v_current := COALESCE(v_previous.corrected_amount, v_stored);
        IF v_current = p_corrected_amount THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_NO_CHANGE';
        END IF;
        v_delta := p_corrected_amount - v_stored;

        INSERT INTO financial_day_corrections (
          id, session_id, review_date, module, correction_type, target_table, target_id, field,
          original_value, new_value, difference, reason, observations, original_reference,
          client_request_id, created_by
        ) VALUES (
          v_correction_id, v_session.id, v_session.review_date, v_module, 'MOVEMENT_ADJUSTMENT', v_table, p_source_id, 'amount',
          v_current, p_corrected_amount, p_corrected_amount - v_current, btrim(p_reason), NULLIF(btrim(p_observations), ''),
          left(v_reference, 255), btrim(p_request_id), p_user_id
        );
        IF v_previous.id IS NOT NULL THEN
          UPDATE financial_day_adjustments SET status = 'REEMPLAZADO', replaced_by_id = v_adjustment_id
          WHERE id = v_previous.id;
        END IF;
        INSERT INTO financial_day_adjustments (
          id, correction_id, session_id, review_date, module, source_table, source_id,
          original_amount, corrected_amount, delta, created_by
        ) VALUES (
          v_adjustment_id, v_correction_id, v_session.id, v_session.review_date, v_module, v_table, p_source_id,
          v_stored, p_corrected_amount, v_delta, p_user_id
        );

        -- Effects, derived only from links the database already has.
        IF v_delta <> 0 THEN
          IF p_source = 'CASH_MOVEMENT' THEN
            v_cash := v_delta * CASE v_row.direction WHEN 'IN' THEN 1 WHEN 'OUT' THEN -1 ELSE 0 END;

          ELSIF p_source = 'BANK_MOVEMENT' THEN
            v_sign := CASE WHEN v_row.amount < 0 THEN -1 ELSE 1 END;
            INSERT INTO financial_day_adjustment_effects (adjustment_id, scope, bank_id, amount)
            VALUES (v_adjustment_id, 'BANK', v_row.bank_id, v_delta * v_sign);
            SELECT COALESCE(sum(CASE direction WHEN 'IN' THEN 1 WHEN 'OUT' THEN -1 ELSE 0 END), 0) * v_delta INTO v_cash
            FROM cash_movements
            WHERE status = 'VIGENTE' AND movement_type <> 'ANULACION'
              AND ((reference_type = 'BANK_MOVEMENT' AND reference_id = p_source_id)
                OR (v_row.reference_type IS NOT NULL AND reference_type = v_row.reference_type AND reference_id = v_row.reference_id));

          ELSIF p_source = 'TRANSACTION' THEN
            FOR v_link IN
              SELECT bank_id, sum(CASE WHEN amount < 0 THEN -1 ELSE 1 END) AS direction
              FROM bank_account_movements
              WHERE reference_type = 'BANK_DEPOSIT' AND reference_id = p_source_id
                AND status = 'APLICADO' AND movement_type <> 'ANULACION'
              GROUP BY bank_id
            LOOP
              IF v_link.direction <> 0 THEN
                INSERT INTO financial_day_adjustment_effects (adjustment_id, scope, bank_id, amount)
                VALUES (v_adjustment_id, 'BANK', v_link.bank_id, v_delta * v_link.direction);
              END IF;
            END LOOP;
            SELECT COALESCE(sum(CASE direction WHEN 'IN' THEN 1 WHEN 'OUT' THEN -1 ELSE 0 END), 0) * v_delta INTO v_cash
            FROM cash_movements
            WHERE reference_type = 'BANK_DEPOSIT' AND reference_id = p_source_id
              AND status = 'VIGENTE' AND movement_type <> 'ANULACION';

          ELSE
            v_sign := CASE WHEN v_row.movement_type = 'ABONO' THEN -1 ELSE 1 END;
            INSERT INTO financial_day_adjustment_effects (adjustment_id, scope, client_id, amount)
            VALUES (v_adjustment_id, CASE p_source WHEN 'ASSET' THEN 'ASSET' ELSE 'AR' END, v_row.client_id, v_delta * v_sign);
            SELECT COALESCE(sum(CASE direction WHEN 'IN' THEN 1 WHEN 'OUT' THEN -1 ELSE 0 END), 0) * v_delta INTO v_cash
            FROM cash_movements
            WHERE reference_type = CASE p_source WHEN 'ASSET' THEN 'ASSET' ELSE 'ACCOUNT_RECEIVABLE' END
              AND reference_id = p_source_id AND status = 'VIGENTE' AND movement_type <> 'ANULACION';
          END IF;

          IF v_cash <> 0 THEN
            INSERT INTO financial_day_adjustment_effects (adjustment_id, scope, amount)
            VALUES (v_adjustment_id, 'CASH', v_cash);
          END IF;
        END IF;

        UPDATE financial_day_review_sessions
        SET status = 'IN_REVIEW', corrections_count = corrections_count + 1, close_requested_at = NULL
        WHERE id = v_session.id;
        RETURN v_correction_id;
      END;
      $$
    `);

    // ── Close: request (summary) → confirm ────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION request_financial_day_review_close(p_session_id UUID, p_user_id UUID)
      RETURNS VOID
      LANGUAGE plpgsql AS $$
      BEGIN
        PERFORM financial_review_assert_role(p_user_id, 'financial_days.correct');
        PERFORM financial_review_lock_session(p_session_id, p_user_id, false);
        UPDATE financial_day_review_sessions
        SET status = 'PENDING_CONFIRMATION', close_requested_at = now()
        WHERE id = p_session_id;
      END;
      $$
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION close_financial_day_review(
        p_session_id UUID, p_user_id UUID, p_observations VARCHAR, p_has_pending BOOLEAN,
        p_accept_pending BOOLEAN, p_difference_after NUMERIC, p_snapshot_after JSONB
      ) RETURNS VOID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_session financial_day_review_sessions;
      BEGIN
        PERFORM financial_review_assert_role(p_user_id, 'financial_days.correct');
        v_session := financial_review_lock_session(p_session_id, p_user_id, false);
        IF v_session.status <> 'PENDING_CONFIRMATION' THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_CONFIRMATION_REQUIRED:%', p_session_id;
        END IF;
        IF COALESCE(p_has_pending, false) AND NOT COALESCE(p_accept_pending, false) THEN
          RAISE EXCEPTION 'FINANCIAL_REVIEW_PENDING_DIFFERENCES:%', p_session_id;
        END IF;
        UPDATE financial_day_review_sessions
        SET status = 'CLOSED', closed_by = p_user_id, closed_at = now(),
            close_observations = NULLIF(btrim(p_observations), ''),
            has_pending_differences = COALESCE(p_has_pending, false),
            difference_after = p_difference_after, snapshot_after = p_snapshot_after
        WHERE id = p_session_id;
      END;
      $$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const [table] of GUARDED_TABLES) {
      await queryRunner.query(
        `DROP TRIGGER IF EXISTS trg_financial_review_guard ON ${table}`,
      );
    }
    for (const fn of [
      'close_financial_day_review(UUID, UUID, VARCHAR, BOOLEAN, BOOLEAN, NUMERIC, JSONB)',
      'request_financial_day_review_close(UUID, UUID)',
      'adjust_financial_day_movement(UUID, VARCHAR, UUID, NUMERIC, VARCHAR, VARCHAR, UUID, VARCHAR)',
      'correct_financial_day_snapshot(UUID, VARCHAR, UUID, VARCHAR, NUMERIC, VARCHAR, VARCHAR, UUID, VARCHAR)',
      'open_financial_day_review(DATE, UUID, VARCHAR)',
      'financial_review_record_version(UUID, financial_day_review_sessions, TEXT, UUID, TEXT, NUMERIC, NUMERIC, UUID)',
      'financial_review_existing_request(VARCHAR, UUID)',
      'financial_review_validate_request(VARCHAR, VARCHAR)',
      'financial_review_lock_session(UUID, UUID, BOOLEAN)',
      'financial_review_assert_role(UUID, TEXT)',
      'financial_review_day_guard()',
      'financial_review_row_date(TEXT, JSONB)',
    ]) {
      await queryRunner.query(`DROP FUNCTION IF EXISTS ${fn}`);
    }
    // Audit tables, their immutability triggers and every row are kept on purpose.
  }
}

/** Tables whose rows belong to one operational day, and how to read that day. */
const GUARDED_TABLES: Array<[string, string]> = [
  ['day_openings', 'date'],
  ['bank_balances', 'operation_date'],
  ['agent_reconciliations', 'date'],
  ['cash_operational_days', 'operational_date'],
  ['cash_cut_periods', 'day'],
  ['cash_cut_counts', 'cut'],
  ['cash_cut_bank_reconciliations', 'cut'],
  ['cash_movements', 'operational_date'],
  ['bank_account_movements', 'business_date'],
  ['bank_deposit_operations', 'operation_date'],
  ['accounts_receivable', 'date'],
  ['assets', 'date'],
];
