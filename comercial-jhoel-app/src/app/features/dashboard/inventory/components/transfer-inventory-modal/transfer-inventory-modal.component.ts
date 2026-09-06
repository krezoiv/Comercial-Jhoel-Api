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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  InventoryLocation,
  Product,
  ProductInventoryDetail,
  ProductPresentation,
  formatQuantity,
} from '../../../../../core/models';
import { InventoryLocationsService } from '../../../../../core/services/inventory-locations.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';

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
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective],
  templateUrl: './transfer-inventory-modal.component.html',
  styleUrl: './transfer-inventory-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferInventoryModalComponent implements OnChanges {
  @Input() open = false;
  @Input() products: Product[] = [];

  @Output() closed = new EventEmitter<void>();
  @Output() completed = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly inventoryLocationsService = inject(InventoryLocationsService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

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
  }

  get selectedProduct(): Product | null {
    const id = this.form.controls.productId.value;
    return this.products.find((p) => p.id === id) ?? null;
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
    this.form.reset({
      productId: '',
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
