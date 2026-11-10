import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CashControlSyncService } from '../services/cash-control-sync.service';

/**
 * API resources whose writes can move physical cash: Transaccionar
 * (`bank-deposits`), Cartera (`accounts-receivable`, `assets`),
 * Transferencias Bancarias (`bank-transfers`, incl. "Retiro de efectivo en
 * banco"), Cuentas por Cobrar collections (`account-receivable-payments`;
 * its read-only `/preview` is excluded) and Control de Efectivo itself. The database triggers already
 * wrote the Kardex in the same transaction; this only notifies the screens.
 */
const CASH_RESOURCES = /\/(bank-deposits|accounts-receivable|account-receivable-payments|assets|bank-transfers|cash-control)(\/|$|\?)/;
/** POSTs that only read (no write, nothing to notify). */
const READ_ONLY_POSTS = /\/account-receivable-payments\/preview(\?|$)/;

/** True for a successful-write candidate on a cash-moving resource of our own API. */
export function isCashMutation(method: string, url: string): boolean {
  return (
    method !== 'GET' &&
    method !== 'HEAD' &&
    url.startsWith(environment.apiUrl) &&
    CASH_RESOURCES.test(url) &&
    !READ_ONLY_POSTS.test(url)
  );
}

/**
 * Real-time update of every screen that shows cash (Control de Efectivo,
 * Transaccionar's "Últimas transacciones"): after a successful write to a
 * cash-moving resource, tells `CashControlSyncService` so they re-read the
 * backend. Centralized here so no feature has to remember to notify.
 */
export const cashMutationInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isCashMutation(req.method, req.url)) {
    return next(req);
  }
  const sync = inject(CashControlSyncService);
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.ok) {
        sync.notifyChanged();
      }
    }),
  );
};
