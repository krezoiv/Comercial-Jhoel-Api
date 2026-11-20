import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { CuadreCashCount, formatCurrency } from '../../../../../core/models';
import { IconComponent } from '../../../../../shared/ui';
import { formatSignedDifference } from '../../../bank-agents/components/custody-count-modal/custody-count-modal.component';

const SOURCE_LABEL: Record<CuadreCashCount['source'], string> = {
  MANUAL: 'Conteo manual',
  CORTE_CAJA: 'Cargado del Segundo corte',
  ARQUEO_CAJA: 'Cargado de un Arqueo de Caja',
};

/**
 * Read-only view of the "Arqueo de Caja" saved with a cuadre: caja and Bodega
 * (theoretical, counted, difference) plus the consolidated row, and both
 * denomination breakdowns on demand. Cuadres saved before Bodega was counted
 * show only their caja breakdown — nothing is filled in or inferred.
 */
@Component({
  selector: 'app-cuadre-cash-count-view',
  standalone: true,
  imports: [DatePipe, NgTemplateOutlet, IconComponent],
  templateUrl: './cuadre-cash-count-view.component.html',
  styleUrl: './cuadre-cash-count-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuadreCashCountViewComponent {
  readonly count = input.required<CuadreCashCount>();

  readonly formatCurrency = formatCurrency;
  readonly formatDifference = formatSignedDifference;
  readonly showDetails = signal(false);

  /** Cuadre saved with the physical Bodega count (theoretical balances and differences stored). */
  readonly hasCustody = computed(() => this.count().warehouseCounted !== null);
  readonly sourceLabel = computed(() => {
    const count = this.count();
    const base = SOURCE_LABEL[count.source] ?? count.source;
    return count.modifiedAfterLoad ? `${base} y modificado` : base;
  });

  tone(value: number | null): string {
    return value === null || value === 0 ? 'ok' : value < 0 ? 'short' : 'over';
  }
}
