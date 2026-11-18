import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Listas Escolares (migration 1760007900000) end to end over HTTP: templates,
 * quotations per grade customized without touching the template, anticipo +
 * abonos, duplicate protection, account statement, statuses, audited
 * reversal, cancellation with refund, PDFs, RBAC — and no effect on inventory
 * or sales.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/school-lists.e2e-spec.ts`,
 * which uses a temporary `<db>_e2e` clone and drops it afterwards.
 */
describe('Listas Escolares (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let product: { id: string; name: string; public_price: string };

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const message = (response: request.Response): string =>
    JSON.stringify(response.body);
  const inventoryFingerprint = async () =>
    (
      (await dataSource.query(
        `SELECT (SELECT COALESCE(SUM(stock), 0) FROM products)::text || '/' ||
                (SELECT count(*) FROM sales)::text || '/' ||
                (SELECT count(*) FROM sales_cash_box_movements)::text AS f`,
      )) as Body[]
    )[0].f as string;

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'school-lists e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    const admin =
      users.find((u) => u.role === 'ADMIN') ??
      users.find((u) => u.role === 'SUPER_ADMIN')!;
    const cashier = users.find((u) => u.role === 'USER')!;
    const sign = (u: Body) =>
      jwt.sign({ sub: u.id, username: u.username, role: u.role });
    adminToken = sign(admin);
    userToken = sign(cashier);
    [product] = (await dataSource.query(
      `SELECT id, name, public_price FROM products WHERE is_active ORDER BY created_at LIMIT 1`,
    )) as (typeof product)[];
  });

  afterAll(async () => {
    await app.close();
  });

  it('plantillas, cotización personalizada, anticipo, abonos, estado de cuenta, entrega y PDF', async () => {
    const before = await inventoryFingerprint();

    // Permissions per role.
    const userPerms = data(
      await as(userToken)(api().get('/api/school-lists/permissions')).expect(
        200,
      ),
    ).permissions as string[];
    expect(userPerms).toContain('school_lists.quotations.create');
    expect(userPerms).not.toContain('school_lists.templates.manage');

    // The three default templates.
    const templates = data(
      await as(userToken)(api().get('/api/school-lists/templates')).expect(200),
    ) as unknown as Body[];
    const names = templates.map((t) => t.name);
    expect(names).toEqual(
      expect.arrayContaining([
        'Primero Básico',
        'Segundo Básico',
        'Tercero Básico',
      ]),
    );
    const primero = templates.find((t) => t.name === 'Primero Básico')!;

    // Only an administrator configures the official list.
    const listBody = {
      name: 'Primero Básico',
      grade: 'Primero Básico',
      items: [
        { productName: 'Cuaderno mediano', quantity: 3, unitPrice: 15 },
        { productName: 'Cuaderno grande', quantity: 2, unitPrice: 25 },
        { productName: 'Lápiz', quantity: 5, unitPrice: 2 },
        { productName: 'Borrador', quantity: 2, unitPrice: 3 },
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: Number(product.public_price),
        },
      ],
      version: primero.version,
    };
    await as(userToken)(
      api().put(`/api/school-lists/templates/${primero.id}`).send(listBody),
    ).expect(403);
    const template = data(
      await as(adminToken)(
        api().put(`/api/school-lists/templates/${primero.id}`).send(listBody),
      ).expect(200),
    );
    expect(template.items).toHaveLength(5);
    expect(template.total).toBeCloseTo(
      45 + 50 + 10 + 6 + Number(product.public_price),
      2,
    );
    // A stale version is rejected.
    await as(adminToken)(
      api().put(`/api/school-lists/templates/${primero.id}`).send(listBody),
    ).expect(409);

    // Duplicate as the base of another template.
    const copy = data(
      await as(adminToken)(
        api()
          .post(`/api/school-lists/templates/${primero.id}/duplicate`)
          .send({ name: `Primero Básico copia ${Date.now()}` }),
      ).expect(201),
    );
    expect(copy.items).toHaveLength(5);
    await as(adminToken)(
      api()
        .patch(`/api/school-lists/templates/${copy.id}/status`)
        .send({ isActive: false }),
    ).expect(200);

    // Quotation: the customer wants a big notebook instead of the medium ones.
    const line = (name: string) =>
      (template.items as Body[]).find((i) => i.productName === name)!;
    const items = [
      {
        productName: 'Cuaderno grande (en lugar del mediano)',
        quantity: 1,
        unitPrice: 25,
      },
      {
        templateItemId: line('Lápiz').id,
        productName: 'Lápiz',
        quantity: 5,
        unitPrice: 2,
      },
      {
        templateItemId: line('Borrador').id,
        productName: 'Borrador',
        quantity: 2,
        unitPrice: 3,
        observations: 'Blanco',
      },
    ];
    const base = {
      templateId: primero.id,
      customerName: 'María López',
      customerPhone: '5555-1234',
      studentName: 'Ana López',
      quotationDate: '2099-03-01',
      deliveryDate: '2099-03-10',
      observations: 'El cliente recogerá los útiles el viernes',
    };

    // A cashier cannot change a reference price.
    const forbidden = await as(userToken)(
      api()
        .post('/api/school-lists/quotations')
        .send({
          ...base,
          items: [{ ...items[1], unitPrice: 1 }],
          clientRequestId: randomUUID(),
        }),
    ).expect(403);
    expect(message(forbidden)).toContain('Lápiz');
    // Phone is mandatory.
    await as(userToken)(
      api()
        .post('/api/school-lists/quotations')
        .send({
          ...base,
          customerPhone: '',
          items,
          clientRequestId: randomUUID(),
        }),
    ).expect(400);

    const requestId = randomUUID();
    const createBody = {
      ...base,
      items,
      advance: { amount: 11, paymentMethod: 'EFECTIVO' },
      clientRequestId: requestId,
    };
    const created = data(
      await as(userToken)(
        api().post('/api/school-lists/quotations').send(createBody),
      ).expect(201),
    );
    // Total 25 + 10 + 6 = 41; anticipo 11 → saldo 30.
    expect(created).toEqual(
      expect.objectContaining({
        grade: 'Primero Básico',
        total: 41,
        status: 'ANTICIPO_RECIBIDO',
        accountStatus: 'PARCIAL',
      }),
    );
    expect(created.account).toEqual(
      expect.objectContaining({ advances: 11, paid: 11, balance: 30 }),
    );
    expect((created.items as Body[]).map((i) => i.source)).toEqual([
      'MANUAL',
      'PLANTILLA',
      'PLANTILLA',
    ]);
    // Double click: same quotation, still one payment.
    const again = data(
      await as(userToken)(
        api().post('/api/school-lists/quotations').send(createBody),
      ).expect(201),
    );
    expect(again.id).toBe(created.id);
    expect(again.payments).toHaveLength(1);

    // The template is untouched by the customization.
    const templateAfter = data(
      await as(userToken)(
        api().get(`/api/school-lists/templates/${primero.id}`),
      ).expect(200),
    );
    expect((templateAfter.items as Body[]).map((i) => i.productName)).toContain(
      'Cuaderno mediano',
    );

    // Abonos.
    const pay = (amount: number, id = randomUUID(), token = userToken) =>
      as(token)(
        api().post(`/api/school-lists/quotations/${created.id}/payments`).send({
          amount,
          paymentMethod: 'TRANSFERENCIA',
          reference: 'TRX-1',
          clientRequestId: id,
        }),
      );
    await pay(-5).expect(400);
    await pay(10.555).expect(400);
    const over = await pay(30.01).expect(409);
    expect(message(over)).toContain('Q30.00');
    const abonoId = randomUUID();
    const first = data(await pay(10, abonoId).expect(201));
    const firstAgain = data(await pay(10, abonoId).expect(201));
    expect(firstAgain.paymentId).toBe(first.paymentId);
    const second = data(await pay(12).expect(201));
    expect(second.quotation.status).toBe('PAGO_PARCIAL');
    expect(
      (second.quotation.payments as Body[]).map((p) => p.runningBalance),
    ).toEqual([30, 20, 8]);
    expect(second.quotation.account).toEqual(
      expect.objectContaining({
        advances: 11,
        installments: 22,
        paid: 33,
        balance: 8,
      }),
    );

    // Change of template afterwards never touches the saved quotation.
    await as(adminToken)(
      api()
        .put(`/api/school-lists/templates/${primero.id}`)
        .send({
          ...listBody,
          items: [{ productName: 'Lápiz', quantity: 10, unitPrice: 9 }],
          version: templateAfter.version,
        }),
    ).expect(200);
    const unchanged = data(
      await as(userToken)(
        api().get(`/api/school-lists/quotations/${created.id}`),
      ).expect(200),
    );
    expect(unchanged.total).toBe(41);
    expect((unchanged.items as Body[])[1].unitPrice).toBe(2);

    // Audited reversal: cashier 403, admin voids → saldo vuelve.
    const abono = (second.quotation.payments as Body[]).find(
      (p) => p.amount === 12,
    )!;
    await as(userToken)(
      api()
        .post(`/api/school-lists/payments/${abono.id}/void`)
        .send({ reason: 'Monto incorrecto', clientRequestId: randomUUID() }),
    ).expect(403);
    const voided = data(
      await as(adminToken)(
        api()
          .post(`/api/school-lists/payments/${abono.id}/void`)
          .send({ reason: 'Monto incorrecto', clientRequestId: randomUUID() }),
      ).expect(200),
    );
    expect(voided.quotation.account.balance).toBe(20);
    expect(
      (voided.quotation.payments as Body[]).map((p) => `${p.kind}:${p.status}`),
    ).toEqual([
      'ANTICIPO:APLICADO',
      'ABONO:APLICADO',
      'ABONO:ANULADO',
      'ANULACION:APLICADO',
    ]);

    // Delivery needs the whole balance.
    const status = (action: string) =>
      as(userToken)(
        api()
          .post(`/api/school-lists/quotations/${created.id}/status`)
          .send({ action }),
      );
    await status('PREPARAR').expect(200);
    const notPaid = await status('ENTREGAR').expect(409);
    expect(message(notPaid)).toContain('Q20.00');
    const paid = data(await pay(20).expect(201));
    expect(paid.quotation.status).toBe('EN_PREPARACION');
    expect(paid.quotation.accountStatus).toBe('PAGADA');
    // Packed and dispatched: TERMINADA, ready for the customer.
    const finished = data(await status('TERMINAR').expect(200));
    expect(finished.status).toBe('TERMINADA');
    expect(finished.finishedAt).toBeTruthy();
    await status('TERMINAR').expect(409);
    const delivered = data(await status('ENTREGAR').expect(200));
    expect(delivered.status).toBe('ENTREGADA');
    await pay(1).expect(409);
    expect(
      (delivered.history as Body[]).map((h) => h.action).reverse(),
    ).toEqual([
      'CREADA',
      'PAGO',
      'PAGO',
      'PAGO',
      'PAGO_ANULADO',
      'PREPARAR',
      'PAGO',
      'TERMINAR',
      'ENTREGAR',
    ]);

    // Documents.
    const pdf = await as(userToken)(
      api().get(`/api/school-lists/quotations/${created.id}/pdf`),
    )
      .buffer(true)
      .parse((res, done) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => done(null, Buffer.concat(chunks)));
      })
      .expect(200);
    expect(pdf.headers['content-type']).toBe('application/pdf');
    expect((pdf.body as Buffer).subarray(0, 4).toString()).toBe('%PDF');
    const receipt = await as(userToken)(
      api().get(`/api/school-lists/payments/${first.paymentId}/receipt`),
    ).expect(200);
    expect(receipt.headers['content-type']).toBe('application/pdf');

    // Filters and dashboard.
    const byPhone = data(
      await as(userToken)(
        api()
          .get('/api/school-lists/quotations')
          .query({ phone: '55551234', grade: 'Primero Básico' }),
      ).expect(200),
    );
    expect((byPhone.items as Body[]).map((q) => q.id)).toContain(created.id);
    const byNumber = data(
      await as(userToken)(
        api()
          .get('/api/school-lists/quotations')
          .query({ number: created.quotationNumber, status: 'ENTREGADA' }),
      ).expect(200),
    );
    expect(byNumber.total).toBe(1);
    const dashboard = data(
      await as(userToken)(
        api()
          .get('/api/school-lists/quotations/dashboard')
          .query({ dateFrom: '2099-03-01', dateTo: '2099-03-31' }),
      ).expect(200),
    );
    expect(dashboard).toEqual(
      expect.objectContaining({ totalQuotations: 1, paidQuotations: 1 }),
    );
    expect(dashboard.byGrade).toEqual([
      { grade: 'Primero Básico', count: 1, total: 41 },
    ]);

    // Nothing reached inventory, sales or the sales cash box.
    expect(await inventoryFingerprint()).toBe(before);
  });

  it('borrador, edición con control de versión y cancelación con devolución', async () => {
    const segundo = (
      data(
        await as(userToken)(api().get('/api/school-lists/templates')).expect(
          200,
        ),
      ) as unknown as Body[]
    ).find((t) => t.name === 'Segundo Básico')!;
    const draft = data(
      await as(userToken)(
        api()
          .post('/api/school-lists/quotations')
          .send({
            templateId: segundo.id,
            customerName: 'Carlos Pérez',
            customerPhone: '+502 4444 9999',
            asDraft: true,
            items: [
              {
                productId: product.id,
                productName: product.name,
                quantity: 2,
                unitPrice: Number(product.public_price),
              },
              { productName: 'Mochila', quantity: 1, unitPrice: 150 },
            ],
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    expect(draft.status).toBe('BORRADOR');
    await as(userToken)(
      api()
        .post(`/api/school-lists/quotations/${draft.id}/payments`)
        .send({
          amount: 5,
          paymentMethod: 'EFECTIVO',
          clientRequestId: randomUUID(),
        }),
    ).expect(409);

    // Edit with a stale version → 409; with the current one → saved.
    const editItems = (draft.items as Body[]).map((i) => ({
      itemId: i.id,
      productId: i.productId,
      productName: i.productName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    }));
    editItems.push({
      itemId: undefined,
      productId: null,
      productName: 'Regla 30 cm',
      quantity: 1,
      unitPrice: 5,
    });
    const editBody = {
      customerName: 'Carlos Pérez',
      customerPhone: '+502 4444 9999',
      items: editItems,
      observations: 'Pendiente de confirmar disponibilidad',
    };
    await as(userToken)(
      api()
        .put(`/api/school-lists/quotations/${draft.id}`)
        .send({ ...editBody, version: draft.version + 5 }),
    ).expect(409);
    const edited = data(
      await as(userToken)(
        api()
          .put(`/api/school-lists/quotations/${draft.id}`)
          .send({ ...editBody, version: draft.version }),
      ).expect(200),
    );
    expect(edited.total).toBeCloseTo(draft.total + 5, 2);
    const confirmed = data(
      await as(userToken)(
        api()
          .post(`/api/school-lists/quotations/${draft.id}/status`)
          .send({ action: 'CONFIRMAR', version: edited.version }),
      ).expect(200),
    );
    expect(confirmed.status).toBe('COTIZADA');
    await as(userToken)(
      api()
        .patch(`/api/school-lists/quotations/${draft.id}/observations`)
        .send({
          observations: 'Hará un segundo abono antes de la entrega',
          version: confirmed.version,
        }),
    ).expect(200);

    await as(userToken)(
      api()
        .post(`/api/school-lists/quotations/${draft.id}/payments`)
        .send({
          amount: 50,
          paymentMethod: 'EFECTIVO',
          clientRequestId: randomUUID(),
        }),
    ).expect(201);

    // Cancel: cashier 403; manager with refund.
    await as(userToken)(
      api().post(`/api/school-lists/quotations/${draft.id}/cancel`).send({
        reason: 'El cliente desiste',
        refundMethod: 'EFECTIVO',
        clientRequestId: randomUUID(),
      }),
    ).expect(403);
    const noMethod = await as(adminToken)(
      api()
        .post(`/api/school-lists/quotations/${draft.id}/cancel`)
        .send({ reason: 'El cliente desiste', clientRequestId: randomUUID() }),
    ).expect(400);
    expect(message(noMethod)).toContain('devuelve');
    const cancelled = data(
      await as(adminToken)(
        api().post(`/api/school-lists/quotations/${draft.id}/cancel`).send({
          reason: 'El cliente desiste',
          refundMethod: 'EFECTIVO',
          clientRequestId: randomUUID(),
        }),
      ).expect(200),
    );
    expect(cancelled.status).toBe('CANCELADA');
    expect(cancelled.account).toEqual(
      expect.objectContaining({ paid: 0, refunds: 50, balance: 0 }),
    );
    expect((cancelled.payments as Body[]).map((p) => p.kind)).toEqual([
      'ANTICIPO',
      'DEVOLUCION',
    ]);
    await as(userToken)(
      api()
        .post(`/api/school-lists/quotations/${draft.id}/payments`)
        .send({
          amount: 5,
          paymentMethod: 'EFECTIVO',
          clientRequestId: randomUUID(),
        }),
    ).expect(409);
  });
});
