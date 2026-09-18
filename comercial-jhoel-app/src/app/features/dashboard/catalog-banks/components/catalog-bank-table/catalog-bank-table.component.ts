import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CatalogBank } from '../../../../../core/models';
import { BadgeComponent, ButtonComponent, EmptyStateComponent, IconComponent } from '../../../../../shared/ui';

const SKELETON_ROWS = 4;

/** Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de `NewsTableComponent`. */
@Component({
  selector: 'app-catalog-bank-table',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent],
  templateUrl: './catalog-bank-table.component.html',
  styleUrl: './catalog-bank-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogBankTableComponent {
  @Input() banks: CatalogBank[] = [];
  @Input() loading = false;
  @Input() hasActiveFilters = false;

  @Output() edit = new EventEmitter<CatalogBank>();
  @Output() manageImage = new EventEmitter<CatalogBank>();
  @Output() preview = new EventEmitter<CatalogBank>();
  @Output() toggleActive = new EventEmitter<CatalogBank>();
  @Output() moveUp = new EventEmitter<CatalogBank>();
  @Output() moveDown = new EventEmitter<CatalogBank>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() addBank = new EventEmitter<void>();

  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });
}
