import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Product, Supplier } from '../../../core/models';
import { NotificationService } from '../../../core/services/notification.service';
import { PurchaseDraftStore } from '../../../core/services/purchase-draft.store';
import { PurchasesService } from '../../../core/services/purchases.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { PurchaseProductSearchComponent } from './components/purchase-product-search/purchase-product-search.component';
import { PurchaseItemsTableComponent } from './components/purchase-items-table/purchase-items-table.component';
import { PurchaseSummaryComponent } from './components/purchase-summary/purchase-summary.component';
import { CancelConfirmModalComponent } from './components/cancel-confirm-modal/cancel-confirm-modal.component';
import { SaveConfirmModalComponent } from './components/save-confirm-modal/save-confirm-modal.component';

/**
 * All invoice state (supplier/date/items/total) now lives in
 * `PurchaseDraftStore`, a root-provided singleton persisted to
 * `sessionStorage` — this component is purely a thin view over it. That's
 * what makes navigating away (e.g. to Inventario) and back lose nothing,
 * and what makes an accidental reload lose nothing either.
 */
@Component({
  selector: 'app-purchases-page',
  standalone: true,
  imports: [
    FormsModule,
    PurchaseProductSearchComponent,
    PurchaseItemsTableComponent,
    PurchaseSummaryComponent,
    CancelConfirmModalComponent,
    SaveConfirmModalComponent,
  ],
  templateUrl: './purchases-page.component.html',
  styleUrl: './purchases-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasesPageComponent {
  private readonly purchasesService = inject(PurchasesService);
  private readonly supplierService = inject(SupplierService);
  private readonly notificationService = inject(NotificationService);
  protected readonly draft = inject(PurchaseDraftStore);

  /** Real, active suppliers from the backend — never hardcoded. */
  readonly suppliers = signal<Supplier[]>([]);
  readonly isSaving = signal(false);

  readonly isCancelConfirmOpen = signal(false);
  readonly isSaveConfirmOpen = signal(false);

  readonly selectedSupplierName = computed(() => {
    const supplier = this.suppliers().find((s) => s.id === this.draft.supplierId());
    return supplier?.name ?? '';
  });

  /** The raw `yyyy-MM-dd` signal as a real `Date`, for the confirmation modal's display pipe. */
  readonly purchaseDateAsDate = computed(() => new Date(`${this.draft.purchaseDate()}T00:00:00`));

  constructor() {
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => this.suppliers.set(suppliers),
      error: () => this.notificationService.error('No se pudieron cargar los proveedores.'),
    });
  }

  onSupplierChange(supplierId: string): void {
    this.draft.setSupplier(supplierId);
  }

  onDateChange(date: string): void {
    this.draft.setPurchaseDate(date);
  }

  onProductSelected(product: Product): void {
    this.draft.onProductSelected(product);
  }

  onQuantityChange(change: { productId: string; quantity: number }): void {
    this.draft.updateQuantity(change.productId, change.quantity);
  }

  onCostPriceChange(change: { productId: string; costPrice: number }): void {
    this.draft.updateCostPrice(change.productId, change.costPrice);
  }

  onPublicPriceChange(change: { productId: string; publicPrice: number }): void {
    this.draft.updatePublicPrice(change.productId, change.publicPrice);
  }

  onRemoveItem(productId: string): void {
    this.draft.removeItem(productId);
  }

  requestCancel(): void {
    if (this.draft.items().length === 0) {
      return;
    }
    this.isCancelConfirmOpen.set(true);
  }

  confirmCancel(): void {
    this.isCancelConfirmOpen.set(false);
    this.draft.reset();
  }

  dismissCancel(): void {
    this.isCancelConfirmOpen.set(false);
  }

  requestSave(): void {
    if (!this.draft.supplierId() || this.draft.items().length === 0 || this.isSaving()) {
      return;
    }
    this.isSaveConfirmOpen.set(true);
  }

  dismissSaveConfirm(): void {
    if (this.isSaving()) {
      return;
    }
    this.isSaveConfirmOpen.set(false);
  }

  confirmSave(): void {
    if (this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    this.purchasesService
      .createPurchase({
        supplierId: this.draft.supplierId(),
        purchaseDate: new Date(`${this.draft.purchaseDate()}T00:00:00`).toISOString(),
        items: this.draft.items().map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          costPrice: item.costPrice,
          publicPrice: item.publicPrice,
        })),
      })
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isSaveConfirmOpen.set(false);
          this.draft.reset();
          this.notificationService.success('Compra registrada correctamente.');
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.isSaveConfirmOpen.set(false);
          this.notificationService.error(extractErrorMessage(error, 'No se pudo registrar la compra.'));
        },
      });
  }
}
