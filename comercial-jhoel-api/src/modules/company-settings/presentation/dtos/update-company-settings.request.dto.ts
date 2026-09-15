import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCompanySettingsRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  businessName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string | null;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  taxId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(5_000_000)
  logoBase64?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  socialMedia?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  whatsapp?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  website?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  businessHours?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  facebookUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  instagramUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  tiktokUrl?: string | null;
}
