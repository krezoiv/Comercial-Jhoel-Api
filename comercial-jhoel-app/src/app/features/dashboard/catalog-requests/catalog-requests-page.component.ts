import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CatalogRequest, CatalogRequestStatus } from '../../../core/models';
import { CatalogRequestService } from '../../../core/services/catalog-request.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { CardComponent, PageHeaderComponent, SummaryTileComponent } from '../../../shared/ui';
import { CatalogRequestTableComponent } from './components/catalog-request-table/catalog-request-table.component';
import { CatalogRequestDetailModalComponent } from './components/catalog-request-detail-modal/catalog-request-detail-modal.component';

type StatusFilterValue = CatalogRequestStatus | 'all';

/**
 * "Catálogo → Solicitudes" — leads de interés/crédito capturados en la
 * landing pública ("Lo quiero" / "Comprar a crédito con Krediya"). Admin-only,
 * ya `adminGuard`-gated en `app.routes.ts` (el backend también restringe
 * todo `CatalogRequestsController` a ADMIN/SUPER_ADMIN).
 */
@Component({
  selector: 'app-catalog-requests-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    CardComponent,
    SummaryTileComponent,
    CatalogRequestTableComponent,
    CatalogRequestDetailModalComponent,
  ],
  templateUrl: './catalog-requests-page.component.html',
  styleUrl: './catalog-requests-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogRequestsPageComponent {
  private readonly catalogRequestService = inject(CatalogRequestService);
  private readonly notificationService = inject(NotificationService);

  readonly requests = signal<CatalogRequest[]>([]);
  readonly loading = signal(true);
  readonly statusFilter = signal<StatusFilterValue>('all');

  readonly selectedRequest = signal<CatalogRequest | null>(null);

  readonly filteredRequests = computed(() => {
    const status = this.statusFilter();
    return status === 'all' ? this.requests() : this.requests().filter((r) => r.status === status);
  });

  readonly newCount = computed(() => this.requests().filter((r) => r.status === 'NUEVA').length);
  readonly inProgressCount = computed(
    () => this.requests().filter((r) => r.status === 'CONTACTADA' || r.status === 'EN_PROCESO').length,
  );
  readonly attendedCount = computed(() => this.requests().filter((r) => r.status === 'ATENDIDA').length);

  constructor() {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.loading.set(true);
    this.catalogRequestService.getRequests().subscribe({
      next: (requests) => {
        this.requests.set(requests);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar las solicitudes.'));
      },
    });
  }

  openDetail(request: CatalogRequest): void {
    this.selectedRequest.set(request);
  }

  closeDetail(): void {
    this.selectedRequest.set(null);
  }

  onRequestUpdated(request: CatalogRequest): void {
    this.selectedRequest.set(request);
    this.requests.update((list) => list.map((r) => (r.id === request.id ? request : r)));
  }
}
