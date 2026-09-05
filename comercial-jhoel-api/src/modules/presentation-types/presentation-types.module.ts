import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresentationTypeOrmEntity } from './infrastructure/persistence/presentation-type.orm-entity';
import { TypeOrmPresentationTypeRepository } from './infrastructure/persistence/typeorm-presentation-type.repository';
import { PRESENTATION_TYPE_REPOSITORY } from './domain/repositories/presentation-type.repository';
import { CreatePresentationTypeUseCase } from './application/use-cases/create-presentation-type.use-case';
import { ListPresentationTypesUseCase } from './application/use-cases/list-presentation-types.use-case';
import { GetPresentationTypeByIdUseCase } from './application/use-cases/get-presentation-type-by-id.use-case';
import { UpdatePresentationTypeUseCase } from './application/use-cases/update-presentation-type.use-case';
import { DeactivatePresentationTypeUseCase } from './application/use-cases/deactivate-presentation-type.use-case';
import { PresentationTypesController } from './presentation/controllers/presentation-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PresentationTypeOrmEntity])],
  controllers: [PresentationTypesController],
  providers: [
    {
      provide: PRESENTATION_TYPE_REPOSITORY,
      useClass: TypeOrmPresentationTypeRepository,
    },
    CreatePresentationTypeUseCase,
    ListPresentationTypesUseCase,
    GetPresentationTypeByIdUseCase,
    UpdatePresentationTypeUseCase,
    DeactivatePresentationTypeUseCase,
  ],
  // Exported for InventoryModule, which validates presentationTypeId exists+active the same way ProductsModule reaches CategoriesModule/BusinessesModule.
  exports: [PRESENTATION_TYPE_REPOSITORY],
})
export class PresentationTypesModule {}
