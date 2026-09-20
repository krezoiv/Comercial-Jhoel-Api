import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';

import { PublicNewsType } from '../../../../core/models';
import { InstallPromptService } from '../../../../core/services/install-prompt.service';
import { PublicNewsSubscriptionService } from '../../../../core/services/public-news-subscription.service';
import { PushNotificationService } from '../../../../core/services/push-notification.service';
import { ButtonComponent, IconComponent } from '../../../../shared/ui';

/**
 * Modal de "🔔 Notificaciones", abierto desde el Navbar (desktop y menú
 * móvil) — reemplaza a la antigua sección grande "Mantente informado" que
 * vivía en medio del scroll de la landing (`PushNotificationBannerComponent`,
 * eliminada). Ninguna lógica de Push/PWA nueva: es exactamente el mismo
 * contenido/estado que tenía esa sección, solo reubicado dentro de un
 * modal — reutiliza `PushNotificationService`/`InstallPromptService` tal
 * cual, sin duplicar nada del sistema Web Push ya implementado.
 */
@Component({
  selector: 'app-notifications-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './notifications-modal.component.html',
  styleUrl: './notifications-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsModalComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  private readonly publicNewsSubscriptionService = inject(PublicNewsSubscriptionService);
  readonly pushService = inject(PushNotificationService);
  readonly installPromptService = inject(InstallPromptService);

  readonly types = signal<PublicNewsType[]>([]);
  readonly loadingTypes = signal(true);
  readonly selectedTypeIds = signal<Set<string>>(new Set());

  readonly permissionState = this.pushService.permissionState;
  readonly isSubscribed = this.pushService.isSubscribed;

  constructor() {
    this.publicNewsSubscriptionService.getActiveTypes().subscribe({
      next: (types) => {
        this.types.set(types);
        // "Todas las noticias" (wildcard) viene pre-marcada, igual que el formulario de WhatsApp que existía antes.
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

  async installApp(): Promise<void> {
    await this.installPromptService.promptInstall();
  }

  close(): void {
    this.closed.emit();
  }
}
