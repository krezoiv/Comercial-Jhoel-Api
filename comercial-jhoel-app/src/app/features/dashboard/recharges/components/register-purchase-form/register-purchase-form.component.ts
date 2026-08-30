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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { RechargeDailyBalance, RechargeType, formatCurrency } from '../../../../../core/models';
import { RechargesService } from '../../../../../core/services/recharges.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';

/**
 * Self-contained, like `CategoryFormModalComponent`/`ProductFormModalComponent` — calls
 * `RechargesService` directly and emits the updated row so the parent only has to merge it
 * into its `balances` list, rather than owning the request itself.
 */
@Component({
  selector: 'app-register-purchase-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective],
  templateUrl: './register-purchase-form.component.html',
  styleUrl: './register-purchase-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPurchaseFormComponent implements OnChanges {
  @Input() types: RechargeType[] = [];
  /** `yyyy-MM-dd` — the page's operation-date picker value; every purchase is credited to this date, not necessarily today. */
  @Input() operationDate = '';

  @Output() registered = new EventEmitter<RechargeDailyBalance>();

  private readonly fb = inject(FormBuilder);
  private readonly rechargesService = inject(RechargesService);
  private readonly notificationService = inject(NotificationService);

  readonly isSubmitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    rechargeTypeId: ['', Validators.required],
    amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['types'] && this.types.length > 0 && !this.form.controls.rechargeTypeId.value) {
      this.form.controls.rechargeTypeId.setValue(this.types[0].id);
    }
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const { rechargeTypeId, amount } = this.form.getRawValue();
    this.isSubmitting.set(true);

    this.rechargesService
      .registerPurchase({ rechargeTypeId, amount: amount!, operationDate: this.operationDate })
      .subscribe({
      next: (balance) => {
        this.isSubmitting.set(false);
        this.form.controls.amount.reset(null);
        this.notificationService.success(
          `Compra de ${formatCurrency(amount!)} registrada para ${balance.rechargeTypeName}.`
        );
        this.registered.emit(balance);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo registrar la compra.'));
      },
    });
  }
}
