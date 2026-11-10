import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

import {
  CASH_DIRECTION_LABEL,
  CASH_MOVEMENT_TYPE_LABEL,
  CashMovement,
  CashMovementFilters,
  CashMovementType,
  CashPosition,
  ManualCashMovementType,
  formatCurrency,
} from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { CashControlService } from '../../../core/services/cash-control.service';
import { onCashChanged } from '../../../core/services/cash-control-sync.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { refetchOnTabVisible } from '../../../core/utils/refetch-on-tab-visible';
import { ButtonComponent, CardComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { ReportPaginationComponent } from '../reports/components/report-pagination/report-pagination.component';
import {
  buildSummaryCards,
  canManageCuts,
  formatDifference,
  formatGuatemalaDateTime,
  formatGuatemalaTime,
  guatemalaToday,
  isManualMovement,
  referenceLabel,
} from './cash-control.util';
import { CashMovementFormModalComponent } from './components/cash-movement-form-modal/cash-movement-form-modal.component';
import { CashCutControlPanelComponent } from './components/cut-control-panel/cut-control-panel.component';
import { CashCutHistoryComponent } from './components/cut-history/cut-history.component';
import { CashReasonModalComponent } from './components/reason-modal/reason-modal.component';

type CashTab = 'efectivo' | 'cortes' | 'historial';

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
    CashCutControlPanelComponent,
    CashCutHistoryComponent,
    CashReasonModalComponent,
  ],
  templateUrl: './cash-control-page.component.html',
  styleUrl: './cash-control-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashControlPageComponent {
  private readonly service = inject(CashControlService);
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
  readonly referenceLabel = referenceLabel;
  readonly isManualMovement = isManualMovement;
  readonly movementTypes = Object.keys(CASH_MOVEMENT_TYPE_LABEL) as CashMovementType[];
  readonly pageSize = 25;

  readonly tab = signal<CashTab>(this.initialTab());
  readonly isAdmin = this.authService.isAdmin;
  readonly canManage = computed(() => canManageCuts(this.authService.currentUser()?.role));

  readonly position = signal<CashPosition | null>(null);
  readonly loadingPosition = signal(true);
  readonly positionFailed = signal(false);
  readonly summaryCards = computed(() => buildSummaryCards(this.position()?.summary.buckets ?? []));

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
    this.position.set(position);
    this.loadingPosition.set(false);
    this.lastRefresh.set(new Date().toISOString());
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
    this.draft.update((draft) => ({ ...draft, ...patch }));
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
    return tab === 'cortes' || tab === 'historial' ? tab : 'efectivo';
  }
}
