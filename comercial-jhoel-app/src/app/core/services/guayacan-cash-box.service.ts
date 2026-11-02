import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  GuayacanCashBoxSummary,
  GuayacanCashCount,
  GuayacanCashMovementDetail,
  GuayacanCashMovementFilters,
  PaginatedGuayacanCashMovements,
  RegisterGuayacanCashAdjustmentInput,
  RegisterGuayacanCashCountInput,
  RegisterGuayacanCashMovementInput,
} from '../models';

const BASE_URL = `${environment.apiUrl}/guayacan-cash-box`;

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
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return this.http
      .get<ApiSuccessResponse<PaginatedGuayacanCashMovements>>(`${BASE_URL}/movements`, { params })
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
