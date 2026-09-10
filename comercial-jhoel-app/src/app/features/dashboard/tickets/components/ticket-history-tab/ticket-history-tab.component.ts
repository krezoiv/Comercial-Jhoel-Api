import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TicketStatusFilter, TicketSummary, formatCurrency } from '../../../../../core/models';
import { AuthService } from '../../../../../core/services/auth.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { TicketsService } from '../../../../../core/services/tickets.service';
import { downloadBlob } from '../../../../../core/utils/download-blob';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { BadgeComponent, ButtonComponent, EmptyStateComponent, IconComponent } from '../../../../../shared/ui';
import { ReportPaginationComponent } from '../../../reports/components/report-pagination/report-pagination.component';
import { TicketDetailModalComponent } from '../ticket-detail-modal/ticket-detail-modal.component';
import { VoidReasonModalComponent } from '../void-reason-modal/void-reason-modal.component';

const PAGE_LIMIT = 20;

const DEFAULT_FILTERS: { search: string; startDate: string; endDate: string; status: TicketStatusFilter | '' } = {
  search: '',
  startDate: '',
  endDate: '',
  status: '',
};

@Component({
  selector: 'app-ticket-history-tab',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    EmptyStateComponent,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    ReportPaginationComponent,
    TicketDetailModalComponent,
    VoidReasonModalComponent,
  ],
  templateUrl: './ticket-history-tab.component.html',
  styleUrl: './ticket-history-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketHistoryTabComponent {
  private readonly ticketsService = inject(TicketsService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  readonly isAdmin = this.authService.isAdmin;

  readonly tickets = signal<TicketSummary[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly loading = signal(false);

  /** Draft/applied split — editing a filter field only ever touches `draftX`; `applyFilters()`/`clearFilters()` are the only two places the applied signals (the ones `fetch()` actually reads) change. Same pattern as the Reportería pages and the Compras/Ventas admin screens. */
  readonly draftSearch = signal(DEFAULT_FILTERS.search);
  readonly draftStartDate = signal(DEFAULT_FILTERS.startDate);
  readonly draftEndDate = signal(DEFAULT_FILTERS.endDate);
  readonly draftStatus = signal<TicketStatusFilter | ''>(DEFAULT_FILTERS.status);

  readonly search = signal(DEFAULT_FILTERS.search);
  readonly startDate = signal(DEFAULT_FILTERS.startDate);
  readonly endDate = signal(DEFAULT_FILTERS.endDate);
  readonly status = signal<TicketStatusFilter | ''>(DEFAULT_FILTERS.status);

  readonly hasActiveFilters = computed(
    () =>
      this.search() !== DEFAULT_FILTERS.search ||
      this.startDate() !== DEFAULT_FILTERS.startDate ||
      this.endDate() !== DEFAULT_FILTERS.endDate ||
      this.status() !== DEFAULT_FILTERS.status,
  );

  readonly detailTicketId = signal<string | null>(null);
  readonly voidTarget = signal<TicketSummary | null>(null);
  readonly generatingPdfId = signal<string | null>(null);

  formatCurrency = formatCurrency;
  readonly limit = PAGE_LIMIT;

  readonly isEmpty = computed(() => !this.loading() && this.tickets().length === 0);

  constructor() {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.ticketsService
      .getTickets({
        page: this.page(),
        limit: this.limit,
        search: this.search() || undefined,
        startDate: this.startDate() || undefined,
        endDate: this.endDate() || undefined,
        status: this.status() || undefined,
      })
      .subscribe({
        next: (response) => {
          this.tickets.set(response.items);
          this.total.set(response.total);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.notificationService.error('No se pudo cargar el historial de tickets.');
        },
      });
  }

  applyFilters(): void {
    this.search.set(this.draftSearch().trim());
    this.startDate.set(this.draftStartDate());
    this.endDate.set(this.draftEndDate());
    this.status.set(this.draftStatus());
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
    this.status.set(DEFAULT_FILTERS.status);
    this.page.set(1);
    this.fetch();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.fetch();
  }

  viewDetail(ticket: TicketSummary): void {
    this.detailTicketId.set(ticket.id);
  }

  closeDetail(): void {
    this.detailTicketId.set(null);
  }

  regeneratePdf(ticket: TicketSummary): void {
    this.generatingPdfId.set(ticket.id);
    this.ticketsService.exportTicketPdf(ticket.id).subscribe({
      next: (blob) => {
        downloadBlob(blob, `${ticket.ticketNumber}.pdf`);
        this.generatingPdfId.set(null);
      },
      error: (error) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo generar el PDF.'));
        this.generatingPdfId.set(null);
      },
    });
  }

  requestVoid(ticket: TicketSummary): void {
    this.voidTarget.set(ticket);
  }

  cancelVoid(): void {
    this.voidTarget.set(null);
  }

  confirmVoid(reason: string): void {
    const target = this.voidTarget();
    if (!target) {
      return;
    }
    this.ticketsService.voidTicket(target.id, reason).subscribe({
      next: () => {
        this.notificationService.success(`Ticket ${target.ticketNumber} anulado correctamente.`);
        this.voidTarget.set(null);
        this.fetch();
      },
      error: (error) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo anular el ticket.'));
        this.voidTarget.set(null);
      },
    });
  }
}
