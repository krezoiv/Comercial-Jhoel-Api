import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  CASH_MOVEMENT_TYPE_LABEL,
  CashStatement,
  CashStatementDay,
  CashStatementLocation,
  CashStatementQuery,
  CashStatementRow,
  WAREHOUSE_STATEMENT_TYPE_LABEL,
} from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { onCashChanged } from '../../../../../core/services/cash-control-sync.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { downloadBlob } from '../../../../../core/utils/download-blob';
import { extractBlobErrorMessage } from '../../../../../core/utils/extract-blob-error-message';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { ReportPaginationComponent } from '../../../reports/components/report-pagination/report-pagination.component';
import { guatemalaToday } from '../../cash-control.util';
import { statementPeriodLabel } from '../../cash-statement.util';
import { CashStatementCardsComponent } from '../cash-statement-cards/cash-statement-cards.component';
import { CashStatementControlsComponent } from '../cash-statement-controls/cash-statement-controls.component';
import { CashStatementDetailModalComponent } from '../cash-statement-detail-modal/cash-statement-detail-modal.component';
import { CashStatementTableComponent } from '../cash-statement-table/cash-statement-table.component';
import { WarehouseAuditModalComponent } from '../warehouse-audit-modal/warehouse-audit-modal.component';

type PeriodMode = 'DAY' | 'DATE' | 'RANGE';

/**
 * "Estado de Cuenta de Efectivo" tab of Control de Efectivo: like a bank
 * statement for the physical cash of Caja (or Bodega, for custody viewers).
 * Period = a bank day (default: the current one), a date or a range; every
 * figure — opening, entries, exits, theoretical balance, running balance,
 * physical count and difference — comes from the backend
 * (`GET /cash-control/statement`). It refreshes itself through the existing
 * cash sync (`onCashChanged`): writes in this tab, other tabs and polling.
 */
@Component({
  selector: 'app-cash-statement-panel',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    IconComponent,
    ReportPaginationComponent,
    CashStatementCardsComponent,
    CashStatementTableComponent,
    CashStatementControlsComponent,
    CashStatementDetailModalComponent,
    WarehouseAuditModalComponent,
  ],
  templateUrl: './cash-statement-panel.component.html',
  styleUrl: './cash-statement-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashStatementPanelComponent implements OnChanges {
  /** Arqueos, Bodega and custody (UX only — the backend strips them anyway). */
  @Input() canCustody = false;
  @Input() users: { id: string; username: string }[] = [];
  /** Live Bodega balance (the Arqueo de Bodega compares against it now, not against a past period). */
  @Input() warehouseBalance = 0;
  /** Bumped by the page after a count or a transfer. */
  @Input() refreshKey = 0;
  /** Opens the page's Arqueo de Caja. */
  @Output() countCaja = new EventEmitter<void>();
  /** Opens the page's Arqueo de apertura (pending on the current bank day). */
  @Output() countOpening = new EventEmitter<void>();

  private readonly service = inject(CashControlService);
  private readonly notifications = inject(NotificationService);
  private readonly search$ = new Subject<void>();
  private request: Subscription | null = null;

  readonly pageSize = 50;
  readonly today = guatemalaToday();
  readonly location = signal<CashStatementLocation>('CAJA');
  readonly mode = signal<PeriodMode>('DAY');
  /** '' = the current bank day. */
  readonly bankDate = signal('');
  readonly date = signal(guatemalaToday());
  readonly dateFrom = signal(guatemalaToday());
  readonly dateTo = signal(guatemalaToday());
  readonly direction = signal<'' | 'IN' | 'OUT'>('');
  readonly movementType = signal('');
  readonly userId = signal('');
  readonly search = signal('');
  readonly page = signal(1);

  readonly statement = signal<CashStatement | null>(null);
  readonly days = signal<CashStatementDay[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly exporting = signal<'pdf' | 'xlsx' | null>(null);
  readonly detail = signal<CashStatementRow | null>(null);
  readonly auditOpen = signal(false);

  readonly periodLabel = computed(() => {
    const st = this.statement();
    return st ? statementPeriodLabel(st.period) : '';
  });
  readonly filtered = computed(() => !!(this.direction() || this.movementType() || this.userId() || this.search().trim()));
  readonly typeOptions = computed(() =>
    Object.entries(this.location() === 'BODEGA' ? WAREHOUSE_STATEMENT_TYPE_LABEL : CASH_MOVEMENT_TYPE_LABEL).map(
      ([value, label]) => ({ value, label }),
    ),
  );

  constructor() {
    this.search$.pipe(debounceTime(300), takeUntilDestroyed()).subscribe(() => this.reload(true));
    inject(DestroyRef).onDestroy(() => this.request?.unsubscribe());
    // Live: refresh while the statement shows the open period (history never changes).
    onCashChanged(() => {
      if (!this.statement() || this.statement()!.period.isCurrent) {
        this.reload();
      }
    });
    this.loadDays();
  }

  ngOnChanges(): void {
    this.reload();
  }

  query(): CashStatementQuery {
    const period =
      this.mode() === 'DAY'
        ? { bankDate: this.bankDate() || undefined }
        : this.mode() === 'DATE'
          ? { dateFrom: this.date(), dateTo: this.date() }
          : { dateFrom: this.dateFrom(), dateTo: this.dateTo() };
    return {
      location: this.location(),
      ...period,
      direction: this.direction() || undefined,
      movementType: this.movementType() || undefined,
      userId: this.userId() || undefined,
      search: this.search().trim() || undefined,
      page: this.page(),
      limit: this.pageSize,
    };
  }

  reload(resetPage = false): void {
    if (resetPage) {
      this.page.set(1);
    }
    this.loading.set(true);
    this.request?.unsubscribe();
    this.request = this.service.getStatement(this.query()).subscribe({
      next: (statement) => {
        this.statement.set(statement);
        this.error.set(null);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(extractErrorMessage(error, 'No se pudo cargar el estado de cuenta.'));
      },
    });
  }

  loadDays(): void {
    this.service.getStatementDays(30).subscribe({
      next: (days) => this.days.set(days),
      error: () => this.days.set([]),
    });
  }

  setLocation(location: CashStatementLocation): void {
    if (this.location() === location) return;
    this.location.set(location);
    this.movementType.set('');
    this.reload(true);
  }

  setMode(mode: PeriodMode): void {
    this.mode.set(mode);
    this.reload(true);
  }

  selectDay(date: string): void {
    this.mode.set('DAY');
    this.bankDate.set(date);
    this.reload(true);
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.search$.next();
  }

  clearFilters(): void {
    this.direction.set('');
    this.movementType.set('');
    this.userId.set('');
    this.search.set('');
    this.reload(true);
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.reload();
  }

  onAuditSaved(): void {
    this.auditOpen.set(false);
    this.reload();
  }

  export(format: 'pdf' | 'xlsx'): void {
    const st = this.statement();
    if (!st || this.exporting()) return;
    this.exporting.set(format);
    const suffix = st.period.businessDate ?? `${st.period.dateFrom}_${st.period.dateTo}`;
    this.service.exportStatement(this.query(), format).subscribe({
      next: (blob) => {
        this.exporting.set(null);
        downloadBlob(blob, `estado-cuenta-efectivo-${st.location.toLowerCase()}-${suffix}.${format}`);
      },
      error: async (error: HttpErrorResponse) => {
        this.exporting.set(null);
        this.notifications.error(await extractBlobErrorMessage(error, 'No se pudo exportar el estado de cuenta.'));
      },
    });
  }
}
