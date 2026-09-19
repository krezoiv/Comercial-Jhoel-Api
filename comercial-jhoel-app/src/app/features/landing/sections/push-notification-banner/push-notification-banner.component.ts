import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { PublicNewsType } from '../../../../core/models';
import { PublicNewsSubscriptionService } from '../../../../core/services/public-news-subscription.service';
import { PushNotificationService } from '../../../../core/services/push-notification.service';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { ButtonComponent, IconComponent, SectionComponent, SectionHeadingComponent } from '../../../../shared/ui';

/**
 * "🔔 Mantente informado" — invitación NO intrusiva a notificaciones push del
 * navegador (estilo YouTube: aceptar y recibir, sin pedir permiso al cargar
 * la página). Complementa, no reemplaza, `NewsSubscriptionComponent` (la
 * suscripción por WhatsApp) — mismo catálogo dinámico de tipos de noticias
 * (`GET /public-news-subscriptions/types`), nunca duplicado ni hardcodeado.
 *
 * Un solo botón "Activar notificaciones" dispara TODO el flujo (pedir el
 * permiso nativo del navegador y registrar el dispositivo) — nunca se llama
 * `Notification.requestPermission()`/`SwPush.requestSubscription()` fuera de
 * un clic explícito del visitante. Si el visitante rechaza el permiso o
 * cierra el prompt, el banner simplemente vuelve a mostrarse en la próxima
 * visita (no hay lógica de "no volver a preguntar" ni de reintento
 * automático) — nunca insiste dentro de la misma visita.
 */
@Component({
  selector: 'app-push-notification-banner',
  standalone: true,
  imports: [RevealOnScrollDirective, SectionComponent, SectionHeadingComponent, ButtonComponent, IconComponent],
  templateUrl: './push-notification-banner.component.html',
  styleUrl: './push-notification-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PushNotificationBannerComponent {
  private readonly publicNewsSubscriptionService = inject(PublicNewsSubscriptionService);
  readonly pushService = inject(PushNotificationService);

  readonly types = signal<PublicNewsType[]>([]);
  readonly loadingTypes = signal(true);
  readonly selectedTypeIds = signal<Set<string>>(new Set());

  readonly permissionState = this.pushService.permissionState;
  readonly isSubscribed = this.pushService.isSubscribed;

  constructor() {
    this.publicNewsSubscriptionService.getActiveTypes().subscribe({
      next: (types) => {
        this.types.set(types);
        // "Todas las noticias" (wildcard) viene pre-marcada, igual que el formulario de WhatsApp.
        this.selectedTypeIds.set(new Set(types.filter((t) => t.isWildcard).map((t) => t.id)));
        this.loadingTypes.set(false);
      },
      error: () => this.loadingTypes.set(false),
    });
  }

  isChecked(typeId: string): boolean {
    return this.selectedTypeIds().has(typeId);
  }

  toggleType(typeId: string): void {
    this.selectedTypeIds.update((current) => {
      const next = new Set(current);
      if (next.has(typeId)) {
        next.delete(typeId);
      } else {
        next.add(typeId);
      }
      return next;
    });
  }

  typeLabel(type: PublicNewsType): string {
    return type.isWildcard ? 'Todas las noticias' : type.name;
  }

  get canActivate(): boolean {
    return this.selectedTypeIds().size > 0 && !this.pushService.isBusy();
  }

  async activate(): Promise<void> {
    if (!this.canActivate) {
      return;
    }
    try {
      await this.pushService.subscribe([...this.selectedTypeIds()]);
    } catch {
      // El mensaje ya quedó en pushService.errorMessage() — nada más que hacer aquí.
    }
  }

  async deactivate(): Promise<void> {
    if (this.pushService.isBusy()) {
      return;
    }
    await this.pushService.unsubscribe();
  }
}
