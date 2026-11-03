import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  GUAYACAN_FILTER_MOVEMENT_TYPES,
  GUAYACAN_MOVEMENT_TYPE_LABEL,
  GuayacanCashBoxSummary,
  GuayacanCommission,
  GuayacanCashMovement,
  GuayacanCashMovementDetail,
  GuayacanCashMovementType,
  GuayacanPeriodSummary,
  formatCurrency,
  formatQuantity,
} from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { GuayacanCashBoxService } from '../../../core/services/guayacan-cash-box.service';
import { NotificationService } from '../../../core/services/notification.service';
import { refetchOnTabVisible } from '../../../core/utils/refetch-on-tab-visible';
import { ButtonComponent, CardComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { ReportPaginationComponent } from '../reports/components/report-pagination/report-pagination.component';
import { GuayacanCashCountPanelComponent } from './components/cash-count-panel/cash-count-panel.component';
import { GuayacanMovementDetailModalComponent } from './components/movement-detail-modal/movement-detail-modal.component';
import {
  GuayacanMovementFormMode,
  GuayacanMovementFormModalComponent,
} from './components/movement-form-modal/movement-form-modal.component';
import { formatGuatemalaDateTime, formatIsoDate } from './guayacan-cash.util';

type Period = 'daily' | 'weekly' | 'monthly';

const PAGE_SIZE = 15;
const COMMISSIONS_PAGE_SIZE = 10;

const PERIOD_LABEL: Record<Period, string> = { daily: 'Hoy', weekly: 'Semana', monthly: 'Mes' };

/**
 * "Cuadre de Caja Guayacán" — Kardex propio de Cooperativa Guayacán,
 * independiente de Recargas, Caja de Ventas y saldos bancarios. Todo número
 * viene del backend (`GET /guayacan-cash-box/*`): saldo, períodos de
 * Guatemala (día / semana lunes–domingo / mes) y comisiones. Las comisiones
 * entran solas al registrar operaciones Guayacán en Transaccionar; aquí solo
 * se registran ingresos/egresos manuales, arqueos y (admin) ajustes y
 * anulaciones.
 */
@Component({
  selector: 'app-guayacan-cash-box-page',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    CardComponent,
    IconComponent,
    PageHeaderComponent,
    ReportPaginationComponent,
    GuayacanCashCountPanelComponent,
    GuayacanMovementFormModalComponent,
    GuayacanMovementDetailModalComponent,
  ],
  templateUrl: './guayacan-cash-box-page.component.html',
  styleUrl: './guayacan-cash-box-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuayacanCashBoxPageComponent {
  private readonly service = inject(GuayacanCashBoxService);
  private readonly notifications = inject(NotificationService);
  readonly isAdmin = inject(AuthService).isAdmin;

  formatCurrency = formatCurrency;
  formatQuantity = formatQuantity;
  formatIsoDate = formatIsoDate;
  formatDateTime = formatGuatemalaDateTime;
  typeLabel = GUAYACAN_MOVEMENT_TYPE_LABEL;
  periodLabel = PERIOD_LABEL;
  readonly periodOptions: Period[] = ['daily', 'weekly', 'monthly'];
  readonly Math = Math;
  readonly filterTypes = GUAYACAN_FILTER_MOVEMENT_TYPES;
  readonly pageSize = PAGE_SIZE;
  readonly commissionsPageSize = COMMISSIONS_PAGE_SIZE;

  readonly commissions = signal<GuayacanCommission[]>([]);
  readonly totalCommissions = signal(0);
  readonly commissionsPage = signal(1);
  readonly loadingCommissions = signal(true);
  readonly commissionsFailed = signal(false);

  readonly summary = signal<GuayacanCashBoxSummary | null>(null);
  readonly loadingSummary = signal(true);
  readonly summaryFailed = signal(false);
  /** Período de las tarjetas "Ingresos" / "Egresos de caja". */
  readonly cashPeriod = signal<Period>('daily');

  readonly movements = signal<GuayacanCashMovement[]>([]);
  readonly totalMovements = signal(0);
  readonly page = signal(1);
  readonly loadingMovements = signal(true);
  readonly movementsFailed = signal(false);

  // Filtros: borrador (lo que el formulario edita) / aplicado (lo que se consulta).
  readonly draftStartDate = signal('');
  readonly draftEndDate = signal('');
  readonly draftType = signal<GuayacanCashMovementType | ''>('');
  private readonly appliedFilters = signal<{ startDate: string; endDate: string; type: GuayacanCashMovementType | '' }>({
    startDate: '',
    endDate: '',
    type: '',
  });
  readonly hasFilters = computed(() => {
    const filters = this.appliedFilters();
    return filters.startDate !== '' || filters.endDate !== '' || filters.type !== '';
  });

  readonly formMode = signal<GuayacanMovementFormMode | null>(null);
  readonly suggestedAdjustment = signal<number | null>(null);
  readonly detailId = signal<string | null>(null);

  readonly balance = computed(() => this.summary()?.balance ?? 0);
  readonly commissionRate = computed(() => this.summary()?.agent?.commissionPerTransaction ?? null);
  readonly cashPeriodSummary = computed<GuayacanPeriodSummary | null>(() => this.summary()?.[this.cashPeriod()] ?? null);
  readonly periods = computed(() => {
    const summary = this.summary();
    return summary
      ? ([
          { key: 'daily', title: 'Resumen diario', data: summary.daily },
          { key: 'weekly', title: 'Resumen semanal', data: summary.weekly },
          { key: 'monthly', title: 'Resumen mensual', data: summary.monthly },
        ] as const)
      : [];
  });

  constructor() {
    this.loadSummary();
    this.loadMovements();
    this.loadCommissions();
    // Las operaciones de Transaccionar mueven esta caja: al volver a la pestaña se relee todo del backend.
    refetchOnTabVisible(() => {
      this.loadSummary();
      this.loadMovements();
      this.loadCommissions();
    });
  }

  loadCommissions(): void {
    this.commissionsFailed.set(false);
    this.service.getCommissions({ page: this.commissionsPage(), limit: COMMISSIONS_PAGE_SIZE }).subscribe({
      next: (result) => {
        this.commissions.set(result.items);
        this.totalCommissions.set(result.total);
        this.loadingCommissions.set(false);
      },
      error: () => {
        this.loadingCommissions.set(false);
        this.commissionsFailed.set(true);
      },
    });
  }

  onCommissionsPageChange(page: number): void {
    this.commissionsPage.set(page);
    this.loadCommissions();
  }

  loadSummary(): void {
    this.summaryFailed.set(false);
    this.service.getSummary().subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.loadingSummary.set(false);
      },
      error: () => {
        this.loadingSummary.set(false);
        this.summaryFailed.set(true);
      },
    });
  }

  loadMovements(): void {
    const filters = this.appliedFilters();
    this.movementsFailed.set(false);
    if (this.movements().length === 0) {
      this.loadingMovements.set(true);
    }
    this.service
      .getMovements({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        movementType: filters.type || undefined,
        page: this.page(),
        limit: PAGE_SIZE,
      })
      .subscribe({
        next: (result) => {
          this.movements.set(result.items);
          this.totalMovements.set(result.total);
          this.loadingMovements.set(false);
        },
        error: () => {
          this.loadingMovements.set(false);
          this.movementsFailed.set(true);
        },
      });
  }

  applyFilters(): void {
    if (this.draftStartDate() && this.draftEndDate() && this.draftStartDate() > this.draftEndDate()) {
      this.notifications.error('La fecha inicial no puede ser mayor que la final.');
      return;
    }
    this.appliedFilters.set({ startDate: this.draftStartDate(), endDate: this.draftEndDate(), type: this.draftType() });
    this.page.set(1);
    this.loadMovements();
  }

  clearFilters(): void {
    this.draftStartDate.set('');
    this.draftEndDate.set('');
    this.draftType.set('');
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.loadMovements();
  }

  openForm(mode: GuayacanMovementFormMode, suggested: number | null = null): void {
    this.suggestedAdjustment.set(suggested);
    this.formMode.set(mode);
  }

  onSaved(movement: GuayacanCashMovementDetail): void {
    this.formMode.set(null);
    this.notifications.success(`${this.typeLabel[movement.movementType]} registrado. Saldo de caja: ${formatCurrency(movement.balanceAfter)}.`);
    this.refreshAfterChange();
  }

  onDetailChanged(): void {
    this.notifications.success('Movimiento anulado. Se registró el movimiento inverso.');
    this.refreshAfterChange();
  }

  /** Tras cualquier escritura: saldo e indicadores del backend, y el Kardex desde la primera página. */
  private refreshAfterChange(): void {
    this.loadSummary();
    this.page.set(1);
    this.loadMovements();
  }

  isIncome(movement: GuayacanCashMovement): boolean {
    return movement.amount > 0;
  }
}
