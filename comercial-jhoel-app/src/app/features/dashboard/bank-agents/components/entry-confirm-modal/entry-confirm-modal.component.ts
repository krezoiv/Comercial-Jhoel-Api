import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * "Apertura del Día" — dumb, el padre (`BankAgentsPageComponent`) es
 * dueño de la llamada real a `POST /banks/day-status/open` al confirmar.
 * "Cancelar" solo cierra este modal; nunca navega ni borra nada, porque
 * no se aperturó nada todavía.
 */
@Component({
  selector: 'app-entry-confirm-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './entry-confirm-modal.component.html',
  styleUrl: './entry-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryConfirmModalComponent {
  @Input() open = false;
  @Input() isOpening = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
