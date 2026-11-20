import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { SchoolCashCount, formatCurrency } from '../../../../../core/models';
import { SchoolCashBoxService } from '../../../../../core/services/school-cash-box.service';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { formatGuatemalaDateTime } from '../../school-cash.util';

const PAGE_SIZE = 20;

/**
 * History of the cash counts (arqueos) of the Caja de Listas. Counts are
 * immutable photographs: theoretical balance, counted cash, difference and the
 * denominations, never edited. A row expands to show its breakdown.
 */
@Component({
  selector: 'app-school-cash-counts',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './school-cash-counts.component.html',
  styleUrl: './school-cash-counts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCashCountsComponent implements OnChanges {
  @Input() refresh = 0;
  @Output() newCount = new EventEmitter<void>();

  readonly lists = inject(SchoolListService);
  private readonly service = inject(SchoolCashBoxService);

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly items = signal<SchoolCashCount[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly open = signal<string | null>(null);
  readonly dateFrom = signal('');
  readonly dateTo = signal('');

  readonly pages = computed(() => Math.max(1, Math.ceil(this.total() / PAGE_SIZE)));
  readonly tone = (count: SchoolCashCount) => (count.status === 'CUADRADO' ? 'cash' : count.status === 'FALTANTE' ? 'short' : 'sales');

  ngOnChanges(): void {
    this.load();
  }

  go(page: number): void {
    this.page.set(Math.min(Math.max(1, page), this.pages()));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service
      .getCounts({ dateFrom: this.dateFrom() || undefined, dateTo: this.dateTo() || undefined, page: this.page(), limit: PAGE_SIZE })
      .subscribe({
        next: (page) => {
          this.items.set(page.items);
          this.total.set(page.total);
          this.loading.set(false);
          this.error.set(null);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(extractErrorMessage(err, 'No se pudieron cargar los arqueos.'));
        },
      });
  }

  toggle(id: string): void {
    this.open.update((current) => (current === id ? null : id));
  }
}
