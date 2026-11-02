import { Inject, Injectable } from '@nestjs/common';
import { GUAYACAN_CASH_BOX_REPOSITORY } from '../../domain/repositories/guayacan-cash-box.repository';
import type {
  GuayacanCashBoxRepository,
  GuayacanCashCountRow,
  GuayacanCashDenominationData,
} from '../../domain/repositories/guayacan-cash-box.repository';
import { GuayacanCountNotFoundError } from '../../domain/errors/guayacan-cash-box.errors';
import {
  normalizeDenominations,
  resolveBusinessDate,
} from '../utils/cash-denominations';

/**
 * "Conteo de efectivo en caja" (arqueo). Guarda billetes/monedas contados y
 * la diferencia contra el saldo del Kardex en ese instante — NUNCA modifica
 * el saldo. Una diferencia se corrige con un ajuste autorizado.
 */
@Injectable()
export class RegisterGuayacanCashCountUseCase {
  constructor(
    @Inject(GUAYACAN_CASH_BOX_REPOSITORY)
    private readonly repository: GuayacanCashBoxRepository,
  ) {}

  async execute(input: {
    details: GuayacanCashDenominationData[];
    businessDate?: string;
    notes?: string | null;
    clientRequestId?: string | null;
    userId: string;
  }): Promise<GuayacanCashCountRow> {
    const id = await this.repository.registerCount({
      details: normalizeDenominations(input.details, { keepZero: true }),
      businessDate: resolveBusinessDate(input.businessDate),
      notes: input.notes?.trim() || null,
      clientRequestId: input.clientRequestId ?? null,
      userId: input.userId,
    });
    const count = await this.repository.findCountById(id);
    if (!count) {
      throw new GuayacanCountNotFoundError();
    }
    return count;
  }
}
