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
 * Pagos grupales (migration 1760009400000), HTTP end-to-end: a cashier creates
 * a group of 10 payments of a type that takes cash out, the authorized amount
 * is reserved (physical cash unchanged, available cash down), payments are
 * confirmed one by one (complete, partial, no payment), every confirmation is
 * a real Transaccionar operation in the Kardex and the Estado de Cuenta, the
 * reservation blocks other outflows, and an admin closes the group releasing
 * what was not used.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/payment-groups.e2e-spec.ts` (temporary
 * `<db>_e2e` clone, dropped afterwards).
 */
describe('Pagos grupales (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminToken: string;
  let cashierToken: string;
  let adminId: string;
  let typeId: string;
  let agentId: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const admin = (req: request.Test) => as(adminToken)(req);
  const cashier = (req: request.Test) => as(cashierToken)(req);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const TODAY = todayIsoDate();

  const position = async () =>
    data(await admin(api().get('/api/cash-control/position')).expect(200));
  const item = (detail: Body, n: number): Body =>
    (detail.items as Body[]).find((i) => i.itemNumber === n)!;
  const deliver = (
    groupId: string,
    itemId: string,
    amount: number,
    key = randomUUID(),
    token = cashierToken,
  ) =>
    as(token)(
      api()
        .post(`/api/payment-groups/${groupId}/items/${itemId}/deliveries`)
        .send({ amount, clientRequestId: key }),
    );

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'payment-groups e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    const user = users.find((u) => u.role === 'USER')!;
    adminId = sa.id;
    adminToken = jwt.sign({ sub: sa.id, username: sa.username, role: sa.role });
    cashierToken = jwt.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    const p = await position();
    if (!p.hasInitialBalance) {
      await admin(
        api().post('/api/cash-control/movements').send({
          movementType: 'SALDO_INICIAL',
          amount: 20000,
          reason: 'Prueba de pagos grupales',
          clientRequestId: randomUUID(),
        }),
      ).expect(201);
    } else {
      await admin(
        api().post('/api/cash-control/movements').send({
          movementType: 'ENTRADA_MANUAL',
          amount: 20000,
          reason: 'Prueba de pagos grupales',
          clientRequestId: randomUUID(),
        }),
      ).expect(201);
    }
    await dataSource.query(
      `INSERT INTO day_openings (date, opened_by)
       SELECT (now() AT TIME ZONE 'America/Guatemala')::date, $1
       WHERE NOT EXISTS (SELECT 1 FROM day_openings WHERE date = (now() AT TIME ZONE 'America/Guatemala')::date)`,
      [adminId],
    );
    [{ id: agentId }] = await dataSource.query(
      `SELECT id FROM transaction_banks WHERE is_active AND cash_box_code IS NULL ORDER BY created_at LIMIT 1`,
    );
    // "Pago Varios": takes cash out, no bank balance effect; allowed for groups from Sistema → Tipos.
    const created = data(
      await admin(
        api()
          .post('/api/transaction-types')
          .send({ name: 'Pago Varios E2E', icon: 'wallet', cashEffect: 'OUT' }),
      ).expect(201),
    );
    typeId = created.id;
    expect(created.allowsGroupPayment).toBe(false);
    const updated = data(
      await admin(
        api()
          .patch(`/api/transaction-types/${typeId}`)
          .send({ allowsGroupPayment: true }),
      ).expect(200),
    );
    expect(updated.allowsGroupPayment).toBe(true);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('reserves, confirms one by one, blocks other outflows and closes releasing what was not used', async () => {
    const before = await position();
    const items = Array.from({ length: 10 }, (_, i) => ({
      expectedAmount: 500,
      reference: `Beneficiario ${i + 1}`,
    }));
    const createKey = randomUUID();

    // 1–5: the group and its 10 transactions; reservation without physical movement.
    const created = await cashier(
      api().post('/api/payment-groups').send({
        transactionTypeId: typeId,
        description: 'Pagos varios del día',
        transactionBankId: agentId,
        authorizedAmount: 5000,
        items,
        observations: 'Lista del día',
        clientRequestId: createKey,
      }),
    ).expect(201);
    let detail = data(created);
    const groupId: string = detail.group.id;
    expect(detail.group).toMatchObject({
      status: 'PENDIENTE',
      itemCount: 10,
      reservedAmount: 5000,
      cashDirection: 'OUT',
    });
    expect(detail.items.map((i: Body) => i.status)).toEqual(
      Array(10).fill('PENDIENTE'),
    );
    let after = await position();
    expect(after.balance).toBe(before.balance);
    expect(after.reservedAmount - before.reservedAmount).toBe(5000);
    expect(before.availableAmount - after.availableAmount).toBe(5000);
    // A retry of the same request does not reserve twice.
    await cashier(
      api().post('/api/payment-groups').send({
        transactionTypeId: typeId,
        description: 'Otro',
        transactionBankId: agentId,
        authorizedAmount: 5000,
        items,
        clientRequestId: createKey,
      }),
    ).expect(201);
    expect((await position()).reservedAmount).toBe(after.reservedAmount);

    // 6–9: complete, partial and no payment, each on its own.
    const k1 = randomUUID();
    await deliver(groupId, item(detail, 1).id, 500, k1).expect(201);
    await deliver(groupId, item(detail, 2).id, 500).expect(201);
    await deliver(groupId, item(detail, 5).id, 500).expect(201);
    await deliver(groupId, item(detail, 3).id, 300).expect(201);
    detail = data(
      await cashier(
        api()
          .post(
            `/api/payment-groups/${groupId}/items/${item(detail, 4).id}/no-payment`,
          )
          .send({ note: 'El beneficiario no recibió el pago' }),
      ).expect(200),
    );
    expect(detail.items.slice(0, 5).map((i: Body) => i.status)).toEqual([
      'PAGADO',
      'PAGADO',
      'PARCIAL',
      'SIN_PAGO',
      'PAGADO',
    ]);
    expect(detail.group).toMatchObject({
      status: 'PARCIAL',
      paidAmount: 1800,
      reservedAmount: 3200,
    });
    after = await position();
    expect(before.balance - after.balance).toBe(1800);
    expect(after.reservedAmount - before.reservedAmount).toBe(3200);
    expect(before.availableAmount - after.availableAmount).toBe(5000);
    expect(detail.cash.available).toBe(after.availableAmount);
    expect(item(detail, 3).operations[0].movementNumber).toMatch(/^MOV-\d{6}$/);

    // 12–13: no duplicates, no overpayment.
    const movementsBefore = Number(
      (await dataSource.query(`SELECT count(*) AS c FROM cash_movements`))[0].c,
    );
    await deliver(groupId, item(detail, 1).id, 500, k1).expect(201);
    expect(
      Number(
        (await dataSource.query(`SELECT count(*) AS c FROM cash_movements`))[0]
          .c,
      ),
    ).toBe(movementsBefore);
    const again = await deliver(groupId, item(detail, 1).id, 500).expect(409);
    expect(again.body.message).toContain('ya fue pagada');
    const over = await deliver(groupId, item(detail, 3).id, 250).expect(400);
    expect(over.body.message).toContain('Q200.00');

    // 10–11: observations and history.
    await cashier(
      api()
        .post(`/api/payment-groups/${groupId}/notes`)
        .send({
          itemId: item(detail, 3).id,
          note: 'Faltan Q200.00 por entregar',
        }),
    ).expect(201);
    const history = data(
      await cashier(
        api()
          .get(`/api/payment-groups/${groupId}/history`)
          .query({ itemId: item(detail, 3).id }),
      ).expect(200),
    ) as unknown as Body[];
    expect(history.map((e) => [e.eventType, e.itemStatus])).toEqual([
      ['ENTREGA', 'PARCIAL'],
      ['OBSERVACION', 'PARCIAL'],
    ]);

    // 14: the reservation blocks another outflow that would use it.
    const blocked = await admin(
      api()
        .post('/api/cash-control/movements')
        .send({
          movementType: 'SALIDA_MANUAL',
          amount: after.availableAmount + 1,
          reason: 'Gasto que usaría lo reservado',
          clientRequestId: randomUUID(),
        }),
    ).expect(409);
    expect(blocked.body.message).toContain('reservado para pagos grupales');

    // 20: the Estado de Cuenta shows each payment with the group code and transaction number.
    const statement = data(
      await admin(
        api()
          .get('/api/cash-control/statement')
          .query({ dateFrom: TODAY, dateTo: TODAY, limit: 200 }),
      ).expect(200),
    );
    const groupRows = (statement.movements.items as Body[]).filter((r) =>
      String(r.beneficiary ?? '').includes(detail.group.code),
    );
    expect(groupRows).toHaveLength(4);
    expect(groupRows.every((r) => r.direction === 'OUT')).toBe(true);
    expect(
      groupRows.some((r) =>
        String(r.beneficiary).includes(`${detail.group.code} #3`),
      ),
    ).toBe(true);

    // A group operation is not voided directly in Transaccionar.
    const locked = await admin(
      api()
        .post(
          `/api/bank-deposits/${item(detail, 5).operations[0].operationId}/void`,
        )
        .send({ reason: 'Directo desde Transaccionar' }),
    ).expect(409);
    expect(locked.body.message).toContain('desde el grupo');

    // 15–17: resolve, release, close.
    await cashier(
      api().post(`/api/payment-groups/${groupId}/close`).send({}),
    ).expect(403);
    const pending = await admin(
      api().post(`/api/payment-groups/${groupId}/close`).send({}),
    ).expect(409);
    expect(pending.body.message).toContain('pendiente');
    await deliver(groupId, item(detail, 6).id, 500).expect(201);
    await deliver(groupId, item(detail, 7).id, 500).expect(201);
    for (const n of [9, 10]) {
      await cashier(
        api()
          .post(
            `/api/payment-groups/${groupId}/items/${item(detail, n).id}/no-payment`,
          )
          .send({ note: 'No se presentó a cobrar' }),
      ).expect(200);
    }
    await cashier(
      api()
        .post(`/api/payment-groups/${groupId}/items/${item(detail, 8).id}/void`)
        .send({ reason: 'Beneficiario de baja', moneyReturned: false }),
    ).expect(403);
    await admin(
      api()
        .post(`/api/payment-groups/${groupId}/items/${item(detail, 8).id}/void`)
        .send({ reason: 'Beneficiario dado de baja', moneyReturned: false }),
    ).expect(200);
    await cashier(
      api()
        .post(
          `/api/payment-groups/${groupId}/items/${item(detail, 4).id}/resolution`,
        )
        .send({ resolution: 'No llegó; se libera', release: true }),
    ).expect(403);
    await admin(
      api()
        .post(
          `/api/payment-groups/${groupId}/items/${item(detail, 4).id}/resolution`,
        )
        .send({ resolution: 'No llegó; se libera', release: true }),
    ).expect(200);
    for (const n of [3, 9, 10]) {
      await cashier(
        api()
          .post(
            `/api/payment-groups/${groupId}/items/${item(detail, n).id}/resolution`,
          )
          .send({
            resolution: 'Documentado con la lista firmada',
            release: false,
          }),
      ).expect(200);
    }
    detail = data(
      await admin(api().get(`/api/payment-groups/${groupId}`)).expect(200),
    );
    expect(detail.closeCheck).toEqual({
      canClose: true,
      pendingCount: 0,
      unresolvedCount: 0,
      releaseOnClose: 1200,
    });
    detail = data(
      await admin(
        api()
          .post(`/api/payment-groups/${groupId}/close`)
          .send({ note: 'Conciliado' }),
      ).expect(200),
    );
    expect(detail.group).toMatchObject({
      status: 'COMPLETADO',
      paidAmount: 2800,
      closingPaid: 2800,
      closingReleased: 1200,
      releasedAmount: 2200,
      reservedAmount: 0,
    });
    after = await position();
    // 18 / 24: only real payments moved Caja; nothing stays reserved; available = physical − reserved.
    expect(before.balance - after.balance).toBe(2800);
    expect(after.reservedAmount).toBe(before.reservedAmount);
    expect(after.availableAmount).toBe(after.balance - after.reservedAmount);

    // The list with its summary cards and filters.
    const list = data(
      await cashier(
        api()
          .get('/api/payment-groups')
          .query({ search: 'varios del día', status: 'COMPLETADO' }),
      ).expect(200),
    );
    expect(list.items.map((g: Body) => g.id)).toContain(groupId);
    expect(list.summary).toMatchObject({ completed: list.items.length });
  });
});
