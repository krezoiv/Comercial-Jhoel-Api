import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Listas Escolares — official school-supply templates per grade, customer
 * quotations built from them, and an account statement per quotation
 * (anticipo, abonos, devolución) with audited reversals.
 *
 * Design decisions (agreed with the business owner):
 *  - Payments live ONLY in the quotation's account statement: they never move
 *    the Caja de ventas, Control de Efectivo or bank balances.
 *  - A line is either an inventory product (its name/price are copied) or a
 *    free-text product. The quotation keeps its own copy of every line, so a
 *    later change to the template or to the product never alters it.
 *  - Delivering only changes the status (it requires the quotation fully
 *    paid): no sale is created and inventory is never touched.
 *  - Cancelling a quotation that received money records a DEVOLUCION for the
 *    whole amount paid; the original payments are kept.
 *
 * Integrity: every write goes through a plpgsql function that locks the
 * quotation row (`FOR UPDATE`), re-validates every amount server-side, checks
 * the role (`school_list_assert_permission`, same map as the API policy) and
 * is idempotent (`idempotency_key` UNIQUE). Payments and history are
 * append-only (guard triggers); a payment is corrected by an ANULACION row.
 *
 * `down` drops the functions; the tables are dropped only when no quotation
 * was ever registered (never deletes business data).
 */
export class SchoolLists1760007900000 implements MigrationInterface {
  name = 'SchoolLists1760007900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Tables ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE SEQUENCE IF NOT EXISTS school_quotation_number_seq;
      CREATE SEQUENCE IF NOT EXISTS school_payment_receipt_seq;

      CREATE TABLE school_list_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(120) NOT NULL,
        grade VARCHAR(60) NOT NULL,
        description VARCHAR(500),
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        sort_order INT NOT NULL DEFAULT 100,
        version INT NOT NULL DEFAULT 1,
        created_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        updated_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_school_list_templates_name" UNIQUE (name)
      );

      CREATE TABLE school_list_template_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        template_id UUID NOT NULL REFERENCES school_list_templates(id) ON DELETE RESTRICT,
        line_no INT NOT NULL,
        product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
        product_name VARCHAR(150) NOT NULL,
        description VARCHAR(255),
        quantity INT NOT NULL CHECK (quantity BETWEEN 1 AND 9999),
        unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
        subtotal NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
        observations VARCHAR(255)
      );
      CREATE INDEX "IDX_school_list_template_items_template" ON school_list_template_items (template_id, line_no);

      CREATE TABLE school_quotations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quotation_number VARCHAR(20) NOT NULL UNIQUE,
        template_id UUID REFERENCES school_list_templates(id) ON DELETE RESTRICT,
        template_name VARCHAR(120),
        grade VARCHAR(60) NOT NULL,
        customer_name VARCHAR(150) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        student_name VARCHAR(150),
        quotation_date DATE NOT NULL,
        delivery_date DATE,
        observations VARCHAR(1000),
        subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
        discount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
        total NUMERIC(12,2) NOT NULL CHECK (total > 0),
        status VARCHAR(20) NOT NULL CHECK (status IN (
          'BORRADOR','COTIZADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','PAGADA',
          'EN_PREPARACION','ENTREGADA','CANCELADA')),
        version INT NOT NULL DEFAULT 1,
        idempotency_key VARCHAR(100) NOT NULL UNIQUE,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        updated_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        delivered_at TIMESTAMPTZ,
        delivered_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        cancelled_at TIMESTAMPTZ,
        cancelled_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        cancel_reason VARCHAR(500),
        cancel_idempotency_key VARCHAR(100) UNIQUE,
        CONSTRAINT "CHK_school_quotations_total" CHECK (total = subtotal - discount),
        CONSTRAINT "CHK_school_quotations_delivery" CHECK (delivery_date IS NULL OR delivery_date >= quotation_date)
      );
      CREATE INDEX "IDX_school_quotations_date" ON school_quotations (quotation_date DESC, created_at DESC);
      CREATE INDEX "IDX_school_quotations_status" ON school_quotations (status);
      CREATE INDEX "IDX_school_quotations_grade" ON school_quotations (grade);

      CREATE TABLE school_quotation_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quotation_id UUID NOT NULL REFERENCES school_quotations(id) ON DELETE RESTRICT,
        line_no INT NOT NULL,
        source VARCHAR(12) NOT NULL CHECK (source IN ('PLANTILLA','INVENTARIO','MANUAL')),
        template_item_id UUID REFERENCES school_list_template_items(id) ON DELETE SET NULL,
        product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
        product_name VARCHAR(150) NOT NULL,
        description VARCHAR(255),
        quantity INT NOT NULL CHECK (quantity BETWEEN 1 AND 9999),
        unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
        discount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
        subtotal NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price - discount) STORED,
        observations VARCHAR(255),
        CONSTRAINT "CHK_school_quotation_items_discount" CHECK (discount <= quantity * unit_price)
      );
      CREATE INDEX "IDX_school_quotation_items_quotation" ON school_quotation_items (quotation_id, line_no);

      CREATE TABLE school_quotation_payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quotation_id UUID NOT NULL REFERENCES school_quotations(id) ON DELETE RESTRICT,
        receipt_number VARCHAR(20) NOT NULL UNIQUE,
        kind VARCHAR(12) NOT NULL CHECK (kind IN ('ANTICIPO','ABONO','DEVOLUCION','ANULACION')),
        amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
        payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('EFECTIVO','TRANSFERENCIA','DEPOSITO','TARJETA','OTRO')),
        bank_id UUID REFERENCES banks(id) ON DELETE RESTRICT,
        reference VARCHAR(60),
        observations VARCHAR(500),
        balance_after NUMERIC(12,2) NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'APLICADO' CHECK (status IN ('APLICADO','ANULADO')),
        reversal_of_id UUID REFERENCES school_quotation_payments(id) ON DELETE RESTRICT,
        received_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        voided_at TIMESTAMPTZ,
        voided_by UUID REFERENCES users(id) ON DELETE RESTRICT,
        void_reason VARCHAR(500),
        idempotency_key VARCHAR(100) NOT NULL UNIQUE,
        CONSTRAINT "CHK_school_payments_reversal" CHECK ((kind = 'ANULACION') = (reversal_of_id IS NOT NULL))
      );
      CREATE INDEX "IDX_school_quotation_payments_quotation" ON school_quotation_payments (quotation_id, received_at);
      CREATE UNIQUE INDEX "UQ_school_quotation_payments_reversal" ON school_quotation_payments (reversal_of_id) WHERE reversal_of_id IS NOT NULL;

      CREATE TABLE school_list_history (
        id BIGSERIAL PRIMARY KEY,
        entity_type VARCHAR(10) NOT NULL CHECK (entity_type IN ('TEMPLATE','QUOTATION')),
        entity_id UUID NOT NULL,
        action VARCHAR(20) NOT NULL,
        from_status VARCHAR(20),
        to_status VARCHAR(20),
        details JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX "IDX_school_list_history_entity" ON school_list_history (entity_type, entity_id, id);
    `);

    // ── Guards: append-only payments/history, quotations never deleted ────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION school_list_append_only_guard() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      BEGIN
        RAISE EXCEPTION 'SCHOOL_RECORD_IMMUTABLE:%', TG_TABLE_NAME;
      END;
      $$;

      CREATE OR REPLACE FUNCTION school_payment_guard() RETURNS TRIGGER
      LANGUAGE plpgsql AS $$
      BEGIN
        IF TG_OP = 'DELETE' THEN
          RAISE EXCEPTION 'SCHOOL_RECORD_IMMUTABLE:%', TG_TABLE_NAME;
        END IF;
        -- Only APLICADO → ANULADO with its audit fields; everything else is frozen.
        IF OLD.status <> 'APLICADO' OR NEW.status <> 'ANULADO'
           OR (to_jsonb(NEW) - ARRAY['status','voided_at','voided_by','void_reason'])
              <> (to_jsonb(OLD) - ARRAY['status','voided_at','voided_by','void_reason']) THEN
          RAISE EXCEPTION 'SCHOOL_RECORD_IMMUTABLE:%', TG_TABLE_NAME;
        END IF;
        RETURN NEW;
      END;
      $$;

      CREATE TRIGGER trg_school_payments_guard BEFORE UPDATE OR DELETE ON school_quotation_payments
        FOR EACH ROW EXECUTE FUNCTION school_payment_guard();
      CREATE TRIGGER trg_school_history_guard BEFORE UPDATE OR DELETE ON school_list_history
        FOR EACH ROW EXECUTE FUNCTION school_list_append_only_guard();
      CREATE TRIGGER trg_school_quotations_no_delete BEFORE DELETE ON school_quotations
        FOR EACH ROW EXECUTE FUNCTION school_list_append_only_guard();
      CREATE TRIGGER trg_school_templates_no_delete BEFORE DELETE ON school_list_templates
        FOR EACH ROW EXECUTE FUNCTION school_list_append_only_guard();
    `);

    // ── Roles (same map as SCHOOL_LIST_PERMISSION_ROLES in the API) ───────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION school_list_assert_permission(p_user_id UUID, p_permission TEXT) RETURNS TEXT
      LANGUAGE plpgsql STABLE AS $$
      DECLARE
        v_role TEXT;
        v_allowed TEXT[];
      BEGIN
        SELECT r.name INTO v_role FROM users u JOIN roles r ON r.id = u.role_id
         WHERE u.id = p_user_id AND u.is_active;
        v_allowed := CASE p_permission
          WHEN 'school_lists.templates.manage' THEN ARRAY['SUPER_ADMIN','ADMIN']
          WHEN 'school_lists.payments.void'    THEN ARRAY['SUPER_ADMIN','ADMIN']
          WHEN 'school_lists.prices.override'  THEN ARRAY['SUPER_ADMIN','ADMIN','SUPERVISOR_DE_TURNO']
          WHEN 'school_lists.quotations.cancel' THEN ARRAY['SUPER_ADMIN','ADMIN','SUPERVISOR_DE_TURNO']
          WHEN 'school_lists.view'              THEN ARRAY['SUPER_ADMIN','ADMIN','SUPERVISOR_DE_TURNO','USER']
          WHEN 'school_lists.quotations.create' THEN ARRAY['SUPER_ADMIN','ADMIN','SUPERVISOR_DE_TURNO','USER']
          WHEN 'school_lists.quotations.edit'   THEN ARRAY['SUPER_ADMIN','ADMIN','SUPERVISOR_DE_TURNO','USER']
          WHEN 'school_lists.payments.register' THEN ARRAY['SUPER_ADMIN','ADMIN','SUPERVISOR_DE_TURNO','USER']
          ELSE ARRAY[]::TEXT[]
        END;
        IF v_role IS NULL OR NOT (v_role = ANY (v_allowed)) THEN
          RAISE EXCEPTION 'SCHOOL_LIST_FORBIDDEN:%', p_permission;
        END IF;
        RETURN v_role;
      END;
      $$;

      CREATE OR REPLACE FUNCTION school_list_has_permission(p_user_id UUID, p_permission TEXT) RETURNS BOOLEAN
      LANGUAGE plpgsql STABLE AS $$
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, p_permission);
        RETURN TRUE;
      EXCEPTION WHEN raise_exception THEN
        RETURN FALSE;
      END;
      $$;

      CREATE OR REPLACE FUNCTION school_list_assert_money(p_value NUMERIC, p_code TEXT) RETURNS VOID
      LANGUAGE plpgsql IMMUTABLE AS $$
      BEGIN
        IF p_value IS NULL OR p_value < 0 OR p_value > 999999.99 OR p_value <> round(p_value, 2) THEN
          RAISE EXCEPTION '%', p_code;
        END IF;
      END;
      $$;
    `);

    // ── Templates ─────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION school_list_template_insert_items(p_template_id UUID, p_items JSONB) RETURNS INT
      LANGUAGE plpgsql AS $$
      DECLARE
        v_item JSONB;
        v_line INT := 0;
        v_qty NUMERIC;
        v_price NUMERIC;
        v_product UUID;
        v_name TEXT;
      BEGIN
        IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_ITEMS';
        END IF;
        FOR v_item IN SELECT value FROM jsonb_array_elements(p_items) LOOP
          v_line := v_line + 1;
          v_name := btrim(COALESCE(v_item->>'productName', ''));
          v_qty := (v_item->>'quantity')::NUMERIC;
          v_price := (v_item->>'unitPrice')::NUMERIC;
          v_product := NULLIF(v_item->>'productId', '')::UUID;
          IF length(v_name) < 2 OR length(v_name) > 150 THEN
            RAISE EXCEPTION 'SCHOOL_INVALID_PRODUCT_NAME:%', v_line;
          END IF;
          IF v_qty IS NULL OR v_qty <> trunc(v_qty) OR v_qty < 1 OR v_qty > 9999 THEN
            RAISE EXCEPTION 'SCHOOL_INVALID_QUANTITY:%', v_name;
          END IF;
          PERFORM school_list_assert_money(v_price, 'SCHOOL_INVALID_PRICE:' || v_name);
          IF v_product IS NOT NULL AND NOT EXISTS (SELECT 1 FROM products WHERE id = v_product) THEN
            RAISE EXCEPTION 'SCHOOL_PRODUCT_NOT_FOUND:%', v_name;
          END IF;
          INSERT INTO school_list_template_items
            (template_id, line_no, product_id, product_name, description, quantity, unit_price, observations)
          VALUES (p_template_id, v_line, v_product, v_name,
                  NULLIF(btrim(COALESCE(v_item->>'description', '')), ''),
                  v_qty::INT, v_price,
                  NULLIF(btrim(COALESCE(v_item->>'observations', '')), ''));
        END LOOP;
        RETURN v_line;
      END;
      $$;

      -- Creates (p_template_id NULL) or replaces a template and its lines.
      -- Template lines are configuration: quotations keep their own copy.
      CREATE OR REPLACE FUNCTION save_school_list_template(
        p_template_id UUID, p_payload JSONB, p_user_id UUID, p_expected_version INT
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_id UUID := p_template_id;
        v_name TEXT := btrim(COALESCE(p_payload->>'name', ''));
        v_grade TEXT := btrim(COALESCE(p_payload->>'grade', ''));
        v_old school_list_templates%ROWTYPE;
        v_count INT;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.templates.manage');
        IF length(v_name) < 3 OR length(v_name) > 120 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_TEMPLATE_NAME';
        END IF;
        IF length(v_grade) < 3 OR length(v_grade) > 60 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_GRADE';
        END IF;

        BEGIN
          IF v_id IS NULL THEN
            INSERT INTO school_list_templates (name, grade, description, is_active, created_by, updated_by)
            VALUES (v_name, v_grade, NULLIF(btrim(COALESCE(p_payload->>'description', '')), ''),
                    COALESCE((p_payload->>'isActive')::BOOLEAN, TRUE), p_user_id, p_user_id)
            RETURNING id INTO v_id;
          ELSE
            SELECT * INTO v_old FROM school_list_templates WHERE id = v_id FOR UPDATE;
            IF NOT FOUND THEN
              RAISE EXCEPTION 'SCHOOL_TEMPLATE_NOT_FOUND';
            END IF;
            IF p_expected_version IS NOT NULL AND v_old.version <> p_expected_version THEN
              RAISE EXCEPTION 'SCHOOL_VERSION_CONFLICT';
            END IF;
            UPDATE school_list_templates
               SET name = v_name, grade = v_grade,
                   description = NULLIF(btrim(COALESCE(p_payload->>'description', '')), ''),
                   is_active = COALESCE((p_payload->>'isActive')::BOOLEAN, is_active),
                   version = version + 1, updated_by = p_user_id, updated_at = now()
             WHERE id = v_id;
            DELETE FROM school_list_template_items WHERE template_id = v_id;
          END IF;
        EXCEPTION WHEN unique_violation THEN
          RAISE EXCEPTION 'SCHOOL_TEMPLATE_NAME_TAKEN';
        END;

        v_count := school_list_template_insert_items(v_id, p_payload->'items');
        INSERT INTO school_list_history (entity_type, entity_id, action, details, created_by)
        VALUES ('TEMPLATE', v_id, CASE WHEN p_template_id IS NULL THEN 'CREADA' ELSE 'EDITADA' END,
                jsonb_build_object('name', v_name, 'grade', v_grade, 'items', v_count,
                                   'previousName', v_old.name), p_user_id);
        RETURN v_id;
      END;
      $$;

      CREATE OR REPLACE FUNCTION set_school_list_template_active(
        p_template_id UUID, p_active BOOLEAN, p_user_id UUID
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.templates.manage');
        UPDATE school_list_templates
           SET is_active = p_active, version = version + 1, updated_by = p_user_id, updated_at = now()
         WHERE id = p_template_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_TEMPLATE_NOT_FOUND';
        END IF;
        INSERT INTO school_list_history (entity_type, entity_id, action, details, created_by)
        VALUES ('TEMPLATE', p_template_id, CASE WHEN p_active THEN 'ACTIVADA' ELSE 'DESACTIVADA' END, '{}'::jsonb, p_user_id);
        RETURN p_template_id;
      END;
      $$;

      CREATE OR REPLACE FUNCTION duplicate_school_list_template(
        p_template_id UUID, p_name TEXT, p_grade TEXT, p_user_id UUID
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_source school_list_templates%ROWTYPE;
        v_id UUID;
        v_name TEXT := btrim(COALESCE(p_name, ''));
        v_grade TEXT;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.templates.manage');
        SELECT * INTO v_source FROM school_list_templates WHERE id = p_template_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_TEMPLATE_NOT_FOUND';
        END IF;
        v_grade := btrim(COALESCE(NULLIF(btrim(p_grade), ''), v_source.grade));
        IF length(v_name) < 3 OR length(v_name) > 120 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_TEMPLATE_NAME';
        END IF;
        IF length(v_grade) < 3 OR length(v_grade) > 60 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_GRADE';
        END IF;
        BEGIN
          INSERT INTO school_list_templates (name, grade, description, is_active, sort_order, created_by, updated_by)
          VALUES (v_name, v_grade, v_source.description, TRUE, v_source.sort_order, p_user_id, p_user_id)
          RETURNING id INTO v_id;
        EXCEPTION WHEN unique_violation THEN
          RAISE EXCEPTION 'SCHOOL_TEMPLATE_NAME_TAKEN';
        END;
        INSERT INTO school_list_template_items
          (template_id, line_no, product_id, product_name, description, quantity, unit_price, observations)
        SELECT v_id, line_no, product_id, product_name, description, quantity, unit_price, observations
          FROM school_list_template_items WHERE template_id = p_template_id;
        INSERT INTO school_list_history (entity_type, entity_id, action, details, created_by)
        VALUES ('TEMPLATE', v_id, 'DUPLICADA',
                jsonb_build_object('sourceId', p_template_id, 'sourceName', v_source.name), p_user_id);
        RETURN v_id;
      END;
      $$;
    `);

    // ── Quotation helpers ─────────────────────────────────────────────────
    await queryRunner.query(`
      -- Net amount received: anticipos + abonos still applied − devoluciones.
      CREATE OR REPLACE FUNCTION school_quotation_paid(p_quotation_id UUID) RETURNS NUMERIC
      LANGUAGE sql STABLE AS $$
        SELECT COALESCE(SUM(CASE
                 WHEN kind IN ('ANTICIPO','ABONO') AND status = 'APLICADO' THEN amount
                 WHEN kind = 'DEVOLUCION' THEN -amount
                 ELSE 0 END), 0)::NUMERIC(12,2)
          FROM school_quotation_payments WHERE quotation_id = p_quotation_id
      $$;

      -- Payment-driven status; manual workflow states are kept as they are.
      CREATE OR REPLACE FUNCTION school_quotation_refresh_status(p_quotation_id UUID) RETURNS TEXT
      LANGUAGE plpgsql AS $$
      DECLARE
        v_q school_quotations%ROWTYPE;
        v_paid NUMERIC;
        v_status TEXT;
      BEGIN
        SELECT * INTO v_q FROM school_quotations WHERE id = p_quotation_id;
        IF v_q.status IN ('BORRADOR','EN_PREPARACION','ENTREGADA','CANCELADA') THEN
          RETURN v_q.status;
        END IF;
        v_paid := school_quotation_paid(p_quotation_id);
        IF v_paid >= v_q.total THEN
          v_status := 'PAGADA';
        ELSIF v_paid = 0 THEN
          v_status := 'COTIZADA';
        ELSIF NOT EXISTS (SELECT 1 FROM school_quotation_payments
                           WHERE quotation_id = p_quotation_id AND kind = 'ABONO' AND status = 'APLICADO') THEN
          v_status := 'ANTICIPO_RECIBIDO';
        ELSE
          v_status := 'PAGO_PARCIAL';
        END IF;
        IF v_status <> v_q.status THEN
          UPDATE school_quotations SET status = v_status WHERE id = p_quotation_id;
        END IF;
        RETURN v_status;
      END;
      $$;

      -- Validates and inserts the lines of a quotation; returns subtotal and discount.
      -- A price/discount different from its reference (the line already saved,
      -- the template line or the product's public price) needs
      -- school_lists.prices.override. Free-text lines have no reference price.
      CREATE OR REPLACE FUNCTION school_quotation_insert_items(
        p_quotation_id UUID, p_template_id UUID, p_items JSONB, p_can_override BOOLEAN, p_existing JSONB,
        OUT o_subtotal NUMERIC, OUT o_discount NUMERIC
      )
      LANGUAGE plpgsql AS $$
      DECLARE
        v_item JSONB;
        v_line INT := 0;
        v_name TEXT;
        v_qty NUMERIC;
        v_price NUMERIC;
        v_disc NUMERIC;
        v_product UUID;
        v_template_item UUID;
        v_ref_price NUMERIC;
        v_ref_disc NUMERIC;
        v_source TEXT;
        v_existing JSONB;
        v_tpl RECORD;
      BEGIN
        o_subtotal := 0;
        o_discount := 0;
        IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_EMPTY';
        END IF;
        IF jsonb_array_length(p_items) > 300 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_ITEMS';
        END IF;
        FOR v_item IN SELECT value FROM jsonb_array_elements(p_items) LOOP
          v_line := v_line + 1;
          v_name := btrim(COALESCE(v_item->>'productName', ''));
          v_qty := (v_item->>'quantity')::NUMERIC;
          v_price := (v_item->>'unitPrice')::NUMERIC;
          v_disc := COALESCE((v_item->>'discount')::NUMERIC, 0);
          v_product := NULLIF(v_item->>'productId', '')::UUID;
          v_template_item := NULLIF(v_item->>'templateItemId', '')::UUID;
          v_existing := p_existing -> COALESCE(v_item->>'itemId', '');
          v_ref_price := NULL;
          v_ref_disc := 0;

          IF length(v_name) < 2 OR length(v_name) > 150 THEN
            RAISE EXCEPTION 'SCHOOL_INVALID_PRODUCT_NAME:%', v_line;
          END IF;
          IF v_qty IS NULL OR v_qty <> trunc(v_qty) OR v_qty < 1 OR v_qty > 9999 THEN
            RAISE EXCEPTION 'SCHOOL_INVALID_QUANTITY:%', v_name;
          END IF;
          PERFORM school_list_assert_money(v_price, 'SCHOOL_INVALID_PRICE:' || v_name);
          PERFORM school_list_assert_money(v_disc, 'SCHOOL_INVALID_DISCOUNT:' || v_name);
          IF v_disc > v_qty * v_price THEN
            RAISE EXCEPTION 'SCHOOL_INVALID_DISCOUNT:%', v_name;
          END IF;

          IF v_existing IS NOT NULL THEN
            -- A line already saved in this quotation keeps its own origin and price reference.
            v_source := v_existing->>'source';
            v_template_item := NULLIF(v_existing->>'templateItemId', '')::UUID;
            v_ref_price := (v_existing->>'unitPrice')::NUMERIC;
            v_ref_disc := (v_existing->>'discount')::NUMERIC;
            IF v_product IS DISTINCT FROM NULLIF(v_existing->>'productId', '')::UUID THEN
              RAISE EXCEPTION 'SCHOOL_INVALID_ITEMS';
            END IF;
          ELSIF v_template_item IS NOT NULL THEN
            SELECT product_id, unit_price INTO v_tpl
              FROM school_list_template_items
             WHERE id = v_template_item AND template_id IS NOT DISTINCT FROM p_template_id;
            IF NOT FOUND OR v_tpl.product_id IS DISTINCT FROM v_product THEN
              RAISE EXCEPTION 'SCHOOL_INVALID_TEMPLATE_ITEM:%', v_name;
            END IF;
            v_source := 'PLANTILLA';
            v_ref_price := v_tpl.unit_price;
          ELSIF v_product IS NOT NULL THEN
            SELECT public_price INTO v_ref_price FROM products WHERE id = v_product AND is_active;
            IF NOT FOUND THEN
              IF EXISTS (SELECT 1 FROM products WHERE id = v_product) THEN
                RAISE EXCEPTION 'SCHOOL_PRODUCT_INACTIVE:%', v_name;
              END IF;
              RAISE EXCEPTION 'SCHOOL_PRODUCT_NOT_FOUND:%', v_name;
            END IF;
            v_source := 'INVENTARIO';
          ELSE
            v_source := 'MANUAL';
          END IF;

          IF NOT p_can_override THEN
            IF (v_ref_price IS NOT NULL AND v_price <> v_ref_price) OR v_disc <> v_ref_disc THEN
              RAISE EXCEPTION 'SCHOOL_PRICE_OVERRIDE_FORBIDDEN:%', v_name;
            END IF;
          END IF;

          INSERT INTO school_quotation_items
            (quotation_id, line_no, source, template_item_id, product_id, product_name, description,
             quantity, unit_price, discount, observations)
          VALUES (p_quotation_id, v_line, v_source, v_template_item, v_product, v_name,
                  NULLIF(btrim(COALESCE(v_item->>'description', '')), ''),
                  v_qty::INT, v_price, v_disc,
                  NULLIF(btrim(COALESCE(v_item->>'observations', '')), ''));
          o_subtotal := o_subtotal + v_qty * v_price;
          o_discount := o_discount + v_disc;
        END LOOP;
        IF o_subtotal - o_discount <= 0 THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_TOTAL_ZERO';
        END IF;
      END;
      $$;

      CREATE OR REPLACE FUNCTION school_quotation_assert_customer(p_payload JSONB) RETURNS VOID
      LANGUAGE plpgsql IMMUTABLE AS $$
      DECLARE
        v_name TEXT := btrim(COALESCE(p_payload->>'customerName', ''));
        v_phone TEXT := btrim(COALESCE(p_payload->>'customerPhone', ''));
      BEGIN
        IF length(v_name) < 3 OR length(v_name) > 150 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_CUSTOMER_NAME';
        END IF;
        IF v_phone !~ '^[+0-9 ()-]{8,20}$' OR length(regexp_replace(v_phone, '[^0-9]', '', 'g')) < 8 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_PHONE';
        END IF;
        IF length(COALESCE(p_payload->>'studentName', '')) > 150
           OR length(COALESCE(p_payload->>'observations', '')) > 1000 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_TEXT';
        END IF;
      END;
      $$;

      -- Inserts an ANTICIPO/ABONO on an already locked quotation.
      CREATE OR REPLACE FUNCTION school_quotation_insert_payment(
        p_quotation_id UUID, p_amount NUMERIC, p_method TEXT, p_bank_id UUID,
        p_reference TEXT, p_observations TEXT, p_user_id UUID, p_key TEXT
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_q school_quotations%ROWTYPE;
        v_balance NUMERIC;
        v_kind TEXT;
        v_id UUID;
        v_status TEXT;
      BEGIN
        SELECT * INTO v_q FROM school_quotations WHERE id = p_quotation_id;
        IF v_q.status = 'BORRADOR' THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_DRAFT_NO_PAYMENTS';
        ELSIF v_q.status IN ('CANCELADA','ENTREGADA') THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_CLOSED:%', v_q.status;
        END IF;
        IF p_amount IS NULL OR p_amount <= 0 OR p_amount <> round(p_amount, 2) THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_AMOUNT';
        END IF;
        IF p_method IS NULL OR p_method NOT IN ('EFECTIVO','TRANSFERENCIA','DEPOSITO','TARJETA','OTRO') THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_PAYMENT_METHOD';
        END IF;
        IF p_bank_id IS NOT NULL THEN
          IF p_method NOT IN ('TRANSFERENCIA','DEPOSITO') THEN
            RAISE EXCEPTION 'SCHOOL_INVALID_PAYMENT_METHOD';
          END IF;
          IF NOT EXISTS (SELECT 1 FROM banks WHERE id = p_bank_id AND is_active) THEN
            RAISE EXCEPTION 'SCHOOL_BANK_NOT_FOUND';
          END IF;
        END IF;
        IF length(COALESCE(p_reference, '')) > 60 OR length(COALESCE(p_observations, '')) > 500 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_TEXT';
        END IF;
        IF p_key IS NULL OR length(p_key) < 8 THEN
          RAISE EXCEPTION 'SCHOOL_IDEMPOTENCY_KEY_REQUIRED';
        END IF;

        v_balance := v_q.total - school_quotation_paid(p_quotation_id);
        IF p_amount > v_balance THEN
          RAISE EXCEPTION 'SCHOOL_PAYMENT_EXCEEDS_BALANCE:%', to_char(v_balance, 'FM999999990.00');
        END IF;
        v_kind := CASE WHEN EXISTS (SELECT 1 FROM school_quotation_payments
                                     WHERE quotation_id = p_quotation_id AND kind IN ('ANTICIPO','ABONO')
                                       AND status = 'APLICADO')
                       THEN 'ABONO' ELSE 'ANTICIPO' END;
        INSERT INTO school_quotation_payments
          (quotation_id, receipt_number, kind, amount, payment_method, bank_id, reference, observations,
           balance_after, received_by, idempotency_key)
        VALUES (p_quotation_id, 'RLE-' || lpad(nextval('school_payment_receipt_seq')::TEXT, 6, '0'),
                v_kind, p_amount, p_method, p_bank_id, NULLIF(btrim(COALESCE(p_reference, '')), ''),
                NULLIF(btrim(COALESCE(p_observations, '')), ''), v_balance - p_amount, p_user_id, p_key)
        RETURNING id INTO v_id;
        v_status := school_quotation_refresh_status(p_quotation_id);
        INSERT INTO school_list_history (entity_type, entity_id, action, from_status, to_status, details, created_by)
        VALUES ('QUOTATION', p_quotation_id, 'PAGO', v_q.status, v_status,
                jsonb_build_object('paymentId', v_id, 'kind', v_kind, 'amount', p_amount,
                                   'method', p_method, 'balanceAfter', v_balance - p_amount), p_user_id);
        RETURN v_id;
      END;
      $$;
    `);

    // ── Quotation writers ─────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION create_school_quotation(p_payload JSONB, p_user_id UUID, p_key TEXT) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_id UUID;
        v_template school_list_templates%ROWTYPE;
        v_template_id UUID := NULLIF(p_payload->>'templateId', '')::UUID;
        v_grade TEXT := btrim(COALESCE(p_payload->>'grade', ''));
        v_date DATE := COALESCE(NULLIF(p_payload->>'quotationDate', '')::DATE,
                                (now() AT TIME ZONE 'America/Guatemala')::DATE);
        v_delivery DATE := NULLIF(p_payload->>'deliveryDate', '')::DATE;
        v_draft BOOLEAN := COALESCE((p_payload->>'asDraft')::BOOLEAN, FALSE);
        v_advance JSONB := NULLIF(p_payload->'advance', 'null'::jsonb);
        v_totals RECORD;
        v_can_override BOOLEAN;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.quotations.create');
        IF p_key IS NULL OR length(p_key) < 8 THEN
          RAISE EXCEPTION 'SCHOOL_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        -- Same request twice (double click, retry): the quotation already saved.
        SELECT id INTO v_id FROM school_quotations WHERE idempotency_key = p_key;
        IF FOUND THEN
          RETURN v_id;
        END IF;

        PERFORM school_quotation_assert_customer(p_payload);
        IF v_template_id IS NOT NULL THEN
          SELECT * INTO v_template FROM school_list_templates WHERE id = v_template_id;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'SCHOOL_TEMPLATE_NOT_FOUND';
          END IF;
          IF NOT v_template.is_active THEN
            RAISE EXCEPTION 'SCHOOL_TEMPLATE_INACTIVE';
          END IF;
          v_grade := v_template.grade;
        END IF;
        IF length(v_grade) < 3 OR length(v_grade) > 60 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_GRADE';
        END IF;
        IF v_delivery IS NOT NULL AND v_delivery < v_date THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_DELIVERY_DATE';
        END IF;
        IF v_draft AND v_advance IS NOT NULL THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_DRAFT_NO_PAYMENTS';
        END IF;

        -- Totals start at a placeholder and are set from the validated lines below.
        INSERT INTO school_quotations
          (quotation_number, template_id, template_name, grade, customer_name, customer_phone, student_name,
           quotation_date, delivery_date, observations, subtotal, discount, total, status,
           idempotency_key, created_by, updated_by)
        VALUES ('LE-' || lpad(nextval('school_quotation_number_seq')::TEXT, 6, '0'),
                v_template_id, v_template.name, v_grade,
                btrim(p_payload->>'customerName'), btrim(p_payload->>'customerPhone'),
                NULLIF(btrim(COALESCE(p_payload->>'studentName', '')), ''),
                v_date, v_delivery, NULLIF(btrim(COALESCE(p_payload->>'observations', '')), ''),
                0.01, 0, 0.01, CASE WHEN v_draft THEN 'BORRADOR' ELSE 'COTIZADA' END,
                p_key, p_user_id, p_user_id)
        RETURNING id INTO v_id;

        v_can_override := school_list_has_permission(p_user_id, 'school_lists.prices.override');
        SELECT * INTO v_totals
          FROM school_quotation_insert_items(v_id, v_template_id, p_payload->'items', v_can_override, '{}'::jsonb);
        UPDATE school_quotations
           SET subtotal = v_totals.o_subtotal, discount = v_totals.o_discount,
               total = v_totals.o_subtotal - v_totals.o_discount
         WHERE id = v_id;

        INSERT INTO school_list_history (entity_type, entity_id, action, to_status, details, created_by)
        VALUES ('QUOTATION', v_id, 'CREADA', CASE WHEN v_draft THEN 'BORRADOR' ELSE 'COTIZADA' END,
                jsonb_build_object('total', v_totals.o_subtotal - v_totals.o_discount,
                                   'items', jsonb_array_length(p_payload->'items'),
                                   'template', v_template.name), p_user_id);

        IF v_advance IS NOT NULL THEN
          PERFORM school_list_assert_permission(p_user_id, 'school_lists.payments.register');
          PERFORM school_quotation_insert_payment(
            v_id, (v_advance->>'amount')::NUMERIC, v_advance->>'paymentMethod',
            NULLIF(v_advance->>'bankId', '')::UUID, v_advance->>'reference', v_advance->>'observations',
            p_user_id, p_key || ':ANT');
        END IF;
        RETURN v_id;
      END;
      $$;

      CREATE OR REPLACE FUNCTION update_school_quotation(
        p_quotation_id UUID, p_payload JSONB, p_user_id UUID, p_expected_version INT
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_q school_quotations%ROWTYPE;
        v_existing JSONB;
        v_before JSONB;
        v_totals RECORD;
        v_paid NUMERIC;
        v_delivery DATE := NULLIF(p_payload->>'deliveryDate', '')::DATE;
        v_date DATE;
        v_status TEXT;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.quotations.edit');
        SELECT * INTO v_q FROM school_quotations WHERE id = p_quotation_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_FOUND';
        END IF;
        IF v_q.status IN ('ENTREGADA','CANCELADA') THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_EDITABLE:%', v_q.status;
        END IF;
        IF p_expected_version IS NULL OR v_q.version <> p_expected_version THEN
          RAISE EXCEPTION 'SCHOOL_VERSION_CONFLICT';
        END IF;
        PERFORM school_quotation_assert_customer(p_payload);
        v_date := COALESCE(NULLIF(p_payload->>'quotationDate', '')::DATE, v_q.quotation_date);
        IF v_delivery IS NOT NULL AND v_delivery < v_date THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_DELIVERY_DATE';
        END IF;

        SELECT COALESCE(jsonb_object_agg(id::TEXT, jsonb_build_object(
                 'source', source, 'templateItemId', template_item_id, 'productId', product_id,
                 'unitPrice', unit_price, 'discount', discount)), '{}'::jsonb),
               COALESCE(jsonb_agg(jsonb_build_object(
                 'productName', product_name, 'quantity', quantity, 'unitPrice', unit_price,
                 'discount', discount, 'subtotal', subtotal) ORDER BY line_no), '[]'::jsonb)
          INTO v_existing, v_before
          FROM school_quotation_items WHERE quotation_id = p_quotation_id;

        DELETE FROM school_quotation_items WHERE quotation_id = p_quotation_id;
        SELECT * INTO v_totals FROM school_quotation_insert_items(
          p_quotation_id, v_q.template_id, p_payload->'items',
          school_list_has_permission(p_user_id, 'school_lists.prices.override'), v_existing);

        v_paid := school_quotation_paid(p_quotation_id);
        IF v_totals.o_subtotal - v_totals.o_discount < v_paid THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_TOTAL_BELOW_PAID:%', to_char(v_paid, 'FM999999990.00');
        END IF;

        UPDATE school_quotations
           SET customer_name = btrim(p_payload->>'customerName'),
               customer_phone = btrim(p_payload->>'customerPhone'),
               student_name = NULLIF(btrim(COALESCE(p_payload->>'studentName', '')), ''),
               quotation_date = v_date, delivery_date = v_delivery,
               observations = NULLIF(btrim(COALESCE(p_payload->>'observations', '')), ''),
               subtotal = v_totals.o_subtotal, discount = v_totals.o_discount,
               total = v_totals.o_subtotal - v_totals.o_discount,
               version = version + 1, updated_by = p_user_id, updated_at = now()
         WHERE id = p_quotation_id;
        -- A higher total can turn PAGADA back into a partial payment.
        IF v_q.status = 'PAGADA' THEN
          UPDATE school_quotations SET status = 'PAGO_PARCIAL' WHERE id = p_quotation_id;
        END IF;
        v_status := school_quotation_refresh_status(p_quotation_id);

        INSERT INTO school_list_history (entity_type, entity_id, action, from_status, to_status, details, created_by)
        VALUES ('QUOTATION', p_quotation_id, 'EDITADA', v_q.status, v_status,
                jsonb_build_object(
                  'totalBefore', v_q.total, 'totalAfter', v_totals.o_subtotal - v_totals.o_discount,
                  'itemsBefore', v_before,
                  'customerBefore', jsonb_build_object('name', v_q.customer_name, 'phone', v_q.customer_phone,
                                                       'student', v_q.student_name),
                  'observationsBefore', v_q.observations), p_user_id);
        RETURN p_quotation_id;
      END;
      $$;

      CREATE OR REPLACE FUNCTION set_school_quotation_observations(
        p_quotation_id UUID, p_observations TEXT, p_user_id UUID, p_expected_version INT
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_q school_quotations%ROWTYPE;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.quotations.edit');
        SELECT * INTO v_q FROM school_quotations WHERE id = p_quotation_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_FOUND';
        END IF;
        IF v_q.status IN ('ENTREGADA','CANCELADA') THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_EDITABLE:%', v_q.status;
        END IF;
        IF p_expected_version IS NULL OR v_q.version <> p_expected_version THEN
          RAISE EXCEPTION 'SCHOOL_VERSION_CONFLICT';
        END IF;
        IF length(COALESCE(p_observations, '')) > 1000 THEN
          RAISE EXCEPTION 'SCHOOL_INVALID_TEXT';
        END IF;
        UPDATE school_quotations
           SET observations = NULLIF(btrim(COALESCE(p_observations, '')), ''),
               version = version + 1, updated_by = p_user_id, updated_at = now()
         WHERE id = p_quotation_id;
        INSERT INTO school_list_history (entity_type, entity_id, action, details, created_by)
        VALUES ('QUOTATION', p_quotation_id, 'OBSERVACIONES',
                jsonb_build_object('before', v_q.observations, 'after', NULLIF(btrim(COALESCE(p_observations, '')), '')),
                p_user_id);
        RETURN p_quotation_id;
      END;
      $$;

      -- Workflow: CONFIRMAR (BORRADOR → COTIZADA), PREPARAR (→ EN_PREPARACION),
      -- ENTREGAR (PAGADA/EN_PREPARACION fully paid → ENTREGADA). No inventory, no sale.
      CREATE OR REPLACE FUNCTION change_school_quotation_status(
        p_quotation_id UUID, p_action TEXT, p_user_id UUID, p_expected_version INT
      ) RETURNS TEXT
      LANGUAGE plpgsql AS $$
      DECLARE
        v_q school_quotations%ROWTYPE;
        v_status TEXT;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.quotations.edit');
        SELECT * INTO v_q FROM school_quotations WHERE id = p_quotation_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_FOUND';
        END IF;
        IF p_expected_version IS NOT NULL AND v_q.version <> p_expected_version THEN
          RAISE EXCEPTION 'SCHOOL_VERSION_CONFLICT';
        END IF;

        IF p_action = 'CONFIRMAR' AND v_q.status = 'BORRADOR' THEN
          UPDATE school_quotations SET status = 'COTIZADA' WHERE id = p_quotation_id;
          v_status := school_quotation_refresh_status(p_quotation_id);
        ELSIF p_action = 'PREPARAR' AND v_q.status IN ('COTIZADA','ANTICIPO_RECIBIDO','PAGO_PARCIAL','PAGADA') THEN
          v_status := 'EN_PREPARACION';
          UPDATE school_quotations SET status = v_status WHERE id = p_quotation_id;
        ELSIF p_action = 'ENTREGAR' AND v_q.status IN ('PAGADA','EN_PREPARACION') THEN
          IF school_quotation_paid(p_quotation_id) < v_q.total THEN
            RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_PAID:%',
              to_char(v_q.total - school_quotation_paid(p_quotation_id), 'FM999999990.00');
          END IF;
          v_status := 'ENTREGADA';
          UPDATE school_quotations SET status = v_status, delivered_at = now(), delivered_by = p_user_id
           WHERE id = p_quotation_id;
        ELSE
          RAISE EXCEPTION 'SCHOOL_QUOTE_INVALID_TRANSITION:%', v_q.status;
        END IF;

        UPDATE school_quotations SET version = version + 1, updated_by = p_user_id, updated_at = now()
         WHERE id = p_quotation_id;
        INSERT INTO school_list_history (entity_type, entity_id, action, from_status, to_status, details, created_by)
        VALUES ('QUOTATION', p_quotation_id, p_action, v_q.status, v_status, '{}'::jsonb, p_user_id);
        RETURN v_status;
      END;
      $$;

      CREATE OR REPLACE FUNCTION register_school_quotation_payment(
        p_quotation_id UUID, p_amount NUMERIC, p_method TEXT, p_bank_id UUID,
        p_reference TEXT, p_observations TEXT, p_user_id UUID, p_key TEXT
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_existing RECORD;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.payments.register');
        PERFORM 1 FROM school_quotations WHERE id = p_quotation_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_FOUND';
        END IF;
        -- Duplicate submission of the same payment: return the one already registered.
        SELECT id, quotation_id INTO v_existing FROM school_quotation_payments WHERE idempotency_key = p_key;
        IF FOUND THEN
          IF v_existing.quotation_id <> p_quotation_id THEN
            RAISE EXCEPTION 'SCHOOL_IDEMPOTENCY_CONFLICT';
          END IF;
          RETURN v_existing.id;
        END IF;
        RETURN school_quotation_insert_payment(p_quotation_id, p_amount, p_method, p_bank_id,
                                               p_reference, p_observations, p_user_id, p_key);
      END;
      $$;

      CREATE OR REPLACE FUNCTION void_school_quotation_payment(
        p_payment_id UUID, p_reason TEXT, p_user_id UUID, p_key TEXT
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_p school_quotation_payments%ROWTYPE;
        v_q school_quotations%ROWTYPE;
        v_id UUID;
        v_status TEXT;
        v_balance NUMERIC;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.payments.void');
        IF length(btrim(COALESCE(p_reason, ''))) < 5 OR length(p_reason) > 500 THEN
          RAISE EXCEPTION 'SCHOOL_REASON_REQUIRED';
        END IF;
        IF p_key IS NULL OR length(p_key) < 8 THEN
          RAISE EXCEPTION 'SCHOOL_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        SELECT * INTO v_p FROM school_quotation_payments WHERE id = p_payment_id;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_PAYMENT_NOT_FOUND';
        END IF;
        SELECT * INTO v_q FROM school_quotations WHERE id = v_p.quotation_id FOR UPDATE;
        SELECT * INTO v_p FROM school_quotation_payments WHERE id = p_payment_id FOR UPDATE;

        SELECT id INTO v_id FROM school_quotation_payments WHERE idempotency_key = p_key;
        IF FOUND THEN
          RETURN v_id;
        END IF;
        IF v_p.kind NOT IN ('ANTICIPO','ABONO') THEN
          RAISE EXCEPTION 'SCHOOL_PAYMENT_NOT_VOIDABLE';
        END IF;
        IF v_p.status = 'ANULADO' THEN
          RAISE EXCEPTION 'SCHOOL_PAYMENT_ALREADY_VOIDED';
        END IF;
        IF v_q.status IN ('CANCELADA','ENTREGADA') THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_CLOSED:%', v_q.status;
        END IF;

        UPDATE school_quotation_payments
           SET status = 'ANULADO', voided_at = now(), voided_by = p_user_id, void_reason = btrim(p_reason)
         WHERE id = p_payment_id;
        v_balance := v_q.total - school_quotation_paid(v_q.id);
        INSERT INTO school_quotation_payments
          (quotation_id, receipt_number, kind, amount, payment_method, bank_id, reference, observations,
           balance_after, reversal_of_id, received_by, idempotency_key)
        VALUES (v_q.id, 'RLE-' || lpad(nextval('school_payment_receipt_seq')::TEXT, 6, '0'),
                'ANULACION', v_p.amount, v_p.payment_method, v_p.bank_id, v_p.receipt_number,
                btrim(p_reason), v_balance, p_payment_id, p_user_id, p_key)
        RETURNING id INTO v_id;
        -- A voided payment re-opens the balance: PAGADA goes back to a partial state.
        IF v_q.status = 'PAGADA' THEN
          UPDATE school_quotations SET status = 'PAGO_PARCIAL' WHERE id = v_q.id;
        END IF;
        v_status := school_quotation_refresh_status(v_q.id);
        UPDATE school_quotations SET version = version + 1, updated_by = p_user_id, updated_at = now()
         WHERE id = v_q.id;
        INSERT INTO school_list_history (entity_type, entity_id, action, from_status, to_status, details, created_by)
        VALUES ('QUOTATION', v_q.id, 'PAGO_ANULADO', v_q.status, v_status,
                jsonb_build_object('paymentId', p_payment_id, 'receipt', v_p.receipt_number,
                                   'amount', v_p.amount, 'reason', btrim(p_reason)), p_user_id);
        RETURN v_id;
      END;
      $$;

      -- Cancels a quotation; money already received is returned with a DEVOLUCION.
      CREATE OR REPLACE FUNCTION cancel_school_quotation(
        p_quotation_id UUID, p_reason TEXT, p_refund_method TEXT, p_bank_id UUID,
        p_reference TEXT, p_user_id UUID, p_key TEXT
      ) RETURNS UUID
      LANGUAGE plpgsql AS $$
      DECLARE
        v_q school_quotations%ROWTYPE;
        v_paid NUMERIC;
        v_refund UUID;
      BEGIN
        PERFORM school_list_assert_permission(p_user_id, 'school_lists.quotations.cancel');
        IF p_key IS NULL OR length(p_key) < 8 THEN
          RAISE EXCEPTION 'SCHOOL_IDEMPOTENCY_KEY_REQUIRED';
        END IF;
        SELECT * INTO v_q FROM school_quotations WHERE id = p_quotation_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_NOT_FOUND';
        END IF;
        IF v_q.status = 'CANCELADA' AND v_q.cancel_idempotency_key = p_key THEN
          RETURN p_quotation_id;
        END IF;
        IF v_q.status IN ('CANCELADA','ENTREGADA') THEN
          RAISE EXCEPTION 'SCHOOL_QUOTE_CLOSED:%', v_q.status;
        END IF;
        IF length(btrim(COALESCE(p_reason, ''))) < 5 OR length(p_reason) > 500 THEN
          RAISE EXCEPTION 'SCHOOL_REASON_REQUIRED';
        END IF;

        v_paid := school_quotation_paid(p_quotation_id);
        IF v_paid > 0 THEN
          IF p_refund_method IS NULL OR p_refund_method NOT IN ('EFECTIVO','TRANSFERENCIA','DEPOSITO','TARJETA','OTRO') THEN
            RAISE EXCEPTION 'SCHOOL_REFUND_METHOD_REQUIRED';
          END IF;
          IF p_bank_id IS NOT NULL AND (p_refund_method NOT IN ('TRANSFERENCIA','DEPOSITO')
              OR NOT EXISTS (SELECT 1 FROM banks WHERE id = p_bank_id AND is_active)) THEN
            RAISE EXCEPTION 'SCHOOL_BANK_NOT_FOUND';
          END IF;
          IF length(COALESCE(p_reference, '')) > 60 THEN
            RAISE EXCEPTION 'SCHOOL_INVALID_TEXT';
          END IF;
          INSERT INTO school_quotation_payments
            (quotation_id, receipt_number, kind, amount, payment_method, bank_id, reference, observations,
             balance_after, received_by, idempotency_key)
          VALUES (p_quotation_id, 'RLE-' || lpad(nextval('school_payment_receipt_seq')::TEXT, 6, '0'),
                  'DEVOLUCION', v_paid, p_refund_method, p_bank_id, NULLIF(btrim(COALESCE(p_reference, '')), ''),
                  btrim(p_reason), v_q.total, p_user_id, p_key || ':DEV')
          RETURNING id INTO v_refund;
        END IF;

        UPDATE school_quotations
           SET status = 'CANCELADA', cancelled_at = now(), cancelled_by = p_user_id,
               cancel_reason = btrim(p_reason), cancel_idempotency_key = p_key,
               version = version + 1, updated_by = p_user_id, updated_at = now()
         WHERE id = p_quotation_id;
        INSERT INTO school_list_history (entity_type, entity_id, action, from_status, to_status, details, created_by)
        VALUES ('QUOTATION', p_quotation_id, 'CANCELADA', v_q.status, 'CANCELADA',
                jsonb_build_object('reason', btrim(p_reason), 'refunded', v_paid, 'refundId', v_refund), p_user_id);
        RETURN p_quotation_id;
      END;
      $$;
    `);

    // ── Initial templates (empty: the real lists are configured in the app) ─
    await queryRunner.query(`
      INSERT INTO school_list_templates (name, grade, description, sort_order, created_by)
      SELECT v.name, v.name, v.description, v.sort_order,
             (SELECT u.id FROM users u JOIN roles r ON r.id = u.role_id
               WHERE r.name = 'SUPER_ADMIN' ORDER BY u.created_at LIMIT 1)
        FROM (VALUES
          ('Primero Básico', 'Lista oficial de útiles solicitada por el instituto para Primero Básico.', 10),
          ('Segundo Básico', 'Lista oficial de útiles solicitada por el instituto para Segundo Básico.', 20),
          ('Tercero Básico', 'Lista oficial de útiles solicitada por el instituto para Tercero Básico.', 30)
        ) AS v(name, description, sort_order)
      ON CONFLICT (name) DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS cancel_school_quotation(UUID, TEXT, TEXT, UUID, TEXT, UUID, TEXT);
      DROP FUNCTION IF EXISTS void_school_quotation_payment(UUID, TEXT, UUID, TEXT);
      DROP FUNCTION IF EXISTS register_school_quotation_payment(UUID, NUMERIC, TEXT, UUID, TEXT, TEXT, UUID, TEXT);
      DROP FUNCTION IF EXISTS change_school_quotation_status(UUID, TEXT, UUID, INT);
      DROP FUNCTION IF EXISTS set_school_quotation_observations(UUID, TEXT, UUID, INT);
      DROP FUNCTION IF EXISTS update_school_quotation(UUID, JSONB, UUID, INT);
      DROP FUNCTION IF EXISTS create_school_quotation(JSONB, UUID, TEXT);
      DROP FUNCTION IF EXISTS school_quotation_insert_payment(UUID, NUMERIC, TEXT, UUID, TEXT, TEXT, UUID, TEXT);
      DROP FUNCTION IF EXISTS school_quotation_assert_customer(JSONB);
      DROP FUNCTION IF EXISTS school_quotation_insert_items(UUID, UUID, JSONB, BOOLEAN, JSONB);
      DROP FUNCTION IF EXISTS school_quotation_refresh_status(UUID);
      DROP FUNCTION IF EXISTS school_quotation_paid(UUID);
      DROP FUNCTION IF EXISTS duplicate_school_list_template(UUID, TEXT, TEXT, UUID);
      DROP FUNCTION IF EXISTS set_school_list_template_active(UUID, BOOLEAN, UUID);
      DROP FUNCTION IF EXISTS save_school_list_template(UUID, JSONB, UUID, INT);
      DROP FUNCTION IF EXISTS school_list_template_insert_items(UUID, JSONB);
      DROP FUNCTION IF EXISTS school_list_assert_money(NUMERIC, TEXT);
      DROP FUNCTION IF EXISTS school_list_has_permission(UUID, TEXT);
      DROP FUNCTION IF EXISTS school_list_assert_permission(UUID, TEXT);
    `);
    // Tables go away only while they hold no quotation (never deletes business data).
    const [{ count }] = (await queryRunner.query(
      `SELECT count(*)::INT AS count FROM school_quotations`,
    )) as { count: number }[];
    if (count > 0) {
      return;
    }
    await queryRunner.query(`
      DROP TABLE school_list_history;
      DROP TABLE school_quotation_payments;
      DROP TABLE school_quotation_items;
      DROP TABLE school_quotations;
      DROP TABLE school_list_template_items;
      DROP TRIGGER trg_school_templates_no_delete ON school_list_templates;
      DROP TABLE school_list_templates;
      DROP FUNCTION IF EXISTS school_payment_guard();
      DROP FUNCTION IF EXISTS school_list_append_only_guard();
      DROP SEQUENCE IF EXISTS school_payment_receipt_seq;
      DROP SEQUENCE IF EXISTS school_quotation_number_seq;
    `);
  }
}
