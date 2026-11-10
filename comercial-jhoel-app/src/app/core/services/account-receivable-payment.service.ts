import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  ChargePaymentHistory,
  ClientPendingCharges,
  PaginatedSettlements,
  SettleAccountsReceivableInput,
  SettlementFilters,
  SettlementPreview,
  SettlementPreviewInput,
  SettlementResult,
  SettlementWithDetails,
} from '../models';

const BASE_URL = `${environment.apiUrl}/account-receivable-payments`;

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
 * Cuentas por Cobrar → "Cancelar cuenta(s)" API client. Pendings, totals and
 * resulting cash/bank balances always come from the backend; this layer
 * never recalculates a balance.
 */
@Injectable({ providedIn: 'root' })
export class AccountReceivablePaymentService {
  private readonly http = inject(HttpClient);

  /** Accounts of a client that still have something to collect. */
  getPendingCharges(clientId: string): Observable<ClientPendingCharges> {
    return this.http
      .get<ApiSuccessResponse<ClientPendingCharges>>(`${BASE_URL}/clients/${clientId}/pending`)
      .pipe(map((r) => r.data));
  }

  /** Summary before confirming (no write): pendings, total and resulting balance. */
  preview(input: SettlementPreviewInput): Observable<SettlementPreview> {
    return this.http.post<ApiSuccessResponse<SettlementPreview>>(`${BASE_URL}/preview`, input).pipe(map((r) => r.data));
  }

  /** Cancels the selected accounts in one backend transaction (idempotent by `clientRequestId`). */
  settle(input: SettleAccountsReceivableInput): Observable<SettlementResult> {
    return this.http.post<ApiSuccessResponse<SettlementResult>>(BASE_URL, input).pipe(map((r) => r.data));
  }

  getSettlements(filters: SettlementFilters = {}): Observable<PaginatedSettlements> {
    return this.http
      .get<ApiSuccessResponse<PaginatedSettlements>>(BASE_URL, { params: toParams(filters) })
      .pipe(map((r) => r.data));
  }

  getSettlement(id: string): Observable<SettlementWithDetails> {
    return this.http.get<ApiSuccessResponse<SettlementWithDetails>>(`${BASE_URL}/${id}`).pipe(map((r) => r.data));
  }

  /** Payment history of one account. */
  getChargeHistory(chargeId: string): Observable<ChargePaymentHistory> {
    return this.http
      .get<ApiSuccessResponse<ChargePaymentHistory>>(`${BASE_URL}/charges/${chargeId}`)
      .pipe(map((r) => r.data));
  }

  /** Admin: reverses the collection (cash or bank) and makes the accounts pending again. */
  voidSettlement(id: string, reason: string): Observable<SettlementResult> {
    return this.http
      .post<ApiSuccessResponse<SettlementResult>>(`${BASE_URL}/${id}/void`, { reason })
      .pipe(map((r) => r.data));
  }
}
