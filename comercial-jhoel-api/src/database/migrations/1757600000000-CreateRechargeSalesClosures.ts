import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateRechargeSalesClosures1757600000000 implements MigrationInterface {
  name = 'CreateRechargeSalesClosures1757600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // One row per calendar day — the daily cash-reconciliation ("cuadre")
    // across every recharge type, not one row per type. Deliberately has
    // no `recharge_type_id`/per-type breakdown columns: `recharge_daily_
    // balances` rows are never deleted, so a per-type breakdown for *any*
    // date (today or historical) can always be reconstructed live via
    // `WHERE date = :date` on that table — storing it again here would be
    // the exact kind of redundant duplication this codebase's "derive,
    // don't duplicate" rule (see Reports/`recharge_daily_balances` itself)
    // exists to avoid. `total_sales`/`total_collected`/`result` themselves
    // ARE stored, though, unlike a live-derived value — a closure is a
    // frozen historical snapshot the day it's saved, and must stay exactly
    // what it was even if a later admin correction to a `final_balance`
    // would change what "live" sales figures currently compute to.
    await queryRunner.createTable(
      new Table({
        name: 'recharge_sales_closures',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'date', type: 'date' },
          { name: 'total_sales', type: 'numeric', precision: 12, scale: 2 },
          {
            name: 'total_collected',
            type: 'numeric',
            precision: 12,
            scale: 2,
          },
          { name: 'result', type: 'numeric', precision: 12, scale: 2 },
          { name: 'created_by', type: 'uuid' },
          { name: 'updated_by', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_recharge_sales_closures_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_recharge_sales_closures_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    // One closure per day — the ticket's explicit "proteger contra
    // duplicados accidentales" rule, enforced at the DB level (the stored
    // function below relies on this exact constraint for its
    // `ON CONFLICT (date) DO UPDATE` upsert-on-re-save behavior).
    await queryRunner.createIndex(
      'recharge_sales_closures',
      new TableIndex({
        name: 'UQ_recharge_sales_closures_date',
        columnNames: ['date'],
        isUnique: true,
      }),
    );

    // ------------------------------------------------------------------
    // register_recharge_sales_closure: computes the day's total sales
    // fresh from `recharge_daily_balances` (never trusts a client-supplied
    // total), validates the collected amount, and upserts the one row for
    // that date — all inside one transaction (FUNCTION, not PROCEDURE,
    // same reasoning as every other critical operation in this codebase:
    // a RAISE EXCEPTION here rolls back everything, no explicit
    // BEGIN/COMMIT needed). `FOR UPDATE` while summing locks every
    // touched type's row for the day, so a concurrent purchase/final-
    // balance write can't change a sale figure mid-calculation.
    //
    // A type with no row at all for that date (never touched) simply
    // contributes 0 — a slow day with zero activity on one operator is a
    // valid cuadre, not an error. A type that WAS touched but has no
    // `final_balance` yet (its sale isn't knowable yet) blocks the whole
    // closure with `PENDING_TYPE_CLOSURE` — closing the day's cash
    // reconciliation before every touched operator's saldo final is
    // registered would silently under-count `total_sales`.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_recharge_sales_closure(
        p_date DATE,
        p_total_collected NUMERIC,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_closure_id UUID;
        v_total_sales NUMERIC(12,2) := 0;
        v_result NUMERIC(12,2);
        v_row RECORD;
      BEGIN
        IF p_total_collected IS NULL OR p_total_collected < 0 THEN
          RAISE EXCEPTION 'INVALID_TOTAL_COLLECTED:%', p_date;
        END IF;

        FOR v_row IN
          SELECT recharge_type_id, daily_balance, final_balance
          FROM recharge_daily_balances
          WHERE date = p_date
          FOR UPDATE
        LOOP
          IF v_row.final_balance IS NULL THEN
            RAISE EXCEPTION 'PENDING_TYPE_CLOSURE:%', v_row.recharge_type_id;
          END IF;
          v_total_sales := v_total_sales + (v_row.daily_balance - v_row.final_balance);
        END LOOP;

        v_result := v_total_sales - p_total_collected;

        INSERT INTO recharge_sales_closures
          (date, total_sales, total_collected, result, created_by)
        VALUES
          (p_date, v_total_sales, p_total_collected, v_result, p_user_id)
        ON CONFLICT (date) DO UPDATE
          SET total_sales = EXCLUDED.total_sales,
              total_collected = EXCLUDED.total_collected,
              result = EXCLUDED.result,
              updated_by = p_user_id,
              updated_at = now()
        RETURNING id INTO v_closure_id;

        RETURN v_closure_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_recharge_sales_closure(DATE, NUMERIC, UUID)',
    );
    await queryRunner.dropTable('recharge_sales_closures');
  }
}
