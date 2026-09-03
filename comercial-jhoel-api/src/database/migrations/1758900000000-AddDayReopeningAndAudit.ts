import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableIndex,
} from 'typeorm';

/**
 * "Gestión de Días Cerrados" — reapertura controlada, recierre y anulación
 * de un ciclo ya cerrado, más su auditoría. Puramente aditivo: columnas
 * nuevas NULLABLE (o `DEFAULT false`) en `day_openings`, tabla nueva
 * `day_audit_logs`. Ningún dato existente se toca ni se borra.
 *
 * `reopened_at`/`reopened_by`/`reopen_reason` NUNCA se limpian al volver a
 * cerrar — quedan como marca permanente de "este ciclo fue reabierto al
 * menos una vez", que es exactamente lo que `GetDayStatusUseCase` necesita
 * para distinguir `REOPENED` de `OPENED` sin un estado paralelo. Reabrir
 * simplemente vuelve a poner `closed_at = NULL`, así que
 * `SaveBankBalancesUseCase`/`CloseAgentDayUseCase` (que solo preguntan
 * `closed_at IS NOT NULL`) vuelven a permitir edición/cierre sin ningún
 * cambio en su propia lógica — ver `reopen_agent_day` más abajo.
 *
 * `is_cancelled`/`cancelled_at`/`cancelled_by`/`cancel_reason` son el soft
 * delete de "Anular Día": nunca se borra `bank_balances`/
 * `agent_reconciliations`, solo se marca el ciclo del `day_openings` como
 * anulado — la fecha queda en un estado terminal, no se libera para un
 * nuevo ciclo.
 */
export class AddDayReopeningAndAudit1758900000000 implements MigrationInterface {
  name = 'AddDayReopeningAndAudit1758900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('day_openings', [
      new TableColumn({
        name: 'reopened_at',
        type: 'timestamptz',
        isNullable: true,
      }),
      new TableColumn({ name: 'reopened_by', type: 'uuid', isNullable: true }),
      new TableColumn({
        name: 'reopen_reason',
        type: 'text',
        isNullable: true,
      }),
      new TableColumn({
        name: 'is_cancelled',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: 'cancelled_at',
        type: 'timestamptz',
        isNullable: true,
      }),
      new TableColumn({ name: 'cancelled_by', type: 'uuid', isNullable: true }),
      new TableColumn({
        name: 'cancel_reason',
        type: 'text',
        isNullable: true,
      }),
    ]);

    await queryRunner.query(`
      ALTER TABLE day_openings
      ADD CONSTRAINT "FK_day_openings_reopened_by" FOREIGN KEY (reopened_by) REFERENCES users(id) ON DELETE RESTRICT,
      ADD CONSTRAINT "FK_day_openings_cancelled_by" FOREIGN KEY (cancelled_by) REFERENCES users(id) ON DELETE RESTRICT
    `);

    // Historial de transiciones del ciclo de un día (apertura, cierre/
    // recierre, reapertura, anulación) — deliberadamente NO registra cada
    // edición individual de saldo (ver el propio comentario de
    // `ReopenDayUseCase`/`CancelDayUseCase`): es el historial DEL CICLO,
    // no un log genérico de cambios de campo.
    await queryRunner.createTable(
      new Table({
        name: 'day_audit_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'date', type: 'date' },
          { name: 'action', type: 'varchar', length: '30' },
          { name: 'performed_by', type: 'uuid' },
          { name: 'performed_at', type: 'timestamptz', default: 'now()' },
          { name: 'reason', type: 'text', isNullable: true },
          {
            name: 'previous_status',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },
          {
            name: 'new_status',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'FK_day_audit_logs_performed_by',
            columnNames: ['performed_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'day_audit_logs',
      new TableIndex({
        name: 'IDX_day_audit_logs_date',
        columnNames: ['date'],
      }),
    );

    // ------------------------------------------------------------------
    // reopen_agent_day: reapertura controlada de un día CLOSED/REOPENED.
    // Bajo el lock FOR UPDATE de la fila: exige que el día exista, que
    // esté realmente cerrado (closed_at IS NOT NULL), que no esté anulado,
    // y — la regla de integridad de días posteriores (Opción A) — que NO
    // exista una fecha estrictamente posterior con un ciclo CLOSED/
    // REOPENED y no anulado. Nunca recalcula fechas posteriores en
    // cascada: si existen, simplemente rechaza.
    // ------------------------------------------------------------------
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
          AND closed_at IS NOT NULL;
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

    // ------------------------------------------------------------------
    // cancel_agent_day: anulación (soft delete) de un ciclo CLOSED o
    // REOPENED. Nunca borra bank_balances/agent_reconciliations — solo
    // marca day_openings. Misma regla de días posteriores que reopen.
    // ------------------------------------------------------------------
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
          AND closed_at IS NOT NULL;
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

    // ------------------------------------------------------------------
    // close_agent_day: misma función del ticket de "Cierre del Día",
    // extendida (CREATE OR REPLACE, no una función nueva) para además
    // insertar su propio registro de auditoría — un recierre después de
    // una reapertura pasa por esta MISMA función sin ningún caso de uso
    // nuevo, así que su propio registro de auditoría es el único lugar
    // donde puede quedar constancia de "se volvió a cerrar". El
    // `previous_status` distingue un cierre normal ('BANK_BALANCES_SAVED')
    // de un recierre ('REOPENED') leyendo `reopened_at` de la misma fila
    // ya bloqueada — sin esto, "recierre" e "primer cierre" serían
    // indistinguibles en el historial.
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION close_agent_day(
        p_date DATE,
        p_total_cash NUMERIC,
        p_total_banks NUMERIC,
        p_total_assets NUMERIC,
        p_total_accounts_receivable NUMERIC,
        p_result NUMERIC,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_day_opening RECORD;
        v_active_banks_count INTEGER;
        v_balances_count INTEGER;
        v_reconciliation_id UUID;
        v_previous_status TEXT;
      BEGIN
        SELECT * INTO v_day_opening FROM day_openings WHERE date = p_date FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'DAY_NOT_OPENED:%', p_date;
        END IF;

        IF v_day_opening.closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'DAY_ALREADY_CLOSED:%', p_date;
        END IF;

        SELECT COUNT(*) INTO v_active_banks_count FROM banks WHERE is_active = true;
        SELECT COUNT(*) INTO v_balances_count FROM bank_balances WHERE operation_date = p_date;

        IF v_balances_count < v_active_banks_count THEN
          RAISE EXCEPTION 'BANK_BALANCES_NOT_REGISTERED:%', p_date;
        END IF;

        v_previous_status := CASE WHEN v_day_opening.reopened_at IS NOT NULL THEN 'REOPENED' ELSE 'BANK_BALANCES_SAVED' END;

        INSERT INTO agent_reconciliations
          (date, total_cash, total_banks, total_assets, total_accounts_receivable, result, created_by)
        VALUES
          (p_date, p_total_cash, p_total_banks, p_total_assets, p_total_accounts_receivable, p_result, p_user_id)
        RETURNING id INTO v_reconciliation_id;

        UPDATE day_openings
        SET closed_at = now(), closed_by = p_user_id
        WHERE date = p_date;

        INSERT INTO day_audit_logs (date, action, performed_by, previous_status, new_status)
        VALUES (p_date, 'CLOSED', p_user_id, v_previous_status, 'CLOSED');

        RETURN v_reconciliation_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restaura close_agent_day a su versión previa (sin auditoría) —
    // conceptualmente exacta a la de la migración anterior.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION close_agent_day(
        p_date DATE,
        p_total_cash NUMERIC,
        p_total_banks NUMERIC,
        p_total_assets NUMERIC,
        p_total_accounts_receivable NUMERIC,
        p_result NUMERIC,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_day_opening RECORD;
        v_active_banks_count INTEGER;
        v_balances_count INTEGER;
        v_reconciliation_id UUID;
      BEGIN
        SELECT * INTO v_day_opening FROM day_openings WHERE date = p_date FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'DAY_NOT_OPENED:%', p_date;
        END IF;

        IF v_day_opening.closed_at IS NOT NULL THEN
          RAISE EXCEPTION 'DAY_ALREADY_CLOSED:%', p_date;
        END IF;

        SELECT COUNT(*) INTO v_active_banks_count FROM banks WHERE is_active = true;
        SELECT COUNT(*) INTO v_balances_count FROM bank_balances WHERE operation_date = p_date;

        IF v_balances_count < v_active_banks_count THEN
          RAISE EXCEPTION 'BANK_BALANCES_NOT_REGISTERED:%', p_date;
        END IF;

        INSERT INTO agent_reconciliations
          (date, total_cash, total_banks, total_assets, total_accounts_receivable, result, created_by)
        VALUES
          (p_date, p_total_cash, p_total_banks, p_total_assets, p_total_accounts_receivable, p_result, p_user_id)
        RETURNING id INTO v_reconciliation_id;

        UPDATE day_openings
        SET closed_at = now(), closed_by = p_user_id
        WHERE date = p_date;

        RETURN v_reconciliation_id;
      END;
      $fn$;
    `);

    await queryRunner.query(
      'DROP FUNCTION IF EXISTS cancel_agent_day(DATE, UUID, TEXT)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS reopen_agent_day(DATE, UUID, TEXT)',
    );
    await queryRunner.dropTable('day_audit_logs');
    await queryRunner.query(`
      ALTER TABLE day_openings
      DROP CONSTRAINT IF EXISTS "FK_day_openings_reopened_by",
      DROP CONSTRAINT IF EXISTS "FK_day_openings_cancelled_by"
    `);
    await queryRunner.dropColumns('day_openings', [
      'reopened_at',
      'reopened_by',
      'reopen_reason',
      'is_cancelled',
      'cancelled_at',
      'cancelled_by',
      'cancel_reason',
    ]);
  }
}
