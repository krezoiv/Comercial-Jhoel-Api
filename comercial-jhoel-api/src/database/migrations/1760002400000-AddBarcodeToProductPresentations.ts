import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

/**
 * Gives each product PRESENTATION its own optional barcode — separate from
 * `products.sku`, which stays exactly as-is. Real, requested scenario: a
 * box of 12 has its own barcode (123456), the individual unit inside has a
 * different one (678900); scanning either must resolve to the same
 * product, with the right presentation pre-selected.
 *
 * `barcode` lives on `product_presentations` (the per-product INSTANCE),
 * never on `presentation_types` (the shared catalog "Caja" name) — a box
 * barcode is specific to one product's actual box, never shared across
 * every product that happens to use the "Caja" type.
 *
 * Same partial-unique-index pattern as `UQ_products_sku_active`
 * (`AddSkuToProducts`) — global uniqueness (two products' presentations
 * must never share a barcode), unique only among *active* presentations,
 * nullable (not every presentation needs one).
 *
 * Backfill: every existing product's own "Unidad" presentation gets its
 * barcode set to that product's current `sku` — this is what keeps
 * "scan the code you already had" working with zero admin action for the
 * unit-level flow (Ventas always sells at "Unidad" and never changes);
 * a distinct "Caja" barcode is then something an admin adds separately.
 * Safe by construction, scoped to active rows only on both sides
 * (`p.is_active = true AND pp.is_active = true`): `products.sku` is only
 * unique among *active* products (`UQ_products_sku_active` is itself a
 * partial index), so two deactivated products could legally share an old
 * sku — backfilling both would collide under the new partial-active index
 * too. Restricting to active product + active presentation rules that out
 * entirely; an inactive product's "Unidad" simply keeps `barcode = NULL`
 * here (nothing scans a deactivated product anyway).
 */
export class AddBarcodeToProductPresentations1760002400000
  implements MigrationInterface
{
  name = 'AddBarcodeToProductPresentations1760002400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'product_presentations',
      new TableColumn({
        name: 'barcode',
        type: 'varchar',
        length: '64',
        isNullable: true,
      }),
    );

    await queryRunner.createIndex(
      'product_presentations',
      new TableIndex({
        name: 'UQ_product_presentations_barcode_active',
        columnNames: ['barcode'],
        isUnique: true,
        where: '"is_active" = true',
      }),
    );

    await queryRunner.query(`
      UPDATE product_presentations pp
      SET barcode = p.sku
      FROM products p, presentation_types pt
      WHERE pp.product_id = p.id
        AND pp.presentation_type_id = pt.id
        AND LOWER(pt.name) = 'unidad'
        AND p.sku IS NOT NULL
        AND p.is_active = true
        AND pp.is_active = true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'product_presentations',
      'UQ_product_presentations_barcode_active',
    );
    await queryRunner.dropColumn('product_presentations', 'barcode');
  }
}
