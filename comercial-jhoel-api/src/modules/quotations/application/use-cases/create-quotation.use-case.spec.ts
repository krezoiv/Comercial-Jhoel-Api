import { CreateQuotationUseCase } from './create-quotation.use-case';
import { QuotationRepository } from '../../domain/repositories/quotation.repository';
import { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { QuotationEmptyError } from '../../domain/errors/quotation-empty.error';
import { InvalidQuotationQuantityError } from '../../domain/errors/invalid-quotation-quantity.error';
import { InvalidClientError } from '../../domain/errors/invalid-client.error';
import { InvalidExpirationDateError } from '../../domain/errors/invalid-expiration-date.error';
import { Quotation } from '../../domain/entities/quotation.entity';
import { Client } from '../../../clients/domain/entities/client.entity';
import { todayIsoDate } from '../utils/today-iso-date';

function makeQuotation(): Quotation {
  return Quotation.create({
    id: 'quotation-1',
    quotationNumber: 'COT-000001',
    clientId: 'client-1',
    clientName: 'Cliente de Prueba',
    userId: 'user-1',
    username: 'cajero1',
    quotationDate: new Date('2026-09-01T00:00:00Z'),
    expirationDate: '2026-09-10',
    subtotal: 10,
    discount: 0,
    total: 10,
    observations: null,
    commercialTerms: null,
    status: 'PENDIENTE',
    voidedAt: null,
    voidedBy: null,
    voidedByUsername: null,
    voidReason: null,
    convertedToSaleId: null,
    items: [],
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-09-01T00:00:00Z'),
  });
}

function makeClient(isActive: boolean): Client {
  return Client.create({
    id: 'client-1',
    name: 'Cliente de Prueba',
    isActive,
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-09-01T00:00:00Z'),
    createdBy: 'admin-1',
    createdByUsername: 'admin1',
    updatedBy: null,
    updatedByUsername: null,
  });
}

describe('CreateQuotationUseCase', () => {
  let quotationRepository: jest.Mocked<QuotationRepository>;
  let clientRepository: jest.Mocked<ClientRepository>;
  let useCase: CreateQuotationUseCase;
  const futureDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  })();

  beforeEach(() => {
    quotationRepository = {
      createQuotation: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      voidQuotation: jest.fn(),
    } as unknown as jest.Mocked<QuotationRepository>;
    clientRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByActiveName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deactivate: jest.fn(),
    } as unknown as jest.Mocked<ClientRepository>;
    useCase = new CreateQuotationUseCase(quotationRepository, clientRepository);
  });

  it('throws QuotationEmptyError when items is empty', async () => {
    clientRepository.findById.mockResolvedValue(makeClient(true));

    await expect(
      useCase.execute({
        userId: 'user-1',
        clientId: 'client-1',
        expirationDate: futureDate,
        items: [],
      }),
    ).rejects.toThrow(QuotationEmptyError);
    expect(quotationRepository.createQuotation).not.toHaveBeenCalled();
  });

  it('throws InvalidClientError when the client does not exist', async () => {
    clientRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: 'user-1',
        clientId: 'missing-client',
        expirationDate: futureDate,
        items: [{ productId: 'product-1', quantity: 1 }],
      }),
    ).rejects.toThrow(InvalidClientError);
    expect(quotationRepository.createQuotation).not.toHaveBeenCalled();
  });

  it('throws InvalidClientError when the client is inactive', async () => {
    clientRepository.findById.mockResolvedValue(makeClient(false));

    await expect(
      useCase.execute({
        userId: 'user-1',
        clientId: 'client-1',
        expirationDate: futureDate,
        items: [{ productId: 'product-1', quantity: 1 }],
      }),
    ).rejects.toThrow(InvalidClientError);
  });

  it('throws InvalidExpirationDateError when the date is before today', async () => {
    clientRepository.findById.mockResolvedValue(makeClient(true));

    await expect(
      useCase.execute({
        userId: 'user-1',
        clientId: 'client-1',
        expirationDate: '2000-01-01',
        items: [{ productId: 'product-1', quantity: 1 }],
      }),
    ).rejects.toThrow(InvalidExpirationDateError);
    expect(quotationRepository.createQuotation).not.toHaveBeenCalled();
  });

  it('accepts an expiration date equal to today', async () => {
    clientRepository.findById.mockResolvedValue(makeClient(true));
    quotationRepository.createQuotation.mockResolvedValue(makeQuotation());

    await useCase.execute({
      userId: 'user-1',
      clientId: 'client-1',
      expirationDate: todayIsoDate(),
      items: [{ productId: 'product-1', quantity: 1 }],
    });

    expect(quotationRepository.createQuotation).toHaveBeenCalled();
  });

  it('throws InvalidQuotationQuantityError for a non-positive quantity', async () => {
    clientRepository.findById.mockResolvedValue(makeClient(true));

    await expect(
      useCase.execute({
        userId: 'user-1',
        clientId: 'client-1',
        expirationDate: futureDate,
        items: [{ productId: 'product-1', quantity: 0 }],
      }),
    ).rejects.toThrow(InvalidQuotationQuantityError);
    expect(quotationRepository.createQuotation).not.toHaveBeenCalled();
  });

  it('merges duplicate product lines by summing quantities and discounts', async () => {
    clientRepository.findById.mockResolvedValue(makeClient(true));
    quotationRepository.createQuotation.mockResolvedValue(makeQuotation());

    await useCase.execute({
      userId: 'user-1',
      clientId: 'client-1',
      expirationDate: futureDate,
      items: [
        { productId: 'product-1', quantity: 2, discount: 1 },
        { productId: 'product-1', quantity: 3, discount: 2 },
      ],
    });

    expect(quotationRepository.createQuotation).toHaveBeenCalledWith({
      userId: 'user-1',
      clientId: 'client-1',
      expirationDate: futureDate,
      observations: null,
      commercialTerms: null,
      items: [{ productId: 'product-1', quantity: 5, discount: 3 }],
    });
  });
});
