import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, CreateSaleInput, PaginatedResponse, Sale } from '../models';

const BASE_URL = `${environment.apiUrl}/sales`;

@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly http = inject(HttpClient);

  /**
   * Bulk, one-shot sale creation — kept for other callers (see `Sale.createSale`
   * in `core/models/sale.model.ts`). The Ventas screen itself uses the
   * real-time draft flow below instead.
   */
  createSale(input: CreateSaleInput): Observable<Sale> {
    return this.http.post<ApiSuccessResponse<Sale>>(BASE_URL, input).pipe(map((response) => response.data));
  }

  /** A USER account only ever gets their own sales back — the backend decides that, not this call. */
  getSales(): Observable<PaginatedResponse<Sale>> {
    return this.http
      .get<ApiSuccessResponse<PaginatedResponse<Sale>>>(BASE_URL)
      .pipe(map((response) => response.data));
  }

  getSaleById(id: string): Observable<Sale> {
    return this.http.get<ApiSuccessResponse<Sale>>(`${BASE_URL}/${id}`).pipe(map((response) => response.data));
  }

  /**
   * Reserves (positive `quantityDelta`) or releases (negative) stock against
   * the caller's own in-progress receipt, in real time — creates the draft
   * on the first call. Returns the full updated draft so the UI always
   * renders exactly what the backend actually committed, never an optimistic
   * local guess.
   */
  adjustSaleItem(productId: string, quantityDelta: number): Observable<Sale> {
    return this.http
      .post<ApiSuccessResponse<Sale>>(`${BASE_URL}/items`, { productId, quantityDelta })
      .pipe(map((response) => response.data));
  }

  /**
   * The caller's in-progress receipt, if any — `null` (not a thrown error)
   * whenever there isn't one, so a page load never needs to special-case a
   * 404 (the expected case for "nothing in progress") or treat a transient
   * failure as fatal: either way, the Ventas screen just starts from an
   * empty receipt.
   */
  getCurrentSale(): Observable<Sale | null> {
    return this.http.get<ApiSuccessResponse<Sale>>(`${BASE_URL}/current`).pipe(
      map((response) => response.data),
      catchError(() => of(null)),
    );
  }

  /** "Guardar venta" — stock was already reserved as items were added; this only finalizes the receipt. */
  confirmSale(): Observable<Sale> {
    return this.http.post<ApiSuccessResponse<Sale>>(`${BASE_URL}/confirm`, {}).pipe(map((response) => response.data));
  }

  /** Discards the in-progress receipt — every reserved line's stock is restored. */
  cancelSale(): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/current`);
  }
}
