import { Module } from '@nestjs/common';
import { BanksModule } from '../banks/banks.module';
import { PAYMENT_GROUP_USE_CASES } from './application/use-cases/payment-group.use-cases';
import { PAYMENT_GROUP_REPOSITORY } from './domain/repositories/payment-group.repository';
import { TypeOrmPaymentGroupRepository } from './infrastructure/persistence/typeorm-payment-group.repository';
import { PaymentGroupsController } from './presentation/controllers/payment-groups.controller';

/** Pagos grupales (migration 1760009400000). `BanksModule` provides the business-day cycle (DAY_OPENING_REPOSITORY). */
@Module({
  imports: [BanksModule],
  controllers: [PaymentGroupsController],
  providers: [
    {
      provide: PAYMENT_GROUP_REPOSITORY,
      useClass: TypeOrmPaymentGroupRepository,
    },
    ...PAYMENT_GROUP_USE_CASES,
  ],
})
export class PaymentGroupsModule {}
