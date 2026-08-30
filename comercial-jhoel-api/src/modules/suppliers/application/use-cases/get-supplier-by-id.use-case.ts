import { Inject, Injectable } from '@nestjs/common';
import { SUPPLIER_REPOSITORY } from '../../domain/repositories/supplier.repository';
import type { SupplierRepository } from '../../domain/repositories/supplier.repository';
import { SupplierNotFoundError } from '../../domain/errors/supplier-not-found.error';
import { SupplierOutput, toSupplierOutput } from '../dtos/supplier-output';

@Injectable()
export class GetSupplierByIdUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: SupplierRepository,
  ) {}

  async execute(id: string): Promise<SupplierOutput> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      throw new SupplierNotFoundError(id);
    }
    return toSupplierOutput(supplier);
  }
}
