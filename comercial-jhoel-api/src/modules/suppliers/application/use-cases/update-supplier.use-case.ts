import { Inject, Injectable } from '@nestjs/common';
import { SUPPLIER_REPOSITORY } from '../../domain/repositories/supplier.repository';
import type { SupplierRepository } from '../../domain/repositories/supplier.repository';
import { SupplierNotFoundError } from '../../domain/errors/supplier-not-found.error';
import { SupplierTaxIdAlreadyExistsError } from '../../domain/errors/supplier-tax-id-already-exists.error';
import { SupplierOutput, toSupplierOutput } from '../dtos/supplier-output';

export interface UpdateSupplierInput {
  name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  taxId?: string | null;
}

@Injectable()
export class UpdateSupplierUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: SupplierRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateSupplierInput,
  ): Promise<SupplierOutput> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      throw new SupplierNotFoundError(id);
    }

    const name = input.name?.trim().replace(/\s+/g, ' ');

    const taxId =
      input.taxId !== undefined ? input.taxId?.trim() || null : undefined;
    if (taxId && taxId !== supplier.taxId) {
      const existing = await this.supplierRepository.findActiveByTaxId(taxId);
      if (existing) {
        throw new SupplierTaxIdAlreadyExistsError(taxId);
      }
    }

    const updated = await this.supplierRepository.update(id, {
      ...(name ? { name } : {}),
      ...(input.phone !== undefined
        ? { phone: input.phone?.trim() || null }
        : {}),
      ...(input.email !== undefined
        ? { email: input.email?.trim().toLowerCase() || null }
        : {}),
      ...(input.address !== undefined
        ? { address: input.address?.trim() || null }
        : {}),
      ...(taxId !== undefined ? { taxId } : {}),
    });
    return toSupplierOutput(updated);
  }
}
