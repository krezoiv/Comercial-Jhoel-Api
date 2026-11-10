import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  CashBalanceSnapshot,
  CashBankBalance,
  CashCutDetail,
  CashDayFilters,
  CashMovement,
  CashMovementFilters,
  CashMovementResult,
  CashPosition,
  FinishCashCutInput,
  OpenCashDayInput,
  PaginatedCashDays,
  PaginatedCashMovements,
  RegisterCashBankDepositInput,
  RegisterCashMovementInput,
} from '../models';

const BASE_URL = `${environment.apiUrl}/cash-control`;

function toParams(filters: object): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(key, String(value));
    }
  }
  return params;
}

/**
 * Finance → Control de Efectivo API client. The backend's Kardex is the ONLY
 * source of the cash balance: every write returns the official state
 * (position or movement + balance) and this layer never recalculates it.
 */
@Injectable({ providedIn: 'root' })
export class CashControlService {
  private readonly http = inject(HttpClient);

  /** Main card, day state, cuts (with live totals) and today's summary in one call. */
  getPosition(): Observable<CashPosition> {
    return this.http.get<ApiSuccessResponse<CashPosition>>(`${BASE_URL}/position`).pipe(map((r) => r.data));
  }

  /** Lightweight balance + last sequence, used for change detection polling. */
  getBalance(): Observable<CashBalanceSnapshot> {
    return this.http.get<ApiSuccessResponse<CashBalanceSnapshot>>(`${BASE_URL}/balance`).pipe(map((r) => r.data));
  }

  getMovements(filters: CashMovementFilters): Observable<PaginatedCashMovements> {
    return this.http
      .get<ApiSuccessResponse<PaginatedCashMovements>>(`${BASE_URL}/movements`, { params: toParams(filters) })
      .pipe(map((r) => r.data));
  }

  /** Last N movements (default 10), newest first — Transaccionar's "Últimas transacciones". */
  getRecentMovements(limit = 10): Observable<CashMovement[]> {
    return this.http
      .get<ApiSuccessResponse<CashMovement[]>>(`${BASE_URL}/movements/recent`, { params: toParams({ limit }) })
      .pipe(map((r) => r.data));
  }

  getUsers(): Observable<{ id: string; username: string }[]> {
    return this.http.get<ApiSuccessResponse<{ id: string; username: string }[]>>(`${BASE_URL}/users`).pipe(map((r) => r.data));
  }

  getBankBalances(): Observable<CashBankBalance[]> {
    return this.http.get<ApiSuccessResponse<CashBankBalance[]>>(`${BASE_URL}/bank-balances`).pipe(map((r) => r.data));
  }

  registerMovement(input: RegisterCashMovementInput): Observable<CashMovementResult> {
    return this.http.post<ApiSuccessResponse<CashMovementResult>>(`${BASE_URL}/movements`, input).pipe(map((r) => r.data));
  }

  /** One movement with its denomination breakdown (if any). */
  getMovement(id: string): Observable<CashMovement> {
    return this.http.get<ApiSuccessResponse<CashMovement>>(`${BASE_URL}/movements/${id}`).pipe(map((r) => r.data));
  }

  /** "Depósito bancario": cash leaves the caja and the selected account increases — one backend transaction. */
  registerBankDeposit(input: RegisterCashBankDepositInput): Observable<CashMovementResult> {
    return this.http
      .post<ApiSuccessResponse<CashMovementResult>>(`${BASE_URL}/bank-deposits`, input)
      .pipe(map((r) => r.data));
  }

  voidMovement(id: string, reason: string): Observable<CashMovementResult> {
    return this.http
      .post<ApiSuccessResponse<CashMovementResult>>(`${BASE_URL}/movements/${id}/void`, { reason })
      .pipe(map((r) => r.data));
  }

  openDay(input: OpenCashDayInput): Observable<CashPosition> {
    return this.http.post<ApiSuccessResponse<CashPosition>>(`${BASE_URL}/days/open`, input).pipe(map((r) => r.data));
  }

  closeDay(dayId: string, observations?: string): Observable<CashPosition> {
    return this.http
      .post<ApiSuccessResponse<CashPosition>>(`${BASE_URL}/days/${dayId}/close`, observations ? { observations } : {})
      .pipe(map((r) => r.data));
  }

  updateSchedule(periodId: string, start: string, end: string, reason: string): Observable<CashPosition> {
    return this.http
      .patch<ApiSuccessResponse<CashPosition>>(`${BASE_URL}/cuts/${periodId}/schedule`, { start, end, reason })
      .pipe(map((r) => r.data));
  }

  startCut(periodId: string): Observable<CashPosition> {
    return this.http.post<ApiSuccessResponse<CashPosition>>(`${BASE_URL}/cuts/${periodId}/start`, {}).pipe(map((r) => r.data));
  }

  finishCut(periodId: string, input: FinishCashCutInput): Observable<CashPosition> {
    return this.http
      .post<ApiSuccessResponse<CashPosition>>(`${BASE_URL}/cuts/${periodId}/finish`, input)
      .pipe(map((r) => r.data));
  }

  reopenCut(periodId: string, reason: string): Observable<CashPosition> {
    return this.http
      .post<ApiSuccessResponse<CashPosition>>(`${BASE_URL}/cuts/${periodId}/reopen`, { reason })
      .pipe(map((r) => r.data));
  }

  getDays(filters: CashDayFilters): Observable<PaginatedCashDays> {
    return this.http
      .get<ApiSuccessResponse<PaginatedCashDays>>(`${BASE_URL}/days`, { params: toParams(filters) })
      .pipe(map((r) => r.data));
  }

  getCutDetail(periodId: string): Observable<CashCutDetail> {
    return this.http.get<ApiSuccessResponse<CashCutDetail>>(`${BASE_URL}/cuts/${periodId}`).pipe(map((r) => r.data));
  }
}
