import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Cotizaciones de Listas Escolares — category per line, "Cambiar producto"
 * by category, sorting and summary cards, end to end over HTTP:
 *
 * - every inventory line carries its real category and SKU (read from
 *   products.category_id → categories, never typed);
 * - the change-product catalog (`GET /products?categoryId=&search=`) only
 *   returns active products of the chosen category, searchable by name/SKU;
 * - swapping a product on a draft moves no inventory; on a confirmed list it
 *   moves exactly the difference (old product back, new product out) — never
 *   a double discount — and re-saving the same lines moves nothing;
 * - subtotals/totals, list sorting, search by number, the `awaitingQuotations`
 *   card and the existing role rules.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/school-lists-catalog.e2e-spec.ts`
 * (temporary `<db>_e2e` clone, dropped afterwards).
 */
describe('Listas Escolares — categorías y cambio de producto (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let category: { id: string; name: string };
  let productA: Body;
  let productB: Body;
  let templateId: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;

  /** Sets a known Bodega quantity for a product (clone only). */
  const setBodega = async (productId: string, quantity: number) => {
    await dataSource.query(
      `SELECT ensure_inventory_stock_row($1, (SELECT id FROM inventory_locations WHERE name = 'Bodega'))`,
      [productId],
    );
    await dataSource.query(
      `WITH b AS (SELECT s.quantity FROM inventory_stock s JOIN inventory_locations l ON l.id = s.location_id
                   WHERE s.product_id = $1 AND l.name = 'Bodega')
       UPDATE products SET stock = stock - (SELECT quantity FROM b) + $2 WHERE id = $1`,
      [productId, quantity],
    );
    await dataSource.query(
      `UPDATE inventory_stock SET quantity = $2 WHERE product_id = $1
          AND location_id = (SELECT id FROM inventory_locations WHERE name = 'Bodega')`,
      [productId, quantity],
    );
  };
  const bodega = async (productId: string): Promise<number> =>
    Number(
      (
        (await dataSource.query(
          `SELECT s.quantity FROM inventory_stock s JOIN inventory_locations l ON l.id = s.location_id
            WHERE s.product_id = $1 AND l.name = 'Bodega'`,
          [productId],
        )) as Body[]
      )[0].quantity,
    );
  const movements = async (quotationId: string): Promise<Body[]> =>
    (await dataSource.query(
      `SELECT product_id, movement_type, quantity_base_units::int AS qty FROM inventory_movements
        WHERE reference_type = 'SCHOOL_LIST' AND reference_id = $1 ORDER BY created_at, id`,
      [quotationId],
    )) as Body[];

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'school-lists-catalog e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
      );
    }
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    dataSource = app.get(DataSource);
    // These flows cover lists saved BEFORE the requirements flow (migration
    // 1760008400000): on this disposable clone new lists take the previous
    // mode, so the historical behavior keeps being verified.
    await dataSource.query(
      `ALTER TABLE school_quotations ALTER COLUMN fulfillment_mode SET DEFAULT 'CONFIRMACION'`,
    );
    const jwt = app.get(JwtService);
    const users = (await dataSource.query(`
      SELECT u.id, u.username, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id WHERE u.is_active ORDER BY u.created_at
    `)) as Body[];
    const admin =
      users.find((u) => u.role === 'ADMIN') ??
      users.find((u) => u.role === 'SUPER_ADMIN')!;
    const cashier = users.find((u) => u.role === 'USER')!;
    const sign = (u: Body) =>
      jwt.sign({ sub: u.id, username: u.username, role: u.role });
    adminToken = sign(admin);
    userToken = sign(cashier);

    // A real active category with at least two active products (real catalog data).
    [category] = (await dataSource.query(
      `SELECT c.id, c.name FROM categories c JOIN products p ON p.category_id = c.id AND p.is_active
        WHERE c.is_active GROUP BY c.id, c.name HAVING count(*) >= 2 ORDER BY count(*) DESC, c.name LIMIT 1`,
    )) as (typeof category)[];
    const products = (await dataSource.query(
      `SELECT id, name, sku, public_price::float AS price FROM products
        WHERE is_active AND category_id = $1 ORDER BY name LIMIT 2`,
      [category.id],
    )) as Body[];
    [productA, productB] = products;
    await setBodega(productA.id, 20);
    await setBodega(productB.id, 20);
    [{ id: templateId }] = (await dataSource.query(
      `SELECT id FROM school_list_templates WHERE is_active ORDER BY sort_order LIMIT 1`,
    )) as Body[];
  });

  afterAll(async () => {
    await dataSource.query(
      `ALTER TABLE school_quotations ALTER COLUMN fulfillment_mode SET DEFAULT 'PREPARACION'`,
    );
    await app.close();
  });

  it('cada línea muestra la categoría real; cambiar producto en borrador no mueve inventario', async () => {
    expect(category).toBeDefined();
    const created = data(
      await as(userToken)(
        api()
          .post('/api/school-lists/quotations')
          .send({
            templateId,
            customerName: 'Cliente Categorías',
            customerPhone: '5555-7777',
            asDraft: true,
            items: [
              {
                productId: productA.id,
                productName: productA.name,
                quantity: 3,
                unitPrice: productA.price,
              },
              { productName: 'Forro plástico', quantity: 2, unitPrice: 1.5 },
            ],
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    const [inventoryLine, manualLine] = created.items as Body[];
    // 1. Category and SKU come from the product's real relation.
    expect(inventoryLine).toEqual(
      expect.objectContaining({
        categoryId: category.id,
        categoryName: category.name,
        productSku: productA.sku,
      }),
    );
    expect(manualLine).toEqual(
      expect.objectContaining({
        categoryId: null,
        categoryName: null,
        productSku: null,
      }),
    );
    // 9. Subtotals and total.
    expect(inventoryLine.subtotal).toBeCloseTo(3 * productA.price, 2);
    expect(created.total).toBeCloseTo(3 * productA.price + 3, 2);

    // 6. + 8. Swap A → B keeping the quantity, on a draft: no inventory moves.
    const swapped = data(
      await as(userToken)(
        api()
          .put(`/api/school-lists/quotations/${created.id}`)
          .send({
            customerName: 'Cliente Categorías',
            customerPhone: '5555-7777',
            version: created.version,
            items: [
              {
                productId: productB.id,
                productName: productB.name,
                quantity: 3,
                unitPrice: productB.price,
              },
              {
                itemId: manualLine.id,
                productName: 'Forro plástico',
                quantity: 2,
                unitPrice: 1.5,
              },
            ],
          }),
      ).expect(200),
    );
    expect((swapped.items as Body[])[0]).toEqual(
      expect.objectContaining({
        productId: productB.id,
        quantity: 3,
        categoryName: category.name,
      }),
    );
    expect(await movements(created.id)).toHaveLength(0);
    expect(await bodega(productA.id)).toBe(20);
    expect(await bodega(productB.id)).toBe(20);
  });

  it('en una lista confirmada el cambio mueve solo la diferencia (sin doble descuento)', async () => {
    const created = data(
      await as(userToken)(
        api()
          .post('/api/school-lists/quotations')
          .send({
            templateId,
            customerName: 'Cliente Confirmado',
            customerPhone: '5555-8888',
            items: [
              {
                productId: productA.id,
                productName: productA.name,
                quantity: 4,
                unitPrice: productA.price,
              },
            ],
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    expect(await bodega(productA.id)).toBe(16);

    const body = (version: number) => ({
      customerName: 'Cliente Confirmado',
      customerPhone: '5555-8888',
      version,
      items: [
        {
          productId: productB.id,
          productName: productB.name,
          quantity: 4,
          unitPrice: productB.price,
        },
      ],
    });
    const swapped = data(
      await as(userToken)(
        api()
          .put(`/api/school-lists/quotations/${created.id}`)
          .send(body(created.version)),
      ).expect(200),
    );
    // Old product fully returned, new product discounted once.
    expect(await bodega(productA.id)).toBe(20);
    expect(await bodega(productB.id)).toBe(16);
    const count = (await movements(created.id)).length;

    // Saving the same lines again moves nothing.
    await as(userToken)(
      api()
        .put(`/api/school-lists/quotations/${created.id}`)
        .send(body(swapped.version)),
    ).expect(200);
    expect(await movements(created.id)).toHaveLength(count);
    expect(await bodega(productB.id)).toBe(16);

    // Free the units for the other tests.
    await as(adminToken)(
      api().post(`/api/school-lists/quotations/${created.id}/cancel`).send({
        reason: 'Prueba e2e de cambio de producto',
        clientRequestId: randomUUID(),
      }),
    ).expect(200);
    expect(await bodega(productB.id)).toBe(20);
  });

  it('el catálogo de "Cambiar producto" filtra por categoría y busca por nombre o SKU', async () => {
    const page = data(
      await as(userToken)(
        api()
          .get('/api/products')
          .query({ categoryId: category.id, limit: 50 }),
      ).expect(200),
    );
    // 3. Only products of the chosen category.
    expect((page.items as Body[]).length).toBeGreaterThanOrEqual(2);
    expect(
      (page.items as Body[]).every((p) => p.categoryId === category.id),
    ).toBe(true);
    // 4. Search by name inside the category.
    const byName = data(
      await as(userToken)(
        api()
          .get('/api/products')
          .query({ categoryId: category.id, search: productA.name }),
      ).expect(200),
    );
    expect((byName.items as Body[]).map((p) => p.id)).toContain(productA.id);
    expect(
      (byName.items as Body[]).every((p) => p.categoryId === category.id),
    ).toBe(true);
    if (productA.sku) {
      const bySku = data(
        await as(userToken)(
          api()
            .get('/api/products')
            .query({ categoryId: category.id, search: productA.sku }),
        ).expect(200),
      );
      expect((bySku.items as Body[]).map((p) => p.id)).toContain(productA.id);
    }
    // 5. Another category gives other results (never this category's products).
    const [other] = (await dataSource.query(
      `SELECT id FROM categories WHERE is_active AND id <> $1 LIMIT 1`,
      [category.id],
    )) as Body[];
    if (other) {
      const otherPage = data(
        await as(userToken)(
          api().get('/api/products').query({ categoryId: other.id }),
        ).expect(200),
      );
      expect(
        (otherPage.items as Body[]).every((p) => p.categoryId === other.id),
      ).toBe(true);
    }
  });

  it('listado: orden por columna, búsqueda por número y tarjeta de pendientes', async () => {
    const list = (query: Record<string, string>) =>
      as(userToken)(api().get('/api/school-lists/quotations').query(query));
    const asc = data(
      await list({
        sortBy: 'total',
        sortDirection: 'asc',
        limit: '100',
      }).expect(200),
    ).items as Body[];
    const totals = asc.map((q) => Number(q.total));
    expect(totals).toEqual([...totals].sort((a, b) => a - b));
    const desc = data(
      await list({
        sortBy: 'customer',
        sortDirection: 'desc',
        limit: '100',
      }).expect(200),
    ).items as Body[];
    expect(desc.length).toBeGreaterThan(0);
    expect(desc[0]).toHaveProperty('advance');
    // Only whitelisted columns reach the SQL.
    await list({ sortBy: 'q.id; DROP TABLE x' }).expect(400);

    // One box searches by number too.
    const number = asc[0].quotationNumber as string;
    const found = data(await list({ search: number }).expect(200))
      .items as Body[];
    expect(found.map((q) => q.quotationNumber)).toContain(number);

    // Summary card: drafts + quoted, straight from the database.
    const dashboard = data(
      await as(userToken)(
        api()
          .get('/api/school-lists/quotations/dashboard')
          .query({ dateFrom: '2000-01-01', dateTo: '2099-12-31' }),
      ).expect(200),
    );
    const [{ n }] = (await dataSource.query(
      `SELECT count(*)::int AS n FROM school_quotations
        WHERE status IN ('BORRADOR','COTIZADA','ACEPTADA') AND quotation_date BETWEEN '2000-01-01' AND '2099-12-31'`,
    )) as Body[];
    expect(dashboard.awaitingQuotations).toBe(n);
  });

  it('los permisos existentes siguen aplicando', async () => {
    // 10. A cashier still cannot change an inventory line's price on a swap.
    await as(userToken)(
      api()
        .post('/api/school-lists/quotations')
        .send({
          templateId,
          customerName: 'Cliente Permisos',
          customerPhone: '5555-9999',
          asDraft: true,
          items: [
            {
              productId: productB.id,
              productName: productB.name,
              quantity: 1,
              unitPrice: productB.price + 1,
            },
          ],
          clientRequestId: randomUUID(),
        }),
    ).expect(403);
    // Unauthenticated access is rejected.
    await api().get('/api/school-lists/quotations').expect(401);
  });
});
