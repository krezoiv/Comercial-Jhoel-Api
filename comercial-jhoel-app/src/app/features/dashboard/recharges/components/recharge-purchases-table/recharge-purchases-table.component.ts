import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { RechargePurchase, formatCurrency } from '../../../../../core/models';
import { IconComponent } from '../../../../../shared/ui';

/**
 * Dumb table over "Compras de Recargas" — every individually-registered
 * purchase for the page's operation date, with its own "Revertir" action
 * (never a physical delete/edit — see `RechargesService.voidPurchase`).
 * "Revertir" only ever renders for an admin (`isAdmin`) AND only when the
 * row's own `canRevert` says so (not already voided, cuadre cycle still
 * open) — mirrors `RechargeTableComponent`'s own admin-gated saldo final
 * re-edit pattern exactly, since this page has no route-level admin guard.
 */
@Component({
  selector: 'app-recharge-purchases-table',
  standalone: true,
  imports: [IconComponent, DatePipe],
  templateUrl: './recharge-purchases-table.component.html',
  styleUrl: './recharge-purchases-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RechargePurchasesTableComponent {
  @Input() purchases: RechargePurchase[] = [];
  @Input() loading = false;
  @Input() isAdmin = false;

  @Output() revertRequested = new EventEmitter<RechargePurchase>();

  readonly skeletonRows = [0, 1, 2];

  formatCurrency = formatCurrency;
}
