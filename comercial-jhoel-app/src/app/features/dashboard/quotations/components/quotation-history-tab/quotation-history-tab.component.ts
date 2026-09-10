import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  QUOTATION_STATUS_LABEL,
  QUOTATION_STATUS_TONE,
  QuotationStatus,
  QuotationSummary,
  formatCurrency,
} from '../../../../../core/models';
import { AuthService } from '../../../../../core/services/auth.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { QuotationsService } from '../../../../../core/services/quotations.service';
import { downloadBlob } from '../../../../../core/utils/download-blob';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { BadgeComponent, ButtonComponent, EmptyStateComponent, IconComponent } from '../../../../../shared/ui';
import { ReportPaginationComponent } from '../../../reports/components/report-pagination/report-pagination.component';
import { QuotationDetailModalComponent } from '../quotation-detail-modal/quotation-detail-modal.component';
import { QuotationVoidReasonModalComponent } from '../quotation-void-reason-modal/quotation-void-reason-modal.component';

const PAGE_LIMIT = 20;

type StatusFilter = QuotationStatus | 'ALL';

const DEFAULT_FILTERS: { search: string; startDate: string; endDate: string; status: StatusFilter } = {
  search: '',
  startDate: '',
  endDate: '',
  status: 'ALL',
};

@Component({
  selector: 'app-quotation-history-tab',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    EmptyStateComponent,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    ReportPaginationComponent,
    QuotationDetailModalComponent,
    QuotationVoidReasonModalComponent,
  ],
  templateUrl: './quotation-history-tab.component.html',
  styleUrl: './quotation-history-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotationHistoryTabComponent {
  private readonly quotationsService = inject(QuotationsService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  readonly isAdmin = this.authService.isAdmin;

  readonly quotations = signal<QuotationSummary[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly loading = signal(false);

  /** Draft/applied split — same pattern as `TicketHistoryTabComponent`'s own copy and the Compras/Ventas admin screens: editing a filter only ever touches `draftX`, `applyFilters()`/`clearFilters()` are the only two places the applied signals (the ones `fetch()` reads) change. Replaces this component's previous immediate-apply status dropdown for consistency. */
  readonly draftSearch = signal(DEFAULT_FILTERS.search);
  readonly draftStartDate = signal(DEFAULT_FILTERS.startDate);
  readonly draftEndDate = signal(DEFAULT_FILTERS.endDate);
  readonly draftStatus = signal<StatusFilter>(DEFAULT_FILTERS.status);

  readonly search = signal(DEFAULT_FILTERS.search);
  readonly startDate = signal(DEFAULT_FILTERS.startDate);
  readonly endDate = signal(DEFAULT_FILTERS.endDate);
  readonly statusFilter = signal<StatusFilter>(DEFAULT_FILTERS.status);

  readonly hasActiveFilters = computed(
    () =>
      this.search() !== DEFAULT_FILTERS.search ||
      this.startDate() !== DEFAULT_FILTERS.startDate ||
      this.endDate() !== DEFAULT_FILTERS.endDate ||
      this.statusFilter() !== DEFAULT_FILTERS.status,
  );

  readonly detailQuotationId = signal<string | null>(null);
  readonly voidTarget = signal<QuotationSummary | null>(null);
  readonly generatingPdfId = signal<string | null>(null);

  formatCurrency = formatCurrency;
  statusLabel = QUOTATION_STATUS_LABEL;
  statusTone = QUOTATION_STATUS_TONE;
  readonly limit = PAGE_LIMIT;

  readonly isEmpty = computed(() => !this.loading() && this.quotations().length === 0);

  constructor() {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    const status = this.statusFilter();
    this.quotationsService
      .getQuotations({
        page: this.page(),
        limit: this.limit,
        status: status === 'ALL' ? undefined : status,
        search: this.search() || undefined,
        startDate: this.startDate() || undefined,
        endDate: this.endDate() || undefined,
      })
      .subscribe({
        next: (response) => {
          this.quotations.set(response.items);
          this.total.set(response.total);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.notificationService.error('No se pudo cargar el historial de cotizaciones.');
        },
      });
  }

  applyFilters(): void {
    this.search.set(this.draftSearch().trim());
    this.startDate.set(this.draftStartDate());
    this.endDate.set(this.draftEndDate());
    this.statusFilter.set(this.draftStatus());
    this.page.set(1);
    this.fetch();
  }

  clearFilters(): void {
    this.draftSearch.set(DEFAULT_FILTERS.search);
    this.draftStartDate.set(DEFAULT_FILTERS.startDate);
    this.draftEndDate.set(DEFAULT_FILTERS.endDate);
    this.draftStatus.set(DEFAULT_FILTERS.status);
    this.search.set(DEFAULT_FILTERS.search);
    this.startDate.set(DEFAULT_FILTERS.startDate);
    this.endDate.set(DEFAULT_FILTERS.endDate);
    this.statusFilter.set(DEFAULT_FILTERS.status);
    this.page.set(1);
    this.fetch();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.fetch();
  }

  viewDetail(quotation: QuotationSummary): void {
    this.detailQuotationId.set(quotation.id);
  }

  closeDetail(): void {
    this.detailQuotationId.set(null);
  }

  regeneratePdf(quotation: QuotationSummary): void {
    this.generatingPdfId.set(quotation.id);
    this.quotationsService.exportQuotationPdf(quotation.id).subscribe({
      next: (blob) => {
        downloadBlob(blob, `${quotation.quotationNumber}.pdf`);
        this.generatingPdfId.set(null);
      },
      error: (error) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo generar el PDF.'));
        this.generatingPdfId.set(null);
      },
    });
  }

  requestVoid(quotation: QuotationSummary): void {
    this.voidTarget.set(quotation);
  }

  cancelVoid(): void {
    this.voidTarget.set(null);
  }

  confirmVoid(reason: string): void {
    const target = this.voidTarget();
    if (!target) {
      return;
    }
    this.quotationsService.voidQuotation(target.id, reason).subscribe({
      next: () => {
        this.notificationService.success(`Cotización ${target.quotationNumber} anulada correctamente.`);
        this.voidTarget.set(null);
        this.fetch();
      },
      error: (error) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo anular la cotización.'));
        this.voidTarget.set(null);
      },
    });
  }
}
