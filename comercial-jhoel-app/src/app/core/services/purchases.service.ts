import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, CreatePurchaseInput, PaginatedResponse, Purchase } from '../models';

const BASE_URL = `${environment.apiUrl}/purchases`;

@Injectable({ providedIn: 'root' })
export class PurchasesService {
  private readonly http = inject(HttpClient);

  /** One atomic call — the backend's `confirm_purchase` function creates the purchase, its details, increases stock, and updates product prices. */
  createPurchase(input: CreatePurchaseInput): Observable<Purchase> {
    return this.http.post<ApiSuccessResponse<Purchase>>(BASE_URL, input).pipe(map((response) => response.data));
  }

  /** A USER account only ever gets their own purchases back — the backend decides that, not this call. */
  getPurchases(): Observable<PaginatedResponse<Purchase>> {
    return this.http
      .get<ApiSuccessResponse<PaginatedResponse<Purchase>>>(BASE_URL)
      .pipe(map((response) => response.data));
  }

  getPurchaseById(id: string): Observable<Purchase> {
    return this.http.get<ApiSuccessResponse<Purchase>>(`${BASE_URL}/${id}`).pipe(map((response) => response.data));
  }
}
