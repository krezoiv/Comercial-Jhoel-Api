import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, CreatePurchaseInput, ListPurchasesFilters, PaginatedResponse, Purchase } from '../models';

const BASE_URL = `${environment.apiUrl}/purchases`;

@Injectable({ providedIn: 'root' })
export class PurchasesService {
  private readonly http = inject(HttpClient);

  /** One atomic call — the backend's `confirm_purchase` function creates the purchase, its details, increases stock, and updates product prices. */
  createPurchase(input: CreatePurchaseInput): Observable<Purchase> {
    return this.http.post<ApiSuccessResponse<Purchase>>(BASE_URL, input).pipe(map((response) => response.data));
  }

  /** A USER account only ever gets their own purchases back — the backend decides that, not this call. An admin (e.g. "Administrar Facturas de Compras") sees every purchase, filtered by whatever `filters` carries. */
  getPurchases(filters?: ListPurchasesFilters): Observable<PaginatedResponse<Purchase>> {
    let params = new HttpParams();
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      }
    }
    return this.http
      .get<ApiSuccessResponse<PaginatedResponse<Purchase>>>(BASE_URL, { params })
      .pipe(map((response) => response.data));
  }

  getPurchaseById(id: string): Observable<Purchase> {
    return this.http.get<ApiSuccessResponse<Purchase>>(`${BASE_URL}/${id}`).pipe(map((response) => response.data));
  }

  /** "Marcar como pagada" — operational, no admin check on this side either (mirrors the backend's own policy). */
  markAsPaid(id: string): Observable<Purchase> {
    return this.http
      .post<ApiSuccessResponse<Purchase>>(`${BASE_URL}/${id}/pay`, {})
      .pipe(map((response) => response.data));
  }

  /** Reconstructs the invoice PDF purely from the already-persisted purchase — never re-runs the save. */
  exportPurchasePdf(id: string): Observable<Blob> {
    return this.http.get(`${BASE_URL}/${id}/pdf`, { responseType: 'blob' });
  }

  /** "Anular factura" — admin-only server-side; never a physical delete/edit, marks the purchase `ANULADA` and reverses its exact inventory effect atomically. */
  voidPurchase(id: string, reason: string): Observable<Purchase> {
    return this.http
      .post<ApiSuccessResponse<Purchase>>(`${BASE_URL}/${id}/void`, { reason })
      .pipe(map((response) => response.data));
  }
}
