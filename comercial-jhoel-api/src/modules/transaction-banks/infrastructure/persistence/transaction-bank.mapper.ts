import { TransactionBank } from '../../domain/entities/transaction-bank.entity';
import { TransactionBankOrmEntity } from './transaction-bank.orm-entity';

export class TransactionBankMapper {
  static toDomain(orm: TransactionBankOrmEntity): TransactionBank {
    return TransactionBank.create({
      id: orm.id,
      name: orm.name,
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
