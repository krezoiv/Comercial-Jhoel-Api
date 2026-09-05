import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanySettings } from '../../domain/entities/company-settings.entity';
import {
  CompanySettingsRepository,
  UpdateCompanySettingsData,
} from '../../domain/repositories/company-settings.repository';
import { CompanySettingsOrmEntity } from './company-settings.orm-entity';
import { CompanySettingsMapper } from './company-settings.mapper';

@Injectable()
export class TypeOrmCompanySettingsRepository
  implements CompanySettingsRepository
{
  constructor(
    @InjectRepository(CompanySettingsOrmEntity)
    private readonly repository: Repository<CompanySettingsOrmEntity>,
  ) {}

  async get(): Promise<CompanySettings> {
    const orm = await this.repository.findOne({ where: {} });
    if (!orm) {
      // The migration seeds exactly one row — this would only happen on a bug.
      throw new InternalServerErrorException(
        'No se encontró la configuración de la empresa.',
      );
    }
    return CompanySettingsMapper.toDomain(orm);
  }

  async update(data: UpdateCompanySettingsData): Promise<CompanySettings> {
    const current = await this.get();
    const patch: Partial<CompanySettingsOrmEntity> = { updatedBy: data.updatedBy };
    if (data.businessName !== undefined) patch.businessName = data.businessName;
    if (data.address !== undefined) patch.address = data.address;
    if (data.phone !== undefined) patch.phone = data.phone;
    if (data.email !== undefined) patch.email = data.email;
    if (data.taxId !== undefined) patch.taxId = data.taxId;
    if (data.logoBase64 !== undefined) patch.logoBase64 = data.logoBase64;
    if (data.socialMedia !== undefined) patch.socialMedia = data.socialMedia;

    await this.repository.update({ id: current.id }, patch);
    return this.get();
  }
}
