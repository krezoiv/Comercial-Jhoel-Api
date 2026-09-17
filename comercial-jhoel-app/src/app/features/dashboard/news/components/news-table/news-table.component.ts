import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { NewsArticle } from '../../../../../core/models';
import { BadgeComponent, ButtonComponent, EmptyStateComponent, IconComponent } from '../../../../../shared/ui';

const SKELETON_ROWS = 4;

/** Orden fijo por `sortOrder` (subir/bajar) — mismo patrón de Teléfonos/Librería/Variedades. */
@Component({
  selector: 'app-news-table',
  standalone: true,
  imports: [DatePipe, BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent],
  templateUrl: './news-table.component.html',
  styleUrl: './news-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsTableComponent {
  @Input() articles: NewsArticle[] = [];
  @Input() loading = false;
  @Input() hasActiveFilters = false;

  @Output() edit = new EventEmitter<NewsArticle>();
  @Output() manageImage = new EventEmitter<NewsArticle>();
  @Output() toggleActive = new EventEmitter<NewsArticle>();
  @Output() moveUp = new EventEmitter<NewsArticle>();
  @Output() moveDown = new EventEmitter<NewsArticle>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() addArticle = new EventEmitter<void>();

  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });
}
