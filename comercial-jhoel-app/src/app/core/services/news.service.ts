import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, CreateNewsArticleInput, NewsArticle, UpdateNewsArticleInput } from '../models';

const BASE_URL = `${environment.apiUrl}/news`;

/** Admin "Sistema → Noticias" — CRUD + orden + imagen. Todo el controller es admin-only en el backend. */
@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly http = inject(HttpClient);

  getArticles(includeInactive = true, search?: string): Observable<NewsArticle[]> {
    return this.http
      .get<ApiSuccessResponse<NewsArticle[]>>(BASE_URL, {
        params: { includeInactive, ...(search ? { search } : {}) },
      })
      .pipe(map((response) => response.data));
  }

  getArticleById(id: string): Observable<NewsArticle> {
    return this.http.get<ApiSuccessResponse<NewsArticle>>(`${BASE_URL}/${id}`).pipe(map((response) => response.data));
  }

  createArticle(input: CreateNewsArticleInput): Observable<NewsArticle> {
    return this.http.post<ApiSuccessResponse<NewsArticle>>(BASE_URL, input).pipe(map((response) => response.data));
  }

  updateArticle(id: string, input: UpdateNewsArticleInput): Observable<NewsArticle> {
    return this.http
      .patch<ApiSuccessResponse<NewsArticle>>(`${BASE_URL}/${id}`, input)
      .pipe(map((response) => response.data));
  }

  activateArticle(id: string): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/${id}/activate`, {});
  }

  /** Soft delete — el backend desactiva, nunca borra la fila (histórico preservado). */
  deactivateArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }

  reorderArticles(items: { id: string; sortOrder: number }[]): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/reorder`, { items });
  }

  setImage(newsArticleId: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.set('image', file);
    return this.http.post<void>(`${BASE_URL}/${newsArticleId}/image`, formData);
  }

  removeImage(newsArticleId: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${newsArticleId}/image`);
  }

  getImageUrl(newsArticleId: string): string {
    return `${environment.apiUrl}/public-news/images/${newsArticleId}`;
  }
}
