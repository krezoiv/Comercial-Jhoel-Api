import { Observable } from 'rxjs';

import { PortfolioPaymentMethod, PortfolioRecordTrace } from './portfolio-trace.model';

export type KardexMovementType = 'CARGO' | 'ABONO';

export interface KardexMovement {
  id: string;
  date: string;
  movementType: KardexMovementType;
  description: string | null;
  amount: number;
  /** Running balance of active rows; null for a voided row (it no longer counts). */
  balanceAfter: number | null;
  isActive: boolean;
  createdByUsername: string;
  createdAt: string;
  /** Payment method, Kardex movements and change history (backend). */
  trace: PortfolioRecordTrace;
}

export interface KardexStatement {
  clientId: string;
  clientName: string;
  openingBalance: number;
  movements: KardexMovement[];
  totalCargos: number;
  totalAbonos: number;
  closingBalance: number;
  voidedCount: number;
}

export interface RegisterKardexMovementInput {
  date: string;
  amount: number;
  description?: string;
  /** EFECTIVO (default) moves Caja; BANCO never does. */
  paymentMethod?: PortfolioPaymentMethod;
}

export interface KardexStatementFilters {
  dateFrom?: string;
  dateTo?: string;
  /** Voided rows are shown unless false. */
  includeVoided?: boolean;
}

/** Backs the plain list screen's "Saldo total" tile — always scoped to active accounts only, independent of the list's own current filters. */
export interface ActiveBalanceSummary {
  totalAmount: number;
  recordCount: number;
}

/**
 * Structural contract both `AccountReceivableService` and `AssetService`
 * satisfy — lets `AccountStatementModalComponent` stay one generic
 * component shared by Cuentas por Cobrar and Activos, even though the two
 * modules never share balances or movements (that separation is entirely
 * backend-side: each service talks to its own table, scoped by clientId).
 */
export interface KardexAccountService {
  getStatement(clientId: string, filters?: KardexStatementFilters): Observable<KardexStatement>;
  getCurrentBalance(clientId: string): Observable<number>;
  registerCharge(clientId: string, input: RegisterKardexMovementInput): Observable<unknown>;
  registerPayment(clientId: string, input: RegisterKardexMovementInput): Observable<unknown>;
}
