import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  CatalogProductRequest,
  ListCatalogProductRequestsFilters,
  UpdateCatalogProductRequestStatusInput,
} from '../models';

const BASE_URL = `${environment.apiUrl}/catalog/product-requests`;

/** Admin "Solicitudes de Variedades" — leads de "Lo quiero" capturados desde la landing pública. Librería nunca genera filas aquí. */
@Injectable({ providedIn: 'root' })
export class CatalogProductRequestService {
  private readonly http = inject(HttpClient);

  getRequests(filters?: ListCatalogProductRequestsFilters): Observable<CatalogProductRequest[]> {
    const params: Record<string, string> = {};
    if (filters?.status) params['status'] = filters.status;
    if (filters?.startDate) params['startDate'] = filters.startDate;
    if (filters?.endDate) params['endDate'] = filters.endDate;

    return this.http
      .get<ApiSuccessResponse<CatalogProductRequest[]>>(BASE_URL, { params })
      .pipe(map((response) => response.data));
  }

  getRequestById(id: string): Observable<CatalogProductRequest> {
    return this.http
      .get<ApiSuccessResponse<CatalogProductRequest>>(`${BASE_URL}/${id}`)
      .pipe(map((response) => response.data));
  }

  updateStatus(
    id: string,
    input: UpdateCatalogProductRequestStatusInput,
  ): Observable<CatalogProductRequest> {
    return this.http
      .patch<ApiSuccessResponse<CatalogProductRequest>>(`${BASE_URL}/${id}/status`, input)
      .pipe(map((response) => response.data));
  }
}
