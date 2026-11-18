import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Listas Escolares — the list discounts inventory (decided with the owner):
 *  - Confirmed lists (any status but BORRADOR/CANCELADA) keep their inventory
 *    lines discounted from BODEGA (free-text lines have no stock to move).
 *  - Cancelling ("anular") returns exactly what was discounted.
 *  - Editing a saved list moves only the difference.
 *
 * `school_quotation_sync_inventory` is the single writer. It computes, per
 * product, target − already moved, where "already moved" is read from
 * `inventory_movements` (reference_type 'SCHOOL_LIST', reference_id = the
 * quotation). The movements are therefore both the audit trail and the
 * ledger: repeating a save, a retry or a second cancel finds delta 0 and
 * writes nothing, so stock can never be discounted or returned twice.
 * Products are locked in id order (same discipline as Ventas), stock is
 * validated under the lock and never goes negative.
 *
 * Patches (verified anchors) call the sync at the end of
 * create_school_quotation, update_school_quotation,
 * change_school_quotation_status (CONFIRMAR of a draft) and
 * cancel_school_quotation. Ventas, Compras and transfers are untouched.
 *
 * `down` restores the functions; it refuses while list movements exist,
 * because reverting would leave that stock discounted with no owner.
 */
const SYNC_CALL = (id: string, reason: string) =>
  `PERFORM school_quotation_sync_inventory(${id}, p_user_id, ${reason});`;

const PATCHES: Array<{ fn: string; from: string; to: string }> = [
  {
    fn: 'create_school_quotation',
    from: `IF v_advance IS NOT NULL THEN`,
    to: `${SYNC_CALL('v_id', 'NULL')}
        IF v_advance IS NOT NULL THEN`,
  },
  {
    fn: 'update_school_quotation',
    from: `RETURN p_quotation_id;`,
    to: `${SYNC_CALL('p_quotation_id', `'Edición de la lista escolar'`)}
        RETURN p_quotation_id;`,
  },
  {
    fn: 'change_school_quotation_status',
    from: `RETURN v_status;`,
    to: `${SYNC_CALL('p_quotation_id', 'NULL')}
        RETURN v_status;`,
  },
  {
    fn: 'cancel_school_quotation',
    from: `'refundId', v_refund), p_user_id);`,
    to: `'refundId', v_refund), p_user_id);
        ${SYNC_CALL('p_quotation_id', 'btrim(p_reason)')}`,
  },
];

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
  if (rows.length !== 1 || rows[0].def.split(from).length !== 2) {
    throw new Error(`${name}: anchor not found exactly once`);
  }
  await queryRunner.query(rows[0].def.replace(from, to));
}

export class SchoolListInventory1760008100000 implements MigrationInterface {
  name = 'SchoolListInventory1760008100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION school_quotation_sync_inventory(
        p_quotation_id UUID, p_user_id UUID, p_reason TEXT
      ) RETURNS INT
      LANGUAGE plpgsql AS $$
      DECLARE
        v_status TEXT;
        v_bodega UUID;
        v_row RECORD;
        v_presentation product_presentations;
        v_stock INT;
        v_name TEXT;
        v_moves INT := 0;
      BEGIN
        SELECT status INTO v_status FROM school_quotations WHERE id = p_quotation_id;
        SELECT id INTO v_bodega FROM inventory_locations WHERE name = 'Bodega';
        IF v_bodega IS NULL THEN
          RAISE EXCEPTION 'SCHOOL_LOCATION_NOT_FOUND';
        END IF;

        FOR v_row IN
          WITH target AS (
            SELECT product_id, SUM(quantity)::INT AS qty
              FROM school_quotation_items
             WHERE quotation_id = p_quotation_id AND product_id IS NOT NULL
               AND v_status NOT IN ('BORRADOR','CANCELADA')
             GROUP BY product_id
          ), moved AS (
            SELECT product_id,
                   SUM(CASE WHEN location_from_id IS NOT NULL THEN quantity_base_units
                            ELSE -quantity_base_units END)::INT AS qty
              FROM inventory_movements
             WHERE reference_type = 'SCHOOL_LIST' AND reference_id = p_quotation_id
             GROUP BY product_id
          )
          SELECT COALESCE(t.product_id, m.product_id) AS product_id,
                 COALESCE(t.qty, 0) - COALESCE(m.qty, 0) AS delta
            FROM target t FULL JOIN moved m ON m.product_id = t.product_id
           ORDER BY 1
        LOOP
          CONTINUE WHEN v_row.delta = 0;
          SELECT name INTO v_name FROM products WHERE id = v_row.product_id FOR UPDATE;
          v_presentation := ensure_product_presentation(v_row.product_id, NULL);
          PERFORM ensure_inventory_stock_row(v_row.product_id, v_bodega);
          SELECT quantity INTO v_stock FROM inventory_stock
           WHERE product_id = v_row.product_id AND location_id = v_bodega FOR UPDATE;
          IF v_row.delta > 0 AND v_stock < v_row.delta THEN
            -- The name goes last: it may itself contain ':'.
            RAISE EXCEPTION 'SCHOOL_INSUFFICIENT_STOCK:%:%:%', v_stock, v_row.delta, v_name;
          END IF;

          UPDATE products SET stock = stock - v_row.delta WHERE id = v_row.product_id;
          UPDATE inventory_stock SET quantity = quantity - v_row.delta, updated_at = now()
           WHERE product_id = v_row.product_id AND location_id = v_bodega;
          INSERT INTO inventory_movements
            (product_id, presentation_id, location_from_id, location_to_id, movement_type,
             quantity_presentation, conversion_factor, quantity_base_units,
             reference_type, reference_id, user_id, reason)
          VALUES
            (v_row.product_id, v_presentation.id,
             CASE WHEN v_row.delta > 0 THEN v_bodega END,
             CASE WHEN v_row.delta < 0 THEN v_bodega END,
             CASE WHEN v_row.delta > 0 THEN 'SALIDA_LISTA_ESCOLAR'
                  WHEN v_status = 'CANCELADA' THEN 'ENTRADA_ANULACION_LISTA'
                  ELSE 'ENTRADA_AJUSTE_LISTA' END,
             abs(v_row.delta), 1, abs(v_row.delta),
             'SCHOOL_LIST', p_quotation_id, p_user_id, p_reason);
          v_moves := v_moves + 1;
        END LOOP;
        RETURN v_moves;
      END;
      $$;
    `);
    for (const patch of PATCHES) {
      await patchFunction(queryRunner, patch.fn, patch.from, patch.to);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const [{ count }] = (await queryRunner.query(
      `SELECT count(*)::INT AS count FROM inventory_movements WHERE reference_type = 'SCHOOL_LIST'`,
    )) as { count: number }[];
    if (count > 0) {
      throw new Error(
        `Existen ${count} movimientos de inventario de listas escolares; revertir dejaría ese inventario descontado sin documento.`,
      );
    }
    for (const patch of [...PATCHES].reverse()) {
      await patchFunction(queryRunner, patch.fn, patch.to, patch.from);
    }
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS school_quotation_sync_inventory(UUID, UUID, TEXT)`,
    );
  }
}
