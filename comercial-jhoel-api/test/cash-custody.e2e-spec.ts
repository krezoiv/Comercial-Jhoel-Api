import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Arqueo de Caja + Entrega de Efectivo a Bodega — HTTP end-to-end over the
 * acceptance scenario (caja Q100,000 / Bodega Q20,000 → delivery Q15,000 →
 * count Q84,500 = faltante Q500), plus RBAC and the consolidated Cuadre.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/cash-custody.e2e-spec.ts`,
 * which uses a temporary `<db>_e2e` clone and drops it afterwards.
 */
describe('Control de Efectivo — arqueo y Bodega (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const custody = async () =>
    data(
      await as(adminToken)(api().get('/api/cash-control/custody')).expect(200),
    );
  const kardexCount = async () =>
    Number(
      (
        (await dataSource.query(
          `SELECT count(*) AS c FROM cash_movements`,
        )) as Body[]
      )[0].c,
    );

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'cash-custody e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    const admin = users.find((u) => u.role === 'SUPER_ADMIN')!;
    const cashier = users.find((u) => u.role === 'USER')!;
    adminToken = jwt.sign({
      sub: admin.id,
      username: admin.username,
      role: admin.role,
    });
    userToken = jwt.sign({
      sub: cashier.id,
      username: cashier.username,
      role: cashier.role,
    });

    // Open bank day + caja Q100,000 + Bodega Q20,000.
    await as(adminToken)(
      api().post('/api/banks/day-status/open').send({ date: '2099-08-01' }),
    ).expect(200);
    const position = data(
      await as(adminToken)(api().get('/api/cash-control/position')).expect(200),
    );
    const move = (movementType: string, amount: number) =>
      as(adminToken)(
        api().post('/api/cash-control/movements').send({
          movementType,
          amount,
          reason: 'Preparación e2e',
          clientRequestId: randomUUID(),
        }),
      ).expect(201);
    if (!position.hasInitialBalance) {
      await move('SALDO_INICIAL', 100000);
    } else if (Number(position.balance) !== 100000) {
      await move('AJUSTE', 100000 - Number(position.balance));
    }
    await as(adminToken)(
      api().post('/api/cash-control/warehouse/initial-balance').send({
        amount: 20000,
        reason: 'Saldo inicial e2e',
        clientRequestId: randomUUID(),
      }),
    ).expect(201);
  });

  afterAll(async () => {
    await app.close();
  });

  it('RBAC is enforced in the backend', async () => {
    await as(userToken)(api().get('/api/cash-control/custody')).expect(403);
    await as(userToken)(api().get('/api/cash-control/counts')).expect(403);
    await as(userToken)(
      api()
        .post('/api/cash-control/warehouse/transfers')
        .send({
          amount: 100,
          details: [{ denomination: 100, quantity: 1 }],
          deliveredBy: 'Juan Caja',
          receivedBy: 'Ana Bodega',
          clientRequestId: randomUUID(),
        }),
    ).expect(403);
  });

  it('acceptance: delivery Q15,000 then count Q84,500 (faltante Q500), nothing adjusted', async () => {
    expect(await custody()).toEqual(
      expect.objectContaining({
        cashBalance: 100000,
        warehouseBalance: 20000,
        custodyTotal: 120000,
      }),
    );

    // Over the caja balance: rejected, nothing written.
    const over = await as(adminToken)(
      api().post('/api/cash-control/warehouse/transfers').send({
        amount: 100000.01,
        deliveredBy: 'Juan Caja',
        receivedBy: 'Ana Bodega',
        clientRequestId: randomUUID(),
      }),
    ).expect(400);
    expect(JSON.stringify(over.body)).toContain('efectivo');
    expect(await custody()).toEqual(
      expect.objectContaining({ cashBalance: 100000, warehouseBalance: 20000 }),
    );

    const requestId = randomUUID();
    const body = {
      amount: 15000,
      details: [{ denomination: 200, quantity: 75 }],
      deliveredBy: 'Juan Caja',
      receivedBy: 'Ana Bodega',
      voucherReference: 'COMP-001',
      clientRequestId: requestId,
    };
    const created = data(
      await as(adminToken)(
        api().post('/api/cash-control/warehouse/transfers').send(body),
      ).expect(201),
    );
    const retried = data(
      await as(adminToken)(
        api().post('/api/cash-control/warehouse/transfers').send(body),
      ).expect(201),
    );
    expect(retried.transfer.id).toBe(created.transfer.id);
    expect(created.custody).toEqual(
      expect.objectContaining({
        cashBalance: 85000,
        warehouseBalance: 35000,
        custodyTotal: 120000,
      }),
    );

    // Both related movements, same amount and reference, an internal transfer (not an expense).
    const transfer = data(
      await as(adminToken)(
        api().get(
          `/api/cash-control/warehouse/transfers/${created.transfer.id}`,
        ),
      ).expect(200),
    );
    const cashMovement = data(
      await as(adminToken)(
        api().get(`/api/cash-control/movements/${transfer.cashMovementId}`),
      ).expect(200),
    );
    expect([
      cashMovement.movementType,
      cashMovement.direction,
      Number(cashMovement.amount),
    ]).toEqual(['ENTREGA_BODEGA', 'OUT', 15000]);
    const warehouse = data(
      await as(adminToken)(
        api().get('/api/cash-control/warehouse/movements'),
      ).expect(200),
    );
    const entry = (warehouse.items as Body[]).find(
      (m) => m.id === transfer.warehouseMovementId,
    )!;
    expect([
      entry.movementType,
      entry.direction,
      entry.amount,
      entry.transferReference,
    ]).toEqual(['ENTREGA_DESDE_CAJA', 'IN', 15000, transfer.referenceNumber]);

    // Arqueo: 422 × Q200 + 1 × Q100 = Q84,500.
    const kardexBefore = await kardexCount();
    const count = data(
      await as(adminToken)(
        api()
          .post('/api/cash-control/counts')
          .send({
            details: [
              { denomination: 200, quantity: 422 },
              { denomination: 100, quantity: 1 },
            ],
            observations: 'Arqueo e2e',
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    expect([
      count.systemCash,
      count.totalCounted,
      count.difference,
      count.result,
    ]).toEqual([85000, 84500, -500, 'FALTANTE']);
    expect([
      count.warehouseBalance,
      count.warehouseCounted,
      count.custodyTheoretical,
    ]).toEqual([35000, null, 120000]);
    expect(await kardexCount()).toBe(kardexBefore);
    expect(await custody()).toEqual(
      expect.objectContaining({
        cashBalance: 85000,
        warehouseBalance: 35000,
        custodyTotal: 120000,
      }),
    );

    // History shows exactly what was recorded.
    const history = data(
      await as(adminToken)(
        api().get('/api/cash-control/counts').query({ result: 'FALTANTE' }),
      ).expect(200),
    );
    const stored = (history.items as Body[]).find((c) => c.id === count.id)!;
    expect(stored.details).toEqual(
      expect.arrayContaining([
        { denomination: 200, quantity: 422, subtotal: 84400 },
        { denomination: 100, quantity: 1, subtotal: 100 },
      ]),
    );

    // Consolidated Cuadre de Agentes includes the cash under Bodega custody.
    const summary = data(
      await as(adminToken)(
        api().get('/api/banks/cuadre-agentes-summary'),
      ).expect(200),
    );
    expect(summary.totalWarehouseCash).toBe(35000);
  });
});
