import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Control de Efectivo — per-denomination inventory of caja and Bodega,
 * transfers with mandatory breakdown and Arqueo de Caja drafts (migration
 * 1760007800000), end to end over HTTP: Bodega → caja with exact bills/coins
 * and rejection of unavailable denominations, caja → Bodega limited only by
 * the official caja balance (migration 1760008900000), history with
 * filters and breakdown, and drafts that survive "navigation", reload and a new
 * login (they live in the database, per user and bank day).
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/cash-inventory.e2e-spec.ts`,
 * which uses a temporary `<db>_e2e` clone and drops it afterwards.
 */
describe('Control de Efectivo — inventario por denominación y borradores (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let superToken: string;
  let adminToken: string;
  let userToken: string;
  let superId: string;
  let adminId: string;
  let jwt: JwtService;
  let superUser: Record<string, any>;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const qty = (inv: Body, d: number) =>
    inv.lines.find((l: Body) => l.denomination === d).quantity;
  const inventory = async () =>
    data(
      await as(superToken)(api().get('/api/cash-control/inventory')).expect(
        200,
      ),
    );

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'cash-inventory e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    jwt = app.get(JwtService);
    const users = (await dataSource.query(`
      SELECT u.id, u.username, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id WHERE u.is_active ORDER BY u.created_at
    `)) as Body[];
    superUser = users.find((u) => u.role === 'SUPER_ADMIN')!;
    const admin = users.find((u) => u.role === 'ADMIN')!;
    const cashier = users.find((u) => u.role === 'USER')!;
    superId = superUser.id;
    adminId = admin.id;
    const sign = (u: Body) =>
      jwt.sign({ sub: u.id, username: u.username, role: u.role });
    superToken = sign(superUser);
    adminToken = sign(admin);
    userToken = sign(cashier);

    await as(superToken)(
      api().post('/api/banks/day-status/open').send({ date: '2099-12-01' }),
    ).expect(200);
    // Caja en Q3,000 (saldo de sobra) para el escenario.
    const balance = Number(
      ((await dataSource.query('SELECT cash_balance() AS b')) as Body[])[0].b,
    );
    await dataSource.query(
      `SELECT apply_cash_movement('AJUSTE', $1, $2, $3, 'Preparación e2e', NULL, NULL, NULL, 'e2e', NULL, $4)`,
      [
        balance < 3000 ? 'IN' : 'OUT',
        Math.abs(3000 - balance) || 0.01,
        superId,
        'E2E-INV-' + randomUUID(),
      ],
    );
    if (Math.abs(3000 - balance) === 0) {
      await dataSource.query(
        `SELECT apply_cash_movement('AJUSTE', 'OUT', 0.01, $1, 'Preparación e2e', NULL, NULL, NULL, 'e2e', NULL, $2)`,
        [superId, 'E2E-INV-' + randomUUID()],
      );
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('borrador del arqueo: autosave por usuario, se recupera tras "recargar" o volver a iniciar sesión, y se limpia solo al confirmar', async () => {
    // Nobody has a draft yet.
    expect(
      data(
        await as(superToken)(
          api().get('/api/cash-control/counts/draft'),
        ).expect(200),
      ),
    ).toBeNull();
    await as(userToken)(api().get('/api/cash-control/counts/draft')).expect(
      403,
    );

    const payload = {
      details: [
        { denomination: 200, quantity: 10 },
        { denomination: 100, quantity: 5 },
        { denomination: 0.01, quantity: 0 },
      ],
      observations: 'Conteo a medias',
    };
    const saved = data(
      await as(superToken)(
        api().put('/api/cash-control/counts/draft').send(payload),
      ).expect(200),
    );
    expect(saved.version).toBe(1);
    const again = data(
      await as(superToken)(
        api()
          .put('/api/cash-control/counts/draft')
          .send({
            ...payload,
            details: [...payload.details, { denomination: 50, quantity: 2 }],
          }),
      ).expect(200),
    );
    expect(again.version).toBe(2);

    // "Reload" / new login: a fresh token of the same user gets the same draft.
    const freshToken = jwt.sign({
      sub: superUser.id,
      username: superUser.username,
      role: superUser.role,
    });
    const recovered = data(
      await as(freshToken)(api().get('/api/cash-control/counts/draft')).expect(
        200,
      ),
    );
    expect(recovered.payload.details).toEqual([
      { denomination: 200, quantity: 10 },
      { denomination: 100, quantity: 5 },
      { denomination: 0.01, quantity: 0 },
      { denomination: 50, quantity: 2 },
    ]);
    expect(recovered.payload.observations).toBe('Conteo a medias');

    // Another user never sees it (each draft is keyed by the JWT user).
    expect(
      data(
        await as(adminToken)(
          api().get('/api/cash-control/counts/draft'),
        ).expect(200),
      ),
    ).toBeNull();

    // Invalid quantities are rejected (DTO): negative and decimal.
    await as(superToken)(
      api()
        .put('/api/cash-control/counts/draft')
        .send({ details: [{ denomination: 200, quantity: -1 }] }),
    ).expect(400);
    await as(superToken)(
      api()
        .put('/api/cash-control/counts/draft')
        .send({ details: [{ denomination: 200, quantity: 1.5 }] }),
    ).expect(400);

    // Confirming the arqueo clears the draft (it becomes the caja inventory anchor: 10×Q200 + 5×Q100 + 2×Q50).
    await as(superToken)(
      api()
        .post('/api/cash-control/counts')
        .send({
          details: recovered.payload.details,
          clientRequestId: randomUUID(),
        }),
    ).expect(201);
    expect(
      data(
        await as(superToken)(
          api().get('/api/cash-control/counts/draft'),
        ).expect(200),
      ),
    ).toBeNull();

    // Explicit reset also clears it.
    await as(adminToken)(
      api().put('/api/cash-control/counts/draft').send(payload),
    ).expect(200);
    await as(adminToken)(api().delete('/api/cash-control/counts/draft')).expect(
      200,
    );
    expect(
      data(
        await as(adminToken)(
          api().get('/api/cash-control/counts/draft'),
        ).expect(200),
      ),
    ).toBeNull();
  });

  it('caja → Bodega (limitada por el saldo oficial) y Bodega → caja (por denominación) con historial y desglose', async () => {
    let inv = await inventory();
    expect(inv.cash.hasAnchor).toBe(true);
    expect([qty(inv.cash, 200), qty(inv.cash, 100), qty(inv.cash, 50)]).toEqual(
      [10, 5, 2],
    );

    // Without breakdown: rejected even for SUPER_ADMIN.
    const noBreakdown = await as(superToken)(
      api().post('/api/cash-control/warehouse/transfers').send({
        amount: 200,
        deliveredBy: 'Cajero e2e',
        receivedBy: 'Bodega e2e',
        clientRequestId: randomUUID(),
      }),
    ).expect(400);
    expect(noBreakdown.body.message).toContain('desglose');

    // Over the OFFICIAL caja balance: 400 saying how much is available. The
    // inventory derived from the last arqueo is no longer a limit
    // (migration 1760008900000).
    const cashBalance = Number(inv.cash.balance);
    const bills = Math.floor(cashBalance / 200) + 1;
    const tooMuch = await as(superToken)(
      api()
        .post('/api/cash-control/warehouse/transfers')
        .send({
          amount: bills * 200,
          details: [{ denomination: 200, quantity: bills }],
          deliveredBy: 'Cajero e2e',
          receivedBy: 'Bodega e2e',
          clientRequestId: randomUUID(),
        }),
    ).expect(400);
    expect(tooMuch.body.message).toContain(
      'No puedes trasladar más efectivo del disponible en Caja. Efectivo disponible: Q',
    );

    // Caja → Bodega: 3×Q200 + 5×Q100 = Q1,100.
    const transfer = data(
      await as(superToken)(
        api()
          .post('/api/cash-control/warehouse/transfers')
          .send({
            amount: 1100,
            details: [
              { denomination: 200, quantity: 3 },
              { denomination: 100, quantity: 5 },
            ],
            deliveredBy: 'Cajero e2e',
            receivedBy: 'Bodega e2e',
            observations: 'Retiro de caja hacia Bodega',
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    inv = await inventory();
    expect([qty(inv.cash, 200), qty(inv.cash, 100)]).toEqual([7, 0]);

    // Bodega needs its initial count (admin) = its balance.
    const bodegaBalance = Number(inv.warehouse.balance);
    await as(superToken)(
      api()
        .post('/api/cash-control/warehouse/withdrawals')
        .send({
          destination: 'CAJA',
          amount: 200,
          details: [{ denomination: 200, quantity: 1 }],
          deliveredBy: 'Bodega e2e',
          receivedBy: 'Cajero e2e',
          clientRequestId: randomUUID(),
        }),
    ).expect(409);
    await as(userToken)(
      api()
        .post('/api/cash-control/warehouse/counts')
        .send({ details: [], clientRequestId: randomUUID() }),
    ).expect(403);
    const rest = Math.round((bodegaBalance - 1100) * 100);
    const countDetails = [
      { denomination: 200, quantity: 3 },
      { denomination: 100, quantity: 5 },
      ...(rest > 0 ? [{ denomination: 0.01, quantity: rest }] : []),
    ];
    const mismatch = await as(superToken)(
      api()
        .post('/api/cash-control/warehouse/counts')
        .send({
          details: [{ denomination: 200, quantity: 1 }],
          clientRequestId: randomUUID(),
        }),
    ).expect(409);
    expect(mismatch.body.message).toContain('no coincide con su saldo');
    await as(superToken)(
      api()
        .post('/api/cash-control/warehouse/counts')
        .send({ details: countDetails, clientRequestId: randomUUID() }),
    ).expect(201);
    inv = await inventory();
    expect(inv.warehouse.hasAnchor).toBe(true);
    expect(Number(inv.warehouse.unbroken)).toBe(0);

    // Bodega → caja: 2×Q200 + 3×Q100 = Q700.
    const toCash = data(
      await as(superToken)(
        api()
          .post('/api/cash-control/warehouse/withdrawals')
          .send({
            destination: 'CAJA',
            amount: 700,
            details: [
              { denomination: 200, quantity: 2 },
              { denomination: 100, quantity: 3 },
            ],
            deliveredBy: 'Bodega e2e',
            receivedBy: 'Cajero e2e',
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    inv = await inventory();
    expect([qty(inv.warehouse, 200), qty(inv.warehouse, 100)]).toEqual([1, 2]);
    expect([qty(inv.cash, 200), qty(inv.cash, 100)]).toEqual([9, 3]);
    // Known + unbroken = balance on both sides.
    for (const side of [inv.cash, inv.warehouse]) {
      expect(
        Math.round((Number(side.knownTotal) + Number(side.unbroken)) * 100),
      ).toBe(Math.round(Number(side.balance) * 100));
    }
    // More Q100 than Bodega has.
    const lack = await as(superToken)(
      api()
        .post('/api/cash-control/warehouse/withdrawals')
        .send({
          destination: 'CAJA',
          amount: 300,
          details: [{ denomination: 100, quantity: 3 }],
          deliveredBy: 'Bodega e2e',
          receivedBy: 'Cajero e2e',
          clientRequestId: randomUUID(),
        }),
    ).expect(409);
    expect(lack.body.message).toContain('disponibles 2, solicitados 3');

    // Unified history with filters and the breakdown of each movement.
    const all = data(
      await as(superToken)(
        api().get('/api/cash-control/custody/transfers'),
      ).expect(200),
    );
    const ours = all.items.filter((t: Body) =>
      [transfer.transfer.id, toCash.withdrawal.id].includes(t.id),
    );
    expect(ours.map((t: Body) => t.kind).sort()).toEqual([
      'BODEGA_A_CAJA',
      'CAJA_A_BODEGA',
    ]);
    const sent = ours.find((t: Body) => t.kind === 'BODEGA_A_CAJA');
    expect(sent.origin + '→' + sent.destination).toBe('BODEGA→CAJA');
    expect(
      sent.details.map((d: Body) => `${d.denomination}x${d.quantity}`),
    ).toEqual(['200x2', '100x3']);
    expect(sent.createdByUsername).toBe(superUser.username);
    // Caja and Bodega balances before/after come from the Kardex rows of the transfer.
    const delivered = ours.find((t: Body) => t.kind === 'CAJA_A_BODEGA');
    expect(
      delivered.cashBalanceBefore - delivered.cashBalanceAfter,
    ).toBeCloseTo(1100, 2);
    expect(
      delivered.warehouseBalanceAfter - delivered.warehouseBalanceBefore,
    ).toBeCloseTo(1100, 2);
    expect(
      delivered.details.map((d: Body) => `${d.denomination}x${d.quantity}`),
    ).toEqual(['200x3', '100x5']);
    expect(delivered.observations).toBe('Retiro de caja hacia Bodega');
    const filtered = data(
      await as(superToken)(
        api()
          .get('/api/cash-control/custody/transfers')
          .query({ kind: 'CAJA_A_BODEGA', userId: superId }),
      ).expect(200),
    );
    expect(
      filtered.items.every(
        (t: Body) => t.kind === 'CAJA_A_BODEGA' && t.createdById === superId,
      ),
    ).toBe(true);
    const byOther = data(
      await as(superToken)(
        api()
          .get('/api/cash-control/custody/transfers')
          .query({ userId: adminId }),
      ).expect(200),
    );
    expect(
      byOther.items.find((t: Body) => t.id === transfer.transfer.id),
    ).toBeUndefined();

    // Audited reversal restores the stock (nothing deleted).
    await as(superToken)(
      api()
        .post(
          `/api/cash-control/warehouse/withdrawals/${toCash.withdrawal.id}/void`,
        )
        .send({ reason: 'Prueba de reverso e2e' }),
    ).expect(200);
    inv = await inventory();
    expect([qty(inv.warehouse, 200), qty(inv.warehouse, 100)]).toEqual([3, 5]);
    expect([qty(inv.cash, 200), qty(inv.cash, 100)]).toEqual([7, 0]);
  });
});
