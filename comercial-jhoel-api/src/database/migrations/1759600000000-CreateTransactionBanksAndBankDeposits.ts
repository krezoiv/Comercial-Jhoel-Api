import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTransactionBanksAndBankDeposits1759600000000 implements MigrationInterface {
  name = 'CreateTransactionBanksAndBankDeposits1759600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ------------------------------------------------------------------
    // transaction_banks — "Banco Agente", the simple catalog Transaccionar's
    // dropdown reads from. Deliberately separate from `banks` (the heavier
    // Agentes Bancarios entity with account_number/previous_balance/
    // final_balance, coupled to Cuadre de Agentes) — this is a flat clone
    // of account_types, same partial-unique-active pattern.
    // ------------------------------------------------------------------
    await queryRunner.createTable(
      new Table({
        name: 'transaction_banks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '150' },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'created_by', type: 'uuid' },
          { name: 'updated_by', type: 'uuid', isNullable: true },
        ],
        foreignKeys: [
          {
            name: 'FK_transaction_banks_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_transaction_banks_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'transaction_banks',
      new TableIndex({
        name: 'UQ_transaction_banks_name_active',
        columnNames: ['name'],
        isUnique: true,
        where: '"is_active" = true',
      }),
    );

    // ------------------------------------------------------------------
    // bank_deposit_operations / _cash_details / _transactions — one
    // "Transaccionar" registration: a total amount, its physical cash
    // breakdown, and the N sub-transactions it was split into for the
    // deposit. total_cash/total_distributed are always server-recomputed
    // and equal to total_amount by construction — see
    // register_bank_deposit_operation() below, which rolls back the whole
    // operation otherwise. operation_date is a plain DATE, same reasoning
    // as bank_balances.operation_date: a calendar business day, not an
    // instant.
    // ------------------------------------------------------------------
    await queryRunner.createTable(
      new Table({
        name: 'bank_deposit_operations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'transaction_bank_id', type: 'uuid' },
          { name: 'total_amount', type: 'numeric', precision: 14, scale: 2 },
          { name: 'transaction_count', type: 'int' },
          {
            name: 'total_cash',
            type: 'numeric',
            precision: 14,
            scale: 2,
            default: 0,
          },
          {
            name: 'total_distributed',
            type: 'numeric',
            precision: 14,
            scale: 2,
            default: 0,
          },
          { name: 'operation_date', type: 'date' },
          { name: 'user_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_bank_deposit_operations_transaction_bank',
            columnNames: ['transaction_bank_id'],
            referencedTableName: 'transaction_banks',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_bank_deposit_operations_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'bank_deposit_operations',
      new TableIndex({
        name: 'IDX_bank_deposit_operations_transaction_bank_id',
        columnNames: ['transaction_bank_id'],
      }),
    );
    await queryRunner.createIndex(
      'bank_deposit_operations',
      new TableIndex({
        name: 'IDX_bank_deposit_operations_operation_date',
        columnNames: ['operation_date'],
      }),
    );
    await queryRunner.createIndex(
      'bank_deposit_operations',
      new TableIndex({
        name: 'IDX_bank_deposit_operations_user_id',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.query(`
      ALTER TABLE bank_deposit_operations
        ADD CONSTRAINT CHK_bank_deposit_operations_total_amount_positive CHECK (total_amount > 0),
        ADD CONSTRAINT CHK_bank_deposit_operations_transaction_count_positive CHECK (transaction_count > 0);
    `);

    await queryRunner.createTable(
      new Table({
        name: 'bank_deposit_cash_details',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'operation_id', type: 'uuid' },
          { name: 'denomination', type: 'numeric', precision: 10, scale: 2 },
          { name: 'quantity', type: 'int' },
          { name: 'subtotal', type: 'numeric', precision: 14, scale: 2 },
        ],
        foreignKeys: [
          {
            // CASCADE, unlike every other FK in this migration — a cash-detail
            // row has no independent existence outside the operation it
            // belongs to, same reasoning as sale_details -> sales.
            name: 'FK_bank_deposit_cash_details_operation',
            columnNames: ['operation_id'],
            referencedTableName: 'bank_deposit_operations',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'bank_deposit_cash_details',
      new TableIndex({
        name: 'IDX_bank_deposit_cash_details_operation_id',
        columnNames: ['operation_id'],
      }),
    );

    await queryRunner.query(`
      ALTER TABLE bank_deposit_cash_details
        ADD CONSTRAINT CHK_bank_deposit_cash_details_quantity_non_negative CHECK (quantity >= 0);
    `);

    await queryRunner.createTable(
      new Table({
        name: 'bank_deposit_transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'operation_id', type: 'uuid' },
          { name: 'sequence', type: 'int' },
          { name: 'amount', type: 'numeric', precision: 14, scale: 2 },
        ],
        foreignKeys: [
          {
            name: 'FK_bank_deposit_transactions_operation',
            columnNames: ['operation_id'],
            referencedTableName: 'bank_deposit_operations',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'bank_deposit_transactions',
      new TableIndex({
        name: 'IDX_bank_deposit_transactions_operation_id',
        columnNames: ['operation_id'],
      }),
    );

    await queryRunner.query(`
      ALTER TABLE bank_deposit_transactions
        ADD CONSTRAINT CHK_bank_deposit_transactions_amount_positive CHECK (amount > 0);
    `);

    // ------------------------------------------------------------------
    // register_bank_deposit_operation: the single atomic write behind
    // "Transaccionar". FUNCTION, not PROCEDURE, same reasoning repeated
    // across every other critical operation in this codebase
    // (confirm_sale, confirm_purchase, save_bank_balance...): it runs
    // inside the caller's transaction, so any RAISE EXCEPTION rolls back
    // everything it already inserted.
    //
    // Never trusts the frontend's own totals — total_cash/total_distributed
    // are recomputed here from the actual rows being inserted, and the
    // operation is rejected outright (full rollback) unless both equal
    // p_total_amount exactly. This is what makes it impossible to save a
    // descuadrada operation no matter what the client sends.
    //
    // Day-open/closed gating is NOT here — same split as every other
    // module in this codebase (SaveBankBalancesUseCase/CloseAgentDayUseCase):
    // the SQL function does data integrity, the TypeScript use case does
    // the día-abierto/cerrado check against DAY_OPENING_REPOSITORY
    // (imported from BanksModule, reusing the same cycle Cuadre de Agentes
    // uses rather than a parallel one).
    // ------------------------------------------------------------------
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_bank_deposit_operation(UUID, NUMERIC, DATE, JSONB, JSONB, UUID)',
    );
    await queryRunner.dropTable('bank_deposit_transactions');
    await queryRunner.dropTable('bank_deposit_cash_details');
    await queryRunner.dropTable('bank_deposit_operations');
    await queryRunner.dropTable('transaction_banks');
  }
}
