import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * "Modo Claro / Modo Oscuro por usuario" — preferencia individual de tema,
 * persistida en la propia fila de `users` (no se creó una tabla aparte:
 * es un único valor controlado, exactamente el caso que esta app ya
 * modela como una columna simple — ver `is_active`, `role_id`).
 *
 * Puramente aditiva: `ADD COLUMN ... NOT NULL DEFAULT 'LIGHT'` puebla
 * automáticamente la columna en cada fila existente con el valor por
 * defecto (comportamiento estándar de Postgres para un `DEFAULT`
 * constante) — ningún usuario existente queda con esta columna nula ni
 * pierde datos. El `CHECK` constraint es el mismo patrón de "enum como
 * varchar + constraint" que esta base de datos no había usado literal
 * (roles usa una tabla propia), pero es la solución más simple y
 * suficiente para dos valores fijos, reforzando a nivel de base de datos
 * la misma validación que ya hace `UpdateThemeRequestDto` en la capa de
 * presentación (defensa en profundidad, no la única barrera).
 */
export class AddThemeToUsers1758800000000 implements MigrationInterface {
  name = 'AddThemeToUsers1758800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'theme',
        type: 'varchar',
        length: '10',
        isNullable: false,
        default: `'LIGHT'`,
      }),
    );

    await queryRunner.query(`
      ALTER TABLE users
      ADD CONSTRAINT "CHK_users_theme" CHECK (theme IN ('LIGHT', 'DARK'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE users DROP CONSTRAINT IF EXISTS "CHK_users_theme"',
    );
    await queryRunner.dropColumn('users', 'theme');
  }
}
