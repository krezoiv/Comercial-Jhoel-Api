import { CompanySettings } from '../../domain/entities/company-settings.entity';
import { CompanySettingsOrmEntity } from './company-settings.orm-entity';

export class CompanySettingsMapper {
  static toDomain(orm: CompanySettingsOrmEntity): CompanySettings {
    return CompanySettings.create({
      id: orm.id,
      businessName: orm.businessName,
      address: orm.address,
      phone: orm.phone,
      email: orm.email,
      taxId: orm.taxId,
      logoBase64: orm.logoBase64,
      socialMedia: orm.socialMedia,
      updatedAt: orm.updatedAt,
      updatedBy: orm.updatedBy,
      updatedByUsername: orm.updatedByUser?.username ?? null,
    });
  }
}
