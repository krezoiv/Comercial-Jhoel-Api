import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

import { TransactionBank } from '../../../../../core/models';
import { CardComponent, SummaryTileComponent, SummaryTileTone } from '../../../../../shared/ui';

interface SummaryTile {
  icon: string;
  title: string;
  value: string;
  description: string;
  tone: SummaryTileTone;
}

@Component({
  selector: 'app-transaction-bank-summary',
  standalone: true,
  imports: [CardComponent, SummaryTileComponent],
  templateUrl: './transaction-bank-summary.component.html',
  styleUrl: './transaction-bank-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionBankSummaryComponent {
  private readonly transactionBanks = signal<TransactionBank[]>([]);

  @Input({ required: true })
  set data(value: TransactionBank[]) {
    this.transactionBanks.set(value);
  }

  readonly tiles = computed<SummaryTile[]>(() => {
    const transactionBanks = this.transactionBanks();
    const active = transactionBanks.filter((a) => a.isActive).length;
    const inactive = transactionBanks.length - active;

    return [
      {
        icon: 'bank',
        title: 'Total de bancos agente',
        value: `${transactionBanks.length}`,
        description: 'registrados',
        tone: 'primary',
      },
      {
        icon: 'check',
        title: 'Activos',
        value: `${active}`,
        description: 'disponibles para Transaccionar',
        tone: 'success',
      },
      {
        icon: 'x-circle',
        title: 'Inactivos',
        value: `${inactive}`,
        description: 'desactivados',
        tone: 'danger',
      },
    ];
  });
}
