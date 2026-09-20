import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SITE_VISITS_REPOSITORY } from './domain/repositories/site-visits.repository';
import { SiteVisitsOrmEntity } from './infrastructure/persistence/site-visits.orm-entity';
import { TypeOrmSiteVisitsRepository } from './infrastructure/persistence/typeorm-site-visits.repository';
import { RegisterVisitUseCase } from './application/use-cases/register-visit.use-case';
import { GetVisitCountUseCase } from './application/use-cases/get-visit-count.use-case';
import { PublicSiteVisitsController } from './presentation/controllers/public-site-visits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SiteVisitsOrmEntity])],
  controllers: [PublicSiteVisitsController],
  providers: [
    { provide: SITE_VISITS_REPOSITORY, useClass: TypeOrmSiteVisitsRepository },
    RegisterVisitUseCase,
    GetVisitCountUseCase,
  ],
})
export class SiteVisitsModule {}
