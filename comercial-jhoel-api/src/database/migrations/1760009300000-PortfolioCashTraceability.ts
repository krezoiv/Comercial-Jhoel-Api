import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Cuentas por Cobrar / Activos ↔ Caja traceability (owner request,
 * 2026-11-26: "auditoría y corrección de inconsistencias financieras").
 *
 * Root causes found before this migration:
 * 1. The update trigger only touched Caja when the record ALREADY had a Kardex
 *    movement: records registered before Control de Efectivo never move Caja
 *    when edited/deleted (correct — their cash is inside the counted opening
 *    balance), but nothing told the user which case applied.
 * 2. Manual cargos/abonos always moved Caja: there was no way to say a payment
 *    arrived by bank transfer.
 * 3. Deleting/editing never asked for a reason, and the client statement only
 *    showed active rows with their current amount: changes vanished.
 * 4. Voiding a Transaccionar operation sent to CxC/Activos reversed the
 *    operation's cash but left its linked cargo (and its cash) in place.
 *
 * What this migration does (owner decisions, AskUserQuestion 2026-11-26):
 * - `payment_method` (EFECTIVO | BANCO) on both tables. BANCO never moves Caja.
 *   Existing rows keep NULL = "registered before this column" and behave as
 *   EFECTIVO (nothing historical changes); new rows always get a value
 *   (`portfolio_row_before_insert`; a Cartera collection takes its operation's
 *   method).
 * - `cash_tracked`: TRUE for every new row (its cash effect is always kept in
 *   the Kardex, even when it starts as BANCO); NULL for existing rows, which
 *   keep the previous rule (tracked only if they already have a movement).
 * - One cash rule, `portfolio_row_cash_effect`, used by the insert trigger, the
 *   update trigger and the cash audit.
 * - Every change goes through `portfolio_row_change_guard` (BEFORE UPDATE):
 *   voided rows are history (no edits), a financial change (amount, type,
 *   active, payment method) requires a reason (≥5), a cargo born in
 *   Transaccionar is changed only by voiding its operation, and a CxC change
 *   can never push the client's balance below zero (abonos depend on it).
 * - `portfolio_row_on_update` (AFTER UPDATE) reverses the Kardex movements of
 *   the record and applies the new effect (with the reason, linked to the
 *   original by `reversal_of_id`), then appends the change to
 *   `portfolio_record_changes` (append-only: before → after, reason, user,
 *   cash movements it produced).
 * - Voiding a Transaccionar operation voids its linked cargo in the same
 *   transaction (`trg_portfolio_bank_deposit_void`); if that cargo already has
 *   payments the void is rejected (`BANK_DEPOSIT_LINKED_CHARGE_HAS_PAYMENTS`).
 * - `update_portfolio_record` / `void_portfolio_record`: the write paths of the
 *   API — locks in the same order as the Cartera settlements (caja → client →
 *   row), idempotent void (`PORTFOLIO_RECORD_ALREADY_VOIDED`).
 *
 * Nothing existing is rewritten: no UPDATE of historical rows, no Kardex row is
 * touched; new columns are added without default for existing rows.
 */
export class PortfolioCashTraceability1760009300000 implements MigrationInterface {
  name = 'PortfolioCashTraceability1760009300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of ['accounts_receivable', 'assets']) {
      // Added without default (existing rows stay NULL = "before this column"); the default applies to new rows only.
      await queryRunner.query(
        `ALTER TABLE ${table} ADD COLUMN payment_method VARCHAR(10), ADD COLUMN cash_tracked BOOLEAN`,
      );
      await queryRunner.query(
        `ALTER TABLE ${table} ALTER COLUMN payment_method SET DEFAULT 'EFECTIVO', ALTER COLUMN cash_tracked SET DEFAULT true`,
      );
      await queryRunner.query(
        `ALTER TABLE ${table} ADD CONSTRAINT "CHK_${table}_payment_method"
           CHECK (payment_method IS NULL OR payment_method IN ('EFECTIVO', 'BANCO'))`,
      );
      await queryRunner.query(
        `COMMENT ON COLUMN ${table}.payment_method IS 'EFECTIVO moves Caja, BANCO never does. NULL = registered before 1760009300000 (behaves as EFECTIVO).'`,
      );
      await queryRunner.query(
        `COMMENT ON COLUMN ${table}.cash_tracked IS 'TRUE = its cash effect is kept in the Kardex. NULL = registered before 1760009300000: tracked only if it already has a Kardex movement.'`,
      );
    }

    await queryRunner.query(`
      CREATE TABLE portfolio_record_changes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        record_type VARCHAR(20) NOT NULL,
        record_id UUID NOT NULL,
        client_id UUID NOT NULL,
        action VARCHAR(10) NOT NULL,
        reason VARCHAR(255),
        -- Only the fields that changed: {"amount": {"from": 100, "to": 150}, ...}.
        changes JSONB NOT NULL,
        cash_tracked BOOLEAN NOT NULL,
        -- Signed expected Caja effect before/after the change (NULL when the record is not tracked).
        cash_effect_before NUMERIC(14,2),
        cash_effect_after NUMERIC(14,2),
        -- Kardex movements this change produced (reversals + new effect), in order.
        cash_movement_ids UUID[] NOT NULL DEFAULT '{}',
        changed_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_portfolio_record_changes_type" CHECK (record_type IN ('ACCOUNT_RECEIVABLE', 'ASSET')),
        CONSTRAINT "CHK_portfolio_record_changes_action" CHECK (action IN ('MODIFICADO', 'ANULADO'))
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_portfolio_record_changes_record" ON portfolio_record_changes (record_type, record_id, changed_at)`,
    );
    await queryRunner.query(`
      CREATE FUNCTION portfolio_record_changes_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN
        RAISE EXCEPTION 'PORTFOLIO_HISTORY_IMMUTABLE';
      END;
      $$
    `);
    await queryRunner.query(`
      CREATE TRIGGER trg_portfolio_record_changes_immutable
      BEFORE UPDATE OR DELETE ON portfolio_record_changes
      FOR EACH ROW EXECUTE FUNCTION portfolio_record_changes_immutable()
    `);

    // The one cash rule of CxC / Activos (signed: + entra a Caja, − sale).
    await queryRunner.query(`
      CREATE FUNCTION portfolio_row_cash_effect(
        p_table TEXT, p_movement_type TEXT, p_amount NUMERIC, p_is_active BOOLEAN,
        p_payment_method TEXT, p_reference_type TEXT, p_reference_id UUID
      ) RETURNS NUMERIC LANGUAGE plpgsql STABLE AS $$
      BEGIN
        IF NOT p_is_active OR p_payment_method = 'BANCO' THEN
          RETURN 0;
        END IF;
        IF p_table = 'accounts_receivable' THEN
          -- A Cartera collection paid by bank deposit never enters the physical cash.
          IF p_reference_type = 'AR_PAYMENT' AND EXISTS (
            SELECT 1 FROM account_receivable_payment_operations
            WHERE id = p_reference_id AND payment_method = 'DEPOSITO_BANCARIO'
          ) THEN
            RETURN 0;
          END IF;
          -- CxC: an abono is cash received; a cargo (gasto por cobrar) is cash given.
          RETURN CASE WHEN p_movement_type = 'ABONO' THEN p_amount ELSE -p_amount END;
        END IF;
        -- Activos: the client's money the business keeps (in); its return (out).
        RETURN CASE WHEN p_movement_type = 'ABONO' THEN -p_amount ELSE p_amount END;
      END;
      $$
    `);

    // Appends the current effect of a record to the Kardex (labels and idempotency key as before).
    await queryRunner.query(`
      CREATE FUNCTION portfolio_apply_cash(
        p_table TEXT, p_id UUID, p_client_id UUID, p_movement_type TEXT, p_amount NUMERIC,
        p_description TEXT, p_user_id UUID, p_reason TEXT
      ) RETURNS UUID LANGUAGE plpgsql AS $$
      DECLARE
        v_reference_type VARCHAR := CASE WHEN p_table = 'accounts_receivable' THEN 'ACCOUNT_RECEIVABLE' ELSE 'ASSET' END;
        v_movement VARCHAR;
        v_direction VARCHAR;
        v_label VARCHAR;
        v_client VARCHAR;
        v_version INT;
      BEGIN
        IF p_table = 'accounts_receivable' THEN
          IF p_movement_type = 'ABONO' THEN
            v_movement := 'ABONO_POR_COBRAR'; v_direction := 'IN'; v_label := 'Abono cuenta por cobrar';
          ELSE
            v_movement := 'GASTO_POR_COBRAR'; v_direction := 'OUT'; v_label := 'Gasto por cobrar';
          END IF;
        ELSE
          IF p_movement_type = 'ABONO' THEN
            v_movement := 'DEVOLUCION_ACTIVO'; v_direction := 'OUT'; v_label := 'Devolución de activo';
          ELSE
            v_movement := 'ACTIVO'; v_direction := 'IN'; v_label := 'Activo';
          END IF;
        END IF;
        SELECT name INTO v_client FROM clients WHERE id = p_client_id;
        SELECT count(*) + 1 INTO v_version
        FROM cash_movements
        WHERE reference_type = v_reference_type AND reference_id = p_id AND movement_type <> 'ANULACION';
        RETURN apply_cash_movement(
          v_movement, v_direction, p_amount, p_user_id,
          left(v_label || COALESCE(' — ' || v_client, '') || COALESCE(' — ' || NULLIF(trim(p_description), ''), ''), 255),
          v_reference_type, p_id, NULL, p_reason, NULL,
          v_reference_type || ':' || p_id || ':' || v_version
        );
      END;
      $$
    `);

    // INSERT: new rows are always tracked; a Cartera collection takes its operation's payment method.
    await queryRunner.query(`
      CREATE FUNCTION portfolio_row_before_insert() RETURNS trigger LANGUAGE plpgsql AS $$
      DECLARE
        v_method VARCHAR;
      BEGIN
        NEW.cash_tracked := true;
        IF TG_TABLE_NAME = 'accounts_receivable' AND NEW.reference_type = 'AR_PAYMENT' THEN
          SELECT CASE WHEN payment_method = 'DEPOSITO_BANCARIO' THEN 'BANCO' ELSE 'EFECTIVO' END
          INTO v_method
          FROM account_receivable_payment_operations WHERE id = NEW.reference_id;
          NEW.payment_method := COALESCE(v_method, NEW.payment_method);
        END IF;
        NEW.payment_method := COALESCE(NEW.payment_method, 'EFECTIVO');
        RETURN NEW;
      END;
      $$
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_on_portfolio_row() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN
        -- INSERT only (updates: portfolio_row_on_update). BANCO, inactive and bank-paid collections never reach Caja.
        IF portfolio_row_cash_effect(TG_TABLE_NAME, NEW.movement_type, NEW.amount, NEW.is_active,
             NEW.payment_method, NEW.reference_type, NEW.reference_id) = 0 THEN
          RETURN NEW;
        END IF;
        PERFORM portfolio_apply_cash(TG_TABLE_NAME, NEW.id, NEW.client_id, NEW.movement_type, NEW.amount,
          NEW.description, NEW.created_by, NULL);
        RETURN NEW;
      END;
      $$
    `);

    // BEFORE UPDATE: the rules every change must satisfy, whatever path it comes from.
    await queryRunner.query(`
      CREATE FUNCTION portfolio_row_change_guard() RETURNS trigger LANGUAGE plpgsql AS $$
      DECLARE
        v_financial BOOLEAN := OLD.amount <> NEW.amount OR OLD.movement_type <> NEW.movement_type
          OR OLD.is_active <> NEW.is_active
          OR COALESCE(OLD.payment_method, 'EFECTIVO') <> COALESCE(NEW.payment_method, 'EFECTIVO');
        v_admin BOOLEAN := OLD.client_id <> NEW.client_id OR OLD.date <> NEW.date
          OR OLD.description IS DISTINCT FROM NEW.description;
        v_reason TEXT := btrim(COALESCE(current_setting('app.portfolio_change_reason', true), ''));
        v_client UUID;
        v_current NUMERIC(14,2);
        v_new NUMERIC(14,2);
      BEGIN
        IF NOT (v_financial OR v_admin) THEN
          RETURN NEW;
        END IF;
        IF NOT OLD.is_active THEN
          RAISE EXCEPTION 'PORTFOLIO_RECORD_VOIDED:%', OLD.id;
        END IF;
        IF v_financial AND length(v_reason) < 5 THEN
          RAISE EXCEPTION 'PORTFOLIO_CHANGE_REASON_REQUIRED:%', OLD.id;
        END IF;
        -- A cargo born in Transaccionar follows its operation: it is voided by voiding the operation. The only
        -- direct change allowed is voiding it when its operation is ALREADY voided (operations voided before
        -- 1760009300000 left their cargo active: that is how such a case is regularized, with its reason).
        IF OLD.reference_type = 'BANK_DEPOSIT' AND (v_financial OR OLD.client_id <> NEW.client_id)
           AND COALESCE(current_setting('app.portfolio_linked_void', true), '') <> 'on'
           AND NOT (
             NOT NEW.is_active AND NEW.amount = OLD.amount AND NEW.movement_type = OLD.movement_type
             AND NEW.client_id = OLD.client_id
             AND COALESCE(NEW.payment_method, 'EFECTIVO') = COALESCE(OLD.payment_method, 'EFECTIVO')
             AND EXISTS (SELECT 1 FROM bank_deposit_operations WHERE id = OLD.reference_id AND is_voided)
           ) THEN
          RAISE EXCEPTION 'PORTFOLIO_LINKED_TO_OPERATION:%', OLD.reference_id;
        END IF;
        IF OLD.reference_type = 'AR_PAYMENT'
           AND COALESCE(OLD.payment_method, 'EFECTIVO') <> COALESCE(NEW.payment_method, 'EFECTIVO') THEN
          RAISE EXCEPTION 'AR_PAYMENT_ROW_LOCKED';
        END IF;
        -- CxC: a change can never push a client's balance below zero (its abonos depend on it).
        IF TG_TABLE_NAME = 'accounts_receivable' AND (v_financial OR OLD.client_id <> NEW.client_id) THEN
          PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
          FOR v_client IN SELECT DISTINCT c FROM unnest(ARRAY[OLD.client_id, NEW.client_id]) AS c ORDER BY c LOOP
            PERFORM pg_advisory_xact_lock(hashtext(v_client::text));
            SELECT COALESCE(SUM(CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END), 0)
            INTO v_current
            FROM accounts_receivable WHERE client_id = v_client AND is_active;
            v_new := v_current
              - CASE WHEN OLD.client_id = v_client AND OLD.is_active
                     THEN CASE WHEN OLD.movement_type = 'ABONO' THEN -OLD.amount ELSE OLD.amount END ELSE 0 END
              + CASE WHEN NEW.client_id = v_client AND NEW.is_active
                     THEN CASE WHEN NEW.movement_type = 'ABONO' THEN -NEW.amount ELSE NEW.amount END ELSE 0 END;
            IF v_new < 0 AND v_new < v_current THEN
              RAISE EXCEPTION 'AR_BALANCE_WOULD_BE_NEGATIVE:%', v_new;
            END IF;
          END LOOP;
        END IF;
        RETURN NEW;
      END;
      $$
    `);

    // AFTER UPDATE: cash (reversal + new effect, with the reason) and the change history.
    await queryRunner.query(`
      CREATE FUNCTION portfolio_row_on_update() RETURNS trigger LANGUAGE plpgsql AS $$
      DECLARE
        v_reference_type VARCHAR := CASE WHEN TG_TABLE_NAME = 'accounts_receivable' THEN 'ACCOUNT_RECEIVABLE' ELSE 'ASSET' END;
        v_old_method TEXT := COALESCE(OLD.payment_method, 'EFECTIVO');
        v_new_method TEXT := COALESCE(NEW.payment_method, 'EFECTIVO');
        v_financial BOOLEAN := OLD.amount <> NEW.amount OR OLD.movement_type <> NEW.movement_type
          OR OLD.is_active <> NEW.is_active OR v_old_method <> v_new_method;
        v_reason TEXT := NULLIF(btrim(COALESCE(current_setting('app.portfolio_change_reason', true), '')), '');
        v_user UUID := COALESCE(NEW.updated_by, NEW.created_by);
        v_changes JSONB := '{}'::jsonb;
        v_tracked BOOLEAN;
        v_before NUMERIC(14,2);
        v_after NUMERIC(14,2);
        v_known UUID[];
        v_new_ids UUID[] := '{}';
      BEGIN
        IF OLD.amount <> NEW.amount THEN
          v_changes := v_changes || jsonb_build_object('amount', jsonb_build_object('from', OLD.amount, 'to', NEW.amount));
        END IF;
        IF OLD.movement_type <> NEW.movement_type THEN
          v_changes := v_changes || jsonb_build_object('movementType', jsonb_build_object('from', OLD.movement_type, 'to', NEW.movement_type));
        END IF;
        IF v_old_method <> v_new_method THEN
          v_changes := v_changes || jsonb_build_object('paymentMethod', jsonb_build_object('from', v_old_method, 'to', v_new_method));
        END IF;
        IF OLD.client_id <> NEW.client_id THEN
          v_changes := v_changes || jsonb_build_object('client', jsonb_build_object(
            'from', (SELECT name FROM clients WHERE id = OLD.client_id),
            'to', (SELECT name FROM clients WHERE id = NEW.client_id)));
        END IF;
        IF OLD.date <> NEW.date THEN
          v_changes := v_changes || jsonb_build_object('date', jsonb_build_object('from', OLD.date, 'to', NEW.date));
        END IF;
        IF OLD.description IS DISTINCT FROM NEW.description THEN
          v_changes := v_changes || jsonb_build_object('description', jsonb_build_object('from', OLD.description, 'to', NEW.description));
        END IF;
        IF OLD.is_active <> NEW.is_active THEN
          v_changes := v_changes || jsonb_build_object('isActive', jsonb_build_object('from', OLD.is_active, 'to', NEW.is_active));
        END IF;
        IF v_changes = '{}'::jsonb THEN
          RETURN NEW;
        END IF;

        -- Records registered before Control de Efectivo were never in the Kardex: leave them alone.
        v_tracked := COALESCE(NEW.cash_tracked, EXISTS (
          SELECT 1 FROM cash_movements WHERE reference_type = v_reference_type AND reference_id = NEW.id));
        IF v_tracked THEN
          v_before := portfolio_row_cash_effect(TG_TABLE_NAME, OLD.movement_type, OLD.amount, OLD.is_active,
            OLD.payment_method, OLD.reference_type, OLD.reference_id);
          v_after := portfolio_row_cash_effect(TG_TABLE_NAME, NEW.movement_type, NEW.amount, NEW.is_active,
            NEW.payment_method, NEW.reference_type, NEW.reference_id);
        END IF;

        IF v_financial AND v_tracked THEN
          v_known := ARRAY(SELECT id FROM cash_movements WHERE reference_type = v_reference_type AND reference_id = NEW.id);
          -- Reverse what the Kardex holds for the record (each reversal linked to its original)...
          PERFORM reverse_cash_movements_for_reference(v_reference_type, NEW.id, v_user,
            COALESCE(v_reason, CASE WHEN NOT NEW.is_active THEN 'Registro anulado' ELSE 'Registro modificado' END));
          -- ...and apply its new effect, if any.
          IF v_after <> 0 THEN
            PERFORM portfolio_apply_cash(TG_TABLE_NAME, NEW.id, NEW.client_id, NEW.movement_type, NEW.amount,
              NEW.description, v_user, v_reason);
          END IF;
          v_new_ids := ARRAY(
            SELECT id FROM cash_movements
            WHERE reference_type = v_reference_type AND reference_id = NEW.id AND NOT (id = ANY (v_known))
            ORDER BY sequence);
        END IF;

        INSERT INTO portfolio_record_changes (
          record_type, record_id, client_id, action, reason, changes, cash_tracked,
          cash_effect_before, cash_effect_after, cash_movement_ids, changed_by
        ) VALUES (
          v_reference_type, NEW.id, NEW.client_id,
          CASE WHEN OLD.is_active AND NOT NEW.is_active THEN 'ANULADO' ELSE 'MODIFICADO' END,
          left(v_reason, 255), v_changes, v_tracked, v_before, v_after, v_new_ids, v_user
        );
        RETURN NEW;
      END;
      $$
    `);

    for (const [table, suffix] of [
      ['accounts_receivable', 'accounts_receivable'],
      ['assets', 'assets'],
    ]) {
      await queryRunner.query(
        `DROP TRIGGER trg_cash_${suffix}_update ON ${table}`,
      );
      await queryRunner.query(`
        CREATE TRIGGER trg_portfolio_before_insert BEFORE INSERT ON ${table}
        FOR EACH ROW EXECUTE FUNCTION portfolio_row_before_insert()
      `);
      // Named after trg_ar_payment_guard / trg_financial_review_guard: those run first (alphabetical order).
      await queryRunner.query(`
        CREATE TRIGGER trg_portfolio_change_guard BEFORE UPDATE ON ${table}
        FOR EACH ROW EXECUTE FUNCTION portfolio_row_change_guard()
      `);
      await queryRunner.query(`
        CREATE TRIGGER trg_portfolio_row_update AFTER UPDATE ON ${table}
        FOR EACH ROW
        WHEN (OLD.amount IS DISTINCT FROM NEW.amount OR OLD.movement_type IS DISTINCT FROM NEW.movement_type
          OR OLD.is_active IS DISTINCT FROM NEW.is_active OR OLD.payment_method IS DISTINCT FROM NEW.payment_method
          OR OLD.client_id IS DISTINCT FROM NEW.client_id OR OLD.date IS DISTINCT FROM NEW.date
          OR OLD.description IS DISTINCT FROM NEW.description)
        EXECUTE FUNCTION portfolio_row_on_update()
      `);
    }

    // Voiding a Transaccionar operation voids its linked cargo in the same transaction.
    await queryRunner.query(`
      CREATE FUNCTION portfolio_on_bank_deposit_void() RETURNS trigger LANGUAGE plpgsql AS $$
      DECLARE
        v_client UUID;
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM accounts_receivable WHERE reference_type = 'BANK_DEPOSIT' AND reference_id = NEW.id AND is_active)
           AND NOT EXISTS (SELECT 1 FROM assets WHERE reference_type = 'BANK_DEPOSIT' AND reference_id = NEW.id AND is_active) THEN
          RETURN NEW;
        END IF;
        -- Same lock order as the Cartera settlements: caja, then client, then the rows.
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        FOR v_client IN
          SELECT client_id FROM accounts_receivable WHERE reference_type = 'BANK_DEPOSIT' AND reference_id = NEW.id
          UNION SELECT client_id FROM assets WHERE reference_type = 'BANK_DEPOSIT' AND reference_id = NEW.id
          ORDER BY 1
        LOOP
          PERFORM pg_advisory_xact_lock(hashtext(v_client::text));
        END LOOP;
        PERFORM set_config('app.portfolio_change_reason',
          left('Operación de Transaccionar anulada: ' || COALESCE(NULLIF(btrim(NEW.void_reason), ''), 'sin motivo'), 255), true);
        PERFORM set_config('app.portfolio_linked_void', 'on', true);
        BEGIN
          UPDATE accounts_receivable SET is_active = false, updated_by = NEW.voided_by, updated_at = now()
          WHERE reference_type = 'BANK_DEPOSIT' AND reference_id = NEW.id AND is_active;
        EXCEPTION WHEN raise_exception THEN
          IF SQLERRM LIKE 'AR_CHARGE_HAS_PAYMENTS%' OR SQLERRM LIKE 'AR_BALANCE_WOULD_BE_NEGATIVE%' THEN
            RAISE EXCEPTION 'BANK_DEPOSIT_LINKED_CHARGE_HAS_PAYMENTS:%', NEW.id;
          END IF;
          RAISE;
        END;
        UPDATE assets SET is_active = false, updated_by = NEW.voided_by, updated_at = now()
        WHERE reference_type = 'BANK_DEPOSIT' AND reference_id = NEW.id AND is_active;
        PERFORM set_config('app.portfolio_linked_void', 'off', true);
        PERFORM set_config('app.portfolio_change_reason', '', true);
        RETURN NEW;
      END;
      $$
    `);
    await queryRunner.query(`
      CREATE TRIGGER trg_portfolio_bank_deposit_void
      AFTER UPDATE OF is_voided ON bank_deposit_operations
      FOR EACH ROW WHEN (OLD.is_voided = false AND NEW.is_voided = true)
      EXECUTE FUNCTION portfolio_on_bank_deposit_void()
    `);

    // API write paths: locks first (caja → client(s) → row), then one UPDATE; the triggers do the rest.
    await queryRunner.query(`
      CREATE FUNCTION portfolio_lock_record(p_table TEXT, p_id UUID, p_other_client UUID) RETURNS BOOLEAN
      LANGUAGE plpgsql AS $$
      DECLARE
        v_client UUID;
        v_active BOOLEAN;
      BEGIN
        IF p_table NOT IN ('accounts_receivable', 'assets') THEN
          RAISE EXCEPTION 'PORTFOLIO_INVALID_TABLE:%', p_table;
        END IF;
        EXECUTE format('SELECT client_id FROM %I WHERE id = $1', p_table) INTO v_client USING p_id;
        IF v_client IS NULL THEN
          RAISE EXCEPTION 'PORTFOLIO_RECORD_NOT_FOUND:%', p_id;
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        FOR v_client IN SELECT DISTINCT c FROM unnest(ARRAY[v_client, p_other_client]) AS c WHERE c IS NOT NULL ORDER BY c LOOP
          PERFORM pg_advisory_xact_lock(hashtext(v_client::text));
        END LOOP;
        EXECUTE format('SELECT is_active FROM %I WHERE id = $1 FOR UPDATE', p_table) INTO v_active USING p_id;
        RETURN v_active;
      END;
      $$
    `);
    await queryRunner.query(`
      CREATE FUNCTION void_portfolio_record(p_table TEXT, p_id UUID, p_reason TEXT, p_user_id UUID) RETURNS VOID
      LANGUAGE plpgsql AS $$
      BEGIN
        IF length(btrim(COALESCE(p_reason, ''))) < 5 THEN
          RAISE EXCEPTION 'PORTFOLIO_CHANGE_REASON_REQUIRED:%', p_id;
        END IF;
        IF NOT portfolio_lock_record(p_table, p_id, NULL) THEN
          RAISE EXCEPTION 'PORTFOLIO_RECORD_ALREADY_VOIDED:%', p_id;
        END IF;
        PERFORM set_config('app.portfolio_change_reason', left(btrim(p_reason), 255), true);
        EXECUTE format('UPDATE %I SET is_active = false, updated_by = $2, updated_at = now() WHERE id = $1', p_table)
        USING p_id, p_user_id;
        PERFORM set_config('app.portfolio_change_reason', '', true);
      END;
      $$
    `);
    await queryRunner.query(`
      CREATE FUNCTION update_portfolio_record(
        p_table TEXT, p_id UUID, p_client_id UUID, p_date DATE, p_amount NUMERIC,
        p_update_description BOOLEAN, p_description TEXT, p_payment_method TEXT, p_reason TEXT, p_user_id UUID
      ) RETURNS VOID LANGUAGE plpgsql AS $$
      BEGIN
        IF p_payment_method IS NOT NULL AND p_payment_method NOT IN ('EFECTIVO', 'BANCO') THEN
          RAISE EXCEPTION 'PORTFOLIO_INVALID_PAYMENT_METHOD:%', p_id;
        END IF;
        IF p_amount IS NOT NULL AND p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_id;
        END IF;
        IF NOT portfolio_lock_record(p_table, p_id, p_client_id) THEN
          RAISE EXCEPTION 'PORTFOLIO_RECORD_VOIDED:%', p_id;
        END IF;
        PERFORM set_config('app.portfolio_change_reason', left(btrim(COALESCE(p_reason, '')), 255), true);
        EXECUTE format(
          'UPDATE %I SET client_id = COALESCE($2, client_id), date = COALESCE($3, date), amount = COALESCE($4, amount),
             description = CASE WHEN $5 THEN $6 ELSE description END,
             payment_method = CASE WHEN $7::text IS NULL OR $7::text = COALESCE(payment_method, ''EFECTIVO'')
                                   THEN payment_method ELSE $7::text END,
             updated_by = $8, updated_at = now()
           WHERE id = $1', p_table)
        USING p_id, p_client_id, p_date, p_amount, p_update_description, p_description, p_payment_method, p_user_id;
        PERFORM set_config('app.portfolio_change_reason', '', true);
      END;
      $$
    `);

    // Manual registrations carry the payment method (NULL = EFECTIVO).
    await queryRunner.query(
      `DROP FUNCTION register_account_receivable_movement(UUID, VARCHAR, NUMERIC, DATE, VARCHAR, UUID, VARCHAR, UUID)`,
    );
    await queryRunner.query(`
      CREATE FUNCTION register_account_receivable_movement(
        p_client_id UUID, p_type VARCHAR, p_amount NUMERIC, p_date DATE, p_description VARCHAR, p_user_id UUID,
        p_reference_type VARCHAR DEFAULT NULL, p_reference_id UUID DEFAULT NULL, p_payment_method VARCHAR DEFAULT NULL
      ) RETURNS UUID LANGUAGE plpgsql AS $$
      DECLARE
        v_id UUID;
        v_current_balance NUMERIC(12,2);
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext(p_client_id::text));
        IF p_type NOT IN ('CARGO', 'ABONO') THEN
          RAISE EXCEPTION 'INVALID_MOVEMENT_TYPE:%', p_client_id;
        END IF;
        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_client_id;
        END IF;
        IF p_payment_method IS NOT NULL AND p_payment_method NOT IN ('EFECTIVO', 'BANCO') THEN
          RAISE EXCEPTION 'PORTFOLIO_INVALID_PAYMENT_METHOD:%', p_client_id;
        END IF;
        SELECT COALESCE(SUM(CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END), 0)
        INTO v_current_balance
        FROM accounts_receivable
        WHERE client_id = p_client_id AND is_active = true;
        IF p_type = 'ABONO' AND p_amount > v_current_balance THEN
          RAISE EXCEPTION 'ABONO_EXCEEDS_BALANCE:%', p_client_id;
        END IF;
        INSERT INTO accounts_receivable (
          client_id, date, amount, description, movement_type, created_by,
          reference_type, reference_id, payment_method
        )
        VALUES (
          p_client_id, p_date, p_amount, p_description, p_type, p_user_id,
          p_reference_type, p_reference_id, p_payment_method
        )
        RETURNING id INTO v_id;
        RETURN v_id;
      END;
      $$
    `);
    await queryRunner.query(
      `DROP FUNCTION register_asset_movement(UUID, VARCHAR, NUMERIC, DATE, VARCHAR, UUID, VARCHAR, UUID)`,
    );
    await queryRunner.query(`
      CREATE FUNCTION register_asset_movement(
        p_client_id UUID, p_type VARCHAR, p_amount NUMERIC, p_date DATE, p_description VARCHAR, p_user_id UUID,
        p_reference_type VARCHAR DEFAULT NULL, p_reference_id UUID DEFAULT NULL, p_payment_method VARCHAR DEFAULT NULL
      ) RETURNS UUID LANGUAGE plpgsql AS $$
      DECLARE
        v_id UUID;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext(p_client_id::text));
        IF p_type NOT IN ('CARGO', 'ABONO') THEN
          RAISE EXCEPTION 'INVALID_MOVEMENT_TYPE:%', p_client_id;
        END IF;
        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_client_id;
        END IF;
        IF p_payment_method IS NOT NULL AND p_payment_method NOT IN ('EFECTIVO', 'BANCO') THEN
          RAISE EXCEPTION 'PORTFOLIO_INVALID_PAYMENT_METHOD:%', p_client_id;
        END IF;

        INSERT INTO assets (
          client_id, date, amount, description, movement_type, created_by,
          reference_type, reference_id, payment_method
        )
        VALUES (
          p_client_id, p_date, p_amount, p_description, p_type, p_user_id,
          p_reference_type, p_reference_id, p_payment_method
        )
        RETURNING id INTO v_id;

        RETURN v_id;
      END;
      $$
    `);

    // A voided Cartera collection carries its reason into the record history and the Kardex reversal.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_account_receivable_payment(p_operation_id uuid, p_user_id uuid, p_reason character varying)
       RETURNS uuid
       LANGUAGE plpgsql
      AS $function$
      DECLARE
        v_operation account_receivable_payment_operations%ROWTYPE;
        v_date DATE := (now() AT TIME ZONE 'America/Guatemala')::date;
      BEGIN
        IF p_reason IS NULL OR length(trim(p_reason)) < 5 THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_REASON_REQUIRED';
        END IF;
        SELECT * INTO v_operation FROM account_receivable_payment_operations WHERE id = p_operation_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_NOT_FOUND';
        END IF;
        -- Same lock order as the settlement.
        IF v_operation.bank_id IS NOT NULL THEN
          PERFORM 1 FROM banks WHERE id = v_operation.bank_id FOR UPDATE;
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        PERFORM pg_advisory_xact_lock(hashtext(v_operation.client_id::text));
        SELECT * INTO v_operation FROM account_receivable_payment_operations WHERE id = p_operation_id FOR UPDATE;
        IF v_operation.status = 'ANULADO' THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_ALREADY_VOIDED';
        END IF;
        -- Deactivating the ABONO restores the accounts' pending; for cash its
        -- update trigger appends the ANULACION (cash OUT) to the Kardex.
        PERFORM set_config('app.ar_payment_write', 'on', true);
        PERFORM set_config('app.portfolio_change_reason', left('Cobro anulado: ' || trim(p_reason), 255), true);
        UPDATE accounts_receivable SET is_active = false, updated_by = p_user_id, updated_at = now()
        WHERE id = v_operation.abono_id;
        PERFORM set_config('app.portfolio_change_reason', '', true);
        PERFORM set_config('app.ar_payment_write', 'off', true);
        IF v_operation.payment_method = 'DEPOSITO_BANCARIO' THEN
          PERFORM reverse_bank_account_movements('AR_PAYMENT', p_operation_id, v_date, p_user_id, trim(p_reason));
        END IF;
        UPDATE account_receivable_payment_operations
        SET status = 'ANULADO', voided_at = now(), voided_by = p_user_id, void_reason = left(trim(p_reason), 255)
        WHERE id = p_operation_id;
        RETURN p_operation_id;
      END;
      $function$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Previous void_account_receivable_payment (without the history reason).
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_account_receivable_payment(p_operation_id uuid, p_user_id uuid, p_reason character varying)
       RETURNS uuid
       LANGUAGE plpgsql
      AS $function$
      DECLARE
        v_operation account_receivable_payment_operations%ROWTYPE;
        v_date DATE := (now() AT TIME ZONE 'America/Guatemala')::date;
      BEGIN
        IF p_reason IS NULL OR length(trim(p_reason)) < 5 THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_REASON_REQUIRED';
        END IF;
        SELECT * INTO v_operation FROM account_receivable_payment_operations WHERE id = p_operation_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_NOT_FOUND';
        END IF;
        -- Same lock order as the settlement.
        IF v_operation.bank_id IS NOT NULL THEN
          PERFORM 1 FROM banks WHERE id = v_operation.bank_id FOR UPDATE;
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        PERFORM pg_advisory_xact_lock(hashtext(v_operation.client_id::text));
        SELECT * INTO v_operation FROM account_receivable_payment_operations WHERE id = p_operation_id FOR UPDATE;
        IF v_operation.status = 'ANULADO' THEN
          RAISE EXCEPTION 'AR_SETTLEMENT_ALREADY_VOIDED';
        END IF;
        -- Deactivating the ABONO restores the accounts' pending; for cash its
        -- update trigger appends the ANULACION (cash OUT) to the Kardex.
        PERFORM set_config('app.ar_payment_write', 'on', true);
        UPDATE accounts_receivable SET is_active = false, updated_by = p_user_id, updated_at = now()
        WHERE id = v_operation.abono_id;
        PERFORM set_config('app.ar_payment_write', 'off', true);
        IF v_operation.payment_method = 'DEPOSITO_BANCARIO' THEN
          PERFORM reverse_bank_account_movements('AR_PAYMENT', p_operation_id, v_date, p_user_id, trim(p_reason));
        END IF;
        UPDATE account_receivable_payment_operations
        SET status = 'ANULADO', voided_at = now(), voided_by = p_user_id, void_reason = left(trim(p_reason), 255)
        WHERE id = p_operation_id;
        RETURN p_operation_id;
      END;
      $function$
    `);

    // Previous 8-argument registration functions.
    await queryRunner.query(
      `DROP FUNCTION register_account_receivable_movement(UUID, VARCHAR, NUMERIC, DATE, VARCHAR, UUID, VARCHAR, UUID, VARCHAR)`,
    );
    await queryRunner.query(`
      CREATE FUNCTION register_account_receivable_movement(
        p_client_id uuid, p_type character varying, p_amount numeric, p_date date, p_description character varying,
        p_user_id uuid, p_reference_type character varying DEFAULT NULL::character varying, p_reference_id uuid DEFAULT NULL::uuid
      ) RETURNS uuid LANGUAGE plpgsql AS $function$
      DECLARE
        v_id UUID;
        v_current_balance NUMERIC(12,2);
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext(p_client_id::text));
        IF p_type NOT IN ('CARGO', 'ABONO') THEN
          RAISE EXCEPTION 'INVALID_MOVEMENT_TYPE:%', p_client_id;
        END IF;
        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_client_id;
        END IF;
        SELECT COALESCE(SUM(CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END), 0)
        INTO v_current_balance
        FROM accounts_receivable
        WHERE client_id = p_client_id AND is_active = true;
        IF p_type = 'ABONO' AND p_amount > v_current_balance THEN
          RAISE EXCEPTION 'ABONO_EXCEEDS_BALANCE:%', p_client_id;
        END IF;
        INSERT INTO accounts_receivable (
          client_id, date, amount, description, movement_type, created_by,
          reference_type, reference_id
        )
        VALUES (
          p_client_id, p_date, p_amount, p_description, p_type, p_user_id,
          p_reference_type, p_reference_id
        )
        RETURNING id INTO v_id;
        RETURN v_id;
      END;
      $function$
    `);
    await queryRunner.query(
      `DROP FUNCTION register_asset_movement(UUID, VARCHAR, NUMERIC, DATE, VARCHAR, UUID, VARCHAR, UUID, VARCHAR)`,
    );
    await queryRunner.query(`
      CREATE FUNCTION register_asset_movement(
        p_client_id uuid, p_type character varying, p_amount numeric, p_date date, p_description character varying,
        p_user_id uuid, p_reference_type character varying DEFAULT NULL::character varying, p_reference_id uuid DEFAULT NULL::uuid
      ) RETURNS uuid LANGUAGE plpgsql AS $function$
      DECLARE
        v_id UUID;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext(p_client_id::text));
        IF p_type NOT IN ('CARGO', 'ABONO') THEN
          RAISE EXCEPTION 'INVALID_MOVEMENT_TYPE:%', p_client_id;
        END IF;
        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_client_id;
        END IF;

        INSERT INTO assets (
          client_id, date, amount, description, movement_type, created_by,
          reference_type, reference_id
        )
        VALUES (
          p_client_id, p_date, p_amount, p_description, p_type, p_user_id,
          p_reference_type, p_reference_id
        )
        RETURNING id INTO v_id;

        RETURN v_id;
      END;
      $function$
    `);

    await queryRunner.query(
      `DROP FUNCTION update_portfolio_record(TEXT, UUID, UUID, DATE, NUMERIC, BOOLEAN, TEXT, TEXT, TEXT, UUID)`,
    );
    await queryRunner.query(
      `DROP FUNCTION void_portfolio_record(TEXT, UUID, TEXT, UUID)`,
    );
    await queryRunner.query(
      `DROP FUNCTION portfolio_lock_record(TEXT, UUID, UUID)`,
    );
    await queryRunner.query(
      `DROP TRIGGER trg_portfolio_bank_deposit_void ON bank_deposit_operations`,
    );
    await queryRunner.query(`DROP FUNCTION portfolio_on_bank_deposit_void()`);

    // Previous cash trigger (insert + update in one function, without payment method).
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_on_portfolio_row() RETURNS trigger LANGUAGE plpgsql AS $function$
      DECLARE
        v_is_receivable BOOLEAN := TG_TABLE_NAME = 'accounts_receivable';
        v_reference_type VARCHAR := CASE WHEN TG_TABLE_NAME = 'accounts_receivable' THEN 'ACCOUNT_RECEIVABLE' ELSE 'ASSET' END;
        v_movement VARCHAR;
        v_direction VARCHAR;
        v_label VARCHAR;
        v_client VARCHAR;
        v_version INT;
        v_user UUID := NEW.created_by;
      BEGIN
        IF TG_OP = 'UPDATE' THEN
          -- Rows that existed before Control de Efectivo were never in the Kardex: leave them alone.
          IF NOT EXISTS (
            SELECT 1 FROM cash_movements WHERE reference_type = v_reference_type AND reference_id = NEW.id
          ) THEN
            RETURN NEW;
          END IF;
          v_user := COALESCE(NEW.updated_by, NEW.created_by);
          PERFORM reverse_cash_movements_for_reference(
            v_reference_type, NEW.id, v_user,
            CASE WHEN NOT NEW.is_active THEN 'Registro desactivado' ELSE 'Registro modificado' END
          );
        END IF;

        IF NOT NEW.is_active THEN
          RETURN NEW;
        END IF;

        -- A collection paid by bank deposit never enters the physical cash.
        IF v_is_receivable AND NEW.reference_type = 'AR_PAYMENT' AND EXISTS (
          SELECT 1 FROM account_receivable_payment_operations
          WHERE id = NEW.reference_id AND payment_method = 'DEPOSITO_BANCARIO'
        ) THEN
          RETURN NEW;
        END IF;

        IF v_is_receivable THEN
          IF NEW.movement_type = 'ABONO' THEN
            v_movement := 'ABONO_POR_COBRAR'; v_direction := 'IN'; v_label := 'Abono cuenta por cobrar';
          ELSE
            v_movement := 'GASTO_POR_COBRAR'; v_direction := 'OUT'; v_label := 'Gasto por cobrar';
          END IF;
        ELSE
          IF NEW.movement_type = 'ABONO' THEN
            v_movement := 'DEVOLUCION_ACTIVO'; v_direction := 'OUT'; v_label := 'Devolución de activo';
          ELSE
            v_movement := 'ACTIVO'; v_direction := 'IN'; v_label := 'Activo';
          END IF;
        END IF;

        SELECT name INTO v_client FROM clients WHERE id = NEW.client_id;
        SELECT count(*) + 1 INTO v_version
        FROM cash_movements
        WHERE reference_type = v_reference_type AND reference_id = NEW.id AND movement_type <> 'ANULACION';

        PERFORM apply_cash_movement(
          v_movement, v_direction, NEW.amount, v_user,
          v_label || COALESCE(' — ' || v_client, '') || COALESCE(' — ' || NULLIF(trim(NEW.description), ''), ''),
          v_reference_type, NEW.id, NULL, NULL, NULL,
          v_reference_type || ':' || NEW.id || ':' || v_version
        );
        RETURN NEW;
      END;
      $function$
    `);

    for (const table of ['accounts_receivable', 'assets']) {
      await queryRunner.query(
        `DROP TRIGGER trg_portfolio_row_update ON ${table}`,
      );
      await queryRunner.query(
        `DROP TRIGGER trg_portfolio_change_guard ON ${table}`,
      );
      await queryRunner.query(
        `DROP TRIGGER trg_portfolio_before_insert ON ${table}`,
      );
      await queryRunner.query(`
        CREATE TRIGGER trg_cash_${table}_update AFTER UPDATE OF amount, movement_type, is_active ON ${table}
        FOR EACH ROW WHEN (OLD.amount IS DISTINCT FROM NEW.amount OR OLD.movement_type IS DISTINCT FROM NEW.movement_type
          OR OLD.is_active IS DISTINCT FROM NEW.is_active)
        EXECUTE FUNCTION cash_on_portfolio_row()
      `);
    }
    await queryRunner.query(`DROP FUNCTION portfolio_row_on_update()`);
    await queryRunner.query(`DROP FUNCTION portfolio_row_change_guard()`);
    await queryRunner.query(`DROP FUNCTION portfolio_row_before_insert()`);
    await queryRunner.query(
      `DROP FUNCTION portfolio_apply_cash(TEXT, UUID, UUID, TEXT, NUMERIC, TEXT, UUID, TEXT)`,
    );
    await queryRunner.query(
      `DROP FUNCTION portfolio_row_cash_effect(TEXT, TEXT, NUMERIC, BOOLEAN, TEXT, TEXT, UUID)`,
    );

    // The change history and the new columns are evidence: `down` keeps nothing of them only because the
    // previous schema cannot represent them. Run it only on a copy, never on production data with history.
    await queryRunner.query(`DROP TABLE portfolio_record_changes`);
    await queryRunner.query(
      `DROP FUNCTION portfolio_record_changes_immutable()`,
    );
    for (const table of ['accounts_receivable', 'assets']) {
      await queryRunner.query(
        `ALTER TABLE ${table} DROP CONSTRAINT "CHK_${table}_payment_method"`,
      );
      await queryRunner.query(
        `ALTER TABLE ${table} DROP COLUMN payment_method, DROP COLUMN cash_tracked`,
      );
    }
  }
}
