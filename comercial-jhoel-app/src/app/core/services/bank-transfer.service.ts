import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  BankBalanceCreditInput,
  BankMovement,
  BankTransfer,
  BankTransferInput,
  PaginatedBankMovements,
} from '../models';

const BASE_URL = `${environment.apiUrl}/bank-transfers`;

/** Finanzas → Transferencias Bancarias. Toda regla (saldo suficiente, BI Club/Districol, límites) la valida el backend bajo lock. */
@Injectable({ providedIn: 'root' })
export class BankTransferService {
  private readonly http = inject(HttpClient);

  registerTransfer(input: BankTransferInput): Observable<BankTransfer> {
    return this.http.post<ApiSuccessResponse<BankTransfer>>(BASE_URL, input).pipe(map((response) => response.data));
  }

  getTransfers(filters: { startDate?: string; endDate?: string; bankId?: string; limit?: number } = {}): Observable<BankTransfer[]> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return this.http.get<ApiSuccessResponse<BankTransfer[]>>(BASE_URL, { params }).pipe(map((response) => response.data));
  }

  /** Solo admin — genera los movimientos inversos; la transferencia original queda en el historial como ANULADA. */
  voidTransfer(id: string, reason: string): Observable<BankTransfer> {
    return this.http
      .post<ApiSuccessResponse<BankTransfer>>(`${BASE_URL}/${id}/void`, { reason })
      .pipe(map((response) => response.data));
  }

  /**
   * "Acreditar saldo" (solo admin/super_admin; el backend lo exige). Suma el
   * monto al saldo de la cuenta sin contrapartida y devuelve el movimiento
   * ACREDITACION_SALDO con saldo anterior/posterior calculados por el backend.
   */
  registerBalanceCredit(input: BankBalanceCreditInput): Observable<BankMovement> {
    return this.http
      .post<ApiSuccessResponse<BankMovement>>(`${BASE_URL}/balance-credits`, input)
      .pipe(map((response) => response.data));
  }

  getBalanceCredits(filters: { bankId?: string; page?: number; limit?: number } = {}): Observable<PaginatedBankMovements> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return this.http
      .get<ApiSuccessResponse<PaginatedBankMovements>>(`${BASE_URL}/balance-credits`, { params })
      .pipe(map((response) => response.data));
  }

  /** Solo admin — `operationId` es el `referenceId` del movimiento. Genera el movimiento inverso; la acreditación queda ANULADA en el historial. */
  voidBalanceCredit(operationId: string, reason: string): Observable<BankMovement> {
    return this.http
      .post<ApiSuccessResponse<BankMovement>>(`${BASE_URL}/balance-credits/${operationId}/void`, { reason })
      .pipe(map((response) => response.data));
  }
}
