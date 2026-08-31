import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Corrige `reopen_agent_day`/`cancel_agent_day`: la regla de días
 * posteriores (Opción A) comparaba solo `closed_at IS NOT NULL`, lo que
 * dejaba pasar una fecha posterior que está actualmente `REOPENED`
 * (`closed_at` vuelve a `NULL` mientras está reabierta) como si no
 * existiera ningún día posterior gestionado — exactamente el hueco que
 * esta regla existe para cerrar. Un día `REOPENED` sigue representando un
 * ciclo ya completado en algún momento (tiene `reopened_at` seteado), así
 * que también debe bloquear. Encontrado durante las pruebas de este mismo
 * ticket, antes de que ningún dato real dependiera del comportamiento
 * anterior — `CREATE OR REPLACE FUNCTION`, sin tocar ninguna tabla ni dato.
 */
export class FixLaterDayCheckIncludesReopened1758900100000 implements MigrationInterface {
  name = 'FixLaterDayCheckIncludesReopened1758900100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION reopen_agent_day(
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
          RAISE EXCEPTION 'REOPEN_REASON_REQUIRED:%', p_date;
        END IF;

        SELECT * INTO v_day FROM day_openings WHERE date = p_date FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'DAY_NOT_FOUND:%', p_date;
        END IF;

        IF v_day.is_cancelled THEN
          RAISE EXCEPTION 'DAY_CANCELLED:%', p_date;
        END IF;

        IF v_day.closed_at IS NULL THEN
          RAISE EXCEPTION 'DAY_NOT_CLOSED:%', p_date;
        END IF;

        SELECT COUNT(*) INTO v_later_count
        FROM day_openings
        WHERE date > p_date
          AND is_cancelled = false
          AND (closed_at IS NOT NULL OR reopened_at IS NOT NULL);
        IF v_later_count > 0 THEN
          RAISE EXCEPTION 'LATER_DAY_EXISTS:%', p_date;
        END IF;

        UPDATE day_openings
        SET closed_at = NULL,
            reopened_at = now(),
            reopened_by = p_user_id,
            reopen_reason = p_reason
        WHERE date = p_date;

        INSERT INTO day_audit_logs (date, action, performed_by, reason, previous_status, new_status)
        VALUES (p_date, 'REOPENED', p_user_id, p_reason, 'CLOSED', 'REOPENED')
        RETURNING id INTO v_log_id;

        RETURN v_log_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cancel_agent_day(
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
          RAISE EXCEPTION 'CANCEL_REASON_REQUIRED:%', p_date;
        END IF;

        SELECT * INTO v_day FROM day_openings WHERE date = p_date FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'DAY_NOT_FOUND:%', p_date;
        END IF;

        IF v_day.is_cancelled THEN
          RAISE EXCEPTION 'DAY_ALREADY_CANCELLED:%', p_date;
        END IF;

        IF v_day.closed_at IS NULL THEN
          RAISE EXCEPTION 'DAY_NOT_CLOSED:%', p_date;
        END IF;

        SELECT COUNT(*) INTO v_later_count
        FROM day_openings
        WHERE date > p_date
          AND is_cancelled = false
          AND (closed_at IS NOT NULL OR reopened_at IS NOT NULL);
        IF v_later_count > 0 THEN
          RAISE EXCEPTION 'LATER_DAY_EXISTS:%', p_date;
        END IF;

        v_previous_status := CASE WHEN v_day.reopened_at IS NOT NULL THEN 'REOPENED' ELSE 'CLOSED' END;

        UPDATE day_openings
        SET is_cancelled = true,
            cancelled_at = now(),
            cancelled_by = p_user_id,
            cancel_reason = p_reason
        WHERE date = p_date;

        INSERT INTO day_audit_logs (date, action, performed_by, reason, previous_status, new_status)
        VALUES (p_date, 'CANCELLED', p_user_id, p_reason, v_previous_status, 'CANCELLED')
        RETURNING id INTO v_log_id;

        RETURN v_log_id;
      END;
      $fn$;
    `);
  }

  public async down(): Promise<void> {
    // Revertir significaría reintroducir el hueco corregido — no se provee
    // un downgrade funcional a propósito, igual que otras correcciones de
    // función ya hechas en este proyecto (ver `OnlySyncBanksFinalBalance
    // ForLatestDate`).
  }
}
