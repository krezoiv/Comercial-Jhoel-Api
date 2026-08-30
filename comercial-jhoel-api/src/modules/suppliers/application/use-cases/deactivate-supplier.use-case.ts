import { Inject, Injectable } from '@nestjs/common';
import { SUPPLIER_REPOSITORY } from '../../domain/repositories/supplier.repository';
import type { SupplierRepository } from '../../domain/repositories/supplier.repository';
import { SupplierNotFoundError } from '../../domain/errors/supplier-not-found.error';

/**
 * Soft delete only — a supplier is never physically removed, and a
 * deactivated one still fully backs every purchase that already references
 * it (the FK is RESTRICT, but that never fires since this never deletes the
 * row). Deactivating it only blocks *new* purchases from selecting it —
 * `CreatePurchaseUseCase`/`confirm_purchase` validate `is_active` the same
 * way product/category/business creation already does.
 */
@Injectable()
export class DeactivateSupplierUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: SupplierRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      throw new SupplierNotFoundError(id);
    }
    await this.supplierRepository.deactivate(id);
  }
}
