import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Cotizaciones (migration 1760008200000) end to end over HTTP: customer typed
 * in by hand (no `clients` row), saving never touches inventory, commercial
 * statuses, and "Confirmar venta" through Ventas — quoted prices, Vitrina
 * stock validated, ONE sale even with two simultaneous confirmations.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/quotations-sale.e2e-spec.ts`,
 * which uses a temporary `<db>_e2e` clone and drops it afterwards.
 */
describe('Cotizaciones — cliente manual y Confirmar venta (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let userToken: string;
  let adminToken: string;
  let product: { id: string; name: string };

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const scalar = async (sql: string, params: unknown[] = []) =>
    Number(
      Object.values(
        ((await dataSource.query(sql, params)) as Body[])[0],
      )[0] as string,
    );
  const vitrina = () =>
    scalar(
      `SELECT s.quantity FROM inventory_stock s JOIN inventory_locations l ON l.id = s.location_id
        WHERE s.product_id = $1 AND l.name = 'Vitrina'`,
      [product.id],
    );
  const future = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().slice(0, 10);
  })();

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'quotations-sale e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    const cashier = users.find((u) => u.role === 'USER')!;
    const admin =
      users.find((u) => u.role === 'ADMIN') ??
      users.find((u) => u.role === 'SUPER_ADMIN')!;
    const sign = (u: Body) =>
      jwt.sign({ sub: u.id, username: u.username, role: u.role });
    userToken = sign(cashier);
    adminToken = sign(admin);
    [product] = (await dataSource.query(
      `SELECT id, name FROM products WHERE is_active ORDER BY created_at LIMIT 1`,
    )) as (typeof product)[];
    // Clone only: Vitrina = 10 units and public price Q25.
    await dataSource.query(
      `SELECT ensure_inventory_stock_row($1, (SELECT id FROM inventory_locations WHERE name = 'Vitrina'))`,
      [product.id],
    );
    await dataSource.query(
      `UPDATE products SET public_price = 25,
              stock = stock - (SELECT s.quantity FROM inventory_stock s JOIN inventory_locations l ON l.id = s.location_id
                                WHERE s.product_id = $1 AND l.name = 'Vitrina') + 10
        WHERE id = $1`,
      [product.id],
    );
    await dataSource.query(
      `UPDATE inventory_stock SET quantity = 10 WHERE product_id = $1
          AND location_id = (SELECT id FROM inventory_locations WHERE name = 'Vitrina')`,
      [product.id],
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('cliente a mano, sin inventario al guardar, y una sola venta al confirmar', async () => {
    const clientsBefore = await scalar('SELECT count(*) FROM clients');
    const movementsBefore = await scalar(
      'SELECT count(*) FROM inventory_movements',
    );
    const salesBefore = await scalar('SELECT count(*) FROM sales');

    // Phone is required for a typed-in customer.
    await as(userToken)(
      api()
        .post('/api/quotations')
        .send({
          customerName: 'María López',
          expirationDate: future,
          items: [{ productId: product.id, quantity: 1 }],
        }),
    ).expect(400);

    const created = data(
      await as(userToken)(
        api()
          .post('/api/quotations')
          .send({
            customerName: 'María López',
            customerPhone: '5555-1234',
            studentName: 'Ana López',
            grade: 'Primero Básico',
            observations: 'Entrega el viernes',
            expirationDate: future,
            items: [{ productId: product.id, quantity: 4, discount: 5 }],
          }),
      ).expect(201),
    );
    expect(created).toEqual(
      expect.objectContaining({
        status: 'COTIZADA',
        clientId: null,
        clientName: 'María López',
        customerPhone: '5555-1234',
        studentName: 'Ana López',
        grade: 'Primero Básico',
        total: 95,
      }),
    );
    // Saving a quotation never touches inventory or clients.
    expect(await scalar('SELECT count(*) FROM clients')).toBe(clientsBefore);
    expect(await scalar('SELECT count(*) FROM inventory_movements')).toBe(
      movementsBefore,
    );
    expect(await vitrina()).toBe(10);

    // Search by the typed-in name and by phone.
    const found = data(
      await as(userToken)(
        api().get('/api/quotations').query({ search: '5555-1234' }),
      ).expect(200),
    );
    expect((found.items as Body[]).map((q) => q.id)).toContain(created.id);

    // A quantity above Vitrina is reported before confirming.
    const big = data(
      await as(userToken)(
        api()
          .post('/api/quotations')
          .send({
            customerName: 'Carlos Pérez',
            customerPhone: '4444-9999',
            expirationDate: future,
            items: [{ productId: product.id, quantity: 11 }],
          }),
      ).expect(201),
    );
    const bigPreview = data(
      await as(userToken)(
        api().get(`/api/quotations/${big.id}/sale-preview`),
      ).expect(200),
    );
    expect(bigPreview.canConfirm).toBe(false);
    const noStock = await as(userToken)(
      api().post(`/api/quotations/${big.id}/confirm-sale`),
    ).expect(409);
    expect((noStock.body as Body).message).toContain(
      `"${product.name}" en Vitrina: disponibles 10, se necesitan 11`,
    );
    await as(userToken)(
      api()
        .post(`/api/quotations/${big.id}/status`)
        .send({ action: 'RECHAZAR', reason: 'El cliente no la quiso' }),
    ).expect(200);

    // Accept, then the price changes: the sale keeps the quoted price.
    await as(userToken)(
      api()
        .post(`/api/quotations/${created.id}/status`)
        .send({ action: 'ACEPTAR' }),
    ).expect(200);
    await dataSource.query(
      'UPDATE products SET public_price = 30 WHERE id = $1',
      [product.id],
    );
    const preview = data(
      await as(userToken)(
        api().get(`/api/quotations/${created.id}/sale-preview`),
      ).expect(200),
    );
    expect(preview.canConfirm).toBe(true);
    expect(preview.lines).toEqual([
      expect.objectContaining({ quantity: 4, available: 10, sufficient: true }),
    ]);

    // Two simultaneous confirmations (double click): one sale, one discount.
    const [first, second] = await Promise.all([
      as(userToken)(api().post(`/api/quotations/${created.id}/confirm-sale`)),
      as(userToken)(api().post(`/api/quotations/${created.id}/confirm-sale`)),
    ]);
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(data(first).saleId).toBe(data(second).saleId);
    expect(data(first).quotation.status).toBe('VENDIDA');
    expect(await scalar('SELECT count(*) FROM sales')).toBe(salesBefore + 1);
    expect(await vitrina()).toBe(6);
    const [sale] = (await dataSource.query(
      `SELECT s.total, d.quantity, d.unit_price, d.total AS line_total
         FROM sales s JOIN sale_details d ON d.sale_id = s.id WHERE s.id = $1`,
      [data(first).saleId],
    )) as Body[];
    expect(sale).toEqual({
      total: '95.00',
      quantity: 4,
      unit_price: '25.00',
      line_total: '95.00',
    });
    expect(
      await scalar(
        `SELECT count(*) FROM inventory_movements WHERE reference_type = 'SALE' AND reference_id = $1`,
        [data(first).saleId],
      ),
    ).toBe(1);

    // A sold quotation cannot be cancelled (void the sale first).
    const sold = await as(adminToken)(
      api()
        .post(`/api/quotations/${created.id}/void`)
        .send({ reason: 'Intento de anular' }),
    ).expect(409);
    expect((sold.body as Body).message).toContain('anule primero la venta');
  });

  it('borrador → cotizada, y una venta normal sigue cobrando el precio actual', async () => {
    const draft = data(
      await as(userToken)(
        api()
          .post('/api/quotations')
          .send({
            customerName: 'Luisa Gómez',
            customerPhone: '+502 3333 1111',
            asDraft: true,
            expirationDate: future,
            items: [{ productId: product.id, quantity: 1 }],
          }),
      ).expect(201),
    );
    expect(draft.status).toBe('BORRADOR');
    await as(userToken)(
      api().post(`/api/quotations/${draft.id}/confirm-sale`),
    ).expect(409);
    const confirmed = data(
      await as(userToken)(
        api()
          .post(`/api/quotations/${draft.id}/status`)
          .send({ action: 'CONFIRMAR' }),
      ).expect(200),
    );
    expect(confirmed.status).toBe('COTIZADA');

    // Ventas cannot receive a price from the client (DTO whitelist).
    await as(userToken)(
      api()
        .post('/api/sales')
        .send({
          items: [{ productId: product.id, quantity: 1, unitPrice: 1 }],
        }),
    ).expect(400);
  });
});
