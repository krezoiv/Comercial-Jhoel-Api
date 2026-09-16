import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * A phone bought into inventory has no active line yet — the número
 * telefónico is only assigned at the moment it's sold (the SIM gets
 * activated then, not at purchase time). This migration moves
 * `phone_number` from "required at purchase" to "assigned at sale":
 *
 * - `phones.phone_number` becomes nullable — `NULL` for every `DISPONIBLE`
 *   unit, populated only by `register_phone_sale` when it's sold, cleared
 *   again by `void_phone_sale` if that sale is later voided (full reversal
 *   of the "activation").
 * - `phones` gains `model` (what used to identify a unit informally now
 *   needs a real field the purchase form can show/search on) and
 *   `sim_number` (the physical SIM that ships with the phone, captured at
 *   purchase — distinct from the phone number, which is assigned later).
 *   Both are `NOT NULL`; `sim_number` is globally unique, same reasoning as
 *   `UQ_phones_imei` (a physical SIM is as unique as a device serial).
 * - The old partial unique index on `phone_number` (`WHERE status =
 *   'DISPONIBLE'`) no longer means anything — a `DISPONIBLE` phone never has
 *   a number now. Replaced with one scoped to `WHERE status = 'VENDIDO'`:
 *   at most one currently-active phone may claim a given number, but a
 *   voided/resold unit's old number is free to reassign, matching how a
 *   carrier can recycle a number once it's released.
 * - `phone_sales` gains its own `phone_number` column — frozen at the
 *   moment of sale, not read live via JOIN from `phones` (unlike operator/
 *   IMEI/costPrice, which never change after purchase and are safe to keep
 *   denormalizing via JOIN). This is what lets a voided sale's history keep
 *   showing which number IT assigned, even after `phones.phone_number` has
 *   since been cleared or reassigned to someone else.
 *
 * Verified live before writing this migration: both the local dev database
 * and production have zero rows in `phones`/`phone_sales` (the module was
 * only deployed days ago and has had no real usage yet) — no backfill is
 * needed, and adding `NOT NULL` columns directly is safe on this table.
 */
export class MovePhoneNumberToSale1760003000000 implements MigrationInterface {
  name = 'MovePhoneNumberToSale1760003000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE phones ADD COLUMN model VARCHAR(150) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE phones ADD COLUMN sim_number VARCHAR(30) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE phones ALTER COLUMN phone_number DROP NOT NULL`,
    );
    await queryRunner.query(`DROP INDEX "UQ_phones_phone_number_available"`);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_phones_phone_number_active" ON phones (phone_number)
      WHERE status = 'VENDIDO'
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_phones_sim_number" ON phones (sim_number)`,
    );

    await queryRunner.query(
      `ALTER TABLE phone_sales ADD COLUMN phone_number VARCHAR(20) NOT NULL`,
    );

    // Postgres does not replace a function via CREATE OR REPLACE when its
    // parameter list changes — the old 9-parameter version must be dropped
    // explicitly, or it's left orphaned alongside the new one (a real gotcha
    // already hit and documented elsewhere in this codebase's own migration
    // history, e.g. AddDraftKeyToSales).
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_phone_sale(UUID, UUID, VARCHAR, NUMERIC, DATE, BYTEA, VARCHAR, INTEGER, UUID)',
    );

    await queryRunner.query(`
      CREATE FUNCTION register_phone_sale(
        p_phone_id UUID,
        p_client_id UUID,
        p_client_dpi VARCHAR,
        p_phone_number VARCHAR,
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
        IF p_phone_number IS NULL OR length(trim(p_phone_number)) = 0 THEN
          RAISE EXCEPTION 'PHONE_NUMBER_REQUIRED:%', p_phone_id;
        END IF;

        SELECT id, status, public_price INTO v_phone FROM phones WHERE id = p_phone_id FOR UPDATE;
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

        -- Never trust a client-supplied sale price — the phone's own
        -- public_price (just read above, under the same row lock) is always
        -- what a sale is recorded at, same reasoning register_recharge_purchase
        -- already applies to cost_price.
        INSERT INTO phone_sales (
          phone_id, client_id, client_dpi, phone_number, sale_price, sale_date, dpi_image_id, created_by
        ) VALUES (
          p_phone_id, p_client_id, trim(p_client_dpi), trim(p_phone_number), v_phone.public_price, p_sale_date, v_dpi_image_id, p_created_by
        )
        RETURNING id INTO v_sale_id;

        BEGIN
          UPDATE phones
          SET status = 'VENDIDO', phone_number = trim(p_phone_number), updated_by = p_created_by, updated_at = now()
          WHERE id = p_phone_id;
        EXCEPTION WHEN unique_violation THEN
          RAISE EXCEPTION 'PHONE_NUMBER_ALREADY_ASSIGNED:%', p_phone_id;
        END;

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

        -- Reverse the "activation" fully: the phone goes back to looking
        -- exactly like it did right after purchase, with no número asignado.
        UPDATE phones
        SET status = 'DISPONIBLE', phone_number = NULL, updated_by = p_voided_by, updated_at = now()
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
      'DROP FUNCTION IF EXISTS register_phone_sale(UUID, UUID, VARCHAR, VARCHAR, DATE, BYTEA, VARCHAR, INTEGER, UUID)',
    );

    // Restore the original register_phone_sale (client-supplied salePrice,
    // no phoneNumber param) so a rollback leaves the database in the exact
    // state 1760002800000-CreatePhones.ts originally created.
    await queryRunner.query(`
      CREATE FUNCTION register_phone_sale(
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

    await queryRunner.query(
      `CREATE OR REPLACE FUNCTION void_phone_sale(
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
      $fn$;`,
    );

    await queryRunner.query(`ALTER TABLE phone_sales DROP COLUMN phone_number`);
    await queryRunner.query(`DROP INDEX "UQ_phones_sim_number"`);
    await queryRunner.query(`DROP INDEX "UQ_phones_phone_number_active"`);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_phones_phone_number_available" ON phones (phone_number)
      WHERE status = 'DISPONIBLE'
    `);
    await queryRunner.query(
      `ALTER TABLE phones ALTER COLUMN phone_number SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE phones DROP COLUMN sim_number`);
    await queryRunner.query(`ALTER TABLE phones DROP COLUMN model`);
  }
}
