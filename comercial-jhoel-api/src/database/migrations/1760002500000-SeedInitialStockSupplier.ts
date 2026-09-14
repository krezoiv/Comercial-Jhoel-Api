import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Seeds a fixed supplier ("Carga Inicial de Inventario") that the bulk
 * initial-stock Excel import (`POST /purchases/import`) attributes every
 * purchase it creates to — so that stock loaded this way is identifiable in
 * Reportería/Kardex as coming from the initial catalog load, not a real
 * supplier invoice. Same "seed inside the migration, no separate script"
 * pattern as the roles/businesses seeds.
 */
export class SeedInitialStockSupplier1760002500000
  implements MigrationInterface
{
  name = 'SeedInitialStockSupplier1760002500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "suppliers" (name) VALUES
        ('Carga Inicial de Inventario')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "suppliers" WHERE name = 'Carga Inicial de Inventario'
    `);
  }
}
