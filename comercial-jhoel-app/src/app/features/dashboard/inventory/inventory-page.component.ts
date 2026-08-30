import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { Business, Category, Product, getStockStatus } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../../../core/services/category.service';
import { BusinessService } from '../../../core/services/business.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
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
  private readonly categoryService = inject(CategoryService);
  private readonly businessService = inject(BusinessService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  /** ADMIN/SUPER_ADMIN only — passed down to hide add/edit/delete for USER. The backend enforces this regardless. */
  readonly isAdmin = this.authService.isAdmin;

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);

  /** Real categories from the backend, for the product form's dropdown — never hardcoded. */
  readonly categoryOptions = signal<Category[]>([]);
  /** Real businesses (líneas de negocio) from the backend, for the product form's dropdown — never hardcoded. */
  readonly businessOptions = signal<Business[]>([]);

  readonly searchTerm = signal('');
  readonly selectedCategory = signal('');
  readonly selectedBusiness = signal('');
  readonly stockFilter = signal<StockFilterValue>('all');

  readonly isFormOpen = signal(false);
  readonly editingProduct = signal<Product | null>(null);

  readonly isDeleteOpen = signal(false);
  readonly deletingProduct = signal<Product | null>(null);
  readonly isDeleting = signal(false);

  /** Distinct category names already in use — what the toolbar's filter offers. */
  readonly categories = computed(() => [...new Set(this.products().map((p) => p.category))].sort());
  /** Distinct business names already in use — what the toolbar's filter offers. */
  readonly businesses = computed(() => [...new Set(this.products().map((p) => p.business))].sort());

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();
    const business = this.selectedBusiness();
    const stockFilter = this.stockFilter();

    return this.products().filter((product) => {
      const matchesTerm =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.business.toLowerCase().includes(term) ||
        (product.sku ?? '').toLowerCase().includes(term);
      const matchesCategory = !category || product.category === category;
      const matchesBusiness = !business || product.business === business;
      const matchesStock = stockFilter === 'all' || getStockStatus(product.stock) === stockFilter;
      return matchesTerm && matchesCategory && matchesBusiness && matchesStock;
    });
  });

  readonly hasActiveFilters = computed(
    () =>
      this.searchTerm().trim().length > 0 ||
      this.selectedCategory().length > 0 ||
      this.selectedBusiness().length > 0 ||
      this.stockFilter() !== 'all'
  );

  constructor() {
    this.inventoryService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo cargar el inventario.'));
      },
    });

    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categoryOptions.set(categories),
      error: () => this.notificationService.error('No se pudieron cargar las categorías.'),
    });

    this.businessService.getBusinesses().subscribe({
      next: (businesses) => this.businessOptions.set(businesses),
      error: () => this.notificationService.error('No se pudieron cargar los negocios.'),
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
    this.inventoryService.deleteProduct(product.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.isDeleteOpen.set(false);
        this.deletingProduct.set(null);
        this.products.update((list) => list.filter((p) => p.id !== product.id));
        this.notificationService.success(`"${product.name}" se desactivó del inventario.`);
      },
      error: (error: HttpErrorResponse) => {
        this.isDeleting.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo desactivar el producto.'));
      },
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.selectedBusiness.set('');
    this.stockFilter.set('all');
  }
}
