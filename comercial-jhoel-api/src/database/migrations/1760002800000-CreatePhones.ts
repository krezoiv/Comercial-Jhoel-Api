import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Venta de Teléfonos" — a new, independent module for buying and selling
 * individual phone units (Claro/Tigo), modeled after the "Venta de SIM con
 * registro de identidad" flow (`recharge_sim_sale_registrations`) rather
 * than the generic `products`/`purchases` machinery: a phone is one
 * individually-identified physical unit (own IMEI, own status), never a
 * fungible product with a numeric stock — confirmed with the user as an
 * explicit requirement.
 *
 * `phones` doubles as both "inventory row" and "purchase record" — unlike
 * SIM (a fungible daily-stock counter, identity only captured at sale time),
 * a phone's identity (IMEI/número) exists from the moment it's bought, so
 * there is no separate quantity-based purchase table to layer identity on
 * top of afterward. `status` starts `DISPONIBLE` and flips to `VENDIDO`
 * exactly once `register_phone_sale` succeeds; it can flip back to
 * `DISPONIBLE` if that sale is later voided (`void_phone_sale`) — a phone
 * is never deleted, so it can be re-sold after a correction.
 *
 * IMEI is globally, permanently unique (`UQ_phones_imei`, no partial
 * condition) — a real device serial should never repeat, ever. The phone
 * number is unique only among currently `DISPONIBLE` units
 * (`UQ_phones_phone_number_available`, a partial index, same "nullable/
 * scoped uniqueness" shape as `UQ_products_sku_active`/
 * `UQ_suppliers_tax_id_active`) — a carrier can legitimately recycle a
 * number once the phone that had it is sold, so this only guards against
 * two units simultaneously claiming to be reachable at the same number.
 *
 * `phone_sale_dpi_images` mirrors `recharge_sim_dpi_images` exactly — same
 * Postgres BYTEA rationale (no file-storage system exists anywhere in this
 * project, and the production API container has no persistent volume), a
 * separate table per module rather than a shared one (this codebase's own
 * "small per-feature copy over cross-module coupling" convention), never
 * served by a public URL — only through an authenticated streaming endpoint.
 * Unlike SIM, the photo is optional both here and at the DTO/use-case level
 * (confirmed with the user: same real behavior as SIM, not the stricter
 * "always required" reading of the original spec).
 *
 * `phone_sales` — one row per sale; a phone may have more than one over
 * time if an earlier sale was voided and it was sold again. At most one
 * ACTIVE (non-voided) sale per phone (`UQ_phone_sales_phone_id_active`,
 * partial on `WHERE NOT is_voided`). Void, never edit/delete — identical
 * "anular con motivo" convention as Purchases/Bank Deposits/SIM sales, with
 * a real side effect to reverse (the phone goes back to `DISPONIBLE`), so
 * `void_phone_sale` follows `void_purchase()`'s shape (lock, require reason,
 * reverse the effect, then flip void columns) rather than Bank Deposits'
 * plain-`UPDATE` version (which has nothing to reverse).
 *
 * `register_phone_sale` is a single Postgres FUNCTION doing everything
 * atomically — lock the phone, validate it's still DISPONIBLE, validate the
 * optional client, insert the DPI image (if any) and the sale row, flip the
 * phone to VENDIDO. Simpler than SIM's own two-function
 * (`register_recharge_sim_sale_unit` + `register_recharge_sim_sale_registration`)
 * split: that split exists only because SIM's identity-capture flow had to
 * stay additive on top of an already-live, separately-tested by-quantity
 * sale table — Teléfonos has no such precedent to preserve, so one function
 * is the correct, simpler shape here, not a corner cut.
 */
export class CreatePhones1760002800000 implements MigrationInterface {
  name = 'CreatePhones1760002800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE phones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        operator VARCHAR(10) NOT NULL CHECK (operator IN ('CLARO', 'TIGO')),
        phone_number VARCHAR(20) NOT NULL,
        imei VARCHAR(20) NOT NULL,
        cost_price NUMERIC(12,2) NOT NULL CHECK (cost_price >= 0),
        public_price NUMERIC(12,2) NOT NULL CHECK (public_price >= 0),
        status VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE' CHECK (status IN ('DISPONIBLE', 'VENDIDO')),
        purchase_date DATE NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        updated_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_phones_imei" ON phones (imei)
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_phones_phone_number_available" ON phones (phone_number)
      WHERE status = 'DISPONIBLE'
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_phones_status" ON phones (status)
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_phones_operator" ON phones (operator)
    `);

    await queryRunner.query(`
      CREATE TABLE phone_sale_dpi_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        image_data BYTEA NOT NULL,
        mime_type VARCHAR(50) NOT NULL,
        size_bytes INTEGER NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE phone_sales (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone_id UUID NOT NULL REFERENCES phones(id) ON DELETE RESTRICT,
        client_id UUID NULL REFERENCES clients(id) ON DELETE RESTRICT,
        client_dpi VARCHAR(20) NOT NULL,
        sale_price NUMERIC(12,2) NOT NULL CHECK (sale_price >= 0),
        sale_date DATE NOT NULL,
        dpi_image_id UUID NULL REFERENCES phone_sale_dpi_images(id) ON DELETE RESTRICT,
        is_voided BOOLEAN NOT NULL DEFAULT false,
        voided_at TIMESTAMPTZ NULL,
        voided_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        void_reason VARCHAR(255) NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_phone_sales_void_consistency" CHECK (
          (is_voided = false AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
          OR
          (is_voided = true AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL)
        )
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_phone_sales_phone_id_active" ON phone_sales (phone_id)
      WHERE NOT is_voided
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_phone_sales_sale_date" ON phone_sales (sale_date)
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_phone_sales_client_id" ON phone_sales (client_id)
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_phone_sale(
        p_phone_id UUID,
        p_client_id UUID,
        p_client_dpi VARCHAR,
        p_sale_price NUMERIC,
        p_sale_date DATE,
        p_dpi_image_data BYTEA,
        p_dpi_mime_type VARCHAR,
        p_dpi_size_bytes INTEGER,
        p_created_by UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_phone RECORD;
        v_dpi_image_id UUID;
        v_sale_id UUID;
      BEGIN
        IF p_client_dpi IS NULL OR length(trim(p_client_dpi)) = 0 THEN
          RAISE EXCEPTION 'CLIENT_DPI_REQUIRED:%', p_phone_id;
        END IF;
        IF p_sale_price IS NULL OR p_sale_price < 0 THEN
          RAISE EXCEPTION 'INVALID_PHONE_SALE_PRICE:%', p_phone_id;
        END IF;

        SELECT id, status INTO v_phone FROM phones WHERE id = p_phone_id FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'PHONE_NOT_FOUND:%', p_phone_id;
        END IF;
        IF v_phone.status = 'VENDIDO' THEN
          RAISE EXCEPTION 'PHONE_ALREADY_SOLD:%', p_phone_id;
        END IF;

        IF p_client_id IS NOT NULL THEN
          PERFORM 1 FROM clients WHERE id = p_client_id AND is_active = true;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'PHONE_SALE_CLIENT_INVALID:%', p_phone_id;
          END IF;
        END IF;

        IF p_dpi_image_data IS NOT NULL THEN
          INSERT INTO phone_sale_dpi_images (image_data, mime_type, size_bytes, created_by)
          VALUES (p_dpi_image_data, p_dpi_mime_type, p_dpi_size_bytes, p_created_by)
          RETURNING id INTO v_dpi_image_id;
        END IF;

        INSERT INTO phone_sales (
          phone_id, client_id, client_dpi, sale_price, sale_date, dpi_image_id, created_by
        ) VALUES (
          p_phone_id, p_client_id, trim(p_client_dpi), p_sale_price, p_sale_date, v_dpi_image_id, p_created_by
        )
        RETURNING id INTO v_sale_id;

        UPDATE phones
        SET status = 'VENDIDO', updated_by = p_created_by, updated_at = now()
        WHERE id = p_phone_id;

        RETURN v_sale_id;
      END;
      $fn$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION void_phone_sale(
        p_sale_id UUID,
        p_voided_by UUID,
        p_reason VARCHAR
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_sale RECORD;
      BEGIN
        IF p_reason IS NULL OR length(trim(p_reason)) = 0 THEN
          RAISE EXCEPTION 'VOID_REASON_REQUIRED';
        END IF;

        SELECT id, phone_id, is_voided
        INTO v_sale
        FROM phone_sales
        WHERE id = p_sale_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RAISE EXCEPTION 'PHONE_SALE_NOT_FOUND:%', p_sale_id;
        END IF;
        IF v_sale.is_voided THEN
          RAISE EXCEPTION 'PHONE_SALE_ALREADY_VOIDED:%', p_sale_id;
        END IF;

        UPDATE phone_sales
        SET is_voided = true,
            voided_at = now(),
            voided_by = p_voided_by,
            void_reason = trim(p_reason)
        WHERE id = p_sale_id;

        UPDATE phones
        SET status = 'DISPONIBLE', updated_by = p_voided_by, updated_at = now()
        WHERE id = v_sale.phone_id;

        RETURN p_sale_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS void_phone_sale(UUID, UUID, VARCHAR)',
    );
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_phone_sale(UUID, UUID, VARCHAR, NUMERIC, DATE, BYTEA, VARCHAR, INTEGER, UUID)',
    );
    await queryRunner.query('DROP TABLE IF EXISTS phone_sales');
    await queryRunner.query('DROP TABLE IF EXISTS phone_sale_dpi_images');
    await queryRunner.query('DROP TABLE IF EXISTS phones');
  }
}
