import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  SCHOOL_ACCOUNT_LABEL,
  SCHOOL_ACCOUNT_TONE,
  SCHOOL_STATUSES,
  SCHOOL_STATUS_LABEL,
  SCHOOL_STATUS_TONE,
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
import { BadgeComponent, ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { ReportPaginationComponent } from '../../../reports/components/report-pagination/report-pagination.component';
import { SchoolDocumentsService } from '../../school-documents.service';
import { SchoolPaymentModalComponent } from '../school-payment-modal/school-payment-modal.component';

/**
 * "Listado general de cotizaciones": filters (customer, phone, number, grade,
 * status, dates) applied on demand, server-side pagination and the actions
 * the role may run on each row.
 */
@Component({
  selector: 'app-school-quotations-list',
  standalone: true,
  imports: [FormsModule, BadgeComponent, ButtonComponent, IconComponent, ReportPaginationComponent, SchoolPaymentModalComponent],
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
  readonly accountTone = SCHOOL_ACCOUNT_TONE;
  readonly accountLabel = SCHOOL_ACCOUNT_LABEL;
  readonly statuses = SCHOOL_STATUSES;
  readonly isEditable = isSchoolQuotationEditable;
  readonly canPay = canReceiveSchoolPayment;
  readonly pageSize = 20;

  readonly search = signal('');
  readonly phone = signal('');
  readonly number = signal('');
  readonly grade = signal('');
  readonly status = signal<SchoolQuotationStatus | ''>('');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly page = signal(1);

  readonly grades = signal<string[]>([]);
  readonly items = signal<SchoolQuotationSummary[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly failed = signal(false);
  readonly paying = signal<SchoolQuotationSummary | null>(null);
  readonly delivering = signal<string | null>(null);

  constructor() {
    this.service.getTemplates().subscribe({
      next: (templates) => this.grades.set([...new Set(templates.map((t) => t.grade))].sort()),
    });
    this.load();
  }

  applyFilters(): void {
    this.page.set(1);
    this.load();
  }

  clearFilters(): void {
    this.search.set('');
    this.phone.set('');
    this.number.set('');
    this.grade.set('');
    this.status.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
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
        dateFrom: this.dateFrom() || undefined,
        dateTo: this.dateTo() || undefined,
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

  open(q: SchoolQuotationSummary, tab?: 'cuenta' | 'historial'): void {
    void this.router.navigate(['/dashboard/listas-escolares/cotizaciones', q.id], {
      queryParams: tab ? { vista: tab } : {},
    });
  }

  edit(q: SchoolQuotationSummary): void {
    void this.router.navigate(['/dashboard/listas-escolares/cotizaciones', q.id, 'editar']);
  }

  canDeliver(q: SchoolQuotationSummary): boolean {
    return (q.status === 'PAGADA' || q.status === 'EN_PREPARACION') && q.balance <= 0;
  }

  onPaid(): void {
    this.paying.set(null);
    this.load();
  }

  async deliver(q: SchoolQuotationSummary): Promise<void> {
    const ok = await this.confirm.confirm({
      type: 'UPDATE',
      title: 'Registrar entrega',
      message: `¿Confirmar que los útiles de ${q.quotationNumber} (${q.customerName}) fueron entregados? La cotización quedará cerrada. No descuenta inventario ni registra una venta.`,
      confirmText: 'Registrar entrega',
    });
    if (!ok) {
      return;
    }
    this.delivering.set(q.id);
    this.service.changeStatus(q.id, 'ENTREGAR', q.version).subscribe({
      next: () => {
        this.delivering.set(null);
        this.notifications.success('Entrega registrada.');
        this.load();
      },
      error: (error: HttpErrorResponse) => {
        this.delivering.set(null);
        this.notifications.error(extractErrorMessage(error, 'No se pudo registrar la entrega.'));
      },
    });
  }
}
