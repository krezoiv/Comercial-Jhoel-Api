import { ApplicationRef, Injectable, computed, inject, signal } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, first, interval } from 'rxjs';

import { BankBalanceDraftStore } from './bank-balance-draft.store';
import { BankDepositDraftStore } from './bank-deposit-draft.store';
import { IceCreamPurchaseDraftStore } from './ice-cream-purchase-draft.store';
import { IceCreamSaleDraftStore } from './ice-cream-sale-draft.store';
import { PurchaseDraftStore } from './purchase-draft.store';
import { SalesDraftStore } from './sales-draft.store';

/**
 * Evita recargar más de una vez en una ventana corta — la protección real
 * contra un loop `reload → VERSION_READY → reload → ...`. `sessionStorage`
 * (no `localStorage`): solo debe importar dentro de esta misma pestaña/PWA
 * abierta, nunca perseguir al usuario entre sesiones — mismo criterio ya
 * usado por `PurchaseDraftStore` para su propio estado efímero.
 */
const RELOAD_GUARD_KEY = 'cj_pwa_last_update_reload';
const RELOAD_GUARD_WINDOW_MS = 60_000;

/** Nunca más de un chequeo real cada 5 min, sin importar cuántas veces se dispare visibilitychange/online — esto es lo que evita el "polling agresivo". */
const CHECK_THROTTLE_MS = 5 * 60_000;

/** Igual al intervalo que la propia guía oficial de Angular recomienda para una pestaña que se queda abierta mucho tiempo sin pasar a segundo plano. */
const PERIODIC_CHECK_INTERVAL_MS = 6 * 60 * 60_000;

/**
 * Detecta y aplica actualizaciones del Service Worker de Angular
 * (`ngsw-worker.js` — el único que existe, ver `app.config.ts`) para que
 * una PWA instalada deje de quedarse atrapada en una versión vieja hasta
 * que el cliente la cierre y reabra manualmente.
 *
 * No inventa un esquema de versión propio — reutiliza el mecanismo real que
 * `@angular/service-worker` ya trae integrado: el hash de contenido de
 * `ngsw.json` que Angular genera en cada build (`VersionReadyEvent.
 * latestVersion.hash`). Un `package.json.version`/`environment.version`
 * manual habría sido una segunda fuente de verdad redundante y propensa a
 * quedar desactualizada si alguien olvida incrementarla.
 *
 * Estrategia de detección (nunca polling agresivo):
 * - Al arrancar, una vez que la app ya está estable.
 * - Cada 6h mientras la pestaña siga abierta (mismo intervalo que la guía
 *   oficial de Angular).
 * - Al volver a primer plano (`visibilitychange`) o recuperar conexión
 *   (`online`) — pero sin re-chequear más de una vez cada 5 min sin importar
 *   cuántas veces se disparen esos eventos.
 *
 * Activación:
 * - Si NINGÚN borrador con datos sin guardar está activo (Ventas, Compras,
 *   Transaccionar, Cuadre de Bancos, Heladería) → se aplica y recarga sola,
 *   sin pedir nada al usuario (esto es lo correcto para la landing pública,
 *   que nunca tiene estado sin guardar).
 * - Si SÍ hay algo sin guardar → se deja `updateReady=true` sin recargar;
 *   `UpdateAvailableBannerComponent` ofrece "Actualizar ahora"/"Más tarde".
 */
@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly appRef = inject(ApplicationRef);

  private readonly salesDraftStore = inject(SalesDraftStore);
  private readonly purchaseDraftStore = inject(PurchaseDraftStore);
  private readonly bankDepositDraftStore = inject(BankDepositDraftStore);
  private readonly bankBalanceDraftStore = inject(BankBalanceDraftStore);
  private readonly iceCreamPurchaseDraftStore = inject(IceCreamPurchaseDraftStore);
  private readonly iceCreamSaleDraftStore = inject(IceCreamSaleDraftStore);

  /** `true` en cuanto hay una versión nueva descargada y lista (`VERSION_READY`). */
  readonly updateReady = signal(false);
  /** El usuario pulsó "Más tarde" — oculta el banner sin cancelar la actualización pendiente. */
  readonly dismissed = signal(false);

  private lastCheckAt = 0;

  private readonly hasUnsavedWork = computed(
    () =>
      this.salesDraftStore.hasActiveDraft() ||
      this.purchaseDraftStore.hasActiveDraft() ||
      this.bankDepositDraftStore.hasActiveDraft() ||
      this.bankBalanceDraftStore.hasActiveDraft() ||
      this.iceCreamPurchaseDraftStore.hasActiveDraft() ||
      this.iceCreamSaleDraftStore.hasActiveDraft(),
  );

  constructor() {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.versionUpdates.subscribe((event) => {
      if (event.type === 'VERSION_READY') {
        this.onVersionReady();
      } else if (event.type === 'VERSION_INSTALLATION_FAILED') {
        // No hay nada que el usuario pueda hacer — el navegador seguirá
        // sirviendo la versión actual con normalidad, solo se registra.
        // eslint-disable-next-line no-console
        console.error('[pwa-update] falló la instalación de una versión nueva:', event.error);
      }
    });

    // Chequeo inicial (una vez que la app ya está estable, nunca compitiendo
    // con el arranque) + cada 6h mientras la pestaña siga abierta.
    const appIsStable$ = this.appRef.isStable.pipe(first((stable) => stable));
    concat(appIsStable$, interval(PERIODIC_CHECK_INTERVAL_MS)).subscribe(() => this.checkForUpdateThrottled());

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkForUpdateThrottled();
      }
    });
    window.addEventListener('online', () => this.checkForUpdateThrottled());
  }

  private checkForUpdateThrottled(): void {
    const now = Date.now();
    if (now - this.lastCheckAt < CHECK_THROTTLE_MS) {
      return;
    }
    this.lastCheckAt = now;
    this.swUpdate.checkForUpdate().catch(() => {
      // Sin conexión momentánea, o el propio Service Worker no está listo
      // todavía — no es un error que el usuario necesite ver, se reintentará
      // en el próximo chequeo programado.
    });
  }

  private onVersionReady(): void {
    this.updateReady.set(true);
    if (!this.hasUnsavedWork()) {
      void this.applyUpdate();
    }
    // Si hay trabajo sin guardar, se queda esperando — el banner ofrece
    // "Actualizar ahora" para que el propio usuario decida el momento.
  }

  /**
   * Activa la versión nueva y recarga UNA sola vez — el patrón exacto que
   * recomienda la guía oficial de Angular (`activateUpdate()` seguido de un
   * reload; nunca actualizar sin recargar, por el riesgo real de mezclar
   * `index.html`/chunks de dos versiones distintas). El guard de
   * `sessionStorage` es la protección explícita contra un loop de recargas.
   */
  async applyUpdate(): Promise<void> {
    const lastReload = Number(sessionStorage.getItem(RELOAD_GUARD_KEY) ?? '0');
    if (Date.now() - lastReload < RELOAD_GUARD_WINDOW_MS) {
      // eslint-disable-next-line no-console
      console.warn('[pwa-update] se detectó otra actualización justo después de recargar — se omite para evitar un loop.');
      return;
    }
    try {
      await this.swUpdate.activateUpdate();
    } finally {
      sessionStorage.setItem(RELOAD_GUARD_KEY, String(Date.now()));
      document.location.reload();
    }
  }

  dismiss(): void {
    this.dismissed.set(true);
  }
}
