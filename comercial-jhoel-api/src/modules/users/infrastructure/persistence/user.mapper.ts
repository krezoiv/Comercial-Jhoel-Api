import { RoleName } from '../../../roles/domain/entities/role.entity';
import { ThemePreference, User } from '../../domain/entities/user.entity';
import { UserOrmEntity } from './user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): User {
    return User.create({
      id: orm.id,
      name: orm.name,
      email: orm.email,
      username: orm.username,
      phone: orm.phone,
      passwordHash: orm.passwordHash,
      roleId: orm.roleId,
      roleName: orm.role.name as RoleName,
      isActive: orm.isActive,
      theme: orm.theme as ThemePreference,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}
