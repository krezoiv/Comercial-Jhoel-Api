import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { SchoolCustomerList, formatCurrency } from '../../../../core/models';
import { FocusTrapDirective } from '../../../../shared/directives/focus-trap.directive';
import { ButtonComponent, IconComponent } from '../../../../shared/ui';

/**
 * "¿A qué lista aplica el abono?" — a customer with several lists (one per
 * child) chooses explicitly; a payment is never spread over lists on its own.
 */
@Component({
  selector: 'app-customer-list-chooser',
  standalone: true,
  imports: [FocusTrapDirective, ButtonComponent, IconComponent],
  template: `
    <div class="backdrop">
      <div class="dialog dialog--collected" role="dialog" aria-modal="true" aria-labelledby="clc-title" appFocusTrap tabindex="-1">
        <header class="dialog__head">
          <h2 id="clc-title"><app-icon name="wallet" [size]="20" /> ¿A qué lista se aplica el abono?</h2>
          <button type="button" class="dialog__close" aria-label="Cerrar" (click)="closed.emit()"><app-icon name="close" [size]="18" /></button>
        </header>
        <div class="dialog__body">
          <p class="hint">{{ customerName }} tiene varias listas con saldo. El abono se aplica solo a la lista que elija.</p>
          <ul class="choices">
            @for (list of lists; track list.id; let first = $first) {
              <li>
                <button type="button" class="choice" [attr.data-autofocus]="first ? '' : null" (click)="chosen.emit(list)">
                  <span>
                    <strong>{{ list.studentName || 'Sin alumno' }}</strong>
                    <small>{{ list.quotationNumber }} · {{ list.grade }}</small>
                  </span>
                  <span class="choice__money">
                    <small>Total {{ formatCurrency(list.total) }} · abonado {{ formatCurrency(list.paid) }}</small>
                    <b>Saldo {{ formatCurrency(list.balance) }}</b>
                  </span>
                </button>
              </li>
            }
          </ul>
        </div>
        <footer class="dialog__actions">
          <app-button variant="ghost" (click)="closed.emit()">Cancelar</app-button>
        </footer>
      </div>
    </div>
  `,
  styleUrl: './customer-list-chooser.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerListChooserComponent {
  @Input({ required: true }) lists: SchoolCustomerList[] = [];
  @Input() customerName = '';
  @Output() chosen = new EventEmitter<SchoolCustomerList>();
  @Output() closed = new EventEmitter<void>();

  readonly formatCurrency = formatCurrency;

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (!event.defaultPrevented) {
      event.preventDefault();
      this.closed.emit();
    }
  }
}
