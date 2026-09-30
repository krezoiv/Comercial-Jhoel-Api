import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';

import { CreditLineStatus, creditLineStatus, formatSignedBankBalance } from '../../../core/utils/bank-balance.util';

/**
 * Resumen de la línea de crédito de BI Club Empresarial: límite, saldo
 * (con su signo real), utilizado y disponible. `utilizado` y `disponible`
 * son cifras de lectura derivadas del saldo — el saldo mostrado nunca se
 * convierte a positivo. `compact` = una sola línea para tablas.
 */
@Component({
  selector: 'app-credit-line-summary',
  standalone: true,
  template: `
    @if (compact) {
      <small class="compact">
        Línea de crédito · Utilizado {{ format(status.used) }} · Disponible {{ format(status.available) }} de
        {{ format(status.limit) }}
      </small>
    } @else {
      <dl class="grid">
        <div>
          <dt>Tipo</dt>
          <dd>Línea de crédito</dd>
        </div>
        <div>
          <dt>Límite</dt>
          <dd>{{ format(status.limit) }}</dd>
        </div>
        <div>
          <dt>Saldo</dt>
          <dd [class.negative]="status.balance < 0">{{ format(status.balance) }}</dd>
        </div>
        <div>
          <dt>Utilizado</dt>
          <dd>{{ format(status.used) }}</dd>
        </div>
        <div>
          <dt>Disponible</dt>
          <dd class="available">{{ format(status.available) }}</dd>
        </div>
      </dl>
    }
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
    .compact {
      display: block;
      font-size: var(--fs-xs);
      color: var(--color-text-on-light-subtle);
      white-space: normal;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
      gap: var(--space-2) var(--space-3);
      margin: 0;
    }
    dt {
      font-size: var(--fs-xs);
      color: var(--color-text-on-light-subtle);
    }
    dd {
      margin: 0;
      font-size: var(--fs-sm);
      font-weight: var(--fw-semibold);
      font-variant-numeric: tabular-nums;
      color: var(--color-text-on-light);
    }
    .negative {
      color: var(--color-danger-strong, var(--color-danger));
    }
    .available {
      color: var(--color-success);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditLineSummaryComponent {
  @Input({ required: true }) balance = 0;
  @Input() maxBalance: number | null = null;
  @Input({ transform: booleanAttribute }) compact = false;

  readonly format = formatSignedBankBalance;

  get status(): CreditLineStatus {
    return creditLineStatus(this.balance, this.maxBalance);
  }
}
