import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { TransactionType } from '../../../../../core/models';
import { IconComponent } from '../../../../../shared/ui';
import { transactionTypeStyle } from '../../transaction-type-style';

/**
 * "Operaciones financieras" of Transaccionar: one card per active
 * transaction type with its own colour, icon, short description and action.
 * It only emits the chosen type — the page opens the operation exactly as
 * before (same `selectType`).
 */
@Component({
  selector: 'app-operation-cards',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './operation-cards.component.html',
  styleUrl: './operation-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationCardsComponent {
  readonly types = input.required<TransactionType[]>();
  readonly loading = input(false);
  /** While the bank picker of an operation is open. */
  readonly disabled = input(false);
  readonly selected = output<TransactionType>();

  readonly typeStyle = transactionTypeStyle;
  readonly skeleton = [1, 2, 3, 4, 5, 6];
}
