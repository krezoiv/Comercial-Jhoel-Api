export class CompanySettingsResponseDto {
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
