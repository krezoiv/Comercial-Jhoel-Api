import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';

import { Product, STOCK_STATUS_LABEL, StockStatus, formatCurrency, getStockStatus } from '../../../../../core/models';
import {
  BadgeComponent,
  BadgeTone,
  ButtonComponent,
  EmptyStateComponent,
  IconComponent,
} from '../../../../../shared/ui';

const STOCK_BADGE_TONE: Record<StockStatus, BadgeTone> = {
  'in-stock': 'success',
  'low-stock': 'gold',
  'out-of-stock': 'danger',
};

/** Rows to render while `loading` is true — just enough to fill the fold without looking sparse. */
const SKELETON_ROWS = 5;

export type ProductSortColumn = 'name' | 'category' | 'costPrice' | 'publicPrice' | 'wholesalePrice' | 'stock';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTableComponent {
  private readonly productsInput = signal<Product[]>([]);

  @Input()
  set products(value: Product[]) {
    this.productsInput.set(value);
  }

  @Input() loading = false;
  @Input() hasActiveFilters = false;

  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() addProduct = new EventEmitter<void>();

  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });

  formatCurrency = formatCurrency;

  readonly sortColumn = signal<ProductSortColumn>('name');
  readonly sortDirection = signal<SortDirection>('asc');

  readonly sortedProducts = computed(() => {
    const column = this.sortColumn();
    const direction = this.sortDirection() === 'asc' ? 1 : -1;

    return [...this.productsInput()].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
      }
      return ((aValue as number) - (bValue as number)) * direction;
    });
  });

  toggleSort(column: ProductSortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  sortIcon(column: ProductSortColumn): string {
    if (this.sortColumn() !== column) {
      return 'chevrons-up-down';
    }
    return this.sortDirection() === 'asc' ? 'chevron-up' : 'chevron-down';
  }

  statusOf(product: Product): StockStatus {
    return getStockStatus(product.stock);
  }

  statusLabel(product: Product): string {
    return STOCK_STATUS_LABEL[this.statusOf(product)];
  }

  statusTone(product: Product): BadgeTone {
    return STOCK_BADGE_TONE[this.statusOf(product)];
  }
}
