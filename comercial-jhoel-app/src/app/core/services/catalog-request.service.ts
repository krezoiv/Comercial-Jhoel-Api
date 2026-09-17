import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  CatalogRequest,
  ListCatalogRequestsFilters,
  UpdateCatalogRequestStatusInput,
} from '../models';

const BASE_URL = `${environment.apiUrl}/catalog/requests`;

/** Admin "Catálogo → Solicitudes" — leads de interés/crédito capturados desde la landing pública. */
@Injectable({ providedIn: 'root' })
export class CatalogRequestService {
  private readonly http = inject(HttpClient);

  getRequests(filters?: ListCatalogRequestsFilters): Observable<CatalogRequest[]> {
    const params: Record<string, string> = {};
    if (filters?.status) params['status'] = filters.status;
    if (filters?.requestType) params['requestType'] = filters.requestType;
    if (filters?.startDate) params['startDate'] = filters.startDate;
    if (filters?.endDate) params['endDate'] = filters.endDate;

    return this.http
      .get<ApiSuccessResponse<CatalogRequest[]>>(BASE_URL, { params })
      .pipe(map((response) => response.data));
  }

  getRequestById(id: string): Observable<CatalogRequest> {
    return this.http.get<ApiSuccessResponse<CatalogRequest>>(`${BASE_URL}/${id}`).pipe(map((response) => response.data));
  }

  updateStatus(id: string, input: UpdateCatalogRequestStatusInput): Observable<CatalogRequest> {
    return this.http
      .patch<ApiSuccessResponse<CatalogRequest>>(`${BASE_URL}/${id}/status`, input)
      .pipe(map((response) => response.data));
  }
}
