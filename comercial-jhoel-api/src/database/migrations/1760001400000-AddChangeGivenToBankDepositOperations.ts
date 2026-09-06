import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * "Vuelto" (change given back to the client) for Transaccionar — lets a
 * deposit register correctly when the client hands over more cash than the
 * operation amount (e.g. a Q890 deposit paid with 9×Q100 = Q900, Q10 vuelto).
 * Purely additive: one nullable-safe column with a `DEFAULT 0`, so every
 * existing row is instantly and correctly `change_given = 0` — mathematically
 * identical to "no vuelto ever existed for this row", which was already
 * true for 100% of historical data (the old cuadre rule required
 * `total_cash = total_amount` exactly, so no historical row could have had
 * a real excess in the first place).
 *
 * `register_bank_deposit_operation` gains one new, defaulted trailing
 * parameter (`p_change_given NUMERIC DEFAULT 0`) — its cuadre check changes
 * from `total_cash <> total_amount` to
 * `(total_cash - change_given) <> total_amount`, which is the *exact same*
 * equation as before whenever `change_given = 0` (the default, and the only
 * value every existing caller sends) — no behavior change whatsoever for an
 * operation that doesn't use vuelto. Same "DROP the old signature first"
 * discipline this codebase already established for
 * `adjust_sale_item`/`confirm_open_sale` — Postgres identifies a function by
 * `(name, argument types)`, so adding a parameter creates a new overload
 * unless the old one is dropped explicitly first.
 */
export class AddChangeGivenToBankDepositOperations1760001400000 implements MigrationInterface {
  name = 'AddChangeGivenToBankDepositOperations1760001400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'bank_deposit_operations',
      new TableColumn({
        name: 'change_given',
        type: 'numeric',
        precision: 14,
        scale: 2,
        default: 0,
        isNullable: false,
      }),
    );

    await queryRunner.query(`
      ALTER TABLE bank_deposit_operations
      ADD CONSTRAINT "CHK_bank_deposit_operations_change_given_non_negative"
      CHECK ("change_given" >= 0)
    `);

    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_bank_deposit_operation(UUID, NUMERIC, DATE, JSONB, JSONB, UUID, UUID, VARCHAR)',
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

        -- The one real behavior change: identical to the old
        -- "v_total_cash <> p_total_amount" check whenever v_change_given = 0
        -- (every pre-existing caller, and every future caller that doesn't
        -- use vuelto) — only diverges when a real vuelto is being applied.
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
  }

  public async down(): Promise<void> {
    // No downgrade provided — same precedent as every other migration in
    // this codebase that closes a real correctness gap (see
    // `CreateInventoryLocationsAndPresentations`'s own doc comment): real
    // rows may already have a non-zero `change_given` by the time a
    // rollback would run, and reverting the function to the old exact-match
    // rule would then make those rows' own recorded cash totals appear
    // permanently "wrong" against a validation rule that no longer
    // understands vuelto.
  }
}
