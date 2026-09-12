import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { SimSale, formatCurrency } from '../../../../../core/models';
import { IconComponent } from '../../../../../shared/ui';

/**
 * Dumb table over "Vender SIM" (por cantidad) — every quick sale for the
 * page's operation date, with its own "Revertir" action (never a physical
 * delete/edit — see `RechargeSimsService.voidSale`). Exact structural clone
 * of `RechargePurchasesTableComponent`: "Revertir" only ever renders for an
 * admin (`isAdmin`) AND only when the row's own `canRevert` says so (not
 * already voided, recharge day still open).
 */
@Component({
  selector: 'app-sim-sales-table',
  standalone: true,
  imports: [IconComponent, DatePipe],
  templateUrl: './sim-sales-table.component.html',
  styleUrl: './sim-sales-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimSalesTableComponent {
  @Input() sales: SimSale[] = [];
  @Input() loading = false;
  @Input() isAdmin = false;

  @Output() revertRequested = new EventEmitter<SimSale>();

  readonly skeletonRows = [0, 1, 2];

  formatCurrency = formatCurrency;
}
