import { GetCompanySettingsUseCase } from './get-company-settings.use-case';
import { CompanySettingsRepository } from '../../domain/repositories/company-settings.repository';
import { CompanySettings } from '../../domain/entities/company-settings.entity';

describe('GetCompanySettingsUseCase', () => {
  it('returns the singleton settings row', async () => {
    const repository = {
      get: jest.fn().mockResolvedValue(
        CompanySettings.create({
          id: 'settings-1',
          businessName: 'Librería Jhoel',
          address: 'Zona 1',
          phone: '12345678',
          email: null,
          taxId: '123456-7',
          logoBase64: null,
          socialMedia: null,
          updatedAt: new Date('2026-09-01T00:00:00Z'),
          updatedBy: 'user-1',
          updatedByUsername: 'admin1',
        }),
      ),
    } as unknown as jest.Mocked<CompanySettingsRepository>;
    const useCase = new GetCompanySettingsUseCase(repository);

    const result = await useCase.execute();

    expect(result.businessName).toBe('Librería Jhoel');
    expect(result.taxId).toBe('123456-7');
    expect(result.updatedByUsername).toBe('admin1');
  });
});
