import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FocusTrapDirective } from '../../../../../shared/directives/focus-trap.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * Asks the mandatory reason of an audited reversal (void a transfer, an exit
 * or an adjustment). The parent runs the request and passes back `busy` and
 * `error`, so a rejected void keeps the dialog open with the backend message.
 */
@Component({
  selector: 'app-school-cash-reason-modal',
  standalone: true,
  imports: [FormsModule, FocusTrapDirective, ButtonComponent, IconComponent],
  template: `
    <div class="backdrop">
      <div class="dialog dialog--short" role="dialog" aria-modal="true" aria-labelledby="scr-title" appFocusTrap tabindex="-1">
        <header class="dialog__head">
          <h2 id="scr-title"><app-icon name="rotate-ccw" [size]="20" /> {{ title }}</h2>
          <button type="button" class="dialog__close" aria-label="Cerrar" (click)="closed.emit()"><app-icon name="close" [size]="18" /></button>
        </header>
        <div class="dialog__body">
          <p class="hint">{{ message }}</p>
          <label class="field" for="scr-reason">
            Motivo (obligatorio)
            <textarea id="scr-reason" rows="3" maxlength="500" data-autofocus [ngModel]="reason()" (ngModelChange)="reason.set($event)"></textarea>
            <small>Mínimo 5 caracteres. Queda en la auditoría; el movimiento original no se borra.</small>
          </label>
          @if (error) {
            <p class="error" role="alert">{{ error }}</p>
          }
        </div>
        <footer class="dialog__actions">
          <app-button variant="ghost" (click)="closed.emit()">Cancelar</app-button>
          <app-button variant="danger" [disabled]="!valid() || busy" (click)="confirmed.emit(reason().trim())">
            {{ busy ? 'Anulando…' : confirmLabel }}
          </app-button>
        </footer>
      </div>
    </div>
  `,
  styleUrl: './school-cash-reason-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCashReasonModalComponent {
  @Input() title = 'Anular operación';
  @Input() message = '';
  @Input() confirmLabel = 'Anular';
  @Input() busy = false;
  @Input() error: string | null = null;
  @Output() confirmed = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  readonly reason = signal('');
  readonly valid = computed(() => this.reason().trim().length >= 5);

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (!event.defaultPrevented && !this.busy) {
      event.preventDefault();
      this.closed.emit();
    }
  }
}
