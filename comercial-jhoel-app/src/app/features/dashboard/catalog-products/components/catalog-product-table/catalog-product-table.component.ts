import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CatalogProduct } from '../../../../../core/models';
import { BadgeComponent, ButtonComponent, EmptyStateComponent, IconComponent } from '../../../../../shared/ui';

const SKELETON_ROWS = 4;

/** Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de Teléfonos, sin sorting de columnas. */
@Component({
  selector: 'app-catalog-product-table',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent],
  templateUrl: './catalog-product-table.component.html',
  styleUrl: './catalog-product-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogProductTableComponent {
  @Input() products: CatalogProduct[] = [];
  @Input() loading = false;
  @Input() hasActiveFilters = false;
  @Input() emptyTitle = 'Aún no hay productos publicados';
  @Input() emptyDescription = 'Publica el primer producto para comenzar.';

  @Output() edit = new EventEmitter<CatalogProduct>();
  @Output() manageImage = new EventEmitter<CatalogProduct>();
  @Output() toggleActive = new EventEmitter<CatalogProduct>();
  @Output() moveUp = new EventEmitter<CatalogProduct>();
  @Output() moveDown = new EventEmitter<CatalogProduct>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() addProduct = new EventEmitter<void>();

  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });

  formatPrice(price: number): string {
    return `Q${price.toFixed(2)}`;
  }
}
