import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse, CompanySettings, PublicCompanyInfo, UpdateCompanySettingsPayload } from '../models';

const BASE_URL = `${environment.apiUrl}/company-settings`;
const PUBLIC_URL = `${environment.apiUrl}/company-info`;

@Injectable({ providedIn: 'root' })
export class CompanySettingsService {
  private readonly http = inject(HttpClient);

  getCompanySettings(): Observable<CompanySettings> {
    return this.http
      .get<ApiSuccessResponse<CompanySettings>>(BASE_URL)
      .pipe(map((response) => response.data));
  }

  updateCompanySettings(payload: UpdateCompanySettingsPayload): Observable<CompanySettings> {
    return this.http
      .patch<ApiSuccessResponse<CompanySettings>>(BASE_URL, payload)
      .pipe(map((response) => response.data));
  }

  /** `GET /company-info` — público, sin autenticación; backs la sección "Contacto" de la landing. Nunca incluye `taxId`/`logoBase64`. */
  getPublicInfo(): Observable<PublicCompanyInfo> {
    return this.http
      .get<ApiSuccessResponse<PublicCompanyInfo>>(PUBLIC_URL)
      .pipe(map((response) => response.data));
  }
}
