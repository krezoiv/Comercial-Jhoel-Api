import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * "Apertura del Día" / "Cierre del Día" / "Gestión de Días Cerrados" para
 * Recargas Electrónicas — a fully independent day-lifecycle cycle for this
 * module, deliberately NOT sharing Banks' own `day_openings`/
 * `day_audit_logs` tables. Reuse was considered and rejected: `day_openings`
 * has a bare `UNIQUE (date)` with no module discriminator column, so a
 * Recargas "day open" for a given date would collide with a Banks "day
 * open" for that same date if the same row were shared — the two modules
 * must be able to open/close independently for the same calendar date.
 * This migration is the greenfield equivalent of Banks' own three
 * historical migrations (`CreateDayOpenings`, `AddDayClosingToDayOpenings`,
 * `AddDayReopeningAndAudit`) combined into one, since there's no existing
 * data here to migrate incrementally.
 *
 * One deliberate design difference from Banks, confirmed with the product
 * owner before implementing: Recargas already has a shipped, tested
 * "cuadre cycles" feature (`register_recharge_sales_closure` lets the same
 * calendar date save more than one cuadre, each one resetting
 * `recharge_daily_balances` for a fresh cycle). Banks' `close_agent_day`
 * saves its one-and-only reconciliation AND closes the day in the same
 * call — doing the same here would make a second same-day cuadre require
 * an admin reopen first, breaking that existing feature. So `close_
 * recharge_day` below is a separate, standalone action carrying no
 * business data of its own — cuadre saves and day-closing are independent
 * actions for this module, unlike Banks where they're the same one.
 */
export class CreateRechargeDayOpenings1759000000000
  implements MigrationInterface
{
  name = 'CreateRechargeDayOpenings1759000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'recharge_day_openings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'date', type: 'date', isUnique: true },
          { name: 'opened_by', type: 'uuid' },
          { name: 'opened_at', type: 'timestamptz', default: 'now()' },
          { name: 'closed_at', type: 'timestamptz', isNullable: true },
          { name: 'closed_by', type: 'uuid', isNullable: true },
          { name: 'reopened_at', type: 'timestamptz', isNullable: true },
          { name: 'reopened_by', type: 'uuid', isNullable: true },
          { name: 'reopen_reason', type: 'text', isNullable: true },
          { name: 'is_cancelled', type: 'boolean', isNullable: false, default: false },
          { name: 'cancelled_at', type: 'timestamptz', isNullable: true },
          { name: 'cancelled_by', type: 'uuid', isNullable: true },
          { name: 'cancel_reason', type: 'text', isNullable: true },
        ],
        foreignKeys: [
          {
            name: 'FK_recharge_day_openings_opened_by',
            columnNames: ['opened_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_recharge_day_openings_closed_by',
            columnNames: ['closed_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_recharge_day_openings_reopened_by',
            columnNames: ['reopened_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_recharge_day_openings_cancelled_by',
            columnNames: ['cancelled_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    // History of this cycle's own transitions (opened, closed/re-closed,
    // reopened, cancelled) — deliberately not a generic field-change log,
    // same "cycle history, not per-edit history" scope as Banks'
    // `day_audit_logs`.
    await queryRunner.createTable(
      new Table({
        name: 'recharge_day_audit_logs',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
          { name: 'date', type: 'date' },
          { name: 'action', type: 'varchar', length: '30' },
          { name: 'performed_by', type: 'uuid' },
          { name: 'performed_at', type: 'timestamptz', default: 'now()' },
          { name: 'reason', type: 'text', isNullable: true },
          { name: 'previous_status', type: 'varchar', length: '30', isNullable: true },
          { name: 'new_status', type: 'varchar', length: '30', isNullable: true },
        ],
        foreignKeys: [
          {
            name: 'FK_recharge_day_audit_logs_performed_by',
            columnNames: ['performed_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'recharge_day_audit_logs',
      new TableIndex({ name: 'IDX_recharge_day_audit_logs_date', columnNames: ['date'] }),
    );

    // ------------------------------------------------------------------
    // close_recharge_day: the standalone "Cerrar Día" action (see this
    // migration's own doc comment for why it's separate from "Guardar
    // Cuadre"). Requires at least one recharge_sales_closures row already
    // saved for this date — without this, an operator could open a day,
    // sell recargas all day, and close it without ever reconciling cash,
    // defeating the point of the whole feature. Does NOT require the
    // *current* (freshly-reset) cycle itself to be closed: after a
    // successful cuadre save a new empty cycle always starts immediately,
    // so requiring that would make this action permanently unreachable.
    // Inserts no business row of its own — unlike close_agent_day, which
    // inserts agent_reconciliations in the same call.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION close_recharge_day(
        p_date DATE,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_day RECORD;
        v_closure_count INTEGER;
        v_previous_status TEXT;
      BEGIN
        SELECT * INTO v_day FROM recharge_day_openings WHERE date = p_date FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'RECHARGE_DAY_NOT_OPENED:%', p_date;
        END IF;

        IF v_day.is_cancelled THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CANCELLED:%', p_date;
        END IF;

        IF v_day.closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_ALREADY_CLOSED:%', p_date;
        END IF;

        SELECT COUNT(*) INTO v_closure_count FROM recharge_sales_closures WHERE date = p_date;
        IF v_closure_count = 0 THEN
          RAISE EXCEPTION 'RECHARGE_DAY_NOT_READY_TO_CLOSE:%', p_date;
        END IF;

        v_previous_status := CASE WHEN v_day.reopened_at IS NOT NULL THEN 'REOPENED' ELSE 'OPENED' END;

        UPDATE recharge_day_openings
        SET closed_at = now(), closed_by = p_user_id
        WHERE date = p_date;

        INSERT INTO recharge_day_audit_logs (date, action, performed_by, previous_status, new_status)
        VALUES (p_date, 'CLOSED', p_user_id, v_previous_status, 'CLOSED');

        RETURN v_day.id;
      END;
      $fn$;
    `);

    // ------------------------------------------------------------------
    // reopen_recharge_day / cancel_recharge_day: same shape and same
    // later-day integrity rule as Banks' reopen_agent_day/cancel_agent_day
    // (Option A of the days-posteriores analysis — reject rather than
    // cascade-recalculate), written with the reopened-inclusive later-day
    // check from the start (Banks needed a follow-up fix migration for
    // this; this version doesn't).
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION reopen_recharge_day(
        p_date DATE,
        p_user_id UUID,
        p_reason TEXT
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_day RECORD;
        v_later_count INTEGER;
        v_log_id UUID;
      BEGIN
        IF p_reason IS NULL OR btrim(p_reason) = '' THEN
          RAISE EXCEPTION 'RECHARGE_REOPEN_REASON_REQUIRED:%', p_date;
        END IF;

        SELECT * INTO v_day FROM recharge_day_openings WHERE date = p_date FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'RECHARGE_DAY_NOT_FOUND:%', p_date;
        END IF;

        IF v_day.is_cancelled THEN
          RAISE EXCEPTION 'RECHARGE_DAY_CANCELLED:%', p_date;
        END IF;

        IF v_day.closed_at IS NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_NOT_CLOSED:%', p_date;
        END IF;

        SELECT COUNT(*) INTO v_later_count
        FROM recharge_day_openings
        WHERE date > p_date
          AND is_cancelled = false
          AND (closed_at IS NOT NULL OR reopened_at IS NOT NULL);
        IF v_later_count > 0 THEN
          RAISE EXCEPTION 'RECHARGE_LATER_DAY_EXISTS:%', p_date;
        END IF;

        UPDATE recharge_day_openings
        SET closed_at = NULL,
            reopened_at = now(),
            reopened_by = p_user_id,
            reopen_reason = p_reason
        WHERE date = p_date;

        INSERT INTO recharge_day_audit_logs (date, action, performed_by, reason, previous_status, new_status)
        VALUES (p_date, 'REOPENED', p_user_id, p_reason, 'CLOSED', 'REOPENED')
        RETURNING id INTO v_log_id;

        RETURN v_log_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cancel_recharge_day(
        p_date DATE,
        p_user_id UUID,
        p_reason TEXT
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_day RECORD;
        v_later_count INTEGER;
        v_log_id UUID;
        v_previous_status TEXT;
      BEGIN
        IF p_reason IS NULL OR btrim(p_reason) = '' THEN
          RAISE EXCEPTION 'RECHARGE_CANCEL_REASON_REQUIRED:%', p_date;
        END IF;

        SELECT * INTO v_day FROM recharge_day_openings WHERE date = p_date FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'RECHARGE_DAY_NOT_FOUND:%', p_date;
        END IF;

        IF v_day.is_cancelled THEN
          RAISE EXCEPTION 'RECHARGE_DAY_ALREADY_CANCELLED:%', p_date;
        END IF;

        IF v_day.closed_at IS NULL THEN
          RAISE EXCEPTION 'RECHARGE_DAY_NOT_CLOSED:%', p_date;
        END IF;

        SELECT COUNT(*) INTO v_later_count
        FROM recharge_day_openings
        WHERE date > p_date
          AND is_cancelled = false
          AND (closed_at IS NOT NULL OR reopened_at IS NOT NULL);
        IF v_later_count > 0 THEN
          RAISE EXCEPTION 'RECHARGE_LATER_DAY_EXISTS:%', p_date;
        END IF;

        v_previous_status := CASE WHEN v_day.reopened_at IS NOT NULL THEN 'REOPENED' ELSE 'CLOSED' END;

        UPDATE recharge_day_openings
        SET is_cancelled = true,
            cancelled_at = now(),
            cancelled_by = p_user_id,
            cancel_reason = p_reason
        WHERE date = p_date;

        INSERT INTO recharge_day_audit_logs (date, action, performed_by, reason, previous_status, new_status)
        VALUES (p_date, 'CANCELLED', p_user_id, p_reason, v_previous_status, 'CANCELLED')
        RETURNING id INTO v_log_id;

        RETURN v_log_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP FUNCTION IF EXISTS cancel_recharge_day(DATE, UUID, TEXT)');
    await queryRunner.query('DROP FUNCTION IF EXISTS reopen_recharge_day(DATE, UUID, TEXT)');
    await queryRunner.query('DROP FUNCTION IF EXISTS close_recharge_day(DATE, UUID)');
    await queryRunner.dropTable('recharge_day_audit_logs');
    await queryRunner.dropTable('recharge_day_openings');
  }
}
