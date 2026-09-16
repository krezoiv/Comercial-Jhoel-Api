import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { PHONE_OPERATOR_LABEL, Phone, PhoneOperator, formatCurrency } from '../../../../core/models';
import { PhonesService } from '../../../../core/services/phones.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../core/utils/extract-error-message';
import { ButtonComponent, CardComponent, IconComponent, PageHeaderComponent } from '../../../../shared/ui';

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
 * directly. Every teléfono registered here starts `DISPONIBLE`, with no
 * phone number yet — that's only assigned at the moment of sale (see
 * `Phone`'s own doc comment). Immediately visible on Inventario de
 * Teléfonos (a separate route/fetch, not shared state — no client-side
 * cache to keep in sync).
 *
 * Layout is a single centered card, never a 2-column grid with the
 * "recently registered" list beside it — an earlier version used
 * `grid-template-columns: minmax(0, 26rem) 1fr`, which looked off-center on
 * a fresh page load (the list starts empty, so only the first column
 * rendered, leaving the row visually unbalanced). The list now renders
 * BELOW the same centered card instead, so the layout never depends on
 * whether it has 0 or N items.
 */
@Component({
  selector: 'app-phones-purchase-page',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeaderComponent, CardComponent, ButtonComponent, IconComponent],
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
    model: ['', [Validators.required, Validators.maxLength(150)]],
    imei: ['', [Validators.required, Validators.maxLength(20)]],
    simNumber: ['', [Validators.required, Validators.maxLength(30)]],
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

    const { operator, model, imei, simNumber, costPrice, publicPrice, purchaseDate } = this.form.getRawValue();
    this.isSubmitting.set(true);

    this.phonesService
      .createPhone({
        operator,
        model: model.trim(),
        imei: imei.trim(),
        simNumber: simNumber.trim(),
        costPrice: costPrice!,
        publicPrice: publicPrice!,
        purchaseDate,
      })
      .subscribe({
        next: (phone) => {
          this.isSubmitting.set(false);
          this.notificationService.success(
            `Teléfono ${this.operatorLabel[phone.operator]} ${phone.model} registrado correctamente.`,
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
      model: '',
      imei: '',
      simNumber: '',
      costPrice: null,
      publicPrice: null,
      purchaseDate: todayIsoDate(),
    });
  }
}
