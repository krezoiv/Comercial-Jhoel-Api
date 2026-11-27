import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  CreatePaymentGroupInput,
  PaymentGroupDetail,
  PaymentGroupEvent,
  PaymentGroupFilters,
  PaymentGroupList,
} from '../models';

const BASE_URL = `${environment.apiUrl}/payment-groups`;

function toParams(filters: object): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(filters as Record<string, unknown>)) {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(key, String(value));
    }
  }
  return params;
}

/** Pagos grupales API. Every write returns the refreshed group detail (backend figures). */
@Injectable({ providedIn: 'root' })
export class PaymentGroupService {
  private readonly http = inject(HttpClient);

  list(filters: PaymentGroupFilters = {}): Observable<PaymentGroupList> {
    return this.http
      .get<ApiSuccessResponse<PaymentGroupList>>(BASE_URL, { params: toParams(filters) })
      .pipe(map((response) => response.data));
  }

  get(id: string): Observable<PaymentGroupDetail> {
    return this.http.get<ApiSuccessResponse<PaymentGroupDetail>>(`${BASE_URL}/${id}`).pipe(map((r) => r.data));
  }

  history(id: string, itemId?: string): Observable<PaymentGroupEvent[]> {
    return this.http
      .get<ApiSuccessResponse<PaymentGroupEvent[]>>(`${BASE_URL}/${id}/history`, { params: toParams({ itemId }) })
      .pipe(map((r) => r.data));
  }

  create(input: CreatePaymentGroupInput): Observable<PaymentGroupDetail> {
    return this.http.post<ApiSuccessResponse<PaymentGroupDetail>>(BASE_URL, input).pipe(map((r) => r.data));
  }

  deliver(id: string, itemId: string, input: { amount: number; note?: string; clientRequestId: string }): Observable<PaymentGroupDetail> {
    return this.write(`${id}/items/${itemId}/deliveries`, input);
  }

  noPayment(id: string, itemId: string, note: string): Observable<PaymentGroupDetail> {
    return this.write(`${id}/items/${itemId}/no-payment`, { note });
  }

  addNote(id: string, note: string, itemId?: string): Observable<PaymentGroupDetail> {
    return this.write(`${id}/notes`, { note, itemId });
  }

  updateItem(id: string, itemId: string, input: { expectedAmount?: number; reference?: string; note?: string }): Observable<PaymentGroupDetail> {
    return this.http
      .patch<ApiSuccessResponse<PaymentGroupDetail>>(`${BASE_URL}/${id}/items/${itemId}`, input)
      .pipe(map((r) => r.data));
  }

  resolve(id: string, itemId: string, input: { resolution: string; release: boolean }): Observable<PaymentGroupDetail> {
    return this.write(`${id}/items/${itemId}/resolution`, input);
  }

  voidItem(id: string, itemId: string, input: { reason: string; moneyReturned: boolean }): Observable<PaymentGroupDetail> {
    return this.write(`${id}/items/${itemId}/void`, input);
  }

  close(id: string, note?: string): Observable<PaymentGroupDetail> {
    return this.write(`${id}/close`, { note });
  }

  voidGroup(id: string, reason: string): Observable<PaymentGroupDetail> {
    return this.write(`${id}/void`, { reason });
  }

  private write(path: string, body: object): Observable<PaymentGroupDetail> {
    return this.http.post<ApiSuccessResponse<PaymentGroupDetail>>(`${BASE_URL}/${path}`, body).pipe(map((r) => r.data));
  }
}
