import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableIndex,
} from 'typeorm';

/**
 * "Tipo de Transacción" — Depósito, Retiro, Desembolso Préstamo, Pago
 * Cheque, Pago Préstamos, Pago Tarjeta de Crédito, etc. Picked on
 * Transaccionar's own dashboard *before* a deposit registration begins —
 * every `bank_deposit_operations` row from here on must carry one
 * (`transaction_type_id NOT NULL`), same reasoning as `transaction_bank_id`.
 * A flat clone of `transaction_banks`/`account_types`, plus one addition:
 * `icon`, a key into the frontend's shared icon registry, rendered on the
 * dashboard's type cards.
 */
export class AddTransactionTypesToBankDeposits1759800000000 implements MigrationInterface {
  name = 'AddTransactionTypesToBankDeposits1759800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transaction_types',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '150' },
          { name: 'icon', type: 'varchar', length: '50' },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'created_by', type: 'uuid' },
          { name: 'updated_by', type: 'uuid', isNullable: true },
        ],
        foreignKeys: [
          {
            name: 'FK_transaction_types_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_transaction_types_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'transaction_types',
      new TableIndex({
        name: 'UQ_transaction_types_name_active',
        columnNames: ['name'],
        isUnique: true,
        where: '"is_active" = true',
      }),
    );

    // NOT NULL, no default — every deposit registered from here on must
    // pick a tipo de transacción first. Safe as a plain ADD COLUMN because
    // bank_deposit_operations is still empty at this point in the app's
    // history (verified before writing this migration, not assumed).
    await queryRunner.addColumn(
      'bank_deposit_operations',
      new TableColumn({
        name: 'transaction_type_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.query(`
      ALTER TABLE bank_deposit_operations
        ADD CONSTRAINT FK_bank_deposit_operations_transaction_type
        FOREIGN KEY (transaction_type_id) REFERENCES transaction_types(id) ON DELETE RESTRICT;
    `);

    await queryRunner.createIndex(
      'bank_deposit_operations',
      new TableIndex({
        name: 'IDX_bank_deposit_operations_transaction_type_id',
        columnNames: ['transaction_type_id'],
      }),
    );

    // Postgres identifies a function by name + argument types — the new
    // p_transaction_type_id parameter has no default, so it must be
    // declared before p_client_name (Postgres requires every parameter
    // with a default to come after every parameter without one), which
    // changes the argument list. Drop the old 7-arg signature explicitly
    // so exactly one version of this function exists going forward.
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
        p_user_id UUID,
        p_transaction_type_id UUID,
        p_client_name VARCHAR DEFAULT NULL
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
          transaction_type_id
        ) VALUES (
          p_transaction_bank_id, p_total_amount, jsonb_array_length(p_transaction_amounts),
          0, 0, p_operation_date, p_user_id, NULLIF(TRIM(p_client_name), ''),
          p_transaction_type_id
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

    await queryRunner.dropIndex(
      'bank_deposit_operations',
      'IDX_bank_deposit_operations_transaction_type_id',
    );
    await queryRunner.query(
      'ALTER TABLE bank_deposit_operations DROP CONSTRAINT FK_bank_deposit_operations_transaction_type',
    );
    await queryRunner.dropColumn(
      'bank_deposit_operations',
      'transaction_type_id',
    );
    await queryRunner.dropTable('transaction_types');
  }
}
