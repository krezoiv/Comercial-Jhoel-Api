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

import { NewsType } from '../../../../../core/models';
import { NewsTypeService } from '../../../../../core/services/news-type.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

@Component({
  selector: 'app-news-type-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent],
  templateUrl: './news-type-form-modal.component.html',
  styleUrl: './news-type-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsTypeFormModalComponent implements OnChanges {
  @Input() open = false;
  /** null = crear, un NewsType = editar (formulario pre-llenado). */
  @Input() type: NewsType | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<NewsType>();

  private readonly fb = inject(FormBuilder);
  private readonly newsTypeService = inject(NewsTypeService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(255)]],
  });

  get isEditMode(): boolean {
    return this.type !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open) {
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(false);

    const type = this.type;
    this.form.reset({
      name: type?.name ?? '',
      description: type?.description ?? '',
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
    };

    this.isSubmitting.set(true);
    const request$ = this.isEditMode
      ? this.newsTypeService.updateType(this.type!.id, input)
      : this.newsTypeService.createType(input);

    request$.subscribe({
      next: (type) => {
        this.isSubmitting.set(false);
        this.saved.emit(type);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo guardar el tipo de noticia. Inténtalo de nuevo.'));
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
