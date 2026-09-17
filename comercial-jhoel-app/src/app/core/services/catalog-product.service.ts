import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  CatalogProduct,
  CatalogProductSection,
  CreateCatalogProductInput,
  UpdateCatalogProductInput,
} from '../models';

const BASE_URL = `${environment.apiUrl}/catalog/products`;

/** Admin "Catálogo → Librería"/"Variedades y Accesorios" — un solo servicio compartido, parametrizado por `section`. Todo el controller es admin-only en el backend. */
@Injectable({ providedIn: 'root' })
export class CatalogProductService {
  private readonly http = inject(HttpClient);

  getProducts(
    section: CatalogProductSection,
    includeInactive = true,
    search?: string,
  ): Observable<CatalogProduct[]> {
    return this.http
      .get<ApiSuccessResponse<CatalogProduct[]>>(BASE_URL, {
        params: { section, includeInactive, ...(search ? { search } : {}) },
      })
      .pipe(map((response) => response.data));
  }

  getProductById(id: string): Observable<CatalogProduct> {
    return this.http
      .get<ApiSuccessResponse<CatalogProduct>>(`${BASE_URL}/${id}`)
      .pipe(map((response) => response.data));
  }

  createProduct(input: CreateCatalogProductInput): Observable<CatalogProduct> {
    return this.http
      .post<ApiSuccessResponse<CatalogProduct>>(BASE_URL, input)
      .pipe(map((response) => response.data));
  }

  updateProduct(id: string, input: UpdateCatalogProductInput): Observable<CatalogProduct> {
    return this.http
      .patch<ApiSuccessResponse<CatalogProduct>>(`${BASE_URL}/${id}`, input)
      .pipe(map((response) => response.data));
  }

  activateProduct(id: string): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/${id}/activate`, {});
  }

  /** Soft delete — el backend desactiva, nunca borra la fila. */
  deactivateProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }

  reorderProducts(items: { id: string; sortOrder: number }[]): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/reorder`, { items });
  }

  /** `FormData` multipart — nunca fijar manualmente el header Content-Type. */
  setImage(catalogProductId: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.set('image', file);
    return this.http.post<void>(`${BASE_URL}/${catalogProductId}/image`, formData);
  }

  removeImage(catalogProductId: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${catalogProductId}/image`);
  }

  /** URL pública (sin auth), bajo `/public-catalog` — distinta del `BASE_URL` admin-gated de este servicio. */
  getImageUrl(catalogProductId: string): string {
    return `${environment.apiUrl}/public-catalog/products/images/${catalogProductId}`;
  }
}
