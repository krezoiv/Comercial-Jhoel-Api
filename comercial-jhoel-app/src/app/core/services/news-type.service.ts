import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, CreateNewsTypeInput, NewsType, UpdateNewsTypeInput } from '../models';

const BASE_URL = `${environment.apiUrl}/news-types`;

/** Admin "Sistema → Tipos de Noticias" — CRUD + orden. Lectura abierta a cualquier rol autenticado (la usa el selector "Tipo de noticia" del form de Noticias); creación/edición/desactivación/orden son admin-only en el backend. */
@Injectable({ providedIn: 'root' })
export class NewsTypeService {
  private readonly http = inject(HttpClient);

  getTypes(includeInactive = true, search?: string): Observable<NewsType[]> {
    return this.http
      .get<ApiSuccessResponse<NewsType[]>>(BASE_URL, {
        params: { includeInactive, ...(search ? { search } : {}) },
      })
      .pipe(map((response) => response.data));
  }

  getTypeById(id: string): Observable<NewsType> {
    return this.http.get<ApiSuccessResponse<NewsType>>(`${BASE_URL}/${id}`).pipe(map((response) => response.data));
  }

  createType(input: CreateNewsTypeInput): Observable<NewsType> {
    return this.http.post<ApiSuccessResponse<NewsType>>(BASE_URL, input).pipe(map((response) => response.data));
  }

  updateType(id: string, input: UpdateNewsTypeInput): Observable<NewsType> {
    return this.http
      .patch<ApiSuccessResponse<NewsType>>(`${BASE_URL}/${id}`, input)
      .pipe(map((response) => response.data));
  }

  /** Soft delete — el backend desactiva, nunca borra la fila (histórico preservado). */
  deactivateType(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }

  reorderTypes(items: { id: string; sortOrder: number }[]): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/reorder`, { items });
  }
}
