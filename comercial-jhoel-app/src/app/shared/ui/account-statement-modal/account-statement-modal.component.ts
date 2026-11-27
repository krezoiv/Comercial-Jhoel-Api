import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  KardexAccountService,
  KardexMovement,
  KardexMovementType,
  KardexStatement,
  PAYMENT_METHOD_LABEL,
  PortfolioCashMovement,
  PortfolioPaymentMethod,
  PortfolioRecordChange,
  cashEffectText,
  changeLines,
  movementNumber,
} from '../../../core/models';

/** Only `id`/`name` are actually needed here — a full `Client` isn't always at hand from a table row (`AccountReceivable`/`Asset` only carry `clientId`/`clientName`), and fabricating the rest would be pointless. */
export interface KardexStatementClient {
  id: string;
  name: string;
}
import { formatCurrency } from '../../../core/utils/number-format.util';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { BadgeComponent } from '../badge/badge.component';
import { DecimalInputDirective } from '../../directives/decimal-input.directive';

function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * The "Estado de Cuenta" / Kardex view — shared verbatim by Cuentas por
 * Cobrar and Activos (see `KardexAccountService`'s own doc comment): same
 * UI, same mechanics, but the two modules never share balances or
 * movements — that separation lives entirely in which concrete `service`
 * the parent page injects, each scoped to its own backend table.
 *
 * Registering a cargo/abono always shows a live saldo-anterior/monto/
 * saldo-nuevo preview and requires the global confirmation dialog
 * (`FINANCIAL_OPERATION`) before the real call fires — per the system's
 * "toda operación financiera requiere confirmación" rule. The statement
 * itself (opening balance, movements, totals) is always re-fetched from
 * the backend, never computed by summing the full history client-side.
 */
@Component({
  selector: 'app-account-statement-modal',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, ButtonComponent, IconComponent, BadgeComponent, DecimalInputDirective],
  templateUrl: './account-statement-modal.component.html',
  styleUrl: './account-statement-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountStatementModalComponent implements OnChanges {
  @Input() open = false;
  @Input() client: KardexStatementClient | null = null;
  @Input({ required: true }) service!: KardexAccountService;
  @Input() title = 'Estado de Cuenta';
  /** Only an admin may register cargos/abonos — mirrors the backend's own `@Roles('ADMIN', 'SUPER_ADMIN')` on both routes. Reading the statement is open to any authenticated role. */
  @Input() canManage = false;

  @Output() closed = new EventEmitter<void>();
  /** Fires after a successful cargo/abono — the parent's own list (Cuentas por Cobrar / Activos) grew a new row and should refetch. */
  @Output() changed = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly statement = signal<KardexStatement | null>(null);
  readonly loading = signal(false);
  readonly currentBalance = signal<number | null>(null);

  readonly dateFrom = signal('');
  readonly dateTo = signal('');

  readonly activeMovementType = signal<KardexMovementType | null>(null);
  readonly isSubmittingMovement = signal(false);
  readonly movementError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    date: [todayIsoDate(), Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    description: ['', Validators.maxLength(500)],
    /** EFECTIVO moves Caja; BANCO never does. */
    paymentMethod: ['EFECTIVO' as PortfolioPaymentMethod],
  });

  /** Voided rows stay visible (struck through, with their reason) unless hidden. */
  readonly showVoided = signal(true);
  /** Row whose change history is expanded. */
  readonly expanded = signal<string | null>(null);
  readonly changeLines = changeLines;

  formatCurrency = formatCurrency;

  /** SALDADO once the balance reaches exactly zero — the system's own nomenclature for a fully-paid account, in either module. */
  readonly isSaldado = computed(() => this.statement()?.closingBalance === 0);

  /**
   * A plain method, not a `computed()`, on purpose — `form.controls.amount.value`
   * is a Reactive Forms property, not a signal, so a `computed()` reading it
   * would never invalidate as the user types (Angular's signal graph has no
   * way to know a `FormControl`'s value changed). The template already
   * re-evaluates this on every change-detection cycle, the same way it
   * already does for the adjacent "Monto: {{ ... }}" preview line.
   */
  previewNewBalance(): number {
    const type = this.activeMovementType();
    const current = this.statement()?.closingBalance ?? 0;
    const amount = this.form.controls.amount.value || 0;
    if (!type) {
      return current;
    }
    return type === 'CARGO' ? current + amount : current - amount;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open || !this.client) {
      return;
    }
    this.dateFrom.set('');
    this.dateTo.set('');
    this.showVoided.set(true);
    this.expanded.set(null);
    this.activeMovementType.set(null);
    this.movementError.set(null);
    this.fetchStatement();
  }

  private fetchStatement(): void {
    const client = this.client;
    if (!client) {
      return;
    }
    this.loading.set(true);
    this.service
      .getStatement(client.id, {
        dateFrom: this.dateFrom() || undefined,
        dateTo: this.dateTo() || undefined,
        includeVoided: this.showVoided() ? undefined : false,
      })
      .subscribe({
        next: (statement) => {
          this.statement.set(statement);
          this.currentBalance.set(statement.closingBalance);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.notificationService.error(extractErrorMessage(error, 'No se pudo cargar el estado de cuenta.'));
        },
      });
  }

  onDateFromChange(value: string): void {
    this.dateFrom.set(value);
    this.fetchStatement();
  }

  onDateToChange(value: string): void {
    this.dateTo.set(value);
    this.fetchStatement();
  }

  onShowVoidedChange(value: boolean): void {
    this.showVoided.set(value);
    this.fetchStatement();
  }

  toggleHistory(id: string): void {
    this.expanded.update((current) => (current === id ? null : id));
  }

  /** "Efectivo · Entrada de Q200.00" — the row's Caja effect, from the backend trace. */
  cashLabel(movement: KardexMovement): string {
    const trace = movement.trace;
    if (!trace.cashTracked) {
      return 'Anterior al Control de Efectivo';
    }
    // Short label: the full one ("Banco / transferencia") does not fit the table column.
    const method = trace.paymentMethod === 'BANCO' ? 'Banco' : 'Efectivo';
    if (trace.paymentMethod === 'BANCO') {
      return `${method} · no mueve Caja`;
    }
    if (!movement.isActive) {
      return trace.movements.length ? `${method} · revertido en Caja` : `${method} · sin efecto`;
    }
    return `${method} · ${cashEffectText(trace.cashEffect)}`;
  }

  /** What one change did to Caja. */
  changeCashText(change: PortfolioRecordChange): string {
    if (!change.cashTracked) {
      return 'No movió Caja: registro anterior al Control de Efectivo.';
    }
    if (change.cashMovementIds.length === 0) {
      return 'No movió Caja.';
    }
    return `Caja: ${cashEffectText(change.cashEffectBefore)} → ${cashEffectText(change.cashEffectAfter)} (${change.cashMovementIds.length} movimiento(s) en el Kardex).`;
  }

  /** "MOV-000123 reversa −Q200.00" */
  kardexLabel(movement: PortfolioCashMovement): string {
    const sign = movement.direction === 'IN' ? '+' : movement.direction === 'OUT' ? '−' : '';
    const kind = movement.movementType === 'ANULACION' ? ' reversa' : '';
    return `${movementNumber(movement.sequence)}${kind} ${sign}${formatCurrency(movement.amount)}`;
  }

  clearDateFilters(): void {
    this.dateFrom.set('');
    this.dateTo.set('');
    this.fetchStatement();
  }

  openMovementForm(type: KardexMovementType): void {
    this.activeMovementType.set(type);
    this.movementError.set(null);
    this.form.reset({ date: todayIsoDate(), amount: 0, description: '', paymentMethod: 'EFECTIVO' });
  }

  cancelMovementForm(): void {
    this.activeMovementType.set(null);
    this.movementError.set(null);
  }

  async submitMovement(): Promise<void> {
    const type = this.activeMovementType();
    const client = this.client;
    if (!type || !client || this.form.invalid || this.isSubmittingMovement()) {
      this.form.markAllAsTouched();
      return;
    }

    const { date, amount, description, paymentMethod } = this.form.getRawValue();
    const currentBalance = this.statement()?.closingBalance ?? 0;
    const newBalance = type === 'CARGO' ? currentBalance + amount : currentBalance - amount;
    const actionLabel = type === 'CARGO' ? 'cargo' : 'abono';

    const confirmed = await this.confirmDialogService.confirm({
      type: 'FINANCIAL_OPERATION',
      title: type === 'CARGO' ? 'Confirmar registro de cargo' : 'Confirmar registro de abono',
      message:
        `Saldo anterior: ${formatCurrency(currentBalance)} · Monto: ${formatCurrency(amount)} · Saldo nuevo: ${formatCurrency(newBalance)}` +
        ` · Medio: ${PAYMENT_METHOD_LABEL[paymentMethod]}${paymentMethod === 'BANCO' ? ' (no mueve Caja)' : ' (mueve Caja)'}.` +
        ` ¿Confirma que desea registrar este ${actionLabel}?`,
    });
    if (!confirmed) {
      return;
    }

    this.movementError.set(null);
    this.isSubmittingMovement.set(true);

    const input = { date, amount, description: description.trim().replace(/\s+/g, ' ') || undefined, paymentMethod };
    const request$ = type === 'CARGO' ? this.service.registerCharge(client.id, input) : this.service.registerPayment(client.id, input);

    request$.subscribe({
      next: () => {
        this.isSubmittingMovement.set(false);
        this.activeMovementType.set(null);
        this.notificationService.success(
          type === 'CARGO' ? 'El cargo se registró correctamente.' : 'El abono se registró correctamente.',
        );
        this.fetchStatement();
        this.changed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmittingMovement.set(false);
        this.movementError.set(
          extractErrorMessage(error, `No se pudo registrar el ${actionLabel}. Inténtalo de nuevo.`),
        );
      },
    });
  }

  close(): void {
    if (this.isSubmittingMovement()) {
      return;
    }
    this.activeMovementType.set(null);
    this.closed.emit();
  }
}
