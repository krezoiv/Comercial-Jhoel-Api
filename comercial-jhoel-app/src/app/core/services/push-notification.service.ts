import { Injectable, inject, signal } from '@angular/core';
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

  /**
   * Un `signal()` normal, actualizado explícitamente — NO un `computed()`.
   * `computePermissionState()` solo lee APIs del navegador (`Notification.
   * permission`, `swPush.isEnabled`), nunca otro `signal()` de Angular; un
   * `computed()` sobre eso se evalúa UNA sola vez (la primera lectura) y
   * queda congelado para siempre, porque Angular no tiene forma de saber que
   * `Notification.permission` cambió — encontrado y corregido en vivo: el
   * banner podía quedarse mostrando un estado obsoleto (p. ej. "no
   * compatible" evaluado antes de que el Service Worker terminara de
   * registrarse) sin volver a evaluarse jamás en esa misma visita. Este
   * signal se refresca explícitamente en cada momento donde el estado
   * realmente puede haber cambiado — ver `refreshPermissionState()`.
   */
  readonly permissionState = signal<PushPermissionState>(this.computePermissionState());

  /**
   * `true` en cuanto `navigator.serviceWorker.ready` resuelve de verdad —
   * separado de `swPush.isEnabled` (que solo indica que la API existe, no
   * que el registro ya esté activo; ver el doc comment de `computePermissionState`).
   */
  private swReady = false;

  /**
   * Clave pública VAPID, pre-cargada al construir el servicio — NUNCA
   * esperada dentro del handler de clic. Ver el doc comment de `subscribe()`
   * para la razón exacta: es la causa real de que Safari (iOS/iPadOS/macOS)
   * rechazara silenciosamente el permiso mientras Chrome/Android sí
   * funcionaban.
   */
  private cachedVapidPublicKey: string | null = null;

  constructor() {
    if (this.swPush.isEnabled) {
      this.swPush.subscription.subscribe((subscription) => this.isSubscribed.set(subscription !== null));

      // Se dispara apenas se construye el servicio (típicamente al montar el
      // banner, muy antes de cualquier clic real — el visitante necesita
      // tiempo para leer el banner) para que `subscribe()` nunca tenga que
      // esperar la red dentro del handler de clic.
      this.publicNewsSubscriptionService.getVapidPublicKey().subscribe({
        next: (key) => (this.cachedVapidPublicKey = key),
        error: () => {
          /* subscribe() reintenta la petición si esta precarga falló */
        },
      });

      // `computePermissionState()` de arriba se evaluó antes de que el
      // Service Worker necesariamente estuviera activo — `serviceWorker.
      // ready` confirma el registro real (ver PASO 1/10 del diagnóstico:
      // "verifica que el Service Worker esté realmente registrado/activo")
      // y dispara un recálculo en cuanto eso ocurre de verdad.
      navigator.serviceWorker?.ready.then(
        () => {
          this.swReady = true;
          this.refreshPermissionState();
        },
        () => this.refreshPermissionState(),
      );

      // `Notification.permission` puede cambiar fuera de cualquier acción
      // nuestra (el visitante lo cambia desde la configuración del propio
      // navegador mientras la pestaña sigue abierta) — sin esto, el signal
      // de arriba nunca se enteraría.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.refreshPermissionState();
        }
      });
    }
  }

  private refreshPermissionState(): void {
    this.permissionState.set(this.computePermissionState());
  }

  private computePermissionState(): PushPermissionState {
    // CRÍTICO, en ese orden — bug real encontrado en vivo en iPhone: en una
    // pestaña normal de Safari (sin instalar como PWA), iOS NO expone
    // `PushManager` (y potencialmente tampoco `Notification` de la forma
    // que esperamos) como API global — son capacidades que Apple reserva
    // exclusivamente para un sitio ya agregado a la pantalla de inicio. Si
    // el chequeo de "unsupported" corre primero (como estaba antes), CUALQUIER
    // iPhone/iPad en pestaña normal cae ahí y nunca llega a ver el mensaje
    // correcto de "instala la PWA" — parece "navegador incompatible" cuando
    // en realidad solo le falta instalarse. Por eso la detección de
    // iOS/iPadOS-sin-instalar va SIEMPRE primero, sin depender de ninguna de
    // esas APIs — un iPhone/iPad no instalado nunca debe poder caer en
    // 'unsupported'.
    if (this.isIosNeedingInstall()) {
      return 'ios-needs-install';
    }

    const hasPushManager = typeof PushManager !== 'undefined';
    if (!this.swPush.isEnabled || typeof Notification === 'undefined' || !hasPushManager) {
      // DEBUG TEMPORAL — diagnóstico del "navegador no compatible" reportado
      // en dispositivos reales (retirar este bloque una vez confirmado que
      // ya no hace falta). Imprime exactamente qué capacidad falló, en vez
      // de asumir cuál es.
      // eslint-disable-next-line no-console
      console.warn('[push-debug] permissionState=unsupported —', {
        isSecureContext: typeof window !== 'undefined' ? window.isSecureContext : 'n/a',
        hasNavigatorServiceWorker: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
        hasPushManager,
        hasNotification: typeof Notification !== 'undefined',
        swPushIsEnabled: this.swPush.isEnabled,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'n/a',
        isStandalone:
          typeof window !== 'undefined'
            ? window.matchMedia('(display-mode: standalone)').matches ||
              (window.navigator as unknown as { standalone?: boolean }).standalone === true
            : 'n/a',
      });
      return 'unsupported';
    }
    if (Notification.permission === 'granted') {
      return 'granted';
    }
    if (Notification.permission === 'denied') {
      return 'denied';
    }
    if (!this.swReady) {
      return 'sw-pending';
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
   *
   * NUNCA aplica a macOS (confirmado, no asumido — ver WebKit/Apple Developer
   * docs sobre Web Push en Safari 16.1/macOS Ventura): a diferencia de
   * iOS/iPadOS, Mac Safari SÍ permite pedir el permiso de Push desde una
   * pestaña normal, sin necesidad de "Agregar al Dock" — por eso el heurístico
   * de abajo excluye explícitamente un Mac real (`maxTouchPoints === 0`) del
   * caso "iPad en modo escritorio" (que SÍ reporta un user-agent de
   * Macintosh pero es táctil).
   */
  private isIosNeedingInstall(): boolean {
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

  /**
   * CRÍTICO para Safari (iOS/iPadOS/macOS), causa raíz real de "funciona en
   * Chrome/Android pero no en Apple" — confirmado, no asumido: Safari (y
   * Firefox) exigen que el permiso de Push se pida dentro del mismo "user
   * activation" del clic; cualquier `await` sobre una operación
   * genuinamente asíncrona (una petición de red) ANTES de pedir el permiso
   * hace que WebKit considere que el permiso ya no viene de una acción
   * directa del usuario y lo rechace en silencio — sin mostrar el prompt
   * nativo y sin lanzar un error explícito. Chrome es mucho más permisivo
   * con esto, por eso el bug era invisible en Android/Chrome.
   *
   * La corrección es usar `cachedVapidPublicKey` (precargado en el
   * constructor, mucho antes de que exista un clic real) para que
   * `swPush.requestSubscription()` — la llamada que internamente dispara
   * `Notification.requestPermission()`/`PushManager.subscribe()` — sea la
   * PRIMERA operación asíncrona real de todo este método, sin ningún
   * `await` de red por delante. El `await` a `getVapidPublicKey()` solo se
   * usa como último recurso si la precarga todavía no había terminado.
   */
  async subscribe(typeIds: string[]): Promise<void> {
    this.errorMessage.set(null);
    this.isBusy.set(true);
    try {
      const publicKey = this.cachedVapidPublicKey ?? (await firstValueFrom(this.publicNewsSubscriptionService.getVapidPublicKey()));
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
      // El intento de suscripción es exactamente el momento en que
      // `Notification.permission` cambia (concedido/denegado) — sin este
      // refresh explícito el signal se habría quedado en `not-requested`
      // para siempre, sin importar qué haya respondido el visitante.
      this.refreshPermissionState();
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
      this.refreshPermissionState();
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
