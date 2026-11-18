import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Listas Escolares — requirements vs. inventory products (owner decisions,
 * 2026-11-18):
 *
 *  - A template line and a quotation line are a SCHOOL REQUIREMENT: the text
 *    the school asks for, its quantity and the price quoted to the customer.
 *    They no longer depend on inventory (`product_id` stays NULL on new
 *    lists; the column is kept for the lists already saved).
 *  - New lists are born ACEPTADA (a draft, when confirmed, too). ACEPTADA is
 *    a workflow state: payments do not change it (like EN_PREPARACION).
 *  - ACEPTADA → (PREPARAR) EN_PREPARACION: each requirement is fulfilled by
 *    one or more inventory products (`school_quotation_item_assignments`,
 *    quantities may be split). Saving or changing assignments moves NO stock
 *    and never touches the quoted price or the requirement text.
 *  - EN_PREPARACION → (TERMINAR, "Finalizar preparación") TERMINADA: every
 *    requirement must be exactly covered; Bodega is discounted ONCE through
 *    `school_quotation_sync_inventory` (ledger = inventory_movements of the
 *    list, so retries move nothing) and it is BLOCKED when Bodega lacks
 *    stock (no negative stock for these lists).
 *  - Dispatch (ENTREGADA) requires TERMINADA and moves no stock; annulment
 *    returns exactly what was discounted (unchanged ledger rule).
 *
 * Lists saved before this migration keep `fulfillment_mode = 'CONFIRMACION'`
 * and their behavior (discount at confirmation, FIFO supply) unchanged.
 *
 * Live functions are patched on verified anchors (each must occur the
 * expected number of times); `down` restores them and refuses while any list
 * uses the new flow.
 */
interface Patch {
  fn: string;
  from: string;
  to: string;
  /** How many times `from` must occur in the live definition (default 1). */
  times?: number;
}

const NAME_LENGTH_FROM = `IF length(v_name) < 2 OR length(v_name) > 150 THEN`;
const NAME_LENGTH_TO = `IF length(v_name) < 2 OR length(v_name) > 300 THEN`;

const PATCHES: Patch[] = [
  // ── Longer requirement descriptions (150 → 300 characters) ─────────────
  {
    fn: 'school_list_template_insert_items',
    from: NAME_LENGTH_FROM,
    to: NAME_LENGTH_TO,
  },
  {
    fn: 'school_quotation_insert_items',
    from: NAME_LENGTH_FROM,
    to: NAME_LENGTH_TO,
  },
  // A template line still linked to a product (configured before this change)
  // may be copied as a plain requirement (no productId).
  {
    fn: 'school_quotation_insert_items',
    from: `IF NOT FOUND OR v_tpl.product_id IS DISTINCT FROM v_product THEN`,
    to: `IF NOT FOUND OR (v_product IS NOT NULL AND v_tpl.product_id IS DISTINCT FROM v_product) THEN`,
  },

  // ── ACEPTADA is a fixed workflow state (payments do not change it) ──────
  {
    fn: 'school_quotation_refresh_status',
    from: `IF v_q.status IN ('BORRADOR','EN_PREPARACION','TERMINADA','ENTREGADA','CANCELADA') THEN`,
    to: `IF v_q.status IN ('BORRADOR','ACEPTADA','EN_PREPARACION','TERMINADA','ENTREGADA','CANCELADA') THEN`,
  },

  // ── New lists: requirements only, born ACEPTADA ─────────────────────────
  {
    fn: 'create_school_quotation',
    from: `v_can_override := school_list_has_permission(p_user_id, 'school_lists.prices.override');`,
    to: `IF (SELECT fulfillment_mode FROM school_quotations WHERE id = v_id) = 'PREPARACION' THEN
          -- Requirements never reference inventory: products are chosen in preparation.
          PERFORM school_quotation_assert_requirements(p_payload->'items');
          IF NOT v_draft THEN
            UPDATE school_quotations SET status = 'ACEPTADA' WHERE id = v_id;
          END IF;
        END IF;
        v_can_override := school_list_has_permission(p_user_id, 'school_lists.prices.override');`,
  },
  {
    fn: 'create_school_quotation',
    from: `'CREADA', CASE WHEN v_draft THEN 'BORRADOR' ELSE 'COTIZADA' END,`,
    to: `'CREADA', (SELECT status FROM school_quotations WHERE id = v_id),`,
  },

  // ── Editing a list of the new flow ──────────────────────────────────────
  {
    fn: 'update_school_quotation',
    from: `PERFORM school_quotation_assert_customer(p_payload);`,
    to: `PERFORM school_quotation_assert_customer(p_payload);
        IF v_q.fulfillment_mode = 'PREPARACION' THEN
          -- Finished lists already took their stock: the requirements are frozen.
          IF v_q.status = 'TERMINADA' THEN
            RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_EDITABLE:%', v_q.status;
          END IF;
          PERFORM school_quotation_assert_requirements(p_payload->'items');
        END IF;`,
  },
  // Lines are re-inserted with new ids: assignments follow their requirement
  // (payload itemId → new line at the same position); assignments of removed
  // requirements are dropped (the FK is checked at commit).
  {
    fn: 'update_school_quotation',
    from: `v_paid := school_quotation_paid(p_quotation_id);`,
    to: `UPDATE school_quotation_item_assignments a SET item_id = n.id
           FROM jsonb_array_elements(p_payload->'items') WITH ORDINALITY e(item, ord)
           JOIN school_quotation_items n ON n.quotation_id = p_quotation_id AND n.line_no = e.ord
          WHERE a.quotation_id = p_quotation_id AND a.item_id::TEXT = e.item->>'itemId';
        DELETE FROM school_quotation_item_assignments a
         WHERE a.quotation_id = p_quotation_id
           AND NOT EXISTS (SELECT 1 FROM school_quotation_items i WHERE i.id = a.item_id);
        v_paid := school_quotation_paid(p_quotation_id);`,
  },

  // ── Workflow ────────────────────────────────────────────────────────────
  {
    fn: 'change_school_quotation_status',
    from: `UPDATE school_quotations SET status = 'COTIZADA' WHERE id = p_quotation_id;`,
    to: `UPDATE school_quotations
             SET status = CASE WHEN v_q.fulfillment_mode = 'PREPARACION' THEN 'ACEPTADA' ELSE 'COTIZADA' END
           WHERE id = p_quotation_id;`,
  },
  {
    fn: 'change_school_quotation_status',
    from: `ELSIF p_action = 'PREPARAR' AND v_q.status IN ('COTIZADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','PAGADA') THEN`,
    to: `ELSIF p_action = 'PREPARAR' AND v_q.status IN ('ACEPTADA','COTIZADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','PAGADA') THEN`,
  },
  {
    fn: 'change_school_quotation_status',
    from: `ELSIF p_action = 'TERMINAR' AND v_q.status IN ('COTIZADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','PAGADA','EN_PREPARACION') THEN`,
    to: `ELSIF p_action = 'TERMINAR' AND v_q.fulfillment_mode = 'PREPARACION' AND v_q.status = 'EN_PREPARACION' THEN
          -- "Finalizar preparación": every requirement exactly covered; the sync at the
          -- end of this function discounts the assigned products from Bodega once.
          PERFORM school_quotation_assert_prepared(p_quotation_id);
          v_status := 'TERMINADA';
          UPDATE school_quotations SET status = v_status, finished_at = now(), finished_by = p_user_id
           WHERE id = p_quotation_id;
        ELSIF p_action = 'TERMINAR' AND v_q.fulfillment_mode = 'CONFIRMACION' AND v_q.status IN ('COTIZADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','PAGADA','EN_PREPARACION') THEN`,
  },

  // ── Inventory sync: new lists discount their assignments once finished ──
  {
    fn: 'school_quotation_sync_inventory',
    from: `v_status TEXT;`,
    to: `v_status TEXT;
        v_mode TEXT;
        v_stock INT;
        v_name TEXT;`,
  },
  {
    fn: 'school_quotation_sync_inventory',
    from: `SELECT status INTO v_status FROM school_quotations WHERE id = p_quotation_id;`,
    to: `SELECT status, fulfillment_mode INTO v_status, v_mode FROM school_quotations WHERE id = p_quotation_id;`,
  },
  {
    fn: 'school_quotation_sync_inventory',
    from: `WHERE quotation_id = p_quotation_id AND product_id IS NOT NULL`,
    to: `WHERE quotation_id = p_quotation_id AND product_id IS NOT NULL AND v_mode = 'CONFIRMACION'`,
  },
  {
    fn: 'school_quotation_sync_inventory',
    from: `), moved AS (`,
    to: `UNION ALL
            -- New flow: the products assigned in preparation, once the preparation is finished.
            SELECT product_id, SUM(quantity)::INT FROM school_quotation_item_assignments
             WHERE quotation_id = p_quotation_id AND v_mode = 'PREPARACION'
               AND v_status IN ('TERMINADA','ENTREGADA')
             GROUP BY product_id
          ), moved AS (`,
  },
  {
    fn: 'school_quotation_sync_inventory',
    from: `UPDATE products SET stock = stock - v_row.delta WHERE id = v_row.product_id;`,
    to: `IF v_mode = 'PREPARACION' AND v_row.delta > 0 THEN
            -- New lists never take Bodega below zero (checked under the row lock).
            SELECT s.quantity, p.name INTO v_stock, v_name
              FROM inventory_stock s JOIN products p ON p.id = s.product_id
             WHERE s.product_id = v_row.product_id AND s.location_id = v_bodega;
            IF v_stock < v_row.delta THEN
              RAISE EXCEPTION 'SCHOOL_INSUFFICIENT_STOCK:%:%:%', v_stock, v_row.delta, v_name;
            END IF;
          END IF;
          UPDATE products SET stock = stock - v_row.delta WHERE id = v_row.product_id;`,
  },

  // ── Supply (FIFO allocation) stays for the lists of the previous flow ───
  {
    fn: 'school_quotation_supply_status',
    from: `IF v_status IN ('BORRADOR','CANCELADA','ENTREGADA') THEN`,
    to: `IF v_status IN ('BORRADOR','CANCELADA','ENTREGADA')
           OR (SELECT fulfillment_mode FROM school_quotations WHERE id = p_quotation_id) = 'PREPARACION' THEN`,
  },

  // ── Dispatch of a new list: only once its preparation is finished ──────
  {
    fn: 'dispatch_school_quotation',
    from: `-- A fully paid list is PAGADA, EN_PREPARACION or TERMINADA; anything else owes money.`,
    to: `IF v_q.fulfillment_mode = 'PREPARACION' AND v_q.status <> 'TERMINADA' THEN
          RAISE EXCEPTION 'SCHOOL_PREPARATION_NOT_FINISHED';
        END IF;
        -- A fully paid list is PAGADA, EN_PREPARACION or TERMINADA; anything else owes money.`,
  },
  {
    fn: 'dispatch_school_quotation',
    from: `SELECT v_id, product_id, product_name, quantity, quantity, quantity, product_id IS NOT NULL`,
    to: `SELECT v_id, product_id, product_name, quantity, quantity, quantity,
               product_id IS NOT NULL
               OR EXISTS (SELECT 1 FROM school_quotation_item_assignments a WHERE a.item_id = school_quotation_items.id)`,
  },
];

const COMMITMENTS_VIEW = (filter: string) => `
  CREATE OR REPLACE VIEW school_supply_commitments AS
  SELECT q.id AS quotation_id, q.quotation_number, q.confirmed_at, q.created_at, i.product_id,
         SUM(i.quantity)::INT AS committed,
         COALESCE((SELECT SUM(a.quantity) FROM school_supply_allocations a
                    WHERE a.quotation_id = q.id AND a.product_id = i.product_id AND a.status = 'ASIGNADA'), 0)::INT AS allocated,
         (SUM(i.quantity) - COALESCE((SELECT SUM(a.quantity) FROM school_supply_allocations a
                    WHERE a.quotation_id = q.id AND a.product_id = i.product_id AND a.status = 'ASIGNADA'), 0))::INT AS pending
    FROM school_quotations q
    JOIN school_quotation_items i ON i.quotation_id = q.id
   WHERE i.product_id IS NOT NULL AND q.status NOT IN ('BORRADOR','CANCELADA','ENTREGADA')${filter}
   GROUP BY q.id, q.quotation_number, q.confirmed_at, q.created_at, i.product_id`;

const STATUSES = `'BORRADOR','COTIZADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','PAGADA','EN_PREPARACION','TERMINADA','ENTREGADA','CANCELADA'`;

async function patchFunction(
  queryRunner: QueryRunner,
  { fn, from, to, times = 1 }: Patch,
): Promise<void> {
  const rows = (await queryRunner.query(
    `SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p
     WHERE p.proname = $1 AND p.pronamespace = 'public'::regnamespace`,
    [fn],
  )) as Array<{ def: string }>;
  if (rows.length !== 1 || rows[0].def.split(from).length !== times + 1) {
    throw new Error(`${fn}: anchor not found exactly ${times} time(s)`);
  }
  await queryRunner.query(rows[0].def.split(from).join(to));
}

export class SchoolListRequirements1760008400000 implements MigrationInterface {
  name = 'SchoolListRequirements1760008400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Columns and status ────────────────────────────────────────────────
    await queryRunner.query(`
      -- Existing lists keep the previous flow; every new list uses preparation.
      ALTER TABLE school_quotations
        ADD COLUMN fulfillment_mode VARCHAR(12) NOT NULL DEFAULT 'CONFIRMACION'
          CHECK (fulfillment_mode IN ('CONFIRMACION','PREPARACION'));
      ALTER TABLE school_quotations ALTER COLUMN fulfillment_mode SET DEFAULT 'PREPARACION';

      ALTER TABLE school_quotations DROP CONSTRAINT school_quotations_status_check;
      ALTER TABLE school_quotations ADD CONSTRAINT school_quotations_status_check
        CHECK (status IN (${STATUSES},'ACEPTADA'));

      ALTER TABLE school_list_template_items ALTER COLUMN product_name TYPE VARCHAR(300);
      ALTER TABLE school_quotation_items ALTER COLUMN product_name TYPE VARCHAR(300);
      ALTER TABLE school_dispatch_items ALTER COLUMN product_name TYPE VARCHAR(300);
    `);

    // ── Assignments: which inventory products fulfil each requirement ─────
    await queryRunner.query(`
      CREATE TABLE school_quotation_item_assignments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quotation_id UUID NOT NULL REFERENCES school_quotations(id) ON DELETE RESTRICT,
        -- Checked at commit: an edit re-inserts the lines and re-points the assignments.
        item_id UUID NOT NULL REFERENCES school_quotation_items(id) DEFERRABLE INITIALLY DEFERRED,
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        quantity INT NOT NULL CHECK (quantity BETWEEN 1 AND 9999),
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        updated_at TIMESTAMPTZ,
        CONSTRAINT "UQ_school_assignments_item_product" UNIQUE (item_id, product_id)
      );
      CREATE INDEX "IDX_school_assignments_quotation" ON school_quotation_item_assignments (quotation_id);

      -- Assignments change only while the list is being prepared.
      CREATE OR REPLACE FUNCTION school_assignment_guard() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      BEGIN
        IF (SELECT status FROM school_quotations
             WHERE id = CASE WHEN TG_OP = 'DELETE' THEN OLD.quotation_id ELSE NEW.quotation_id END)
           <> 'EN_PREPARACION' THEN
          RAISE EXCEPTION 'SCHOOL_RECORD_IMMUTABLE:%', TG_TABLE_NAME;
        END IF;
        RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
      END;
      $$;
      CREATE TRIGGER trg_school_assignments_guard BEFORE INSERT OR UPDATE OR DELETE ON school_quotation_item_assignments
        FOR EACH ROW EXECUTE FUNCTION school_assignment_guard();
    `);

    // ── Rules ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      -- Requirement lines are free text: no inventory product may be attached.
      CREATE OR REPLACE FUNCTION school_quotation_assert_requirements(p_items JSONB) RETURNS VOID
      LANGUAGE plpgsql IMMUTABLE AS $$
      BEGIN
        IF jsonb_typeof(p_items) = 'array' AND EXISTS (
             SELECT 1 FROM jsonb_array_elements(p_items) e
              WHERE NULLIF(e.value->>'productId', '') IS NOT NULL) THEN
          RAISE EXCEPTION 'SCHOOL_REQUIREMENT_WITH_PRODUCT';
        END IF;
      END;
      $$;

      -- Every requirement exactly covered by its assigned products.
      CREATE OR REPLACE FUNCTION school_quotation_assert_prepared(p_quotation_id UUID) RETURNS VOID
      LANGUAGE plpgsql STABLE AS $$
      DECLARE
        v_line RECORD;
      BEGIN
        SELECT i.product_name, i.quantity, COALESCE(SUM(a.quantity), 0)::INT AS assigned INTO v_line
          FROM school_quotation_items i
          LEFT JOIN school_quotation_item_assignments a ON a.item_id = i.id
         WHERE i.quotation_id = p_quotation_id
         GROUP BY i.id, i.line_no, i.product_name, i.quantity
        HAVING COALESCE(SUM(a.quantity), 0) <> i.quantity
         ORDER BY i.line_no LIMIT 1;
        IF FOUND THEN
          -- The name goes last: it may itself contain ':'.
          RAISE EXCEPTION 'SCHOOL_PREPARATION_INCOMPLETE:%:%:%', v_line.assigned, v_line.quantity, v_line.product_name;
        END IF;
      END;
      $$;

      -- "Guardar preparación": replaces the assignments of a list being prepared.
      -- p_assignments: [{ itemId, productId, quantity }]. Moves no stock and never
      -- changes the requirement, its quantity or its quoted price.
      CREATE OR REPLACE FUNCTION save_school_quotation_preparation(
        p_quotation_id UUID, p_assignments JSONB, p_user_id UUID, p_expected_version INT
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_q school_quotations%ROWTYPE;
        v_item JSONB;
        v_qty NUMERIC;
        v_line RECORD;
        v_product RECORD;
        v_before JSONB;
        v_after JSONB;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.quotations.edit');
        SELECT * INTO v_q FROM school_quotations WHERE id = p_quotation_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_FOUND';
        END IF;
        IF v_q.fulfillment_mode <> 'PREPARACION' THEN
          RAISE EXCEPTION 'SCHOOL_PREPARATION_NOT_APPLICABLE';
        END IF;
        IF v_q.status <> 'EN_PREPARACION' THEN
          RAISE EXCEPTION 'SCHOOL_PREPARATION_NOT_OPEN:%', v_q.status;
        END IF;
        IF p_expected_version IS NULL OR v_q.version <> p_expected_version THEN
          RAISE EXCEPTION 'SCHOOL_VERSION_CONFLICT';
        END IF;
        IF p_assignments IS NULL OR jsonb_typeof(p_assignments) <> 'array'
           OR jsonb_array_length(p_assignments) > 1000 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_ASSIGNMENTS';
        END IF;

        FOR v_item IN SELECT value FROM jsonb_array_elements(p_assignments) LOOP
          SELECT id, product_name, quantity INTO v_line FROM school_quotation_items
           WHERE id = NULLIF(v_item->>'itemId', '')::UUID AND quotation_id = p_quotation_id;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'SCHOOL_INVALID_ASSIGNMENTS';
          END IF;
          v_qty := (v_item->>'quantity')::NUMERIC;
          IF v_qty IS NULL OR v_qty <> trunc(v_qty) OR v_qty < 1 OR v_qty > 9999 THEN
            RAISE EXCEPTION 'SCHOOL_INVALID_QUANTITY:%', v_line.product_name;
          END IF;
          SELECT name, is_active INTO v_product FROM products WHERE id = NULLIF(v_item->>'productId', '')::UUID;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'SCHOOL_PRODUCT_NOT_FOUND:%', v_line.product_name;
          END IF;
          IF NOT v_product.is_active THEN
            RAISE EXCEPTION 'SCHOOL_PRODUCT_INACTIVE:%', v_product.name;
          END IF;
        END LOOP;

        -- The same product twice on one requirement.
        SELECT i.product_name INTO v_line
          FROM jsonb_array_elements(p_assignments) e
          JOIN school_quotation_items i ON i.id = (e.value->>'itemId')::UUID
         GROUP BY i.id, i.product_name, e.value->>'productId'
        HAVING count(*) > 1 LIMIT 1;
        IF FOUND THEN
          RAISE EXCEPTION 'SCHOOL_DUPLICATE_ASSIGNMENT:%', v_line.product_name;
        END IF;
        -- More units assigned than the requirement asks for.
        SELECT i.product_name, i.quantity, SUM((e.value->>'quantity')::INT)::INT AS assigned INTO v_line
          FROM jsonb_array_elements(p_assignments) e
          JOIN school_quotation_items i ON i.id = (e.value->>'itemId')::UUID
         GROUP BY i.id, i.product_name, i.quantity
        HAVING SUM((e.value->>'quantity')::INT) > i.quantity LIMIT 1;
        IF FOUND THEN
          RAISE EXCEPTION 'SCHOOL_ASSIGNMENT_EXCEEDS:%:%:%', v_line.assigned, v_line.quantity, v_line.product_name;
        END IF;

        SELECT COALESCE(jsonb_agg(jsonb_build_object('itemId', a.item_id, 'productId', a.product_id,
                 'product', p.name, 'quantity', a.quantity) ORDER BY a.item_id, p.name), '[]'::jsonb)
          INTO v_before
          FROM school_quotation_item_assignments a JOIN products p ON p.id = a.product_id
         WHERE a.quotation_id = p_quotation_id;

        DELETE FROM school_quotation_item_assignments a
         WHERE a.quotation_id = p_quotation_id
           AND NOT EXISTS (SELECT 1 FROM jsonb_array_elements(p_assignments) e
                            WHERE (e.value->>'itemId')::UUID = a.item_id
                              AND (e.value->>'productId')::UUID = a.product_id);
        UPDATE school_quotation_item_assignments a
           SET quantity = (e.value->>'quantity')::INT, updated_by = p_user_id, updated_at = now()
          FROM jsonb_array_elements(p_assignments) e
         WHERE a.quotation_id = p_quotation_id
           AND a.item_id = (e.value->>'itemId')::UUID AND a.product_id = (e.value->>'productId')::UUID
           AND a.quantity <> (e.value->>'quantity')::INT;
        INSERT INTO school_quotation_item_assignments (quotation_id, item_id, product_id, quantity, created_by)
        SELECT p_quotation_id, (e.value->>'itemId')::UUID, (e.value->>'productId')::UUID,
               (e.value->>'quantity')::INT, p_user_id
          FROM jsonb_array_elements(p_assignments) e
         WHERE NOT EXISTS (SELECT 1 FROM school_quotation_item_assignments a
                            WHERE a.item_id = (e.value->>'itemId')::UUID
                              AND a.product_id = (e.value->>'productId')::UUID);

        SELECT COALESCE(jsonb_agg(jsonb_build_object('itemId', a.item_id, 'productId', a.product_id,
                 'product', p.name, 'quantity', a.quantity) ORDER BY a.item_id, p.name), '[]'::jsonb)
          INTO v_after
          FROM school_quotation_item_assignments a JOIN products p ON p.id = a.product_id
         WHERE a.quotation_id = p_quotation_id;

        IF v_after IS DISTINCT FROM v_before THEN
          UPDATE school_quotations SET version = version + 1, updated_by = p_user_id, updated_at = now()
           WHERE id = p_quotation_id;
          INSERT INTO school_list_history (entity_type, entity_id, action, details, created_by)
          VALUES ('QUOTATION', p_quotation_id, 'PREPARACION',
                  jsonb_build_object('before', v_before, 'after', v_after), p_user_id);
        END IF;
        RETURN p_quotation_id;
      END;
      $$;
    `);

    for (const patch of PATCHES) {
      await patchFunction(queryRunner, patch);
    }
    await queryRunner.query(
      COMMITMENTS_VIEW(` AND q.fulfillment_mode = 'CONFIRMACION'`),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const [row] = (await queryRunner.query(`
      SELECT (SELECT count(*) FROM school_quotations WHERE fulfillment_mode = 'PREPARACION')::INT AS lists,
             (SELECT count(*) FROM school_list_template_items WHERE length(product_name) > 150)::INT
           + (SELECT count(*) FROM school_quotation_items WHERE length(product_name) > 150)::INT
           + (SELECT count(*) FROM school_dispatch_items WHERE length(product_name) > 150)::INT AS long_names
    `)) as { lists: number; long_names: number }[];
    if (row.lists > 0 || row.long_names > 0) {
      throw new Error(
        `No se puede revertir: ${row.lists} lista(s) usan el flujo de preparación y ${row.long_names} descripción(es) exceden 150 caracteres.`,
      );
    }
    await queryRunner.query(COMMITMENTS_VIEW(''));
    for (const patch of [...PATCHES].reverse()) {
      await patchFunction(queryRunner, {
        fn: patch.fn,
        from: patch.to,
        to: patch.from,
        times: patch.times,
      });
    }
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS save_school_quotation_preparation(UUID, JSONB, UUID, INT);
      DROP FUNCTION IF EXISTS school_quotation_assert_prepared(UUID);
      DROP FUNCTION IF EXISTS school_quotation_assert_requirements(JSONB);
      DROP TABLE school_quotation_item_assignments;
      DROP FUNCTION IF EXISTS school_assignment_guard();
      ALTER TABLE school_dispatch_items ALTER COLUMN product_name TYPE VARCHAR(150);
      ALTER TABLE school_quotation_items ALTER COLUMN product_name TYPE VARCHAR(150);
      ALTER TABLE school_list_template_items ALTER COLUMN product_name TYPE VARCHAR(150);
      ALTER TABLE school_quotations DROP CONSTRAINT school_quotations_status_check;
      ALTER TABLE school_quotations ADD CONSTRAINT school_quotations_status_check
        CHECK (status IN (${STATUSES}));
      ALTER TABLE school_quotations DROP COLUMN fulfillment_mode;
    `);
  }
}
