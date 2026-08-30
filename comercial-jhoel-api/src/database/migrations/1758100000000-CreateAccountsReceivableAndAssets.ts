import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

// Both tables are structurally identical (client_id FK, date, amount, description,
// soft delete, audit) — combined in one migration since this ticket delivers both
// together, same reasoning as CreateBankAgentsModule bundling account_types/banks/
// bank_balances. `date` is a plain DATE column (not timestamptz) per the ticket's
// explicit requirement, mirroring recharge_daily_balances.date/bank_balances.
// operation_date — avoids any timezone-driven date shift. `amount` is NUMERIC(12,2),
// never FLOAT, with a DB-level CHECK > 0 as the last line of defense behind the
// DTO's own @Min(0.01) validation.
export class CreateAccountsReceivableAndAssets1758100000000
  implements MigrationInterface
{
  name = 'CreateAccountsReceivableAndAssets1758100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accounts_receivable',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'client_id', type: 'uuid' },
          { name: 'date', type: 'date' },
          { name: 'amount', type: 'numeric', precision: 12, scale: 2 },
          {
            name: 'description',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'created_by', type: 'uuid' },
          { name: 'updated_by', type: 'uuid', isNullable: true },
        ],
        foreignKeys: [
          {
            name: 'FK_accounts_receivable_client',
            columnNames: ['client_id'],
            referencedTableName: 'clients',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_accounts_receivable_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_accounts_receivable_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.query(`
      ALTER TABLE "accounts_receivable"
      ADD CONSTRAINT "CHK_accounts_receivable_amount_positive" CHECK ("amount" > 0)
    `);

    await queryRunner.createIndex(
      'accounts_receivable',
      new TableIndex({
        name: 'IDX_accounts_receivable_client_id',
        columnNames: ['client_id'],
      }),
    );
    await queryRunner.createIndex(
      'accounts_receivable',
      new TableIndex({
        name: 'IDX_accounts_receivable_date',
        columnNames: ['date'],
      }),
    );
    await queryRunner.createIndex(
      'accounts_receivable',
      new TableIndex({
        name: 'IDX_accounts_receivable_is_active',
        columnNames: ['is_active'],
      }),
    );

    // ------------------------------------------------------------------
    // assets — verified before writing this migration that no "activos"/
    // "assets" table or module already exists anywhere in this codebase
    // (grepped migrations and src/modules); this is a genuinely new table,
    // not a duplicate of anything.
    // ------------------------------------------------------------------
    await queryRunner.createTable(
      new Table({
        name: 'assets',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'client_id', type: 'uuid' },
          { name: 'date', type: 'date' },
          { name: 'amount', type: 'numeric', precision: 12, scale: 2 },
          {
            name: 'description',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'created_by', type: 'uuid' },
          { name: 'updated_by', type: 'uuid', isNullable: true },
        ],
        foreignKeys: [
          {
            name: 'FK_assets_client',
            columnNames: ['client_id'],
            referencedTableName: 'clients',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_assets_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_assets_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.query(`
      ALTER TABLE "assets"
      ADD CONSTRAINT "CHK_assets_amount_positive" CHECK ("amount" > 0)
    `);

    await queryRunner.createIndex(
      'assets',
      new TableIndex({
        name: 'IDX_assets_client_id',
        columnNames: ['client_id'],
      }),
    );
    await queryRunner.createIndex(
      'assets',
      new TableIndex({ name: 'IDX_assets_date', columnNames: ['date'] }),
    );
    await queryRunner.createIndex(
      'assets',
      new TableIndex({
        name: 'IDX_assets_is_active',
        columnNames: ['is_active'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('assets');
    await queryRunner.dropTable('accounts_receivable');
  }
}
