import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  CashCountRecord,
  CashCountFilters,
  CashCustody,
  CashCountDraft,
  CashCountDraftPayload,
  CashInventory,
  CustodyTransfer,
  CustodyTransferFilters,
  LatestCashCountResponse,
  LocationInventory,
  RegisterWarehouseCashCountInput,
  WarehouseCashCount,
  PaginatedResult,
  RegisterCashCountInput,
  RegisterWarehouseTransferInput,
  RegisterWarehouseWithdrawalInput,
  WarehouseMovement,
  WarehouseTransfer,
  WarehouseWithdrawal,
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
 * API client of "Arqueo de Caja" and "Bodega". Every write under
 * `/cash-control` is broadcast by `cashMutationInterceptor`, so all open
 * views re-read the official balances (same real-time channel as the rest).
 */
@Injectable({ providedIn: 'root' })
export class CashCustodyService {
  private readonly http = inject(HttpClient);

  /** Caja, Bodega and total under custody. */
  getCustody(): Observable<CashCustody> {
    return this.http.get<ApiSuccessResponse<CashCustody>>(`${BASE_URL}/custody`).pipe(map((r) => r.data));
  }

  getCounts(filters: CashCountFilters): Observable<PaginatedResult<CashCountRecord>> {
    return this.http
      .get<ApiSuccessResponse<PaginatedResult<CashCountRecord>>>(`${BASE_URL}/counts`, { params: toParams(filters) })
      .pipe(map((r) => r.data));
  }

  /**
   * Latest valid Arqueo de Caja (all 12 denominations, missing ones as 0) for
   * Cuadre de Agentes; a count of `businessDate` is preferred. Read-only.
   */
  getLatestCount(businessDate?: string): Observable<LatestCashCountResponse> {
    return this.http
      .get<ApiSuccessResponse<LatestCashCountResponse>>(`${BASE_URL}/counts/latest`, {
        params: businessDate ? { businessDate } : {},
      })
      .pipe(map((r) => r.data));
  }

  getCount(id: string): Observable<CashCountRecord> {
    return this.http.get<ApiSuccessResponse<CashCountRecord>>(`${BASE_URL}/counts/${id}`).pipe(map((r) => r.data));
  }

  /** Saves a count (photograph only — it never adjusts the caja). */
  registerCount(input: RegisterCashCountInput): Observable<CashCountRecord> {
    return this.http.post<ApiSuccessResponse<CashCountRecord>>(`${BASE_URL}/counts`, input).pipe(map((r) => r.data));
  }

  /** Audited correction of a count (admin): the original stays, marked as replaced. */
  correctCount(id: string, input: RegisterCashCountInput & { reason: string }): Observable<CashCountRecord> {
    return this.http
      .post<ApiSuccessResponse<CashCountRecord>>(`${BASE_URL}/counts/${id}/corrections`, input)
      .pipe(map((r) => r.data));
  }

  getTransfers(filters: { dateFrom?: string; dateTo?: string; status?: string; page?: number; limit?: number }): Observable<PaginatedResult<WarehouseTransfer>> {
    return this.http
      .get<ApiSuccessResponse<PaginatedResult<WarehouseTransfer>>>(`${BASE_URL}/warehouse/transfers`, { params: toParams(filters) })
      .pipe(map((r) => r.data));
  }

  /** Internal transfer caja → Bodega (both Kardex in one transaction). */
  registerTransfer(input: RegisterWarehouseTransferInput): Observable<{ transfer: WarehouseTransfer; custody: CashCustody }> {
    return this.http
      .post<ApiSuccessResponse<{ transfer: WarehouseTransfer; custody: CashCustody }>>(`${BASE_URL}/warehouse/transfers`, input)
      .pipe(map((r) => r.data));
  }

  voidTransfer(id: string, reason: string): Observable<{ transfer: WarehouseTransfer; custody: CashCustody }> {
    return this.http
      .post<ApiSuccessResponse<{ transfer: WarehouseTransfer; custody: CashCustody }>>(`${BASE_URL}/warehouse/transfers/${id}/void`, { reason })
      .pipe(map((r) => r.data));
  }

  getWithdrawals(filters: { dateFrom?: string; dateTo?: string; status?: string; page?: number; limit?: number }): Observable<PaginatedResult<WarehouseWithdrawal>> {
    return this.http
      .get<ApiSuccessResponse<PaginatedResult<WarehouseWithdrawal>>>(`${BASE_URL}/warehouse/withdrawals`, { params: toParams(filters) })
      .pipe(map((r) => r.data));
  }

  /** Cash out of Bodega: back to the caja or deposited into a bank account (one transaction in the backend). */
  registerWithdrawal(input: RegisterWarehouseWithdrawalInput): Observable<{ withdrawal: WarehouseWithdrawal; custody: CashCustody }> {
    return this.http
      .post<ApiSuccessResponse<{ withdrawal: WarehouseWithdrawal; custody: CashCustody }>>(`${BASE_URL}/warehouse/withdrawals`, input)
      .pipe(map((r) => r.data));
  }

  voidWithdrawal(id: string, reason: string): Observable<{ withdrawal: WarehouseWithdrawal; custody: CashCustody }> {
    return this.http
      .post<ApiSuccessResponse<{ withdrawal: WarehouseWithdrawal; custody: CashCustody }>>(`${BASE_URL}/warehouse/withdrawals/${id}/void`, { reason })
      .pipe(map((r) => r.data));
  }

  getWarehouseMovements(page = 1, limit = 25): Observable<PaginatedResult<WarehouseMovement>> {
    return this.http
      .get<ApiSuccessResponse<PaginatedResult<WarehouseMovement>>>(`${BASE_URL}/warehouse/movements`, { params: toParams({ page, limit }) })
      .pipe(map((r) => r.data));
  }

  registerWarehouseInitialBalance(amount: number, reason: string, clientRequestId: string): Observable<CashCustody> {
    return this.http
      .post<ApiSuccessResponse<CashCustody>>(`${BASE_URL}/warehouse/initial-balance`, { amount, reason, clientRequestId })
      .pipe(map((r) => r.data));
  }

  // ── Inventario por denominación, conteo de Bodega, borradores e historial ──

  /** Per-denomination inventory of caja and Bodega (derived by the backend). */
  getInventory(): Observable<CashInventory> {
    return this.http.get<ApiSuccessResponse<CashInventory>>(`${BASE_URL}/inventory`).pipe(map((r) => r.data));
  }

  /** "Conteo de Bodega por denominación" (admin): must equal the Bodega balance. */
  registerWarehouseCount(
    input: RegisterWarehouseCashCountInput,
  ): Observable<{ count: WarehouseCashCount; inventory: LocationInventory }> {
    return this.http
      .post<ApiSuccessResponse<{ count: WarehouseCashCount; inventory: LocationInventory }>>(`${BASE_URL}/warehouse/counts`, input)
      .pipe(map((r) => r.data));
  }

  getWarehouseCounts(page = 1, limit = 10): Observable<PaginatedResult<WarehouseCashCount>> {
    return this.http
      .get<ApiSuccessResponse<PaginatedResult<WarehouseCashCount>>>(`${BASE_URL}/warehouse/counts`, {
        params: toParams({ page, limit }),
      })
      .pipe(map((r) => r.data));
  }

  /** The caller's own Arqueo de Caja draft for the current bank day (null when none). */
  getCountDraft(): Observable<CashCountDraft | null> {
    return this.http.get<ApiSuccessResponse<CashCountDraft | null>>(`${BASE_URL}/counts/draft`).pipe(map((r) => r.data));
  }

  /** Autosave (upsert) of the caller's draft. Not a cash write: excluded from the cash-change broadcast. */
  saveCountDraft(payload: CashCountDraftPayload): Observable<CashCountDraft> {
    return this.http.put<ApiSuccessResponse<CashCountDraft>>(`${BASE_URL}/counts/draft`, payload).pipe(map((r) => r.data));
  }

  /** Explicit "Reiniciar arqueo". */
  discardCountDraft(): Observable<void> {
    return this.http.delete<ApiSuccessResponse<unknown>>(`${BASE_URL}/counts/draft`).pipe(map(() => undefined));
  }

  /** Unified history of caja ↔ Bodega transfers with their breakdown. */
  getCustodyTransfers(filters: CustodyTransferFilters): Observable<PaginatedResult<CustodyTransfer>> {
    return this.http
      .get<ApiSuccessResponse<PaginatedResult<CustodyTransfer>>>(`${BASE_URL}/custody/transfers`, { params: toParams(filters) })
      .pipe(map((r) => r.data));
  }
}
