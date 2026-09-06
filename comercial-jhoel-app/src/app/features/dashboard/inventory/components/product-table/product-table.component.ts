import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  computed,
  signal,
} from '@angular/core';

import {
  Product,
  STOCK_STATUS_LABEL,
  StockStatus,
  formatCurrency,
  formatQuantity,
  getStockStatus,
  stockAt,
} from '../../../../../core/models';
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

export type ProductSortColumn =
  | 'name'
  | 'sku'
  | 'category'
  | 'business'
  | 'costPrice'
  | 'publicPrice'
  | 'wholesalePrice'
  | 'stock'
  | 'createdAt';
type SortDirection = 'asc' | 'desc';

/**
 * One entry per `<col>` in `product-table.component.html`, left to right.
 * Neither "Negocio" nor "SKU" is its own column anymore — both render as a
 * secondary line inside another column's own cell instead (Negocio under
 * Categoría, SKU under Producto — see `product-table.component.html`'s
 * `<td>`s for each), so neither ever had its own `ProductColumnKey`/width to
 * remove; `Product.business`/`Product.sku` themselves are untouched, still
 * read directly from the model.
 */
type ProductColumnKey =
  | 'product'
  | 'category'
  | 'costPrice'
  | 'publicPrice'
  | 'wholesalePrice'
  | 'stock'
  | 'actions';

const COLUMN_ORDER: ProductColumnKey[] = [
  'product',
  'category',
  'costPrice',
  'publicPrice',
  'wholesalePrice',
  'stock',
  'actions',
];

/**
 * Initial column widths, as percentages of the table's own width (must sum
 * to 100). Producto/Categoría get the most room — each also covers the
 * secondary line now shown inside it (SKU under Producto, Negocio under
 * Categoría) — while Costo/Precio Público are deliberately the smallest of
 * the money columns — just enough to always show "Q 1,250.00" in full.
 * Precio Mayor keeps a bit more room since it wasn't asked to shrink further.
 */
const DEFAULT_COLUMN_WIDTHS: Record<ProductColumnKey, number> = {
  product: 32,
  category: 19,
  costPrice: 8,
  publicPrice: 8,
  wholesalePrice: 11,
  stock: 9,
  actions: 13,
};

/** Never let a drag shrink a column past the point its content stops being legible. */
const COLUMN_MIN_WIDTH_PX: Record<ProductColumnKey, number> = {
  product: 160,
  category: 90,
  costPrice: 76,
  publicPrice: 76,
  wholesalePrice: 76,
  stock: 76,
  actions: 96,
};

/** Scoped to this one table — a per-browser UI preference, not app data, so `localStorage` (survives reload, never sent anywhere) is the right store, same reasoning `AuthService` already uses for its own session. */
const COLUMN_WIDTHS_STORAGE_KEY = 'cj_inventory_product_table_column_widths';

interface ColumnResizeDragState {
  leftKey: ProductColumnKey;
  rightKey: ProductColumnKey;
  startClientX: number;
  startLeftPercent: number;
  startRightPercent: number;
  tableWidthPx: number;
  minLeftPercent: number;
  minRightPercent: number;
}

/** A saved set must have exactly the columns this table currently has and sum close to 100 — otherwise a stale/corrupted entry (e.g. from before a column was added) is discarded in favor of the defaults, rather than rendering a broken table. */
function isValidColumnWidths(value: unknown): value is Record<ProductColumnKey, number> {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  const hasAllKeys = COLUMN_ORDER.every((key) => typeof record[key] === 'number' && record[key] > 0);
  if (!hasAllKeys) {
    return false;
  }
  const total = COLUMN_ORDER.reduce((sum, key) => sum + (record[key] as number), 0);
  return Math.abs(total - 100) < 1;
}

function loadColumnWidths(): Record<ProductColumnKey, number> {
  try {
    const raw = localStorage.getItem(COLUMN_WIDTHS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidColumnWidths(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Storage unavailable or corrupted — fall through to the defaults below.
  }
  return { ...DEFAULT_COLUMN_WIDTHS };
}

function persistColumnWidths(widths: Record<ProductColumnKey, number>): void {
  try {
    localStorage.setItem(COLUMN_WIDTHS_STORAGE_KEY, JSON.stringify(widths));
  } catch {
    // Storage unavailable (private browsing, quota exceeded) — the chosen
    // widths still apply for the rest of this session, they just won't
    // survive a reload. Not worth surfacing to the user.
  }
}

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    EmptyStateComponent,
  ],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTableComponent implements OnDestroy {
  private readonly productsInput = signal<Product[]>([]);

  @Input()
  set products(value: Product[]) {
    this.productsInput.set(value);
  }

  @Input() loading = false;
  @Input() hasActiveFilters = false;
  /** USER role is read-only — hides the Acciones column and edit/delete buttons. The backend still enforces this. */
  @Input() canManage = true;

  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() addProduct = new EventEmitter<void>();
  @Output() viewDetail = new EventEmitter<Product>();

  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });

  formatCurrency = formatCurrency;
  formatQuantity = formatQuantity;

  readonly sortColumn = signal<ProductSortColumn>('createdAt');
  readonly sortDirection = signal<SortDirection>('desc');

  /** Percentages of the table's own width, one per `<col>`, always summing to 100 — see `DEFAULT_COLUMN_WIDTHS`'s own doc comment for why. */
  readonly columnWidths = signal<Record<ProductColumnKey, number>>(loadColumnWidths());
  /** Drives a `.product-table--resizing` class while a drag is in progress — forces the `col-resize` cursor everywhere and disables text selection, so a fast mouse move that briefly leaves the thin handle doesn't interrupt the drag. */
  readonly isResizing = signal(false);
  /** The left-hand column of whichever handle is actively being dragged (or `null`) — lets the template highlight only that one handle instead of every handle in the table. */
  readonly resizingColumnKey = signal<ProductColumnKey | null>(null);
  private dragState: ColumnResizeDragState | null = null;

  /** Starts a column resize — `leftKey`/`rightKey` are the two columns straddling the dragged border; only that pair's widths ever change, so the table's total width (and therefore "no horizontal scroll") is preserved by construction. */
  onResizeStart(event: MouseEvent, leftKey: ProductColumnKey, rightKey: ProductColumnKey): void {
    event.preventDefault();
    const table = (event.currentTarget as HTMLElement).closest('table');
    if (!table) {
      return;
    }
    const tableWidthPx = table.getBoundingClientRect().width;
    const widths = this.columnWidths();
    this.dragState = {
      leftKey,
      rightKey,
      startClientX: event.clientX,
      startLeftPercent: widths[leftKey],
      startRightPercent: widths[rightKey],
      tableWidthPx,
      minLeftPercent: (COLUMN_MIN_WIDTH_PX[leftKey] / tableWidthPx) * 100,
      minRightPercent: (COLUMN_MIN_WIDTH_PX[rightKey] / tableWidthPx) * 100,
    };
    this.isResizing.set(true);
    this.resizingColumnKey.set(leftKey);
    document.addEventListener('mousemove', this.onResizeMove);
    document.addEventListener('mouseup', this.onResizeEnd);
  }

  /** Bound as a class field (not a method) so the exact same function reference can be passed to both `addEventListener` and `removeEventListener`. */
  private readonly onResizeMove = (event: MouseEvent): void => {
    const drag = this.dragState;
    if (!drag) {
      return;
    }
    const deltaPercent = ((event.clientX - drag.startClientX) / drag.tableWidthPx) * 100;
    const pairTotal = drag.startLeftPercent + drag.startRightPercent;
    const maxLeftPercent = pairTotal - drag.minRightPercent;
    const newLeftPercent = Math.min(
      Math.max(drag.startLeftPercent + deltaPercent, drag.minLeftPercent),
      maxLeftPercent,
    );
    const newRightPercent = pairTotal - newLeftPercent;
    this.columnWidths.update((widths) => ({
      ...widths,
      [drag.leftKey]: newLeftPercent,
      [drag.rightKey]: newRightPercent,
    }));
  };

  private readonly onResizeEnd = (): void => {
    if (!this.dragState) {
      return;
    }
    this.dragState = null;
    this.isResizing.set(false);
    this.resizingColumnKey.set(null);
    document.removeEventListener('mousemove', this.onResizeMove);
    document.removeEventListener('mouseup', this.onResizeEnd);
    persistColumnWidths(this.columnWidths());
  };

  ngOnDestroy(): void {
    // Safety net only — a drag normally ends on its own `mouseup`, but this
    // avoids leaking a document-level listener if the component is
    // destroyed (e.g. navigating away) while a drag is somehow still active.
    document.removeEventListener('mousemove', this.onResizeMove);
    document.removeEventListener('mouseup', this.onResizeEnd);
  }

  readonly sortedProducts = computed(() => {
    const column = this.sortColumn();
    const direction = this.sortDirection() === 'asc' ? 1 : -1;

    return [...this.productsInput()].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }
      return (
        String(aValue ?? '').localeCompare(String(bValue ?? '')) * direction
      );
    });
  });

  toggleSort(column: ProductSortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update((direction) =>
        direction === 'asc' ? 'desc' : 'asc',
      );
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

  bodegaStock(product: Product): number {
    return stockAt(product, 'Bodega');
  }

  vitrinaStock(product: Product): number {
    return stockAt(product, 'Vitrina');
  }
}
