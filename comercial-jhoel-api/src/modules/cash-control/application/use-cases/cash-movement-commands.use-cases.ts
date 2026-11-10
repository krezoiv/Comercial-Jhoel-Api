import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { CASH_CONTROL_REPOSITORY } from '../../domain/repositories/cash-control.repository';
import type {
  CashControlRepository,
  CashMovementRow,
  ManualCashMovementType,
} from '../../domain/repositories/cash-control.repository';
import { cashControlError } from '../../domain/errors/cash-control.errors';
import {
  isCashAdmin,
  requireReason,
} from '../../domain/policies/cash-control.policy';

export interface CashMovementResult {
  movement: CashMovementRow;
  /** Official balance right after the write (the movement's own `newBalance` when it is the latest). */
  balance: number;
}

export interface RegisterCashMovementInput {
  movementType: ManualCashMovementType;
  amount: number;
  description?: string | null;
  reason: string;
  clientRequestId?: string | null;
  userId: string;
  role: string;
}

/**
 * "Registrar entrada/salida de efectivo" (plus AJUSTE and the one-time
 * SALDO_INICIAL). Entradas/salidas are for cut managers; AJUSTE and
 * SALDO_INICIAL are admin-only (RBAC re-checked here, not only on the
 * route). A reason is always mandatory. `clientRequestId` (one per modal
 * opening) is the idempotency key: a double click or a retried request
 * returns the movement already written instead of a second one.
 */
@Injectable()
export class RegisterCashMovementUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
  ) {}

  async execute(input: RegisterCashMovementInput): Promise<CashMovementResult> {
    if (
      (input.movementType === 'AJUSTE' ||
        input.movementType === 'SALDO_INICIAL') &&
      !isCashAdmin(input.role)
    ) {
      throw cashControlError('CASH_FORBIDDEN');
    }
    const amount = Math.round(input.amount * 100) / 100;
    if (
      !Number.isFinite(amount) ||
      amount === 0 ||
      (input.movementType !== 'AJUSTE' && amount < 0)
    ) {
      throw cashControlError('CASH_INVALID_AMOUNT');
    }
    const id = await this.repository.registerManualMovement({
      movementType: input.movementType,
      amount,
      description: input.description?.trim() || null,
      reason: requireReason(input.reason),
      idempotencyKey: `REQ:${input.clientRequestId ?? randomUUID()}`,
      userId: input.userId,
    });
    return this.result(id);
  }

  private async result(id: string): Promise<CashMovementResult> {
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

/**
 * "Anular o revertir un movimiento" — admin only, reason mandatory. Marks the
 * original ANULADO and appends the inverse ANULACION (nothing is deleted).
 * Only manual movements are voided here; operations born in Transaccionar,
 * Cartera or Transferencias are voided at their source and the trigger
 * appends the reversal automatically.
 */
@Injectable()
export class VoidCashMovementUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
  ) {}

  async execute(input: {
    id: string;
    reason: string;
    userId: string;
    role: string;
  }): Promise<CashMovementResult> {
    if (!isCashAdmin(input.role)) {
      throw cashControlError('CASH_FORBIDDEN');
    }
    const reversalId = await this.repository.voidManualMovement(
      input.id,
      input.userId,
      requireReason(input.reason),
    );
    const [movement, balance] = await Promise.all([
      this.repository.findMovementById(reversalId),
      this.repository.getBalance(),
    ]);
    if (!movement) {
      throw cashControlError('CASH_MOVEMENT_NOT_FOUND');
    }
    return { movement, balance: balance.balance };
  }
}
