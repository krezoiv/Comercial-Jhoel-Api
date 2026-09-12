import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  ListSimSaleRegistrationsFilters,
  PaginatedSimSaleRegistrations,
  RegisterSimPurchaseInput,
  RegisterSimSaleInput,
  RegisterSimSaleRegistrationInput,
  SimDailyStock,
  SimSale,
  SimSaleRegistration,
  SimType,
} from '../models';

const BASE_URL = `${environment.apiUrl}/recharges/sims`;

/** Mirrors `RechargesService`'s own shape — a fully separate service hitting `/recharges/sims/*`, never mixed with the electronic-balance endpoints. */
@Injectable({ providedIn: 'root' })
export class RechargeSimsService {
  private readonly http = inject(HttpClient);

  getTypes(): Observable<SimType[]> {
    return this.http
      .get<ApiSuccessResponse<SimType[]>>(`${BASE_URL}/types`)
      .pipe(map((response) => response.data));
  }

  /** `date` defaults to today server-side when omitted — pass the operation-date picker's value to browse another day. */
  getDailyStock(date?: string): Observable<SimDailyStock[]> {
    const params = date ? new HttpParams().set('date', date) : undefined;
    return this.http
      .get<ApiSuccessResponse<SimDailyStock[]>>(`${BASE_URL}/daily`, { params })
      .pipe(map((response) => response.data));
  }

  registerPurchase(input: RegisterSimPurchaseInput): Observable<SimDailyStock> {
    return this.http
      .post<ApiSuccessResponse<SimDailyStock>>(`${BASE_URL}/purchases`, input)
      .pipe(map((response) => response.data));
  }

  registerSale(input: RegisterSimSaleInput): Observable<SimDailyStock> {
    return this.http
      .post<ApiSuccessResponse<SimDailyStock>>(`${BASE_URL}/sales`, input)
      .pipe(map((response) => response.data));
  }

  /** "Administrar Ventas de SIM (por cantidad)" listing — the by-quantity flow's own admin screen, separate from `getSaleRegistrations()` above. `date` defaults to today server-side when omitted. */
  getSales(date?: string): Observable<SimSale[]> {
    const params = date ? new HttpParams().set('date', date) : undefined;
    return this.http
      .get<ApiSuccessResponse<SimSale[]>>(`${BASE_URL}/sales`, { params })
      .pipe(map((response) => response.data));
  }

  /** "Revertir" — admin-only server-side; never a physical delete/edit, restores the SIM stock it decremented. */
  voidSale(id: string, reason: string): Observable<SimSale> {
    return this.http
      .post<ApiSuccessResponse<SimSale>>(`${BASE_URL}/sales/${id}/void`, { reason })
      .pipe(map((response) => response.data));
  }

  /**
   * "Venta de SIM con registro de identidad" — `FormData`, not JSON, since
   * `dpiImage` (when present) is a real file, not base64: the first genuine
   * file upload in this app (see `company-settings-page`'s own logo picker
   * for why that one goes through JSON/base64 instead — a small, already-
   * text-safe payload with no existing multipart infra to reuse). Angular's
   * `HttpClient` sets the correct `multipart/form-data` boundary header
   * automatically when given a `FormData` body — never set `Content-Type`
   * manually here, doing so drops the boundary and breaks the upload.
   */
  registerSaleRegistration(input: RegisterSimSaleRegistrationInput): Observable<SimSaleRegistration> {
    const formData = new FormData();
    formData.set('simTypeId', input.simTypeId);
    formData.set('simNumber', input.simNumber);
    formData.set('sku', input.sku);
    formData.set('clientDpi', input.clientDpi);
    if (input.clientId) {
      formData.set('clientId', input.clientId);
    }
    formData.set('salePrice', String(input.salePrice));
    formData.set('operationDate', input.operationDate);
    if (input.dpiImage) {
      formData.set('dpiImage', input.dpiImage);
    }
    return this.http
      .post<ApiSuccessResponse<SimSaleRegistration>>(`${BASE_URL}/sale-registrations`, formData)
      .pipe(map((response) => response.data));
  }

  /** "Administrar Ventas de SIM" listing — same pagination shape as `PurchasesService.getPurchases`. */
  getSaleRegistrations(
    filters?: ListSimSaleRegistrationsFilters,
  ): Observable<PaginatedSimSaleRegistrations> {
    let params = new HttpParams();
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      }
    }
    return this.http
      .get<ApiSuccessResponse<PaginatedSimSaleRegistrations>>(`${BASE_URL}/sale-registrations`, { params })
      .pipe(map((response) => response.data));
  }

  getSaleRegistrationById(id: string): Observable<SimSaleRegistration> {
    return this.http
      .get<ApiSuccessResponse<SimSaleRegistration>>(`${BASE_URL}/sale-registrations/${id}`)
      .pipe(map((response) => response.data));
  }

  /** Fetched as a `Blob`, never a direct `<img [src]>` URL — the endpoint requires a JWT (`authInterceptor` attaches it to any `environment.apiUrl` request), which a bare `<img src>` can never send. The caller turns this into an object URL via `URL.createObjectURL` and revokes it when done. */
  getDpiImage(registrationId: string): Observable<Blob> {
    return this.http.get(`${BASE_URL}/sale-registrations/${registrationId}/dpi-image`, {
      responseType: 'blob',
    });
  }

  /** "Anular" — admin-only server-side; never a physical delete/edit, restores the underlying sale's SIM stock atomically. */
  voidSaleRegistration(id: string, reason: string): Observable<SimSaleRegistration> {
    return this.http
      .post<ApiSuccessResponse<SimSaleRegistration>>(`${BASE_URL}/sale-registrations/${id}/void`, { reason })
      .pipe(map((response) => response.data));
  }
}
