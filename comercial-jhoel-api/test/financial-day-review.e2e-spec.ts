import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Revisión de días operativos — HTTP end-to-end (full AppModule, real
 * Postgres) over the REAL closed days of the cloned database: reviews the
 * middle day of three consecutive closed days and proves that the days before
 * and after, and today's live balances, stay byte-identical.
 *
 * WRITES DATA: run it only through
 * `test/run-cash-control-e2e.sh test/financial-day-review.e2e-spec.ts`,
 * which uses a temporary `<db>_e2e` clone and drops it afterwards.
 */
describe('Revisión de días operativos (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let superToken: string;
  let super2Token: string;
  let adminToken: string;
  let userToken: string;
  let dayA: string;
  let dayB: string;
  let dayC: string;

  type Body = Record<string, any>;
  const api = () => request(app.getHttpServer());
  const data = (response: request.Response): Body =>
    (response.body as { data: Body }).data;
  const as = (token: string) => (req: request.Test) =>
    req.set('Authorization', `Bearer ${token}`);

  /** Same fingerprint as `sql/tests/financial-day-review.test.sql`: every row that belongs to a day. */
  const dayFingerprint = async (day: string): Promise<string> =>
    String(
      (
        await dataSource.query(
          `SELECT md5(concat_ws('|',
          (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM day_openings t WHERE date = $1),
          (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM bank_balances t WHERE operation_date = $1),
          (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM agent_reconciliations t WHERE date = $1),
          (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM cash_operational_days t WHERE operational_date = $1),
          (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM cash_movements t WHERE operational_date = $1),
          (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM bank_account_movements t WHERE business_date = $1),
          (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM bank_deposit_operations t WHERE operation_date = $1),
          (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM accounts_receivable t WHERE date = $1),
          (SELECT string_agg(to_jsonb(t)::text, ',' ORDER BY id) FROM assets t WHERE date = $1)
        )) AS fp`,
          [day],
        )
      )[0].fp,
    );
  const liveFingerprint = async (): Promise<string> =>
    String(
      (
        await dataSource.query(
          `SELECT md5(concat_ws('|',
          (SELECT string_agg(id::text || '=' || final_balance::text, ',' ORDER BY id) FROM banks),
          (SELECT cash_balance()::text),
          (SELECT sum(CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END)::text FROM accounts_receivable WHERE is_active),
          (SELECT sum(CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END)::text FROM assets WHERE is_active)
        )) AS fp`,
        )
      )[0].fp,
    );

  beforeAll(async () => {
    if (!(process.env.DATABASE_NAME ?? '').endsWith('_e2e')) {
      throw new Error(
        'financial-day-review e2e must run against a *_e2e clone (use test/run-cash-control-e2e.sh)',
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
    const sign = (user: Body) =>
      jwt.sign({ sub: user.id, username: user.username, role: user.role });
    const supers = users.filter((u) => u.role === 'SUPER_ADMIN');
    superToken = sign(supers[0]);
    super2Token = sign(supers[1] ?? supers[0]);
    adminToken = sign(users.find((u) => u.role === 'ADMIN'));
    userToken = sign(users.find((u) => u.role === 'USER'));

    // Three consecutive CLOSED days with a reconciliation (real data of the clone).
    const days = await dataSource.query(`
      SELECT to_char(o.date, 'YYYY-MM-DD') AS day FROM day_openings o
      WHERE o.closed_at IS NOT NULL AND NOT o.is_cancelled
        AND EXISTS (SELECT 1 FROM agent_reconciliations a WHERE a.date = o.date)
      ORDER BY o.date
    `);
    if (days.length < 3) {
      throw new Error(
        'The cloned database needs at least three closed days with a reconciliation',
      );
    }
    [dayA, dayB, dayC] = days.slice(0, 3).map((d) => String(d.day));
  });

  afterAll(async () => {
    await app.close();
  });

  it('RBAC: USER cannot read, ADMIN reads but cannot open or correct', async () => {
    await as(userToken)(
      api().get(`/api/financial-day-reviews/days?from=${dayA}&to=${dayC}`),
    ).expect(403);
    const list = await as(adminToken)(
      api().get(`/api/financial-day-reviews/days?from=${dayA}&to=${dayC}`),
    ).expect(200);
    expect((data(list) as unknown as Body[]).map((d) => d.date)).toEqual(
      expect.arrayContaining([dayA, dayB, dayC]),
    );

    const detail = data(
      await as(adminToken)(
        api().get(`/api/financial-day-reviews/days/${dayB}`),
      ).expect(200),
    );
    expect(detail.permissions.canCorrect).toBe(false);
    expect(detail.diagnosis.banks.length).toBeGreaterThan(0);

    await as(adminToken)(
      api()
        .post('/api/financial-day-reviews/sessions')
        .send({ date: dayB, reason: 'Revisión sin permiso', confirm: true }),
    ).expect(403);
  });

  it('opens, corrects only the selected day, audits, closes — previous/next days and live balances untouched', async () => {
    const before = {
      a: await dayFingerprint(dayA),
      c: await dayFingerprint(dayC),
      live: await liveFingerprint(),
    };

    // Explicit confirmation is required.
    await as(superToken)(
      api()
        .post('/api/financial-day-reviews/sessions')
        .send({ date: dayB, reason: 'Descuadre en agentes', confirm: false }),
    ).expect(400);

    // Concurrency: two administrators open the same day at the same time — exactly one wins.
    const [first, second] = await Promise.all([
      as(superToken)(
        api()
          .post('/api/financial-day-reviews/sessions')
          .send({ date: dayB, reason: 'Descuadre en agentes', confirm: true }),
      ),
      as(super2Token)(
        api()
          .post('/api/financial-day-reviews/sessions')
          .send({ date: dayB, reason: 'Otra revisión', confirm: true }),
      ),
    ]);
    expect([first.status, second.status].sort()).toEqual([201, 409]);
    const winner = first.status === 201 ? first : second;
    const ownerToken = winner === first ? superToken : super2Token;
    const loser = winner === first ? second : first;
    expect((loser.body as Body).message).toContain('ya está en revisión por');
    const session = data(winner);
    expect(session.status).toBe('OPEN');
    expect(session.snapshotBefore).toBeTruthy();

    const detail = data(
      await as(ownerToken)(
        api().get(`/api/financial-day-reviews/days/${dayB}`),
      ).expect(200),
    );
    const bank = (detail.diagnosis.banks as Body[]).find(
      (b) => b.balanceRowId,
    )!;
    const rowB = bank.balanceRowId as string;
    const original = Number(bank.registeredClosing);

    // Snapshot correction of the day's bank balance (+ idempotent retry).
    const requestId = randomUUID();
    const body = {
      target: 'BANK_BALANCE',
      targetId: rowB,
      field: 'final_balance',
      newValue: original + 5000,
      reason: 'Saldo final mal digitado',
      requestId,
      confirm: true,
    };
    const correction = data(
      await as(ownerToken)(
        api()
          .post(
            `/api/financial-day-reviews/sessions/${session.id}/snapshot-corrections`,
          )
          .send(body),
      ).expect(201),
    );
    expect(Number(correction.originalValue)).toBe(original);
    expect(Number(correction.newValue)).toBe(original + 5000);
    const retry = data(
      await as(ownerToken)(
        api()
          .post(
            `/api/financial-day-reviews/sessions/${session.id}/snapshot-corrections`,
          )
          .send(body),
      ).expect(201),
    );
    expect(retry.id).toBe(correction.id);

    // A row of the previous day is rejected from this session.
    const [rowA] = await dataSource.query(
      `SELECT id FROM bank_balances WHERE operation_date = $1 AND bank_id = (SELECT bank_id FROM bank_balances WHERE id = $2)`,
      [dayA, rowB],
    );
    if (rowA) {
      const outside = await as(ownerToken)(
        api()
          .post(
            `/api/financial-day-reviews/sessions/${session.id}/snapshot-corrections`,
          )
          .send({ ...body, targetId: rowA.id, requestId: randomUUID() }),
      ).expect(409);
      expect((outside.body as Body).message).toContain('pertenece a otro día');
    }

    // The other administrator cannot correct someone else's session.
    const otherToken = winner === first ? super2Token : superToken;
    if (otherToken !== ownerToken) {
      await as(otherToken)(
        api()
          .post(
            `/api/financial-day-reviews/sessions/${session.id}/snapshot-corrections`,
          )
          .send({ ...body, newValue: original + 1, requestId: randomUUID() }),
      ).expect(403);
    }

    // A normal write against the reviewed day is blocked while the review is open (any module).
    const [arB] = await dataSource.query(
      `SELECT id FROM accounts_receivable WHERE date = $1 AND is_active AND reference_type IS NULL LIMIT 1`,
      [dayB],
    );
    if (arB) {
      const locked = await as(superToken)(
        api()
          .patch(`/api/accounts-receivable/${arB.id}`)
          .send({ description: 'Edición durante la revisión' }),
      ).expect(409);
      expect((locked.body as Body).message).toContain('revisión histórica');

      // Movement correction through a linked adjustment: the original row keeps its amount.
      const [{ amount }] = await dataSource.query(
        `SELECT amount FROM accounts_receivable WHERE id = $1`,
        [arB.id],
      );
      await as(ownerToken)(
        api()
          .post(
            `/api/financial-day-reviews/sessions/${session.id}/movement-adjustments`,
          )
          .send({
            source: 'ACCOUNT_RECEIVABLE',
            sourceId: arB.id,
            correctedAmount: Number(amount) + 10,
            reason: 'Cargo registrado de menos',
            requestId: randomUUID(),
            confirm: true,
          }),
      ).expect(201);
      const [{ amount: after }] = await dataSource.query(
        `SELECT amount FROM accounts_receivable WHERE id = $1`,
        [arB.id],
      );
      expect(after).toBe(amount);
      const reviewed = data(
        await as(ownerToken)(
          api().get(`/api/financial-day-reviews/days/${dayB}`),
        ).expect(200),
      );
      expect(
        Number(reviewed.diagnosis.receivables.totals.reviewAdjustments),
      ).toBe(10);
    }

    // Close: summary first, then explicit confirmation (pending differences must be accepted).
    const summary = data(
      await as(ownerToken)(
        api().post(
          `/api/financial-day-reviews/sessions/${session.id}/close-request`,
        ),
      ).expect(200),
    );
    expect(summary.totalCorrections).toBeGreaterThanOrEqual(1);
    if (summary.hasPendingDifferences) {
      await as(ownerToken)(
        api()
          .post(`/api/financial-day-reviews/sessions/${session.id}/close`)
          .send({ acceptPendingDifferences: false, confirm: true }),
      ).expect(409);
    }
    const closed = data(
      await as(ownerToken)(
        api()
          .post(`/api/financial-day-reviews/sessions/${session.id}/close`)
          .send({
            acceptPendingDifferences: true,
            observations: 'Revisión e2e',
            confirm: true,
          }),
      ).expect(200),
    );
    expect(closed.status).toBe('CLOSED');
    expect(closed.snapshotAfter).toBeTruthy();

    // Closed: no more corrections; the correction persists; the audit is listed by day.
    await as(ownerToken)(
      api()
        .post(
          `/api/financial-day-reviews/sessions/${session.id}/snapshot-corrections`,
        )
        .send({ ...body, newValue: original, requestId: randomUUID() }),
    ).expect(409);
    const [{ final_balance }] = await dataSource.query(
      `SELECT final_balance FROM bank_balances WHERE id = $1`,
      [rowB],
    );
    expect(Number(final_balance)).toBe(original + 5000);
    const audit = data(
      await as(adminToken)(
        api().get(`/api/financial-day-reviews/corrections?date=${dayB}`),
      ).expect(200),
    ) as unknown as Body[];
    expect(
      audit.some(
        (c) =>
          c.id === correction.id && c.reason === 'Saldo final mal digitado',
      ),
    ).toBe(true);

    // CRITICAL ISOLATION: previous day, next day and today's live balances are byte-identical.
    expect(await dayFingerprint(dayA)).toBe(before.a);
    expect(await dayFingerprint(dayC)).toBe(before.c);
    expect(await liveFingerprint()).toBe(before.live);
  });

  it('rejects today and days that are still open', async () => {
    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Guatemala',
    }).format(new Date());
    await as(superToken)(
      api()
        .post('/api/financial-day-reviews/sessions')
        .send({ date: today, reason: 'Revisión de hoy', confirm: true }),
    ).expect(400);
    const [open] = await dataSource.query(
      `SELECT to_char(date, 'YYYY-MM-DD') AS day FROM day_openings WHERE closed_at IS NULL AND NOT is_cancelled AND date < $1 LIMIT 1`,
      [today],
    );
    if (open) {
      await as(superToken)(
        api()
          .post('/api/financial-day-reviews/sessions')
          .send({ date: open.day, reason: 'Día aún abierto', confirm: true }),
      ).expect(409);
    }
  });
});
