import { User } from '../../domain/entities/user.entity';
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
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.name = user.name;
    orm.email = user.email;
    orm.username = user.username;
    orm.phone = user.phone;
    orm.passwordHash = user.passwordHash;
    orm.createdAt = user.createdAt;
    orm.updatedAt = user.updatedAt;
    return orm;
  }
}
