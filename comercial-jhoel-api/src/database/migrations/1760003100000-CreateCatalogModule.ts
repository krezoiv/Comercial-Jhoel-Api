import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Catálogo de Teléfonos" — a public-facing marketing catalog (landing
 * page carousel + admin management), deliberately independent from
 * `modules/phones/` (Venta de Teléfonos): that module tracks individually
 * serialized physical units (IMEI/SIM, activation, one row per device),
 * while this one is a per-MODEL commercial listing (brand/model, specs,
 * photos, list price) meant to be browsed publicly — the two domains don't
 * share a table or a repository, confirmed as the correct shape after
 * reviewing `phones`' own entity (no image field, no "published" concept,
 * one row per physical device rather than per model).
 *
 * `catalog_phones` — one row per publishable model. `is_active` (soft
 * delete, never a physical row removal, same convention as every other
 * reference table in this codebase) and `is_published` (whether it's
 * currently visible on the public landing) are independent flags: an
 * admin can stage a phone (create it, upload photos) before publishing it,
 * and deactivating one always force-unpublishes it too (see
 * `DeactivateCatalogPhoneUseCase`). `extra_specs` is a small JSONB array of
 * `{label, value}` pairs — the "otras especificaciones configuradas desde
 * el panel" requirement, without building a full EAV schema for a handful
 * of optional rows.
 *
 * `catalog_phone_images` mirrors the BYTEA rationale already established by
 * `phone_sale_dpi_images`/`recharge_sim_dpi_images` (no file-storage system
 * exists anywhere in this project, and the production API container has no
 * persistent volume) — but unlike those two, this one IS served publicly
 * (`GET /api/catalog/phones/images/:imageId`, no guard, long
 * `Cache-Control`), since these are marketing photos, not sensitive
 * identity documents. It's also the one table in this module with a real
 * hard-delete (`DELETE /catalog/phones/:id/images/:imageId`): a product
 * photo is editorial content, not a financial/historical record, so
 * removing one is a normal admin action, not something that needs
 * "anular con motivo".
 *
 * `catalog_requests` — a lead captured from the public landing ("Lo
 * quiero" / "Comprar a crédito con Krediya"). Always a full snapshot
 * (`brand`, `model`, `price`, `credit_available` frozen at creation time,
 * never re-derived later) — same reasoning `phone_sales` already applies to
 * `phone_operator`/`phone_model`/etc.: a request's own history must never
 * silently change because the catalog phone it pointed to was later edited
 * or unpublished. `credit_available` is computed server-side from the real
 * price and `company_settings.krediya_min_amount` at the moment of
 * creation (see `CreateCatalogRequestUseCase`) — never trusted from the
 * client. No Krediya API integration exists anywhere in this codebase
 * (confirmed by exhaustive search) — this table only registers the
 * customer's interest so an admin can follow up manually; nothing here
 * assumes or invents rates/cuotas/plazos/approval.
 */
export class CreateCatalogModule1760003100000 implements MigrationInterface {
  name = 'CreateCatalogModule1760003100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE catalog_phones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        brand VARCHAR(80) NOT NULL,
        model VARCHAR(150) NOT NULL,
        description TEXT NULL,
        price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
        screen VARCHAR(100) NULL,
        ram VARCHAR(50) NULL,
        storage VARCHAR(50) NULL,
        camera VARCHAR(100) NULL,
        battery VARCHAR(50) NULL,
        processor VARCHAR(100) NULL,
        operating_system VARCHAR(50) NULL,
        extra_specs JSONB NOT NULL DEFAULT '[]',
        is_active BOOLEAN NOT NULL DEFAULT true,
        is_published BOOLEAN NOT NULL DEFAULT false,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        updated_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_catalog_phones_published" ON catalog_phones (is_published, is_active, sort_order)
    `);

    await queryRunner.query(`
      CREATE TABLE catalog_phone_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        catalog_phone_id UUID NOT NULL REFERENCES catalog_phones(id) ON DELETE CASCADE,
        image_data BYTEA NOT NULL,
        mime_type VARCHAR(50) NOT NULL,
        size_bytes INTEGER NOT NULL,
        is_primary BOOLEAN NOT NULL DEFAULT false,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_catalog_phone_images_primary" ON catalog_phone_images (catalog_phone_id)
      WHERE is_primary = true
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_catalog_phone_images_phone_id" ON catalog_phone_images (catalog_phone_id)
    `);

    await queryRunner.query(`
      CREATE TABLE catalog_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        catalog_phone_id UUID NULL REFERENCES catalog_phones(id) ON DELETE RESTRICT,
        brand VARCHAR(80) NOT NULL,
        model VARCHAR(150) NOT NULL,
        price NUMERIC(12,2) NOT NULL,
        credit_available BOOLEAN NOT NULL,
        request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('INTERES_COMPRA', 'INTERES_CREDITO')),
        customer_name VARCHAR(150) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'NUEVA'
          CHECK (status IN ('NUEVA', 'CONTACTADA', 'EN_PROCESO', 'ATENDIDA', 'CANCELADA')),
        observation VARCHAR(500) NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_by UUID NULL REFERENCES users(id) ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_catalog_requests_status" ON catalog_requests (status)
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_catalog_requests_created_at" ON catalog_requests (created_at)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS catalog_requests');
    await queryRunner.query('DROP TABLE IF EXISTS catalog_phone_images');
    await queryRunner.query('DROP TABLE IF EXISTS catalog_phones');
  }
}
