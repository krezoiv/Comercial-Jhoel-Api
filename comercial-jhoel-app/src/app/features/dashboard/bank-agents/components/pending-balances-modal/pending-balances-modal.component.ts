import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MissingBankInfo } from '../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * Dumb — el padre (`CuadreAgentesPageComponent`) es dueño de la
 * validación y de cuándo mostrarlo. "Permanecer aquí" solo cierra el
 * modal (el bloqueo real vive en el botón "Guardar Cuadre", no aquí);
 * "Ir a registrar saldos" navega a Agentes Bancarios → Bancos, que ya
 * trabaja sobre "hoy" por defecto — la misma fecha implícita que usa
 * Cuadre Agentes, así que la fecha nunca se pierde en la navegación.
 */
@Component({
  selector: 'app-pending-balances-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent, RouterLink],
  templateUrl: './pending-balances-modal.component.html',
  styleUrl: './pending-balances-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingBalancesModalComponent {
  @Input() open = false;
  @Input() date = '';
  @Input() missingBanks: MissingBankInfo[] = [];

  @Output() dismissed = new EventEmitter<void>();
}
