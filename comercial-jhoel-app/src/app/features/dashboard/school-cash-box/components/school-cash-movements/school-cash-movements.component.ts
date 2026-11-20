import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import {
  Bank,
  SCHOOL_CASH_MOVEMENT_ICON,
  SCHOOL_CASH_MOVEMENT_LABEL,
  SCHOOL_CASH_MOVEMENT_TYPES,
  SchoolCashMovement,
  SchoolCashMovementFilters,
  SchoolCashMovementType,
  formatCurrency,
  isSchoolCashBank,
} from '../../../../../core/models';
import { BankService } from '../../../../../core/services/bank.service';
import { SchoolCashBoxService } from '../../../../../core/services/school-cash-box.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { formatGuatemalaDateTime } from '../../school-cash.util';
import { SchoolCashMovementDetailComponent } from '../school-cash-movement-detail/school-cash-movement-detail.component';

const PAGE_SIZE = 25;

/**
 * Kardex of the Caja de Listas: every movement with its entry, exit and the
 * balance after it, filtered by date, type, customer/list (search), bank and
 * user. NONE rows (bank or other media) are shown too, without changing the
 * balance. A row opens its detail.
 */
@Component({
  selector: 'app-school-cash-movements',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, SchoolCashMovementDetailComponent],
  templateUrl: './school-cash-movements.component.html',
  styleUrl: './school-cash-movements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCashMovementsComponent implements OnInit, OnChanges {
  @Input() refresh = 0;
  @Output() changed = new EventEmitter<void>();

  private readonly service = inject(SchoolCashBoxService);
  private readonly bankService = inject(BankService);

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly label = SCHOOL_CASH_MOVEMENT_LABEL;
  readonly icon = SCHOOL_CASH_MOVEMENT_ICON;
  readonly types = SCHOOL_CASH_MOVEMENT_TYPES;

  readonly items = signal<SchoolCashMovement[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly banks = signal<Bank[]>([]);
  readonly users = signal<{ id: string; name: string }[]>([]);
  readonly detail = signal<SchoolCashMovement | null>(null);

  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly movementType = signal<SchoolCashMovementType | ''>('');
  readonly search = signal('');
  readonly bankId = signal('');
  readonly userId = signal('');

  readonly pages = computed(() => Math.max(1, Math.ceil(this.total() / PAGE_SIZE)));

  ngOnInit(): void {
    this.bankService.getBanks().subscribe({ next: (list) => this.banks.set(list.filter(isSchoolCashBank)), error: () => this.banks.set([]) });
    this.service.getUsers().subscribe({ next: (users) => this.users.set(users), error: () => this.users.set([]) });
  }

  ngOnChanges(): void {
    this.load();
  }

  apply(): void {
    this.page.set(1);
    this.load();
  }

  clear(): void {
    this.dateFrom.set('');
    this.dateTo.set('');
    this.movementType.set('');
    this.search.set('');
    this.bankId.set('');
    this.userId.set('');
    this.apply();
  }

  go(page: number): void {
    this.page.set(Math.min(Math.max(1, page), this.pages()));
    this.load();
  }

  load(): void {
    const filters: SchoolCashMovementFilters = {
      dateFrom: this.dateFrom() || undefined,
      dateTo: this.dateTo() || undefined,
      movementType: this.movementType() || undefined,
      search: this.search().trim() || undefined,
      bankId: this.bankId() || undefined,
      userId: this.userId() || undefined,
      page: this.page(),
      limit: PAGE_SIZE,
    };
    this.loading.set(true);
    this.service.getMovements(filters).subscribe({
      next: (page) => {
        this.items.set(page.items);
        this.total.set(page.total);
        this.loading.set(false);
        this.error.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(extractErrorMessage(err, 'No se pudieron cargar los movimientos.'));
      },
    });
  }

  reverted(): void {
    this.detail.set(null);
    this.changed.emit();
  }
}
