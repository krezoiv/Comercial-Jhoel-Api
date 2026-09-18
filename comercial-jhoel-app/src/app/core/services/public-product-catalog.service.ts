import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  CatalogProductRequest,
  CatalogProductSection,
  CreateCatalogProductRequestPayload,
  PublicCatalogProduct,
} from '../models';
import { getVisitorId } from '../utils/visitor-id.util';

const BASE_URL = `${environment.apiUrl}/public-catalog`;

/** Público, sin autenticación — backs "Librería" y "Variedades y Accesorios" en la landing, y el modal "Lo quiero" de Variedades. */
@Injectable({ providedIn: 'root' })
export class PublicProductCatalogService {
  private readonly http = inject(HttpClient);

  getPublishedProducts(section: CatalogProductSection): Observable<PublicCatalogProduct[]> {
    return this.http
      .get<ApiSuccessResponse<PublicCatalogProduct[]>>(`${BASE_URL}/products`, {
        params: { section },
        headers: { 'X-Visitor-Id': getVisitorId() },
      })
      .pipe(map((response) => response.data));
  }

  getProductById(id: string): Observable<PublicCatalogProduct> {
    return this.http
      .get<ApiSuccessResponse<PublicCatalogProduct>>(`${BASE_URL}/products/${id}`, {
        headers: { 'X-Visitor-Id': getVisitorId() },
      })
      .pipe(map((response) => response.data));
  }

  getImageUrl(catalogProductId: string): string {
    return `${BASE_URL}/products/images/${catalogProductId}`;
  }

  createRequest(payload: CreateCatalogProductRequestPayload): Observable<CatalogProductRequest> {
    return this.http
      .post<ApiSuccessResponse<CatalogProductRequest>>(`${BASE_URL}/product-requests`, payload)
      .pipe(map((response) => response.data));
  }

  likeProduct(id: string): Observable<{ likesCount: number; liked: boolean }> {
    return this.http
      .post<ApiSuccessResponse<{ likesCount: number; liked: boolean }>>(
        `${BASE_URL}/products/${id}/like`,
        {},
        { headers: { 'X-Visitor-Id': getVisitorId() } },
      )
      .pipe(map((response) => response.data));
  }

  unlikeProduct(id: string): Observable<{ likesCount: number; liked: boolean }> {
    return this.http
      .post<ApiSuccessResponse<{ likesCount: number; liked: boolean }>>(
        `${BASE_URL}/products/${id}/unlike`,
        {},
        { headers: { 'X-Visitor-Id': getVisitorId() } },
      )
      .pipe(map((response) => response.data));
  }
}
