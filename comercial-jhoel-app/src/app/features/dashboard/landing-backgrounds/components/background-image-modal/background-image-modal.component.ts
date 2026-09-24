import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';

import { LandingBackground } from '../../../../../core/models';
import { LandingBackgroundService } from '../../../../../core/services/landing-background.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Gestor de la imagen de un fondo de landing — subir/reemplazar/eliminar. Clon de `BankImageModalComponent`. */
@Component({
  selector: 'app-background-image-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './background-image-modal.component.html',
  styleUrl: './background-image-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundImageModalComponent {
  @Input() background: LandingBackground | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() changed = new EventEmitter<LandingBackground>();

  private readonly landingBackgroundService = inject(LandingBackgroundService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly isUploading = signal(false);
  readonly isRemoving = signal(false);

  get open(): boolean {
    return this.background !== null;
  }

  get imageUrl(): string | null {
    return this.background?.hasImage ? this.landingBackgroundService.getImageUrl(this.background.id) : null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    const background = this.background;
    if (!file || !background) {
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
    this.landingBackgroundService.setImage(background.id, file).subscribe({
      next: () => this.refetch(background.id, () => this.isUploading.set(false)),
      error: (error: HttpErrorResponse) => {
        this.isUploading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo subir la imagen.'));
      },
    });
  }

  async removeImage(): Promise<void> {
    const background = this.background;
    if (!background) {
      return;
    }
    const confirmed = await this.confirmDialogService.confirm({
      type: 'DELETE',
      title: 'Eliminar imagen',
      message: '¿Desea eliminar la imagen de este fondo? Esta acción no se puede deshacer.',
    });
    if (!confirmed) {
      return;
    }

    this.isRemoving.set(true);
    this.landingBackgroundService.removeImage(background.id).subscribe({
      next: () => this.refetch(background.id, () => this.isRemoving.set(false)),
      error: (error: HttpErrorResponse) => {
        this.isRemoving.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo eliminar la imagen.'));
      },
    });
  }

  close(): void {
    this.closed.emit();
  }

  private refetch(backgroundId: string, done?: () => void): void {
    this.landingBackgroundService.getBackgroundById(backgroundId).subscribe({
      next: (background) => {
        done?.();
        this.changed.emit(background);
      },
      error: (error: HttpErrorResponse) => {
        done?.();
        this.notificationService.error(extractErrorMessage(error, 'No se pudo actualizar la imagen.'));
      },
    });
  }
}
