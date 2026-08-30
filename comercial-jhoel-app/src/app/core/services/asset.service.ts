import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, Asset, AssetFilters, AssetInput, PaginatedAssets } from '../models';

const BASE_URL = `${environment.apiUrl}/assets`;

/** Drops `undefined`/empty-string values — `HttpParams` would otherwise send the literal string `"undefined"` as a query value. */
function toParams(filters: object): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(filters as Record<string, unknown>)) {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(key, String(value));
    }
  }
  return params;
}

@Injectable({ providedIn: 'root' })
export class AssetService {
  private readonly http = inject(HttpClient);

  getAssets(filters: AssetFilters = {}): Observable<PaginatedAssets> {
    return this.http
      .get<ApiSuccessResponse<PaginatedAssets>>(BASE_URL, { params: toParams(filters) })
      .pipe(map((response) => response.data));
  }

  getAssetById(id: string): Observable<Asset> {
    return this.http.get<ApiSuccessResponse<Asset>>(`${BASE_URL}/${id}`).pipe(map((response) => response.data));
  }

  createAsset(input: AssetInput): Observable<Asset> {
    return this.http.post<ApiSuccessResponse<Asset>>(BASE_URL, input).pipe(map((response) => response.data));
  }

  updateAsset(id: string, input: AssetInput): Observable<Asset> {
    return this.http
      .patch<ApiSuccessResponse<Asset>>(`${BASE_URL}/${id}`, input)
      .pipe(map((response) => response.data));
  }

  /** Soft delete — the backend deactivates the record, it never deletes the row. */
  deleteAsset(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }
}
