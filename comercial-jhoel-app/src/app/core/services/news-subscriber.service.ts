import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, NewsSubscriber, NewsSubscriberDetail } from '../models';

const BASE_URL = `${environment.apiUrl}/news-subscribers`;

/** Admin "Sistema → Suscriptores de Noticias" — todo el controller es admin-only en el backend, incluidos los `GET` (expone WhatsApp/consentimiento de clientes). El número siempre llega ya enmascarado. */
@Injectable({ providedIn: 'root' })
export class NewsSubscriberService {
  private readonly http = inject(HttpClient);

  getSubscribers(includeInactive = true): Observable<NewsSubscriber[]> {
    return this.http
      .get<ApiSuccessResponse<NewsSubscriber[]>>(BASE_URL, { params: { includeInactive } })
      .pipe(map((response) => response.data));
  }

  getSubscriberById(id: string): Observable<NewsSubscriberDetail> {
    return this.http
      .get<ApiSuccessResponse<NewsSubscriberDetail>>(`${BASE_URL}/${id}`)
      .pipe(map((response) => response.data));
  }

  activateSubscriber(id: string): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/${id}/activate`, {});
  }

  /** Soft — el backend nunca borra la fila (histórico preservado). */
  deactivateSubscriber(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }
}
