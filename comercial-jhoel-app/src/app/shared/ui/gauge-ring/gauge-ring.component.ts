import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed } from '@angular/core';

import { CardComponent } from '../card/card.component';
import { IconComponent } from '../icon/icon.component';

const VIEW_SIZE = 200;
const CENTER = VIEW_SIZE / 2;
const RADIUS = 72;
const STROKE_WIDTH = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** The inner "overflow lap" ring — drawn just inside the main ring, only shown once the balance exceeds its limit. */
const OVERFLOW_RADIUS = RADIUS - STROKE_WIDTH / 2 - 6;
const OVERFLOW_STROKE_WIDTH = 8;
const OVERFLOW_CIRCUMFERENCE = 2 * Math.PI * OVERFLOW_RADIUS;

/**
 * Rojo → naranja → amarillo → verde, interpolación lineal en RGB entre 4
 * paradas — un degradado progresivo, nunca 4 saltos bruscos de color. `t`
 * es el porcentaje (0-1) ya limitado a 0-100% (el valor numérico mostrado
 * nunca se limita, solo el color del anillo).
 */
const GAUGE_COLOR_STOPS: { t: number; rgb: [number, number, number] }[] = [
  { t: 0, rgb: [220, 68, 68] }, // rojo — var(--color-gauge-red)
  { t: 1 / 3, rgb: [249, 115, 22] }, // naranja — var(--color-gauge-orange)
  { t: 2 / 3, rgb: [244, 196, 48] }, // amarillo — var(--color-gauge-yellow)
  { t: 1, rgb: [52, 199, 123] }, // verde — var(--color-gauge-green)
];

function interpolateGaugeColor(t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < GAUGE_COLOR_STOPS.length - 1; i++) {
    const a = GAUGE_COLOR_STOPS[i];
    const b = GAUGE_COLOR_STOPS[i + 1];
    if (clamped >= a.t && clamped <= b.t) {
      const localT = b.t === a.t ? 0 : (clamped - a.t) / (b.t - a.t);
      const r = Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * localT);
      const g = Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * localT);
      const bl = Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * localT);
      return `rgb(${r}, ${g}, ${bl})`;
    }
  }
  const last = GAUGE_COLOR_STOPS[GAUGE_COLOR_STOPS.length - 1].rgb;
  return `rgb(${last[0]}, ${last[1]}, ${last[2]})`;
}

/**
 * Generic, presentational single-value gauge ring — percentage can exceed
 * 100% (never `Math.min(percentage, 100)`), used for "Saldo Claro"/"Saldo
 * Tigo" (saldo actual vs. límite configurado). The ring itself visually
 * caps at 100% (a full lap), with any excess shown as a thin inner
 * "overflow" ring plus a badge — the exact numeric percentage in the
 * center is always the source of truth, the ring is a supporting visual.
 * Same hand-rolled SVG convention as `LineChartComponent`/`DonutChartComponent`
 * — no charting library anywhere in this codebase.
 */
@Component({
  selector: 'app-gauge-ring',
  standalone: true,
  imports: [CardComponent, IconComponent],
  templateUrl: './gauge-ring.component.html',
  styleUrl: './gauge-ring.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaugeRingComponent {
  @Input({ required: true }) percentage!: number;
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() icon = 'smartphone';
  @Input() currentValue = 0;
  @Input() limitValue = 0;
  @Input() currentLabel = 'disponible';
  @Input() limitLabel = 'Límite';
  @Input() formatValue: (value: number) => string = (value) => String(value);
  @Input() loading = false;
  @Input() loadError = false;

  @Output() retry = new EventEmitter<void>();

  readonly viewBox = `0 0 ${VIEW_SIZE} ${VIEW_SIZE}`;
  readonly center = CENTER;
  readonly radius = RADIUS;
  readonly strokeWidth = STROKE_WIDTH;
  readonly overflowRadius = OVERFLOW_RADIUS;
  readonly overflowStrokeWidth = OVERFLOW_STROKE_WIDTH;

  private readonly safePercentage = computed(() => (Number.isFinite(this.percentage) ? this.percentage : 0));

  readonly clampedFraction = computed(() => Math.max(0, Math.min(1, this.safePercentage() / 100)));

  readonly ringColor = computed(() => interpolateGaugeColor(this.clampedFraction()));

  readonly ringDashArray = computed(() => {
    const length = this.clampedFraction() * CIRCUMFERENCE;
    return `${length.toFixed(2)} ${(CIRCUMFERENCE - length).toFixed(2)}`;
  });

  readonly isOverLimit = computed(() => this.safePercentage() > 100);

  /** Capped visually at one full extra lap (100 percentage points) — the center text always shows the real, uncapped value regardless. */
  private readonly overflowFraction = computed(() => Math.max(0, Math.min(1, (this.safePercentage() - 100) / 100)));

  readonly overflowDashArray = computed(() => {
    const length = this.overflowFraction() * OVERFLOW_CIRCUMFERENCE;
    return `${length.toFixed(2)} ${(OVERFLOW_CIRCUMFERENCE - length).toFixed(2)}`;
  });

  readonly displayPercentage = computed(() => {
    const value = this.safePercentage();
    return `${value.toFixed(value % 1 === 0 ? 0 : 2)}%`;
  });

  onRetry(): void {
    this.retry.emit();
  }
}
