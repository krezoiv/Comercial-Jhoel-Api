import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';

import { formatSignedBankBalance, isFavorBalance } from '../../../core/utils/bank-balance.util';

/**
 * Un saldo bancario tal como lo guarda el backend: con su signo real
 * (`-Q 5,000.00`, nunca convertido a positivo). Para la línea de crédito de
 * Fundación Génesis, un negativo además se etiqueta "Saldo a favor" — la
 * etiqueta es solo visual, el número mostrado nunca cambia.
 */
@Component({
  selector: 'app-bank-balance-amount',
  standalone: true,
  template: `
    <span class="amount" [class.amount--negative]="value < 0" [class.amount--strong]="strong">{{ formatted }}</span>
    @if (favor) {
      <span class="favor-tag" title="Saldo negativo de la línea de crédito de Génesis">Saldo a favor</span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: var(--space-1) var(--space-2);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .amount--strong {
      font-weight: var(--fw-semibold);
    }
    .amount--negative {
      color: var(--color-danger-strong, var(--color-danger));
    }
    .favor-tag {
      font-size: var(--fs-xs);
      font-weight: var(--fw-semibold);
      padding: 0.1rem 0.5rem;
      border-radius: var(--radius-full);
      background: var(--color-success-soft);
      color: var(--color-success);
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankBalanceAmountComponent {
  @Input({ required: true }) value = 0;
  @Input() specialAccount: string | null = null;
  @Input({ transform: booleanAttribute }) strong = false;

  get formatted(): string {
    return formatSignedBankBalance(this.value);
  }

  get favor(): boolean {
    return isFavorBalance(this.specialAccount, this.value);
  }
}
