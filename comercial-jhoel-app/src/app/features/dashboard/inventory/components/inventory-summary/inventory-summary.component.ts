import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

import { InventoryStats, formatCurrency, formatQuantity } from '../../../../../core/models';
import { CardComponent, SummaryTileComponent, SummaryTileTone } from '../../../../../shared/ui';

interface SummaryTile {
  icon: string;
  title: string;
  value: string;
  description: string;
  tone: SummaryTileTone;
}

/** `stats` are real SQL aggregates over the WHOLE active catalog (`GET /products/stats`) — never a `Product[]` summed client-side, which used to silently cap "Total de productos" at whatever page size the list itself fetched. `null` while the stats call is still loading. */
@Component({
  selector: 'app-inventory-summary',
  standalone: true,
  imports: [CardComponent, SummaryTileComponent],
  templateUrl: './inventory-summary.component.html',
  styleUrl: './inventory-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventorySummaryComponent {
  private readonly statsValue = signal<InventoryStats | null>(null);

  @Input({ required: true })
  set stats(value: InventoryStats | null) {
    this.statsValue.set(value);
  }

  readonly tiles = computed<SummaryTile[]>(() => {
    const stats = this.statsValue();
    if (!stats) {
      return [];
    }

    return [
      {
        icon: 'package',
        title: 'Total de productos',
        value: formatQuantity(stats.totalProducts),
        description: 'productos registrados',
        tone: 'primary',
      },
      {
        icon: 'layers',
        title: 'Stock total',
        value: formatQuantity(stats.totalStock),
        description: 'unidades disponibles',
        tone: 'primary',
      },
      {
        icon: 'alert-triangle',
        title: 'Stock bajo',
        value: formatQuantity(stats.lowStockCount),
        description: stats.outOfStockCount > 0 ? `+ ${stats.outOfStockCount} sin stock` : 'productos por reabastecer',
        tone: 'danger',
      },
      {
        icon: 'trending-up',
        title: 'Valor de inventario (precio público)',
        value: formatCurrency(stats.totalPublicValue),
        description: 'a precio público',
        tone: 'gold',
      },
      {
        icon: 'wallet',
        title: 'Valor de inventario (precio costo)',
        value: formatCurrency(stats.totalCostValue),
        description: 'a precio de costo',
        tone: 'gold',
      },
    ];
  });
}
