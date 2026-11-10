import { Inject, Injectable } from '@nestjs/common';
import { CASH_CONTROL_REPOSITORY } from '../../domain/repositories/cash-control.repository';
import type {
  CashBalanceSnapshot,
  CashBankBalance,
  CashControlRepository,
  CashMovementRow,
  CashUserOption,
  FindCashMovementsOptions,
  PaginatedCashMovements,
} from '../../domain/repositories/cash-control.repository';
import { cashControlError } from '../../domain/errors/cash-control.errors';

/** "Consultar saldo físico actual" (lightweight) — polled by every screen that shows cash to detect changes made elsewhere. */
@Injectable()
export class GetCashBalanceUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
  ) {}

  execute(): Promise<CashBalanceSnapshot> {
    return this.repository.getBalance();
  }
}

/** "Consultar Kardex de efectivo" — newest first, filterable by date range, type, direction, user and cut. */
@Injectable()
export class ListCashMovementsUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
  ) {}

  async execute(
    options: Partial<FindCashMovementsOptions>,
  ): Promise<PaginatedCashMovements> {
    if (
      options.dateFrom &&
      options.dateTo &&
      options.dateFrom > options.dateTo
    ) {
      throw cashControlError('CASH_INVALID_DATE_RANGE');
    }
    return this.repository.findMovements({
      ...options,
      page: Math.max(1, options.page ?? 1),
      limit: Math.min(200, Math.max(1, options.limit ?? 25)),
    });
  }
}

/**
 * "Consultar últimos 10 movimientos" — backs Transaccionar's "Últimas
 * transacciones" card. Includes operations with no cash effect (NONE) so the
 * card can show them grey; `newBalance` is the official balance after each one.
 */
@Injectable()
export class GetRecentCashMovementsUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
  ) {}

  execute(limit = 10): Promise<CashMovementRow[]> {
    return this.repository.findRecentMovements(
      Math.min(50, Math.max(1, limit)),
    );
  }
}

@Injectable()
export class GetCashMovementUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
  ) {}

  async execute(id: string): Promise<CashMovementRow> {
    const movement = await this.repository.findMovementById(id);
    if (!movement) {
      throw cashControlError('CASH_MOVEMENT_NOT_FOUND');
    }
    return movement;
  }
}

/** Users that appear in the Kardex or the cuts — options for the "Usuario" filters. */
@Injectable()
export class ListCashUsersUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
  ) {}

  execute(): Promise<CashUserOption[]> {
    return this.repository.findUsers();
  }
}

/** Current balance of every active bank account — pre-fills the bank reconciliation of a cut. */
@Injectable()
export class GetCashBankBalancesUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
  ) {}

  execute(): Promise<CashBankBalance[]> {
    return this.repository.getBankBalances();
  }
}
