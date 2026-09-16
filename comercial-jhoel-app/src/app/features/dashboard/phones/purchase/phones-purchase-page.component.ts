import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { PHONE_OPERATOR_LABEL, Phone, PhoneOperator, formatCurrency } from '../../../../core/models';
import { PhonesService } from '../../../../core/services/phones.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../core/utils/extract-error-message';
import { ButtonComponent, CardComponent, PageHeaderComponent } from '../../../../shared/ui';

/** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique already used across this app (Reports, Recargas). */
function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Compra/ingreso de teléfonos — self-contained form, same pattern as
 * `RegisterSimPurchaseFormComponent`: calls `PhonesService.createPhone()`
 * directly. Every teléfono registered here starts `DISPONIBLE` and is
 * immediately visible on Inventario de Teléfonos (a separate route/fetch,
 * not shared state — no client-side cache to keep in sync).
 */
@Component({
  selector: 'app-phones-purchase-page',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeaderComponent, CardComponent, ButtonComponent],
  templateUrl: './phones-purchase-page.component.html',
  styleUrl: './phones-purchase-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhonesPurchasePageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly phonesService = inject(PhonesService);
  private readonly notificationService = inject(NotificationService);

  readonly isSubmitting = signal(false);
  readonly recentlyRegistered = signal<Phone[]>([]);

  readonly maxDate = todayIsoDate();

  readonly form = this.fb.nonNullable.group({
    operator: this.fb.nonNullable.control<PhoneOperator>('CLARO', Validators.required),
    phoneNumber: ['', [Validators.required, Validators.maxLength(20)]],
    imei: ['', [Validators.required, Validators.maxLength(20)]],
    costPrice: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    publicPrice: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    purchaseDate: [todayIsoDate(), Validators.required],
  });

  formatCurrency = formatCurrency;
  operatorLabel = PHONE_OPERATOR_LABEL;

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const { operator, phoneNumber, imei, costPrice, publicPrice, purchaseDate } = this.form.getRawValue();
    this.isSubmitting.set(true);

    this.phonesService
      .createPhone({
        operator,
        phoneNumber: phoneNumber.trim(),
        imei: imei.trim(),
        costPrice: costPrice!,
        publicPrice: publicPrice!,
        purchaseDate,
      })
      .subscribe({
        next: (phone) => {
          this.isSubmitting.set(false);
          this.notificationService.success(
            `Teléfono ${this.operatorLabel[phone.operator]} ${phone.phoneNumber} registrado correctamente.`,
          );
          this.recentlyRegistered.update((phones) => [phone, ...phones].slice(0, 10));
          this.resetForm();
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.notificationService.error(extractErrorMessage(error, 'No se pudo registrar el teléfono.'));
        },
      });
  }

  private resetForm(): void {
    this.form.reset({
      operator: this.form.controls.operator.value,
      phoneNumber: '',
      imei: '',
      costPrice: null,
      publicPrice: null,
      purchaseDate: todayIsoDate(),
    });
  }
}
