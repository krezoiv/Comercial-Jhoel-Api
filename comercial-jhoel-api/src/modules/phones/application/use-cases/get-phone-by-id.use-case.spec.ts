import { GetPhoneByIdUseCase } from './get-phone-by-id.use-case';
import { PhoneRepository } from '../../domain/repositories/phone.repository';
import { Phone } from '../../domain/entities/phone.entity';
import { PhoneNotFoundError } from '../../domain/errors/phone-not-found.error';

describe('GetPhoneByIdUseCase', () => {
  let repository: jest.Mocked<PhoneRepository>;
  let useCase: GetPhoneByIdUseCase;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByImei: jest.fn(),
      findBySimNumber: jest.fn(),
      create: jest.fn(),
    };
    useCase = new GetPhoneByIdUseCase(repository);
  });

  it('throws PhoneNotFoundError when the phone does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toThrow(
      PhoneNotFoundError,
    );
  });

  it('returns the mapped output when found', async () => {
    repository.findById.mockResolvedValue(
      Phone.create({
        id: 'phone-1',
        operator: 'CLARO',
        model: 'Samsung Galaxy A15',
        phoneNumber: '12345678',
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
      }),
    );

    const result = await useCase.execute('phone-1');
    expect(result.id).toBe('phone-1');
    expect(result.operator).toBe('CLARO');
  });
});
