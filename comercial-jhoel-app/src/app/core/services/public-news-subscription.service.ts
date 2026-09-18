import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, PublicNewsType, SubscribeToNewsInput, Subscription } from '../models';

const BASE_URL = `${environment.apiUrl}/public-news-subscriptions`;

/**
 * Público, sin autenticación — backs la sección "Recibe nuestras noticias
 * por WhatsApp" de la landing y la página de autoservicio de preferencias
 * (`/noticias/preferencias/:token`). `token` nunca es el número de
 * WhatsApp — es el `manageToken` opaco devuelto al suscribirse.
 */
@Injectable({ providedIn: 'root' })
export class PublicNewsSubscriptionService {
  private readonly http = inject(HttpClient);

  getActiveTypes(): Observable<PublicNewsType[]> {
    return this.http
      .get<ApiSuccessResponse<PublicNewsType[]>>(`${BASE_URL}/types`)
      .pipe(map((response) => response.data));
  }

  subscribe(input: SubscribeToNewsInput): Observable<Subscription> {
    return this.http
      .post<ApiSuccessResponse<Subscription>>(`${BASE_URL}/subscribe`, input)
      .pipe(map((response) => response.data));
  }

  getByToken(token: string): Observable<Subscription> {
    return this.http
      .get<ApiSuccessResponse<Subscription>>(`${BASE_URL}/${token}`)
      .pipe(map((response) => response.data));
  }

  updatePreferences(token: string, typeIds: string[]): Observable<Subscription> {
    return this.http
      .patch<ApiSuccessResponse<Subscription>>(`${BASE_URL}/${token}`, { typeIds })
      .pipe(map((response) => response.data));
  }

  unsubscribe(token: string): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/${token}/unsubscribe`, {});
  }
}
