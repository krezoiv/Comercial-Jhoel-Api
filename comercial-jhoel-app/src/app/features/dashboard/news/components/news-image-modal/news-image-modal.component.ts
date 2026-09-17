import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';

import { NewsArticle } from '../../../../../core/models';
import { NewsService } from '../../../../../core/services/news.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Gestor de la imagen principal de una noticia — subir/reemplazar/eliminar. */
@Component({
  selector: 'app-news-image-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './news-image-modal.component.html',
  styleUrl: './news-image-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsImageModalComponent {
  @Input() article: NewsArticle | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() changed = new EventEmitter<NewsArticle>();

  private readonly newsService = inject(NewsService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly isUploading = signal(false);
  readonly isRemoving = signal(false);

  get open(): boolean {
    return this.article !== null;
  }

  get imageUrl(): string | null {
    return this.article?.hasImage ? this.newsService.getImageUrl(this.article.id) : null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    const article = this.article;
    if (!file || !article) {
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
    this.newsService.setImage(article.id, file).subscribe({
      next: () => this.refetch(article.id, () => this.isUploading.set(false)),
      error: (error: HttpErrorResponse) => {
        this.isUploading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo subir la imagen.'));
      },
    });
  }

  async removeImage(): Promise<void> {
    const article = this.article;
    if (!article) {
      return;
    }
    const confirmed = await this.confirmDialogService.confirm({
      type: 'DELETE',
      title: 'Eliminar imagen',
      message: '¿Desea eliminar la imagen de esta noticia? Esta acción no se puede deshacer.',
    });
    if (!confirmed) {
      return;
    }

    this.isRemoving.set(true);
    this.newsService.removeImage(article.id).subscribe({
      next: () => this.refetch(article.id, () => this.isRemoving.set(false)),
      error: (error: HttpErrorResponse) => {
        this.isRemoving.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo eliminar la imagen.'));
      },
    });
  }

  close(): void {
    this.closed.emit();
  }

  private refetch(articleId: string, done?: () => void): void {
    this.newsService.getArticleById(articleId).subscribe({
      next: (article) => {
        done?.();
        this.changed.emit(article);
      },
      error: (error: HttpErrorResponse) => {
        done?.();
        this.notificationService.error(extractErrorMessage(error, 'No se pudo actualizar la imagen.'));
      },
    });
  }
}
