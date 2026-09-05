import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * "Leída" state for the centralized alerts panel. Alerts themselves are
 * NEVER persisted rows — they're computed live, every request, from
 * `purchases`/`inventory_stock`/`recharge_types`+`recharge_daily_balances`
 * (see `modules/alerts/`'s own doc comment) — so there is nothing here to
 * store about an alert except "did this user already see this one." Each
 * alert has a stable, deterministic `alert_key` (e.g.
 * `purchase:<purchaseId>`, `inventory:<productId>:<locationId>`,
 * `recharge:<rechargeTypeId>`) derived from its own source row, so marking
 * one read survives across requests even though the alert list itself is
 * rebuilt from scratch every time.
 *
 * A row here becoming orphaned (its condition resolved — the purchase got
 * paid, the stock got restocked, the balance recovered) is harmless and
 * expected: the alert simply stops being generated, so the row is never
 * looked up again. No cleanup job exists for this v1 — the table stays
 * small (bounded by "alerts a user has ever seen," not by history), so
 * periodic pruning is a reasonable future addition, not a v1 requirement.
 */
export class CreateAlertReadMarks1760000400000 implements MigrationInterface {
  name = 'CreateAlertReadMarks1760000400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'alert_read_marks',
        columns: [
          { name: 'user_id', type: 'uuid', isPrimary: true },
          {
            name: 'alert_key',
            type: 'varchar',
            length: '255',
            isPrimary: true,
          },
          { name: 'read_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_alert_read_marks_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('alert_read_marks');
  }
}
