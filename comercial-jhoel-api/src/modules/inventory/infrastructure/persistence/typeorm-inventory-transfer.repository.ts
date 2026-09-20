import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
import {
  InventoryTransferRepository,
  RegisterTransferData,
} from '../../domain/repositories/inventory-transfer.repository';
import {
  LocationNotFoundError,
  LocationInactiveError,
} from '../../domain/errors/location-not-found.error';
import {
  PresentationNotFoundError,
  PresentationInactiveError,
} from '../../domain/errors/presentation.errors';
import {
  InsufficientLocationStockError,
  InvalidTransferQuantityError,
  InventoryProductInactiveError,
  SameLocationTransferError,
} from '../../domain/errors/transfer.errors';
import { ProductNotFoundError } from '../../../products/domain/errors/product-not-found.error';
import { InventoryStockOrmEntity } from './inventory-stock.orm-entity';

@Injectable()
export class TypeOrmInventoryTransferRepository implements InventoryTransferRepository {
  constructor(
    @InjectRepository(InventoryStockOrmEntity)
    private readonly repository: Repository<InventoryStockOrmEntity>,
  ) {}

  async registerTransfer(data: RegisterTransferData): Promise<string> {
    try {
      return await this.runTransfer(this.repository.manager, data);
    } catch (error) {
      throw this.translateError(error);
    }
  }

  async registerTransferBatch(
    items: RegisterTransferData[],
  ): Promise<string[]> {
    try {
      return await this.repository.manager.transaction(async (manager) => {
        const referenceIds: string[] = [];
        for (const item of items) {
          referenceIds.push(await this.runTransfer(manager, item));
        }
        return referenceIds;
      });
    } catch (error) {
      throw this.translateError(error);
    }
  }

  private async runTransfer(
    manager: EntityManager,
    data: RegisterTransferData,
  ): Promise<string> {
    const rows = await manager.query<{ register_inventory_transfer: string }[]>(
      'SELECT register_inventory_transfer($1, $2, $3, $4, $5, $6, $7)',
      [
        data.productId,
        data.presentationId,
        data.fromLocationId,
        data.toLocationId,
        data.quantityPresentation,
        data.userId,
        data.reason ?? null,
      ],
    );
    return rows[0].register_inventory_transfer;
  }

  private translateError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;
    const [code, extra] = message.split(':');

    switch (code) {
      case 'INVALID_QUANTITY':
        return new InvalidTransferQuantityError();
      case 'SAME_LOCATION':
        return new SameLocationTransferError();
      case 'PRODUCT_NOT_FOUND':
        return new ProductNotFoundError(extra);
      case 'PRODUCT_INACTIVE':
        return new InventoryProductInactiveError(extra);
      case 'LOCATION_NOT_FOUND':
        return new LocationNotFoundError(extra);
      case 'LOCATION_INACTIVE':
        return new LocationInactiveError(extra);
      case 'PRESENTATION_NOT_FOUND':
        return new PresentationNotFoundError(extra);
      case 'PRESENTATION_INACTIVE':
        return new PresentationInactiveError(extra);
      case 'INSUFFICIENT_STOCK':
        return new InsufficientLocationStockError(extra);
      default:
        return error;
    }
  }
}
