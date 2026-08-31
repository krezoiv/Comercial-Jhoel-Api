import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MIN_REASON_LENGTH = 5;

/**
 * Dumb — el padre (`ClosedDaysPageComponent`) es dueño de la llamada real
 * a `ClosedDaysService.reopenDay`, mismo patrón que
 * `EntryConfirmModalComponent`/`SaveBalancesConfirmModalComponent`. El
 * motivo es obligatorio (mínimo 5 caracteres, mismo mínimo que el
 * backend) — "Confirmar Reapertura" permanece deshabilitado hasta que se
 * cumpla, para no depender solo del rechazo del servidor.
 */
@Component({
  selector: 'app-reopen-confirm-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './reopen-confirm-modal.component.html',
  styleUrl: './reopen-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReopenConfirmModalComponent implements OnChanges {
  @Input() open = false;
  @Input() date: string | null = null;
  @Input() isSaving = false;

  @Output() confirmed = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  readonly reason = signal('');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.reason.set('');
    }
  }

  get canConfirm(): boolean {
    return this.reason().trim().length >= MIN_REASON_LENGTH;
  }

  onCancel(): void {
    if (this.isSaving) {
      return;
    }
    this.reason.set('');
    this.cancelled.emit();
  }

  onConfirm(): void {
    if (!this.canConfirm || this.isSaving) {
      return;
    }
    this.confirmed.emit(this.reason().trim());
  }
}
