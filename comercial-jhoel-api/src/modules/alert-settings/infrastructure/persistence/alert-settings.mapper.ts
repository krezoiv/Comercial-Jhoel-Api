import { AlertSettings } from '../../domain/entities/alert-settings.entity';
import { AlertSettingsOrmEntity } from './alert-settings.orm-entity';

export class AlertSettingsMapper {
  static toDomain(orm: AlertSettingsOrmEntity): AlertSettings {
    return AlertSettings.create({
      id: orm.id,
      purchasePaymentAlertDays: orm.purchasePaymentAlertDays,
      updatedAt: orm.updatedAt,
      updatedBy: orm.updatedBy,
      updatedByUsername: orm.updatedByUser?.username ?? null,
    });
  }
}
