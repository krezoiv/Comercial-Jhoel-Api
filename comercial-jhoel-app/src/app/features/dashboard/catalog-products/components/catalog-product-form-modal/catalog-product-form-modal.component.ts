import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

import { CatalogProduct, CatalogProductSection, Product } from '../../../../../core/models';
import { CatalogProductService } from '../../../../../core/services/catalog-product.service';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * Publicar/editar una fila de "Librería"/"Variedades y Accesorios" — nunca
 * duplica el producto: en modo creación busca un producto YA existente en
 * Inventario (búsqueda con debounce, copia local del patrón de
 * `ProductSearchComponent` de Ventas) y solo referencia su `id`; en modo
 * edición el producto es fijo (solo se edita la descripción de catálogo).
 */
@Component({
  selector: 'app-catalog-product-form-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonComponent, IconComponent],
  templateUrl: './catalog-product-form-modal.component.html',
  styleUrl: './catalog-product-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogProductFormModalComponent implements OnChanges {
  @Input() open = false;
  /** null = crear, un CatalogProduct = editar (formulario pre-llenado). */
  @Input() product: CatalogProduct | null = null;
  @Input({ required: true }) section!: CatalogProductSection;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CatalogProduct>();

  private readonly fb = inject(FormBuilder);
  private readonly catalogProductService = inject(CatalogProductService);
  private readonly inventoryService = inject(InventoryService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly selectedProduct = signal<Product | null>(null);
  readonly query = signal('');
  readonly results = signal<Product[]>([]);
  readonly searching = signal(false);
  readonly dropdownOpen = signal(false);

  readonly form = this.fb.nonNullable.group({
    catalogDescription: ['', [Validators.maxLength(2000)]],
  });

  private readonly query$ = new Subject<string>();

  constructor() {
    this.query$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((term) => {
          const trimmed = term.trim();
          if (!trimmed) {
            return of<Product[]>([]);
          }
          this.searching.set(true);
          return this.inventoryService.searchProducts(trimmed).pipe(catchError(() => of<Product[]>([])));
        }),
        takeUntilDestroyed(),
      )
      .subscribe((results) => {
        this.searching.set(false);
        this.results.set(results);
      });
  }

  get isEditMode(): boolean {
    return this.product !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open) {
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(false);
    this.selectedProduct.set(null);
    this.query.set('');
    this.results.set([]);
    this.dropdownOpen.set(false);

    this.form.reset({ catalogDescription: this.product?.catalogDescription ?? '' });
  }

  onQueryInput(value: string): void {
    this.query.set(value);
    this.dropdownOpen.set(true);
    this.query$.next(value);
    if (!value.trim()) {
      this.results.set([]);
    }
  }

  selectProduct(product: Product): void {
    this.selectedProduct.set(product);
    this.query.set(product.name);
    this.results.set([]);
    this.dropdownOpen.set(false);
  }

  clearSelectedProduct(): void {
    this.selectedProduct.set(null);
    this.query.set('');
  }

  async submit(): Promise<void> {
    this.errorMessage.set(null);

    if (!this.isEditMode && !this.selectedProduct()) {
      this.errorMessage.set('Selecciona un producto de Inventario.');
      return;
    }
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const confirmed = await this.confirmDialogService.confirm({ type: this.isEditMode ? 'UPDATE' : 'SAVE' });
    if (!confirmed) {
      return;
    }

    const raw = this.form.getRawValue();
    const catalogDescription = raw.catalogDescription.trim() || null;

    this.isSubmitting.set(true);
    const request$ = this.isEditMode
      ? this.catalogProductService.updateProduct(this.product!.id, { catalogDescription })
      : this.catalogProductService.createProduct({
          productId: this.selectedProduct()!.id,
          section: this.section,
          catalogDescription,
        });

    request$.subscribe({
      next: (product) => {
        this.isSubmitting.set(false);
        this.saved.emit(product);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo guardar la publicación. Inténtalo de nuevo.'));
      },
    });
  }

  async close(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }
    if (this.form.dirty || this.selectedProduct()) {
      const discard = await this.confirmDialogService.confirm({ type: 'CANCEL' });
      if (!discard) {
        return;
      }
    }
    this.closed.emit();
  }
}
