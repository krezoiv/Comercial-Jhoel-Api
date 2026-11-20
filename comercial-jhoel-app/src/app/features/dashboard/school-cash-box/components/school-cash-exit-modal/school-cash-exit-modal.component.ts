import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnInit, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

import {
  Bank,
  SCHOOL_CASH_EXIT_DESTINATIONS,
  SCHOOL_CASH_EXIT_LABEL,
  SchoolCashExitDestination,
  formatCurrency,
  isSchoolCashBank,
} from '../../../../../core/models';
import { BankService } from '../../../../../core/services/bank.service';
import { SchoolCashBoxService } from '../../../../../core/services/school-cash-box.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { FocusTrapDirective } from '../../../../../shared/directives/focus-trap.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

export type ExitModalMode = 'SALIDA' | 'AJUSTE';

/**
 * Authorized money out of the Caja de Listas (SALIDA: amount, destination,
 * reason, recipient; "Depósito bancario" also raises the chosen account) or an
 * authorized adjustment (AJUSTE: entry or exit with reason — also how the
 * opening balance is loaded after counting). Exits are never booked as company
 * expenses automatically; the caja can never go below zero (backend rule).
 */
@Component({
  selector: 'app-school-cash-exit-modal',
  standalone: true,
  imports: [FormsModule, DecimalInputDirective, FocusTrapDirective, ButtonComponent, IconComponent],
  templateUrl: './school-cash-exit-modal.component.html',
  styleUrl: './school-cash-exit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCashExitModalComponent implements OnInit {
  @Input({ required: true }) mode: ExitModalMode = 'SALIDA';
  /** Cash available now (informative; the backend checks it under lock). */
  @Input() available = 0;
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  private readonly service = inject(SchoolCashBoxService);
  private readonly bankService = inject(BankService);
  private readonly notifications = inject(NotificationService);
  private readonly requestId = crypto.randomUUID();

  readonly formatCurrency = formatCurrency;
  readonly destinations = SCHOOL_CASH_EXIT_DESTINATIONS;
  readonly destinationLabel = SCHOOL_CASH_EXIT_LABEL;

  readonly amount = signal<number | null>(null);
  readonly destination = signal<SchoolCashExitDestination>('ENTREGA_ADMINISTRACION');
  readonly direction = signal<'IN' | 'OUT'>('IN');
  readonly bankId = signal('');
  readonly recipient = signal('');
  readonly reason = signal('');
  readonly reference = signal('');
  readonly banks = signal<Bank[]>([]);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  readonly isExit = computed(() => this.mode === 'SALIDA');
  readonly outgoing = computed(() => this.isExit() || this.direction() === 'OUT');
  readonly needsBank = computed(() => this.isExit() && this.destination() === 'DEPOSITO_BANCARIO');
  readonly after = computed(() => this.available + (this.outgoing() ? -1 : 1) * (this.amount() ?? 0));
  readonly problem = computed<string | null>(() => {
    const amount = this.amount() ?? 0;
    if (amount <= 0) {
      return 'Ingrese un monto mayor a cero.';
    }
    if (this.outgoing() && amount > this.available) {
      return `La caja solo tiene ${formatCurrency(this.available)}.`;
    }
    if (this.needsBank() && !this.bankId()) {
      return 'Seleccione la cuenta donde se deposita.';
    }
    if (this.reason().trim().length < 5) {
      return 'Escriba el motivo (mínimo 5 caracteres).';
    }
    return null;
  });

  ngOnInit(): void {
    if (this.isExit()) {
      this.bankService.getBanks().subscribe({ next: (list) => this.banks.set(list.filter(isSchoolCashBank)), error: () => this.banks.set([]) });
    }
  }

  save(): void {
    if (this.busy() || this.problem()) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    const amount = this.amount() ?? 0;
    const request: Observable<unknown> = this.isExit()
      ? this.service.registerExit({
          amount,
          destination: this.destination(),
          bankId: this.needsBank() ? this.bankId() : undefined,
          recipientName: this.recipient().trim() || undefined,
          reason: this.reason().trim(),
          reference: this.reference().trim() || undefined,
          clientRequestId: this.requestId,
        })
      : this.service.registerAdjustment({
          direction: this.direction(),
          amount,
          reason: this.reason().trim(),
          clientRequestId: this.requestId,
        });
    request.subscribe({
      next: () => {
        this.busy.set(false);
        this.notifications.success(this.isExit() ? `Salida de ${formatCurrency(amount)} registrada.` : `Ajuste de ${formatCurrency(amount)} registrado.`);
        this.saved.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.busy.set(false);
        this.error.set(extractErrorMessage(err, 'No se pudo registrar la operación.'));
      },
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (!event.defaultPrevented && !this.busy()) {
      event.preventDefault();
      this.closed.emit();
    }
  }
}
