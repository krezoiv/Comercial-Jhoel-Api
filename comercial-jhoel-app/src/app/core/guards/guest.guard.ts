import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Gates routes meant only for a visitor who is NOT yet authenticated — the
 * public landing (`''`) and `/login`. An already-authenticated session is
 * sent straight to `/dashboard` instead, resolved here before the route's
 * own component ever mounts (no flash of landing/login first). Reuses the
 * exact same `isAuthenticated()` signal `authGuard` already relies on —
 * same "presence in localStorage, corrected lazily by `authInterceptor` on
 * a real 401" philosophy, not a stricter/duplicated check.
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  if (authService.isAuthenticated()) {
    return inject(Router).parseUrl('/dashboard');
  }
  return true;
};
