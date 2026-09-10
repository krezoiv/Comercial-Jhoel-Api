import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

import { Product, formatCurrency, formatQuantity, getStockStatus } from '../../../../../core/models';
import { CardComponent, SummaryTileComponent, SummaryTileTone } from '../../../../../shared/ui';

interface SummaryTile {
  icon: string;
  title: string;
  value: string;
  description: string;
  tone: SummaryTileTone;
}

@Component({
  selector: 'app-inventory-summary',
  standalone: true,
  imports: [CardComponent, SummaryTileComponent],
  templateUrl: './inventory-summary.component.html',
  styleUrl: './inventory-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventorySummaryComponent {
  private readonly products = signal<Product[]>([]);

  @Input({ required: true })
  set data(value: Product[]) {
    this.products.set(value);
  }

  readonly tiles = computed<SummaryTile[]>(() => {
    const products = this.products();
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStock = products.filter((p) => getStockStatus(p.stock) === 'low-stock').length;
    const outOfStock = products.filter((p) => getStockStatus(p.stock) === 'out-of-stock').length;
    // `p.stock` is always the cross-location total in BASE UNITS (see `products.stock`'s own doc
    // comment on the backend — kept in lockstep with `SUM(inventory_stock.quantity)`), and
    // `p.costPrice`/`p.publicPrice` always represent the price of exactly one base unit (the
    // "Unidad" presentation's price — never overwritten by a bulk-presentation purchase, e.g.
    // buying by "Caja" only ever updates that presentation's own price, see `confirm_purchase`).
    // `stock × pricePerUnit` is therefore already dimensionally correct and never double-counts a
    // bulk presentation's own price — it must never multiply by a presentation's price instead.
    const publicValue = products.reduce((sum, p) => sum + p.stock * p.publicPrice, 0);
    const costValue = products.reduce((sum, p) => sum + p.stock * p.costPrice, 0);

    return [
      {
        icon: 'package',
        title: 'Total de productos',
        value: formatQuantity(products.length),
        description: 'productos registrados',
        tone: 'primary',
      },
      {
        icon: 'layers',
        title: 'Stock total',
        value: formatQuantity(totalStock),
        description: 'unidades disponibles',
        tone: 'primary',
      },
      {
        icon: 'alert-triangle',
        title: 'Stock bajo',
        value: formatQuantity(lowStock),
        description: outOfStock > 0 ? `+ ${outOfStock} sin stock` : 'productos por reabastecer',
        tone: 'danger',
      },
      {
        icon: 'trending-up',
        title: 'Valor de inventario (precio público)',
        value: formatCurrency(publicValue),
        description: 'a precio público',
        tone: 'gold',
      },
      {
        icon: 'wallet',
        title: 'Valor de inventario (precio costo)',
        value: formatCurrency(costValue),
        description: 'a precio de costo',
        tone: 'gold',
      },
    ];
  });
}
