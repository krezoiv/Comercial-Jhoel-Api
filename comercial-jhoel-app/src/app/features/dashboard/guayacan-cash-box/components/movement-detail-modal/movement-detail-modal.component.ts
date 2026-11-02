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
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import {
  GUAYACAN_MOVEMENT_TYPE_LABEL,
  GuayacanCashMovementDetail,
  formatCurrency,
  formatQuantity,
} from '../../../../../core/models';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { GuayacanCashBoxService } from '../../../../../core/services/guayacan-cash-box.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { formatGuatemalaDateTime, formatIsoDate } from '../../guayacan-cash.util';

const VOIDABLE_TYPES = ['INGRESO', 'EGRESO', 'AJUSTE'];

/**
 * Detalle de un movimiento del Kardex (auditoría: usuario, fecha y hora,
 * saldos, desglose, operación de Transaccionar de origen) y, para admin,
 * "Anular" con motivo obligatorio. Anular nunca borra ni edita: el backend
 * marca el original ANULADO y registra el movimiento inverso. Las comisiones
 * no se anulan aquí (se revierten anulando su operación en Transaccionar).
 */
@Component({
  selector: 'app-guayacan-movement-detail-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './movement-detail-modal.component.html',
  styleUrl: './movement-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuayacanMovementDetailModalComponent implements OnChanges {
  @Input() movementId: string | null = null;
  @Input() isAdmin = false;

  @Output() closed = new EventEmitter<void>();
  /** Se anuló el movimiento — el padre recarga saldo y Kardex. */
  @Output() changed = new EventEmitter<void>();

  private readonly service = inject(GuayacanCashBoxService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  formatCurrency = formatCurrency;
  formatQuantity = formatQuantity;
  formatIsoDate = formatIsoDate;
  formatDateTime = formatGuatemalaDateTime;
  typeLabel = GUAYACAN_MOVEMENT_TYPE_LABEL;
  readonly Math = Math;

  readonly movement = signal<GuayacanCashMovementDetail | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly voiding = signal(false);
  readonly voidReason = signal('');
  readonly isSaving = signal(false);

  readonly canVoid = computed(() => {
    const movement = this.movement();
    return (
      this.isAdmin && movement !== null && movement.status === 'VIGENTE' && VOIDABLE_TYPES.includes(movement.movementType)
    );
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movementId'] && this.movementId) {
      this.load(this.movementId);
    }
  }

  private load(id: string): void {
    this.loading.set(true);
    this.movement.set(null);
    this.errorMessage.set(null);
    this.voiding.set(false);
    this.voidReason.set('');
    this.service.getMovement(id).subscribe({
      next: (movement) => {
        this.movement.set(movement);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo cargar el movimiento.'));
      },
    });
  }

  async confirmVoid(): Promise<void> {
    const movement = this.movement();
    const reason = this.voidReason().trim();
    if (!movement || reason.length < 5 || this.isSaving()) {
      return;
    }
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: 'Anular movimiento de caja',
      message: `Se registrará un movimiento inverso por ${formatCurrency(Math.abs(movement.amount))}. El movimiento original se conserva marcado como anulado.`,
      confirmText: 'Sí, anular',
      variant: 'danger',
    });
    if (!confirmed) {
      return;
    }
    this.isSaving.set(true);
    this.service.voidMovement(movement.id, reason).subscribe({
      next: (updated) => {
        this.isSaving.set(false);
        this.voiding.set(false);
        this.movement.set(updated);
        this.changed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo anular el movimiento.'));
      },
    });
  }

  close(): void {
    if (!this.isSaving()) {
      this.closed.emit();
    }
  }
}
