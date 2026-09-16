import { CreatePhoneUseCase } from './create-phone.use-case';
import { PhoneRepository } from '../../domain/repositories/phone.repository';
import { Phone } from '../../domain/entities/phone.entity';
import { ImeiAlreadyExistsError } from '../../domain/errors/imei-already-exists.error';
import { PhoneNumberAlreadyExistsError } from '../../domain/errors/phone-number-already-exists.error';

function makePhone(
  overrides: Partial<Parameters<typeof Phone.create>[0]> = {},
): Phone {
  return Phone.create({
    id: 'phone-1',
    operator: 'CLARO',
    phoneNumber: '12345678',
    imei: '111111111111111',
    costPrice: 800,
    publicPrice: 1000,
    status: 'DISPONIBLE',
    purchaseDate: '2026-09-15',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
    createdByUsername: 'erick',
    updatedBy: null,
    updatedByUsername: null,
    ...overrides,
  });
}

describe('CreatePhoneUseCase', () => {
  let repository: jest.Mocked<PhoneRepository>;
  let useCase: CreatePhoneUseCase;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByImei: jest.fn(),
      findAvailableByPhoneNumber: jest.fn(),
      create: jest.fn(),
    };
    useCase = new CreatePhoneUseCase(repository);
  });

  it('rejects a duplicate IMEI', async () => {
    repository.findByImei.mockResolvedValue(makePhone());

    await expect(
      useCase.execute({
        operator: 'CLARO',
        phoneNumber: '87654321',
        imei: '111111111111111',
        costPrice: 800,
        publicPrice: 1000,
        purchaseDate: '2026-09-15',
        userId: 'user-1',
      }),
    ).rejects.toThrow(ImeiAlreadyExistsError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('rejects a phone number already claimed by a DISPONIBLE unit', async () => {
    repository.findByImei.mockResolvedValue(null);
    repository.findAvailableByPhoneNumber.mockResolvedValue(makePhone());

    await expect(
      useCase.execute({
        operator: 'TIGO',
        phoneNumber: '12345678',
        imei: '222222222222222',
        costPrice: 800,
        publicPrice: 1000,
        purchaseDate: '2026-09-15',
        userId: 'user-1',
      }),
    ).rejects.toThrow(PhoneNumberAlreadyExistsError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('creates a phone with trimmed imei/phoneNumber when both are free', async () => {
    repository.findByImei.mockResolvedValue(null);
    repository.findAvailableByPhoneNumber.mockResolvedValue(null);
    repository.create.mockResolvedValue(makePhone());

    const result = await useCase.execute({
      operator: 'CLARO',
      phoneNumber: ' 12345678 ',
      imei: ' 111111111111111 ',
      costPrice: 800,
      publicPrice: 1000,
      purchaseDate: '2026-09-15',
      userId: 'user-1',
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        phoneNumber: '12345678',
        imei: '111111111111111',
      }),
    );
    expect(result.status).toBe('DISPONIBLE');
  });
});
