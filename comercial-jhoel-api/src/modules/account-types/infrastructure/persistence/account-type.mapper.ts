import { AccountType } from '../../domain/entities/account-type.entity';
import { AccountTypeOrmEntity } from './account-type.orm-entity';

export class AccountTypeMapper {
  static toDomain(orm: AccountTypeOrmEntity): AccountType {
    return AccountType.create({
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
