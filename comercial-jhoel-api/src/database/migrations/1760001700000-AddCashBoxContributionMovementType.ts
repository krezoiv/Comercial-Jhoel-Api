import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Aporte a Caja" — a manual cash contribution, the mirror-image income
 * counterpart to "Salida de Ganancia" (expense). Rather than a second,
 * parallel table, this generalizes the existing withdrawals table into a
 * single manual-movements table distinguished by `movement_type`
 * (`CONTRIBUTION` | `WITHDRAWAL`) — the exact same pattern already
 * established in this codebase for Kardex financiero
 * (`accounts_receivable`/`assets`: one table, `movement_type: 'CARGO' |
 * 'ABONO'`, sign derived from type — never stored as a signed amount). This
 * table has zero rows in every environment it's been deployed to so far
 * (built and tested only in local dev this session, never reached
 * production), so there is nothing to backfill beyond the default.
 *
 * `amount` stays an always-positive magnitude (unchanged) — the sign is now
 * determined by `movement_type` at read time (see
 * `TypeOrmRechargeCashBoxRepository.getDailyTotals`/`findMovements`), never
 * by the stored value itself.
 *
 * The table is also renamed (`recharge_cash_box_withdrawals` →
 * `recharge_cash_box_movements`) since it's no longer withdrawal-only —
 * a plain `RENAME TO`, which Postgres handles atomically without touching
 * data, indexes, or constraints. Existing index/constraint names keep
 * their original "_withdrawals_" naming — cosmetic only, not worth the
 * churn of renaming those too.
 *
 * `register_recharge_cash_box_withdrawal` is replaced by a new, more
 * general `register_recharge_cash_box_movement`, which takes an explicit
 * `p_movement_type` — parameter list changes, so the old function is
 * explicitly dropped first (this codebase's own established rule: a bare
 * `CREATE OR REPLACE FUNCTION` does not truly replace a function whose
 * parameter list is changing). The `WITHDRAWAL_EXCEEDS_BALANCE` guard only
 * applies when `p_movement_type = 'WITHDRAWAL'` — a contribution can never
 * be rejected for "exceeding" anything, it only ever adds.
 */
export class AddCashBoxContributionMovementType1760001700000
  implements MigrationInterface
{
  name = 'AddCashBoxContributionMovementType1760001700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE recharge_cash_box_withdrawals RENAME TO recharge_cash_box_movements
    `);

    await queryRunner.query(`
      ALTER TABLE recharge_cash_box_movements
      ADD COLUMN movement_type VARCHAR(20) NOT NULL DEFAULT 'WITHDRAWAL'
    `);
    // Drop the default now that every pre-existing row (there are none, but
    // this keeps the column's steady-state definition honest) has an
    // explicit value — every future INSERT always sets it explicitly.
    await queryRunner.query(`
      ALTER TABLE recharge_cash_box_movements ALTER COLUMN movement_type DROP DEFAULT
    `);

    await queryRunner.query(`
      ALTER TABLE recharge_cash_box_movements
      ADD CONSTRAINT CHK_recharge_cash_box_movements_type
      CHECK (movement_type IN ('CONTRIBUTION', 'WITHDRAWAL'))
    `);

    await queryRunner.query(
      `DROP FUNCTION IF EXISTS register_recharge_cash_box_withdrawal(NUMERIC, DATE, VARCHAR, UUID)`,
    );

    await queryRunner.query(`
      CREATE FUNCTION register_recharge_cash_box_movement(
        p_amount NUMERIC,
        p_movement_type VARCHAR,
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

        IF p_movement_type NOT IN ('CONTRIBUTION', 'WITHDRAWAL') THEN
          RAISE EXCEPTION 'INVALID_CASH_BOX_MOVEMENT_TYPE';
        END IF;

        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_WITHDRAWAL_AMOUNT';
        END IF;

        IF p_concept IS NULL OR length(trim(p_concept)) = 0 THEN
          RAISE EXCEPTION 'INVALID_WITHDRAWAL_CONCEPT';
        END IF;

        IF p_business_date IS NULL THEN
          RAISE EXCEPTION 'INVALID_WITHDRAWAL_DATE';
        END IF;

        IF p_movement_type = 'WITHDRAWAL' THEN
          SELECT
            COALESCE((SELECT SUM(amount) FROM recharge_sales), 0)
            + COALESCE((SELECT SUM(total_amount) FROM recharge_sim_sales), 0)
            + COALESCE((SELECT SUM(amount) FROM recharge_cash_box_movements WHERE is_voided = false AND movement_type = 'CONTRIBUTION'), 0)
          INTO v_income;

          SELECT
            COALESCE((SELECT SUM(amount) FROM recharge_purchases), 0)
            + COALESCE((SELECT SUM(total_cost) FROM recharge_sim_purchases), 0)
            + COALESCE((SELECT SUM(amount) FROM recharge_cash_box_movements WHERE is_voided = false AND movement_type = 'WITHDRAWAL'), 0)
          INTO v_expense;

          v_balance := v_income - v_expense;

          IF p_amount > v_balance THEN
            RAISE EXCEPTION 'WITHDRAWAL_EXCEEDS_BALANCE';
          END IF;
        END IF;

        INSERT INTO recharge_cash_box_movements (amount, movement_type, business_date, concept, created_by)
        VALUES (p_amount, p_movement_type, p_business_date, trim(p_concept), p_user_id)
        RETURNING id INTO v_id;

        RETURN v_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS register_recharge_cash_box_movement(NUMERIC, VARCHAR, DATE, VARCHAR, UUID)`,
    );

    await queryRunner.query(`
      CREATE FUNCTION register_recharge_cash_box_withdrawal(
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
          + COALESCE((SELECT SUM(amount) FROM recharge_cash_box_movements WHERE is_voided = false), 0)
        INTO v_expense;

        v_balance := v_income - v_expense;

        IF p_amount > v_balance THEN
          RAISE EXCEPTION 'WITHDRAWAL_EXCEEDS_BALANCE';
        END IF;

        INSERT INTO recharge_cash_box_movements (amount, movement_type, business_date, concept, created_by)
        VALUES (p_amount, 'WITHDRAWAL', p_business_date, trim(p_concept), p_user_id)
        RETURNING id INTO v_id;

        RETURN v_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      DELETE FROM recharge_cash_box_movements WHERE movement_type = 'CONTRIBUTION'
    `);

    await queryRunner.query(`
      ALTER TABLE recharge_cash_box_movements DROP CONSTRAINT CHK_recharge_cash_box_movements_type
    `);
    await queryRunner.query(`
      ALTER TABLE recharge_cash_box_movements DROP COLUMN movement_type
    `);

    await queryRunner.query(`
      ALTER TABLE recharge_cash_box_movements RENAME TO recharge_cash_box_withdrawals
    `);
  }
}
