import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Caja de Listas — dashboard, customer account statements and payments
 * (expansion of 2026-11-19), end to end over HTTP. A customer is every list
 * with the same phone digits. Covers: customers with one/several lists and
 * children, pending/partial/solvent states, cash and bank payments, the bank →
 * caja transfer (never counted twice), an abono applied to the chosen list
 * and the one that settles it, cancellation with refund, a voided payment,
 * dashboard indicators, the chronological statement, the PDF and RBAC.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/school-customers.e2e-spec.ts`.
 */
describe('Caja de Listas — estado de cuenta de clientes (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let bankId: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  // Phones unlikely to exist in the dev data.
  const MARIA = '5917-0001';
  const PEDRO = '5917-0002';
  const LUCIA = '5917-0003';
  const ELENA = '5917-0004';
  const key = (phone: string) => phone.replace(/\D/g, '');

  const createList = async (
    name: string,
    phone: string,
    student: string,
    grade: string,
    total: number,
    advance?: Body,
  ) =>
    data(
      await as(userToken)(
        api()
          .post('/api/school-lists/quotations')
          .send({
            grade,
            customerName: name,
            customerPhone: phone,
            studentName: student,
            items: [
              {
                productName: `Útiles de ${grade}`,
                quantity: 1,
                unitPrice: total,
              },
            ],
            ...(advance ? { advance } : {}),
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
  const pay = async (quotationId: string, body: Body) =>
    data(
      await as(userToken)(
        api()
          .post(`/api/school-lists/quotations/${quotationId}/payments`)
          .send({ ...body, clientRequestId: randomUUID() }),
      ).expect(201),
    );
  const customer = async (phone: string, token = adminToken) =>
    data(
      await as(token)(
        api().get(`/api/school-cash-box/customers/${key(phone)}`),
      ).expect(200),
    );
  const summary = async (query: Body = {}) =>
    data(
      await as(adminToken)(
        api().get('/api/school-cash-box/summary').query(query),
      ).expect(200),
    );

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'school-customers e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
      SELECT u.id, u.username, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id WHERE u.is_active ORDER BY u.created_at
    `);
    const admin =
      users.find((u) => u.role === 'ADMIN') ??
      users.find((u) => u.role === 'SUPER_ADMIN')!;
    const cashier = users.find((u) => u.role === 'USER')!;
    const sign = (u: Body) =>
      jwt.sign({ sub: u.id, username: u.username, role: u.role });
    adminToken = sign(admin);
    userToken = sign(cashier);
    [{ id: bankId }] = await dataSource.query(
      `SELECT id FROM banks WHERE is_active AND special_account IS NULL ORDER BY name LIMIT 1`,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('builds customers by phone, with one row per list and child, and keeps every figure consistent', async () => {
    const before = await summary();
    expect(before.portfolio.lists).toBeGreaterThanOrEqual(0); // (1) works with or without lists

    // María: two children, the name typed two ways, same phone → ONE customer (13, 14).
    const juan = await createList(
      'María López',
      MARIA,
      'Juan López',
      'Primero Básico',
      800,
      { amount: 300, paymentMethod: 'EFECTIVO' },
    );
    const ana = await createList(
      'Maria Lopez',
      MARIA,
      'Ana López',
      'Tercero Básico',
      650,
    );
    await pay(juan.id, {
      amount: 200,
      paymentMethod: 'TRANSFERENCIA',
      bankId,
      reference: 'BI-9',
    }); // (7) bank
    // Pedro: one list, nothing paid (2). Lucía: paid in full (5, 6).
    await createList('Pedro Gómez', PEDRO, 'Luis Gómez', 'Segundo Básico', 400);
    await createList('Lucía Ruiz', LUCIA, 'Sofía Ruiz', 'Primero Básico', 250, {
      amount: 250,
      paymentMethod: 'EFECTIVO',
    });

    let maria = await customer(MARIA);
    expect(maria.customer).toMatchObject({
      key: key(MARIA),
      lists: 2,
      purchased: 1450,
      paid: 500,
      balance: 950,
      status: 'ABONANDO',
    }); // (3, 4)
    expect(maria.customer.students.sort()).toEqual(['Ana López', 'Juan López']);
    expect(maria.customer.otherNames.length).toBe(1);
    expect(
      maria.lists.map((l: Body) => [l.studentName, l.accountStatus]),
    ).toEqual(
      expect.arrayContaining([
        ['Juan López', 'PARCIAL'],
        ['Ana López', 'PENDIENTE'],
      ]),
    );
    expect(maria.customer.percentPaid).toBeCloseTo(34.5, 1);
    expect((await customer(PEDRO)).customer.status).toBe('PENDIENTE');
    const lucia = await customer(LUCIA);
    expect(lucia.customer.status).toBe('SOLVENTE');
    expect(lucia.payments[0].typeLabel).toBe('Pago total');

    // (8, 9, 10) The bank payment is pending; transferring it never adds collected money.
    const receipt = (
      data(
        await as(adminToken)(
          api().get('/api/school-cash-box/receipts').query({ bankId }),
        ).expect(200),
      ) as unknown as Body[]
    ).find((r) => r.quotationNumber === juan.quotationNumber)!;
    expect(
      maria.payments.find(
        (p: Body) => p.receiptNumber === receipt.receiptNumber,
      ).destination,
    ).toBe('BANCO');
    const midway = await summary();
    await as(adminToken)(
      api()
        .post('/api/school-cash-box/transfers')
        .send({
          bankId,
          items: [{ movementId: receipt.id, amount: 200 }],
          clientRequestId: randomUUID(),
        }),
    ).expect(201);
    const after = await summary();
    expect(after.collected.total).toBeCloseTo(midway.collected.total, 2);
    expect(after.cashBalance - midway.cashBalance).toBeCloseTo(200, 2);
    expect((await customer(MARIA)).customer.paid).toBeCloseTo(500, 2);

    // (11, 12) The abono goes to the chosen list (Juan) and settles it.
    await pay(juan.id, { amount: 300, paymentMethod: 'EFECTIVO' });
    maria = await customer(MARIA);
    const juanRow = maria.lists.find((l: Body) => l.id === juan.id);
    const anaRow = maria.lists.find((l: Body) => l.id === ana.id);
    expect([juanRow.accountStatus, juanRow.balance]).toEqual(['PAGADA', 0]);
    expect([anaRow.accountStatus, anaRow.balance]).toEqual(['PENDIENTE', 650]);
    expect(maria.payments[0]).toMatchObject({
      typeLabel: 'Liquidación',
      quotationNumber: juan.quotationNumber,
    });

    // (18) Chronological statement: real rows, ends at the official balance.
    expect(maria.ledger.consistent).toBe(true);
    expect(maria.ledger.closing).toBe(650);
    expect(maria.ledger.rows.map((r: Body) => r.kind)).toEqual([
      'CARGO_LISTA',
      'PAGO',
      'CARGO_LISTA',
      'PAGO',
      'PAGO',
    ]);

    // (15, 16) Elena: a voided payment and a cancellation with refund.
    const elena = await createList(
      'Elena Castro',
      ELENA,
      'Mario Castro',
      'Segundo Básico',
      500,
      { amount: 100, paymentMethod: 'EFECTIVO' },
    );
    const extra = await pay(elena.id, {
      amount: 50,
      paymentMethod: 'EFECTIVO',
    });
    await as(adminToken)(
      api()
        .post(`/api/school-lists/payments/${extra.paymentId}/void`)
        .send({ reason: 'Abono duplicado', clientRequestId: randomUUID() }),
    ).expect(200);
    await as(adminToken)(
      api().post(`/api/school-lists/quotations/${elena.id}/cancel`).send({
        reason: 'Cliente desistió',
        refundMethod: 'EFECTIVO',
        clientRequestId: randomUUID(),
      }),
    ).expect(200);
    const elenaStatement = await customer(ELENA);
    expect(elenaStatement.customer).toMatchObject({
      status: 'CANCELADO',
      balance: 0,
      purchased: 0,
    });
    expect(elenaStatement.ledger.rows.map((r: Body) => r.kind)).toEqual([
      'CARGO_LISTA',
      'PAGO',
      'PAGO',
      'ANULACION_PAGO',
      'DEVOLUCION',
      'CANCELACION',
    ]);
    expect(elenaStatement.ledger.closing).toBe(0);
    expect(elenaStatement.ledger.consistent).toBe(true);

    // (17) Dashboard indicators moved exactly by these customers.
    const now = await summary();
    expect(now.sales.total - before.sales.total).toBeCloseTo(
      1450 + 400 + 250,
      2,
    );
    expect(now.customersBalance - before.customersBalance).toBeCloseTo(
      650 + 400,
      2,
    );
    expect(now.customers.withBalance - before.customers.withBalance).toBe(2);
    expect(now.customers.solvent - before.customers.solvent).toBe(1);
    expect(now.portfolio.paid - before.portfolio.paid).toBe(2);
    expect(now.portfolio.pending - before.portfolio.pending).toBe(2);
    expect(now.portfolio.cancelled - before.portfolio.cancelled).toBe(1);
    const weekly = await summary({ granularity: 'week' });
    expect(weekly.series.length).toBe(12);
    const monthly = await summary({ granularity: 'month' });
    expect(monthly.series.length).toBe(12);
    expect(monthly.series.at(-1).total).toBeGreaterThan(0);
  });

  it('filters and sorts the customers table', async () => {
    const list = async (query: Body) =>
      data(
        await as(userToken)(
          api().get('/api/school-cash-box/customers').query(query),
        ).expect(200),
      );
    expect(
      (await list({ search: 'Ana Lopez' })).items.map((c: Body) => c.key),
    ).toContain(key(MARIA)); // student, accents
    expect(
      (await list({ search: '59170002' })).items.map((c: Body) => c.key),
    ).toEqual([key(PEDRO)]); // phone
    const solvent = await list({ view: 'SOLVENT', search: '5917' });
    expect(solvent.items.map((c: Body) => c.key)).toEqual([key(LUCIA)]);
    const noPayments = await list({ view: 'NO_PAYMENTS', search: '5917' });
    expect(noPayments.items.map((c: Body) => c.key)).toEqual([key(PEDRO)]);
    const owing = await list({
      view: 'WITH_BALANCE',
      search: '5917',
      sort: 'BALANCE',
    });
    expect(owing.items.map((c: Body) => c.key)).toEqual([
      key(MARIA),
      key(PEDRO),
    ]);
    expect(owing.totals.balance).toBeCloseTo(1050, 2);
    const byGrade = await list({ grade: 'Tercero Básico', search: '5917' });
    expect(byGrade.items.map((c: Body) => c.key)).toEqual([key(MARIA)]);
    await as(userToken)(
      api().get('/api/school-cash-box/customers').query({ view: 'NOPE' }),
    ).expect(400);
  });

  it('prints the statement PDF and enforces permissions', async () => {
    // (19) A cashier can view and print a customer statement…
    const pdf = await as(userToken)(
      api()
        .get(`/api/school-cash-box/customers/${key(MARIA)}/statement`)
        .buffer(true),
    ).expect(200);
    expect(pdf.headers['content-type']).toContain('application/pdf');
    expect((pdf.body as Buffer).subarray(0, 4).toString()).toBe('%PDF');
    // (20) …but not the rest of the caja.
    await as(userToken)(api().get('/api/school-cash-box/summary')).expect(403);
    await as(userToken)(api().get('/api/school-cash-box/payments')).expect(403);
    await as(userToken)(api().get('/api/school-cash-box/customers/123')).expect(
      404,
    );
    await as(userToken)(
      api().get('/api/school-cash-box/customers/50000000'),
    ).expect(404);

    // Payments of every customer (admin): filters and totals.
    const payments = data(
      await as(adminToken)(
        api()
          .get('/api/school-cash-box/payments')
          .query({ search: '5917', method: 'EFECTIVO' }),
      ).expect(200),
    );
    expect(
      payments.items.every((p: Body) => p.paymentMethod === 'EFECTIVO'),
    ).toBe(true);
    expect(payments.totals.received).toBeGreaterThan(0);
  });
});
