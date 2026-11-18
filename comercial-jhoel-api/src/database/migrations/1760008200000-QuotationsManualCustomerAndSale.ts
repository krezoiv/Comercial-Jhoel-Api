import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Cotizaciones — customer typed by hand, commercial life cycle and the
 * "Confirmar venta" conversion (decided with the owner).
 *
 *  - The customer is captured on the quotation itself (name, phone, student,
 *    grade, observations); `client_id` becomes optional and no `clients` row
 *    is created. Old quotations keep their registered client.
 *  - Statuses: BORRADOR, COTIZADA, ACEPTADA, VENDIDA, RECHAZADA, CANCELADA.
 *    Existing rows are mapped PENDIENTE → COTIZADA and ANULADA → CANCELADA
 *    (`down` maps them back). VENCIDA stays derived (COTIZADA past its
 *    expiration date).
 *  - Saving a quotation NEVER touches inventory (unchanged).
 *  - `convert_quotation_to_sale` runs the existing `confirm_sale` (Vitrina,
 *    same stock/locking/movements as Ventas) inside the same transaction,
 *    with the quoted unit price and line total, then marks the quotation
 *    VENDIDA and links the sale. It locks the quotation first, so a double
 *    click or a retry returns the sale already created (one sale, one stock
 *    discount). `confirm_sale` only gains optional `unitPrice`/`lineTotal`
 *    item fields; POST /sales cannot send them (DTO whitelist), so Ventas
 *    behaves exactly as before.
 *  - Cotizaciones receives no payments (owner decision): the sale enters the
 *    Caja de ventas once, like any sale.
 */
const OLD_CREATE_QUOTATION = `CREATE OR REPLACE FUNCTION public.create_quotation(p_user_id uuid, p_client_id uuid, p_expiration_date date, p_items jsonb, p_observations character varying, p_commercial_terms character varying)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
      DECLARE
        v_quotation_id UUID;
        v_quotation_number VARCHAR(20);
        v_item JSONB;
        v_product_id UUID;
        v_quantity INT;
        v_discount NUMERIC(12,2);
        v_product RECORD;
        v_line_subtotal NUMERIC(12,2);
        v_line_total NUMERIC(12,2);
        v_subtotal NUMERIC(12,2) := 0;
        v_total_discount NUMERIC(12,2) := 0;
      BEGIN
        IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
          RAISE EXCEPTION 'QUOTATION_EMPTY';
        END IF;

        PERFORM 1 FROM clients WHERE id = p_client_id AND is_active = true;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'CLIENT_NOT_FOUND:%', p_client_id;
        END IF;

        IF p_expiration_date < CURRENT_DATE THEN
          RAISE EXCEPTION 'INVALID_EXPIRATION_DATE';
        END IF;

        v_quotation_number := 'COT-' || LPAD(nextval('quotation_number_seq')::text, 6, '0');

        INSERT INTO quotations (id, quotation_number, client_id, user_id, expiration_date, subtotal, discount, total, observations, commercial_terms, status)
        VALUES (gen_random_uuid(), v_quotation_number, p_client_id, p_user_id, p_expiration_date, 0, 0, 0, p_observations, p_commercial_terms, 'PENDIENTE')
        RETURNING id INTO v_quotation_id;

        FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
        LOOP
          v_product_id := (v_item->>'productId')::UUID;
          v_quantity := (v_item->>'quantity')::INT;
          v_discount := COALESCE((v_item->>'discount')::NUMERIC(12,2), 0);

          IF v_quantity IS NULL OR v_quantity <= 0 THEN
            RAISE EXCEPTION 'INVALID_QUANTITY:%', v_product_id;
          END IF;
          IF v_discount < 0 THEN
            RAISE EXCEPTION 'INVALID_DISCOUNT:%', v_product_id;
          END IF;

          SELECT id, name, public_price, is_active INTO v_product FROM products WHERE id = v_product_id;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'PRODUCT_NOT_FOUND:%', v_product_id;
          END IF;
          IF NOT v_product.is_active THEN
            RAISE EXCEPTION 'PRODUCT_INACTIVE:%', v_product_id;
          END IF;

          v_line_subtotal := v_product.public_price * v_quantity;
          v_line_total := v_line_subtotal - v_discount;
          v_subtotal := v_subtotal + v_line_subtotal;
          v_total_discount := v_total_discount + v_discount;

          INSERT INTO quotation_details (id, quotation_id, product_id, product_name, presentation_name, quantity, unit_price, discount, subtotal, total)
          VALUES (gen_random_uuid(), v_quotation_id, v_product_id, v_product.name, NULL, v_quantity, v_product.public_price, v_discount, v_line_subtotal, v_line_total);
        END LOOP;

        UPDATE quotations SET subtotal = v_subtotal, discount = v_total_discount, total = v_subtotal - v_total_discount WHERE id = v_quotation_id;
        RETURN v_quotation_id;
      END;
      $function$`;

const SALE_PRICE_FROM = `v_line_total := v_unit_price * v_quantity;`;
const SALE_PRICE_TO = `-- Quotation conversion (convert_quotation_to_sale) sends the quoted price
          -- and line total; POST /sales never can (its DTO whitelists the fields).
          IF v_item ? 'unitPrice' THEN
            v_unit_price := (v_item->>'unitPrice')::NUMERIC(12,2);
          END IF;
          v_line_total := COALESCE((v_item->>'lineTotal')::NUMERIC(12,2), v_unit_price * v_quantity);`;

async function patchConfirmSale(
  queryRunner: QueryRunner,
  from: string,
  to: string,
): Promise<void> {
  const rows = (await queryRunner.query(
    `SELECT pg_get_functiondef(p.oid) AS def FROM pg_proc p
     WHERE p.proname = 'confirm_sale' AND p.pronargs = 4 AND p.pronamespace = 'public'::regnamespace`,
  )) as Array<{ def: string }>;
  if (rows.length !== 1 || rows[0].def.split(from).length !== 2) {
    throw new Error('confirm_sale: anchor not found exactly once');
  }
  await queryRunner.query(rows[0].def.replace(from, to));
}

export class QuotationsManualCustomerAndSale1760008200000 implements MigrationInterface {
  name = 'QuotationsManualCustomerAndSale1760008200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE quotations ALTER COLUMN client_id DROP NOT NULL;
      ALTER TABLE quotations
        ADD COLUMN customer_name VARCHAR(150),
        ADD COLUMN customer_phone VARCHAR(20),
        ADD COLUMN student_name VARCHAR(150),
        ADD COLUMN grade VARCHAR(60),
        ADD COLUMN accepted_at TIMESTAMPTZ,
        ADD COLUMN accepted_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        ADD COLUMN rejected_at TIMESTAMPTZ,
        ADD COLUMN rejected_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        ADD COLUMN reject_reason VARCHAR(255),
        ADD COLUMN sold_at TIMESTAMPTZ,
        ADD COLUMN sold_by UUID REFERENCES users(id) ON DELETE RESTRICT;
      ALTER TABLE quotations ADD CONSTRAINT "CHK_quotations_customer"
        CHECK (client_id IS NOT NULL OR (customer_name IS NOT NULL AND customer_phone IS NOT NULL));

      ALTER TABLE quotations DROP CONSTRAINT "CHK_quotations_status";
      UPDATE quotations SET status = 'COTIZADA' WHERE status = 'PENDIENTE';
      UPDATE quotations SET status = 'CANCELADA' WHERE status = 'ANULADA';
      ALTER TABLE quotations ADD CONSTRAINT "CHK_quotations_status"
        CHECK (status IN ('BORRADOR','COTIZADA','ACEPTADA','VENDIDA','RECHAZADA','CANCELADA'));
      ALTER TABLE quotations ADD CONSTRAINT "CHK_quotations_sold"
        CHECK ((status = 'VENDIDA') = (converted_to_sale_id IS NOT NULL));
      CREATE UNIQUE INDEX "UQ_quotations_converted_to_sale" ON quotations (converted_to_sale_id)
        WHERE converted_to_sale_id IS NOT NULL;
    `);

    await patchConfirmSale(queryRunner, SALE_PRICE_FROM, SALE_PRICE_TO);

    await queryRunner.query(`
      DROP FUNCTION create_quotation(UUID, UUID, DATE, JSONB, VARCHAR, VARCHAR);

      -- Creates a quotation for a typed-in customer (or a registered client).
      -- Never touches inventory: no stock change, no movement.
      CREATE OR REPLACE FUNCTION create_quotation(
        p_user_id UUID, p_client_id UUID, p_customer JSONB, p_expiration_date DATE,
        p_items JSONB, p_observations VARCHAR, p_commercial_terms VARCHAR, p_as_draft BOOLEAN
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_quotation_id UUID;
        v_item JSONB;
        v_product_id UUID;
        v_quantity INT;
        v_discount NUMERIC(12,2);
        v_product RECORD;
        v_line_subtotal NUMERIC(12,2);
        v_line_total NUMERIC(12,2);
        v_subtotal NUMERIC(12,2) := 0;
        v_total_discount NUMERIC(12,2) := 0;
        v_name TEXT := NULLIF(btrim(COALESCE(p_customer->>'name', '')), '');
        v_phone TEXT := NULLIF(btrim(COALESCE(p_customer->>'phone', '')), '');
      BEGIN
        IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
          RAISE EXCEPTION 'QUOTATION_EMPTY';
        END IF;
        IF p_client_id IS NOT NULL THEN
          SELECT COALESCE(v_name, name) INTO v_name FROM clients WHERE id = p_client_id AND is_active = true;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'CLIENT_NOT_FOUND:%', p_client_id;
          END IF;
        ELSE
          IF v_name IS NULL OR length(v_name) < 3 OR length(v_name) > 150 THEN
            RAISE EXCEPTION 'QUOTATION_INVALID_CUSTOMER_NAME';
          END IF;
          IF v_phone IS NULL OR v_phone !~ '^[+0-9 ()-]{8,20}$'
             OR length(regexp_replace(v_phone, '[^0-9]', '', 'g')) < 8 THEN
            RAISE EXCEPTION 'QUOTATION_INVALID_PHONE';
          END IF;
        END IF;
        IF p_expiration_date < (now() AT TIME ZONE 'America/Guatemala')::DATE THEN
          RAISE EXCEPTION 'INVALID_EXPIRATION_DATE';
        END IF;

        INSERT INTO quotations (id, quotation_number, client_id, customer_name, customer_phone,
                                student_name, grade, user_id, expiration_date, subtotal, discount, total,
                                observations, commercial_terms, status)
        VALUES (gen_random_uuid(), 'COT-' || LPAD(nextval('quotation_number_seq')::text, 6, '0'),
                p_client_id, v_name, v_phone,
                NULLIF(btrim(COALESCE(p_customer->>'studentName', '')), ''),
                NULLIF(btrim(COALESCE(p_customer->>'grade', '')), ''),
                p_user_id, p_expiration_date, 0, 0, 0, p_observations, p_commercial_terms,
                CASE WHEN COALESCE(p_as_draft, FALSE) THEN 'BORRADOR' ELSE 'COTIZADA' END)
        RETURNING id INTO v_quotation_id;

        FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
        LOOP
          v_product_id := (v_item->>'productId')::UUID;
          v_quantity := (v_item->>'quantity')::INT;
          v_discount := COALESCE((v_item->>'discount')::NUMERIC(12,2), 0);
          IF v_quantity IS NULL OR v_quantity <= 0 THEN
            RAISE EXCEPTION 'INVALID_QUANTITY:%', v_product_id;
          END IF;
          IF v_discount < 0 THEN
            RAISE EXCEPTION 'INVALID_DISCOUNT:%', v_product_id;
          END IF;
          SELECT id, name, public_price, is_active INTO v_product FROM products WHERE id = v_product_id;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'PRODUCT_NOT_FOUND:%', v_product_id;
          END IF;
          IF NOT v_product.is_active THEN
            RAISE EXCEPTION 'PRODUCT_INACTIVE:%', v_product_id;
          END IF;
          v_line_subtotal := v_product.public_price * v_quantity;
          IF v_discount > v_line_subtotal THEN
            RAISE EXCEPTION 'INVALID_DISCOUNT:%', v_product_id;
          END IF;
          v_line_total := v_line_subtotal - v_discount;
          v_subtotal := v_subtotal + v_line_subtotal;
          v_total_discount := v_total_discount + v_discount;
          INSERT INTO quotation_details (id, quotation_id, product_id, product_name, presentation_name,
                                         quantity, unit_price, discount, subtotal, total)
          VALUES (gen_random_uuid(), v_quotation_id, v_product_id, v_product.name, NULL,
                  v_quantity, v_product.public_price, v_discount, v_line_subtotal, v_line_total);
        END LOOP;

        UPDATE quotations SET subtotal = v_subtotal, discount = v_total_discount,
                              total = v_subtotal - v_total_discount
         WHERE id = v_quotation_id;
        RETURN v_quotation_id;
      END;
      $$;

      -- Commercial life cycle (no inventory effect). VENDIDA only through the sale conversion.
      CREATE OR REPLACE FUNCTION change_quotation_status(
        p_quotation_id UUID, p_action TEXT, p_user_id UUID, p_reason TEXT
      ) RETURNS TEXT
      LANGUAGE plpgsql AS $$
      DECLARE
        v_q quotations%ROWTYPE;
        v_today DATE := (now() AT TIME ZONE 'America/Guatemala')::DATE;
      BEGIN
        SELECT * INTO v_q FROM quotations WHERE id = p_quotation_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'QUOTATION_NOT_FOUND';
        END IF;
        IF p_action IN ('RECHAZAR','CANCELAR')
           AND (p_reason IS NULL OR length(btrim(p_reason)) < 5 OR length(p_reason) > 255) THEN
          RAISE EXCEPTION 'QUOTATION_REASON_REQUIRED';
        END IF;
        IF v_q.status = 'VENDIDA' THEN
          RAISE EXCEPTION 'QUOTATION_ALREADY_SOLD';
        END IF;

        IF p_action = 'CONFIRMAR' AND v_q.status = 'BORRADOR' THEN
          UPDATE quotations SET status = 'COTIZADA', updated_at = now() WHERE id = p_quotation_id;
          RETURN 'COTIZADA';
        ELSIF p_action = 'ACEPTAR' AND v_q.status = 'COTIZADA' THEN
          IF v_q.expiration_date < v_today THEN
            RAISE EXCEPTION 'QUOTATION_EXPIRED';
          END IF;
          UPDATE quotations SET status = 'ACEPTADA', accepted_at = now(), accepted_by = p_user_id, updated_at = now()
           WHERE id = p_quotation_id;
          RETURN 'ACEPTADA';
        ELSIF p_action = 'RECHAZAR' AND v_q.status IN ('COTIZADA','ACEPTADA') THEN
          UPDATE quotations SET status = 'RECHAZADA', rejected_at = now(), rejected_by = p_user_id,
                                reject_reason = btrim(p_reason), updated_at = now()
           WHERE id = p_quotation_id;
          RETURN 'RECHAZADA';
        ELSIF p_action = 'CANCELAR' AND v_q.status IN ('BORRADOR','COTIZADA','ACEPTADA','RECHAZADA') THEN
          UPDATE quotations SET status = 'CANCELADA', voided_at = now(), voided_by = p_user_id,
                                void_reason = btrim(p_reason), updated_at = now()
           WHERE id = p_quotation_id;
          RETURN 'CANCELADA';
        ELSIF p_action = 'CANCELAR' AND v_q.status = 'CANCELADA' THEN
          RAISE EXCEPTION 'QUOTATION_ALREADY_VOIDED';
        END IF;
        RAISE EXCEPTION 'QUOTATION_INVALID_TRANSITION:%', v_q.status;
      END;
      $$;

      -- "Confirmar venta": one sale per quotation, with the quoted prices, through Ventas.
      CREATE OR REPLACE FUNCTION convert_quotation_to_sale(p_quotation_id UUID, p_user_id UUID) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_q quotations%ROWTYPE;
        v_vitrina UUID;
        v_line RECORD;
        v_stock INT;
        v_items JSONB;
        v_sale UUID;
      BEGIN
        SELECT * INTO v_q FROM quotations WHERE id = p_quotation_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'QUOTATION_NOT_FOUND';
        END IF;
        -- Double click / retry: the sale already exists, nothing is discounted again.
        IF v_q.status = 'VENDIDA' THEN
          RETURN v_q.converted_to_sale_id;
        END IF;
        IF v_q.status NOT IN ('COTIZADA','ACEPTADA') THEN
          RAISE EXCEPTION 'QUOTATION_NOT_SELLABLE:%', v_q.status;
        END IF;
        IF v_q.status = 'COTIZADA' AND v_q.expiration_date < (now() AT TIME ZONE 'America/Guatemala')::DATE THEN
          RAISE EXCEPTION 'QUOTATION_EXPIRED';
        END IF;

        SELECT id INTO v_vitrina FROM inventory_locations WHERE name = 'Vitrina';
        IF v_vitrina IS NULL THEN
          RAISE EXCEPTION 'LOCATION_NOT_FOUND:Vitrina';
        END IF;
        -- Friendly validation (product names) under the same product locks Ventas takes.
        FOR v_line IN
          SELECT d.product_id, SUM(d.quantity)::INT AS qty, max(p.name) AS name, bool_and(p.is_active) AS active
            FROM quotation_details d JOIN products p ON p.id = d.product_id
           WHERE d.quotation_id = p_quotation_id
           GROUP BY d.product_id ORDER BY d.product_id
        LOOP
          PERFORM 1 FROM products WHERE id = v_line.product_id FOR UPDATE;
          IF NOT v_line.active THEN
            RAISE EXCEPTION 'QUOTATION_PRODUCT_INACTIVE:%', v_line.name;
          END IF;
          PERFORM ensure_inventory_stock_row(v_line.product_id, v_vitrina);
          SELECT quantity INTO v_stock FROM inventory_stock
           WHERE product_id = v_line.product_id AND location_id = v_vitrina FOR UPDATE;
          IF v_stock < v_line.qty THEN
            RAISE EXCEPTION 'QUOTATION_INSUFFICIENT_STOCK:%:%:%', v_stock, v_line.qty, v_line.name;
          END IF;
        END LOOP;

        SELECT jsonb_agg(jsonb_build_object('productId', product_id, 'quantity', quantity,
                                            'unitPrice', unit_price, 'lineTotal', total)
                         ORDER BY product_id, id)
          INTO v_items
          FROM quotation_details WHERE quotation_id = p_quotation_id;
        v_sale := confirm_sale(p_user_id, v_items, v_q.client_id, 'PUBLIC');

        UPDATE quotations SET status = 'VENDIDA', converted_to_sale_id = v_sale,
                              sold_at = now(), sold_by = p_user_id, updated_at = now()
         WHERE id = p_quotation_id;
        RETURN v_sale;
      END;
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const [row] = (await queryRunner.query(`
      SELECT count(*) FILTER (WHERE status IN ('BORRADOR','VENDIDA','RECHAZADA'))::INT AS new_states,
             count(*) FILTER (WHERE client_id IS NULL)::INT AS manual
        FROM quotations
    `)) as { new_states: number; manual: number }[];
    if (row.new_states > 0 || row.manual > 0) {
      throw new Error(
        `No se puede revertir: hay ${row.new_states} cotización(es) en estados nuevos y ${row.manual} con cliente capturado a mano.`,
      );
    }
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS convert_quotation_to_sale(UUID, UUID);
      DROP FUNCTION IF EXISTS change_quotation_status(UUID, TEXT, UUID, TEXT);
      DROP FUNCTION IF EXISTS create_quotation(UUID, UUID, JSONB, DATE, JSONB, VARCHAR, VARCHAR, BOOLEAN);
    `);
    await queryRunner.query(OLD_CREATE_QUOTATION);
    await patchConfirmSale(queryRunner, SALE_PRICE_TO, SALE_PRICE_FROM);
    await queryRunner.query(`
      DROP INDEX "UQ_quotations_converted_to_sale";
      ALTER TABLE quotations DROP CONSTRAINT "CHK_quotations_sold";
      ALTER TABLE quotations DROP CONSTRAINT "CHK_quotations_status";
      UPDATE quotations SET status = 'PENDIENTE' WHERE status = 'COTIZADA';
      UPDATE quotations SET status = 'ANULADA' WHERE status = 'CANCELADA';
      ALTER TABLE quotations ADD CONSTRAINT "CHK_quotations_status"
        CHECK (status IN ('PENDIENTE','ACEPTADA','ANULADA'));
      ALTER TABLE quotations DROP CONSTRAINT "CHK_quotations_customer";
      ALTER TABLE quotations
        DROP COLUMN customer_name, DROP COLUMN customer_phone, DROP COLUMN student_name,
        DROP COLUMN grade, DROP COLUMN accepted_at, DROP COLUMN accepted_by,
        DROP COLUMN rejected_at, DROP COLUMN rejected_by, DROP COLUMN reject_reason,
        DROP COLUMN sold_at, DROP COLUMN sold_by;
      ALTER TABLE quotations ALTER COLUMN client_id SET NOT NULL;
    `);
  }
}
