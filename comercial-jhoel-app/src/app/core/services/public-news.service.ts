import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, PublicNewsArticle } from '../models';

const BASE_URL = `${environment.apiUrl}/public-news`;

/** Público, sin autenticación — backs "Noticias" en la landing. */
@Injectable({ providedIn: 'root' })
export class PublicNewsService {
  private readonly http = inject(HttpClient);

  getPublishedArticles(): Observable<PublicNewsArticle[]> {
    return this.http.get<ApiSuccessResponse<PublicNewsArticle[]>>(BASE_URL).pipe(map((response) => response.data));
  }

  getArticleById(id: string): Observable<PublicNewsArticle> {
    return this.http
      .get<ApiSuccessResponse<PublicNewsArticle>>(`${BASE_URL}/${id}`)
      .pipe(map((response) => response.data));
  }

  getImageUrl(newsArticleId: string): string {
    return `${BASE_URL}/images/${newsArticleId}`;
  }

  likeArticle(id: string): Observable<number> {
    return this.http
      .post<ApiSuccessResponse<{ likesCount: number }>>(`${BASE_URL}/${id}/like`, {})
      .pipe(map((response) => response.data.likesCount));
  }

  unlikeArticle(id: string): Observable<number> {
    return this.http
      .post<ApiSuccessResponse<{ likesCount: number }>>(`${BASE_URL}/${id}/unlike`, {})
      .pipe(map((response) => response.data.likesCount));
  }
}
