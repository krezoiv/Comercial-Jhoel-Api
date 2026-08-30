import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients/clients.module';
import { AssetOrmEntity } from './infrastructure/persistence/asset.orm-entity';
import { TypeOrmAssetRepository } from './infrastructure/persistence/typeorm-asset.repository';
import { ASSET_REPOSITORY } from './domain/repositories/asset.repository';
import { CreateAssetUseCase } from './application/use-cases/create-asset.use-case';
import { ListAssetsUseCase } from './application/use-cases/list-assets.use-case';
import { GetAssetByIdUseCase } from './application/use-cases/get-asset-by-id.use-case';
import { UpdateAssetUseCase } from './application/use-cases/update-asset.use-case';
import { DeactivateAssetUseCase } from './application/use-cases/deactivate-asset.use-case';
import { AssetsController } from './presentation/controllers/assets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AssetOrmEntity]), ClientsModule],
  controllers: [AssetsController],
  providers: [
    {
      provide: ASSET_REPOSITORY,
      useClass: TypeOrmAssetRepository,
    },
    CreateAssetUseCase,
    ListAssetsUseCase,
    GetAssetByIdUseCase,
    UpdateAssetUseCase,
    DeactivateAssetUseCase,
  ],
  // Exported for ReportsModule's Activos report: ASSET_REPOSITORY backs its own summary
  // use case, and ListAssetsUseCase is reused directly for the report's list endpoint —
  // identical filtering/pagination, no reason to duplicate it. Same reuse-over-duplicate
  // reasoning as RechargesModule's own exports.
  exports: [ASSET_REPOSITORY, ListAssetsUseCase],
})
export class AssetsModule {}
