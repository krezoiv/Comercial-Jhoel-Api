import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, SalesRegisterSummary } from '../models';

/** Talks to `${environment.apiUrl}/sales-register` — "Gestión de Caja de Ventas", read-only. */
@Injectable({ providedIn: 'root' })
export class SalesRegisterService {
  private readonly http = inject(HttpClient);

  /** `date` — `yyyy-MM-dd`, omit for today (server-resolved, `America/Guatemala`). */
  getSummary(date?: string): Observable<SalesRegisterSummary> {
    return this.http
      .get<ApiSuccessResponse<SalesRegisterSummary>>(`${environment.apiUrl}/sales-register/summary`, {
        params: date ? { date } : {},
      })
      .pipe(map((response) => response.data));
  }
}
