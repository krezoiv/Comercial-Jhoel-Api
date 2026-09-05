import { TransactionType } from '../../domain/entities/transaction-type.entity';
import { TransactionTypeOrmEntity } from './transaction-type.orm-entity';

export class TransactionTypeMapper {
  static toDomain(orm: TransactionTypeOrmEntity): TransactionType {
    return TransactionType.create({
      id: orm.id,
      name: orm.name,
      icon: orm.icon,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      createdBy: orm.createdBy,
      createdByUsername: orm.createdByUser?.username ?? '',
      updatedBy: orm.updatedBy,
      updatedByUsername: orm.updatedByUser?.username ?? null,
    });
  }
}
