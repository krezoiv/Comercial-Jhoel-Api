import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { Product, getStockStatus } from '../../../core/models';
import { InventoryService } from '../../../core/services/inventory.service';
import { NotificationService } from '../../../core/services/notification.service';
import { InventorySummaryComponent } from './components/inventory-summary/inventory-summary.component';
import { InventoryToolbarComponent, StockFilterValue } from './components/inventory-toolbar/inventory-toolbar.component';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { ProductFormModalComponent } from './components/product-form-modal/product-form-modal.component';
import { DeleteConfirmModalComponent } from './components/delete-confirm-modal/delete-confirm-modal.component';

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: [
    InventorySummaryComponent,
    InventoryToolbarComponent,
    ProductTableComponent,
    ProductFormModalComponent,
    DeleteConfirmModalComponent,
  ],
  templateUrl: './inventory-page.component.html',
  styleUrl: './inventory-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryPageComponent {
  private readonly inventoryService = inject(InventoryService);
  private readonly notificationService = inject(NotificationService);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);

  readonly searchTerm = signal('');
  readonly selectedCategory = signal('');
  readonly stockFilter = signal<StockFilterValue>('all');

  readonly isFormOpen = signal(false);
  readonly editingProduct = signal<Product | null>(null);

  readonly isDeleteOpen = signal(false);
  readonly deletingProduct = signal<Product | null>(null);
  readonly isDeleting = signal(false);

  readonly categories = computed(() => [...new Set(this.products().map((p) => p.category))].sort());

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();
    const stockFilter = this.stockFilter();

    return this.products().filter((product) => {
      const matchesTerm =
        !term || product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term);
      const matchesCategory = !category || product.category === category;
      const matchesStock = stockFilter === 'all' || getStockStatus(product.stock) === stockFilter;
      return matchesTerm && matchesCategory && matchesStock;
    });
  });

  readonly hasActiveFilters = computed(
    () => this.searchTerm().trim().length > 0 || this.selectedCategory().length > 0 || this.stockFilter() !== 'all'
  );

  constructor() {
    this.inventoryService.getProducts().subscribe((products) => {
      this.products.set(products);
      this.loading.set(false);
    });
  }

  openCreateForm(): void {
    this.editingProduct.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(product: Product): void {
    this.editingProduct.set(product);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  onProductSaved(product: Product): void {
    const wasEditing = this.editingProduct() !== null;
    this.isFormOpen.set(false);

    this.products.update((list) =>
      wasEditing ? list.map((p) => (p.id === product.id ? product : p)) : [product, ...list]
    );

    this.notificationService.success(
      wasEditing ? `"${product.name}" se actualizó correctamente.` : `"${product.name}" se agregó al inventario.`
    );
  }

  requestDelete(product: Product): void {
    this.deletingProduct.set(product);
    this.isDeleteOpen.set(true);
  }

  cancelDelete(): void {
    this.isDeleteOpen.set(false);
    this.deletingProduct.set(null);
  }

  confirmDelete(): void {
    const product = this.deletingProduct();
    if (!product) {
      return;
    }

    this.isDeleting.set(true);
    this.inventoryService.deleteProduct(product.id).subscribe(() => {
      this.isDeleting.set(false);
      this.isDeleteOpen.set(false);
      this.deletingProduct.set(null);
      this.products.update((list) => list.filter((p) => p.id !== product.id));
      this.notificationService.success(`"${product.name}" se eliminó del inventario.`);
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.stockFilter.set('all');
  }
}
