import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Cuadre de Agentes ← último Arqueo de Caja + Q0.01 — HTTP end-to-end over
 * the acceptance scenario (100 × Q0.01 = Q4,882.50; modified to 150 =
 * Q4,883.00): latest-count lookup, RBAC, breakdown persisted as an
 * independent photograph, original arqueo/Kardex/bank balances untouched.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/cuadre-cash-breakdown.e2e-spec.ts`,
 * which uses a temporary `<db>_e2e` clone and drops it afterwards.
 */
describe('Cuadre de Agentes — desglose desde el último arqueo (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let adminId: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;

  const ACCEPTANCE: Array<[number, number]> = [
    [200, 10],
    [100, 20],
    [50, 10],
    [20, 10],
    [10, 10],
    [5, 10],
    [1, 20],
    [0.5, 10],
    [0.25, 20],
    [0.1, 10],
    [0.05, 10],
    [0.01, 100],
  ];
  const details = (centavos: number) =>
    ACCEPTANCE.map(([denomination, quantity]) => ({
      denomination,
      quantity: denomination === 0.01 ? centavos : quantity,
    }));

  /** What the cuadre must never change: arqueos, caja/Bodega Kardex and bank balances. */
  const fingerprint = async () =>
    (
      (await dataSource.query(`
        SELECT md5(
          (SELECT COALESCE(string_agg(c::TEXT, '|' ORDER BY c.id), '') FROM cash_counts c) ||
          (SELECT COALESCE(string_agg(d::TEXT, '|' ORDER BY d.id), '') FROM cash_count_details d) ||
          (SELECT count(*)::TEXT FROM cash_movements) || cash_balance()::TEXT ||
          (SELECT count(*)::TEXT FROM warehouse_cash_movements) ||
          (SELECT count(*)::TEXT FROM bank_account_movements) ||
          (SELECT COALESCE(string_agg(b.id || '=' || b.final_balance, '|' ORDER BY b.id), '') FROM banks b)
        ) AS fp`)) as Body[]
    )[0].fp as string;

  /** Opens a bank day and stores the balance photo of every active account. */
  const openDay = async (date: string) => {
    await as(adminToken)(
      api().post('/api/banks/day-status/open').send({ date }),
    ).expect(200);
    await dataSource.query(
      `INSERT INTO bank_balances (bank_id, operation_date, previous_balance, final_balance, user_id)
       SELECT id, $1::date, final_balance, final_balance, $2 FROM banks WHERE is_active
       ON CONFLICT (bank_id, operation_date) DO NOTHING`,
      [date, adminId],
    );
  };

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'cuadre-cash-breakdown e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    adminId = admin.id;
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('flujo completo: cargar el último arqueo, modificar Q0.01 y guardar la foto', async () => {
    await openDay('2099-09-01');

    // RBAC: a cashier cannot read arqueos.
    await as(userToken)(api().get('/api/cash-control/counts/latest')).expect(
      403,
    );

    // Q0.01 accepted by the Arqueo de Caja; Q0.02 rejected by the DTO.
    await as(adminToken)(
      api()
        .post('/api/cash-control/counts')
        .send({
          details: [{ denomination: 0.02, quantity: 1 }],
          clientRequestId: randomUUID(),
        }),
    ).expect(400);
    const count = data(
      await as(adminToken)(
        api()
          .post('/api/cash-control/counts')
          .send({
            details: details(100),
            observations: 'Arqueo e2e con centavos',
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    expect(Number(count.totalCounted)).toBe(4882.5);

    // Latest valid count of the reference day, 12 denominations.
    const latest = data(
      await as(adminToken)(
        api()
          .get('/api/cash-control/counts/latest')
          .query({ businessDate: '2099-09-01' }),
      ).expect(200),
    );
    expect(latest.count.id).toBe(count.id);
    expect(latest.isFromReferenceDay).toBe(true);
    expect(latest.breakdown).toHaveLength(12);
    expect(
      latest.breakdown.find((r: Body) => r.denomination === 0.01).quantity,
    ).toBe(100);

    const before = await fingerprint();

    // The backend recomputes: a total that does not match the breakdown is rejected.
    await as(adminToken)(
      api()
        .post('/api/agent-reconciliations')
        .send({
          totalCash: 4882.5,
          date: '2099-09-01',
          cashDetails: details(150),
          cashBreakdownSource: 'ARQUEO_CAJA',
          sourceCashCountId: count.id,
        }),
    ).expect(400);
    // A cashier cannot base a cuadre on an arqueo.
    await as(userToken)(
      api()
        .post('/api/agent-reconciliations')
        .send({
          totalCash: 4883,
          date: '2099-09-01',
          cashDetails: details(150),
          cashBreakdownSource: 'ARQUEO_CAJA',
          sourceCashCountId: count.id,
        }),
    ).expect(403);

    // Modified after loading (100 → 150) and saved.
    const saved = data(
      await as(adminToken)(
        api()
          .post('/api/agent-reconciliations')
          .send({
            totalCash: 4883,
            date: '2099-09-01',
            cashDetails: details(150),
            cashBreakdownSource: 'ARQUEO_CAJA',
            sourceCashCountId: count.id,
          }),
      ).expect(201),
    );
    expect(Number(saved.totalCash)).toBe(4883);

    const [photo] = (await dataSource.query(
      `SELECT b.source, b.source_cash_count_id, b.modified_after_load, b.total_cash, b.source_total_counted,
              (SELECT quantity FROM agent_reconciliation_cash_details d
               WHERE d.reconciliation_id = b.reconciliation_id AND d.denomination = 0.01) AS cents,
              (SELECT count(*) FROM agent_reconciliation_cash_details d
               WHERE d.reconciliation_id = b.reconciliation_id) AS rows
       FROM agent_reconciliation_cash_breakdowns b WHERE b.reconciliation_id = $1`,
      [saved.id],
    )) as Body[];
    expect(photo).toMatchObject({
      source: 'ARQUEO_CAJA',
      source_cash_count_id: count.id,
      modified_after_load: true,
      total_cash: '4883.00',
      source_total_counted: '4882.50',
      cents: 150,
    });
    expect(Number(photo.rows)).toBe(12);

    // The original arqueo, the Kardex and the bank balances were not touched.
    expect(await fingerprint()).toBe(before);
    const original = data(
      await as(adminToken)(
        api().get(`/api/cash-control/counts/${count.id}`),
      ).expect(200),
    );
    expect(original.status).toBe('VIGENTE');
    expect(Number(original.totalCounted)).toBe(4882.5);
  });

  it('un cuadre manual al día siguiente: el arqueo previo se marca como de fecha anterior', async () => {
    await openDay('2099-09-02');
    const latest = data(
      await as(adminToken)(
        api()
          .get('/api/cash-control/counts/latest')
          .query({ businessDate: '2099-09-02' }),
      ).expect(200),
    );
    expect(latest.count).not.toBeNull();
    expect(latest.isFromReferenceDay).toBe(false);

    const saved = data(
      await as(adminToken)(
        api()
          .post('/api/agent-reconciliations')
          .send({
            totalCash: 0.33,
            date: '2099-09-02',
            cashDetails: [
              { denomination: 0.1, quantity: 1 },
              { denomination: 0.05, quantity: 4 },
              { denomination: 0.01, quantity: 3 },
            ],
            cashBreakdownSource: 'MANUAL',
          }),
      ).expect(201),
    );
    const [photo] = (await dataSource.query(
      `SELECT source, source_cash_count_id, total_cash FROM agent_reconciliation_cash_breakdowns WHERE reconciliation_id = $1`,
      [saved.id],
    )) as Body[];
    expect(photo).toEqual({
      source: 'MANUAL',
      source_cash_count_id: null,
      total_cash: '0.33',
    });
  });
});
