import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse } from '../models';

const BASE_URL = `${environment.apiUrl}/public-site-visits`;

export interface VisitCount {
  total: number;
}

/**
 * Contador anónimo y agregado de visitas a la landing pública — el backend
 * es la única fuente de verdad (nunca `localStorage`/`sessionStorage`/
 * cookies). `registerVisit()` se llama UNA vez por carga real de la landing
 * (ver `LandingPageComponent`, que solo se construye al navegar A la ruta
 * `/`, nunca al desplazarse entre anchors dentro de ella) — nunca aquí
 * mismo, para no arriesgar una doble llamada si este servicio llegara a
 * inyectarse en más de un lugar.
 */
@Injectable({ providedIn: 'root' })
export class SiteVisitsService {
  private readonly http = inject(HttpClient);

  /** Suma +1 en el backend — el frontend nunca envía ni puede fijar un total. */
  registerVisit(): Observable<VisitCount> {
    return this.http
      .post<ApiSuccessResponse<VisitCount>>(BASE_URL, {})
      .pipe(map((response) => response.data));
  }

  getVisitCount(): Observable<VisitCount> {
    return this.http
      .get<ApiSuccessResponse<VisitCount>>(BASE_URL)
      .pipe(map((response) => response.data));
  }
}
