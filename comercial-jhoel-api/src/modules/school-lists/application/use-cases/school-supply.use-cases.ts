import { Injectable } from '@nestjs/common';
import {
  FindSupplyProductsOptions,
  Paginated,
  QuotationDetailRow,
  SupplyAllocationMode,
  SupplyProductListRow,
  SupplyProductRow,
  SupplyPurchaseRow,
  SupplySummary,
} from '../../domain/repositories/school-list.repository';
import { schoolListError } from '../../domain/errors/school-list.errors';
import { Actor, SchoolListUseCase, requireKey } from './school-list.use-cases';

/**
 * Supply control of school lists (migration 1760008300000): what the lists
 * committed, what is reserved for each list, what is still to buy, and the
 * dispatch. Every rule (FIFO, caps, no double allocation, no second stock
 * discount) is enforced by the SQL functions under row locks; these use cases
 * check the role and shape the requests.
 */

/** "Productos pendientes de abastecimiento". */
@Injectable()
export class ListSupplyProductsUseCase extends SchoolListUseCase {
  execute(
    actor: Actor,
    options: FindSupplyProductsOptions,
  ): Promise<Paginated<SupplyProductRow> & { summary: SupplySummary }> {
    this.can(actor, 'school_lists.view');
    return this.repository.supplyProducts(options);
  }
}

/** Lists that need a product (FIFO order). */
@Injectable()
export class ListSupplyProductListsUseCase extends SchoolListUseCase {
  execute(actor: Actor, productId: string): Promise<SupplyProductListRow[]> {
    this.can(actor, 'school_lists.view');
    return this.repository.supplyProductLists(productId);
  }
}

/** Purchases and the lists their units were assigned to. */
@Injectable()
export class ListSupplyPurchasesUseCase extends SchoolListUseCase {
  execute(
    actor: Actor,
    options: { purchaseId?: string; page: number; limit: number },
  ): Promise<Paginated<SupplyPurchaseRow>> {
    this.can(actor, 'school_lists.view');
    return this.repository.supplyPurchases(options);
  }
}

@Injectable()
export class GetSupplySettingsUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
  ): Promise<{ allocationMode: SupplyAllocationMode }> {
    this.can(actor, 'school_lists.view');
    return { allocationMode: await this.repository.supplyMode() };
  }
}

/** FIFO automático ↔ manual (administrators). */
@Injectable()
export class SetSupplySettingsUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
    allocationMode: SupplyAllocationMode,
  ): Promise<{ allocationMode: SupplyAllocationMode }> {
    this.can(actor, 'school_lists.templates.manage');
    return {
      allocationMode: await this.repository.setSupplyMode(
        allocationMode,
        actor.userId,
      ),
    };
  }
}

/** "Asignar FIFO": free units of one product (or all) to pending lists. */
@Injectable()
export class RunSupplyFifoUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
    productId: string | null,
  ): Promise<{ allocated: number }> {
    this.can(actor, 'school_lists.supply.manage');
    return {
      allocated: await this.repository.runFifo(productId, actor.userId),
    };
  }
}

/** "Asignar compra a listas": FIFO with the purchase's own unassigned units. */
@Injectable()
export class AllocateSupplyPurchaseUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
    purchaseId: string,
  ): Promise<{ allocated: number }> {
    this.can(actor, 'school_lists.supply.manage');
    return {
      allocated: await this.repository.allocatePurchase(
        purchaseId,
        actor.userId,
      ),
    };
  }
}

/** Manual allocation of free units to one list. */
@Injectable()
export class AllocateSupplyManualUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
    input: {
      quotationId: string;
      productId: string;
      quantity: number;
      purchaseId?: string | null;
    },
    clientRequestId: string,
  ): Promise<QuotationDetailRow> {
    this.can(actor, 'school_lists.supply.manage');
    if (!Number.isInteger(input.quantity) || input.quantity < 1) {
      throw schoolListError('SCHOOL_INVALID_QUANTITY');
    }
    await this.repository.allocateManual(
      { ...input, purchaseId: input.purchaseId ?? null },
      actor.userId,
      requireKey(clientRequestId, 'SLA'),
    );
    return this.detail(input.quotationId);
  }
}

/**
 * "Preparar y despachar lista" (= delivery): requires the list fully supplied
 * and paid; never discounts inventory again.
 */
@Injectable()
export class DispatchSchoolQuotationUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
    quotationId: string,
    observations: string | null,
    clientRequestId: string,
  ): Promise<QuotationDetailRow> {
    this.can(actor, 'school_lists.quotations.edit');
    await this.repository.dispatch(
      quotationId,
      observations,
      actor.userId,
      requireKey(clientRequestId, 'SLD'),
    );
    return this.detail(quotationId);
  }
}
