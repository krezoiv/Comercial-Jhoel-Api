import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * Cuadre Agentes, segunda etapa — "Guardar Cuadre". Purely additive: a
 * brand new table, no existing table/column touched. `numeric(14,2)`
 * (wider than this app's usual `numeric(12,2)`) per the ticket's own
 * explicit spec, since these are aggregated totals across every bank/
 * asset/cuenta-por-cobrar rather than a single transaction's amount.
 *
 * Deliberately no CHECK constraint on `result` (unlike assets/
 * accounts_receivable's `amount > 0`) — the whole point of this column is
 * that it can be negative (the ticket's own "ROJO" state), so a positivity
 * guardrail here would actively break the feature.
 *
 * No uniqueness constraint on `date` either — unlike
 * `recharge_sales_closures` (one row per calendar day), this ticket's own
 * wording treats every save as a new historical record ("el resultado
 * histórico de cada cuadre"), with no cycle/reset concept requested for
 * this table. Duplicate-submission protection (a double-click on
 * "Guardar Cuadre") is handled by the frontend's existing
 * isSaving()-gates-the-button pattern, same as every other save action in
 * this app.
 */
export class CreateAgentReconciliations1758300000000 implements MigrationInterface {
  name = 'CreateAgentReconciliations1758300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'agent_reconciliations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'date', type: 'date' },
          { name: 'total_cash', type: 'numeric', precision: 14, scale: 2 },
          { name: 'total_banks', type: 'numeric', precision: 14, scale: 2 },
          { name: 'total_assets', type: 'numeric', precision: 14, scale: 2 },
          {
            name: 'total_accounts_receivable',
            type: 'numeric',
            precision: 14,
            scale: 2,
          },
          { name: 'result', type: 'numeric', precision: 14, scale: 2 },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'created_by', type: 'uuid' },
        ],
        foreignKeys: [
          {
            name: 'FK_agent_reconciliations_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'agent_reconciliations',
      new TableIndex({
        name: 'IDX_agent_reconciliations_date',
        columnNames: ['date'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('agent_reconciliations');
  }
}
