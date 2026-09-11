import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Lets a Transaccionar "Depósito" optionally link to a REGISTERED client
 * (the same `clients` table Cuentas por Cobrar/Activos already use — see
 * `bank_deposit_operations.client_name`'s own doc comment: that column is
 * deliberately free-text, never looked up against `clients`) and,
 * optionally, atomically register a Cuentas por Cobrar CARGO for that same
 * client and amount — with a traceable link back to the deposit.
 *
 * Two independent, additive changes:
 *
 * 1. `bank_deposit_operations.client_id` (nullable FK → `clients.id`,
 *    RESTRICT) — set whenever the user picked a real registered client in
 *    Transaccionar, independent of whether a CxC cargo was also requested.
 *    `client_name` is untouched and keeps working exactly as before for
 *    every other transaction type and for a depósito with no registered
 *    client.
 * 2. `accounts_receivable.reference_type` / `reference_id` (both nullable,
 *    paired — either both null or both set, same "all-or-nothing" CHECK
 *    shape `AddVoidToBankDepositOperations` already established for its own
 *    4-column void group) — a generic, polymorphic "where did this
 *    movement come from" tag. Deliberately a free VARCHAR, not a CHECK'd
 *    enum: the whole point is that a future origin (a different module)
 *    can start using it without another migration. No FK on `reference_id`
 *    — it can't point at a single table by construction. Today the only
 *    writer is `register_bank_deposit_operation`'s own optional CxC path,
 *    tagging `reference_type = 'BANK_DEPOSIT'`, `reference_id = <the
 *    deposit's own id>`.
 *
 * Both stored functions gain one/two new DEFAULT-valued trailing
 * parameters — same "DROP FUNCTION IF EXISTS the old signature first"
 * discipline this codebase already established (`AddChangeGivenTo
 * BankDepositOperations`, `AddDraftKeyToSales`'s own doc comment): Postgres
 * identifies a function by `(name, argument types)`, so a bare `CREATE OR
 * REPLACE` with a different parameter count creates a new overload instead
 * of truly replacing the old one.
 */
export class AddClientAndReferenceForBankDepositReceivables1760002100000
  implements MigrationInterface
{
  name = 'AddClientAndReferenceForBankDepositReceivables1760002100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE bank_deposit_operations
      ADD COLUMN "client_id" UUID NULL
    `);
    await queryRunner.query(`
      ALTER TABLE bank_deposit_operations
      ADD CONSTRAINT "FK_bank_deposit_operations_client"
      FOREIGN KEY ("client_id") REFERENCES clients(id) ON DELETE RESTRICT
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_bank_deposit_operations_client_id"
      ON bank_deposit_operations ("client_id")
    `);

    await queryRunner.query(`
      ALTER TABLE accounts_receivable
      ADD COLUMN "reference_type" VARCHAR(50) NULL,
      ADD COLUMN "reference_id" UUID NULL
    `);
    await queryRunner.query(`
      ALTER TABLE accounts_receivable
      ADD CONSTRAINT "CHK_accounts_receivable_reference_pair"
      CHECK (
        ("reference_type" IS NULL AND "reference_id" IS NULL)
        OR ("reference_type" IS NOT NULL AND "reference_id" IS NOT NULL)
      )
    `);

    // ==================================================================
    // register_bank_deposit_operation — gains `p_client_id UUID DEFAULT
    // NULL`. Body is byte-identical to the version from
    // `AddChangeGivenToBankDepositOperations` except: (a) the new
    // parameter, (b) one new SQL-level guard mirroring how this same
    // function already validates the transaction_bank/transaction_type FK
    // targets (never trusting the TypeScript-layer pre-check alone — same
    // "SQL does data integrity, application does authorization" split this
    // codebase uses everywhere else), (c) `client_id` added to the INSERT.
    // ==================================================================
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_bank_deposit_operation(UUID, NUMERIC, DATE, JSONB, JSONB, UUID, UUID, VARCHAR, NUMERIC)',
    );

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_bank_deposit_operation(
        p_transaction_bank_id UUID,
        p_total_amount NUMERIC,
        p_operation_date DATE,
        p_cash_details JSONB,
        p_transaction_amounts JSONB,
        p_user_id UUID,
        p_transaction_type_id UUID,
        p_client_name VARCHAR DEFAULT NULL,
        p_change_given NUMERIC DEFAULT 0,
        p_client_id UUID DEFAULT NULL
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_bank RECORD;
        v_transaction_type RECORD;
        v_operation_id UUID;
        v_cash_item JSONB;
        v_denomination NUMERIC(10,2);
        v_quantity INT;
        v_total_cash NUMERIC(14,2) := 0;
        v_amount_text TEXT;
        v_amount NUMERIC(14,2);
        v_sequence INT := 0;
        v_total_distributed NUMERIC(14,2) := 0;
        v_change_given NUMERIC(14,2) := COALESCE(p_change_given, 0);
      BEGIN
        IF p_total_amount IS NULL OR p_total_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_DEPOSIT_AMOUNT:%', p_transaction_bank_id;
        END IF;

        IF p_operation_date IS NULL THEN
          RAISE EXCEPTION 'INVALID_DEPOSIT_AMOUNT:%', p_transaction_bank_id;
        END IF;

        IF v_change_given < 0 THEN
          RAISE EXCEPTION 'INVALID_CHANGE_GIVEN:%', p_transaction_bank_id;
        END IF;

        SELECT id, is_active INTO v_bank
        FROM transaction_banks
        WHERE id = p_transaction_bank_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'TRANSACTION_BANK_NOT_FOUND:%', p_transaction_bank_id;
        END IF;
        IF NOT v_bank.is_active THEN
          RAISE EXCEPTION 'TRANSACTION_BANK_INACTIVE:%', p_transaction_bank_id;
        END IF;

        SELECT id, is_active INTO v_transaction_type
        FROM transaction_types
        WHERE id = p_transaction_type_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'TRANSACTION_TYPE_NOT_FOUND:%', p_transaction_type_id;
        END IF;
        IF NOT v_transaction_type.is_active THEN
          RAISE EXCEPTION 'TRANSACTION_TYPE_INACTIVE:%', p_transaction_type_id;
        END IF;

        -- Never trusts the TypeScript-layer client existence/active check
        -- alone — a manipulated request that slips a bogus/inactive client
        -- id past that layer is still rejected here.
        IF p_client_id IS NOT NULL THEN
          PERFORM 1 FROM clients WHERE id = p_client_id AND is_active = true;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'BANK_DEPOSIT_CLIENT_INVALID:%', p_transaction_bank_id;
          END IF;
        END IF;

        IF p_cash_details IS NULL OR jsonb_array_length(p_cash_details) = 0 THEN
          RAISE EXCEPTION 'CASH_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        IF p_transaction_amounts IS NULL OR jsonb_array_length(p_transaction_amounts) = 0 THEN
          RAISE EXCEPTION 'TRANSACTION_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        INSERT INTO bank_deposit_operations (
          transaction_bank_id, total_amount, transaction_count,
          total_cash, total_distributed, operation_date, user_id, client_name,
          transaction_type_id, change_given, client_id
        ) VALUES (
          p_transaction_bank_id, p_total_amount, jsonb_array_length(p_transaction_amounts),
          0, 0, p_operation_date, p_user_id, NULLIF(TRIM(p_client_name), ''),
          p_transaction_type_id, v_change_given, p_client_id
        )
        RETURNING id INTO v_operation_id;

        FOR v_cash_item IN SELECT * FROM jsonb_array_elements(p_cash_details)
        LOOP
          v_denomination := (v_cash_item->>'denomination')::NUMERIC(10,2);
          v_quantity := (v_cash_item->>'quantity')::INT;

          IF v_denomination IS NULL OR v_denomination <= 0
             OR v_quantity IS NULL OR v_quantity < 0 THEN
            RAISE EXCEPTION 'INVALID_CASH_QUANTITY:%', p_transaction_bank_id;
          END IF;

          INSERT INTO bank_deposit_cash_details (operation_id, denomination, quantity, subtotal)
          VALUES (v_operation_id, v_denomination, v_quantity, v_denomination * v_quantity);

          v_total_cash := v_total_cash + (v_denomination * v_quantity);
        END LOOP;

        FOR v_amount_text IN SELECT * FROM jsonb_array_elements_text(p_transaction_amounts)
        LOOP
          v_sequence := v_sequence + 1;
          v_amount := v_amount_text::NUMERIC(14,2);

          IF v_amount IS NULL OR v_amount <= 0 THEN
            RAISE EXCEPTION 'TRANSACTION_TOTAL_MISMATCH:%', p_transaction_bank_id;
          END IF;

          INSERT INTO bank_deposit_transactions (operation_id, sequence, amount)
          VALUES (v_operation_id, v_sequence, v_amount);

          v_total_distributed := v_total_distributed + v_amount;
        END LOOP;

        IF v_change_given > v_total_cash THEN
          RAISE EXCEPTION 'INVALID_CHANGE_GIVEN:%', p_transaction_bank_id;
        END IF;

        IF (v_total_cash - v_change_given) <> p_total_amount THEN
          RAISE EXCEPTION 'CASH_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        IF v_total_distributed <> p_total_amount THEN
          RAISE EXCEPTION 'TRANSACTION_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        UPDATE bank_deposit_operations
        SET total_cash = v_total_cash, total_distributed = v_total_distributed
        WHERE id = v_operation_id;

        RETURN v_operation_id;
      END;
      $fn$;
    `);

    // ==================================================================
    // register_account_receivable_movement — gains
    // `p_reference_type VARCHAR DEFAULT NULL, p_reference_id UUID DEFAULT
    // NULL`. Body otherwise byte-identical to `CreateFinancialKardexColumns`'s
    // version — every existing caller (the standalone "Registrar Cargo"/
    // "Registrar Abono" endpoints) omits both, so every historical and
    // future non-Transaccionar movement keeps getting NULL/NULL, exactly
    // as before this migration.
    // ==================================================================
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_account_receivable_movement(UUID, VARCHAR, NUMERIC, DATE, VARCHAR, UUID)',
    );

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_account_receivable_movement(
        p_client_id UUID,
        p_type VARCHAR,
        p_amount NUMERIC,
        p_date DATE,
        p_description VARCHAR,
        p_user_id UUID,
        p_reference_type VARCHAR DEFAULT NULL,
        p_reference_id UUID DEFAULT NULL
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
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
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_account_receivable_movement(UUID, VARCHAR, NUMERIC, DATE, VARCHAR, UUID, VARCHAR, UUID)',
    );
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_account_receivable_movement(
        p_client_id UUID,
        p_type VARCHAR,
        p_amount NUMERIC,
        p_date DATE,
        p_description VARCHAR,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
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

        INSERT INTO accounts_receivable (client_id, date, amount, description, movement_type, created_by)
        VALUES (p_client_id, p_date, p_amount, p_description, p_type, p_user_id)
        RETURNING id INTO v_id;

        RETURN v_id;
      END;
      $fn$;
    `);

    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_bank_deposit_operation(UUID, NUMERIC, DATE, JSONB, JSONB, UUID, UUID, VARCHAR, NUMERIC, UUID)',
    );
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_bank_deposit_operation(
        p_transaction_bank_id UUID,
        p_total_amount NUMERIC,
        p_operation_date DATE,
        p_cash_details JSONB,
        p_transaction_amounts JSONB,
        p_user_id UUID,
        p_transaction_type_id UUID,
        p_client_name VARCHAR DEFAULT NULL,
        p_change_given NUMERIC DEFAULT 0
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_bank RECORD;
        v_transaction_type RECORD;
        v_operation_id UUID;
        v_cash_item JSONB;
        v_denomination NUMERIC(10,2);
        v_quantity INT;
        v_total_cash NUMERIC(14,2) := 0;
        v_amount_text TEXT;
        v_amount NUMERIC(14,2);
        v_sequence INT := 0;
        v_total_distributed NUMERIC(14,2) := 0;
        v_change_given NUMERIC(14,2) := COALESCE(p_change_given, 0);
      BEGIN
        IF p_total_amount IS NULL OR p_total_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_DEPOSIT_AMOUNT:%', p_transaction_bank_id;
        END IF;

        IF p_operation_date IS NULL THEN
          RAISE EXCEPTION 'INVALID_DEPOSIT_AMOUNT:%', p_transaction_bank_id;
        END IF;

        IF v_change_given < 0 THEN
          RAISE EXCEPTION 'INVALID_CHANGE_GIVEN:%', p_transaction_bank_id;
        END IF;

        SELECT id, is_active INTO v_bank
        FROM transaction_banks
        WHERE id = p_transaction_bank_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'TRANSACTION_BANK_NOT_FOUND:%', p_transaction_bank_id;
        END IF;
        IF NOT v_bank.is_active THEN
          RAISE EXCEPTION 'TRANSACTION_BANK_INACTIVE:%', p_transaction_bank_id;
        END IF;

        SELECT id, is_active INTO v_transaction_type
        FROM transaction_types
        WHERE id = p_transaction_type_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'TRANSACTION_TYPE_NOT_FOUND:%', p_transaction_type_id;
        END IF;
        IF NOT v_transaction_type.is_active THEN
          RAISE EXCEPTION 'TRANSACTION_TYPE_INACTIVE:%', p_transaction_type_id;
        END IF;

        IF p_cash_details IS NULL OR jsonb_array_length(p_cash_details) = 0 THEN
          RAISE EXCEPTION 'CASH_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        IF p_transaction_amounts IS NULL OR jsonb_array_length(p_transaction_amounts) = 0 THEN
          RAISE EXCEPTION 'TRANSACTION_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        INSERT INTO bank_deposit_operations (
          transaction_bank_id, total_amount, transaction_count,
          total_cash, total_distributed, operation_date, user_id, client_name,
          transaction_type_id, change_given
        ) VALUES (
          p_transaction_bank_id, p_total_amount, jsonb_array_length(p_transaction_amounts),
          0, 0, p_operation_date, p_user_id, NULLIF(TRIM(p_client_name), ''),
          p_transaction_type_id, v_change_given
        )
        RETURNING id INTO v_operation_id;

        FOR v_cash_item IN SELECT * FROM jsonb_array_elements(p_cash_details)
        LOOP
          v_denomination := (v_cash_item->>'denomination')::NUMERIC(10,2);
          v_quantity := (v_cash_item->>'quantity')::INT;

          IF v_denomination IS NULL OR v_denomination <= 0
             OR v_quantity IS NULL OR v_quantity < 0 THEN
            RAISE EXCEPTION 'INVALID_CASH_QUANTITY:%', p_transaction_bank_id;
          END IF;

          INSERT INTO bank_deposit_cash_details (operation_id, denomination, quantity, subtotal)
          VALUES (v_operation_id, v_denomination, v_quantity, v_denomination * v_quantity);

          v_total_cash := v_total_cash + (v_denomination * v_quantity);
        END LOOP;

        FOR v_amount_text IN SELECT * FROM jsonb_array_elements_text(p_transaction_amounts)
        LOOP
          v_sequence := v_sequence + 1;
          v_amount := v_amount_text::NUMERIC(14,2);

          IF v_amount IS NULL OR v_amount <= 0 THEN
            RAISE EXCEPTION 'TRANSACTION_TOTAL_MISMATCH:%', p_transaction_bank_id;
          END IF;

          INSERT INTO bank_deposit_transactions (operation_id, sequence, amount)
          VALUES (v_operation_id, v_sequence, v_amount);

          v_total_distributed := v_total_distributed + v_amount;
        END LOOP;

        IF v_change_given > v_total_cash THEN
          RAISE EXCEPTION 'INVALID_CHANGE_GIVEN:%', p_transaction_bank_id;
        END IF;

        IF (v_total_cash - v_change_given) <> p_total_amount THEN
          RAISE EXCEPTION 'CASH_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        IF v_total_distributed <> p_total_amount THEN
          RAISE EXCEPTION 'TRANSACTION_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        UPDATE bank_deposit_operations
        SET total_cash = v_total_cash, total_distributed = v_total_distributed
        WHERE id = v_operation_id;

        RETURN v_operation_id;
      END;
      $fn$;
    `);

    await queryRunner.query(
      'ALTER TABLE accounts_receivable DROP CONSTRAINT IF EXISTS "CHK_accounts_receivable_reference_pair"',
    );
    await queryRunner.query(
      'ALTER TABLE accounts_receivable DROP COLUMN IF EXISTS "reference_id"',
    );
    await queryRunner.query(
      'ALTER TABLE accounts_receivable DROP COLUMN IF EXISTS "reference_type"',
    );

    await queryRunner.query(
      'DROP INDEX IF EXISTS "IDX_bank_deposit_operations_client_id"',
    );
    await queryRunner.query(
      'ALTER TABLE bank_deposit_operations DROP CONSTRAINT IF EXISTS "FK_bank_deposit_operations_client"',
    );
    await queryRunner.query(
      'ALTER TABLE bank_deposit_operations DROP COLUMN IF EXISTS "client_id"',
    );
  }
}
