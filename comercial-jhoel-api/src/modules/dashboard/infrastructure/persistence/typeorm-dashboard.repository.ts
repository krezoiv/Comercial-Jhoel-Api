import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaleOrmEntity } from '../../../sales/infrastructure/persistence/sale.orm-entity';
import { PurchaseOrmEntity } from '../../../purchases/infrastructure/persistence/purchase.orm-entity';
import { RechargeDailyBalanceOrmEntity } from '../../../recharges/infrastructure/persistence/recharge-daily-balance.orm-entity';
import { BankDepositOperationOrmEntity } from '../../../bank-deposits/infrastructure/persistence/bank-deposit-operation.orm-entity';
import {
  BankTransactionRow,
  DailyAmountRow,
  DashboardPeriodRange,
  DashboardRawSummary,
  DashboardRepository,
} from '../../domain/repositories/dashboard.repository';

/**
 * Pure read-side, cross-cutting — same architectural precedent as
 * `ReportsModule` (see its own doc comment): never writes to
 * `sales`/`purchases`/`recharge_daily_balances`/`bank_deposit_operations`,
 * only queries them, via its own `TypeOrmModule.forFeature(...)`
 * registration of their existing ORM entities rather than importing
 * `SalesModule`/`PurchasesModule`/`RechargesModule`/`BankDepositsModule`
 * wholesale — no new tables, no changes to any of those modules' own
 * write paths.
 */
@Injectable()
export class TypeOrmDashboardRepository implements DashboardRepository {
  constructor(
    @InjectRepository(SaleOrmEntity)
    private readonly saleRepository: Repository<SaleOrmEntity>,
    @InjectRepository(PurchaseOrmEntity)
    private readonly purchaseRepository: Repository<PurchaseOrmEntity>,
    @InjectRepository(RechargeDailyBalanceOrmEntity)
    private readonly rechargeDailyBalanceRepository: Repository<RechargeDailyBalanceOrmEntity>,
    @InjectRepository(BankDepositOperationOrmEntity)
    private readonly bankDepositOperationRepository: Repository<BankDepositOperationOrmEntity>,
  ) {}

  async getSummary(period: DashboardPeriodRange): Promise<DashboardRawSummary> {
    const [
      rechargeSalesByDay,
      salesByDay,
      purchasesTotal,
      bankTransactionsByBank,
    ] = await Promise.all([
      this.getRechargeSalesByDay(period),
      this.getSalesByDay(period),
      this.getPurchasesTotal(period),
      this.getBankTransactionsByBank(period),
    ]);

    return {
      rechargeSalesByDay,
      salesByDay,
      purchasesTotal,
      bankTransactionsByBank,
    };
  }

  /**
   * "Venta" for one (tipo, fecha, ciclo) is `daily_balance - final_balance`,
   * only once `final_balance` is actually set — an unclosed cycle has no
   * defined sale yet, same reasoning `GetRechargeSalesSummaryUseCase`
   * already uses for its own live "today" figure (never the frozen
   * `recharge_sales_closures.total_sales`, which would go stale the moment
   * a `finalBalance` is corrected after the fact). Summed across every
   * recharge type AND every cuadre cycle for that date — a date closed
   * twice in one day (see "Cuadre cycles" in the backend's own module
   * history) correctly contributes both cycles' sale to that one day's
   * total, not just the latest.
   */
  private async getRechargeSalesByDay(
    period: DashboardPeriodRange,
  ): Promise<DailyAmountRow[]> {
    // `to_char`, not a raw `balance.date` select — confirmed directly (not
    // assumed) against the real dev DB: a raw, unmapped `getRawMany()`
    // column has no TypeORM column metadata to hint the driver's type
    // parser the way an entity-mapped `find()` read does (see
    // `RechargeDailyBalanceOrmEntity`'s own doc comment on this), so the
    // `date` OID came back as a JS `Date` object at a shifted UTC instant
    // (`2026-09-02T06:00:00.000Z` for the calendar day `2026-09-02`) instead
    // of the plain `yyyy-MM-dd` string every other date in this codebase
    // uses. `to_char` sidesteps the ambiguity entirely by returning text.
    const dateExpr = "to_char(balance.date, 'YYYY-MM-DD')";
    const rows = await this.rechargeDailyBalanceRepository
      .createQueryBuilder('balance')
      .select(dateExpr, 'date')
      .addSelect('SUM(balance.dailyBalance - balance.finalBalance)', 'amount')
      .where('balance.finalBalance IS NOT NULL')
      .andWhere('balance.date >= :startDate', {
        startDate: period.isoStartDate,
      })
      .andWhere('balance.date <= :endDate', { endDate: period.isoEndDate })
      .groupBy(dateExpr)
      .getRawMany<{ date: string; amount: string }>();

    return rows.map((row) => ({
      date: row.date,
      amount: parseFloat(row.amount),
    }));
  }

  /**
   * Only `CONFIRMED` sales — an `OPEN` draft receipt is never a completed
   * sale, same hardcoded filter `TypeOrmSaleRepository.findAll` already
   * applies to its own history listing. Grouped via `to_char(...)` rather
   * than `DATE(...)`: a raw, unmapped query-builder expression has no
   * TypeORM column metadata to hint the driver's type parser, and
   * `to_char` guarantees a plain string back regardless — the DB session's
   * own `America/Guatemala` timezone (see migration
   * `1759100000000-SetDatabaseTimezone`) is what makes the formatted date
   * land on the correct Guatemala calendar day for a `timestamptz` value.
   */
  private async getSalesByDay(
    period: DashboardPeriodRange,
  ): Promise<DailyAmountRow[]> {
    const dateExpr = "to_char(sale.saleDate, 'YYYY-MM-DD')";
    const rows = await this.saleRepository
      .createQueryBuilder('sale')
      .select(dateExpr, 'date')
      .addSelect('SUM(sale.total)', 'amount')
      .where('sale.status = :status', { status: 'CONFIRMED' })
      .andWhere('sale.saleDate >= :dayStart', { dayStart: period.dayStart })
      .andWhere('sale.saleDate <= :dayEnd', { dayEnd: period.dayEnd })
      .groupBy(dateExpr)
      .getRawMany<{ date: string; amount: string }>();

    return rows.map((row) => ({
      date: row.date,
      amount: parseFloat(row.amount),
    }));
  }

  private async getPurchasesTotal(
    period: DashboardPeriodRange,
  ): Promise<number> {
    const raw = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .select('COALESCE(SUM(purchase.total), 0)', 'total')
      .where('purchase.purchaseDate >= :dayStart', {
        dayStart: period.dayStart,
      })
      .andWhere('purchase.purchaseDate <= :dayEnd', { dayEnd: period.dayEnd })
      .getRawOne<{ total: string }>();

    return parseFloat(raw?.total ?? '0');
  }

  /**
   * Excludes anuladas (`isVoided = false`) — the same reasoning
   * `TypeOrmBankDepositRepository.getReportSummary()` already documents: a
   * dashboard total is about real, standing operations, not everything
   * ever registered. `operationDate` is a plain `date` column, so the
   * lexicographic `yyyy-MM-dd` comparison is already correct, no
   * `to_char`/`DATE()` needed here.
   */
  private async getBankTransactionsByBank(
    period: DashboardPeriodRange,
  ): Promise<BankTransactionRow[]> {
    const rows = await this.bankDepositOperationRepository
      .createQueryBuilder('operation')
      .leftJoin('operation.transactionBank', 'transactionBank')
      .select('operation.transactionBankId', 'bankId')
      .addSelect('transactionBank.name', 'bankName')
      .addSelect('SUM(operation.transactionCount)', 'transactions')
      .where('operation.isVoided = false')
      .andWhere('operation.operationDate >= :startDate', {
        startDate: period.isoStartDate,
      })
      .andWhere('operation.operationDate <= :endDate', {
        endDate: period.isoEndDate,
      })
      .groupBy('operation.transactionBankId')
      .addGroupBy('transactionBank.name')
      .getRawMany<{ bankId: string; bankName: string; transactions: string }>();

    return rows.map((row) => ({
      bankId: row.bankId,
      bankName: row.bankName,
      transactions: parseInt(row.transactions, 10),
    }));
  }
}
