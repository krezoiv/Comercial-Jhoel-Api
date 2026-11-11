import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Control de Efectivo — daily indicators restart on every bank-day opening
 * (Agentes Bancarios → Bancos → "Aperturar día").
 *
 * The cash Kardex (`cash_movements`) is NOT touched: no row is added,
 * changed or re-dated, and the physical cash balance keeps its continuity
 * (it is still the last `new_balance` of the Kardex).
 *
 * What is added is one ANCHOR per bank day, `cash_bank_day_openings`: the
 * Kardex sequence and the official cash balance at the exact moment the bank
 * day was opened. It is written by an AFTER INSERT trigger on `day_openings`,
 * i.e. in the same transaction as the opening itself (atomic), under the
 * same advisory lock as `apply_cash_movement` (no movement can slip between
 * reading the sequence and the balance), and only once per date (UNIQUE;
 * re-opening or a double click never resets anything).
 *
 * A bank day's indicators are therefore the Kardex movements with
 *   opening_sequence < sequence <= next opening's opening_sequence
 * (view `cash_bank_day_ranges`), recomputed on every read from the original
 * movements — nothing is accumulated or stored that could get out of date.
 * Movements registered before a day's opening belong to the previous bank
 * day, so at the moment of the opening every daily total is exactly zero.
 *
 * Existing bank days are backfilled from the Kardex itself (sequence and
 * balance as of each day's `opened_at`), never invented. Anchors are
 * append-only. `down` drops the trigger, view and functions; the table and
 * its rows are kept.
 */
export class CashDailyIndicatorsFromBankDayOpening1760007300000 implements MigrationInterface {
  name = 'CashDailyIndicatorsFromBankDayOpening1760007300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_bank_day_openings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        day_opening_id UUID NOT NULL REFERENCES day_openings(id) ON DELETE RESTRICT,
        business_date DATE NOT NULL,
        opening_sequence BIGINT NOT NULL,
        opening_cash_balance NUMERIC(14,2) NOT NULL,
        opened_at TIMESTAMPTZ NOT NULL,
        opened_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        source VARCHAR(15) NOT NULL DEFAULT 'APERTURA',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_cash_bank_day_openings_day" UNIQUE (day_opening_id),
        CONSTRAINT "UQ_cash_bank_day_openings_date" UNIQUE (business_date),
        CONSTRAINT "CHK_cash_bank_day_openings_sequence" CHECK (opening_sequence >= 0),
        CONSTRAINT "CHK_cash_bank_day_openings_source" CHECK (source IN ('APERTURA', 'BACKFILL'))
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_cash_bank_day_openings_order" ON cash_bank_day_openings (opening_sequence, opened_at)`,
    );

    // Anchors are history: never edited or deleted.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_bank_day_openings_immutable() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      BEGIN
        RAISE EXCEPTION 'CASH_BANK_DAY_OPENING_IMMUTABLE';
      END;
      $$
    `);
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_cash_bank_day_openings_immutable ON cash_bank_day_openings`,
    );
    await queryRunner.query(`
      CREATE TRIGGER trg_cash_bank_day_openings_immutable
      BEFORE UPDATE OR DELETE ON cash_bank_day_openings
      FOR EACH ROW EXECUTE FUNCTION cash_bank_day_openings_immutable()
    `);

    // Same transaction as the bank-day opening; same lock as apply_cash_movement.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cash_bank_day_on_opening() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      DECLARE
        v_sequence BIGINT;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        SELECT COALESCE(max(sequence), 0) INTO v_sequence FROM cash_movements;
        INSERT INTO cash_bank_day_openings (
          day_opening_id, business_date, opening_sequence, opening_cash_balance, opened_at, opened_by, source
        ) VALUES (
          NEW.id, NEW.date, v_sequence, cash_balance_at(v_sequence), NEW.opened_at, NEW.opened_by, 'APERTURA'
        )
        ON CONFLICT DO NOTHING;
        RETURN NEW;
      END;
      $$
    `);
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_cash_bank_day_on_opening ON day_openings`,
    );
    await queryRunner.query(`
      CREATE TRIGGER trg_cash_bank_day_on_opening
      AFTER INSERT ON day_openings
      FOR EACH ROW EXECUTE FUNCTION cash_bank_day_on_opening()
    `);

    // Backfill the bank days that already exist, from the Kardex as of each opening.
    await queryRunner.query(`
      INSERT INTO cash_bank_day_openings (
        day_opening_id, business_date, opening_sequence, opening_cash_balance, opened_at, opened_by, source
      )
      SELECT o.id, o.date, s.seq, cash_balance_at(s.seq), o.opened_at, o.opened_by, 'BACKFILL'
      FROM day_openings o
      CROSS JOIN LATERAL (
        SELECT COALESCE(max(m.sequence), 0) AS seq FROM cash_movements m WHERE m.created_at <= o.opened_at
      ) s
      ON CONFLICT DO NOTHING
    `);

    // Kardex range of every bank day: (opening_sequence, next opening_sequence].
    await queryRunner.query(`
      CREATE OR REPLACE VIEW cash_bank_day_ranges AS
      SELECT a.id, a.day_opening_id, a.business_date, a.opening_sequence AS start_sequence,
             LEAD(a.opening_sequence) OVER w AS end_sequence,
             a.opening_cash_balance, a.opened_at, a.opened_by, a.source,
             LEAD(a.opening_sequence) OVER w IS NULL AS is_current
      FROM cash_bank_day_openings a
      WINDOW w AS (ORDER BY a.opening_sequence, a.opened_at, a.business_date)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS cash_bank_day_ranges`);
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_cash_bank_day_on_opening ON day_openings`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS cash_bank_day_on_opening()`,
    );
    // The anchors table, its immutability trigger and its rows are kept on purpose.
  }
}
