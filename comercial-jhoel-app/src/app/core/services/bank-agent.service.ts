import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BankOperation } from '../models';
import { BANK_OPERATIONS, BANK_TRUST_POINTS } from '../data';

/**
 * Phase 2: replace the `of(...)` bodies with calls to
 * `${environment.apiUrl}/bank-agent/*`.
 */
@Injectable({ providedIn: 'root' })
export class BankAgentService {
  getOperations(): Observable<BankOperation[]> {
    return of(BANK_OPERATIONS);
  }

  getTrustPoints() {
    return of(BANK_TRUST_POINTS);
  }
}
