import { VoidQuotationUseCase } from './void-quotation.use-case';
import { QuotationRepository } from '../../domain/repositories/quotation.repository';
import { QuotationNotFoundError } from '../../domain/errors/quotation-not-found.error';
import { QuotationAlreadyVoidedError } from '../../domain/errors/quotation-already-voided.error';
import {
  Quotation,
  QuotationStoredStatus,
} from '../../domain/entities/quotation.entity';

function makeQuotation(status: QuotationStoredStatus): Quotation {
  const isVoided = status === 'CANCELADA';
  return Quotation.create({
    id: 'quotation-1',
    quotationNumber: 'COT-000001',
    clientId: 'client-1',
    clientName: 'Cliente de Prueba',
    userId: 'user-1',
    username: 'cajero1',
    quotationDate: new Date('2026-09-01T00:00:00Z'),
    expirationDate: '2026-09-10',
    subtotal: 100,
    discount: 0,
    total: 100,
    observations: null,
    commercialTerms: null,
    status,
    voidedAt: isVoided ? new Date('2026-09-01T00:00:00Z') : null,
    voidedBy: isVoided ? 'admin-1' : null,
    voidedByUsername: isVoided ? 'admin1' : null,
    voidReason: isVoided ? 'Error de registro' : null,
    convertedToSaleId: null,
    customerPhone: null,
    studentName: null,
    grade: null,
    acceptedAt: null,
    rejectedAt: null,
    rejectReason: null,
    soldAt: null,
    soldByUsername: null,
    items: [],
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-09-01T00:00:00Z'),
  });
}

describe('VoidQuotationUseCase', () => {
  let repository: jest.Mocked<QuotationRepository>;
  let useCase: VoidQuotationUseCase;

  beforeEach(() => {
    repository = {
      createQuotation: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      changeStatus: jest.fn(),
    } as unknown as jest.Mocked<QuotationRepository>;
    useCase = new VoidQuotationUseCase(repository);
  });

  it('throws QuotationNotFoundError when the quotation does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 'missing', voidedBy: 'admin-1', reason: 'x' }),
    ).rejects.toThrow(QuotationNotFoundError);
    expect(repository.changeStatus).not.toHaveBeenCalled();
  });

  it('throws QuotationAlreadyVoidedError when the quotation is already CANCELADA', async () => {
    repository.findById.mockResolvedValue(makeQuotation('CANCELADA'));

    await expect(
      useCase.execute({
        id: 'quotation-1',
        voidedBy: 'admin-1',
        reason: 'x',
      }),
    ).rejects.toThrow(QuotationAlreadyVoidedError);
    expect(repository.changeStatus).not.toHaveBeenCalled();
  });

  it('cancels a COTIZADA quotation with the given reason', async () => {
    repository.findById.mockResolvedValue(makeQuotation('COTIZADA'));
    repository.changeStatus.mockResolvedValue(makeQuotation('CANCELADA'));

    const result = await useCase.execute({
      id: 'quotation-1',
      voidedBy: 'admin-1',
      reason: 'Error de registro',
    });

    expect(repository.changeStatus).toHaveBeenCalledWith(
      'quotation-1',
      'CANCELAR',
      'admin-1',
      'Error de registro',
    );
    expect(result.status).toBe('CANCELADA');
  });
});
