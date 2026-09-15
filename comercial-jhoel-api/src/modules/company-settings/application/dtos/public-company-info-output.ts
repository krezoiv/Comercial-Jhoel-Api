import { CompanySettings } from '../../domain/entities/company-settings.entity';

/**
 * Deliberately narrow — backs the PUBLIC landing page's "Contacto"
 * section. Excludes `id`, `taxId`, `logoBase64` (sensitive/heavy),
 * `socialMedia` (the older generic free-text field, superseded here by
 * the structured `facebookUrl`/`instagramUrl`/`tiktokUrl`), and
 * `updatedAt`/`updatedBy*` (internal bookkeeping) — nothing administrative
 * ever leaves this shape.
 */
export interface PublicCompanyInfoOutput {
  businessName: string;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  businessHours: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
}

export function toPublicCompanyInfoOutput(
  settings: CompanySettings,
): PublicCompanyInfoOutput {
  return {
    businessName: settings.businessName,
    address: settings.address,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    website: settings.website,
    businessHours: settings.businessHours,
    facebookUrl: settings.facebookUrl,
    instagramUrl: settings.instagramUrl,
    tiktokUrl: settings.tiktokUrl,
  };
}
