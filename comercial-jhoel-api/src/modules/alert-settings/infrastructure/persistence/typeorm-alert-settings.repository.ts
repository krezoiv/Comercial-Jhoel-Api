import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertSettings } from '../../domain/entities/alert-settings.entity';
import {
  AlertSettingsRepository,
  UpdateAlertSettingsData,
} from '../../domain/repositories/alert-settings.repository';
import { AlertSettingsOrmEntity } from './alert-settings.orm-entity';
import { AlertSettingsMapper } from './alert-settings.mapper';

@Injectable()
export class TypeOrmAlertSettingsRepository implements AlertSettingsRepository {
  constructor(
    @InjectRepository(AlertSettingsOrmEntity)
    private readonly repository: Repository<AlertSettingsOrmEntity>,
  ) {}

  async get(): Promise<AlertSettings> {
    const orm = await this.repository.findOne({ where: {} });
    if (!orm) {
      // The migration seeds exactly one row — this would only happen on a bug.
      throw new InternalServerErrorException(
        'No se encontró la configuración de alertas.',
      );
    }
    return AlertSettingsMapper.toDomain(orm);
  }

  async update(data: UpdateAlertSettingsData): Promise<AlertSettings> {
    const current = await this.get();
    await this.repository.update(
      { id: current.id },
      {
        purchasePaymentAlertDays: data.purchasePaymentAlertDays,
        updatedBy: data.updatedBy,
      },
    );
    return this.get();
  }
}
