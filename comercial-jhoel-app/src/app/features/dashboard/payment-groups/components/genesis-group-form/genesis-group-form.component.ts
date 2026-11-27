import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  computed,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { PaymentGroupDetail, PaymentGroupItemInput, formatCurrency } from '../../../../../core/models';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { PaymentGroupService } from '../../../../../core/services/payment-group.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

export const MAX_CUOTAS = 200;

/** One cuota of the receipt: correlativo (its position), credit number, client, amount and observation. */
export interface CuotaRow {
  creditNumber: string;
  client: string;
  amount: number;
  observation: string;
}

const blankRow = (): CuotaRow => ({ creditNumber: '', client: '', amount: 0, observation: '' });
const isBlank = (row: CuotaRow): boolean => !row.creditNumber.trim() && !row.client.trim() && !row.amount && !row.observation.trim();
const cents = (value: number): number => Math.round((Number(value) || 0) * 100);

/**
 * Pago grupal de Fundación Génesis: only the group's name, its total and the
 * number of cuotas, then one row per cuota (credit number, client, amount,
 * observation). The physical receipt's administrative header is not captured.
 * Count, sum and difference are checked live and saving is blocked until they
 * match; the backend re-validates everything. Saving leaves the group
 * PENDIENTE DE APROBACIÓN: nothing is booked until an admin approves it.
 * With `[group]` it corrects a group still pending approval.
 */
@Component({
  selector: 'app-genesis-group-form',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective],
  templateUrl: './genesis-group-form.component.html',
  styleUrls: ['./genesis-group-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenesisGroupFormComponent implements OnChanges {
  @Input() transactionTypeId = '';
  @Input() transactionTypeName = 'Préstamos Génesis';
  /** A group pending approval to correct (edit mode). */
  @Input() group: PaymentGroupDetail | null = null;

  @Output() saved = new EventEmitter<PaymentGroupDetail>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly service = inject(PaymentGroupService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);
  private readonly creditInputs = viewChildren<ElementRef<HTMLInputElement>>('credit');

  readonly formatCurrency = formatCurrency;
  readonly maxCuotas = MAX_CUOTAS;
  readonly name = signal('');
  readonly total = signal(0);
  readonly declaredCount = signal<number | null>(null);
  readonly rows = signal<CuotaRow[]>([blankRow()]);
  readonly note = signal('');
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly editing = signal(false);
  private requestId = crypto.randomUUID();

  readonly registered = computed(() => this.rows().length);
  readonly cuotasTotal = computed(() => this.rows().reduce((sum, row) => sum + cents(row.amount), 0) / 100);
  /** Declared total − sum of the cuotas (0 = information correct). */
  readonly difference = computed(() => (cents(this.total()) - cents(this.cuotasTotal())) / 100);
  readonly incomplete = computed(() =>
    this.rows()
      .map((row, index) => (row.creditNumber.trim() && row.client.trim().length >= 2 && cents(row.amount) > 0 ? 0 : index + 1))
      .filter((n) => n > 0),
  );
  readonly problems = computed<string[]>(() => {
    const problems: string[] = [];
    if (this.name().trim().length < 3) {
      problems.push('Escriba el nombre del grupo.');
    }
    if (cents(this.total()) <= 0) {
      problems.push('Indique el monto total del pago grupal.');
    }
    const declared = this.declaredCount();
    if (!declared || declared < 1) {
      problems.push('Indique la cantidad de cuotas.');
    } else if (declared !== this.registered()) {
      problems.push(`Se declararon ${declared} cuota(s) y hay ${this.registered()} registrada(s).`);
    }
    if (this.incomplete().length) {
      problems.push(`Complete número de crédito, cliente y monto en la(s) cuota(s) #${this.incomplete().join(', #')}.`);
    }
    if (cents(this.total()) > 0 && this.difference() !== 0) {
      problems.push(
        `La suma de las cuotas (${formatCurrency(this.cuotasTotal())}) no coincide con el monto total (${formatCurrency(this.total())}).`,
      );
    }
    return problems;
  });

  ngOnChanges(): void {
    const detail = this.group;
    this.editing.set(detail !== null);
    if (!detail) {
      return;
    }
    const items = detail.items.filter((item) => item.status !== 'ANULADO');
    this.name.set(detail.group.description);
    this.total.set(detail.group.authorizedAmount);
    this.declaredCount.set(items.length);
    this.rows.set(
      items.map((item) => ({
        creditNumber: item.creditNumber ?? '',
        client: item.reference ?? '',
        amount: item.expectedAmount,
        observation: item.observation ?? '',
      })),
    );
  }

  /** A declared count prepares that many empty rows while the table is still empty (quick entry). */
  onDeclaredCount(value: number | null): void {
    const count = value ? Math.min(Math.max(Math.trunc(Number(value)), 1), MAX_CUOTAS) : null;
    this.declaredCount.set(count);
    if (count && this.rows().every(isBlank)) {
      this.rows.set(Array.from({ length: count }, blankRow));
    }
  }

  updateRow(index: number, change: Partial<CuotaRow>): void {
    this.rows.update((rows) => rows.map((row, i) => (i === index ? { ...row, ...change } : row)));
  }

  addRow(): void {
    if (this.rows().length >= MAX_CUOTAS) {
      return;
    }
    this.rows.update((rows) => [...rows, blankRow()]);
    // Focus the new row's first cell once it is rendered.
    setTimeout(() => this.creditInputs().at(-1)?.nativeElement.focus());
  }

  removeRow(index: number): void {
    this.rows.update((rows) => (rows.length > 1 ? rows.filter((_, i) => i !== index) : [blankRow()]));
  }

  /** Enter on the last row's observation adds the next cuota. */
  onObservationEnter(index: number): void {
    if (index === this.rows().length - 1) {
      this.addRow();
    }
  }

  private items(): PaymentGroupItemInput[] {
    return this.rows().map((row) => ({
      creditNumber: row.creditNumber.trim(),
      reference: row.client.trim(),
      expectedAmount: row.amount,
      observation: row.observation.trim() || undefined,
    }));
  }

  async save(): Promise<void> {
    if (this.problems().length || this.isSaving()) {
      return;
    }
    const detail = this.group;
    const confirmed = await this.confirmDialog.confirm({
      type: 'UPDATE',
      title: detail ? `Guardar corrección de ${detail.group.code}` : 'Enviar a aprobación',
      message:
        `${this.registered()} cuota(s) por ${formatCurrency(this.total())}. Queda PENDIENTE DE APROBACIÓN: ` +
        'no modifica Caja ni el saldo de Fundación Génesis hasta que un administrador lo apruebe.',
      confirmText: detail ? 'Guardar corrección' : 'Guardar y enviar',
    });
    if (!confirmed) {
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    const request$ = detail
      ? this.service.updatePending(detail.group.id, {
          description: this.name().trim(),
          authorizedAmount: this.total(),
          declaredCount: this.declaredCount() ?? 0,
          items: this.items(),
          note: this.note().trim() || undefined,
        })
      : this.service.create({
          transactionTypeId: this.transactionTypeId,
          description: this.name().trim(),
          authorizedAmount: this.total(),
          declaredCount: this.declaredCount() ?? 0,
          items: this.items(),
          clientRequestId: this.requestId,
        });
    request$.subscribe({
      next: (result) => {
        this.isSaving.set(false);
        this.requestId = crypto.randomUUID();
        this.notifications.success(
          detail ? `Grupo ${result.group.code} corregido.` : `Pago grupal ${result.group.code} enviado a aprobación.`,
        );
        this.saved.emit(result);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo guardar el pago grupal.'));
      },
    });
  }
}
