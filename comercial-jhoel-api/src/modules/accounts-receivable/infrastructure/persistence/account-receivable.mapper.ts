import { AccountReceivable } from '../../domain/entities/account-receivable.entity';
import { AccountReceivableOrmEntity } from './account-receivable.orm-entity';

export class AccountReceivableMapper {
  static toDomain(orm: AccountReceivableOrmEntity): AccountReceivable {
    return AccountReceivable.create({
      id: orm.id,
      clientId: orm.clientId,
      clientName: orm.client?.name ?? '',
      date: orm.date,
      amount: orm.amount,
      description: orm.description,
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
