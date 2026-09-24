import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, CreateLandingBackgroundInput, LandingBackground, UpdateLandingBackgroundInput } from '../models';

const BASE_URL = `${environment.apiUrl}/landing-backgrounds`;

/** Admin "Sistema → Fondos de Landing" — CRUD + imagen. Todo el controller es admin-only en el backend. */
@Injectable({ providedIn: 'root' })
export class LandingBackgroundService {
  private readonly http = inject(HttpClient);

  getBackgrounds(includeInactive = true): Observable<LandingBackground[]> {
    return this.http
      .get<ApiSuccessResponse<LandingBackground[]>>(BASE_URL, { params: { includeInactive } })
      .pipe(map((response) => response.data));
  }

  getBackgroundById(id: string): Observable<LandingBackground> {
    return this.http
      .get<ApiSuccessResponse<LandingBackground>>(`${BASE_URL}/${id}`)
      .pipe(map((response) => response.data));
  }

  createBackground(input: CreateLandingBackgroundInput): Observable<LandingBackground> {
    return this.http
      .post<ApiSuccessResponse<LandingBackground>>(BASE_URL, input)
      .pipe(map((response) => response.data));
  }

  updateBackground(id: string, input: UpdateLandingBackgroundInput): Observable<LandingBackground> {
    return this.http
      .patch<ApiSuccessResponse<LandingBackground>>(`${BASE_URL}/${id}`, input)
      .pipe(map((response) => response.data));
  }

  activateBackground(id: string): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/${id}/activate`, {});
  }

  /** Soft delete — el backend desactiva, nunca borra la fila (histórico preservado). */
  deactivateBackground(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }

  setImage(landingBackgroundId: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.set('image', file);
    return this.http.post<void>(`${BASE_URL}/${landingBackgroundId}/image`, formData);
  }

  removeImage(landingBackgroundId: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${landingBackgroundId}/image`);
  }

  getImageUrl(landingBackgroundId: string): string {
    return `${environment.apiUrl}/public-landing-backgrounds/images/${landingBackgroundId}`;
  }
}
