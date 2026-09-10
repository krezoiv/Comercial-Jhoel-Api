import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { RechargePurchase } from '../../domain/entities/recharge-purchase.entity';
import { RechargePurchaseRepository } from '../../domain/repositories/recharge-purchase.repository';
import { RechargePurchaseNotFoundError } from '../../domain/errors/recharge-purchase-not-found.error';
import { RechargePurchaseAlreadyVoidedError } from '../../domain/errors/recharge-purchase-already-voided.error';
import { RechargePurchaseCycleClosedError } from '../../domain/errors/recharge-purchase-cycle-closed.error';
import { InsufficientBalanceToRevertError } from '../../domain/errors/insufficient-balance-to-revert.error';
import { VoidReasonRequiredError } from '../../domain/errors/void-reason-required.error';
import { RechargePurchaseDayClosedError } from '../../domain/errors/recharge-purchase-day-closed.error';
import { RechargePurchaseFullOrmEntity } from './recharge-purchase-full.orm-entity';
import { RechargePurchaseMapper } from './recharge-purchase.mapper';

/** Same "current cycle only" subquery every other per-date Recargas listing in this repository family already uses (see `TypeOrmRechargeSaleRepository`'s own copy). */
const CURRENT_CYCLE_IDS_SUBQUERY = `
  SELECT DISTINCT ON (recharge_type_id) id
  FROM recharge_daily_balances
  WHERE date = :date
  ORDER BY recharge_type_id, sequence DESC
`;

@Injectable()
export class TypeOrmRechargePurchaseRepository
  implements RechargePurchaseRepository
{
  constructor(
    @InjectRepository(RechargePurchaseFullOrmEntity)
    private readonly repository: Repository<RechargePurchaseFullOrmEntity>,
  ) {}

  async findAllByDate(date: string): Promise<RechargePurchase[]> {
    const orms = await this.repository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.rechargeType', 'rechargeType')
      .leftJoinAndSelect('purchase.dailyBalance', 'dailyBalance')
      .leftJoinAndSelect('purchase.createdByUser', 'createdByUser')
      .leftJoinAndSelect('purchase.voidedByUser', 'voidedByUser')
      .where(`purchase.dailyBalanceId IN (${CURRENT_CYCLE_IDS_SUBQUERY})`, {
        date,
      })
      .orderBy('purchase.createdAt', 'DESC')
      .getMany();
    return orms.map((orm) => RechargePurchaseMapper.toDomain(orm));
  }

  async findById(id: string): Promise<RechargePurchase | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? RechargePurchaseMapper.toDomain(orm) : null;
  }

  async voidPurchase(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<RechargePurchase> {
    try {
      await this.repository.manager.query(
        'SELECT void_recharge_purchase($1, $2, $3)',
        [id, voidedBy, reason],
      );
    } catch (error) {
      throw this.translatePurchaseVoidError(error);
    }

    const purchase = await this.findById(id);
    if (!purchase) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la compra recién revertida.',
      );
    }
    return purchase;
  }

  /** Same `RAISE EXCEPTION '<CODE>:<id>'` → domain-error translation pattern as every other stored-function module in this codebase — see `translateBankDepositError`'s own doc comment. */
  private translatePurchaseVoidError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;

    const [code] = message.split(':');

    switch (code) {
      case 'VOID_REASON_REQUIRED':
        return new VoidReasonRequiredError();
      case 'PURCHASE_NOT_FOUND':
        return new RechargePurchaseNotFoundError();
      case 'PURCHASE_ALREADY_VOIDED':
        return new RechargePurchaseAlreadyVoidedError();
      case 'RECHARGE_DAY_CLOSED':
        return new RechargePurchaseDayClosedError();
      case 'PURCHASE_CYCLE_ALREADY_CLOSED':
        return new RechargePurchaseCycleClosedError();
      case 'INSUFFICIENT_BALANCE_TO_REVERT':
        return new InsufficientBalanceToRevertError();
      default:
        return error;
    }
  }
}
