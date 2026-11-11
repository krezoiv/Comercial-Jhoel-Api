import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  CashCountRecord,
  CashCountFilters,
  CashCustody,
  PaginatedResult,
  RegisterCashCountInput,
  RegisterWarehouseTransferInput,
  WarehouseMovement,
  WarehouseTransfer,
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
}
