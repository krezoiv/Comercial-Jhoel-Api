import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * "Caja Contable" — an accumulated cash balance for the Recargas
 * Electrónicas y SIMs business line. Deliberately does NOT create a ledger
 * table copying sales/purchases: those already exist as real, individual
 * rows (`recharge_sales`, `recharge_sim_sales`, `recharge_purchases`,
 * `recharge_sim_purchases`) and are read LIVE at query time by
 * `TypeOrmRechargeCashBoxRepository` — nothing is ever duplicated into a
 * second copy, so there is no possibility of a sale/purchase producing two
 * Caja Contable movements. The only genuinely new kind of event is a
 * manual "Salida de Ganancia" withdrawal, which has no other source of
 * truth anywhere in the system — that's the only table this migration adds.
 *
 * `recharge_purchases.amount` ("Monto de Compra") is the column read for
 * this — never `credited_amount` ("Monto Acreditado"), which only affects
 * `recharge_daily_balances` and is never read by this module. Same
 * separation-of-concerns as the rest of Recargas: this migration never
 * touches `recharge_daily_balances`/`recharge_sales_closures` or their
 * stored functions.
 *
 * Void pattern (`is_voided`/`voided_at`/`voided_by`/`void_reason` +
 * all-or-nothing CHECK) is a direct copy of
 * `bank_deposit_operations`/`AddVoidToBankDepositOperations` — a withdrawal
 * is corrected by anulación, never a physical `DELETE`.
 */
export class CreateRechargeCashBoxWithdrawals1760001600000
  implements MigrationInterface
{
  name = 'CreateRechargeCashBoxWithdrawals1760001600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'recharge_cash_box_withdrawals',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'amount', type: 'numeric', precision: 12, scale: 2 },
          { name: 'business_date', type: 'date' },
          { name: 'concept', type: 'varchar', length: '255' },
          { name: 'created_by', type: 'uuid' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'is_voided', type: 'boolean', default: false },
          { name: 'voided_at', type: 'timestamptz', isNullable: true },
          { name: 'voided_by', type: 'uuid', isNullable: true },
          {
            name: 'void_reason',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'FK_recharge_cash_box_withdrawals_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_recharge_cash_box_withdrawals_voided_by',
            columnNames: ['voided_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'recharge_cash_box_withdrawals',
      new TableIndex({
        name: 'IDX_recharge_cash_box_withdrawals_business_date',
        columnNames: ['business_date'],
      }),
    );
    await queryRunner.createIndex(
      'recharge_cash_box_withdrawals',
      new TableIndex({
        name: 'IDX_recharge_cash_box_withdrawals_is_voided',
        columnNames: ['is_voided'],
      }),
    );

    await queryRunner.query(`
      ALTER TABLE recharge_cash_box_withdrawals
      ADD CONSTRAINT CHK_recharge_cash_box_withdrawals_amount_positive CHECK (amount > 0)
    `);

    await queryRunner.query(`
      ALTER TABLE recharge_cash_box_withdrawals
      ADD CONSTRAINT CHK_recharge_cash_box_withdrawals_void_consistency CHECK (
        (is_voided = false AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
        OR
        (is_voided = true AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL)
      )
    `);

    // register_recharge_cash_box_withdrawal: the atomic "retirar ganancia"
    // operation. `pg_advisory_xact_lock` serializes concurrent withdrawals
    // against EACH OTHER (the actual race this ticket asked to prevent) —
    // same mechanism as `register_asset_movement`/
    // `register_account_receivable_movement` (Kardex financiero), just with
    // a single fixed lock key since there is only one Caja Contable, not one
    // per client. Deliberately does NOT lock/serialize against concurrent
    // recharge/SIM sales or purchases — those already have their own
    // independent write paths (untouched by this migration) and are only
    // ever READ here; a withdrawal race is only possible against another
    // withdrawal, which this lock fully covers.
    //
    // The available balance is computed fresh, INSIDE the lock, every time
    // — never cached/trusted from the caller — by summing the same four
    // live source tables plus every not-yet-voided withdrawal so far. This
    // is a global, all-time balance (not scoped to `p_business_date`): the
    // ticket's own example ("Saldo disponible Q500, intentar retirar Q600 →
    // bloqueado") refers to the whole accumulated Caja, not one day's slice
    // of it.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_recharge_cash_box_withdrawal(
        p_amount NUMERIC,
        p_business_date DATE,
        p_concept VARCHAR,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_id UUID;
        v_income NUMERIC(12,2);
        v_expense NUMERIC(12,2);
        v_balance NUMERIC(12,2);
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('recharge_cash_box'));

        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_WITHDRAWAL_AMOUNT';
        END IF;

        IF p_concept IS NULL OR length(trim(p_concept)) = 0 THEN
          RAISE EXCEPTION 'INVALID_WITHDRAWAL_CONCEPT';
        END IF;

        IF p_business_date IS NULL THEN
          RAISE EXCEPTION 'INVALID_WITHDRAWAL_DATE';
        END IF;

        SELECT
          COALESCE((SELECT SUM(amount) FROM recharge_sales), 0)
          + COALESCE((SELECT SUM(total_amount) FROM recharge_sim_sales), 0)
        INTO v_income;

        SELECT
          COALESCE((SELECT SUM(amount) FROM recharge_purchases), 0)
          + COALESCE((SELECT SUM(total_cost) FROM recharge_sim_purchases), 0)
          + COALESCE((SELECT SUM(amount) FROM recharge_cash_box_withdrawals WHERE is_voided = false), 0)
        INTO v_expense;

        v_balance := v_income - v_expense;

        IF p_amount > v_balance THEN
          RAISE EXCEPTION 'WITHDRAWAL_EXCEEDS_BALANCE';
        END IF;

        INSERT INTO recharge_cash_box_withdrawals (amount, business_date, concept, created_by)
        VALUES (p_amount, p_business_date, trim(p_concept), p_user_id)
        RETURNING id INTO v_id;

        RETURN v_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_recharge_cash_box_withdrawal(NUMERIC, DATE, VARCHAR, UUID)',
    );
    await queryRunner.dropTable('recharge_cash_box_withdrawals');
  }
}
