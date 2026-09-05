import { Inject, Injectable } from '@nestjs/common';
import { ALERT_READ_MARK_REPOSITORY } from '../../domain/repositories/alert-read-mark.repository';
import type { AlertReadMarkRepository } from '../../domain/repositories/alert-read-mark.repository';

export interface MarkAlertReadInput {
  userId: string;
  key: string;
}

/**
 * A no-op if the alert no longer exists or was already read — read-marks are
 * intentionally decoupled from whether the alert is currently active (see
 * `AlertReadMarkOrmEntity`'s `CASCADE` FK doc comment): opening an alert and
 * then having its condition resolve before the mark is written is harmless,
 * the row just becomes an inert leftover no future `findReadKeys` call will
 * ever match against.
 */
@Injectable()
export class MarkAlertReadUseCase {
  constructor(
    @Inject(ALERT_READ_MARK_REPOSITORY)
    private readonly alertReadMarkRepository: AlertReadMarkRepository,
  ) {}

  async execute(input: MarkAlertReadInput): Promise<void> {
    await this.alertReadMarkRepository.markRead(input.userId, input.key);
  }
}
