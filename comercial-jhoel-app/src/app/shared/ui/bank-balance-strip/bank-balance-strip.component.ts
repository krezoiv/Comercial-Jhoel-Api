import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { BankBalanceStripItem } from '../../../core/models';
import { BankService } from '../../../core/services/bank.service';
import { formatSignedBankBalance } from '../../../core/utils/bank-balance.util';
import { refetchOnTabVisible } from '../../../core/utils/refetch-on-tab-visible';
import { onGuayacanCashChanged } from '../../../core/services/guayacan-cash-sync.service';
import { BankBalanceAmountComponent } from '../bank-balance-amount/bank-balance-amount.component';
import { BankLogoComponent } from '../bank-logo/bank-logo.component';
import { IconComponent } from '../icon/icon.component';

/**
 * Tira de saldos (tipo navbar) — Transaccionar y Resumen. Por cuenta: logo
 * (el subido para su Banco Agente, o su sigla), nombre, saldo actual, tipo de
 * cuenta y número, con una flecha según su ÚLTIMA
 * transacción (subió o bajó el saldo). Dirección y color vienen del backend (`GET /banks/balance-strip`):
 * verde = favorable, rojo = desfavorable; para Génesis y BI Club bajar es
 * lo favorable. Se autocarga igual que `TransactionMonthlyChartComponent`,
 * y se vuelve a pedir al regresar a la pestaña.
 */
@Component({
  selector: 'app-bank-balance-strip',
  standalone: true,
  imports: [IconComponent, BankBalanceAmountComponent, BankLogoComponent],
  templateUrl: './bank-balance-strip.component.html',
  styleUrl: './bank-balance-strip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankBalanceStripComponent {
  private readonly bankService = inject(BankService);

  readonly items = signal<BankBalanceStripItem[]>([]);
  readonly loading = signal(true);
  readonly failed = signal(false);

  constructor() {
    this.load();
    refetchOnTabVisible(() => this.load());
    // El saldo de Guayacán es el efectivo de su caja: se re-lee al cambiar (aquí u otra pestaña).
    onGuayacanCashChanged(() => this.load());
  }

  /** Credit lines (Génesis, BI Club or a "crédito" account type) get a distinct type chip. */
  isCreditLine(item: BankBalanceStripItem): boolean {
    return (
      item.specialAccount === 'GENESIS' ||
      item.specialAccount === 'BI_CLUB' ||
      /cr[eé]dito/i.test(item.accountTypeName ?? '')
    );
  }

  /** Tooltip: cuánto movió el saldo la última transacción y cuándo. */
  trendLabel(item: BankBalanceStripItem): string {
    if (item.trend === 'FLAT' || !item.lastMovementAt) {
      return 'Sin transacciones registradas';
    }
    const sign = item.lastChange > 0 ? '+' : '';
    const when = new Date(item.lastMovementAt).toLocaleString('es-GT', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    return `Última transacción (${when}): ${sign}${formatSignedBankBalance(item.lastChange)}`;
  }

  load(): void {
    this.bankService.getBalanceStrip().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
        this.failed.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.failed.set(true);
      },
    });
  }
}
