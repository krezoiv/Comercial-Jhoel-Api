import { Bank } from '../../domain/entities/bank.entity';
import { BankOrmEntity } from './bank.orm-entity';

export class BankMapper {
  static toDomain(orm: BankOrmEntity): Bank {
    return Bank.create({
      id: orm.id,
      name: orm.name,
      accountNumber: orm.accountNumber,
      accountTypeId: orm.accountTypeId,
      accountTypeName: orm.accountType.name,
      previousBalance: orm.previousBalance,
      finalBalance: orm.finalBalance,
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
