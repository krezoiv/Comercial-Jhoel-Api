import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, CatalogRequest, CreateCatalogRequestPayload, PublicCatalogPhone } from '../models';
import { getVisitorId } from '../utils/visitor-id.util';

const BASE_URL = `${environment.apiUrl}/public-catalog`;

/** Público, sin autenticación — backs la sección "Teléfonos" de la landing y el modal de interés. Mismo `apiUrl`, el interceptor de auth simplemente no encuentra token que adjuntar. */
@Injectable({ providedIn: 'root' })
export class PublicCatalogService {
  private readonly http = inject(HttpClient);

  getPublishedPhones(): Observable<PublicCatalogPhone[]> {
    return this.http
      .get<ApiSuccessResponse<PublicCatalogPhone[]>>(`${BASE_URL}/phones`, {
        headers: { 'X-Visitor-Id': getVisitorId() },
      })
      .pipe(map((response) => response.data));
  }

  getPhoneById(id: string): Observable<PublicCatalogPhone> {
    return this.http
      .get<ApiSuccessResponse<PublicCatalogPhone>>(`${BASE_URL}/phones/${id}`, {
        headers: { 'X-Visitor-Id': getVisitorId() },
      })
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

  likePhone(id: string): Observable<{ likesCount: number; liked: boolean }> {
    return this.http
      .post<ApiSuccessResponse<{ likesCount: number; liked: boolean }>>(
        `${BASE_URL}/phones/${id}/like`,
        {},
        { headers: { 'X-Visitor-Id': getVisitorId() } },
      )
      .pipe(map((response) => response.data));
  }

  unlikePhone(id: string): Observable<{ likesCount: number; liked: boolean }> {
    return this.http
      .post<ApiSuccessResponse<{ likesCount: number; liked: boolean }>>(
        `${BASE_URL}/phones/${id}/unlike`,
        {},
        { headers: { 'X-Visitor-Id': getVisitorId() } },
      )
      .pipe(map((response) => response.data));
  }
}
