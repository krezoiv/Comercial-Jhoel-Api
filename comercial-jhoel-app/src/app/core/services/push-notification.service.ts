import { Injectable, computed, inject, signal } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { firstValueFrom } from 'rxjs';

import { PushPermissionState } from '../models';
import { PublicNewsSubscriptionService } from './public-news-subscription.service';

/**
 * `manageToken` de la última suscripción push hecha en ESTE navegador —
 * persistido en `localStorage` (no `sessionStorage`: debe sobrevivir cerrar
 * y reabrir el navegador, ver el checklist de pruebas del banner). Se manda
 * como `existingManageToken` en un re-registro para que el backend reutilice
 * el mismo `NewsSubscriber` en vez de crear uno nuevo cada vez que el Service
 * Worker vuelve a registrar la suscripción (p. ej. tras limpiar datos del
 * sitio y volver a aceptar el permiso).
 */
const MANAGE_TOKEN_KEY = 'cj_push_manage_token';

/**
 * Envuelve `SwPush` (el mismo Service Worker de PWA registrado en
 * `app.config.ts` — nunca uno segundo) para el flujo público de
 * notificaciones push de Noticias. Ver `core/models/push-notification.model.ts`
 * para por qué `PushPermissionState` tiene 6 valores y no puede distinguir
 * "negado" de "bloqueado" — es una limitación real del navegador, no de este
 * servicio.
 *
 * Nota para desarrollo local: `app.config.ts` registra el Service Worker
 * solo cuando `!isDevMode()` (`ng build`, nunca `ng serve`) — en dev,
 * `swPush.isEnabled` siempre es `false` y `permissionState()` reporta
 * `'unsupported'` aunque el navegador sí sea compatible. Para probar el flujo
 * de verdad localmente: `ng build` + servir `dist/comercial-jhoel-app` con
 * cualquier servidor estático sobre HTTPS o `localhost` (el Service Worker
 * exige uno de los dos).
 */
@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private readonly swPush = inject(SwPush);
  private readonly publicNewsSubscriptionService = inject(PublicNewsSubscriptionService);

  readonly isSubscribed = signal(false);
  readonly isBusy = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly permissionState = computed<PushPermissionState>(() => this.computePermissionState());

  constructor() {
    if (this.swPush.isEnabled) {
      this.swPush.subscription.subscribe((subscription) => this.isSubscribed.set(subscription !== null));
    }
  }

  private computePermissionState(): PushPermissionState {
    if (!this.swPush.isEnabled || typeof Notification === 'undefined') {
      return 'unsupported';
    }
    if (this.isIosSafariNotInstalled()) {
      return 'ios-needs-install';
    }
    if (Notification.permission === 'granted') {
      return 'granted';
    }
    if (Notification.permission === 'denied') {
      return 'denied';
    }
    return 'not-requested';
  }

  /**
   * iOS/iPadOS Safari (16.4+) solo ofrece el permiso de Push a un sitio
   * agregado a la pantalla de inicio (`display-mode: standalone`) — en
   * pestaña normal, `Notification.requestPermission()` existe en el DOM pero
   * el navegador la rechaza silenciosamente sin mostrar ningún prompt.
   * Detectar esto de antemano evita prometerle al visitante un botón que,
   * en pestaña normal, nunca podría funcionar.
   */
  private isIosSafariNotInstalled(): boolean {
    const ua = window.navigator.userAgent;
    const isIPadOrIPhone = /iPad|iPhone|iPod/.test(ua);
    const isIPadOsOnMac = ua.includes('Macintosh') && navigator.maxTouchPoints > 1;
    if (!isIPadOrIPhone && !isIPadOsOnMac) {
      return false;
    }
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    return !isStandalone;
  }

  async subscribe(typeIds: string[]): Promise<void> {
    this.errorMessage.set(null);
    this.isBusy.set(true);
    try {
      const publicKey = await firstValueFrom(this.publicNewsSubscriptionService.getVapidPublicKey());
      if (!publicKey) {
        throw new Error('El servicio de notificaciones no está disponible en este momento. Inténtalo más tarde.');
      }

      const subscription = await this.swPush.requestSubscription({ serverPublicKey: publicKey });
      const raw = subscription.toJSON();
      const p256dh = raw.keys?.['p256dh'];
      const auth = raw.keys?.['auth'];
      if (!raw.endpoint || !p256dh || !auth) {
        throw new Error('No se pudo completar el registro de notificaciones.');
      }

      const result = await firstValueFrom(
        this.publicNewsSubscriptionService.registerPush({
          endpoint: raw.endpoint,
          keys: { p256dh, auth },
          typeIds,
          existingManageToken: this.getManageToken() ?? undefined,
        }),
      );

      this.setManageToken(result.manageToken);
      this.isSubscribed.set(true);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'No se pudo activar las notificaciones. Inténtalo de nuevo.',
      );
      throw error;
    } finally {
      this.isBusy.set(false);
    }
  }

  /**
   * Desactiva SOLO esta suscripción (este navegador/dispositivo) — nunca
   * afecta otras suscripciones del mismo suscriptor en otros dispositivos,
   * por diseño: el backend desactiva por `endpoint`, nunca por subscriber.
   */
  async unsubscribe(): Promise<void> {
    this.isBusy.set(true);
    try {
      const subscription = await firstValueFrom(this.swPush.subscription);
      const endpoint = subscription?.endpoint;
      if (endpoint) {
        await firstValueFrom(this.publicNewsSubscriptionService.unregisterPush(endpoint));
      }
      await this.swPush.unsubscribe();
      this.isSubscribed.set(false);
    } finally {
      this.isBusy.set(false);
    }
  }

  private getManageToken(): string | null {
    try {
      return localStorage.getItem(MANAGE_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private setManageToken(token: string): void {
    try {
      localStorage.setItem(MANAGE_TOKEN_KEY, token);
    } catch {
      // Almacenamiento no disponible (modo privado, cuotas) — la suscripción
      // ya quedó registrada en el backend; solo se pierde la reutilización
      // del mismo suscriptor en un futuro re-registro de este navegador.
    }
  }
}
