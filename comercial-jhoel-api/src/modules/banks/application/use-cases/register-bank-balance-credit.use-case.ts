import { Inject, Injectable } from '@nestjs/common';
import { BANK_MOVEMENT_REPOSITORY } from '../../domain/repositories/bank-movement.repository';
import type { BankMovementRepository } from '../../domain/repositories/bank-movement.repository';
import { DAY_OPENING_REPOSITORY } from '../../domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import { InvalidMovementAmountError } from '../../domain/errors/bank-movement.errors';
import { BankMovementOutput } from '../dtos/bank-movement-output';
import { todayIsoDate } from '../utils/today-iso-date';
import { assertBankOperationDayOpen } from './assert-bank-operation-day-open';

export interface RegisterBankBalanceCreditInput {
  bankId: string;
  amount: number;
  referenceText?: string | null;
  observation?: string | null;
  userId: string;
}

/**
 * Finanzas → Transferencias Bancarias → "Acreditar saldo": SUMA `amount`
 * al saldo actual de una cuenta (nuevo saldo = saldo actual + monto, con
 * signo real — una cuenta en negativo simplemente se acerca a cero). Sin
 * contrapartida: no toca otra cuenta, caja ni efectivo. Distinta del
 * Depósito de Transaccionar (tipo de movimiento propio `ACREDITACION_SALDO`).
 *
 * Solo admin/super_admin (lo exige el controlador). El cálculo, el lock de
 * la fila, el ledger y la actualización del saldo viven en
 * `register_bank_balance_credit` → `apply_bank_account_movement`, en una
 * sola transacción: este caso de uso nunca calcula un saldo. Respeta el
 * mismo ciclo de día abierto/cerrado que las transferencias.
 */
@Injectable()
export class RegisterBankBalanceCreditUseCase {
  constructor(
    @Inject(BANK_MOVEMENT_REPOSITORY)
    private readonly bankMovementRepository: BankMovementRepository,
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: DayOpeningRepository,
  ) {}

  async execute(
    input: RegisterBankBalanceCreditInput,
  ): Promise<BankMovementOutput> {
    // Defensa en profundidad (el DTO y la función SQL también lo validan).
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new InvalidMovementAmountError();
    }

    const businessDate = todayIsoDate();
    await assertBankOperationDayOpen(this.dayOpeningRepository, businessDate);

    const { movement } = await this.bankMovementRepository.registerBalanceCredit({
      bankId: input.bankId,
      amount: input.amount,
      businessDate,
      userId: input.userId,
      referenceText: input.referenceText?.trim() || null,
      observation: input.observation?.trim() || null,
    });
    return movement;
  }
}
