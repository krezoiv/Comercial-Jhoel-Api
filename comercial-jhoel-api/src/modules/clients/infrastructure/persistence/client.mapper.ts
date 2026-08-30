import { Client } from '../../domain/entities/client.entity';
import { ClientOrmEntity } from './client.orm-entity';

export class ClientMapper {
  static toDomain(orm: ClientOrmEntity): Client {
    return Client.create({
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
