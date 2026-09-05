import { Inject, Injectable } from '@nestjs/common';
import { ALERT_SETTINGS_REPOSITORY } from '../../domain/repositories/alert-settings.repository';
import type { AlertSettingsRepository } from '../../domain/repositories/alert-settings.repository';
import {
  AlertSettingsOutput,
  toAlertSettingsOutput,
} from '../dtos/alert-settings-output';

@Injectable()
export class GetAlertSettingsUseCase {
  constructor(
    @Inject(ALERT_SETTINGS_REPOSITORY)
    private readonly alertSettingsRepository: AlertSettingsRepository,
  ) {}

  async execute(): Promise<AlertSettingsOutput> {
    const settings = await this.alertSettingsRepository.get();
    return toAlertSettingsOutput(settings);
  }
}
