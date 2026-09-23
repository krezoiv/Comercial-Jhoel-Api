import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';

import {
  SalesCashBoxMovement,
  SalesCashBoxMovementType,
  SalesRegisterBusiness,
  formatCurrency,
  formatQuantity,
} from '../../../../../core/models';
import { SalesCashBoxService } from '../../../../../core/services/sales-cash-box.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { CardComponent, IconComponent } from '../../../../../shared/ui';
import { CashBoxMovementModalComponent } from '../cash-box-movement-modal/cash-box-movement-modal.component';

/** Cycles the same 4 accent colors `FinancialIndicatorsComponent`'s metric cards already use — one color per card, never a new palette. */
const ACCENT_TONES = ['cyan', 'green', 'gold', 'blue'];

/**
 * One negocio's daily card — same `.metric-card` visual language as
 * Resumen's "Indicadores del mes" (see `FinancialIndicatorsComponent`):
 * accent top border, hero amount, Ventas/Productos footer stats. Two
 * additions on top of the daily sales figures: the collapsible product
 * breakdown (ventas de hoy) and the Caja de Ventas block (saldo acumulado
 * + Aportar/Retirar + historial reciente) — a completely independent
 * concept per negocio, not derived from "ventas del día".
 */
@Component({
  selector: 'app-sales-register-business-card',
  standalone: true,
  imports: [DatePipe, CardComponent, IconComponent, CashBoxMovementModalComponent],
  templateUrl: './business-card.component.html',
  styleUrl: './business-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesRegisterBusinessCardComponent {
  @Input({ required: true }) business!: SalesRegisterBusiness;
  @Input() accentIndex = 0;
  /** `null` while the balance is still loading — shown as "—" rather than a misleading "Q 0.00". */
  @Input() cashBoxBalance: number | null = null;
  /** ADMIN/SUPER_ADMIN only — hides Aportar/Retirar/Anular for a USER account. The backend enforces this regardless (`@Roles('ADMIN','SUPER_ADMIN')`). */
  @Input() canManageCashBox = false;

  /** Tells the parent page a movement was registered/voided, so it refetches every negocio's balance in one call — never guessed/patched locally. */
  @Output() cashBoxChanged = new EventEmitter<void>();

  private readonly cashBoxService = inject(SalesCashBoxService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly expanded = signal(false);

  readonly movementsExpanded = signal(false);
  readonly loadingMovements = signal(false);
  readonly movements = signal<SalesCashBoxMovement[]>([]);

  readonly modalOpen = signal(false);
  readonly modalMode = signal<SalesCashBoxMovementType>('CONTRIBUTION');

  formatCurrency = formatCurrency;
  formatQuantity = formatQuantity;

  get accentClass(): string {
    return `metric-card--${ACCENT_TONES[this.accentIndex % ACCENT_TONES.length]}`;
  }

  toggle(): void {
    this.expanded.update((value) => !value);
  }

  openContribute(): void {
    this.modalMode.set('CONTRIBUTION');
    this.modalOpen.set(true);
  }

  openWithdraw(): void {
    this.modalMode.set('WITHDRAWAL');
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  onMovementSaved(): void {
    this.modalOpen.set(false);
    this.cashBoxChanged.emit();
    if (this.movementsExpanded()) {
      this.fetchMovements();
    }
  }

  toggleMovements(): void {
    this.movementsExpanded.update((value) => !value);
    if (this.movementsExpanded() && this.movements().length === 0) {
      this.fetchMovements();
    }
  }

  private fetchMovements(): void {
    this.loadingMovements.set(true);
    this.cashBoxService.getMovements(this.business.businessId).subscribe({
      next: (movements) => {
        this.loadingMovements.set(false);
        this.movements.set(movements);
      },
      error: () => {
        this.loadingMovements.set(false);
        this.notificationService.error('No se pudieron cargar los movimientos de caja.');
      },
    });
  }

  async voidMovement(movement: SalesCashBoxMovement): Promise<void> {
    const confirmed = await this.confirmDialogService.confirm({
      type: 'DELETE',
      title: 'Anular movimiento de caja',
      message: `¿Anular el ${movement.movementType === 'CONTRIBUTION' ? 'aporte' : 'retiro'} de ${formatCurrency(movement.amount)}? Esta acción no se puede deshacer.`,
      confirmText: 'Anular movimiento',
    });
    if (!confirmed) {
      return;
    }

    this.cashBoxService.voidMovement(movement.id, 'Anulado desde Gestión de Caja de Ventas').subscribe({
      next: () => {
        this.notificationService.success('Movimiento anulado correctamente.');
        this.cashBoxChanged.emit();
        this.fetchMovements();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo anular el movimiento.'));
      },
    });
  }
}
