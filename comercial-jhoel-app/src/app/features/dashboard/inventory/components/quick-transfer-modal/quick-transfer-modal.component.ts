import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InventoryLocation, Product, formatQuantity, stockAt } from '../../../../../core/models';
import { InventoryLocationsService } from '../../../../../core/services/inventory-locations.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { BarcodeScannerModalComponent, ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';

/** How many suggestions the name-search dropdown shows at once — same ceiling `TransferInventoryModalComponent` already uses for its own picker. */
const MAX_SUGGESTIONS = 20;

interface QuickTransferItem {
  productId: string;
  sku: string | null;
  name: string;
  quantity: number;
}

/**
 * "Transferencia rápida" — la misma operación de `POST /inventory/transfers`
 * (una por línea, vía `POST /inventory/transfers/batch`), pero pensada para
 * escanear varios productos seguidos sin soltar el lector: un solo input,
 * Enter (el propio lector lo envía solo) agrega o incrementa la fila, el
 * input vuelve a quedar listo para el siguiente escaneo. Cada línea siempre
 * usa la presentación base del producto (unidad = unidad, sin selector de
 * presentación) — la conversión entre presentaciones sigue disponible en
 * "Trasladar inventario" (`TransferInventoryModalComponent`) para un
 * traslado puntual con esa opción; ambos llaman al mismo backend, nunca a
 * un segundo sistema de inventario.
 */
@Component({
  selector: 'app-quick-transfer-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, BarcodeScannerModalComponent],
  templateUrl: './quick-transfer-modal.component.html',
  styleUrl: './quick-transfer-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickTransferModalComponent implements OnChanges {
  @Input() open = false;
  @Input() products: Product[] = [];

  @Output() closed = new EventEmitter<void>();
  @Output() completed = new EventEmitter<void>();

  @ViewChild('scanInput') private readonly scanInputRef?: ElementRef<HTMLInputElement>;

  private readonly inventoryLocationsService = inject(InventoryLocationsService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly locations = signal<InventoryLocation[]>([]);
  readonly fromLocationId = signal('');
  readonly toLocationId = signal('');

  readonly query = signal('');
  readonly dropdownOpen = signal(false);
  readonly inputFocused = signal(false);
  readonly scannerOpen = signal(false);

  readonly items = signal<QuickTransferItem[]>([]);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  formatQuantity = formatQuantity;

  readonly sameLocation = computed(
    () => !!this.fromLocationId() && this.fromLocationId() === this.toLocationId(),
  );

  readonly totalUnits = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));

  readonly canSave = computed(
    () =>
      this.items().length > 0 &&
      !!this.fromLocationId() &&
      !!this.toLocationId() &&
      !this.sameLocation() &&
      !this.isSubmitting(),
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open) {
      return;
    }
    this.errorMessage.set(null);
    this.isSubmitting.set(false);
    this.items.set([]);
    this.query.set('');
    this.dropdownOpen.set(false);
    this.fromLocationId.set('');
    this.toLocationId.set('');

    this.inventoryLocationsService.getLocations().subscribe({
      next: (locations) => this.locations.set(locations.filter((l) => l.isActive)),
      error: () => this.errorMessage.set('No se pudieron cargar las ubicaciones.'),
    });
  }

  locationName(locationId: string): string {
    return this.locations().find((l) => l.id === locationId)?.name ?? '';
  }

  /** Live "disponible" for a cart line — read fresh from the already-loaded `products` list on every render, never cached on the item itself, so it follows origin changes and post-save refetches automatically. */
  availableFor(item: QuickTransferItem): number {
    const product = this.products.find((p) => p.id === item.productId);
    return product ? stockAt(product, this.locationName(this.fromLocationId())) : 0;
  }

  insufficientFor(item: QuickTransferItem): boolean {
    return item.quantity > this.availableFor(item);
  }

  readonly hasInsufficientItem = computed(() =>
    this.items().some((item) => this.insufficientFor(item)),
  );

  /** Client-side filter over the already-loaded `products` input — same "por SKU o nombre" matching `TransferInventoryModalComponent` already uses, no debounce/new endpoint needed. */
  filteredProducts(): Product[] {
    const term = this.query().trim().toLowerCase();
    if (!term) {
      return [];
    }
    return this.products
      .filter((p) => p.name.toLowerCase().includes(term) || (p.sku ?? '').toLowerCase().includes(term))
      .slice(0, MAX_SUGGESTIONS);
  }

  onQueryInput(value: string): void {
    this.query.set(value);
    this.dropdownOpen.set(true);
  }

  onFocus(): void {
    this.inputFocused.set(true);
    if (this.query().trim()) {
      this.dropdownOpen.set(true);
    }
  }

  onBlur(): void {
    this.inputFocused.set(false);
    // Delay so a click on a suggestion registers before the dropdown closes.
    setTimeout(() => this.dropdownOpen.set(false), 150);
  }

  /**
   * The entire "lector de código de barras" mechanism: a USB/Bluetooth
   * scanner in keyboard-wedge mode types the code and then sends its own
   * Enter automatically — the operator never touches Enter/click, this
   * handler is simply what's listening for it. An exact SKU match is
   * always tried first (what a real scan produces); a manual name search
   * that has narrowed to exactly one visible match also adds on Enter,
   * matching `ProductSearchComponent.onEnter()`'s own precedent elsewhere
   * in this app. Anything else — no match, or still-ambiguous — reports
   * "no encontrado" rather than guessing.
   */
  onQueryEnter(): void {
    const term = this.query().trim();
    if (!term) {
      return;
    }

    const bySku = this.products.find((p) => (p.sku ?? '').toLowerCase() === term.toLowerCase());
    if (bySku) {
      this.addOrIncrement(bySku);
      return;
    }

    const matches = this.filteredProducts();
    if (matches.length === 1) {
      this.addOrIncrement(matches[0]);
      return;
    }

    this.notificationService.error('Producto no encontrado.');
    this.clearQueryAndRefocus();
  }

  selectSuggestion(product: Product): void {
    this.addOrIncrement(product);
  }

  openScanner(): void {
    this.scannerOpen.set(true);
  }

  onBarcodeScanned(code: string): void {
    this.scannerOpen.set(false);
    this.query.set(code);
    this.onQueryEnter();
  }

  private addOrIncrement(product: Product): void {
    this.items.update((list) => {
      const index = list.findIndex((item) => item.productId === product.id);
      if (index === -1) {
        return [...list, { productId: product.id, sku: product.sku, name: product.name, quantity: 1 }];
      }
      const copy = [...list];
      copy[index] = { ...copy[index], quantity: copy[index].quantity + 1 };
      return copy;
    });
    this.notificationService.success(`${product.name} agregado.`);
    this.clearQueryAndRefocus();
  }

  private clearQueryAndRefocus(): void {
    this.query.set('');
    this.dropdownOpen.set(false);
    // Same tick the input is cleared — the operator's next scan must land here with zero extra clicks.
    setTimeout(() => this.scanInputRef?.nativeElement.focus(), 0);
  }

  updateQuantity(productId: string, rawValue: number | string): void {
    const quantity = Math.max(1, Math.trunc(Number(rawValue) || 1));
    this.items.update((list) =>
      list.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
  }

  removeItem(productId: string): void {
    this.items.update((list) => list.filter((item) => item.productId !== productId));
  }

  async submit(): Promise<void> {
    this.errorMessage.set(null);
    if (!this.canSave()) {
      return;
    }
    if (this.hasInsufficientItem()) {
      this.errorMessage.set('Hay productos con cantidad mayor al stock disponible en el origen.');
      return;
    }

    const fromName = this.locationName(this.fromLocationId());
    const toName = this.locationName(this.toLocationId());

    const confirmed = await this.confirmDialogService.confirm({
      type: 'FINANCIAL_OPERATION',
      title: '¿Deseas realizar esta transferencia?',
      message: `Origen: ${fromName}\nDestino: ${toName}\nProductos: ${this.items().length}\nUnidades: ${formatQuantity(this.totalUnits())}`,
      confirmText: 'Confirmar transferencia',
    });
    if (!confirmed) {
      return;
    }

    this.isSubmitting.set(true);
    this.inventoryLocationsService
      .registerTransferBatch({
        fromLocationId: this.fromLocationId(),
        toLocationId: this.toLocationId(),
        items: this.items().map((item) => ({ productId: item.productId, quantity: item.quantity })),
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.success('Transferencia realizada correctamente.');
          // Deja origen/destino elegidos (lo normal es seguir trasladando
          // entre el mismo par de ubicaciones) — solo limpia la tabla/input,
          // listo para otra tanda de escaneos sin volver a abrir el modal.
          this.items.set([]);
          this.query.set('');
          this.completed.emit();
          setTimeout(() => this.scanInputRef?.nativeElement.focus(), 0);
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            extractErrorMessage(error, 'No se pudo registrar la transferencia. Inténtalo de nuevo.'),
          );
        },
      });
  }

  async close(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }
    if (this.items().length > 0) {
      const discard = await this.confirmDialogService.confirm({
        type: 'CANCEL',
        title: 'Cancelar transferencia',
        message: 'Hay productos pendientes de transferir. ¿Deseas cancelar?',
        confirmText: 'Cancelar transferencia',
        cancelText: 'Continuar',
      });
      if (!discard) {
        return;
      }
    }
    this.closed.emit();
  }
}
