import { Supplier } from '../../domain/entities/supplier.entity';
import { SupplierOrmEntity } from './supplier.orm-entity';

export class SupplierMapper {
  static toDomain(orm: SupplierOrmEntity): Supplier {
    return Supplier.create({
      id: orm.id,
      name: orm.name,
      phone: orm.phone,
      email: orm.email,
      address: orm.address,
      taxId: orm.taxId,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}
