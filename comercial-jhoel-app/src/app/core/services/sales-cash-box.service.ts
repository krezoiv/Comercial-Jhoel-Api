import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  RegisterSalesCashBoxMovementInput,
  SalesCashBoxBalance,
  SalesCashBoxMovement,
} from '../models';

const BASE_URL = `${environment.apiUrl}/sales-cash-box`;

/** "Caja de Ventas" por negocio — saldo acumulado independiente + aportes/retiros. Mirrors `RechargeCashBoxService`'s own shape. */
@Injectable({ providedIn: 'root' })
export class SalesCashBoxService {
  private readonly http = inject(HttpClient);

  /** Saldo de TODOS los negocios activos, en una sola llamada. */
  getBalances(): Observable<SalesCashBoxBalance[]> {
    return this.http
      .get<ApiSuccessResponse<SalesCashBoxBalance[]>>(`${BASE_URL}/balances`)
      .pipe(map((response) => response.data));
  }

  getMovements(businessId: string, limit = 20): Observable<SalesCashBoxMovement[]> {
    const params = new HttpParams().set('businessId', businessId).set('limit', limit);
    return this.http
      .get<ApiSuccessResponse<SalesCashBoxMovement[]>>(`${BASE_URL}/movements`, { params })
      .pipe(map((response) => response.data));
  }

  /** Admin-only server-side — nunca rechazado por exceder un saldo, solo suma. */
  registerContribution(input: RegisterSalesCashBoxMovementInput): Observable<SalesCashBoxMovement> {
    return this.http
      .post<ApiSuccessResponse<SalesCashBoxMovement>>(`${BASE_URL}/contributions`, input)
      .pipe(map((response) => response.data));
  }

  /** Admin-only server-side — el backend valida el saldo disponible de ese negocio de forma atómica; nunca se duplica ese chequeo aquí. */
  registerWithdrawal(input: RegisterSalesCashBoxMovementInput): Observable<SalesCashBoxMovement> {
    return this.http
      .post<ApiSuccessResponse<SalesCashBoxMovement>>(`${BASE_URL}/withdrawals`, input)
      .pipe(map((response) => response.data));
  }

  voidMovement(id: string, reason: string): Observable<SalesCashBoxMovement> {
    return this.http
      .post<ApiSuccessResponse<SalesCashBoxMovement>>(`${BASE_URL}/movements/${id}/void`, { reason })
      .pipe(map((response) => response.data));
  }
}
