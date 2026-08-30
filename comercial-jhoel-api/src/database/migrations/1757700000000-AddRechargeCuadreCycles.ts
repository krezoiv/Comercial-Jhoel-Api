import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddRechargeCuadreCycles1757700000000 implements MigrationInterface {
  name = 'AddRechargeCuadreCycles1757700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // `sequence` turns "one row per (type, date)" into "one row per (type,
    // date, cycle)" — this is what lets "Guardar cuadre" mean "close this
    // cuadre AND immediately start a new one on the same calendar date",
    // per this follow-up's explicit request, rather than only once per
    // day. Existing rows all default to sequence 1, which is exactly
    // correct — every row that existed before this migration WAS a first
    // (and, until now, only possible) cycle.
    await queryRunner.addColumn(
      'recharge_daily_balances',
      new TableColumn({ name: 'sequence', type: 'integer', default: 1 }),
    );
    await queryRunner.dropIndex(
      'recharge_daily_balances',
      'UQ_recharge_daily_balances_type_date',
    );
    await queryRunner.createIndex(
      'recharge_daily_balances',
      new TableIndex({
        name: 'UQ_recharge_daily_balances_type_date_sequence',
        columnNames: ['recharge_type_id', 'date', 'sequence'],
        isUnique: true,
      }),
    );

    await queryRunner.addColumn(
      'recharge_sales_closures',
      new TableColumn({ name: 'sequence', type: 'integer', default: 1 }),
    );
    await queryRunner.dropIndex(
      'recharge_sales_closures',
      'UQ_recharge_sales_closures_date',
    );
    await queryRunner.createIndex(
      'recharge_sales_closures',
      new TableIndex({
        name: 'UQ_recharge_sales_closures_date_sequence',
        columnNames: ['date', 'sequence'],
        isUnique: true,
      }),
    );

    // ------------------------------------------------------------------
    // ensure_recharge_daily_balance: now resolves "the row for (type,
    // date)" as the row with the HIGHEST sequence for that (type, date)
    // — i.e. the current, possibly-already-reset cycle — rather than a
    // single row per day. The "first cycle of this date" branch is
    // otherwise unchanged: previous_balance still comes from the most
    // recent PRIOR DATE's closed cycle (its own highest sequence).
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION ensure_recharge_daily_balance(
        p_recharge_type_id UUID,
        p_date DATE,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_id UUID;
        v_previous NUMERIC(12,2);
      BEGIN
        SELECT id INTO v_id
        FROM recharge_daily_balances
        WHERE recharge_type_id = p_recharge_type_id AND date = p_date
        ORDER BY sequence DESC
        LIMIT 1;

        IF FOUND THEN
          RETURN v_id;
        END IF;

        SELECT final_balance INTO v_previous
        FROM recharge_daily_balances
        WHERE recharge_type_id = p_recharge_type_id
          AND date < p_date
          AND final_balance IS NOT NULL
        ORDER BY date DESC, sequence DESC
        LIMIT 1;

        v_previous := COALESCE(v_previous, 0);

        INSERT INTO recharge_daily_balances
          (recharge_type_id, date, sequence, previous_balance, daily_balance, final_balance, created_by)
        VALUES
          (p_recharge_type_id, p_date, 1, v_previous, v_previous, NULL, p_user_id)
        ON CONFLICT (recharge_type_id, date, sequence) DO NOTHING
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
          -- Lost the race to a concurrent first request for the same
          -- (type, date, 1) — its row is now there, use it.
          SELECT id INTO v_id
          FROM recharge_daily_balances
          WHERE recharge_type_id = p_recharge_type_id AND date = p_date
          ORDER BY sequence DESC
          LIMIT 1;
        END IF;

        RETURN v_id;
      END;
      $fn$;
    `);

    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_recharge_sales_closure(DATE, NUMERIC, UUID)',
    );

    // ------------------------------------------------------------------
    // register_recharge_sales_closure: gained p_is_admin and now closes
    // out the CURRENT cycle only (the highest-sequence row per type for
    // this date), then — on that cycle's genuinely first close — starts
    // a fresh cycle for every type just closed, carrying its
    // final_balance forward as the new cycle's previous_balance. This is
    // what makes "Guardar cuadre" also mean "empezar un nuevo cuadre":
    // the very next ensure_recharge_daily_balance()/
    // register_recharge_purchase() call for this date resolves to the
    // new cycle automatically, with saldo anterior already carried over.
    //
    // The admin-only re-edit rule (a non-admin re-closing a cycle that
    // already has a saved closure gets SALES_CLOSURE_EDIT_FORBIDDEN) is
    // enforced HERE, inside the function, unlike
    // register_recharge_final_balance's equivalent rule, which lives in
    // its use case instead — a deliberate difference, not an
    // inconsistency: final balance's target row always already exists
    // (found by its own id) before the "is this a re-edit" question is
    // asked, so there is no race to close. Here, "does a closure already
    // exist for this cycle" and "insert one" must happen atomically
    // together, or two concurrent first-saves could both observe "no
    // closure yet" and both slip past an application-layer check.
    // `EXCEPTION WHEN unique_violation` is the same "first write wins,
    // losers re-check" pattern `adjust_sale_item` already uses elsewhere
    // in this codebase for an analogous race — chosen over a plain
    // `ON CONFLICT` here specifically because the reset side effect must
    // run exactly once, only for the genuine first insert, never for a
    // losing race or a later correction (cycle N+1 may already be
    // mid-flight by the time an admin corrects cycle N's figures).
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
        v_result NUMERIC(12,2);
        v_row RECORD;
        v_sequence INTEGER;
      BEGIN
        IF p_total_collected IS NULL OR p_total_collected < 0 THEN
          RAISE EXCEPTION 'INVALID_TOTAL_COLLECTED:%', p_date;
        END IF;

        v_sequence := NULL;

        -- Postgres rejects FOR UPDATE combined directly with DISTINCT
        -- ON in the same SELECT — the per-type "current cycle" id is
        -- resolved in a subquery instead, so the outer SELECT (plain,
        -- lockable) is the one that actually takes the row lock.
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
          -- All active types are always reset together (one "Guardar
          -- cuadre" click covers the whole table), so they share one
          -- sequence number per date — take it from whichever row we see.
          v_sequence := v_row.sequence;
        END LOOP;

        IF v_sequence IS NULL THEN
          -- No recharge_daily_balances rows exist yet for this date at
          -- all (a cuadre for a date nobody has touched) — cycle 1, zero
          -- sales, nothing to reset afterward.
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
          -- Deliberately no reset here — cycle N+1 may already exist
          -- (created by whichever call won the race, or by the original
          -- first close), and resetting again would silently create a
          -- second, orphaned cycle N+2 nobody asked for.
        END;

        RETURN v_closure_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_recharge_sales_closure(DATE, NUMERIC, UUID, BOOLEAN)',
    );
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

        INSERT INTO recharge_sales_closures (date, total_sales, total_collected, result, created_by)
        VALUES (p_date, v_total_sales, p_total_collected, v_result, p_user_id)
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

    await queryRunner.query(
      'DROP FUNCTION IF EXISTS ensure_recharge_daily_balance(UUID, DATE, UUID)',
    );
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION ensure_recharge_daily_balance(
        p_recharge_type_id UUID,
        p_date DATE,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_id UUID;
        v_previous NUMERIC(12,2);
      BEGIN
        SELECT id INTO v_id
        FROM recharge_daily_balances
        WHERE recharge_type_id = p_recharge_type_id AND date = p_date;

        IF FOUND THEN
          RETURN v_id;
        END IF;

        SELECT final_balance INTO v_previous
        FROM recharge_daily_balances
        WHERE recharge_type_id = p_recharge_type_id
          AND date < p_date
          AND final_balance IS NOT NULL
        ORDER BY date DESC
        LIMIT 1;

        v_previous := COALESCE(v_previous, 0);

        INSERT INTO recharge_daily_balances
          (recharge_type_id, date, previous_balance, daily_balance, final_balance, created_by)
        VALUES
          (p_recharge_type_id, p_date, v_previous, v_previous, NULL, p_user_id)
        ON CONFLICT (recharge_type_id, date) DO NOTHING
        RETURNING id INTO v_id;

        IF v_id IS NULL THEN
          SELECT id INTO v_id
          FROM recharge_daily_balances
          WHERE recharge_type_id = p_recharge_type_id AND date = p_date;
        END IF;

        RETURN v_id;
      END;
      $fn$;
    `);

    await queryRunner.dropIndex(
      'recharge_sales_closures',
      'UQ_recharge_sales_closures_date_sequence',
    );
    await queryRunner.createIndex(
      'recharge_sales_closures',
      new TableIndex({
        name: 'UQ_recharge_sales_closures_date',
        columnNames: ['date'],
        isUnique: true,
      }),
    );
    await queryRunner.dropColumn('recharge_sales_closures', 'sequence');

    await queryRunner.dropIndex(
      'recharge_daily_balances',
      'UQ_recharge_daily_balances_type_date_sequence',
    );
    await queryRunner.createIndex(
      'recharge_daily_balances',
      new TableIndex({
        name: 'UQ_recharge_daily_balances_type_date',
        columnNames: ['recharge_type_id', 'date'],
        isUnique: true,
      }),
    );
    await queryRunner.dropColumn('recharge_daily_balances', 'sequence');
  }
}
