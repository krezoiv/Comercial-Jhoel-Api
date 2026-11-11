import { Module } from '@nestjs/common';
import { FINANCIAL_DAY_REVIEW_REPOSITORY } from './domain/repositories/financial-day-review.repository';
import { TypeOrmFinancialDayReviewRepository } from './infrastructure/persistence/typeorm-financial-day-review.repository';
import {
  AdjustFinancialDayMovementUseCase,
  CloseFinancialDayReviewUseCase,
  CorrectFinancialDaySnapshotUseCase,
  GetFinancialDayReviewSessionUseCase,
  GetFinancialDayReviewUseCase,
  ListFinancialDayCorrectionsUseCase,
  ListFinancialDaysUseCase,
  OpenFinancialDayReviewUseCase,
  RequestFinancialDayReviewCloseUseCase,
} from './application/use-cases/financial-day-review.use-cases';
import { FinancialDayReviewController } from './presentation/controllers/financial-day-review.controller';

/**
 * "Revisión de días operativos" — audited review mode for one past
 * operational day (diagnosis, isolated corrections, close). Raw SQL over the
 * existing financial tables; all writes go through the PostgreSQL functions
 * of migration 1760007100000.
 */
@Module({
  controllers: [FinancialDayReviewController],
  providers: [
    {
      provide: FINANCIAL_DAY_REVIEW_REPOSITORY,
      useClass: TypeOrmFinancialDayReviewRepository,
    },
    ListFinancialDaysUseCase,
    GetFinancialDayReviewUseCase,
    OpenFinancialDayReviewUseCase,
    CorrectFinancialDaySnapshotUseCase,
    AdjustFinancialDayMovementUseCase,
    RequestFinancialDayReviewCloseUseCase,
    CloseFinancialDayReviewUseCase,
    ListFinancialDayCorrectionsUseCase,
    GetFinancialDayReviewSessionUseCase,
  ],
})
export class FinancialDayReviewModule {}
