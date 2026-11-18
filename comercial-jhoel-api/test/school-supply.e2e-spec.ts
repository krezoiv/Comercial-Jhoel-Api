import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Listas Escolares — supply control (migration 1760008300000), the owner's
 * acceptance scenario over HTTP: a 20-line list confirmed without enough
 * stock (Bodega goes negative), pending products, a purchase through the
 * normal Compras endpoint allocated FIFO to the list, dispatch without a
 * second discount, and annulment of a partially supplied list releasing its
 * reservations. Ventas keeps its own stock rule.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/school-supply.e2e-spec.ts`,
 * which uses a temporary `<db>_e2e` clone and drops it afterwards.
 */
describe('Listas Escolares — abastecimiento y despacho (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let userToken: string;
  let adminToken: string;
  let products: { id: string; name: string; public_price: string }[];
  let supplierId: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const stock = async (productId: string, location: string): Promise<number> =>
    Number(
      (
        (await dataSource.query(
          `SELECT COALESCE((SELECT s.quantity FROM inventory_stock s JOIN inventory_locations l ON l.id = s.location_id
                             WHERE s.product_id = $1 AND l.name = $2), 0) AS q`,
          [productId, location],
        )) as Body[]
      )[0].q,
    );
  const setStock = async (
    productId: string,
    bodega: number,
    vitrina: number,
  ) => {
    for (const [name, qty] of [
      ['Bodega', bodega],
      ['Vitrina', vitrina],
    ] as const) {
      await dataSource.query(
        `SELECT ensure_inventory_stock_row($1, (SELECT id FROM inventory_locations WHERE name = $2))`,
        [productId, name],
      );
      await dataSource.query(
        `UPDATE inventory_stock SET quantity = $3 WHERE product_id = $1
            AND location_id = (SELECT id FROM inventory_locations WHERE name = $2)`,
        [productId, name, qty],
      );
    }
    await dataSource.query(
      `UPDATE products SET stock = (SELECT SUM(quantity) FROM inventory_stock WHERE product_id = $1) WHERE id = $1`,
      [productId],
    );
  };

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'school-supply e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    const sign = (u: Body) =>
      jwt.sign({ sub: u.id, username: u.username, role: u.role });
    userToken = sign(users.find((u) => u.role === 'USER')!);
    adminToken = sign(
      users.find((u) => u.role === 'ADMIN') ??
        users.find((u) => u.role === 'SUPER_ADMIN')!,
    );
    products = (await dataSource.query(
      `SELECT id, name, public_price FROM products WHERE is_active ORDER BY created_at LIMIT 4`,
    )) as typeof products;
    [{ id: supplierId }] = (await dataSource.query(
      `SELECT id FROM suppliers WHERE is_active ORDER BY created_at LIMIT 1`,
    )) as { id: string }[];
    // Clone only: P0 has enough, P1 too little, P2 none, P3 already negative is not
    // reachable outside lists, so it starts at 0 and goes negative with the first list.
    await setStock(products[0].id, 100, 0);
    await setStock(products[1].id, 5, 0);
    await setStock(products[2].id, 0, 0);
    await setStock(products[3].id, 0, 0);
    await dataSource.query(
      `UPDATE school_supply_settings SET allocation_mode = 'FIFO_AUTO' WHERE id = 1`,
    );
  });

  afterAll(async () => {
    await dataSource.query(
      `ALTER TABLE school_quotations ALTER COLUMN fulfillment_mode SET DEFAULT 'PREPARACION'`,
    );
    await app.close();
  });

  it('lista de 20 productos sin existencias → pendientes → compra FIFO → despacho sin segundo descuento', async () => {
    // 20 lines over the 4 products (each line 1–3 units).
    const items = Array.from({ length: 20 }, (_, i) => {
      const p = products[i % 4];
      return {
        productId: p.id,
        productName: p.name,
        quantity: (i % 3) + 1,
        unitPrice: Number(p.public_price),
      };
    });
    const per = (index: number) =>
      items
        .filter((it) => it.productId === products[index].id)
        .reduce((sum, it) => sum + it.quantity, 0);
    const created = data(
      await as(userToken)(
        api().post('/api/school-lists/quotations').send({
          grade: 'Primero Básico',
          customerName: 'Familia Abastecimiento',
          customerPhone: '5555-2020',
          items,
          clientRequestId: randomUUID(),
        }),
      ).expect(201),
    );
    expect(created.items).toHaveLength(20);
    // Every requested unit was discounted, even below zero.
    expect(await stock(products[0].id, 'Bodega')).toBe(100 - per(0));
    expect(await stock(products[1].id, 'Bodega')).toBe(5 - per(1));
    expect(await stock(products[2].id, 'Bodega')).toBe(-per(2));
    expect(created.supply.status).toBe('PARCIAL');

    // Pending products: what is still to buy (≠ the negative stock).
    const pending = data(
      await as(userToken)(
        api()
          .get('/api/school-lists/supply/products')
          .query({ quotationNumber: created.quotationNumber }),
      ).expect(200),
    );
    const row = (index: number) =>
      (pending.items as Body[]).find(
        (r) => r.productId === products[index].id,
      )!;
    expect(row(0)).toEqual(
      expect.objectContaining({ pending: 0, status: 'ABASTECIDO' }),
    );
    expect(row(1)).toEqual(
      expect.objectContaining({
        committed: per(1),
        allocated: 5,
        pending: per(1) - 5,
        status: 'PARCIAL',
      }),
    );
    expect(row(2)).toEqual(
      expect.objectContaining({ pending: per(2), status: 'PENDIENTE' }),
    );
    expect(pending.summary).toEqual(
      expect.objectContaining({
        pendingProducts: 3,
        pendingUnits: per(1) - 5 + per(2) + per(3),
        affectedLists: 1,
      }),
    );
    const lists = data(
      await as(userToken)(
        api().get(`/api/school-lists/supply/products/${products[2].id}/lists`),
      ).expect(200),
    ) as unknown as Body[];
    expect(lists.map((l) => l.quotationNumber)).toContain(
      created.quotationNumber,
    );

    // Not dispatchable yet (and the old "entregar" is redirected).
    await as(userToken)(
      api().post(`/api/school-lists/quotations/${created.id}/payments`).send({
        amount: created.total,
        paymentMethod: 'EFECTIVO',
        clientRequestId: randomUUID(),
      }),
    ).expect(201);
    const incomplete = await as(userToken)(
      api()
        .post(`/api/school-lists/quotations/${created.id}/dispatch`)
        .send({ clientRequestId: randomUUID() }),
    ).expect(409);
    expect((incomplete.body as Body).message).toContain('por abastecer');

    // Purchase through the normal Compras endpoint: +30 of each missing product.
    const purchase = data(
      await as(adminToken)(
        api()
          .post('/api/purchases')
          .send({
            supplierId,
            purchaseDate: new Date().toISOString(),
            paymentType: 'CONTADO',
            items: [1, 2, 3].map((i) => ({
              productId: products[i].id,
              quantity: 30,
              costPrice: 1,
              publicPrice: Number(products[i].public_price),
            })),
          }),
      ).expect(201),
    );
    expect(await stock(products[2].id, 'Bodega')).toBe(30 - per(2));
    // FIFO assigned the purchase to the list; traceable from the purchase.
    const supplied = data(
      await as(userToken)(
        api().get(`/api/school-lists/quotations/${created.id}`),
      ).expect(200),
    );
    expect(supplied.supply.status).toBe('DISPONIBLE');
    const fromPurchase = data(
      await as(userToken)(
        api()
          .get('/api/school-lists/supply/purchases')
          .query({ purchaseId: purchase.id }),
      ).expect(200),
    );
    expect(
      (fromPurchase.items as Body[]).map((r) => [r.purchased, r.allocated]),
    ).toEqual(
      expect.arrayContaining([
        [30, per(1) - 5],
        [30, per(2)],
        [30, per(3)],
      ]),
    );
    expect((fromPurchase.items as Body[])[0].lists[0].quotationNumber).toBe(
      created.quotationNumber,
    );
    // Same purchase cannot be allocated twice.
    expect(
      data(
        await as(adminToken)(
          api().post(
            `/api/school-lists/supply/purchases/${purchase.id}/allocate`,
          ),
        ).expect(200),
      ).allocated,
    ).toBe(0);

    // Dispatch: no second inventory discount.
    const before = await Promise.all(
      products.map((p) => stock(p.id, 'Bodega')),
    );
    const movementsBefore = Number(
      (
        (await dataSource.query(
          'SELECT count(*) AS c FROM inventory_movements',
        )) as Body[]
      )[0].c,
    );
    const dispatched = data(
      await as(userToken)(
        api().post(`/api/school-lists/quotations/${created.id}/dispatch`).send({
          observations: 'Entregada completa',
          clientRequestId: randomUUID(),
        }),
      ).expect(200),
    );
    expect(dispatched.status).toBe('ENTREGADA');
    expect(dispatched.supply.status).toBe('DESPACHADA');
    expect(dispatched.supply.dispatch.items).toHaveLength(20);
    expect(
      await Promise.all(products.map((p) => stock(p.id, 'Bodega'))),
    ).toEqual(before);
    expect(
      Number(
        (
          (await dataSource.query(
            'SELECT count(*) AS c FROM inventory_movements',
          )) as Body[]
        )[0].c,
      ),
    ).toBe(movementsBefore);
    // A dispatched list cannot be annulled.
    await as(adminToken)(
      api().post(`/api/school-lists/quotations/${created.id}/cancel`).send({
        reason: 'Intento de anular',
        refundMethod: 'EFECTIVO',
        clientRequestId: randomUUID(),
      }),
    ).expect(409);
  });

  it('anular una lista parcialmente abastecida devuelve lo descontado y libera sus reservas; Ventas no cambia', async () => {
    await setStock(products[2].id, 6, 0);
    const p = products[2];
    const list = data(
      await as(userToken)(
        api()
          .post('/api/school-lists/quotations')
          .send({
            grade: 'Segundo Básico',
            customerName: 'Familia Anulación',
            customerPhone: '5555-3030',
            items: [
              {
                productId: p.id,
                productName: p.name,
                quantity: 10,
                unitPrice: Number(p.public_price),
              },
            ],
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    expect(await stock(p.id, 'Bodega')).toBe(-4);
    expect(list.supply.lines[0]).toEqual(
      expect.objectContaining({ requested: 10, allocated: 6, pending: 4 }),
    );
    const cancelled = data(
      await as(adminToken)(
        api().post(`/api/school-lists/quotations/${list.id}/cancel`).send({
          reason: 'El cliente desiste',
          clientRequestId: randomUUID(),
        }),
      ).expect(200),
    );
    expect(await stock(p.id, 'Bodega')).toBe(6);
    expect(
      (cancelled.supply.allocations as Body[]).map(
        (a) => `${a.quantity}:${a.status}`,
      ),
    ).toEqual(['6:LIBERADA']);
    expect(
      (cancelled.inventory as Body[]).map(
        (m) => `${m.movementType}:${m.quantity}`,
      ),
    ).toEqual(['SALIDA_LISTA_ESCOLAR:10', 'ENTRADA_ANULACION_LISTA:10']);

    // Ventas keeps its rule: no stock in Vitrina, no sale.
    await as(userToken)(
      api()
        .post('/api/sales')
        .send({ items: [{ productId: p.id, quantity: 1 }] }),
    ).expect(409);
  });
});
