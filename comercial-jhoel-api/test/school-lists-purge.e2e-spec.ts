import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Listas Escolares — "Borrar todas las cotizaciones" (migration
 * 1760008500000), end to end over HTTP:
 *
 * - only SUPER_ADMIN, only with the phrase "BORRAR TODO";
 * - the preview tells what goes away and what returns to Bodega;
 * - the purge is a HARD delete (quotations, lines, assignments, payments,
 *   history, supply, dispatches, SCHOOL_LIST movements) and returns to Bodega
 *   exactly what the lists had discounted (both flows);
 * - templates and numbering stay, one PURGA audit row is written, and the
 *   append-only guards keep protecting the records afterwards.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/school-lists-purge.e2e-spec.ts`
 * (temporary `<db>_e2e` clone, dropped afterwards).
 */
describe('Listas Escolares — borrar todas las cotizaciones (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let rootToken: string;
  let adminToken: string;
  let userToken: string;
  let product: Body;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const one = async (sql: string, params: unknown[] = []): Promise<Body> =>
    ((await dataSource.query(sql, params)) as Body[])[0];
  const bodega = async (productId: string): Promise<number> =>
    Number(
      (
        await one(
          `SELECT s.quantity FROM inventory_stock s JOIN inventory_locations l ON l.id = s.location_id
            WHERE s.product_id = $1 AND l.name = 'Bodega'`,
          [productId],
        )
      ).quantity,
    );
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

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'school-lists-purge e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    const jwt = app.get(JwtService);
    const users = (await dataSource.query(`
      SELECT u.id, u.username, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id WHERE u.is_active ORDER BY u.created_at
    `)) as Body[];
    const sign = (u: Body) =>
      jwt.sign({ sub: u.id, username: u.username, role: u.role });
    rootToken = sign(users.find((u) => u.role === 'SUPER_ADMIN')!);
    adminToken = sign(users.find((u) => u.role === 'ADMIN')!);
    userToken = sign(users.find((u) => u.role === 'USER')!);
    product = await one(
      `SELECT id, name, public_price::float AS price FROM products WHERE is_active ORDER BY name LIMIT 1`,
    );
    await setBodega(product.id, 20);
  });

  afterAll(async () => {
    await app.close();
  });

  it('solo el super administrador, con la frase, borra todo y devuelve el inventario', async () => {
    // A list of the requirements flow, prepared and finished (takes 3 units).
    const created = data(
      await as(userToken)(
        api()
          .post('/api/school-lists/quotations')
          .send({
            customerName: 'Familia Purga',
            customerPhone: '5555-9090',
            grade: 'Primero Básico',
            items: [{ productName: 'Cuaderno', quantity: 3, unitPrice: 10 }],
            advance: { amount: 10, paymentMethod: 'EFECTIVO' },
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    let q = data(
      await as(userToken)(
        api()
          .post(`/api/school-lists/quotations/${created.id}/status`)
          .send({ action: 'PREPARAR', version: created.version }),
      ).expect(200),
    );
    q = data(
      await as(userToken)(
        api()
          .put(`/api/school-lists/quotations/${q.id}/preparation`)
          .send({
            version: q.version,
            assignments: [
              { itemId: q.items[0].id, productId: product.id, quantity: 3 },
            ],
          }),
      ).expect(200),
    );
    await as(userToken)(
      api()
        .post(`/api/school-lists/quotations/${q.id}/status`)
        .send({ action: 'TERMINAR', version: q.version }),
    ).expect(200);

    // A list of the previous flow (discounts 2 units at confirmation).
    await dataSource.query(
      `ALTER TABLE school_quotations ALTER COLUMN fulfillment_mode SET DEFAULT 'CONFIRMACION'`,
    );
    try {
      await as(userToken)(
        api()
          .post('/api/school-lists/quotations')
          .send({
            customerName: 'Familia Histórica',
            customerPhone: '5555-9191',
            grade: 'Segundo Básico',
            items: [
              {
                productId: product.id,
                productName: product.name,
                quantity: 2,
                unitPrice: product.price,
              },
            ],
            clientRequestId: randomUUID(),
          }),
      ).expect(201);
    } finally {
      await dataSource.query(
        `ALTER TABLE school_quotations ALTER COLUMN fulfillment_mode SET DEFAULT 'PREPARACION'`,
      );
    }
    expect(await bodega(product.id)).toBe(15);
    const templates = await one(
      `SELECT count(*)::int AS n FROM school_list_templates`,
    );
    const lastNumber = await one(
      `SELECT max(quotation_number) AS n FROM school_quotations`,
    );

    // Roles and phrase.
    await api().post('/api/school-lists/quotations/purge').expect(401);
    await as(adminToken)(
      api()
        .post('/api/school-lists/quotations/purge')
        .send({ confirmation: 'BORRAR TODO' }),
    ).expect(403);
    await as(adminToken)(
      api().get('/api/school-lists/quotations/purge-preview'),
    ).expect(403);
    await as(rootToken)(
      api()
        .post('/api/school-lists/quotations/purge')
        .send({ confirmation: 'borrar' }),
    ).expect(400);
    expect(
      (await one(`SELECT count(*)::int AS n FROM school_quotations`)).n,
    ).toBeGreaterThanOrEqual(2);

    // Preview: every list still holding units of the product (also lists left by other suites).
    const held = Number(
      (
        await one(
          `SELECT COALESCE(SUM(CASE WHEN location_from_id IS NOT NULL THEN quantity_base_units
                                    ELSE -quantity_base_units END), 0) AS n
             FROM inventory_movements WHERE reference_type = 'SCHOOL_LIST' AND product_id = $1`,
          [product.id],
        )
      ).n,
    );
    expect(held).toBeGreaterThanOrEqual(5);
    const before = await bodega(product.id);
    const preview = data(
      await as(rootToken)(
        api().get('/api/school-lists/quotations/purge-preview'),
      ).expect(200),
    );
    expect(preview.quotations).toBeGreaterThanOrEqual(2);
    expect(preview.payments).toBeGreaterThanOrEqual(1);
    expect(
      preview.returned.find((r: Body) => r.productId === product.id),
    ).toEqual(expect.objectContaining({ units: held }));

    // Purge.
    const result = data(
      await as(rootToken)(
        api()
          .post('/api/school-lists/quotations/purge')
          .send({ confirmation: 'BORRAR TODO' }),
      ).expect(200),
    );
    expect(result.quotations).toBe(preview.quotations);
    expect(await bodega(product.id)).toBe(before + held);
    const left = await one(`
      SELECT (SELECT count(*) FROM school_quotations)::int AS quotations,
             (SELECT count(*) FROM school_quotation_items)::int AS items,
             (SELECT count(*) FROM school_quotation_item_assignments)::int AS assignments,
             (SELECT count(*) FROM school_quotation_payments)::int AS payments,
             (SELECT count(*) FROM school_list_history WHERE entity_type = 'QUOTATION')::int AS history,
             (SELECT count(*) FROM inventory_movements WHERE reference_type = 'SCHOOL_LIST')::int AS movements,
             (SELECT count(*) FROM school_supply_allocations)::int AS allocations,
             (SELECT count(*) FROM school_dispatches)::int AS dispatches,
             (SELECT count(*) FROM school_list_templates)::int AS templates,
             (SELECT count(*) FROM school_list_history WHERE entity_type = 'PURGA')::int AS audits`);
    expect(left).toEqual({
      quotations: 0,
      items: 0,
      assignments: 0,
      payments: 0,
      history: 0,
      movements: 0,
      allocations: 0,
      dispatches: 0,
      templates: templates.n,
      audits: 1,
    });

    // Numbering continues; the guards protect the new records again.
    const next = data(
      await as(userToken)(
        api()
          .post('/api/school-lists/quotations')
          .send({
            customerName: 'Familia Nueva',
            customerPhone: '5555-9292',
            grade: 'Tercero Básico',
            items: [{ productName: 'Regla', quantity: 1, unitPrice: 5 }],
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    expect(next.quotationNumber > lastNumber.n).toBe(true);
    await expect(
      dataSource.query(`DELETE FROM school_quotations WHERE id = $1`, [
        next.id,
      ]),
    ).rejects.toThrow('SCHOOL_RECORD_IMMUTABLE');
  });
});
