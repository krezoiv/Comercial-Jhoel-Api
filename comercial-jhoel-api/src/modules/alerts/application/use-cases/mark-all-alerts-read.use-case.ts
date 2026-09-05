import { Inject, Injectable } from '@nestjs/common';
import { ALERT_READ_MARK_REPOSITORY } from '../../domain/repositories/alert-read-mark.repository';
import type { AlertReadMarkRepository } from '../../domain/repositories/alert-read-mark.repository';
import { GetAlertsUseCase } from './get-alerts.use-case';

export interface MarkAllAlertsReadInput {
  userId: string;
  isAdmin: boolean;
}

/**
 * Marks every alert CURRENTLY active for this caller as read — depends on
 * `GetAlertsUseCase` to compute exactly that same set (same ownership
 * scoping) rather than re-deriving it, so "read-all" can never drift from
 * what the panel just showed the user.
 */
@Injectable()
export class MarkAllAlertsReadUseCase {
  constructor(
    @Inject(ALERT_READ_MARK_REPOSITORY)
    private readonly alertReadMarkRepository: AlertReadMarkRepository,
    private readonly getAlertsUseCase: GetAlertsUseCase,
  ) {}

  async execute(input: MarkAllAlertsReadInput): Promise<void> {
    const alerts = await this.getAlertsUseCase.execute(input);
    await this.alertReadMarkRepository.markAllRead(
      input.userId,
      alerts.items.map((item) => item.key),
    );
  }
}
