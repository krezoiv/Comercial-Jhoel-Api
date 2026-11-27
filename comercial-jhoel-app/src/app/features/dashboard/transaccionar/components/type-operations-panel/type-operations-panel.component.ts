import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  OPERATION_MODALITY_LABEL,
  OperationModality,
  PAYMENT_GROUP_STATUS_LABEL,
  PaymentGroupStatus,
  TYPE_ENTRY_STATUS_LABEL,
  TypeEntryStatus,
  TypeOperationEntry,
  TypeOperationList,
  User,
  formatCurrency,
  groupStatusTone,
  paymentGroupRoute,
} from '../../../../../core/models';
import { AuthService } from '../../../../../core/services/auth.service';
import { BankDepositService } from '../../../../../core/services/bank-deposit.service';
import { onCashChanged } from '../../../../../core/services/cash-control-sync.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { UserService } from '../../../../../core/services/user.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { formatGuatemalaDateTime, formatIsoDate } from '../../../cash-control/cash-control.util';
import { BankDepositDetailModalComponent } from '../../../reports/bank-deposits/components/bank-deposit-detail-modal/bank-deposit-detail-modal.component';

/**
 * "Operaciones de <tipo>" inside Pago Varios / Préstamos Génesis: individual
 * operations and payment groups in one list, each with its MODALIDAD. A group
 * stands for its deliveries (they are not listed as independent operations);
 * opening it goes to the group, opening an individual operation shows its
 * detail. Every figure comes from the backend.
 */
@Component({
  selector: 'app-type-operations-panel',
  standalone: true,
  imports: [FormsModule, UpperCasePipe, ButtonComponent, IconComponent, BankDepositDetailModalComponent],
  templateUrl: './type-operations-panel.component.html',
  styleUrls: ['./type-operations-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeOperationsPanelComponent implements OnInit, OnChanges {
  @Input({ required: true }) transactionTypeId!: string;
  @Input() transactionTypeName = '';

  private readonly service = inject(BankDepositService);
  private readonly userService = inject(UserService);
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  readonly formatCurrency = formatCurrency;
  readonly formatDate = formatIsoDate;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly modalityLabel = OPERATION_MODALITY_LABEL;
  readonly statusLabels = TYPE_ENTRY_STATUS_LABEL;
  readonly statuses = Object.keys(TYPE_ENTRY_STATUS_LABEL) as TypeEntryStatus[];
  readonly isAdmin = this.auth.isAdmin;

  readonly list = signal<TypeOperationList | null>(null);
  readonly loading = signal(true);
  readonly users = signal<User[]>([]);
  readonly modality = signal<OperationModality | ''>('');
  readonly startDate = signal('');
  readonly endDate = signal('');
  readonly status = signal<TypeEntryStatus | ''>('');
  readonly userId = signal('');
  readonly onlyMine = signal(false);
  readonly search = signal('');
  readonly page = signal(1);
  readonly detailId = signal<string | null>(null);

  readonly totalPages = computed(() => {
    const list = this.list();
    return list ? Math.max(Math.ceil(list.total / list.limit), 1) : 1;
  });

  constructor() {
    onCashChanged(() => this.load());
  }

  ngOnInit(): void {
    if (this.isAdmin()) {
      this.userService.getUsers().subscribe({ next: (users) => this.users.set(users), error: () => this.users.set([]) });
    }
  }

  ngOnChanges(): void {
    this.page.set(1);
    this.load();
  }

  load(): void {
    if (!this.transactionTypeId) {
      return;
    }
    const mine = this.onlyMine() ? this.auth.currentUser()?.id : undefined;
    this.service
      .getTypeOperations(this.transactionTypeId, {
        modality: this.modality() || undefined,
        startDate: this.startDate() || undefined,
        endDate: this.endDate() || undefined,
        status: this.status() || undefined,
        userId: this.userId() || mine || undefined,
        search: this.search().trim() || undefined,
        page: this.page(),
        limit: 15,
      })
      .subscribe({
        next: (list) => {
          this.list.set(list);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.notifications.error(extractErrorMessage(error, 'No se pudieron cargar las operaciones.'));
        },
      });
  }

  setModality(modality: OperationModality | ''): void {
    this.modality.set(modality);
    this.applyFilters();
  }

  applyFilters(): void {
    this.page.set(1);
    this.load();
  }

  goToPage(page: number): void {
    this.page.set(Math.min(Math.max(page, 1), this.totalPages()));
    this.load();
  }

  /** CSS tone of a row's status: groups use their status colors; an individual operation is vigente or anulada. */
  statusTone(entry: TypeOperationEntry): string {
    if (entry.modality === 'GRUPAL') {
      return groupStatusTone(entry.status as PaymentGroupStatus);
    }
    return entry.status === 'ANULADA' ? 'voided' : 'paid';
  }

  statusText(entry: TypeOperationEntry): string {
    return entry.modality === 'GRUPAL'
      ? PAYMENT_GROUP_STATUS_LABEL[entry.status as PaymentGroupStatus] ?? entry.status
      : entry.status === 'ANULADA'
        ? 'Anulada'
        : 'Vigente';
  }

  open(entry: TypeOperationEntry): void {
    if (entry.modality === 'GRUPAL') {
      void this.router.navigate(paymentGroupRoute(entry.id));
    } else {
      this.detailId.set(entry.id);
    }
  }
}
