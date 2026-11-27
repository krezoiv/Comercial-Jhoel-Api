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
 * Pagos grupales de Fundación Génesis con aprobación (migration
 * 1760009500000), HTTP end-to-end with the owner's example: EL GOLFO, 11
 * cuotas, Q9,284.00. Registering validates count and sum and moves nothing;
 * the creator (or an admin) corrects it while pending; only an admin approves,
 * which books every cuota (Caja, Génesis line, transaction count, Kardex) at
 * once and only once; a pending group can be rejected.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/payment-group-approval.e2e-spec.ts`.
 */
describe('Pagos grupales Génesis con aprobación (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminToken: string;
  let cashierToken: string;
  let otherToken: string;
  let adminId: string;
  let genesisTypeId: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const admin = (req: request.Test) => as(adminToken)(req);
  const cashier = (req: request.Test) => as(cashierToken)(req);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const message = (response: request.Response): string =>
    String((response.body as { message?: unknown }).message);
  const TODAY = todayIsoDate();

  /** EL GOLFO: 10 cuotas of Q850.00 and one of Q784.00 = Q9,284.00. */
  const golfo = (extra: Body[] = []) => [
    ...Array.from({ length: 11 }, (_, i) => ({
      creditNumber: `CR-${1001 + i}`,
      reference: `Cliente ${i + 1}`,
      expectedAmount: i === 10 ? 784 : 850,
      ...(i === 2 ? { observation: 'Pagó con billetes de Q100' } : {}),
    })),
    ...extra,
  ];
  const position = async () =>
    data(await admin(api().get('/api/cash-control/position')).expect(200));
  const genesisSummary = async () =>
    data(
      await admin(
        api().get('/api/reports/bank-deposits/summary').query({
          transactionTypeId: genesisTypeId,
          startDate: TODAY,
          endDate: TODAY,
        }),
      ).expect(200),
    );
  const genesisBalance = async (): Promise<number> => {
    const [row] = await dataSource.query<{ final_balance: string }[]>(
      `SELECT final_balance FROM banks WHERE special_account = 'GENESIS' AND is_active ORDER BY created_at LIMIT 1`,
    );
    return Number(row.final_balance);
  };
  const create = (body: Body, token = cashierToken) =>
    as(token)(
      api()
        .post('/api/payment-groups')
        .send({
          transactionTypeId: genesisTypeId,
          clientRequestId: randomUUID(),
          ...body,
        }),
    );

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'payment-group-approval e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    const users = await dataSource.query<
      { id: string; username: string; role: string }[]
    >(`
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
    // A second cashier (neither the creator nor an admin), only in this clone.
    const [other] = await dataSource.query<{ id: string }[]>(
      `INSERT INTO users (name, password_hash, username, role_id)
       VALUES ('Cajero e2e', 'x', 'cajero_e2e_aprobacion', (SELECT id FROM roles WHERE name = 'USER'))
       RETURNING id`,
    );
    otherToken = jwt.sign({
      sub: other.id,
      username: 'cajero_e2e_aprobacion',
      role: 'USER',
    });

    const p = await position();
    await admin(
      api()
        .post('/api/cash-control/movements')
        .send({
          movementType: p.hasInitialBalance
            ? 'ENTRADA_MANUAL'
            : 'SALDO_INICIAL',
          amount: 1000,
          reason: 'Prueba de aprobación',
          clientRequestId: randomUUID(),
        }),
    ).expect(201);
    await dataSource.query(
      `INSERT INTO day_openings (date, opened_by)
       SELECT (now() AT TIME ZONE 'America/Guatemala')::date, $1
       WHERE NOT EXISTS (SELECT 1 FROM day_openings WHERE date = (now() AT TIME ZONE 'America/Guatemala')::date)`,
      [adminId],
    );
    [{ id: genesisTypeId }] = await dataSource.query<{ id: string }[]>(
      `SELECT id FROM transaction_types WHERE is_active AND balance_effect = 'PAGO_GENESIS' ORDER BY created_at LIMIT 1`,
    );
    await admin(
      api()
        .patch(`/api/transaction-types/${genesisTypeId}`)
        .send({ allowsGroupPayment: true }),
    ).expect(200);
    await dataSource.query(
      `SELECT adjust_bank_balance(id, 0, CURRENT_DATE, $1, 'Base de prueba', NULL)
       FROM banks WHERE special_account = 'GENESIS' AND is_active AND final_balance <> 0`,
      [adminId],
    );
  });

  afterAll(async () => {
    await app?.close();
  });

  it('EL GOLFO: validate, save pending, correct, approve once', async () => {
    // Validations before saving: declared count, exact sum, complete rows.
    const countMismatch = await create({
      description: 'EL GOLFO',
      authorizedAmount: 9284,
      declaredCount: 11,
      items: golfo().slice(0, 10),
    }).expect(400);
    expect(message(countMismatch)).toContain(
      'Hay 10 cuota(s) registrada(s) y se declararon 11',
    );
    const sumMismatch = await create({
      description: 'EL GOLFO',
      authorizedAmount: 9300,
      declaredCount: 11,
      items: golfo(),
    }).expect(400);
    expect(message(sumMismatch)).toContain('Q9,284.00');
    const incomplete = await create({
      description: 'EL GOLFO',
      authorizedAmount: 850,
      declaredCount: 1,
      items: [{ expectedAmount: 850, reference: 'Cliente 1' }],
    }).expect(400);
    expect(message(incomplete)).toContain('número de crédito');

    // Saving: pending approval, internal code, nothing moves.
    const before = await position();
    const genesisBefore = await genesisBalance();
    const summaryBefore = await genesisSummary();
    let detail = data(
      await create({
        description: 'EL GOLFO',
        authorizedAmount: 9284,
        declaredCount: 11,
        items: golfo(),
      }).expect(201),
    );
    const groupId = String(detail.group.id);
    expect(detail.group).toMatchObject({
      status: 'PENDIENTE_APROBACION',
      requiresApproval: true,
      description: 'EL GOLFO',
      itemCount: 11,
      approvedAt: null,
    });
    expect(String(detail.group.code)).toMatch(/^PG-\d{6}$/);
    expect(detail.approvalCheck).toMatchObject({
      pending: true,
      canApprove: true,
      cuotaCount: 11,
      cuotasTotal: 9284,
      difference: 0,
    });
    expect(detail.items[2]).toMatchObject({
      itemNumber: 3,
      creditNumber: 'CR-1003',
      reference: 'Cliente 3',
      expectedAmount: 850,
      observation: 'Pagó con billetes de Q100',
    });
    expect((await position()).balance).toBe(before.balance);
    expect(await genesisBalance()).toBe(genesisBefore);
    expect((await genesisSummary()).transactionCount).toBe(
      summaryBefore.transactionCount,
    );

    // Per-cuota actions do not apply while pending.
    const pay = await cashier(
      api()
        .post(
          `/api/payment-groups/${groupId}/items/${detail.items[0].id}/deliveries`,
        )
        .send({ amount: 850, clientRequestId: randomUUID() }),
    ).expect(409);
    expect(message(pay)).toContain('pendiente de aprobación');

    // Correction: not another cashier; the creator adds a cuota, an admin removes it.
    const correction = (items: Body[], total: number, note?: string) => ({
      description: 'EL GOLFO',
      authorizedAmount: total,
      declaredCount: items.length,
      items,
      ...(note ? { note } : {}),
    });
    await as(otherToken)(
      api()
        .put(`/api/payment-groups/${groupId}`)
        .send(correction(golfo(), 9284)),
    ).expect(403);
    detail = data(
      await cashier(
        api()
          .put(`/api/payment-groups/${groupId}`)
          .send(
            correction(
              golfo([
                {
                  creditNumber: 'CR-1012',
                  reference: 'Cliente 12',
                  expectedAmount: 16,
                },
              ]),
              9300,
              'Faltaba una cuota',
            ),
          ),
      ).expect(200),
    );
    expect(detail.group).toMatchObject({
      itemCount: 12,
      authorizedAmount: 9300,
    });
    detail = data(
      await admin(
        api()
          .put(`/api/payment-groups/${groupId}`)
          .send(correction(golfo(), 9284, 'La cuota 12 era de otro grupo')),
      ).expect(200),
    );
    expect(detail.group).toMatchObject({
      itemCount: 11,
      authorizedAmount: 9284,
    });
    const history = data(
      await admin(api().get(`/api/payment-groups/${groupId}/history`)).expect(
        200,
      ),
    ) as unknown as Body[];
    const edits = history.filter((e) => e.eventType === 'EDITADO');
    expect(edits).toHaveLength(2);
    expect(String(edits[0].note)).toContain('Cuotas: 11 → 12');
    expect(edits[0].details.before.items).toHaveLength(11);
    expect(edits[0].details.after.items).toHaveLength(12);

    // Approval: only an admin, only what was reviewed.
    const approve = (body: Body, token = adminToken) =>
      as(token)(
        api().post(`/api/payment-groups/${groupId}/approve`).send(body),
      );
    const requestId = randomUUID();
    await approve(
      { expectedAmount: 9284, expectedCount: 11, clientRequestId: requestId },
      cashierToken,
    ).expect(403);
    await approve({
      expectedAmount: 9284,
      expectedCount: 12,
      clientRequestId: requestId,
    }).expect(409);
    detail = data(
      await approve({
        expectedAmount: 9284,
        expectedCount: 11,
        clientRequestId: requestId,
      }).expect(200),
    );
    expect(detail.group).toMatchObject({
      status: 'APROBADO',
      lifecycle: 'CERRADO',
      paidAmount: 9284,
    });
    expect(detail.group.approvedAt).toBeTruthy();
    expect(detail.group.approvedByUsername).toBeTruthy();
    expect(
      (detail.items as Body[]).every(
        (i) => i.status === 'PAGADO' && i.operations.length === 1,
      ),
    ).toBe(true);

    // Booked once: Caja +Q9,284.00, Génesis line by the existing rules, +11 transactions.
    const after = await position();
    expect(after.balance - before.balance).toBe(9284);
    expect((await genesisBalance()) - genesisBefore).toBe(9284);
    const summaryAfter = await genesisSummary();
    expect(summaryAfter.transactionCount - summaryBefore.transactionCount).toBe(
      11,
    );
    expect(summaryAfter.totalAmount - summaryBefore.totalAmount).toBe(9284);

    // Idempotent: the same click again, or a second approval, books nothing.
    await approve({
      expectedAmount: 9284,
      expectedCount: 11,
      clientRequestId: requestId,
    }).expect(200);
    await approve({
      expectedAmount: 9284,
      expectedCount: 11,
      clientRequestId: randomUUID(),
    }).expect(200);
    expect((await position()).balance).toBe(after.balance);
    expect((await genesisSummary()).transactionCount).toBe(
      summaryAfter.transactionCount,
    );

    // Each cuota is a real operation that knows its group, credit and client.
    const operationId = String(detail.items[2].operations[0].operationId);
    const operation = data(
      await admin(api().get(`/api/bank-deposits/${operationId}`)).expect(200),
    );
    expect(operation).toMatchObject({
      modality: 'GRUPAL',
      clientName: 'Cliente 3',
      paymentGroup: { itemNumber: 3, itemCount: 11, groupStatus: 'APROBADO' },
    });
    expect(String(operation.description)).toContain('Crédito CR-1003');
    const kardex = await dataSource.query<{ count: string }[]>(
      `SELECT count(*) FROM cash_movements m JOIN payment_group_deliveries d ON d.operation_id = m.reference_id
       WHERE m.reference_type = 'BANK_DEPOSIT' AND d.group_id = $1`,
      [groupId],
    );
    expect(Number(kardex[0].count)).toBe(11);

    // Approved = final: no more corrections.
    await cashier(
      api()
        .put(`/api/payment-groups/${groupId}`)
        .send(correction(golfo(), 9284)),
    ).expect(409);
  });

  it('a pending group is rejected (voided) by an admin and never moves money', async () => {
    const before = await position();
    const detail = data(
      await create({
        description: 'GRUPO DUPLICADO',
        authorizedAmount: 500,
        declaredCount: 1,
        items: [
          { creditNumber: 'CR-9', reference: 'Cliente R', expectedAmount: 500 },
        ],
      }).expect(201),
    );
    const voided = data(
      await admin(
        api()
          .post(`/api/payment-groups/${detail.group.id}/void`)
          .send({ reason: 'Boleta duplicada' }),
      ).expect(200),
    );
    expect(voided.group.status).toBe('ANULADO');
    expect((await position()).balance).toBe(before.balance);
    await admin(
      api().post(`/api/payment-groups/${detail.group.id}/approve`).send({
        expectedAmount: 500,
        expectedCount: 1,
        clientRequestId: randomUUID(),
      }),
    ).expect(409);
  });
});
