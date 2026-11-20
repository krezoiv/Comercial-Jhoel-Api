import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';

import { SchoolCashGranularity, SchoolCashSummary, formatCurrency } from '../../../../../core/models';
import { IconComponent } from '../../../../../shared/ui';
import { formatIsoDate } from '../../school-cash.util';

interface Bar {
  label: string;
  value: number;
  color: string;
  /** 0–100 width relative to the largest bar. */
  width: number;
  note?: string;
}

const COLOR = {
  sales: '#7c3aed',
  collected: '#4f46e5',
  owed: '#e11d48',
  cash: '#16a34a',
  transfer: '#0284c7',
  deposit: '#0369a1',
  other: '#94a3b8',
  partial: '#d97706',
};

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const CHART_H = 150;

function bars(items: Omit<Bar, 'width'>[]): Bar[] {
  const max = Math.max(1, ...items.map((i) => i.value));
  return items.map((item) => ({ ...item, width: Math.max(item.value > 0 ? 1.5 : 0, (item.value / max) * 100) }));
}

/**
 * The four charts of the Caja de Listas dashboard, drawn from the backend
 * summary (no chart library, no figure computed here): sales vs. collected vs.
 * owed, collected money by payment method, the evolution of payments
 * (day/week/month) and the state of the portfolio (lists paid / partial /
 * without payments).
 */
@Component({
  selector: 'app-school-cash-charts',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './school-cash-charts.component.html',
  styleUrl: './school-cash-charts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCashChartsComponent {
  private readonly data = signal<SchoolCashSummary | null>(null);
  @Input({ required: true }) set summary(value: SchoolCashSummary) {
    this.data.set(value);
  }
  @Output() granularity = new EventEmitter<SchoolCashGranularity>();

  readonly s = this.data.asReadonly();
  readonly formatCurrency = formatCurrency;
  readonly colors = COLOR;
  readonly units: { id: SchoolCashGranularity; label: string }[] = [
    { id: 'day', label: 'Día' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mes' },
  ];

  readonly salesVsCollected = computed<Bar[]>(() => {
    const s = this.s();
    return s
      ? bars([
          { label: 'Total vendido', value: s.sales.total, color: COLOR.sales },
          { label: 'Total abonado', value: s.collected.total, color: COLOR.collected },
          { label: 'Pendiente de cobro', value: s.customersBalance, color: COLOR.owed, note: 'a hoy' },
        ])
      : [];
  });

  readonly byMethod = computed<Bar[]>(() => {
    const s = this.s();
    if (!s) {
      return [];
    }
    const c = s.collected;
    const received = c.cash + c.transfer + c.deposit + c.other;
    const share = (value: number) => (received > 0 ? `${((value / received) * 100).toFixed(1)} %` : '0 %');
    return bars([
      { label: 'Efectivo', value: c.cash, color: COLOR.cash, note: share(c.cash) },
      { label: 'Transferencias', value: c.transfer, color: COLOR.transfer, note: share(c.transfer) },
      { label: 'Depósitos', value: c.deposit, color: COLOR.deposit, note: share(c.deposit) },
      { label: 'Tarjeta y otros', value: c.other, color: COLOR.other, note: share(c.other) },
    ]);
  });

  readonly evolution = computed(() => {
    const s = this.s();
    const series = s?.series ?? [];
    const unit = s?.period.granularity ?? 'day';
    const max = Math.max(1, ...series.map((p) => p.total));
    const step = series.length ? Math.max(1, Math.round(series.length / 7)) : 1;
    const width = 100 / Math.max(series.length, 1);
    const label = (start: string) => {
      const [y, m, d] = start.split('-');
      return unit === 'month' ? `${MONTHS[Number(m) - 1]} ${y.slice(2)}` : `${d}/${m}`;
    };
    return {
      unit,
      total: series.reduce((sum, p) => sum + p.total, 0),
      items: series.map((p, i) => ({
        start: p.start,
        height: (p.total / max) * CHART_H,
        cash: p.total ? (p.cash / p.total) * 100 : 0,
        bank: p.total ? (p.bank / p.total) * 100 : 0,
        other: p.total ? (p.other / p.total) * 100 : 0,
        width,
        // Every `step` buckets plus the last one, never two labels side by side.
        tick:
          i === series.length - 1 || (i % step === 0 && series.length - 1 - i >= Math.ceil(step / 2))
            ? label(p.start)
            : '',
        title: `${unit === 'week' ? 'Semana del ' : ''}${unit === 'month' ? label(p.start) : formatIsoDate(p.start)}: ${formatCurrency(p.total)} (efectivo ${formatCurrency(p.cash)}, bancos ${formatCurrency(p.bank)}, otros ${formatCurrency(p.other)})`,
      })),
    };
  });

  readonly portfolio = computed(() => {
    const p = this.s()?.portfolio;
    if (!p) {
      return null;
    }
    const active = p.paid + p.partial + p.pending;
    const pct = (n: number) => (active > 0 ? (n / active) * 100 : 0);
    return {
      active,
      cancelled: p.cancelled,
      segments: [
        { label: 'Pagadas', count: p.paid, pct: pct(p.paid), color: COLOR.cash, amount: p.paidAmount, amountLabel: 'cobrado' },
        { label: 'Parcialmente pagadas', count: p.partial, pct: pct(p.partial), color: COLOR.partial, amount: p.partialBalance, amountLabel: 'por cobrar' },
        { label: 'Sin pagos', count: p.pending, pct: pct(p.pending), color: COLOR.owed, amount: p.pendingBalance, amountLabel: 'por cobrar' },
      ],
    };
  });
}
