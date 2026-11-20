import type { SchoolCashBoxRepository } from '../../domain/repositories/school-cash-box.repository';
import {
  CashActor,
  ExportSchoolCashReportUseCase,
  GetSchoolCashReportUseCase,
  GetSchoolCashSummaryUseCase,
  RegisterSchoolCashAdjustmentUseCase,
  RegisterSchoolCashCountUseCase,
  RegisterSchoolCashExitUseCase,
  RegisterSchoolCashTransferUseCase,
  VoidSchoolCashTransferUseCase,
  resolveRange,
} from './school-cash-box.use-cases';
import {
  reportTotals,
  findReport,
  formatCell,
} from '../reports/school-cash-reports';

const admin: CashActor = { userId: 'a1', role: 'ADMIN', username: 'admin' };
const supervisor: CashActor = {
  userId: 's1',
  role: 'SUPERVISOR_DE_TURNO',
  username: 'super',
};
const cashier: CashActor = { userId: 'c1', role: 'USER', username: 'caja' };
const KEY = '7d7d2b1e-1111-4a4a-9b9b-123456789abc';

function repository(
  overrides: Partial<SchoolCashBoxRepository> = {},
): jest.Mocked<SchoolCashBoxRepository> {
  return {
    summary: jest.fn().mockResolvedValue({ cashBalance: 0 }),
    balance: jest.fn().mockResolvedValue(1250.5),
    listMovements: jest.fn(),
    findMovement: jest.fn().mockResolvedValue({ id: 'm1' }),
    listReceipts: jest.fn(),
    listTransfers: jest.fn(),
    findTransfer: jest.fn().mockResolvedValue({ id: 't1' }),
    listExits: jest.fn(),
    findExit: jest.fn().mockResolvedValue({ id: 'e1' }),
    listCounts: jest.fn(),
    findCount: jest.fn().mockResolvedValue({ id: 'k1' }),
    listUsers: jest.fn(),
    pendingTotal: jest.fn(),
    registerTransfer: jest.fn().mockResolvedValue('t1'),
    voidTransfer: jest.fn().mockResolvedValue('t1'),
    registerExit: jest.fn().mockResolvedValue('e1'),
    voidExit: jest.fn().mockResolvedValue('e1'),
    registerAdjustment: jest.fn().mockResolvedValue('m1'),
    voidAdjustment: jest.fn().mockResolvedValue('m2'),
    registerCount: jest.fn().mockResolvedValue('k1'),
    reportRows: jest.fn().mockResolvedValue([]),
    ...overrides,
  } as unknown as jest.Mocked<SchoolCashBoxRepository>;
}

describe('Caja de Listas Escolares — use cases', () => {
  it('only managers see the caja; a cashier gets 403', async () => {
    const repo = repository();
    const useCase = new GetSchoolCashSummaryUseCase(repo);
    await expect(useCase.execute(supervisor)).resolves.toBeDefined();
    expect(() => useCase.execute(cashier)).toThrow(
      expect.objectContaining({ code: 'SCHOOL_LIST_FORBIDDEN', status: 403 }),
    );
  });

  it('only administrators transfer money from a bank (validated before SQL)', async () => {
    const repo = repository();
    const useCase = new RegisterSchoolCashTransferUseCase(repo);
    const input = { bankId: 'b1', items: [{ movementId: 'r1', amount: 200 }] };
    await expect(useCase.execute(supervisor, input, KEY)).rejects.toMatchObject(
      { code: 'SCHOOL_LIST_FORBIDDEN' },
    );
    await expect(
      useCase.execute(admin, { ...input, items: [] }, KEY),
    ).rejects.toMatchObject({
      code: 'SCHOOL_CASH_TRANSFER_EMPTY',
    });
    await expect(
      useCase.execute(
        admin,
        { ...input, items: [input.items[0], input.items[0]] },
        KEY,
      ),
    ).rejects.toMatchObject({ code: 'SCHOOL_CASH_TRANSFER_DUPLICATE' });
    await expect(
      useCase.execute(
        admin,
        { ...input, items: [{ movementId: 'r1', amount: 10.001 }] },
        KEY,
      ),
    ).rejects.toMatchObject({ code: 'SCHOOL_CASH_INVALID_AMOUNT' });
    await expect(useCase.execute(admin, input, 'short')).rejects.toMatchObject({
      code: 'SCHOOL_IDEMPOTENCY_KEY_REQUIRED',
    });
    expect(repo.registerTransfer).not.toHaveBeenCalled();

    await useCase.execute(admin, input, KEY);
    expect(repo.registerTransfer).toHaveBeenCalledWith(
      input,
      'a1',
      `SCT:${KEY}`,
    );
  });

  it('voiding a transfer requires a reason of 5+ characters and authorization', async () => {
    const repo = repository();
    const useCase = new VoidSchoolCashTransferUseCase(repo);
    await expect(useCase.execute(admin, 't1', 'no')).rejects.toMatchObject({
      code: 'SCHOOL_REASON_REQUIRED',
    });
    await expect(
      useCase.execute(supervisor, 't1', 'Traslado equivocado'),
    ).rejects.toMatchObject({
      code: 'SCHOOL_LIST_FORBIDDEN',
    });
    await useCase.execute(admin, 't1', '  Traslado equivocado  ');
    expect(repo.voidTransfer).toHaveBeenCalledWith(
      't1',
      'Traslado equivocado',
      'a1',
    );
  });

  it('an exit to a bank needs the account, any other destination must not send one', async () => {
    const repo = repository();
    const useCase = new RegisterSchoolCashExitUseCase(repo);
    const base = {
      amount: 100,
      reason: 'Depósito del día',
      destination: 'DEPOSITO_BANCARIO' as const,
    };
    await expect(useCase.execute(admin, base, KEY)).rejects.toMatchObject({
      code: 'SCHOOL_CASH_BANK_REQUIRED',
    });
    await expect(
      useCase.execute(
        admin,
        { ...base, destination: 'OTRO', bankId: 'b1' },
        KEY,
      ),
    ).rejects.toMatchObject({ code: 'SCHOOL_CASH_BANK_REQUIRED' });
    await expect(
      useCase.execute(admin, { ...base, bankId: 'b1', reason: '' }, KEY),
    ).rejects.toMatchObject({
      code: 'SCHOOL_REASON_REQUIRED',
    });
    await useCase.execute(admin, { ...base, bankId: 'b1' }, KEY);
    expect(repo.registerExit).toHaveBeenCalledWith(
      expect.objectContaining({ bankId: 'b1' }),
      'a1',
      `SCE:${KEY}`,
    );
  });

  it('adjustments are admin-only; counts are for managers and drop empty denominations', async () => {
    const repo = repository();
    await expect(
      new RegisterSchoolCashAdjustmentUseCase(repo).execute(
        supervisor,
        { direction: 'IN', amount: 10, reason: 'Saldo inicial' },
        KEY,
      ),
    ).rejects.toMatchObject({ code: 'SCHOOL_LIST_FORBIDDEN' });

    const counts = new RegisterSchoolCashCountUseCase(repo);
    await expect(
      counts.execute(cashier, { details: [] }, KEY),
    ).rejects.toMatchObject({
      code: 'SCHOOL_LIST_FORBIDDEN',
    });
    await counts.execute(
      supervisor,
      {
        details: [
          { denomination: 100, quantity: 2 },
          { denomination: 50, quantity: 0 },
        ],
      },
      KEY,
    );
    expect(repo.registerCount).toHaveBeenCalledWith(
      { details: [{ denomination: 100, quantity: 2 }] },
      's1',
      `SCC:${KEY}`,
    );
  });

  it('report range defaults to the current month and rejects an inverted range', () => {
    expect(resolveRange(undefined, undefined, '2026-11-19')).toEqual({
      from: '2026-11-01',
      to: '2026-11-19',
    });
    expect(() => resolveRange('2026-11-20', '2026-11-01')).toThrow(
      expect.objectContaining({ code: 'SCHOOL_CASH_INVALID_RANGE' }),
    );
    expect(() => resolveRange('19/11/2026', undefined)).toThrow(
      expect.objectContaining({ code: 'SCHOOL_CASH_INVALID_RANGE' }),
    );
  });

  it('reports translate codes to labels and total in cents (no float drift)', async () => {
    const repo = repository({
      reportRows: jest.fn().mockResolvedValue([
        {
          at: '2026-11-19T15:00:00.000Z',
          receipt: 'RLE-1',
          quotation: 'LE-1',
          customer: 'Ana',
          method: 'TRANSFERENCIA',
          bank: 'BI',
          reference: 'X',
          amount: 0.1,
          transferred: 0,
          pending: 0.1,
          transferStatus: 'PENDIENTE',
        },
        {
          at: '2026-11-19T16:00:00.000Z',
          receipt: 'RLE-2',
          quotation: 'LE-2',
          customer: 'Luis',
          method: 'DEPOSITO',
          bank: 'BI',
          reference: 'Y',
          amount: 0.2,
          transferred: 0.2,
          pending: 0,
          transferStatus: 'TRASLADADO',
        },
      ]),
    });
    const report = await new GetSchoolCashReportUseCase(repo).execute(
      admin,
      'pagos-bancarios',
      '2026-11-01',
      '2026-11-19',
    );
    expect(report.rows[0].method).toBe('Transferencia');
    expect(report.rows[1].transferStatus).toBe('Trasladado');
    expect(report.totals.amount).toBe(0.3);
    expect(report.cashBalance).toBe(1250.5);
    await expect(
      new GetSchoolCashReportUseCase(repo).execute(admin, 'no-existe'),
    ).rejects.toMatchObject({
      code: 'SCHOOL_CASH_INVALID_REPORT',
    });
    await expect(
      new GetSchoolCashReportUseCase(repo).execute(cashier, 'pagos-bancarios'),
    ).rejects.toMatchObject({
      code: 'SCHOOL_LIST_FORBIDDEN',
    });
  });

  it('exports the same rows as PDF and Excel', async () => {
    const repo = repository({
      reportRows: jest.fn().mockResolvedValue([
        {
          day: '2026-11-18',
          payments: 2,
          cash: 100,
          transfer: 50,
          deposit: 0,
          other: 0,
          refunds: 10,
          net: 140,
        },
      ]),
    });
    const report = new GetSchoolCashReportUseCase(repo);
    const exporter = new ExportSchoolCashReportUseCase(repo, report);
    const pdf = await exporter.execute(
      admin,
      'recaudacion-diaria',
      'pdf',
      '2026-11-01',
      '2026-11-19',
    );
    expect(pdf.contentType).toBe('application/pdf');
    expect(pdf.filename).toBe(
      'caja-listas-recaudacion-diaria-2026-11-01_2026-11-19.pdf',
    );
    expect(pdf.buffer.subarray(0, 4).toString()).toBe('%PDF');
    const xlsx = await exporter.execute(
      admin,
      'recaudacion-diaria',
      'xlsx',
      '2026-11-01',
      '2026-11-19',
    );
    expect(xlsx.filename.endsWith('.xlsx')).toBe(true);
    expect(xlsx.buffer.subarray(0, 2).toString()).toBe('PK');
  });

  it('formats report cells for the PDF', () => {
    const definition = findReport('recaudacion-diaria')!;
    const money = definition.columns.find((c) => c.key === 'cash')!;
    const day = definition.columns.find((c) => c.key === 'day')!;
    expect(formatCell(money, 1234.5)).toBe('Q 1,234.50');
    expect(formatCell(money, -5)).toBe('-Q 5.00');
    expect(formatCell(day, '2026-11-01')).toBe('01/11/2026');
    expect(
      reportTotals(definition, [
        { payments: 1, cash: 0.1 },
        { payments: 2, cash: 0.2 },
      ]),
    ).toMatchObject({
      payments: 3,
      cash: 0.3,
    });
  });
});
