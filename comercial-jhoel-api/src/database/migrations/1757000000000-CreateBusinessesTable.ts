import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateBusinessesTable1757000000000 implements MigrationInterface {
  name = 'CreateBusinessesTable1757000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'businesses',
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
        uniques: [{ name: 'UQ_businesses_name', columnNames: ['name'] }],
      }),
    );

    // Seeded here (not a separate script), same reasoning as the roles
    // migration: a fresh deploy never depends on someone remembering to run
    // a seeder. Only "Librería" is seeded — it's the one every pre-existing
    // product gets backfilled to below; other lines of business (Tienda,
    // Heladería, ...) are for an admin to add through the new CRUD screen.
    await queryRunner.query(`
      INSERT INTO "businesses" (name, description) VALUES
        ('Librería', 'Productos de librería y útiles escolares.')
    `);

    await queryRunner.addColumn(
      'products',
      new TableColumn({ name: 'business_id', type: 'uuid', isNullable: true }),
    );

    await queryRunner.query(`
      UPDATE "products" SET "business_id" = (SELECT id FROM "businesses" WHERE name = 'Librería') WHERE "business_id" IS NULL
    `);

    await queryRunner.query(
      'ALTER TABLE "products" ALTER COLUMN "business_id" SET NOT NULL',
    );

    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        name: 'FK_products_business',
        columnNames: ['business_id'],
        referencedTableName: 'businesses',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'IDX_products_business_id',
        columnNames: ['business_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('products', 'IDX_products_business_id');
    await queryRunner.dropForeignKey('products', 'FK_products_business');
    await queryRunner.dropColumn('products', 'business_id');
    await queryRunner.dropTable('businesses');
  }
}
