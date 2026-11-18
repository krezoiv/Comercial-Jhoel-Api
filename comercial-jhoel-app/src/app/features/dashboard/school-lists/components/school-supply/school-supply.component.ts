import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  Category,
  SCHOOL_SUPPLY_LABEL,
  SCHOOL_SUPPLY_TONE,
  SUPPLY_PRODUCT_LABEL,
  SUPPLY_PRODUCT_TONE,
  SupplyAllocationMode,
  SupplyProduct,
  SupplyProductList,
  SupplyProductStatus,
  SupplyPurchase,
  SupplySummary,
  formatSchoolDate,
  formatSchoolDateTime,
} from '../../../../../core/models';
import { CategoryService } from '../../../../../core/services/category.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { BadgeComponent, ButtonComponent, IconComponent, SummaryTileComponent } from '../../../../../shared/ui';
import { ReportPaginationComponent } from '../../../reports/components/report-pagination/report-pagination.component';

/**
 * "Productos pendientes de abastecimiento": what the school lists committed,
 * what is already reserved for them and what is still to buy — computed from
 * the lists' commitments and allocations, never from the negative stock
 * alone. Also shows which lists each purchase supplied. Allocation rules
 * (FIFO, caps, no double assignment) live in PostgreSQL.
 */
@Component({
  selector: 'app-school-supply',
  standalone: true,
  imports: [FormsModule, BadgeComponent, ButtonComponent, IconComponent, SummaryTileComponent, ReportPaginationComponent],
  templateUrl: './school-supply.component.html',
  styleUrl: './school-supply.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolSupplyComponent implements OnInit {
  /** Opens the purchases section filtered by this purchase (e.g. from Compras). */
  @Input() purchaseId: string | null = null;

  readonly service = inject(SchoolListService);
  private readonly categoriesService = inject(CategoryService);
  private readonly confirm = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  readonly productLabel = SUPPLY_PRODUCT_LABEL;
  readonly productTone = SUPPLY_PRODUCT_TONE;
  readonly listLabel = SCHOOL_SUPPLY_LABEL;
  readonly listTone = SCHOOL_SUPPLY_TONE;
  readonly formatDate = formatSchoolDate;
  readonly formatDateTime = formatSchoolDateTime;
  readonly statuses: SupplyProductStatus[] = ['PENDIENTE', 'PARCIAL', 'ABASTECIDO'];
  readonly pageSize = 15;

  // Filters.
  readonly search = signal('');
  readonly categoryId = signal('');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly quotationNumber = signal('');
  readonly status = signal<SupplyProductStatus | ''>('');
  readonly page = signal(1);

  readonly categories = signal<Category[]>([]);
  readonly items = signal<SupplyProduct[]>([]);
  readonly total = signal(0);
  readonly summary = signal<SupplySummary | null>(null);
  readonly failed = signal(false);
  readonly mode = signal<SupplyAllocationMode>('FIFO_AUTO');
  readonly busy = signal(false);

  // Lists of one product.
  readonly selected = signal<SupplyProduct | null>(null);
  readonly productLists = signal<SupplyProductList[]>([]);
  readonly manualQty = signal<Record<string, number>>({});

  // Purchases supplied to lists.
  readonly purchases = signal<SupplyPurchase[]>([]);
  readonly purchasesTotal = signal(0);
  readonly purchasesPage = signal(1);
  readonly purchaseFilter = signal<string | null>(null);

  readonly canManage = computed(() => this.service.can('school_lists.supply.manage'));
  readonly isAdmin = computed(() => this.service.can('school_lists.templates.manage'));

  ngOnInit(): void {
    this.purchaseFilter.set(this.purchaseId);
    this.categoriesService.getCategories().subscribe({ next: (c) => this.categories.set(c), error: () => undefined });
    this.service.supplySettings().subscribe({ next: (s) => this.mode.set(s.allocationMode), error: () => undefined });
    this.load();
    this.loadPurchases();
  }

  load(): void {
    this.service
      .supplyProducts({
        search: this.search().trim() || undefined,
        categoryId: this.categoryId() || undefined,
        dateFrom: this.dateFrom() || undefined,
        dateTo: this.dateTo() || undefined,
        quotationNumber: this.quotationNumber().trim() || undefined,
        status: this.status() || undefined,
        page: this.page(),
        limit: this.pageSize,
      })
      .subscribe({
        next: (result) => {
          this.items.set(result.items);
          this.total.set(result.total);
          this.summary.set(result.summary);
          this.failed.set(false);
        },
        error: () => this.failed.set(true),
      });
  }

  applyFilters(): void {
    this.page.set(1);
    this.load();
  }

  clearFilters(): void {
    this.search.set('');
    this.categoryId.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.quotationNumber.set('');
    this.status.set('');
    this.applyFilters();
  }

  onPage(page: number): void {
    this.page.set(page);
    this.load();
  }

  loadPurchases(): void {
    this.service.supplyPurchases(this.purchaseFilter() ?? undefined, this.purchasesPage(), 10).subscribe({
      next: (result) => {
        this.purchases.set(result.items);
        this.purchasesTotal.set(result.total);
      },
      error: () => this.purchases.set([]),
    });
  }

  onPurchasesPage(page: number): void {
    this.purchasesPage.set(page);
    this.loadPurchases();
  }

  clearPurchaseFilter(): void {
    this.purchaseFilter.set(null);
    this.purchasesPage.set(1);
    this.loadPurchases();
  }

  openLists(product: SupplyProduct): void {
    this.selected.set(product);
    this.productLists.set([]);
    this.service.supplyProductLists(product.productId).subscribe({ next: (rows) => this.productLists.set(rows) });
  }

  openList(quotationId: string): void {
    void this.router.navigate(['/dashboard/listas-escolares/cotizaciones', quotationId], { queryParams: { vista: 'abastecimiento' } });
  }

  private refresh(): void {
    this.load();
    this.loadPurchases();
    const selected = this.selected();
    if (selected) {
      this.service.supplyProductLists(selected.productId).subscribe({ next: (rows) => this.productLists.set(rows) });
      this.service.supplyProducts({ search: selected.sku ?? selected.productName, limit: 100 }).subscribe({
        next: (r) => this.selected.set(r.items.find((i) => i.productId === selected.productId) ?? selected),
      });
    }
  }

  private report(action: string) {
    return {
      next: (r: { allocated: number }) => {
        this.busy.set(false);
        if (r.allocated > 0) {
          this.notifications.success(`${action}: se asignaron ${r.allocated} unidad(es) a listas pendientes.`);
        } else {
          this.notifications.info('No había unidades libres en Bodega para asignar.');
        }
        this.refresh();
      },
      error: (error: HttpErrorResponse) => {
        this.busy.set(false);
        this.notifications.error(extractErrorMessage(error, 'No se pudo asignar.'));
      },
    };
  }

  async fifo(product?: SupplyProduct): Promise<void> {
    const ok = await this.confirm.confirm({
      type: 'UPDATE',
      title: 'Asignar FIFO',
      message: product
        ? `Las unidades libres de "${product.productName}" en Bodega (${product.freeUnits}) se asignarán a las listas pendientes, de la más antigua a la más reciente.`
        : 'Las unidades libres en Bodega se asignarán a las listas pendientes de todos los productos, de la más antigua a la más reciente.',
      confirmText: 'Asignar',
    });
    if (!ok) return;
    this.busy.set(true);
    this.service.runFifo(product?.productId).subscribe(this.report('FIFO'));
  }

  async allocatePurchase(purchase: SupplyPurchase): Promise<void> {
    const ok = await this.confirm.confirm({
      type: 'UPDATE',
      title: 'Asignar compra a listas',
      message: `Las unidades de la compra ${purchase.invoiceNumber ?? ''} que aún no tienen lista se asignarán FIFO a las listas pendientes.`,
      confirmText: 'Asignar',
    });
    if (!ok) return;
    this.busy.set(true);
    this.service.allocatePurchase(purchase.purchaseId).subscribe(this.report('Compra'));
  }

  setManual(quotationId: string, value: unknown): void {
    this.manualQty.update((map) => ({ ...map, [quotationId]: Math.max(0, Math.floor(Number(value) || 0)) }));
  }

  allocateManual(row: SupplyProductList): void {
    const product = this.selected();
    const quantity = this.manualQty()[row.quotationId] ?? 0;
    if (!product || quantity < 1 || this.busy()) return;
    this.busy.set(true);
    this.service
      .allocateManual({ quotationId: row.quotationId, productId: product.productId, quantity, clientRequestId: crypto.randomUUID() })
      .subscribe({
        next: () => {
          this.busy.set(false);
          this.manualQty.update((map) => ({ ...map, [row.quotationId]: 0 }));
          this.notifications.success(`${quantity} unidad(es) asignadas a ${row.quotationNumber}.`);
          this.refresh();
        },
        error: (error: HttpErrorResponse) => {
          this.busy.set(false);
          this.notifications.error(extractErrorMessage(error, 'No se pudo asignar.'));
        },
      });
  }

  async toggleMode(): Promise<void> {
    const next: SupplyAllocationMode = this.mode() === 'FIFO_AUTO' ? 'MANUAL' : 'FIFO_AUTO';
    const ok = await this.confirm.confirm({
      type: 'UPDATE',
      title: next === 'FIFO_AUTO' ? 'Asignación automática FIFO' : 'Asignación manual',
      message:
        next === 'FIFO_AUTO'
          ? 'Cada compra o entrada a Bodega se asignará sola a las listas pendientes, de la más antigua a la más reciente.'
          : 'Las compras solo sumarán existencias; las unidades se asignan desde esta pantalla.',
      confirmText: 'Cambiar modo',
    });
    if (!ok) return;
    this.service.setSupplyMode(next).subscribe({
      next: (s) => {
        this.mode.set(s.allocationMode);
        this.notifications.success('Modo de asignación actualizado.');
      },
      error: (error: HttpErrorResponse) => this.notifications.error(extractErrorMessage(error, 'No se pudo cambiar el modo.')),
    });
  }
}
