import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Listas Escolares — supply control (owner decisions, 2026-11-18):
 *
 *  1. Negative stock ONLY for school lists. The global CHECKs on
 *     `inventory_stock.quantity` / `products.stock` become BEFORE triggers with
 *     the same rule and the same error (code 23514 + constraint name): nothing
 *     may push a quantity below zero or deeper into the negative — except
 *     `school_quotation_sync_inventory`, which sets the transaction-local flag
 *     `cj.allow_negative_stock = 'SCHOOL_LIST'` around its own updates and
 *     clears it right after. `products.stock` (the sum of locations) may only
 *     be as negative as its locations are, so a legitimate Vitrina sale is
 *     never blocked by a Bodega backorder. Ventas, Cotizaciones, transfers and
 *     purchase voids keep their own stock checks unchanged.
 *
 *  2. Commitment vs. allocation vs. delivery. A confirmed list commits its
 *     inventory lines (`school_supply_commitments` view) and discounts them
 *     from Bodega at once (possibly below zero). Units physically available
 *     are then ALLOCATED to a specific list (`school_supply_allocations`,
 *     recording the purchase/movement they came from); pending = committed −
 *     allocated. Because the list already discounted its units:
 *        Bodega quantity = free units − pending units,
 *     so free units = quantity + total pending, and allocating never moves
 *     stock. Allocation is FIFO by confirmation date (`confirmed_at`),
 *     automatic on every stock entry into Bodega when the mode is FIFO_AUTO
 *     (`school_supply_settings`), or manual. Each product row is locked while
 *     allocating, so the same units can never go to two lists and no line is
 *     ever over-allocated.
 *
 *  3. Dispatch (= delivery, owner decision): requires the list fully
 *     supplied and paid; records what was delivered, marks its allocations
 *     ENTREGADA and the list ENTREGADA. It writes NO inventory movement (the
 *     units were discounted at confirmation). ENTREGAR through
 *     change_school_quotation_status is redirected to this function.
 *
 *  4. Annulment returns exactly what was discounted (unchanged ledger rule)
 *     and releases the list's reservations once; released units are handed
 *     FIFO to the next pending lists in automatic mode.
 *
 * Free-text lines are outside inventory control and never block dispatch.
 */
const OLD_SYNC = `CREATE OR REPLACE FUNCTION public.school_quotation_sync_inventory(p_quotation_id uuid, p_user_id uuid, p_reason text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
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
      $function$`;

const PERMISSION_FROM = `WHEN 'school_lists.quotations.cancel' THEN ARRAY['SUPER_ADMIN','ADMIN','SUPERVISOR_DE_TURNO']`;
const PERMISSION_TO = `WHEN 'school_lists.supply.manage'    THEN ARRAY['SUPER_ADMIN','ADMIN','SUPERVISOR_DE_TURNO']
          ${PERMISSION_FROM}`;

const DELIVER_FROM = `ELSIF p_action = 'ENTREGAR' AND v_q.status IN ('PAGADA','EN_PREPARACION','TERMINADA') THEN`;
const DELIVER_TO = `ELSIF p_action = 'ENTREGAR' THEN
          -- Delivery is the dispatch (dispatch_school_quotation): supply + payment checks, dispatch record.
          RAISE EXCEPTION 'SCHOOL_USE_DISPATCH';
        ELSIF FALSE THEN`;

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

export class SchoolListSupply1760008300000 implements MigrationInterface {
  name = 'SchoolListSupply1760008300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── 1. Negative stock: same rule, one audited exception ────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION inventory_stock_non_negative_guard() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      BEGIN
        IF NEW.quantity < 0
           AND (TG_OP = 'INSERT' OR NEW.quantity < OLD.quantity)
           AND COALESCE(current_setting('cj.allow_negative_stock', true), '') <> 'SCHOOL_LIST' THEN
          RAISE EXCEPTION 'new row for relation "inventory_stock" violates check constraint "CHK_inventory_stock_quantity_non_negative"'
            USING ERRCODE = '23514', CONSTRAINT = 'CHK_inventory_stock_quantity_non_negative',
                  TABLE = 'inventory_stock';
        END IF;
        RETURN NEW;
      END;
      $$;

      -- products.stock is the sum of the locations: it may be negative only as far as
      -- the locations themselves are (a Bodega backorder from a school list).
      CREATE OR REPLACE FUNCTION products_stock_non_negative_guard() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      BEGIN
        IF NEW.stock < 0
           AND (TG_OP = 'INSERT' OR NEW.stock < OLD.stock)
           AND COALESCE(current_setting('cj.allow_negative_stock', true), '') <> 'SCHOOL_LIST'
           AND NEW.stock < (SELECT COALESCE(SUM(LEAST(quantity, 0)), 0) FROM inventory_stock WHERE product_id = NEW.id) THEN
          RAISE EXCEPTION 'new row for relation "products" violates check constraint "CHK_products_stock_non_negative"'
            USING ERRCODE = '23514', CONSTRAINT = 'CHK_products_stock_non_negative', TABLE = 'products';
        END IF;
        RETURN NEW;
      END;
      $$;

      ALTER TABLE inventory_stock DROP CONSTRAINT "CHK_inventory_stock_quantity_non_negative";
      ALTER TABLE products DROP CONSTRAINT "CHK_products_stock_non_negative";
      CREATE TRIGGER trg_inventory_stock_non_negative BEFORE INSERT OR UPDATE OF quantity ON inventory_stock
        FOR EACH ROW EXECUTE FUNCTION inventory_stock_non_negative_guard();
      CREATE TRIGGER trg_products_stock_non_negative BEFORE INSERT OR UPDATE OF stock ON products
        FOR EACH ROW EXECUTE FUNCTION products_stock_non_negative_guard();
    `);

    // ── 2. Tables ─────────────────────────────────────────────────────────
    await queryRunner.query(`
      ALTER TABLE school_quotations ADD COLUMN confirmed_at TIMESTAMPTZ;
      UPDATE school_quotations SET confirmed_at = created_at
       WHERE status NOT IN ('BORRADOR') AND confirmed_at IS NULL;

      CREATE TABLE school_supply_settings (
        id SMALLINT PRIMARY KEY CHECK (id = 1),
        allocation_mode VARCHAR(12) NOT NULL DEFAULT 'FIFO_AUTO' CHECK (allocation_mode IN ('FIFO_AUTO','MANUAL')),
        updated_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      INSERT INTO school_supply_settings (id) VALUES (1);

      CREATE TABLE school_dispatches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quotation_id UUID NOT NULL UNIQUE REFERENCES school_quotations(id) ON DELETE RESTRICT,
        dispatched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        dispatched_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        observations VARCHAR(500),
        idempotency_key VARCHAR(100) NOT NULL UNIQUE
      );

      CREATE TABLE school_dispatch_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        dispatch_id UUID NOT NULL REFERENCES school_dispatches(id) ON DELETE RESTRICT,
        product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
        product_name VARCHAR(150) NOT NULL,
        requested INT NOT NULL CHECK (requested > 0),
        supplied INT NOT NULL CHECK (supplied >= 0),
        delivered INT NOT NULL CHECK (delivered >= 0),
        inventory_controlled BOOLEAN NOT NULL
      );

      CREATE TABLE school_supply_allocations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quotation_id UUID NOT NULL REFERENCES school_quotations(id) ON DELETE RESTRICT,
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        quantity INT NOT NULL CHECK (quantity > 0),
        source_type VARCHAR(12) NOT NULL CHECK (source_type IN ('EXISTENCIA','COMPRA','TRASLADO','DEVOLUCION')),
        source_movement_id UUID REFERENCES inventory_movements(id) ON DELETE RESTRICT,
        purchase_id UUID REFERENCES purchases(id) ON DELETE RESTRICT,
        mode VARCHAR(12) NOT NULL CHECK (mode IN ('AUTO','FIFO_MANUAL','MANUAL')),
        status VARCHAR(10) NOT NULL DEFAULT 'ASIGNADA' CHECK (status IN ('ASIGNADA','LIBERADA','ENTREGADA')),
        idempotency_key VARCHAR(100) UNIQUE,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        released_at TIMESTAMPTZ,
        released_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        release_reason VARCHAR(500),
        dispatch_id UUID REFERENCES school_dispatches(id) ON DELETE RESTRICT,
        delivered_at TIMESTAMPTZ
      );
      CREATE INDEX "IDX_school_supply_allocations_line" ON school_supply_allocations (quotation_id, product_id, status);
      CREATE INDEX "IDX_school_supply_allocations_product" ON school_supply_allocations (product_id, status);
      CREATE INDEX "IDX_school_supply_allocations_purchase" ON school_supply_allocations (purchase_id) WHERE purchase_id IS NOT NULL;
      CREATE INDEX "IDX_school_supply_allocations_movement" ON school_supply_allocations (source_movement_id) WHERE source_movement_id IS NOT NULL;

      -- Allocations and dispatches are audit records: only ASIGNADA → LIBERADA/ENTREGADA.
      CREATE OR REPLACE FUNCTION school_supply_allocation_guard() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      BEGIN
        IF TG_OP = 'DELETE' OR OLD.status <> 'ASIGNADA' OR NEW.status NOT IN ('LIBERADA','ENTREGADA')
           OR (to_jsonb(NEW) - ARRAY['status','released_at','released_by','release_reason','dispatch_id','delivered_at'])
              <> (to_jsonb(OLD) - ARRAY['status','released_at','released_by','release_reason','dispatch_id','delivered_at']) THEN
          RAISE EXCEPTION 'SCHOOL_RECORD_IMMUTABLE:%', TG_TABLE_NAME;
        END IF;
        RETURN NEW;
      END;
      $$;
      CREATE TRIGGER trg_school_supply_allocations_guard BEFORE UPDATE OR DELETE ON school_supply_allocations
        FOR EACH ROW EXECUTE FUNCTION school_supply_allocation_guard();
      CREATE TRIGGER trg_school_dispatches_guard BEFORE UPDATE OR DELETE ON school_dispatches
        FOR EACH ROW EXECUTE FUNCTION school_list_append_only_guard();
      CREATE TRIGGER trg_school_dispatch_items_guard BEFORE UPDATE OR DELETE ON school_dispatch_items
        FOR EACH ROW EXECUTE FUNCTION school_list_append_only_guard();

      -- What each active, undelivered list still needs per inventory product.
      CREATE VIEW school_supply_commitments AS
      SELECT q.id AS quotation_id, q.quotation_number, q.confirmed_at, q.created_at, i.product_id,
             SUM(i.quantity)::INT AS committed,
             COALESCE((SELECT SUM(a.quantity) FROM school_supply_allocations a
                        WHERE a.quotation_id = q.id AND a.product_id = i.product_id AND a.status = 'ASIGNADA'), 0)::INT AS allocated,
             (SUM(i.quantity) - COALESCE((SELECT SUM(a.quantity) FROM school_supply_allocations a
                        WHERE a.quotation_id = q.id AND a.product_id = i.product_id AND a.status = 'ASIGNADA'), 0))::INT AS pending
        FROM school_quotations q
        JOIN school_quotation_items i ON i.quotation_id = q.id
       WHERE i.product_id IS NOT NULL AND q.status NOT IN ('BORRADOR','CANCELADA','ENTREGADA')
       GROUP BY q.id, q.quotation_number, q.confirmed_at, q.created_at, i.product_id;
    `);

    // ── 3. Allocation ─────────────────────────────────────────────────────
    await queryRunner.query(`
      -- Physical units in Bodega not reserved for any list (quantity = free − pending).
      CREATE OR REPLACE FUNCTION school_supply_free_units(p_product_id UUID) RETURNS INT
      LANGUAGE sql STABLE AS $$
        SELECT GREATEST(0,
                 COALESCE((SELECT s.quantity FROM inventory_stock s JOIN inventory_locations l ON l.id = s.location_id
                            WHERE s.product_id = p_product_id AND l.name = 'Bodega'), 0)
               + COALESCE((SELECT SUM(pending) FROM school_supply_commitments WHERE product_id = p_product_id), 0))::INT
      $$;

      -- Hands free units of a product to pending lists, oldest confirmation first.
      -- p_source_movement: the stock entry those units came from (caps the amount to
      -- what that movement brought and has not already been allocated).
      CREATE OR REPLACE FUNCTION school_supply_allocate_fifo(
        p_product_id UUID, p_user_id UUID, p_source_movement UUID, p_mode TEXT
      ) RETURNS INT
      LANGUAGE plpgsql AS $$
      DECLARE
        v_left INT;
        v_line RECORD;
        v_take INT;
        v_total INT := 0;
        v_source TEXT := 'EXISTENCIA';
        v_purchase UUID;
        v_movement RECORD;
      BEGIN
        PERFORM 1 FROM products WHERE id = p_product_id FOR UPDATE;
        v_left := school_supply_free_units(p_product_id);
        IF p_source_movement IS NOT NULL THEN
          SELECT * INTO v_movement FROM inventory_movements WHERE id = p_source_movement;
          v_source := CASE v_movement.reference_type WHEN 'PURCHASE' THEN 'COMPRA'
                                                     WHEN 'TRANSFER' THEN 'TRASLADO'
                                                     ELSE 'DEVOLUCION' END;
          v_purchase := CASE WHEN v_movement.reference_type = 'PURCHASE' THEN v_movement.reference_id END;
          v_left := LEAST(v_left, v_movement.quantity_base_units - COALESCE((
                      SELECT SUM(quantity) FROM school_supply_allocations
                       WHERE source_movement_id = p_source_movement AND status <> 'LIBERADA'), 0));
        END IF;
        IF v_left <= 0 THEN
          RETURN 0;
        END IF;
        FOR v_line IN
          SELECT quotation_id, pending FROM school_supply_commitments
           WHERE product_id = p_product_id AND pending > 0
           ORDER BY confirmed_at NULLS LAST, created_at, quotation_number
        LOOP
          EXIT WHEN v_left <= 0;
          v_take := LEAST(v_line.pending, v_left);
          INSERT INTO school_supply_allocations
            (quotation_id, product_id, quantity, source_type, source_movement_id, purchase_id, mode, created_by)
          VALUES (v_line.quotation_id, p_product_id, v_take, v_source, p_source_movement, v_purchase, p_mode, p_user_id);
          INSERT INTO school_list_history (entity_type, entity_id, action, details, created_by)
          VALUES ('QUOTATION', v_line.quotation_id, 'ABASTECIMIENTO',
                  jsonb_build_object('productId', p_product_id, 'quantity', v_take, 'source', v_source,
                                     'purchaseId', v_purchase, 'mode', p_mode), p_user_id);
          v_left := v_left - v_take;
          v_total := v_total + v_take;
        END LOOP;
        RETURN v_total;
      END;
      $$;

      -- Automatic FIFO on every stock entry into Bodega (purchases, transfers, returns).
      -- Runs inside the caller's transaction (e.g. confirm_purchase) and never raises.
      CREATE OR REPLACE FUNCTION school_supply_on_stock_in() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      BEGIN
        IF NEW.location_to_id IS NOT NULL
           AND COALESCE(NEW.reference_type, '') <> 'SCHOOL_LIST'
           AND NEW.location_to_id = (SELECT id FROM inventory_locations WHERE name = 'Bodega')
           AND (SELECT allocation_mode FROM school_supply_settings WHERE id = 1) = 'FIFO_AUTO'
           AND EXISTS (SELECT 1 FROM school_supply_commitments WHERE product_id = NEW.product_id AND pending > 0) THEN
          PERFORM school_supply_allocate_fifo(NEW.product_id, NEW.user_id, NEW.id, 'AUTO');
        END IF;
        RETURN NULL;
      END;
      $$;
      CREATE TRIGGER trg_school_supply_on_stock_in AFTER INSERT ON inventory_movements
        FOR EACH ROW EXECUTE FUNCTION school_supply_on_stock_in();

      -- "Asignar FIFO" (manual mode, or to retry): one product, or every product with pending.
      CREATE OR REPLACE FUNCTION run_school_supply_fifo(p_product_id UUID, p_user_id UUID) RETURNS INT
      LANGUAGE plpgsql AS $$
      DECLARE
        v_product UUID;
        v_total INT := 0;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.supply.manage');
        FOR v_product IN
          SELECT DISTINCT product_id FROM school_supply_commitments
           WHERE pending > 0 AND (p_product_id IS NULL OR product_id = p_product_id) ORDER BY 1
        LOOP
          v_total := v_total + school_supply_allocate_fifo(v_product, p_user_id, NULL, 'FIFO_MANUAL');
        END LOOP;
        RETURN v_total;
      END;
      $$;

      -- "Asignar compra a listas": FIFO with exactly the units of that purchase not yet allocated.
      CREATE OR REPLACE FUNCTION allocate_school_supply_purchase(p_purchase_id UUID, p_user_id UUID) RETURNS INT
      LANGUAGE plpgsql AS $$
      DECLARE
        v_movement RECORD;
        v_total INT := 0;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.supply.manage');
        IF NOT EXISTS (SELECT 1 FROM purchases WHERE id = p_purchase_id) THEN
          RAISE EXCEPTION 'SCHOOL_PURCHASE_NOT_FOUND';
        END IF;
        FOR v_movement IN
          SELECT id, product_id FROM inventory_movements
           WHERE reference_type = 'PURCHASE' AND reference_id = p_purchase_id AND movement_type = 'ENTRADA_COMPRA'
           ORDER BY product_id, created_at
        LOOP
          v_total := v_total + school_supply_allocate_fifo(v_movement.product_id, p_user_id, v_movement.id, 'FIFO_MANUAL');
        END LOOP;
        RETURN v_total;
      END;
      $$;

      -- Manual allocation of free units (optionally from a purchase) to one list.
      CREATE OR REPLACE FUNCTION allocate_school_supply_manual(
        p_quotation_id UUID, p_product_id UUID, p_quantity INT, p_purchase_id UUID, p_user_id UUID, p_key TEXT
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_id UUID;
        v_pending INT;
        v_free INT;
        v_movement UUID;
        v_remaining INT;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.supply.manage');
        IF p_key IS NULL OR length(p_key) < 8 THEN
          RAISE EXCEPTION 'SCHOOL_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        SELECT id INTO v_id FROM school_supply_allocations WHERE idempotency_key = p_key;
        IF FOUND THEN
          RETURN v_id;
        END IF;
        IF p_quantity IS NULL OR p_quantity < 1 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_QUANTITY';
        END IF;
        PERFORM 1 FROM school_quotations WHERE id = p_quotation_id FOR UPDATE;
        PERFORM 1 FROM products WHERE id = p_product_id FOR UPDATE;
        SELECT pending INTO v_pending FROM school_supply_commitments
         WHERE quotation_id = p_quotation_id AND product_id = p_product_id;
        IF COALESCE(v_pending, 0) < p_quantity THEN
          RAISE EXCEPTION 'SCHOOL_SUPPLY_OVER_PENDING:%', COALESCE(v_pending, 0);
        END IF;
        v_free := school_supply_free_units(p_product_id);
        IF v_free < p_quantity THEN
          RAISE EXCEPTION 'SCHOOL_SUPPLY_NO_FREE_UNITS:%', v_free;
        END IF;
        IF p_purchase_id IS NOT NULL THEN
          SELECT m.id, m.quantity_base_units - COALESCE((SELECT SUM(a.quantity) FROM school_supply_allocations a
                                                          WHERE a.source_movement_id = m.id AND a.status <> 'LIBERADA'), 0)
            INTO v_movement, v_remaining
            FROM inventory_movements m
           WHERE m.reference_type = 'PURCHASE' AND m.reference_id = p_purchase_id
             AND m.movement_type = 'ENTRADA_COMPRA' AND m.product_id = p_product_id
           ORDER BY m.created_at LIMIT 1;
          IF v_movement IS NULL THEN
            RAISE EXCEPTION 'SCHOOL_PURCHASE_NOT_FOUND';
          END IF;
          IF v_remaining < p_quantity THEN
            RAISE EXCEPTION 'SCHOOL_SUPPLY_PURCHASE_EXHAUSTED:%', v_remaining;
          END IF;
        END IF;
        INSERT INTO school_supply_allocations
          (quotation_id, product_id, quantity, source_type, source_movement_id, purchase_id, mode, idempotency_key, created_by)
        VALUES (p_quotation_id, p_product_id, p_quantity,
                CASE WHEN p_purchase_id IS NULL THEN 'EXISTENCIA' ELSE 'COMPRA' END,
                v_movement, p_purchase_id, 'MANUAL', p_key, p_user_id)
        RETURNING id INTO v_id;
        INSERT INTO school_list_history (entity_type, entity_id, action, details, created_by)
        VALUES ('QUOTATION', p_quotation_id, 'ABASTECIMIENTO',
                jsonb_build_object('productId', p_product_id, 'quantity', p_quantity,
                                   'source', CASE WHEN p_purchase_id IS NULL THEN 'EXISTENCIA' ELSE 'COMPRA' END,
                                   'purchaseId', p_purchase_id, 'mode', 'MANUAL'), p_user_id);
        RETURN v_id;
      END;
      $$;

      CREATE OR REPLACE FUNCTION set_school_supply_mode(p_mode TEXT, p_user_id UUID) RETURNS TEXT
      LANGUAGE plpgsql AS $$
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.templates.manage');
        IF p_mode NOT IN ('FIFO_AUTO','MANUAL') THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_SUPPLY_MODE';
        END IF;
        UPDATE school_supply_settings SET allocation_mode = p_mode, updated_by = p_user_id, updated_at = now() WHERE id = 1;
        RETURN p_mode;
      END;
      $$;

      -- PENDIENTE / PARCIAL / DISPONIBLE / DESPACHADA (NO_APLICA for drafts and annulled lists).
      CREATE OR REPLACE FUNCTION school_quotation_supply_status(p_quotation_id UUID) RETURNS TEXT
      LANGUAGE plpgsql STABLE AS $$
      DECLARE
        v_status TEXT;
        v_allocated INT;
        v_pending INT;
      BEGIN
        SELECT status INTO v_status FROM school_quotations WHERE id = p_quotation_id;
        IF EXISTS (SELECT 1 FROM school_dispatches WHERE quotation_id = p_quotation_id) THEN
          RETURN 'DESPACHADA';
        END IF;
        IF v_status IN ('BORRADOR','CANCELADA','ENTREGADA') THEN
          RETURN 'NO_APLICA';
        END IF;
        SELECT COALESCE(SUM(allocated), 0), COALESCE(SUM(pending), 0) INTO v_allocated, v_pending
          FROM school_supply_commitments WHERE quotation_id = p_quotation_id;
        IF v_pending = 0 THEN
          RETURN 'DISPONIBLE';
        END IF;
        RETURN CASE WHEN v_allocated > 0 THEN 'PARCIAL' ELSE 'PENDIENTE' END;
      END;
      $$;
    `);

    // ── 4. Inventory sync: negative allowed, reservations released/handed out ─
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION school_quotation_sync_inventory(
        p_quotation_id UUID, p_user_id UUID, p_reason TEXT
      ) RETURNS INT
      LANGUAGE plpgsql AS $$
      DECLARE
        v_status TEXT;
        v_bodega UUID;
        v_row RECORD;
        v_alloc RECORD;
        v_presentation product_presentations;
        v_moves INT := 0;
        v_excess INT;
        v_take INT;
        v_products UUID[] := '{}';
        v_product UUID;
      BEGIN
        SELECT status INTO v_status FROM school_quotations WHERE id = p_quotation_id;
        SELECT id INTO v_bodega FROM inventory_locations WHERE name = 'Bodega';
        IF v_bodega IS NULL THEN
          RAISE EXCEPTION 'SCHOOL_LOCATION_NOT_FOUND';
        END IF;
        -- FIFO reference: when the list was first confirmed.
        UPDATE school_quotations SET confirmed_at = now()
         WHERE id = p_quotation_id AND confirmed_at IS NULL AND status NOT IN ('BORRADOR','CANCELADA');

        -- The ONLY place allowed to take Bodega below zero (transaction-local, cleared below).
        PERFORM set_config('cj.allow_negative_stock', 'SCHOOL_LIST', true);
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
          PERFORM 1 FROM products WHERE id = v_row.product_id FOR UPDATE;
          v_presentation := ensure_product_presentation(v_row.product_id, NULL);
          PERFORM ensure_inventory_stock_row(v_row.product_id, v_bodega);
          PERFORM 1 FROM inventory_stock WHERE product_id = v_row.product_id AND location_id = v_bodega FOR UPDATE;
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
          v_products := v_products || v_row.product_id;
        END LOOP;
        PERFORM set_config('cj.allow_negative_stock', '', true);

        -- Release reservations the list no longer needs (annulled list, reduced or removed lines).
        FOR v_row IN
          SELECT a.product_id, SUM(a.quantity)::INT AS allocated,
                 COALESCE((SELECT SUM(i.quantity) FROM school_quotation_items i
                            WHERE i.quotation_id = p_quotation_id AND i.product_id = a.product_id
                              AND v_status NOT IN ('BORRADOR','CANCELADA')), 0)::INT AS committed
            FROM school_supply_allocations a
           WHERE a.quotation_id = p_quotation_id AND a.status = 'ASIGNADA'
           GROUP BY a.product_id ORDER BY 1
        LOOP
          v_excess := v_row.allocated - v_row.committed;
          CONTINUE WHEN v_excess <= 0;
          PERFORM 1 FROM products WHERE id = v_row.product_id FOR UPDATE;
          FOR v_alloc IN
            SELECT * FROM school_supply_allocations
             WHERE quotation_id = p_quotation_id AND product_id = v_row.product_id AND status = 'ASIGNADA'
             ORDER BY created_at DESC, id DESC
          LOOP
            EXIT WHEN v_excess <= 0;
            v_take := LEAST(v_alloc.quantity, v_excess);
            UPDATE school_supply_allocations
               SET status = 'LIBERADA', released_at = now(), released_by = p_user_id,
                   release_reason = COALESCE(p_reason, 'Ajuste de la lista')
             WHERE id = v_alloc.id;
            IF v_take < v_alloc.quantity THEN
              -- Keep the part still needed as its own reservation (same origin).
              INSERT INTO school_supply_allocations
                (quotation_id, product_id, quantity, source_type, source_movement_id, purchase_id, mode, created_by)
              VALUES (v_alloc.quotation_id, v_alloc.product_id, v_alloc.quantity - v_take, v_alloc.source_type,
                      v_alloc.source_movement_id, v_alloc.purchase_id, v_alloc.mode, v_alloc.created_by);
            END IF;
            v_excess := v_excess - v_take;
          END LOOP;
          v_products := v_products || v_row.product_id;
        END LOOP;

        -- Hand out free units (stock on hand, released reservations) FIFO in automatic mode.
        IF (SELECT allocation_mode FROM school_supply_settings WHERE id = 1) = 'FIFO_AUTO' THEN
          FOR v_product IN SELECT DISTINCT unnest(v_products) ORDER BY 1 LOOP
            PERFORM school_supply_allocate_fifo(v_product, p_user_id, NULL, 'AUTO');
          END LOOP;
        END IF;
        RETURN v_moves;
      END;
      $$;
    `);

    // ── 5. Dispatch (= delivery) ──────────────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION dispatch_school_quotation(
        p_quotation_id UUID, p_user_id UUID, p_observations TEXT, p_key TEXT
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_q school_quotations%ROWTYPE;
        v_id UUID;
        v_paid NUMERIC;
        v_short RECORD;
        v_units INT;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.quotations.edit');
        IF p_key IS NULL OR length(p_key) < 8 THEN
          RAISE EXCEPTION 'SCHOOL_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        SELECT * INTO v_q FROM school_quotations WHERE id = p_quotation_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_FOUND';
        END IF;
        -- Double click / retry: the dispatch already exists.
        SELECT id INTO v_id FROM school_dispatches WHERE quotation_id = p_quotation_id;
        IF FOUND THEN
          RETURN v_id;
        END IF;
        IF v_q.status IN ('BORRADOR','CANCELADA','ENTREGADA') THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_INVALID_TRANSITION:%', v_q.status;
        END IF;
        -- A fully paid list is PAGADA, EN_PREPARACION or TERMINADA; anything else owes money.
        v_paid := school_quotation_paid(p_quotation_id);
        IF v_paid < v_q.total THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_PAID:%', to_char(v_q.total - v_paid, 'FM999999990.00');
        END IF;
        IF length(COALESCE(p_observations, '')) > 500 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_TEXT';
        END IF;
        -- Same product locks as allocation, so the check below cannot race a release.
        PERFORM 1 FROM products
         WHERE id IN (SELECT product_id FROM school_quotation_items WHERE quotation_id = p_quotation_id AND product_id IS NOT NULL)
         ORDER BY id FOR UPDATE;
        SELECT c.pending, p.name INTO v_short
          FROM school_supply_commitments c JOIN products p ON p.id = c.product_id
         WHERE c.quotation_id = p_quotation_id AND c.pending > 0
         ORDER BY p.name LIMIT 1;
        IF FOUND THEN
          RAISE EXCEPTION 'SCHOOL_SUPPLY_INCOMPLETE:%:%', v_short.pending, v_short.name;
        END IF;

        INSERT INTO school_dispatches (quotation_id, dispatched_by, observations, idempotency_key)
        VALUES (p_quotation_id, p_user_id, NULLIF(btrim(COALESCE(p_observations, '')), ''), p_key)
        RETURNING id INTO v_id;
        INSERT INTO school_dispatch_items (dispatch_id, product_id, product_name, requested, supplied, delivered, inventory_controlled)
        SELECT v_id, product_id, product_name, quantity, quantity, quantity, product_id IS NOT NULL
          FROM school_quotation_items WHERE quotation_id = p_quotation_id ORDER BY line_no;
        UPDATE school_supply_allocations SET status = 'ENTREGADA', dispatch_id = v_id, delivered_at = now()
         WHERE quotation_id = p_quotation_id AND status = 'ASIGNADA';
        -- No inventory movement: the units were discounted when the list was confirmed.
        UPDATE school_quotations
           SET status = 'ENTREGADA', delivered_at = now(), delivered_by = p_user_id,
               version = version + 1, updated_by = p_user_id, updated_at = now()
         WHERE id = p_quotation_id;
        SELECT COALESCE(SUM(delivered), 0) INTO v_units FROM school_dispatch_items WHERE dispatch_id = v_id;
        INSERT INTO school_list_history (entity_type, entity_id, action, from_status, to_status, details, created_by)
        VALUES ('QUOTATION', p_quotation_id, 'DESPACHO', v_q.status, 'ENTREGADA',
                jsonb_build_object('dispatchId', v_id, 'units', v_units,
                                   'observations', NULLIF(btrim(COALESCE(p_observations, '')), '')), p_user_id);
        RETURN v_id;
      END;
      $$;
    `);

    await patchFunction(
      queryRunner,
      'school_list_assert_permission',
      PERMISSION_FROM,
      PERMISSION_TO,
    );
    await patchFunction(
      queryRunner,
      'change_school_quotation_status',
      DELIVER_FROM,
      DELIVER_TO,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const [row] = (await queryRunner.query(`
      SELECT (SELECT count(*) FROM school_supply_allocations)::INT AS allocations,
             (SELECT count(*) FROM school_dispatches)::INT AS dispatches,
             (SELECT count(*) FROM inventory_stock WHERE quantity < 0)::INT AS negative
    `)) as { allocations: number; dispatches: number; negative: number }[];
    if (row.allocations > 0 || row.dispatches > 0 || row.negative > 0) {
      throw new Error(
        `No se puede revertir: ${row.allocations} asignaciones, ${row.dispatches} despachos y ${row.negative} existencias negativas registradas.`,
      );
    }
    await patchFunction(
      queryRunner,
      'change_school_quotation_status',
      DELIVER_TO,
      DELIVER_FROM,
    );
    await patchFunction(
      queryRunner,
      'school_list_assert_permission',
      PERMISSION_TO,
      PERMISSION_FROM,
    );
    await queryRunner.query(OLD_SYNC);
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS dispatch_school_quotation(UUID, UUID, TEXT, TEXT);
      DROP FUNCTION IF EXISTS school_quotation_supply_status(UUID);
      DROP FUNCTION IF EXISTS set_school_supply_mode(TEXT, UUID);
      DROP FUNCTION IF EXISTS allocate_school_supply_manual(UUID, UUID, INT, UUID, UUID, TEXT);
      DROP FUNCTION IF EXISTS allocate_school_supply_purchase(UUID, UUID);
      DROP FUNCTION IF EXISTS run_school_supply_fifo(UUID, UUID);
      DROP TRIGGER IF EXISTS trg_school_supply_on_stock_in ON inventory_movements;
      DROP FUNCTION IF EXISTS school_supply_on_stock_in();
      DROP FUNCTION IF EXISTS school_supply_allocate_fifo(UUID, UUID, UUID, TEXT);
      DROP FUNCTION IF EXISTS school_supply_free_units(UUID);
      DROP VIEW school_supply_commitments;
      DROP TABLE school_supply_allocations;
      DROP FUNCTION IF EXISTS school_supply_allocation_guard();
      DROP TABLE school_dispatch_items;
      DROP TABLE school_dispatches;
      DROP TABLE school_supply_settings;
      ALTER TABLE school_quotations DROP COLUMN confirmed_at;

      DROP TRIGGER trg_products_stock_non_negative ON products;
      DROP TRIGGER trg_inventory_stock_non_negative ON inventory_stock;
      DROP FUNCTION products_stock_non_negative_guard();
      DROP FUNCTION inventory_stock_non_negative_guard();
      ALTER TABLE products ADD CONSTRAINT "CHK_products_stock_non_negative" CHECK (stock >= 0);
      ALTER TABLE inventory_stock ADD CONSTRAINT "CHK_inventory_stock_quantity_non_negative" CHECK (quantity >= 0);
    `);
  }
}
