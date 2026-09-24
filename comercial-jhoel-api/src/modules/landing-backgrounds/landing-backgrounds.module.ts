import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandingBackgroundOrmEntity } from './infrastructure/persistence/landing-background.orm-entity';
import { TypeOrmLandingBackgroundRepository } from './infrastructure/persistence/typeorm-landing-background.repository';
import { LANDING_BACKGROUND_REPOSITORY } from './domain/repositories/landing-background.repository';
import { CreateLandingBackgroundUseCase } from './application/use-cases/create-landing-background.use-case';
import { UpdateLandingBackgroundUseCase } from './application/use-cases/update-landing-background.use-case';
import { ListLandingBackgroundsUseCase } from './application/use-cases/list-landing-backgrounds.use-case';
import { GetLandingBackgroundByIdUseCase } from './application/use-cases/get-landing-background-by-id.use-case';
import { SetLandingBackgroundActiveUseCase } from './application/use-cases/set-landing-background-active.use-case';
import { SetLandingBackgroundImageUseCase } from './application/use-cases/set-landing-background-image.use-case';
import { RemoveLandingBackgroundImageUseCase } from './application/use-cases/remove-landing-background-image.use-case';
import { ListPublishedLandingBackgroundsUseCase } from './application/use-cases/list-published-landing-backgrounds.use-case';
import { GetLandingBackgroundImageUseCase } from './application/use-cases/get-landing-background-image.use-case';
import { LandingBackgroundsController } from './presentation/controllers/landing-backgrounds.controller';
import { PublicLandingBackgroundsController } from './presentation/controllers/public-landing-backgrounds.controller';

/**
 * "Fondos de Landing" — capas visuales de profundidad (marca de agua +
 * parallax + iluminación + 3D) asignadas a una sección real de la landing
 * pública. Completamente independiente de los catálogos de contenido
 * (Teléfonos/Librería/Variedades/Bancos/Noticias) — nunca comparte tabla
 * ni lógica con ellos, aunque reutiliza el mismo patrón BYTEA de imagen
 * que todos ya usan.
 */
@Module({
  imports: [TypeOrmModule.forFeature([LandingBackgroundOrmEntity])],
  controllers: [LandingBackgroundsController, PublicLandingBackgroundsController],
  providers: [
    { provide: LANDING_BACKGROUND_REPOSITORY, useClass: TypeOrmLandingBackgroundRepository },
    CreateLandingBackgroundUseCase,
    UpdateLandingBackgroundUseCase,
    ListLandingBackgroundsUseCase,
    GetLandingBackgroundByIdUseCase,
    SetLandingBackgroundActiveUseCase,
    SetLandingBackgroundImageUseCase,
    RemoveLandingBackgroundImageUseCase,
    ListPublishedLandingBackgroundsUseCase,
    GetLandingBackgroundImageUseCase,
  ],
})
export class LandingBackgroundsModule {}
