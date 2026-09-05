import { AlertSettings } from '../entities/alert-settings.entity';

export const ALERT_SETTINGS_REPOSITORY = Symbol('ALERT_SETTINGS_REPOSITORY');

export interface UpdateAlertSettingsData {
  purchasePaymentAlertDays: number;
  updatedBy: string;
}

export interface AlertSettingsRepository {
  /** Always returns the one existing row — the table is a singleton, seeded by migration. */
  get(): Promise<AlertSettings>;
  update(data: UpdateAlertSettingsData): Promise<AlertSettings>;
}
