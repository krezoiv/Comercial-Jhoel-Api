import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateProductsTable1756700000000 implements MigrationInterface {
  name = 'CreateProductsTable1756700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '150' },
          { name: 'category_id', type: 'uuid' },
          { name: 'cost_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'public_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'wholesale_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'stock', type: 'int', default: 0 },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_products_category',
            columnNames: ['category_id'],
            referencedTableName: 'categories',
            referencedColumnNames: ['id'],
            // A category with products can't be hard-deleted — categories are
            // soft-deleted (isActive=false) instead, so this never fires in
            // practice, but it's the correct guarantee to have regardless.
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'IDX_products_category_id',
        columnNames: ['category_id'],
      }),
    );
    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'IDX_products_is_active',
        columnNames: ['is_active'],
      }),
    );
    // Partial unique index: a name is unique only among *active* products,
    // so a deactivated product's name can be reused by a new one.
    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'UQ_products_name_active',
        columnNames: ['name'],
        isUnique: true,
        where: '"is_active" = true',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
