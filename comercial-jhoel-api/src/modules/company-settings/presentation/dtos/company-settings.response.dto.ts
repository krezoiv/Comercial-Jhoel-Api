export class CompanySettingsResponseDto {
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
