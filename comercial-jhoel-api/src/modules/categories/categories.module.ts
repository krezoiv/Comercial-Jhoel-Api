import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryOrmEntity } from './infrastructure/persistence/category.orm-entity';
import { TypeOrmCategoryRepository } from './infrastructure/persistence/typeorm-category.repository';
import { CATEGORY_REPOSITORY } from './domain/repositories/category.repository';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { ListCategoriesUseCase } from './application/use-cases/list-categories.use-case';
import { GetCategoryByIdUseCase } from './application/use-cases/get-category-by-id.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { DeactivateCategoryUseCase } from './application/use-cases/deactivate-category.use-case';
import { CategoriesController } from './presentation/controllers/categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryOrmEntity])],
  controllers: [CategoriesController],
  providers: [
    { provide: CATEGORY_REPOSITORY, useClass: TypeOrmCategoryRepository },
    CreateCategoryUseCase,
    ListCategoriesUseCase,
    GetCategoryByIdUseCase,
    UpdateCategoryUseCase,
    DeactivateCategoryUseCase,
  ],
  exports: [CATEGORY_REPOSITORY],
})
export class CategoriesModule {}
