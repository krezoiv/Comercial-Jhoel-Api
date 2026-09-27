import { Inject, Injectable } from '@nestjs/common';
import { BANK_MOVEMENT_REPOSITORY } from '../../domain/repositories/bank-movement.repository';
import type { BankMovementRepository } from '../../domain/repositories/bank-movement.repository';
import {
  BankTransferAlreadyVoidedError,
  BankTransferNotFoundError,
  MovementReasonRequiredError,
} from '../../domain/errors/bank-movement.errors';
import { BankTransferOutput } from '../dtos/bank-movement-output';
import { todayIsoDate } from '../utils/today-iso-date';

export interface VoidBankTransferInput {
  transferId: string;
  reason: string;
  userId: string;
}

/**
 * Anular una transferencia — nunca la borra: `void_bank_transfer` registra
 * los dos movimientos inversos y marca los originales como ANULADO, todo
 * en una transacción. Solo admin (lo exige el controlador), mismo criterio
 * que la anulación de Transaccionar.
 */
@Injectable()
export class VoidBankTransferUseCase {
  constructor(
    @Inject(BANK_MOVEMENT_REPOSITORY)
    private readonly bankMovementRepository: BankMovementRepository,
  ) {}

  async execute(input: VoidBankTransferInput): Promise<BankTransferOutput> {
    const reason = input.reason?.trim();
    if (!reason) {
      throw new MovementReasonRequiredError();
    }

    const transfer = await this.bankMovementRepository.findTransferById(
      input.transferId,
    );
    if (!transfer) {
      throw new BankTransferNotFoundError(input.transferId);
    }
    if (transfer.status === 'ANULADO') {
      throw new BankTransferAlreadyVoidedError();
    }

    await this.bankMovementRepository.voidTransfer(
      input.transferId,
      todayIsoDate(),
      input.userId,
      reason,
    );

    return (
      (await this.bankMovementRepository.findTransferById(input.transferId)) ??
      transfer
    );
  }
}
