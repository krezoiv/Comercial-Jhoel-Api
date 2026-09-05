import { Inject, Injectable } from '@nestjs/common';
import { INVENTORY_STOCK_REPOSITORY } from '../../domain/repositories/inventory-stock.repository';
import type { InventoryStockRepository } from '../../domain/repositories/inventory-stock.repository';
import { InvalidPresentationDataError } from '../../domain/errors/invalid-presentation-data.error';
import {
  toStockByLocationOutput,
  StockByLocationOutput,
} from '../dtos/inventory-output';

export interface SetMinStockInput {
  productId: string;
  locationId: string;
  minStock: number;
}

/**
 * "Stock mínimo" per (producto, ubicación) — the threshold the Alerts
 * module reads to decide "inventario bajo". Admin-only (mirrors this
 * module's own presentation-write split: reading is open to any
 * authenticated account, configuring a threshold is an admin action).
 * Reuses `InvalidPresentationDataError` rather than a new error class —
 * it's already a generic "bad numeric input" domain error with the right
 * 400 status, and this module has no other spot needing the same shape.
 */
@Injectable()
export class SetMinStockUseCase {
  constructor(
    @Inject(INVENTORY_STOCK_REPOSITORY)
    private readonly stockRepository: InventoryStockRepository,
  ) {}

  async execute(input: SetMinStockInput): Promise<StockByLocationOutput> {
    if (!Number.isInteger(input.minStock) || input.minStock < 0) {
      throw new InvalidPresentationDataError(
        'El stock mínimo debe ser un número entero mayor o igual a cero.',
      );
    }

    const updated = await this.stockRepository.setMinStock(
      input.productId,
      input.locationId,
      input.minStock,
    );
    return toStockByLocationOutput(updated);
  }
}
