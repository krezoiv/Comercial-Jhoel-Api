import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, SelectQueryBuilder } from 'typeorm';
import { RechargeCashBoxMovement } from '../../domain/entities/recharge-cash-box-movement.entity';
import {
  CashBoxDailyTotals,
  CashBoxMovementRow,
  FindCashBoxMovementsOptions,
  PaginatedCashBoxMovements,
  RechargeCashBoxMovementRepository,
  RegisterCashBoxMovementData,
} from '../../domain/repositories/recharge-cash-box-movement.repository';
import { InvalidMovementAmountError } from '../../domain/errors/invalid-movement-amount.error';
import { InvalidMovementConceptError } from '../../domain/errors/invalid-movement-concept.error';
import { WithdrawalExceedsBalanceError } from '../../domain/errors/withdrawal-exceeds-balance.error';
// The one deliberate cross-module reference in this module — `recharge_sales`
// is owned by `RechargesModule`'s own "Recargas Vendidas" feature, so its
// ORM entity class stays defined there. Registering it a SECOND time in
// this module's own `TypeOrmModule.forFeature(...)` (see
// `recharge-cash-box.module.ts`) is the exact same safe, documented pattern
// `DashboardModule`/`ReportsModule` already use to read `sales`/`purchases`/
// `recharge_daily_balances` without importing their owning modules wholesale
// — this module never writes to `recharge_sales`, only reads it.
import { RechargeSaleOrmEntity } from '../../../recharges/infrastructure/persistence/recharge-sale.orm-entity';
import { RechargeSimSaleOrmEntity } from './recharge-sim-sale.orm-entity';
import { RechargePurchaseOrmEntity } from './recharge-purchase.orm-entity';
import { RechargeSimPurchaseOrmEntity } from './recharge-sim-purchase.orm-entity';
import { RechargeCashBoxMovementOrmEntity } from './recharge-cash-box-movement.orm-entity';
import { RechargeCashBoxMovementMapper } from './recharge-cash-box-movement.mapper';

/**
 * Reads four already-existing, already-authoritative tables live — never a
 * copy — for every auto-sourced Caja Contable figure (see the migration's
 * own doc comment for why this design makes duplicate movements
 * structurally impossible). `recharge_cash_box_movements` is this
 * repository's own table to write to — holds BOTH manual movement types
 * ("Aporte a Caja" / "Salida de Ganancia"), distinguished by `movementType`.
 */
@Injectable()
export class TypeOrmRechargeCashBoxRepository
  implements RechargeCashBoxMovementRepository
{
  constructor(
    @InjectRepository(RechargeCashBoxMovementOrmEntity)
    private readonly movementRepository: Repository<RechargeCashBoxMovementOrmEntity>,
    @InjectRepository(RechargeSaleOrmEntity)
    private readonly rechargeSaleRepository: Repository<RechargeSaleOrmEntity>,
    @InjectRepository(RechargeSimSaleOrmEntity)
    private readonly simSaleRepository: Repository<RechargeSimSaleOrmEntity>,
    @InjectRepository(RechargePurchaseOrmEntity)
    private readonly rechargePurchaseRepository: Repository<RechargePurchaseOrmEntity>,
    @InjectRepository(RechargeSimPurchaseOrmEntity)
    private readonly simPurchaseRepository: Repository<RechargeSimPurchaseOrmEntity>,
  ) {}

  async registerMovement(
    data: RegisterCashBoxMovementData,
  ): Promise<RechargeCashBoxMovement> {
    let id: string;
    try {
      const rows = await this.movementRepository.manager.query<
        { register_recharge_cash_box_movement: string }[]
      >(
        'SELECT register_recharge_cash_box_movement($1, $2, $3, $4, $5)',
        [
          data.amount,
          data.movementType,
          data.businessDate,
          data.concept,
          data.userId,
        ],
      );
      id = rows[0].register_recharge_cash_box_movement;
    } catch (error) {
      throw this.translateCashBoxError(error);
    }
    return this.fetchOrThrow(id);
  }

  async voidMovement(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<RechargeCashBoxMovement> {
    await this.movementRepository.update(
      { id },
      {
        isVoided: true,
        voidedAt: new Date(),
        voidedByUserId: voidedBy,
        voidReason: reason,
      },
    );
    return this.fetchOrThrow(id);
  }

  async findById(id: string): Promise<RechargeCashBoxMovement | null> {
    const orm = await this.movementRepository.findOne({ where: { id } });
    return orm ? RechargeCashBoxMovementMapper.toDomain(orm) : null;
  }

  private async fetchOrThrow(id: string): Promise<RechargeCashBoxMovement> {
    const movement = await this.findById(id);
    if (!movement) {
      throw new InternalServerErrorException(
        'No se pudo recuperar el movimiento de caja recién registrado.',
      );
    }
    return movement;
  }

  async getDailyTotals(options: {
    beforeDate?: string;
    onDate?: string;
  }): Promise<CashBoxDailyTotals> {
    const { beforeDate, onDate } = options;

    const applyDateFilter = <T extends object>(
      qb: SelectQueryBuilder<T>,
      column: string,
    ) => {
      // `.andWhere`, never `.where` — the movements branches below already
      // have their own `.andWhere('isVoided = false')`/`movementType`
      // conditions applied BEFORE this runs, and TypeORM's `.where()`
      // resets/replaces the whole WHERE clause rather than combining with
      // it. Using `.where()` here would silently drop those conditions —
      // caught live once already while testing the void flow (balance
      // didn't restore after voiding a withdrawal).
      if (onDate) {
        qb.andWhere(`${column} = :onDate`, { onDate });
      } else if (beforeDate) {
        qb.andWhere(`${column} < :beforeDate`, { beforeDate });
      }
      return qb;
    };

    const [
      salesRecharges,
      salesSim,
      purchasesRecharges,
      purchasesSim,
      contributions,
      withdrawals,
    ] = await Promise.all([
      applyDateFilter(
        this.rechargeSaleRepository
          .createQueryBuilder('sale')
          .select('COALESCE(SUM(sale.amount), 0)', 'total'),
        'sale.date',
      ).getRawOne<{ total: string }>(),
      applyDateFilter(
        this.simSaleRepository
          .createQueryBuilder('sale')
          .select('COALESCE(SUM(sale.totalAmount), 0)', 'total'),
        'sale.saleDate',
      ).getRawOne<{ total: string }>(),
      applyDateFilter(
        this.rechargePurchaseRepository
          .createQueryBuilder('purchase')
          .select('COALESCE(SUM(purchase.amount), 0)', 'total')
          .andWhere('purchase.isVoided = false'),
        'purchase.purchaseDate',
      ).getRawOne<{ total: string }>(),
      applyDateFilter(
        this.simPurchaseRepository
          .createQueryBuilder('purchase')
          .select('COALESCE(SUM(purchase.totalCost), 0)', 'total'),
        'purchase.purchaseDate',
      ).getRawOne<{ total: string }>(),
      applyDateFilter(
        this.movementRepository
          .createQueryBuilder('movement')
          .select('COALESCE(SUM(movement.amount), 0)', 'total')
          .andWhere('movement.isVoided = false')
          .andWhere("movement.movementType = 'CONTRIBUTION'"),
        'movement.businessDate',
      ).getRawOne<{ total: string }>(),
      applyDateFilter(
        this.movementRepository
          .createQueryBuilder('movement')
          .select('COALESCE(SUM(movement.amount), 0)', 'total')
          .andWhere('movement.isVoided = false')
          .andWhere("movement.movementType = 'WITHDRAWAL'"),
        'movement.businessDate',
      ).getRawOne<{ total: string }>(),
    ]);

    return {
      salesRecharges: parseFloat(salesRecharges?.total ?? '0'),
      salesSim: parseFloat(salesSim?.total ?? '0'),
      purchasesRecharges: parseFloat(purchasesRecharges?.total ?? '0'),
      purchasesSim: parseFloat(purchasesSim?.total ?? '0'),
      contributions: parseFloat(contributions?.total ?? '0'),
      withdrawals: parseFloat(withdrawals?.total ?? '0'),
    };
  }

  /**
   * Builds the unified movement stream as a `UNION ALL` across the four
   * live source tables plus non-voided manual movements (contributions AND
   * withdrawals, both read from the same `recharge_cash_box_movements`
   * table, split into two branches by `movement_type` so each keeps its
   * own concept/label), grouped by (date, category) for the four
   * auto-sourced ones — a single day's worth of, say, a dozen individual
   * electronic recharges becomes one "Ventas de Recargas" row, matching
   * the ticket's own example table — while each manual movement keeps its
   * own row (already a discrete, deliberate action).
   *
   * The running "saldo" column is computed with a window function over the
   * FULL unfiltered movement history first (in the `running` CTE), and only
   * THEN is the date-range/type filter and pagination applied — so the
   * balance shown on any given row is always the true, global accumulated
   * Caja balance at that point in time, never scoped to whatever the
   * caller happened to filter for. Raw SQL (not QueryBuilder) because this
   * crosses five different tables/entities with a window function — the
   * same category of read this codebase already reaches for raw SQL for
   * (e.g. `RoleRepository.countUsersByRoleId`, Reports' own correlated
   * subqueries).
   */
  async findMovements(
    options: FindCashBoxMovementsOptions,
  ): Promise<PaginatedCashBoxMovements> {
    const offset = (options.page - 1) * options.limit;

    const baseQuery = `
      WITH movements AS (
        SELECT
          sale.sale_date AS date,
          'RECHARGE_SALE' AS type,
          1 AS type_order,
          'Ventas de Recargas' AS concept,
          SUM(sale.amount) AS income,
          0::numeric AS expense,
          NULL::uuid AS movement_id,
          NULL::varchar AS username
        FROM recharge_sales sale
        GROUP BY sale.sale_date

        UNION ALL

        SELECT
          sale.sale_date, 'SIM_SALE', 2, 'Ventas de SIM', SUM(sale.total_amount), 0, NULL, NULL
        FROM recharge_sim_sales sale
        GROUP BY sale.sale_date

        UNION ALL

        SELECT
          purchase.purchase_date, 'RECHARGE_PURCHASE', 3, 'Compra de Recargas', 0, SUM(purchase.amount), NULL, NULL
        FROM recharge_purchases purchase
        WHERE purchase.is_voided = false
        GROUP BY purchase.purchase_date

        UNION ALL

        SELECT
          purchase.purchase_date, 'SIM_PURCHASE', 4, 'Compra de SIM', 0, SUM(purchase.total_cost), NULL, NULL
        FROM recharge_sim_purchases purchase
        GROUP BY purchase.purchase_date

        UNION ALL

        SELECT
          m.business_date, 'CONTRIBUTION', 5, m.concept, m.amount, 0, m.id, u.username
        FROM recharge_cash_box_movements m
        JOIN users u ON u.id = m.created_by
        WHERE m.is_voided = false AND m.movement_type = 'CONTRIBUTION'

        UNION ALL

        SELECT
          m.business_date, 'PROFIT_WITHDRAWAL', 6, m.concept, 0, m.amount, m.id, u.username
        FROM recharge_cash_box_movements m
        JOIN users u ON u.id = m.created_by
        WHERE m.is_voided = false AND m.movement_type = 'WITHDRAWAL'
      ),
      running AS (
        SELECT
          date,
          type,
          type_order,
          concept,
          income,
          expense,
          movement_id,
          username,
          SUM(income - expense) OVER (
            ORDER BY date, type_order, movement_id NULLS FIRST
          ) AS balance
        FROM movements
      )
      SELECT * FROM running
      WHERE ($1::date IS NULL OR date >= $1)
        AND ($2::date IS NULL OR date <= $2)
        AND ($3::varchar IS NULL OR type = $3)
    `;

    const params: unknown[] = [
      options.startDate ?? null,
      options.endDate ?? null,
      options.type ?? null,
    ];

    const [rows, countRows] = await Promise.all([
      this.movementRepository.manager.query<
        {
          date: string;
          type: CashBoxMovementRow['type'];
          concept: string;
          income: string;
          expense: string;
          movement_id: string | null;
          username: string | null;
          balance: string;
        }[]
      >(
        `${baseQuery} ORDER BY date DESC, type_order DESC, movement_id NULLS LAST LIMIT $4 OFFSET $5`,
        [...params, options.limit, offset],
      ),
      this.movementRepository.manager.query<{ total: string }[]>(
        `SELECT COUNT(*) AS total FROM (${baseQuery}) filtered`,
        params,
      ),
    ]);

    const items: CashBoxMovementRow[] = rows.map((row) => ({
      date: row.date,
      type: row.type,
      concept: row.concept,
      income: parseFloat(row.income),
      expense: parseFloat(row.expense),
      balance: parseFloat(row.balance),
      username: row.username,
      movementId: row.movement_id,
    }));

    return {
      items,
      total: parseInt(countRows[0]?.total ?? '0', 10),
      page: options.page,
      limit: options.limit,
    };
  }

  /** Same `RAISE EXCEPTION '<CODE>'` → domain-error translation pattern as `translateBankDepositError`/`translatePurchaseError` — see those methods' own doc comments. */
  private translateCashBoxError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;

    const [code] = message.split(':');

    switch (code) {
      case 'INVALID_WITHDRAWAL_AMOUNT':
        return new InvalidMovementAmountError();
      case 'INVALID_WITHDRAWAL_CONCEPT':
        return new InvalidMovementConceptError();
      case 'WITHDRAWAL_EXCEEDS_BALANCE':
        return new WithdrawalExceedsBalanceError();
      default:
        return error;
    }
  }
}
