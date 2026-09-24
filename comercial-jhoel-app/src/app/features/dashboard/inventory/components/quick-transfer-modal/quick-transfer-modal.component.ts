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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject, catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

import { InventoryLocation, Product, StockByLocation, formatQuantity } from '../../../../../core/models';
import { InventoryLocationsService } from '../../../../../core/services/inventory-locations.service';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { BarcodeScannerModalComponent, ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';

/** How many suggestions the name-search dropdown shows at once. */
const MAX_SUGGESTIONS = 20;

interface QuickTransferItem {
  productId: string;
  sku: string | null;
  name: string;
  quantity: number;
  /** Capturado en el momento de agregar (desde el resultado real del backend) — `availableFor()` lee de aquí, nunca de una lista de productos potencialmente incompleta, así que el "disponible" siempre es correcto sin importar cuántos productos activos tenga el catálogo. */
  stockByLocation: StockByLocation[];
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

  @Output() closed = new EventEmitter<void>();
  @Output() completed = new EventEmitter<void>();

  @ViewChild('scanInput') private readonly scanInputRef?: ElementRef<HTMLInputElement>;

  private readonly inventoryLocationsService = inject(InventoryLocationsService);
  private readonly inventoryService = inject(InventoryService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly locations = signal<InventoryLocation[]>([]);
  readonly fromLocationId = signal('');
  readonly toLocationId = signal('');

  readonly query = signal('');
  readonly dropdownOpen = signal(false);
  readonly inputFocused = signal(false);
  readonly scannerOpen = signal(false);

  /** Resultados de la búsqueda en el backend (accent/case-insensitive, `search_normalize()`) — nunca un filtro sobre una lista de productos parcial/capada, así que un producto fuera de los primeros 200 del catálogo también aparece. */
  readonly searchResults = signal<Product[]>([]);
  readonly searching = signal(false);
  private readonly query$ = new Subject<string>();

  readonly items = signal<QuickTransferItem[]>([]);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.query$
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
    this.searchResults.set([]);
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

  /** "Disponible" para una línea del carrito — lee del `stockByLocation` capturado en el momento de agregar (ver `QuickTransferItem`), nunca de una lista de productos que podría no incluirlo. Sigue cambios de origen (recalcula por nombre de ubicación) igual que antes; ya no sigue un refetch posterior a guardar porque `items` se vacía en cada envío exitoso. */
  availableFor(item: QuickTransferItem): number {
    return item.stockByLocation.find((s) => s.locationName === this.locationName(this.fromLocationId()))?.quantity ?? 0;
  }

  insufficientFor(item: QuickTransferItem): boolean {
    return item.quantity > this.availableFor(item);
  }

  readonly hasInsufficientItem = computed(() =>
    this.items().some((item) => this.insufficientFor(item)),
  );

  /** Resultados del backend (ya acotados a `MAX_SUGGESTIONS` para la lista visible). */
  filteredProducts(): Product[] {
    return this.searchResults().slice(0, MAX_SUGGESTIONS);
  }

  onQueryInput(value: string): void {
    this.query.set(value);
    this.dropdownOpen.set(true);
    if (!value.trim()) {
      this.searchResults.set([]);
    }
    this.query$.next(value);
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
   * handler is simply what's listening for it. Goes straight to the
   * backend on every Enter (never `this.query$`'s debounced pipeline,
   * never a locally-cached product list) so a scan resolves immediately
   * and correctly regardless of how large the active catalog is — the
   * exact same root cause already fixed once for the main Inventario
   * search (a client-side-only match over a capped `LIST_LIMIT` page
   * silently missing anything outside it). An exact SKU match is always
   * preferred (what a real scan produces); a manual name search that has
   * narrowed to exactly one backend result also adds on Enter, matching
   * `ProductSearchComponent.onEnter()`'s own precedent elsewhere in this
   * app. Anything else — no match, or still-ambiguous — reports "no
   * encontrado" rather than guessing.
   */
  onQueryEnter(): void {
    const term = this.query().trim();
    if (!term) {
      return;
    }

    this.searching.set(true);
    this.inventoryService.getProducts(term).subscribe({
      next: (results) => {
        this.searching.set(false);

        const bySku = results.find((p) => (p.sku ?? '').toLowerCase() === term.toLowerCase());
        if (bySku) {
          this.addOrIncrement(bySku);
          return;
        }

        if (results.length === 1) {
          this.addOrIncrement(results[0]);
          return;
        }

        this.notificationService.error('Producto no encontrado.');
        this.clearQueryAndRefocus();
      },
      error: () => {
        this.searching.set(false);
        this.notificationService.error('No se pudo buscar el producto.');
        this.clearQueryAndRefocus();
      },
    });
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
        return [
          ...list,
          {
            productId: product.id,
            sku: product.sku,
            name: product.name,
            quantity: 1,
            stockByLocation: product.stockByLocation ?? [],
          },
        ];
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
