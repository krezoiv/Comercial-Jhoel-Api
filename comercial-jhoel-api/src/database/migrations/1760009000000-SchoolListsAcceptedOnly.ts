import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Caja de Listas counts only ACCEPTED lists and REAL payments (owner request,
 * 2026-11-21).
 *
 * Root cause: since migration 1760008400000 every list of the requirements
 * flow was born ACEPTADA when saved (not as a draft), so a quotation the
 * customer only took home was counted as sold and as owed. The cash itself
 * (Kardex of the Caja de Listas) always moved only with payments.
 *
 * New status semantics:
 * - Quotation, no money effect: BORRADOR, COTIZADA.
 * - Accepted, payments allowed, counted as sold and owed: ACEPTADA,
 *   ANTICIPO_RECIBIDO, PAGO_PARCIAL, PAGADA, EN_PREPARACION, TERMINADA,
 *   ENTREGADA (`school_quotation_status_accepted`).
 * - CANCELADA.
 *
 * What changes:
 * - `create_school_quotation`: a new list is COTIZADA. If it is saved WITH an
 *   advance, the customer accepted and paid, so it is born ACEPTADA (owner
 *   decision).
 * - `change_school_quotation_status`:
 *   - CONFIRMAR turns a draft into COTIZADA.
 *   - New ACEPTAR: COTIZADA → ACEPTADA. Its history keeps the accepted total.
 *   - PREPARAR / TERMINAR need an accepted list.
 * - `school_quotation_insert_payment` rejects ANTICIPO/ABONO on a list that is
 *   not accepted (`SCHOOL_QUOTE_NOT_ACCEPTED`), also through direct API calls.
 * - `school_quotation_refresh_status`:
 *   - COTIZADA is no longer payment-driven.
 *   - In the old confirmation flow ACEPTADA takes the place COTIZADA had
 *     (accepted, nothing paid), and payments move it to ANTICIPO_RECIBIDO /
 *     PAGO_PARCIAL / PAGADA as before.
 *   - An accepted list whose payments were all voided goes back to ACEPTADA,
 *     never to COTIZADA.
 * - New `revert_school_quotation_to_quote`, the controlled correction for
 *   lists that were auto-accepted before this migration (owner decision: one
 *   by one, nothing automatic):
 *   - ACEPTADA → COTIZADA, only with no payments and no preparation.
 *   - Requires a reason and `school_lists.quotations.revert` (managers).
 *   - Audited in `school_list_history`.
 *
 * No existing row is modified by this migration.
 */

async function liveDefinition(
  queryRunner: QueryRunner,
  fn: string,
): Promise<string> {
  const rows = (await queryRunner.query(
    `SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p
     WHERE p.proname = $1 AND p.pronamespace = 'public'::regnamespace`,
    [fn],
  )) as Array<{ def: string }>;
  if (rows.length !== 1) {
    throw new Error(`${fn}: expected exactly one definition`);
  }
  return rows[0].def;
}

function replaceOnce(
  def: string,
  fn: string,
  from: string,
  to: string,
): string {
  if (def.split(from).length !== 2) {
    throw new Error(`${fn}: anchor not found exactly once`);
  }
  return def.replace(from, to);
}

type Patches = Record<string, Array<[string, string]>>;

async function applyPatches(
  queryRunner: QueryRunner,
  patches: Patches,
  reverse = false,
): Promise<void> {
  for (const [fn, list] of Object.entries(patches)) {
    let def = await liveDefinition(queryRunner, fn);
    const ordered = reverse
      ? [...list].reverse().map(([from, to]) => [to, from] as [string, string])
      : list;
    for (const [from, to] of ordered) {
      def = replaceOnce(def, fn, from, to);
    }
    await queryRunner.query(def);
  }
}

const PATCHES: Patches = {
  create_school_quotation: [
    [
      `          PERFORM school_quotation_assert_requirements(p_payload->'items');
          IF NOT v_draft THEN
            UPDATE school_quotations SET status = 'ACEPTADA' WHERE id = v_id;
          END IF;`,
      `          PERFORM school_quotation_assert_requirements(p_payload->'items');`,
    ],
    [
      `        INSERT INTO school_list_history (entity_type, entity_id, action, to_status, details, created_by)
        VALUES ('QUOTATION', v_id, 'CREADA',`,
      `        -- A new list is a QUOTATION (no money effect). Saved WITH an advance the
        -- customer accepted and paid: it is born ACEPTADA (migration 1760009000000).
        IF NOT v_draft AND v_advance IS NOT NULL THEN
          UPDATE school_quotations SET status = 'ACEPTADA' WHERE id = v_id;
        END IF;

        INSERT INTO school_list_history (entity_type, entity_id, action, to_status, details, created_by)
        VALUES ('QUOTATION', v_id, 'CREADA',`,
    ],
  ],
  change_school_quotation_status: [
    [
      `          UPDATE school_quotations
             SET status = CASE WHEN v_q.fulfillment_mode = 'PREPARACION' THEN 'ACEPTADA' ELSE 'COTIZADA' END
           WHERE id = p_quotation_id;
          v_status := school_quotation_refresh_status(p_quotation_id);`,
      `          -- A finished draft is a quotation; the customer's decision is ACEPTAR.
          v_status := 'COTIZADA';
          UPDATE school_quotations SET status = v_status WHERE id = p_quotation_id;
        ELSIF p_action = 'ACEPTAR' AND v_q.status = 'COTIZADA' THEN
          -- The customer confirms the purchase: payments are enabled from now on.
          -- No money moves here (migration 1760009000000).
          v_status := 'ACEPTADA';
          UPDATE school_quotations SET status = v_status WHERE id = p_quotation_id;`,
    ],
    [
      `p_action = 'PREPARAR' AND v_q.status IN ('ACEPTADA','COTIZADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','PAGADA')`,
      `p_action = 'PREPARAR' AND v_q.status IN ('ACEPTADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','PAGADA')`,
    ],
    [
      `v_q.fulfillment_mode = 'CONFIRMACION' AND v_q.status IN ('COTIZADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','PAGADA','EN_PREPARACION')`,
      `v_q.fulfillment_mode = 'CONFIRMACION' AND v_q.status IN ('ACEPTADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','PAGADA','EN_PREPARACION')`,
    ],
    [
      `VALUES ('QUOTATION', p_quotation_id, p_action, v_q.status, v_status, '{}'::jsonb, p_user_id);`,
      `VALUES ('QUOTATION', p_quotation_id, p_action, v_q.status, v_status,
                CASE WHEN p_action = 'ACEPTAR' THEN jsonb_build_object('total', v_q.total) ELSE '{}'::jsonb END,
                p_user_id);`,
    ],
  ],
  school_quotation_refresh_status: [
    [
      `IF v_q.status IN ('BORRADOR','ACEPTADA','EN_PREPARACION','TERMINADA','ENTREGADA','CANCELADA') THEN`,
      `-- COTIZADA cannot receive payments (migration 1760009000000): not payment-driven.
        -- ACEPTADA is fixed in the requirements flow; in the old confirmation flow it is
        -- the accepted state with no payment yet, and payments move it as before.
        IF v_q.status IN ('BORRADOR','COTIZADA','EN_PREPARACION','TERMINADA','ENTREGADA','CANCELADA')
           OR (v_q.status = 'ACEPTADA' AND v_q.fulfillment_mode = 'PREPARACION') THEN`,
    ],
    [
      `        ELSIF v_paid = 0 THEN
          v_status := 'COTIZADA';`,
      `        ELSIF v_paid = 0 THEN
          -- An accepted list whose payments were all voided is still accepted.
          v_status := 'ACEPTADA';`,
    ],
  ],
  school_quotation_insert_payment: [
    [
      `        ELSIF v_q.status IN ('CANCELADA','ENTREGADA') THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_CLOSED:%', v_q.status;
        END IF;`,
      `        ELSIF v_q.status IN ('CANCELADA','ENTREGADA') THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_CLOSED:%', v_q.status;
        ELSIF NOT school_quotation_status_accepted(v_q.status) THEN
          -- A quotation is not money: the customer must accept it first.
          RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_ACCEPTED:%', v_q.status;
        END IF;`,
    ],
  ],
  school_list_assert_permission: [
    [
      `          WHEN 'school_lists.quotations.cancel' THEN ARRAY['SUPER_ADMIN','ADMIN','SUPERVISOR_DE_TURNO']`,
      `          WHEN 'school_lists.quotations.cancel' THEN ARRAY['SUPER_ADMIN','ADMIN','SUPERVISOR_DE_TURNO']
          WHEN 'school_lists.quotations.revert' THEN ARRAY['SUPER_ADMIN','ADMIN','SUPERVISOR_DE_TURNO']`,
    ],
  ],
};

export class SchoolListsAcceptedOnly1760009000000 implements MigrationInterface {
  name = 'SchoolListsAcceptedOnly1760009000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION school_quotation_status_accepted(p_status TEXT)
      RETURNS BOOLEAN LANGUAGE sql IMMUTABLE AS $$
        SELECT p_status IN ('ACEPTADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','PAGADA',
                            'EN_PREPARACION','TERMINADA','ENTREGADA')
      $$
    `);
    await queryRunner.query(`
      COMMENT ON FUNCTION school_quotation_status_accepted(TEXT) IS
        'Accepted school list: counted as sold and owed, may receive payments. BORRADOR/COTIZADA are quotations (no money), CANCELADA is closed.'
    `);
    await applyPatches(queryRunner, PATCHES);

    await queryRunner.query(`
      CREATE FUNCTION revert_school_quotation_to_quote(
        p_quotation_id UUID, p_reason TEXT, p_user_id UUID, p_expected_version INTEGER
      ) RETURNS TEXT
      LANGUAGE plpgsql AS $function$
      DECLARE
        v_q school_quotations%ROWTYPE;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.quotations.revert');
        IF p_reason IS NULL OR length(btrim(p_reason)) < 5 OR length(btrim(p_reason)) > 255 THEN
          RAISE EXCEPTION 'SCHOOL_REASON_REQUIRED';
        END IF;
        SELECT * INTO v_q FROM school_quotations WHERE id = p_quotation_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_FOUND';
        END IF;
        IF p_expected_version IS NOT NULL AND v_q.version <> p_expected_version THEN
          RAISE EXCEPTION 'SCHOOL_VERSION_CONFLICT';
        END IF;
        -- Only a list that is accepted on paper and nothing else happened to it.
        IF v_q.status <> 'ACEPTADA' THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_REVERT_NOT_ALLOWED:status';
        END IF;
        IF school_quotation_paid(p_quotation_id) <> 0
           OR EXISTS (SELECT 1 FROM school_quotation_payments
                      WHERE quotation_id = p_quotation_id AND status = 'APLICADO') THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_REVERT_NOT_ALLOWED:payments';
        END IF;
        IF EXISTS (SELECT 1 FROM school_quotation_item_assignments WHERE quotation_id = p_quotation_id) THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_REVERT_NOT_ALLOWED:preparation';
        END IF;

        UPDATE school_quotations
           SET status = 'COTIZADA', version = version + 1, updated_by = p_user_id, updated_at = now()
         WHERE id = p_quotation_id;
        INSERT INTO school_list_history (entity_type, entity_id, action, from_status, to_status, details, created_by)
        VALUES ('QUOTATION', p_quotation_id, 'DEVUELTA_COTIZACION', 'ACEPTADA', 'COTIZADA',
                jsonb_build_object('reason', btrim(p_reason), 'total', v_q.total), p_user_id);
        RETURN 'COTIZADA';
      END;
      $function$
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS revert_school_quotation_to_quote(UUID, TEXT, UUID, INTEGER)',
    );
    await applyPatches(queryRunner, PATCHES, true);
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS school_quotation_status_accepted(TEXT)',
    );
  }
}
