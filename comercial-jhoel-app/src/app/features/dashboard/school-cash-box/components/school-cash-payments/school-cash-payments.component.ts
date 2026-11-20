import { ChangeDetectionStrategy, Component, Input, OnChanges, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  SchoolCustomerPayment,
  SchoolPaymentPage,
  formatCurrency,
  paymentDestinationLabel,
} from '../../../../../core/models';
import { SchoolCashBoxService } from '../../../../../core/services/school-cash-box.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { formatGuatemalaDateTime } from '../../school-cash.util';

const PAGE_SIZE = 25;

/**
 * "Pagos": every payment of every school list (initial payments, abonos,
 * settlements, refunds and voids) with where its money went (Caja de Listas,
 * a bank and its transfer state, other media). Read-only; payments are
 * registered from the customer statement or the list itself.
 */
@Component({
  selector: 'app-school-cash-payments',
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent, IconComponent],
  templateUrl: './school-cash-payments.component.html',
  styleUrl: './school-cash-payments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCashPaymentsComponent implements OnChanges {
  @Input() refresh = 0;

  private readonly service = inject(SchoolCashBoxService);

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly destination = paymentDestinationLabel;

  readonly page = signal<SchoolPaymentPage | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly open = signal<string | null>(null);
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly method = signal('');
  readonly kind = signal('');
  readonly status = signal<'' | 'APLICADO' | 'ANULADO'>('');
  readonly search = signal('');
  readonly pageNumber = signal(1);

  readonly pages = computed(() => Math.max(1, Math.ceil((this.page()?.total ?? 0) / PAGE_SIZE)));

  ngOnChanges(): void {
    this.load();
  }

  apply(): void {
    this.pageNumber.set(1);
    this.load();
  }

  go(page: number): void {
    this.pageNumber.set(Math.min(Math.max(1, page), this.pages()));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service
      .getPayments({
        dateFrom: this.dateFrom() || undefined,
        dateTo: this.dateTo() || undefined,
        method: this.method() || undefined,
        kind: this.kind() || undefined,
        status: this.status() || undefined,
        search: this.search().trim() || undefined,
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
          this.error.set(extractErrorMessage(err, 'No se pudieron cargar los pagos.'));
        },
      });
  }

  toggle(id: string): void {
    this.open.update((current) => (current === id ? null : id));
  }

  /** A refund or a void is not money received: shown with a minus sign. */
  outgoing(p: SchoolCustomerPayment): boolean {
    return p.kind === 'DEVOLUCION' || p.kind === 'ANULACION';
  }

  customerKey(p: SchoolCustomerPayment): string {
    return (p.customerPhone ?? '').replace(/\D/g, '');
  }
}
