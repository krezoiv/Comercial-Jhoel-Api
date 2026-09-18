import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';

import { CatalogBank } from '../../../../../core/models';
import { CatalogBankService } from '../../../../../core/services/catalog-bank.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Gestor de la imagen principal de un banco — subir/reemplazar/eliminar. Clon de `NewsImageModalComponent`. */
@Component({
  selector: 'app-bank-image-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './bank-image-modal.component.html',
  styleUrl: './bank-image-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankImageModalComponent {
  @Input() bank: CatalogBank | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() changed = new EventEmitter<CatalogBank>();

  private readonly catalogBankService = inject(CatalogBankService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly isUploading = signal(false);
  readonly isRemoving = signal(false);

  get open(): boolean {
    return this.bank !== null;
  }

  get imageUrl(): string | null {
    return this.bank?.hasImage ? this.catalogBankService.getImageUrl(this.bank.id) : null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    const bank = this.bank;
    if (!file || !bank) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.notificationService.error('El archivo debe ser una imagen.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      this.notificationService.error('La imagen no puede superar los 5 MB.');
      return;
    }

    this.isUploading.set(true);
    this.catalogBankService.setImage(bank.id, file).subscribe({
      next: () => this.refetch(bank.id, () => this.isUploading.set(false)),
      error: (error: HttpErrorResponse) => {
        this.isUploading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo subir la imagen.'));
      },
    });
  }

  async removeImage(): Promise<void> {
    const bank = this.bank;
    if (!bank) {
      return;
    }
    const confirmed = await this.confirmDialogService.confirm({
      type: 'DELETE',
      title: 'Eliminar imagen',
      message: '¿Desea eliminar la imagen de este banco? Esta acción no se puede deshacer.',
    });
    if (!confirmed) {
      return;
    }

    this.isRemoving.set(true);
    this.catalogBankService.removeImage(bank.id).subscribe({
      next: () => this.refetch(bank.id, () => this.isRemoving.set(false)),
      error: (error: HttpErrorResponse) => {
        this.isRemoving.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo eliminar la imagen.'));
      },
    });
  }

  close(): void {
    this.closed.emit();
  }

  private refetch(bankId: string, done?: () => void): void {
    this.catalogBankService.getBankById(bankId).subscribe({
      next: (bank) => {
        done?.();
        this.changed.emit(bank);
      },
      error: (error: HttpErrorResponse) => {
        done?.();
        this.notificationService.error(extractErrorMessage(error, 'No se pudo actualizar la imagen.'));
      },
    });
  }
}
