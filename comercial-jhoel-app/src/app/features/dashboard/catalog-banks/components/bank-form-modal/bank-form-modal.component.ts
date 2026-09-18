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

import { CatalogBank } from '../../../../../core/models';
import { CatalogBankService } from '../../../../../core/services/catalog-bank.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

@Component({
  selector: 'app-bank-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent],
  templateUrl: './bank-form-modal.component.html',
  styleUrl: './bank-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankFormModalComponent implements OnChanges {
  @Input() open = false;
  /** null = crear, un CatalogBank = editar (formulario pre-llenado). */
  @Input() bank: CatalogBank | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CatalogBank>();

  private readonly fb = inject(FormBuilder);
  private readonly catalogBankService = inject(CatalogBankService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    description: [''],
    additionalInfo: [''],
  });

  get isEditMode(): boolean {
    return this.bank !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open) {
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(false);

    const bank = this.bank;
    this.form.reset({
      name: bank?.name ?? '',
      description: bank?.description ?? '',
      additionalInfo: bank?.additionalInfo ?? '',
    });
  }

  async submit(): Promise<void> {
    this.errorMessage.set(null);

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const confirmed = await this.confirmDialogService.confirm({ type: this.isEditMode ? 'UPDATE' : 'SAVE' });
    if (!confirmed) {
      return;
    }

    const raw = this.form.getRawValue();
    const input = {
      name: raw.name.trim(),
      description: raw.description.trim() || undefined,
      additionalInfo: raw.additionalInfo.trim() || undefined,
    };

    this.isSubmitting.set(true);
    const request$ = this.isEditMode
      ? this.catalogBankService.updateBank(this.bank!.id, input)
      : this.catalogBankService.createBank(input);

    request$.subscribe({
      next: (bank) => {
        this.isSubmitting.set(false);
        this.saved.emit(bank);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo guardar el banco. Inténtalo de nuevo.'));
      },
    });
  }

  async close(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }
    if (this.form.dirty) {
      const discard = await this.confirmDialogService.confirm({ type: 'CANCEL' });
      if (!discard) {
        return;
      }
    }
    this.closed.emit();
  }
}
