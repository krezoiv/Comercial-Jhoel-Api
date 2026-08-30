import { Role, RoleName } from '../../domain/entities/role.entity';
import { RoleOrmEntity } from './role.orm-entity';

export class RoleMapper {
  static toDomain(orm: RoleOrmEntity): Role {
    return Role.create({
      id: orm.id,
      name: orm.name as RoleName,
      description: orm.description,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}
