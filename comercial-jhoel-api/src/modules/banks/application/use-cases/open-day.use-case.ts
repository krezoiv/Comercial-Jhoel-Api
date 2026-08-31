import { Inject, Injectable } from '@nestjs/common';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import { DAY_AUDIT_LOG_REPOSITORY } from '../../domain/repositories/day-audit-log.repository';
import type { DayAuditLogRepository } from '../../domain/repositories/day-audit-log.repository';
import { InvalidBankBalanceDateError } from '../../domain/errors/invalid-bank-balance.error';
import { GetDayStatusUseCase } from './get-day-status.use-case';
import { DayStatusOutput } from '../dtos/day-status-output';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface OpenDayInput {
  date: string;
  userId: string;
}

/**
 * "Confirmar Apertura" — idempotente (`DayOpeningRepository.open` nunca
 * crea una segunda fila para una fecha ya aperturada), así que un doble
 * clic o un reintento nunca falla ni duplica nada. Devuelve el estado
 * completo del día (no solo "abierto: sí"), para que el frontend pueda
 * actualizar su UI en un solo paso sin una segunda llamada.
 */
@Injectable()
export class OpenDayUseCase {
  constructor(
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: DayOpeningRepository,
    @Inject(DAY_AUDIT_LOG_REPOSITORY)
    private readonly dayAuditLogRepository: DayAuditLogRepository,
    private readonly getDayStatusUseCase: GetDayStatusUseCase,
  ) {}

  async execute(input: OpenDayInput): Promise<DayStatusOutput> {
    if (!input.date || !DATE_PATTERN.test(input.date)) {
      throw new InvalidBankBalanceDateError();
    }

    // Solo registra 'OPENED' en la primera apertura real — `open()` es
    // idempotente y un doble clic/reintento no debe duplicar el evento en
    // el historial del día.
    const existing = await this.dayOpeningRepository.findByDate(input.date);
    await this.dayOpeningRepository.open(input.date, input.userId);
    if (!existing) {
      await this.dayAuditLogRepository.record({
        date: input.date,
        action: 'OPENED',
        performedBy: input.userId,
        newStatus: 'OPENED',
      });
    }
    return this.getDayStatusUseCase.execute(input.date);
  }
}
