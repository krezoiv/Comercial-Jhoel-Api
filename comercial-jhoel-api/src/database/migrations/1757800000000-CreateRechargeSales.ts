import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

const PREVIOUS_CLOSURE_FUNCTION = `
  CREATE OR REPLACE FUNCTION register_recharge_sales_closure(
    p_date DATE,
    p_total_collected NUMERIC,
    p_user_id UUID,
    p_is_admin BOOLEAN
  )
  RETURNS UUID
  LANGUAGE plpgsql
  AS $fn$
  DECLARE
    v_closure_id UUID;
    v_total_sales NUMERIC(12,2) := 0;
    v_result NUMERIC(12,2);
    v_row RECORD;
    v_sequence INTEGER;
  BEGIN
    IF p_total_collected IS NULL OR p_total_collected < 0 THEN
      RAISE EXCEPTION 'INVALID_TOTAL_COLLECTED:%', p_date;
    END IF;

    v_sequence := NULL;

    FOR v_row IN
      SELECT recharge_type_id, daily_balance, final_balance, sequence
      FROM recharge_daily_balances
      WHERE id IN (
        SELECT DISTINCT ON (recharge_type_id) id
        FROM recharge_daily_balances
        WHERE date = p_date
        ORDER BY recharge_type_id, sequence DESC
      )
      FOR UPDATE
    LOOP
      IF v_row.final_balance IS NULL THEN
        RAISE EXCEPTION 'PENDING_TYPE_CLOSURE:%', v_row.recharge_type_id;
      END IF;
      v_total_sales := v_total_sales + (v_row.daily_balance - v_row.final_balance);
      v_sequence := v_row.sequence;
    END LOOP;

    IF v_sequence IS NULL THEN
      v_sequence := 1;
    END IF;

    v_result := v_total_sales - p_total_collected;

    BEGIN
      INSERT INTO recharge_sales_closures
        (date, sequence, total_sales, total_collected, result, created_by)
      VALUES
        (p_date, v_sequence, v_total_sales, p_total_collected, v_result, p_user_id)
      RETURNING id INTO v_closure_id;

      FOR v_row IN
        SELECT DISTINCT ON (recharge_type_id) recharge_type_id, final_balance
        FROM recharge_daily_balances
        WHERE date = p_date AND sequence = v_sequence
      LOOP
        INSERT INTO recharge_daily_balances
          (recharge_type_id, date, sequence, previous_balance, daily_balance, final_balance, created_by)
        VALUES
          (v_row.recharge_type_id, p_date, v_sequence + 1, v_row.final_balance, v_row.final_balance, NULL, p_user_id);
      END LOOP;
    EXCEPTION WHEN unique_violation THEN
      IF NOT p_is_admin THEN
        RAISE EXCEPTION 'SALES_CLOSURE_EDIT_FORBIDDEN:%', p_date;
      END IF;

      UPDATE recharge_sales_closures
      SET total_sales = v_total_sales,
          total_collected = p_total_collected,
          result = v_result,
          updated_by = p_user_id,
          updated_at = now()
      WHERE date = p_date AND sequence = v_sequence
      RETURNING id INTO v_closure_id;
    END;

    RETURN v_closure_id;
  END;
  $fn$;
`;

export class CreateRechargeSales1757800000000 implements MigrationInterface {
  name = 'CreateRechargeSales1757800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Each individually-sold recharge (a customer's top-up), kept forever for
    // audit/history — the counterpart to `recharge_purchases` on the "sold to
    // a customer" side instead of the "bought from the operator" side.
    // `daily_balance_id` ties every sale to the exact (type, date, cycle) row
    // it was made under, mirroring `recharge_purchases.daily_balance_id`
    // exactly — this is what lets a cuadre reset (a fresh `sequence`) start a
    // new, empty group of sales without deleting or reassigning any historical
    // row, and what lets "is this sale still editable" be answered by a
    // single lookup: the referenced daily-balance row's `final_balance` is
    // still NULL.
    await queryRunner.createTable(
      new Table({
        name: 'recharge_sales',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'recharge_type_id', type: 'uuid' },
          { name: 'daily_balance_id', type: 'uuid' },
          { name: 'phone_number', type: 'varchar', length: '15' },
          { name: 'amount', type: 'numeric', precision: 12, scale: 2 },
          { name: 'sale_date', type: 'date' },
          { name: 'created_by', type: 'uuid' },
          { name: 'updated_by', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_recharge_sales_type',
            columnNames: ['recharge_type_id'],
            referencedTableName: 'recharge_types',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_recharge_sales_daily_balance',
            columnNames: ['daily_balance_id'],
            referencedTableName: 'recharge_daily_balances',
            referencedColumnNames: ['id'],
            // A sale movement has no independent existence outside the cycle
            // it was recorded under — same CASCADE reasoning as
            // `recharge_purchases.daily_balance_id`.
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_recharge_sales_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_recharge_sales_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'recharge_sales',
      new TableIndex({
        name: 'IDX_recharge_sales_daily_balance_id',
        columnNames: ['daily_balance_id'],
      }),
    );
    await queryRunner.createIndex(
      'recharge_sales',
      new TableIndex({
        name: 'IDX_recharge_sales_type_id',
        columnNames: ['recharge_type_id'],
      }),
    );
    await queryRunner.createIndex(
      'recharge_sales',
      new TableIndex({
        name: 'IDX_recharge_sales_sale_date',
        columnNames: ['sale_date'],
      }),
    );

    // ------------------------------------------------------------------
    // register_recharge_sale: records one customer's recharge. Reuses
    // ensure_recharge_daily_balance to resolve/create the CURRENT cycle row
    // for (type, date) — a sale never affects that row's own
    // previous/daily/final balance columns (those track the vendor's own
    // airtime inventory, an entirely separate concern from what was sold to
    // customers) — it only borrows the row's id to tag which cuadre cycle
    // this sale belongs to, and its `final_balance` to reject a sale placed
    // after that operator's day already closed (same DAY_ALREADY_CLOSED
    // reasoning as register_recharge_purchase).
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_recharge_sale(
        p_recharge_type_id UUID,
        p_date DATE,
        p_phone_number VARCHAR,
        p_amount NUMERIC,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_type RECORD;
        v_daily_balance_id UUID;
        v_final_balance NUMERIC(12,2);
        v_sale_id UUID;
      BEGIN
        SELECT id, is_active INTO v_type FROM recharge_types WHERE id = p_recharge_type_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'RECHARGE_TYPE_NOT_FOUND:%', p_recharge_type_id;
        END IF;
        IF NOT v_type.is_active THEN
          RAISE EXCEPTION 'RECHARGE_TYPE_INACTIVE:%', p_recharge_type_id;
        END IF;

        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_recharge_type_id;
        END IF;

        IF p_phone_number IS NULL OR length(trim(p_phone_number)) = 0 THEN
          RAISE EXCEPTION 'INVALID_PHONE_NUMBER:%', p_recharge_type_id;
        END IF;

        v_daily_balance_id := ensure_recharge_daily_balance(p_recharge_type_id, p_date, p_user_id);

        SELECT final_balance INTO v_final_balance
        FROM recharge_daily_balances
        WHERE id = v_daily_balance_id
        FOR UPDATE;

        IF v_final_balance IS NOT NULL THEN
          RAISE EXCEPTION 'DAY_ALREADY_CLOSED:%', v_daily_balance_id;
        END IF;

        INSERT INTO recharge_sales
          (recharge_type_id, daily_balance_id, phone_number, amount, sale_date, created_by)
        VALUES
          (p_recharge_type_id, v_daily_balance_id, p_phone_number, p_amount, p_date, p_user_id)
        RETURNING id INTO v_sale_id;

        RETURN v_sale_id;
      END;
      $fn$;
    `);

    // ------------------------------------------------------------------
    // update_recharge_sale / delete_recharge_sale: a sale can only be
    // corrected or removed while its own cycle is still open — the exact
    // same "final_balance IS NULL" gate register_recharge_sale itself
    // checks at creation time, re-verified here (locked `FOR UPDATE`) so a
    // final-balance close racing with an in-flight edit can't leave a sale
    // silently modified after its operator's day was already reconciled.
    // Only `phone_number`/`amount` are editable — the recharge type is
    // fixed at creation (changing it would mean re-resolving a different
    // type's cycle row entirely); a wrong operator is corrected by deleting
    // and re-adding, not by editing in place.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_recharge_sale(
        p_id UUID,
        p_phone_number VARCHAR,
        p_amount NUMERIC,
        p_user_id UUID
      )
      RETURNS VOID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_daily_balance_id UUID;
        v_final_balance NUMERIC(12,2);
      BEGIN
        SELECT daily_balance_id INTO v_daily_balance_id FROM recharge_sales WHERE id = p_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'RECHARGE_SALE_NOT_FOUND:%', p_id;
        END IF;

        SELECT final_balance INTO v_final_balance
        FROM recharge_daily_balances
        WHERE id = v_daily_balance_id
        FOR UPDATE;

        IF v_final_balance IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_SALE_LOCKED:%', p_id;
        END IF;

        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_id;
        END IF;

        IF p_phone_number IS NULL OR length(trim(p_phone_number)) = 0 THEN
          RAISE EXCEPTION 'INVALID_PHONE_NUMBER:%', p_id;
        END IF;

        UPDATE recharge_sales
        SET phone_number = p_phone_number,
            amount = p_amount,
            updated_by = p_user_id,
            updated_at = now()
        WHERE id = p_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION delete_recharge_sale(
        p_id UUID
      )
      RETURNS VOID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_daily_balance_id UUID;
        v_final_balance NUMERIC(12,2);
      BEGIN
        SELECT daily_balance_id INTO v_daily_balance_id FROM recharge_sales WHERE id = p_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'RECHARGE_SALE_NOT_FOUND:%', p_id;
        END IF;

        SELECT final_balance INTO v_final_balance
        FROM recharge_daily_balances
        WHERE id = v_daily_balance_id
        FOR UPDATE;

        IF v_final_balance IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_SALE_LOCKED:%', p_id;
        END IF;

        DELETE FROM recharge_sales WHERE id = p_id;
      END;
      $fn$;
    `);

    // ------------------------------------------------------------------
    // register_recharge_sales_closure: total_sales now comes from summing
    // this date's actual recorded `recharge_sales` rows for each type's
    // CURRENT cycle, instead of inferring it from
    // `daily_balance - final_balance`. The PENDING_TYPE_CLOSURE gate (every
    // touched type must have its `final_balance` registered before the
    // cuadre can close) is unchanged — that rule protects the vendor's own
    // airtime-balance reconciliation and still determines "saldo anterior"
    // for the next cycle via `final_balance`, an entirely separate concern
    // from how many pesos of individual sales were recorded. Signature is
    // unchanged (`CREATE OR REPLACE`, not a new function) since nothing
    // calling it needs to change.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_recharge_sales_closure(
        p_date DATE,
        p_total_collected NUMERIC,
        p_user_id UUID,
        p_is_admin BOOLEAN
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_closure_id UUID;
        v_total_sales NUMERIC(12,2) := 0;
        v_type_sales NUMERIC(12,2);
        v_result NUMERIC(12,2);
        v_row RECORD;
        v_sequence INTEGER;
      BEGIN
        IF p_total_collected IS NULL OR p_total_collected < 0 THEN
          RAISE EXCEPTION 'INVALID_TOTAL_COLLECTED:%', p_date;
        END IF;

        v_sequence := NULL;

        FOR v_row IN
          SELECT recharge_type_id, id AS daily_balance_id, final_balance, sequence
          FROM recharge_daily_balances
          WHERE id IN (
            SELECT DISTINCT ON (recharge_type_id) id
            FROM recharge_daily_balances
            WHERE date = p_date
            ORDER BY recharge_type_id, sequence DESC
          )
          FOR UPDATE
        LOOP
          IF v_row.final_balance IS NULL THEN
            RAISE EXCEPTION 'PENDING_TYPE_CLOSURE:%', v_row.recharge_type_id;
          END IF;

          SELECT COALESCE(SUM(amount), 0) INTO v_type_sales
          FROM recharge_sales
          WHERE daily_balance_id = v_row.daily_balance_id;

          v_total_sales := v_total_sales + v_type_sales;
          v_sequence := v_row.sequence;
        END LOOP;

        IF v_sequence IS NULL THEN
          v_sequence := 1;
        END IF;

        v_result := v_total_sales - p_total_collected;

        BEGIN
          INSERT INTO recharge_sales_closures
            (date, sequence, total_sales, total_collected, result, created_by)
          VALUES
            (p_date, v_sequence, v_total_sales, p_total_collected, v_result, p_user_id)
          RETURNING id INTO v_closure_id;

          FOR v_row IN
            SELECT DISTINCT ON (recharge_type_id) recharge_type_id, final_balance
            FROM recharge_daily_balances
            WHERE date = p_date AND sequence = v_sequence
          LOOP
            INSERT INTO recharge_daily_balances
              (recharge_type_id, date, sequence, previous_balance, daily_balance, final_balance, created_by)
            VALUES
              (v_row.recharge_type_id, p_date, v_sequence + 1, v_row.final_balance, v_row.final_balance, NULL, p_user_id);
          END LOOP;
        EXCEPTION WHEN unique_violation THEN
          IF NOT p_is_admin THEN
            RAISE EXCEPTION 'SALES_CLOSURE_EDIT_FORBIDDEN:%', p_date;
          END IF;

          UPDATE recharge_sales_closures
          SET total_sales = v_total_sales,
              total_collected = p_total_collected,
              result = v_result,
              updated_by = p_user_id,
              updated_at = now()
          WHERE date = p_date AND sequence = v_sequence
          RETURNING id INTO v_closure_id;
          -- Deliberately no reset here — same reasoning as the prior version
          -- of this function: cycle N+1 may already exist, and resetting
          -- again would silently create an orphaned cycle N+2.
        END;

        RETURN v_closure_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(PREVIOUS_CLOSURE_FUNCTION);
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS delete_recharge_sale(UUID)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS update_recharge_sale(UUID, VARCHAR, NUMERIC, UUID)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_recharge_sale(UUID, DATE, VARCHAR, NUMERIC, UUID)',
    );
    await queryRunner.dropTable('recharge_sales');
  }
}
