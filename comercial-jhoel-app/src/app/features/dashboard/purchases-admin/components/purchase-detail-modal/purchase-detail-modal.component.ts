import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';

import { Purchase, formatCurrency } from '../../../../../core/models';
import { PurchasesService } from '../../../../../core/services/purchases.service';
import { BadgeComponent, IconComponent } from '../../../../../shared/ui';

/** Read-only full detail for one purchase invoice — Ver, reached from "Administrar Facturas de Compras". Closes on backdrop click, unlike the destructive void confirm modal — viewing has nothing to lose. */
@Component({
  selector: 'app-purchase-detail-modal',
  standalone: true,
  imports: [DatePipe, IconComponent, BadgeComponent],
  templateUrl: './purchase-detail-modal.component.html',
  styleUrl: './purchase-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseDetailModalComponent implements OnChanges {
  @Input() purchaseId: string | null = null;
  @Output() closed = new EventEmitter<void>();

  private readonly purchasesService = inject(PurchasesService);

  readonly purchase = signal<Purchase | null>(null);
  readonly loading = signal(false);

  formatCurrency = formatCurrency;

  ngOnChanges(): void {
    if (!this.purchaseId) {
      this.purchase.set(null);
      return;
    }
    this.loading.set(true);
    this.purchasesService.getPurchaseById(this.purchaseId).subscribe({
      next: (purchase) => {
        this.purchase.set(purchase);
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
