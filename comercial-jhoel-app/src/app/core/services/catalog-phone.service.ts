import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, CatalogPhone, CatalogPhoneImage, CatalogPhoneInput } from '../models';

const BASE_URL = `${environment.apiUrl}/catalog/phones`;

/** Admin "Catálogo → Teléfonos" — gestión completa (CRUD + publicar/despublicar + orden + imágenes). Todo el controller es admin-only en el backend. */
@Injectable({ providedIn: 'root' })
export class CatalogPhoneService {
  private readonly http = inject(HttpClient);

  getPhones(includeInactive = true, search?: string): Observable<CatalogPhone[]> {
    return this.http
      .get<ApiSuccessResponse<CatalogPhone[]>>(BASE_URL, { params: { includeInactive, ...(search ? { search } : {}) } })
      .pipe(map((response) => response.data));
  }

  getPhoneById(id: string): Observable<CatalogPhone> {
    return this.http.get<ApiSuccessResponse<CatalogPhone>>(`${BASE_URL}/${id}`).pipe(map((response) => response.data));
  }

  createPhone(input: CatalogPhoneInput): Observable<CatalogPhone> {
    return this.http.post<ApiSuccessResponse<CatalogPhone>>(BASE_URL, input).pipe(map((response) => response.data));
  }

  updatePhone(id: string, input: CatalogPhoneInput): Observable<CatalogPhone> {
    return this.http
      .patch<ApiSuccessResponse<CatalogPhone>>(`${BASE_URL}/${id}`, input)
      .pipe(map((response) => response.data));
  }

  activatePhone(id: string): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/${id}/activate`, {});
  }

  /** Soft delete — el backend desactiva y despublica el teléfono, nunca borra la fila. */
  deactivatePhone(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }

  publishPhone(id: string): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/${id}/publish`, {});
  }

  unpublishPhone(id: string): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/${id}/unpublish`, {});
  }

  reorderPhones(items: { id: string; sortOrder: number }[]): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/reorder`, { items });
  }

  /** `FormData` multipart — nunca fijar manualmente el header Content-Type, Angular/el navegador arman el boundary. */
  addImage(catalogPhoneId: string, file: File): Observable<CatalogPhoneImage> {
    const formData = new FormData();
    formData.set('image', file);
    return this.http
      .post<ApiSuccessResponse<CatalogPhoneImage>>(`${BASE_URL}/${catalogPhoneId}/images`, formData)
      .pipe(map((response) => response.data));
  }

  removeImage(catalogPhoneId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${catalogPhoneId}/images/${imageId}`);
  }

  setPrimaryImage(catalogPhoneId: string, imageId: string): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/${catalogPhoneId}/images/${imageId}/primary`, {});
  }

  /** URL pública (sin auth) de una imagen del catálogo — servida vía streaming con cache agresivo de navegador. Ruta bajo `/public-catalog`, distinta de este servicio's propio `BASE_URL` admin-gated (ver `PublicCatalogController`). */
  getImageUrl(imageId: string): string {
    return `${environment.apiUrl}/public-catalog/phones/images/${imageId}`;
  }
}
