import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';

import { AccountReceivable, ActiveBalanceSummary, Client, SettlementResult } from '../../../core/models';
import { AccountReceivablePaymentService } from '../../../core/services/account-receivable-payment.service';
import { AccountReceivableService } from '../../../core/services/account-receivable.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { formatCurrency } from '../../../core/utils/number-format.util';
import { AccountStatementModalComponent, CardComponent, KardexStatementClient, PageHeaderComponent, SummaryTileComponent } from '../../../shared/ui';
import { ReportPaginationComponent } from '../reports/components/report-pagination/report-pagination.component';
import { AccountReceivableToolbarComponent, AccountReceivableStatusFilterValue } from './components/account-receivable-toolbar/account-receivable-toolbar.component';
import { AccountReceivableTableComponent } from './components/account-receivable-table/account-receivable-table.component';
import { AccountReceivableFormModalComponent } from './components/account-receivable-form-modal/account-receivable-form-modal.component';
import { DeleteConfirmModalComponent } from './components/delete-confirm-modal/delete-confirm-modal.component';
import { SettlementModalComponent } from './components/settlement-modal/settlement-modal.component';
import { PaymentHistoryModalComponent } from './components/payment-history-modal/payment-history-modal.component';
import { ButtonComponent, IconComponent } from '../../../shared/ui';

const LIMIT = 20;

@Component({
  selector: 'app-accounts-receivable-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    AccountReceivableToolbarComponent,
    AccountReceivableTableComponent,
    AccountReceivableFormModalComponent,
    DeleteConfirmModalComponent,
    ReportPaginationComponent,
    AccountStatementModalComponent,
    CardComponent,
    SummaryTileComponent,
    SettlementModalComponent,
    PaymentHistoryModalComponent,
    ButtonComponent,
    IconComponent,
  ],
  templateUrl: './accounts-receivable-page.component.html',
  styleUrl: './accounts-receivable-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Identical clone of `AssetsPageComponent` — see that class's own doc comment for the server-side-pagination/always-refetch pattern (a deliberate departure from `UsersPageComponent`/`BanksPageComponent`'s client-side-filtering pattern). */
export class AccountsReceivablePageComponent {
  /** Not private — bound directly as `[service]` on `<app-account-statement-modal>` in the template. */
  readonly accountReceivableService = inject(AccountReceivableService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly paymentService = inject(AccountReceivablePaymentService);

  /** ADMIN/SUPER_ADMIN only — passed down to hide add/edit/delete for other roles. The backend enforces this regardless. */
  readonly isAdmin = this.authService.isAdmin;

  readonly records = signal<AccountReceivable[]>([]);
  readonly total = signal(0);
  readonly loading = signal(true);
  readonly limit = LIMIT;

  readonly searchTerm = signal('');
  readonly statusFilter = signal<AccountReceivableStatusFilterValue>('all');
  readonly clientFilter = signal<Client | null>(null);
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly page = signal(1);

  readonly isFormOpen = signal(false);
  readonly editingRecord = signal<AccountReceivable | null>(null);

  readonly isDeleteOpen = signal(false);
  readonly deletingRecord = signal<AccountReceivable | null>(null);
  readonly isDeleting = signal(false);

  readonly isStatementOpen = signal(false);
  readonly statementClient = signal<KardexStatementClient | null>(null);

  /**
   * Multi-account cancellation: selected CARGO ids → their pending amount
   * (as last read from the backend, display only — the settlement preview
   * recomputes everything in PostgreSQL). All of ONE client.
   */
  readonly selection = signal<ReadonlyMap<string, number>>(new Map());
  readonly selectionClientId = signal<string | null>(null);
  readonly selectionClientName = signal('');
  readonly selectedIds = computed<ReadonlySet<string>>(() => new Set(this.selection().keys()));
  readonly selectedCount = computed(() => this.selection().size);
  readonly selectedTotal = computed(() =>
    Math.round([...this.selection().values()].reduce((sum, value) => sum + value, 0) * 100) / 100,
  );
  readonly loadingClientPending = signal(false);

  readonly isSettlementOpen = signal(false);
  readonly settlementClientId = signal<string | null>(null);
  readonly settlementClientName = signal('');
  readonly settlementAccountIds = signal<string[]>([]);

  readonly isPaymentsOpen = signal(false);
  readonly paymentsChargeId = signal<string | null>(null);
  readonly paymentsClientName = signal('');

  /** Saldo total de cuentas activas — always unfiltered (independent of search/date/estado above), refetched whenever the underlying data actually changes (not on a plain filter/page change). */
  readonly activeBalance = signal<ActiveBalanceSummary | null>(null);
  formatCurrency = formatCurrency;

  readonly hasActiveFilters = computed(
    () =>
      this.searchTerm().trim().length > 0 ||
      this.statusFilter() !== 'all' ||
      this.clientFilter() !== null ||
      this.dateFrom() !== '' ||
      this.dateTo() !== '',
  );

  private readonly searchTerm$ = new Subject<void>();

  constructor() {
    this.searchTerm$.pipe(debounceTime(300), takeUntilDestroyed()).subscribe(() => {
      this.page.set(1);
      this.fetchRecords();
    });
    this.fetchRecords();
    this.fetchActiveBalance();
  }

  /** Always active-only, unfiltered — refetched whenever the underlying data actually changes (create/edit/deactivate/Kardex movement), never on a plain search/date/page change. */
  fetchActiveBalance(): void {
    this.accountReceivableService.getActiveBalance().subscribe({
      next: (summary) => this.activeBalance.set(summary),
      error: () => {
        // Silent — this tile is a nice-to-have; the list itself already reports its own load errors.
      },
    });
  }

  /** Not private — also called from the template as `(changed)="fetchRecords()"` after a Kardex movement is registered. */
  fetchRecords(): void {
    this.loading.set(true);
    const status = this.statusFilter();
    this.accountReceivableService
      .getAccountsReceivable({
        search: this.searchTerm().trim() || undefined,
        clientId: this.clientFilter()?.id,
        dateFrom: this.dateFrom() || undefined,
        dateTo: this.dateTo() || undefined,
        isActive: status === 'all' ? undefined : status === 'active',
        page: this.page(),
        limit: this.limit,
      })
      .subscribe({
        next: (result) => {
          this.records.set(result.items);
          this.total.set(result.total);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar las cuentas por cobrar.'));
        },
      });
  }

  onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
    this.searchTerm$.next();
  }

  onStatusFilterChange(value: AccountReceivableStatusFilterValue): void {
    this.statusFilter.set(value);
    this.page.set(1);
    this.fetchRecords();
  }

  onClientFilterChange(client: Client | null): void {
    this.clientFilter.set(client);
    this.page.set(1);
    this.fetchRecords();
  }

  onDateFromChange(value: string): void {
    this.dateFrom.set(value);
    this.page.set(1);
    this.fetchRecords();
  }

  onDateToChange(value: string): void {
    this.dateTo.set(value);
    this.page.set(1);
    this.fetchRecords();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.fetchRecords();
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('all');
    this.clientFilter.set(null);
    this.dateFrom.set('');
    this.dateTo.set('');
    this.page.set(1);
    this.fetchRecords();
  }

  openCreateForm(): void {
    this.editingRecord.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(record: AccountReceivable): void {
    this.editingRecord.set(record);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  onRecordSaved(record: AccountReceivable): void {
    const wasEditing = this.editingRecord() !== null;
    this.isFormOpen.set(false);
    this.notificationService.success(
      wasEditing ? 'La cuenta por cobrar se actualizó correctamente.' : 'La cuenta por cobrar se registró correctamente.',
    );
    this.fetchRecords();
    this.fetchActiveBalance();
  }

  openStatement(record: AccountReceivable): void {
    this.statementClient.set({ id: record.clientId, name: record.clientName });
    this.isStatementOpen.set(true);
  }

  closeStatement(): void {
    this.isStatementOpen.set(false);
  }

  requestDelete(record: AccountReceivable): void {
    this.deletingRecord.set(record);
    this.isDeleteOpen.set(true);
  }

  cancelDelete(): void {
    this.isDeleteOpen.set(false);
    this.deletingRecord.set(null);
  }

  confirmDelete(): void {
    const record = this.deletingRecord();
    if (!record) {
      return;
    }

    this.isDeleting.set(true);
    this.accountReceivableService.deleteAccountReceivable(record.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.isDeleteOpen.set(false);
        this.deletingRecord.set(null);
        this.notificationService.success('La cuenta por cobrar se desactivó correctamente.');
        this.fetchRecords();
        this.fetchActiveBalance();
      },
      error: (error: HttpErrorResponse) => {
        this.isDeleting.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo desactivar la cuenta por cobrar.'));
      },
    });
  }

  /** Checkbox of one account; accounts of another client are refused until the selection is cleared. */
  toggleSelect(record: AccountReceivable): void {
    const current = this.selection();
    if (current.size > 0 && record.clientId !== this.selectionClientId()) {
      this.notificationService.warning(
        `Ya tiene cuentas seleccionadas de ${this.selectionClientName()}. Finalice o limpie la selección actual para seleccionar cuentas de otro cliente.`,
      );
      return;
    }
    const next = new Map(current);
    if (next.has(record.id)) {
      next.delete(record.id);
    } else {
      next.set(record.id, record.pendingAmount ?? 0);
    }
    this.selection.set(next);
    this.selectionClientId.set(next.size > 0 ? record.clientId : null);
    this.selectionClientName.set(next.size > 0 ? record.clientName : '');
  }

  /** Selects every pending account of the selection's client (all pages, read from the backend). */
  selectAllClientPending(): void {
    const clientId = this.selectionClientId() ?? this.clientFilter()?.id ?? null;
    if (!clientId) {
      return;
    }
    this.loadingClientPending.set(true);
    this.paymentService.getPendingCharges(clientId).subscribe({
      next: (result) => {
        this.loadingClientPending.set(false);
        this.selection.set(new Map(result.charges.map((charge) => [charge.id, charge.pendingAmount])));
        this.selectionClientId.set(result.charges.length > 0 ? clientId : null);
        this.selectionClientName.set(result.charges.length > 0 ? result.clientName : '');
        if (result.charges.length === 0) {
          this.notificationService.info(`${result.clientName} no tiene cuentas pendientes.`);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loadingClientPending.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar las cuentas pendientes.'));
      },
    });
  }

  clearSelection(): void {
    this.selection.set(new Map());
    this.selectionClientId.set(null);
    this.selectionClientName.set('');
  }

  /** "Cancelar cuentas seleccionadas". */
  openSelectionSettlement(): void {
    const clientId = this.selectionClientId();
    if (!clientId || this.selectedCount() === 0) {
      return;
    }
    this.settlementClientId.set(clientId);
    this.settlementClientName.set(this.selectionClientName());
    this.settlementAccountIds.set([...this.selection().keys()]);
    this.isSettlementOpen.set(true);
  }

  /** "Cobrar" one account (allows a partial amount). */
  openSingleSettlement(record: AccountReceivable): void {
    this.settlementClientId.set(record.clientId);
    this.settlementClientName.set(record.clientName);
    this.settlementAccountIds.set([record.id]);
    this.isSettlementOpen.set(true);
  }

  closeSettlement(): void {
    this.isSettlementOpen.set(false);
  }

  onSettled(result: SettlementResult): void {
    this.isSettlementOpen.set(false);
    // Drop the accounts that were just collected from the selection (all of them for a batch).
    const paid = new Set(result.operation.details.map((detail) => detail.accountReceivableId));
    const remaining = new Map([...this.selection()].filter(([id]) => !paid.has(id)));
    if (remaining.size === 0) {
      this.clearSelection();
    } else {
      this.selection.set(remaining);
    }
    this.fetchRecords();
    this.fetchActiveBalance();
  }

  openPayments(record: AccountReceivable): void {
    this.paymentsChargeId.set(record.id);
    this.paymentsClientName.set(record.clientName);
    this.isPaymentsOpen.set(true);
  }

  closePayments(): void {
    this.isPaymentsOpen.set(false);
  }

  /** A collection was voided from the history modal. */
  onPaymentsChanged(): void {
    this.clearSelection();
    this.fetchRecords();
    this.fetchActiveBalance();
  }
}
