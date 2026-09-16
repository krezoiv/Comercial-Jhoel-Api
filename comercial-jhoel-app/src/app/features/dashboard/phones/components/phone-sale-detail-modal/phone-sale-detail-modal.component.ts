import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';

import { PHONE_OPERATOR_LABEL, PhoneSale, formatCurrency } from '../../../../../core/models';
import { PhonesService } from '../../../../../core/services/phones.service';
import { BadgeComponent, IconComponent } from '../../../../../shared/ui';

/**
 * Read-only full detail for one phone sale — shared by both Inventario (a
 * VENDIDO row's "Ver detalle de venta") and Ventas (its own history table),
 * the one deliberate intra-feature shared component in this module (same
 * reasoning `ClientSearchSelectComponent` is reused across Ventas/SIM/this
 * module, rather than copied). Closes on backdrop click — viewing has
 * nothing to lose. The DPI photo is fetched as a `Blob` and turned into a
 * local object URL, revoked on every id change and on destroy.
 */
@Component({
  selector: 'app-phone-sale-detail-modal',
  standalone: true,
  imports: [DatePipe, IconComponent, BadgeComponent],
  templateUrl: './phone-sale-detail-modal.component.html',
  styleUrl: './phone-sale-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneSaleDetailModalComponent implements OnChanges {
  @Input() saleId: string | null = null;
  @Output() closed = new EventEmitter<void>();

  private readonly phonesService = inject(PhonesService);

  readonly sale = signal<PhoneSale | null>(null);
  readonly loading = signal(false);
  readonly dpiImageUrl = signal<string | null>(null);
  readonly imageLoading = signal(false);

  formatCurrency = formatCurrency;
  operatorLabel = PHONE_OPERATOR_LABEL;

  ngOnChanges(): void {
    this.clearImage();

    if (!this.saleId) {
      this.sale.set(null);
      return;
    }

    this.loading.set(true);
    this.phonesService.getSaleById(this.saleId).subscribe({
      next: (sale) => {
        this.sale.set(sale);
        this.loading.set(false);
        if (sale.hasDpiImage) {
          this.loadImage(sale.id);
        }
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private loadImage(id: string): void {
    this.imageLoading.set(true);
    this.phonesService.getSaleDpiImage(id).subscribe({
      next: (blob) => {
        this.dpiImageUrl.set(URL.createObjectURL(blob));
        this.imageLoading.set(false);
      },
      error: () => {
        this.imageLoading.set(false);
      },
    });
  }

  private clearImage(): void {
    const current = this.dpiImageUrl();
    if (current) {
      URL.revokeObjectURL(current);
    }
    this.dpiImageUrl.set(null);
  }

  close(): void {
    this.closed.emit();
  }
}
