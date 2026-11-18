import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject, catchError, map, of, switchMap, tap, timer } from 'rxjs';

import { Category, SchoolCatalogPage, SchoolCatalogProduct, formatCurrency, roundMoney } from '../../../../../core/models';
import { CategoryService } from '../../../../../core/services/category.service';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { ReportPaginationComponent } from '../../../reports/components/report-pagination/report-pagination.component';
import { EditorLine, MAX_LINE_QUANTITY, SwapRequest, findDuplicateLine } from '../../school-line-rules';

/** Result of the modal: the swap, plus the line to merge into when the product was already listed. */
export interface ProductSwapResult {
  request: SwapRequest;
  /** Key of the line that already holds the product (its quantity grows), or null for a plain swap. */
  consolidateWith: string | null;
}

interface CatalogQuery {
  categoryId: string;
  search: string;
  page: number;
}

const PAGE_SIZE = 12;

/**
 * "Cambiar producto" of a school-list quotation line.
 *
 * Opens on the category of the product being replaced and lists only the
 * active products of that category (server-side filter and pagination over
 * the existing `GET /products`); the user may search by name or SKU, switch
 * to another active category, pick a product and adjust quantity/price. It
 * only emits the confirmed choice — the editor applies it through
 * `school-line-rules.ts`, so this component holds no business rule and never
 * touches inventory (stock only moves when the quotation is saved).
 *
 * Like every dashboard modal it does not close on a backdrop click.
 *
 * Inputs: `line` (null = closed), `lines` (for the duplicate check),
 * `canOverride` (role may change prices), `mode`. Outputs: `swapped`,
 * `manual` (turn the line into free text), `closed`.
 *
 * `mode = 'assign'` is the same catalog used by "Preparación del pedido"
 * ("Seleccionar producto de inventario"): `line` is the school requirement
 * (its text, the units to assign and its quoted price) and `lines` the
 * products already assigned to it. No price is edited there — the quoted
 * price never follows the product — and nothing moves in inventory.
 */
@Component({
  selector: 'app-school-product-swap-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, ReportPaginationComponent],
  templateUrl: './school-product-swap-modal.component.html',
  styleUrl: './school-product-swap-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolProductSwapModalComponent implements OnChanges {
  /** Line being changed; null keeps the modal closed. */
  @Input() line: EditorLine | null = null;
  /** Every line of the quotation, to detect a duplicate product. */
  @Input() set lines(value: readonly EditorLine[]) {
    this.allLines.set(value);
  }
  @Input() canOverride = false;
  /** `swap`: change a quotation line's product; `assign`: pick the product that fulfils a requirement. */
  @Input() mode: 'swap' | 'assign' = 'swap';

  @Output() swapped = new EventEmitter<ProductSwapResult>();
  @Output() manual = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  private readonly service = inject(SchoolListService);
  private readonly categoryService = inject(CategoryService);

  readonly formatCurrency = formatCurrency;
  readonly pageSize = PAGE_SIZE;
  readonly maxQuantity = MAX_LINE_QUANTITY;

  readonly categories = signal<Category[]>([]);
  readonly categoryId = signal('');
  readonly search = signal('');
  readonly page = signal(1);
  readonly results = signal<SchoolCatalogPage | null>(null);
  readonly loading = signal(false);
  readonly failed = signal(false);
  /** Bodega stock of the products on screen (lists take their stock from Bodega). */
  readonly bodega = signal<Record<string, number>>({});
  readonly selected = signal<SchoolCatalogProduct | null>(null);
  readonly quantity = signal(1);
  readonly price = signal(0);
  private readonly allLines = signal<readonly EditorLine[]>([]);
  private readonly current = signal<EditorLine | null>(null);

  /** Line that already holds the selected product (consolidation target). */
  readonly duplicate = computed(() => {
    const product = this.selected();
    const line = this.current();
    return product && line ? findDuplicateLine(this.allLines(), product.id, line.key) : null;
  });
  readonly sameProduct = computed(() => this.selected()?.id === this.current()?.productId);
  readonly categoryName = computed(() => this.categories().find((c) => c.id === this.categoryId())?.name ?? 'Todas las categorías');
  readonly quantityError = computed(() => {
    const qty = this.quantity();
    return Number.isInteger(qty) && qty >= 1 && qty <= MAX_LINE_QUANTITY ? null : 'La cantidad debe ser un entero entre 1 y 9,999.';
  });
  readonly priceError = computed(() => {
    const price = this.price();
    return price >= 0 && roundMoney(price) === price ? null : 'Precio no válido.';
  });
  readonly canConfirm = computed(
    () => !!this.selected() && !this.sameProduct() && !this.quantityError() && (this.mode === 'assign' || !this.priceError()),
  );

  private readonly query$ = new Subject<{ query: CatalogQuery; debounce: boolean }>();

  constructor() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => this.categories.set([]),
    });
    // switchMap cancels a stale request when the user keeps typing or switches category.
    this.query$
      .pipe(
        // Typing waits 250 ms (a newer keystroke cancels the timer); category/page changes go at once.
        switchMap(({ query, debounce }) => (debounce ? timer(250).pipe(map(() => query)) : of(query))),
        tap(() => this.loading.set(true)),
        switchMap((query) =>
          this.service
            .catalogProducts({
              categoryId: query.categoryId || undefined,
              search: query.search.trim() || undefined,
              page: query.page,
              limit: PAGE_SIZE,
            })
            .pipe(catchError(() => of(null))),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((page) => {
        this.loading.set(false);
        this.failed.set(page === null);
        this.results.set(page);
        if (page?.items.length) {
          this.loadBodega(page.items.map((p) => p.id));
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['line']) {
      const line = this.line;
      this.current.set(line);
      if (line) {
        // Start on the category of the product being replaced.
        this.categoryId.set(line.categoryId ?? '');
        this.search.set('');
        this.page.set(1);
        this.selected.set(null);
        this.quantity.set(line.quantity);
        this.price.set(line.unitPrice);
        this.results.set(null);
        this.request(false);
      }
    }
  }

  onCategory(categoryId: string): void {
    this.categoryId.set(categoryId);
    this.page.set(1);
    this.request(false);
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
    this.request(true);
  }

  onPage(page: number): void {
    this.page.set(page);
    this.request(false);
  }

  /** Selects a product; the price starts at its public price (editable only with override). */
  select(product: SchoolCatalogProduct): void {
    this.selected.set(product);
    this.price.set(product.publicPrice);
  }

  setQuantity(value: unknown): void {
    this.quantity.set(Number(value));
  }

  setPrice(value: unknown): void {
    this.price.set(value === '' || value === null ? 0 : Number(value));
  }

  stockOf(productId: string): number | null {
    const stock = this.bodega();
    return productId in stock ? stock[productId] : null;
  }

  confirm(): void {
    const product = this.selected();
    if (!product || !this.canConfirm()) {
      return;
    }
    this.swapped.emit({
      request: {
        product,
        quantity: this.quantity(),
        unitPrice: this.canOverride && this.mode === 'swap' ? this.price() : product.publicPrice,
      },
      consolidateWith: this.duplicate()?.key ?? null,
    });
  }

  private request(debounce: boolean): void {
    this.query$.next({ query: { categoryId: this.categoryId(), search: this.search(), page: this.page() }, debounce });
  }

  private loadBodega(ids: string[]): void {
    const missing = ids.filter((id) => !(id in this.bodega()));
    if (!missing.length) {
      return;
    }
    this.service.bodegaStock(missing).subscribe({
      next: (rows) => this.bodega.update((map) => ({ ...map, ...Object.fromEntries(rows.map((r) => [r.productId, r.quantity])) })),
      error: () => undefined,
    });
  }
}
