import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';

import { SimSaleRegistration, formatCurrency } from '../../../../../core/models';
import { RechargeSimsService } from '../../../../../core/services/recharge-sims.service';
import { BadgeComponent, IconComponent } from '../../../../../shared/ui';

/**
 * Read-only full detail for one SIM sale registration — Ver, reached from
 * "Administrar Ventas de SIM". Closes on backdrop click, same as
 * `PurchaseDetailModalComponent` (viewing has nothing to lose). The DPI
 * photo is fetched as a `Blob` (never a bare `<img [src]>` URL — that
 * endpoint requires a JWT the browser has no way to attach to a plain image
 * request) and turned into a local object URL, revoked on every id change
 * and on destroy so a closed modal never leaks memory.
 */
@Component({
  selector: 'app-sim-sale-registration-detail-modal',
  standalone: true,
  imports: [DatePipe, IconComponent, BadgeComponent],
  templateUrl: './sim-sale-registration-detail-modal.component.html',
  styleUrl: './sim-sale-registration-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimSaleRegistrationDetailModalComponent implements OnChanges {
  @Input() registrationId: string | null = null;
  @Output() closed = new EventEmitter<void>();

  private readonly simsService = inject(RechargeSimsService);

  readonly registration = signal<SimSaleRegistration | null>(null);
  readonly loading = signal(false);
  readonly dpiImageUrl = signal<string | null>(null);
  readonly imageLoading = signal(false);

  formatCurrency = formatCurrency;

  ngOnChanges(): void {
    this.clearImage();

    if (!this.registrationId) {
      this.registration.set(null);
      return;
    }

    this.loading.set(true);
    this.simsService.getSaleRegistrationById(this.registrationId).subscribe({
      next: (registration) => {
        this.registration.set(registration);
        this.loading.set(false);
        if (registration.hasDpiImage) {
          this.loadImage(registration.id);
        }
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private loadImage(id: string): void {
    this.imageLoading.set(true);
    this.simsService.getDpiImage(id).subscribe({
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
