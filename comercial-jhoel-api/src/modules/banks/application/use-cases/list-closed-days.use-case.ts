import { Inject, Injectable } from '@nestjs/common';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { ClosedDaysFilters, DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import { ClosedDayOutput, toClosedDayOutput } from '../dtos/closed-day-output';

/** "Sistema → Gestión de Días Cerrados" — administrative listing, ADMIN/SUPER_ADMIN only (see the controller). */
@Injectable()
export class ListClosedDaysUseCase {
  constructor(
    @Inject(DAY_OPENING_REPOSITORY) private readonly dayOpeningRepository: DayOpeningRepository,
  ) {}

  async execute(filters: ClosedDaysFilters): Promise<ClosedDayOutput[]> {
    const rows = await this.dayOpeningRepository.findClosedDays(filters);
    return rows.map(toClosedDayOutput);
  }
}
