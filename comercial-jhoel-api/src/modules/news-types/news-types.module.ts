import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsTypeOrmEntity } from './infrastructure/persistence/news-type.orm-entity';
import { TypeOrmNewsTypeRepository } from './infrastructure/persistence/typeorm-news-type.repository';
import { NEWS_TYPE_REPOSITORY } from './domain/repositories/news-type.repository';
import { CreateNewsTypeUseCase } from './application/use-cases/create-news-type.use-case';
import { ListNewsTypesUseCase } from './application/use-cases/list-news-types.use-case';
import { ListActiveNewsTypesUseCase } from './application/use-cases/list-active-news-types.use-case';
import { GetNewsTypeByIdUseCase } from './application/use-cases/get-news-type-by-id.use-case';
import { UpdateNewsTypeUseCase } from './application/use-cases/update-news-type.use-case';
import { DeactivateNewsTypeUseCase } from './application/use-cases/deactivate-news-type.use-case';
import { ReorderNewsTypesUseCase } from './application/use-cases/reorder-news-types.use-case';
import { NewsTypesController } from './presentation/controllers/news-types.controller';

/**
 * "Tipos de Noticias" — catálogo maestro configurable y extensible (nunca
 * un enum rígido en código). `NewsModule` lo importa para validar
 * `newsTypeId` al crear/editar una noticia; `NewsSubscriptionsModule` lo
 * importa para el formulario público de suscripción y para resolver el
 * wildcard "Comercial" al determinar destinatarios.
 */
@Module({
  imports: [TypeOrmModule.forFeature([NewsTypeOrmEntity])],
  controllers: [NewsTypesController],
  providers: [
    { provide: NEWS_TYPE_REPOSITORY, useClass: TypeOrmNewsTypeRepository },
    CreateNewsTypeUseCase,
    ListNewsTypesUseCase,
    ListActiveNewsTypesUseCase,
    GetNewsTypeByIdUseCase,
    UpdateNewsTypeUseCase,
    DeactivateNewsTypeUseCase,
    ReorderNewsTypesUseCase,
  ],
  exports: [NEWS_TYPE_REPOSITORY, ListActiveNewsTypesUseCase],
})
export class NewsTypesModule {}
