import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CuadreResultStatus, formatCurrency, getCuadreResultStatus } from '../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/** Dumb — el padre (`CuadreAgentesPageComponent`) es dueño de la llamada real a `registerReconciliation`, mismo patrón que `FinalBalanceConfirmModalComponent`. */
@Component({
  selector: 'app-agent-reconciliation-confirm-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './agent-reconciliation-confirm-modal.component.html',
  styleUrl: './agent-reconciliation-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentReconciliationConfirmModalComponent {
  @Input() open = false;
  @Input() totalCash = 0;
  @Input() totalBanks = 0;
  @Input() totalAssets = 0;
  @Input() totalAccountsReceivable = 0;
  @Input() result = 0;
  @Input() isSaving = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  formatCurrency = formatCurrency;

  get resultStatus(): CuadreResultStatus {
    return getCuadreResultStatus(this.result);
  }
}
