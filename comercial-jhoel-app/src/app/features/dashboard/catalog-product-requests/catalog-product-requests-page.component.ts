import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CatalogProductRequest, CatalogProductRequestStatus } from '../../../core/models';
import { CatalogProductRequestService } from '../../../core/services/catalog-product-request.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { CardComponent, PageHeaderComponent, SummaryTileComponent } from '../../../shared/ui';
import { CatalogProductRequestTableComponent } from './components/catalog-product-request-table/catalog-product-request-table.component';
import { CatalogProductRequestDetailModalComponent } from './components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component';

type StatusFilterValue = CatalogProductRequestStatus | 'all';

/**
 * "Solicitudes de Variedades" — leads de "Lo quiero" capturados en la
 * landing pública (sección Variedades y Accesorios). Librería nunca genera
 * filas aquí (sección puramente informativa). Admin-only, ya
 * `adminGuard`-gated (el backend también restringe todo
 * `CatalogProductRequestsController` a ADMIN/SUPER_ADMIN). Deliberadamente
 * sin nada de Krediya/crédito — exclusivo de Teléfonos.
 */
@Component({
  selector: 'app-catalog-product-requests-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    CardComponent,
    SummaryTileComponent,
    CatalogProductRequestTableComponent,
    CatalogProductRequestDetailModalComponent,
  ],
  templateUrl: './catalog-product-requests-page.component.html',
  styleUrl: './catalog-product-requests-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogProductRequestsPageComponent {
  private readonly catalogProductRequestService = inject(CatalogProductRequestService);
  private readonly notificationService = inject(NotificationService);

  readonly requests = signal<CatalogProductRequest[]>([]);
  readonly loading = signal(true);
  readonly statusFilter = signal<StatusFilterValue>('all');

  readonly selectedRequest = signal<CatalogProductRequest | null>(null);

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
    this.catalogProductRequestService.getRequests().subscribe({
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

  openDetail(request: CatalogProductRequest): void {
    this.selectedRequest.set(request);
  }

  closeDetail(): void {
    this.selectedRequest.set(null);
  }

  onRequestUpdated(request: CatalogProductRequest): void {
    this.selectedRequest.set(request);
    this.requests.update((list) => list.map((r) => (r.id === request.id ? request : r)));
  }
}
