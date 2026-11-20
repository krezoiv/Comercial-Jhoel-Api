import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Caja de Listas Escolares (migration 1760008700000), end to end over HTTP:
 *
 * - a cash payment of a list enters the Caja de Listas; a transfer raises the
 *   bank and stays "pendiente de trasladar"; a card payment stays outside;
 * - "Transferir a Caja de Listas" (partial, idempotent, never above the
 *   pending amount), its audited void and the payment void rules;
 * - exits, adjustments, cash counts (never adjust), movements and reports
 *   (JSON, PDF, Excel) with the same numbers;
 * - Cuadre de Agentes exposes "listas por trasladar";
 * - RBAC: a cashier registers payments but never sees nor moves the caja.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/school-cash-box.e2e-spec.ts`
 * (temporary `<db>_e2e` clone, dropped afterwards).
 */
describe('Caja de Listas Escolares (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let bankId: string;
  let otherBankId: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const message = (response: request.Response): string =>
    JSON.stringify(response.body);
  const bankBalance = async (id: string): Promise<number> =>
    Number(
      (
        await dataSource.query(
          `SELECT final_balance FROM banks WHERE id = $1`,
          [id],
        )
      )[0].final_balance,
    );
  const summary = async (): Promise<Body> =>
    data(
      await as(adminToken)(api().get('/api/school-cash-box/summary')).expect(
        200,
      ),
    );
  const createList = async (total: number, advance?: Body): Promise<Body> =>
    data(
      await as(userToken)(
        api()
          .post('/api/school-lists/quotations')
          .send({
            grade: 'Primero Básico',
            customerName: 'María López',
            customerPhone: '5555-1234',
            studentName: 'Ana López',
            items: [
              {
                productName: 'Paquete de útiles escolares',
                quantity: 1,
                unitPrice: total,
              },
            ],
            ...(advance ? { advance } : {}),
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
  const pay = (quotationId: string, body: Body, token = userToken) =>
    as(token)(
      api()
        .post(`/api/school-lists/quotations/${quotationId}/payments`)
        .send({ ...body, clientRequestId: randomUUID() }),
    );

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'school-cash-box e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    [{ id: bankId }, { id: otherBankId }] = await dataSource.query(
      `SELECT id FROM banks WHERE is_active AND special_account IS NULL ORDER BY name, id LIMIT 2`,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('routes every list payment by its method and transfers bank money to the caja', async () => {
    const before = await summary();
    const bank0 = await bankBalance(bankId);

    // Cash advance at creation → Caja de Listas.
    const list = await createList(850, {
      amount: 300,
      paymentMethod: 'EFECTIVO',
    });
    expect(list).toMatchObject({ paid: 300, balance: 550 });
    let now = await summary();
    expect(now.cashBalance - before.cashBalance).toBeCloseTo(300, 2);
    expect(now.collected.total - before.collected.total).toBeCloseTo(300, 2);

    // A transfer needs its bank; a credit line is not allowed.
    const noBank = await pay(list.id, {
      amount: 500,
      paymentMethod: 'TRANSFERENCIA',
    }).expect(400);
    expect(message(noBank)).toContain('cuenta bancaria');

    // Transfer of Q500: the bank goes up, the caja does not; it is pending.
    await pay(list.id, {
      amount: 500,
      paymentMethod: 'TRANSFERENCIA',
      bankId,
      reference: 'BI-1',
    }).expect(201);
    expect((await bankBalance(bankId)) - bank0).toBeCloseTo(500, 2);
    now = await summary();
    expect(now.cashBalance - before.cashBalance).toBeCloseTo(300, 2);
    expect(now.pendingTransfer - before.pendingTransfer).toBeCloseTo(500, 2);
    // Card: collected, but neither caja nor bank.
    await pay(list.id, { amount: 50, paymentMethod: 'TARJETA' }).expect(201);
    now = await summary();
    expect(now.collected.other - before.collected.other).toBeCloseTo(50, 2);
    expect((await bankBalance(bankId)) - bank0).toBeCloseTo(500, 2);

    // The cuadre of the agents subtracts the list money still in banks.
    const cuadre = data(
      await as(adminToken)(
        api().get('/api/banks/cuadre-agentes-summary'),
      ).expect(200),
    );
    expect(cuadre.totalSchoolListPending).toBeCloseTo(now.pendingTransfer, 2);

    // The pending receipt.
    const receipts = data(
      await as(adminToken)(
        api().get('/api/school-cash-box/receipts').query({ bankId }),
      ).expect(200),
    ) as unknown as Body[];
    const receipt = receipts.find(
      (r) => r.quotationNumber === list.quotationNumber,
    )!;
    expect(receipt).toMatchObject({
      amount: 500,
      pending: 500,
      transferStatus: 'PENDIENTE',
    });

    // A cashier never sees nor moves the caja.
    await as(userToken)(api().get('/api/school-cash-box/summary')).expect(403);
    const transfer = {
      bankId,
      items: [{ movementId: receipt.id, amount: 200 }],
      reference: 'BOL-1',
    };
    await as(userToken)(
      api()
        .post('/api/school-cash-box/transfers')
        .send({ ...transfer, clientRequestId: randomUUID() }),
    ).expect(403);

    // Partial transfer Q200, sent twice with the same request id → once.
    const requestId = randomUUID();
    const first = data(
      await as(adminToken)(
        api()
          .post('/api/school-cash-box/transfers')
          .send({ ...transfer, clientRequestId: requestId }),
      ).expect(201),
    );
    const again = data(
      await as(adminToken)(
        api()
          .post('/api/school-cash-box/transfers')
          .send({ ...transfer, clientRequestId: requestId }),
      ).expect(201),
    );
    expect(again.id).toBe(first.id);
    expect(first).toMatchObject({
      amount: 200,
      status: 'APLICADO',
      items: [expect.objectContaining({ amount: 200 })],
    });
    expect((await bankBalance(bankId)) - bank0).toBeCloseTo(300, 2);
    now = await summary();
    expect(now.cashBalance - before.cashBalance).toBeCloseTo(500, 2);
    expect(now.pendingTransfer - before.pendingTransfer).toBeCloseTo(300, 2);
    // Moving money between own accounts never adds collected money.
    expect(now.collected.total - before.collected.total).toBeCloseTo(850, 2);

    // Never above the pending amount, never from another bank.
    const over = await as(adminToken)(
      api()
        .post('/api/school-cash-box/transfers')
        .send({
          bankId,
          items: [{ movementId: receipt.id, amount: 300.01 }],
          clientRequestId: randomUUID(),
        }),
    ).expect(409);
    expect(message(over)).toContain('pendientes de trasladar');
    await as(adminToken)(
      api()
        .post('/api/school-cash-box/transfers')
        .send({
          bankId: otherBankId,
          items: [{ movementId: receipt.id, amount: 10 }],
          clientRequestId: randomUUID(),
        }),
    ).expect(400);

    // A transferred payment cannot be voided until its transfer is voided.
    const paymentId = (
      await dataSource.query(
        `SELECT payment_id FROM school_cash_movements WHERE id = $1`,
        [receipt.id],
      )
    )[0].payment_id as string;
    const blocked = await as(adminToken)(
      api()
        .post(`/api/school-lists/payments/${paymentId}/void`)
        .send({ reason: 'Pago duplicado', clientRequestId: randomUUID() }),
    ).expect(409);
    expect(message(blocked)).toContain('anule primero el traslado');

    const voided = data(
      await as(adminToken)(
        api()
          .post(`/api/school-cash-box/transfers/${first.id}/void`)
          .send({ reason: 'Traslado equivocado' }),
      ).expect(201),
    );
    expect(voided).toMatchObject({
      status: 'ANULADO',
      voidReason: 'Traslado equivocado',
    });
    expect((await bankBalance(bankId)) - bank0).toBeCloseTo(500, 2);
    now = await summary();
    expect(now.cashBalance - before.cashBalance).toBeCloseTo(300, 2);
    expect(now.pendingTransfer - before.pendingTransfer).toBeCloseTo(500, 2);

    // Now the payment voids: bank back to its start, nothing pending.
    await as(adminToken)(
      api()
        .post(`/api/school-lists/payments/${paymentId}/void`)
        .send({ reason: 'Pago duplicado', clientRequestId: randomUUID() }),
    ).expect(200);
    expect((await bankBalance(bankId)) - bank0).toBeCloseTo(0, 2);
    now = await summary();
    expect(now.pendingTransfer - before.pendingTransfer).toBeCloseTo(0, 2);
  });

  it('exits, adjustments and cash counts keep the Kardex consistent', async () => {
    const start = (await summary()).cashBalance;
    const adjustment = data(
      await as(adminToken)(
        api().post('/api/school-cash-box/adjustments').send({
          direction: 'IN',
          amount: 1000,
          reason: 'Saldo inicial contado',
          clientRequestId: randomUUID(),
        }),
      ).expect(201),
    );
    expect(adjustment).toMatchObject({
      movementType: 'AJUSTE',
      direction: 'IN',
      amount: 1000,
    });

    // An exit larger than the cash is rejected; without reason it is 400.
    const tooMuch = await as(adminToken)(
      api()
        .post('/api/school-cash-box/exits')
        .send({
          amount: start + 1000 + 1,
          destination: 'ENTREGA_ADMINISTRACION',
          reason: 'Entrega del día',
          clientRequestId: randomUUID(),
        }),
    ).expect(409);
    expect(message(tooMuch)).toContain('no tiene efectivo suficiente');
    const exit = data(
      await as(adminToken)(
        api().post('/api/school-cash-box/exits').send({
          amount: 250,
          destination: 'DEPOSITO_BANCARIO',
          bankId,
          recipientName: 'Banco',
          reason: 'Depósito del efectivo de listas',
          clientRequestId: randomUUID(),
        }),
      ).expect(201),
    );
    expect(exit).toMatchObject({
      exitNumber: expect.stringMatching(/^SCL-/),
      amount: 250,
      bankId,
    });
    expect((await summary()).cashBalance - start).toBeCloseTo(750, 2);

    // Cash count: the difference stays visible and nothing is adjusted.
    const movementsBefore = data(
      await as(adminToken)(api().get('/api/school-cash-box/movements')).expect(
        200,
      ),
    ).total;
    const count = data(
      await as(adminToken)(
        api()
          .post('/api/school-cash-box/counts')
          .send({
            details: [
              { denomination: 200, quantity: 1 },
              { denomination: 0.01, quantity: 5 },
            ],
            observations: 'Conteo e2e',
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    expect(count.countedTotal).toBeCloseTo(200.05, 2);
    expect(count.difference).toBeCloseTo(200.05 - count.theoreticalBalance, 2);
    expect(count.details).toEqual([
      { denomination: 200, quantity: 1, subtotal: 200 },
      { denomination: 0.01, quantity: 5, subtotal: 0.05 },
    ]);
    expect(
      data(
        await as(adminToken)(
          api().get('/api/school-cash-box/movements'),
        ).expect(200),
      ).total,
    ).toBe(movementsBefore);
    await as(adminToken)(
      api()
        .post('/api/school-cash-box/counts')
        .send({
          details: [{ denomination: 3, quantity: 1 }],
          clientRequestId: randomUUID(),
        }),
    ).expect(400);

    // Void the adjustment (audited reversal) and filter the Kardex by type.
    await as(adminToken)(
      api()
        .post(`/api/school-cash-box/movements/${adjustment.id}/void`)
        .send({ reason: 'Ajuste de prueba' }),
    ).expect(201);
    const reversals = data(
      await as(adminToken)(
        api()
          .get('/api/school-cash-box/movements')
          .query({ movementType: 'REVERSION' }),
      ).expect(200),
    );
    expect(
      reversals.items.some((m: Body) => m.reversalOfId === adjustment.id),
    ).toBe(true);
  });

  it('reports: JSON, PDF and Excel; a list with caja money is never deleted', async () => {
    const catalog = data(
      await as(adminToken)(api().get('/api/school-cash-box/reports')).expect(
        200,
      ),
    ) as unknown as Body[];
    expect(catalog.map((r) => r.kind)).toEqual(
      expect.arrayContaining([
        'recaudacion-diaria',
        'pagos-bancarios',
        'traslados',
        'pendiente-traslado',
        'arqueos',
        'saldos-clientes',
      ]),
    );
    const daily = data(
      await as(adminToken)(
        api().get('/api/school-cash-box/reports/recaudacion-diaria'),
      ).expect(200),
    );
    expect(daily.rows.length).toBeGreaterThan(0);
    const pdf = await as(adminToken)(
      api()
        .get('/api/school-cash-box/reports/recaudacion-diaria/export')
        .query({ format: 'pdf' })
        .buffer(true),
    ).expect(200);
    expect(pdf.headers['content-type']).toContain('application/pdf');
    expect((pdf.body as Buffer).subarray(0, 4).toString()).toBe('%PDF');
    const xlsx = await as(adminToken)(
      api()
        .get('/api/school-cash-box/reports/pagos-bancarios/export')
        .query({ format: 'xlsx' })
        .buffer(true)
        .parse((res, done) => {
          const chunks: Buffer[] = [];
          res.on('data', (c: Buffer) => chunks.push(c));
          res.on('end', () => done(null, Buffer.concat(chunks)));
        }),
    ).expect(200);
    expect((xlsx.body as Buffer).subarray(0, 2).toString()).toBe('PK');
    await as(adminToken)(
      api().get('/api/school-cash-box/reports/no-existe'),
    ).expect(400);
    await as(userToken)(
      api().get('/api/school-cash-box/reports/recaudacion-diaria'),
    ).expect(403);

    const [{ id, quotation_number: number }] = await dataSource.query(
      `SELECT q.id, q.quotation_number FROM school_quotations q
        WHERE EXISTS (SELECT 1 FROM school_cash_movements m WHERE m.quotation_id = q.id) LIMIT 1`,
    );
    const superAdmin = (
      await dataSource.query(
        `SELECT u.id, u.username FROM users u JOIN roles r ON r.id = u.role_id WHERE r.name = 'SUPER_ADMIN' AND u.is_active LIMIT 1`,
      )
    )[0];
    if (superAdmin) {
      const token = app.get(JwtService).sign({
        sub: superAdmin.id,
        username: superAdmin.username,
        role: 'SUPER_ADMIN',
      });
      const blocked = await as(token)(
        api()
          .post(`/api/school-lists/quotations/${id}/delete`)
          .send({ confirmation: number }),
      ).expect(409);
      expect(message(blocked)).toContain('Caja de Listas');
    }
  });
});
