import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Pagos grupales de Génesis: a cuota is only its amount plus an optional
 * observation (owner request, 2026-11-27). Credit number and client name are
 * no longer required to save or approve a group.
 *
 * Only the two rules change (`payment_group_check_items`,
 * `approve_payment_group`, same signatures): the declared count, the exact
 * sum, the pending state, the atomic and idempotent approval and every
 * financial effect stay as in 1760009500000. The `credit_number` / `reference`
 * columns are kept (nullable): rows already registered keep their data, and
 * Pago Varios still uses `reference` for its beneficiary.
 */
const CHECK_ITEMS_NEW = `
  CREATE OR REPLACE FUNCTION payment_group_check_items(p_items JSONB, p_authorized NUMERIC, p_exact BOOLEAN)
  RETURNS NUMERIC LANGUAGE plpgsql IMMUTABLE AS $$
  DECLARE
    v_sum NUMERIC(14,2);
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
    -- Génesis cuotas (1760009600000): only the amount is required; credit number, client and
    -- observation are optional (the owner registers amount + an optional observation).
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

const APPROVE_NEW = `
  CREATE OR REPLACE FUNCTION approve_payment_group(
    p_group_id UUID, p_expected_amount NUMERIC, p_expected_count INT, p_user_id UUID, p_key TEXT
  ) RETURNS VOID LANGUAGE plpgsql AS $$
  DECLARE
    v_group payment_groups;
    v_count INT;
    v_sum NUMERIC(14,2);
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
    SELECT count(*), COALESCE(SUM(expected_amount), 0)
    INTO v_count, v_sum
    FROM payment_group_items WHERE group_id = p_group_id AND voided_at IS NULL;
    -- What the approver reviewed is what gets booked.
    IF p_expected_amount IS DISTINCT FROM v_group.authorized_amount OR p_expected_count IS DISTINCT FROM v_count THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_CHANGED';
    END IF;
    IF v_count = 0 THEN
      RAISE EXCEPTION 'PAYMENT_GROUP_ITEMS_REQUIRED';
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

// Bodies of 1760009500000, restored by down.
const CHECK_ITEMS_OLD = `
  CREATE OR REPLACE FUNCTION payment_group_check_items(p_items JSONB, p_authorized NUMERIC, p_exact BOOLEAN)
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

const APPROVE_OLD = `
  CREATE OR REPLACE FUNCTION approve_payment_group(
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

export class PaymentGroupCuotaAmountOnly1760009600000 implements MigrationInterface {
  name = 'PaymentGroupCuotaAmountOnly1760009600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(CHECK_ITEMS_NEW);
    await queryRunner.query(APPROVE_NEW);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(APPROVE_OLD);
    await queryRunner.query(CHECK_ITEMS_OLD);
  }
}
