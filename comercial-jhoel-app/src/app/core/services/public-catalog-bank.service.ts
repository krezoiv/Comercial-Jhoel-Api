import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, PublicCatalogBank } from '../models';

const BASE_URL = `${environment.apiUrl}/public-catalog-banks`;

/** Público, sin autenticación — backs "Bancos" en la landing. */
@Injectable({ providedIn: 'root' })
export class PublicCatalogBankService {
  private readonly http = inject(HttpClient);

  getPublishedBanks(): Observable<PublicCatalogBank[]> {
    return this.http
      .get<ApiSuccessResponse<PublicCatalogBank[]>>(BASE_URL)
      .pipe(map((response) => response.data));
  }

  getImageUrl(catalogBankId: string): string {
    return `${BASE_URL}/images/${catalogBankId}`;
  }
}
