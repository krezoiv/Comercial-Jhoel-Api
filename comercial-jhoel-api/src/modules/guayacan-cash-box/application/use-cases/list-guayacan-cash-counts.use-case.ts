import { Inject, Injectable } from '@nestjs/common';
import { GUAYACAN_CASH_BOX_REPOSITORY } from '../../domain/repositories/guayacan-cash-box.repository';
import type {
  GuayacanCashBoxRepository,
  PaginatedGuayacanCashCounts,
} from '../../domain/repositories/guayacan-cash-box.repository';
import { GuayacanInvalidDateError } from '../../domain/errors/guayacan-cash-box.errors';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/** "ARQ-0007", "arq 7" o "7" → 7; `null` si no trae un número. */
export function parseCountNumber(value: string | undefined): number | null {
  const digits = value?.match(/\d+/)?.[0];
  return digits ? Number(digits) : null;
}

/**
 * Historial de arqueos (Cajas y Cierres → Arqueos — Guayacán): más reciente
 * primero, paginado en SQL. Filtros: fecha (Guatemala), usuario y número.
 * Un número que no existe devuelve vacío, nunca "todos".
 */
@Injectable()
export class ListGuayacanCashCountsUseCase {
  constructor(
    @Inject(GUAYACAN_CASH_BOX_REPOSITORY)
    private readonly repository: GuayacanCashBoxRepository,
  ) {}

  execute(input: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    number?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedGuayacanCashCounts> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new GuayacanInvalidDateError();
    }
    const page = input.page && input.page > 0 ? input.page : 1;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;
    const number = input.number?.trim();
    const sequence = number ? parseCountNumber(number) : null;
    if (number && sequence === null) {
      return Promise.resolve({ items: [], total: 0, page, limit });
    }
    return this.repository.findCounts({
      startDate: input.startDate,
      endDate: input.endDate,
      userId: input.userId,
      sequence: sequence ?? undefined,
      page,
      limit,
    });
  }
}
