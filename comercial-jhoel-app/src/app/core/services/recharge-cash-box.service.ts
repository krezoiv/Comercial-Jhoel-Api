import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  CashBoxBalance,
  CashBoxMovementRecord,
  CashBoxMovementsFilters,
  PaginatedCashBoxMovements,
  RegisterCashBoxContributionInput,
  RegisterCashBoxWithdrawalInput,
} from '../models';

const BASE_URL = `${environment.apiUrl}/recharge-cash-box`;

/**
 * "Gestión Caja Recargas" — fully independent from `RechargesService`
 * (moved out of it per an explicit follow-up: this used to be a section
 * embedded inside the Recargas Electrónicas page; it's now its own
 * Sistema-level module with its own route, sidebar entry, and backend
 * module). Mirrors the backend's own `RechargeCashBoxModule` boundary.
 */
@Injectable({ providedIn: 'root' })
export class RechargeCashBoxService {
  private readonly http = inject(HttpClient);

  /** `date` defaults to today server-side when omitted. */
  getBalance(date?: string): Observable<CashBoxBalance> {
    const params = date ? new HttpParams().set('date', date) : undefined;
    return this.http
      .get<ApiSuccessResponse<CashBoxBalance>>(`${BASE_URL}/balance`, { params })
      .pipe(map((response) => response.data));
  }

  getMovements(filters: CashBoxMovementsFilters): Observable<PaginatedCashBoxMovements> {
    let params = new HttpParams();
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate);
    }
    if (filters.type) {
      params = params.set('type', filters.type);
    }
    if (filters.page) {
      params = params.set('page', filters.page);
    }
    if (filters.limit) {
      params = params.set('limit', filters.limit);
    }
    return this.http
      .get<ApiSuccessResponse<PaginatedCashBoxMovements>>(`${BASE_URL}/movements`, { params })
      .pipe(map((response) => response.data));
  }

  /** Admin-only server-side ("Salida de Ganancia") — see `RegisterCashBoxWithdrawalUseCase`'s own doc comment for why the balance-exceeded check is never duplicated client-side beyond a UX echo. */
  registerWithdrawal(input: RegisterCashBoxWithdrawalInput): Observable<CashBoxMovementRecord> {
    return this.http
      .post<ApiSuccessResponse<CashBoxMovementRecord>>(`${BASE_URL}/withdrawals`, input)
      .pipe(map((response) => response.data));
  }

  /** Admin-only server-side ("Aporte a Caja") — unlike a withdrawal, never rejected for exceeding a balance; it only ever adds. */
  registerContribution(input: RegisterCashBoxContributionInput): Observable<CashBoxMovementRecord> {
    return this.http
      .post<ApiSuccessResponse<CashBoxMovementRecord>>(`${BASE_URL}/contributions`, input)
      .pipe(map((response) => response.data));
  }

  /** Works for either movement type (aporte or salida) — one generic void endpoint. */
  voidMovement(id: string, reason: string): Observable<CashBoxMovementRecord> {
    return this.http
      .post<ApiSuccessResponse<CashBoxMovementRecord>>(`${BASE_URL}/movements/${id}/void`, { reason })
      .pipe(map((response) => response.data));
  }
}
