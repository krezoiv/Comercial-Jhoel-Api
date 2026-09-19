import { Injectable, signal } from '@angular/core';

/**
 * `beforeinstallprompt` no tiene tipos oficiales en el DOM lib de TypeScript
 * todavía — shape mínimo real documentado por Chrome/Edge.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Instalación de la PWA en Android/Chrome/Edge — el equivalente de "Agregar
 * a pantalla de inicio" de iOS, pero con una API real: estos navegadores
 * disparan `beforeinstallprompt` apenas el sitio cumple los criterios de
 * instalabilidad (HTTPS, manifest válido, Service Worker registrado — los
 * tres ya existían antes de este servicio, nada nuevo que configurar), y
 * dejan mostrar el prompt nativo bajo demanda vía `.prompt()`. Nunca
 * necesario para recibir Push en Android (Android ya recibe Push sin
 * instalar nada) — esto es un atajo de UX adicional, no un requisito.
 *
 * iOS/iPadOS Safari NUNCA dispara este evento (no lo implementa) — por eso
 * el banner de Push sigue mostrando las instrucciones manuales solo ahí.
 */
@Injectable({ providedIn: 'root' })
export class InstallPromptService {
  readonly canInstall = signal(false);
  readonly isInstalled = signal(this.computeIsInstalled());

  private deferredEvent: BeforeInstallPromptEvent | null = null;

  constructor() {
    window.addEventListener('beforeinstallprompt', (event) => {
      // Sin este preventDefault, Chrome mostraría su propio mini-banner
      // automático — lo evitamos para decidir nosotros cuándo ofrecerlo
      // (dentro del banner de notificaciones), nunca de forma intrusiva.
      event.preventDefault();
      this.deferredEvent = event as BeforeInstallPromptEvent;
      this.canInstall.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.deferredEvent = null;
      this.canInstall.set(false);
      this.isInstalled.set(true);
    });
  }

  private computeIsInstalled(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  }

  /** No-op si el navegador nunca ofreció instalar (Safari, Firefox, o ya instalada) — nunca lanza. */
  async promptInstall(): Promise<void> {
    if (!this.deferredEvent) {
      return;
    }
    const event = this.deferredEvent;
    this.deferredEvent = null;
    this.canInstall.set(false);
    await event.prompt();
    await event.userChoice;
  }
}
