import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  SCHOOL_ACCOUNT_LABEL,
  SCHOOL_ACCOUNT_TONE,
  SCHOOL_QUOTE_NOT_ACCEPTED_MESSAGE,
  SCHOOL_STATUSES,
  SCHOOL_STATUS_COLOR,
  SCHOOL_STATUS_LABEL,
  SCHOOL_STATUS_TONE,
  SCHOOL_SUPPLY_FILTERS,
  SCHOOL_SUPPLY_LABEL,
  SCHOOL_SUPPLY_TONE,
  SchoolDashboard,
  SchoolPurgeSummary,
  SchoolQuotationSortField,
  SchoolSupplyStatus,
  SchoolQuotationStatus,
  SchoolQuotationSummary,
  canReceiveSchoolPayment,
  formatCurrency,
  formatSchoolDate,
  isSchoolQuotationEditable,
} from '../../../../../core/models';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { ReportPaginationComponent } from '../../../reports/components/report-pagination/report-pagination.component';
import { SchoolDocumentsService } from '../../school-documents.service';
import { SchoolPaymentModalComponent } from '../school-payment-modal/school-payment-modal.component';
import { SchoolPurgeModalComponent } from '../school-purge-modal/school-purge-modal.component';

/** One summary card above the list (values always come from the backend dashboard). */
interface SummaryCard {
  label: string;
  value: string;
  hint: string;
  icon: string;
  color: string;
}

/**
 * "Listado general de cotizaciones": summary cards (real figures from
 * `GET /school-lists/quotations/dashboard` for the filtered period), filters
 * (customer or number, phone, grade, status, supply, dates) applied on
 * demand, server-side sorting by column and pagination, and the actions the
 * role may run on each row. Below 768 px the table turns into cards.
 */
@Component({
  selector: 'app-school-quotations-list',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, ReportPaginationComponent, SchoolPaymentModalComponent, SchoolPurgeModalComponent],
  templateUrl: './school-quotations-list.component.html',
  styleUrl: './school-quotations-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolQuotationsListComponent {
  @Output() createNew = new EventEmitter<void>();

  readonly service = inject(SchoolListService);
  readonly documents = inject(SchoolDocumentsService);
  private readonly router = inject(Router);
  private readonly confirm = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly formatDate = formatSchoolDate;
  readonly statusLabel = SCHOOL_STATUS_LABEL;
  readonly statusTone = SCHOOL_STATUS_TONE;
  readonly statusColor = SCHOOL_STATUS_COLOR;
  readonly accountTone = SCHOOL_ACCOUNT_TONE;
  readonly accountLabel = SCHOOL_ACCOUNT_LABEL;
  readonly statuses = SCHOOL_STATUSES;
  readonly supplyLabel = SCHOOL_SUPPLY_LABEL;
  readonly supplyTone = SCHOOL_SUPPLY_TONE;
  readonly supplyStatuses = SCHOOL_SUPPLY_FILTERS;
  readonly isEditable = isSchoolQuotationEditable;
  readonly canPay = canReceiveSchoolPayment;
  readonly pageSize = 20;

  readonly search = signal('');
  readonly phone = signal('');
  readonly number = signal('');
  readonly grade = signal('');
  readonly status = signal<SchoolQuotationStatus | ''>('');
  readonly supplyStatus = signal<SchoolSupplyStatus | ''>('');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  /**
   * "Aceptadas sin pagos": lists saved as accepted before migration
   * 1760009000000 may be quotations the customer never accepted. The owner
   * reviews them one by one (no automatic correction).
   */
  readonly acceptedWithoutPayments = signal(false);
  readonly page = signal(1);
  /** Column the backend orders by (null = newest first). */
  readonly sortBy = signal<SchoolQuotationSortField | null>(null);
  readonly sortDirection = signal<'asc' | 'desc'>('desc');

  readonly summary = signal<SchoolDashboard | null>(null);
  readonly summaryFailed = signal(false);

  readonly grades = signal<string[]>([]);
  readonly items = signal<SchoolQuotationSummary[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly failed = signal(false);
  readonly paying = signal<SchoolQuotationSummary | null>(null);
  readonly delivering = signal<string | null>(null);

  constructor() {
    // The Caja de Listas alert links here to review the lists accepted without payments.
    if (inject(ActivatedRoute).snapshot.queryParamMap.get('revisar') === 'aceptadas-sin-pagos') {
      this.acceptedWithoutPayments.set(true);
    }
    this.service.getTemplates().subscribe({
      next: (templates) => this.grades.set([...new Set(templates.map((t) => t.grade))].sort()),
    });
    this.load();
    this.loadSummary();
  }

  applyFilters(): void {
    this.page.set(1);
    this.load();
    this.loadSummary();
  }

  /**
   * Clicking a column orders by it (descending first for amounts and dates,
   * ascending for text); clicking it again flips the direction.
   */
  sort(field: SchoolQuotationSortField): void {
    if (this.sortBy() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDirection.set(['customer', 'grade', 'status', 'number'].includes(field) ? 'asc' : 'desc');
    }
    this.page.set(1);
    this.load();
  }

  /** aria-sort value of a sortable header. */
  ariaSort(field: SchoolQuotationSortField): 'ascending' | 'descending' | 'none' {
    return this.sortBy() !== field ? 'none' : this.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }

  /** Cards built from the backend dashboard of the same period as the date filters. */
  cards(): SummaryCard[] {
    const d = this.summary();
    if (!d) {
      return [];
    }
    const period = `${formatSchoolDate(d.dateFrom)} – ${formatSchoolDate(d.dateTo)}`;
    // Quotations are never money: only accepted lists are sold or owed (migration 1760009000000).
    return [
      { label: 'Total de listas', value: String(d.totalQuotations), hint: period, icon: 'file-check', color: 'blue' },
      {
        label: 'Cotizaciones por decidir',
        value: String(d.awaitingQuotations),
        hint: `${formatCurrency(d.quotedPendingTotal)} cotizado · no es dinero`,
        icon: 'clock',
        color: 'sky',
      },
      { label: 'Listas aceptadas', value: formatCurrency(d.acceptedTotal), hint: `Recaudado ${formatCurrency(d.totalReceived)}`, icon: 'receipt', color: 'purple' },
      { label: 'Con saldo pendiente', value: String(d.pendingQuotations), hint: `Por cobrar ${formatCurrency(d.pendingBalance)}`, icon: 'wallet', color: 'orange' },
      { label: 'Listas pagadas', value: String(d.paidQuotations), hint: 'Aceptadas y pagadas por completo', icon: 'check-circle', color: 'green' },
    ];
  }

  loadSummary(): void {
    this.service.getDashboard(this.dateFrom() || undefined, this.dateTo() || undefined).subscribe({
      next: (d) => {
        this.summary.set(d);
        this.summaryFailed.set(false);
      },
      error: () => this.summaryFailed.set(true),
    });
  }

  clearFilters(): void {
    this.search.set('');
    this.phone.set('');
    this.number.set('');
    this.grade.set('');
    this.status.set('');
    this.supplyStatus.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.acceptedWithoutPayments.set(false);
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service
      .getQuotations({
        search: this.search().trim() || undefined,
        phone: this.phone().trim() || undefined,
        number: this.number().trim() || undefined,
        grade: this.grade() || undefined,
        status: this.status() || undefined,
        supplyStatus: this.supplyStatus() || undefined,
        acceptedWithoutPayments: this.acceptedWithoutPayments() || undefined,
        dateFrom: this.dateFrom() || undefined,
        dateTo: this.dateTo() || undefined,
        sortBy: this.sortBy() ?? undefined,
        sortDirection: this.sortBy() ? this.sortDirection() : undefined,
        page: this.page(),
        limit: this.pageSize,
      })
      .subscribe({
        next: (result) => {
          this.items.set(result.items);
          this.total.set(result.total);
          this.failed.set(false);
          this.loading.set(false);
        },
        error: () => {
          this.failed.set(true);
          this.loading.set(false);
        },
      });
  }

  open(q: SchoolQuotationSummary, tab?: 'cuenta' | 'historial' | 'abastecimiento'): void {
    void this.router.navigate(['/dashboard/listas-escolares/cotizaciones', q.id], {
      queryParams: tab ? { vista: tab } : {},
    });
  }

  edit(q: SchoolQuotationSummary): void {
    void this.router.navigate(['/dashboard/listas-escolares/cotizaciones', q.id, 'editar']);
  }

  /**
   * "Preparar y despachar" (= entrega): fully paid and fully supplied; a list of
   * the requirements flow, once its preparation is finished (TERMINADA).
   */
  canDeliver(q: SchoolQuotationSummary): boolean {
    if (q.fulfillmentMode === 'PREPARACION') {
      return q.status === 'TERMINADA' && q.balance <= 0;
    }
    return ['PAGADA', 'EN_PREPARACION', 'TERMINADA'].includes(q.status) && q.balance <= 0 && q.supplyStatus === 'DISPONIBLE';
  }

  /**
   * Previous flow: the list can be marked as packed/dispatched until it is
   * finished. Requirements flow: the button opens "Preparación del pedido"
   * (products are assigned there and "Finalizar preparación" discounts Bodega).
   */
  canFinish(q: SchoolQuotationSummary): boolean {
    if (q.fulfillmentMode === 'PREPARACION') {
      return q.status === 'EN_PREPARACION';
    }
    return ['ACEPTADA', 'ANTICIPO_RECIBIDO', 'PAGO_PARCIAL', 'PAGADA', 'EN_PREPARACION'].includes(q.status);
  }

  /** Toggles the "Aceptadas sin pagos" review filter and reloads. */
  toggleAcceptedWithoutPayments(): void {
    this.acceptedWithoutPayments.update((on) => !on);
    this.applyFilters();
  }

  /** Title of the row's payment button: why a quotation cannot be paid yet. */
  payTitle(q: SchoolQuotationSummary): string {
    return q.status === 'COTIZADA' || q.status === 'BORRADOR' ? SCHOOL_QUOTE_NOT_ACCEPTED_MESSAGE : 'Registrar abono';
  }

  /**
   * "Aceptar lista": the customer accepts the quotation. It becomes a sale and
   * its total is owed; no payment is registered and the Caja de Listas does not move.
   */
  async accept(q: SchoolQuotationSummary): Promise<void> {
    const ok = await this.confirm.confirm({
      type: 'UPDATE',
      title: 'Aceptar lista',
      message:
        `${q.customerName} acepta la cotización ${q.quotationNumber} por ${formatCurrency(q.total)}. ` +
        'Queda como venta y su total pasa a saldo pendiente de pago; no registra ningún pago ni mueve la Caja de Listas.',
      confirmText: 'Aceptar lista',
    });
    if (!ok) {
      return;
    }
    this.delivering.set(q.id);
    this.service.changeStatus(q.id, 'ACEPTAR', q.version).subscribe({
      next: () => {
        this.delivering.set(null);
        this.notifications.success(`${q.quotationNumber} aceptada: ya puede recibir anticipos y abonos.`);
        this.load();
        this.loadSummary();
      },
      error: (error: HttpErrorResponse) => {
        this.delivering.set(null);
        this.notifications.error(extractErrorMessage(error, 'No se pudo aceptar la lista.'));
        this.load();
      },
    });
  }

  finishTitle(q: SchoolQuotationSummary): string {
    return q.fulfillmentMode === 'PREPARACION' ? 'Preparar pedido (asignar productos de inventario)' : 'Marcar como terminada (lista para entregar)';
  }

  async finish(q: SchoolQuotationSummary): Promise<void> {
    if (q.fulfillmentMode === 'PREPARACION') {
      void this.router.navigate(['/dashboard/listas-escolares/cotizaciones', q.id, 'preparacion']);
      return;
    }
    const ok = await this.confirm.confirm({
      type: 'UPDATE',
      title: 'Marcar como terminada',
      message: `La lista de ${q.quotationNumber} (${q.customerName}) queda despachada y lista para ser entregada.` +
        (q.balance > 0 ? ` Saldo pendiente: ${formatCurrency(q.balance)}; la entrega lo exige completo.` : ''),
      confirmText: 'Marcar como terminada',
    });
    if (!ok) {
      return;
    }
    this.delivering.set(q.id);
    this.service.changeStatus(q.id, 'TERMINAR', q.version).subscribe({
      next: () => {
        this.delivering.set(null);
        this.notifications.success(`${q.quotationNumber} terminada: lista para entregar.`);
        this.load();
        this.loadSummary();
      },
      error: (error: HttpErrorResponse) => {
        this.delivering.set(null);
        this.notifications.error(extractErrorMessage(error, 'No se pudo marcar como terminada.'));
      },
    });
  }

  /** "Borrar todas las cotizaciones" open (super administrators only). */
  readonly purging = signal(false);
  /** Quotation open in "Eliminar cotización" (super administrators only). */
  readonly deleting = signal<SchoolQuotationSummary | null>(null);

  onPurged(result: SchoolPurgeSummary): void {
    const one = this.deleting();
    this.purging.set(false);
    this.deleting.set(null);
    this.notifications.success(
      (one
        ? `Cotización ${one.quotationNumber} eliminada (${result.payments} pago(s))`
        : `Se borraron ${result.quotations} cotización(es) y ${result.payments} pago(s)`) +
        `; regresaron ${result.returnedUnits} unidad(es) a Bodega.`,
    );
    this.page.set(1);
    this.load();
    this.loadSummary();
  }

  onPaid(): void {
    this.paying.set(null);
    this.load();
    this.loadSummary();
  }

  /** Opens the dispatch (detail → Abastecimiento), where the products are reviewed before delivery. */
  deliver(q: SchoolQuotationSummary): void {
    void this.router.navigate(['/dashboard/listas-escolares/cotizaciones', q.id], {
      queryParams: { vista: 'abastecimiento', despachar: 1 },
    });
  }
}
