import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateBankAgentsModule1757900000000 implements MigrationInterface {
  name = 'CreateBankAgentsModule1757900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'account_types',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '80' },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'created_by', type: 'uuid' },
          { name: 'updated_by', type: 'uuid', isNullable: true },
        ],
        foreignKeys: [
          {
            name: 'FK_account_types_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_account_types_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    // Same partial-unique-active pattern as products.name/ice_creams.product —
    // a deactivated account type's name can be reused by a new one.
    await queryRunner.createIndex(
      'account_types',
      new TableIndex({
        name: 'UQ_account_types_name_active',
        columnNames: ['name'],
        isUnique: true,
        where: '"is_active" = true',
      }),
    );

    // ------------------------------------------------------------------
    // banks — account_number is VARCHAR on purpose: it is an identifier,
    // never an operand in arithmetic, so it must never be stored as
    // INTEGER/BIGINT (that would silently drop leading zeros, e.g.
    // "001234567890" would become "1234567890"). previous_balance/
    // final_balance here are the bank's *configured opening balance*
    // (set at creation, editable via Sistema → Bancos) — they are the
    // fallback previous_balance used only for a bank's very first-ever
    // cuadre in bank_balances; every later cuadre resolves its previous
    // balance from bank_balances itself (see save_bank_balance() below).
    // ------------------------------------------------------------------
    await queryRunner.createTable(
      new Table({
        name: 'banks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '150' },
          { name: 'account_number', type: 'varchar', length: '34' },
          { name: 'account_type_id', type: 'uuid' },
          {
            name: 'previous_balance',
            type: 'numeric',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'final_balance',
            type: 'numeric',
            precision: 12,
            scale: 2,
            default: 0,
          },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'created_by', type: 'uuid' },
          { name: 'updated_by', type: 'uuid', isNullable: true },
        ],
        foreignKeys: [
          {
            name: 'FK_banks_account_type',
            columnNames: ['account_type_id'],
            referencedTableName: 'account_types',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_banks_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_banks_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    // A deactivated bank's name+account_number combination can be reused,
    // same partial-unique-active pattern as every other catalog table here.
    await queryRunner.createIndex(
      'banks',
      new TableIndex({
        name: 'UQ_banks_name_account_number_active',
        columnNames: ['name', 'account_number'],
        isUnique: true,
        where: '"is_active" = true',
      }),
    );
    await queryRunner.createIndex(
      'banks',
      new TableIndex({
        name: 'IDX_banks_account_type_id',
        columnNames: ['account_type_id'],
      }),
    );

    await queryRunner.query(`
      ALTER TABLE banks
        ADD CONSTRAINT CHK_banks_previous_balance_non_negative CHECK (previous_balance >= 0),
        ADD CONSTRAINT CHK_banks_final_balance_non_negative CHECK (final_balance >= 0);
    `);

    // ------------------------------------------------------------------
    // bank_balances — the daily cuadre history for each bank. operation_date
    // is a plain DATE (not TIMESTAMPTZ): it's a calendar day the user
    // picked, not an instant in time, and must never shift under timezone
    // conversion the way created_at legitimately can.
    // ------------------------------------------------------------------
    await queryRunner.createTable(
      new Table({
        name: 'bank_balances',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'bank_id', type: 'uuid' },
          { name: 'operation_date', type: 'date' },
          {
            name: 'previous_balance',
            type: 'numeric',
            precision: 12,
            scale: 2,
          },
          { name: 'final_balance', type: 'numeric', precision: 12, scale: 2 },
          { name: 'user_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_bank_balances_bank',
            columnNames: ['bank_id'],
            referencedTableName: 'banks',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_bank_balances_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
        uniques: [
          {
            name: 'UQ_bank_balances_bank_id_operation_date',
            columnNames: ['bank_id', 'operation_date'],
          },
        ],
      }),
    );

    await queryRunner.query(`
      ALTER TABLE bank_balances
        ADD CONSTRAINT CHK_bank_balances_previous_balance_non_negative CHECK (previous_balance >= 0),
        ADD CONSTRAINT CHK_bank_balances_final_balance_non_negative CHECK (final_balance >= 0);
    `);

    // ------------------------------------------------------------------
    // save_bank_balance: the single atomic operation behind "Guardar
    // Cambios" in Agentes Bancarios → Bancos.
    //
    // FUNCTION, not PROCEDURE — same reasoning repeated across every other
    // critical operation in this codebase (confirm_sale, confirm_purchase,
    // register_recharge_final_balance...): it runs inside the caller's
    // transaction, so a RAISE EXCEPTION rolls back everything it did, and
    // it returns the new/updated row's id directly from a plain SELECT.
    //
    // Previous balance is *never* trusted from the caller — it is always
    // resolved here from the most recent bank_balances row strictly before
    // p_operation_date, falling back to the bank's configured opening
    // previous_balance when this is that bank's first-ever cuadre. This
    // makes back-dating a cuadre (picking a past date) resolve correctly
    // instead of trusting whatever the frontend last displayed.
    //
    // One row per (bank, date): a second save for a date that already has
    // a row updates it in place (ON CONFLICT DO UPDATE) rather than
    // rejecting it or creating a duplicate — the "Guardar Cambios" action
    // is a correction-friendly upsert, matching this ticket's own
    // "no crear duplicados / actualizar el registro existente" rule.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION save_bank_balance(
        p_bank_id UUID,
        p_operation_date DATE,
        p_final_balance NUMERIC,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_bank RECORD;
        v_previous_balance NUMERIC(12,2);
        v_balance_id UUID;
      BEGIN
        IF p_operation_date IS NULL THEN
          RAISE EXCEPTION 'INVALID_OPERATION_DATE:%', p_bank_id;
        END IF;

        IF p_final_balance IS NULL OR p_final_balance < 0 THEN
          RAISE EXCEPTION 'INVALID_FINAL_BALANCE:%', p_bank_id;
        END IF;

        SELECT id, is_active, previous_balance INTO v_bank FROM banks WHERE id = p_bank_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'BANK_NOT_FOUND:%', p_bank_id;
        END IF;
        IF NOT v_bank.is_active THEN
          RAISE EXCEPTION 'BANK_INACTIVE:%', p_bank_id;
        END IF;

        SELECT final_balance INTO v_previous_balance
        FROM bank_balances
        WHERE bank_id = p_bank_id AND operation_date < p_operation_date
        ORDER BY operation_date DESC
        LIMIT 1;

        IF v_previous_balance IS NULL THEN
          v_previous_balance := COALESCE(v_bank.previous_balance, 0);
        END IF;

        INSERT INTO bank_balances (bank_id, operation_date, previous_balance, final_balance, user_id)
        VALUES (p_bank_id, p_operation_date, v_previous_balance, p_final_balance, p_user_id)
        ON CONFLICT (bank_id, operation_date)
        DO UPDATE SET
          previous_balance = EXCLUDED.previous_balance,
          final_balance = EXCLUDED.final_balance,
          user_id = EXCLUDED.user_id,
          updated_at = now()
        RETURNING id INTO v_balance_id;

        RETURN v_balance_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS save_bank_balance(UUID, DATE, NUMERIC, UUID)',
    );
    await queryRunner.dropTable('bank_balances');
    await queryRunner.dropTable('banks');
    await queryRunner.dropTable('account_types');
  }
}
