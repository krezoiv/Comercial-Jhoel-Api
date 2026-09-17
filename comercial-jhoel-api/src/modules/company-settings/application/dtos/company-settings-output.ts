import { CompanySettings } from '../../domain/entities/company-settings.entity';

export interface CompanySettingsOutput {
  businessName: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  taxId: string | null;
  logoBase64: string | null;
  socialMedia: string | null;
  whatsapp: string | null;
  website: string | null;
  businessHours: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  krediyaMinAmount: number | null;
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
    whatsapp: settings.whatsapp,
    website: settings.website,
    businessHours: settings.businessHours,
    facebookUrl: settings.facebookUrl,
    instagramUrl: settings.instagramUrl,
    tiktokUrl: settings.tiktokUrl,
    krediyaMinAmount: settings.krediyaMinAmount,
    updatedAt: settings.updatedAt,
    updatedByUsername: settings.updatedByUsername,
  };
}
