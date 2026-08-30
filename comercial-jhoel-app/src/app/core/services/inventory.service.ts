import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, PaginatedResponse, Product, ProductInput } from '../models';

/** Raw shape the API returns for a product — `category` maps this to the flat `Product` the UI uses. */
interface ProductApiModel {
  id: string;
  name: string;
  sku: string | null;
  categoryId: string;
  categoryName: string;
  businessId: string;
  businessName: string;
  costPrice: number;
  publicPrice: number;
  wholesalePrice: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function toProduct(api: ProductApiModel): Product {
  return {
    id: api.id,
    name: api.name,
    sku: api.sku,
    category: api.categoryName,
    categoryId: api.categoryId,
    business: api.businessName,
    businessId: api.businessId,
    costPrice: api.costPrice,
    publicPrice: api.publicPrice,
    wholesalePrice: api.wholesalePrice,
    stock: api.stock,
    isActive: api.isActive,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

/**
 * Talks to `${environment.apiUrl}/products` — no more mock data. `getProducts()`
 * asks for a generous page size since the inventory screen still does its own
 * client-side search/filter/sort over the full active list (see
 * InventoryPageComponent); swapping this for real server-side pagination
 * later only means changing this one method.
 */
const LIST_LIMIT = 100;
/** Small on purpose — this is a live-search dropdown (Ventas), not a management list. */
const SEARCH_LIMIT = 8;

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ApiSuccessResponse<PaginatedResponse<ProductApiModel>>>(`${environment.apiUrl}/products`, {
        params: { limit: LIST_LIMIT },
      })
      .pipe(map((response) => response.data.items.map(toProduct)));
  }

  /** Server-side search by name or SKU — active products only (the backend's default). Used by the Ventas product picker. */
  searchProducts(query: string): Observable<Product[]> {
    return this.http
      .get<ApiSuccessResponse<PaginatedResponse<ProductApiModel>>>(`${environment.apiUrl}/products`, {
        params: { search: query, limit: SEARCH_LIMIT },
      })
      .pipe(map((response) => response.data.items.map(toProduct)));
  }

  getProductById(id: string): Observable<Product> {
    return this.http
      .get<ApiSuccessResponse<ProductApiModel>>(`${environment.apiUrl}/products/${id}`)
      .pipe(map((response) => toProduct(response.data)));
  }

  createProduct(input: ProductInput): Observable<Product> {
    return this.http
      .post<ApiSuccessResponse<ProductApiModel>>(`${environment.apiUrl}/products`, input)
      .pipe(map((response) => toProduct(response.data)));
  }

  updateProduct(id: string, input: ProductInput): Observable<Product> {
    return this.http
      .patch<ApiSuccessResponse<ProductApiModel>>(`${environment.apiUrl}/products/${id}`, input)
      .pipe(map((response) => toProduct(response.data)));
  }

  /** Soft delete — the backend deactivates the product, it never deletes the row. */
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/products/${id}`);
  }
}
