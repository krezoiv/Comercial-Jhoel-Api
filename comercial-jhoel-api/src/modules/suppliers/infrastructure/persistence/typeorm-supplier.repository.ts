import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Supplier } from '../../domain/entities/supplier.entity';
import {
  CreateSupplierData,
  SupplierRepository,
  UpdateSupplierData,
} from '../../domain/repositories/supplier.repository';
import { SupplierTaxIdAlreadyExistsError } from '../../domain/errors/supplier-tax-id-already-exists.error';
import { SupplierOrmEntity } from './supplier.orm-entity';
import { SupplierMapper } from './supplier.mapper';

@Injectable()
export class TypeOrmSupplierRepository implements SupplierRepository {
  constructor(
    @InjectRepository(SupplierOrmEntity)
    private readonly repository: Repository<SupplierOrmEntity>,
  ) {}

  async findAll(options?: { activeOnly?: boolean }): Promise<Supplier[]> {
    const orms = await this.repository.find({
      where: options?.activeOnly ? { isActive: true } : {},
      order: { name: 'ASC' },
    });
    return orms.map((orm) => SupplierMapper.toDomain(orm));
  }

  async findById(id: string): Promise<Supplier | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? SupplierMapper.toDomain(orm) : null;
  }

  async findActiveByTaxId(taxId: string): Promise<Supplier | null> {
    const orm = await this.repository.findOne({
      where: { taxId, isActive: true },
    });
    return orm ? SupplierMapper.toDomain(orm) : null;
  }

  async create(data: CreateSupplierData): Promise<Supplier> {
    const orm = this.repository.create(data);
    try {
      const saved = await this.repository.save(orm);
      return SupplierMapper.toDomain(saved);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.taxId);
    }
  }

  async update(id: string, data: UpdateSupplierData): Promise<Supplier> {
    try {
      await this.repository.update({ id }, data);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.taxId);
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return SupplierMapper.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }

  private translateUniqueViolation(
    error: unknown,
    taxId?: string | null,
  ): unknown {
    if (error instanceof QueryFailedError) {
      const constraint = (
        error.driverError as { constraint?: string } | undefined
      )?.constraint;
      if (constraint === 'UQ_suppliers_tax_id_active' && taxId) {
        return new SupplierTaxIdAlreadyExistsError(taxId);
      }
    }
    return error;
  }
}
