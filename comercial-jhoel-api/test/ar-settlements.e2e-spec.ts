import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Cuentas por Cobrar → cancelación (efectivo / depósito bancario, individual
 * y múltiple) — HTTP end-to-end (full AppModule, real Postgres).
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/ar-settlements.e2e-spec.ts`, which uses a
 * temporary `<db>_e2e` clone and drops it afterwards.
 */
describe('Cuentas por Cobrar — cancelación (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let jwt: JwtService;
  let admin: Record<string, any>;
  let adminToken: string;
  let userToken: string;
  let clientA: string;
  let clientB: string;
  let bankId: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const data = (response: request.Response): Body => (response.body as { data: Body }).data;
  const asAdmin = (req: request.Test) => req.set('Authorization', `Bearer ${adminToken}`);
  const asUser = (req: request.Test) => req.set('Authorization', `Bearer ${userToken}`);
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guatemala' }).format(new Date());

  const cash = async () => Number(data(await asAdmin(api().get('/api/cash-control/balance')).expect(200)).balance);
  const bankBalance = async () =>
    Number(((await dataSource.query(`SELECT final_balance FROM banks WHERE id = $1`, [bankId])) as Body[])[0].final_balance);
  const charge = async (clientId: string, amount: number, description: string) =>
    String(
      data(
        await asAdmin(api().post(`/api/accounts-receivable/${clientId}/charges`).send({ date: today, amount, description })).expect(201),
      ).id,
    );

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error('ar-settlements e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)');
    }
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    dataSource = app.get(DataSource);
    jwt = app.get(JwtService);
    [admin] = (await dataSource.query(`
      SELECT u.id, u.username, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id
      WHERE r.name IN ('SUPER_ADMIN', 'ADMIN') AND u.is_active ORDER BY u.created_at LIMIT 1
    `)) as Body[];
    let [user] = (await dataSource.query(`
      SELECT u.id, u.username, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id
      WHERE r.name = 'USER' AND u.is_active ORDER BY u.created_at LIMIT 1
    `)) as Body[];
    if (!user) {
      [user] = (await dataSource.query(`
        INSERT INTO users (username, phone, password_hash, role_id, is_active)
        SELECT 'e2e_cajero_cxc', '00000001', 'x', id, true FROM roles WHERE name = 'USER'
        RETURNING id, username, 'USER' AS role
      `)) as Body[];
    }
    adminToken = jwt.sign({ sub: admin.id, username: admin.username, role: admin.role });
    userToken = jwt.sign({ sub: user.id, username: user.username, role: user.role });

    [{ id: clientA }] = (await dataSource.query(
      `INSERT INTO clients (name, created_by) VALUES ('Cliente e2e A', $1) RETURNING id`,
      [admin.id],
    )) as { id: string }[];
    [{ id: clientB }] = (await dataSource.query(
      `INSERT INTO clients (name, created_by) VALUES ('Cliente e2e B', $1) RETURNING id`,
      [admin.id],
    )) as { id: string }[];
    [{ id: bankId }] = (await dataSource.query(
      `SELECT id FROM banks WHERE is_active AND special_account IS NULL ORDER BY created_at LIMIT 1`,
    )) as { id: string }[];

    // The clone may start with an empty Kardex: load a base so cash never goes negative.
    const [{ count }] = (await dataSource.query(
      `SELECT count(*)::int AS count FROM cash_movements WHERE movement_type = 'SALDO_INICIAL' AND status = 'VIGENTE'`,
    )) as { count: number }[];
    if (count === 0) {
      await asAdmin(
        api().post('/api/cash-control/movements').send({ movementType: 'SALDO_INICIAL', amount: 150000, reason: 'Base e2e CxC' }),
      ).expect(201);
    }
  });

  afterAll(async () => {
    await app?.close();
  });

  it('requires a JWT and an admin role to collect (18)', async () => {
    await api().get('/api/account-receivable-payments').expect(401);
    const id = await charge(clientA, 100, 'Cargo RBAC');
    await asUser(
      api()
        .post('/api/account-receivable-payments')
        .send({ clientId: clientA, items: [{ accountReceivableId: id }], paymentMethod: 'EFECTIVO', expectedTotal: 100 }),
    ).expect(403);
    // Reading is open to any authenticated account.
    await asUser(api().get(`/api/account-receivable-payments/clients/${clientA}/pending`)).expect(200);
  });

  it('cancels several accounts in cash in one operation (3, 6, 7, 8, 12, 15, 20)', async () => {
    const ids = [
      await charge(clientA, 500, 'Venta de productos'),
      await charge(clientA, 1000, 'Servicio'),
      await charge(clientA, 750, 'Venta de accesorios'),
    ];
    const items = ids.map((accountReceivableId) => ({ accountReceivableId }));
    const before = await cash();

    const preview = data(
      await asAdmin(
        api().post('/api/account-receivable-payments/preview').send({ clientId: clientA, items, paymentMethod: 'EFECTIVO' }),
      ).expect(200),
    );
    expect(preview.total).toBe(2250);
    expect(preview.cash).toEqual({ current: before, after: before + 2250 });

    const payload = {
      clientId: clientA,
      items,
      paymentMethod: 'EFECTIVO',
      expectedTotal: 2250,
      observations: 'Pago de tres cuentas',
      clientRequestId: randomUUID(),
    };
    const result = data(await asAdmin(api().post('/api/account-receivable-payments').send(payload)).expect(201));
    expect(result.operation.totalAmount).toBe(2250);
    expect(result.operation.details).toHaveLength(3);
    expect(result.operation.cashMovementId).toBeTruthy();
    expect(result.operation.operationalDate === null || result.operation.operationalDate === today).toBe(true);
    expect(result.cashBalance).toBe(before + 2250);

    // A retry with the same clientRequestId returns the same operation, no double cash.
    const retry = data(await asAdmin(api().post('/api/account-receivable-payments').send(payload)).expect(201));
    expect(retry.operation.id).toBe(result.operation.id);
    expect(await cash()).toBe(before + 2250);

    // Each account is now CANCELADA in the list.
    const list = data(await asAdmin(api().get(`/api/accounts-receivable?clientId=${clientA}&limit=50`)).expect(200));
    const states = (list.items as Body[]).filter((row) => ids.includes(row.id)).map((row) => row.paymentStatus);
    expect(states).toEqual(['CANCELADA', 'CANCELADA', 'CANCELADA']);

    // Already cancelled accounts are rejected (5).
    await asAdmin(
      api()
        .post('/api/account-receivable-payments')
        .send({ clientId: clientA, items: [items[0]], paymentMethod: 'EFECTIVO', expectedTotal: 500 }),
    ).expect(409);
  });

  it('rejects accounts of different clients without touching anything (4, 13, 14)', async () => {
    const a = await charge(clientA, 300, 'Cargo A');
    const b = await charge(clientB, 200, 'Cargo B');
    const before = await cash();
    const response = await asAdmin(
      api()
        .post('/api/account-receivable-payments')
        .send({
          clientId: clientA,
          items: [{ accountReceivableId: a }, { accountReceivableId: b }],
          paymentMethod: 'EFECTIVO',
          expectedTotal: 500,
        }),
    ).expect(400);
    expect(String(response.body.message ?? JSON.stringify(response.body))).toContain('mismo cliente');
    expect(await cash()).toBe(before);
    const pending = data(await asAdmin(api().get(`/api/account-receivable-payments/clients/${clientA}/pending`)).expect(200));
    expect((pending.charges as Body[]).some((row) => row.id === a && row.pendingAmount === 300)).toBe(true);
  });

  it('cancels by bank deposit: bank up, cash unchanged, reference kept; void reverses (2, 9, 10, 11, 17)', async () => {
    const id = await charge(clientB, 2000, 'Venta crédito');
    const cashBefore = await cash();
    const bankBefore = await bankBalance();

    const result = data(
      await asAdmin(
        api()
          .post('/api/account-receivable-payments')
          .send({
            clientId: clientB,
            items: [{ accountReceivableId: id }],
            paymentMethod: 'DEPOSITO_BANCARIO',
            bankId,
            referenceNumber: 'BOL-E2E-1',
            expectedTotal: 2000,
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    expect(result.operation.referenceNumber).toBe('BOL-E2E-1');
    expect(result.operation.cashMovementId).toBeNull();
    expect(result.operation.bankBalanceAfter).toBe(bankBefore + 2000);
    expect(await cash()).toBe(cashBefore);
    expect(await bankBalance()).toBe(bankBefore + 2000);

    const history = data(await asAdmin(api().get(`/api/account-receivable-payments/charges/${id}`)).expect(200));
    expect(history.charge.status).toBe('CANCELADA');
    expect(history.payments).toHaveLength(1);
    expect(history.payments[0]).toMatchObject({ paymentMethod: 'DEPOSITO_BANCARIO', referenceNumber: 'BOL-E2E-1' });

    // Void: user 403, admin reverses the bank, cash still unchanged.
    await asUser(
      api().post(`/api/account-receivable-payments/${result.operation.id}/void`).send({ reason: 'Depósito rebotado' }),
    ).expect(403);
    const voided = data(
      await asAdmin(
        api().post(`/api/account-receivable-payments/${result.operation.id}/void`).send({ reason: 'Depósito rebotado' }),
      ).expect(200),
    );
    expect(voided.operation.status).toBe('ANULADO');
    expect(await bankBalance()).toBe(bankBefore);
    expect(await cash()).toBe(cashBefore);
  });

  it('partial payment of a single account updates its pending (1, 7)', async () => {
    const id = await charge(clientA, 1000, 'Parcial');
    const result = data(
      await asAdmin(
        api()
          .post('/api/account-receivable-payments')
          .send({ clientId: clientA, items: [{ accountReceivableId: id, amount: 400 }], paymentMethod: 'EFECTIVO', expectedTotal: 400 }),
      ).expect(201),
    );
    expect(result.operation.details[0]).toMatchObject({ previousBalance: 1000, amountPaid: 400, newBalance: 600 });
    const history = data(await asAdmin(api().get(`/api/account-receivable-payments/charges/${id}`)).expect(200));
    expect(history.charge).toMatchObject({ pendingAmount: 600, status: 'PARCIAL' });
  });

  it('keeps the history after logging in again (19)', async () => {
    const freshToken = jwt.sign({ sub: admin.id, username: admin.username, role: admin.role });
    const list = data(
      await api()
        .get(`/api/account-receivable-payments?clientId=${clientA}`)
        .set('Authorization', `Bearer ${freshToken}`)
        .expect(200),
    );
    expect(list.total).toBeGreaterThanOrEqual(2);
    const detail = data(
      await api()
        .get(`/api/account-receivable-payments/${(list.items as Body[])[0].id}`)
        .set('Authorization', `Bearer ${freshToken}`)
        .expect(200),
    );
    expect(detail.details.length).toBeGreaterThan(0);
  });
});
