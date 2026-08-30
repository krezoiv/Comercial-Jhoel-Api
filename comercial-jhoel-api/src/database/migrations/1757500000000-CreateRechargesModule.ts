import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateRechargesModule1757500000000 implements MigrationInterface {
  name = 'CreateRechargesModule1757500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // recharge_types is a normalized lookup table (mirrors categories/
    // businesses) so "Claro"/"Tigo" are seeded rows, not hardcoded strings —
    // a new operator/service later is a new row, never a code change.
    await queryRunner.createTable(
      new Table({
        name: 'recharge_types',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '50' },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createIndex(
      'recharge_types',
      new TableIndex({
        name: 'UQ_recharge_types_name',
        columnNames: ['name'],
        isUnique: true,
      }),
    );

    await queryRunner.query(`
      INSERT INTO recharge_types (name) VALUES ('Claro'), ('Tigo');
    `);

    // One row per (recharge type, calendar day) — the day's running total.
    // `previous_balance` is copied in once when the row is first created
    // (see ensure_recharge_daily_balance() below) and never changes again;
    // `daily_balance` starts equal to it and grows by every purchase that
    // day; `final_balance` stays NULL until the day is closed.
    await queryRunner.createTable(
      new Table({
        name: 'recharge_daily_balances',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'recharge_type_id', type: 'uuid' },
          { name: 'date', type: 'date' },
          {
            name: 'previous_balance',
            type: 'numeric',
            precision: 12,
            scale: 2,
          },
          { name: 'daily_balance', type: 'numeric', precision: 12, scale: 2 },
          {
            name: 'final_balance',
            type: 'numeric',
            precision: 12,
            scale: 2,
            isNullable: true,
          },
          { name: 'created_by', type: 'uuid' },
          { name: 'updated_by', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_recharge_daily_balances_type',
            columnNames: ['recharge_type_id'],
            referencedTableName: 'recharge_types',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_recharge_daily_balances_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_recharge_daily_balances_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    // One row per (type, date) — this is both the natural key and what
    // makes ensure_recharge_daily_balance()'s `ON CONFLICT DO NOTHING`
    // concurrency-safe (see the function below).
    await queryRunner.createIndex(
      'recharge_daily_balances',
      new TableIndex({
        name: 'UQ_recharge_daily_balances_type_date',
        columnNames: ['recharge_type_id', 'date'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'recharge_daily_balances',
      new TableIndex({
        name: 'IDX_recharge_daily_balances_date',
        columnNames: ['date'],
      }),
    );

    // Each individual purchase, kept forever for audit/history even though
    // `recharge_daily_balances.daily_balance` already has the running total
    // (that total is `previous_balance` plus the SUM of these rows for the
    // same day — see the Reports module's own "derive, don't duplicate"
    // note for the same reasoning applied to sale/purchase totals).
    await queryRunner.createTable(
      new Table({
        name: 'recharge_purchases',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'recharge_type_id', type: 'uuid' },
          { name: 'daily_balance_id', type: 'uuid' },
          { name: 'amount', type: 'numeric', precision: 12, scale: 2 },
          { name: 'purchase_date', type: 'date' },
          { name: 'created_by', type: 'uuid' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_recharge_purchases_type',
            columnNames: ['recharge_type_id'],
            referencedTableName: 'recharge_types',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_recharge_purchases_daily_balance',
            columnNames: ['daily_balance_id'],
            referencedTableName: 'recharge_daily_balances',
            referencedColumnNames: ['id'],
            // A purchase movement has no independent existence outside the
            // daily total it fed — same CASCADE reasoning as
            // sale_details/purchase_details under their parent row (though
            // in practice a daily balance is never deleted; nothing in this
            // module exposes that operation).
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_recharge_purchases_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'recharge_purchases',
      new TableIndex({
        name: 'IDX_recharge_purchases_daily_balance_id',
        columnNames: ['daily_balance_id'],
      }),
    );
    await queryRunner.createIndex(
      'recharge_purchases',
      new TableIndex({
        name: 'IDX_recharge_purchases_type_id',
        columnNames: ['recharge_type_id'],
      }),
    );
    await queryRunner.createIndex(
      'recharge_purchases',
      new TableIndex({
        name: 'IDX_recharge_purchases_purchase_date',
        columnNames: ['purchase_date'],
      }),
    );

    // ------------------------------------------------------------------
    // ensure_recharge_daily_balance: "find or lazily create today's row"
    // for one recharge type — this is what makes "saldo anterior" fully
    // automatic. `previous_balance` is the most recent *closed* day's
    // final_balance for this type (or 0 if there isn't one yet — the
    // legitimate first-ever-day case, not an error). `ON CONFLICT DO
    // NOTHING` + re-select (rather than an exception handler, unlike
    // adjust_sale_item's approach for the same "first write wins"
    // race) is enough here because the unique constraint is a plain
    // two-column one, not a partial index — the simpler of the two
    // patterns already used in this codebase, picked because it fits.
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
          -- Lost the race to a concurrent first request for the same
          -- (type, date) — its row is now there, use it.
          SELECT id INTO v_id
          FROM recharge_daily_balances
          WHERE recharge_type_id = p_recharge_type_id AND date = p_date;
        END IF;

        RETURN v_id;
      END;
      $fn$;
    `);

    // ------------------------------------------------------------------
    // register_recharge_purchase: the atomic "buy more balance" operation
    // — validates the type, ensures today's row exists, records the
    // individual movement, and increments the running total, all inside
    // one transaction (FUNCTION, not PROCEDURE — same reasoning as
    // confirm_sale/confirm_purchase elsewhere in this codebase: a RAISE
    // EXCEPTION here rolls back everything it did, with no explicit
    // BEGIN/COMMIT). A purchase is rejected once the day is already
    // closed (final_balance set) — layering a new purchase onto a closed
    // day would silently change daily_balance without the already-
    // recorded sale figure ever being reconciled against it.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_recharge_purchase(
        p_recharge_type_id UUID,
        p_date DATE,
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

        v_daily_balance_id := ensure_recharge_daily_balance(p_recharge_type_id, p_date, p_user_id);

        SELECT final_balance INTO v_final_balance
        FROM recharge_daily_balances
        WHERE id = v_daily_balance_id
        FOR UPDATE;

        IF v_final_balance IS NOT NULL THEN
          RAISE EXCEPTION 'DAY_ALREADY_CLOSED:%', v_daily_balance_id;
        END IF;

        INSERT INTO recharge_purchases
          (recharge_type_id, daily_balance_id, amount, purchase_date, created_by)
        VALUES
          (p_recharge_type_id, v_daily_balance_id, p_amount, p_date, p_user_id);

        UPDATE recharge_daily_balances
        SET daily_balance = daily_balance + p_amount,
            updated_by = p_user_id,
            updated_at = now()
        WHERE id = v_daily_balance_id;

        RETURN v_daily_balance_id;
      END;
      $fn$;
    `);

    // ------------------------------------------------------------------
    // register_recharge_final_balance: the day-close operation. Locks the
    // row, rejects a negative value or one exceeding the day's available
    // balance (the ticket's explicit "no se puede tener más saldo final
    // que el saldo disponible" rule), then writes it — "ventas" is never
    // stored here, it's always `daily_balance - final_balance`, computed
    // on read (same "derive, don't duplicate" choice as the Reports
    // module). Re-running this on an already-closed day simply overwrites
    // final_balance — the *permission* to do that (only an admin, once
    // already closed) is an application-layer rule, not this function's
    // concern, exactly like `CreatePurchaseUseCase` owns date-range
    // validation instead of `confirm_purchase()`.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_recharge_final_balance(
        p_daily_balance_id UUID,
        p_final_balance NUMERIC,
        p_user_id UUID
      )
      RETURNS VOID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_daily_balance NUMERIC(12,2);
      BEGIN
        SELECT daily_balance INTO v_daily_balance
        FROM recharge_daily_balances
        WHERE id = p_daily_balance_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'DAILY_BALANCE_NOT_FOUND:%', p_daily_balance_id;
        END IF;

        IF p_final_balance IS NULL OR p_final_balance < 0 THEN
          RAISE EXCEPTION 'INVALID_FINAL_BALANCE:%', p_daily_balance_id;
        END IF;

        IF p_final_balance > v_daily_balance THEN
          RAISE EXCEPTION 'FINAL_BALANCE_EXCEEDS_DAILY:%', p_daily_balance_id;
        END IF;

        UPDATE recharge_daily_balances
        SET final_balance = p_final_balance,
            updated_by = p_user_id,
            updated_at = now()
        WHERE id = p_daily_balance_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_recharge_final_balance(UUID, NUMERIC, UUID)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_recharge_purchase(UUID, DATE, NUMERIC, UUID)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS ensure_recharge_daily_balance(UUID, DATE, UUID)',
    );
    await queryRunner.dropTable('recharge_purchases');
    await queryRunner.dropTable('recharge_daily_balances');
    await queryRunner.dropTable('recharge_types');
  }
}
