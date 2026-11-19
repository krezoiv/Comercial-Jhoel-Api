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
 * 1760008500000) and "Eliminar cotización" (one list, migration
 * 1760008600000), end to end over HTTP:
 *
 * - only SUPER_ADMIN, only with the phrase "BORRAR TODO";
 * - the preview tells what goes away and what returns to Bodega;
 * - the purge is a HARD delete (quotations, lines, assignments, payments,
 *   history, supply, dispatches, SCHOOL_LIST movements) and returns to Bodega
 *   exactly what the lists had discounted (both flows);
 * - templates and numbering stay, one PURGA audit row is written, and the
 *   append-only guards keep protecting the records afterwards;
 * - deleting ONE list (typing its number) returns only its units, leaves the
 *   other lists untouched and hands its released reservations FIFO to the
 *   next pending list.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/school-lists-purge.e2e-spec.ts`
 * (temporary `<db>_e2e` clone, dropped afterwards).
 */
describe('Listas Escolares — borrar cotizaciones (e2e)', () => {
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
  const get = async (id: string): Promise<Body> =>
    data(
      await as(rootToken)(
        api().get(`/api/school-lists/quotations/${id}`),
      ).expect(200),
    );
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

  it('eliminar una sola cotización: confirma con su número, devuelve solo lo suyo y reasigna FIFO', async () => {
    const other = await one(
      `SELECT id, name, public_price::float AS price FROM products
          WHERE is_active AND id <> $1 ORDER BY name LIMIT 1`,
      [product.id],
    );
    await setBodega(other.id, 2);
    // Two lists of the previous flow on the same product: X (5) gets the 2 units, Y (3) waits.
    await dataSource.query(
      `ALTER TABLE school_quotations ALTER COLUMN fulfillment_mode SET DEFAULT 'CONFIRMACION'`,
    );
    const legacy = async (name: string, quantity: number) =>
      data(
        await as(userToken)(
          api()
            .post('/api/school-lists/quotations')
            .send({
              customerName: name,
              customerPhone: '5555-9393',
              grade: 'Primero Básico',
              items: [
                {
                  productId: other.id,
                  productName: other.name,
                  quantity,
                  unitPrice: other.price,
                },
              ],
              advance: { amount: 1, paymentMethod: 'EFECTIVO' },
              clientRequestId: randomUUID(),
            }),
        ).expect(201),
      );
    let x: Body;
    let y: Body;
    try {
      x = await legacy('Familia X', 5);
      y = await legacy('Familia Y', 3);
    } finally {
      await dataSource.query(
        `ALTER TABLE school_quotations ALTER COLUMN fulfillment_mode SET DEFAULT 'PREPARACION'`,
      );
    }
    const allocated = async (quotationId: string) =>
      Number(
        (
          await one(
            `SELECT COALESCE(SUM(quantity), 0)::int AS n FROM school_supply_allocations
              WHERE quotation_id = $1 AND status = 'ASIGNADA'`,
            [quotationId],
          )
        ).n,
      );
    expect(await bodega(other.id)).toBe(-6);
    expect(await allocated(x.id)).toBe(2);
    expect(await allocated(y.id)).toBe(0);

    // Roles and confirmation.
    await as(adminToken)(
      api()
        .post(`/api/school-lists/quotations/${x.id}/delete`)
        .send({ confirmation: x.quotationNumber }),
    ).expect(403);
    const wrong = await as(rootToken)(
      api()
        .post(`/api/school-lists/quotations/${x.id}/delete`)
        .send({ confirmation: y.quotationNumber }),
    ).expect(400);
    expect(JSON.stringify(wrong.body)).toContain(x.quotationNumber);

    const preview = data(
      await as(rootToken)(
        api().get(`/api/school-lists/quotations/${x.id}/delete-preview`),
      ).expect(200),
    );
    expect(preview).toEqual(
      expect.objectContaining({ quotations: 1, payments: 1, returnedUnits: 5 }),
    );

    const removed = data(
      await as(rootToken)(
        api()
          .post(`/api/school-lists/quotations/${x.id}/delete`)
          .send({ confirmation: x.quotationNumber }),
      ).expect(200),
    );
    expect(removed.returnedUnits).toBe(5);
    // X's 5 units are back (-6 → -1); its 2 reserved units now go to Y.
    expect(await bodega(other.id)).toBe(-1);
    expect(await allocated(y.id)).toBe(2);
    const left = await one(
      `SELECT (SELECT count(*) FROM school_quotations WHERE id = $1)::int AS quotation,
              (SELECT count(*) FROM school_quotation_items WHERE quotation_id = $1)::int AS items,
              (SELECT count(*) FROM school_quotation_payments WHERE quotation_id = $1)::int AS payments,
              (SELECT count(*) FROM inventory_movements WHERE reference_type = 'SCHOOL_LIST' AND reference_id = $1)::int AS movements,
              (SELECT count(*) FROM school_supply_allocations WHERE quotation_id = $1)::int AS allocations,
              (SELECT count(*) FROM school_list_history WHERE entity_type = 'QUOTATION' AND entity_id = $1)::int AS history,
              (SELECT count(*) FROM school_list_history WHERE entity_type = 'PURGA' AND entity_id = $1)::int AS audit,
              (SELECT count(*) FROM inventory_movements WHERE reference_type = 'SCHOOL_LIST' AND reference_id = $2)::int AS other`,
      [x.id, y.id],
    );
    expect(left).toEqual({
      quotation: 0,
      items: 0,
      payments: 0,
      movements: 0,
      allocations: 0,
      history: 0,
      audit: 1,
      other: 1,
    });
    // Y is intact and still protected by the guards.
    expect((await get(y.id)).status).toBe('ANTICIPO_RECIBIDO');
    await expect(
      dataSource.query(`DELETE FROM school_quotations WHERE id = $1`, [y.id]),
    ).rejects.toThrow('SCHOOL_RECORD_IMMUTABLE');
    await as(rootToken)(
      api()
        .post(`/api/school-lists/quotations/${x.id}/delete`)
        .send({ confirmation: x.quotationNumber }),
    ).expect(404);
  });
});
