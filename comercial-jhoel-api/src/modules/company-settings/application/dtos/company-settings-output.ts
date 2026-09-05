import { CompanySettings } from '../../domain/entities/company-settings.entity';

export interface CompanySettingsOutput {
  businessName: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  taxId: string | null;
  logoBase64: string | null;
  socialMedia: string | null;
  updatedAt: Date;
  updatedByUsername: string | null;
}

export function toCompanySettingsOutput(
  settings: CompanySettings,
): CompanySettingsOutput {
  return {
    businessName: settings.businessName,
    address: settings.address,
    phone: settings.phone,
    email: settings.email,
    taxId: settings.taxId,
    logoBase64: settings.logoBase64,
    socialMedia: settings.socialMedia,
    updatedAt: settings.updatedAt,
    updatedByUsername: settings.updatedByUsername,
  };
}
