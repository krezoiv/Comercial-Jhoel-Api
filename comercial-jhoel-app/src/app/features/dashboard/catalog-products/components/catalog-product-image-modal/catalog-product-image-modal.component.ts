import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';

import { CatalogProduct } from '../../../../../core/models';
import { CatalogProductService } from '../../../../../core/services/catalog-product.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Gestor de la imagen única de una publicación de catálogo (Librería/Variedades) — subir/reemplazar/eliminar. */
@Component({
  selector: 'app-catalog-product-image-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './catalog-product-image-modal.component.html',
  styleUrl: './catalog-product-image-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogProductImageModalComponent {
  @Input() product: CatalogProduct | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() changed = new EventEmitter<CatalogProduct>();

  private readonly catalogProductService = inject(CatalogProductService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly isUploading = signal(false);
  readonly isRemoving = signal(false);

  get open(): boolean {
    return this.product !== null;
  }

  get imageUrl(): string | null {
    return this.product?.hasImage ? this.catalogProductService.getImageUrl(this.product.id) : null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    const product = this.product;
    if (!file || !product) {
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
    this.catalogProductService.setImage(product.id, file).subscribe({
      next: () => this.refetch(product.id, () => this.isUploading.set(false)),
      error: (error: HttpErrorResponse) => {
        this.isUploading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo subir la imagen.'));
      },
    });
  }

  async removeImage(): Promise<void> {
    const product = this.product;
    if (!product) {
      return;
    }
    const confirmed = await this.confirmDialogService.confirm({
      type: 'DELETE',
      title: 'Eliminar imagen',
      message: '¿Desea eliminar la imagen de esta publicación? Esta acción no se puede deshacer.',
    });
    if (!confirmed) {
      return;
    }

    this.isRemoving.set(true);
    this.catalogProductService.removeImage(product.id).subscribe({
      next: () => this.refetch(product.id, () => this.isRemoving.set(false)),
      error: (error: HttpErrorResponse) => {
        this.isRemoving.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo eliminar la imagen.'));
      },
    });
  }

  close(): void {
    this.closed.emit();
  }

  private refetch(productId: string, done?: () => void): void {
    this.catalogProductService.getProductById(productId).subscribe({
      next: (product) => {
        done?.();
        this.changed.emit(product);
      },
      error: (error: HttpErrorResponse) => {
        done?.();
        this.notificationService.error(extractErrorMessage(error, 'No se pudo actualizar la imagen.'));
      },
    });
  }
}
