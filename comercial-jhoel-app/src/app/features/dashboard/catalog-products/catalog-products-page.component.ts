import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CatalogProduct, CatalogProductSection } from '../../../core/models';
import { CatalogProductService } from '../../../core/services/catalog-product.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { CatalogProductTableComponent } from './components/catalog-product-table/catalog-product-table.component';
import { CatalogProductFormModalComponent } from './components/catalog-product-form-modal/catalog-product-form-modal.component';
import { CatalogProductImageModalComponent } from './components/catalog-product-image-modal/catalog-product-image-modal.component';

type StatusFilter = 'all' | 'active' | 'inactive';

const SECTION_COPY: Record<
  CatalogProductSection,
  { icon: string; title: string; subtitle: string; emptyTitle: string; emptyDescription: string }
> = {
  LIBRERIA: {
    icon: 'book',
    title: 'Catálogo de Librería',
    subtitle:
      'Publica productos de Inventario en el catálogo informativo de Librería: imagen, descripción, orden y estado. Sin botón "Lo quiero", sin WhatsApp, sin crédito.',
    emptyTitle: 'Aún no hay productos publicados en Librería',
    emptyDescription: 'Publica el primer producto de Inventario para comenzar a construir este catálogo informativo.',
  },
  VARIEDADES_ACCESORIOS: {
    icon: 'gift',
    title: 'Variedades y Accesorios',
    subtitle:
      'Publica productos de Inventario en el catálogo de Variedades y Accesorios: imagen, descripción, orden y estado. Los clientes pueden solicitar el producto por WhatsApp — nunca ofrece crédito Krediya.',
    emptyTitle: 'Aún no hay productos publicados en Variedades y Accesorios',
    emptyDescription: 'Publica el primer producto de Inventario para comenzar a construir este catálogo.',
  },
};

/**
 * "Catálogo → Librería" / "Variedades y Accesorios" — un solo componente
 * reutilizado por ambas rutas, parametrizado por `route.data['section']`.
 * Admin-only (todo `CatalogProductsController` lo es en el backend,
 * incluido el listado, porque expone publicaciones inactivas), ya
 * `adminGuard`-gated en `app.routes.ts`.
 */
@Component({
  selector: 'app-catalog-products-page',
  standalone: true,
  imports: [
    FormsModule,
    PageHeaderComponent,
    ButtonComponent,
    IconComponent,
    CatalogProductTableComponent,
    CatalogProductFormModalComponent,
    CatalogProductImageModalComponent,
  ],
  templateUrl: './catalog-products-page.component.html',
  styleUrl: './catalog-products-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogProductsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogProductService = inject(CatalogProductService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly section: CatalogProductSection =
    (this.route.snapshot.data['section'] as CatalogProductSection) ?? 'LIBRERIA';
  readonly copy = SECTION_COPY[this.section];

  readonly products = signal<CatalogProduct[]>([]);
  readonly loading = signal(true);

  readonly searchTerm = signal('');
  readonly statusFilter = signal<StatusFilter>('all');

  readonly isFormOpen = signal(false);
  readonly editingProduct = signal<CatalogProduct | null>(null);

  readonly imageProduct = signal<CatalogProduct | null>(null);

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.products().filter((product) => {
      const matchesTerm = !term || product.productName.toLowerCase().includes(term);
      const matchesStatus =
        status === 'all' || (status === 'active' && product.isActive) || (status === 'inactive' && !product.isActive);
      return matchesTerm && matchesStatus;
    });
  });

  readonly hasActiveFilters = computed(() => this.searchTerm().trim().length > 0 || this.statusFilter() !== 'all');

  readonly statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
  ];

  constructor() {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading.set(true);
    this.catalogProductService.getProducts(this.section, true).subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar los productos del catálogo.'));
      },
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('all');
  }

  openCreateForm(): void {
    this.editingProduct.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(product: CatalogProduct): void {
    this.editingProduct.set(product);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  onProductSaved(product: CatalogProduct): void {
    const wasEditing = this.editingProduct() !== null;
    this.isFormOpen.set(false);

    this.products.update((list) =>
      wasEditing ? list.map((p) => (p.id === product.id ? product : p)) : [product, ...list],
    );

    this.notificationService.success(
      wasEditing ? `"${product.productName}" se actualizó correctamente.` : `"${product.productName}" se publicó correctamente.`,
    );

    if (!wasEditing) {
      // A una publicación recién creada le falta la imagen — se abre directo el gestor.
      this.imageProduct.set(product);
    }
  }

  openImage(product: CatalogProduct): void {
    this.imageProduct.set(product);
  }

  closeImage(): void {
    this.imageProduct.set(null);
  }

  onImageChanged(product: CatalogProduct): void {
    this.imageProduct.set(product);
    this.products.update((list) => list.map((p) => (p.id === product.id ? product : p)));
  }

  async toggleActive(product: CatalogProduct): Promise<void> {
    const activating = !product.isActive;
    const confirmed = await this.confirmDialogService.confirm({
      type: activating ? 'UPDATE' : 'DELETE',
      title: activating ? 'Activar publicación' : 'Desactivar publicación',
      message: activating
        ? `¿Desea activar "${product.productName}" en el catálogo público?`
        : `¿Desea desactivar "${product.productName}"? Se ocultará del catálogo público, pero se conservará el histórico.`,
    });
    if (!confirmed) {
      return;
    }

    const request$ = activating
      ? this.catalogProductService.activateProduct(product.id)
      : this.catalogProductService.deactivateProduct(product.id);
    request$.subscribe({
      next: () => {
        this.products.update((list) => list.map((p) => (p.id === product.id ? { ...p, isActive: activating } : p)));
        this.notificationService.success(activating ? 'Publicación activada correctamente.' : 'Publicación desactivada correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo actualizar el estado de la publicación.'));
      },
    });
  }

  moveUp(product: CatalogProduct): void {
    const list = this.products();
    const index = list.findIndex((p) => p.id === product.id);
    if (index <= 0) {
      return;
    }
    this.swapOrder(list, index, index - 1);
  }

  moveDown(product: CatalogProduct): void {
    const list = this.products();
    const index = list.findIndex((p) => p.id === product.id);
    if (index === -1 || index >= list.length - 1) {
      return;
    }
    this.swapOrder(list, index, index + 1);
  }

  private swapOrder(list: CatalogProduct[], indexA: number, indexB: number): void {
    const reordered = [...list];
    [reordered[indexA], reordered[indexB]] = [reordered[indexB], reordered[indexA]];

    const items = reordered.map((product, index) => ({ id: product.id, sortOrder: index }));
    this.catalogProductService.reorderProducts(items).subscribe({
      next: () => {
        this.products.set(reordered.map((product, index) => ({ ...product, sortOrder: index })));
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo cambiar el orden.'));
      },
    });
  }
}
