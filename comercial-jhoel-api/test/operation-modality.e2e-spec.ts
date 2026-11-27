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
 * Pago individual / Pago grupal inside Pago Varios and Préstamos Génesis,
 * HTTP end-to-end: both modalities of each type, the per-type list with its
 * MODALIDAD and filters, an operation that belongs to a group says so (and
 * leads to its group), the operations report filters by modality, and the
 * money: reservation without double cash movements, Kardex and Estado de
 * Cuenta with real movements only. Historical operations stay INDIVIDUAL.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/operation-modality.e2e-spec.ts`.
 */
describe('Modalidad de operación: individual / grupal (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminToken: string;
  let adminId: string;
  let agentId: string;
  let pagoVariosId: string;
  let genesisTypeId: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const admin = (req: request.Test) =>
    req.set('Authorization', `Bearer ${adminToken}`);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const TODAY = todayIsoDate();

  const position = async () =>
    data(await admin(api().get('/api/cash-control/position')).expect(200));
  const register = (
    typeId: string,
    amount: number,
    description: string,
    withAgent = true,
  ) =>
    admin(
      api()
        .post('/api/bank-deposits')
        .send({
          ...(withAgent ? { transactionBankId: agentId } : {}),
          transactionTypeId: typeId,
          totalAmount: amount,
          cashBreakdownEnabled: false,
          cashDetails: [],
          transactionAmounts: [amount],
          description,
        }),
    ).expect(201);
  const createGroup = async (
    typeId: string,
    description: string,
    amounts: number[],
    withAgent = true,
  ) =>
    data(
      await admin(
        api()
          .post('/api/payment-groups')
          .send({
            transactionTypeId: typeId,
            description,
            ...(withAgent ? { transactionBankId: agentId } : {}),
            authorizedAmount: amounts.reduce((a, b) => a + b, 0),
            items: amounts.map((expectedAmount, i) => ({
              expectedAmount,
              reference: `Persona ${i + 1}`,
            })),
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
  const deliver = async (detail: Body, n: number, amount: number) =>
    data(
      await admin(
        api()
          .post(
            `/api/payment-groups/${detail.group.id}/items/${(detail.items as Body[]).find((i) => i.itemNumber === n)!.id}/deliveries`,
          )
          .send({ amount, clientRequestId: randomUUID() }),
      ).expect(201),
    );
  const typeList = async (typeId: string, query: Body = {}) =>
    data(
      await admin(
        api()
          .get(`/api/bank-deposits/by-type/${typeId}`)
          .query({ limit: 100, ...query }),
      ).expect(200),
    );

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'operation-modality e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    const [sa] = await dataSource.query(`
      SELECT u.id, u.username, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id
      WHERE u.is_active AND r.name = 'SUPER_ADMIN' ORDER BY u.created_at LIMIT 1
    `);
    adminId = sa.id;
    adminToken = jwt.sign({ sub: sa.id, username: sa.username, role: sa.role });

    const p = await position();
    await admin(
      api()
        .post('/api/cash-control/movements')
        .send({
          movementType: p.hasInitialBalance
            ? 'ENTRADA_MANUAL'
            : 'SALDO_INICIAL',
          amount: 20000,
          reason: 'Prueba de modalidad',
          clientRequestId: randomUUID(),
        }),
    ).expect(201);
    await dataSource.query(
      `INSERT INTO day_openings (date, opened_by)
       SELECT (now() AT TIME ZONE 'America/Guatemala')::date, $1
       WHERE NOT EXISTS (SELECT 1 FROM day_openings WHERE date = (now() AT TIME ZONE 'America/Guatemala')::date)`,
      [adminId],
    );
    [{ id: agentId }] = await dataSource.query(
      `SELECT id FROM transaction_banks WHERE is_active AND cash_box_code IS NULL ORDER BY created_at LIMIT 1`,
    );
    pagoVariosId = data(
      await admin(
        api().post('/api/transaction-types').send({
          name: 'Pago Varios Modalidad',
          icon: 'wallet',
          cashEffect: 'OUT',
          allowsGroupPayment: true,
        }),
      ).expect(201),
    ).id;
    [{ id: genesisTypeId }] = await dataSource.query(
      `SELECT id FROM transaction_types WHERE is_active AND balance_effect = 'PAGO_GENESIS' ORDER BY created_at LIMIT 1`,
    );
    await admin(
      api()
        .patch(`/api/transaction-types/${genesisTypeId}`)
        .send({ allowsGroupPayment: true }),
    ).expect(200);
    // The Génesis credit line needs room for payments (max Q120,000).
    await dataSource.query(
      `SELECT adjust_bank_balance(id, 0, CURRENT_DATE, $1, 'Base de prueba', NULL)
       FROM banks WHERE special_account = 'GENESIS' AND is_active AND final_balance <> 0`,
      [adminId],
    );
  });

  afterAll(async () => {
    await app?.close();
  });

  it('Pago Varios: individual and group side by side, each with its own rules', async () => {
    const before = await position();
    // 14: an operation that existed before stays INDIVIDUAL (historical data untouched).
    const [historical] = await dataSource.query(
      `SELECT id FROM bank_deposit_operations ORDER BY created_at LIMIT 1`,
    );
    if (historical) {
      const old = data(
        await admin(api().get(`/api/bank-deposits/${historical.id}`)).expect(
          200,
        ),
      );
      expect(old).toMatchObject({ modality: 'INDIVIDUAL', paymentGroup: null });
    }

    // 1: an individual Pago Varios behaves exactly as before (cash out now, no reservation).
    const individual = data(
      await register(pagoVariosId, 150, 'Pago de luz individual'),
    );
    expect(individual).toMatchObject({
      modality: 'INDIVIDUAL',
      paymentGroup: null,
    });
    let after = await position();
    expect(before.balance - after.balance).toBe(150);
    expect(after.reservedAmount).toBe(before.reservedAmount);

    // 2: a group of 4 reserves Q2,000 without moving cash; 9: confirm one, a partial another.
    let group = await createGroup(
      pagoVariosId,
      'Pagos varios del día',
      [500, 500, 500, 500],
    );
    after = await position();
    expect(before.balance - after.balance).toBe(150);
    expect(after.reservedAmount - before.reservedAmount).toBe(2000);
    group = await deliver(group, 1, 500);
    group = await deliver(group, 2, 300);
    after = await position();
    // 11: the reservation never doubles the cash out — only what was handed over left Caja.
    expect(before.balance - after.balance).toBe(150 + 800);
    expect(after.reservedAmount - before.reservedAmount).toBe(1200);

    // 5 / 8 / 13: one list, with MODALIDAD; filters by modality, status and group code.
    const all = await typeList(pagoVariosId);
    expect(all.items.map((e: Body) => [e.modality, e.description])).toEqual([
      ['GRUPAL', 'Pagos varios del día'],
      ['INDIVIDUAL', 'Pago de luz individual'],
    ]);
    expect(all.items[0].group).toMatchObject({
      code: group.group.code,
      itemCount: 4,
      authorizedAmount: 2000,
      paidAmount: 800,
      outstandingAmount: 1200,
    });
    expect(all.summary).toMatchObject({
      individualCount: 1,
      groupCount: 1,
      groupPaid: 800,
      groupReserved: 1200,
    });
    // 10: the group's deliveries are not listed as independent individual payments.
    const onlyIndividual = await typeList(pagoVariosId, {
      modality: 'INDIVIDUAL',
    });
    expect(onlyIndividual.items.map((e: Body) => e.id)).toEqual([
      individual.id,
    ]);
    expect(
      (await typeList(pagoVariosId, { modality: 'GRUPAL' })).items.map(
        (e: Body) => e.id,
      ),
    ).toEqual([group.group.id]);
    expect(
      (await typeList(pagoVariosId, { search: group.group.code })).items,
    ).toHaveLength(1);
    expect(
      (await typeList(pagoVariosId, { status: 'PARCIAL' })).items.map(
        (e: Body) => e.modality,
      ),
    ).toEqual(['GRUPAL']);
    expect(
      (await typeList(pagoVariosId, { status: 'VIGENTE' })).items.map(
        (e: Body) => e.modality,
      ),
    ).toEqual(['INDIVIDUAL']);
    expect(
      (await typeList(pagoVariosId, { startDate: TODAY, endDate: TODAY }))
        .total,
    ).toBe(2);

    // 6 / 7: an operation of the group says so and leads to its group.
    const operationId = (group.items as Body[]).find((i) => i.itemNumber === 2)!
      .operations[0].operationId;
    const grouped = data(
      await admin(api().get(`/api/bank-deposits/${operationId}`)).expect(200),
    );
    expect(grouped).toMatchObject({
      modality: 'GRUPAL',
      paymentGroup: {
        code: group.group.code,
        itemNumber: 2,
        itemCount: 4,
        itemStatus: 'PARCIAL',
        groupStatus: 'PARCIAL',
      },
    });
    const opened = data(
      await admin(
        api().get(`/api/payment-groups/${grouped.paymentGroup.groupId}`),
      ).expect(200),
    );
    expect(opened.items).toHaveLength(4);

    // The operations report: modality column and filter; group operations marked, individual ones not.
    const reportGroup = data(
      await admin(
        api()
          .get('/api/reports/bank-deposits')
          .query({ transactionTypeId: pagoVariosId, modality: 'GRUPAL' }),
      ).expect(200),
    );
    expect(reportGroup.items.map((r: Body) => r.paymentGroup?.code)).toEqual([
      group.group.code,
      group.group.code,
    ]);
    const reportIndividual = data(
      await admin(
        api()
          .get('/api/reports/bank-deposits')
          .query({ transactionTypeId: pagoVariosId, modality: 'INDIVIDUAL' }),
      ).expect(200),
    );
    expect(reportIndividual.items.map((r: Body) => [r.id, r.modality])).toEqual(
      [[individual.id, 'INDIVIDUAL']],
    );
    const summary = data(
      await admin(
        api()
          .get('/api/reports/bank-deposits/summary')
          .query({ transactionTypeId: pagoVariosId, modality: 'GRUPAL' }),
      ).expect(200),
    );
    expect(summary.totalAmount).toBe(800);

    // 12: Kardex and Estado de Cuenta hold the real movements only (1 individual + 2 deliveries).
    const kardex = await dataSource.query(
      `SELECT m.amount FROM cash_movements m JOIN bank_deposit_operations o ON o.id = m.reference_id
       WHERE m.reference_type = 'BANK_DEPOSIT' AND o.transaction_type_id = $1 ORDER BY m.sequence`,
      [pagoVariosId],
    );
    expect(kardex.map((row: Body) => Number(row.amount))).toEqual([
      150, 500, 300,
    ]);
    const statement = data(
      await admin(
        api()
          .get('/api/cash-control/statement')
          .query({ dateFrom: TODAY, dateTo: TODAY, limit: 200 }),
      ).expect(200),
    );
    const groupRows = (statement.movements.items as Body[]).filter((r) =>
      String(r.beneficiary ?? '').includes(group.group.code),
    );
    expect(groupRows.map((r) => r.amount)).toEqual(
      expect.arrayContaining([500, 300]),
    );
    expect(groupRows).toHaveLength(2);
  });

  it('Préstamos Génesis: individual and group collections (cash in, nothing reserved)', async () => {
    const before = await position();
    // 3: an individual Génesis payment (no agent bank: the Génesis line).
    const individual = data(
      await register(genesisTypeId, 400, 'Cuota individual', false),
    );
    expect(individual.modality).toBe('INDIVIDUAL');
    // 4: a group of 3 collections reserves nothing; each collection enters Caja.
    let group = await createGroup(
      genesisTypeId,
      'Grupo solidario Las Flores',
      [300, 300, 300],
      false,
    );
    expect(group.group).toMatchObject({
      cashDirection: 'IN',
      reservedAmount: 0,
    });
    group = await deliver(group, 1, 300);
    const after = await position();
    expect(after.balance - before.balance).toBe(700);
    expect(after.reservedAmount).toBe(before.reservedAmount);
    const list = await typeList(genesisTypeId);
    expect(list.items.slice(0, 2).map((e: Body) => e.modality)).toEqual([
      'GRUPAL',
      'INDIVIDUAL',
    ]);
    expect(list.items[0].group).toMatchObject({
      cashDirection: 'IN',
      paidAmount: 300,
      reservedAmount: 0,
    });
  });
});
