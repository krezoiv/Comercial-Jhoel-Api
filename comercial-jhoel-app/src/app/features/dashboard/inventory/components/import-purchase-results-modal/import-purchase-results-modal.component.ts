import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ImportPurchaseResult } from '../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * Shows the outcome of `POST /purchases/import` ("Cargar stock inicial") —
 * dumb, like `ImportResultsModalComponent` (Products' own import result):
 * the parent already made the actual API call by the time this opens, this
 * only ever displays the result it got back. Every purchase this created is
 * already real and saved; every row in `result.skipped` never touched the
 * database.
 */
@Component({
  selector: 'app-import-purchase-results-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './import-purchase-results-modal.component.html',
  styleUrl: './import-purchase-results-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportPurchaseResultsModalComponent {
  @Input() open = false;
  @Input() result: ImportPurchaseResult | null = null;

  @Output() closed = new EventEmitter<void>();
}
