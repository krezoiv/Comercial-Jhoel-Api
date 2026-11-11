import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Bodega → "Retiro de Bodega": cash leaves Bodega and goes either
 *  - back to the caja (`DEVOLUCION_A_CAJA` in Bodega + `DEVOLUCION_BODEGA` IN in
 *    the caja Kardex: an internal transfer, total custody unchanged), or
 *  - to a registered bank account (`DEPOSITO_BANCARIO` in Bodega + the existing
 *    bank type `DEPOSITO_CAJA` / origin `CONTROL_EFECTIVO` through the single
 *    bank writer `apply_bank_account_movement`; Bodega down, bank up, so the
 *    consolidated Cuadre de Agentes does not change).
 *
 * One transaction per withdrawal (`warehouse_cash_withdrawals`, reference
 * `RET-000001`), same guarantees as the caja → Bodega delivery: open bank day,
 * Bodega balance checked under its lock (lock order bank → caja → Bodega, the
 * same order every flow already uses), people identified, optional breakdown
 * (without it only administrators) stored in `warehouse_cash_movement_details`,
 * idempotency key, audited void that reverses both sides (nothing deleted).
 *
 * Existing rules are untouched: the caja and Bodega Kardex keep their writers,
 * the bank keeps its own checks (inactive account, Guayacán excluded, limits).
 * `down` drops the new functions and restores the previous constraints and
 * `void_manual_cash_movement`; tables and rows are kept.
 */
export class WarehouseWithdrawals1760007500000 implements MigrationInterface {
  name = 'WarehouseWithdrawals1760007500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.setCashTypes(queryRunner, [...CASH_TYPES, 'DEVOLUCION_BODEGA']);
    await this.setWarehouseTypes(queryRunner, [
      ...WAREHOUSE_TYPES,
      'DEVOLUCION_A_CAJA',
      'DEPOSITO_BANCARIO',
    ]);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS warehouse_cash_movement_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        movement_id UUID NOT NULL REFERENCES warehouse_cash_movements(id) ON DELETE RESTRICT,
        denomination NUMERIC(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal NUMERIC(14,2) NOT NULL,
        CONSTRAINT "UQ_warehouse_cash_movement_details" UNIQUE (movement_id, denomination),
        CONSTRAINT "CHK_warehouse_cash_movement_details_quantity" CHECK (quantity > 0),
        CONSTRAINT "CHK_warehouse_cash_movement_details_subtotal" CHECK (subtotal = denomination * quantity)
      )
    `);
    await this.guard(queryRunner, 'warehouse_cash_movement_details', []);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS warehouse_cash_withdrawals (
        id UUID PRIMARY KEY,
        number BIGSERIAL NOT NULL,
        reference_number VARCHAR(20) NOT NULL,
        destination VARCHAR(10) NOT NULL,
        amount NUMERIC(14,2) NOT NULL,
        bank_id UUID NULL REFERENCES banks(id) ON DELETE RESTRICT,
        delivered_by VARCHAR(150) NOT NULL,
        received_by VARCHAR(150) NOT NULL,
        voucher_reference VARCHAR(100) NULL,
        observations VARCHAR(500) NULL,
        has_breakdown BOOLEAN NOT NULL,
        business_date DATE NOT NULL,
        day_opening_id UUID NOT NULL REFERENCES day_openings(id) ON DELETE RESTRICT,
        warehouse_movement_id UUID NOT NULL REFERENCES warehouse_cash_movements(id) ON DELETE RESTRICT,
        cash_movement_id UUID NULL REFERENCES cash_movements(id) ON DELETE RESTRICT,
        bank_movement_id UUID NULL REFERENCES bank_account_movements(id) ON DELETE RESTRICT,
        status VARCHAR(10) NOT NULL DEFAULT 'APLICADO',
        voided_at TIMESTAMPTZ NULL,
        voided_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        void_reason VARCHAR(255) NULL,
        idempotency_key VARCHAR(120) NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_warehouse_cash_withdrawals_number" UNIQUE (number),
        CONSTRAINT "UQ_warehouse_cash_withdrawals_reference" UNIQUE (reference_number),
        CONSTRAINT "UQ_warehouse_cash_withdrawals_idempotency" UNIQUE (idempotency_key),
        CONSTRAINT "UQ_warehouse_cash_withdrawals_warehouse" UNIQUE (warehouse_movement_id),
        CONSTRAINT "CHK_warehouse_cash_withdrawals_amount" CHECK (amount > 0),
        CONSTRAINT "CHK_warehouse_cash_withdrawals_people" CHECK (length(btrim(delivered_by)) >= 3 AND length(btrim(received_by)) >= 3),
        CONSTRAINT "CHK_warehouse_cash_withdrawals_destination" CHECK (
          (destination = 'CAJA' AND cash_movement_id IS NOT NULL AND bank_id IS NULL AND bank_movement_id IS NULL)
          OR (destination = 'BANCO' AND bank_id IS NOT NULL AND bank_movement_id IS NOT NULL AND cash_movement_id IS NULL)
        ),
        CONSTRAINT "CHK_warehouse_cash_withdrawals_status" CHECK (status IN ('APLICADO', 'ANULADO')),
        CONSTRAINT "CHK_warehouse_cash_withdrawals_void" CHECK (
          (status = 'APLICADO' AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
          OR (status = 'ANULADO' AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL)
        )
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_warehouse_cash_withdrawals_date" ON warehouse_cash_withdrawals (business_date, created_at)`,
    );
    await this.guard(queryRunner, 'warehouse_cash_withdrawals', [
      'status',
      'voided_at',
      'voided_by',
      'void_reason',
    ]);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_warehouse_withdrawal(
        p_destination VARCHAR, p_amount NUMERIC, p_details JSONB, p_bank_id UUID,
        p_delivered_by VARCHAR, p_received_by VARCHAR, p_voucher_reference VARCHAR, p_observations VARCHAR,
        p_user_id UUID, p_idempotency_key VARCHAR
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_existing UUID;
        v_id UUID := gen_random_uuid();
        v_day RECORD;
        v_bank RECORD;
        v_bank_name TEXT;
        v_row RECORD;
        v_total NUMERIC(14,2) := 0;
        v_seen NUMERIC[] := ARRAY[]::NUMERIC[];
        v_has_breakdown BOOLEAN := p_details IS NOT NULL AND jsonb_typeof(p_details) = 'array' AND jsonb_array_length(p_details) > 0;
        v_number BIGINT;
        v_label TEXT;
        v_warehouse_id UUID;
        v_cash_id UUID;
        v_bank_movement_id UUID;
        v_date DATE := (now() AT TIME ZONE 'America/Guatemala')::date;
      BEGIN
        PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.operate');
        IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 THEN
          RAISE EXCEPTION 'CASH_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('warehouse_withdrawal:' || p_idempotency_key));
        SELECT id INTO v_existing FROM warehouse_cash_withdrawals WHERE idempotency_key = p_idempotency_key;
        IF FOUND THEN
          RETURN v_existing;
        END IF;

        IF p_destination IS NULL OR p_destination NOT IN ('CAJA', 'BANCO') THEN
          RAISE EXCEPTION 'WAREHOUSE_WITHDRAWAL_INVALID_DESTINATION';
        END IF;
        IF p_amount IS NULL OR p_amount <= 0 OR p_amount <> round(p_amount, 2) THEN
          RAISE EXCEPTION 'CASH_INVALID_AMOUNT';
        END IF;
        IF p_delivered_by IS NULL OR length(btrim(p_delivered_by)) < 3
           OR p_received_by IS NULL OR length(btrim(p_received_by)) < 3 THEN
          RAISE EXCEPTION 'CASH_WAREHOUSE_PEOPLE_REQUIRED';
        END IF;
        SELECT * INTO v_day FROM cash_current_bank_day();
        IF v_day.day_opening_id IS NULL OR NOT v_day.is_open THEN
          RAISE EXCEPTION 'CASH_CUSTODY_DAY_NOT_OPEN';
        END IF;

        IF p_destination = 'BANCO' THEN
          IF p_bank_id IS NULL THEN
            RAISE EXCEPTION 'WAREHOUSE_WITHDRAWAL_BANK_REQUIRED';
          END IF;
          SELECT id, name, special_account, is_active INTO v_bank FROM banks WHERE id = p_bank_id;
          IF NOT FOUND OR NOT v_bank.is_active THEN
            RAISE EXCEPTION 'CASH_DEPOSIT_INVALID_BANK';
          END IF;
          IF v_bank.special_account = 'GUAYACAN' THEN
            RAISE EXCEPTION 'CASH_DEPOSIT_GUAYACAN_NOT_ALLOWED';
          END IF;
          v_bank_name := v_bank.name;
        ELSIF p_bank_id IS NOT NULL THEN
          RAISE EXCEPTION 'WAREHOUSE_WITHDRAWAL_INVALID_DESTINATION';
        END IF;

        IF v_has_breakdown THEN
          FOR v_row IN
            SELECT (d->>'denomination')::numeric AS denomination, (d->>'quantity')::numeric AS quantity
            FROM jsonb_array_elements(p_details) d
          LOOP
            IF v_row.denomination IS NULL OR NOT cash_valid_denomination(v_row.denomination)
               OR v_row.quantity IS NULL OR v_row.quantity <= 0 OR v_row.quantity <> trunc(v_row.quantity)
               OR v_row.denomination = ANY (v_seen) THEN
              RAISE EXCEPTION 'CASH_INVALID_DENOMINATION';
            END IF;
            v_seen := v_seen || v_row.denomination;
            v_total := v_total + v_row.denomination * v_row.quantity;
          END LOOP;
          IF v_total <> p_amount THEN
            RAISE EXCEPTION 'CASH_BREAKDOWN_MISMATCH';
          END IF;
        ELSE
          PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
        END IF;

        -- Lock order bank → caja → Bodega (same as every other flow).
        IF p_destination = 'BANCO' THEN
          PERFORM 1 FROM banks WHERE id = p_bank_id FOR UPDATE;
        ELSE
          PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('warehouse_cash_main'));
        IF warehouse_cash_balance() < p_amount THEN
          RAISE EXCEPTION 'WAREHOUSE_INSUFFICIENT_BALANCE';
        END IF;

        v_number := nextval(pg_get_serial_sequence('warehouse_cash_withdrawals', 'number'));
        v_label := 'RET-' || lpad(v_number::text, 6, '0');
        v_warehouse_id := apply_warehouse_cash_movement(
          CASE p_destination WHEN 'CAJA' THEN 'DEVOLUCION_A_CAJA' ELSE 'DEPOSITO_BANCARIO' END, 'OUT', p_amount, p_user_id,
          left('Retiro de Bodega ' || v_label || CASE p_destination WHEN 'CAJA' THEN ' hacia caja' ELSE ' depositado en ' || v_bank_name END, 255),
          'WAREHOUSE_WITHDRAWAL', v_id, btrim(p_received_by), NULL, NULL, 'WHW-WH:' || p_idempotency_key
        );
        IF v_has_breakdown THEN
          INSERT INTO warehouse_cash_movement_details (movement_id, denomination, quantity, subtotal)
          SELECT v_warehouse_id, (d->>'denomination')::numeric, (d->>'quantity')::int,
                 (d->>'denomination')::numeric * (d->>'quantity')::int
          FROM jsonb_array_elements(p_details) d;
        END IF;

        IF p_destination = 'CAJA' THEN
          v_cash_id := apply_cash_movement(
            'DEVOLUCION_BODEGA', 'IN', p_amount, p_user_id,
            left('Devolución de Bodega ' || v_label || ' (transferencia interna) — entrega ' || btrim(p_delivered_by), 255),
            'WAREHOUSE_WITHDRAWAL', v_id, NULL, NULL, NULL, 'WHW-CASH:' || p_idempotency_key
          );
        ELSE
          v_bank_movement_id := apply_bank_account_movement(
            p_bank_id, 'DEPOSITO_CAJA', 'CONTROL_EFECTIVO', p_amount, v_date, p_user_id,
            'WAREHOUSE_WITHDRAWAL', v_id, left(NULLIF(btrim(p_voucher_reference), ''), 100),
            'Depósito de efectivo desde Bodega ' || v_label, NULLIF(btrim(p_observations), ''), NULL, NULL
          );
        END IF;

        INSERT INTO warehouse_cash_withdrawals (
          id, number, reference_number, destination, amount, bank_id, delivered_by, received_by,
          voucher_reference, observations, has_breakdown, business_date, day_opening_id,
          warehouse_movement_id, cash_movement_id, bank_movement_id, idempotency_key, created_by
        ) VALUES (
          v_id, v_number, v_label, p_destination, p_amount, p_bank_id, btrim(p_delivered_by), btrim(p_received_by),
          NULLIF(btrim(p_voucher_reference), ''), NULLIF(btrim(p_observations), ''), v_has_breakdown,
          v_day.business_date, v_day.day_opening_id, v_warehouse_id, v_cash_id, v_bank_movement_id,
          p_idempotency_key, p_user_id
        );
        RETURN v_id;
      END;
      $$
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_warehouse_withdrawal(p_withdrawal_id UUID, p_user_id UUID, p_reason VARCHAR)
      RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_w warehouse_cash_withdrawals%ROWTYPE;
        v_date DATE := (now() AT TIME ZONE 'America/Guatemala')::date;
      BEGIN
        PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
        IF p_reason IS NULL OR length(trim(p_reason)) < 5 THEN
          RAISE EXCEPTION 'CASH_REASON_REQUIRED';
        END IF;
        SELECT * INTO v_w FROM warehouse_cash_withdrawals WHERE id = p_withdrawal_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'WAREHOUSE_WITHDRAWAL_NOT_FOUND';
        END IF;

        -- Lock order bank → caja → Bodega.
        IF v_w.destination = 'BANCO' THEN
          -- The bank keeps its own rules (the deposited money must still be there).
          PERFORM reverse_bank_account_movements('WAREHOUSE_WITHDRAWAL', v_w.id, v_date, p_user_id, trim(p_reason));
        ELSE
          PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
          IF cash_balance() < v_w.amount THEN
            RAISE EXCEPTION 'CASH_INSUFFICIENT_BALANCE';
          END IF;
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('warehouse_cash_main'));
        SELECT * INTO v_w FROM warehouse_cash_withdrawals WHERE id = p_withdrawal_id FOR UPDATE;
        IF v_w.status = 'ANULADO' THEN
          RAISE EXCEPTION 'WAREHOUSE_WITHDRAWAL_ALREADY_VOIDED';
        END IF;

        PERFORM apply_warehouse_cash_movement('ANULACION', 'IN', v_w.amount, p_user_id,
          left('Anulación de ' || v_w.reference_number || ' — ' || trim(p_reason), 255),
          'WAREHOUSE_WITHDRAWAL', v_w.id, NULL, trim(p_reason), v_w.warehouse_movement_id, 'REV:' || v_w.warehouse_movement_id);
        UPDATE warehouse_cash_movements
        SET status = 'ANULADO', voided_at = now(), voided_by = p_user_id, void_reason = left(trim(p_reason), 255)
        WHERE id = v_w.warehouse_movement_id;
        IF v_w.destination = 'CAJA' THEN
          PERFORM reverse_cash_movement(v_w.cash_movement_id, p_user_id, trim(p_reason));
        END IF;
        UPDATE warehouse_cash_withdrawals
        SET status = 'ANULADO', voided_at = now(), voided_by = p_user_id, void_reason = left(trim(p_reason), 255)
        WHERE id = v_w.id;
        RETURN v_w.id;
      END;
      $$
    `);

    // The caja side of a return from Bodega is voided only together with its Bodega side.
    await patchFunction(
      queryRunner,
      'void_manual_cash_movement',
      VOID_ANCHOR,
      VOID_ANCHOR + VOID_ROUTE,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await patchFunction(
      queryRunner,
      'void_manual_cash_movement',
      VOID_ANCHOR + VOID_ROUTE,
      VOID_ANCHOR,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS void_warehouse_withdrawal(UUID, UUID, VARCHAR)`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS register_warehouse_withdrawal(VARCHAR, NUMERIC, JSONB, UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, UUID, VARCHAR)`,
    );
    // The new movement types stay allowed (rows may already use them); tables and rows are kept.
  }

  private async setCashTypes(
    queryRunner: QueryRunner,
    types: string[],
  ): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE cash_movements DROP CONSTRAINT IF EXISTS "CHK_cash_movements_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE cash_movements ADD CONSTRAINT "CHK_cash_movements_type" CHECK (movement_type IN (${types.map((t) => `'${t}'`).join(', ')}))`,
    );
  }

  private async setWarehouseTypes(
    queryRunner: QueryRunner,
    types: string[],
  ): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE warehouse_cash_movements DROP CONSTRAINT IF EXISTS "CHK_warehouse_cash_movements_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE warehouse_cash_movements ADD CONSTRAINT "CHK_warehouse_cash_movements_type" CHECK (movement_type IN (${types.map((t) => `'${t}'`).join(', ')}))`,
    );
  }

  private async guard(
    queryRunner: QueryRunner,
    table: string,
    mutable: string[],
  ): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_${table}_guard ON ${table}`,
    );
    await queryRunner.query(
      `CREATE TRIGGER trg_${table}_guard BEFORE UPDATE OR DELETE ON ${table}
       FOR EACH ROW EXECUTE FUNCTION cash_custody_status_only_guard(${mutable.map((c) => `'${c}'`).join(', ')})`,
    );
  }
}

const CASH_TYPES = [
  'DEPOSITO',
  'RETIRO',
  'DESEMBOLSO_GENESIS',
  'PAGO_GENESIS',
  'REINTEGRO',
  'OTRA_TRANSACCION',
  'GASTO_POR_COBRAR',
  'ABONO_POR_COBRAR',
  'ACTIVO',
  'DEVOLUCION_ACTIVO',
  'RETIRO_BANCARIO',
  'ENTRADA_MANUAL',
  'SALIDA_MANUAL',
  'AJUSTE',
  'SALDO_INICIAL',
  'ANULACION',
  'DEPOSITO_BANCARIO',
  'ENTREGA_BODEGA',
];

const WAREHOUSE_TYPES = ['SALDO_INICIAL', 'ENTREGA_DESDE_CAJA', 'ANULACION'];

const VOID_ANCHOR = `IF v_type = 'DEPOSITO_BANCARIO' THEN
          RETURN void_cash_bank_deposit(p_movement_id, p_user_id, p_reason);
        END IF;`;

const VOID_ROUTE = `
        IF v_type = 'DEVOLUCION_BODEGA' THEN
          -- Both sides together: caja ANULACION + Bodega ANULACION.
          PERFORM void_warehouse_withdrawal(
            (SELECT reference_id FROM cash_movements WHERE id = p_movement_id), p_user_id, p_reason
          );
          RETURN (SELECT id FROM cash_movements WHERE reversal_of_id = p_movement_id);
        END IF;`;

/** Replaces one literal fragment of a live function definition (fails if the anchor is missing). */
async function patchFunction(
  queryRunner: QueryRunner,
  name: string,
  from: string,
  to: string,
): Promise<void> {
  const rows = (await queryRunner.query(
    `SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p
     WHERE p.proname = $1 AND p.pronamespace = 'public'::regnamespace`,
    [name],
  )) as Array<{ def: string }>;
  if (rows.length !== 1 || !rows[0].def.includes(from)) {
    throw new Error(`${name}: anchor not found`);
  }
  await queryRunner.query(rows[0].def.replace(from, to));
}
