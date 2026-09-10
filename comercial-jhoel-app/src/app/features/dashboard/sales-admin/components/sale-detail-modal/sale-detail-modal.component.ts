import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';

import { Sale, formatCurrency } from '../../../../../core/models';
import { SalesService } from '../../../../../core/services/sales.service';
import { BadgeComponent, IconComponent } from '../../../../../shared/ui';

/** Read-only full detail for one sale — Ver, reached from "Administrar Facturas de Ventas". Closes on backdrop click, unlike the destructive void confirm modal — viewing has nothing to lose. */
@Component({
  selector: 'app-sale-detail-modal',
  standalone: true,
  imports: [DatePipe, IconComponent, BadgeComponent],
  templateUrl: './sale-detail-modal.component.html',
  styleUrl: './sale-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleDetailModalComponent implements OnChanges {
  @Input() saleId: string | null = null;
  @Output() closed = new EventEmitter<void>();

  private readonly salesService = inject(SalesService);

  readonly sale = signal<Sale | null>(null);
  readonly loading = signal(false);

  formatCurrency = formatCurrency;

  ngOnChanges(): void {
    if (!this.saleId) {
      this.sale.set(null);
      return;
    }
    this.loading.set(true);
    this.salesService.getSaleById(this.saleId).subscribe({
      next: (sale) => {
        this.sale.set(sale);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  close(): void {
    this.closed.emit();
  }
}
