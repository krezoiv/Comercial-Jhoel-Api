import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateRolesAndUserRoles1756500000000 implements MigrationInterface {
  name = 'CreateRolesAndUserRoles1756500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '30' },
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
        uniques: [{ name: 'UQ_roles_name', columnNames: ['name'] }],
      }),
    );

    // Seeded here (not a separate script) so a fresh deploy never depends on
    // someone remembering to run a seeder manually.
    await queryRunner.query(`
      INSERT INTO "roles" (name, description) VALUES
        ('SUPER_ADMIN', 'Acceso total al sistema, incluida la gestión de roles y usuarios.'),
        ('ADMIN', 'Gestión de productos, categorías e inventario.'),
        ('USER', 'Acceso estándar sin permisos administrativos.')
    `);

    await queryRunner.addColumn(
      'users',
      new TableColumn({ name: 'role_id', type: 'uuid', isNullable: true }),
    );

    // Every account that predates this migration is the seeded admin
    // dashboard login, so ADMIN is the safe default backfill — not
    // SUPER_ADMIN (too powerful) and not USER (would lock the admin out of
    // the panel it already uses).
    await queryRunner.query(`
      UPDATE "users" SET "role_id" = (SELECT id FROM "roles" WHERE name = 'ADMIN') WHERE "role_id" IS NULL
    `);

    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "role_id" SET NOT NULL',
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'FK_users_role',
        columnNames: ['role_id'],
        referencedTableName: 'roles',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'FK_users_role');
    await queryRunner.dropColumn('users', 'role_id');
    await queryRunner.dropTable('roles');
  }
}
