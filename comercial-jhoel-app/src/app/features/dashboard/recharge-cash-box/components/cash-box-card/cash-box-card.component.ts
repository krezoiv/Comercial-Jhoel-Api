import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';

import { CashBoxBalance, CashBoxMovementRecord, formatCurrency } from '../../../../../core/models';
import { AuthService } from '../../../../../core/services/auth.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { RechargeCashBoxService } from '../../../../../core/services/recharge-cash-box.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, CardComponent, IconComponent } from '../../../../../shared/ui';
import { CashBoxWithdrawalModalComponent } from '../cash-box-withdrawal-modal/cash-box-withdrawal-modal.component';
import { CashBoxContributionModalComponent } from '../cash-box-contribution-modal/cash-box-contribution-modal.component';

/**
 * "Caja Contable" — the balance hero + today's ingresos/salidas breakdown.
 * Self-contained, like `SalesSummaryCardComponent`: fetches its own balance
 * through `RechargeCashBoxService` and reacts to `operationDate` via `ngOnChanges`
 * (never in the constructor — `@Input()` values aren't set yet there, the
 * exact gotcha that Card's own doc comment already documents for this
 * module). "+ Aporte"/"− Salida de Ganancia" are both admin-only —
 * registering/anulando either kind of manual movement is gated
 * server-side (`@Roles`), this is UX only.
 */
@Component({
  selector: 'app-recharge-cash-box-card',
  standalone: true,
  imports: [CardComponent, ButtonComponent, IconComponent, CashBoxWithdrawalModalComponent, CashBoxContributionModalComponent],
  templateUrl: './cash-box-card.component.html',
  styleUrl: './cash-box-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashBoxCardComponent implements OnChanges {
  /** `yyyy-MM-dd` — the page's operation-date picker value; the Card always reflects this date's balance. */
  @Input() operationDate = '';

  /** Bumped by the parent whenever it knows this date's underlying figures changed elsewhere (unused today — Caja Contable never shares a refresh trigger with another card, kept for symmetry with `SalesSummaryCardComponent`'s own `refreshTrigger`). */
  @Output() movementRegistered = new EventEmitter<void>();

  private readonly cashBoxService = inject(RechargeCashBoxService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  readonly isAdmin = this.authService.isAdmin;

  readonly balance = signal<CashBoxBalance | null>(null);
  readonly loading = signal(true);
  readonly withdrawalModalOpen = signal(false);
  readonly contributionModalOpen = signal(false);

  formatCurrency = formatCurrency;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['operationDate']) {
      this.fetchBalance();
    }
  }

  private fetchBalance(): void {
    this.loading.set(true);
    this.cashBoxService.getBalance(this.operationDate).subscribe({
      next: (balance) => {
        this.balance.set(balance);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo cargar la Caja Contable.'));
      },
    });
  }

  openWithdrawalModal(): void {
    this.withdrawalModalOpen.set(true);
  }

  closeWithdrawalModal(): void {
    this.withdrawalModalOpen.set(false);
  }

  openContributionModal(): void {
    this.contributionModalOpen.set(true);
  }

  closeContributionModal(): void {
    this.contributionModalOpen.set(false);
  }

  onWithdrawalSaved(_movement: CashBoxMovementRecord): void {
    this.withdrawalModalOpen.set(false);
    this.fetchBalance();
    this.movementRegistered.emit();
  }

  onContributionSaved(_movement: CashBoxMovementRecord): void {
    this.contributionModalOpen.set(false);
    this.fetchBalance();
    this.movementRegistered.emit();
  }
}
