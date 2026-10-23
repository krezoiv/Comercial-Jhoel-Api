import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';

import { TransactionBank } from '../../../../../core/models';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { TransactionBankService, transactionBankImageUrl } from '../../../../../core/services/transaction-bank.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { transactionBankMonogram } from '../../../../../core/utils/transaction-bank-account.util';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Logo del banco agente — subir/reemplazar/eliminar. Clon de
 * `BankImageModalComponent` (Catálogo de Bancos) más una vista previa de cómo
 * se verá el icono en el modal "Selecciona el banco" de Transaccionar.
 */
@Component({
  selector: 'app-transaction-bank-image-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './transaction-bank-image-modal.component.html',
  styleUrl: './transaction-bank-image-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionBankImageModalComponent {
  @Input() bank: TransactionBank | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() changed = new EventEmitter<TransactionBank>();

  private readonly transactionBankService = inject(TransactionBankService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly isUploading = signal(false);
  readonly isRemoving = signal(false);

  get imageUrl(): string | null {
    return this.bank ? transactionBankImageUrl(this.bank) : null;
  }

  get monogram(): string {
    return this.bank ? transactionBankMonogram(this.bank) : '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    const bank = this.bank;
    if (!file || !bank || this.isUploading()) {
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      this.notificationService.error('La imagen debe ser JPG, PNG o WEBP.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      this.notificationService.error('La imagen no puede superar los 5 MB.');
      return;
    }

    this.isUploading.set(true);
    this.transactionBankService.setImage(bank.id, file).subscribe({
      next: (updated) => {
        this.isUploading.set(false);
        this.notificationService.success(`Imagen de "${updated.name}" actualizada.`);
        this.changed.emit(updated);
      },
      error: (error: HttpErrorResponse) => {
        this.isUploading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo subir la imagen.'));
      },
    });
  }

  async removeImage(): Promise<void> {
    const bank = this.bank;
    if (!bank || this.isRemoving()) {
      return;
    }
    const confirmed = await this.confirmDialogService.confirm({
      type: 'DELETE',
      title: 'Eliminar imagen',
      message: `¿Desea eliminar la imagen de ${bank.name}? El icono volverá a mostrar sus iniciales.`,
    });
    if (!confirmed) {
      return;
    }

    this.isRemoving.set(true);
    this.transactionBankService.removeImage(bank.id).subscribe({
      next: (updated) => {
        this.isRemoving.set(false);
        this.notificationService.success(`Se eliminó la imagen de "${updated.name}".`);
        this.changed.emit(updated);
      },
      error: (error: HttpErrorResponse) => {
        this.isRemoving.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo eliminar la imagen.'));
      },
    });
  }

  close(): void {
    this.closed.emit();
  }
}
