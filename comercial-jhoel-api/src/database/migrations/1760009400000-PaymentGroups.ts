import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Pagos grupales (owner request, 2026-11-26): register a group of payments of
 * one Transaccionar operation type, reserve the money of the group, confirm
 * each payment on its own (complete, partial, no payment), document
 * differences and close the group releasing what was not used.
 *
 * Owner decisions (AskUserQuestion 2026-11-26):
 * - Which types allow a group: `transaction_types.allows_group_payment`
 *   (checkbox in Sistema → Tipos de transacción; no name guessing).
 * - The type's cash effect decides the money flow, snapshot in
 *   `payment_groups.cash_direction`: OUT (Pago Varios) RESERVES the authorized
 *   amount and each delivery takes cash out; IN (Préstamos Génesis = cobrar
 *   cuotas) reserves nothing and each collection brings cash in.
 * - Reserved money cannot leave Caja through any other outflow
 *   (`apply_cash_movement` rejects it with `CASH_RESERVED_FUNDS`); corrections
 *   (ANULACION, AJUSTE) are never blocked. Without open reservations nothing
 *   changes.
 * - Create / deliver / document: anyone who uses Transaccionar; release, void
 *   and close: admins (`cash_custody.authorize`).
 *
 * Money model — one source of truth, no second Kardex:
 * - Creating a group writes NO cash movement. Reservation of an open OUT group
 *   = authorized − delivered − released, derived from the rows
 *   (`payment_group_balances`); `cash_reserved_total()` sums them and
 *   `cash_available()` = `cash_balance()` − reservations.
 * - Each delivery / collection IS a real Transaccionar operation
 *   (`register_bank_deposit_operation`, one transaction of the paid amount),
 *   linked to the item: Caja, Kardex, Estado de Cuenta, bank or Génesis line,
 *   cuadre and audit move exactly as an individual operation. The reservation
 *   shrinks by the same amount (no double discount).
 * - Item status is derived (`payment_group_item_balances`): PENDIENTE, PAGADO,
 *   PARCIAL, SIN_PAGO, ANULADO; the group display status too
 *   (PENDIENTE / EN_PROCESO / PARCIAL / COMPLETADO / ANULADO).
 * - History (`payment_group_events`) and deliveries are append-only; groups and
 *   items change only through these functions (`app.payment_group_write`).
 * - A group operation is voided only from the group (money returned), never
 *   from Transaccionar directly (`trg_payment_group_operation_guard`).
 */
export class PaymentGroups1760009400000 implements MigrationInterface {
  name = 'PaymentGroups1760009400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE transaction_types ADD COLUMN allows_group_payment BOOLEAN NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN transaction_types.allows_group_payment IS 'Shows "Pago grupal" for this type in Transaccionar (Sistema → Tipos de transacción).'`,
    );

    await queryRunner.query(`CREATE SEQUENCE payment_group_number_seq`);
    await queryRunner.query(`
      CREATE TABLE payment_groups (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        number BIGINT NOT NULL UNIQUE DEFAULT nextval('payment_group_number_seq'),
        code VARCHAR(20) GENERATED ALWAYS AS ('PG-' || lpad(number::text, 6, '0')) STORED,
        transaction_type_id UUID NOT NULL REFERENCES transaction_types(id) ON DELETE RESTRICT,
        -- Cash effect of the type when the group was created (OUT reserves money).
        cash_direction VARCHAR(4) NOT NULL,
        description VARCHAR(200) NOT NULL,
        operation_date DATE NOT NULL,
        transaction_bank_id UUID REFERENCES transaction_banks(id) ON DELETE RESTRICT,
        bank_account_id UUID REFERENCES banks(id) ON DELETE RESTRICT,
        authorized_amount NUMERIC(14,2) NOT NULL,
        observations VARCHAR(500),
        status VARCHAR(10) NOT NULL DEFAULT 'ABIERTO',
        closed_at TIMESTAMPTZ,
        closed_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        close_note VARCHAR(500),
        -- Conciliation photographed at close / void.
        closing_paid NUMERIC(14,2),
        closing_released NUMERIC(14,2),
        closing_summary JSONB,
        voided_at TIMESTAMPTZ,
        voided_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        void_reason VARCHAR(255),
        idempotency_key VARCHAR(150) NOT NULL UNIQUE,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_payment_groups_direction" CHECK (cash_direction IN ('IN', 'OUT', 'NONE')),
        CONSTRAINT "CHK_payment_groups_status" CHECK (status IN ('ABIERTO', 'CERRADO', 'ANULADO')),
        CONSTRAINT "CHK_payment_groups_authorized" CHECK (authorized_amount > 0),
        CONSTRAINT "CHK_payment_groups_description" CHECK (length(btrim(description)) >= 3),
        CONSTRAINT "CHK_payment_groups_closed" CHECK ((status = 'CERRADO') = (closed_at IS NOT NULL)),
        CONSTRAINT "CHK_payment_groups_voided" CHECK ((status = 'ANULADO') = (voided_at IS NOT NULL))
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_payment_groups_date" ON payment_groups (operation_date DESC, number DESC)`,
    );
    await queryRunner.query(`
      CREATE TABLE payment_group_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_id UUID NOT NULL REFERENCES payment_groups(id) ON DELETE RESTRICT,
        item_number INT NOT NULL,
        expected_amount NUMERIC(14,2) NOT NULL,
        reference VARCHAR(150),
        no_payment_at TIMESTAMPTZ,
        no_payment_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        resolution VARCHAR(255),
        resolved_at TIMESTAMPTZ,
        resolved_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        -- Part of the expected amount given back to the available cash (resolution or void).
        released_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
        voided_at TIMESTAMPTZ,
        voided_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        void_reason VARCHAR(255),
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_payment_group_items_number" UNIQUE (group_id, item_number),
        CONSTRAINT "CHK_payment_group_items_number" CHECK (item_number > 0),
        CONSTRAINT "CHK_payment_group_items_expected" CHECK (expected_amount > 0),
        CONSTRAINT "CHK_payment_group_items_released" CHECK (released_amount >= 0 AND released_amount <= expected_amount)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE payment_group_deliveries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_id UUID NOT NULL REFERENCES payment_groups(id) ON DELETE RESTRICT,
        item_id UUID NOT NULL REFERENCES payment_group_items(id) ON DELETE RESTRICT,
        amount NUMERIC(14,2) NOT NULL,
        -- The real Transaccionar operation that moved the money (voided = no longer counts).
        operation_id UUID NOT NULL UNIQUE REFERENCES bank_deposit_operations(id) ON DELETE RESTRICT,
        idempotency_key VARCHAR(150) NOT NULL UNIQUE,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_payment_group_deliveries_amount" CHECK (amount > 0)
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_payment_group_deliveries_item" ON payment_group_deliveries (item_id)`,
    );
    await queryRunner.query(`
      CREATE TABLE payment_group_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_id UUID NOT NULL REFERENCES payment_groups(id) ON DELETE RESTRICT,
        item_id UUID REFERENCES payment_group_items(id) ON DELETE RESTRICT,
        event_type VARCHAR(20) NOT NULL,
        -- Status of the item (or of the group) right after the event.
        item_status VARCHAR(10),
        group_status VARCHAR(12),
        amount NUMERIC(14,2),
        note VARCHAR(500),
        operation_id UUID REFERENCES bank_deposit_operations(id) ON DELETE RESTRICT,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_payment_group_events_type" CHECK (event_type IN (
          'CREADO', 'ENTREGA', 'SIN_PAGO', 'OBSERVACION', 'MONTO_CAMBIADO', 'RESOLUCION',
          'ANULACION', 'CIERRE', 'ANULACION_GRUPO'))
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_payment_group_events_group" ON payment_group_events (group_id, created_at)`,
    );

    // Append-only history and deliveries; groups and items only through the functions below.
    await queryRunner.query(`
      CREATE FUNCTION payment_group_append_only() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN
        RAISE EXCEPTION 'PAYMENT_GROUP_HISTORY_IMMUTABLE';
      END;
      $$
    `);
    await queryRunner.query(`
      CREATE FUNCTION payment_group_write_guard() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN
        IF TG_OP = 'DELETE' OR COALESCE(current_setting('app.payment_group_write', true), '') <> 'on' THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_DIRECT_WRITE';
        END IF;
        RETURN NEW;
      END;
      $$
    `);
    for (const table of ['payment_group_events', 'payment_group_deliveries']) {
      await queryRunner.query(`
        CREATE TRIGGER trg_${table}_append_only BEFORE UPDATE OR DELETE ON ${table}
        FOR EACH ROW EXECUTE FUNCTION payment_group_append_only()
      `);
    }
    for (const table of ['payment_groups', 'payment_group_items']) {
      await queryRunner.query(`
        CREATE TRIGGER trg_${table}_write_guard BEFORE UPDATE OR DELETE ON ${table}
        FOR EACH ROW EXECUTE FUNCTION payment_group_write_guard()
      `);
    }

    // Derived state — the only place amounts and statuses are computed.
    await queryRunner.query(`
      CREATE VIEW payment_group_item_balances AS
      SELECT i.id, i.group_id, i.item_number, i.expected_amount, i.reference, i.no_payment_at, i.no_payment_by,
             i.resolution, i.resolved_at, i.resolved_by, i.released_amount, i.voided_at, i.voided_by, i.void_reason,
             i.created_by, i.created_at,
             COALESCE(d.paid, 0)::NUMERIC(14,2) AS paid_amount,
             COALESCE(d.deliveries, 0)::INT AS delivery_count,
             d.last_paid_at,
             CASE WHEN i.voided_at IS NOT NULL THEN 'ANULADO'
                  WHEN COALESCE(d.paid, 0) >= i.expected_amount THEN 'PAGADO'
                  WHEN COALESCE(d.paid, 0) > 0 THEN 'PARCIAL'
                  WHEN i.no_payment_at IS NOT NULL THEN 'SIN_PAGO'
                  ELSE 'PENDIENTE' END AS status,
             -- Still to execute: not delivered and not released.
             GREATEST(i.expected_amount - COALESCE(d.paid, 0) - i.released_amount, 0)::NUMERIC(14,2) AS outstanding_amount
      FROM payment_group_items i
      LEFT JOIN LATERAL (
        SELECT SUM(dl.amount) AS paid, count(*) AS deliveries, max(dl.created_at) AS last_paid_at
        FROM payment_group_deliveries dl
        JOIN bank_deposit_operations o ON o.id = dl.operation_id AND NOT o.is_voided
        WHERE dl.item_id = i.id
      ) d ON TRUE
    `);
    await queryRunner.query(`
      CREATE VIEW payment_group_balances AS
      SELECT g.id, g.number, g.code, g.transaction_type_id, g.cash_direction, g.description, g.operation_date,
             g.transaction_bank_id, g.bank_account_id, g.authorized_amount, g.observations, g.status,
             g.closed_at, g.closed_by, g.close_note, g.closing_paid, g.closing_released, g.closing_summary,
             g.voided_at, g.voided_by, g.void_reason, g.created_by, g.created_at,
             count(b.id)::INT AS item_count,
             (count(b.id) FILTER (WHERE b.status = 'PAGADO'))::INT AS paid_count,
             (count(b.id) FILTER (WHERE b.status = 'PARCIAL'))::INT AS partial_count,
             (count(b.id) FILTER (WHERE b.status = 'SIN_PAGO'))::INT AS no_payment_count,
             (count(b.id) FILTER (WHERE b.status = 'PENDIENTE'))::INT AS pending_count,
             (count(b.id) FILTER (WHERE b.status = 'ANULADO'))::INT AS voided_count,
             (count(b.id) FILTER (WHERE b.status IN ('PARCIAL', 'SIN_PAGO') AND b.resolved_at IS NULL))::INT AS unresolved_count,
             COALESCE(SUM(b.expected_amount) FILTER (WHERE b.status <> 'ANULADO'), 0)::NUMERIC(14,2) AS assigned_amount,
             COALESCE(SUM(b.paid_amount), 0)::NUMERIC(14,2) AS paid_amount,
             -- A closed or voided group has nothing left to execute (what was not paid was released).
             CASE WHEN g.status = 'ABIERTO' THEN COALESCE(SUM(b.outstanding_amount), 0) ELSE 0 END::NUMERIC(14,2) AS outstanding_amount,
             (COALESCE(SUM(b.released_amount), 0) + COALESCE(g.closing_released, 0))::NUMERIC(14,2) AS released_amount,
             CASE WHEN g.status = 'ABIERTO'
                  THEN GREATEST(g.authorized_amount - COALESCE(SUM(b.paid_amount), 0) - COALESCE(SUM(b.released_amount), 0), 0)
                  ELSE 0 END::NUMERIC(14,2) AS remaining_amount,
             CASE WHEN g.status = 'ANULADO' THEN 'ANULADO'
                  WHEN g.status = 'CERRADO' THEN 'COMPLETADO'
                  WHEN count(b.id) FILTER (WHERE b.status <> 'PENDIENTE') = 0 THEN 'PENDIENTE'
                  WHEN count(b.id) FILTER (WHERE b.status IN ('PARCIAL', 'SIN_PAGO') AND b.resolved_at IS NULL) > 0 THEN 'PARCIAL'
                  ELSE 'EN_PROCESO' END AS display_status
      FROM payment_groups g
      LEFT JOIN payment_group_item_balances b ON b.group_id = g.id
      GROUP BY g.id
    `);
    await queryRunner.query(`
      CREATE FUNCTION cash_reserved_total() RETURNS NUMERIC LANGUAGE sql STABLE AS $$
        SELECT COALESCE(SUM(remaining_amount), 0)::NUMERIC(14,2)
        FROM payment_group_balances WHERE status = 'ABIERTO' AND cash_direction = 'OUT'
      $$
    `);
    await queryRunner.query(`
      CREATE FUNCTION cash_available() RETURNS NUMERIC LANGUAGE sql STABLE AS $$
        SELECT (cash_balance() - cash_reserved_total())::NUMERIC(14,2)
      $$
    `);

    // The single Kardex writer gains the reservation check (nothing else changes).
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.apply_cash_movement(p_movement_type character varying, p_direction character varying, p_amount numeric, p_user_id uuid, p_description character varying, p_reference_type character varying, p_reference_id uuid, p_bank_name character varying, p_reason character varying, p_reversal_of_id uuid, p_idempotency_key character varying)
       RETURNS uuid
       LANGUAGE plpgsql
      AS $function$
            DECLARE
              v_existing UUID;
              v_previous NUMERIC(14,2);
              v_new NUMERIC(14,2);
              v_date DATE := (now() AT TIME ZONE 'America/Guatemala')::date;
              v_day_id UUID;
              v_period_id UUID;
              v_period_day_id UUID;
              v_id UUID;
              v_reserved NUMERIC(14,2);
            BEGIN
              PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));

              IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 THEN
                RAISE EXCEPTION 'CASH_IDEMPOTENCY_KEY_REQUIRED';
              END IF;
              SELECT id INTO v_existing FROM cash_movements WHERE idempotency_key = p_idempotency_key;
              IF FOUND THEN
                RETURN v_existing;
              END IF;

              IF p_amount IS NULL OR p_amount <= 0 THEN
                RAISE EXCEPTION 'CASH_INVALID_AMOUNT';
              END IF;
              IF p_direction NOT IN ('IN', 'OUT', 'NONE') THEN
                RAISE EXCEPTION 'CASH_INVALID_DIRECTION';
              END IF;

              v_previous := cash_balance();
              v_new := v_previous + CASE p_direction WHEN 'IN' THEN p_amount WHEN 'OUT' THEN -p_amount ELSE 0 END;
              -- Pagos grupales (1760009400000): money reserved for an open group cannot leave Caja through any
              -- other outflow. Corrections (ANULACION, AJUSTE) reflect what really happened and are never blocked;
              -- a group delivery consumes its own reservation (app.cash_reservation_consumer).
              IF p_direction = 'OUT' AND p_movement_type NOT IN ('ANULACION', 'AJUSTE')
                 AND COALESCE(current_setting('app.cash_reservation_consumer', true), '') <> 'on' THEN
                v_reserved := cash_reserved_total();
                IF v_reserved > 0 AND v_new < v_reserved THEN
                  RAISE EXCEPTION 'CASH_RESERVED_FUNDS:%', GREATEST(v_previous - v_reserved, 0);
                END IF;
              END IF;

              SELECT id INTO v_day_id FROM cash_operational_days WHERE operational_date = v_date;
              -- Cut attribution: the open cut, else the next pending cut of today.
              SELECT id, operational_day_id INTO v_period_id, v_period_day_id
              FROM cash_cut_periods WHERE status = 'ABIERTO' LIMIT 1;
              IF v_period_id IS NULL AND v_day_id IS NOT NULL THEN
                SELECT id, operational_day_id INTO v_period_id, v_period_day_id
                FROM cash_cut_periods
                WHERE operational_day_id = v_day_id AND status = 'PROGRAMADO'
                ORDER BY period_number LIMIT 1;
              END IF;

              INSERT INTO cash_movements (
                operational_date, operational_day_id, cut_period_id, movement_type, direction, amount,
                previous_balance, new_balance, reference_type, reference_id, description, bank_name,
                reason, reversal_of_id, idempotency_key, created_by
              ) VALUES (
                v_date, COALESCE(v_period_day_id, v_day_id), v_period_id, p_movement_type, p_direction, round(p_amount, 2),
                v_previous, v_new, p_reference_type, p_reference_id, left(p_description, 255), left(p_bank_name, 150),
                left(p_reason, 255), p_reversal_of_id, p_idempotency_key, p_user_id
              )
              RETURNING id INTO v_id;

              RETURN v_id;
            END;
            $function$
    `);

    // ---- Write paths -------------------------------------------------------------------------------
    await queryRunner.query(`
      CREATE FUNCTION payment_group_note(p_text TEXT, p_min INT) RETURNS TEXT LANGUAGE plpgsql IMMUTABLE AS $$
      DECLARE
        v_text TEXT := NULLIF(regexp_replace(btrim(COALESCE(p_text, '')), '\\s+', ' ', 'g'), '');
      BEGIN
        IF p_min > 0 AND (v_text IS NULL OR length(v_text) < p_min) THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_NOTE_REQUIRED:%', p_min;
        END IF;
        RETURN left(v_text, 500);
      END;
      $$
    `);
    await queryRunner.query(`
      CREATE FUNCTION create_payment_group(
        p_transaction_type_id UUID, p_description TEXT, p_transaction_bank_id UUID, p_bank_account_id UUID,
        p_authorized_amount NUMERIC, p_items JSONB, p_observations TEXT, p_user_id UUID, p_key TEXT
      ) RETURNS UUID LANGUAGE plpgsql AS $$
      DECLARE
        v_existing UUID;
        v_type RECORD;
        v_agent RECORD;
        v_is_genesis BOOLEAN;
        v_agent_id UUID := p_transaction_bank_id;
        v_account_id UUID := p_bank_account_id;
        v_count INT;
        v_sum NUMERIC(14,2);
        v_available NUMERIC(14,2);
        v_description TEXT := regexp_replace(btrim(COALESCE(p_description, '')), '\\s+', ' ', 'g');
        v_id UUID;
      BEGIN
        IF p_key IS NULL OR length(btrim(p_key)) = 0 THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        SELECT id INTO v_existing FROM payment_groups WHERE idempotency_key = p_key;
        IF FOUND THEN
          RETURN v_existing;
        END IF;
        IF length(v_description) < 3 OR length(v_description) > 200 THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_DESCRIPTION_REQUIRED';
        END IF;
        SELECT id, name, is_active, balance_effect, cash_effect, allows_group_payment INTO v_type
        FROM transaction_types WHERE id = p_transaction_type_id;
        IF NOT FOUND OR NOT v_type.is_active OR NOT v_type.allows_group_payment THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_TYPE_NOT_ALLOWED:%', p_transaction_type_id;
        END IF;
        v_is_genesis := v_type.balance_effect IN ('DESEMBOLSO_GENESIS', 'PAGO_GENESIS');
        IF v_is_genesis THEN
          -- Génesis operations always use the Génesis line, never an agent bank.
          v_agent_id := NULL;
          v_account_id := NULL;
        ELSE
          SELECT id, is_active, cash_box_code INTO v_agent FROM transaction_banks WHERE id = p_transaction_bank_id;
          IF NOT FOUND OR NOT v_agent.is_active THEN
            RAISE EXCEPTION 'PAYMENT_GROUP_AGENT_REQUIRED';
          END IF;
          IF v_agent.cash_box_code IS NOT NULL THEN
            -- Guayacán has its own caja: its money is not in this Caja and cannot be reserved here.
            RAISE EXCEPTION 'PAYMENT_GROUP_AGENT_NOT_ALLOWED';
          END IF;
          IF v_type.balance_effect IS NOT NULL AND p_bank_account_id IS NULL THEN
            RAISE EXCEPTION 'PAYMENT_GROUP_ACCOUNT_REQUIRED';
          END IF;
          IF p_bank_account_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM banks WHERE id = p_bank_account_id AND is_active) THEN
            RAISE EXCEPTION 'PAYMENT_GROUP_ACCOUNT_REQUIRED';
          END IF;
        END IF;
        IF p_authorized_amount IS NULL OR p_authorized_amount <= 0 OR round(p_authorized_amount, 2) <> p_authorized_amount THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_INVALID_AMOUNT';
        END IF;
        IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_ITEMS_REQUIRED';
        END IF;
        v_count := jsonb_array_length(p_items);
        IF v_count > 200 THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_TOO_MANY_ITEMS';
        END IF;
        IF EXISTS (
          SELECT 1 FROM jsonb_array_elements(p_items) e
          WHERE (e ->> 'expectedAmount') IS NULL OR (e ->> 'expectedAmount')::NUMERIC <= 0
             OR round((e ->> 'expectedAmount')::NUMERIC, 2) <> (e ->> 'expectedAmount')::NUMERIC
             OR length(COALESCE(e ->> 'reference', '')) > 150
        ) THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_INVALID_AMOUNT';
        END IF;
        SELECT SUM((e ->> 'expectedAmount')::NUMERIC) INTO v_sum FROM jsonb_array_elements(p_items) e;
        IF v_sum > p_authorized_amount THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_ITEMS_EXCEED_AUTHORIZED:%', v_sum;
        END IF;

        -- Same lock as every Caja write: reservations and outflows are serialized.
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        SELECT id INTO v_existing FROM payment_groups WHERE idempotency_key = p_key;
        IF FOUND THEN
          RETURN v_existing;
        END IF;
        IF v_type.cash_effect = 'OUT' THEN
          v_available := cash_available();
          IF p_authorized_amount > v_available THEN
            RAISE EXCEPTION 'PAYMENT_GROUP_INSUFFICIENT_AVAILABLE:%', v_available;
          END IF;
        END IF;

        INSERT INTO payment_groups (
          transaction_type_id, cash_direction, description, operation_date, transaction_bank_id, bank_account_id,
          authorized_amount, observations, idempotency_key, created_by
        ) VALUES (
          p_transaction_type_id, v_type.cash_effect, v_description, (now() AT TIME ZONE 'America/Guatemala')::date,
          v_agent_id, v_account_id, p_authorized_amount, payment_group_note(p_observations, 0), p_key, p_user_id
        ) RETURNING id INTO v_id;
        INSERT INTO payment_group_items (group_id, item_number, expected_amount, reference, created_by)
        SELECT v_id, e.n, (e.value ->> 'expectedAmount')::NUMERIC,
               NULLIF(regexp_replace(btrim(COALESCE(e.value ->> 'reference', '')), '\\s+', ' ', 'g'), ''), p_user_id
        FROM jsonb_array_elements(p_items) WITH ORDINALITY AS e(value, n);
        INSERT INTO payment_group_events (group_id, event_type, group_status, amount, note, created_by)
        VALUES (v_id, 'CREADO', 'PENDIENTE', p_authorized_amount, payment_group_note(p_observations, 0), p_user_id);
        RETURN v_id;
      END;
      $$
    `);

    // Locks a group and one of its items in the Caja order (agent bank → accounts → caja → group → item).
    await queryRunner.query(`
      CREATE FUNCTION payment_group_lock(p_group_id UUID, p_item_id UUID) RETURNS payment_groups
      LANGUAGE plpgsql AS $$
      DECLARE
        v_group payment_groups;
      BEGIN
        SELECT * INTO v_group FROM payment_groups WHERE id = p_group_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_NOT_FOUND:%', p_group_id;
        END IF;
        IF v_group.transaction_bank_id IS NOT NULL THEN
          PERFORM 1 FROM transaction_banks WHERE id = v_group.transaction_bank_id FOR UPDATE;
        END IF;
        PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));
        SELECT * INTO v_group FROM payment_groups WHERE id = p_group_id FOR UPDATE;
        IF p_item_id IS NOT NULL AND NOT EXISTS (
          SELECT 1 FROM payment_group_items WHERE id = p_item_id AND group_id = p_group_id FOR UPDATE
        ) THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_ITEM_NOT_FOUND:%', p_item_id;
        END IF;
        RETURN v_group;
      END;
      $$
    `);
    await queryRunner.query(`
      CREATE FUNCTION payment_group_item_status(p_item_id UUID) RETURNS TEXT LANGUAGE sql STABLE AS $$
        SELECT status FROM payment_group_item_balances WHERE id = p_item_id
      $$
    `);

    await queryRunner.query(`
      CREATE FUNCTION register_payment_group_delivery(
        p_group_id UUID, p_item_id UUID, p_amount NUMERIC, p_note TEXT, p_user_id UUID, p_key TEXT
      ) RETURNS UUID LANGUAGE plpgsql AS $$
      DECLARE
        v_existing UUID;
        v_group payment_groups;
        v_item payment_group_item_balances;
        v_type RECORD;
        v_operation UUID;
        v_id UUID;
        v_label TEXT;
      BEGIN
        IF p_key IS NULL OR length(btrim(p_key)) = 0 THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        SELECT id INTO v_existing FROM payment_group_deliveries WHERE idempotency_key = p_key;
        IF FOUND THEN
          RETURN v_existing;
        END IF;
        v_group := payment_group_lock(p_group_id, p_item_id);
        -- Re-checked under the lock: a retry of the same confirmation never pays twice.
        SELECT id INTO v_existing FROM payment_group_deliveries WHERE idempotency_key = p_key;
        IF FOUND THEN
          RETURN v_existing;
        END IF;
        IF v_group.status <> 'ABIERTO' THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_NOT_OPEN:%', v_group.status;
        END IF;
        SELECT * INTO v_item FROM payment_group_item_balances WHERE id = p_item_id;
        IF v_item.status = 'ANULADO' THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_ITEM_VOIDED';
        END IF;
        IF v_item.status = 'PAGADO' THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_ITEM_ALREADY_PAID';
        END IF;
        IF v_item.released_amount > 0 THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_ITEM_RELEASED';
        END IF;
        IF p_amount IS NULL OR p_amount <= 0 OR round(p_amount, 2) <> p_amount THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_INVALID_AMOUNT';
        END IF;
        IF p_amount > v_item.expected_amount - v_item.paid_amount THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_AMOUNT_EXCEEDS:%', v_item.expected_amount - v_item.paid_amount;
        END IF;
        SELECT name, cash_effect, is_active INTO v_type FROM transaction_types WHERE id = v_group.transaction_type_id;
        IF v_type.cash_effect <> v_group.cash_direction THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_TYPE_CHANGED';
        END IF;
        IF v_group.cash_direction = 'OUT' AND p_amount > cash_balance() THEN
          RAISE EXCEPTION 'CASH_INSUFFICIENT_BALANCE';
        END IF;

        v_label := v_group.code || ' #' || v_item.item_number;
        -- The delivery IS a Transaccionar operation: same Kardex, bank / Génesis line and Estado de Cuenta.
        PERFORM set_config('app.cash_reservation_consumer', 'on', true);
        v_operation := register_bank_deposit_operation(
          v_group.transaction_bank_id, p_amount, (now() AT TIME ZONE 'America/Guatemala')::date, '[]'::jsonb,
          jsonb_build_array(p_amount), p_user_id, v_group.transaction_type_id,
          left(COALESCE(NULLIF(btrim(v_item.reference), ''), v_label), 150), 0, NULL, v_group.bank_account_id, false,
          left('Pago grupal ' || v_label || ' — ' || v_group.description
               || COALESCE(' — ' || NULLIF(btrim(v_item.reference), ''), ''), 250)
        );
        PERFORM set_config('app.cash_reservation_consumer', '', true);

        INSERT INTO payment_group_deliveries (group_id, item_id, amount, operation_id, idempotency_key, created_by)
        VALUES (p_group_id, p_item_id, p_amount, v_operation, p_key, p_user_id)
        RETURNING id INTO v_id;
        INSERT INTO payment_group_events (group_id, item_id, event_type, item_status, amount, note, operation_id, created_by)
        VALUES (p_group_id, p_item_id, 'ENTREGA', payment_group_item_status(p_item_id), p_amount,
                payment_group_note(p_note, 0), v_operation, p_user_id);
        RETURN v_id;
      END;
      $$
    `);

    await queryRunner.query(`
      CREATE FUNCTION mark_payment_group_item_no_payment(p_group_id UUID, p_item_id UUID, p_note TEXT, p_user_id UUID)
      RETURNS VOID LANGUAGE plpgsql AS $$
      DECLARE
        v_group payment_groups;
        v_note TEXT := payment_group_note(p_note, 5);
      BEGIN
        v_group := payment_group_lock(p_group_id, p_item_id);
        IF v_group.status <> 'ABIERTO' THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_NOT_OPEN:%', v_group.status;
        END IF;
        IF payment_group_item_status(p_item_id) <> 'PENDIENTE' THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_ITEM_ALREADY_PROCESSED:%', payment_group_item_status(p_item_id);
        END IF;
        PERFORM set_config('app.payment_group_write', 'on', true);
        UPDATE payment_group_items SET no_payment_at = now(), no_payment_by = p_user_id WHERE id = p_item_id;
        PERFORM set_config('app.payment_group_write', '', true);
        INSERT INTO payment_group_events (group_id, item_id, event_type, item_status, note, created_by)
        VALUES (p_group_id, p_item_id, 'SIN_PAGO', 'SIN_PAGO', v_note, p_user_id);
      END;
      $$
    `);

    await queryRunner.query(`
      CREATE FUNCTION add_payment_group_note(p_group_id UUID, p_item_id UUID, p_note TEXT, p_user_id UUID)
      RETURNS UUID LANGUAGE plpgsql AS $$
      DECLARE
        v_note TEXT := payment_group_note(p_note, 3);
        v_id UUID;
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM payment_groups WHERE id = p_group_id) THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_NOT_FOUND:%', p_group_id;
        END IF;
        IF p_item_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM payment_group_items WHERE id = p_item_id AND group_id = p_group_id) THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_ITEM_NOT_FOUND:%', p_item_id;
        END IF;
        INSERT INTO payment_group_events (group_id, item_id, event_type, item_status, group_status, note, created_by)
        VALUES (p_group_id, p_item_id, 'OBSERVACION', payment_group_item_status(p_item_id),
                (SELECT display_status FROM payment_group_balances WHERE id = p_group_id), v_note, p_user_id)
        RETURNING id INTO v_id;
        RETURN v_id;
      END;
      $$
    `);

    await queryRunner.query(`
      CREATE FUNCTION update_payment_group_item(
        p_group_id UUID, p_item_id UUID, p_expected_amount NUMERIC, p_reference TEXT, p_set_reference BOOLEAN,
        p_note TEXT, p_user_id UUID
      ) RETURNS VOID LANGUAGE plpgsql AS $$
      DECLARE
        v_group payment_groups;
        v_item payment_group_item_balances;
        v_sum NUMERIC(14,2);
        v_changes TEXT := '';
      BEGIN
        v_group := payment_group_lock(p_group_id, p_item_id);
        IF v_group.status <> 'ABIERTO' THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_NOT_OPEN:%', v_group.status;
        END IF;
        SELECT * INTO v_item FROM payment_group_item_balances WHERE id = p_item_id;
        IF v_item.status NOT IN ('PENDIENTE', 'SIN_PAGO') OR v_item.released_amount > 0 THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_ITEM_ALREADY_PROCESSED:%', v_item.status;
        END IF;
        IF p_expected_amount IS NOT NULL THEN
          IF p_expected_amount <= 0 OR round(p_expected_amount, 2) <> p_expected_amount THEN
            RAISE EXCEPTION 'PAYMENT_GROUP_INVALID_AMOUNT';
          END IF;
          SELECT COALESCE(SUM(expected_amount), 0) INTO v_sum FROM payment_group_item_balances
          WHERE group_id = p_group_id AND status <> 'ANULADO' AND id <> p_item_id;
          IF v_sum + p_expected_amount > v_group.authorized_amount THEN
            RAISE EXCEPTION 'PAYMENT_GROUP_ITEMS_EXCEED_AUTHORIZED:%', v_sum + p_expected_amount;
          END IF;
          IF p_expected_amount <> v_item.expected_amount THEN
            v_changes := 'Monto esperado: Q' || to_char(v_item.expected_amount, 'FM999,999,990.00')
              || ' → Q' || to_char(p_expected_amount, 'FM999,999,990.00') || '. ';
          END IF;
        END IF;
        IF p_set_reference AND COALESCE(btrim(p_reference), '') IS DISTINCT FROM COALESCE(v_item.reference, '') THEN
          v_changes := v_changes || 'Referencia: ' || COALESCE(v_item.reference, '—') || ' → '
            || COALESCE(NULLIF(btrim(p_reference), ''), '—') || '. ';
        END IF;
        IF v_changes = '' THEN
          RETURN;
        END IF;
        PERFORM set_config('app.payment_group_write', 'on', true);
        UPDATE payment_group_items
        SET expected_amount = COALESCE(p_expected_amount, expected_amount),
            reference = CASE WHEN p_set_reference THEN left(NULLIF(btrim(p_reference), ''), 150) ELSE reference END
        WHERE id = p_item_id;
        PERFORM set_config('app.payment_group_write', '', true);
        INSERT INTO payment_group_events (group_id, item_id, event_type, item_status, amount, note, created_by)
        VALUES (p_group_id, p_item_id, 'MONTO_CAMBIADO', payment_group_item_status(p_item_id), p_expected_amount,
                left(v_changes || COALESCE(payment_group_note(p_note, 0), ''), 500), p_user_id);
      END;
      $$
    `);

    await queryRunner.query(`
      CREATE FUNCTION resolve_payment_group_item(
        p_group_id UUID, p_item_id UUID, p_resolution TEXT, p_release BOOLEAN, p_user_id UUID
      ) RETURNS VOID LANGUAGE plpgsql AS $$
      DECLARE
        v_group payment_groups;
        v_item payment_group_item_balances;
        v_resolution TEXT := payment_group_note(p_resolution, 5);
        v_release NUMERIC(14,2) := 0;
      BEGIN
        IF p_release THEN
          PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
        END IF;
        v_group := payment_group_lock(p_group_id, p_item_id);
        IF v_group.status <> 'ABIERTO' THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_NOT_OPEN:%', v_group.status;
        END IF;
        SELECT * INTO v_item FROM payment_group_item_balances WHERE id = p_item_id;
        IF v_item.status NOT IN ('PARCIAL', 'SIN_PAGO') THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_ITEM_NOT_RESOLVABLE:%', v_item.status;
        END IF;
        IF v_item.resolved_at IS NOT NULL THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_ITEM_ALREADY_RESOLVED';
        END IF;
        IF p_release THEN
          v_release := v_item.expected_amount - v_item.paid_amount;
        END IF;
        PERFORM set_config('app.payment_group_write', 'on', true);
        UPDATE payment_group_items
        SET resolution = left(v_resolution, 255), resolved_at = now(), resolved_by = p_user_id,
            released_amount = released_amount + v_release
        WHERE id = p_item_id;
        PERFORM set_config('app.payment_group_write', '', true);
        INSERT INTO payment_group_events (group_id, item_id, event_type, item_status, amount, note, created_by)
        VALUES (p_group_id, p_item_id, 'RESOLUCION', payment_group_item_status(p_item_id), NULLIF(v_release, 0),
                CASE WHEN v_release > 0 THEN 'Liberado. ' ELSE '' END || v_resolution, p_user_id);
      END;
      $$
    `);

    await queryRunner.query(`
      CREATE FUNCTION void_payment_group_item(
        p_group_id UUID, p_item_id UUID, p_reason TEXT, p_money_returned BOOLEAN, p_user_id UUID
      ) RETURNS VOID LANGUAGE plpgsql AS $$
      DECLARE
        v_group payment_groups;
        v_item payment_group_item_balances;
        v_reason TEXT := payment_group_note(p_reason, 5);
        v_operation UUID;
        v_reversed NUMERIC(14,2) := 0;
      BEGIN
        PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
        v_group := payment_group_lock(p_group_id, p_item_id);
        IF v_group.status <> 'ABIERTO' THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_NOT_OPEN:%', v_group.status;
        END IF;
        SELECT * INTO v_item FROM payment_group_item_balances WHERE id = p_item_id;
        IF v_item.status = 'ANULADO' THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_ITEM_VOIDED';
        END IF;
        IF v_item.paid_amount > 0 THEN
          -- The money of a payment is reversed only if it really came back (never a fictitious entry).
          IF NOT COALESCE(p_money_returned, false) THEN
            RAISE EXCEPTION 'PAYMENT_GROUP_ITEM_HAS_PAYMENTS:%', v_item.paid_amount;
          END IF;
          PERFORM set_config('app.payment_group_void', 'on', true);
          FOR v_operation IN
            SELECT d.operation_id FROM payment_group_deliveries d
            JOIN bank_deposit_operations o ON o.id = d.operation_id AND NOT o.is_voided
            WHERE d.item_id = p_item_id ORDER BY d.created_at
          LOOP
            PERFORM void_bank_deposit_operation(v_operation, (now() AT TIME ZONE 'America/Guatemala')::date, p_user_id,
              left('Anulación pago grupal ' || v_group.code || ' #' || v_item.item_number || ': ' || v_reason, 255));
          END LOOP;
          PERFORM set_config('app.payment_group_void', '', true);
          v_reversed := v_item.paid_amount;
        END IF;
        PERFORM set_config('app.payment_group_write', 'on', true);
        UPDATE payment_group_items
        SET voided_at = now(), voided_by = p_user_id, void_reason = left(v_reason, 255),
            released_amount = expected_amount
        WHERE id = p_item_id;
        PERFORM set_config('app.payment_group_write', '', true);
        INSERT INTO payment_group_events (group_id, item_id, event_type, item_status, amount, note, created_by)
        VALUES (p_group_id, p_item_id, 'ANULACION', 'ANULADO', v_item.expected_amount,
                CASE WHEN v_reversed > 0
                     THEN 'Dinero devuelto a Caja: Q' || to_char(v_reversed, 'FM999,999,990.00') || ' (reversa de sus operaciones). '
                     ELSE '' END || v_reason, p_user_id);
      END;
      $$
    `);

    await queryRunner.query(`
      CREATE FUNCTION close_payment_group(p_group_id UUID, p_note TEXT, p_user_id UUID)
      RETURNS VOID LANGUAGE plpgsql AS $$
      DECLARE
        v_group payment_groups;
        v_balance payment_group_balances;
        v_item_released NUMERIC(14,2);
        v_release NUMERIC(14,2);
        v_note TEXT := payment_group_note(p_note, 0);
      BEGIN
        PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
        v_group := payment_group_lock(p_group_id, NULL);
        IF v_group.status <> 'ABIERTO' THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_NOT_OPEN:%', v_group.status;
        END IF;
        SELECT * INTO v_balance FROM payment_group_balances WHERE id = p_group_id;
        IF v_balance.pending_count > 0 THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_HAS_PENDING:%', v_balance.pending_count;
        END IF;
        IF v_balance.unresolved_count > 0 THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_UNRESOLVED:%', v_balance.unresolved_count;
        END IF;
        SELECT COALESCE(SUM(released_amount), 0) INTO v_item_released FROM payment_group_items WHERE group_id = p_group_id;
        v_release := GREATEST(v_group.authorized_amount - v_balance.paid_amount - v_item_released, 0);
        PERFORM set_config('app.payment_group_write', 'on', true);
        UPDATE payment_groups
        SET status = 'CERRADO', closed_at = now(), closed_by = p_user_id, close_note = v_note,
            closing_paid = v_balance.paid_amount, closing_released = v_release,
            closing_summary = jsonb_build_object(
              'authorized', v_group.authorized_amount, 'paid', v_balance.paid_amount,
              'releasedBefore', v_item_released, 'releasedAtClose', v_release,
              'items', v_balance.item_count, 'paidCount', v_balance.paid_count,
              'partialCount', v_balance.partial_count, 'noPaymentCount', v_balance.no_payment_count,
              'voidedCount', v_balance.voided_count)
        WHERE id = p_group_id;
        PERFORM set_config('app.payment_group_write', '', true);
        INSERT INTO payment_group_events (group_id, event_type, group_status, amount, note, created_by)
        VALUES (p_group_id, 'CIERRE', 'COMPLETADO', v_release,
                'Pagado Q' || to_char(v_balance.paid_amount, 'FM999,999,990.00') || ', liberado al cerrar Q'
                || to_char(v_release, 'FM999,999,990.00') || '.' || COALESCE(' ' || v_note, ''), p_user_id);
      END;
      $$
    `);

    await queryRunner.query(`
      CREATE FUNCTION void_payment_group(p_group_id UUID, p_reason TEXT, p_user_id UUID)
      RETURNS VOID LANGUAGE plpgsql AS $$
      DECLARE
        v_group payment_groups;
        v_balance payment_group_balances;
        v_reason TEXT := payment_group_note(p_reason, 5);
        v_items_expected NUMERIC(14,2);
      BEGIN
        PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
        v_group := payment_group_lock(p_group_id, NULL);
        IF v_group.status <> 'ABIERTO' THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_NOT_OPEN:%', v_group.status;
        END IF;
        SELECT * INTO v_balance FROM payment_group_balances WHERE id = p_group_id;
        IF v_balance.paid_amount > 0 THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_HAS_PAYMENTS:%', v_balance.paid_amount;
        END IF;
        PERFORM set_config('app.payment_group_write', 'on', true);
        UPDATE payment_group_items
        SET voided_at = now(), voided_by = p_user_id, void_reason = left(v_reason, 255), released_amount = expected_amount
        WHERE group_id = p_group_id AND voided_at IS NULL;
        SELECT COALESCE(SUM(released_amount), 0) INTO v_items_expected FROM payment_group_items WHERE group_id = p_group_id;
        UPDATE payment_groups
        SET status = 'ANULADO', voided_at = now(), voided_by = p_user_id, void_reason = left(v_reason, 255),
            closing_paid = 0, closing_released = GREATEST(authorized_amount - v_items_expected, 0)
        WHERE id = p_group_id;
        PERFORM set_config('app.payment_group_write', '', true);
        INSERT INTO payment_group_events (group_id, event_type, group_status, amount, note, created_by)
        VALUES (p_group_id, 'ANULACION_GRUPO', 'ANULADO', v_group.authorized_amount, v_reason, p_user_id);
      END;
      $$
    `);

    // A group operation is voided only from its group (money returned), never directly in Transaccionar.
    await queryRunner.query(`
      CREATE FUNCTION payment_group_operation_guard() RETURNS trigger LANGUAGE plpgsql AS $$
      DECLARE
        v_label TEXT;
      BEGIN
        SELECT g.code || ' #' || i.item_number INTO v_label
        FROM payment_group_deliveries d
        JOIN payment_groups g ON g.id = d.group_id
        JOIN payment_group_items i ON i.id = d.item_id
        WHERE d.operation_id = NEW.id;
        IF v_label IS NOT NULL AND COALESCE(current_setting('app.payment_group_void', true), '') <> 'on' THEN
          RAISE EXCEPTION 'PAYMENT_GROUP_OPERATION_LOCKED:%', v_label;
        END IF;
        RETURN NEW;
      END;
      $$
    `);
    await queryRunner.query(`
      CREATE TRIGGER trg_payment_group_operation_guard
      BEFORE UPDATE OF is_voided ON bank_deposit_operations
      FOR EACH ROW WHEN (OLD.is_voided = false AND NEW.is_voided = true)
      EXECUTE FUNCTION payment_group_operation_guard()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Previous Kardex writer (without the reservation check).
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.apply_cash_movement(p_movement_type character varying, p_direction character varying, p_amount numeric, p_user_id uuid, p_description character varying, p_reference_type character varying, p_reference_id uuid, p_bank_name character varying, p_reason character varying, p_reversal_of_id uuid, p_idempotency_key character varying)
       RETURNS uuid
       LANGUAGE plpgsql
      AS $function$
            DECLARE
              v_existing UUID;
              v_previous NUMERIC(14,2);
              v_new NUMERIC(14,2);
              v_date DATE := (now() AT TIME ZONE 'America/Guatemala')::date;
              v_day_id UUID;
              v_period_id UUID;
              v_period_day_id UUID;
              v_id UUID;
            BEGIN
              PERFORM pg_advisory_xact_lock(hashtext('cash_control_main'));

              IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 THEN
                RAISE EXCEPTION 'CASH_IDEMPOTENCY_KEY_REQUIRED';
              END IF;
              SELECT id INTO v_existing FROM cash_movements WHERE idempotency_key = p_idempotency_key;
              IF FOUND THEN
                RETURN v_existing;
              END IF;

              IF p_amount IS NULL OR p_amount <= 0 THEN
                RAISE EXCEPTION 'CASH_INVALID_AMOUNT';
              END IF;
              IF p_direction NOT IN ('IN', 'OUT', 'NONE') THEN
                RAISE EXCEPTION 'CASH_INVALID_DIRECTION';
              END IF;

              v_previous := cash_balance();
              v_new := v_previous + CASE p_direction WHEN 'IN' THEN p_amount WHEN 'OUT' THEN -p_amount ELSE 0 END;

              SELECT id INTO v_day_id FROM cash_operational_days WHERE operational_date = v_date;
              -- Cut attribution: the open cut, else the next pending cut of today.
              SELECT id, operational_day_id INTO v_period_id, v_period_day_id
              FROM cash_cut_periods WHERE status = 'ABIERTO' LIMIT 1;
              IF v_period_id IS NULL AND v_day_id IS NOT NULL THEN
                SELECT id, operational_day_id INTO v_period_id, v_period_day_id
                FROM cash_cut_periods
                WHERE operational_day_id = v_day_id AND status = 'PROGRAMADO'
                ORDER BY period_number LIMIT 1;
              END IF;

              INSERT INTO cash_movements (
                operational_date, operational_day_id, cut_period_id, movement_type, direction, amount,
                previous_balance, new_balance, reference_type, reference_id, description, bank_name,
                reason, reversal_of_id, idempotency_key, created_by
              ) VALUES (
                v_date, COALESCE(v_period_day_id, v_day_id), v_period_id, p_movement_type, p_direction, round(p_amount, 2),
                v_previous, v_new, p_reference_type, p_reference_id, left(p_description, 255), left(p_bank_name, 150),
                left(p_reason, 255), p_reversal_of_id, p_idempotency_key, p_user_id
              )
              RETURNING id INTO v_id;

              RETURN v_id;
            END;
            $function$
    `);
    await queryRunner.query(
      `DROP TRIGGER trg_payment_group_operation_guard ON bank_deposit_operations`,
    );
    for (const fn of [
      'payment_group_operation_guard()',
      'void_payment_group(UUID, TEXT, UUID)',
      'close_payment_group(UUID, TEXT, UUID)',
      'void_payment_group_item(UUID, UUID, TEXT, BOOLEAN, UUID)',
      'resolve_payment_group_item(UUID, UUID, TEXT, BOOLEAN, UUID)',
      'update_payment_group_item(UUID, UUID, NUMERIC, TEXT, BOOLEAN, TEXT, UUID)',
      'add_payment_group_note(UUID, UUID, TEXT, UUID)',
      'mark_payment_group_item_no_payment(UUID, UUID, TEXT, UUID)',
      'register_payment_group_delivery(UUID, UUID, NUMERIC, TEXT, UUID, TEXT)',
      'payment_group_item_status(UUID)',
      'payment_group_lock(UUID, UUID)',
      'create_payment_group(UUID, TEXT, UUID, UUID, NUMERIC, JSONB, TEXT, UUID, TEXT)',
      'payment_group_note(TEXT, INT)',
      'cash_available()',
      'cash_reserved_total()',
    ]) {
      await queryRunner.query(`DROP FUNCTION ${fn}`);
    }
    await queryRunner.query(`DROP VIEW payment_group_balances`);
    await queryRunner.query(`DROP VIEW payment_group_item_balances`);
    // Tables created by this migration (their history only exists because of it). Run `down` only on a copy.
    for (const table of [
      'payment_group_events',
      'payment_group_deliveries',
      'payment_group_items',
      'payment_groups',
    ]) {
      await queryRunner.query(`DROP TABLE ${table}`);
    }
    await queryRunner.query(`DROP FUNCTION payment_group_write_guard()`);
    await queryRunner.query(`DROP FUNCTION payment_group_append_only()`);
    await queryRunner.query(`DROP SEQUENCE payment_group_number_seq`);
    await queryRunner.query(
      `ALTER TABLE transaction_types DROP COLUMN allows_group_payment`,
    );
  }
}
