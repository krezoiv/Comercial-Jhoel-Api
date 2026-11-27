import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  PAYMENT_GROUP_ITEM_STATUS_LABEL,
  PAYMENT_GROUP_STATUS_LABEL,
  PaymentGroupDetail,
  PaymentGroupItem,
  formatCurrency,
  groupFlowWords,
  groupStatusTone,
  itemStatusTone,
} from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { onCashChanged } from '../../../core/services/cash-control-sync.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PaymentGroupService } from '../../../core/services/payment-group.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../shared/ui';
import { formatGuatemalaDateTime, formatIsoDate } from '../cash-control/cash-control.util';
import { GenesisGroupFormComponent } from './components/genesis-group-form/genesis-group-form.component';
import { GroupCloseModalComponent } from './components/group-close-modal/group-close-modal.component';
import { GroupHistoryModalComponent } from './components/group-history-modal/group-history-modal.component';
import { GroupItemAction, GroupItemActionModalComponent } from './components/group-item-action-modal/group-item-action-modal.component';

/**
 * One group: header, the Caja panel (physical, reserved, paid, still reserved,
 * released, available — all from the backend) and its transactions, each
 * processed on its own without leaving the group. A Génesis group instead
 * waits for approval: its creator or an admin corrects it, an admin approves
 * it (every cuota is booked at once) or voids it; no per-cuota actions.
 */
@Component({
  selector: 'app-payment-group-detail-page',
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    IconComponent,
    GroupItemActionModalComponent,
    GroupHistoryModalComponent,
    GroupCloseModalComponent,
    GenesisGroupFormComponent,
  ],
  templateUrl: './payment-group-detail-page.component.html',
  styleUrls: ['./payment-group-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentGroupDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(PaymentGroupService);
  private readonly notifications = inject(NotificationService);
  private readonly auth = inject(AuthService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly formatCurrency = formatCurrency;
  readonly formatDate = formatIsoDate;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly statusLabel = PAYMENT_GROUP_STATUS_LABEL;
  readonly itemStatusLabel = PAYMENT_GROUP_ITEM_STATUS_LABEL;
  readonly groupTone = groupStatusTone;
  readonly itemTone = itemStatusTone;
  readonly isAdmin = this.auth.isAdmin;

  readonly detail = signal<PaymentGroupDetail | null>(null);
  readonly loading = signal(true);
  readonly failed = signal<string | null>(null);
  readonly action = signal<{ action: GroupItemAction; item: PaymentGroupItem } | null>(null);
  readonly history = signal<{ itemId: string | null; title: string } | null>(null);
  readonly groupModal = signal<'CLOSE' | 'VOID' | null>(null);
  readonly groupNote = signal(false);
  readonly editing = signal(false);
  readonly approving = signal(false);
  /** One per approval: a retry of the same click never books twice (the backend is idempotent too). */
  private approveRequestId = crypto.randomUUID();

  readonly isOpen = computed(() => this.detail()?.group.lifecycle === 'ABIERTO');
  readonly flow = computed(() => groupFlowWords(this.detail()?.group.cashDirection ?? 'OUT'));
  readonly reserves = computed(() => this.detail()?.group.cashDirection === 'OUT');
  /** A pending Génesis group is corrected by whoever registered it or by an admin. */
  readonly canCorrect = computed(() => {
    const detail = this.detail();
    return !!detail?.approvalCheck.pending && (this.isAdmin() || detail.group.createdBy === this.auth.currentUser()?.id);
  });

  constructor() {
    onCashChanged(() => this.load());
  }

  ngOnInit(): void {
    this.load(() => {
      if (this.route.snapshot.queryParamMap.get('accion') === 'close' && this.isAdmin() && this.isOpen()) {
        this.groupModal.set('CLOSE');
      }
    });
  }

  load(after?: () => void): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.service.get(id).subscribe({
      next: (detail) => {
        this.detail.set(detail);
        this.loading.set(false);
        after?.();
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.failed.set(extractErrorMessage(error, 'No se pudo cargar el pago grupal.'));
      },
    });
  }

  open(action: GroupItemAction, item: PaymentGroupItem): void {
    this.action.set({ action, item });
  }

  onSaved(detail: PaymentGroupDetail): void {
    this.detail.set(detail);
    this.action.set(null);
    this.groupModal.set(null);
  }

  /** A transaction still to pay can receive a (complete or partial) payment. */
  canPay(item: PaymentGroupItem): boolean {
    return this.isOpen() && item.releasedAmount === 0 && (item.status === 'PENDIENTE' || item.status === 'PARCIAL' || item.status === 'SIN_PAGO');
  }

  canResolve(item: PaymentGroupItem): boolean {
    return this.isOpen() && (item.status === 'PARCIAL' || item.status === 'SIN_PAGO') && !item.resolvedAt;
  }

  canEdit(item: PaymentGroupItem): boolean {
    return this.isOpen() && (item.status === 'PENDIENTE' || item.status === 'SIN_PAGO') && item.releasedAmount === 0;
  }

  onCorrected(detail: PaymentGroupDetail): void {
    this.detail.set(detail);
    this.editing.set(false);
  }

  /** Admin approval: books every cuota (Caja, Génesis line, transactions) in one backend transaction. */
  async approve(): Promise<void> {
    const detail = this.detail();
    if (!detail || !detail.approvalCheck.canApprove || this.approving()) {
      return;
    }
    const check = detail.approvalCheck;
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: `Aprobar ${detail.group.code}`,
      message:
        `Se contabilizan ${check.cuotaCount} cuota(s) por ${formatCurrency(check.cuotasTotal)} como operaciones de ` +
        `${detail.group.transactionTypeName}: el efectivo entra a Caja y se actualiza el saldo de Fundación Génesis. ` +
        'Una vez aprobado, el grupo ya no se puede corregir.',
      confirmText: 'Aprobar y contabilizar',
    });
    if (!confirmed) {
      return;
    }
    this.approving.set(true);
    this.service
      .approve(detail.group.id, {
        expectedAmount: detail.group.authorizedAmount,
        expectedCount: check.cuotaCount,
        clientRequestId: this.approveRequestId,
      })
      .subscribe({
        next: (updated) => {
          this.approving.set(false);
          this.approveRequestId = crypto.randomUUID();
          this.detail.set(updated);
          this.notifications.success(`${updated.group.code} aprobado: ${check.cuotaCount} cuota(s) contabilizadas.`);
        },
        error: (error: HttpErrorResponse) => {
          this.approving.set(false);
          this.notifications.error(extractErrorMessage(error, 'No se pudo aprobar el pago grupal.'));
          // The group may have changed (correction meanwhile): show the current version.
          this.load();
        },
      });
  }

  addGroupNote(note: string): void {
    const detail = this.detail();
    if (!detail || note.trim().length < 3) {
      return;
    }
    this.service.addNote(detail.group.id, note.trim()).subscribe({
      next: (updated) => {
        this.detail.set(updated);
        this.groupNote.set(false);
        this.notifications.success('Observación del grupo registrada.');
      },
      error: (error: HttpErrorResponse) => this.notifications.error(extractErrorMessage(error, 'No se pudo guardar la observación.')),
    });
  }
}
