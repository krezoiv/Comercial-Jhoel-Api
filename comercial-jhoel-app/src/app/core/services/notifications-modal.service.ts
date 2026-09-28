import { Injectable, signal } from '@angular/core';

/**
 * Único estado "abierto/cerrado" del `NotificationsModalComponent` (el modal
 * de Web Push que monta el Navbar una sola vez). Existe solo para que otros
 * accesos — p. ej. el dock de acceso rápido de la landing — abran ESE mismo
 * modal en vez de montar un segundo. No toca nada de Web Push: SwPush,
 * VAPID, permisos y suscripción siguen viviendo dentro del modal.
 */
@Injectable({ providedIn: 'root' })
export class NotificationsModalService {
  readonly isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
