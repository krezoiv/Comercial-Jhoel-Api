import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Caja Guayacán — comisiones fuera del efectivo; Depósitos/Retiros de
 * Transaccionar dentro.
 *
 * 1. Comisiones: nueva tabla `guayacan_commissions` (una por operación,
 *    `UNIQUE(operation_id)`, tarifa y cantidad históricas, VIGENTE/ANULADO).
 *    Dejan de escribirse en el ledger de efectivo. Las que ya estaban en el
 *    ledger se COPIAN a la tabla nueva y se RECLASIFICAN sin borrar nada:
 *    cada `COMISION_TRANSACCION` vigente queda ANULADO y se registra su
 *    `REVERSO_COMISION` (mecanismo existente), así el efectivo deja de
 *    incluirlas con trazabilidad completa.
 * 2. Efectivo de Transaccionar (banco agente GUAYACAN): Depósito = el
 *    cliente entrega efectivo → `TRANSACCION_DEPOSITO` (+monto aplicado);
 *    Retiro = el agente paga efectivo → `TRANSACCION_RETIRO` (−monto). Es el
 *    efecto FÍSICO en caja, independiente del signo del saldo bancario
 *    (que no se toca). Un movimiento por operación (índice único), en la
 *    misma transacción que la operación. No se bloquea por saldo de caja
 *    (anular/registrar operaciones reales no depende de la caja). Anular la
 *    operación → ANULACION inversa ligada (`reversal_of_id`).
 * 3. Arqueos: `last_movement_id` relaciona cada arqueo con el último
 *    movimiento del Kardex al momento de contar (foto histórica).
 *
 * Los tipos INGRESO/EGRESO del ledger son los ingresos/egresos MANUALES.
 * `down` restaura los triggers anteriores (comisión en el ledger); conserva
 * tablas, columnas y movimientos (no se borra información).
 */
export class GuayacanCashSeparateCommissionsAndTransactions1760006600000 implements MigrationInterface {
  name = 'GuayacanCashSeparateCommissionsAndTransactions1760006600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- 1. Tabla de comisiones ---
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS guayacan_commissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sequence BIGSERIAL NOT NULL UNIQUE,
        operation_id UUID NOT NULL REFERENCES bank_deposit_operations(id) ON DELETE RESTRICT,
        business_date DATE NOT NULL,
        transaction_count INT NOT NULL CHECK (transaction_count > 0),
        commission_rate NUMERIC(10,2) NOT NULL CHECK (commission_rate > 0),
        amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
        status VARCHAR(15) NOT NULL DEFAULT 'VIGENTE',
        voided_at TIMESTAMPTZ NULL,
        voided_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        void_reason VARCHAR(255) NULL,
        legacy_movement_id UUID NULL REFERENCES guayacan_cash_movements(id) ON DELETE RESTRICT,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_guayacan_commissions_operation" UNIQUE (operation_id),
        CONSTRAINT "CHK_guayacan_commissions_amount" CHECK (amount = transaction_count * commission_rate),
        CONSTRAINT "CHK_guayacan_commissions_status" CHECK (status IN ('VIGENTE', 'ANULADO')),
        CONSTRAINT "CHK_guayacan_commissions_void" CHECK (
          (status = 'VIGENTE' AND voided_at IS NULL AND voided_by IS NULL)
          OR (status = 'ANULADO' AND voided_at IS NOT NULL AND voided_by IS NOT NULL)
        )
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_guayacan_commissions_business_date"
        ON guayacan_commissions (business_date)
    `);

    // Copia de las comisiones históricas (incluidas las ya anuladas).
    await queryRunner.query(`
      INSERT INTO guayacan_commissions (
        operation_id, business_date, transaction_count, commission_rate, amount,
        status, voided_at, voided_by, void_reason, legacy_movement_id, created_by, created_at
      )
      SELECT m.reference_id, m.business_date, m.transaction_count, m.commission_rate, m.amount,
             CASE WHEN o.is_voided THEN 'ANULADO' ELSE 'VIGENTE' END,
             CASE WHEN o.is_voided THEN COALESCE(o.voided_at, m.voided_at, now()) END,
             CASE WHEN o.is_voided THEN COALESCE(o.voided_by, m.voided_by, m.created_by) END,
             CASE WHEN o.is_voided THEN COALESCE(o.void_reason, m.void_reason) END,
             m.id, m.created_by, m.created_at
      FROM guayacan_cash_movements m
      JOIN bank_deposit_operations o ON o.id = m.reference_id
      WHERE m.movement_type = 'COMISION_TRANSACCION' AND m.reference_type = 'BANK_DEPOSIT'
      ON CONFLICT (operation_id) DO NOTHING
    `);

    // --- 2. Ledger: tipos de Transaccionar ---
    await queryRunner.query(`
      ALTER TABLE guayacan_cash_movements
        DROP CONSTRAINT IF EXISTS "CHK_guayacan_cash_movements_type",
        DROP CONSTRAINT IF EXISTS "CHK_guayacan_cash_movements_sign",
        ADD CONSTRAINT "CHK_guayacan_cash_movements_type" CHECK (movement_type IN (
          'INGRESO', 'EGRESO', 'AJUSTE', 'TRANSACCION_DEPOSITO', 'TRANSACCION_RETIRO',
          'ANULACION', 'COMISION_TRANSACCION', 'REVERSO_COMISION'
        )),
        ADD CONSTRAINT "CHK_guayacan_cash_movements_sign" CHECK (
          (movement_type IN ('INGRESO', 'COMISION_TRANSACCION', 'TRANSACCION_DEPOSITO') AND amount > 0)
          OR (movement_type IN ('EGRESO', 'REVERSO_COMISION', 'TRANSACCION_RETIRO') AND amount < 0)
          OR movement_type IN ('AJUSTE', 'ANULACION')
        )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_guayacan_cash_movements_transaction"
        ON guayacan_cash_movements (reference_type, reference_id)
        WHERE movement_type IN ('TRANSACCION_DEPOSITO', 'TRANSACCION_RETIRO')
    `);

    // --- 3. Arqueo ↔ Kardex ---
    await queryRunner.query(`
      ALTER TABLE guayacan_cash_counts
        ADD COLUMN IF NOT EXISTS last_movement_id UUID NULL
          REFERENCES guayacan_cash_movements(id) ON DELETE RESTRICT
    `);

    // --- 4. Triggers nuevos ---
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION guayacan_commission_on_operation_insert()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_agent RECORD;
        v_effect VARCHAR;
      BEGIN
        IF NEW.transaction_bank_id IS NULL OR NEW.is_voided THEN
          RETURN NEW;
        END IF;

        SELECT cash_box_code, commission_per_transaction INTO v_agent
        FROM transaction_banks WHERE id = NEW.transaction_bank_id;

        IF v_agent.cash_box_code IS DISTINCT FROM 'GUAYACAN' THEN
          RETURN NEW;
        END IF;

        -- Comisión: concepto propio, nunca efectivo de caja.
        IF COALESCE(v_agent.commission_per_transaction, 0) > 0 THEN
          INSERT INTO guayacan_commissions (
            operation_id, business_date, transaction_count, commission_rate, amount, created_by
          ) VALUES (
            NEW.id, NEW.operation_date, NEW.transaction_count, v_agent.commission_per_transaction,
            NEW.transaction_count * v_agent.commission_per_transaction, NEW.user_id
          )
          ON CONFLICT (operation_id) DO NOTHING;
        END IF;

        -- Efectivo físico: Depósito entra, Retiro sale (monto aplicado, sin vuelto).
        SELECT balance_effect INTO v_effect FROM transaction_types WHERE id = NEW.transaction_type_id;
        IF v_effect = 'DEPOSITO' THEN
          PERFORM apply_guayacan_cash_movement(
            'TRANSACCION_DEPOSITO', NEW.total_amount, NEW.operation_date, NEW.user_id,
            'Depósito Transaccionar — ' || NEW.transaction_count || ' trans.',
            NULL, NULLIF(TRIM(NEW.client_name), ''), 'BANK_DEPOSIT', NEW.id, NEW.transaction_count,
            NULL, NULL, NULL, NULL, true
          );
        ELSIF v_effect = 'RETIRO' THEN
          PERFORM apply_guayacan_cash_movement(
            'TRANSACCION_RETIRO', -NEW.total_amount, NEW.operation_date, NEW.user_id,
            'Retiro Transaccionar — ' || NEW.transaction_count || ' trans.',
            NULL, NULLIF(TRIM(NEW.client_name), ''), 'BANK_DEPOSIT', NEW.id, NEW.transaction_count,
            NULL, NULL, NULL, NULL, true
          );
        END IF;

        RETURN NEW;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION guayacan_commission_on_operation_void()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_movement RECORD;
        v_business_date DATE := (COALESCE(NEW.voided_at, now()) AT TIME ZONE 'America/Guatemala')::date;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('guayacan_cash_box'));

        UPDATE guayacan_commissions
        SET status = 'ANULADO', voided_at = COALESCE(NEW.voided_at, now()), voided_by = NEW.voided_by,
            void_reason = left(COALESCE(NEW.void_reason, 'Operación anulada'), 255)
        WHERE operation_id = NEW.id AND status = 'VIGENTE';

        SELECT id, amount, concept INTO v_movement
        FROM guayacan_cash_movements
        WHERE movement_type IN ('TRANSACCION_DEPOSITO', 'TRANSACCION_RETIRO')
          AND reference_type = 'BANK_DEPOSIT' AND reference_id = NEW.id AND status = 'VIGENTE'
        FOR UPDATE;

        IF FOUND THEN
          UPDATE guayacan_cash_movements
          SET status = 'ANULADO', voided_at = now(), voided_by = NEW.voided_by,
              void_reason = left(COALESCE(NEW.void_reason, 'Operación anulada'), 255)
          WHERE id = v_movement.id;

          PERFORM apply_guayacan_cash_movement(
            'ANULACION', -v_movement.amount, v_business_date, NEW.voided_by,
            left('Anulación — ' || v_movement.concept, 150), NEW.void_reason, NULL,
            'BANK_DEPOSIT', NEW.id, NULL, NULL, v_movement.id, NULL, NULL, true
          );
        END IF;

        RETURN NEW;
      END;
      $fn$;
    `);

    // --- 5. Reclasificar comisiones que estaban sumadas al efectivo ---
    await queryRunner.query(`
      DO $$
      DECLARE
        v_movement RECORD;
        v_today DATE := (now() AT TIME ZONE 'America/Guatemala')::date;
      BEGIN
        FOR v_movement IN
          SELECT id, amount, transaction_count, commission_rate, reference_id, created_by
          FROM guayacan_cash_movements
          WHERE movement_type = 'COMISION_TRANSACCION' AND status = 'VIGENTE'
          ORDER BY sequence
        LOOP
          UPDATE guayacan_cash_movements
          SET status = 'ANULADO', voided_at = now(), voided_by = v_movement.created_by,
              void_reason = 'Reclasificada: las comisiones no son efectivo de caja'
          WHERE id = v_movement.id;

          PERFORM apply_guayacan_cash_movement(
            'REVERSO_COMISION', -v_movement.amount, v_today, v_movement.created_by,
            'Reclasificación — comisión fuera del efectivo de caja',
            'Las comisiones se registran aparte (no son efectivo de caja)', NULL,
            'BANK_DEPOSIT', v_movement.reference_id, v_movement.transaction_count,
            v_movement.commission_rate, v_movement.id, NULL, NULL, true
          );
        END LOOP;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Vuelve a los triggers de `CreateGuayacanCashBox` (comisión en el ledger).
    // Tablas, columnas y movimientos se conservan.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION guayacan_commission_on_operation_insert()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_agent RECORD;
      BEGIN
        IF NEW.transaction_bank_id IS NULL OR NEW.is_voided THEN
          RETURN NEW;
        END IF;
        SELECT cash_box_code, commission_per_transaction INTO v_agent
        FROM transaction_banks WHERE id = NEW.transaction_bank_id;
        IF v_agent.cash_box_code = 'GUAYACAN' AND COALESCE(v_agent.commission_per_transaction, 0) > 0 THEN
          PERFORM apply_guayacan_cash_movement(
            'COMISION_TRANSACCION',
            NEW.transaction_count * v_agent.commission_per_transaction,
            NEW.operation_date, NEW.user_id,
            'Comisión Transaccionar — ' || NEW.transaction_count || ' × Q' || to_char(v_agent.commission_per_transaction, 'FM999990.00'),
            NULL, NULL, 'BANK_DEPOSIT', NEW.id, NEW.transaction_count,
            v_agent.commission_per_transaction, NULL, NULL, NULL, true
          );
        END IF;
        RETURN NEW;
      END;
      $fn$;
    `);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION guayacan_commission_on_operation_void()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_commission RECORD;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('guayacan_cash_box'));
        SELECT id, amount, transaction_count, commission_rate INTO v_commission
        FROM guayacan_cash_movements
        WHERE movement_type = 'COMISION_TRANSACCION'
          AND reference_type = 'BANK_DEPOSIT' AND reference_id = NEW.id AND status = 'VIGENTE'
        FOR UPDATE;
        IF NOT FOUND THEN
          RETURN NEW;
        END IF;
        UPDATE guayacan_cash_movements
        SET status = 'ANULADO', voided_at = now(), voided_by = NEW.voided_by,
            void_reason = left(COALESCE(NEW.void_reason, 'Operación anulada'), 255)
        WHERE id = v_commission.id;
        PERFORM apply_guayacan_cash_movement(
          'REVERSO_COMISION', -v_commission.amount,
          (COALESCE(NEW.voided_at, now()) AT TIME ZONE 'America/Guatemala')::date,
          NEW.voided_by, 'Reverso de comisión — operación anulada',
          NEW.void_reason, NULL, 'BANK_DEPOSIT', NEW.id, v_commission.transaction_count,
          v_commission.commission_rate, v_commission.id, NULL, NULL, true
        );
        RETURN NEW;
      END;
      $fn$;
    `);
  }
}
