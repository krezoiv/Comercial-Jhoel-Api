import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, PublicNewsArticle } from '../models';
import { getVisitorId } from '../utils/visitor-id.util';

const BASE_URL = `${environment.apiUrl}/public-news`;

/** Público, sin autenticación — backs "Noticias" en la landing. */
@Injectable({ providedIn: 'root' })
export class PublicNewsService {
  private readonly http = inject(HttpClient);

  getPublishedArticles(): Observable<PublicNewsArticle[]> {
    return this.http
      .get<ApiSuccessResponse<PublicNewsArticle[]>>(BASE_URL, {
        headers: { 'X-Visitor-Id': getVisitorId() },
      })
      .pipe(map((response) => response.data));
  }

  getArticleById(id: string): Observable<PublicNewsArticle> {
    return this.http
      .get<ApiSuccessResponse<PublicNewsArticle>>(`${BASE_URL}/${id}`, {
        headers: { 'X-Visitor-Id': getVisitorId() },
      })
      .pipe(map((response) => response.data));
  }

  /** Backs la URL pública real `/noticias/:slug` — la que se manda en el mensaje de WhatsApp. */
  getArticleBySlug(slug: string): Observable<PublicNewsArticle> {
    return this.http
      .get<ApiSuccessResponse<PublicNewsArticle>>(`${BASE_URL}/by-slug/${slug}`, {
        headers: { 'X-Visitor-Id': getVisitorId() },
      })
      .pipe(map((response) => response.data));
  }

  getImageUrl(newsArticleId: string): string {
    return `${BASE_URL}/images/${newsArticleId}`;
  }

  likeArticle(id: string): Observable<{ likesCount: number; liked: boolean }> {
    return this.http
      .post<ApiSuccessResponse<{ likesCount: number; liked: boolean }>>(
        `${BASE_URL}/${id}/like`,
        {},
        { headers: { 'X-Visitor-Id': getVisitorId() } },
      )
      .pipe(map((response) => response.data));
  }

  unlikeArticle(id: string): Observable<{ likesCount: number; liked: boolean }> {
    return this.http
      .post<ApiSuccessResponse<{ likesCount: number; liked: boolean }>>(
        `${BASE_URL}/${id}/unlike`,
        {},
        { headers: { 'X-Visitor-Id': getVisitorId() } },
      )
      .pipe(map((response) => response.data));
  }
}
