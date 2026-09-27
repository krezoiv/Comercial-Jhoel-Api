import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Transaccionar "Enviar a Activos" (Retiros y Desembolsos Génesis): el CARGO
 * en Activos queda ligado a la operación que lo originó, igual que Cuentas
 * por Cobrar desde `AddClientAndReferenceForBankDepositReceivables`.
 *
 * - `assets.reference_type` / `reference_id` (nullables, en pareja — mismo
 *   CHECK `all-or-nothing` que `accounts_receivable`). Hoy el único escritor
 *   es Transaccionar con `reference_type = 'BANK_DEPOSIT'`.
 * - `register_asset_movement` gana `p_reference_type`/`p_reference_id`
 *   (DEFAULT NULL). Postgres identifica la función por sus tipos, así que se
 *   borra la firma anterior antes de crear la nueva. Cuerpo idéntico en todo
 *   lo demás; los llamadores existentes (Registrar Cargo/Abono) no cambian.
 */
export class AddReferenceToAssets1760005500000 implements MigrationInterface {
  name = 'AddReferenceToAssets1760005500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE assets
      ADD COLUMN "reference_type" VARCHAR(50) NULL,
      ADD COLUMN "reference_id" UUID NULL
    `);
    await queryRunner.query(`
      ALTER TABLE assets
      ADD CONSTRAINT "CHK_assets_reference_pair"
      CHECK (
        ("reference_type" IS NULL AND "reference_id" IS NULL)
        OR ("reference_type" IS NOT NULL AND "reference_id" IS NOT NULL)
      )
    `);

    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_asset_movement(UUID, VARCHAR, NUMERIC, DATE, VARCHAR, UUID)',
    );
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_asset_movement(
        p_client_id UUID,
        p_type VARCHAR,
        p_amount NUMERIC,
        p_date DATE,
        p_description VARCHAR,
        p_user_id UUID,
        p_reference_type VARCHAR DEFAULT NULL,
        p_reference_id UUID DEFAULT NULL
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_id UUID;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext(p_client_id::text));

        IF p_type NOT IN ('CARGO', 'ABONO') THEN
          RAISE EXCEPTION 'INVALID_MOVEMENT_TYPE:%', p_client_id;
        END IF;
        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_client_id;
        END IF;

        INSERT INTO assets (
          client_id, date, amount, description, movement_type, created_by,
          reference_type, reference_id
        )
        VALUES (
          p_client_id, p_date, p_amount, p_description, p_type, p_user_id,
          p_reference_type, p_reference_id
        )
        RETURNING id INTO v_id;

        RETURN v_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_asset_movement(UUID, VARCHAR, NUMERIC, DATE, VARCHAR, UUID, VARCHAR, UUID)',
    );
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_asset_movement(
        p_client_id UUID,
        p_type VARCHAR,
        p_amount NUMERIC,
        p_date DATE,
        p_description VARCHAR,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_id UUID;
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext(p_client_id::text));

        IF p_type NOT IN ('CARGO', 'ABONO') THEN
          RAISE EXCEPTION 'INVALID_MOVEMENT_TYPE:%', p_client_id;
        END IF;
        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_AMOUNT:%', p_client_id;
        END IF;

        INSERT INTO assets (client_id, date, amount, description, movement_type, created_by)
        VALUES (p_client_id, p_date, p_amount, p_description, p_type, p_user_id)
        RETURNING id INTO v_id;

        RETURN v_id;
      END;
      $fn$;
    `);

    await queryRunner.query(
      'ALTER TABLE assets DROP CONSTRAINT IF EXISTS "CHK_assets_reference_pair"',
    );
    await queryRunner.query(
      'ALTER TABLE assets DROP COLUMN IF EXISTS "reference_id"',
    );
    await queryRunner.query(
      'ALTER TABLE assets DROP COLUMN IF EXISTS "reference_type"',
    );
  }
}
