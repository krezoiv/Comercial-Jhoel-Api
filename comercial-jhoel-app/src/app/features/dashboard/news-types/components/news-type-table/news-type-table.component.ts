import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { NewsType } from '../../../../../core/models';
import { BadgeComponent, ButtonComponent, EmptyStateComponent, IconComponent } from '../../../../../shared/ui';

const SKELETON_ROWS = 4;

/** Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de `NewsTableComponent`. */
@Component({
  selector: 'app-news-type-table',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent],
  templateUrl: './news-type-table.component.html',
  styleUrl: './news-type-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsTypeTableComponent {
  @Input() types: NewsType[] = [];
  @Input() loading = false;
  @Input() hasActiveFilters = false;

  @Output() edit = new EventEmitter<NewsType>();
  @Output() toggleActive = new EventEmitter<NewsType>();
  @Output() moveUp = new EventEmitter<NewsType>();
  @Output() moveDown = new EventEmitter<NewsType>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() addType = new EventEmitter<void>();

  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });
}
