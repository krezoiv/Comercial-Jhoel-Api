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

import { NewsArticle } from '../../../../../core/models';
import { NewsService } from '../../../../../core/services/news.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

@Component({
  selector: 'app-news-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent],
  templateUrl: './news-form-modal.component.html',
  styleUrl: './news-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsFormModalComponent implements OnChanges {
  @Input() open = false;
  /** null = crear, un NewsArticle = editar (formulario pre-llenado). */
  @Input() article: NewsArticle | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<NewsArticle>();

  private readonly fb = inject(FormBuilder);
  private readonly newsService = inject(NewsService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required]],
    publishedAt: [todayIsoDate(), [Validators.required]],
  });

  get isEditMode(): boolean {
    return this.article !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open) {
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(false);

    const article = this.article;
    this.form.reset({
      title: article?.title ?? '',
      description: article?.description ?? '',
      publishedAt: article?.publishedAt ?? todayIsoDate(),
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
      title: raw.title.trim(),
      description: raw.description.trim(),
      publishedAt: raw.publishedAt,
    };

    this.isSubmitting.set(true);
    const request$ = this.isEditMode
      ? this.newsService.updateArticle(this.article!.id, input)
      : this.newsService.createArticle(input);

    request$.subscribe({
      next: (article) => {
        this.isSubmitting.set(false);
        this.saved.emit(article);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo guardar la noticia. Inténtalo de nuevo.'));
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
