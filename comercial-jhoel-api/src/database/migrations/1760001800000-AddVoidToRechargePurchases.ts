import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Revertir compra" — a correction path for a mistaken recharge purchase
 * (wrong operator, duplicate, wrong amount). Same `is_voided`/`voided_at`/
 * `voided_by`/`void_reason` + all-or-nothing CHECK pattern as
 * `bank_deposit_operations`/`recharge_cash_box_movements`/`tickets`/
 * `quotations` — never a physical `DELETE`. Purely additive: every
 * pre-existing row defaults to `is_voided = false`, byte-identical to
 * today's actual behavior.
 *
 * `void_recharge_purchase()` reverses EXACTLY what `register_recharge_purchase`
 * did — decrements `daily_balance` by `credited_amount` (never `amount`,
 * the "Monto de Compra"/"Monto Acreditado" distinction is never mixed) —
 * and is blocked entirely (no admin override, no backdoor) whenever:
 *   - the purchase's business day is closed (`recharge_day_openings.closed_at`), or
 *   - the purchase's specific cuadre cycle already has a `final_balance`
 *     (verified directly: `reopen_recharge_day()` only clears
 *     `recharge_day_openings.closed_at`, it never resets a cycle's
 *     `final_balance` — there is no existing mechanism in this codebase
 *     that un-closes an already-closed cuadre cycle, so a purchase tied to
 *     one can never be safely reverted; building one would mean altering
 *     the cuadre-close mechanism itself, explicitly out of scope here), or
 *   - reverting would drive `daily_balance` negative (impossible real
 *     airtime inventory).
 *
 * Caja Contable ("Compras de Recargas") needs NO compensating entry of its
 * own — it already reads `recharge_purchases.amount` live, never a copy
 * (see `CreateRechargeCashBoxWithdrawals`'s own doc comment), so excluding
 * `is_voided = true` rows from its two existing queries
 * (`TypeOrmRechargeCashBoxRepository.getDailyTotals`/`findMovements`) is
 * the entire "reversal", automatic and immediate on the very next read.
 */
export class AddVoidToRechargePurchases1760001800000
  implements MigrationInterface
{
  name = 'AddVoidToRechargePurchases1760001800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE recharge_purchases ADD COLUMN is_voided boolean NOT NULL DEFAULT false
    `);
    await queryRunner.query(`
      ALTER TABLE recharge_purchases ADD COLUMN voided_at timestamptz NULL
    `);
    await queryRunner.query(`
      ALTER TABLE recharge_purchases ADD COLUMN voided_by uuid NULL REFERENCES users(id) ON DELETE RESTRICT
    `);
    await queryRunner.query(`
      ALTER TABLE recharge_purchases ADD COLUMN void_reason varchar(255) NULL
    `);
    await queryRunner.query(`
      ALTER TABLE recharge_purchases
      ADD CONSTRAINT CHK_recharge_purchases_void_consistency CHECK (
        (is_voided = false AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
        OR
        (is_voided = true AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL)
      )
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_recharge_purchase(
        p_purchase_id UUID,
        p_user_id UUID,
        p_reason VARCHAR
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_purchase RECORD;
        v_balance RECORD;
        v_day_closed_at TIMESTAMPTZ;
      BEGIN
        IF p_reason IS NULL OR length(trim(p_reason)) = 0 THEN
          RAISE EXCEPTION 'VOID_REASON_REQUIRED';
        END IF;

        SELECT id, daily_balance_id, credited_amount, purchase_date, is_voided
        INTO v_purchase
        FROM recharge_purchases
        WHERE id = p_purchase_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'PURCHASE_NOT_FOUND:%', p_purchase_id;
        END IF;

        IF v_purchase.is_voided THEN
          RAISE EXCEPTION 'PURCHASE_ALREADY_VOIDED:%', p_purchase_id;
        END IF;

        SELECT closed_at INTO v_day_closed_at
        FROM recharge_day_openings
        WHERE date = v_purchase.purchase_date;
        IF v_day_closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CLOSED:%', p_purchase_id;
        END IF;

        SELECT id, daily_balance, final_balance
        INTO v_balance
        FROM recharge_daily_balances
        WHERE id = v_purchase.daily_balance_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'PURCHASE_NOT_FOUND:%', p_purchase_id;
        END IF;

        IF v_balance.final_balance IS NOT NULL THEN
          RAISE EXCEPTION 'PURCHASE_CYCLE_ALREADY_CLOSED:%', p_purchase_id;
        END IF;

        IF v_balance.daily_balance - v_purchase.credited_amount < 0 THEN
          RAISE EXCEPTION 'INSUFFICIENT_BALANCE_TO_REVERT:%', p_purchase_id;
        END IF;

        UPDATE recharge_purchases
        SET is_voided = true,
            voided_at = now(),
            voided_by = p_user_id,
            void_reason = trim(p_reason)
        WHERE id = p_purchase_id;

        UPDATE recharge_daily_balances
        SET daily_balance = daily_balance - v_purchase.credited_amount,
            updated_by = p_user_id,
            updated_at = now()
        WHERE id = v_purchase.daily_balance_id;

        RETURN p_purchase_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS void_recharge_purchase(UUID, UUID, VARCHAR)',
    );
    await queryRunner.query(
      'ALTER TABLE recharge_purchases DROP CONSTRAINT CHK_recharge_purchases_void_consistency',
    );
    await queryRunner.query(
      'ALTER TABLE recharge_purchases DROP COLUMN void_reason',
    );
    await queryRunner.query(
      'ALTER TABLE recharge_purchases DROP COLUMN voided_by',
    );
    await queryRunner.query(
      'ALTER TABLE recharge_purchases DROP COLUMN voided_at',
    );
    await queryRunner.query(
      'ALTER TABLE recharge_purchases DROP COLUMN is_voided',
    );
  }
}
