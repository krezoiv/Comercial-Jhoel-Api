import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BankDepositDailyStat } from '../../../core/models';
import { BankDepositService } from '../../../core/services/bank-deposit.service';
import { CardComponent } from '../card/card.component';
import { IconComponent } from '../icon/icon.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

/** Wide, short "banner sparkline" proportions — spans the full card width without ever reading as tall. */
const VIEW_WIDTH = 1200;
const VIEW_HEIGHT = 190;
const PADDING = { top: 10, right: 12, bottom: 20, left: 30 };
const PLOT_WIDTH = VIEW_WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = VIEW_HEIGHT - PADDING.top - PADDING.bottom;

interface ChartPoint {
  x: number;
  y: number;
  day: BankDepositDailyStat;
  isMax: boolean;
  isMin: boolean;
}

/** "Nice" round ticks (1/2/5 × 10^n) for the Y axis — never a fixed scale, always derived from the real max. */
function computeYAxisMax(rawMax: number): number {
  if (rawMax <= 0) {
    return 5;
  }
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const normalized = rawMax / magnitude;
  const niceNormalized = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return niceNormalized * magnitude;
}

/** Just 0 / half / max — a compact chart reads better with fewer gridlines. */
function buildYAxisTicks(axisMax: number): number[] {
  return [0, Math.round(axisMax / 2), axisMax];
}

/** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique every other date-driven piece of this codebase uses. Purely a presentational "which column is today" lookup, not a data/business-date decision (the series itself is always the server's own current month, see `BankDepositService.getDailyStats()`). */
function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Catmull-Rom → cubic Bezier, uniform tension — passes exactly through every point (peaks/valleys stay numerically exact), only the connecting segments are curved instead of straight. Standard 1/6 control-point scaling. */
function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;

  let d = `M${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return d;
}

/**
 * Self-contained, like `TransactionSummaryCardComponent`/`SalesSummaryCardComponent` —
 * fetches `BankDepositService.getDailyStats()` itself. Used identically by
 * Resumen, Transaccionar, and Reporte de Transacciones, which is what
 * structurally guarantees the three screens can never disagree: there is
 * exactly one place this data is fetched and rendered, not independent copies.
 *
 * Hand-rolled SVG rather than a charting library — this codebase has no
 * chart dependency anywhere, and every existing visualization (tiles,
 * tables) is a small custom component styled directly off the design
 * tokens, not a themed third-party widget.
 */
@Component({
  selector: 'app-transaction-monthly-chart',
  standalone: true,
  imports: [CardComponent, IconComponent, EmptyStateComponent, DatePipe],
  templateUrl: './transaction-monthly-chart.component.html',
  styleUrl: './transaction-monthly-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionMonthlyChartComponent {
  private readonly bankDepositService = inject(BankDepositService);

  readonly loading = signal(true);
  readonly loadError = signal(false);
  private readonly days = signal<BankDepositDailyStat[]>([]);
  readonly monthLabel = signal<string | null>(null);

  readonly hoveredIndex = signal<number | null>(null);

  readonly viewBox = `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`;
  readonly aspectRatio = `${VIEW_WIDTH} / ${VIEW_HEIGHT}`;
  readonly viewWidth = VIEW_WIDTH;
  readonly plotRight = VIEW_WIDTH - PADDING.right;
  readonly plotLeft = PADDING.left;
  readonly plotBottom = PADDING.top + PLOT_HEIGHT;
  readonly xAxisLabelY = VIEW_HEIGHT - 4;

  readonly hasActivity = computed(() => this.days().some((d) => d.transactionCount > 0));

  private readonly maxValue = computed(() =>
    this.days().reduce((max, d) => Math.max(max, d.transactionCount), 0),
  );

  private readonly maxIndex = computed(() => {
    const days = this.days();
    if (days.length === 0) return -1;
    return days.reduce((best, d, i) => (d.transactionCount > days[best].transactionCount ? i : best), 0);
  });

  private readonly minIndex = computed(() => {
    const days = this.days();
    if (days.length === 0) return -1;
    return days.reduce((best, d, i) => (d.transactionCount < days[best].transactionCount ? i : best), 0);
  });

  readonly maxDay = computed(() => (this.maxIndex() >= 0 ? this.days()[this.maxIndex()] : null));
  readonly minDay = computed(() => (this.minIndex() >= 0 ? this.days()[this.minIndex()] : null));

  private readonly axisMax = computed(() => computeYAxisMax(this.maxValue()));
  readonly yAxisTicks = computed(() => buildYAxisTicks(this.axisMax()));

  readonly points = computed<ChartPoint[]>(() => {
    const days = this.days();
    const axisMax = this.axisMax();
    const maxIndex = this.maxIndex();
    const minIndex = this.minIndex();
    const denominator = days.length > 1 ? days.length - 1 : 1;

    return days.map((day, i) => ({
      x: PADDING.left + (i / denominator) * PLOT_WIDTH,
      y: PADDING.top + PLOT_HEIGHT - (day.transactionCount / axisMax) * PLOT_HEIGHT,
      day,
      isMax: i === maxIndex,
      isMin: i === minIndex && minIndex !== maxIndex,
    }));
  });

  readonly linePath = computed(() => buildSmoothPath(this.points()));

  readonly areaPath = computed(() => {
    const points = this.points();
    if (points.length === 0) return '';
    const baseline = PADDING.top + PLOT_HEIGHT;
    const first = points[0];
    const last = points[points.length - 1];
    return `${buildSmoothPath(points)} L${last.x.toFixed(2)},${baseline} L${first.x.toFixed(2)},${baseline} Z`;
  });

  /** Day 1, every 5th day, and the last day — compact enough to never overlap on a 28-31 point axis. */
  readonly labelPoints = computed(() =>
    this.points().filter((p, i, all) => {
      const dayNumber = Number(p.day.date.slice(-2));
      return dayNumber === 1 || dayNumber % 5 === 0 || i === all.length - 1;
    }),
  );

  readonly hoveredPoint = computed(() => {
    const index = this.hoveredIndex();
    return index === null ? null : (this.points()[index] ?? null);
  });

  /**
   * Today's point on the line itself (same x/y the curve already plots at
   * that index) — the marker rides the trend line, never a fabricated
   * value. `null` whenever today genuinely isn't part of the rendered
   * month (a client/server clock skew right at a month boundary), in
   * which case the template simply omits the marker rather than guessing.
   */
  readonly todayMarker = computed(() => {
    const todayIso = todayIsoDate();
    const index = this.days().findIndex((d) => d.date === todayIso);
    return index >= 0 ? (this.points()[index] ?? null) : null;
  });

  constructor() {
    this.fetch();
  }

  private fetch(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.bankDepositService.getDailyStats().subscribe({
      next: (stats) => {
        this.days.set(stats.days);
        this.monthLabel.set(stats.month);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  retry(): void {
    this.fetch();
  }

  /** SVG y-coordinate for a given Y-axis tick value — the last (top) tick always equals `axisMax` by construction of `buildYAxisTicks`. */
  tickY(tick: number): number {
    const ticks = this.yAxisTicks();
    const axisMax = ticks[ticks.length - 1] || 1;
    return this.plotBottom - (tick / axisMax) * PLOT_HEIGHT;
  }

  onPointHover(index: number): void {
    this.hoveredIndex.set(index);
  }

  onPointLeave(): void {
    this.hoveredIndex.set(null);
  }

  /** Small downward-pointing triangle hovering just above the trend line at (x, y) — rides the curve's own height at today's column, like a pin marking that exact point from above. */
  todayMarkerPoints(x: number, y: number): string {
    const top = y - 11;
    const tip = y - 5;
    return `${(x - 4).toFixed(2)},${top} ${(x + 4).toFixed(2)},${top} ${x.toFixed(2)},${tip}`;
  }

  leftPercent(x: number): number {
    return (x / VIEW_WIDTH) * 100;
  }

  topPercent(y: number): number {
    return (y / VIEW_HEIGHT) * 100;
  }
}
