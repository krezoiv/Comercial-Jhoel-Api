import { VoidPhoneSaleUseCase } from './void-phone-sale.use-case';
import { PhoneSaleRepository } from '../../domain/repositories/phone-sale.repository';
import { PhoneSale } from '../../domain/entities/phone-sale.entity';
import { PhoneSaleAlreadyVoidedError } from '../../domain/errors/phone-sale-already-voided.error';

function makeVoidedSale(): PhoneSale {
  return PhoneSale.create({
    id: 'sale-1',
    phoneId: 'phone-1',
    phoneOperator: 'TIGO',
    phoneNumber: '87654321',
    phoneImei: '222222222222222',
    phoneCostPrice: 800,
    clientId: null,
    clientName: null,
    clientDpi: '1234567890101',
    salePrice: 1000,
    saleDate: '2026-09-15',
    hasDpiImage: false,
    isVoided: true,
    voidedAt: new Date(),
    voidedBy: 'admin-1',
    voidedByUsername: 'admin',
    voidReason: 'Error de digitación',
    createdBy: 'user-1',
    createdByUsername: 'erick',
    createdAt: new Date(),
  });
}

describe('VoidPhoneSaleUseCase', () => {
  let repository: jest.Mocked<PhoneSaleRepository>;
  let useCase: VoidPhoneSaleUseCase;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      voidSale: jest.fn(),
      getDpiImage: jest.fn(),
    };
    useCase = new VoidPhoneSaleUseCase(repository);
  });

  it('delegates to the repository and returns the voided sale', async () => {
    repository.voidSale.mockResolvedValue(makeVoidedSale());

    const result = await useCase.execute({
      id: 'sale-1',
      voidedBy: 'admin-1',
      reason: 'Error de digitación',
    });

    expect(repository.voidSale).toHaveBeenCalledWith(
      'sale-1',
      'admin-1',
      'Error de digitación',
    );
    expect(result.isVoided).toBe(true);
    expect(result.voidReason).toBe('Error de digitación');
  });

  it('propagates a domain error thrown by the repository (e.g. already voided)', async () => {
    repository.voidSale.mockRejectedValue(
      new PhoneSaleAlreadyVoidedError('sale-1'),
    );

    await expect(
      useCase.execute({ id: 'sale-1', voidedBy: 'admin-1', reason: 'motivo' }),
    ).rejects.toThrow(PhoneSaleAlreadyVoidedError);
  });
});
