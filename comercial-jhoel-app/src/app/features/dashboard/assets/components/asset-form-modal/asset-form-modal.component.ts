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
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { Asset, Client } from '../../../../../core/models';
import { AssetService } from '../../../../../core/services/asset.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { ClientSearchSelectComponent } from '../client-search-select/client-search-select.component';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';

/**
 * Activos is the one monto field in this app that may legitimately be
 * negative (e.g. a correcting/reversing entry), by explicit scoped
 * request — every other form's amount field keeps `Validators.min(...)`
 * untouched. Zero still isn't a meaningful monto either way, so this
 * replaces the old "> 0" floor rather than dropping validation entirely.
 */
function notZero(control: AbstractControl): ValidationErrors | null {
  return control.value === 0 ? { notZero: true } : null;
}

function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

@Component({
  selector: 'app-asset-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, ClientSearchSelectComponent, DecimalInputDirective],
  templateUrl: './asset-form-modal.component.html',
  styleUrl: './asset-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetFormModalComponent implements OnChanges {
  @Input() open = false;
  /** null = create mode, an Asset = edit mode (form is pre-filled from it). */
  @Input() record: Asset | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Asset>();

  private readonly fb = inject(FormBuilder);
  private readonly assetService = inject(AssetService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  selectedClientName: string | null = null;

  readonly form = this.fb.nonNullable.group({
    clientId: ['', Validators.required],
    date: [todayIsoDate(), Validators.required],
    amount: [0, [Validators.required, notZero]],
    description: ['', Validators.maxLength(500)],
  });

  get isEditMode(): boolean {
    return this.record !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open) {
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(false);
    this.selectedClientName = this.record?.clientName ?? null;

    this.form.reset({
      clientId: this.record?.clientId ?? '',
      date: this.record?.date ?? todayIsoDate(),
      amount: this.record?.amount ?? 0,
      description: this.record?.description ?? '',
    });
  }

  onClientSelected(client: Client | null): void {
    this.selectedClientName = client?.name ?? null;
    this.form.controls.clientId.setValue(client?.id ?? '');
    this.form.controls.clientId.markAsTouched();
  }

  submit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const { clientId, date, amount, description } = this.form.getRawValue();
    this.isSubmitting.set(true);

    const input = {
      clientId,
      date,
      amount,
      description: description.trim().replace(/\s+/g, ' ') || undefined,
    };

    const request$ = this.isEditMode
      ? this.assetService.updateAsset(this.record!.id, input)
      : this.assetService.createAsset(input);

    request$.subscribe({
      next: (record) => {
        this.isSubmitting.set(false);
        this.saved.emit(record);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo guardar el activo. Inténtalo de nuevo.'));
      },
    });
  }

  close(): void {
    if (this.isSubmitting()) {
      return;
    }
    this.closed.emit();
  }
}
