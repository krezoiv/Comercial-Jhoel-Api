import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Listas Escolares — delete ONE quotation (owner request, 2026-11-18): the
 * same HARD delete as "Borrar todas las cotizaciones" (migration
 * 1760008500000), restricted to the chosen list.
 *
 * `delete_school_quotation(quotation, user, confirmation)`:
 *  - only SUPER_ADMIN (`school_lists.quotations.delete`), and the user must
 *    type the quotation number (e.g. "LE-000193") to confirm;
 *  - locks the quotation row (every list writer locks it) and the product
 *    rows it touches, in id order;
 *  - returns to Bodega the net units that list still has discounted;
 *  - deletes its lines, assignments, payments/receipts, history, supply
 *    allocations, dispatch and SCHOOL_LIST movements, then the quotation;
 *  - units it had reserved become free again and, in automatic mode, are
 *    handed FIFO to the next pending lists (same rule as an annulment);
 *  - keeps one audit row (`school_list_history.entity_type = 'PURGA'`,
 *    action BORRADO_COTIZACION) with who, when and what was deleted.
 *
 * Deletes pass the append-only guards only through the transaction-local
 * flag `cj.school_purge`, set and cleared here.
 */
const PERMISSION_FROM = `WHEN 'school_lists.quotations.purge'  THEN ARRAY['SUPER_ADMIN']`;
const PERMISSION_TO = `WHEN 'school_lists.quotations.delete' THEN ARRAY['SUPER_ADMIN']
          ${PERMISSION_FROM}`;

async function patchPermission(
  queryRunner: QueryRunner,
  from: string,
  to: string,
): Promise<void> {
  const rows = (await queryRunner.query(
    `SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p
     WHERE p.proname = 'school_list_assert_permission' AND p.pronamespace = 'public'::regnamespace`,
  )) as Array<{ def: string }>;
  if (rows.length !== 1 || rows[0].def.split(from).length !== 2) {
    throw new Error(
      'school_list_assert_permission: anchor not found exactly once',
    );
  }
  await queryRunner.query(rows[0].def.replace(from, to));
}

export class SchoolQuotationDelete1760008600000 implements MigrationInterface {
  name = 'SchoolQuotationDelete1760008600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await patchPermission(queryRunner, PERMISSION_FROM, PERMISSION_TO);
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION delete_school_quotation(
        p_quotation_id UUID, p_user_id UUID, p_confirmation TEXT
      ) RETURNS JSONB
      LANGUAGE plpgsql AS $$
      DECLARE
        v_q school_quotations%ROWTYPE;
        v_bodega UUID;
        v_products UUID[];
        v_units INT[];
        v_touched UUID[];
        v_product UUID;
        v_summary JSONB;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.quotations.delete');
        SELECT * INTO v_q FROM school_quotations WHERE id = p_quotation_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_FOUND';
        END IF;
        IF btrim(COALESCE(p_confirmation, '')) IS DISTINCT FROM v_q.quotation_number THEN
          RAISE EXCEPTION 'SCHOOL_DELETE_CONFIRMATION:%', v_q.quotation_number;
        END IF;
        SELECT id INTO v_bodega FROM inventory_locations WHERE name = 'Bodega';
        IF v_bodega IS NULL THEN
          RAISE EXCEPTION 'SCHOOL_LOCATION_NOT_FOUND';
        END IF;

        -- Net units this list still has discounted, per product (Bodega only).
        SELECT COALESCE(array_agg(product_id ORDER BY product_id), '{}'), COALESCE(array_agg(units ORDER BY product_id), '{}')
          INTO v_products, v_units
          FROM (SELECT m.product_id,
                       SUM(CASE WHEN m.location_from_id = v_bodega THEN m.quantity_base_units
                                WHEN m.location_to_id = v_bodega THEN -m.quantity_base_units ELSE 0 END)::INT AS units
                  FROM inventory_movements m
                 WHERE m.reference_type = 'SCHOOL_LIST' AND m.reference_id = p_quotation_id
                 GROUP BY m.product_id) t
         WHERE units <> 0;
        -- Products whose free units may change (returned stock or released reservations).
        SELECT COALESCE(array_agg(DISTINCT product_id ORDER BY product_id), '{}') INTO v_touched
          FROM (SELECT unnest(v_products) AS product_id
                UNION SELECT product_id FROM school_supply_allocations
                       WHERE quotation_id = p_quotation_id AND status = 'ASIGNADA') t;

        SELECT jsonb_build_object(
                 'quotationNumber', v_q.quotation_number,
                 'customerName', v_q.customer_name,
                 'quotations', 1,
                 'payments', (SELECT count(*) FROM school_quotation_payments WHERE quotation_id = p_quotation_id),
                 'paid', school_quotation_paid(p_quotation_id),
                 'movements', (SELECT count(*) FROM inventory_movements
                                WHERE reference_type = 'SCHOOL_LIST' AND reference_id = p_quotation_id),
                 'allocations', (SELECT count(*) FROM school_supply_allocations WHERE quotation_id = p_quotation_id),
                 'dispatches', (SELECT count(*) FROM school_dispatches WHERE quotation_id = p_quotation_id),
                 'returnedUnits', COALESCE((SELECT SUM(u) FROM unnest(v_units) u), 0),
                 'returned', COALESCE((SELECT jsonb_agg(jsonb_build_object('productId', r.product_id, 'product', p.name,
                                                                           'units', r.units) ORDER BY p.name)
                                         FROM unnest(v_products, v_units) AS r(product_id, units)
                                         JOIN products p ON p.id = r.product_id), '[]'::jsonb))
          INTO v_summary;

        PERFORM 1 FROM products WHERE id = ANY (v_touched) ORDER BY id FOR UPDATE;
        UPDATE inventory_stock s SET quantity = s.quantity + r.units, updated_at = now()
          FROM unnest(v_products, v_units) AS r(product_id, units)
         WHERE s.product_id = r.product_id AND s.location_id = v_bodega;
        UPDATE products p SET stock = p.stock + r.units
          FROM unnest(v_products, v_units) AS r(product_id, units)
         WHERE p.id = r.product_id;

        PERFORM set_config('cj.school_purge', 'on', true);
        DELETE FROM school_supply_allocations WHERE quotation_id = p_quotation_id;
        DELETE FROM school_dispatch_items
         WHERE dispatch_id IN (SELECT id FROM school_dispatches WHERE quotation_id = p_quotation_id);
        DELETE FROM school_dispatches WHERE quotation_id = p_quotation_id;
        DELETE FROM school_quotation_item_assignments WHERE quotation_id = p_quotation_id;
        DELETE FROM school_quotation_payments WHERE quotation_id = p_quotation_id AND reversal_of_id IS NOT NULL;
        DELETE FROM school_quotation_payments WHERE quotation_id = p_quotation_id;
        DELETE FROM school_list_history WHERE entity_type = 'QUOTATION' AND entity_id = p_quotation_id;
        DELETE FROM inventory_movements WHERE reference_type = 'SCHOOL_LIST' AND reference_id = p_quotation_id;
        DELETE FROM school_quotation_items WHERE quotation_id = p_quotation_id;
        DELETE FROM school_quotations WHERE id = p_quotation_id;
        PERFORM set_config('cj.school_purge', '', true);

        -- Released units go to the next pending lists, as when a list is annulled.
        IF (SELECT allocation_mode FROM school_supply_settings WHERE id = 1) = 'FIFO_AUTO' THEN
          FOREACH v_product IN ARRAY v_touched LOOP
            PERFORM school_supply_allocate_fifo(v_product, p_user_id, NULL, 'AUTO');
          END LOOP;
        END IF;

        INSERT INTO school_list_history (entity_type, entity_id, action, from_status, details, created_by)
        VALUES ('PURGA', p_quotation_id, 'BORRADO_COTIZACION', v_q.status, v_summary, p_user_id);
        RETURN v_summary;
      END;
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS delete_school_quotation(UUID, UUID, TEXT)`,
    );
    await patchPermission(queryRunner, PERMISSION_TO, PERMISSION_FROM);
  }
}
