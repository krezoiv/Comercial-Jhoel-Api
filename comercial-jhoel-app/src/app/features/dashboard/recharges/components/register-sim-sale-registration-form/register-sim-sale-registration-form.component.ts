import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { Client, SimSaleRegistration, SimType, formatCurrency } from '../../../../../core/models';
import { RechargeSimsService } from '../../../../../core/services/recharge-sims.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { ClientSearchSelectComponent } from '../../../accounts-receivable/components/client-search-select/client-search-select.component';

const MAX_DPI_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function priceValidator(control: AbstractControl): ValidationErrors | null {
  return control.value !== null && control.value < 0 ? { min: true } : null;
}

/**
 * "Venta de SIM con registro de identidad" — deliberately separate from
 * `RegisterSimSaleFormComponent` above it in the same SIM section (that one
 * stays exactly as it was: a quick by-quantity sale, no DPI). This one
 * always sells exactly one physical unit, with número de SIM/SKU/DPI del
 * comprador/cliente opcional/foto — see `RechargeSimsService
 * .registerSaleRegistration`'s own doc comment for why this travels as
 * `FormData`. `salePrice` defaults to the type's catalog price on selection
 * but stays freely editable — a real, independently-entered value (a
 * negotiated/promotional sale is legitimate), not a read-only echo of the
 * catalog.
 */
@Component({
  selector: 'app-register-sim-sale-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, ClientSearchSelectComponent],
  templateUrl: './register-sim-sale-registration-form.component.html',
  styleUrl: './register-sim-sale-registration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterSimSaleRegistrationFormComponent implements OnChanges {
  @Input() types: SimType[] = [];
  @Input() operationDate = '';
  @Input() lockReason: 'closed' | 'not_opened' | null = null;

  @Output() registered = new EventEmitter<SimSaleRegistration>();

  private readonly fb = inject(FormBuilder);
  private readonly simsService = inject(RechargeSimsService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  readonly isSubmitting = signal(false);
  readonly selectedType = signal<SimType | null>(null);
  readonly selectedClient = signal<Client | null>(null);
  readonly dpiImageFile = signal<File | null>(null);
  readonly dpiImagePreviewUrl = signal<string | null>(null);
  readonly imageError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    simTypeId: ['', Validators.required],
    simNumber: ['', [Validators.required, Validators.maxLength(50)]],
    sku: ['', [Validators.required, Validators.maxLength(64)]],
    clientDpi: ['', [Validators.required, Validators.maxLength(20)]],
    salePrice: this.fb.control<number | null>(null, [Validators.required, priceValidator]),
  });

  formatCurrency = formatCurrency;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['types'] && this.types.length > 0 && !this.form.controls.simTypeId.value) {
      this.selectType(this.types[0]);
    }
  }

  onTypeChange(id: string): void {
    const type = this.types.find((t) => t.id === id) ?? null;
    this.selectType(type);
  }

  private selectType(type: SimType | null): void {
    this.selectedType.set(type);
    if (type) {
      this.form.controls.simTypeId.setValue(type.id);
      this.form.controls.salePrice.setValue(type.publicPrice);
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

  async submit(): Promise<void> {
    if (this.form.invalid || this.isSubmitting() || this.lockReason !== null) {
      this.form.markAllAsTouched();
      return;
    }

    const { simTypeId, simNumber, sku, clientDpi, salePrice } = this.form.getRawValue();
    const type = this.selectedType();
    const client = this.selectedClient();

    const confirmed = await this.confirmDialogService.confirm({
      type: 'FINANCIAL_OPERATION',
      title: 'Confirmar venta de SIM',
      message: `¿Desea registrar esta venta de SIM?\n\nProducto: ${type?.name ?? ''}\nNúmero de SIM: ${simNumber}\nDPI: ${clientDpi}\n${client ? `Cliente: ${client.name}\n` : ''}Precio: ${formatCurrency(salePrice ?? 0)}`,
      confirmText: 'Confirmar',
    });
    if (!confirmed) {
      return;
    }

    this.isSubmitting.set(true);

    this.simsService
      .registerSaleRegistration({
        simTypeId,
        simNumber: simNumber.trim(),
        sku: sku.trim(),
        clientDpi: clientDpi.trim(),
        clientId: client?.id ?? null,
        salePrice: salePrice!,
        operationDate: this.operationDate,
        dpiImage: this.dpiImageFile(),
      })
      .subscribe({
        next: (registration) => {
          this.isSubmitting.set(false);
          this.notificationService.success(
            `Venta de ${registration.simTypeName} registrada correctamente (${formatCurrency(registration.salePrice)}).`,
          );
          this.resetForm();
          this.registered.emit(registration);
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.notificationService.error(extractErrorMessage(error, 'No se pudo registrar la venta de SIM.'));
        },
      });
  }

  private resetForm(): void {
    this.form.reset({ simTypeId: '', simNumber: '', sku: '', clientDpi: '', salePrice: null });
    this.selectedClient.set(null);
    this.clearDpiImagePreview();
    this.dpiImageFile.set(null);
    this.imageError.set(null);
    if (this.types.length > 0) {
      this.selectType(this.types[0]);
    }
  }
}
