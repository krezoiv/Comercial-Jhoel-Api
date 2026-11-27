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
 * Cuentas por Cobrar / Activos ↔ Caja (migration 1760009300000), HTTP
 * end-to-end: payment method (cash vs bank), edits and deletions with reason,
 * Kardex reversals linked to their originals, the client statement keeping
 * voided rows and their history, the Estado de Cuenta de Efectivo showing the
 * same movements as the Kardex, the Transaccionar void cascade, and the audit
 * reporting an operation voided before the cascade until it is regularized.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/portfolio-cash.e2e-spec.ts` (temporary
 * `<db>_e2e` clone, dropped afterwards).
 */
describe('Cuentas por Cobrar / Activos ↔ Caja (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let adminId: string;
  let agentId: string;
  let accountId: string;
  let depositTypeId: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const admin = (req: request.Test) => as(adminToken)(req);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const TODAY = todayIsoDate();

  const balance = async () =>
    Number(
      data(await admin(api().get('/api/cash-control/position')).expect(200))
        .balance,
    );
  const newClient = async (name: string): Promise<string> =>
    (
      await dataSource.query(
        `INSERT INTO clients (name, created_by) VALUES ($1, $2) RETURNING id`,
        [name, adminId],
      )
    )[0].id;
  const register = (
    module: 'accounts-receivable' | 'assets',
    kind: 'charges' | 'payments',
    clientId: string,
    amount: number,
    paymentMethod?: 'EFECTIVO' | 'BANCO',
  ) =>
    admin(
      api()
        .post(`/api/${module}/${clientId}/${kind}`)
        .send({
          date: TODAY,
          amount,
          description: `Prueba ${kind}`,
          ...(paymentMethod ? { paymentMethod } : {}),
        }),
    );
  const trace = async (module: string, id: string) =>
    data(await admin(api().get(`/api/${module}/${id}/trace`)).expect(200));
  const kardexNet = async (referenceType: string, id: string) =>
    Number(
      (
        await dataSource.query(
          `SELECT COALESCE(sum(CASE direction WHEN 'IN' THEN amount WHEN 'OUT' THEN -amount ELSE 0 END), 0) AS v
           FROM cash_movements WHERE reference_type = $1 AND reference_id = $2`,
          [referenceType, id],
        )
      )[0].v,
    );
  const deposit = async (clientId: string, amount: number) =>
    data(
      await admin(
        api()
          .post('/api/bank-deposits')
          .send({
            transactionBankId: agentId,
            bankAccountId: accountId,
            transactionTypeId: depositTypeId,
            totalAmount: amount,
            cashBreakdownEnabled: false,
            cashDetails: [],
            transactionAmounts: [amount],
            description: 'Depósito a crédito',
            clientId,
            sendToAccountsReceivable: true,
          }),
      ).expect((res) => {
        if (res.status !== 201) {
          throw new Error(`deposit ${res.status}: ${JSON.stringify(res.body)}`);
        }
      }),
    );
  const linkedCharge = async (operationId: string): Promise<string> =>
    (
      await dataSource.query(
        `SELECT id FROM accounts_receivable WHERE reference_type = 'BANK_DEPOSIT' AND reference_id = $1`,
        [operationId],
      )
    )[0].id;
  const integrity = async () =>
    data(
      await admin(
        api()
          .get('/api/cash-control/integrity')
          .query({ dateFrom: TODAY, dateTo: TODAY }),
      ).expect(200),
    );

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'portfolio-cash e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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

    const position = data(
      await admin(api().get('/api/cash-control/position')).expect(200),
    );
    if (!position.hasInitialBalance) {
      await admin(
        api().post('/api/cash-control/movements').send({
          movementType: 'SALDO_INICIAL',
          amount: 50000,
          reason: 'Prueba de Cartera',
          clientRequestId: randomUUID(),
        }),
      ).expect(201);
    }
    [{ id: agentId }] = await dataSource.query(
      `SELECT id FROM transaction_banks WHERE is_active AND cash_box_code IS NULL ORDER BY created_at LIMIT 1`,
    );
    [{ id: accountId }] = await dataSource.query(
      `SELECT id FROM banks WHERE is_active AND special_account IS NULL AND available_in_transaccionar
       AND max_balance IS NULL ORDER BY created_at LIMIT 1`,
    );
    [{ id: depositTypeId }] = await dataSource.query(
      `SELECT id FROM transaction_types WHERE is_active AND balance_effect = 'DEPOSITO' ORDER BY created_at LIMIT 1`,
    );
    // Transaccionar needs the business day open (Agentes Bancarios cycle).
    await dataSource.query(
      `INSERT INTO day_openings (date, opened_by)
       SELECT (now() AT TIME ZONE 'America/Guatemala')::date, $1
       WHERE NOT EXISTS (SELECT 1 FROM day_openings WHERE date = (now() AT TIME ZONE 'America/Guatemala')::date)`,
      [adminId],
    );
    // The agent account needs balance for the deposits (bank balance is not cash).
    await dataSource.query(
      `SELECT adjust_bank_balance($1, 500000, CURRENT_DATE, $2, 'Base de prueba', NULL)`,
      [accountId, adminId],
    );
  });

  afterAll(async () => {
    await app?.close();
  });

  it('CxC: cash moves Caja, bank never; edits and deletions reverse with their reason and stay in the statement', async () => {
    const client = await newClient('Cliente Cartera E2E');
    const start = await balance();

    // 1 / 3: a cargo or abono by bank never touches Caja.
    const bankCharge = data(
      await register(
        'accounts-receivable',
        'charges',
        client,
        500,
        'BANCO',
      ).expect(201),
    );
    expect(bankCharge.paymentMethod).toBe('BANCO');
    expect(await balance()).toBe(start);
    await register('accounts-receivable', 'charges', client, 400).expect(201);
    expect(await balance()).toBe(start - 400);
    // 2: a cash abono enters Caja.
    const abono = data(
      await register(
        'accounts-receivable',
        'payments',
        client,
        200,
        'EFECTIVO',
      ).expect(201),
    );
    expect(await balance()).toBe(start - 200);
    await register(
      'accounts-receivable',
      'payments',
      client,
      100,
      'BANCO',
    ).expect(201);
    expect(await balance()).toBe(start - 200);
    await register(
      'accounts-receivable',
      'payments',
      client,
      1,
      'CHEQUE' as 'BANCO',
    ).expect(400);

    // 6: changing the amount needs a reason; then reversal + new movement.
    const noReason = await admin(
      api().patch(`/api/accounts-receivable/${abono.id}`).send({ amount: 250 }),
    ).expect(400);
    expect(noReason.body.message).toContain('motivo');
    await admin(
      api()
        .patch(`/api/accounts-receivable/${abono.id}`)
        .send({ amount: 250, reason: 'El cliente entregó Q250' }),
    ).expect(200);
    expect(await balance()).toBe(start - 150);
    expect(await kardexNet('ACCOUNT_RECEIVABLE', abono.id)).toBe(250);
    // 7: administrative data only — no reason needed, Caja untouched.
    await admin(
      api()
        .patch(`/api/accounts-receivable/${abono.id}`)
        .send({ description: 'Abono de la semana' }),
    ).expect(200);
    expect(await balance()).toBe(start - 150);

    // 5 / 13: deleting requires a reason and an admin; it reverses once.
    await as(userToken)(
      api()
        .delete(`/api/accounts-receivable/${abono.id}`)
        .send({ reason: 'No autorizado' }),
    ).expect(403);
    await admin(
      api().delete(`/api/accounts-receivable/${abono.id}`).send({}),
    ).expect(400);
    await admin(
      api()
        .delete(`/api/accounts-receivable/${abono.id}`)
        .send({ reason: 'Abono registrado dos veces' }),
    ).expect(204);
    expect(await balance()).toBe(start - 400);
    await admin(
      api()
        .delete(`/api/accounts-receivable/${abono.id}`)
        .send({ reason: 'Abono registrado dos veces' }),
    ).expect(409);
    expect(await balance()).toBe(start - 400);

    // The trace: original, reversal, new effect, reversal — each linked, with reason and user.
    const t = await trace('accounts-receivable', abono.id);
    expect(t).toMatchObject({
      isActive: false,
      paymentMethod: 'EFECTIVO',
      cashTracked: true,
      cashEffect: 0,
      kardexNet: 0,
      voided: { reason: 'Abono registrado dos veces' },
    });
    expect(
      (t.movements as Body[]).map((m) => [
        m.movementType,
        m.direction,
        Number(m.amount),
      ]),
    ).toEqual([
      ['ABONO_POR_COBRAR', 'IN', 200],
      ['ANULACION', 'OUT', 200],
      ['ABONO_POR_COBRAR', 'IN', 250],
      ['ANULACION', 'OUT', 250],
    ]);
    const reversals = (t.movements as Body[]).filter(
      (m) => m.movementType === 'ANULACION',
    );
    expect(reversals.map((m) => m.reason)).toEqual([
      'El cliente entregó Q250',
      'Abono registrado dos veces',
    ]);
    expect(reversals.every((m) => m.reversalOfId)).toBe(true);
    expect((t.changes as Body[]).map((c) => [c.action, c.reason])).toEqual([
      ['MODIFICADO', 'El cliente entregó Q250'],
      ['MODIFICADO', null],
      ['ANULADO', 'Abono registrado dos veces'],
    ]);
    expect(t.changes[0].changes.amount).toEqual({ from: 200, to: 250 });

    // The client statement keeps the voided row (not counted) with its history.
    const statement = data(
      await admin(
        api().get(`/api/accounts-receivable/${client}/statement`),
      ).expect(200),
    );
    expect(statement).toMatchObject({ closingBalance: 800, voidedCount: 1 });
    const voidedRow = (statement.movements as Body[]).find(
      (m) => m.id === abono.id,
    )!;
    expect(voidedRow).toMatchObject({ isActive: false, balanceAfter: null });
    expect(voidedRow.trace.voided.reason).toBe('Abono registrado dos veces');
    const hidden = data(
      await admin(
        api()
          .get(`/api/accounts-receivable/${client}/statement`)
          .query({ includeVoided: 'false' }),
      ).expect(200),
    );
    expect((hidden.movements as Body[]).some((m) => m.id === abono.id)).toBe(
      false,
    );
    expect(hidden.closingBalance).toBe(800);

    // 14: the Estado de Cuenta de Efectivo shows exactly the Kardex rows of these records.
    const records = (statement.movements as Body[]).map((m) => m.id as string);
    const cash = data(
      await admin(
        api()
          .get('/api/cash-control/statement')
          .query({ dateFrom: TODAY, dateTo: TODAY, limit: 200 }),
      ).expect(200),
    );
    const rows = (cash.movements.items as Body[]).filter((r) =>
      records.includes(r.referenceId),
    );
    const kardex = await dataSource.query(
      `SELECT id FROM cash_movements WHERE reference_type = 'ACCOUNT_RECEIVABLE'
       AND reference_id = ANY ($1::uuid[]) AND direction <> 'NONE' ORDER BY sequence`,
      [records],
    );
    expect(rows.map((r) => r.id).sort()).toEqual(
      kardex.map((k: Body) => k.id).sort(),
    );
    const lastReversal = rows.find(
      (r) =>
        r.movementType === 'ANULACION' &&
        r.reason === 'Abono registrado dos veces',
    )!;
    expect(lastReversal.reversalOfNumber).toMatch(/^MOV-\d{6}$/);

    // 15: the physical balance is the Kardex's.
    const [{ v }] = await dataSource.query(
      `SELECT new_balance AS v FROM cash_movements ORDER BY sequence DESC LIMIT 1`,
    );
    expect(await balance()).toBe(Number(v));
  });

  it('Activos: cash enters Caja, bank never, the return leaves; edits and deletions reverse', async () => {
    const client = await newClient('Cliente Activos E2E');
    const start = await balance();
    const cash = data(
      await register('assets', 'charges', client, 700, 'EFECTIVO').expect(201),
    );
    expect(await balance()).toBe(start + 700);
    await register('assets', 'charges', client, 900, 'BANCO').expect(201);
    expect(await balance()).toBe(start + 700);
    const devolucion = data(
      await register('assets', 'payments', client, 200).expect(201),
    );
    expect(await balance()).toBe(start + 500);
    await admin(
      api()
        .patch(`/api/assets/${cash.id}`)
        .send({ amount: 650, reason: 'Se recibieron Q650' }),
    ).expect(200);
    expect(await balance()).toBe(start + 450);
    await admin(
      api()
        .delete(`/api/assets/${devolucion.id}`)
        .send({ reason: 'Devolución no realizada' }),
    ).expect(204);
    expect(await balance()).toBe(start + 650);
    const t = await trace('assets', devolucion.id);
    expect(t).toMatchObject({
      isActive: false,
      kardexNet: 0,
      voided: { reason: 'Devolución no realizada' },
    });
  });

  it('Transaccionar: voiding cascades to its cargo; with payments it is rejected whole; older cases show in the audit until regularized', async () => {
    const client = await newClient('Cliente Transaccionar E2E');
    const start = await balance();

    const op = await deposit(client, 300);
    const charge = await linkedCharge(op.id);
    expect(await balance()).toBe(start);
    const locked = await admin(
      api()
        .delete(`/api/accounts-receivable/${charge}`)
        .send({ reason: 'Lo pagó en efectivo' }),
    ).expect(409);
    expect(locked.body.message).toContain('Transaccionar');
    await admin(
      api()
        .post(`/api/bank-deposits/${op.id}/void`)
        .send({ reason: 'Depósito digitado por error' }),
    ).expect((res) => expect([200, 201]).toContain(res.status));
    const voided = await trace('accounts-receivable', charge);
    expect(voided).toMatchObject({ isActive: false, kardexNet: 0 });
    expect(voided.voided.reason).toBe(
      'Operación de Transaccionar anulada: Depósito digitado por error',
    );
    expect(await balance()).toBe(start);

    // 12: a cargo with an abono that depends on it: the whole void is rejected, nothing half applied.
    const op2 = await deposit(client, 400);
    await register(
      'accounts-receivable',
      'payments',
      client,
      400,
      'BANCO',
    ).expect(201);
    const before = await balance();
    const rejected = await admin(
      api()
        .post(`/api/bank-deposits/${op2.id}/void`)
        .send({ reason: 'Error de registro' }),
    ).expect(409);
    expect(rejected.body.message).toContain('Anule primero esos pagos');
    expect(
      (
        await dataSource.query(
          `SELECT is_voided FROM bank_deposit_operations WHERE id = $1`,
          [op2.id],
        )
      )[0].is_voided,
    ).toBe(false);
    expect(await balance()).toBe(before);

    // An operation voided before the cascade existed: the audit reports it until it is regularized.
    const op3 = await deposit(client, 250);
    const charge3 = await linkedCharge(op3.id);
    await dataSource.query(
      `ALTER TABLE bank_deposit_operations DISABLE TRIGGER trg_portfolio_bank_deposit_void`,
    );
    await admin(
      api()
        .post(`/api/bank-deposits/${op3.id}/void`)
        .send({ reason: 'Anulada sin cascada' }),
    ).expect((res) => expect([200, 201]).toContain(res.status));
    await dataSource.query(
      `ALTER TABLE bank_deposit_operations ENABLE TRIGGER trg_portfolio_bank_deposit_void`,
    );
    const broken = await balance();
    let report = await integrity();
    const finding = (report.findings as Body[]).find(
      (f) => f.key === `LINKED_CHARGE_ACTIVE:ACCOUNT_RECEIVABLE:${charge3}`,
    )!;
    expect(finding).toMatchObject({
      severity: 'ALTA',
      classification: 'INCONSISTENCIA_HISTORICA',
      expected: 0,
      registered: -250,
    });
    await admin(
      api()
        .delete(`/api/accounts-receivable/${charge3}`)
        .send({ reason: 'Regularización: la operación ya estaba anulada' }),
    ).expect(204);
    expect(await balance()).toBe(broken + 250);
    report = await integrity();
    expect(
      (report.findings as Body[]).some(
        (f) => f.check === 'LINKED_CHARGE_ACTIVE',
      ),
    ).toBe(false);
    // Every CxC / Activos record of the day agrees with its rule (no SOURCE_* finding).
    expect(
      (report.findings as Body[]).filter(
        (f) =>
          String(f.check).startsWith('SOURCE_') &&
          ['ACCOUNT_RECEIVABLE', 'ASSET'].includes(f.reference?.type),
      ),
    ).toEqual([]);
  });
});
