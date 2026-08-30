import { Inject, Injectable } from '@nestjs/common';
import { SUPPLIER_REPOSITORY } from '../../domain/repositories/supplier.repository';
import type { SupplierRepository } from '../../domain/repositories/supplier.repository';
import { SupplierTaxIdAlreadyExistsError } from '../../domain/errors/supplier-tax-id-already-exists.error';
import { SupplierOutput, toSupplierOutput } from '../dtos/supplier-output';

export interface CreateSupplierInput {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  taxId?: string;
}

@Injectable()
export class CreateSupplierUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: SupplierRepository,
  ) {}

  async execute(input: CreateSupplierInput): Promise<SupplierOutput> {
    const name = input.name.trim().replace(/\s+/g, ' ');
    const taxId = input.taxId?.trim() || null;

    if (taxId) {
      const existing = await this.supplierRepository.findActiveByTaxId(taxId);
      if (existing) {
        throw new SupplierTaxIdAlreadyExistsError(taxId);
      }
    }

    const supplier = await this.supplierRepository.create({
      name,
      phone: input.phone?.trim() || null,
      email: input.email?.trim().toLowerCase() || null,
      address: input.address?.trim() || null,
      taxId,
    });
    return toSupplierOutput(supplier);
  }
}
