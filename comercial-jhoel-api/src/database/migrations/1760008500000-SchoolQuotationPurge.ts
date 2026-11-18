import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Listas Escolares — "Borrar todas las cotizaciones" (owner request,
 * 2026-11-18): a HARD delete, not a soft delete, run from the app.
 *
 * `purge_school_quotations(user, confirmation)`:
 *  - only SUPER_ADMIN (`school_lists.quotations.purge`) and only with the
 *    typed confirmation 'BORRAR TODO';
 *  - locks `school_quotations` (EXCLUSIVE: every list writer inserts, updates
 *    or locks a row there, so none can run until the purge commits);
 *  - returns to Bodega the net units every list still has discounted (read
 *    from its SCHOOL_LIST movements), so stock ends as if the lists had never
 *    existed;
 *  - deletes quotations, lines, assignments, payments/receipts, quotation
 *    history, supply allocations, dispatches and SCHOOL_LIST movements;
 *  - keeps templates and the LE-/RLE- numbering (owner decision);
 *  - leaves ONE audit row in `school_list_history` (entity_type 'PURGA') with
 *    who, when and what was deleted.
 *
 * The append-only guards stay in force everywhere else: they only let a
 * DELETE through while the transaction-local flag `cj.school_purge = 'on'`
 * is set, which this function sets and clears around its own deletes (same
 * discipline as `cj.allow_negative_stock`).
 */
const PURGE_BYPASS = `IF TG_OP = 'DELETE' AND COALESCE(current_setting('cj.school_purge', true), '') = 'on' THEN
          RETURN OLD; -- purge_school_quotations only
        END IF;
        `;

interface Patch {
  fn: string;
  from: string;
  to: string;
}

const PATCHES: Patch[] = [
  {
    fn: 'school_list_assert_permission',
    from: `WHEN 'school_lists.quotations.cancel' THEN`,
    to: `WHEN 'school_lists.quotations.purge'  THEN ARRAY['SUPER_ADMIN']
          WHEN 'school_lists.quotations.cancel' THEN`,
  },
  {
    fn: 'school_list_append_only_guard',
    from: `RAISE EXCEPTION 'SCHOOL_RECORD_IMMUTABLE:%', TG_TABLE_NAME;`,
    to: `${PURGE_BYPASS}RAISE EXCEPTION 'SCHOOL_RECORD_IMMUTABLE:%', TG_TABLE_NAME;`,
  },
  {
    fn: 'school_payment_guard',
    from: `IF TG_OP = 'DELETE' THEN`,
    to: `${PURGE_BYPASS}IF TG_OP = 'DELETE' THEN`,
  },
  {
    fn: 'school_supply_allocation_guard',
    from: `IF TG_OP = 'DELETE' OR OLD.status <> 'ASIGNADA'`,
    to: `${PURGE_BYPASS}IF TG_OP = 'DELETE' OR OLD.status <> 'ASIGNADA'`,
  },
  {
    fn: 'school_assignment_guard',
    from: `IF (SELECT status FROM school_quotations`,
    to: `${PURGE_BYPASS}IF (SELECT status FROM school_quotations`,
  },
];

async function patchFunction(
  queryRunner: QueryRunner,
  { fn, from, to }: Patch,
): Promise<void> {
  const rows = (await queryRunner.query(
    `SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p
     WHERE p.proname = $1 AND p.pronamespace = 'public'::regnamespace`,
    [fn],
  )) as Array<{ def: string }>;
  if (rows.length !== 1 || rows[0].def.split(from).length !== 2) {
    throw new Error(`${fn}: anchor not found exactly once`);
  }
  await queryRunner.query(rows[0].def.replace(from, to));
}

export class SchoolQuotationPurge1760008500000 implements MigrationInterface {
  name = 'SchoolQuotationPurge1760008500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE school_list_history DROP CONSTRAINT school_list_history_entity_type_check;
      ALTER TABLE school_list_history ADD CONSTRAINT school_list_history_entity_type_check
        CHECK (entity_type IN ('TEMPLATE','QUOTATION','PURGA'));
    `);
    for (const patch of PATCHES) {
      await patchFunction(queryRunner, patch);
    }
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION purge_school_quotations(p_user_id UUID, p_confirmation TEXT) RETURNS JSONB
      LANGUAGE plpgsql AS $$
      DECLARE
        v_bodega UUID;
        v_summary JSONB;
        v_products UUID[];
        v_units INT[];
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.quotations.purge');
        IF p_confirmation IS DISTINCT FROM 'BORRAR TODO' THEN
          RAISE EXCEPTION 'SCHOOL_PURGE_CONFIRMATION';
        END IF;
        -- No list can be created, edited, paid or prepared until this commits.
        LOCK TABLE school_quotations IN EXCLUSIVE MODE;
        SELECT id INTO v_bodega FROM inventory_locations WHERE name = 'Bodega';
        IF v_bodega IS NULL THEN
          RAISE EXCEPTION 'SCHOOL_LOCATION_NOT_FOUND';
        END IF;

        -- Net units each product still has discounted by school lists (Bodega only).
        SELECT COALESCE(array_agg(product_id ORDER BY product_id), '{}'), COALESCE(array_agg(units ORDER BY product_id), '{}')
          INTO v_products, v_units
          FROM (SELECT m.product_id,
                       SUM(CASE WHEN m.location_from_id = v_bodega THEN m.quantity_base_units
                                WHEN m.location_to_id = v_bodega THEN -m.quantity_base_units ELSE 0 END)::INT AS units
                  FROM inventory_movements m
                 WHERE m.reference_type = 'SCHOOL_LIST'
                 GROUP BY m.product_id) t
         WHERE units <> 0;

        SELECT jsonb_build_object(
                 'quotations', (SELECT count(*) FROM school_quotations),
                 'payments', (SELECT count(*) FROM school_quotation_payments),
                 'movements', (SELECT count(*) FROM inventory_movements WHERE reference_type = 'SCHOOL_LIST'),
                 'allocations', (SELECT count(*) FROM school_supply_allocations),
                 'dispatches', (SELECT count(*) FROM school_dispatches),
                 'returnedUnits', COALESCE((SELECT SUM(u) FROM unnest(v_units) u), 0),
                 'returned', COALESCE((SELECT jsonb_agg(jsonb_build_object('productId', r.product_id, 'product', p.name,
                                                                           'units', r.units) ORDER BY p.name)
                                         FROM unnest(v_products, v_units) AS r(product_id, units)
                                         JOIN products p ON p.id = r.product_id), '[]'::jsonb))
          INTO v_summary;

        -- Stock back to Bodega (product rows locked in id order, like every stock writer).
        PERFORM 1 FROM products WHERE id = ANY (v_products) ORDER BY id FOR UPDATE;
        UPDATE inventory_stock s SET quantity = s.quantity + r.units, updated_at = now()
          FROM unnest(v_products, v_units) AS r(product_id, units)
         WHERE s.product_id = r.product_id AND s.location_id = v_bodega;
        UPDATE products p SET stock = p.stock + r.units
          FROM unnest(v_products, v_units) AS r(product_id, units)
         WHERE p.id = r.product_id;

        PERFORM set_config('cj.school_purge', 'on', true);
        DELETE FROM school_supply_allocations;
        DELETE FROM school_dispatch_items;
        DELETE FROM school_dispatches;
        DELETE FROM school_quotation_item_assignments;
        DELETE FROM school_quotation_payments WHERE reversal_of_id IS NOT NULL; -- anulaciones first (self reference)
        DELETE FROM school_quotation_payments;
        DELETE FROM school_list_history WHERE entity_type = 'QUOTATION';
        DELETE FROM inventory_movements WHERE reference_type = 'SCHOOL_LIST';
        DELETE FROM school_quotation_items;
        DELETE FROM school_quotations;
        PERFORM set_config('cj.school_purge', '', true);

        IF (v_summary->>'quotations')::INT > 0 THEN
          INSERT INTO school_list_history (entity_type, entity_id, action, details, created_by)
          VALUES ('PURGA', gen_random_uuid(), 'BORRADO_TOTAL', v_summary, p_user_id);
        END IF;
        RETURN v_summary;
      END;
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS purge_school_quotations(UUID, TEXT)`,
    );
    for (const patch of [...PATCHES].reverse()) {
      await patchFunction(queryRunner, {
        fn: patch.fn,
        from: patch.to,
        to: patch.from,
      });
    }
    // The purge audit rows are append-only history: down keeps the CHECK when any exists.
    const [{ count }] = (await queryRunner.query(
      `SELECT count(*)::INT AS count FROM school_list_history WHERE entity_type = 'PURGA'`,
    )) as { count: number }[];
    if (count === 0) {
      await queryRunner.query(`
        ALTER TABLE school_list_history DROP CONSTRAINT school_list_history_entity_type_check;
        ALTER TABLE school_list_history ADD CONSTRAINT school_list_history_entity_type_check
          CHECK (entity_type IN ('TEMPLATE','QUOTATION'));
      `);
    }
  }
}
