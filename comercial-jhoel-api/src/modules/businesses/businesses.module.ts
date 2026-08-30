import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessOrmEntity } from './infrastructure/persistence/business.orm-entity';
import { TypeOrmBusinessRepository } from './infrastructure/persistence/typeorm-business.repository';
import { BUSINESS_REPOSITORY } from './domain/repositories/business.repository';
import { CreateBusinessUseCase } from './application/use-cases/create-business.use-case';
import { ListBusinessesUseCase } from './application/use-cases/list-businesses.use-case';
import { GetBusinessByIdUseCase } from './application/use-cases/get-business-by-id.use-case';
import { UpdateBusinessUseCase } from './application/use-cases/update-business.use-case';
import { DeactivateBusinessUseCase } from './application/use-cases/deactivate-business.use-case';
import { BusinessesController } from './presentation/controllers/businesses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessOrmEntity])],
  controllers: [BusinessesController],
  providers: [
    { provide: BUSINESS_REPOSITORY, useClass: TypeOrmBusinessRepository },
    CreateBusinessUseCase,
    ListBusinessesUseCase,
    GetBusinessByIdUseCase,
    UpdateBusinessUseCase,
    DeactivateBusinessUseCase,
  ],
  exports: [BUSINESS_REPOSITORY],
})
export class BusinessesModule {}
