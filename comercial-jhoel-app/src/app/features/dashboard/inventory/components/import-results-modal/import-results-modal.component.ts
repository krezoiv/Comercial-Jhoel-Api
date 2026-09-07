import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ImportProductsResult } from '../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * Shows the outcome of `POST /products/import` — dumb, like
 * `DeleteConfirmModalComponent`: the parent already made the actual API
 * call by the time this opens, this only ever displays the result it got
 * back. Every row in `result.createdNames` is already a real, saved
 * product; every row in `result.skipped` never touched the database.
 */
@Component({
  selector: 'app-import-results-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './import-results-modal.component.html',
  styleUrl: './import-results-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportResultsModalComponent {
  @Input() open = false;
  @Input() result: ImportProductsResult | null = null;

  @Output() closed = new EventEmitter<void>();
}
