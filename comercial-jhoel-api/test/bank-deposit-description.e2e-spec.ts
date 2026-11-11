import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { todayIsoDate } from '../src/modules/bank-deposits/application/utils/today-iso-date';

/**
 * Transaccionar → "Descripción / Beneficiario" — HTTP end-to-end (full
 * AppModule, real Postgres): register with a description, read it back in the
 * detail and in the daily/monthly/historical report, search by beneficiary and
 * by concept, export the PDF with the same filters, and keep historical
 * operations (no description) working.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/bank-deposit-description.e2e-spec.ts`,
 * which uses a temporary `<db>_e2e` clone and drops it afterwards.
 */
describe('Transaccionar — descripción / beneficiario (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let token: string;
  let typeId: string;
  let agentId: string;
  let accountId: string;

  type Body = Record<string, unknown>;
  const api = () => request(app.getHttpServer());
  const auth = (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);
  const data = <T = Body>(response: request.Response): T =>
    (response.body as { data: T }).data;
  const today = todayIsoDate();
  const monthStart = `${today.slice(0, 8)}01`;

  const payload = (description?: unknown) => ({
    transactionBankId: agentId,
    bankAccountId: accountId,
    transactionTypeId: typeId,
    totalAmount: 150,
    cashBreakdownEnabled: false,
    cashDetails: [],
    transactionAmounts: [150],
    ...(description === undefined ? {} : { description }),
  });

  const report = async (query: Record<string, string>) =>
    data<{ items: Body[]; total: number }>(
      await auth(
        api()
          .get('/api/reports/bank-deposits')
          .query({ limit: '200', ...query }),
      ).expect(200),
    );

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'bank-deposit-description e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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

    const [admin] = await dataSource.query<Body[]>(`
      SELECT u.id, u.username, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id
      WHERE r.name IN ('SUPER_ADMIN', 'ADMIN') AND u.is_active ORDER BY u.created_at LIMIT 1
    `);
    token = app
      .get(JwtService)
      .sign({ sub: admin.id, username: admin.username, role: admin.role });
    await dataSource.query(
      `INSERT INTO day_openings (date, opened_by)
       SELECT $1::date, $2 WHERE NOT EXISTS (SELECT 1 FROM day_openings WHERE date = $1::date)`,
      [today, admin.id],
    );
    // A Retiro adds to the account, so it never fails for lack of balance.
    [{ id: typeId }] = await dataSource.query<{ id: string }[]>(
      `SELECT id FROM transaction_types WHERE balance_effect = 'RETIRO' AND is_active ORDER BY created_at LIMIT 1`,
    );
    [{ id: agentId }] = await dataSource.query<{ id: string }[]>(
      `SELECT id FROM transaction_banks WHERE is_active AND cash_box_code IS NULL ORDER BY created_at LIMIT 1`,
    );
    [{ id: accountId }] = await dataSource.query<{ id: string }[]>(
      `SELECT id FROM banks WHERE is_active AND special_account IS NULL AND available_in_transaccionar
       AND max_balance IS NULL ORDER BY created_at LIMIT 1`,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('requires the description and rejects more than 250 characters (nothing is registered)', async () => {
    const [{ count: before }] = await dataSource.query<{ count: string }[]>(
      `SELECT count(*) FROM bank_deposit_operations`,
    );
    const missing = await auth(
      api().post('/api/bank-deposits').send(payload()),
    ).expect(400);
    expect(JSON.stringify(missing.body)).toContain(
      'Ingrese la descripción o el beneficiario',
    );
    await auth(api().post('/api/bank-deposits').send(payload('    '))).expect(
      400,
    );
    const tooLong = await auth(
      api()
        .post('/api/bank-deposits')
        .send(payload('a'.repeat(251))),
    ).expect(400);
    expect(JSON.stringify(tooLong.body)).toContain('250 caracteres');
    const [{ count: after }] = await dataSource.query<{ count: string }[]>(
      `SELECT count(*) FROM bank_deposit_operations`,
    );
    expect(after).toBe(before);
  });

  it('persists it with the operation, returns it in the detail and in the daily/monthly/historical report, and searches by it', async () => {
    const [{ final_balance: balanceBefore }] = await dataSource.query<
      { final_balance: string }[]
    >(`SELECT final_balance FROM banks WHERE id = $1`, [accountId]);
    const created = data(
      await auth(
        api()
          .post('/api/bank-deposits')
          .send(payload('  Juan   Pérez - Pago de préstamo  ')),
      ).expect(201),
    );
    expect(created.description).toBe('Juan Pérez - Pago de préstamo');

    // Same row in PostgreSQL, one operation, and the balance moved exactly as without a description.
    const rows = await dataSource.query<Body[]>(
      `SELECT description, total_amount FROM bank_deposit_operations WHERE id = $1`,
      [created.id],
    );
    expect(rows).toEqual([
      { description: 'Juan Pérez - Pago de préstamo', total_amount: '150.00' },
    ]);
    const [{ final_balance: balanceAfter }] = await dataSource.query<
      { final_balance: string }[]
    >(`SELECT final_balance FROM banks WHERE id = $1`, [accountId]);
    expect(Number(balanceAfter) - Number(balanceBefore)).toBeCloseTo(150, 2);

    const detail = data(
      await auth(api().get(`/api/bank-deposits/${String(created.id)}`)).expect(
        200,
      ),
    );
    expect(detail.description).toBe('Juan Pérez - Pago de préstamo');

    for (const range of [
      { startDate: today, endDate: today },
      { startDate: monthStart, endDate: today },
      {},
    ]) {
      const result = await report(range);
      expect(
        result.items.find((item) => item.id === created.id)?.description,
      ).toBe('Juan Pérez - Pago de préstamo');
    }

    // Search by beneficiary (no accents/case) and by concept, combined with the other filters.
    const byName = await report({
      search: 'juan perez',
      transactionTypeId: typeId,
    });
    expect(byName.items.map((item) => item.id)).toContain(created.id);
    const byConcept = await report({ search: 'PRÉSTAMO' });
    expect(byConcept.items.map((item) => item.id)).toContain(created.id);
    const none = await report({
      search: 'juan perez',
      startDate: '2000-01-01',
      endDate: '2000-01-02',
    });
    expect(none.total).toBe(0);

    const summary = data(
      await auth(
        api()
          .get('/api/reports/bank-deposits/summary')
          .query({ search: 'juan perez' }),
      ).expect(200),
    );
    expect(Number(summary.operationCount)).toBeGreaterThanOrEqual(1);

    const pdf = await auth(
      api()
        .get('/api/reports/bank-deposits/export')
        .query({ search: 'juan perez' }),
    )
      .buffer(true)
      .parse((res, callback) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => callback(null, Buffer.concat(chunks)));
      })
      .expect(200);
    expect(pdf.headers['content-type']).toContain('application/pdf');
    expect((pdf.body as Buffer).subarray(0, 4).toString()).toBe('%PDF');
  });

  it('keeps historical operations (no description) listed and readable', async () => {
    const [historical] = await dataSource.query<{ id: string }[]>(
      `SELECT id FROM bank_deposit_operations WHERE description IS NULL ORDER BY created_at LIMIT 1`,
    );
    if (!historical) {
      return;
    }
    const detail = data(
      await auth(api().get(`/api/bank-deposits/${historical.id}`)).expect(200),
    );
    expect(detail.description).toBeNull();
    const all = await report({});
    expect(all.items.some((item) => item.description === null)).toBe(true);
  });
});
