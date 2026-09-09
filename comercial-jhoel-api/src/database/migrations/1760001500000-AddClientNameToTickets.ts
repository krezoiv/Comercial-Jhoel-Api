import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Tickets' "Cliente" field becomes free text: any name can be recorded
 * (including one that doesn't match a real `clients` row), and — critically —
 * it must stay frozen as historical information even if the real client's
 * name is edited later in the Clientes catalog. `TicketMapper.toDomain()`
 * used to derive `clientName` live from the eager `client` relation
 * (`orm.client?.name`), which violated that requirement by design: editing a
 * client's name would silently change what every past ticket displayed.
 *
 * This mirrors the exact precedent already used for `ticket_details.product_name`/
 * `presentation_name` (frozen at creation time, never re-derived) — applied
 * here to `tickets.client_name` instead.
 *
 * `create_ticket`'s parameter list changes (`p_client_name` is a new scalar
 * parameter, not an existing jsonb key), so per this codebase's own
 * established rule, the old 3-parameter signature must be dropped explicitly
 * first — a bare `CREATE OR REPLACE FUNCTION` would leave it orphaned
 * alongside a new overload instead of truly replacing it.
 */
export class AddClientNameToTickets1760001500000
  implements MigrationInterface
{
  name = 'AddClientNameToTickets1760001500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE tickets ADD COLUMN client_name VARCHAR(150);
    `);

    // Backfill: every existing ticket keeps the name its linked client had
    // at the time of this migration, frozen from this point forward.
    await queryRunner.query(`
      UPDATE tickets
      SET client_name = clients.name
      FROM clients
      WHERE tickets.client_id = clients.id;
    `);

    await queryRunner.query(`
      DROP FUNCTION IF EXISTS public.create_ticket(uuid, uuid, jsonb);
    `);

    await queryRunner.query(`
      CREATE FUNCTION public.create_ticket(
        p_user_id uuid,
        p_client_id uuid,
        p_items jsonb,
        p_client_name VARCHAR DEFAULT NULL
      )
      RETURNS uuid
      LANGUAGE plpgsql
      AS $function$
      DECLARE
        v_ticket_id UUID;
        v_ticket_number VARCHAR(20);
        v_item JSONB;
        v_product_id UUID;
        v_quantity INT;
        v_observation VARCHAR(255);
        v_unit_price NUMERIC(12,2);
        v_product RECORD;
        v_line_total NUMERIC(12,2);
        v_subtotal NUMERIC(12,2) := 0;
        v_client_name VARCHAR(150);
        v_client RECORD;
      BEGIN
        IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
          RAISE EXCEPTION 'TICKET_EMPTY';
        END IF;

        IF p_client_id IS NOT NULL THEN
          SELECT id, name INTO v_client FROM clients WHERE id = p_client_id AND is_active = true;
          IF NOT FOUND THEN
            RAISE EXCEPTION 'CLIENT_NOT_FOUND:%', p_client_id;
          END IF;
          v_client_name := v_client.name;
        ELSE
          v_client_name := NULLIF(TRIM(p_client_name), '');
        END IF;

        v_ticket_number := 'T-' || LPAD(nextval('ticket_number_seq')::text, 6, '0');

        INSERT INTO tickets (id, ticket_number, client_id, client_name, user_id, subtotal, discount, total)
        VALUES (gen_random_uuid(), v_ticket_number, p_client_id, v_client_name, p_user_id, 0, 0, 0)
        RETURNING id INTO v_ticket_id;

        FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
        LOOP
          v_product_id := (v_item->>'productId')::UUID;
          v_quantity := (v_item->>'quantity')::INT;
          v_observation := NULLIF(TRIM(v_item->>'observation'), '');

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

          IF v_item ? 'unitPrice' AND (v_item->>'unitPrice') IS NOT NULL THEN
            v_unit_price := (v_item->>'unitPrice')::NUMERIC(12,2);
            IF v_unit_price < 0 THEN
              RAISE EXCEPTION 'INVALID_UNIT_PRICE:%', v_product_id;
            END IF;
          ELSE
            v_unit_price := v_product.public_price;
          END IF;

          v_line_total := v_unit_price * v_quantity;
          v_subtotal := v_subtotal + v_line_total;

          INSERT INTO ticket_details (id, ticket_id, product_id, product_name, presentation_name, quantity, unit_price, total, observation)
          VALUES (gen_random_uuid(), v_ticket_id, v_product_id, v_product.name, NULL, v_quantity, v_unit_price, v_line_total, v_observation);
        END LOOP;

        UPDATE tickets SET subtotal = v_subtotal, total = v_subtotal WHERE id = v_ticket_id;
        RETURN v_ticket_id;
      END;
      $function$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS public.create_ticket(uuid, uuid, jsonb, varchar);
    `);

    await queryRunner.query(`
      CREATE FUNCTION public.create_ticket(p_user_id uuid, p_client_id uuid, p_items jsonb)
      RETURNS uuid
      LANGUAGE plpgsql
      AS $function$
      DECLARE
        v_ticket_id UUID;
        v_ticket_number VARCHAR(20);
        v_item JSONB;
        v_product_id UUID;
        v_quantity INT;
        v_observation VARCHAR(255);
        v_unit_price NUMERIC(12,2);
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
          v_observation := NULLIF(TRIM(v_item->>'observation'), '');

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

          IF v_item ? 'unitPrice' AND (v_item->>'unitPrice') IS NOT NULL THEN
            v_unit_price := (v_item->>'unitPrice')::NUMERIC(12,2);
            IF v_unit_price < 0 THEN
              RAISE EXCEPTION 'INVALID_UNIT_PRICE:%', v_product_id;
            END IF;
          ELSE
            v_unit_price := v_product.public_price;
          END IF;

          v_line_total := v_unit_price * v_quantity;
          v_subtotal := v_subtotal + v_line_total;

          INSERT INTO ticket_details (id, ticket_id, product_id, product_name, presentation_name, quantity, unit_price, total, observation)
          VALUES (gen_random_uuid(), v_ticket_id, v_product_id, v_product.name, NULL, v_quantity, v_unit_price, v_line_total, v_observation);
        END LOOP;

        UPDATE tickets SET subtotal = v_subtotal, total = v_subtotal WHERE id = v_ticket_id;
        RETURN v_ticket_id;
      END;
      $function$;
    `);

    await queryRunner.query(`
      ALTER TABLE tickets DROP COLUMN client_name;
    `);
  }
}
