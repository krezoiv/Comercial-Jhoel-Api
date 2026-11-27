import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Pagos grupales de Fundación Génesis con aprobación (owner request,
 * 2026-11-27). The physical receipt's administrative header (group code,
 * printed id, branch, president, secretary, treasurer, promoter) is NOT
 * captured — it never was; this migration adds nothing for it.
 *
 * Owner decisions (AskUserQuestion 2026-11-27):
 * - A Génesis group (types with balance effect PAGO_GENESIS / DESEMBOLSO_GENESIS)
 *   is approved as a whole: saving leaves it PENDIENTE DE APROBACIÓN and moves
 *   nothing (no Caja, no Génesis line, no operation); approving books EVERY
 *   cuota at once — one real Transaccionar operation per cuota, through the same
 *   `register_payment_group_delivery` → `register_bank_deposit_operation` path,
 *   so Caja, Kardex, Génesis line, Estado de Cuenta and the transaction count
 *   move exactly as before. Per-cuota confirmation does not apply to them.
 *   Other groups (Pago Varios) keep their per-transaction flow unchanged.
 * - Only admins approve (`cash_custody.authorize`).
 * - While pending, the creator or an admin can correct name, total and cuotas;
 *   every correction is an EDITADO event with the before/after rows.
 *
 * Data model — nothing duplicated:
 * - Group: name = `description`, declared total = `authorized_amount`, the
 *   declared count is validated against the rows and never stored twice;
 *   `requires_approval` marks the flow; approval date / user are the group's
 *   `closed_at` / `closed_by` (approving closes it: everything was paid).
 * - Cuota: correlativo = `item_number`, client = `reference` (also the
 *   operation's client), amount = `expected_amount`, plus `credit_number` and
 *   `observation`.
 * - Approval is atomic (one transaction: every operation or none) and
 *   idempotent (an approved group is never booked twice; retries return).
 */
const CLEAN = `
  CREATE FUNCTION payment_group_clean(p_text TEXT, p_max INT) RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
    SELECT left(NULLIF(regexp_replace(btrim(COALESCE(p_text, '')), '\\s+', ' ', 'g'), ''), p_max)
  $$
`;

const CHECK_ITEMS = `
  CREATE FUNCTION payment_group_check_items(p_items JSONB, p_authorized NUMERIC, p_exact BOOLEAN)
  RETURNS NUMERIC LANGUAGE plpgsql IMMUTABLE AS $$
  DECLARE
    v_sum NUMERIC(14,2);
    v_incomplete BIGINT;
  BEGIN
    p_exact := COALESCE(p_exact, false);
    IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_ITEMS_REQUIRED';
    END IF;
    IF jsonb_array_length(p_items) > 200 THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_TOO_MANY_ITEMS';
    END IF;
    IF EXISTS (
      SELECT 1 FROM jsonb_array_elements(p_items) e
      WHERE (e ->> 'expectedAmount') IS NULL OR (e ->> 'expectedAmount')::NUMERIC <= 0
         OR round((e ->> 'expectedAmount')::NUMERIC, 2) <> (e ->> 'expectedAmount')::NUMERIC
    ) THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_INVALID_AMOUNT';
    END IF;
    IF EXISTS (
      SELECT 1 FROM jsonb_array_elements(p_items) e
      WHERE length(COALESCE(payment_group_clean(e ->> 'reference', 1000), '')) > 150
         OR length(COALESCE(payment_group_clean(e ->> 'creditNumber', 1000), '')) > 40
         OR length(COALESCE(payment_group_clean(e ->> 'observation', 1000), '')) > 255
    ) THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_TEXT_TOO_LONG';
    END IF;
    IF p_exact THEN
      -- Génesis cuotas: credit number and client name are part of every row.
      SELECT min(e.n) INTO v_incomplete
      FROM jsonb_array_elements(p_items) WITH ORDINALITY AS e(value, n)
      WHERE payment_group_clean(e.value ->> 'creditNumber', 40) IS NULL
         OR length(COALESCE(payment_group_clean(e.value ->> 'reference', 150), '')) < 2;
      IF v_incomplete IS NOT NULL THEN
        RAISE EXCEPTION 'PAYMENT_GROUP_CUOTA_INCOMPLETE:%', v_incomplete;
      END IF;
    END IF;
    SELECT SUM((e ->> 'expectedAmount')::NUMERIC) INTO v_sum FROM jsonb_array_elements(p_items) e;
    IF p_exact AND v_sum <> p_authorized THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_TOTAL_MISMATCH:%', v_sum;
    END IF;
    IF NOT p_exact AND v_sum > p_authorized THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_ITEMS_EXCEED_AUTHORIZED:%', v_sum;
    END IF;
    RETURN v_sum;
  END;
  $$
`;

// ---- Views (new columns appended; display status learns the approval states) ------------------
const ITEM_VIEW = (extra: boolean) => `
  CREATE OR REPLACE VIEW payment_group_item_balances AS
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
         GREATEST(i.expected_amount - COALESCE(d.paid, 0) - i.released_amount, 0)::NUMERIC(14,2) AS outstanding_amount${
           extra ? `,\n         i.credit_number, i.observation` : ''
         }
  FROM payment_group_items i
  LEFT JOIN LATERAL (
    SELECT SUM(dl.amount) AS paid, count(*) AS deliveries, max(dl.created_at) AS last_paid_at
    FROM payment_group_deliveries dl
    JOIN bank_deposit_operations o ON o.id = dl.operation_id AND NOT o.is_voided
    WHERE dl.item_id = i.id
  ) d ON TRUE
`;

const GROUP_VIEW = (extra: boolean) => `
  CREATE OR REPLACE VIEW payment_group_balances AS
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
         CASE WHEN g.status = 'ANULADO' THEN 'ANULADO'${
           extra
             ? `
              WHEN g.requires_approval AND g.status = 'CERRADO' THEN 'APROBADO'`
             : ''
         }
              WHEN g.status = 'CERRADO' THEN 'COMPLETADO'${
                extra
                  ? `
              WHEN g.requires_approval THEN 'PENDIENTE_APROBACION'`
                  : ''
              }
              WHEN count(b.id) FILTER (WHERE b.status <> 'PENDIENTE') = 0 THEN 'PENDIENTE'
              WHEN count(b.id) FILTER (WHERE b.status IN ('PARCIAL', 'SIN_PAGO') AND b.resolved_at IS NULL) > 0 THEN 'PARCIAL'
              ELSE 'EN_PROCESO' END AS display_status${
                extra ? `,\n         g.requires_approval` : ''
              }
  FROM payment_groups g
  LEFT JOIN payment_group_item_balances b ON b.group_id = g.id
  GROUP BY g.id
`;

// ---- Replaced functions: new bodies ------------------------------------------------------------
const WRITE_GUARD_NEW = `
  CREATE OR REPLACE FUNCTION payment_group_write_guard() RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    IF TG_OP = 'DELETE' THEN
      -- Only a cuota of a Génesis group still pending approval, with no payment, is removed
      -- (correcting the draft through update_pending_payment_group, which keeps the before/after in history).
      IF TG_TABLE_NAME = 'payment_group_items'
         AND COALESCE(current_setting('app.payment_group_draft_delete', true), '') = 'on'
         AND EXISTS (SELECT 1 FROM payment_groups WHERE id = OLD.group_id AND requires_approval AND status = 'ABIERTO')
         AND NOT EXISTS (SELECT 1 FROM payment_group_deliveries WHERE item_id = OLD.id) THEN
        RETURN OLD;
      END IF;
      RAISE EXCEPTION 'PAYMENT_GROUP_DIRECT_WRITE';
    END IF;
    IF COALESCE(current_setting('app.payment_group_write', true), '') <> 'on' THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_DIRECT_WRITE';
    END IF;
    RETURN NEW;
  END;
  $$
`;

const LOCK_NEW = `
  CREATE OR REPLACE FUNCTION payment_group_lock(p_group_id UUID, p_item_id UUID) RETURNS payment_groups
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
    -- A group pending approval is only edited, approved or voided as a whole (app.payment_group_draft_ok);
    -- per-cuota actions (pay, no payment, resolve, void, close) do not apply to it.
    IF v_group.requires_approval AND v_group.status = 'ABIERTO'
       AND COALESCE(current_setting('app.payment_group_draft_ok', true), '') <> 'on' THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_PENDING_APPROVAL';
    END IF;
    IF p_item_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM payment_group_items WHERE id = p_item_id AND group_id = p_group_id FOR UPDATE
    ) THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_ITEM_NOT_FOUND:%', p_item_id;
    END IF;
    RETURN v_group;
  END;
  $$
`;

const CREATE_NEW = `
  CREATE OR REPLACE FUNCTION create_payment_group(
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
    -- balance_effect is NULL for types without a bank effect (Pago Varios): not Génesis.
    v_is_genesis := COALESCE(v_type.balance_effect IN ('DESEMBOLSO_GENESIS', 'PAGO_GENESIS'), false);
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
    -- Génesis (approval) groups: the cuotas must add up to the declared total exactly; others may assign less.
    v_sum := payment_group_check_items(p_items, p_authorized_amount, v_is_genesis);

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
      authorized_amount, observations, requires_approval, idempotency_key, created_by
    ) VALUES (
      p_transaction_type_id, v_type.cash_effect, v_description, (now() AT TIME ZONE 'America/Guatemala')::date,
      v_agent_id, v_account_id, p_authorized_amount, payment_group_note(p_observations, 0), v_is_genesis, p_key, p_user_id
    ) RETURNING id INTO v_id;
    INSERT INTO payment_group_items (group_id, item_number, expected_amount, reference, credit_number, observation, created_by)
    SELECT v_id, e.n, (e.value ->> 'expectedAmount')::NUMERIC,
           payment_group_clean(e.value ->> 'reference', 150), payment_group_clean(e.value ->> 'creditNumber', 40),
           payment_group_clean(e.value ->> 'observation', 255), p_user_id
    FROM jsonb_array_elements(p_items) WITH ORDINALITY AS e(value, n);
    INSERT INTO payment_group_events (group_id, event_type, group_status, amount, note, created_by)
    VALUES (v_id, 'CREADO', CASE WHEN v_is_genesis THEN 'PENDIENTE_APROBACION' ELSE 'PENDIENTE' END, p_authorized_amount,
            CASE WHEN v_is_genesis
                 THEN left(jsonb_array_length(p_items) || ' cuota(s) por Q' || to_char(v_sum, 'FM999,999,990.00')
                      || ': pendiente de aprobación.' || COALESCE(' ' || payment_group_note(p_observations, 0), ''), 500)
                 ELSE payment_group_note(p_observations, 0) END,
            p_user_id);
    RETURN v_id;
  END;
  $$
`;

const DELIVERY_BODY = (withCredit: boolean) => `
  CREATE OR REPLACE FUNCTION register_payment_group_delivery(
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
      left('Pago grupal ' || v_label || ' — ' || v_group.description${
        withCredit
          ? `
           || COALESCE(' — Crédito ' || NULLIF(btrim(v_item.credit_number), ''), '')`
          : ''
      }
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
`;

const NOTE_BODY = (draftCheck: boolean) => `
  CREATE OR REPLACE FUNCTION add_payment_group_note(p_group_id UUID, p_item_id UUID, p_note TEXT, p_user_id UUID)
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
    END IF;${
      draftCheck
        ? `
    -- While pending approval a cuota's observation is part of the row (edited with the group).
    IF p_item_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM payment_groups WHERE id = p_group_id AND requires_approval AND status = 'ABIERTO'
    ) THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_DRAFT_ITEM_NOTE';
    END IF;`
        : ''
    }
    INSERT INTO payment_group_events (group_id, item_id, event_type, item_status, group_status, note, created_by)
    VALUES (p_group_id, p_item_id, 'OBSERVACION', payment_group_item_status(p_item_id),
            (SELECT display_status FROM payment_group_balances WHERE id = p_group_id), v_note, p_user_id)
    RETURNING id INTO v_id;
    RETURN v_id;
  END;
  $$
`;

const VOID_GROUP_BODY = (draftOk: boolean) => `
  CREATE OR REPLACE FUNCTION void_payment_group(p_group_id UUID, p_reason TEXT, p_user_id UUID)
  RETURNS VOID LANGUAGE plpgsql AS $$
  DECLARE
    v_group payment_groups;
    v_balance payment_group_balances;
    v_reason TEXT := payment_group_note(p_reason, 5);
    v_items_expected NUMERIC(14,2);
  BEGIN
    PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');${
      draftOk
        ? `
    -- A group pending approval can be voided (rejected) as a whole.
    PERFORM set_config('app.payment_group_draft_ok', 'on', true);
    v_group := payment_group_lock(p_group_id, NULL);
    PERFORM set_config('app.payment_group_draft_ok', '', true);`
        : `
    v_group := payment_group_lock(p_group_id, NULL);`
    }
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
`;

// ---- New functions -----------------------------------------------------------------------------
const UPDATE_PENDING = `
  CREATE FUNCTION update_pending_payment_group(
    p_group_id UUID, p_description TEXT, p_authorized_amount NUMERIC, p_items JSONB, p_note TEXT, p_user_id UUID
  ) RETURNS VOID LANGUAGE plpgsql AS $$
  DECLARE
    v_group payment_groups;
    v_description TEXT := payment_group_clean(p_description, 1000);
    v_before JSONB;
    v_after JSONB;
    v_before_count INT;
    v_changes TEXT := '';
  BEGIN
    PERFORM set_config('app.payment_group_draft_ok', 'on', true);
    v_group := payment_group_lock(p_group_id, NULL);
    PERFORM set_config('app.payment_group_draft_ok', '', true);
    IF NOT v_group.requires_approval THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_NOT_EDITABLE';
    END IF;
    IF v_group.status <> 'ABIERTO' THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_NOT_OPEN:%', v_group.status;
    END IF;
    -- The creator corrects their own group; anyone else needs an admin role.
    IF p_user_id IS DISTINCT FROM v_group.created_by THEN
      PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
    END IF;
    IF v_description IS NULL OR length(v_description) < 3 OR length(v_description) > 200 THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_DESCRIPTION_REQUIRED';
    END IF;
    IF p_authorized_amount IS NULL OR p_authorized_amount <= 0 OR round(p_authorized_amount, 2) <> p_authorized_amount THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_INVALID_AMOUNT';
    END IF;
    PERFORM payment_group_check_items(p_items, p_authorized_amount, true);
    -- A group that takes cash out keeps its reservation within the available cash.
    IF v_group.cash_direction = 'OUT' AND p_authorized_amount - v_group.authorized_amount > cash_available() THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_INSUFFICIENT_AVAILABLE:%', cash_available();
    END IF;

    SELECT count(*), jsonb_build_object('description', v_group.description, 'total', v_group.authorized_amount,
             'items', COALESCE(jsonb_agg(jsonb_build_object('number', item_number, 'creditNumber', credit_number,
               'reference', reference, 'expectedAmount', expected_amount, 'observation', observation) ORDER BY item_number), '[]'::jsonb))
    INTO v_before_count, v_before
    FROM payment_group_items WHERE group_id = p_group_id;
    SELECT jsonb_build_object('description', v_description, 'total', round(p_authorized_amount, 2),
             'items', jsonb_agg(jsonb_build_object('number', e.n,
               'creditNumber', payment_group_clean(e.value ->> 'creditNumber', 40),
               'reference', payment_group_clean(e.value ->> 'reference', 150),
               'expectedAmount', round((e.value ->> 'expectedAmount')::NUMERIC, 2),
               'observation', payment_group_clean(e.value ->> 'observation', 255)) ORDER BY e.n))
    INTO v_after
    FROM jsonb_array_elements(p_items) WITH ORDINALITY AS e(value, n);
    IF v_before = v_after THEN
      RETURN;
    END IF;

    IF v_description <> v_group.description THEN
      v_changes := v_changes || 'Nombre: ' || v_group.description || ' → ' || v_description || '. ';
    END IF;
    IF p_authorized_amount <> v_group.authorized_amount THEN
      v_changes := v_changes || 'Monto total: Q' || to_char(v_group.authorized_amount, 'FM999,999,990.00')
        || ' → Q' || to_char(p_authorized_amount, 'FM999,999,990.00') || '. ';
    END IF;
    IF jsonb_array_length(p_items) <> v_before_count THEN
      v_changes := v_changes || 'Cuotas: ' || v_before_count || ' → ' || jsonb_array_length(p_items) || '. ';
    END IF;
    IF v_before -> 'items' IS DISTINCT FROM v_after -> 'items' THEN
      v_changes := v_changes || 'Detalle de cuotas corregido. ';
    END IF;

    -- The draft rows are replaced (nothing was booked yet); the history keeps both versions.
    PERFORM set_config('app.payment_group_write', 'on', true);
    PERFORM set_config('app.payment_group_draft_delete', 'on', true);
    DELETE FROM payment_group_items WHERE group_id = p_group_id;
    PERFORM set_config('app.payment_group_draft_delete', '', true);
    INSERT INTO payment_group_items (group_id, item_number, expected_amount, reference, credit_number, observation, created_by)
    SELECT p_group_id, e.n, (e.value ->> 'expectedAmount')::NUMERIC,
           payment_group_clean(e.value ->> 'reference', 150), payment_group_clean(e.value ->> 'creditNumber', 40),
           payment_group_clean(e.value ->> 'observation', 255), p_user_id
    FROM jsonb_array_elements(p_items) WITH ORDINALITY AS e(value, n);
    UPDATE payment_groups SET description = v_description, authorized_amount = p_authorized_amount WHERE id = p_group_id;
    PERFORM set_config('app.payment_group_write', '', true);
    INSERT INTO payment_group_events (group_id, event_type, group_status, amount, note, details, created_by)
    VALUES (p_group_id, 'EDITADO', 'PENDIENTE_APROBACION', p_authorized_amount,
            left(v_changes || COALESCE(payment_group_note(p_note, 0), ''), 500),
            jsonb_build_object('before', v_before, 'after', v_after), p_user_id);
  END;
  $$
`;

const APPROVE = `
  CREATE FUNCTION approve_payment_group(
    p_group_id UUID, p_expected_amount NUMERIC, p_expected_count INT, p_user_id UUID, p_key TEXT
  ) RETURNS VOID LANGUAGE plpgsql AS $$
  DECLARE
    v_group payment_groups;
    v_count INT;
    v_sum NUMERIC(14,2);
    v_incomplete INT;
    v_item RECORD;
    v_paid NUMERIC(14,2);
  BEGIN
    IF p_key IS NULL OR length(btrim(p_key)) = 0 THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_IDEMPOTENCY_KEY_REQUIRED';
    END IF;
    PERFORM cash_custody_assert_role(p_user_id, 'cash_custody.authorize');
    PERFORM set_config('app.payment_group_draft_ok', 'on', true);
    v_group := payment_group_lock(p_group_id, NULL);
    IF NOT v_group.requires_approval THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_NOT_APPROVABLE';
    END IF;
    -- Idempotent: an approved group was booked once; a retry or a second approver changes nothing.
    IF v_group.status = 'CERRADO' THEN
      PERFORM set_config('app.payment_group_draft_ok', '', true);
      RETURN;
    END IF;
    IF v_group.status <> 'ABIERTO' THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_NOT_OPEN:%', v_group.status;
    END IF;
    SELECT count(*), COALESCE(SUM(expected_amount), 0),
           min(item_number) FILTER (WHERE credit_number IS NULL OR reference IS NULL)
    INTO v_count, v_sum, v_incomplete
    FROM payment_group_items WHERE group_id = p_group_id AND voided_at IS NULL;
    -- What the approver reviewed is what gets booked.
    IF p_expected_amount IS DISTINCT FROM v_group.authorized_amount OR p_expected_count IS DISTINCT FROM v_count THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_CHANGED';
    END IF;
    IF v_count = 0 THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_ITEMS_REQUIRED';
    END IF;
    IF v_incomplete IS NOT NULL THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_CUOTA_INCOMPLETE:%', v_incomplete;
    END IF;
    IF v_sum <> v_group.authorized_amount THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_TOTAL_MISMATCH:%', v_sum;
    END IF;

    -- Every cuota is booked as its own operation, all in this transaction (all or nothing).
    FOR v_item IN
      SELECT id, item_number, expected_amount FROM payment_group_items
      WHERE group_id = p_group_id AND voided_at IS NULL ORDER BY item_number
    LOOP
      PERFORM register_payment_group_delivery(p_group_id, v_item.id, v_item.expected_amount, NULL, p_user_id,
                                              left(p_key, 140) || ':' || v_item.item_number);
    END LOOP;
    PERFORM set_config('app.payment_group_draft_ok', '', true);

    SELECT paid_amount INTO v_paid FROM payment_group_balances WHERE id = p_group_id;
    PERFORM set_config('app.payment_group_write', 'on', true);
    UPDATE payment_groups
    SET status = 'CERRADO', closed_at = now(), closed_by = p_user_id, close_note = 'Aprobado',
        closing_paid = v_paid, closing_released = 0,
        closing_summary = jsonb_build_object('approved', true, 'authorized', v_group.authorized_amount,
          'paid', v_paid, 'items', v_count)
    WHERE id = p_group_id;
    PERFORM set_config('app.payment_group_write', '', true);
    INSERT INTO payment_group_events (group_id, event_type, group_status, amount, note, created_by)
    VALUES (p_group_id, 'APROBACION', 'APROBADO', v_paid,
            'Aprobado: ' || v_count || ' cuota(s) por Q' || to_char(v_paid, 'FM999,999,990.00') || ' contabilizadas.',
            p_user_id);
  END;
  $$
`;

// ---- Previous bodies (migration 1760009400000), restored by down -------------------------------
const WRITE_GUARD_OLD = `
  CREATE OR REPLACE FUNCTION payment_group_write_guard() RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    IF TG_OP = 'DELETE' OR COALESCE(current_setting('app.payment_group_write', true), '') <> 'on' THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_DIRECT_WRITE';
    END IF;
    RETURN NEW;
  END;
  $$
`;

const LOCK_OLD = `
  CREATE OR REPLACE FUNCTION payment_group_lock(p_group_id UUID, p_item_id UUID) RETURNS payment_groups
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
`;

const CREATE_OLD = `
  CREATE OR REPLACE FUNCTION create_payment_group(
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
`;

const EVENT_TYPES_OLD = `'CREADO', 'ENTREGA', 'SIN_PAGO', 'OBSERVACION', 'MONTO_CAMBIADO', 'RESOLUCION',
  'ANULACION', 'CIERRE', 'ANULACION_GRUPO'`;

export class PaymentGroupApproval1760009500000 implements MigrationInterface {
  name = 'PaymentGroupApproval1760009500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE payment_groups ADD COLUMN requires_approval BOOLEAN NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN payment_groups.requires_approval IS 'Génesis group: saved pending approval, approved (booked) as a whole by an admin.'`,
    );
    await queryRunner.query(`
      ALTER TABLE payment_group_items
        ADD COLUMN credit_number VARCHAR(40),
        ADD COLUMN observation VARCHAR(255),
        ADD CONSTRAINT "CHK_payment_group_items_credit" CHECK (credit_number IS NULL OR length(btrim(credit_number)) > 0)
    `);
    // Approval writes many events in one transaction: real time (not the transaction's start) keeps the
    // history in order — every cuota, then the approval.
    for (const table of ['payment_group_events', 'payment_group_deliveries']) {
      await queryRunner.query(
        `ALTER TABLE ${table} ALTER COLUMN created_at SET DEFAULT clock_timestamp()`,
      );
    }
    await queryRunner.query(`
      ALTER TABLE payment_group_events
        ADD COLUMN details JSONB,
        ALTER COLUMN group_status TYPE VARCHAR(20),
        DROP CONSTRAINT "CHK_payment_group_events_type",
        ADD CONSTRAINT "CHK_payment_group_events_type" CHECK (event_type IN (${EVENT_TYPES_OLD},
          'EDITADO', 'APROBACION'))
    `);
    await queryRunner.query(ITEM_VIEW(true));
    await queryRunner.query(GROUP_VIEW(true));
    await queryRunner.query(CLEAN);
    await queryRunner.query(CHECK_ITEMS);
    await queryRunner.query(WRITE_GUARD_NEW);
    await queryRunner.query(LOCK_NEW);
    await queryRunner.query(CREATE_NEW);
    await queryRunner.query(DELIVERY_BODY(true));
    await queryRunner.query(NOTE_BODY(true));
    await queryRunner.query(VOID_GROUP_BODY(true));
    await queryRunner.query(UPDATE_PENDING);
    await queryRunner.query(APPROVE);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP FUNCTION approve_payment_group(UUID, NUMERIC, INT, UUID, TEXT)`,
    );
    await queryRunner.query(
      `DROP FUNCTION update_pending_payment_group(UUID, TEXT, NUMERIC, JSONB, TEXT, UUID)`,
    );
    await queryRunner.query(VOID_GROUP_BODY(false));
    await queryRunner.query(NOTE_BODY(false));
    await queryRunner.query(DELIVERY_BODY(false));
    await queryRunner.query(CREATE_OLD);
    await queryRunner.query(LOCK_OLD);
    await queryRunner.query(WRITE_GUARD_OLD);
    await queryRunner.query(
      `DROP FUNCTION payment_group_check_items(JSONB, NUMERIC, BOOLEAN)`,
    );
    await queryRunner.query(`DROP FUNCTION payment_group_clean(TEXT, INT)`);
    // Views lose their appended columns (a view cannot drop columns in place). Run `down` only on a copy.
    await queryRunner.query(`DROP VIEW payment_group_balances`);
    await queryRunner.query(`DROP VIEW payment_group_item_balances`);
    await queryRunner.query(ITEM_VIEW(false));
    await queryRunner.query(GROUP_VIEW(false));
    await queryRunner.query(`
      ALTER TABLE payment_group_events
        DROP CONSTRAINT "CHK_payment_group_events_type",
        ADD CONSTRAINT "CHK_payment_group_events_type" CHECK (event_type IN (${EVENT_TYPES_OLD})),
        DROP COLUMN details
    `);
    await queryRunner.query(`
      ALTER TABLE payment_group_items
        DROP CONSTRAINT "CHK_payment_group_items_credit",
        DROP COLUMN observation,
        DROP COLUMN credit_number
    `);
    await queryRunner.query(
      `ALTER TABLE payment_groups DROP COLUMN requires_approval`,
    );
    for (const table of ['payment_group_events', 'payment_group_deliveries']) {
      await queryRunner.query(
        `ALTER TABLE ${table} ALTER COLUMN created_at SET DEFAULT now()`,
      );
    }
  }
}
