import { DestroyRef, Injectable, inject } from '@angular/core';
import { Subject, catchError, of } from 'rxjs';

import { CashControlService } from './cash-control.service';

const CHANNEL = 'cj-cash-control';

/** Default polling period for changes made by OTHER users/devices. */
export const CASH_POLL_INTERVAL_MS = 15_000;

/**
 * "El efectivo físico cambió" — the real-time update mechanism of Control de
 * Efectivo. It never stores or computes a balance: it only tells subscribers
 * to re-read the backend's official Kardex.
 *
 * Three sources, same pattern as `GuayacanCashSyncService` plus polling:
 * - same tab: `notifyChanged()` (called by `cashMutationInterceptor` after
 *   any successful write that can move cash);
 * - other tabs/windows of this browser: `BroadcastChannel`;
 * - other users/devices: `onCashChanged()` polls the lightweight
 *   `GET /cash-control/balance` and fires only when the Kardex's last
 *   sequence changed (no WebSocket exists in this app's architecture).
 */
@Injectable({ providedIn: 'root' })
export class CashControlSyncService {
  private readonly local = new Subject<void>();
  private readonly channel: BroadcastChannel | null =
    typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CHANNEL);

  /** Emits after any write that may move physical cash, in this tab or another one. */
  readonly changed$ = this.local.asObservable();

  constructor() {
    if (this.channel) {
      this.channel.onmessage = () => this.local.next();
      inject(DestroyRef).onDestroy(() => this.channel?.close());
    }
  }

  /** Call after the backend confirmed a write that may move physical cash. */
  notifyChanged(): void {
    this.local.next();
    this.channel?.postMessage('changed');
  }
}

/**
 * Subscribes `callback` to cash changes (local writes, other tabs and — via
 * polling while the tab is visible — other users). Cleans up with the
 * component. Must be called from an injection context.
 */
export function onCashChanged(callback: () => void, pollMs: number = CASH_POLL_INTERVAL_MS): void {
  const sync = inject(CashControlSyncService);
  const service = inject(CashControlService);
  let lastSequence: number | null = null;

  const subscription = sync.changed$.subscribe(() => {
    lastSequence = null;
    callback();
  });

  const timer = setInterval(() => {
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
      return;
    }
    service
      .getBalance()
      .pipe(catchError(() => of(null)))
      .subscribe((snapshot) => {
        if (!snapshot) {
          return;
        }
        const changed = lastSequence !== null && snapshot.lastSequence !== lastSequence;
        lastSequence = snapshot.lastSequence;
        if (changed) {
          callback();
        }
      });
  }, pollMs);

  inject(DestroyRef).onDestroy(() => {
    subscription.unsubscribe();
    clearInterval(timer);
  });
}
