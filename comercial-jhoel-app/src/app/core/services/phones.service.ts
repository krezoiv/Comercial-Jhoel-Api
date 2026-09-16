import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, CreatePhoneInput, Phone, PhoneSale, RegisterPhoneSaleInput } from '../models';

const PHONES_URL = `${environment.apiUrl}/phones`;
const PHONE_SALES_URL = `${environment.apiUrl}/phone-sales`;

/** Mirrors `RechargeSimsService`'s own shape — `registerSale`/`getSaleDpiImage` follow the identical `FormData`/blob conventions documented there. */
@Injectable({ providedIn: 'root' })
export class PhonesService {
  private readonly http = inject(HttpClient);

  createPhone(input: CreatePhoneInput): Observable<Phone> {
    return this.http.post<ApiSuccessResponse<Phone>>(PHONES_URL, input).pipe(map((response) => response.data));
  }

  getPhones(): Observable<Phone[]> {
    return this.http.get<ApiSuccessResponse<Phone[]>>(PHONES_URL).pipe(map((response) => response.data));
  }

  getPhoneById(id: string): Observable<Phone> {
    return this.http
      .get<ApiSuccessResponse<Phone>>(`${PHONES_URL}/${id}`)
      .pipe(map((response) => response.data));
  }

  /**
   * `FormData`, not JSON — `dpiImage` (when present) is a real file. Angular's
   * `HttpClient` sets the correct `multipart/form-data` boundary automatically
   * for a `FormData` body — never set `Content-Type` manually here.
   */
  registerSale(input: RegisterPhoneSaleInput): Observable<PhoneSale> {
    const formData = new FormData();
    formData.set('phoneId', input.phoneId);
    if (input.clientId) {
      formData.set('clientId', input.clientId);
    }
    formData.set('clientDpi', input.clientDpi);
    formData.set('phoneNumber', input.phoneNumber);
    formData.set('saleDate', input.saleDate);
    if (input.dpiImage) {
      formData.set('dpiImage', input.dpiImage);
    }
    return this.http
      .post<ApiSuccessResponse<PhoneSale>>(PHONE_SALES_URL, formData)
      .pipe(map((response) => response.data));
  }

  getSales(): Observable<PhoneSale[]> {
    return this.http
      .get<ApiSuccessResponse<PhoneSale[]>>(PHONE_SALES_URL)
      .pipe(map((response) => response.data));
  }

  getSaleById(id: string): Observable<PhoneSale> {
    return this.http
      .get<ApiSuccessResponse<PhoneSale>>(`${PHONE_SALES_URL}/${id}`)
      .pipe(map((response) => response.data));
  }

  /** Fetched as a `Blob`, never a direct `<img [src]>` URL — the endpoint requires a JWT a bare `<img src>` can never send. */
  getSaleDpiImage(id: string): Observable<Blob> {
    return this.http.get(`${PHONE_SALES_URL}/${id}/dpi-image`, { responseType: 'blob' });
  }

  /** Admin-only server-side; never a physical delete/edit — restores the phone to `DISPONIBLE`. */
  voidSale(id: string, reason: string): Observable<PhoneSale> {
    return this.http
      .post<ApiSuccessResponse<PhoneSale>>(`${PHONE_SALES_URL}/${id}/void`, { reason })
      .pipe(map((response) => response.data));
  }
}
