import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';

import { Client, PHONE_OPERATOR_LABEL, Phone, PhoneSale, formatCurrency } from '../../../../core/models';
import { PhonesService } from '../../../../core/services/phones.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../core/utils/extract-error-message';
import { ButtonComponent, CardComponent, IconComponent, PageHeaderComponent } from '../../../../shared/ui';
import { ClientSearchSelectComponent } from '../../accounts-receivable/components/client-search-select/client-search-select.component';
import { PhoneSaleConfirmModalComponent } from './components/phone-sale-confirm-modal/phone-sale-confirm-modal.component';
import { PhoneSaleVoidConfirmModalComponent } from './components/phone-sale-void-confirm-modal/phone-sale-void-confirm-modal.component';
import { PhoneSalesTableComponent } from './components/phone-sales-table/phone-sales-table.component';
import { PhoneSaleDetailModalComponent } from '../components/phone-sale-detail-modal/phone-sale-detail-modal.component';

const MAX_DPI_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

/** Local-time `yyyy-MM-dd`. */
function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Venta de teléfonos — selects a DISPONIBLE phone, captures cliente/DPI
 * (foto opcional, número obligatorio — same real rule as SIM sale), shows a
 * structured confirmation summary, then registers the sale. Below the form,
 * the full sales history with Ver detalle/Anular actions.
 */
@Component({
  selector: 'app-phones-sale-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    IconComponent,
    ClientSearchSelectComponent,
    PhoneSaleConfirmModalComponent,
    PhoneSaleVoidConfirmModalComponent,
    PhoneSalesTableComponent,
    PhoneSaleDetailModalComponent,
  ],
  templateUrl: './phones-sale-page.component.html',
  styleUrl: './phones-sale-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhonesSalePageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly phonesService = inject(PhonesService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  readonly loading = signal(true);
  readonly availablePhones = signal<Phone[]>([]);
  readonly sales = signal<PhoneSale[]>([]);
  readonly selectedPhone = signal<Phone | null>(null);
  readonly selectedClient = signal<Client | null>(null);
  readonly dpiImageFile = signal<File | null>(null);
  readonly dpiImagePreviewUrl = signal<string | null>(null);
  readonly imageError = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly confirmOpen = signal(false);

  readonly detailSaleId = signal<string | null>(null);
  readonly voidTarget = signal<PhoneSale | null>(null);
  readonly isVoiding = signal(false);

  readonly isAdmin = computed(() => this.authService.isAdmin());

  readonly form = this.fb.nonNullable.group({
    phoneId: ['', Validators.required],
    clientDpi: ['', [Validators.required, Validators.maxLength(20)]],
    salePrice: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    saleDate: [todayIsoDate(), Validators.required],
  });

  formatCurrency = formatCurrency;
  operatorLabel = PHONE_OPERATOR_LABEL;

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
          this.notificationService.error('No se pudo cargar la información de ventas de teléfonos.');
          return;
        }
        this.availablePhones.set(result.phones.filter((phone) => phone.status === 'DISPONIBLE'));
        this.sales.set([...result.sales].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      });
  }

  onPhoneChange(id: string): void {
    const phone = this.availablePhones().find((p) => p.id === id) ?? null;
    this.selectedPhone.set(phone);
    if (phone) {
      this.form.controls.phoneId.setValue(phone.id);
      this.form.controls.salePrice.setValue(phone.publicPrice);
    }
  }

  onClientChange(client: Client | null): void {
    this.selectedClient.set(client);
  }

  onDpiImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';
    this.imageError.set(null);

    if (!file) {
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      this.imageError.set('La imagen debe ser JPG, PNG o WEBP.');
      return;
    }
    if (file.size > MAX_DPI_IMAGE_SIZE_BYTES) {
      this.imageError.set('La imagen no puede superar los 5 MB.');
      return;
    }

    this.clearDpiImagePreview();
    this.dpiImageFile.set(file);
    this.dpiImagePreviewUrl.set(URL.createObjectURL(file));
  }

  removeDpiImage(): void {
    this.clearDpiImagePreview();
    this.dpiImageFile.set(null);
    this.imageError.set(null);
  }

  private clearDpiImagePreview(): void {
    const current = this.dpiImagePreviewUrl();
    if (current) {
      URL.revokeObjectURL(current);
    }
    this.dpiImagePreviewUrl.set(null);
  }

  requestSale(): void {
    if (this.form.invalid || this.isSubmitting() || !this.selectedPhone()) {
      this.form.markAllAsTouched();
      return;
    }
    this.confirmOpen.set(true);
  }

  cancelConfirm(): void {
    this.confirmOpen.set(false);
  }

  confirmSale(): void {
    const phone = this.selectedPhone();
    if (!phone || this.isSubmitting()) {
      return;
    }

    const { clientDpi, salePrice, saleDate } = this.form.getRawValue();
    this.isSubmitting.set(true);

    this.phonesService
      .registerSale({
        phoneId: phone.id,
        clientId: this.selectedClient()?.id ?? null,
        clientDpi: clientDpi.trim(),
        salePrice: salePrice!,
        saleDate,
        dpiImage: this.dpiImageFile(),
      })
      .subscribe({
        next: (sale) => {
          this.isSubmitting.set(false);
          this.confirmOpen.set(false);
          this.notificationService.success(
            `Venta de ${this.operatorLabel[sale.phoneOperator]} ${sale.phoneNumber} registrada correctamente (${formatCurrency(sale.salePrice)}).`,
          );
          this.sales.update((sales) => [sale, ...sales]);
          this.availablePhones.update((phones) => phones.filter((p) => p.id !== phone.id));
          this.resetForm();
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.confirmOpen.set(false);
          this.notificationService.error(extractErrorMessage(error, 'No se pudo registrar la venta.'));
        },
      });
  }

  private resetForm(): void {
    this.form.reset({ phoneId: '', clientDpi: '', salePrice: null, saleDate: todayIsoDate() });
    this.selectedPhone.set(null);
    this.selectedClient.set(null);
    this.clearDpiImagePreview();
    this.dpiImageFile.set(null);
    this.imageError.set(null);
  }

  viewDetail(sale: PhoneSale): void {
    this.detailSaleId.set(sale.id);
  }

  closeDetail(): void {
    this.detailSaleId.set(null);
  }

  requestVoid(sale: PhoneSale): void {
    this.voidTarget.set(sale);
  }

  cancelVoid(): void {
    this.voidTarget.set(null);
  }

  confirmVoid(reason: string): void {
    const target = this.voidTarget();
    if (!target || this.isVoiding()) {
      return;
    }
    this.isVoiding.set(true);
    this.phonesService.voidSale(target.id, reason).subscribe({
      next: (voided) => {
        this.isVoiding.set(false);
        this.voidTarget.set(null);
        this.notificationService.success('Venta anulada — el teléfono vuelve a estar disponible.');
        this.sales.update((sales) => sales.map((sale) => (sale.id === voided.id ? voided : sale)));
        this.fetchAll();
      },
      error: (error: HttpErrorResponse) => {
        this.isVoiding.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo anular la venta.'));
      },
    });
  }
}
