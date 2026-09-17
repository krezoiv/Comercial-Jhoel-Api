import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import {
  CATALOG_REQUEST_STATUS_LABEL,
  CATALOG_REQUEST_STATUS_TONE,
  CATALOG_REQUEST_TYPE_LABEL,
  CatalogRequest,
} from '../../../../../core/models';
import { BadgeComponent, EmptyStateComponent, IconComponent } from '../../../../../shared/ui';

const SKELETON_ROWS = 4;

@Component({
  selector: 'app-catalog-request-table',
  standalone: true,
  imports: [DatePipe, BadgeComponent, IconComponent, EmptyStateComponent],
  templateUrl: './catalog-request-table.component.html',
  styleUrl: './catalog-request-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogRequestTableComponent {
  @Input() requests: CatalogRequest[] = [];
  @Input() loading = false;

  @Output() viewDetail = new EventEmitter<CatalogRequest>();

  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });
  readonly statusLabel = CATALOG_REQUEST_STATUS_LABEL;
  readonly statusTone = CATALOG_REQUEST_STATUS_TONE;
  readonly typeLabel = CATALOG_REQUEST_TYPE_LABEL;

  formatPrice(price: number): string {
    return `Q${price.toFixed(2)}`;
  }
}
