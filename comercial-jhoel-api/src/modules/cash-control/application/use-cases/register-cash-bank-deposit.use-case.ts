import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { CASH_CONTROL_REPOSITORY } from '../../domain/repositories/cash-control.repository';
import type {
  CashControlRepository,
  CashDenominationData,
} from '../../domain/repositories/cash-control.repository';
import { DAY_OPENING_REPOSITORY } from '../../../banks/domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../../banks/domain/repositories/day-opening.repository';
import { assertBankOperationDayOpen } from '../../../banks/application/use-cases/assert-bank-operation-day-open';
import { cashControlError } from '../../domain/errors/cash-control.errors';
import {
  CASH_CUT_MANAGER_ROLES,
  guatemalaIsoDate,
} from '../../domain/policies/cash-control.policy';
import type { CashMovementResult } from './cash-movement-commands.use-cases';

const VALID_DENOMINATIONS = [200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05];

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export interface RegisterCashBankDepositInput {
  bankId: string;
  amount: number;
  details: CashDenominationData[];
  description?: string | null;
  clientRequestId?: string | null;
  userId: string;
  role: string;
}

/**
 * Control de Efectivo → "Depósito bancario": physical cash leaves the caja
 * (Kardex OUT) and the selected registered account's balance increases, in
 * ONE database transaction (`register_cash_bank_deposit`). The denomination
 * breakdown is mandatory and must add up to the amount; the deposit is
 * rejected when the official cash is not enough. Like every other balance-
 * moving bank operation, it requires the business day to be open. Cut
 * managers only (re-checked here); `clientRequestId` makes retries
 * idempotent. Voiding goes through `VoidCashMovementUseCase` (admin) and
 * reverses both sides.
 */
@Injectable()
export class RegisterCashBankDepositUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: DayOpeningRepository,
  ) {}

  async execute(
    input: RegisterCashBankDepositInput,
  ): Promise<CashMovementResult> {
    if (!(CASH_CUT_MANAGER_ROLES as readonly string[]).includes(input.role)) {
      throw cashControlError('CASH_FORBIDDEN');
    }
    const amount = round2(input.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw cashControlError('CASH_INVALID_AMOUNT');
    }
    const details = input.details.filter((row) => row.quantity > 0);
    if (details.length === 0) {
      throw cashControlError('CASH_BREAKDOWN_REQUIRED');
    }
    const seen = new Set<number>();
    for (const row of details) {
      const denomination = round2(row.denomination);
      if (
        !VALID_DENOMINATIONS.includes(denomination) ||
        !Number.isInteger(row.quantity) ||
        seen.has(denomination)
      ) {
        throw cashControlError('CASH_INVALID_DENOMINATION');
      }
      seen.add(denomination);
    }
    const total = round2(
      details.reduce((sum, row) => sum + row.denomination * row.quantity, 0),
    );
    if (total !== amount) {
      throw cashControlError('CASH_BREAKDOWN_MISMATCH');
    }

    await assertBankOperationDayOpen(
      this.dayOpeningRepository,
      guatemalaIsoDate(),
    );

    const id = await this.repository.registerBankDeposit({
      bankId: input.bankId,
      amount,
      details,
      description: input.description?.trim() || null,
      idempotencyKey: `DEP:${input.clientRequestId ?? randomUUID()}`,
      userId: input.userId,
    });
    const [movement, balance] = await Promise.all([
      this.repository.findMovementById(id),
      this.repository.getBalance(),
    ]);
    if (!movement) {
      throw cashControlError('CASH_MOVEMENT_NOT_FOUND');
    }
    return { movement, balance: balance.balance };
  }
}
