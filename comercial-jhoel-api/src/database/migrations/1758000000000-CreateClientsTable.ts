import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateClientsTable1758000000000 implements MigrationInterface {
  name = 'CreateClientsTable1758000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'clients',
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
            name: 'FK_clients_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_clients_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    // Case-insensitive duplicate protection: "Juan Pérez" and "JUAN PÉREZ"
    // must be treated as the same client. TypeORM's TableIndex builder only
    // emits plain column names, not expressions, so this one index is raw
    // SQL — same escape hatch this codebase already uses for the stored
    // functions in the Bank Agents/Recargas/Sales migrations. Partial
    // (WHERE is_active = true) for the same reason as every other catalog
    // table here: a deactivated client's name can be reused by a new one.
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_clients_name_active"
      ON "clients" (LOWER("name"))
      WHERE "is_active" = true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "UQ_clients_name_active"');
    await queryRunner.dropTable('clients');
  }
}
