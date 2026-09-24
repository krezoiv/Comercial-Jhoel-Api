import { Inject, Injectable } from '@nestjs/common';
import { SUPPLIER_REPOSITORY } from '../../domain/repositories/supplier.repository';
import type { SupplierRepository } from '../../domain/repositories/supplier.repository';
import { SupplierOutput, toSupplierOutput } from '../dtos/supplier-output';

export interface ListSuppliersInput {
  activeOnly?: boolean;
  search?: string;
}

@Injectable()
export class ListSuppliersUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: SupplierRepository,
  ) {}

  async execute(input: ListSuppliersInput = {}): Promise<SupplierOutput[]> {
    const suppliers = await this.supplierRepository.findAll({
      activeOnly: input.activeOnly ?? false,
      search: input.search?.trim() || undefined,
    });
    return suppliers.map(toSupplierOutput);
  }
}
