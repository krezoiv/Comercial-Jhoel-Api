import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableUnique,
} from 'typeorm';

export class AddUsernameAndPhoneToUsers1756400000000 implements MigrationInterface {
  name = 'AddUsernameAndPhoneToUsers1756400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users created via POST /users don't have a name/email — only admin-style
    // (seeded) accounts do, so both columns become optional.
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL',
    );

    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'username',
        type: 'varchar',
        length: '30',
        isNullable: true,
      }),
      new TableColumn({
        name: 'phone',
        type: 'varchar',
        length: '20',
        isNullable: true,
      }),
    ]);

    await queryRunner.createUniqueConstraint(
      'users',
      new TableUnique({ name: 'UQ_users_username', columnNames: ['username'] }),
    );
    await queryRunner.createUniqueConstraint(
      'users',
      new TableUnique({ name: 'UQ_users_phone', columnNames: ['phone'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint('users', 'UQ_users_phone');
    await queryRunner.dropUniqueConstraint('users', 'UQ_users_username');
    await queryRunner.dropColumn('users', 'phone');
    await queryRunner.dropColumn('users', 'username');
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL',
    );
  }
}
