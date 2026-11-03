import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  GuayacanCashBoxSummary,
  GuayacanCashCount,
  GuayacanCashCountFilters,
  GuayacanCashMovementDetail,
  GuayacanCashMovementFilters,
  PaginatedGuayacanCashCounts,
  PaginatedGuayacanCashMovements,
  PaginatedGuayacanCommissions,
  RegisterGuayacanCashAdjustmentInput,
  RegisterGuayacanCashCountInput,
  RegisterGuayacanCashMovementInput,
} from '../models';

const BASE_URL = `${environment.apiUrl}/guayacan-cash-box`;

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
 * Cuadre de Caja Guayacán. El backend es la única fuente del saldo: cada
 * escritura devuelve el movimiento ya calculado (saldo anterior/nuevo) y
 * esta capa nunca recalcula nada. `clientRequestId` (uno por modal abierto)
 * hace que un doble clic o reintento devuelva el mismo movimiento.
 */
@Injectable({ providedIn: 'root' })
export class GuayacanCashBoxService {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<GuayacanCashBoxSummary> {
    return this.http
      .get<ApiSuccessResponse<GuayacanCashBoxSummary>>(`${BASE_URL}/summary`)
      .pipe(map((response) => response.data));
  }

  getMovements(filters: GuayacanCashMovementFilters): Observable<PaginatedGuayacanCashMovements> {
    return this.http
      .get<ApiSuccessResponse<PaginatedGuayacanCashMovements>>(`${BASE_URL}/movements`, { params: toParams(filters) })
      .pipe(map((response) => response.data));
  }

  /** Comisiones (concepto aparte del efectivo), más reciente primero. */
  getCommissions(filters: { startDate?: string; endDate?: string; page?: number; limit?: number }): Observable<PaginatedGuayacanCommissions> {
    return this.http
      .get<ApiSuccessResponse<PaginatedGuayacanCommissions>>(`${BASE_URL}/commissions`, { params: toParams(filters) })
      .pipe(map((response) => response.data));
  }

  /** Historial de arqueos (Cajas y Cierres → Arqueos — Guayacán). */
  getCounts(filters: GuayacanCashCountFilters): Observable<PaginatedGuayacanCashCounts> {
    return this.http
      .get<ApiSuccessResponse<PaginatedGuayacanCashCounts>>(`${BASE_URL}/counts`, { params: toParams(filters) })
      .pipe(map((response) => response.data));
  }

  getCount(id: string): Observable<GuayacanCashCount> {
    return this.http
      .get<ApiSuccessResponse<GuayacanCashCount>>(`${BASE_URL}/counts/${id}`)
      .pipe(map((response) => response.data));
  }

  getCountUsers(): Observable<{ id: string; username: string }[]> {
    return this.http
      .get<ApiSuccessResponse<{ id: string; username: string }[]>>(`${BASE_URL}/counts/users`)
      .pipe(map((response) => response.data));
  }

  getMovement(id: string): Observable<GuayacanCashMovementDetail> {
    return this.http
      .get<ApiSuccessResponse<GuayacanCashMovementDetail>>(`${BASE_URL}/movements/${id}`)
      .pipe(map((response) => response.data));
  }

  registerMovement(input: RegisterGuayacanCashMovementInput): Observable<GuayacanCashMovementDetail> {
    return this.http
      .post<ApiSuccessResponse<GuayacanCashMovementDetail>>(`${BASE_URL}/movements`, input)
      .pipe(map((response) => response.data));
  }

  /** Admin. */
  registerAdjustment(input: RegisterGuayacanCashAdjustmentInput): Observable<GuayacanCashMovementDetail> {
    return this.http
      .post<ApiSuccessResponse<GuayacanCashMovementDetail>>(`${BASE_URL}/adjustments`, input)
      .pipe(map((response) => response.data));
  }

  /** Admin — nunca borra: el original queda ANULADO y se registra el movimiento inverso. */
  voidMovement(id: string, reason: string): Observable<GuayacanCashMovementDetail> {
    return this.http
      .post<ApiSuccessResponse<GuayacanCashMovementDetail>>(`${BASE_URL}/movements/${id}/void`, { reason })
      .pipe(map((response) => response.data));
  }

  getLatestCount(): Observable<GuayacanCashCount | null> {
    return this.http
      .get<ApiSuccessResponse<GuayacanCashCount | null>>(`${BASE_URL}/counts/latest`)
      .pipe(map((response) => response.data ?? null));
  }

  /** Arqueo: registra el conteo físico y su diferencia; no cambia el saldo. */
  registerCount(input: RegisterGuayacanCashCountInput): Observable<GuayacanCashCount> {
    return this.http
      .post<ApiSuccessResponse<GuayacanCashCount>>(`${BASE_URL}/counts`, input)
      .pipe(map((response) => response.data));
  }
}
