import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, CatalogRequest, CreateCatalogRequestPayload, PublicCatalogPhone } from '../models';

const BASE_URL = `${environment.apiUrl}/public-catalog`;

/** Público, sin autenticación — backs la sección "Teléfonos" de la landing y el modal de interés. Mismo `apiUrl`, el interceptor de auth simplemente no encuentra token que adjuntar. */
@Injectable({ providedIn: 'root' })
export class PublicCatalogService {
  private readonly http = inject(HttpClient);

  getPublishedPhones(): Observable<PublicCatalogPhone[]> {
    return this.http
      .get<ApiSuccessResponse<PublicCatalogPhone[]>>(`${BASE_URL}/phones`)
      .pipe(map((response) => response.data));
  }

  getPhoneById(id: string): Observable<PublicCatalogPhone> {
    return this.http
      .get<ApiSuccessResponse<PublicCatalogPhone>>(`${BASE_URL}/phones/${id}`)
      .pipe(map((response) => response.data));
  }

  getImageUrl(imageId: string): string {
    return `${BASE_URL}/phones/images/${imageId}`;
  }

  createRequest(payload: CreateCatalogRequestPayload): Observable<CatalogRequest> {
    return this.http
      .post<ApiSuccessResponse<CatalogRequest>>(`${BASE_URL}/requests`, payload)
      .pipe(map((response) => response.data));
  }

  likePhone(id: string): Observable<number> {
    return this.http
      .post<ApiSuccessResponse<{ likesCount: number }>>(`${BASE_URL}/phones/${id}/like`, {})
      .pipe(map((response) => response.data.likesCount));
  }

  unlikePhone(id: string): Observable<number> {
    return this.http
      .post<ApiSuccessResponse<{ likesCount: number }>>(`${BASE_URL}/phones/${id}/unlike`, {})
      .pipe(map((response) => response.data.likesCount));
  }
}
