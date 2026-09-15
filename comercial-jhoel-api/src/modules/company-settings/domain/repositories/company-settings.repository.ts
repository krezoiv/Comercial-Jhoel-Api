import { CompanySettings } from '../entities/company-settings.entity';

export const COMPANY_SETTINGS_REPOSITORY = Symbol(
  'COMPANY_SETTINGS_REPOSITORY',
);

export interface UpdateCompanySettingsData {
  businessName?: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  taxId?: string | null;
  logoBase64?: string | null;
  socialMedia?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  businessHours?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  updatedBy: string;
}

export interface CompanySettingsRepository {
  /** Always returns the one existing row — the table is a singleton, seeded by migration. */
  get(): Promise<CompanySettings>;
  /** Merge semantics — only the fields present on `data` are changed. */
  update(data: UpdateCompanySettingsData): Promise<CompanySettings>;
}
