import { Inject, Injectable } from '@nestjs/common';
import { CASH_CONTROL_REPOSITORY } from '../../domain/repositories/cash-control.repository';
import type {
  CashBankDaySummary,
  CashControlRepository,
  CashCutPeriodRow,
  CashDateSummary,
  CashOperationalDayRow,
} from '../../domain/repositories/cash-control.repository';
import { guatemalaIsoDate } from '../../domain/policies/cash-control.policy';

/** A cut as shown on screen: an open cut carries its LIVE totals/system cash (read from the Kardex, never computed client-side). */
export interface CashCutPeriodView extends CashCutPeriodRow {
  liveSystemCash: number | null;
  liveTotalIn: number | null;
  liveTotalOut: number | null;
  liveMovementCount: number | null;
}

export type CashDayState = 'SIN_APERTURA' | 'ABIERTO' | 'CERRADO';

/** `GET /cash-control/position` — everything Control de Efectivo's main card and cut controls need, in one call. */
export interface CashPositionOutput {
  date: string;
  balance: number;
  lastSequence: number;
  lastMovementAt: Date | null;
  hasInitialBalance: boolean;
  dayState: CashDayState;
  day: CashOperationalDayRow | null;
  periods: CashCutPeriodView[];
  /** The open cut, wherever it is (it may belong to a previous day that was never finished). */
  openPeriod: CashCutPeriodView | null;
  /**
   * Daily indicators. Since migration 1760007300000 they belong to the
   * CURRENT BANK DAY (restart at every Agentes Bancarios opening); before
   * the first anchored opening they fall back to the calendar date.
   */
  summary: CashDateSummary;
  /** The current bank operational day the indicators belong to (`null` = calendar-date fallback). */
  bankDay: Omit<
    CashBankDaySummary,
    'buckets' | 'totalIn' | 'totalOut' | 'movementCount' | 'openingBalance'
  > | null;
  canCloseDay: boolean;
}

/**
 * "Consultar saldo físico actual" + "Consultar resumen por día". The balance
 * is the last `new_balance` of the official Kardex; the day summary groups
 * today's movements (America/Guatemala) by type. Nothing here writes.
 */
/** The identification part of a bank-day summary (without its totals). */
export function toBankDayHeader(
  day: CashBankDaySummary,
): NonNullable<CashPositionOutput['bankDay']> {
  return {
    businessDate: day.businessDate,
    dayOpeningId: day.dayOpeningId,
    agentDayStatus: day.agentDayStatus,
    startSequence: day.startSequence,
    endSequence: day.endSequence,
    isCurrent: day.isCurrent,
    openedAt: day.openedAt,
    openedByUsername: day.openedByUsername,
    source: day.source,
    closingBalance: day.closingBalance,
    lastMovementAt: day.lastMovementAt,
  };
}

@Injectable()
export class GetCashPositionUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
  ) {}

  async execute(
    date: string = guatemalaIsoDate(),
  ): Promise<CashPositionOutput> {
    const [balance, hasInitialBalance, day, summary, openRow, bankDay] =
      await Promise.all([
        this.repository.getBalance(),
        this.repository.hasInitialBalance(),
        this.repository.findDayByDate(date),
        this.repository.getDateSummary(date),
        this.repository.findOpenPeriod(),
        this.repository.getBankDaySummary(),
      ]);
    const periodRows = day
      ? await this.repository.findPeriodsByDay(day.id)
      : [];
    const periods = await Promise.all(
      periodRows.map((row) => this.toView(row, balance.balance)),
    );
    const openPeriod =
      periods.find((period) => period.status === 'ABIERTO') ??
      (openRow ? await this.toView(openRow, balance.balance) : null);

    return {
      date,
      balance: balance.balance,
      lastSequence: balance.lastSequence,
      lastMovementAt: balance.lastMovementAt,
      hasInitialBalance,
      dayState: !day ? 'SIN_APERTURA' : day.status,
      day,
      periods,
      openPeriod,
      // Bank-day indicators restart at each opening; the balance never does.
      summary: bankDay
        ? {
            openingBalance: bankDay.openingBalance,
            totalIn: bankDay.totalIn,
            totalOut: bankDay.totalOut,
            movementCount: bankDay.movementCount,
            buckets: bankDay.buckets,
          }
        : day
          ? { ...summary, openingBalance: day.openingSystemCash }
          : summary,
      bankDay: bankDay ? toBankDayHeader(bankDay) : null,
      canCloseDay:
        !!day &&
        day.status === 'ABIERTO' &&
        periods.length === 2 &&
        periods.every((period) => period.status === 'FINALIZADO'),
    };
  }

  private async toView(
    row: CashCutPeriodRow,
    balance: number,
  ): Promise<CashCutPeriodView> {
    if (row.status !== 'ABIERTO' || row.startSequence === null) {
      return {
        ...row,
        liveSystemCash: null,
        liveTotalIn: null,
        liveTotalOut: null,
        liveMovementCount: null,
      };
    }
    const totals = await this.repository.getRangeTotals(
      row.startSequence,
      null,
    );
    return {
      ...row,
      liveSystemCash: balance,
      liveTotalIn: totals.totalIn,
      liveTotalOut: totals.totalOut,
      liveMovementCount: totals.movementCount,
    };
  }
}
