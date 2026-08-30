import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AgentReconciliation,
  ApiSuccessResponse,
  BankBalancesValidation,
  CuadreAgentesSummary,
  DayStatus,
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

  /**
   * "¿Se guardaron los saldos bancarios de esta fecha?" — el pre-chequeo
   * que habilita/bloquea "Guardar Cuadre" en pantalla. Es solo
   * experiencia de usuario: `registerReconciliation` vuelve a exigir esto
   * de forma independiente en el backend antes de guardar.
   */
  validateBankBalances(date?: string): Observable<BankBalancesValidation> {
    return this.http
      .get<ApiSuccessResponse<BankBalancesValidation>>(`${BASE_URL}/balances/validation`, {
        params: date ? { date } : {},
      })
      .pipe(map((response) => response.data));
  }

  /** "¿Está aperturado el día? ¿Se guardaron los saldos? ¿Se puede entrar a Cuadre Agentes?" — las cuatro preguntas de la secuencia obligatoria en una sola llamada. */
  getDayStatus(date?: string): Observable<DayStatus> {
    return this.http
      .get<ApiSuccessResponse<DayStatus>>(`${BASE_URL}/day-status`, { params: date ? { date } : {} })
      .pipe(map((response) => response.data));
  }

  /** "Confirmar Apertura" — idempotente en el backend, así que llamarlo dos veces nunca falla ni duplica nada. */
  openDay(date?: string): Observable<DayStatus> {
    return this.http
      .post<ApiSuccessResponse<DayStatus>>(`${BASE_URL}/day-status/open`, date ? { date } : {})
      .pipe(map((response) => response.data));
  }
}
