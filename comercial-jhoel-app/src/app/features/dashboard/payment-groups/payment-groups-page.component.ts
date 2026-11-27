import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  PAYMENT_GROUP_STATUS_LABEL,
  PaymentGroup,
  PaymentGroupDetail,
  PaymentGroupList,
  PaymentGroupStatus,
  TransactionType,
  User,
  formatCurrency,
  groupStatusTone,
} from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { onCashChanged } from '../../../core/services/cash-control-sync.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PaymentGroupService } from '../../../core/services/payment-group.service';
import { TransactionTypeService } from '../../../core/services/transaction-type.service';
import { UserService } from '../../../core/services/user.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent, PageHeaderComponent, SummaryTileComponent } from '../../../shared/ui';
import { formatIsoDate } from '../cash-control/cash-control.util';
import { GroupCloseModalComponent } from './components/group-close-modal/group-close-modal.component';
import { GroupHistoryModalComponent } from './components/group-history-modal/group-history-modal.component';

/**
 * Pagos grupales: every group with its counts and money (all from the
 * backend), filters, and the actions of each group. New groups are created
 * from Transaccionar ("Pago grupal" on an enabled operation type).
 */
@Component({
  selector: 'app-payment-groups-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    ButtonComponent,
    IconComponent,
    PageHeaderComponent,
    SummaryTileComponent,
    GroupHistoryModalComponent,
    GroupCloseModalComponent,
  ],
  templateUrl: './payment-groups-page.component.html',
  styleUrls: ['./payment-groups-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentGroupsPageComponent implements OnInit {
  private readonly service = inject(PaymentGroupService);
  private readonly typeService = inject(TransactionTypeService);
  private readonly userService = inject(UserService);
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  readonly formatCurrency = formatCurrency;
  readonly formatDate = formatIsoDate;
  readonly statusLabel = PAYMENT_GROUP_STATUS_LABEL;
  readonly statusTone = groupStatusTone;
  readonly statuses = Object.keys(PAYMENT_GROUP_STATUS_LABEL) as PaymentGroupStatus[];
  readonly isAdmin = this.auth.isAdmin;

  readonly list = signal<PaymentGroupList | null>(null);
  readonly loading = signal(true);
  readonly types = signal<TransactionType[]>([]);
  readonly users = signal<User[]>([]);
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly typeId = signal('');
  readonly status = signal<PaymentGroupStatus | ''>('');
  readonly createdBy = signal('');
  readonly onlyMine = signal(false);
  readonly search = signal('');
  readonly page = signal(1);

  readonly historyOf = signal<PaymentGroup | null>(null);
  readonly voiding = signal<PaymentGroupDetail | null>(null);

  readonly totalPages = computed(() => {
    const list = this.list();
    return list ? Math.max(Math.ceil(list.total / list.limit), 1) : 1;
  });
  readonly hasFilters = computed(
    () => !!(this.dateFrom() || this.dateTo() || this.typeId() || this.status() || this.createdBy() || this.onlyMine() || this.search()),
  );

  constructor() {
    onCashChanged(() => this.load());
  }

  ngOnInit(): void {
    this.typeService.getTransactionTypes().subscribe({
      next: (types) => this.types.set(types.filter((type) => type.allowsGroupPayment)),
      error: () => this.types.set([]),
    });
    if (this.isAdmin()) {
      this.userService.getUsers().subscribe({ next: (users) => this.users.set(users), error: () => this.users.set([]) });
    }
    this.load();
  }

  load(): void {
    const mine = this.onlyMine() ? this.auth.currentUser()?.id : undefined;
    this.service
      .list({
        dateFrom: this.dateFrom() || undefined,
        dateTo: this.dateTo() || undefined,
        transactionTypeId: this.typeId() || undefined,
        status: this.status() || undefined,
        createdBy: this.createdBy() || mine || undefined,
        search: this.search().trim() || undefined,
        page: this.page(),
        limit: 20,
      })
      .subscribe({
        next: (list) => {
          this.list.set(list);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.notifications.error(extractErrorMessage(error, 'No se pudieron cargar los pagos grupales.'));
        },
      });
  }

  applyFilters(): void {
    this.page.set(1);
    this.load();
  }

  clearFilters(): void {
    this.dateFrom.set('');
    this.dateTo.set('');
    this.typeId.set('');
    this.status.set('');
    this.createdBy.set('');
    this.onlyMine.set(false);
    this.search.set('');
    this.applyFilters();
  }

  goToPage(page: number): void {
    this.page.set(Math.min(Math.max(page, 1), this.totalPages()));
    this.load();
  }

  openDetail(group: PaymentGroup, action?: 'close'): void {
    void this.router.navigate(['/dashboard/pagos-grupales', group.id], action ? { queryParams: { accion: action } } : undefined);
  }

  openVoid(group: PaymentGroup): void {
    this.service.get(group.id).subscribe({
      next: (detail) => this.voiding.set(detail),
      error: (error: HttpErrorResponse) => this.notifications.error(extractErrorMessage(error, 'No se pudo abrir el grupo.')),
    });
  }

  onVoided(): void {
    this.voiding.set(null);
    this.load();
  }
}
