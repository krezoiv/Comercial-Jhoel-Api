import {
  ExportCashStatementUseCase,
  GetCashStatementUseCase,
  ListCashStatementDaysUseCase,
  cashStatementPeriodLabel,
} from './cash-statement.use-cases';
import type { CashStatementRepository } from '../../domain/repositories/cash-statement.repository';
import type { CashStatementPeriod } from '../../domain/cash-statement';

const admin = { userId: 'u-admin', username: 'admin', role: 'ADMIN' };
const cashier = { userId: 'u-user', username: 'cajero', role: 'USER' };

const PERIOD: CashStatementPeriod = {
  kind: 'BANK_DAY',
  location: 'CAJA',
  businessDate: '2099-06-01',
  dateFrom: '2099-06-01',
  dateTo: '2099-06-01',
  windowStart: new Date('2099-06-01T14:00:00Z'),
  windowEnd: null,
  startSequence: 10,
  endSequence: null,
  isCurrent: true,
  agentDayStatus: 'ABIERTO',
  openedByUsername: 'admin',
  anchorOpeningBalance: 5250,
  anchorSource: 'APERTURA',
};

function repository(): jest.Mocked<CashStatementRepository> {
  return {
    resolvePeriod: jest.fn().mockResolvedValue(PERIOD),
    getTotals: jest.fn().mockResolvedValue({
      openingBalance: 5250,
      totalIn: 1000,
      totalOut: 2000,
      movementCount: 3,
      kardexClosingBalance: 4250,
      lastMovement: null,
      toWarehouse: 1500,
      fromWarehouse: 0,
    }),
    findRows: jest.fn().mockResolvedValue({
      items: [
        {
          id: 'm1',
          sequence: 11,
          operationNumber: 'MOV-000011',
          createdAt: new Date('2099-06-01T15:00:00Z'),
          movementType: 'ENTRADA_MANUAL',
          originalMovementType: null,
          direction: 'IN',
          amount: 1000,
          previousBalance: 5250,
          newBalance: 6250,
          description: 'Entrada manual',
          beneficiary: null,
          reference: null,
          referenceType: null,
          referenceId: null,
          status: 'VIGENTE',
          voidedAt: null,
          voidReason: null,
          reversalOfId: null,
          username: 'admin',
          cutPeriodNumber: null,
        },
      ],
      total: 1,
      page: 1,
      limit: 50,
      filteredIn: 1000,
      filteredOut: 0,
    }),
    findCounts: jest.fn().mockResolvedValue([
      {
        id: 'k1',
        source: 'ARQUEO_CAJA',
        number: 'Arqueo de Caja #1',
        countedAt: new Date('2099-06-01T20:00:00Z'),
        sequence: 13,
        theoretical: 4250,
        counted: 4200,
        difference: -50,
        result: 'FALTANTE',
        status: 'VIGENTE',
        username: 'admin',
        observations: null,
      },
    ]),
    findPreviousCount: jest.fn().mockResolvedValue(null),
    countMovementsAfter: jest.fn().mockResolvedValue(0),
    findCuts: jest.fn().mockResolvedValue([]),
    getCustody: jest.fn().mockResolvedValue({ cash: 4250, warehouse: 4500 }),
    findDays: jest.fn().mockResolvedValue([]),
  };
}

describe('Estado de Cuenta de Efectivo — casos de uso', () => {
  it('managers get counts, cuts and custody; the summary follows the formula', async () => {
    const repo = repository();
    const out = await new GetCashStatementUseCase(repo).execute(admin, {});
    expect(out.summary).toMatchObject({
      theoreticalBalance: 4250,
      consistent: true,
      physical: { status: 'FALTANTE' },
    });
    expect(out.custody).toEqual({ cash: 4250, warehouse: 4500, total: 8750 });
    expect(out.canViewCustody).toBe(true);
    expect(repo.findRows).toHaveBeenCalledWith(
      PERIOD,
      expect.any(Object),
      1,
      50,
    );
  });

  it('a cashier sees the Kardex figures but never counts, differences, Bodega or custody', async () => {
    const repo = repository();
    const out = await new GetCashStatementUseCase(repo).execute(cashier, {});
    expect([out.counts, out.cuts, out.custody, out.summary.physical]).toEqual([
      null,
      null,
      null,
      null,
    ]);
    expect(out.summary.theoreticalBalance).toBe(4250);
    expect(repo.findCounts).not.toHaveBeenCalled();
    expect(repo.getCustody).not.toHaveBeenCalled();
    await expect(
      new GetCashStatementUseCase(repo).execute(cashier, {
        location: 'BODEGA',
      }),
    ).rejects.toMatchObject({ code: 'CASH_CUSTODY_FORBIDDEN' });
  });

  it('validates the period and reports an unknown bank day', async () => {
    const repo = repository();
    const useCase = new GetCashStatementUseCase(repo);
    await expect(
      useCase.execute(admin, { dateFrom: '2099-06-02', dateTo: '2099-06-01' }),
    ).rejects.toMatchObject({ code: 'CASH_STATEMENT_INVALID_RANGE' });
    await expect(
      useCase.execute(admin, { dateFrom: '2098-01-01', dateTo: '2099-06-01' }),
    ).rejects.toMatchObject({ code: 'CASH_STATEMENT_INVALID_RANGE' });
    await expect(
      useCase.execute(admin, {
        bankDate: '2099-06-01',
        dateFrom: '2099-06-01',
      }),
    ).rejects.toMatchObject({ code: 'CASH_STATEMENT_INVALID_RANGE' });
    repo.resolvePeriod.mockResolvedValueOnce(null);
    await expect(
      useCase.execute(admin, { bankDate: '2099-12-31' }),
    ).rejects.toMatchObject({
      code: 'CASH_STATEMENT_DAY_NOT_FOUND',
      status: 404,
    });
  });

  it('the history hides counts from users without custody permission', async () => {
    const repo = repository();
    await new ListCashStatementDaysUseCase(repo).execute(cashier, 10);
    expect(repo.findDays).toHaveBeenCalledWith(10, false);
    await new ListCashStatementDaysUseCase(repo).execute(admin);
    expect(repo.findDays).toHaveBeenLastCalledWith(30, true);
  });

  it('exports a PDF and an Excel file with the same figures', async () => {
    const repo = repository();
    const useCase = new ExportCashStatementUseCase(repo);
    const pdf = await useCase.execute(admin, {}, 'pdf');
    expect(pdf.contentType).toBe('application/pdf');
    expect(pdf.buffer.subarray(0, 4).toString()).toBe('%PDF');
    expect(pdf.filename).toBe('estado-cuenta-efectivo-caja-2099-06-01.pdf');
    const xlsx = await useCase.execute(cashier, {}, 'xlsx');
    expect(xlsx.buffer.subarray(0, 2).toString()).toBe('PK');
    // The export reads the whole period in one page (no counts for a cashier).
    expect(repo.findRows).toHaveBeenLastCalledWith(
      PERIOD,
      expect.any(Object),
      1,
      5000,
    );
  });

  it('labels the period like a bank statement', () => {
    expect(
      cashStatementPeriodLabel({
        ...PERIOD,
        windowEnd: null,
      }),
    ).toBe('Día bancario 01/06/2099 (en curso)');
    expect(
      cashStatementPeriodLabel({
        ...PERIOD,
        kind: 'RANGE',
        businessDate: null,
        dateFrom: '2099-06-01',
        dateTo: '2099-06-07',
      }),
    ).toBe('01/06/2099 – 07/06/2099');
  });
});
