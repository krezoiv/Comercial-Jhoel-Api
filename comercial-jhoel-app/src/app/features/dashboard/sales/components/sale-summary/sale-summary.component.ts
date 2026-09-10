import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { formatCurrency } from '../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

@Component({
  selector: 'app-sale-summary',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './sale-summary.component.html',
  styleUrl: './sale-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleSummaryComponent {
  @Input() itemCount = 0;
  @Input() total = 0;
  @Input() isSaving = false;
  @Input() isCancelling = false;
  /** Free-text folio, optional — captured just before "Guardar venta". */
  @Input() invoiceNumber = '';

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() invoiceNumberChange = new EventEmitter<string>();

  formatCurrency = formatCurrency;

  get isBusy(): boolean {
    return this.isSaving || this.isCancelling;
  }

  get canSave(): boolean {
    return this.itemCount > 0 && !this.isBusy;
  }

  get canCancel(): boolean {
    return this.itemCount > 0 && !this.isBusy;
  }
}
