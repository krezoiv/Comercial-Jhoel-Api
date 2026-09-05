import { AlertSettings } from '../../domain/entities/alert-settings.entity';

export interface AlertSettingsOutput {
  purchasePaymentAlertDays: number;
  updatedAt: Date;
  updatedByUsername: string | null;
}

export function toAlertSettingsOutput(
  settings: AlertSettings,
): AlertSettingsOutput {
  return {
    purchasePaymentAlertDays: settings.purchasePaymentAlertDays,
    updatedAt: settings.updatedAt,
    updatedByUsername: settings.updatedByUsername,
  };
}
