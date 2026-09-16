import { NotFoundException } from '@nestjs/common';
import { GetPhoneSaleDpiImageUseCase } from './get-phone-sale-dpi-image.use-case';
import { PhoneSaleRepository } from '../../domain/repositories/phone-sale.repository';
import { PhoneSale } from '../../domain/entities/phone-sale.entity';
import { PhoneSaleNotFoundError } from '../../domain/errors/phone-sale-not-found.error';

function makeSale(hasDpiImage: boolean): PhoneSale {
  return PhoneSale.create({
    id: 'sale-1',
    phoneId: 'phone-1',
    phoneOperator: 'CLARO',
    phoneNumber: '12345678',
    phoneImei: '111111111111111',
    phoneCostPrice: 800,
    clientId: null,
    clientName: null,
    clientDpi: '1234567890101',
    salePrice: 1000,
    saleDate: '2026-09-15',
    hasDpiImage,
    isVoided: false,
    voidedAt: null,
    voidedBy: null,
    voidedByUsername: null,
    voidReason: null,
    createdBy: 'user-1',
    createdByUsername: 'erick',
    createdAt: new Date(),
  });
}

describe('GetPhoneSaleDpiImageUseCase', () => {
  let repository: jest.Mocked<PhoneSaleRepository>;
  let useCase: GetPhoneSaleDpiImageUseCase;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      voidSale: jest.fn(),
      getDpiImage: jest.fn(),
    };
    useCase = new GetPhoneSaleDpiImageUseCase(repository);
  });

  it('throws PhoneSaleNotFoundError when the sale does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toThrow(
      PhoneSaleNotFoundError,
    );
  });

  it('throws NotFoundException when the sale has no DPI image (optional photo)', async () => {
    repository.findById.mockResolvedValue(makeSale(false));
    repository.getDpiImage.mockResolvedValue(null);

    await expect(useCase.execute('sale-1')).rejects.toThrow(NotFoundException);
  });

  it('returns the image bytes when present', async () => {
    repository.findById.mockResolvedValue(makeSale(true));
    repository.getDpiImage.mockResolvedValue({
      data: Buffer.from('fake-image'),
      mimeType: 'image/jpeg',
    });

    const result = await useCase.execute('sale-1');
    expect(result.mimeType).toBe('image/jpeg');
  });
});
