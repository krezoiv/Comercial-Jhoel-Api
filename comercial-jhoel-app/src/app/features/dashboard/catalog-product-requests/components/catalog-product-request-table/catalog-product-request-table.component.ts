import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import {
  CATALOG_PRODUCT_REQUEST_STATUS_LABEL,
  CATALOG_PRODUCT_REQUEST_STATUS_TONE,
  CatalogProductRequest,
} from '../../../../../core/models';
import { BadgeComponent, EmptyStateComponent, IconComponent } from '../../../../../shared/ui';

const SKELETON_ROWS = 4;

@Component({
  selector: 'app-catalog-product-request-table',
  standalone: true,
  imports: [DatePipe, BadgeComponent, IconComponent, EmptyStateComponent],
  templateUrl: './catalog-product-request-table.component.html',
  styleUrl: './catalog-product-request-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogProductRequestTableComponent {
  @Input() requests: CatalogProductRequest[] = [];
  @Input() loading = false;

  @Output() viewDetail = new EventEmitter<CatalogProductRequest>();

  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });
  readonly statusLabel = CATALOG_PRODUCT_REQUEST_STATUS_LABEL;
  readonly statusTone = CATALOG_PRODUCT_REQUEST_STATUS_TONE;

  formatPrice(price: number): string {
    return `Q${price.toFixed(2)}`;
  }
}
