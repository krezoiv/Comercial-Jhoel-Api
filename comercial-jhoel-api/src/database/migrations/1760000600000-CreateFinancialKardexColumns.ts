import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Evolves `accounts_receivable` and `assets` from flat, independently-summed
 * entries into a real Kardex/ledger: every row is now an explicit `CARGO` or
 * `ABONO` movement, and a client's balance is the signed running sum of
 * their own movements. Deliberately additive to the **existing** tables —
 * no new `_movements`/`_kardex` table — a movement already *is* a row here,
 * it just gains a type.
 *
 * **`amount` stays an always-positive magnitude** (never re-interpreted) —
 * the sign comes from `movement_type` at query time
 * (`CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END`), never
 * from the stored value. This is what lets a Kardex table show separate
 * Cargo/Abono columns with zero extra computation.
 *
 * **No `balance_after` column, on purpose.** A stored running balance would
 * require the history to be strictly append-only to stay correct — but
 * `UpdateAccountReceivableUseCase`/`UpdateAssetUseCase` and their
 * `Deactivate*UseCase` siblings already let an admin edit or soft-delete any
 * row today, and this migration deliberately does not touch that capability
 * (a real, already-used correction tool — see the module CLAUDE.md for the
 * full reasoning). Instead, every read computes the balance fresh with a
 * window function over `sequence` — the Kardex is always correct no matter
 * what the admin screens do to a row later, nothing to desync. Same
 * "derive, don't duplicate" precedent this codebase already uses for
 * `RechargeDailyBalance.totalPurchases`/Reports' own folio numbers.
 *
 * **Backfill, not invention**: every pre-existing row becomes exactly one
 * movement — `accounts_receivable` rows were already 100% positive amounts
 * (its own `CHECK (amount > 0)` never lapsed), so they all become `CARGO`
 * unchanged. `assets` rows split by sign: `amount >= 0` becomes `CARGO`
 * as-is; `amount < 0` (a real, already-used correction pattern — 5 of 29
 * live rows, confirmed via `psql` before writing this migration, not
 * assumed) becomes `ABONO` with `amount` flipped to its absolute value —
 * the signed running total per client is mathematically identical before
 * and after (verified directly post-migration, see this repo's own session
 * notes). No abono/cargo is invented that didn't already exist as a row.
 */
export class CreateFinancialKardexColumns1760000600000
  implements MigrationInterface
{
  name = 'CreateFinancialKardexColumns1760000600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ------------------------------------------------------------------
    // accounts_receivable — every existing row is already a positive
    // amount, so backfilling to CARGO changes no value, only labels intent.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      ALTER TABLE accounts_receivable
        ADD COLUMN movement_type VARCHAR(20) NOT NULL DEFAULT 'CARGO',
        ADD COLUMN sequence BIGSERIAL;
    `);
    await queryRunner.query(`
      ALTER TABLE accounts_receivable
        ADD CONSTRAINT "CHK_accounts_receivable_movement_type"
        CHECK (movement_type IN ('CARGO', 'ABONO'));
    `);

    // ------------------------------------------------------------------
    // assets — split existing rows by sign, then normalize amount to a
    // positive magnitude now that the sign lives in movement_type instead.
    // Order matters: flip amount to ABONO's positive magnitude BEFORE
    // re-adding the positive-only CHECK below, or the constraint would
    // reject the still-negative rows mid-migration.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      ALTER TABLE assets
        ADD COLUMN movement_type VARCHAR(20) NOT NULL DEFAULT 'CARGO',
        ADD COLUMN sequence BIGSERIAL;
    `);
    await queryRunner.query(`
      UPDATE assets SET movement_type = 'ABONO' WHERE amount < 0;
    `);
    await queryRunner.query(`
      UPDATE assets SET amount = ABS(amount) WHERE movement_type = 'ABONO';
    `);
    await queryRunner.query(`
      ALTER TABLE assets
        ADD CONSTRAINT "CHK_assets_movement_type"
        CHECK (movement_type IN ('CARGO', 'ABONO'));
    `);
    // Re-adds the positive-only guardrail this table had before
    // `AllowNegativeAssetAmount` dropped it — `amount` is a magnitude again,
    // not a signed value, so this no longer conflicts with that ticket's
    // intent (a negative entry is now `movement_type = 'ABONO'`, not a
    // negative `amount`).
    await queryRunner.query(`
      ALTER TABLE assets
        ADD CONSTRAINT "CHK_assets_amount_positive" CHECK (amount > 0);
    `);

    // ==================================================================
    // register_account_receivable_movement — the transactional write path
    // for the new Kardex flow (Registrar Cargo / Registrar Abono). A
    // FUNCTION, not a PROCEDURE, so any RAISE EXCEPTION rolls back the
    // whole insert with no explicit BEGIN/COMMIT — same convention as
    // every other critical-write module in this codebase.
    // `pg_advisory_xact_lock(hashtext(p_client_id::text))` serializes two
    // concurrent movements for the SAME client (the actual race this
    // ticket asked to prevent) without blocking movements for any other
    // client — released automatically at commit/rollback, no manual
    // unlock needed. Balance is computed fresh inside the lock, never
    // trusted from the caller, so two simultaneous abonos against the same
    // pending balance can never both succeed incorrectly.
    //
    // ABONO_EXCEEDS_BALANCE is enforced HERE — Cuentas por Cobrar has
    // never allowed a negative balance (its own `amount > 0` CHECK never
    // lapsed), so this preserves that existing rule exactly rather than
    // introducing a new one.
    // ==================================================================
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_account_receivable_movement(
        p_client_id UUID,
        p_type VARCHAR,
        p_amount NUMERIC,
        p_date DATE,
        p_description VARCHAR,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_id UUID;
        v_current_balance NUMERIC(12,2);
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext(p_client_id::text));

        IF p_type NOT IN ('CARGO', 'ABONO') THEN
          RAISE EXCEPTION 'INVALID_MOVEMENT_TYPE:%', p_client_id;
        END IF;
        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_client_id;
        END IF;

        SELECT COALESCE(SUM(CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END), 0)
        INTO v_current_balance
        FROM accounts_receivable
        WHERE client_id = p_client_id AND is_active = true;

        IF p_type = 'ABONO' AND p_amount > v_current_balance THEN
          RAISE EXCEPTION 'ABONO_EXCEEDS_BALANCE:%', p_client_id;
        END IF;

        INSERT INTO accounts_receivable (client_id, date, amount, description, movement_type, created_by)
        VALUES (p_client_id, p_date, p_amount, p_description, p_type, p_user_id)
        RETURNING id INTO v_id;

        RETURN v_id;
      END;
      $fn$;
    `);

    // ==================================================================
    // register_asset_movement — same shape, deliberately WITHOUT the
    // ABONO_EXCEEDS_BALANCE guard: Activos' own architecture already
    // allows its running total to go negative (the whole reason
    // `AllowNegativeAssetAmount` dropped the old CHECK — 5 real, live rows
    // depend on exactly this today), so this preserves that capability
    // rather than silently introducing a new restriction. Also replaces
    // `TypeOrmAssetRepository.create()`'s old plain INSERT, which had no
    // concurrency protection at all — this is a real correctness
    // improvement for Activos, not just a formality to match Cuentas por
    // Cobrar's shape.
    // ==================================================================
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_asset_movement(
        p_client_id UUID,
        p_type VARCHAR,
        p_amount NUMERIC,
        p_date DATE,
        p_description VARCHAR,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_id UUID;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext(p_client_id::text));

        IF p_type NOT IN ('CARGO', 'ABONO') THEN
          RAISE EXCEPTION 'INVALID_MOVEMENT_TYPE:%', p_client_id;
        END IF;
        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_client_id;
        END IF;

        INSERT INTO assets (client_id, date, amount, description, movement_type, created_by)
        VALUES (p_client_id, p_date, p_amount, p_description, p_type, p_user_id)
        RETURNING id INTO v_id;

        RETURN v_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_asset_movement(UUID, VARCHAR, NUMERIC, DATE, VARCHAR, UUID)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_account_receivable_movement(UUID, VARCHAR, NUMERIC, DATE, VARCHAR, UUID)',
    );
    // No down-migration for the assets sign-split: reverting would need to
    // re-negate every ABONO row's amount and cannot distinguish those from
    // any genuine ABONO registered after this migration through the new
    // Kardex flow — the same "no downgrade for a correctness/structural
    // change" precedent already used elsewhere in this project (see
    // `AddWholesalePricingToSales`'s own `down()`).
    await queryRunner.query(
      'ALTER TABLE assets DROP CONSTRAINT IF EXISTS "CHK_assets_amount_positive"',
    );
    await queryRunner.query(
      'ALTER TABLE assets DROP CONSTRAINT IF EXISTS "CHK_assets_movement_type"',
    );
    await queryRunner.query(
      'ALTER TABLE assets DROP COLUMN IF EXISTS sequence',
    );
    await queryRunner.query(
      'ALTER TABLE assets DROP COLUMN IF EXISTS movement_type',
    );
    await queryRunner.query(
      'ALTER TABLE accounts_receivable DROP CONSTRAINT IF EXISTS "CHK_accounts_receivable_movement_type"',
    );
    await queryRunner.query(
      'ALTER TABLE accounts_receivable DROP COLUMN IF EXISTS sequence',
    );
    await queryRunner.query(
      'ALTER TABLE accounts_receivable DROP COLUMN IF EXISTS movement_type',
    );
  }
}
