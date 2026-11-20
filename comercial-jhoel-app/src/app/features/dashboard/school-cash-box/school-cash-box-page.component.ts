import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SchoolCashGranularity, SchoolCashSummary, SchoolCustomerView, SchoolListPermission, formatCurrency } from '../../../core/models';
import { SchoolCashBoxService } from '../../../core/services/school-cash-box.service';
import { SchoolListService } from '../../../core/services/school-list.service';
import { IconComponent } from '../../../shared/ui';
import { SchoolCashSummaryComponent } from './components/school-cash-summary/school-cash-summary.component';
import { SchoolCashPendingComponent } from './components/school-cash-pending/school-cash-pending.component';
import { SchoolCashMovementsComponent } from './components/school-cash-movements/school-cash-movements.component';
import { SchoolCashCountsComponent } from './components/school-cash-counts/school-cash-counts.component';
import { SchoolCashExitsComponent } from './components/school-cash-exits/school-cash-exits.component';
import { SchoolCashReportsComponent } from './components/school-cash-reports/school-cash-reports.component';
import { SchoolCashCustomersComponent } from './components/school-cash-customers/school-cash-customers.component';
import { SchoolCashPaymentsComponent } from './components/school-cash-payments/school-cash-payments.component';
import { SchoolCashCountModalComponent } from './components/school-cash-count-modal/school-cash-count-modal.component';
import { SchoolCashExitModalComponent, ExitModalMode } from './components/school-cash-exit-modal/school-cash-exit-modal.component';

export type SchoolCashTab = 'resumen' | 'clientes' | 'pagos' | 'traslados' | 'movimientos' | 'arqueos' | 'salidas' | 'reportes';

/** Summary period chosen on the dashboard (empty = the whole season). */
export interface SchoolCashPeriod {
  dateFrom?: string;
  dateTo?: string;
  granularity: SchoolCashGranularity;
}

interface TabDef {
  id: SchoolCashTab;
  label: string;
  icon: string;
  permission: SchoolListPermission;
}

const TABS: TabDef[] = [
  { id: 'resumen', label: 'Resumen', icon: 'grid', permission: 'school_lists.cash.view' },
  { id: 'clientes', label: 'Clientes', icon: 'users', permission: 'school_lists.customers.view' },
  { id: 'pagos', label: 'Pagos', icon: 'receipt', permission: 'school_lists.cash.view' },
  { id: 'traslados', label: 'Traslados bancarios', icon: 'bank', permission: 'school_lists.cash.view' },
  { id: 'movimientos', label: 'Movimientos', icon: 'layers', permission: 'school_lists.cash.view' },
  { id: 'arqueos', label: 'Arqueos', icon: 'file-check', permission: 'school_lists.cash.view' },
  { id: 'salidas', label: 'Salidas y ajustes', icon: 'log-out', permission: 'school_lists.cash.view' },
  { id: 'reportes', label: 'Reportes', icon: 'bar-chart', permission: 'school_lists.cash.reports' },
];

/**
 * "Caja de Listas Escolares": the financial center of the school season.
 * Managers see the dashboard, the cash box and its operations; cashiers
 * (owner decision) only the "Clientes" tab with the account statements.
 * Every figure comes from the backend; this page only chooses what to ask.
 */
@Component({
  selector: 'app-school-cash-box-page',
  standalone: true,
  imports: [
    RouterLink,
    IconComponent,
    SchoolCashSummaryComponent,
    SchoolCashPendingComponent,
    SchoolCashMovementsComponent,
    SchoolCashCountsComponent,
    SchoolCashExitsComponent,
    SchoolCashReportsComponent,
    SchoolCashCustomersComponent,
    SchoolCashPaymentsComponent,
    SchoolCashCountModalComponent,
    SchoolCashExitModalComponent,
  ],
  templateUrl: './school-cash-box-page.component.html',
  styleUrl: './school-cash-box-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCashBoxPageComponent implements OnInit {
  readonly lists = inject(SchoolListService);
  private readonly cash = inject(SchoolCashBoxService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly formatCurrency = formatCurrency;
  readonly summary = signal<SchoolCashSummary | null>(null);
  readonly loadError = signal(false);
  readonly summaryError = signal(false);
  readonly loadingSummary = signal(false);
  readonly activeTab = signal<SchoolCashTab>('resumen');
  readonly period = signal<SchoolCashPeriod>({ granularity: 'day' });
  /** Filter the "Clientes" tab opens with (from a dashboard card). */
  readonly customerView = signal<SchoolCustomerView>('ALL');
  /** Bumped after every operation so the open tab reloads its data. */
  readonly refresh = signal(0);
  readonly countOpen = signal(false);
  readonly exitMode = signal<ExitModalMode | null>(null);

  readonly canCash = computed(() => this.lists.permissionsLoaded() && this.lists.can('school_lists.cash.view'));
  readonly tabs = computed(() => TABS.filter((tab) => this.lists.can(tab.permission)));
  readonly pendingBadge = computed(() => this.summary()?.pendingReceipts ?? 0);
  readonly hasAccess = computed(() => this.tabs().length > 0);

  ngOnInit(): void {
    const load = () => {
      const requested = this.route.snapshot.queryParamMap.get('tab');
      const alias = requested === 'pendientes' ? 'traslados' : requested;
      const allowed = this.tabs();
      const tab = allowed.find((t) => t.id === alias) ?? allowed[0];
      if (tab) {
        this.activeTab.set(tab.id);
      }
      const view = this.route.snapshot.queryParamMap.get('vista') as SchoolCustomerView | null;
      if (view) {
        this.customerView.set(view);
      }
      if (this.canCash()) {
        this.loadSummary();
      }
    };
    if (this.lists.permissionsLoaded()) {
      load();
    } else {
      this.lists.loadPermissions().subscribe({ next: load, error: () => this.loadError.set(true) });
    }
  }

  selectTab(tab: SchoolCashTab): void {
    this.activeTab.set(tab);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { tab }, replaceUrl: true });
  }

  openCustomers(view: SchoolCustomerView): void {
    this.customerView.set(view);
    this.selectTab('clientes');
  }

  setPeriod(period: SchoolCashPeriod): void {
    this.period.set(period);
    this.loadSummary();
  }

  loadSummary(): void {
    this.loadingSummary.set(true);
    const { dateFrom, dateTo, granularity } = this.period();
    this.cash.getSummary({ dateFrom, dateTo, granularity }).subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.summaryError.set(false);
        this.loadingSummary.set(false);
      },
      error: () => {
        this.summaryError.set(true);
        this.loadingSummary.set(false);
      },
    });
  }

  /** After any money operation: new summary + reload of the open tab. */
  changed(): void {
    if (this.canCash()) {
      this.loadSummary();
    }
    this.refresh.update((n) => n + 1);
  }

  openExit(mode: ExitModalMode): void {
    this.exitMode.set(mode);
  }
}
