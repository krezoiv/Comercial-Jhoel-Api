import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { NewsSubscriber, NewsSubscriberDetail } from '../../../core/models';
import { NewsSubscriberService } from '../../../core/services/news-subscriber.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { PageHeaderComponent } from '../../../shared/ui';
import { NewsSubscriberTableComponent } from './components/news-subscriber-table/news-subscriber-table.component';
import { NewsSubscriberDetailModalComponent } from './components/news-subscriber-detail-modal/news-subscriber-detail-modal.component';

type StatusFilter = 'all' | 'active' | 'inactive';

/**
 * "Sistema → Suscriptores de Noticias" — admin-only de punta a punta
 * (expone WhatsApp/consentimiento de clientes reales). El número siempre
 * llega ya enmascarado del backend — nunca se solicita ni se muestra
 * completo aquí (punto 30 del pedido).
 */
@Component({
  selector: 'app-news-subscribers-page',
  standalone: true,
  imports: [PageHeaderComponent, NewsSubscriberTableComponent, NewsSubscriberDetailModalComponent],
  templateUrl: './news-subscribers-page.component.html',
  styleUrl: './news-subscribers-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsSubscribersPageComponent {
  private readonly newsSubscriberService = inject(NewsSubscriberService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly subscribers = signal<NewsSubscriber[]>([]);
  readonly loading = signal(true);
  readonly statusFilter = signal<StatusFilter>('all');

  readonly viewingSubscriber = signal<NewsSubscriberDetail | null>(null);

  readonly filteredSubscribers = computed(() => {
    const status = this.statusFilter();
    return this.subscribers().filter(
      (s) => status === 'all' || (status === 'active' && s.isActive) || (status === 'inactive' && !s.isActive),
    );
  });

  readonly hasActiveFilters = computed(() => this.statusFilter() !== 'all');

  readonly statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
  ];

  constructor() {
    this.fetchSubscribers();
  }

  fetchSubscribers(): void {
    this.loading.set(true);
    this.newsSubscriberService.getSubscribers(true).subscribe({
      next: (subscribers) => {
        this.subscribers.set(subscribers);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar los suscriptores.'));
      },
    });
  }

  clearFilters(): void {
    this.statusFilter.set('all');
  }

  view(subscriber: NewsSubscriber): void {
    this.newsSubscriberService.getSubscriberById(subscriber.id).subscribe({
      next: (detail) => this.viewingSubscriber.set(detail),
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo cargar el detalle del suscriptor.'));
      },
    });
  }

  closeView(): void {
    this.viewingSubscriber.set(null);
  }

  async toggleActive(subscriber: NewsSubscriber): Promise<void> {
    const activating = !subscriber.isActive;
    const confirmed = await this.confirmDialogService.confirm({
      type: activating ? 'UPDATE' : 'DELETE',
      title: activating ? 'Activar suscriptor' : 'Desactivar suscriptor',
      message: activating
        ? `¿Desea reactivar las notificaciones para "${subscriber.name || subscriber.whatsappMasked}"?`
        : `¿Desea desactivar las notificaciones para "${subscriber.name || subscriber.whatsappMasked}"? No se eliminará su registro.`,
    });
    if (!confirmed) {
      return;
    }

    const request$ = activating
      ? this.newsSubscriberService.activateSubscriber(subscriber.id)
      : this.newsSubscriberService.deactivateSubscriber(subscriber.id);
    request$.subscribe({
      next: () => {
        this.subscribers.update((list) => list.map((s) => (s.id === subscriber.id ? { ...s, isActive: activating } : s)));
        this.notificationService.success(activating ? 'Suscriptor activado correctamente.' : 'Suscriptor desactivado correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo actualizar el estado.'));
      },
    });
  }
}
