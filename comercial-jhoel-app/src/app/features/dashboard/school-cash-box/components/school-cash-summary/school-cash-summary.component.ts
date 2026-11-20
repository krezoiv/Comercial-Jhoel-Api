import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  SCHOOL_CASH_MOVEMENT_ICON,
  SCHOOL_CASH_MOVEMENT_LABEL,
  SCHOOL_CASH_PENDING_ALERT_DAYS,
  SchoolCashGranularity,
  SchoolCashSummary,
  SchoolCustomerView,
  daysSince,
  formatCurrency,
} from '../../../../../core/models';
import { IconComponent } from '../../../../../shared/ui';
import { formatGuatemalaDateTime, formatIsoDate, guatemalaToday, monthStart, signedMoney } from '../../school-cash.util';
import type { SchoolCashPeriod, SchoolCashTab } from '../../school-cash-box-page.component';
import { SchoolCashChartsComponent } from '../school-cash-charts/school-cash-charts.component';

interface Kpi {
  tone: string;
  icon: string;
  label: string;
  value: string;
  hint: string;
  /** Clickable card: opens the customers tab with this filter. */
  view?: SchoolCustomerView;
  tab?: SchoolCashTab;
}

interface Alert {
  tone: 'pending' | 'short' | 'neutral';
  icon: string;
  text: string;
  action?: { label: string; tab?: SchoolCashTab; count?: boolean; view?: SchoolCustomerView };
}

type PeriodPreset = 'ALL' | 'MONTH' | 'LAST30' | 'CUSTOM';

function shiftDays(day: string, days: number): string {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Dashboard of the Caja de Listas: what was sold, what customers paid, what
 * they still owe, the cash in the caja and the money still in banks — each
 * from its own backend source, never added twice (a bank → caja transfer is
 * not a new payment). Flow figures follow the selected period; balances are
 * always "as of now". Cards about customers open the "Clientes" tab.
 */
@Component({
  selector: 'app-school-cash-summary',
  standalone: true,
  imports: [FormsModule, IconComponent, SchoolCashChartsComponent],
  templateUrl: './school-cash-summary.component.html',
  styleUrl: './school-cash-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCashSummaryComponent {
  private readonly data = signal<SchoolCashSummary | null>(null);
  private readonly current = signal<SchoolCashPeriod>({ granularity: 'day' });
  @Input() set summary(value: SchoolCashSummary | null) {
    this.data.set(value);
  }
  @Input() set period(value: SchoolCashPeriod) {
    this.current.set(value);
  }
  @Input() loading = false;
  @Output() periodChange = new EventEmitter<SchoolCashPeriod>();
  @Output() goTo = new EventEmitter<SchoolCashTab>();
  @Output() customers = new EventEmitter<SchoolCustomerView>();
  @Output() count = new EventEmitter<void>();

  readonly s = this.data.asReadonly();
  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly movementLabel = SCHOOL_CASH_MOVEMENT_LABEL;
  readonly movementIcon = SCHOOL_CASH_MOVEMENT_ICON;
  readonly signed = (value: number) => signedMoney(value, formatCurrency);
  readonly skeleton = [1, 2, 3, 4, 5, 6];

  readonly customFrom = signal('');
  readonly customTo = signal('');
  readonly preset = computed<PeriodPreset>(() => {
    const p = this.current();
    const today = guatemalaToday();
    if (!p.dateFrom && !p.dateTo) {
      return 'ALL';
    }
    if (p.dateFrom === monthStart(today) && p.dateTo === today) {
      return 'MONTH';
    }
    if (p.dateFrom === shiftDays(today, -29) && p.dateTo === today) {
      return 'LAST30';
    }
    return 'CUSTOM';
  });
  readonly periodLabel = computed(() => {
    const p = this.current();
    if (!p.dateFrom && !p.dateTo) {
      return 'Toda la temporada';
    }
    return `${p.dateFrom ? formatIsoDate(p.dateFrom) : 'inicio'} al ${p.dateTo ? formatIsoDate(p.dateTo) : 'hoy'}`;
  });
  readonly showCustom = signal(false);

  readonly primary = computed<Kpi[]>(() => {
    const s = this.s();
    if (!s) {
      return [];
    }
    return [
      { tone: 'sales', icon: 'receipt', label: 'Total vendido', value: formatCurrency(s.sales.total), hint: `${s.sales.count} lista(s) vendida(s) · no es dinero recibido` },
      {
        tone: 'collected',
        icon: 'trending-up',
        label: 'Total abonado / recaudado',
        value: formatCurrency(s.collected.total),
        hint: `Pagos reales de clientes${s.collected.refunds ? ` · devoluciones ${formatCurrency(s.collected.refunds)}` : ''}`,
      },
      {
        tone: 'owed',
        icon: 'alert-circle',
        label: 'Pendiente de cobro',
        value: formatCurrency(s.customersBalance),
        hint: `${s.customersWithBalance} lista(s) con saldo · a hoy`,
        view: 'WITH_BALANCE',
      },
      { tone: 'cash', icon: 'wallet', label: 'Efectivo disponible en caja', value: formatCurrency(s.cashBalance), hint: 'Saldo teórico del Kardex · a hoy' },
      {
        tone: 'pending',
        icon: 'bank',
        label: 'En bancos por trasladar',
        value: formatCurrency(s.pendingTransfer),
        hint: s.pendingByBank.length ? s.pendingByBank.map((b) => `${b.bankName} ${formatCurrency(b.pending)}`).join(' · ') : 'Nada pendiente en bancos',
        tab: 'traslados',
      },
      {
        tone: 'owed',
        icon: 'users',
        label: 'Clientes con saldo pendiente',
        value: String(s.customers.withBalance),
        hint: `${s.customers.notPaying} sin ningún abono · ver lista`,
        view: 'WITH_BALANCE',
      },
    ];
  });

  readonly secondary = computed<Kpi[]>(() => {
    const s = this.s();
    if (!s) {
      return [];
    }
    const p = s.portfolio;
    return [
      { tone: 'moved', icon: 'arrow-down-circle', label: 'Trasladado de bancos', value: formatCurrency(s.transferredTotal), hint: `${s.transfersCount} traslado(s) · movimiento interno`, tab: 'traslados' },
      { tone: 'cash', icon: 'check-check', label: 'Clientes solventes', value: String(s.customers.solvent), hint: `${s.customers.total} cliente(s) en total`, view: 'SOLVENT' },
      {
        tone: 'neutral',
        icon: 'graduation-cap',
        label: 'Total de listas',
        value: String(p.lists),
        hint: `${p.paid} pagadas · ${p.partial} parciales · ${p.pending} sin pagos · ${p.cancelled} canceladas`,
      },
      { tone: 'bank', icon: 'receipt', label: 'Abonos recibidos', value: formatCurrency(s.collected.installments), hint: `Pagos iniciales ${formatCurrency(s.collected.advances)}` },
    ];
  });

  readonly alerts = computed<Alert[]>(() => {
    const s = this.s();
    if (!s) {
      return [];
    }
    const alerts: Alert[] = [];
    const age = daysSince(s.oldestPendingAt);
    if (s.pendingReceipts > 0) {
      alerts.push({
        tone: 'pending',
        icon: 'bank',
        text:
          age >= SCHOOL_CASH_PENDING_ALERT_DAYS
            ? `Hay ${formatCurrency(s.pendingTransfer)} en bancos por trasladar; el pago más antiguo espera hace ${age} día(s).`
            : `Hay ${formatCurrency(s.pendingTransfer)} de listas en bancos pendientes de trasladar.`,
        action: { label: 'Ver pendientes', tab: 'traslados' },
      });
    }
    if (s.customers.notPaying > 0) {
      alerts.push({
        tone: 'neutral',
        icon: 'users',
        text: `${s.customers.notPaying} cliente(s) no han hecho ningún abono.`,
        action: { label: 'Ver clientes', view: 'NO_PAYMENTS' },
      });
    }
    const last = s.lastCount;
    if (last && last.difference !== 0) {
      alerts.push({
        tone: 'short',
        icon: 'alert-triangle',
        text: `El último arqueo (${last.countNumber}) tuvo ${last.difference < 0 ? 'un faltante' : 'un sobrante'} de ${formatCurrency(Math.abs(last.difference))}.`,
        action: { label: 'Ver arqueos', tab: 'arqueos' },
      });
    }
    if (s.cashBalance > 0 && (!last || last.businessDate !== guatemalaToday())) {
      alerts.push({
        tone: 'neutral',
        icon: 'file-check',
        text: last ? `El último arqueo fue el ${formatIsoDate(last.businessDate)}.` : 'Todavía no hay arqueos de esta caja.',
        action: { label: 'Hacer arqueo', count: true },
      });
    }
    return alerts;
  });

  choose(preset: PeriodPreset): void {
    const today = guatemalaToday();
    const granularity = this.current().granularity;
    if (preset === 'CUSTOM') {
      this.customFrom.set(this.current().dateFrom ?? monthStart(today));
      this.customTo.set(this.current().dateTo ?? today);
      this.showCustom.set(true);
      return;
    }
    this.showCustom.set(false);
    const range =
      preset === 'MONTH'
        ? { dateFrom: monthStart(today), dateTo: today }
        : preset === 'LAST30'
          ? { dateFrom: shiftDays(today, -29), dateTo: today }
          : {};
    this.periodChange.emit({ ...range, granularity });
  }

  applyCustom(): void {
    const from = this.customFrom();
    const to = this.customTo();
    if (from && to && from > to) {
      return;
    }
    this.showCustom.set(false);
    this.periodChange.emit({ dateFrom: from || undefined, dateTo: to || undefined, granularity: this.current().granularity });
  }

  setGranularity(granularity: SchoolCashGranularity): void {
    this.periodChange.emit({ ...this.current(), granularity });
  }

  open(kpi: Kpi): void {
    if (kpi.view) {
      this.customers.emit(kpi.view);
    } else if (kpi.tab) {
      this.goTo.emit(kpi.tab);
    }
  }

  act(alert: Alert): void {
    if (alert.action?.count) {
      this.count.emit();
    } else if (alert.action?.view) {
      this.customers.emit(alert.action.view);
    } else if (alert.action?.tab) {
      this.goTo.emit(alert.action.tab);
    }
  }
}
