import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, PublicLandingBackground } from '../models';

const BASE_URL = `${environment.apiUrl}/public-landing-backgrounds`;

/**
 * Público, sin autenticación — backs la capa de fondos 3D de la landing.
 * `getPublishedBackgrounds()` se cachea (`shareReplay(1)`) porque las 9
 * secciones de la landing la consultan independientemente vía
 * `SectionLandingBackgroundComponent` — sin esto serían 9 peticiones HTTP
 * idénticas en cada carga; con esto es siempre una sola, compartida.
 */
@Injectable({ providedIn: 'root' })
export class PublicLandingBackgroundService {
  private readonly http = inject(HttpClient);
  private backgrounds$: Observable<PublicLandingBackground[]> | null = null;

  getPublishedBackgrounds(): Observable<PublicLandingBackground[]> {
    if (!this.backgrounds$) {
      this.backgrounds$ = this.http
        .get<ApiSuccessResponse<PublicLandingBackground[]>>(BASE_URL)
        .pipe(
          map((response) => response.data),
          shareReplay(1),
        );
    }
    return this.backgrounds$;
  }

  getImageUrl(landingBackgroundId: string): string {
    return `${BASE_URL}/images/${landingBackgroundId}`;
  }
}
