import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleOrmEntity } from './infrastructure/persistence/role.orm-entity';
import { TypeOrmRoleRepository } from './infrastructure/persistence/typeorm-role.repository';
import { ROLE_REPOSITORY } from './domain/repositories/role.repository';
import { CreateRoleUseCase } from './application/use-cases/create-role.use-case';
import { ListRolesUseCase } from './application/use-cases/list-roles.use-case';
import { GetRoleByIdUseCase } from './application/use-cases/get-role-by-id.use-case';
import { UpdateRoleUseCase } from './application/use-cases/update-role.use-case';
import { DeactivateRoleUseCase } from './application/use-cases/deactivate-role.use-case';
import { RolesController } from './presentation/controllers/roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoleOrmEntity])],
  controllers: [RolesController],
  providers: [
    { provide: ROLE_REPOSITORY, useClass: TypeOrmRoleRepository },
    CreateRoleUseCase,
    ListRolesUseCase,
    GetRoleByIdUseCase,
    UpdateRoleUseCase,
    DeactivateRoleUseCase,
  ],
  exports: [ROLE_REPOSITORY],
})
export class RolesModule {}
