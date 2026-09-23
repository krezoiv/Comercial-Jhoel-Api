import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * "Caja de Ventas" por negocio — el equivalente de la Caja Contable de
 * Recargas (`recharge_cash_box_movements`, ver
 * `AddCashBoxContributionMovementType`), pero con saldo INDEPENDIENTE por
 * `business_id` en vez de uno solo global. Mismo diseño deliberado: nunca
 * duplica las ventas reales (esas ya existen en `sales`/`sale_details`,
 * separadas por negocio desde `AddBusinessSnapshotToSaleDetails`) — la
 * única fila nueva por negocio es un "Aporte" o "Retiro" manual de
 * efectivo, que no tiene ninguna otra fuente de verdad en el sistema.
 *
 * Sin `business_date` (a diferencia de Recargas) — el ticket que pidió
 * esto es explícito en que el saldo es "acumulado", no un cuadre por día;
 * `created_at` ya es el registro de auditoría real. Si un futuro cuadre
 * diario por negocio se necesita, esa es una extensión posterior, no algo
 * a inventar aquí.
 */
export class CreateSalesCashBoxMovements1760004400000
  implements MigrationInterface
{
  name = 'CreateSalesCashBoxMovements1760004400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sales_cash_box_movements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'business_id', type: 'uuid' },
          { name: 'amount', type: 'numeric', precision: 12, scale: 2 },
          { name: 'movement_type', type: 'varchar', length: '20' },
          { name: 'concept', type: 'varchar', length: '255' },
          { name: 'created_by', type: 'uuid' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'is_voided', type: 'boolean', default: false },
          { name: 'voided_at', type: 'timestamptz', isNullable: true },
          { name: 'voided_by', type: 'uuid', isNullable: true },
          {
            name: 'void_reason',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'FK_sales_cash_box_movements_business',
            columnNames: ['business_id'],
            referencedTableName: 'businesses',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_sales_cash_box_movements_created_by',
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            name: 'FK_sales_cash_box_movements_voided_by',
            columnNames: ['voided_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'sales_cash_box_movements',
      new TableIndex({
        name: 'IDX_sales_cash_box_movements_business_id',
        columnNames: ['business_id'],
      }),
    );
    await queryRunner.createIndex(
      'sales_cash_box_movements',
      new TableIndex({
        name: 'IDX_sales_cash_box_movements_is_voided',
        columnNames: ['is_voided'],
      }),
    );

    await queryRunner.query(`
      ALTER TABLE sales_cash_box_movements
      ADD CONSTRAINT CHK_sales_cash_box_movements_amount_positive CHECK (amount > 0)
    `);

    await queryRunner.query(`
      ALTER TABLE sales_cash_box_movements
      ADD CONSTRAINT CHK_sales_cash_box_movements_type
      CHECK (movement_type IN ('CONTRIBUTION', 'WITHDRAWAL'))
    `);

    await queryRunner.query(`
      ALTER TABLE sales_cash_box_movements
      ADD CONSTRAINT CHK_sales_cash_box_movements_void_consistency CHECK (
        (is_voided = false AND voided_at IS NULL AND voided_by IS NULL AND void_reason IS NULL)
        OR
        (is_voided = true AND voided_at IS NOT NULL AND voided_by IS NOT NULL AND void_reason IS NOT NULL)
      )
    `);

    // register_sales_cash_box_movement: la operación atómica de "aportar" o
    // "retirar" efectivo de la caja de UN negocio. El advisory lock está
    // scoped por business_id (a diferencia del lock único y global de
    // Recargas) — un aporte/retiro en Librería nunca bloquea uno simultáneo
    // en Heladería, cumpliendo el requisito de independencia también a
    // nivel de concurrencia, no solo de datos.
    //
    // El saldo disponible se recalcula en vivo, DENTRO del lock, cada vez
    // — nunca se confía en un valor cacheado del caller — sumando las
    // ventas reales de ese negocio (sale_details.business_id, confirmadas
    // y no anuladas) más sus aportes no anulados, menos sus retiros no
    // anulados.
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION register_sales_cash_box_movement(
        p_business_id UUID,
        p_amount NUMERIC,
        p_movement_type VARCHAR,
        p_concept VARCHAR,
        p_user_id UUID
      )
      RETURNS UUID
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_id UUID;
        v_income NUMERIC(12,2);
        v_expense NUMERIC(12,2);
        v_balance NUMERIC(12,2);
      BEGIN
        PERFORM pg_advisory_xact_lock(hashtext('sales_cash_box:' || p_business_id::text));

        IF p_movement_type NOT IN ('CONTRIBUTION', 'WITHDRAWAL') THEN
          RAISE EXCEPTION 'INVALID_CASH_BOX_MOVEMENT_TYPE';
        END IF;

        IF p_amount IS NULL OR p_amount <= 0 THEN
          RAISE EXCEPTION 'INVALID_MOVEMENT_AMOUNT';
        END IF;

        IF p_concept IS NULL OR length(trim(p_concept)) = 0 THEN
          RAISE EXCEPTION 'INVALID_MOVEMENT_CONCEPT';
        END IF;

        PERFORM 1 FROM businesses WHERE id = p_business_id AND is_active = true FOR UPDATE;
        IF NOT FOUND THEN
          RAISE EXCEPTION 'BUSINESS_NOT_FOUND:%', p_business_id;
        END IF;

        IF p_movement_type = 'WITHDRAWAL' THEN
          SELECT
            COALESCE((
              SELECT SUM(sd.total) FROM sale_details sd
              JOIN sales s ON s.id = sd.sale_id
              WHERE sd.business_id = p_business_id AND s.status = 'CONFIRMED' AND s.is_voided = false
            ), 0)
            + COALESCE((
              SELECT SUM(amount) FROM sales_cash_box_movements
              WHERE business_id = p_business_id AND movement_type = 'CONTRIBUTION' AND is_voided = false
            ), 0)
          INTO v_income;

          SELECT
            COALESCE((
              SELECT SUM(amount) FROM sales_cash_box_movements
              WHERE business_id = p_business_id AND movement_type = 'WITHDRAWAL' AND is_voided = false
            ), 0)
          INTO v_expense;

          v_balance := v_income - v_expense;

          IF p_amount > v_balance THEN
            RAISE EXCEPTION 'WITHDRAWAL_EXCEEDS_BALANCE';
          END IF;
        END IF;

        INSERT INTO sales_cash_box_movements (business_id, amount, movement_type, concept, created_by)
        VALUES (p_business_id, p_amount, p_movement_type, trim(p_concept), p_user_id)
        RETURNING id INTO v_id;

        RETURN v_id;
      END;
      $fn$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP FUNCTION IF EXISTS register_sales_cash_box_movement(UUID, NUMERIC, VARCHAR, VARCHAR, UUID)',
    );
    await queryRunner.dropTable('sales_cash_box_movements');
  }
}
