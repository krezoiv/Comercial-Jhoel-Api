import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnChanges, OnInit, SimpleChanges, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';

import {
  SCHOOL_CUSTOMER_STATUS_LABEL,
  SCHOOL_CUSTOMER_STATUS_TONE,
  SchoolCustomer,
  SchoolCustomerPage,
  SchoolCustomerSort,
  SchoolCustomerStatus,
  SchoolCustomerView,
  SchoolTemplateSummary,
  formatCurrency,
} from '../../../../../core/models';
import { SchoolCashBoxService } from '../../../../../core/services/school-cash-box.service';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { formatGuatemalaDateTime, formatIsoDate } from '../../school-cash.util';

const PAGE_SIZE = 20;

const VIEWS: { id: SchoolCustomerView; label: string }[] = [
  { id: 'ALL', label: 'Todos' },
  { id: 'WITH_BALANCE', label: 'Con saldo pendiente' },
  { id: 'NO_PAYMENTS', label: 'Sin abonos' },
  { id: 'WITH_PAYMENTS', label: 'Con abonos' },
  { id: 'SOLVENT', label: 'Solventes' },
];

const SORTS: { id: SchoolCustomerSort; label: string }[] = [
  { id: 'BALANCE', label: 'Mayor saldo' },
  { id: 'PAID', label: 'Mayor abonado' },
  { id: 'PURCHASED', label: 'Mayor compra' },
  { id: 'LAST_PAYMENT', label: 'Último pago' },
  { id: 'NAME', label: 'Nombre' },
];

/**
 * "Estado de Cuenta de Clientes": every customer (same phone digits) with what
 * they bought, paid and still owe, their state (Solvente / Abonando /
 * Pendiente) and their last payment. Real-time search (name, student, phone,
 * list number), quick filters, grade and date filters and sorting all run in
 * the backend. A row opens the customer's file.
 */
@Component({
  selector: 'app-school-cash-customers',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './school-cash-customers.component.html',
  styleUrl: './school-cash-customers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCashCustomersComponent implements OnInit, OnChanges {
  @Input() view: SchoolCustomerView = 'ALL';
  @Input() refresh = 0;

  private readonly service = inject(SchoolCashBoxService);
  private readonly lists = inject(SchoolListService);
  private readonly router = inject(Router);
  private readonly searches = new Subject<void>();

  readonly views = VIEWS;
  readonly sorts = SORTS;
  readonly statusLabel = SCHOOL_CUSTOMER_STATUS_LABEL;
  readonly statusTone = SCHOOL_CUSTOMER_STATUS_TONE;
  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly formatDay = formatIsoDate;
  readonly skeletonRows = [1, 2, 3, 4, 5];

  readonly page = signal<SchoolCustomerPage | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly search = signal('');
  readonly activeView = signal<SchoolCustomerView>('ALL');
  readonly status = signal<SchoolCustomerStatus | ''>('');
  readonly grade = signal('');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly sort = signal<SchoolCustomerSort>('BALANCE');
  readonly pageNumber = signal(1);
  readonly grades = signal<string[]>([]);

  readonly pages = computed(() => Math.max(1, Math.ceil((this.page()?.total ?? 0) / PAGE_SIZE)));
  readonly items = computed(() => this.page()?.items ?? []);

  constructor() {
    this.searches.pipe(debounceTime(300), takeUntilDestroyed(inject(DestroyRef))).subscribe(() => this.apply());
  }

  ngOnInit(): void {
    this.lists.getTemplates(true).subscribe({
      next: (templates: SchoolTemplateSummary[]) => this.grades.set([...new Set(templates.map((t) => t.grade))].sort()),
      error: () => this.grades.set([]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['view']) {
      this.activeView.set(this.view);
    }
    this.load();
  }

  typed(value: string): void {
    this.search.set(value);
    this.searches.next();
  }

  setView(view: SchoolCustomerView): void {
    this.activeView.set(view);
    this.apply();
  }

  apply(): void {
    this.pageNumber.set(1);
    this.load();
  }

  clear(): void {
    this.search.set('');
    this.activeView.set('ALL');
    this.status.set('');
    this.grade.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.sort.set('BALANCE');
    this.apply();
  }

  go(page: number): void {
    this.pageNumber.set(Math.min(Math.max(1, page), this.pages()));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service
      .getCustomers({
        search: this.search().trim() || undefined,
        view: this.activeView(),
        status: this.status() || undefined,
        grade: this.grade() || undefined,
        dateFrom: this.dateFrom() || undefined,
        dateTo: this.dateTo() || undefined,
        sort: this.sort(),
        page: this.pageNumber(),
        limit: PAGE_SIZE,
      })
      .subscribe({
        next: (page) => {
          this.page.set(page);
          this.loading.set(false);
          this.error.set(null);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(extractErrorMessage(err, 'No se pudieron cargar los clientes.'));
        },
      });
  }

  open(customer: SchoolCustomer): void {
    void this.router.navigate(['/dashboard/caja-listas/clientes', customer.key]);
  }

  percent(customer: SchoolCustomer): number {
    return customer.purchased > 0 ? Math.min(100, (customer.paid / customer.purchased) * 100) : 0;
  }
}
