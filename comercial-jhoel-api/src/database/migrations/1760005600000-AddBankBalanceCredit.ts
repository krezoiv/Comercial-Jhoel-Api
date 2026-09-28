import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Finanzas → Transferencias Bancarias → "Acreditar saldo": suma un monto
 * directamente al saldo de UNA cuenta, sin contrapartida (no toca otra
 * cuenta, caja ni efectivo). Distinta del Depósito de Transaccionar y de
 * una transferencia — por eso tiene su propio tipo de movimiento.
 *
 * Estrictamente incremental — ninguna tabla nueva, ningún dato cambia:
 *
 * - `bank_account_movements`: los CHECK de `movement_type` y `origin`
 *   aceptan además `ACREDITACION_SALDO` (todos los valores existentes
 *   siguen siendo válidos).
 * - `register_bank_balance_credit`: valida el monto (> 0, máx. 2
 *   decimales) y delega en `apply_bank_account_movement` — el ÚNICO punto
 *   que modifica `banks.final_balance` (lock `FOR UPDATE`, ledger con saldo
 *   anterior/posterior, límite `max_balance`). Cada acreditación recibe un
 *   id de operación propio como referencia (`reference_type =
 *   'ACREDITACION_SALDO'`), lo que permite anularla con el mecanismo
 *   existente.
 * - `void_bank_balance_credit`: anula (nunca borra) vía
 *   `reverse_bank_account_movements` — movimiento inverso ANULACION y el
 *   original queda ANULADO, ambos en el historial.
 */
export class AddBankBalanceCredit1760005600000 implements MigrationInterface {
  name = 'AddBankBalanceCredit1760005600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE bank_account_movements
        DROP CONSTRAINT "CHK_bank_account_movements_type",
        ADD CONSTRAINT "CHK_bank_account_movements_type" CHECK (movement_type IN (
          'DEPOSITO', 'RETIRO', 'DESEMBOLSO_GENESIS', 'PAGO_GENESIS', 'REINTEGRO',
          'TRANSFERENCIA_SALIDA', 'TRANSFERENCIA_ENTRADA', 'RETIRO_EFECTIVO',
          'AJUSTE_MANUAL', 'SALDO_INICIAL', 'ANULACION', 'ACREDITACION_SALDO'
        )),
        DROP CONSTRAINT "CHK_bank_account_movements_origin",
        ADD CONSTRAINT "CHK_bank_account_movements_origin" CHECK (origin IN (
          'TRANSACCIONAR', 'TRANSFERENCIA', 'AJUSTE_MANUAL', 'SALDO_INICIAL', 'ANULACION',
          'ACREDITACION_SALDO'
        ))
    `);

    // Nombres de salida con prefijo `out_`: en PL/pgSQL, columnas de
    // RETURNS TABLE con el mismo nombre que las del ledger serían ambiguas.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_bank_balance_credit(
        p_bank_id UUID,
        p_amount NUMERIC,
        p_business_date DATE,
        p_user_id UUID,
        p_reference_text VARCHAR DEFAULT NULL,
        p_observation TEXT DEFAULT NULL
      )
      RETURNS TABLE (
        out_operation_id UUID,
        out_movement_id UUID,
        out_balance_before NUMERIC,
        out_amount NUMERIC,
        out_balance_after NUMERIC
      )
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_operation_id UUID := gen_random_uuid();
        v_movement_id UUID;
      BEGIN
        IF p_amount IS NULL OR p_amount <= 0 OR p_amount <> round(p_amount, 2) THEN
          RAISE EXCEPTION 'INVALID_MOVEMENT_AMOUNT:%', p_bank_id;
        END IF;

        -- Lock de la fila, validación de cuenta activa/límite, ledger y
        -- actualización del saldo: todo dentro de apply_bank_account_movement.
        v_movement_id := apply_bank_account_movement(
          p_bank_id, 'ACREDITACION_SALDO', 'ACREDITACION_SALDO', p_amount,
          p_business_date, p_user_id, 'ACREDITACION_SALDO', v_operation_id,
          p_reference_text, 'Acreditación de saldo', p_observation
        );

        RETURN QUERY
          SELECT v_operation_id, m.id, m.balance_before, m.amount, m.balance_after
          FROM bank_account_movements m
          WHERE m.id = v_movement_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_bank_balance_credit(
        p_operation_id UUID,
        p_business_date DATE,
        p_user_id UUID,
        p_reason TEXT
      )
      RETURNS INTEGER
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_count INTEGER;
      BEGIN
        IF p_reason IS NULL OR btrim(p_reason) = '' THEN
          RAISE EXCEPTION 'REASON_REQUIRED:%', p_operation_id;
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM bank_account_movements
          WHERE reference_type = 'ACREDITACION_SALDO'
            AND reference_id = p_operation_id
            AND movement_type = 'ACREDITACION_SALDO'
        ) THEN
          RAISE EXCEPTION 'BALANCE_CREDIT_NOT_FOUND:%', p_operation_id;
        END IF;

        -- Bloquea el movimiento original (FOR UPDATE dentro de la función):
        -- dos anulaciones simultáneas nunca revierten dos veces.
        v_count := reverse_bank_account_movements(
          'ACREDITACION_SALDO', p_operation_id, p_business_date, p_user_id, btrim(p_reason)
        );
        IF v_count = 0 THEN
          RAISE EXCEPTION 'BALANCE_CREDIT_ALREADY_VOIDED:%', p_operation_id;
        END IF;
        RETURN v_count;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Sin downgrade destructivo: una vez que existan movimientos
    // ACREDITACION_SALDO reales, restringir de nuevo los CHECK fallaría
    // (y borrarlos alteraría saldos históricos). Solo se retiran las
    // funciones nuevas si no se usan.
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS void_bank_balance_credit(UUID, DATE, UUID, TEXT)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_bank_balance_credit(UUID, NUMERIC, DATE, UUID, VARCHAR, TEXT)',
    );
  }
}
