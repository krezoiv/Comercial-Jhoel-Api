import { Inject, Injectable } from '@nestjs/common';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
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
    private readonly getDayStatusUseCase: GetDayStatusUseCase,
  ) {}

  async execute(input: OpenDayInput): Promise<DayStatusOutput> {
    if (!input.date || !DATE_PATTERN.test(input.date)) {
      throw new InvalidBankBalanceDateError();
    }

    await this.dayOpeningRepository.open(input.date, input.userId);
    return this.getDayStatusUseCase.execute(input.date);
  }
}
