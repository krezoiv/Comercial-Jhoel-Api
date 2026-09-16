import { Phone } from '../../domain/entities/phone.entity';
import { PhoneOrmEntity } from './phone.orm-entity';

export class PhoneMapper {
  static toDomain(orm: PhoneOrmEntity): Phone {
    return Phone.create({
      id: orm.id,
      operator: orm.operator,
      model: orm.model,
      phoneNumber: orm.phoneNumber,
      imei: orm.imei,
      simNumber: orm.simNumber,
      costPrice: orm.costPrice,
      publicPrice: orm.publicPrice,
      status: orm.status,
      purchaseDate: orm.purchaseDate,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      createdBy: orm.createdBy,
      createdByUsername: orm.createdByUser.username ?? '',
      updatedBy: orm.updatedBy,
      updatedByUsername: orm.updatedByUser?.username ?? null,
    });
  }
}
