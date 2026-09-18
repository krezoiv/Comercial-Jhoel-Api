import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Me gusta" público para Teléfonos, Librería/Variedades y Noticias — un
 * contador simple (`likes_count`), incrementado/decrementado atómicamente
 * por `UPDATE ... SET likes_count = GREATEST(0, likes_count + $delta)` en
 * cada repositorio (nunca leído-luego-escrito desde la aplicación, así que
 * dos likes concurrentes nunca se pisan). Sin tabla de "quién dio like" —
 * no hay cuentas de visitante en la landing pública; el frontend recuerda
 * localmente (localStorage) si ese navegador ya dio like, para poder
 * alternar el botón, pero el conteo real siempre vive aquí. Puramente
 * aditivo, `DEFAULT 0` respalda cada fila existente.
 */
export class AddLikesToPublicCatalogEntities1760003500000
  implements MigrationInterface
{
  name = 'AddLikesToPublicCatalogEntities1760003500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE catalog_phones ADD COLUMN likes_count INTEGER NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE catalog_products ADD COLUMN likes_count INTEGER NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE news_articles ADD COLUMN likes_count INTEGER NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE news_articles DROP COLUMN likes_count`);
    await queryRunner.query(`ALTER TABLE catalog_products DROP COLUMN likes_count`);
    await queryRunner.query(`ALTER TABLE catalog_phones DROP COLUMN likes_count`);
  }
}
