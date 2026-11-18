import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';

import { QUOTATION_STATUS_LABEL, QuotationSalePreview, formatCurrency } from '../../../../../core/models';
import { NotificationService } from '../../../../../core/services/notification.service';
import { QuotationsService } from '../../../../../core/services/quotations.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * "Confirmar venta": shows the quoted products and quantities with the
 * current Vitrina stock, and only then converts the quotation into ONE sale
 * through Ventas (the backend validates stock again under lock, uses the
 * quoted prices and returns the same sale on a retry/double click).
 */
@Component({
  selector: 'app-quotation-sale-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './quotation-sale-modal.component.html',
  styleUrl: './quotation-sale-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotationSaleModalComponent implements OnChanges {
  @Input() quotationId: string | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() sold = new EventEmitter<string>();

  private readonly service = inject(QuotationsService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly statusLabel = QUOTATION_STATUS_LABEL;
  readonly preview = signal<QuotationSalePreview | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly units = computed(() => (this.preview()?.lines ?? []).reduce((sum, line) => sum + line.quantity, 0));
  readonly missing = computed(() => (this.preview()?.lines ?? []).filter((line) => !line.sufficient));
  readonly missingNames = computed(() => this.missing().map((line) => line.productName).join(', '));

  ngOnChanges(): void {
    this.preview.set(null);
    this.error.set(null);
    if (!this.quotationId) {
      return;
    }
    this.loading.set(true);
    this.service.getSalePreview(this.quotationId).subscribe({
      next: (preview) => {
        this.preview.set(preview);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(extractErrorMessage(error, 'No se pudo cargar el resumen de la venta.'));
      },
    });
  }

  confirm(): void {
    const preview = this.preview();
    if (!preview || !preview.canConfirm || this.saving()) {
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    this.service.confirmSale(preview.quotation.id).subscribe({
      next: (result) => {
        this.saving.set(false);
        this.notifications.success(
          `Venta registrada desde ${result.quotation.quotationNumber}; se descontaron ${this.units()} unidad(es) de Vitrina.`,
        );
        this.sold.emit(result.saleId);
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(extractErrorMessage(error, 'No se pudo confirmar la venta.'));
      },
    });
  }
}
