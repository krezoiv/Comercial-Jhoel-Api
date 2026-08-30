import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddSkuToProducts1756900000000 implements MigrationInterface {
  name = 'AddSkuToProducts1756900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'sku',
        type: 'varchar',
        length: '64',
        isNullable: true,
      }),
    );

    // Partial unique index, same pattern as UQ_products_name_active: a SKU is
    // unique only among *active* products (a deactivated product's barcode
    // can be reused), and Postgres never treats two NULLs as equal under a
    // unique index, so products without a SKU never collide with each other.
    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'UQ_products_sku_active',
        columnNames: ['sku'],
        isUnique: true,
        where: '"is_active" = true',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('products', 'UQ_products_sku_active');
    await queryRunner.dropColumn('products', 'sku');
  }
}
