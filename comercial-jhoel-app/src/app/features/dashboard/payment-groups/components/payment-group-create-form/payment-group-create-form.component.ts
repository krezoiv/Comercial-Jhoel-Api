import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import {
  CashBalanceSnapshot,
  PaymentGroupDetail,
  TransactionBank,
  TransactionTypeCashEffect,
  formatCurrency,
} from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { PaymentGroupService } from '../../../../../core/services/payment-group.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

export const MAX_GROUP_ITEMS = 200;

interface DraftItem {
  expectedAmount: number;
  reference: string;
}

const cents = (value: number): number => Math.round((Number(value) || 0) * 100);

/**
 * "Pago grupal" inside Transaccionar: description, number of transactions,
 * authorized amount and each transaction's expected amount (not necessarily
 * equal). The backend creates the group and its N transactions, reserves the
 * authorized amount when the type takes cash out (physical cash unchanged,
 * available cash down) and re-validates everything. The figures shown here
 * are a preview; the official ones come back from the backend.
 */
@Component({
  selector: 'app-payment-group-create-form',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective],
  templateUrl: './payment-group-create-form.component.html',
  styleUrls: ['./payment-group-create-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentGroupCreateFormComponent implements OnInit {
  @Input({ required: true }) transactionTypeId!: string;
  @Input({ required: true }) transactionTypeName!: string;
  @Input() cashEffect: TransactionTypeCashEffect = 'NONE';
  /** Génesis types never use an agent bank (the Génesis line is implicit). */
  @Input() isGenesis = false;
  /** Types with a bank balance effect: agent and account were chosen in the bank picker. */
  @Input() needsAccount = false;
  @Input() transactionBankId = '';
  @Input() bankAccountId = '';
  @Input() selectedBankName = '';
  @Input() transactionBanks: TransactionBank[] = [];

  @Output() created = new EventEmitter<PaymentGroupDetail>();
  @Output() changeBank = new EventEmitter<void>();

  private readonly service = inject(PaymentGroupService);
  private readonly cashService = inject(CashControlService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly maxItems = MAX_GROUP_ITEMS;
  readonly description = signal('');
  readonly observations = signal('');
  readonly authorized = signal(0);
  readonly count = signal(1);
  readonly items = signal<DraftItem[]>([{ expectedAmount: 0, reference: '' }]);
  readonly agentId = signal('');
  readonly cash = signal<CashBalanceSnapshot | null>(null);
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private requestId = crypto.randomUUID();

  readonly reserves = computed(() => this.cashEffect === 'OUT');
  readonly assigned = computed(() => this.items().reduce((sum, item) => sum + cents(item.expectedAmount), 0) / 100);
  readonly unassigned = computed(() => (cents(this.authorized()) - cents(this.assigned())) / 100);
  /** Preview only: the backend re-checks the available cash under the Caja lock. */
  readonly availableAfter = computed(() => {
    const cash = this.cash();
    return cash ? ((cents(cash.available ?? cash.balance) - cents(this.authorized())) / 100) : null;
  });
  readonly agents = computed(() => this.transactionBanks.filter((bank) => bank.isActive && !bank.cashBoxCode));
  readonly problems = computed<string[]>(() => {
    const problems: string[] = [];
    if (this.description().trim().length < 3) {
      problems.push('Escriba el nombre o la descripción del grupo.');
    }
    if (!this.isGenesis && !(this.needsAccount ? this.transactionBankId : this.agentId())) {
      problems.push('Seleccione el banco agente.');
    }
    if (cents(this.authorized()) <= 0) {
      problems.push('Indique el monto total autorizado.');
    }
    if (this.items().some((item) => cents(item.expectedAmount) <= 0)) {
      problems.push('Cada transacción necesita su monto esperado.');
    }
    if (this.unassigned() < 0) {
      problems.push('La suma de las transacciones supera el monto autorizado.');
    }
    const available = this.availableAfter();
    if (this.reserves() && available !== null && available < 0) {
      problems.push('No hay efectivo disponible suficiente para reservar ese monto.');
    }
    return problems;
  });

  ngOnInit(): void {
    this.agentId.set(this.needsAccount ? this.transactionBankId : '');
    this.cashService.getBalance().subscribe({ next: (cash) => this.cash.set(cash), error: () => this.cash.set(null) });
  }

  onCountChange(value: number): void {
    const count = Math.min(Math.max(Math.trunc(Number(value) || 1), 1), MAX_GROUP_ITEMS);
    this.count.set(count);
    this.items.update((items) =>
      count > items.length
        ? [...items, ...Array.from({ length: count - items.length }, () => ({ expectedAmount: 0, reference: '' }))]
        : items.slice(0, count),
    );
  }

  /** Splits the authorized amount in equal parts (the last one takes the cents left). */
  splitEqually(): void {
    const total = cents(this.authorized());
    const count = this.count();
    if (total <= 0) {
      return;
    }
    const part = Math.floor(total / count);
    this.items.update((items) =>
      items.map((item, index) => ({
        ...item,
        expectedAmount: (index === count - 1 ? total - part * (count - 1) : part) / 100,
      })),
    );
  }

  updateItem(index: number, change: Partial<DraftItem>): void {
    this.items.update((items) => items.map((item, i) => (i === index ? { ...item, ...change } : item)));
  }

  async save(): Promise<void> {
    if (this.problems().length || this.isSaving()) {
      return;
    }
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: 'Crear pago grupal',
      message:
        `${this.count()} transacción(es) por ${formatCurrency(this.authorized())}.` +
        (this.reserves()
          ? ' Se RESERVA ese monto: el efectivo físico de Caja no cambia hasta confirmar cada pago, pero deja de estar disponible para otras operaciones.'
          : ' Este tipo no saca efectivo: no se reserva dinero; cada cobro confirmado entra a Caja.'),
    });
    if (!confirmed) {
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.service
      .create({
        transactionTypeId: this.transactionTypeId,
        description: this.description().trim(),
        transactionBankId: this.isGenesis ? undefined : (this.needsAccount ? this.transactionBankId : this.agentId()) || undefined,
        bankAccountId: this.isGenesis || !this.bankAccountId ? undefined : this.bankAccountId,
        authorizedAmount: this.authorized(),
        items: this.items().map((item) => ({
          expectedAmount: item.expectedAmount,
          reference: item.reference.trim() || undefined,
        })),
        observations: this.observations().trim() || undefined,
        clientRequestId: this.requestId,
      })
      .subscribe({
        next: (detail) => {
          this.isSaving.set(false);
          this.requestId = crypto.randomUUID();
          this.notifications.success(`Pago grupal ${detail.group.code} creado.`);
          this.created.emit(detail);
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo crear el pago grupal.'));
        },
      });
  }
}
