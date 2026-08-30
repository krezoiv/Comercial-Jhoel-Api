import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/** Dumb — el padre (`BankAgentsPageComponent`) es dueño del guardado real; este modal solo confirma la intención. */
@Component({
  selector: 'app-save-balances-confirm-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './save-balances-confirm-modal.component.html',
  styleUrl: './save-balances-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveBalancesConfirmModalComponent {
  @Input() open = false;
  @Input() date = '';
  @Input() isSaving = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
