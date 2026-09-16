import { RegisterPhoneSaleUseCase } from './register-phone-sale.use-case';
import { PhoneSaleRepository } from '../../domain/repositories/phone-sale.repository';
import { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { PhoneSale } from '../../domain/entities/phone-sale.entity';
import { Client } from '../../../clients/domain/entities/client.entity';
import { InvalidPhoneSaleClientError } from '../../domain/errors/invalid-phone-sale-client.error';
import { InvalidDpiImageError } from '../../domain/errors/invalid-dpi-image.error';

function makeSale(
  overrides: Partial<Parameters<typeof PhoneSale.create>[0]> = {},
): PhoneSale {
  return PhoneSale.create({
    id: 'sale-1',
    phoneId: 'phone-1',
    phoneOperator: 'CLARO',
    phoneModel: 'Samsung Galaxy A15',
    phoneNumber: '12345678',
    phoneImei: '111111111111111',
    phoneSimNumber: '8950200000000000001',
    phoneCostPrice: 800,
    clientId: null,
    clientName: null,
    clientDpi: '1234567890101',
    salePrice: 1000,
    saleDate: '2026-09-15',
    hasDpiImage: false,
    isVoided: false,
    voidedAt: null,
    voidedBy: null,
    voidedByUsername: null,
    voidReason: null,
    createdBy: 'user-1',
    createdByUsername: 'erick',
    createdAt: new Date(),
    ...overrides,
  });
}

function makeClient(isActive: boolean): Client {
  return Client.create({
    id: 'client-1',
    name: 'Juan Pérez',
    isActive,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
    createdByUsername: 'erick',
    updatedBy: null,
    updatedByUsername: null,
  });
}

describe('RegisterPhoneSaleUseCase', () => {
  let phoneSaleRepository: jest.Mocked<PhoneSaleRepository>;
  let clientRepository: jest.Mocked<ClientRepository>;
  let useCase: RegisterPhoneSaleUseCase;

  beforeEach(() => {
    phoneSaleRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      voidSale: jest.fn(),
      getDpiImage: jest.fn(),
    };
    clientRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByActiveName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deactivate: jest.fn(),
    };
    useCase = new RegisterPhoneSaleUseCase(
      phoneSaleRepository,
      clientRepository,
    );
  });

  it('rejects an oversized DPI image before ever touching the repository', async () => {
    await expect(
      useCase.execute({
        phoneId: 'phone-1',
        clientId: null,
        clientDpi: '1234567890101',
        phoneNumber: '12345678',
        saleDate: '2026-09-15',
        userId: 'user-1',
        dpiImage: {
          buffer: Buffer.alloc(1),
          mimetype: 'image/jpeg',
          size: 6 * 1024 * 1024,
        },
      }),
    ).rejects.toThrow(InvalidDpiImageError);
    expect(phoneSaleRepository.create).not.toHaveBeenCalled();
  });

  it('rejects a sale to an inactive client', async () => {
    clientRepository.findById.mockResolvedValue(makeClient(false));

    await expect(
      useCase.execute({
        phoneId: 'phone-1',
        clientId: 'client-1',
        clientDpi: '1234567890101',
        phoneNumber: '12345678',
        saleDate: '2026-09-15',
        userId: 'user-1',
        dpiImage: null,
      }),
    ).rejects.toThrow(InvalidPhoneSaleClientError);
    expect(phoneSaleRepository.create).not.toHaveBeenCalled();
  });

  it('rejects a sale to a nonexistent client', async () => {
    clientRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        phoneId: 'phone-1',
        clientId: 'client-1',
        clientDpi: '1234567890101',
        phoneNumber: '12345678',
        saleDate: '2026-09-15',
        userId: 'user-1',
        dpiImage: null,
      }),
    ).rejects.toThrow(InvalidPhoneSaleClientError);
  });

  it('registers a sale with no client and no DPI image (both optional), passing phoneNumber through and never a price', async () => {
    phoneSaleRepository.create.mockResolvedValue(makeSale());

    const result = await useCase.execute({
      phoneId: 'phone-1',
      clientId: null,
      clientDpi: '1234567890101',
      phoneNumber: '12345678',
      saleDate: '2026-09-15',
      userId: 'user-1',
      dpiImage: null,
    });

    expect(clientRepository.findById).not.toHaveBeenCalled();
    expect(phoneSaleRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: null,
        dpiImage: null,
        phoneNumber: '12345678',
      }),
    );
    expect(phoneSaleRepository.create.mock.calls[0][0]).not.toHaveProperty(
      'salePrice',
    );
    expect(result.profit).toBe(200);
  });

  it('computes profit from the server-returned salePrice/phoneCostPrice — never from a caller-supplied price', async () => {
    phoneSaleRepository.create.mockResolvedValue(
      makeSale({ salePrice: 1200, phoneCostPrice: 800 }),
    );

    const result = await useCase.execute({
      phoneId: 'phone-1',
      clientId: null,
      clientDpi: '1234567890101',
      phoneNumber: '12345678',
      saleDate: '2026-09-15',
      userId: 'user-1',
      dpiImage: null,
    });

    expect(result.salePrice).toBe(1200);
    expect(result.profit).toBe(400);
  });
});
