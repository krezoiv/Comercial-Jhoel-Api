import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { NewsSubscriber } from '../../../../../core/models';
import { BadgeComponent, ButtonComponent, EmptyStateComponent, IconComponent } from '../../../../../shared/ui';

const SKELETON_ROWS = 4;

@Component({
  selector: 'app-news-subscriber-table',
  standalone: true,
  imports: [DatePipe, BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent],
  templateUrl: './news-subscriber-table.component.html',
  styleUrl: './news-subscriber-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsSubscriberTableComponent {
  @Input() subscribers: NewsSubscriber[] = [];
  @Input() loading = false;
  @Input() hasActiveFilters = false;

  @Output() view = new EventEmitter<NewsSubscriber>();
  @Output() toggleActive = new EventEmitter<NewsSubscriber>();
  @Output() clearFilters = new EventEmitter<void>();

  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });

  /** Nombre para mostrar/aria-label — `whatsappMasked` es `null` para un suscriptor solo-push. */
  displayName(subscriber: NewsSubscriber): string {
    return subscriber.name || subscriber.whatsappMasked || 'Suscriptor push';
  }
}
