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
 * Estado de Cuenta de Efectivo (owner request, 2026-11-21), HTTP end-to-end
 * over the real Kardex, bank-day openings, Transaccionar, Caja ↔ Bodega
 * transfers, Arqueo de Caja and Arqueo de Bodega.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/cash-statement.e2e-spec.ts`, which uses a
 * temporary `<db>_e2e` clone and drops it afterwards.
 */
describe('Control de Efectivo — Estado de Cuenta de Efectivo (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const admin = (req: request.Test) => as(adminToken)(req);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const DAY1 = '2099-06-01';
  const DAY2 = todayIsoDate();

  const statement = async (query: Body = {}, token = adminToken) =>
    data(
      await as(token)(
        api().get('/api/cash-control/statement').query(query),
      ).expect(200),
    );
  const position = async () =>
    data(await admin(api().get('/api/cash-control/position')).expect(200));
  const openBankDay = (date: string) =>
    admin(api().post('/api/banks/day-status/open').send({ date })).expect(200);
  const move = (movementType: string, amount: number, key = randomUUID()) =>
    admin(
      api().post('/api/cash-control/movements').send({
        movementType,
        amount,
        reason: 'Prueba del estado de cuenta',
        clientRequestId: key,
      }),
    ).expect(201);
  const count = (
    path: string,
    details: Body[],
    key = randomUUID(),
    token = adminToken,
  ) =>
    as(token)(
      api()
        .post(`/api/cash-control/${path}`)
        .send({ details, clientRequestId: key }),
    );
  const scalar = async (sql: string, params: unknown[] = []) =>
    Number((await dataSource.query(sql, params))[0].v);

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'cash-statement e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    adminToken = jwt.sign({ sub: sa.id, username: sa.username, role: sa.role });
    userToken = jwt.sign({
      sub: cashier.id,
      username: cashier.username,
      role: cashier.role,
    });

    // Caja = Q5,250 and Bodega = Q3,000 before day 1.
    const p = await position();
    if (!p.hasInitialBalance) {
      await move('SALDO_INICIAL', 5250);
    } else if (Number(p.balance) !== 5250) {
      await move('AJUSTE', 5250 - Number(p.balance));
    }
    await admin(
      api().post('/api/cash-control/warehouse/initial-balance').send({
        amount: 3000,
        reason: 'Saldo inicial e2e',
        clientRequestId: randomUUID(),
      }),
    ).expect(201);
  });

  afterAll(async () => {
    await app.close();
  });

  let day1Snapshot: Body;

  it('day 1: opening inherited, entries, exits, running balance, Caja → Bodega and the formula', async () => {
    await openBankDay(DAY1);
    // Day without movements.
    let s = await statement();
    expect(s.period).toMatchObject({
      kind: 'BANK_DAY',
      businessDate: DAY1,
      isCurrent: true,
    });
    expect(s.summary).toMatchObject({
      openingBalance: 5250,
      totalIn: 0,
      totalOut: 0,
      theoreticalBalance: 5250,
      movementCount: 0,
      consistent: true,
    });
    expect(s.summary.physical.status).toBe('SIN_ARQUEO');

    const entryKey = randomUUID();
    await move('ENTRADA_MANUAL', 1000, entryKey);
    await move('ENTRADA_MANUAL', 1000, entryKey); // retry: the same movement
    await move('SALIDA_MANUAL', 500);
    const transfer = data(
      await admin(
        api()
          .post('/api/cash-control/warehouse/transfers')
          .send({
            amount: 1500,
            details: [
              { denomination: 200, quantity: 5 },
              { denomination: 100, quantity: 3 },
              { denomination: 50, quantity: 2 },
              { denomination: 20, quantity: 5 },
            ],
            deliveredBy: 'Juan Caja',
            receivedBy: 'Ana Bodega',
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );

    s = await statement();
    expect(s.summary).toMatchObject({
      openingBalance: 5250,
      totalIn: 1000,
      totalOut: 2000,
      theoreticalBalance: 4250,
      kardexClosingBalance: 4250,
      consistent: true,
      movementCount: 3,
      toWarehouse: 1500,
    });
    expect((await position()).balance).toBe(4250);
    expect(
      s.movements.items.map((r: Body) => [r.direction, r.amount, r.newBalance]),
    ).toEqual([
      ['IN', 1000, 6250],
      ['OUT', 500, 5750],
      ['OUT', 1500, 4250],
    ]);
    const transferRow = s.movements.items[2];
    expect(transferRow).toMatchObject({
      movementType: 'ENTREGA_BODEGA',
      beneficiary: 'Ana Bodega',
      operationNumber:
        transfer.transfer?.referenceNumber ?? transferRow.operationNumber,
    });
    expect(transferRow.operationNumber).toMatch(/^ENT-/);
    expect(s.custody).toEqual({ cash: 4250, warehouse: 4500, total: 8750 });

    // Filters only change the table, never the period totals.
    const onlyIn = await statement({ direction: 'IN' });
    expect(onlyIn.movements.items).toHaveLength(1);
    expect(onlyIn.summary.totalOut).toBe(2000);
    const search = await statement({ search: 'ana bodega' });
    expect(search.movements.items.map((r: Body) => r.movementType)).toEqual([
      'ENTREGA_BODEGA',
    ]);
    const byNumber = await statement({ search: transferRow.operationNumber });
    expect(byNumber.movements.total).toBe(1);

    // Bodega has its own Kardex and balance.
    const bodega = await statement({ location: 'BODEGA' });
    expect(bodega.summary).toMatchObject({
      openingBalance: 3000,
      totalIn: 1500,
      totalOut: 0,
      theoreticalBalance: 4500,
      consistent: true,
    });
    expect(bodega.movements.items[0]).toMatchObject({
      movementType: 'ENTREGA_DESDE_CAJA',
      operationNumber: transferRow.operationNumber,
    });
  });

  it('arqueos: Caja faltante and Bodega sobrante stay apart; nothing is adjusted and the Kardex does not move', async () => {
    const kardex = await scalar(`SELECT count(*) AS v FROM cash_movements`);
    const warehouseKardex = await scalar(
      `SELECT count(*) AS v FROM warehouse_cash_movements`,
    );

    const caja = data(
      await count('counts', [{ denomination: 200, quantity: 21 }]).expect(201),
    );
    expect(caja).toMatchObject({
      totalCounted: 4200,
      difference: -50,
      result: 'FALTANTE',
    });

    const auditKey = randomUUID();
    const audit = data(
      await count(
        'warehouse/audits',
        [{ denomination: 50, quantity: 91 }],
        auditKey,
      ).expect(201),
    );
    expect(audit).toMatchObject({
      theoreticalBalance: 4500,
      totalCounted: 4550,
      difference: 50,
      result: 'SOBRANTE',
    });
    // Retry: the same audit.
    const again = data(
      await count(
        'warehouse/audits',
        [{ denomination: 50, quantity: 91 }],
        auditKey,
      ).expect(201),
    );
    expect(again.id).toBe(audit.id);
    expect(
      await scalar(`SELECT count(*) AS v FROM warehouse_cash_audits`),
    ).toBe(1);

    // A cashier may neither count Bodega nor read it.
    await count(
      'warehouse/audits',
      [{ denomination: 50, quantity: 1 }],
      randomUUID(),
      userToken,
    ).expect(403);

    const s = await statement();
    expect(s.summary.theoreticalBalance).toBe(4250);
    expect(s.summary.physical).toMatchObject({
      status: 'FALTANTE',
      movementsAfter: 0,
      count: { counted: 4200, difference: -50, source: 'ARQUEO_CAJA' },
    });
    const bodega = await statement({ location: 'BODEGA' });
    expect(bodega.summary.theoreticalBalance).toBe(4500);
    expect(bodega.summary.physical).toMatchObject({
      status: 'SOBRANTE',
      count: { counted: 4550, difference: 50, source: 'ARQUEO_BODEGA' },
    });
    // Custody stays theoretical: Caja −50 and Bodega +50 never net out.
    expect(s.custody).toEqual({ cash: 4250, warehouse: 4500, total: 8750 });
    expect(await scalar(`SELECT count(*) AS v FROM cash_movements`)).toBe(
      kardex,
    );
    expect(
      await scalar(`SELECT count(*) AS v FROM warehouse_cash_movements`),
    ).toBe(warehouseKardex);
    expect((await position()).balance).toBe(4250);

    day1Snapshot = await statement({ bankDate: DAY1 });
  });

  it('day 2: inherits day 1 closing, Transaccionar with beneficiary, operations without physical effect excluded', async () => {
    await openBankDay(DAY2);
    let s = await statement();
    expect(s.period.businessDate).toBe(DAY2);
    expect(s.summary.openingBalance).toBe(4250);
    expect(s.summary.physical.status).toBe('SIN_ARQUEO');
    expect(s.warnings.map((w: Body) => w.code)).toContain(
      'PREVIOUS_CLOSE_DIFFERENCE',
    );

    const [{ id: agentId }] = await dataSource.query(
      `SELECT id FROM transaction_banks WHERE is_active AND cash_box_code IS NULL ORDER BY created_at LIMIT 1`,
    );
    const [{ id: accountId }] = await dataSource.query(
      `SELECT id FROM banks WHERE is_active AND special_account IS NULL AND available_in_transaccionar
       AND max_balance IS NULL ORDER BY created_at LIMIT 1`,
    );
    const typeOf = async (name: string) =>
      (
        await dataSource.query(
          `SELECT id FROM transaction_types WHERE is_active AND name = $1`,
          [name],
        )
      )[0].id as string;
    const operation = (typeName: string, amount: number, description: string) =>
      typeOf(typeName).then((typeId) =>
        admin(
          api()
            .post('/api/bank-deposits')
            .send({
              transactionBankId: agentId,
              bankAccountId: accountId,
              transactionTypeId: typeId,
              totalAmount: amount,
              cashBreakdownEnabled: false,
              cashDetails: [],
              transactionAmounts: [amount],
              description,
            }),
        ).expect(201),
      );
    const bankBefore = await scalar(
      `SELECT final_balance AS v FROM banks WHERE id = $1`,
      [accountId],
    );
    await operation('Retiros', 150, 'Juan Pérez - Retiro de remesa');
    await operation('Remesas', 300, 'Operación sin efectivo');
    await move('ENTRADA_MANUAL', 2000);

    s = await statement();
    expect(s.summary).toMatchObject({
      openingBalance: 4250,
      totalIn: 2000,
      totalOut: 150,
      theoreticalBalance: 6100,
      kardexClosingBalance: 6100,
      consistent: true,
      movementCount: 2,
    });
    expect(s.movements.items.map((r: Body) => r.movementType)).toEqual([
      'RETIRO',
      'ENTRADA_MANUAL',
    ]);
    expect(s.movements.items[0].beneficiary).toBe(
      'Juan Pérez - Retiro de remesa',
    );
    // The "Remesas" row exists in the Kardex (NONE) but is not a physical movement.
    expect(
      await scalar(
        `SELECT count(*) AS v FROM cash_movements WHERE direction = 'NONE' AND created_at > now() - interval '1 hour'`,
      ),
    ).toBeGreaterThan(0);
    // The bank side of the Retiro moved the account, never the statement.
    expect(
      await scalar(`SELECT final_balance AS v FROM banks WHERE id = $1`, [
        accountId,
      ]),
    ).toBe(bankBefore + 150);

    // Cuadrado, then a later movement leaves the count outdated (warned, not adjusted).
    await count('counts', [{ denomination: 100, quantity: 61 }]).expect(201);
    expect((await statement()).summary.physical.status).toBe('CUADRADO');
    await move('SALIDA_MANUAL', 100);
    s = await statement();
    expect(s.summary.physical).toMatchObject({
      status: 'CUADRADO',
      movementsAfter: 1,
    });
    expect(s.warnings.map((w: Body) => w.code)).toContain(
      'MOVEMENTS_AFTER_COUNT',
    );
    expect(s.summary.theoreticalBalance).toBe(6000);

    // Bodega → Caja: Caja up, Bodega down, custody unchanged.
    await count('warehouse/counts', [
      { denomination: 100, quantity: 45 },
    ]).expect(201);
    const custodyBefore = s.custody.total;
    await admin(
      api()
        .post('/api/cash-control/warehouse/withdrawals')
        .send({
          destination: 'CAJA',
          amount: 500,
          details: [{ denomination: 100, quantity: 5 }],
          deliveredBy: 'Ana Bodega',
          receivedBy: 'Juan Caja',
          clientRequestId: randomUUID(),
        }),
    ).expect(201);
    s = await statement();
    expect(s.summary.fromWarehouse).toBe(500);
    expect(s.custody).toEqual({
      cash: 6500,
      warehouse: 4000,
      total: custodyBefore,
    });
  });

  it('history: day 1 is stable, the day list and a calendar range agree with the Kardex', async () => {
    const day1 = await statement({ bankDate: DAY1 });
    expect(day1.summary).toEqual(day1Snapshot.summary);
    expect(day1.movements).toEqual(day1Snapshot.movements);
    expect(day1.period.isCurrent).toBe(false);

    const days = data(
      await admin(
        api().get('/api/cash-control/statement/days').query({ limit: 5 }),
      ).expect(200),
    ) as unknown as Body[];
    expect(days[0]).toMatchObject({
      businessDate: DAY2,
      isCurrent: true,
      openingBalance: 4250,
      closingBalance: 6500,
    });
    expect(days[1]).toMatchObject({
      businessDate: DAY1,
      openingBalance: 5250,
      totalIn: 1000,
      totalOut: 2000,
      closingBalance: 4250,
      lastCount: { result: 'FALTANTE', difference: -50 },
    });

    const range = await statement({ dateFrom: DAY2, dateTo: DAY2 });
    expect(range.period.kind).toBe('RANGE');
    expect(range.summary.consistent).toBe(true);
    expect(range.summary.theoreticalBalance).toBe((await position()).balance);

    // The Kardex chain is intact.
    expect(
      await scalar(`SELECT count(*) AS v FROM cash_movements m
        WHERE m.previous_balance <> COALESCE((SELECT p.new_balance FROM cash_movements p
          WHERE p.sequence < m.sequence ORDER BY p.sequence DESC LIMIT 1), 0)`),
    ).toBe(0);
  });

  it('permissions, exports and validation', async () => {
    const cashier = await statement({}, userToken);
    expect(cashier.canViewCustody).toBe(false);
    expect([
      cashier.counts,
      cashier.cuts,
      cashier.custody,
      cashier.summary.physical,
    ]).toEqual([null, null, null, null]);
    expect(cashier.summary.theoreticalBalance).toBe(6500);
    await as(userToken)(
      api().get('/api/cash-control/statement').query({ location: 'BODEGA' }),
    ).expect(403);
    const cashierDays = data(
      await as(userToken)(api().get('/api/cash-control/statement/days')).expect(
        200,
      ),
    ) as unknown as Body[];
    expect(cashierDays.every((d) => d.lastCount === null)).toBe(true);

    const pdf = await admin(
      api()
        .get('/api/cash-control/statement/export')
        .query({ format: 'pdf', bankDate: DAY1 }),
    ).expect(200);
    expect(pdf.headers['content-type']).toContain('application/pdf');
    expect((pdf.body as Buffer).subarray(0, 4).toString()).toBe('%PDF');
    const xlsx = await admin(
      api()
        .get('/api/cash-control/statement/export')
        .query({ format: 'xlsx' })
        .buffer(true)
        .parse((res, done) => {
          const chunks: Buffer[] = [];
          res.on('data', (c: Buffer) => chunks.push(c));
          res.on('end', () => done(null, Buffer.concat(chunks)));
        }),
    ).expect(200);
    expect((xlsx.body as Buffer).subarray(0, 2).toString()).toBe('PK');

    await admin(
      api()
        .get('/api/cash-control/statement')
        .query({ bankDate: '2099-12-31' }),
    ).expect(404);
    await admin(
      api()
        .get('/api/cash-control/statement')
        .query({ dateFrom: '2099-06-02', dateTo: '2099-06-01' }),
    ).expect(400);
    await admin(
      api()
        .get('/api/cash-control/statement')
        .query({ bankDate: DAY1, dateFrom: DAY1 }),
    ).expect(400);
  });
});
