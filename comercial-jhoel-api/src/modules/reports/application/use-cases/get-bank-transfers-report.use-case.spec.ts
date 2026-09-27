import {
  GetBankTransfersReportSummaryUseCase,
  GetBankTransfersReportUseCase,
} from './get-bank-transfers-report.use-case';
import { BankMovementRepository } from '../../../banks/domain/repositories/bank-movement.repository';
import { InvalidBankMovementDateRangeError } from '../../../banks/domain/errors/bank-movement.errors';

function mockRepository() {
  return {
    findTransfers: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0, page: 1, limit: 20 }),
    getTransfersSummary: jest.fn().mockResolvedValue({
      transferCount: 0,
      totalAmount: 0,
      voidedCount: 0,
      voidedAmount: 0,
      byRoute: [],
    }),
  } as unknown as jest.Mocked<BankMovementRepository>;
}

describe('GetBankTransfersReportUseCase', () => {
  it('rechaza un rango de fechas invertido', async () => {
    const repository = mockRepository();
    await expect(
      new GetBankTransfersReportUseCase(repository).execute({
        startDate: '2026-09-10',
        endDate: '2026-09-01',
      }),
    ).rejects.toThrow(InvalidBankMovementDateRangeError);
    expect(repository.findTransfers).not.toHaveBeenCalled();
  });

  it('pasa solo los filtros del reporte, con paginación por defecto', async () => {
    const repository = mockRepository();
    await new GetBankTransfersReportUseCase(repository).execute({
      startDate: '2026-09-01',
      endDate: '2026-09-30',
      sourceBankId: 'origen',
      destinationBankId: 'destino',
      userId: 'usuario',
      status: 'ANULADO',
    });
    expect(repository.findTransfers).toHaveBeenCalledWith(
      {
        startDate: '2026-09-01',
        endDate: '2026-09-30',
        sourceBankId: 'origen',
        destinationBankId: 'destino',
        userId: 'usuario',
        status: 'ANULADO',
      },
      1,
      20,
    );
  });

  it('respeta página y límite', async () => {
    const repository = mockRepository();
    await new GetBankTransfersReportUseCase(repository).execute({
      page: 3,
      limit: 50,
    });
    expect(repository.findTransfers).toHaveBeenCalledWith(
      expect.any(Object),
      3,
      50,
    );
  });
});

describe('GetBankTransfersReportSummaryUseCase', () => {
  it('rechaza un rango de fechas invertido', async () => {
    const repository = mockRepository();
    await expect(
      new GetBankTransfersReportSummaryUseCase(repository).execute({
        startDate: '2026-09-10',
        endDate: '2026-09-01',
      }),
    ).rejects.toThrow(InvalidBankMovementDateRangeError);
  });

  it('delegates en el resumen del repositorio con los mismos filtros', async () => {
    const repository = mockRepository();
    await new GetBankTransfersReportSummaryUseCase(repository).execute({
      sourceBankId: 'x',
      page: 2,
    });
    expect(repository.getTransfersSummary).toHaveBeenCalledWith(
      expect.objectContaining({ sourceBankId: 'x' }),
    );
  });
});
