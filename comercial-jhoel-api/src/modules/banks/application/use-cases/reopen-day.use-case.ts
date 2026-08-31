import { Inject, Injectable } from '@nestjs/common';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import { ReopenReasonRequiredError } from '../../domain/errors/reason-required.error';
import { GetDayDetailUseCase } from './get-day-detail.use-case';
import { DayDetailOutput } from '../dtos/day-detail-output';

export interface ReopenDayInput {
  date: string;
  userId: string;
  reason: string;
}

/**
 * "Reabrir Día" — la validación de rol (solo ADMIN/SUPER_ADMIN) ya ocurrió
 * en el `RolesGuard` del controller, la validación real de estado/
 * anulación/días posteriores ocurre atómicamente dentro de
 * `reopen_agent_day` (SQL, bajo lock de la fila) — este use case solo
 * orquesta y traduce el resultado a la forma que el frontend necesita
 * para refrescar la fila/el detalle sin una segunda llamada.
 */
@Injectable()
export class ReopenDayUseCase {
  constructor(
    @Inject(DAY_OPENING_REPOSITORY) private readonly dayOpeningRepository: DayOpeningRepository,
    private readonly getDayDetailUseCase: GetDayDetailUseCase,
  ) {}

  async execute(input: ReopenDayInput): Promise<DayDetailOutput> {
    const reason = input.reason?.trim();
    if (!reason) {
      throw new ReopenReasonRequiredError();
    }

    await this.dayOpeningRepository.reopen(input.date, input.userId, reason);
    return this.getDayDetailUseCase.execute(input.date);
  }
}
