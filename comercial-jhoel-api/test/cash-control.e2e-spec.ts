import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Control de Efectivo — HTTP end-to-end flow (full AppModule, real Postgres).
 *
 * WRITES DATA: run it only through `test/run-cash-control-e2e.sh`, which
 * points the app at a temporary clone of the database and drops the clone
 * afterwards. It refuses to run against a database whose name does not end
 * in `_e2e`.
 */
describe('Control de Efectivo (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let adminId: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const data = (response: request.Response): Body => (response.body as { data: Body }).data;

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error('cash-control e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)');
    }
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    dataSource = app.get(DataSource);
    const jwt = app.get(JwtService);
    const [admin] = (await dataSource.query(`
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
        SELECT 'e2e_cajero', '00000000', 'x', id, true FROM roles WHERE name = 'USER'
        RETURNING id, username, 'USER' AS role
      `)) as Body[];
    }
    adminId = String(admin.id);
    adminToken = jwt.sign({ sub: admin.id, username: admin.username, role: admin.role });
    userToken = jwt.sign({ sub: user.id, username: user.username, role: user.role });
  });

  afterAll(async () => {
    await app?.close();
  });

  const asAdmin = (req: request.Test) => req.set('Authorization', `Bearer ${adminToken}`);
  const asUser = (req: request.Test) => req.set('Authorization', `Bearer ${userToken}`);

  it('requires a JWT', async () => {
    await api().get('/api/cash-control/position').expect(401);
  });

  it('runs the full day: saldo inicial → apertura → 2 cortes → cierre, with RBAC and idempotency', async () => {
    // Anyone authenticated can read; only managers open/close (21).
    const initial = data(await asUser(api().get('/api/cash-control/position')).expect(200));
    expect(initial.dayState).toBe('SIN_APERTURA');
    await asUser(api().post('/api/cash-control/days/open').send({})).expect(403);
    await asUser(
      api().post('/api/cash-control/movements').send({ movementType: 'ENTRADA_MANUAL', amount: 1, reason: 'Intento de cajero' }),
    ).expect(403);

    // Saldo inicial (admin, reason) — a retried request returns the same movement (13).
    const clientRequestId = randomUUID();
    const payload = { movementType: 'SALDO_INICIAL', amount: 150000, reason: 'Carga inicial e2e', clientRequestId };
    const first = data(await asAdmin(api().post('/api/cash-control/movements').send(payload)).expect(201));
    const retry = data(await asAdmin(api().post('/api/cash-control/movements').send(payload)).expect(201));
    expect(retry.movement.id).toBe(first.movement.id);
    expect(first.movement.direction).toBe('IN');
    const base = Number(first.balance);

    // Apertura (1) with a schedule; invalid schedule rejected first.
    await asAdmin(
      api().post('/api/cash-control/days/open').send({ firstStart: '07:00', firstEnd: '14:00', secondStart: '13:00', secondEnd: '19:00' }),
    ).expect(400);
    const opened = data(
      await asAdmin(
        api().post('/api/cash-control/days/open').send({ firstStart: '07:00', firstEnd: '13:00', secondStart: '13:00', secondEnd: '19:00' }),
      ).expect(200),
    );
    expect(opened.dayState).toBe('ABIERTO');
    expect(opened.periods).toHaveLength(2);
    const [p1, p2] = opened.periods as Body[];

    await asAdmin(
      api().patch(`/api/cash-control/cuts/${p1.id}/schedule`).send({ start: '08:00', end: '12:00', reason: 'Turno corto e2e' }),
    ).expect(200);
    await asAdmin(api().post(`/api/cash-control/cuts/${p2.id}/start`)).expect(400); // 16: second before first
    const started = data(await asAdmin(api().post(`/api/cash-control/cuts/${p1.id}/start`)).expect(200));
    expect(started.openPeriod.id).toBe(p1.id);
    await asAdmin(api().post(`/api/cash-control/cuts/${p1.id}/start`)).expect(409); // 15: twice

    // A Transaccionar deposit moves the Kardex through the trigger (2, 10, 11).
    const [ids] = (await dataSource.query(`
      SELECT (SELECT id FROM transaction_banks WHERE cash_box_code IS NULL AND is_active ORDER BY created_at LIMIT 1) AS agent,
             (SELECT id FROM banks WHERE is_active AND special_account IS NULL AND available_in_transaccionar ORDER BY created_at LIMIT 1) AS account,
             (SELECT id FROM transaction_types WHERE balance_effect = 'DEPOSITO' AND is_active LIMIT 1) AS type
    `)) as Body[];
    await dataSource.query(`SELECT adjust_bank_balance($1, 900000, CURRENT_DATE, $2, 'Base e2e', NULL)`, [ids.account, adminId]);
    await dataSource.query(
      `SELECT register_bank_deposit_operation($1, 5000, CURRENT_DATE, '[]'::jsonb, '[5000]'::jsonb, $2, $3, 'Cliente e2e', 0, NULL, $4, false)`,
      [ids.agent, adminId, ids.type, ids.account],
    );
    const recent = data(await asUser(api().get('/api/cash-control/movements/recent')).expect(200)) as unknown as Body[];
    expect(recent[0].movementType).toBe('DEPOSITO');
    expect(recent[0].direction).toBe('IN');
    expect(Number(recent[0].newBalance)).toBe(base + 5000);
    expect(recent[0].bankName).toBeTruthy();
    expect(recent.length).toBeLessThanOrEqual(10);

    const kardex = data(await asUser(api().get('/api/cash-control/movements?direction=IN&limit=5')).expect(200));
    expect((kardex.items as Body[]).every((row) => row.direction === 'IN')).toBe(true);

    // Finish cut 1: count = system, every active bank verified (15, 19).
    const banks = data(await asAdmin(api().get('/api/cash-control/bank-balances')).expect(200)) as unknown as Body[];
    const bankPayload = banks.map((bank) => ({ bankId: bank.bankId, verifiedBalance: Number(bank.balance) }));
    const system = base + 5000;
    const details = [
      { denomination: 200, quantity: Math.floor(system / 200) },
      { denomination: 1, quantity: Math.round(system - Math.floor(system / 200) * 200) },
    ];
    await asAdmin(api().post(`/api/cash-control/cuts/${p1.id}/finish`).send({ details, banks: [] })).expect(400);
    const finished = data(await asAdmin(api().post(`/api/cash-control/cuts/${p1.id}/finish`).send({ details, banks: bankPayload })).expect(200));
    const firstCut = (finished.periods as Body[]).find((row) => row.id === p1.id)!;
    expect(firstCut.status).toBe('FINALIZADO');
    expect(Number(firstCut.cashDifference)).toBe(0);

    // Second cut inherits the counted cash (17), then the day closes (20).
    const second = data(await asAdmin(api().post(`/api/cash-control/cuts/${p2.id}/start`)).expect(200));
    expect(Number(second.openPeriod.openingPhysicalCash)).toBe(Number(firstCut.closingPhysicalCash));
    await asAdmin(api().post(`/api/cash-control/days/${opened.day.id}/close`).send({})).expect(400);
    await asAdmin(api().post(`/api/cash-control/cuts/${p2.id}/finish`).send({ details, banks: bankPayload })).expect(200);
    const closed = data(await asAdmin(api().post(`/api/cash-control/days/${opened.day.id}/close`).send({ observations: 'Fin e2e' })).expect(200));
    expect(closed.dayState).toBe('CERRADO');

    // Historial + detalle (8).
    const history = data(await asUser(api().get('/api/cash-control/days?limit=5')).expect(200));
    expect((history.items as Body[])[0].periods).toHaveLength(2);
    const detail = data(await asUser(api().get(`/api/cash-control/cuts/${p1.id}`)).expect(200));
    expect((detail.counts as Body[])[0].isCurrent).toBe(true);
    expect((detail.bankReconciliations as Body[]).length).toBe(banks.length);

    // Reopen is admin-only; supervisors/users get 403.
    await asUser(api().post(`/api/cash-control/cuts/${p2.id}/reopen`).send({ reason: 'Revisión e2e' })).expect(403);

    // 24: a "new session" (fresh token) sees exactly the same persisted state.
    const fresh = app.get(JwtService).sign({ sub: adminId, username: 'again', role: 'ADMIN' });
    const persisted = data(await api().get('/api/cash-control/position').set('Authorization', `Bearer ${fresh}`).expect(200));
    expect(persisted.dayState).toBe('CERRADO');
    expect(Number(persisted.balance)).toBe(system);
  });

  it('Depósito bancario: cash out of the caja, bank account up, with breakdown; void reverses both', async () => {
    // Like every balance-moving bank operation, the business day must be open (Agentes Bancarios cycle).
    await dataSource.query(
      `INSERT INTO day_openings (date, opened_by)
       SELECT (now() AT TIME ZONE 'America/Guatemala')::date, $1
       WHERE NOT EXISTS (SELECT 1 FROM day_openings WHERE date = (now() AT TIME ZONE 'America/Guatemala')::date)`,
      [adminId],
    );
    const [account] = (await dataSource.query(
      `SELECT id, final_balance FROM banks WHERE is_active AND special_account IS NULL ORDER BY created_at LIMIT 1`,
    )) as Body[];
    const before = Number(data(await asAdmin(api().get('/api/cash-control/balance')).expect(200)).balance);
    const payload = {
      bankId: account.id,
      amount: 450,
      details: [
        { denomination: 200, quantity: 2 },
        { denomination: 50, quantity: 1 },
      ],
      description: 'Depósito e2e',
      clientRequestId: randomUUID(),
    };

    await asUser(api().post('/api/cash-control/bank-deposits').send(payload)).expect(403);
    await asAdmin(
      api().post('/api/cash-control/bank-deposits').send({ ...payload, details: [{ denomination: 200, quantity: 2 }] }),
    ).expect(400);

    const created = data(await asAdmin(api().post('/api/cash-control/bank-deposits').send(payload)).expect(201));
    const retried = data(await asAdmin(api().post('/api/cash-control/bank-deposits').send(payload)).expect(201));
    expect(retried.movement.id).toBe(created.movement.id);
    expect(created.movement.movementType).toBe('DEPOSITO_BANCARIO');
    expect(created.movement.direction).toBe('OUT');
    expect(Number(created.balance)).toBe(before - 450);
    expect((created.movement.details as Body[]).map((d) => [Number(d.denomination), d.quantity])).toEqual([
      [200, 2],
      [50, 1],
    ]);
    const [afterDeposit] = (await dataSource.query(`SELECT final_balance FROM banks WHERE id = $1`, [account.id])) as Body[];
    expect(Number(afterDeposit.final_balance)).toBe(Number(account.final_balance) + 450);

    const voided = data(
      await asAdmin(api().post(`/api/cash-control/movements/${created.movement.id}/void`).send({ reason: 'Depósito e2e erróneo' })).expect(201),
    );
    expect(Number(voided.balance)).toBe(before);
    const [afterVoid] = (await dataSource.query(`SELECT final_balance FROM banks WHERE id = $1`, [account.id])) as Body[];
    expect(Number(afterVoid.final_balance)).toBe(Number(account.final_balance));
  });
});
