import { DestroyRef, Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';

const CHANNEL = 'cj-guayacan-cash';

/**
 * Aviso "cambió el efectivo de Cooperativa Guayacán". El saldo de Guayacán es
 * UNO solo (el Kardex de Cuadre de Caja, ver `guayacan_cash_balance()` en el
 * API): lo muestran Transaccionar (tira de saldos, selector de bancos, vista
 * previa) y Cuadre de Caja Guayacán. Este servicio no guarda ni calcula ningún
 * saldo — solo avisa, y cada vista vuelve a leer del backend.
 *
 * Misma pestaña: `Subject`. Otras pestañas/ventanas: `BroadcastChannel`
 * (complementa `refetchOnTabVisible`, que solo cubre volver a una pestaña
 * oculta). Si el navegador no tiene BroadcastChannel, queda el refresco al
 * volver a la pestaña.
 */
@Injectable({ providedIn: 'root' })
export class GuayacanCashSyncService {
  private readonly local = new Subject<void>();
  private readonly channel: BroadcastChannel | null =
    typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CHANNEL);

  /** Se emite tras cualquier escritura que mueva el efectivo, en esta pestaña o en otra. */
  readonly changed$ = this.local.asObservable();

  constructor() {
    if (this.channel) {
      this.channel.onmessage = () => this.local.next();
      inject(DestroyRef).onDestroy(() => this.channel?.close());
    }
  }

  /** Llamar después de que el backend confirmó una escritura que mueve el efectivo de Guayacán. */
  notifyChanged(): void {
    this.local.next();
    this.channel?.postMessage('changed');
  }
}

/** Suscribe `callback` a los cambios de efectivo de Guayacán y se desuscribe al destruirse el componente (contexto de inyección). */
export function onGuayacanCashChanged(callback: () => void): void {
  const subscription = inject(GuayacanCashSyncService).changed$.subscribe(callback);
  inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
}
