import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Product, Sale, SaleItem } from '../models';
import { extractErrorMessage } from '../utils/extract-error-message';
import { NotificationService } from './notification.service';
import { SalesService } from './sales.service';

/**
 * The in-progress "Ventas" receipt, lifted out of `SalesPageComponent` into
 * a root-provided singleton for two reasons: it lets a "venta en progreso"
 * indicator render outside the Ventas page (e.g. the sidebar) without an
 * extra network round-trip, and revisiting the page after navigating
 * elsewhere no longer needs to refetch `GET /sales/current` — the state
 * that call would return is already sitting in these signals, updated in
 * real time as the receipt changes.
 *
 * Unlike `PurchaseDraftStore`, this store deliberately does NOT mirror
 * itself to `sessionStorage`: the receipt is already a real,
 * server-persisted `OPEN` sale with stock already reserved (see the
 * backend's `adjust_sale_item`/`GET /sales/current`), so surviving a reload
 * by re-running the one `getCurrentSale()` call this store already makes on
 * construction is simpler and can never drift from the actual reserved
 * stock the way a client-cached copy could.
 */
@Injectable({ providedIn: 'root' })
export class SalesDraftStore {
  private readonly salesService = inject(SalesService);
  private readonly notificationService = inject(NotificationService);

  readonly items = signal<SaleItem[]>([]);
  readonly total = signal(0);
  readonly loaded = signal(false);

  /** Product ids with an in-flight adjust request — disables that row's controls so a second click can't race the first. */
  readonly pendingProductIds = signal<Set<string>>(new Set());
  readonly isSaving = signal(false);
  readonly isCancelling = signal(false);

  /** At least one product added — matches the "operación en proceso" rule used to gate the sidebar indicator and the cancel confirmation. */
  readonly hasActiveDraft = computed(() => this.items().length > 0);

  constructor() {
    this.restore();
  }

  private restore(): void {
    this.salesService.getCurrentSale().subscribe((sale) => {
      if (sale) {
        this.applySale(sale);
      }
      this.loaded.set(true);
    });
  }

  onProductSelected(product: Product): void {
    this.adjustItem(product.id, 1, product.name);
  }

  onQuantityChange(change: { productId: string; quantity: number }): void {
    const current = this.items().find((item) => item.productId === change.productId);
    if (!current) {
      return;
    }
    const delta = change.quantity - current.quantity;
    if (delta === 0) {
      return;
    }
    this.adjustItem(change.productId, delta, current.productName);
  }

  onRemoveItem(productId: string): void {
    const current = this.items().find((item) => item.productId === productId);
    if (!current) {
      return;
    }
    this.adjustItem(productId, -current.quantity, current.productName);
  }

  private adjustItem(productId: string, quantityDelta: number, productName: string): void {
    if (this.pendingProductIds().has(productId)) {
      return;
    }

    this.pendingProductIds.update((ids) => new Set(ids).add(productId));
    this.salesService.adjustSaleItem(productId, quantityDelta).subscribe({
      next: (sale) => {
        this.clearPending(productId);
        this.applySale(sale);
      },
      error: (error: HttpErrorResponse) => {
        this.clearPending(productId);
        this.notificationService.error(
          extractErrorMessage(error, `No se pudo actualizar "${productName}" en el recibo.`),
        );
      },
    });
  }

  private clearPending(productId: string): void {
    this.pendingProductIds.update((ids) => {
      const next = new Set(ids);
      next.delete(productId);
      return next;
    });
  }

  private applySale(sale: Sale): void {
    this.items.set(sale.items);
    this.total.set(sale.total);
  }

  confirmSale(): void {
    if (this.items().length === 0 || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    this.salesService.confirmSale().subscribe({
      next: () => {
        this.isSaving.set(false);
        this.items.set([]);
        this.total.set(0);
        this.notificationService.success('Venta registrada correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo registrar la venta.'));
      },
    });
  }

  cancelSale(): void {
    if (this.items().length === 0 || this.isCancelling()) {
      return;
    }

    this.isCancelling.set(true);
    this.salesService.cancelSale().subscribe({
      next: () => {
        this.isCancelling.set(false);
        this.items.set([]);
        this.total.set(0);
        this.notificationService.warning('Recibo cancelado — el inventario reservado se restauró.');
      },
      error: (error: HttpErrorResponse) => {
        this.isCancelling.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo cancelar el recibo.'));
      },
    });
  }

  /**
   * Client-side only — clears the in-memory signals so a different user
   * logging in on the same tab never sees a flash of this one's receipt.
   * Deliberately never calls `cancelSale()`: the actual `OPEN` sale stays
   * reserved on the server for this user and is restored exactly as it was
   * the next time they log back in and this store re-runs `getCurrentSale()`.
   */
  resetOnLogout(): void {
    this.items.set([]);
    this.total.set(0);
    this.pendingProductIds.set(new Set());
    this.loaded.set(false);
  }
}
