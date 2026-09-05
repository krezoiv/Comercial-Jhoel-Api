import { Inject, Injectable } from '@nestjs/common';
import { ALERT_SETTINGS_REPOSITORY } from '../../domain/repositories/alert-settings.repository';
import type { AlertSettingsRepository } from '../../domain/repositories/alert-settings.repository';
import { InvalidAlertSettingsError } from '../../domain/errors/invalid-alert-settings.error';
import {
  AlertSettingsOutput,
  toAlertSettingsOutput,
} from '../dtos/alert-settings-output';

export interface UpdateAlertSettingsInput {
  purchasePaymentAlertDays: number;
  updatedBy: string;
}

@Injectable()
export class UpdateAlertSettingsUseCase {
  constructor(
    @Inject(ALERT_SETTINGS_REPOSITORY)
    private readonly alertSettingsRepository: AlertSettingsRepository,
  ) {}

  async execute(input: UpdateAlertSettingsInput): Promise<AlertSettingsOutput> {
    if (
      !Number.isInteger(input.purchasePaymentAlertDays) ||
      input.purchasePaymentAlertDays < 0
    ) {
      throw new InvalidAlertSettingsError(
        'Los días de anticipación deben ser un número entero mayor o igual a cero.',
      );
    }

    const updated = await this.alertSettingsRepository.update({
      purchasePaymentAlertDays: input.purchasePaymentAlertDays,
      updatedBy: input.updatedBy,
    });
    return toAlertSettingsOutput(updated);
  }
}
