import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * Foundational schema for three independent, additive features:
 * `company_settings` (a singleton, same shape as `alert_settings`, holding
 * the branding/contact data every document PDF's letterhead needs), and two
 * brand-new document types — `tickets`/`ticket_details` and
 * `quotations`/`quotation_details` — neither of which is a real sale: no
 * column here, and no statement in either stored function below, ever
 * touches `products.stock`, `inventory_stock`, or `inventory_movements`.
 * That structural absence is the entire mechanism by which a Ticket/
 * Cotización is guaranteed not to affect inventory — not an
 * application-layer promise.
 *
 * `ticket_number`/`quotation_number` are real, persisted sequential folios
 * (`T-000001`, `COT-000001`, via a dedicated Postgres SEQUENCE per type,
 * atomic under concurrency by construction) — deliberately different from
 * Sales/Purchases' own computed, non-stored `V-XXXXXXXX`/`C-XXXXXXXX` folio
 * style, which is untouched by this migration.
 *
 * Purely additive — no existing table's shape changes, so (unlike several
 * other migrations in this codebase that fix live bugs or drop columns) a
 * full `down()` is safe here and provided.
 */
export class CreateDocumentsModule1760001000000 implements MigrationInterface {
  name = 'CreateDocumentsModule1760001000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ------------------------------------------------------------------
    // company_settings — singleton, same shape/seeding idiom as
    // alert_settings: exactly one row, seeded empty by this migration.
    // ------------------------------------------------------------------
    await queryRunner.createTable(
      new Table({
        name: 'company_settings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'business_name',
            type: 'varchar',
            length: '150',
            default: "''",
          },
          { name: 'address', type: 'varchar', length: '255', isNullable: true },
          { name: 'phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'email', type: 'varchar', length: '150', isNullable: true },
          { name: 'tax_id', type: 'varchar', length: '50', isNullable: true },
          { name: 'logo_base64', type: 'text', isNullable: true },
          {
            name: 'social_media',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_by', type: 'uuid', isNullable: true },
        ],
        foreignKeys: [
          {
            name: 'FK_company_settings_updated_by',
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.query(`
      INSERT INTO company_settings (business_name) VALUES ('');
    `);

    // ------------------------------------------------------------------
    // tickets / ticket_details
    // ------------------------------------------------------------------
    await queryRunner.createTable(
      new Table({
        name: 'tickets',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'ticket_number', type: 'varchar', length: '20' },
          { name: 'client_id', type: 'uuid', isNullable: true },
          { name: 'user_id', type: 'uuid' },
          { name: 'subtotal', type: 'numeric', precision: 12, scale: 2 },
          {
            name: 'discount',
            type: 'numeric',
            precision: 12,
            scale: 2,
            default: 0,
          },
          { name: 'total', type: 'numeric', precision: 12, scale: 2 },
          { name: 'is_voided', type: 'boolean', default: false },
          { name: 'voided_at', type: 'timestamptz', isNullable: true },
          { name: 'voided_by', type: 'uuid', isNullable: true },
          { name: 'void_reason', type: 'varchar', length: '255', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_tickets_client',
            columnNames: ['client_id'],
            referencedTableName: 'clients',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_tickets_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_tickets_voided_by',
            columnNames: ['voided_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'tickets',
      new TableIndex({
        name: 'UQ_tickets_ticket_number',
        columnNames: ['ticket_number'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'tickets',
      new TableIndex({ name: 'IDX_tickets_user_id', columnNames: ['user_id'] }),
    );
    await queryRunner.createIndex(
      'tickets',
      new TableIndex({ name: 'IDX_tickets_is_voided', columnNames: ['is_voided'] }),
    );

    await queryRunner.query(`
      ALTER TABLE tickets
        ADD CONSTRAINT "CHK_tickets_void_consistency"
          CHECK (
            (is_voided = false AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
            OR
            (is_voided = true AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL)
          );
    `);

    await queryRunner.createTable(
      new Table({
        name: 'ticket_details',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'ticket_id', type: 'uuid' },
          { name: 'product_id', type: 'uuid' },
          { name: 'product_name', type: 'varchar', length: '150' },
          {
            name: 'presentation_name',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          { name: 'quantity', type: 'int' },
          { name: 'unit_price', type: 'numeric', precision: 12, scale: 2 },
          { name: 'total', type: 'numeric', precision: 12, scale: 2 },
        ],
        foreignKeys: [
          {
            name: 'FK_ticket_details_ticket',
            columnNames: ['ticket_id'],
            referencedTableName: 'tickets',
            referencedColumnNames: ['id'],
            // A ticket's line items have no independent existence.
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_ticket_details_product',
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'ticket_details',
      new TableIndex({
        name: 'IDX_ticket_details_ticket_id',
        columnNames: ['ticket_id'],
      }),
    );

    await queryRunner.query(`CREATE SEQUENCE ticket_number_seq START 1;`);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.create_ticket(p_user_id uuid, p_client_id uuid, p_items jsonb)
      RETURNS uuid
      LANGUAGE plpgsql
      AS $function$
      DECLARE
        v_ticket_id UUID;
        v_ticket_number VARCHAR(20);
        v_item JSONB;
        v_product_id UUID;
        v_quantity INT;
        v_product RECORD;
        v_line_total NUMERIC(12,2);
        v_subtotal NUMERIC(12,2) := 0;
      BEGIN
        IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
          RAISE EXCEPTION 'TICKET_EMPTY';
        END IF;

        IF p_client_id IS NOT NULL THEN
          PERFORM 1 FROM clients WHERE id = p_client_id AND is_active = true;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'CLIENT_NOT_FOUND:%', p_client_id;
          END IF;
        END IF;

        v_ticket_number := 'T-' || LPAD(nextval('ticket_number_seq')::text, 6, '0');

        INSERT INTO tickets (id, ticket_number, client_id, user_id, subtotal, discount, total)
        VALUES (gen_random_uuid(), v_ticket_number, p_client_id, p_user_id, 0, 0, 0)
        RETURNING id INTO v_ticket_id;

        FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
        LOOP
          v_product_id := (v_item->>'productId')::UUID;
          v_quantity := (v_item->>'quantity')::INT;

          IF v_quantity IS NULL OR v_quantity <= 0 THEN
            RAISE EXCEPTION 'INVALID_QUANTITY:%', v_product_id;
          END IF;

          SELECT id, name, public_price, is_active INTO v_product FROM products WHERE id = v_product_id;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'PRODUCT_NOT_FOUND:%', v_product_id;
          END IF;
          IF NOT v_product.is_active THEN
            RAISE EXCEPTION 'PRODUCT_INACTIVE:%', v_product_id;
          END IF;

          v_line_total := v_product.public_price * v_quantity;
          v_subtotal := v_subtotal + v_line_total;

          INSERT INTO ticket_details (id, ticket_id, product_id, product_name, presentation_name, quantity, unit_price, total)
          VALUES (gen_random_uuid(), v_ticket_id, v_product_id, v_product.name, NULL, v_quantity, v_product.public_price, v_line_total);
        END LOOP;

        UPDATE tickets SET subtotal = v_subtotal, total = v_subtotal WHERE id = v_ticket_id;
        RETURN v_ticket_id;
      END;
      $function$;
    `);

    // ------------------------------------------------------------------
    // quotations / quotation_details
    // ------------------------------------------------------------------
    await queryRunner.createTable(
      new Table({
        name: 'quotations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'quotation_number', type: 'varchar', length: '20' },
          { name: 'client_id', type: 'uuid' },
          { name: 'user_id', type: 'uuid' },
          { name: 'quotation_date', type: 'timestamptz', default: 'now()' },
          { name: 'expiration_date', type: 'date' },
          { name: 'subtotal', type: 'numeric', precision: 12, scale: 2 },
          {
            name: 'discount',
            type: 'numeric',
            precision: 12,
            scale: 2,
            default: 0,
          },
          { name: 'total', type: 'numeric', precision: 12, scale: 2 },
          { name: 'observations', type: 'varchar', length: '500', isNullable: true },
          {
            name: 'commercial_terms',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          { name: 'status', type: 'varchar', length: '20', default: "'PENDIENTE'" },
          { name: 'voided_at', type: 'timestamptz', isNullable: true },
          { name: 'voided_by', type: 'uuid', isNullable: true },
          { name: 'void_reason', type: 'varchar', length: '255', isNullable: true },
          { name: 'converted_to_sale_id', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'FK_quotations_client',
            columnNames: ['client_id'],
            referencedTableName: 'clients',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_quotations_user',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_quotations_voided_by',
            columnNames: ['voided_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_quotations_converted_to_sale',
            columnNames: ['converted_to_sale_id'],
            referencedTableName: 'sales',
            referencedColumnNames: ['id'],
            // Always NULL today — this is only the forward-compat hook for a
            // future, explicit "Cotización -> Venta" conversion action, not
            // implemented by this migration.
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'quotations',
      new TableIndex({
        name: 'UQ_quotations_quotation_number',
        columnNames: ['quotation_number'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'quotations',
      new TableIndex({ name: 'IDX_quotations_user_id', columnNames: ['user_id'] }),
    );
    await queryRunner.createIndex(
      'quotations',
      new TableIndex({ name: 'IDX_quotations_client_id', columnNames: ['client_id'] }),
    );
    await queryRunner.createIndex(
      'quotations',
      new TableIndex({ name: 'IDX_quotations_status', columnNames: ['status'] }),
    );

    await queryRunner.query(`
      ALTER TABLE quotations
        ADD CONSTRAINT "CHK_quotations_status" CHECK (status IN ('PENDIENTE', 'ACEPTADA', 'ANULADA'));
    `);

    await queryRunner.createTable(
      new Table({
        name: 'quotation_details',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'quotation_id', type: 'uuid' },
          { name: 'product_id', type: 'uuid' },
          { name: 'product_name', type: 'varchar', length: '150' },
          {
            name: 'presentation_name',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          { name: 'quantity', type: 'int' },
          { name: 'unit_price', type: 'numeric', precision: 12, scale: 2 },
          {
            name: 'discount',
            type: 'numeric',
            precision: 12,
            scale: 2,
            default: 0,
          },
          { name: 'subtotal', type: 'numeric', precision: 12, scale: 2 },
          { name: 'total', type: 'numeric', precision: 12, scale: 2 },
        ],
        foreignKeys: [
          {
            name: 'FK_quotation_details_quotation',
            columnNames: ['quotation_id'],
            referencedTableName: 'quotations',
            referencedColumnNames: ['id'],
            // A quotation's line items have no independent existence.
            onDelete: 'CASCADE',
          },
          {
            name: 'FK_quotation_details_product',
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'quotation_details',
      new TableIndex({
        name: 'IDX_quotation_details_quotation_id',
        columnNames: ['quotation_id'],
      }),
    );

    await queryRunner.query(`CREATE SEQUENCE quotation_number_seq START 1;`);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION public.create_quotation(
        p_user_id uuid, p_client_id uuid, p_expiration_date date,
        p_items jsonb, p_observations varchar, p_commercial_terms varchar
      )
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
      $function$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS create_quotation(UUID, UUID, DATE, JSONB, VARCHAR, VARCHAR)',
    );
    await queryRunner.query('DROP SEQUENCE IF EXISTS quotation_number_seq');
    await queryRunner.dropTable('quotation_details');
    await queryRunner.dropTable('quotations');

    await queryRunner.query(
      'DROP FUNCTION IF EXISTS create_ticket(UUID, UUID, JSONB)',
    );
    await queryRunner.query('DROP SEQUENCE IF EXISTS ticket_number_seq');
    await queryRunner.dropTable('ticket_details');
    await queryRunner.dropTable('tickets');

    await queryRunner.dropTable('company_settings');
  }
}
