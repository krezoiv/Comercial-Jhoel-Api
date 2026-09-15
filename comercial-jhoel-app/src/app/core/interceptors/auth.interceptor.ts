import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

// Only attach the token to calls aimed at our own API — never to third-party
// requests a future feature might make (fonts, maps, etc.).
function isApiRequest(url: string): boolean {
  return url.startsWith(environment.apiUrl);
}

/**
 * Registered once in `app.config.ts` via `provideHttpClient(withInterceptors([authInterceptor]))`
 * — every outgoing request to our own API gets the bearer token attached
 * here, and a 401 from our own API is what triggers the network-wide
 * "session expired" handling (logout + redirect), rather than each
 * component/service having to check for it individually.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const authorizedReq =
    token && isApiRequest(req.url) ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authorizedReq).pipe(
    catchError((error: unknown) => {
      // Only a real "session expired" case forces a logout+redirect — that
      // requires a token to have existed in the first place. A 401 with no
      // token at all is just an anonymous request hitting a guarded
      // endpoint (e.g. `KeyboardShortcutsService` refreshing from the
      // public landing page) — there is no session to expire, and
      // redirecting an anonymous visitor to `/login` would break whatever
      // public page they were on. Let it propagate normally instead, same
      // as any other error each caller already handles on its own.
      if (error instanceof HttpErrorResponse && error.status === 401 && isApiRequest(req.url) && token) {
        authService.logout();
        void router.navigateByUrl('/login');
      }
      return throwError(() => error);
    }),
  );
};
