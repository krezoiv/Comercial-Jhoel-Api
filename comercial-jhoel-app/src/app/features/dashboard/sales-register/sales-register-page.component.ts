import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { SalesRegisterSummary, formatCurrency, formatQuantity } from '../../../core/models';
import { SalesRegisterService } from '../../../core/services/sales-register.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { EmptyStateComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { ReportSummaryComponent, ReportSummaryTile } from '../reports/components/report-summary/report-summary.component';
import { SalesRegisterBusinessCardComponent } from './components/business-card/business-card.component';

/** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique as `RechargeCashBoxPageComponent`'s own copy and every other date-driven page in this app. */
function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Same interval `AlertBellComponent` already established as this codebase's one "live but not aggressive" polling precedent — reused verbatim rather than inventing a second cadence. */
const POLL_INTERVAL_MS = 60_000;

/**
 * "Gestión de Caja de Ventas" — a live, read-only view over the existing
 * Ventas (`sales`/`sale_details`), grouped by negocio. Not a second sales
 * system and not a physical cash box (see `GetSalesRegisterSummaryUseCase`'s
 * own doc comment on the backend) — this page only ever reads
 * `GET /sales-register/summary`, it registers nothing.
 *
 * Live-update strategy, deliberately mirrored from `AlertBellComponent`
 * (this app's one existing "feels live without polling aggressively"
 * precedent) rather than invented fresh: fetch on load, refetch every 60s,
 * and refetch on every `NavigationEnd` (returning to this page after
 * registering a sale elsewhere is exactly the moment the numbers are most
 * likely stale) — plus a manual "Actualizar" button for the impatient case,
 * since "no quiero esperar" was explicit in the ticket.
 */
@Component({
  selector: 'app-sales-register-page',
  standalone: true,
  imports: [
    FormsModule,
    PageHeaderComponent,
    ReportSummaryComponent,
    SalesRegisterBusinessCardComponent,
    EmptyStateComponent,
    IconComponent,
  ],
  templateUrl: './sales-register-page.component.html',
  styleUrl: './sales-register-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesRegisterPageComponent {
  private readonly salesRegisterService = inject(SalesRegisterService);
  private readonly router = inject(Router);

  readonly operationDate = signal(todayIsoDate());
  readonly maxSelectableDate = todayIsoDate();

  readonly summary = signal<SalesRegisterSummary | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly selectedBusinessId = signal('');

  readonly visibleBusinesses = computed(() => {
    const data = this.summary();
    if (!data) {
      return [];
    }
    const filterId = this.selectedBusinessId();
    return filterId ? data.businesses.filter((b) => b.businessId === filterId) : data.businesses;
  });

  readonly tiles = computed<ReportSummaryTile[]>(() => {
    const data = this.summary();
    return [
      {
        icon: 'receipt',
        title: 'Ventas del día',
        value: data ? formatCurrency(data.totalAmount) : '—',
        description: 'Total confirmado, sin anuladas',
        tone: 'success',
      },
      {
        icon: 'package',
        title: 'Productos vendidos',
        value: data ? formatQuantity(data.productsCount) : '—',
        description: 'Unidades/presentaciones vendidas',
        tone: 'primary',
      },
      {
        icon: 'shopping-bag',
        title: 'Negocios activos',
        value: data ? formatQuantity(data.businessesActive) : '—',
        description: 'Con al menos una venta hoy',
        tone: 'gold',
      },
      {
        icon: 'bar-chart',
        title: 'Transacciones',
        value: data ? formatQuantity(data.salesCount) : '—',
        description: 'Ventas realizadas (no anuladas)',
        tone: 'neutral',
      },
    ];
  });

  constructor() {
    this.fetchSummary();

    const intervalId = setInterval(() => this.fetchSummary({ silent: true }), POLL_INTERVAL_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(intervalId));

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.fetchSummary({ silent: true }));
  }

  onDateChange(value: string): void {
    if (value) {
      this.operationDate.set(value);
      this.selectedBusinessId.set('');
      this.fetchSummary();
    }
  }

  onRefresh(): void {
    this.fetchSummary();
  }

  private fetchSummary(options: { silent?: boolean } = {}): void {
    if (!options.silent) {
      this.loading.set(true);
    }
    this.errorMessage.set(null);
    this.salesRegisterService.getSummary(this.operationDate()).subscribe({
      next: (summary) => {
        this.loading.set(false);
        this.summary.set(summary);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        // A silent background refresh failing (e.g. a transient network
        // blip during the 60s poll) shouldn't blank out numbers the
        // operator was already looking at — only a real, user-initiated
        // fetch (page load, date change, manual refresh) surfaces the error.
        if (!options.silent) {
          this.errorMessage.set(
            extractErrorMessage(error, 'No se pudo cargar la caja de ventas.'),
          );
        }
      },
    });
  }
}
