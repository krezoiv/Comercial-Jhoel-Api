import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * Adds an optional free-text `observation` per ticket line item (e.g. "sin
 * hielo", "entregar en caja 2") — purely additive, no existing column
 * changes. `create_ticket`'s parameter list is unchanged (`p_items` already
 * a `jsonb` array where each element can simply carry one more optional
 * key), so a plain `CREATE OR REPLACE FUNCTION` is safe here — no
 * `DROP FUNCTION` needed first, per this codebase's own established rule
 * that a `DROP FUNCTION` is only required when the parameter *list* itself
 * changes.
 */
export class AddObservationToTicketDetails1760001100000
  implements MigrationInterface
{
  name = 'AddObservationToTicketDetails1760001100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'ticket_details',
      new TableColumn({
        name: 'observation',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

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
        v_observation VARCHAR(255);
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

          v_line_total := v_product.public_price * v_quantity;
          v_subtotal := v_subtotal + v_line_total;

          INSERT INTO ticket_details (id, ticket_id, product_id, product_name, presentation_name, quantity, unit_price, total, observation)
          VALUES (gen_random_uuid(), v_ticket_id, v_product_id, v_product.name, NULL, v_quantity, v_product.public_price, v_line_total, v_observation);
        END LOOP;

        UPDATE tickets SET subtotal = v_subtotal, total = v_subtotal WHERE id = v_ticket_id;
        RETURN v_ticket_id;
      END;
      $function$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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

    await queryRunner.dropColumn('ticket_details', 'observation');
  }
}
