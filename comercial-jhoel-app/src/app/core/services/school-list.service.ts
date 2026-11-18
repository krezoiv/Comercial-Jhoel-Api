import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  CreateSchoolQuotationInput,
  SaveSchoolTemplateInput,
  SchoolCancelInput,
  SchoolDashboard,
  SchoolListPermission,
  SchoolPaymentInput,
  SchoolQuotation,
  SchoolQuotationFilters,
  SchoolQuotationInput,
  SchoolQuotationPage,
  SchoolStatusAction,
  SchoolTemplate,
  SchoolTemplateSummary,
} from '../models';

const BASE_URL = `${environment.apiUrl}/school-lists`;

function toParams(filters: object): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(key, String(value));
    }
  }
  return params;
}

/**
 * API client of Listas Escolares. Permissions come from the backend
 * (`GET /school-lists/permissions`) so the UI shows exactly the actions the
 * role may run — the backend and SQL still enforce them.
 */
@Injectable({ providedIn: 'root' })
export class SchoolListService {
  private readonly http = inject(HttpClient);

  private readonly permissionSet = signal<ReadonlySet<SchoolListPermission>>(new Set());
  readonly permissionsLoaded = signal(false);
  readonly permissions = computed(() => this.permissionSet());

  can(permission: SchoolListPermission): boolean {
    return this.permissionSet().has(permission);
  }

  loadPermissions(): Observable<SchoolListPermission[]> {
    return this.http.get<ApiSuccessResponse<{ permissions: SchoolListPermission[] }>>(`${BASE_URL}/permissions`).pipe(
      map((r) => r.data.permissions),
      tap((permissions) => {
        this.permissionSet.set(new Set(permissions));
        this.permissionsLoaded.set(true);
      }),
    );
  }

  // ── Templates ────────────────────────────────────────────────────────────
  getTemplates(includeInactive = false): Observable<SchoolTemplateSummary[]> {
    return this.http
      .get<ApiSuccessResponse<SchoolTemplateSummary[]>>(`${BASE_URL}/templates`, {
        params: toParams({ includeInactive: includeInactive ? 'true' : undefined }),
      })
      .pipe(map((r) => r.data));
  }

  getTemplate(id: string): Observable<SchoolTemplate> {
    return this.http.get<ApiSuccessResponse<SchoolTemplate>>(`${BASE_URL}/templates/${id}`).pipe(map((r) => r.data));
  }

  saveTemplate(id: string | null, input: SaveSchoolTemplateInput): Observable<SchoolTemplate> {
    const request = id
      ? this.http.put<ApiSuccessResponse<SchoolTemplate>>(`${BASE_URL}/templates/${id}`, input)
      : this.http.post<ApiSuccessResponse<SchoolTemplate>>(`${BASE_URL}/templates`, input);
    return request.pipe(map((r) => r.data));
  }

  setTemplateActive(id: string, isActive: boolean): Observable<SchoolTemplate> {
    return this.http
      .patch<ApiSuccessResponse<SchoolTemplate>>(`${BASE_URL}/templates/${id}/status`, { isActive })
      .pipe(map((r) => r.data));
  }

  duplicateTemplate(id: string, name: string, grade?: string): Observable<SchoolTemplate> {
    return this.http
      .post<ApiSuccessResponse<SchoolTemplate>>(`${BASE_URL}/templates/${id}/duplicate`, { name, grade: grade || undefined })
      .pipe(map((r) => r.data));
  }

  // ── Quotations ───────────────────────────────────────────────────────────
  getQuotations(filters: SchoolQuotationFilters): Observable<SchoolQuotationPage> {
    return this.http
      .get<ApiSuccessResponse<SchoolQuotationPage>>(`${BASE_URL}/quotations`, { params: toParams(filters) })
      .pipe(map((r) => r.data));
  }

  getDashboard(dateFrom?: string, dateTo?: string): Observable<SchoolDashboard> {
    return this.http
      .get<ApiSuccessResponse<SchoolDashboard>>(`${BASE_URL}/quotations/dashboard`, {
        params: toParams({ dateFrom, dateTo }),
      })
      .pipe(map((r) => r.data));
  }

  getQuotation(id: string): Observable<SchoolQuotation> {
    return this.http.get<ApiSuccessResponse<SchoolQuotation>>(`${BASE_URL}/quotations/${id}`).pipe(map((r) => r.data));
  }

  createQuotation(input: CreateSchoolQuotationInput): Observable<SchoolQuotation> {
    return this.http.post<ApiSuccessResponse<SchoolQuotation>>(`${BASE_URL}/quotations`, input).pipe(map((r) => r.data));
  }

  updateQuotation(id: string, input: SchoolQuotationInput, version: number): Observable<SchoolQuotation> {
    return this.http
      .put<ApiSuccessResponse<SchoolQuotation>>(`${BASE_URL}/quotations/${id}`, { ...input, version })
      .pipe(map((r) => r.data));
  }

  updateObservations(id: string, observations: string, version: number): Observable<SchoolQuotation> {
    return this.http
      .patch<ApiSuccessResponse<SchoolQuotation>>(`${BASE_URL}/quotations/${id}/observations`, {
        observations,
        version,
      })
      .pipe(map((r) => r.data));
  }

  changeStatus(id: string, action: SchoolStatusAction, version: number): Observable<SchoolQuotation> {
    return this.http
      .post<ApiSuccessResponse<SchoolQuotation>>(`${BASE_URL}/quotations/${id}/status`, { action, version })
      .pipe(map((r) => r.data));
  }

  cancelQuotation(id: string, input: SchoolCancelInput): Observable<SchoolQuotation> {
    return this.http
      .post<ApiSuccessResponse<SchoolQuotation>>(`${BASE_URL}/quotations/${id}/cancel`, input)
      .pipe(map((r) => r.data));
  }

  registerPayment(
    quotationId: string,
    input: SchoolPaymentInput,
    clientRequestId: string,
  ): Observable<{ paymentId: string; quotation: SchoolQuotation }> {
    return this.http
      .post<ApiSuccessResponse<{ paymentId: string; quotation: SchoolQuotation }>>(
        `${BASE_URL}/quotations/${quotationId}/payments`,
        { ...input, clientRequestId },
      )
      .pipe(map((r) => r.data));
  }

  voidPayment(
    paymentId: string,
    reason: string,
    clientRequestId: string,
  ): Observable<{ reversalId: string; quotation: SchoolQuotation }> {
    return this.http
      .post<ApiSuccessResponse<{ reversalId: string; quotation: SchoolQuotation }>>(
        `${BASE_URL}/payments/${paymentId}/void`,
        { reason, clientRequestId },
      )
      .pipe(map((r) => r.data));
  }

  // ── Documents ────────────────────────────────────────────────────────────
  quotationPdf(id: string): Observable<Blob> {
    return this.http.get(`${BASE_URL}/quotations/${id}/pdf`, { responseType: 'blob' });
  }

  receiptPdf(paymentId: string): Observable<Blob> {
    return this.http.get(`${BASE_URL}/payments/${paymentId}/receipt`, { responseType: 'blob' });
  }
}
