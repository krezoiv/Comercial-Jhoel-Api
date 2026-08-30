import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { PurchaseDraftItem, calculatePurchaseItemTotal, formatCurrency } from '../../../../../core/models';
import { EmptyStateComponent, IconComponent } from '../../../../../shared/ui';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';

@Component({
  selector: 'app-purchase-items-table',
  standalone: true,
  imports: [IconComponent, EmptyStateComponent, DecimalInputDirective],
  templateUrl: './purchase-items-table.component.html',
  styleUrl: './purchase-items-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseItemsTableComponent {
  @Input() items: PurchaseDraftItem[] = [];

  @Output() quantityChange = new EventEmitter<{ productId: string; quantity: number }>();
  @Output() costPriceChange = new EventEmitter<{ productId: string; costPrice: number }>();
  @Output() publicPriceChange = new EventEmitter<{ productId: string; publicPrice: number }>();
  @Output() removeItem = new EventEmitter<string>();

  calculateItemTotal = calculatePurchaseItemTotal;
  formatCurrency = formatCurrency;

  increment(item: PurchaseDraftItem): void {
    this.quantityChange.emit({ productId: item.productId, quantity: item.quantity + 1 });
  }

  decrement(item: PurchaseDraftItem): void {
    this.quantityChange.emit({ productId: item.productId, quantity: Math.max(item.quantity - 1, 1) });
  }

  onQuantityInput(item: PurchaseDraftItem, value: string): void {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return;
    }
    this.quantityChange.emit({ productId: item.productId, quantity: Math.max(parsed, 1) });
  }

  onCostPriceInput(item: PurchaseDraftItem, value: string): void {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed)) {
      return;
    }
    this.costPriceChange.emit({ productId: item.productId, costPrice: Math.max(parsed, 0) });
  }

  onPublicPriceInput(item: PurchaseDraftItem, value: string): void {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed)) {
      return;
    }
    this.publicPriceChange.emit({ productId: item.productId, publicPrice: Math.max(parsed, 0) });
  }
}
