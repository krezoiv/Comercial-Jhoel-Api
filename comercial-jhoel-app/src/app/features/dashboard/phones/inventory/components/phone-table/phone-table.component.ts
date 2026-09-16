import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { PHONE_OPERATOR_LABEL, PHONE_STATUS_LABEL, Phone, formatCurrency } from '../../../../../../core/models';
import { BadgeComponent, BadgeTone, EmptyStateComponent, IconComponent } from '../../../../../../shared/ui';

/** A `Phone` joined (client-side) with its current active sale, if any — `phones`/`phone-sales` have no server-side join, so the page assembles this itself from the two already-fetched lists. */
export interface PhoneRow extends Phone {
  saleId: string | null;
  saleDate: string | null;
  clientName: string | null;
}

const STATUS_BADGE_TONE: Record<Phone['status'], BadgeTone> = {
  DISPONIBLE: 'success',
  VENDIDO: 'neutral-dark',
};

const SKELETON_ROWS = 5;

/** Desktop `<table>` + mobile `.card-list`, same established pattern as `ProductTableComponent`/`SimSalesTableComponent`. */
@Component({
  selector: 'app-phone-table',
  standalone: true,
  imports: [BadgeComponent, IconComponent, EmptyStateComponent],
  templateUrl: './phone-table.component.html',
  styleUrl: './phone-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneTableComponent {
  @Input() rows: PhoneRow[] = [];
  @Input() loading = false;
  @Input() hasActiveFilters = false;

  @Output() viewSale = new EventEmitter<PhoneRow>();
  @Output() clearFilters = new EventEmitter<void>();

  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });

  formatCurrency = formatCurrency;
  operatorLabel = PHONE_OPERATOR_LABEL;
  statusLabel = PHONE_STATUS_LABEL;

  statusTone(row: PhoneRow): BadgeTone {
    return STATUS_BADGE_TONE[row.status];
  }

  /** Compact IMEI/SIM (last 6 digits) — the full value is always available via the native `title` tooltip. SIM numbers run ~19-20 digits, same treatment IMEI already had. */
  compactId(value: string): string {
    return value.length > 8 ? `…${value.slice(-6)}` : value;
  }
}
