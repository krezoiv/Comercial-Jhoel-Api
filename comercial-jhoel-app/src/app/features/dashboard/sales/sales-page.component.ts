import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Product } from '../../../core/models';
import { SalesDraftStore } from '../../../core/services/sales-draft.store';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { SaleItemsTableComponent } from './components/sale-items-table/sale-items-table.component';
import { SaleSummaryComponent } from './components/sale-summary/sale-summary.component';
import { SaleCancelConfirmModalComponent } from './components/cancel-confirm-modal/cancel-confirm-modal.component';

/**
 * All receipt state (items/total/pending/saving/cancelling) now lives in
 * `SalesDraftStore`, a root-provided singleton — this component is purely a
 * thin view over it. That's what makes navigating away (e.g. to Inventario)
 * and back lose nothing: the store isn't destroyed when this component
 * unmounts, only when the whole tab reloads, and even then its constructor
 * re-fetches the caller's own `OPEN` sale from the backend.
 */
@Component({
  selector: 'app-sales-page',
  standalone: true,
  imports: [DatePipe, ProductSearchComponent, SaleItemsTableComponent, SaleSummaryComponent, SaleCancelConfirmModalComponent],
  templateUrl: './sales-page.component.html',
  styleUrl: './sales-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesPageComponent {
  protected readonly draft = inject(SalesDraftStore);

  readonly today = signal(new Date());
  readonly isCancelConfirmOpen = signal(false);

  onProductSelected(product: Product): void {
    this.draft.onProductSelected(product);
  }

  onQuantityChange(change: { productId: string; quantity: number }): void {
    this.draft.onQuantityChange(change);
  }

  onRemoveItem(productId: string): void {
    this.draft.onRemoveItem(productId);
  }

  saveSale(): void {
    this.draft.confirmSale();
  }

  requestCancel(): void {
    if (this.draft.items().length === 0) {
      return;
    }
    this.isCancelConfirmOpen.set(true);
  }

  confirmCancel(): void {
    this.isCancelConfirmOpen.set(false);
    this.draft.cancelSale();
  }

  dismissCancel(): void {
    this.isCancelConfirmOpen.set(false);
  }
}
