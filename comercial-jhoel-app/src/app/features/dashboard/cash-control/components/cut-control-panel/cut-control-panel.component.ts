import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import {
  CASH_CUT_NAME,
  CASH_CUT_STATUS_LABEL,
  CASH_OPENING_POLICY_LABEL,
  CashCutPeriod,
  CashPosition,
  formatCurrency,
} from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, CardComponent, IconComponent } from '../../../../../shared/ui';
import { formatDifference, formatGuatemalaDateTime, formatGuatemalaTime, formatIsoDate } from '../../cash-control.util';
import { CashCutDetailModalComponent } from '../cut-detail-modal/cut-detail-modal.component';
import { CashCutFinishModalComponent } from '../cut-finish-modal/cut-finish-modal.component';
import { CashReasonModalComponent } from '../reason-modal/reason-modal.component';

type ReasonAction = { kind: 'schedule'; period: CashCutPeriod } | { kind: 'reopen'; period: CashCutPeriod };

/**
 * "Configuración y control de cortes": opening of the operational day
 * (inherited cash, never invented), the two cuts with scheduled vs actual
 * times, start/finish/reopen actions and the final close of the day. Every
 * action calls the backend and replaces the whole position with the
 * response (`changed`) — no state is derived locally. Buttons are hidden by
 * role for UX; the API enforces RBAC independently.
 */
@Component({
  selector: 'app-cash-cut-control-panel',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    CardComponent,
    IconComponent,
    DecimalInputDirective,
    CashCutFinishModalComponent,
    CashCutDetailModalComponent,
    CashReasonModalComponent,
  ],
  templateUrl: './cut-control-panel.component.html',
  styleUrl: './cut-control-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashCutControlPanelComponent implements OnChanges {
  @Input({ required: true }) position!: CashPosition;
  @Input() canManage = false;
  @Input() isAdmin = false;

  @Output() changed = new EventEmitter<CashPosition>();

  private readonly service = inject(CashControlService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly cutName = CASH_CUT_NAME;
  readonly statusLabel = CASH_CUT_STATUS_LABEL;
  readonly policyLabel = CASH_OPENING_POLICY_LABEL;
  readonly formatCurrency = formatCurrency;
  readonly formatDifference = formatDifference;
  readonly formatTime = formatGuatemalaTime;
  readonly formatDateTime = (iso: string | null) => (iso ? formatGuatemalaDateTime(iso) : '—');
  readonly formatIsoDate = formatIsoDate;

  // Opening form (only while the day has no opening).
  readonly firstStart = signal('07:00');
  readonly firstEnd = signal('13:00');
  readonly secondStart = signal('13:00');
  readonly secondEnd = signal('19:00');
  readonly manualOpening = signal(false);
  readonly manualAmount = signal<number | null>(null);
  readonly manualReason = signal('');

  /** Editable schedule per cut id (HH:mm in Guatemala). */
  readonly scheduleDraft = signal<Record<string, { start: string; end: string }>>({});
  readonly busy = signal(false);
  readonly finishPeriod = signal<CashCutPeriod | null>(null);
  readonly detailPeriodId = signal<string | null>(null);
  readonly reasonAction = signal<ReasonAction | null>(null);
  readonly closeObservations = signal('');

  ngOnChanges(): void {
    const draft: Record<string, { start: string; end: string }> = {};
    for (const period of this.position?.periods ?? []) {
      draft[period.id] = { start: formatGuatemalaTime(period.scheduledStartAt), end: formatGuatemalaTime(period.scheduledEndAt) };
    }
    this.scheduleDraft.set(draft);
  }

  updateScheduleDraft(periodId: string, field: 'start' | 'end', value: string): void {
    this.scheduleDraft.update((draft) => ({ ...draft, [periodId]: { ...draft[periodId], [field]: value } }));
  }

  scheduleChanged(period: CashCutPeriod): boolean {
    const draft = this.scheduleDraft()[period.id];
    return (
      !!draft &&
      (draft.start !== formatGuatemalaTime(period.scheduledStartAt) || draft.end !== formatGuatemalaTime(period.scheduledEndAt))
    );
  }

  /** Same rule as the backend, for an immediate hint. */
  scheduleError(period: CashCutPeriod): string | null {
    const draft = this.scheduleDraft()[period.id];
    if (!draft?.start || !draft?.end) {
      return 'Indique ambas horas.';
    }
    if (draft.end <= draft.start) {
      return 'La hora de finalización debe ser posterior a la de inicio.';
    }
    const sibling = this.position.periods.find((row) => row.id !== period.id);
    const siblingDraft = sibling ? this.scheduleDraft()[sibling.id] : null;
    if (siblingDraft) {
      if (period.periodNumber === 1 && draft.end > siblingDraft.start) {
        return 'Se superpone con el segundo corte.';
      }
      if (period.periodNumber === 2 && draft.start < siblingDraft.end) {
        return 'Se superpone con el primer corte.';
      }
    }
    return null;
  }

  openingScheduleError(): string | null {
    if (this.firstEnd() <= this.firstStart() || this.secondEnd() <= this.secondStart()) {
      return 'La hora de finalización de cada corte debe ser posterior a su inicio.';
    }
    if (this.secondStart() < this.firstEnd()) {
      return 'El segundo corte no puede comenzar antes de que termine el primero.';
    }
    return null;
  }

  canStart(period: CashCutPeriod): boolean {
    if (period.status !== 'PROGRAMADO' || this.position.day?.status !== 'ABIERTO' || this.position.openPeriod) {
      return false;
    }
    return period.periodNumber === 1 || this.position.periods.find((row) => row.periodNumber === 1)?.status === 'FINALIZADO';
  }

  /** Only the latest finalized cut of an open day can be reopened (admin). */
  canReopen(period: CashCutPeriod): boolean {
    if (!this.isAdmin || period.status !== 'FINALIZADO' || this.position.day?.status !== 'ABIERTO' || this.position.openPeriod) {
      return false;
    }
    return period.periodNumber === 2 || this.position.periods.find((row) => row.periodNumber === 2)?.status === 'PROGRAMADO';
  }

  async openDay(): Promise<void> {
    if (this.openingScheduleError()) {
      return;
    }
    const manual = this.manualOpening() && this.isAdmin;
    const confirmed = await this.confirmDialog.confirm({
      type: 'OPEN_DAY',
      title: 'Abrir día operativo de efectivo',
      message: manual
        ? `Se abrirá con un efectivo físico autorizado de ${formatCurrency(this.manualAmount() ?? 0)}.`
        : 'El efectivo inicial será el físico contado en el último corte (o el saldo del sistema si nunca se ha contado).',
    });
    if (!confirmed) {
      return;
    }
    this.run(
      this.service.openDay({
        firstStart: this.firstStart(),
        firstEnd: this.firstEnd(),
        secondStart: this.secondStart(),
        secondEnd: this.secondEnd(),
        ...(manual ? { manualPhysicalCash: this.manualAmount() ?? 0, reason: this.manualReason().trim() } : {}),
      }),
      'Día operativo abierto.',
    );
  }

  async startCut(period: CashCutPeriod): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      type: 'OPEN_DAY',
      title: `Iniciar ${this.cutName[period.periodNumber].toLowerCase()}`,
      message: 'Se guardará la fotografía inicial de efectivo y saldos bancarios con tu usuario y la hora actual.',
    });
    if (confirmed) {
      this.run(this.service.startCut(period.id), 'Corte iniciado.');
    }
  }

  requestScheduleSave(period: CashCutPeriod): void {
    if (!this.scheduleError(period)) {
      this.reasonAction.set({ kind: 'schedule', period });
    }
  }

  onReason(reason: string): void {
    const action = this.reasonAction();
    if (!action) {
      return;
    }
    if (action.kind === 'schedule') {
      const draft = this.scheduleDraft()[action.period.id];
      this.run(this.service.updateSchedule(action.period.id, draft.start, draft.end, reason), 'Horario actualizado.');
    } else {
      this.run(this.service.reopenCut(action.period.id, reason), 'Corte reabierto.');
    }
  }

  async closeDay(): Promise<void> {
    const day = this.position.day;
    if (!day) {
      return;
    }
    const confirmed = await this.confirmDialog.confirm({
      type: 'CLOSE_DAY',
      title: 'Cierre definitivo del día',
      message: 'Se consolidarán los dos cortes. Después no se podrá reabrir ningún corte de este día.',
    });
    if (confirmed) {
      this.run(this.service.closeDay(day.id, this.closeObservations().trim() || undefined), 'Día operativo cerrado.');
    }
  }

  onFinished(position: CashPosition): void {
    this.finishPeriod.set(null);
    this.changed.emit(position);
  }

  private run(request: Observable<CashPosition>, success: string): void {
    this.busy.set(true);
    request.subscribe({
      next: (position) => {
        this.busy.set(false);
        this.reasonAction.set(null);
        this.notifications.success(success);
        this.changed.emit(position);
      },
      error: (error: HttpErrorResponse) => {
        this.busy.set(false);
        this.notifications.error(extractErrorMessage(error, 'No se pudo completar la operación.'));
      },
    });
  }
}
