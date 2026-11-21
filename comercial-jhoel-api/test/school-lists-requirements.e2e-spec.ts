import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import { inflateSync } from 'zlib';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Listas Escolares — school requirements vs. inventory products (migration
 * 1760008400000), end to end over HTTP:
 *
 * - templates hold manual requirements (no inventory product, long text,
 *   cent-exact totals) and can be copied to another grade;
 * - a quotation copies them, is born ACEPTADA, keeps that status while
 *   receiving payments and moves no stock;
 * - EN_PREPARACION: requirements are fulfilled by one or several inventory
 *   products (split quantities); saving or changing assignments never moves
 *   stock nor touches the requirement text or its quoted price;
 * - "Finalizar preparación" (TERMINAR) requires every requirement covered,
 *   is blocked when Bodega lacks stock and discounts Bodega exactly once;
 * - dispatch needs the finished preparation and moves nothing; annulment
 *   returns exactly what was discounted, once;
 * - the customer PDF keeps the original requirement text;
 * - lists saved with the previous flow keep their behavior.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/school-lists-requirements.e2e-spec.ts`
 * (temporary `<db>_e2e` clone, dropped afterwards).
 */
describe('Listas Escolares — requerimientos y preparación (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let productA: Body;
  let productB: Body;
  let inactive: Body;
  let templateId: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const message = (response: request.Response): string =>
    JSON.stringify(response.body);

  const LONG_REQUIREMENT =
    'Cuaderno de cuadrícula grande, 8 mm, espiral de 80 hojas, pasta dura color azul, ' +
    'forrado con plástico transparente y etiqueta con el nombre completo del estudiante, ' +
    'grado y sección (lo solicita la coordinación académica).';
  const GRAPADO = 'Cuaderno cuadrícula 80 hojas grapado';

  /** Sets a known Bodega quantity for a product (clone only). */
  const setBodega = async (productId: string, quantity: number) => {
    await dataSource.query(
      `SELECT ensure_inventory_stock_row($1, (SELECT id FROM inventory_locations WHERE name = 'Bodega'))`,
      [productId],
    );
    await dataSource.query(
      `WITH b AS (SELECT s.quantity FROM inventory_stock s JOIN inventory_locations l ON l.id = s.location_id
                   WHERE s.product_id = $1 AND l.name = 'Bodega')
       UPDATE products SET stock = stock - (SELECT quantity FROM b) + $2 WHERE id = $1`,
      [productId, quantity],
    );
    await dataSource.query(
      `UPDATE inventory_stock SET quantity = $2 WHERE product_id = $1
          AND location_id = (SELECT id FROM inventory_locations WHERE name = 'Bodega')`,
      [productId, quantity],
    );
  };
  const bodega = async (productId: string): Promise<number> =>
    Number(
      (
        (await dataSource.query(
          `SELECT s.quantity FROM inventory_stock s JOIN inventory_locations l ON l.id = s.location_id
            WHERE s.product_id = $1 AND l.name = 'Bodega'`,
          [productId],
        )) as Body[]
      )[0].quantity,
    );
  const movements = async (quotationId: string): Promise<Body[]> =>
    (await dataSource.query(
      `SELECT product_id, movement_type, quantity_base_units::int AS qty FROM inventory_movements
        WHERE reference_type = 'SCHOOL_LIST' AND reference_id = $1 ORDER BY created_at, id`,
      [quotationId],
    )) as Body[];
  /** Whole-inventory fingerprint: total stock and number of movements. */
  const inventoryFingerprint = async (): Promise<string> =>
    (
      (await dataSource.query(
        `SELECT (SELECT COALESCE(SUM(stock), 0) FROM products)::text || '/' ||
                (SELECT count(*) FROM inventory_movements)::text AS f`,
      )) as Body[]
    )[0].f as string;
  /** Visible text of a PDFKit document (inflated content streams, hex strings). */
  const pdfText = (pdf: Buffer): string => {
    const raw = pdf.toString('latin1');
    let out = '';
    const streams = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    for (let m = streams.exec(raw); m; m = streams.exec(raw)) {
      let content: string;
      try {
        content = inflateSync(Buffer.from(m[1], 'latin1')).toString('latin1');
      } catch {
        continue;
      }
      for (const tj of content.match(/\[(.*?)\]\s*TJ/g) ?? []) {
        out +=
          (tj.match(/<([0-9a-fA-F]*)>/g) ?? [])
            .map((hex) =>
              Buffer.from(hex.slice(1, -1), 'hex').toString('latin1'),
            )
            .join('') + '\n';
      }
    }
    return out;
  };

  const status = (id: string, action: string, version?: number) =>
    as(userToken)(
      api()
        .post(`/api/school-lists/quotations/${id}/status`)
        .send({ action, ...(version ? { version } : {}) }),
    );
  const prepare = (id: string, version: number, assignments: Body[]) =>
    as(userToken)(
      api()
        .put(`/api/school-lists/quotations/${id}/preparation`)
        .send({ version, assignments }),
    );
  const get = async (id: string): Promise<Body> =>
    data(
      await as(userToken)(
        api().get(`/api/school-lists/quotations/${id}`),
      ).expect(200),
    );

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'school-lists-requirements e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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

    // Two real active products (the "cosido" and "espiral" of the example).
    [productA, productB] = (await dataSource.query(
      `SELECT id, name, public_price::float AS price FROM products
        WHERE is_active ORDER BY name LIMIT 2`,
    )) as Body[];
    await setBodega(productA.id, 20);
    await setBodega(productB.id, 20);
    // An inactive product (deactivated on this clone only).
    [inactive] = (await dataSource.query(
      `SELECT id, name FROM products WHERE is_active AND id NOT IN ($1, $2) ORDER BY name LIMIT 1`,
      [productA.id, productB.id],
    )) as Body[];
    await dataSource.query(
      `UPDATE products SET is_active = FALSE WHERE id = $1`,
      [inactive.id],
    );
    [{ id: templateId }] = (await dataSource.query(
      `SELECT id FROM school_list_templates WHERE is_active ORDER BY sort_order LIMIT 1`,
    )) as Body[];
  });

  afterAll(async () => {
    await app.close();
  });

  it('flujo completo: plantilla manual → ACEPTADA → preparación → finalizar → despacho', async () => {
    const fingerprint = await inventoryFingerprint();

    // 1–2. Template with requirements that do not exist in inventory, manual prices.
    const template = data(
      await as(adminToken)(
        api()
          .put(`/api/school-lists/templates/${templateId}`)
          .send({
            name: 'Primero Básico',
            grade: 'Primero Básico',
            items: [
              { productName: GRAPADO, quantity: 1, unitPrice: 25 },
              { productName: LONG_REQUIREMENT, quantity: 5, unitPrice: 12.35 },
              {
                productName: 'Calculadora científica',
                quantity: 1,
                unitPrice: 85.1,
                observations: 'Modelo permitido por el colegio',
              },
            ],
          }),
      ).expect(200),
    );
    expect(LONG_REQUIREMENT.length).toBeGreaterThan(150);
    expect(template.items.map((i: Body) => i.productId)).toEqual([
      null,
      null,
      null,
    ]);
    // 25 + 5 × 12.35 (61.75) + 85.10 = 171.85, cent-exact.
    expect(template.total).toBe(171.85);
    expect(template.items[1]).toMatchObject({
      productName: LONG_REQUIREMENT,
      subtotal: 61.75,
    });

    // Reuse it for another grade.
    const copy = data(
      await as(adminToken)(
        api()
          .post(`/api/school-lists/templates/${templateId}/duplicate`)
          .send({ name: `Copia QA ${Date.now()}`, grade: 'Segundo Básico' }),
      ).expect(201),
    );
    expect(copy.items.map((i: Body) => i.productName)).toEqual(
      template.items.map((i: Body) => i.productName),
    );

    // A requirement never carries an inventory product.
    const base = {
      templateId,
      customerName: 'Familia Requerimientos',
      customerPhone: '5555-4040',
      studentName: 'Luis',
      deliveryDate: '2099-02-01',
    };
    const { templateId: _template, ...customer } = base;
    void _template;
    const items = template.items.map((i: Body) => ({
      templateItemId: i.id,
      productName: i.productName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      observations: i.observations,
    }));
    const withProduct = await as(userToken)(
      api()
        .post('/api/school-lists/quotations')
        .send({
          ...base,
          items: [
            ...items,
            {
              productId: productA.id,
              productName: 'Cuaderno X',
              quantity: 1,
              unitPrice: 1,
            },
          ],
          clientRequestId: randomUUID(),
        }),
    ).expect(400);
    expect(message(withProduct)).toContain('texto libre');

    // 3–5. Quotation from the template: ACEPTADA, same totals, no inventory touched.
    const created = data(
      await as(userToken)(
        api()
          .post('/api/school-lists/quotations')
          .send({
            ...base,
            items,
            advance: { amount: 50, paymentMethod: 'EFECTIVO' },
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    expect(created).toMatchObject({
      status: 'ACEPTADA',
      fulfillmentMode: 'PREPARACION',
      subtotal: 171.85,
      total: 171.85,
      paid: 50,
      balance: 121.85,
    });
    expect(
      created.items.map((i: Body) => [i.productName, i.productId]),
    ).toEqual(template.items.map((i: Body) => [i.productName, null]));
    expect(await inventoryFingerprint()).toBe(fingerprint);
    expect(await movements(created.id)).toEqual([]);
    // An abono does not change ACEPTADA (payment progress is the balance).
    const paid = data(
      await as(userToken)(
        api().post(`/api/school-lists/quotations/${created.id}/payments`).send({
          amount: 21.85,
          paymentMethod: 'EFECTIVO',
          clientRequestId: randomUUID(),
        }),
      ).expect(201),
    ).quotation;
    expect(paid).toMatchObject({ status: 'ACEPTADA', balance: 100 });

    // Preparation cannot be saved before the list is in preparation.
    await prepare(created.id, paid.version, []).expect(409);

    // 6. ACEPTADA → EN_PREPARACION (no stock moves).
    let q = data(
      await status(created.id, 'PREPARAR', paid.version).expect(200),
    );
    expect(q.status).toBe('EN_PREPARACION');
    expect(await movements(created.id)).toEqual([]);
    const [grapado, cuadernos, calculadora] = q.items as Body[];

    // 9. Validations: over-assignment, repeated product, inactive product, foreign line.
    const exceeds = await prepare(created.id, q.version, [
      { itemId: cuadernos.id, productId: productA.id, quantity: 4 },
      { itemId: cuadernos.id, productId: productB.id, quantity: 2 },
    ]).expect(400);
    expect(message(exceeds)).toContain('solo pide 5');
    await prepare(created.id, q.version, [
      { itemId: grapado.id, productId: productA.id, quantity: 1 },
      { itemId: grapado.id, productId: productA.id, quantity: 1 },
    ]).expect(400);
    const off = await prepare(created.id, q.version, [
      { itemId: grapado.id, productId: inactive.id, quantity: 1 },
    ]).expect(409);
    expect(message(off)).toContain('desactivado');
    await prepare(created.id, q.version, [
      { itemId: randomUUID(), productId: productA.id, quantity: 1 },
    ]).expect(400);

    // 7–8, 13. A different product for "grapado"; 5 notebooks split 3 + 2; nothing moves.
    q = data(
      await prepare(created.id, q.version, [
        { itemId: grapado.id, productId: productB.id, quantity: 1 },
        { itemId: cuadernos.id, productId: productA.id, quantity: 3 },
        { itemId: cuadernos.id, productId: productB.id, quantity: 2 },
      ]).expect(200),
    );
    expect(await movements(created.id)).toEqual([]);
    expect(await inventoryFingerprint()).not.toBe(''); // sanity
    expect(await bodega(productA.id)).toBe(20);
    expect(await bodega(productB.id)).toBe(20);
    expect(q.items[0]).toMatchObject({
      productName: GRAPADO,
      unitPrice: 25,
      subtotal: 25,
      assignments: [
        expect.objectContaining({ productId: productB.id, quantity: 1 }),
      ],
    });
    expect(
      q.items[1].assignments.map((a: Body) => [a.productId, a.quantity]).sort(),
    ).toEqual(
      [
        [productA.id, 3],
        [productB.id, 2],
      ].sort(),
    );
    expect(q.total).toBe(171.85);

    // 9. The calculator is still uncovered: finishing is refused, nothing moves.
    const incomplete = await status(created.id, 'TERMINAR', q.version).expect(
      409,
    );
    expect(message(incomplete)).toContain('Calculadora científica');
    expect(await movements(created.id)).toEqual([]);

    // 11. Change the product of a requirement: the quoted price stays.
    const reference = Number(productA.price);
    q = data(
      await prepare(created.id, q.version, [
        { itemId: grapado.id, productId: productA.id, quantity: 1 },
        { itemId: cuadernos.id, productId: productA.id, quantity: 3 },
        { itemId: cuadernos.id, productId: productB.id, quantity: 2 },
        { itemId: calculadora.id, productId: productB.id, quantity: 1 },
      ]).expect(200),
    );
    expect(q.items[0].assignments[0]).toMatchObject({
      productId: productA.id,
      referencePrice: reference,
    });
    expect(q.items[0]).toMatchObject({ productName: GRAPADO, unitPrice: 25 });
    expect(q.subtotal).toBe(171.85);
    expect(q.history[0]).toMatchObject({ action: 'PREPARACION' });
    expect(await movements(created.id)).toEqual([]);

    // Editing the requirements while preparing keeps their assignments.
    q = data(
      await as(userToken)(
        api()
          .put(`/api/school-lists/quotations/${created.id}`)
          .send({
            ...customer,
            version: q.version,
            items: q.items.map((i: Body) => ({
              itemId: i.id,
              productName: i.productName,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              observations: i.lineNo === 3 ? 'Casio fx-82' : i.observations,
            })),
          }),
      ).expect(200),
    );
    expect(q.items.map((i: Body) => i.assignments.length)).toEqual([1, 2, 1]);
    expect(q.items[2].observations).toBe('Casio fx-82');

    // 10. Not enough stock: finishing is blocked, nothing changes.
    await setBodega(productB.id, 2);
    const short = await status(created.id, 'TERMINAR', q.version).expect(409);
    expect(message(short)).toContain('disponibles 2, se necesitan 3');
    expect((await get(created.id)).status).toBe('EN_PREPARACION');
    expect(await movements(created.id)).toEqual([]);
    expect(await bodega(productB.id)).toBe(2);
    await setBodega(productB.id, 20);

    // Dispatch requires the finished preparation.
    await as(userToken)(
      api()
        .post(`/api/school-lists/quotations/${created.id}/dispatch`)
        .send({ clientRequestId: randomUUID() }),
    ).expect(409);

    // 14. "Finalizar preparación": Bodega discounted once, exactly the assignments.
    q = data(await status(created.id, 'TERMINAR', q.version).expect(200));
    expect(q.status).toBe('TERMINADA');
    expect(await bodega(productA.id)).toBe(16); // 1 + 3
    expect(await bodega(productB.id)).toBe(17); // 2 + 1
    const finished = await movements(created.id);
    expect(
      finished.map((m) => [m.product_id, m.movement_type, m.qty]).sort(),
    ).toEqual(
      [
        [productA.id, 'SALIDA_LISTA_ESCOLAR', 4],
        [productB.id, 'SALIDA_LISTA_ESCOLAR', 3],
      ].sort(),
    );

    // 15. No second discount: finishing again, editing or re-preparing is refused.
    await status(created.id, 'TERMINAR', q.version).expect(409);
    await prepare(created.id, q.version, []).expect(409);
    await as(userToken)(
      api()
        .put(`/api/school-lists/quotations/${created.id}`)
        .send({ ...customer, version: q.version, items }),
    ).expect(409);
    expect(await movements(created.id)).toHaveLength(2);

    // 12. The customer document shows the requirements, not the inventory products.
    const pdf = await as(userToken)(
      api()
        .get(`/api/school-lists/quotations/${created.id}/pdf`)
        .buffer(true)
        .parse((res, done) => {
          const chunks: Buffer[] = [];
          res.on('data', (c: Buffer) => chunks.push(c));
          res.on('end', () => done(null, Buffer.concat(chunks)));
        }),
    ).expect(200);
    const text = pdfText(pdf.body as Buffer);
    expect(text).toContain(GRAPADO);
    expect(text).toContain('Calculadora científica');
    expect(text).not.toContain(productA.name);
    expect(text).not.toContain(productB.name);

    // Delivery: paid in full, no further stock movement.
    await as(userToken)(
      api().post(`/api/school-lists/quotations/${created.id}/payments`).send({
        amount: 100,
        paymentMethod: 'EFECTIVO',
        clientRequestId: randomUUID(),
      }),
    ).expect(201);
    await as(userToken)(
      api()
        .post(`/api/school-lists/quotations/${created.id}/dispatch`)
        .send({ clientRequestId: randomUUID() }),
    ).expect(200);
    const delivered = await get(created.id);
    expect(delivered.status).toBe('ENTREGADA');
    expect(await movements(created.id)).toHaveLength(2);
    expect(await bodega(productA.id)).toBe(16);
  });

  it('anular una lista terminada devuelve exactamente lo descontado, una sola vez', async () => {
    const quotation = data(
      await as(userToken)(
        api()
          .post('/api/school-lists/quotations')
          .send({
            customerName: 'Familia Anulación',
            customerPhone: '5555-5050',
            grade: 'Tercero Básico',
            items: [
              { productName: 'Juego de geometría', quantity: 2, unitPrice: 35 },
            ],
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    // A quotation is prepared only after the customer accepts it (1760009000000).
    expect(quotation.status).toBe('COTIZADA');
    await status(quotation.id, 'PREPARAR').expect(409);
    await status(quotation.id, 'ACEPTAR').expect(200);
    let q = data(await status(quotation.id, 'PREPARAR').expect(200));
    q = data(
      await prepare(q.id, q.version, [
        { itemId: q.items[0].id, productId: productA.id, quantity: 2 },
      ]).expect(200),
    );
    const before = await bodega(productA.id);
    await status(q.id, 'TERMINAR', q.version).expect(200);
    expect(await bodega(productA.id)).toBe(before - 2);

    const key = randomUUID();
    const cancel = () =>
      as(adminToken)(
        api()
          .post(`/api/school-lists/quotations/${q.id}/cancel`)
          .send({ reason: 'Cliente desistió', clientRequestId: key }),
      ).expect(200);
    await cancel();
    await cancel();
    expect(await bodega(productA.id)).toBe(before);
    expect(
      (await movements(q.id)).map((m) => [m.movement_type, m.qty]),
    ).toEqual([
      ['SALIDA_LISTA_ESCOLAR', 2],
      ['ENTRADA_ANULACION_LISTA', 2],
    ]);
  });

  it('un borrador se confirma como COTIZADA y el cliente la acepta; las listas anteriores conservan su flujo', async () => {
    const draft = data(
      await as(userToken)(
        api()
          .post('/api/school-lists/quotations')
          .send({
            customerName: 'Familia Borrador',
            customerPhone: '5555-6060',
            grade: 'Segundo Básico',
            asDraft: true,
            items: [
              { productName: 'Regla de 30 cm', quantity: 1, unitPrice: 6.5 },
            ],
            clientRequestId: randomUUID(),
          }),
      ).expect(201),
    );
    expect(draft.status).toBe('BORRADOR');
    const confirmed = data(await status(draft.id, 'CONFIRMAR').expect(200));
    expect(confirmed.status).toBe('COTIZADA');
    const accepted = data(await status(draft.id, 'ACEPTAR').expect(200));
    expect(accepted.status).toBe('ACEPTADA');
    // Skipping the preparation is not allowed.
    await status(draft.id, 'TERMINAR').expect(409);
    expect(await movements(draft.id)).toEqual([]);

    // 16. A list saved with the previous flow (discount at confirmation).
    await dataSource.query(
      `ALTER TABLE school_quotations ALTER COLUMN fulfillment_mode SET DEFAULT 'CONFIRMACION'`,
    );
    let legacy: Body;
    try {
      legacy = data(
        await as(userToken)(
          api()
            .post('/api/school-lists/quotations')
            .send({
              customerName: 'Familia Histórica',
              customerPhone: '5555-7070',
              grade: 'Primero Básico',
              items: [
                {
                  productId: productB.id,
                  productName: productB.name,
                  quantity: 1,
                  unitPrice: productB.price,
                },
              ],
              clientRequestId: randomUUID(),
            }),
        ).expect(201),
      );
    } finally {
      await dataSource.query(
        `ALTER TABLE school_quotations ALTER COLUMN fulfillment_mode SET DEFAULT 'PREPARACION'`,
      );
    }
    expect(legacy).toMatchObject({
      status: 'COTIZADA',
      fulfillmentMode: 'CONFIRMACION',
    });
    expect(
      (await movements(legacy.id)).map((m) => [m.movement_type, m.qty]),
    ).toEqual([['SALIDA_LISTA_ESCOLAR', 1]]);
    await status(legacy.id, 'ACEPTAR').expect(200);
    const prepared = data(await status(legacy.id, 'PREPARAR').expect(200));
    expect(prepared.status).toBe('EN_PREPARACION');
    const notApplicable = await prepare(legacy.id, prepared.version, []).expect(
      409,
    );
    expect(message(notApplicable)).toContain('flujo anterior');
    await status(legacy.id, 'TERMINAR').expect(200);
    expect(await movements(legacy.id)).toHaveLength(1);

    // Without a session nothing is reachable.
    await api()
      .put(`/api/school-lists/quotations/${legacy.id}/preparation`)
      .send({ version: 1, assignments: [] })
      .expect(401);
  });
});
