import { CreatePhoneUseCase } from './create-phone.use-case';
import { PhoneRepository } from '../../domain/repositories/phone.repository';
import { Phone } from '../../domain/entities/phone.entity';
import { ImeiAlreadyExistsError } from '../../domain/errors/imei-already-exists.error';
import { SimNumberAlreadyExistsError } from '../../domain/errors/sim-number-already-exists.error';

function makePhone(
  overrides: Partial<Parameters<typeof Phone.create>[0]> = {},
): Phone {
  return Phone.create({
    id: 'phone-1',
    operator: 'CLARO',
    model: 'Samsung Galaxy A15',
    phoneNumber: null,
    imei: '111111111111111',
    simNumber: '8950200000000000001',
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
      findBySimNumber: jest.fn(),
      create: jest.fn(),
    };
    useCase = new CreatePhoneUseCase(repository);
  });

  it('rejects a duplicate IMEI', async () => {
    repository.findByImei.mockResolvedValue(makePhone());

    await expect(
      useCase.execute({
        operator: 'CLARO',
        model: 'Samsung Galaxy A15',
        imei: '111111111111111',
        simNumber: '8950200000000000002',
        costPrice: 800,
        publicPrice: 1000,
        purchaseDate: '2026-09-15',
        userId: 'user-1',
      }),
    ).rejects.toThrow(ImeiAlreadyExistsError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('rejects a duplicate SIM number', async () => {
    repository.findByImei.mockResolvedValue(null);
    repository.findBySimNumber.mockResolvedValue(makePhone());

    await expect(
      useCase.execute({
        operator: 'TIGO',
        model: 'Samsung Galaxy A15',
        imei: '222222222222222',
        simNumber: '8950200000000000001',
        costPrice: 800,
        publicPrice: 1000,
        purchaseDate: '2026-09-15',
        userId: 'user-1',
      }),
    ).rejects.toThrow(SimNumberAlreadyExistsError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('creates a phone with trimmed model/imei/simNumber, no phoneNumber, when both are free', async () => {
    repository.findByImei.mockResolvedValue(null);
    repository.findBySimNumber.mockResolvedValue(null);
    repository.create.mockResolvedValue(makePhone());

    const result = await useCase.execute({
      operator: 'CLARO',
      model: ' Samsung Galaxy A15 ',
      imei: ' 111111111111111 ',
      simNumber: ' 8950200000000000001 ',
      costPrice: 800,
      publicPrice: 1000,
      purchaseDate: '2026-09-15',
      userId: 'user-1',
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'Samsung Galaxy A15',
        imei: '111111111111111',
        simNumber: '8950200000000000001',
      }),
    );
    expect(repository.create.mock.calls[0][0]).not.toHaveProperty(
      'phoneNumber',
    );
    expect(result.status).toBe('DISPONIBLE');
    expect(result.phoneNumber).toBeNull();
  });
});
