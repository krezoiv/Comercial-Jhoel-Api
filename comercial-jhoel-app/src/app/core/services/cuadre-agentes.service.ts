import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AgentReconciliation,
  ApiSuccessResponse,
  CuadreAgentesSummary,
  RegisterAgentReconciliationInput,
} from '../models';

const BASE_URL = `${environment.apiUrl}/banks`;
const RECONCILIATIONS_URL = `${environment.apiUrl}/agent-reconciliations`;

@Injectable({ providedIn: 'root' })
export class CuadreAgentesService {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<CuadreAgentesSummary> {
    return this.http
      .get<ApiSuccessResponse<CuadreAgentesSummary>>(`${BASE_URL}/cuadre-agentes-summary`)
      .pipe(map((response) => response.data));
  }

  /** Segunda etapa — "Guardar Cuadre". Solo `totalCash` viaja al backend; los demás totales y el resultado siempre los recalcula el servidor. */
  registerReconciliation(input: RegisterAgentReconciliationInput): Observable<AgentReconciliation> {
    return this.http
      .post<ApiSuccessResponse<AgentReconciliation>>(RECONCILIATIONS_URL, input)
      .pipe(map((response) => response.data));
  }
}
