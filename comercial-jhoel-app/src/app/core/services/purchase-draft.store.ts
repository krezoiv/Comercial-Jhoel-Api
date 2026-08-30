import { Injectable, computed, inject, signal } from '@angular/core';

import { Product, PurchaseDraftItem, calculatePurchaseTotal } from '../models';
import { AuthService } from './auth.service';

function todayIsoDate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

interface PersistedPurchaseDraft {
  supplierId: string;
  purchaseDate: string;
  items: PurchaseDraftItem[];
}

const STORAGE_PREFIX = 'cj_purchase_draft:';

/**
 * The in-progress "Compras" invoice, lifted out of `PurchasesPageComponent`
 * into a root-provided singleton so it survives route navigation — Angular
 * never destroys a `providedIn: 'root'` service just because its consuming
 * component unmounts, only a full page reload does that. Unlike Ventas,
 * Compras has no server-side draft to refetch (see `PurchaseDraftItem`'s own
 * doc comment — nothing is sent to the backend until "Guardar compra"), so
 * this store is the *only* place the in-progress invoice lives. Every
 * mutation is also mirrored to `sessionStorage`, scoped by the current
 * user's id, so a reload doesn't lose it either. `sessionStorage` (not
 * `localStorage`) is deliberate: it clears itself when the tab closes, so an
 * abandoned draft carrying real cost/price data doesn't linger indefinitely
 * on a shared machine.
 */
@Injectable({ providedIn: 'root' })
export class PurchaseDraftStore {
  private readonly authService = inject(AuthService);

  readonly supplierId = signal('');
  readonly purchaseDate = signal(todayIsoDate());
  readonly items = signal<PurchaseDraftItem[]>([]);

  readonly total = computed(() => calculatePurchaseTotal(this.items()));
  /** At least one product added — matches the "operación en proceso" rule used to gate the sidebar indicator and the unload warning. */
  readonly hasActiveDraft = computed(() => this.items().length > 0);

  constructor() {
    this.restore();
  }

  onProductSelected(product: Product): void {
    this.items.update((items) => {
      const existing = items.find((item) => item.productId === product.id);
      if (existing) {
        return items.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      const draftItem: PurchaseDraftItem = {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        quantity: 1,
        costPrice: product.costPrice,
        publicPrice: product.publicPrice,
      };
      return [draftItem, ...items];
    });
    this.persist();
  }

  /** `quantity` arrives already clamped (≥1) by `PurchaseItemsTableComponent` — this just applies it. */
  updateQuantity(productId: string, quantity: number): void {
    this.items.update((items) =>
      items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
    this.persist();
  }

  updateCostPrice(productId: string, costPrice: number): void {
    this.items.update((items) =>
      items.map((item) => (item.productId === productId ? { ...item, costPrice } : item)),
    );
    this.persist();
  }

  updatePublicPrice(productId: string, publicPrice: number): void {
    this.items.update((items) =>
      items.map((item) => (item.productId === productId ? { ...item, publicPrice } : item)),
    );
    this.persist();
  }

  removeItem(productId: string): void {
    this.items.update((items) => items.filter((item) => item.productId !== productId));
    this.persist();
  }

  setSupplier(supplierId: string): void {
    this.supplierId.set(supplierId);
    this.persist();
  }

  setPurchaseDate(date: string): void {
    this.purchaseDate.set(date);
    this.persist();
  }

  /**
   * The only sanctioned way to clear a draft — called after a confirmed
   * save, a confirmed cancel, or on logout. Wipes both the in-memory
   * signals and the persisted `sessionStorage` entry.
   */
  reset(): void {
    this.items.set([]);
    this.supplierId.set('');
    this.purchaseDate.set(todayIsoDate());
    this.clearStorage();
  }

  private persist(): void {
    const key = this.storageKey();
    if (!key) {
      return;
    }
    const payload: PersistedPurchaseDraft = {
      supplierId: this.supplierId(),
      purchaseDate: this.purchaseDate(),
      items: this.items(),
    };
    try {
      sessionStorage.setItem(key, JSON.stringify(payload));
    } catch {
      // Storage unavailable (private browsing, quota exceeded) — the draft
      // still works for the rest of this tab session via the signals above,
      // it just won't survive a reload. Not worth surfacing to the user.
    }
  }

  private restore(): void {
    const key = this.storageKey();
    if (!key) {
      return;
    }
    const raw = sessionStorage.getItem(key);
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as PersistedPurchaseDraft;
      this.supplierId.set(parsed.supplierId ?? '');
      this.purchaseDate.set(parsed.purchaseDate ?? todayIsoDate());
      this.items.set(Array.isArray(parsed.items) ? parsed.items : []);
    } catch {
      sessionStorage.removeItem(key);
    }
  }

  private clearStorage(): void {
    const key = this.storageKey();
    if (key) {
      sessionStorage.removeItem(key);
    }
  }

  /** `null` when nobody is logged in yet — nothing to scope a key to, so persistence is silently skipped rather than falling back to a shared/anonymous key. */
  private storageKey(): string | null {
    const userId = this.authService.currentUser()?.id;
    return userId ? `${STORAGE_PREFIX}${userId}` : null;
  }
}
