import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CatalogPhone } from '../../../../../core/models';
import { BadgeComponent, ButtonComponent, EmptyStateComponent, IconComponent } from '../../../../../shared/ui';

const SKELETON_ROWS = 4;

/** Orden fijo por `sortOrder` (subir/bajar) — sin sorting de columnas, a diferencia de Clientes/Categorías, porque el orden en sí es un dato administrable. */
@Component({
  selector: 'app-catalog-phone-table',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent],
  templateUrl: './catalog-phone-table.component.html',
  styleUrl: './catalog-phone-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPhoneTableComponent {
  @Input() phones: CatalogPhone[] = [];
  @Input() loading = false;
  @Input() hasActiveFilters = false;

  @Output() edit = new EventEmitter<CatalogPhone>();
  @Output() manageImages = new EventEmitter<CatalogPhone>();
  @Output() toggleActive = new EventEmitter<CatalogPhone>();
  @Output() togglePublish = new EventEmitter<CatalogPhone>();
  @Output() moveUp = new EventEmitter<CatalogPhone>();
  @Output() moveDown = new EventEmitter<CatalogPhone>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() addPhone = new EventEmitter<void>();

  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });

  formatPrice(price: number): string {
    return `Q${price.toFixed(2)}`;
  }
}
