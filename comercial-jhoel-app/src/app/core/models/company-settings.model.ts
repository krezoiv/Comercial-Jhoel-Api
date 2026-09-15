/** The one, always-existing "datos de la librería" row — never created or deleted, only updated. */
export interface CompanySettings {
  id: string;
  businessName: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  taxId: string | null;
  logoBase64: string | null;
  socialMedia: string | null;
  /** Separado de `phone` a propósito — un negocio puede llamar a un número y atender WhatsApp en otro. */
  whatsapp: string | null;
  website: string | null;
  /** Texto libre multilínea, tal como el admin lo escribe — no un modelo estructurado día-por-día. */
  businessHours: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  updatedAt: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/** All fields optional — `PATCH /company-settings` merges only what's provided. */
export interface UpdateCompanySettingsPayload {
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
}

/**
 * `GET /company-info` — el subconjunto deliberadamente angosto de
 * `CompanySettings` que es seguro exponer sin autenticación en la landing
 * pública. Nunca incluye `taxId`/`logoBase64`/`socialMedia`(genérico)/
 * `id`/`updatedAt`/`updatedBy*` — ver el backend para el porqué exacto.
 */
export interface PublicCompanyInfo {
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
