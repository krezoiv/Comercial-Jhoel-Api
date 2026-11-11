import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

import {
  CASH_DIRECTION_LABEL,
  CASH_MOVEMENT_TYPE_LABEL,
  CASH_CUSTODY_OPERATOR_ROLES,
  CashBankDayHeader,
  CashCountRecord,
  CashCustody,
  CashBankDaySummary,
  CashDateSummary,
  CashMovement,
  CashMovementFilters,
  CashMovementType,
  CashPosition,
  ManualCashMovementType,
  formatCurrency,
} from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { CashControlService } from '../../../core/services/cash-control.service';
import { CashCustodyService } from '../../../core/services/cash-custody.service';
import { onCashChanged } from '../../../core/services/cash-control-sync.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { refetchOnTabVisible } from '../../../core/utils/refetch-on-tab-visible';
import { ButtonComponent, CardComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { ReportPaginationComponent } from '../reports/components/report-pagination/report-pagination.component';
import {
  bucketAmount,
  buildSummaryCards,
  canManageCuts,
  formatDifference,
  formatGuatemalaDateTime,
  formatGuatemalaTime,
  formatIsoDate,
  guatemalaToday,
  isManualMovement,
  referenceLabel,
} from './cash-control.util';
import { CashMovementFormModalComponent } from './components/cash-movement-form-modal/cash-movement-form-modal.component';
import { CashBankDepositModalComponent } from './components/cash-bank-deposit-modal/cash-bank-deposit-modal.component';
import { CashCutControlPanelComponent } from './components/cut-control-panel/cut-control-panel.component';
import { CashCutHistoryComponent } from './components/cut-history/cut-history.component';
import { CashReasonModalComponent } from './components/reason-modal/reason-modal.component';
import { CashCountModalComponent } from './components/cash-count-modal/cash-count-modal.component';
import { WarehouseTransferModalComponent } from './components/warehouse-transfer-modal/warehouse-transfer-modal.component';
import { CashCountsPanelComponent } from './components/cash-counts-panel/cash-counts-panel.component';
import { WarehousePanelComponent } from './components/warehouse-panel/warehouse-panel.component';
import { WarehouseWithdrawalModalComponent } from './components/warehouse-withdrawal-modal/warehouse-withdrawal-modal.component';
import { CashBankDayCardComponent } from './components/bank-day-card/bank-day-card.component';
import { CashBankDayHistoryComponent } from './components/bank-day-history/bank-day-history.component';

type CashTab = 'efectivo' | 'cortes' | 'historial' | 'arqueos' | 'bodega';

const EMPTY_FILTERS = { dateFrom: '', dateTo: '', movementType: '', direction: '', userId: '' } as const;

/**
 * Finance → Control de Efectivo. Shows the official physical cash (backend
 * Kardex), today's totals by operation type, the Kardex itself with
 * filters, the two daily cuts and their history. It updates in real time
 * through `onCashChanged` (writes in this tab, other tabs, and polling for
 * other users) and never computes a balance on its own.
 */
@Component({
  selector: 'app-cash-control-page',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    CardComponent,
    IconComponent,
    PageHeaderComponent,
    ReportPaginationComponent,
    CashMovementFormModalComponent,
    CashBankDepositModalComponent,
    CashCutControlPanelComponent,
    CashCutHistoryComponent,
    CashReasonModalComponent,
    CashCountModalComponent,
    WarehouseTransferModalComponent,
    CashCountsPanelComponent,
    WarehousePanelComponent,
    WarehouseWithdrawalModalComponent,
    CashBankDayCardComponent,
    CashBankDayHistoryComponent,
  ],
  templateUrl: './cash-control-page.component.html',
  styleUrl: './cash-control-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashControlPageComponent {
  private readonly service = inject(CashControlService);
  private readonly custodyService = inject(CashCustodyService);
  private readonly authService = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly typeLabel = CASH_MOVEMENT_TYPE_LABEL;
  readonly directionLabel = CASH_DIRECTION_LABEL;
  readonly formatCurrency = formatCurrency;
  readonly formatDifference = formatDifference;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly formatTime = formatGuatemalaTime;
  readonly formatIsoDate = formatIsoDate;
  readonly referenceLabel = referenceLabel;
  readonly isManualMovement = isManualMovement;
  readonly movementTypes = Object.keys(CASH_MOVEMENT_TYPE_LABEL) as CashMovementType[];
  readonly pageSize = 25;

  readonly tab = signal<CashTab>(this.initialTab());
  readonly isAdmin = this.authService.isAdmin;
  readonly canManage = computed(() => canManageCuts(this.authService.currentUser()?.role));
  /** Arqueos y Bodega (UX only — the backend re-checks every permission). */
  readonly canCustody = computed(() => CASH_CUSTODY_OPERATOR_ROLES.includes(this.authService.currentUser()?.role ?? ''));

  /** Caja / Bodega / total under custody (backend). */
  readonly custody = signal<CashCustody | null>(null);
  readonly countOpen = signal(false);
  readonly countCorrection = signal<CashCountRecord | null>(null);
  readonly transferOpen = signal(false);
  readonly withdrawalOpen = signal(false);
  /** Bumped after a count/transfer so the history panels reload. */
  readonly custodyRefresh = signal(0);

  readonly position = signal<CashPosition | null>(null);
  readonly loadingPosition = signal(true);
  readonly positionFailed = signal(false);
  /** Bank operational days (newest first) with their own indicators — selector and history table. */
  readonly bankDays = signal<CashBankDaySummary[]>([]);
  /** Bank day chosen in the selector; `null` = the current one (live, from the position). */
  readonly selectedBankDate = signal<string | null>(null);
  /** The past bank day being consulted (read only), loaded from the backend. */
  readonly pastDay = signal<CashBankDaySummary | null>(null);
  readonly bucketAmount = bucketAmount;

  /** Indicators on screen: the consulted past day, or the current bank day from the position. */
  readonly viewedDay = computed<{ header: CashBankDayHeader | null; summary: CashDateSummary; isPast: boolean } | null>(() => {
    const past = this.pastDay();
    if (this.selectedBankDate() && past && past.businessDate === this.selectedBankDate()) {
      return { header: past, summary: past, isPast: true };
    }
    const position = this.position();
    return position ? { header: position.bankDay, summary: position.summary, isPast: false } : null;
  });

  readonly summaryCards = computed(() => buildSummaryCards(this.viewedDay()?.summary.buckets ?? []));
  /** Until the user touches the Kardex filters, the Kardex follows the bank day on screen. */
  private filtersTouched = false;

  readonly movements = signal<CashMovement[]>([]);
  readonly totalMovements = signal(0);
  readonly pageTotals = signal({ totalIn: 0, totalOut: 0 });
  readonly page = signal(1);
  readonly loadingMovements = signal(true);
  readonly movementsFailed = signal(false);
  readonly users = signal<{ id: string; username: string }[]>([]);

  readonly draft = signal<CashMovementFilters>({ ...EMPTY_FILTERS, dateFrom: guatemalaToday(), dateTo: guatemalaToday() });
  private applied: CashMovementFilters = { ...this.draft() };
  readonly hasFilters = computed(() => Object.values(this.draft()).some((value) => value !== '' && value !== undefined));

  readonly formMode = signal<ManualCashMovementType | null>(null);
  /** "Depósito bancario" modal (cash → registered account, with breakdown). */
  readonly depositOpen = signal(false);
  /** Movement whose denomination breakdown is being shown (loaded from the backend). */
  readonly breakdown = signal<CashMovement | null>(null);
  readonly loadingBreakdown = signal(false);
  readonly voidTarget = signal<CashMovement | null>(null);
  readonly voiding = signal(false);
  readonly lastRefresh = signal<string | null>(null);

  constructor() {
    this.service
      .getUsers()
      .pipe(catchError(() => of([])))
      .subscribe((users) => this.users.set(users));
    this.refresh();
    refetchOnTabVisible(() => this.refresh());
    onCashChanged(() => this.refresh());
  }

  setTab(tab: CashTab): void {
    this.tab.set(tab);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { tab }, replaceUrl: true });
  }

  refresh(): void {
    this.loadPosition();
    this.loadMovements();
    this.loadBankDays();
    this.loadCustody();
  }

  loadCustody(): void {
    if (!this.canCustody()) {
      return;
    }
    this.custodyService
      .getCustody()
      .pipe(catchError(() => of(null)))
      .subscribe((custody) => custody && this.custody.set(custody));
  }

  openCount(correction: CashCountRecord | null = null): void {
    this.countCorrection.set(correction);
    this.countOpen.set(true);
    this.loadCustody();
  }

  onCountSaved(): void {
    this.custodyRefresh.update((value) => value + 1);
  }

  closeCount(): void {
    this.countOpen.set(false);
    this.countCorrection.set(null);
  }

  openTransfer(): void {
    this.loadCustody();
    this.transferOpen.set(true);
  }

  onTransferSaved(result: { custody: CashCustody }): void {
    this.transferOpen.set(false);
    this.custody.set(result.custody);
    this.custodyRefresh.update((value) => value + 1);
    this.refresh();
  }

  openWithdrawal(): void {
    this.loadCustody();
    this.withdrawalOpen.set(true);
  }

  onWithdrawalSaved(result: { custody: CashCustody }): void {
    this.withdrawalOpen.set(false);
    this.custody.set(result.custody);
    this.custodyRefresh.update((value) => value + 1);
    this.refresh();
  }

  onCustodyChanged(): void {
    this.custodyRefresh.update((value) => value + 1);
    this.refresh();
  }

  loadBankDays(): void {
    this.service
      .getBankDays(60)
      .pipe(catchError(() => of([])))
      .subscribe((days) => this.bankDays.set(days));
  }

  /**
   * Day selector: '' = current bank day (live); a date = that day's original
   * indicators (read only). The Kardex below switches to the same bank day.
   */
  selectBankDate(date: string): void {
    const current = this.position()?.bankDay?.businessDate ?? null;
    const target = date && date !== current ? date : null;
    this.selectedBankDate.set(target);
    this.pastDay.set(null);
    if (target) {
      this.service.getBankDay(target).subscribe({
        next: (day) => this.pastDay.set(day),
        error: (error: HttpErrorResponse) => {
          this.selectedBankDate.set(null);
          this.notifications.error(extractErrorMessage(error, 'No se pudo consultar ese día.'));
        },
      });
    }
    const kardexDay = target ?? current;
    if (kardexDay) {
      this.draft.set({ ...EMPTY_FILTERS, bankDate: kardexDay });
      this.applyFilters();
      this.filtersTouched = false;
    }
  }

  loadPosition(): void {
    if (!this.position()) {
      this.loadingPosition.set(true);
    }
    this.positionFailed.set(false);
    this.service.getPosition().subscribe({
      next: (position) => this.setPosition(position),
      error: () => {
        this.loadingPosition.set(false);
        this.positionFailed.set(true);
      },
    });
  }

  setPosition(position: CashPosition): void {
    const first = this.position() === null;
    this.position.set(position);
    this.loadingPosition.set(false);
    this.lastRefresh.set(new Date().toISOString());
    // The Kardex starts on the current bank day (from its opening), like the indicators.
    if (first && position.bankDay && !this.filtersTouched && !this.selectedBankDate()) {
      this.draft.set({ ...EMPTY_FILTERS, bankDate: position.bankDay.businessDate });
      this.applyFilters();
    }
  }

  loadMovements(): void {
    this.loadingMovements.set(this.movements().length === 0);
    this.movementsFailed.set(false);
    this.service.getMovements({ ...this.applied, page: this.page(), limit: this.pageSize }).subscribe({
      next: (result) => {
        this.movements.set(result.items);
        this.totalMovements.set(result.total);
        this.pageTotals.set({ totalIn: result.totalIn, totalOut: result.totalOut });
        this.loadingMovements.set(false);
      },
      error: () => {
        this.loadingMovements.set(false);
        this.movementsFailed.set(true);
      },
    });
  }

  setDraft(patch: Partial<CashMovementFilters>): void {
    this.filtersTouched = true;
    // A date filter replaces the bank-day filter (and vice versa).
    const dates = 'dateFrom' in patch || 'dateTo' in patch ? { bankDate: undefined } : {};
    this.draft.update((draft) => ({ ...draft, ...dates, ...patch }));
  }

  /** "Fecha" shortcut: a single day = same from/to. */
  setSingleDate(date: string): void {
    this.setDraft({ dateFrom: date, dateTo: date });
  }

  applyFilters(): void {
    this.applied = { ...this.draft() };
    this.page.set(1);
    this.loadMovements();
  }

  clearFilters(): void {
    this.draft.set({ ...EMPTY_FILTERS });
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.loadMovements();
  }

  signedLabel(movement: CashMovement): string {
    if (movement.movementType === 'ANULACION' && movement.originalMovementType) {
      return `Anulación · ${this.typeLabel[movement.originalMovementType]}`;
    }
    return this.typeLabel[movement.movementType];
  }

  onDepositSaved(): void {
    this.depositOpen.set(false);
    this.refresh();
  }

  showBreakdown(movement: CashMovement): void {
    this.loadingBreakdown.set(true);
    this.breakdown.set(movement);
    this.service.getMovement(movement.id).subscribe({
      next: (detail) => {
        this.breakdown.set(detail);
        this.loadingBreakdown.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loadingBreakdown.set(false);
        this.breakdown.set(null);
        this.notifications.error(extractErrorMessage(error, 'No se pudo cargar el desglose.'));
      },
    });
  }

  voidMessage(): string {
    if (this.voidTarget()?.movementType === 'DEVOLUCION_BODEGA') {
      return 'Se retirará el efectivo de la caja y volverá a Bodega (anulación de la transferencia interna). Ambos movimientos quedan visibles como anulados.';
    }
    if (this.voidTarget()?.movementType === 'ENTREGA_BODEGA') {
      return 'Se devolverá el efectivo a la caja y se retirará de Bodega (anulación de la transferencia interna). Ambos movimientos quedan visibles como anulados.';
    }
    return this.voidTarget()?.movementType === 'DEPOSITO_BANCARIO'
      ? 'Se devolverá el efectivo a la caja y se revertirá el depósito en la cuenta bancaria. Ambos movimientos quedan visibles como anulados.'
      : 'Se registrará el movimiento inverso; el original queda visible como anulado. No se elimina nada.';
  }

  onMovementSaved(): void {
    this.formMode.set(null);
    this.refresh();
  }

  voidMovement(reason: string): void {
    const target = this.voidTarget();
    if (!target) {
      return;
    }
    this.voiding.set(true);
    this.service.voidMovement(target.id, reason).subscribe({
      next: (result) => {
        this.voiding.set(false);
        this.voidTarget.set(null);
        this.notifications.success(`Movimiento anulado. Efectivo disponible: ${formatCurrency(result.balance)}.`);
        this.refresh();
      },
      error: (error: HttpErrorResponse) => {
        this.voiding.set(false);
        this.notifications.error(extractErrorMessage(error, 'No se pudo anular el movimiento.'));
      },
    });
  }

  private initialTab(): CashTab {
    const tab = this.route.snapshot.queryParamMap.get('tab') ?? (this.route.snapshot.data['tab'] as string | undefined);
    return tab === 'cortes' || tab === 'historial' || tab === 'arqueos' || tab === 'bodega' ? tab : 'efectivo';
  }
}
