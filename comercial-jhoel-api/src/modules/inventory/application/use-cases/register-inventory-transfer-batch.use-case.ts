import { Inject, Injectable } from '@nestjs/common';
import { INVENTORY_TRANSFER_REPOSITORY } from '../../domain/repositories/inventory-transfer.repository';
import type { InventoryTransferRepository } from '../../domain/repositories/inventory-transfer.repository';
import {
  EmptyTransferBatchError,
  InvalidTransferQuantityError,
  SameLocationTransferError,
} from '../../domain/errors/transfer.errors';

export interface RegisterInventoryTransferBatchItemInput {
  productId: string;
  presentationId?: string;
  quantity: number;
}

export interface RegisterInventoryTransferBatchInput {
  fromLocationId: string;
  toLocationId: string;
  reason?: string;
  items: RegisterInventoryTransferBatchItemInput[];
  userId: string;
}

export interface RegisterInventoryTransferBatchOutput {
  referenceIds: string[];
}

/**
 * The "Transferencia rápida" flow — several products, one origin/destination
 * pair, saved as a single all-or-nothing operation. Never a second stock-
 * movement system: every line still goes through the exact same
 * `register_inventory_transfer` stored function `RegisterInventoryTransferUseCase`
 * already uses, just batched inside one outer transaction (see
 * `InventoryTransferRepository.registerTransferBatch`) so a failure on any
 * line rolls back every line already applied in this call.
 */
@Injectable()
export class RegisterInventoryTransferBatchUseCase {
  constructor(
    @Inject(INVENTORY_TRANSFER_REPOSITORY)
    private readonly transferRepository: InventoryTransferRepository,
  ) {}

  async execute(
    input: RegisterInventoryTransferBatchInput,
  ): Promise<RegisterInventoryTransferBatchOutput> {
    if (input.items.length === 0) {
      throw new EmptyTransferBatchError();
    }
    if (input.fromLocationId === input.toLocationId) {
      throw new SameLocationTransferError();
    }
    for (const item of input.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new InvalidTransferQuantityError();
      }
    }

    const referenceIds = await this.transferRepository.registerTransferBatch(
      input.items.map((item) => ({
        productId: item.productId,
        presentationId: item.presentationId ?? null,
        fromLocationId: input.fromLocationId,
        toLocationId: input.toLocationId,
        quantityPresentation: item.quantity,
        userId: input.userId,
        reason: input.reason,
      })),
    );

    return { referenceIds };
  }
}
