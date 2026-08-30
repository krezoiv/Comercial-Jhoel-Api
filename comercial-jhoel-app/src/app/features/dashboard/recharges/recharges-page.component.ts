import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';

import { RechargeDailyBalance, RechargeSale, RechargeType, formatCurrency } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RechargesService } from '../../../core/services/recharges.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { RechargeTableComponent, RequestFinalBalanceEvent } from './components/recharge-table/recharge-table.component';
import { RegisterPurchaseFormComponent } from './components/register-purchase-form/register-purchase-form.component';
import { FinalBalanceConfirmModalComponent } from './components/final-balance-confirm-modal/final-balance-confirm-modal.component';
import { SalesSummaryCardComponent } from './components/sales-summary-card/sales-summary-card.component';
import { RechargeSalesTableComponent } from './components/recharge-sales-table/recharge-sales-table.component';
import { RechargeSaleFormModalComponent } from './components/recharge-sale-form-modal/recharge-sale-form-modal.component';
import { RechargeSaleDeleteConfirmModalComponent } from './components/recharge-sale-delete-confirm-modal/recharge-sale-delete-confirm-modal.component';
import { ButtonComponent, CardComponent, IconComponent } from '../../../shared/ui';

/** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique as Reports' own `todayIsoDate()`. */
function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@Component({
  selector: 'app-recharges-page',
  standalone: true,
  imports: [
    RechargeTableComponent,
    RegisterPurchaseFormComponent,
    FinalBalanceConfirmModalComponent,
    SalesSummaryCardComponent,
    RechargeSalesTableComponent,
    RechargeSaleFormModalComponent,
    RechargeSaleDeleteConfirmModalComponent,
    CardComponent,
    ButtonComponent,
    IconComponent,
  ],
  templateUrl: './recharges-page.component.html',
  styleUrl: './recharges-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RechargesPageComponent {
  private readonly rechargesService = inject(RechargesService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  /** Re-editing an already-closed day is admin-only — same rule the backend enforces server-side. */
  readonly isAdmin = this.authService.isAdmin;

  /** `yyyy-MM-dd` — defaults to today; the whole page (table, compra, cuadre) is scoped to whichever date this holds. */
  readonly operationDate = signal(todayIsoDate());
  readonly maxSelectableDate = todayIsoDate();

  readonly types = signal<RechargeType[]>([]);
  readonly balances = signal<RechargeDailyBalance[]>([]);
  readonly loading = signal(true);

  readonly isFinalBalanceModalOpen = signal(false);
  readonly finalBalanceTarget = signal<RechargeDailyBalance | null>(null);
  readonly finalBalanceDraft = signal(0);
  readonly isSavingFinalBalance = signal(false);

  /** Bumped after a final-balance save OR any recarga-vendida create/edit/delete so `SalesSummaryCardComponent` refetches — those are the only actions that change a day's sale figures besides picking a different date. */
  readonly salesSummaryRefreshTick = signal(0);

  /** "Recargas Vendidas" — the individual customer top-ups for the current operation date, feeding the new table and (via `salesSummaryRefreshTick`) the Total Claro/Tigo/General cards. */
  readonly sales = signal<RechargeSale[]>([]);
  readonly salesLoading = signal(true);

  readonly isSaleModalOpen = signal(false);
  /** null = "+ Agregar Recarga" (create mode), a RechargeSale = editing that row. */
  readonly saleModalTarget = signal<RechargeSale | null>(null);

  readonly isDeleteSaleModalOpen = signal(false);
  readonly deleteSaleTarget = signal<RechargeSale | null>(null);
  readonly isDeletingSale = signal(false);

  constructor() {
    this.fetchAll();
  }

  private fetchAll(): void {
    this.loading.set(true);
    this.salesLoading.set(true);
    forkJoin({
      types: this.rechargesService.getTypes(),
      balances: this.rechargesService.getDailySummary(this.operationDate()),
      sales: this.rechargesService.getSales(this.operationDate()),
    }).subscribe({
      next: ({ types, balances, sales }) => {
        this.types.set(types);
        this.balances.set(balances);
        this.sales.set(sales);
        this.loading.set(false);
        this.salesLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.salesLoading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo cargar la información de recargas.'));
      },
    });
  }

  private fetchBalances(): void {
    this.loading.set(true);
    this.salesLoading.set(true);
    forkJoin({
      balances: this.rechargesService.getDailySummary(this.operationDate()),
      sales: this.rechargesService.getSales(this.operationDate()),
    }).subscribe({
      next: ({ balances, sales }) => {
        this.balances.set(balances);
        this.sales.set(sales);
        this.loading.set(false);
        this.salesLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.salesLoading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo cargar la información de recargas.'));
      },
    });
  }

  private fetchSales(): void {
    this.salesLoading.set(true);
    this.rechargesService.getSales(this.operationDate()).subscribe({
      next: (sales) => {
        this.sales.set(sales);
        this.salesLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.salesLoading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar las recargas vendidas.'));
      },
    });
  }

  private upsertBalance(balance: RechargeDailyBalance): void {
    this.balances.update((list) => {
      const exists = list.some((b) => b.id === balance.id);
      return exists ? list.map((b) => (b.id === balance.id ? balance : b)) : [...list, balance];
    });
  }

  /** Picking another date must never mix its data with the previously viewed one — no local merge, just a full refetch scoped to the new date. */
  onDateChange(date: string): void {
    if (date === this.operationDate()) {
      return;
    }
    this.operationDate.set(date);
    this.fetchBalances();
  }

  onPurchaseRegistered(balance: RechargeDailyBalance): void {
    this.upsertBalance(balance);
  }

  /** The backend already reset this date to a fresh cuadre cycle when the closure saved — refetch the table so saldo anterior/compra/saldo final all reflect it instead of the just-closed cycle. */
  onClosureSaved(): void {
    this.fetchBalances();
  }

  onRequestFinalBalance(event: RequestFinalBalanceEvent): void {
    this.finalBalanceTarget.set(event.balance);
    this.finalBalanceDraft.set(event.finalBalance);
    this.isFinalBalanceModalOpen.set(true);
  }

  cancelFinalBalance(): void {
    if (this.isSavingFinalBalance()) {
      return;
    }
    this.isFinalBalanceModalOpen.set(false);
    this.finalBalanceTarget.set(null);
  }

  confirmFinalBalance(): void {
    const target = this.finalBalanceTarget();
    if (!target) {
      return;
    }

    this.isSavingFinalBalance.set(true);
    this.rechargesService.registerFinalBalance(target.id, { finalBalance: this.finalBalanceDraft() }).subscribe({
      next: (balance) => {
        this.isSavingFinalBalance.set(false);
        this.isFinalBalanceModalOpen.set(false);
        this.finalBalanceTarget.set(null);
        this.upsertBalance(balance);
        this.salesSummaryRefreshTick.update((tick) => tick + 1);
        // Closing this type's saldo final locks every recarga vendida already
        // recorded under it — refetch so the table's lock icons update
        // immediately instead of only after a date change.
        this.fetchSales();
        this.notificationService.success(
          `Saldo final de ${balance.rechargeTypeName} guardado. Venta: ${formatCurrency(balance.sale ?? 0)}.`
        );
      },
      error: (error: HttpErrorResponse) => {
        this.isSavingFinalBalance.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo guardar el saldo final.'));
      },
    });
  }

  openAddSaleModal(): void {
    this.saleModalTarget.set(null);
    this.isSaleModalOpen.set(true);
  }

  openEditSaleModal(sale: RechargeSale): void {
    this.saleModalTarget.set(sale);
    this.isSaleModalOpen.set(true);
  }

  closeSaleModal(): void {
    this.isSaleModalOpen.set(false);
    this.saleModalTarget.set(null);
  }

  /** Covers both create and edit — either way the row is upserted and the cuadre cards are refreshed from real data, never computed locally. */
  onSaleSaved(sale: RechargeSale): void {
    this.sales.update((list) => {
      const exists = list.some((s) => s.id === sale.id);
      return exists ? list.map((s) => (s.id === sale.id ? sale : s)) : [sale, ...list];
    });
    this.salesSummaryRefreshTick.update((tick) => tick + 1);
    this.isSaleModalOpen.set(false);
    this.saleModalTarget.set(null);
  }

  requestDeleteSale(sale: RechargeSale): void {
    this.deleteSaleTarget.set(sale);
    this.isDeleteSaleModalOpen.set(true);
  }

  cancelDeleteSale(): void {
    if (this.isDeletingSale()) {
      return;
    }
    this.isDeleteSaleModalOpen.set(false);
    this.deleteSaleTarget.set(null);
  }

  confirmDeleteSale(): void {
    const target = this.deleteSaleTarget();
    if (!target) {
      return;
    }

    this.isDeletingSale.set(true);
    this.rechargesService.deleteSale(target.id).subscribe({
      next: () => {
        this.isDeletingSale.set(false);
        this.isDeleteSaleModalOpen.set(false);
        this.deleteSaleTarget.set(null);
        this.sales.update((list) => list.filter((s) => s.id !== target.id));
        this.salesSummaryRefreshTick.update((tick) => tick + 1);
        this.notificationService.success('Recarga eliminada correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.isDeletingSale.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo eliminar la recarga.'));
      },
    });
  }
}
