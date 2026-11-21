import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  CreateSchoolQuotationInput,
  PaginatedResponse,
  SaveSchoolTemplateInput,
  SchoolCatalogFilters,
  SchoolCatalogPage,
  SchoolCatalogProduct,
  SchoolCancelInput,
  SchoolDashboard,
  SchoolListPermission,
  SchoolPaymentInput,
  SchoolPreparationAssignmentInput,
  SchoolPurgeSummary,
  SchoolQuotation,
  SchoolQuotationFilters,
  SchoolQuotationInput,
  SchoolQuotationPage,
  SchoolStatusAction,
  SchoolTemplate,
  SchoolTemplateSummary,
  SupplyAllocationMode,
  SupplyProductFilters,
  SupplyProductList,
  SupplyProductPage,
  SupplyPurchase,
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

  /**
   * "Devolver a cotización" (managers): audited correction of a list accepted by
   * mistake. The backend refuses it once the list has payments or preparation.
   */
  revertToQuote(id: string, reason: string, version: number): Observable<SchoolQuotation> {
    return this.http
      .post<ApiSuccessResponse<SchoolQuotation>>(`${BASE_URL}/quotations/${id}/revert-to-quote`, { reason, version })
      .pipe(map((r) => r.data));
  }

  /**
   * "Guardar preparación": inventory products assigned to each requirement of a
   * list in EN_PREPARACION. Moves no stock; "Finalizar preparación" is the
   * TERMINAR status action.
   */
  savePreparation(
    id: string,
    assignments: SchoolPreparationAssignmentInput[],
    version: number,
  ): Observable<SchoolQuotation> {
    return this.http
      .put<ApiSuccessResponse<SchoolQuotation>>(`${BASE_URL}/quotations/${id}/preparation`, { assignments, version })
      .pipe(map((r) => r.data));
  }

  /** What "Borrar todas las cotizaciones" would delete and return to Bodega (super administrators). */
  purgePreview(): Observable<SchoolPurgeSummary> {
    return this.http
      .get<ApiSuccessResponse<SchoolPurgeSummary>>(`${BASE_URL}/quotations/purge-preview`)
      .pipe(map((r) => r.data));
  }

  /** HARD delete of every school-list quotation (payments, history, inventory movements included). */
  purgeQuotations(confirmation: string): Observable<SchoolPurgeSummary> {
    return this.http
      .post<ApiSuccessResponse<SchoolPurgeSummary>>(`${BASE_URL}/quotations/purge`, { confirmation })
      .pipe(map((r) => r.data));
  }

  /** What deleting one quotation would remove and return to Bodega (super administrators). */
  deletePreview(id: string): Observable<SchoolPurgeSummary> {
    return this.http
      .get<ApiSuccessResponse<SchoolPurgeSummary>>(`${BASE_URL}/quotations/${id}/delete-preview`)
      .pipe(map((r) => r.data));
  }

  /** HARD delete of one quotation; `confirmation` is its number (e.g. "LE-000193"). */
  deleteQuotation(id: string, confirmation: string): Observable<SchoolPurgeSummary> {
    return this.http
      .post<ApiSuccessResponse<SchoolPurgeSummary>>(`${BASE_URL}/quotations/${id}/delete`, { confirmation })
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

  // ── Supply (abastecimiento) ──────────────────────────────────────────────
  supplyProducts(filters: SupplyProductFilters): Observable<SupplyProductPage> {
    return this.http
      .get<ApiSuccessResponse<SupplyProductPage>>(`${BASE_URL}/supply/products`, { params: toParams(filters) })
      .pipe(map((r) => r.data));
  }

  supplyProductLists(productId: string): Observable<SupplyProductList[]> {
    return this.http
      .get<ApiSuccessResponse<SupplyProductList[]>>(`${BASE_URL}/supply/products/${productId}/lists`)
      .pipe(map((r) => r.data));
  }

  supplyPurchases(purchaseId?: string, page = 1, limit = 10): Observable<{ items: SupplyPurchase[]; total: number; page: number; limit: number }> {
    return this.http
      .get<ApiSuccessResponse<{ items: SupplyPurchase[]; total: number; page: number; limit: number }>>(`${BASE_URL}/supply/purchases`, {
        params: toParams({ purchaseId, page, limit }),
      })
      .pipe(map((r) => r.data));
  }

  supplySettings(): Observable<{ allocationMode: SupplyAllocationMode }> {
    return this.http
      .get<ApiSuccessResponse<{ allocationMode: SupplyAllocationMode }>>(`${BASE_URL}/supply/settings`)
      .pipe(map((r) => r.data));
  }

  setSupplyMode(allocationMode: SupplyAllocationMode): Observable<{ allocationMode: SupplyAllocationMode }> {
    return this.http
      .put<ApiSuccessResponse<{ allocationMode: SupplyAllocationMode }>>(`${BASE_URL}/supply/settings`, { allocationMode })
      .pipe(map((r) => r.data));
  }

  /** FIFO with free Bodega units (one product, or all with pending lists). */
  runFifo(productId?: string): Observable<{ allocated: number }> {
    return this.http
      .post<ApiSuccessResponse<{ allocated: number }>>(`${BASE_URL}/supply/fifo`, { productId })
      .pipe(map((r) => r.data));
  }

  allocatePurchase(purchaseId: string): Observable<{ allocated: number }> {
    return this.http
      .post<ApiSuccessResponse<{ allocated: number }>>(`${BASE_URL}/supply/purchases/${purchaseId}/allocate`, {})
      .pipe(map((r) => r.data));
  }

  allocateManual(input: {
    quotationId: string;
    productId: string;
    quantity: number;
    purchaseId?: string;
    clientRequestId: string;
  }): Observable<SchoolQuotation> {
    return this.http.post<ApiSuccessResponse<SchoolQuotation>>(`${BASE_URL}/supply/allocations`, input).pipe(map((r) => r.data));
  }

  /** "Preparar y despachar lista" (= entrega). */
  dispatch(id: string, observations: string | null, clientRequestId: string): Observable<SchoolQuotation> {
    return this.http
      .post<ApiSuccessResponse<SchoolQuotation>>(`${BASE_URL}/quotations/${id}/dispatch`, {
        observations: observations || undefined,
        clientRequestId,
      })
      .pipe(map((r) => r.data));
  }

  /** Bodega stock of the given products (lists take their stock from Bodega). */
  bodegaStock(productIds: string[]): Observable<{ productId: string; quantity: number }[]> {
    return this.http
      .get<ApiSuccessResponse<{ productId: string; quantity: number }[]>>(`${BASE_URL}/stock`, {
        params: toParams({ productIds: productIds.join(',') }),
      })
      .pipe(map((r) => r.data));
  }

  // ── Product catalog ("Cambiar producto") ─────────────────────────────────
  /**
   * One page of active inventory products, optionally restricted to a
   * category and to a name/SKU search. Reuses the existing `GET /products`
   * (server-side `categoryId`, `search`, `page`, `limit`, active only), so the
   * modal never loads the whole inventory.
   *
   * @param filters category id, search text, page (1-based) and page size
   * @returns the page with each product's real category from the database
   */
  catalogProducts(filters: SchoolCatalogFilters): Observable<SchoolCatalogPage> {
    return this.http
      .get<ApiSuccessResponse<PaginatedResponse<SchoolCatalogProduct & Record<string, unknown>>>>(
        `${environment.apiUrl}/products`,
        { params: toParams({ ...filters, sortBy: 'name', sortDirection: 'asc' }) },
      )
      .pipe(
        map((r) => ({
          ...r.data,
          items: r.data.items.map((p) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            categoryId: p.categoryId,
            categoryName: p.categoryName,
            publicPrice: Number(p.publicPrice),
          })),
        })),
      );
  }

  // ── Documents ────────────────────────────────────────────────────────────
  quotationPdf(id: string): Observable<Blob> {
    return this.http.get(`${BASE_URL}/quotations/${id}/pdf`, { responseType: 'blob' });
  }

  receiptPdf(paymentId: string): Observable<Blob> {
    return this.http.get(`${BASE_URL}/payments/${paymentId}/receipt`, { responseType: 'blob' });
  }
}
