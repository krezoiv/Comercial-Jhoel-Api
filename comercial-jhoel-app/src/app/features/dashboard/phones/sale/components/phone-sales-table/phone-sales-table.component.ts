import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { PHONE_OPERATOR_LABEL, PhoneSale, formatCurrency } from '../../../../../../core/models';
import { BadgeComponent, IconComponent } from '../../../../../../shared/ui';

const SKELETON_ROWS = 4;

/** Historial de ventas de teléfonos — desktop `<table>` + mobile `.card-list`, same established pattern as `SimSalesTableComponent`. */
@Component({
  selector: 'app-phone-sales-table',
  standalone: true,
  imports: [BadgeComponent, IconComponent],
  templateUrl: './phone-sales-table.component.html',
  styleUrl: './phone-sales-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneSalesTableComponent {
  @Input() sales: PhoneSale[] = [];
  @Input() loading = false;
  /** USER role can register a sale but not anular one — same UI-only gating this app uses everywhere else; the backend re-enforces it. */
  @Input() canVoid = false;

  @Output() viewDetail = new EventEmitter<PhoneSale>();
  @Output() voidSale = new EventEmitter<PhoneSale>();

  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });

  formatCurrency = formatCurrency;
  operatorLabel = PHONE_OPERATOR_LABEL;
}
