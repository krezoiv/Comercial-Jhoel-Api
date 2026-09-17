import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';

import { CatalogPhone } from '../../../../../core/models';
import { CatalogPhoneService } from '../../../../../core/services/catalog-phone.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Gestor de fotos de un teléfono del catálogo — subir/eliminar/marcar principal. Un teléfono solo puede publicarse con al menos una imagen (validado también en el backend). */
@Component({
  selector: 'app-catalog-phone-images-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './catalog-phone-images-modal.component.html',
  styleUrl: './catalog-phone-images-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPhoneImagesModalComponent {
  @Input() phone: CatalogPhone | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() changed = new EventEmitter<CatalogPhone>();

  private readonly catalogPhoneService = inject(CatalogPhoneService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly isUploading = signal(false);
  readonly removingImageId = signal<string | null>(null);

  get open(): boolean {
    return this.phone !== null;
  }

  imageUrl(imageId: string): string {
    return this.catalogPhoneService.getImageUrl(imageId);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    const phone = this.phone;
    if (!file || !phone) {
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
    this.catalogPhoneService.addImage(phone.id, file).subscribe({
      next: () => this.refetch(phone.id, () => this.isUploading.set(false)),
      error: (error: HttpErrorResponse) => {
        this.isUploading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo subir la imagen.'));
      },
    });
  }

  async removeImage(imageId: string): Promise<void> {
    const phone = this.phone;
    if (!phone) {
      return;
    }
    const confirmed = await this.confirmDialogService.confirm({
      type: 'DELETE',
      title: 'Eliminar imagen',
      message: '¿Desea eliminar esta imagen del teléfono? Esta acción no se puede deshacer.',
    });
    if (!confirmed) {
      return;
    }

    this.removingImageId.set(imageId);
    this.catalogPhoneService.removeImage(phone.id, imageId).subscribe({
      next: () => this.refetch(phone.id, () => this.removingImageId.set(null)),
      error: (error: HttpErrorResponse) => {
        this.removingImageId.set(null);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo eliminar la imagen.'));
      },
    });
  }

  setPrimary(imageId: string): void {
    const phone = this.phone;
    if (!phone) {
      return;
    }
    this.catalogPhoneService.setPrimaryImage(phone.id, imageId).subscribe({
      next: () => this.refetch(phone.id),
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo marcar la imagen como principal.'));
      },
    });
  }

  close(): void {
    this.closed.emit();
  }

  private refetch(phoneId: string, done?: () => void): void {
    this.catalogPhoneService.getPhoneById(phoneId).subscribe({
      next: (phone) => {
        done?.();
        this.changed.emit(phone);
      },
      error: (error: HttpErrorResponse) => {
        done?.();
        this.notificationService.error(extractErrorMessage(error, 'No se pudo actualizar la lista de imágenes.'));
      },
    });
  }
}
