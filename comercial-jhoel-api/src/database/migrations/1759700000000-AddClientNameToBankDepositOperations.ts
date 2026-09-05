import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * "Nombre de Cliente" — a free-text field on a Transaccionar deposit, typed
 * by whoever registers it, never looked up against `clients` (that table
 * models accounts-receivable customers, a different concept entirely —
 * Transaccionar's "cliente" is just a label for whose deposit this was).
 * Nullable and optional everywhere, same as `products.sku`: not every
 * deposit will have one recorded.
 */
export class AddClientNameToBankDepositOperations1759700000000 implements MigrationInterface {
  name = 'AddClientNameToBankDepositOperations1759700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'bank_deposit_operations',
      new TableColumn({
        name: 'client_name',
        type: 'varchar',
        length: '150',
        isNullable: true,
      }),
    );

    // Postgres identifies a function by name + argument types, so adding a
    // new trailing parameter creates a second overload rather than
    // replacing the original — drop the old 6-arg signature explicitly so
    // exactly one version of this function exists going forward.
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_bank_deposit_operation(UUID, NUMERIC, DATE, JSONB, JSONB, UUID)',
    );

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_bank_deposit_operation(
        p_transaction_bank_id UUID,
        p_total_amount NUMERIC,
        p_operation_date DATE,
        p_cash_details JSONB,
        p_transaction_amounts JSONB,
        p_user_id UUID,
        p_client_name VARCHAR DEFAULT NULL
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_bank RECORD;
        v_operation_id UUID;
        v_cash_item JSONB;
        v_denomination NUMERIC(10,2);
        v_quantity INT;
        v_total_cash NUMERIC(14,2) := 0;
        v_amount_text TEXT;
        v_amount NUMERIC(14,2);
        v_sequence INT := 0;
        v_total_distributed NUMERIC(14,2) := 0;
      BEGIN
        IF p_total_amount IS NULL OR p_total_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_DEPOSIT_AMOUNT:%', p_transaction_bank_id;
        END IF;

        IF p_operation_date IS NULL THEN
          RAISE EXCEPTION 'INVALID_DEPOSIT_AMOUNT:%', p_transaction_bank_id;
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

        IF p_cash_details IS NULL OR jsonb_array_length(p_cash_details) = 0 THEN
          RAISE EXCEPTION 'CASH_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        IF p_transaction_amounts IS NULL OR jsonb_array_length(p_transaction_amounts) = 0 THEN
          RAISE EXCEPTION 'TRANSACTION_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        INSERT INTO bank_deposit_operations (
          transaction_bank_id, total_amount, transaction_count,
          total_cash, total_distributed, operation_date, user_id, client_name
        ) VALUES (
          p_transaction_bank_id, p_total_amount, jsonb_array_length(p_transaction_amounts),
          0, 0, p_operation_date, p_user_id, NULLIF(TRIM(p_client_name), '')
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

        IF v_total_cash <> p_total_amount THEN
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_bank_deposit_operation(UUID, NUMERIC, DATE, JSONB, JSONB, UUID, VARCHAR)',
    );
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_bank_deposit_operation(
        p_transaction_bank_id UUID,
        p_total_amount NUMERIC,
        p_operation_date DATE,
        p_cash_details JSONB,
        p_transaction_amounts JSONB,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_bank RECORD;
        v_operation_id UUID;
        v_cash_item JSONB;
        v_denomination NUMERIC(10,2);
        v_quantity INT;
        v_total_cash NUMERIC(14,2) := 0;
        v_amount_text TEXT;
        v_amount NUMERIC(14,2);
        v_sequence INT := 0;
        v_total_distributed NUMERIC(14,2) := 0;
      BEGIN
        IF p_total_amount IS NULL OR p_total_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_DEPOSIT_AMOUNT:%', p_transaction_bank_id;
        END IF;

        IF p_operation_date IS NULL THEN
          RAISE EXCEPTION 'INVALID_DEPOSIT_AMOUNT:%', p_transaction_bank_id;
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

        IF p_cash_details IS NULL OR jsonb_array_length(p_cash_details) = 0 THEN
          RAISE EXCEPTION 'CASH_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        IF p_transaction_amounts IS NULL OR jsonb_array_length(p_transaction_amounts) = 0 THEN
          RAISE EXCEPTION 'TRANSACTION_TOTAL_MISMATCH:%', p_transaction_bank_id;
        END IF;

        INSERT INTO bank_deposit_operations (
          transaction_bank_id, total_amount, transaction_count,
          total_cash, total_distributed, operation_date, user_id
        ) VALUES (
          p_transaction_bank_id, p_total_amount, jsonb_array_length(p_transaction_amounts),
          0, 0, p_operation_date, p_user_id
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

        IF v_total_cash <> p_total_amount THEN
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
    await queryRunner.dropColumn('bank_deposit_operations', 'client_name');
  }
}
