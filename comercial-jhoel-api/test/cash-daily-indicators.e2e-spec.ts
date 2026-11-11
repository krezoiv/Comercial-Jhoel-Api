import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Control de Efectivo — daily indicators restart at every bank-day opening
 * (Agentes Bancarios → "Aperturar día"), HTTP end-to-end with the real
 * opening endpoint. The physical balance and the Kardex never restart.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/cash-daily-indicators.e2e-spec.ts`,
 * which uses a temporary `<db>_e2e` clone and drops it afterwards.
 */
describe('Control de Efectivo — acumulados por apertura bancaria (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let token: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const auth = (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const DAY1 = '2099-05-01';
  const DAY2 = '2099-05-02';

  const position = async () =>
    data(await auth(api().get('/api/cash-control/position')).expect(200));
  const openBankDay = (date: string) =>
    auth(api().post('/api/banks/day-status/open').send({ date })).expect(200);
  const move = (movementType: string, amount: number) =>
    auth(
      api()
        .post('/api/cash-control/movements')
        .send({
          movementType,
          amount,
          reason: 'Prueba de acumulados diarios',
          clientRequestId: randomUUID(),
        }),
    ).expect(201);
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
        'cash-daily-indicators e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    const [admin] = (await dataSource.query(`
      SELECT u.id, u.username, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id
      WHERE r.name = 'SUPER_ADMIN' AND u.is_active ORDER BY u.created_at LIMIT 1
    `)) as Body[];
    token = app
      .get(JwtService)
      .sign({ sub: admin.id, username: admin.username, role: admin.role });

    // Physical cash = Q100,000 before day 1 (initial balance or an audited adjustment).
    const balance = Number((await position()).balance);
    if (!(await position()).hasInitialBalance) {
      await move('SALDO_INICIAL', 100000);
    } else if (balance !== 100000) {
      await move('AJUSTE', 100000 - balance);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('day 1 → opening of day 2 → day 2 → historical day 1 (acceptance scenario)', async () => {
    // ── Día 1 ───────────────────────────────────────────────────────────────
    await openBankDay(DAY1);
    let p = await position();
    expect(p.bankDay.businessDate).toBe(DAY1);
    expect([
      p.summary.totalIn,
      p.summary.totalOut,
      p.summary.movementCount,
    ]).toEqual([0, 0, 0]);
    expect(p.balance).toBe(100000);

    await move('ENTRADA_MANUAL', 10000);
    await move('SALIDA_MANUAL', 5000);
    p = await position();
    expect([p.summary.totalIn, p.summary.totalOut]).toEqual([10000, 5000]);
    expect(p.balance).toBe(105000);

    // Opening the same day again changes nothing.
    await openBankDay(DAY1);
    p = await position();
    expect([p.summary.totalIn, p.summary.totalOut]).toEqual([10000, 5000]);
    const anchors = (await dataSource.query(
      `SELECT count(*) AS c FROM cash_bank_day_openings WHERE business_date = $1`,
      [DAY1],
    )) as Body[];
    expect(Number(anchors[0].c)).toBe(1);

    // ── Apertura del día 2 ──────────────────────────────────────────────────
    const kardexBefore = await kardexCount();
    await openBankDay(DAY2);
    p = await position();
    expect(p.bankDay.businessDate).toBe(DAY2);
    expect([
      p.summary.totalIn,
      p.summary.totalOut,
      p.summary.movementCount,
    ]).toEqual([0, 0, 0]);
    expect(p.summary.openingBalance).toBe(105000);
    expect(p.balance).toBe(105000);
    expect(await kardexCount()).toBe(kardexBefore);

    // ── Día 2 ───────────────────────────────────────────────────────────────
    await move('ENTRADA_MANUAL', 8000);
    await move('SALIDA_MANUAL', 3000);
    p = await position();
    expect([p.summary.totalIn, p.summary.totalOut]).toEqual([8000, 3000]);
    expect(p.balance).toBe(110000);

    // ── Consulta histórica del día 1 ────────────────────────────────────────
    const day1 = data(
      await auth(api().get(`/api/cash-control/bank-days/${DAY1}`)).expect(200),
    );
    expect([
      day1.totalIn,
      day1.totalOut,
      day1.openingBalance,
      day1.closingBalance,
    ]).toEqual([10000, 5000, 100000, 105000]);
    expect(day1.isCurrent).toBe(false);

    const kardexDay1 = data(
      await auth(
        api()
          .get('/api/cash-control/movements')
          .query({ bankDate: DAY1, limit: 200 }),
      ).expect(200),
    );
    expect(kardexDay1.items.map((m: Body) => Number(m.amount)).sort()).toEqual(
      [10000, 5000].sort(),
    );
    const kardexDay2 = data(
      await auth(
        api()
          .get('/api/cash-control/movements')
          .query({ bankDate: DAY2, limit: 200 }),
      ).expect(200),
    );
    expect([kardexDay2.totalIn, kardexDay2.totalOut]).toEqual([8000, 3000]);

    const days = data(
      await auth(
        api().get('/api/cash-control/bank-days').query({ limit: 5 }),
      ).expect(200),
    ) as unknown as Body[];
    expect(days[0].businessDate).toBe(DAY2);
    expect(days[1].businessDate).toBe(DAY1);

    // The Kardex keeps every movement of both days, chained in its original order.
    const broken = (await dataSource.query(`
      SELECT count(*) AS c FROM cash_movements m
      WHERE m.previous_balance <> COALESCE((SELECT p.new_balance FROM cash_movements p
        WHERE p.sequence < m.sequence ORDER BY p.sequence DESC LIMIT 1), 0)
    `)) as Body[];
    expect(Number(broken[0].c)).toBe(0);

    await auth(api().get('/api/cash-control/bank-days/2099-12-31')).expect(404);
  });
});
