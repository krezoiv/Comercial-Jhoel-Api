import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAY_OPENING_REPOSITORY } from '../../domain/repositories/recharge-day-opening.repository';
import type {
  RechargeClosedDaysFilters,
  RechargeDayOpeningRepository,
} from '../../domain/repositories/recharge-day-opening.repository';
import { RechargeClosedDayOutput, toRechargeClosedDayOutput } from '../dtos/recharge-closed-day-output';

/** "Sistema → Gestión de Días de Recargas" — administrative listing, ADMIN/SUPER_ADMIN only (see the controller). */
@Injectable()
export class ListClosedRechargeDaysUseCase {
  constructor(
    @Inject(RECHARGE_DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: RechargeDayOpeningRepository,
  ) {}

  async execute(filters: RechargeClosedDaysFilters): Promise<RechargeClosedDayOutput[]> {
    const rows = await this.dayOpeningRepository.findClosedDays(filters);
    return rows.map(toRechargeClosedDayOutput);
  }
}
