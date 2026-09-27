import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, BankTransfer, BankTransferInput } from '../models';

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
}
