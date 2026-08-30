import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCategoriesTable1756600000000 implements MigrationInterface {
  name = 'CreateCategoriesTable1756600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '80' },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        uniques: [{ name: 'UQ_categories_name', columnNames: ['name'] }],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('categories');
  }
}
