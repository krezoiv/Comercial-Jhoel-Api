import { UpdateCompanySettingsUseCase } from './update-company-settings.use-case';
import { CompanySettingsRepository } from '../../domain/repositories/company-settings.repository';
import { CompanySettings } from '../../domain/entities/company-settings.entity';

describe('UpdateCompanySettingsUseCase', () => {
  it('merges only the provided fields via the repository', async () => {
    const repository = {
      update: jest.fn().mockResolvedValue(
        CompanySettings.create({
          id: 'settings-1',
          businessName: 'Librería Jhoel',
          address: null,
          phone: '12345678',
          email: null,
          taxId: null,
          logoBase64: null,
          socialMedia: null,
          updatedAt: new Date('2026-09-01T00:00:00Z'),
          updatedBy: 'user-1',
          updatedByUsername: 'admin1',
        }),
      ),
    } as unknown as jest.Mocked<CompanySettingsRepository>;
    const useCase = new UpdateCompanySettingsUseCase(repository);

    const result = await useCase.execute({
      businessName: 'Librería Jhoel',
      phone: '12345678',
      updatedBy: 'user-1',
    });

    expect(repository.update).toHaveBeenCalledWith({
      businessName: 'Librería Jhoel',
      phone: '12345678',
      updatedBy: 'user-1',
    });
    expect(result.businessName).toBe('Librería Jhoel');
    expect(result.phone).toBe('12345678');
  });
});
