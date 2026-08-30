import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeactivateUserUseCase } from './application/use-cases/deactivate-user.use-case';
import { UsersController } from './presentation/controllers/users.controller';
import { SharedModule } from '../../shared/shared.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    SharedModule,
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [
    { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
    RegisterUserUseCase,
    CreateUserUseCase,
    ListUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeactivateUserUseCase,
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
