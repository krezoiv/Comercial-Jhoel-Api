import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * A genuine singleton table — always exactly one row, seeded here. Holds
 * the ONE truly-global alert setting this ticket needs
 * (`purchase_payment_alert_days`, no per-entity home to live on the way
 * `min_stock`/`min_balance` live on their own owning tables). Deliberately
 * NOT a generic key-value settings table — that would be solving a problem
 * this ticket doesn't have yet (only one global scalar exists today); a
 * second global setting later is just one more column on this same row,
 * not a schema redesign.
 */
export class CreateAlertSettings1760000300000 implements MigrationInterface {
  name = 'CreateAlertSettings1760000300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'alert_settings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'purchase_payment_alert_days',
            type: 'int',
            default: 3,
          },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_by', type: 'uuid', isNullable: true },
        ],
        foreignKeys: [
          {
            name: 'FK_alert_settings_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.query(`
      ALTER TABLE alert_settings
        ADD CONSTRAINT "CHK_alert_settings_days_non_negative" CHECK (purchase_payment_alert_days >= 0);
    `);

    await queryRunner.query(`
      INSERT INTO alert_settings (purchase_payment_alert_days) VALUES (3);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('alert_settings');
  }
}
