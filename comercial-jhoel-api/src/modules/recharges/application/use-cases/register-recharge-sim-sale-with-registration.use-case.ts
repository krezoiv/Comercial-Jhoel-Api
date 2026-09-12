import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_MANAGER } from '../../../../shared/application/ports/transaction-manager.port';
import type { TransactionManager } from '../../../../shared/application/ports/transaction-manager.port';
import { RECHARGE_SIM_DAILY_STOCK_REPOSITORY } from '../../domain/repositories/recharge-sim-daily-stock.repository';
import type { RechargeSimDailyStockRepository } from '../../domain/repositories/recharge-sim-daily-stock.repository';
import { RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY } from '../../domain/repositories/recharge-sim-sale-registration.repository';
import type { RechargeSimSaleRegistrationRepository } from '../../domain/repositories/recharge-sim-sale-registration.repository';
import { RECHARGE_DAY_OPENING_REPOSITORY } from '../../domain/repositories/recharge-day-opening.repository';
import type { RechargeDayOpeningRepository } from '../../domain/repositories/recharge-day-opening.repository';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import { assertRechargeDayWritable } from '../utils/assert-recharge-day-writable';
import { assertValidDpiImage, UploadedDpiImage } from '../utils/assert-valid-dpi-image';
import {
  RechargeSimSaleRegistrationOutput,
  toRechargeSimSaleRegistrationOutput,
} from '../dtos/recharge-sim-sale-registration-output';

export interface RegisterRechargeSimSaleWithRegistrationInput {
  simTypeId: string;
  simNumber: string;
  sku: string;
  clientDpi: string;
  clientId: string | null;
  salePrice: number;
  /** `yyyy-MM-dd` — the operation-date picker's current value, not necessarily today. */
  operationDate: string;
  userId: string;
  dpiImage: UploadedDpiImage | null;
}

/**
 * "Venta de SIM con registro de identidad" — registers exactly ONE physical
 * SIM (always `quantity=1` on the underlying `recharge_sim_sales` row) and
 * its identity-capture record in a single database transaction, via
 * `TransactionManager` (the same port built for Transaccionar's "Enviar a
 * cuentas por cobrar"): if the DPI image fails validation or either insert
 * fails, nothing is left half-written — no sale without its registration,
 * no orphaned image. See `AddRechargeSimSaleRegistrations`'s own migration
 * doc comment for why this is additive to, never a replacement for, the
 * existing by-quantity "Vender SIM" flow.
 */
@Injectable()
export class RegisterRechargeSimSaleWithRegistrationUseCase {
  constructor(
    @Inject(RECHARGE_SIM_DAILY_STOCK_REPOSITORY)
    private readonly dailyStockRepository: RechargeSimDailyStockRepository,
    @Inject(RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY)
    private readonly registrationRepository: RechargeSimSaleRegistrationRepository,
    @Inject(RECHARGE_DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: RechargeDayOpeningRepository,
    @Inject(TRANSACTION_MANAGER)
    private readonly transactionManager: TransactionManager,
  ) {}

  async execute(
    input: RegisterRechargeSimSaleWithRegistrationInput,
  ): Promise<RechargeSimSaleRegistrationOutput> {
    assertValidOperationDate(input.operationDate);
    await assertRechargeDayWritable(this.dayOpeningRepository, input.operationDate);

    if (input.dpiImage) {
      assertValidDpiImage(input.dpiImage);
    }

    const registration = await this.transactionManager.runInTransaction(async (context) => {
      const saleId = await this.dailyStockRepository.registerSingleUnitSale(
        { simTypeId: input.simTypeId, date: input.operationDate, userId: input.userId },
        context,
      );

      let dpiImageId: string | null = null;
      if (input.dpiImage) {
        dpiImageId = await this.registrationRepository.saveDpiImage(
          input.dpiImage.buffer,
          input.dpiImage.mimetype,
          input.userId,
          context,
        );
      }

      return this.registrationRepository.create(
        {
          rechargeSimSaleId: saleId,
          simNumber: input.simNumber,
          sku: input.sku,
          clientDpi: input.clientDpi,
          clientId: input.clientId,
          salePrice: input.salePrice,
          dpiImageId,
          saleDate: input.operationDate,
          userId: input.userId,
        },
        context,
      );
    });

    return toRechargeSimSaleRegistrationOutput(registration);
  }
}
