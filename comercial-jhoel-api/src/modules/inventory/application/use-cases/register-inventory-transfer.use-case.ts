import { Inject, Injectable } from '@nestjs/common';
import { INVENTORY_TRANSFER_REPOSITORY } from '../../domain/repositories/inventory-transfer.repository';
import type { InventoryTransferRepository } from '../../domain/repositories/inventory-transfer.repository';
import {
  InvalidTransferQuantityError,
  SameLocationTransferError,
} from '../../domain/errors/transfer.errors';

export interface RegisterInventoryTransferInput {
  productId: string;
  presentationId?: string;
  fromLocationId: string;
  toLocationId: string;
  quantity: number;
  userId: string;
  reason?: string;
}

export interface RegisterInventoryTransferOutput {
  referenceId: string;
}

/**
 * Pre-validates the same rules the SQL function enforces (fast, clean
 * error for the common case) — the stored function's own `FOR UPDATE`
 * locks on both locations are the real guarantee against a race, same
 * "TypeScript pre-check + SQL is the real guard" split every other
 * critical operation in this codebase already uses.
 */
@Injectable()
export class RegisterInventoryTransferUseCase {
  constructor(
    @Inject(INVENTORY_TRANSFER_REPOSITORY)
    private readonly transferRepository: InventoryTransferRepository,
  ) {}

  async execute(
    input: RegisterInventoryTransferInput,
  ): Promise<RegisterInventoryTransferOutput> {
    if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
      throw new InvalidTransferQuantityError();
    }
    if (input.fromLocationId === input.toLocationId) {
      throw new SameLocationTransferError();
    }

    const referenceId = await this.transferRepository.registerTransfer({
      productId: input.productId,
      presentationId: input.presentationId ?? null,
      fromLocationId: input.fromLocationId,
      toLocationId: input.toLocationId,
      quantityPresentation: input.quantity,
      userId: input.userId,
      reason: input.reason,
    });

    return { referenceId };
  }
}
