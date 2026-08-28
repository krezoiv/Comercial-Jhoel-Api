import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UsersController } from './presentation/controllers/users.controller';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity]), SharedModule],
  controllers: [UsersController],
  providers: [
    { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
    CreateUserUseCase,
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
