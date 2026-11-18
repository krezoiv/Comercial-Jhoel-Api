import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SchoolDashboard, formatCurrency, formatQuantity, guatemalaToday } from '../../../../../core/models';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import {
  ButtonComponent,
  DonutChartComponent,
  DonutSegment,
  LineChartComponent,
  LineChartPoint,
  SummaryTileComponent,
} from '../../../../../shared/ui';

const GRADE_COLORS = ['#190053', '#17c3d6', '#f5a623', '#8b5cf6', '#34c77b', '#e0357f'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** Every `yyyy-MM-dd` between two dates (inclusive), without time-zone drift. */
export function eachDay(from: string, to: string): string[] {
  const days: string[] = [];
  const cursor = new Date(`${from}T12:00:00Z`);
  const end = new Date(`${to}T12:00:00Z`);
  while (cursor <= end && days.length < 400) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

/**
 * Income per period: one point per day for ranges up to two months, one per
 * month otherwise. Days without payments are drawn as zero (net of
 * devoluciones/anulaciones, as the backend reports them).
 */
export function buildIncomePoints(dashboard: SchoolDashboard): LineChartPoint[] {
  const byDay = new Map(dashboard.incomeByDay.map((d) => [d.date, d.amount]));
  const days = eachDay(dashboard.dateFrom, dashboard.dateTo);
  if (days.length <= 62) {
    return days.map((day) => ({
      label: String(Number(day.slice(8, 10))),
      tooltipLabel: `${Number(day.slice(8, 10))} ${MONTHS[Number(day.slice(5, 7)) - 1]} ${day.slice(0, 4)}`,
      value: byDay.get(day) ?? 0,
    }));
  }
  const byMonth = new Map<string, number>();
  for (const day of days) {
    const month = day.slice(0, 7);
    byMonth.set(month, (byMonth.get(month) ?? 0) + (byDay.get(day) ?? 0));
  }
  return [...byMonth.entries()].map(([month, value]) => ({
    label: MONTHS[Number(month.slice(5, 7)) - 1],
    tooltipLabel: `${MONTHS[Number(month.slice(5, 7)) - 1]} ${month.slice(0, 4)}`,
    value: Math.round(value * 100) / 100,
  }));
}

/** "Tablero" of Listas Escolares — figures come straight from the backend. */
@Component({
  selector: 'app-school-dashboard',
  standalone: true,
  imports: [FormsModule, ButtonComponent, SummaryTileComponent, DonutChartComponent, LineChartComponent],
  templateUrl: './school-dashboard.component.html',
  styleUrl: './school-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolDashboardComponent {
  @Output() openList = new EventEmitter<void>();

  private readonly service = inject(SchoolListService);

  readonly formatCurrency = formatCurrency;
  readonly formatQuantity = formatQuantity;

  readonly dateFrom = signal(`${guatemalaToday().slice(0, 4)}-01-01`);
  readonly dateTo = signal(guatemalaToday());
  readonly data = signal<SchoolDashboard | null>(null);
  readonly loading = signal(false);
  readonly failed = signal(false);

  readonly gradeSegments = computed<DonutSegment[]>(() =>
    (this.data()?.byGrade ?? []).map((grade, index) => ({
      label: grade.grade,
      value: grade.count,
      color: GRADE_COLORS[index % GRADE_COLORS.length],
    })),
  );
  readonly incomePoints = computed(() => {
    const data = this.data();
    return data ? buildIncomePoints(data) : [];
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.service.getDashboard(this.dateFrom() || undefined, this.dateTo() || undefined).subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.failed.set(true);
        this.loading.set(false);
      },
    });
  }

  readonly formatMoney = (value: number) => formatCurrency(value);
  readonly formatCount = (value: number) => `${formatQuantity(value)} cotizaciones`;
}
