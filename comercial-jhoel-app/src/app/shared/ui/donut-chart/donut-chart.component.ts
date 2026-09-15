import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';

import { CardComponent } from '../card/card.component';
import { IconComponent } from '../icon/icon.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

const VIEW_SIZE = 200;
const CENTER = VIEW_SIZE / 2;
const RADIUS = 72;
const STROKE_WIDTH = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** Small breathing-room gap between adjacent segments (arc-length units) — combined with rounded caps, gives the "Apple Health rings"-style separated look instead of one solid, seamless band. */
const SEGMENT_GAP = 5;

/** Same collision-avoidance technique `LineChartComponent` already uses for its gradient id, applied here in case a future variant needs `<defs>`. */
let instanceCounter = 0;

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface RenderedSegment {
  segment: DonutSegment;
  dashArray: string;
  dashOffset: number;
  percent: number;
  /** Tooltip anchor — the outer edge of the ring at this segment's mid-angle. */
  anchorX: number;
  anchorY: number;
}

/**
 * Generic, presentational comparison donut — 2+ segments summing to a
 * center total, same hand-rolled SVG convention `LineChartComponent`
 * established (no charting library anywhere in this codebase). Used for
 * "Ventas de Recargas" and "Compras de Saldo" (Claro vs. Tigo), but the
 * component itself knows nothing about operators — only labels, values,
 * and colors, exactly like `LineChartComponent` knows nothing about
 * transacciones/ventas/compras.
 */
@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [DecimalPipe, CardComponent, IconComponent, EmptyStateComponent],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChartComponent {
  @Input() segments: DonutSegment[] = [];
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() icon = 'bar-chart';
  @Input() centerLabel = 'Total';
  /** How each segment's value is rendered in the legend and tooltip. Defaults to the plain number. */
  @Input() formatValue: (value: number) => string = (value) => String(value);
  @Input() loading = false;
  @Input() loadError = false;
  @Input() emptyTitle = 'Sin datos registrados';
  @Input() emptyDescription = 'Aquí verás el comparativo en cuanto haya datos registrados.';
  /** Smaller plot/typography/padding for embedding several instances side by side — same data/visuals, just denser. */
  @Input() compact = false;

  @Output() retry = new EventEmitter<void>();

  protected readonly instanceId = ++instanceCounter;

  glowId(index: number): string {
    return `donut-chart-glow-${this.instanceId}-${index}`;
  }

  readonly hoveredIndex = signal<number | null>(null);

  readonly viewBox = `0 0 ${VIEW_SIZE} ${VIEW_SIZE}`;
  readonly center = CENTER;
  readonly radius = RADIUS;
  readonly strokeWidth = STROKE_WIDTH;

  readonly total = computed(() => this.segments.reduce((sum, s) => sum + Math.max(0, s.value), 0));
  readonly hasActivity = computed(() => this.total() > 0);

  readonly renderedSegments = computed<RenderedSegment[]>(() => {
    const total = this.total();
    const visibleCount = this.segments.filter((s) => s.value > 0).length;
    let cumulative = 0;

    return this.segments.map((segment) => {
      const value = Math.max(0, segment.value);
      const fraction = total > 0 ? value / total : 0;
      const length = fraction * CIRCUMFERENCE;
      const midFraction = cumulative / CIRCUMFERENCE + fraction / 2;
      const midAngle = midFraction * 2 * Math.PI - Math.PI / 2;
      // Only trim a gap when there's more than one visible slice sharing the ring — a single 100% segment should stay a full, unbroken circle.
      const visibleLength = visibleCount > 1 ? Math.max(0, length - SEGMENT_GAP) : length;

      const rendered: RenderedSegment = {
        segment,
        dashArray: `${visibleLength.toFixed(2)} ${(CIRCUMFERENCE - visibleLength).toFixed(2)}`,
        dashOffset: -cumulative,
        percent: fraction * 100,
        anchorX: CENTER + Math.cos(midAngle) * RADIUS,
        anchorY: CENTER + Math.sin(midAngle) * RADIUS,
      };
      cumulative += length;
      return rendered;
    });
  });

  readonly hoveredSegment = computed(() => {
    const index = this.hoveredIndex();
    return index === null ? null : (this.renderedSegments()[index] ?? null);
  });

  onSegmentHover(index: number): void {
    this.hoveredIndex.set(index);
  }

  onSegmentLeave(): void {
    this.hoveredIndex.set(null);
  }

  leftPercent(x: number): number {
    return (x / VIEW_SIZE) * 100;
  }

  topPercent(y: number): number {
    return (y / VIEW_SIZE) * 100;
  }

  onRetry(): void {
    this.retry.emit();
  }
}
