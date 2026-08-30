import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * "Cierre del Día" — Agentes Bancarios > Cuadre Agentes. Antes de esta
 * migración `day_openings` solo sabía representar "aperturado" (una fila
 * existe) o "no aperturado" (no existe); no había forma de distinguir un
 * día aperturado-y-en-curso de uno ya cerrado. `closed_at`/`closed_by`
 * son NULLABLE y puramente aditivos — cada fila existente (todos los días
 * ya aperturados hasta hoy, incluido el real 2026-08-30) queda con
 * `closed_at = NULL`, es decir "aperturado pero no cerrado", que es
 * exactamente su estado real actual. Ningún dato existente se modifica.
 *
 * `close_agent_day(...)` es la operación atómica "Guardar Cuadre +
 * Cerrar Día" — mismo patrón ya establecido en esta base de código que
 * `register_recharge_sales_closure`/`save_bank_balance`: una única función
 * PL/pgSQL (no un PROCEDURE con BEGIN/COMMIT explícito) para que un
 * `RAISE EXCEPTION` en cualquier punto revierta *todo* lo que la función
 * ya intentó escribir — nunca puede quedar un cuadre guardado sin cerrar
 * el día, ni un día cerrado sin el cuadre guardado, porque ambas
 * escrituras (el `INSERT` en `agent_reconciliations` y el `UPDATE` sobre
 * `day_openings`) viven en la misma transacción implícita de la función.
 *
 * Vuelve a validar "el día está aperturado", "el día no está ya cerrado"
 * y "los saldos bancarios de todos los bancos activos están guardados"
 * dentro de la propia función (bajo el lock `FOR UPDATE` de la fila de
 * `day_openings`) — defensa en profundidad: la capa de aplicación
 * (`CloseAgentDayUseCase`) ya revalida las mismas tres condiciones antes
 * de llamar aquí, pero la garantía real, ante una carrera entre dos
 * pestañas del mismo usuario, es esta.
 */
export class AddDayClosingToDayOpenings1758700000000 implements MigrationInterface {
  name = 'AddDayClosingToDayOpenings1758700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('day_openings', [
      new TableColumn({
        name: 'closed_at',
        type: 'timestamptz',
        isNullable: true,
      }),
      new TableColumn({
        name: 'closed_by',
        type: 'uuid',
        isNullable: true,
      }),
    ]);

    await queryRunner.query(`
      ALTER TABLE day_openings
      ADD CONSTRAINT FK_day_openings_closed_by
      FOREIGN KEY (closed_by) REFERENCES users(id) ON DELETE RESTRICT
    `);

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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP FUNCTION IF EXISTS close_agent_day(DATE, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, UUID)');
    await queryRunner.query('ALTER TABLE day_openings DROP CONSTRAINT IF EXISTS FK_day_openings_closed_by');
    await queryRunner.dropColumn('day_openings', 'closed_by');
    await queryRunner.dropColumn('day_openings', 'closed_at');
  }
}
