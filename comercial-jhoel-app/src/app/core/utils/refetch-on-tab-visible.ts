import { DestroyRef, inject } from '@angular/core';

/**
 * Runs `callback` every time this browser tab regains visibility (switching
 * back from another tab, or the OS switching windows/apps) — the standard
 * "refetch on focus" behavior query-caching libraries like TanStack
 * Query/SWR default to, applied by hand here since this app has no such
 * library. Fixes the class of bug where a self-contained, fetch-once card
 * (constructor/`ngOnChanges` fetch, no polling) goes stale while its own
 * tab sits in the background and the underlying data changes elsewhere —
 * another tab, another user, or simply time passing.
 *
 * Must be called from an injection context (a component's constructor,
 * or a field initializer) — it captures `DestroyRef` itself to remove the
 * `visibilitychange` listener automatically when the component is
 * destroyed, the same cleanup pattern `AlertBellComponent` already uses
 * for its own polling `setInterval`.
 */
export function refetchOnTabVisible(callback: () => void): void {
  const handler = (): void => {
    if (document.visibilityState === 'visible') {
      callback();
    }
  };
  document.addEventListener('visibilitychange', handler);
  inject(DestroyRef).onDestroy(() => document.removeEventListener('visibilitychange', handler));
}
