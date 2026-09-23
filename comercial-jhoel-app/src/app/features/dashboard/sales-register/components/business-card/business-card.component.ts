import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';

import { SalesRegisterBusiness, formatCurrency, formatQuantity } from '../../../../../core/models';
import { CardComponent, IconComponent } from '../../../../../shared/ui';

/** Cycles the same 4 accent colors `FinancialIndicatorsComponent`'s metric cards already use — one color per card, never a new palette. */
const ACCENT_TONES = ['cyan', 'green', 'gold', 'blue'];

/**
 * One negocio's daily card — same `.metric-card` visual language as
 * Resumen's "Indicadores del mes" (see `FinancialIndicatorsComponent`):
 * accent top border, hero amount, Ventas/Productos footer stats. The one
 * addition here is the collapsible product breakdown, since Caja de Ventas
 * needs to drill into "qué se vendió" per negocio and Resumen's own cards
 * never needed a third level of detail.
 */
@Component({
  selector: 'app-sales-register-business-card',
  standalone: true,
  imports: [CardComponent, IconComponent],
  templateUrl: './business-card.component.html',
  styleUrl: './business-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesRegisterBusinessCardComponent {
  @Input({ required: true }) business!: SalesRegisterBusiness;
  @Input() accentIndex = 0;

  readonly expanded = signal(false);

  formatCurrency = formatCurrency;
  formatQuantity = formatQuantity;

  get accentClass(): string {
    return `metric-card--${ACCENT_TONES[this.accentIndex % ACCENT_TONES.length]}`;
  }

  toggle(): void {
    this.expanded.update((value) => !value);
  }
}
