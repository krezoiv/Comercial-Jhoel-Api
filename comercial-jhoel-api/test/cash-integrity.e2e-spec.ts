import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { todayIsoDate } from '../src/modules/recharges/application/utils/today-iso-date';

/**
 * Auditoría de efectivo, arqueo de apertura y resolución de diferencias
 * (migration 1760009200000), HTTP end-to-end. Day 1 is a clean day with real
 * cuts (no finding may appear: no false positives). Day 2 gets anomalies
 * injected directly in the clone — an omitted operation, an inverted sign, a
 * fixed-direction type the wrong way, a tampered stored balance and a possible
 * duplicate — and the audit must report each one, locate the count difference
 * between two arqueos and never change anything by itself.
 *
 * WRITES DATA AND TAMPERS WITH ROWS: run it only through
 * `test/run-cash-control-e2e.sh test/cash-integrity.e2e-spec.ts` (temporary
 * `<db>_e2e` clone, dropped afterwards).
 */
describe('Control de Efectivo — auditoría de efectivo (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let adminId: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const admin = (req: request.Test) => as(adminToken)(req);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const DAY1 = '2099-07-01';
  const DAY2 = todayIsoDate();

  const position = async () =>
    data(await admin(api().get('/api/cash-control/position')).expect(200));
  const integrity = async (query: Body = {}) =>
    data(
      await admin(api().get('/api/cash-control/integrity').query(query)).expect(
        200,
      ),
    );
  const move = (movementType: string, amount: number) =>
    admin(
      api().post('/api/cash-control/movements').send({
        movementType,
        amount,
        reason: 'Prueba de auditoría',
        clientRequestId: randomUUID(),
      }),
    ).expect(201);
  const count = (details: Body[]) =>
    admin(
      api()
        .post('/api/cash-control/counts')
        .send({ details, clientRequestId: randomUUID() }),
    ).expect(201);
  const scalar = async (sql: string, params: unknown[] = []) =>
    Number((await dataSource.query(sql, params))[0].v);
  const keys = (report: Body) =>
    (report.findings as Body[]).map((f) => f.check as string);

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'cash-integrity e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    const users = await dataSource.query(`
      SELECT u.id, u.username, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id
      WHERE u.is_active ORDER BY u.created_at
    `);
    const sa = users.find((u) => u.role === 'SUPER_ADMIN')!;
    const cashier = users.find((u) => u.role === 'USER')!;
    adminId = sa.id;
    adminToken = jwt.sign({ sub: sa.id, username: sa.username, role: sa.role });
    userToken = jwt.sign({
      sub: cashier.id,
      username: cashier.username,
      role: cashier.role,
    });

    const p = await position();
    if (!p.hasInitialBalance) {
      await move('SALDO_INICIAL', 5000);
    } else if (Number(p.balance) !== 5000) {
      await move('AJUSTE', 5000 - Number(p.balance));
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('a clean day with real cuts has no findings (no false positives)', async () => {
    await admin(
      api().post('/api/banks/day-status/open').send({ date: DAY1 }),
    ).expect(200);
    await move('ENTRADA_MANUAL', 1000);
    const opened = data(
      await admin(
        api().post('/api/cash-control/days/open').send({
          firstStart: '00:00',
          firstEnd: '12:00',
          secondStart: '12:00',
          secondEnd: '23:59',
        }),
      ).expect(200),
    );
    const [p1, p2] = opened.periods as Body[];
    await admin(api().post(`/api/cash-control/cuts/${p1.id}/start`)).expect(
      200,
    );
    const banks = data(
      await admin(api().get('/api/cash-control/bank-balances')).expect(200),
    ) as unknown as Body[];
    const bankPayload = banks.map((bank) => ({
      bankId: bank.bankId,
      verifiedBalance: Number(bank.balance),
    }));
    await admin(
      api()
        .post(`/api/cash-control/cuts/${p1.id}/finish`)
        .send({
          details: [{ denomination: 200, quantity: 30 }],
          banks: bankPayload,
        }),
    ).expect(200);
    await admin(api().post(`/api/cash-control/cuts/${p2.id}/start`)).expect(
      200,
    );
    await move('ENTRADA_MANUAL', 500);
    await admin(
      api()
        .post(`/api/cash-control/cuts/${p2.id}/finish`)
        .send({
          details: [
            { denomination: 200, quantity: 32 },
            { denomination: 100, quantity: 1 },
          ],
          banks: bankPayload,
        }),
    ).expect(200);

    const report = await integrity();
    expect(report.period.businessDate).toBe(DAY1);
    expect(report.findings).toEqual([]);
    expect(report.summary.status).toBe('OK');
    expect((report.timeline.caja as Body[]).map((c) => c.difference)).toEqual([
      0, 0,
    ]);
  });

  let countA: Body;
  let countB: Body;

  it('day 2: opening count reconciled with yesterday closing; anomalies are detected and located', async () => {
    await admin(
      api().post('/api/banks/day-status/open').send({ date: DAY2 }),
    ).expect(200);
    // Pending opening: a warning, never a block.
    const pending = data(
      await admin(api().get('/api/cash-control/counts/opening/current')).expect(
        200,
      ),
    );
    expect(pending).toMatchObject({
      businessDate: DAY2,
      previousCloseBalance: 6500,
      opening: null,
    });
    const statement = data(
      await admin(api().get('/api/cash-control/statement')).expect(200),
    );
    expect((statement.warnings as Body[]).map((w) => w.code)).toContain(
      'OPENING_PENDING',
    );

    const openingBody = {
      details: [
        { denomination: 200, quantity: 32 },
        { denomination: 50, quantity: 1 },
      ],
      clientRequestId: randomUUID(),
    };
    await admin(
      api().post('/api/cash-control/counts/opening').send(openingBody),
    ).expect(400);
    await as(userToken)(
      api().post('/api/cash-control/counts/opening').send(openingBody),
    ).expect(403);
    const opening = data(
      await admin(
        api()
          .post('/api/cash-control/counts/opening')
          .send({
            ...openingBody,
            reason: 'Faltan Q50 al contar la apertura',
            responsible: 'Supervisor de turno',
          }),
      ).expect(201),
    );
    expect(opening.opening).toMatchObject({
      counted: 6450,
      difference: -50,
      responsible: 'Supervisor de turno',
    });
    expect(opening.lastCountBefore).toMatchObject({
      counted: 6500,
      difference: 0,
    });
    expect((await position()).balance).toBe(6500); // the opening never squares the caja

    // Regular day: a Transaccionar withdrawal and a possible duplicate.
    const [{ id: agentId }] = await dataSource.query(
      `SELECT id FROM transaction_banks WHERE is_active AND cash_box_code IS NULL ORDER BY created_at LIMIT 1`,
    );
    const [{ id: accountId }] = await dataSource.query(
      `SELECT id FROM banks WHERE is_active AND special_account IS NULL AND available_in_transaccionar
       AND max_balance IS NULL ORDER BY created_at LIMIT 1`,
    );
    const [{ id: retiro }] = await dataSource.query(
      `SELECT id FROM transaction_types WHERE is_active AND name = 'Retiros'`,
    );
    const withdraw = async (amount: number, description: string) =>
      data(
        await admin(
          api()
            .post('/api/bank-deposits')
            .send({
              transactionBankId: agentId,
              bankAccountId: accountId,
              transactionTypeId: retiro,
              totalAmount: amount,
              cashBreakdownEnabled: false,
              cashDetails: [],
              transactionAmounts: [amount],
              description,
            }),
        ).expect(201),
      );
    await withdraw(150, 'Juan Pérez - Retiro');
    await move('ENTRADA_MANUAL', 300);
    await move('ENTRADA_MANUAL', 300);
    // Arqueo A: the same Q50 shortage as the opening (carried over, not new).
    countA = data(
      await count([
        { denomination: 200, quantity: 34 },
        { denomination: 100, quantity: 1 },
      ]),
    );
    expect(countA).toMatchObject({ systemCash: 6950, difference: -50 });

    // Anomalies (injected in the clone only).
    await dataSource.query(
      `ALTER TABLE bank_deposit_operations DISABLE TRIGGER trg_cash_bank_deposit_insert`,
    );
    const omitted = await withdraw(200, 'Retiro que no llegó al Kardex');
    const inverted = await withdraw(100, 'Retiro registrado al revés');
    await dataSource.query(
      `ALTER TABLE bank_deposit_operations ENABLE TRIGGER trg_cash_bank_deposit_insert`,
    );
    await dataSource.query(
      `SELECT apply_cash_movement('RETIRO', 'IN', 100, $1, 'Retiro registrado al revés', 'BANK_DEPOSIT', $2,
         NULL, NULL, NULL, 'E2E-INVERTED')`,
      [adminId, inverted.id],
    );
    await dataSource.query(
      `SELECT apply_cash_movement('SALIDA_MANUAL', 'IN', 25, $1, 'Salida registrada como entrada', NULL, NULL,
         NULL, 'Prueba', NULL, 'E2E-SIGN')`,
      [adminId],
    );
    await dataSource.query(
      `ALTER TABLE cash_bank_day_openings DISABLE TRIGGER trg_cash_bank_day_openings_immutable`,
    );
    await dataSource.query(
      `UPDATE cash_bank_day_openings SET opening_cash_balance = opening_cash_balance + 10 WHERE business_date = $1`,
      [DAY2],
    );
    await dataSource.query(
      `ALTER TABLE cash_bank_day_openings ENABLE TRIGGER trg_cash_bank_day_openings_immutable`,
    );

    // Arqueo B: Q150 short → the difference grew Q100 between A and B.
    countB = data(
      await count([
        { denomination: 200, quantity: 34 },
        { denomination: 100, quantity: 1 },
        { denomination: 5, quantity: 5 },
      ]),
    );
    expect(countB).toMatchObject({ systemCash: 7075, difference: -150 });

    const kardexBefore = await scalar(
      `SELECT count(*) AS v FROM cash_movements`,
    );
    const report = await integrity();
    expect(await scalar(`SELECT count(*) AS v FROM cash_movements`)).toBe(
      kardexBefore,
    ); // read-only
    expect(report.summary.status).toBe('ALERTA');
    const byCheck = (check: string) =>
      (report.findings as Body[]).filter((f) => f.check === check);

    expect(byCheck('SOURCE_MISSING')).toEqual([
      expect.objectContaining({
        classification: 'MOVIMIENTO_OMITIDO',
        reference: expect.objectContaining({ id: omitted.id }),
      }),
    ]);
    expect(byCheck('SOURCE_SIGN')).toEqual([
      expect.objectContaining({
        classification: 'ERROR_REGISTRO',
        amount: 200,
        reference: expect.objectContaining({ id: inverted.id }),
      }),
    ]);
    expect(byCheck('SIGN_RULE')).toHaveLength(1);
    expect(byCheck('POSSIBLE_DUPLICATE')).toHaveLength(1);
    expect(byCheck('SNAPSHOT')).toEqual([
      expect.objectContaining({ classification: 'ERROR_CALCULO', amount: 10 }),
    ]);

    // When did the difference start? Opening: −50 since yesterday's last count; B: −100 since A.
    const changes = byCheck('DIFFERENCE_CHANGE');
    expect(
      changes.map((c) => [
        c.count.label.startsWith('Arqueo de apertura'),
        c.amount,
      ]),
    ).toEqual(
      expect.arrayContaining([
        [true, -50],
        [false, -100],
      ]),
    );
    const atB = changes.find((c) => c.count.id === countB.id)!;
    expect(atB.window).toEqual({
      location: 'CAJA',
      afterSequence: expect.any(Number),
      upToSequence: expect.any(Number),
    });
    // The inverted sign and the wrong-way exit happened inside that stretch: possible explanations.
    expect(atB.relatedKeys).toEqual(
      expect.arrayContaining([
        `SOURCE_SIGN:BANK_DEPOSIT:${inverted.id}`,
        expect.stringMatching(/^SIGN_RULE:/),
      ]),
    );
    expect(report.summary.unresolvedDifferences).toBeGreaterThanOrEqual(2);

    // Investigate the stretch: its movements in order, with users and balances.
    const window = data(
      await admin(
        api().get('/api/cash-control/integrity/movements').query(atB.window),
      ).expect(200),
    );
    expect(
      (window.items as Body[]).map((r) => [
        r.movementType,
        r.direction,
        r.amount,
      ]),
    ).toEqual([
      ['RETIRO', 'IN', 100],
      ['SALIDA_MANUAL', 'IN', 25],
    ]);

    // The statement sees the tampered opening as a warning too, and corrects nothing.
    const st = data(
      await admin(api().get('/api/cash-control/statement')).expect(200),
    );
    expect((st.warnings as Body[]).map((w) => w.code)).toContain(
      'OPENING_ANCHOR_MISMATCH',
    );
  });

  it('a difference is closed only by an admin, with cause and explanation; it stays visible as resolved', async () => {
    const body = {
      source: 'ARQUEO_CAJA',
      countId: countB.id,
      cause: 'ERROR_REGISTRO',
      explanation:
        'Retiro de Q100 registrado como entrada; se repone con ajuste autorizado',
      withAdjustment: true,
      clientRequestId: randomUUID(),
    };
    await as(userToken)(
      api().post('/api/cash-control/integrity/resolutions').send(body),
    ).expect(403);
    const balance = (await position()).balance;
    await admin(
      api().post('/api/cash-control/integrity/resolutions').send(body),
    ).expect(201);
    await admin(
      api()
        .post('/api/cash-control/integrity/resolutions')
        .send({ ...body, clientRequestId: randomUUID() }),
    ).expect(409);
    expect((await position()).balance).toBe(balance - 150);

    const report = await integrity();
    const atB = (report.findings as Body[]).find(
      (f) => f.count?.id === countB.id,
    )!;
    expect(atB.count.resolution).toMatchObject({
      cause: 'ERROR_REGISTRO',
      adjustmentMovementId: expect.any(String),
    });
    expect(atB.count.difference).toBe(-150); // the original count is never edited
    await admin(
      api().post('/api/cash-control/integrity/resolutions').send({
        source: 'ARQUEO_CAJA',
        countId: countA.id,
        cause: 'NO_DETERMINADA',
        explanation: 'corta',
        clientRequestId: randomUUID(),
      }),
    ).expect(400);
  });

  it('only supervisors and admins can audit', async () => {
    await as(userToken)(api().get('/api/cash-control/integrity')).expect(403);
    await as(userToken)(
      api().get('/api/cash-control/counts/opening/current'),
    ).expect(403);
    await as(userToken)(
      api()
        .get('/api/cash-control/integrity/movements')
        .query({ afterSequence: 0, upToSequence: 1 }),
    ).expect(403);
    const history = await integrity({ bankDate: DAY1 });
    expect(history.findings).toEqual([]);
  });
});
