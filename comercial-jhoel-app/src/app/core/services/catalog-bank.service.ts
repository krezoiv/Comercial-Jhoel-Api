import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, CatalogBank, CreateCatalogBankInput, UpdateCatalogBankInput } from '../models';

const BASE_URL = `${environment.apiUrl}/catalog-banks`;

/** Admin "Sistema → Catálogo de Bancos" — CRUD + orden + imagen. Todo el controller es admin-only en el backend. */
@Injectable({ providedIn: 'root' })
export class CatalogBankService {
  private readonly http = inject(HttpClient);

  getBanks(includeInactive = true, search?: string): Observable<CatalogBank[]> {
    return this.http
      .get<ApiSuccessResponse<CatalogBank[]>>(BASE_URL, {
        params: { includeInactive, ...(search ? { search } : {}) },
      })
      .pipe(map((response) => response.data));
  }

  getBankById(id: string): Observable<CatalogBank> {
    return this.http.get<ApiSuccessResponse<CatalogBank>>(`${BASE_URL}/${id}`).pipe(map((response) => response.data));
  }

  createBank(input: CreateCatalogBankInput): Observable<CatalogBank> {
    return this.http.post<ApiSuccessResponse<CatalogBank>>(BASE_URL, input).pipe(map((response) => response.data));
  }

  updateBank(id: string, input: UpdateCatalogBankInput): Observable<CatalogBank> {
    return this.http
      .patch<ApiSuccessResponse<CatalogBank>>(`${BASE_URL}/${id}`, input)
      .pipe(map((response) => response.data));
  }

  activateBank(id: string): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/${id}/activate`, {});
  }

  /** Soft delete — el backend desactiva, nunca borra la fila (histórico preservado). */
  deactivateBank(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }

  reorderBanks(items: { id: string; sortOrder: number }[]): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/reorder`, { items });
  }

  setImage(catalogBankId: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.set('image', file);
    return this.http.post<void>(`${BASE_URL}/${catalogBankId}/image`, formData);
  }

  removeImage(catalogBankId: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${catalogBankId}/image`);
  }

  getImageUrl(catalogBankId: string): string {
    return `${environment.apiUrl}/public-catalog-banks/images/${catalogBankId}`;
  }
}
