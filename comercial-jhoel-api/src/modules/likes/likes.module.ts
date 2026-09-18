import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogLikeOrmEntity } from './infrastructure/persistence/catalog-like.orm-entity';
import { TypeOrmCatalogLikeRepository } from './infrastructure/persistence/typeorm-catalog-like.repository';
import { CATALOG_LIKE_REPOSITORY } from './domain/repositories/catalog-like.repository';

/**
 * Almacenamiento genérico de "me gusta", compartido por `catalog`
 * (teléfonos), `product-catalog` (Librería/Variedades) y `news` — ver el
 * doc comment de `CatalogLikeRepository`. Sin controller propio: cada
 * módulo dueño del ítem expone sus propias rutas `/like`/`/unlike`
 * públicas, validando existencia/visibilidad antes de delegar aquí.
 */
@Module({
  imports: [TypeOrmModule.forFeature([CatalogLikeOrmEntity])],
  providers: [
    {
      provide: CATALOG_LIKE_REPOSITORY,
      useClass: TypeOrmCatalogLikeRepository,
    },
  ],
  exports: [CATALOG_LIKE_REPOSITORY],
})
export class LikesModule {}
