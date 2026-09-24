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
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

import {
  InventoryLocation,
  Product,
  ProductInventoryDetail,
  ProductPresentation,
  formatQuantity,
} from '../../../../../core/models';
import { InventoryLocationsService } from '../../../../../core/services/inventory-locations.service';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { BarcodeScannerModalComponent, ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';

/** How many matches the product search dropdown shows at once — the full `products` list can be sizable, and a picker never needs to render more than a screenful of rows. */
const MAX_PRODUCT_RESULTS = 20;

/** Minimal shape needed to pre-lock the product picker — a caller that already knows exactly which product (e.g. the product detail page) doesn't need to hand over a whole `Product`. */
export type LockedProduct = Pick<Product, 'id' | 'name'>;

/**
 * "Trasladar inventario" — Bodega ↔ Vitrina (or any two active locations),
 * by any presentation, with a live conversion preview and an exact-wording
 * confirmation before the real `POST /inventory/transfers` call. Mirrors
 * `ProductFormModalComponent`'s self-contained shape (injects the service
 * directly, emits `completed`), not a dumb confirm-then-parent-calls-service
 * pair — there's real form state here (product/presentation/locations/qty)
 * a parent has no reason to own.
 */
@Component({
  selector: 'app-transfer-inventory-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonComponent,
    IconComponent,
    DecimalInputDirective,
    BarcodeScannerModalComponent,
  ],
  templateUrl: './transfer-inventory-modal.component.html',
  styleUrl: './transfer-inventory-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferInventoryModalComponent implements OnChanges {
  @Input() open = false;
  /** When set, the product picker is skipped entirely — used from the product detail page, which already knows exactly which product to transfer and shouldn't make the user search for it again. */
  @Input() lockedProduct: LockedProduct | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() completed = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly inventoryLocationsService = inject(InventoryLocationsService);
  private readonly inventoryService = inject(InventoryService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  /** Text the user has typed/scanned into the product picker — independent of `form.controls.productId`, which only holds the chosen id once a result is actually picked. */
  readonly productQuery = signal('');
  readonly productDropdownOpen = signal(false);
  readonly scannerOpen = signal(false);

  /** Resultados de la búsqueda en el backend (accent/case-insensitive) — nunca un filtro sobre una lista de productos parcial/capada a `LIST_LIMIT`, así que un producto fuera de esa primera página también aparece. */
  readonly searchResults = signal<Product[]>([]);
  readonly searching = signal(false);
  private readonly productQuery$ = new Subject<string>();
  /** El objeto completo del producto elegido — capturado directamente del resultado de búsqueda en el momento de elegirlo, nunca re-derivado de una lista que podría no incluirlo. */
  private readonly selectedProductObject = signal<Product | null>(null);

  readonly locations = signal<InventoryLocation[]>([]);
  readonly presentations = signal<ProductPresentation[]>([]);
  readonly loadingPresentations = signal(false);
  /** Fetched alongside presentations (`GET /inventory/products/:id` returns both in one call) — the source of truth for "disponible en <ubicación>" below, never guessed/cached from the product list. */
  readonly productInventory = signal<ProductInventoryDetail | null>(null);

  formatQuantity = formatQuantity;

  readonly form = this.fb.nonNullable.group({
    productId: ['', Validators.required],
    presentationId: ['', Validators.required],
    fromLocationId: ['', Validators.required],
    toLocationId: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reason: [''],
  });

  constructor() {
    this.form.controls.productId.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((productId) => this.onProductChange(productId));

    this.productQuery$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) => {
          const trimmed = term.trim();
          if (!trimmed) {
            this.searching.set(false);
            return of<Product[]>([]);
          }
          this.searching.set(true);
          return this.inventoryService.getProducts(trimmed).pipe(
            catchError(() => {
              this.notificationService.error('No se pudo buscar productos.');
              return of<Product[]>([]);
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((results) => {
        this.searching.set(false);
        this.searchResults.set(results);
      });
  }

  get selectedProduct(): Product | LockedProduct | null {
    const id = this.form.controls.productId.value;
    if (this.lockedProduct?.id === id) {
      return this.lockedProduct;
    }
    return this.selectedProductObject();
  }

  /** Resultados del backend (ya acotados a `MAX_PRODUCT_RESULTS` para la lista visible). */
  filteredProducts(): Product[] {
    return this.searchResults().slice(0, MAX_PRODUCT_RESULTS);
  }

  onProductQueryInput(value: string): void {
    this.productQuery.set(value);
    this.productDropdownOpen.set(true);
    if (this.form.controls.productId.value) {
      this.form.controls.productId.setValue('');
      this.selectedProductObject.set(null);
    }
    if (!value.trim()) {
      this.searchResults.set([]);
    }
    this.productQuery$.next(value);
  }

  onProductFocus(): void {
    if (this.productQuery().trim()) {
      this.productDropdownOpen.set(true);
    }
  }

  onProductBlur(): void {
    // Delay so a click on a result registers before the dropdown closes.
    setTimeout(() => this.productDropdownOpen.set(false), 150);
  }

  selectProduct(product: Product): void {
    this.productQuery.set(product.name);
    this.productDropdownOpen.set(false);
    this.selectedProductObject.set(product);
    this.form.controls.productId.setValue(product.id);
  }

  openScanner(): void {
    this.scannerOpen.set(true);
  }

  /**
   * Va directo al backend (nunca a `this.productQuery$`'s debounced
   * pipeline ni a una lista de productos local) para que un escaneo se
   * resuelva de inmediato y correctamente sin importar el tamaño del
   * catálogo activo — mismo motivo que `QuickTransferModalComponent`'s
   * propio `onQueryEnter()`. Prioriza un match exacto de SKU (lo que
   * produce un escaneo real); si no hay uno pero el backend devolvió
   * exactamente un resultado, también lo elige.
   */
  onBarcodeScanned(code: string): void {
    this.scannerOpen.set(false);
    this.productQuery.set(code);

    this.searching.set(true);
    this.inventoryService.getProducts(code).subscribe({
      next: (results) => {
        this.searching.set(false);
        this.searchResults.set(results);
        const bySku = results.find((p) => (p.sku ?? '').toLowerCase() === code.trim().toLowerCase());
        const match = bySku ?? (results.length === 1 ? results[0] : null);
        if (match) {
          this.selectProduct(match);
        } else {
          this.productDropdownOpen.set(true);
        }
      },
      error: () => {
        this.searching.set(false);
        this.notificationService.error('No se pudo buscar el producto.');
        this.productDropdownOpen.set(true);
      },
    });
  }

  get selectedPresentation(): ProductPresentation | null {
    const id = this.form.controls.presentationId.value;
    return this.presentations().find((p) => p.id === id) ?? null;
  }

  get conversionFactor(): number {
    return this.selectedPresentation?.conversionFactor ?? 1;
  }

  get totalBaseUnits(): number {
    const quantity = this.form.controls.quantity.value || 0;
    return quantity * this.conversionFactor;
  }

  get sameLocation(): boolean {
    const { fromLocationId, toLocationId } = this.form.getRawValue();
    return !!fromLocationId && fromLocationId === toLocationId;
  }

  /** Base-units stock currently at `locationId`, straight from `inventory_stock` (never derived from `products.stock`, which is the cross-location total). */
  stockAt(locationId: string): number {
    if (!locationId) {
      return 0;
    }
    return this.productInventory()?.stockByLocation.find((row) => row.locationId === locationId)?.quantity ?? 0;
  }

  locationNameOf(locationId: string): string {
    return this.locations().find((l) => l.id === locationId)?.name ?? '';
  }

  get fromLocationId(): string {
    return this.form.controls.fromLocationId.value;
  }

  get toLocationId(): string {
    return this.form.controls.toLocationId.value;
  }

  get fromStock(): number {
    return this.stockAt(this.fromLocationId);
  }

  get toStock(): number {
    return this.stockAt(this.toLocationId);
  }

  /** Whole presentation units (e.g. "cajas") that fit in a base-unit quantity, plus whatever doesn't evenly divide — factor 1 ("Unidad") always divides exactly, so `remainder` is always 0 in that case. */
  presentationBreakdown(baseUnits: number): { count: number; remainder: number } {
    const factor = this.conversionFactor;
    if (factor <= 1) {
      return { count: baseUnits, remainder: 0 };
    }
    return { count: Math.floor(baseUnits / factor), remainder: baseUnits % factor };
  }

  get fromBreakdown() {
    return this.presentationBreakdown(this.fromStock);
  }

  get fromAfterBaseUnits(): number {
    return this.fromStock - this.totalBaseUnits;
  }

  get toAfterBaseUnits(): number {
    return this.toStock + this.totalBaseUnits;
  }

  get fromAfterBreakdown() {
    return this.presentationBreakdown(Math.max(this.fromAfterBaseUnits, 0));
  }

  /** Client-side echo of the backend's own `INSUFFICIENT_STOCK` check — the real guard is the SQL function's `FOR UPDATE` lock, this only gives fast, clear feedback before ever calling it. */
  get insufficientStock(): boolean {
    return (
      !!this.fromLocationId &&
      !!this.selectedPresentation &&
      this.totalBaseUnits > 0 &&
      this.totalBaseUnits > this.fromStock
    );
  }

  get canPreviewTransfer(): boolean {
    return !!this.selectedProduct && !!this.selectedPresentation && !!this.fromLocationId && !this.sameLocation;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open) {
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(false);
    this.presentations.set([]);
    this.productInventory.set(null);
    this.productQuery.set(this.lockedProduct?.name ?? '');
    this.productDropdownOpen.set(false);
    this.searchResults.set([]);
    this.selectedProductObject.set(null);
    this.form.reset({
      productId: this.lockedProduct?.id ?? '',
      presentationId: '',
      fromLocationId: '',
      toLocationId: '',
      quantity: 1,
      reason: '',
    });

    this.inventoryLocationsService.getLocations().subscribe({
      next: (locations) => this.locations.set(locations.filter((l) => l.isActive)),
      error: () => this.errorMessage.set('No se pudieron cargar las ubicaciones.'),
    });
  }

  onProductChange(productId: string): void {
    this.form.controls.presentationId.setValue('');
    this.presentations.set([]);
    this.productInventory.set(null);
    if (!productId) {
      return;
    }

    this.loadingPresentations.set(true);
    this.inventoryLocationsService.getProductInventory(productId).subscribe({
      next: (detail) => {
        this.loadingPresentations.set(false);
        this.productInventory.set(detail);
        const active = detail.presentations.filter((p) => p.isActive);
        this.presentations.set(active);
        const unidad = active.find((p) => p.name === 'Unidad');
        if (unidad) {
          this.form.controls.presentationId.setValue(unidad.id);
        }
      },
      error: () => {
        this.loadingPresentations.set(false);
        this.errorMessage.set('No se pudieron cargar las presentaciones y el stock de este producto.');
      },
    });
  }

  async submit(): Promise<void> {
    this.errorMessage.set(null);

    if (this.form.invalid || this.sameLocation || this.insufficientStock || this.isSubmitting()) {
      this.form.markAllAsTouched();
      if (this.sameLocation) {
        this.errorMessage.set('El origen y el destino deben ser ubicaciones distintas.');
      } else if (this.insufficientStock) {
        this.errorMessage.set(
          `Inventario insuficiente en ${this.locationNameOf(this.fromLocationId)}. Disponible: ${formatQuantity(this.fromStock)} unidades.`,
        );
      }
      return;
    }

    const { productId, presentationId, fromLocationId, toLocationId, quantity, reason } = this.form.getRawValue();
    const product = this.selectedProduct;
    const presentation = this.selectedPresentation;
    const fromName = this.locations().find((l) => l.id === fromLocationId)?.name ?? '';
    const toName = this.locations().find((l) => l.id === toLocationId)?.name ?? '';
    const presentationLabel = quantity === 1 ? presentation?.name : `${presentation?.name}s`;

    const confirmed = await this.confirmDialogService.confirm({
      type: 'FINANCIAL_OPERATION',
      title: 'Confirmar traslado de inventario',
      message: `¿Está seguro de trasladar ${formatQuantity(quantity)} ${presentationLabel} de ${product?.name} desde ${fromName} hacia ${toName}? 1 ${presentation?.name} = ${this.conversionFactor} unidades.`,
      confirmText: 'Confirmar traslado',
    });
    if (!confirmed) {
      return;
    }

    this.isSubmitting.set(true);
    this.inventoryLocationsService
      .registerTransfer({
        productId,
        presentationId: presentationId || undefined,
        fromLocationId,
        toLocationId,
        quantity,
        reason: reason.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.completed.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar el traslado. Inténtalo de nuevo.'));
        },
      });
  }

  async close(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }
    if (this.form.dirty) {
      const discard = await this.confirmDialogService.confirm({ type: 'CANCEL' });
      if (!discard) {
        return;
      }
    }
    this.closed.emit();
  }
}
