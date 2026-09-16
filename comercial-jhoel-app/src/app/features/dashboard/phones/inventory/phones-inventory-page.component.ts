import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';

import { Phone, PhoneSale } from '../../../../core/models';
import { PhonesService } from '../../../../core/services/phones.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../../shared/ui';
import { PhonesSummaryComponent } from './components/phones-summary/phones-summary.component';
import {
  PhoneOperatorFilter,
  PhoneStatusFilter,
  PhoneToolbarComponent,
} from './components/phone-toolbar/phone-toolbar.component';
import { PhoneRow, PhoneTableComponent } from './components/phone-table/phone-table.component';
import { PhoneSaleDetailModalComponent } from '../components/phone-sale-detail-modal/phone-sale-detail-modal.component';

@Component({
  selector: 'app-phones-inventory-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    PhonesSummaryComponent,
    PhoneToolbarComponent,
    PhoneTableComponent,
    PhoneSaleDetailModalComponent,
  ],
  templateUrl: './phones-inventory-page.component.html',
  styleUrl: './phones-inventory-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhonesInventoryPageComponent {
  private readonly phonesService = inject(PhonesService);
  private readonly notificationService = inject(NotificationService);

  private readonly phones = signal<Phone[]>([]);
  private readonly sales = signal<PhoneSale[]>([]);
  readonly loading = signal(true);

  readonly searchTerm = signal('');
  readonly operatorFilter = signal<PhoneOperatorFilter>('all');
  readonly statusFilter = signal<PhoneStatusFilter>('all');
  readonly purchaseDateFrom = signal('');
  readonly purchaseDateTo = signal('');
  readonly saleDateFrom = signal('');
  readonly saleDateTo = signal('');

  readonly detailSaleId = signal<string | null>(null);

  readonly hasActiveFilters = computed(
    () =>
      this.searchTerm().trim().length > 0 ||
      this.operatorFilter() !== 'all' ||
      this.statusFilter() !== 'all' ||
      this.purchaseDateFrom() !== '' ||
      this.purchaseDateTo() !== '' ||
      this.saleDateFrom() !== '' ||
      this.saleDateTo() !== '',
  );

  /** Joined client-side — `GET /phones` carries no sale info, `GET /phone-sales` carries `phoneId`; only the sale's *active* (non-voided) row counts. */
  private readonly rows = computed<PhoneRow[]>(() => {
    const sales = this.sales();
    return this.phones().map((phone) => {
      const activeSale = sales.find((sale) => sale.phoneId === phone.id && !sale.isVoided) ?? null;
      return {
        ...phone,
        saleId: activeSale?.id ?? null,
        saleDate: activeSale?.saleDate ?? null,
        clientName: activeSale?.clientName ?? null,
      };
    });
  });

  readonly filteredRows = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const operator = this.operatorFilter();
    const status = this.statusFilter();
    const purchaseFrom = this.purchaseDateFrom();
    const purchaseTo = this.purchaseDateTo();
    const saleFrom = this.saleDateFrom();
    const saleTo = this.saleDateTo();

    return this.rows().filter((row) => {
      if (operator !== 'all' && row.operator !== operator) {
        return false;
      }
      if (status !== 'all' && row.status !== status) {
        return false;
      }
      if (purchaseFrom && row.purchaseDate < purchaseFrom) {
        return false;
      }
      if (purchaseTo && row.purchaseDate > purchaseTo) {
        return false;
      }
      if (saleFrom && (!row.saleDate || row.saleDate < saleFrom)) {
        return false;
      }
      if (saleTo && (!row.saleDate || row.saleDate > saleTo)) {
        return false;
      }
      if (
        search &&
        !(row.phoneNumber ?? '').toLowerCase().includes(search) &&
        !row.model.toLowerCase().includes(search) &&
        !row.imei.toLowerCase().includes(search) &&
        !row.simNumber.toLowerCase().includes(search)
      ) {
        return false;
      }
      return true;
    });
  });

  /** Summary cards always reflect the whole catalog, never the active filters — same convention `InventorySummaryComponent` follows. */
  readonly summaryPhones = computed(() => this.phones());

  constructor() {
    this.fetchAll();
  }

  private fetchAll(): void {
    this.loading.set(true);
    forkJoin({
      phones: this.phonesService.getPhones(),
      sales: this.phonesService.getSales(),
    })
      .pipe(catchError(() => of(null)))
      .subscribe((result) => {
        this.loading.set(false);
        if (!result) {
          this.notificationService.error('No se pudo cargar el inventario de teléfonos.');
          return;
        }
        this.phones.set(result.phones);
        this.sales.set(result.sales);
      });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.operatorFilter.set('all');
    this.statusFilter.set('all');
    this.purchaseDateFrom.set('');
    this.purchaseDateTo.set('');
    this.saleDateFrom.set('');
    this.saleDateTo.set('');
  }

  onViewSale(row: PhoneRow): void {
    if (row.saleId) {
      this.detailSaleId.set(row.saleId);
    }
  }

  closeDetail(): void {
    this.detailSaleId.set(null);
  }
}
