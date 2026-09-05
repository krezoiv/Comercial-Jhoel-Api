import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitOfMeasureOrmEntity } from './infrastructure/persistence/unit-of-measure.orm-entity';
import { TypeOrmUnitOfMeasureRepository } from './infrastructure/persistence/typeorm-unit-of-measure.repository';
import { UNIT_OF_MEASURE_REPOSITORY } from './domain/repositories/unit-of-measure.repository';
import { CreateUnitOfMeasureUseCase } from './application/use-cases/create-unit-of-measure.use-case';
import { ListUnitsOfMeasureUseCase } from './application/use-cases/list-units-of-measure.use-case';
import { GetUnitOfMeasureByIdUseCase } from './application/use-cases/get-unit-of-measure-by-id.use-case';
import { UpdateUnitOfMeasureUseCase } from './application/use-cases/update-unit-of-measure.use-case';
import { DeactivateUnitOfMeasureUseCase } from './application/use-cases/deactivate-unit-of-measure.use-case';
import { UnitsOfMeasureController } from './presentation/controllers/units-of-measure.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UnitOfMeasureOrmEntity])],
  controllers: [UnitsOfMeasureController],
  providers: [
    {
      provide: UNIT_OF_MEASURE_REPOSITORY,
      useClass: TypeOrmUnitOfMeasureRepository,
    },
    CreateUnitOfMeasureUseCase,
    ListUnitsOfMeasureUseCase,
    GetUnitOfMeasureByIdUseCase,
    UpdateUnitOfMeasureUseCase,
    DeactivateUnitOfMeasureUseCase,
  ],
  // Exported for ProductsModule, which validates unitOfMeasureId exists+active the same way it reaches CategoriesModule/BusinessesModule.
  exports: [UNIT_OF_MEASURE_REPOSITORY],
})
export class UnitsOfMeasureModule {}
