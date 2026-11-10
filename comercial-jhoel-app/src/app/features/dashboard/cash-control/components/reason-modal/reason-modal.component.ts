import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * Small "reason required" prompt shared by Control de Efectivo's audited
 * actions (void a movement, reopen a cut, change a schedule). Dumb: the
 * parent performs the call and closes it. Minimum 5 characters, the same
 * rule the backend enforces.
 */
@Component({
  selector: 'app-cash-reason-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  template: `
    @if (open) {
      <div class="modal-backdrop" role="presentation">
        <div class="modal" role="dialog" aria-modal="true" [attr.aria-labelledby]="'reason-title'">
          <div class="modal__header">
            <h2 class="modal__title" id="reason-title">{{ title }}</h2>
            <button type="button" class="modal__close" aria-label="Cerrar" [disabled]="busy" (click)="cancelled.emit()">
              <app-icon name="close" [size]="18" />
            </button>
          </div>
          @if (message) {
            <p class="modal__text">{{ message }}</p>
          }
          <label class="field">
            <span>Motivo <em>(obligatorio, mínimo 5 caracteres)</em></span>
            <textarea rows="3" maxlength="255" [ngModel]="reason()" (ngModelChange)="reason.set($event)"></textarea>
          </label>
          <div class="modal__actions">
            <app-button variant="ghost" [disabled]="busy" (click)="cancelled.emit()">Cancelar</app-button>
            <app-button [variant]="danger ? 'danger' : 'primary'" [disabled]="busy || reason().trim().length < 5" (click)="confirmed.emit(reason().trim())">
              {{ busy ? 'Guardando…' : confirmText }}
            </app-button>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './reason-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashReasonModalComponent implements OnChanges {
  @Input() open = false;
  @Input() title = 'Indique el motivo';
  @Input() message = '';
  @Input() confirmText = 'Confirmar';
  @Input() danger = false;
  @Input() busy = false;

  @Output() confirmed = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  readonly reason = signal('');

  ngOnChanges(): void {
    if (this.open && !this.busy) {
      this.reason.set('');
    }
  }
}
