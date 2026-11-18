import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SCHOOL_PURGE_CONFIRMATION, SchoolPurgeSummary } from '../../../../../core/models';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * "Borrar todas las cotizaciones" (super administrators only, migration
 * 1760008500000). Shows what will be deleted and what returns to Bodega
 * (`GET /quotations/purge-preview`), and only enables the HARD delete once the
 * user types "BORRAR TODO". The button is disabled while the request runs, so
 * a double click cannot send it twice; the backend checks role and phrase
 * again. Like every dashboard modal it does not close on a backdrop click.
 */
@Component({
  selector: 'app-school-purge-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './school-purge-modal.component.html',
  styleUrl: './school-purge-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolPurgeModalComponent implements OnChanges {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  /** Emits what was deleted once the purge committed. */
  @Output() purged = new EventEmitter<SchoolPurgeSummary>();

  private readonly service = inject(SchoolListService);

  readonly phrase = SCHOOL_PURGE_CONFIRMATION;
  readonly preview = signal<SchoolPurgeSummary | null>(null);
  readonly typed = signal('');
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly matches = computed(() => this.typed().trim() === this.phrase);
  readonly canPurge = computed(() => this.matches() && !this.busy() && (this.preview()?.quotations ?? 0) > 0);

  ngOnChanges(): void {
    if (!this.open) return;
    this.typed.set('');
    this.error.set(null);
    this.preview.set(null);
    this.service.purgePreview().subscribe({
      next: (preview) => this.preview.set(preview),
      error: (error: HttpErrorResponse) => this.error.set(extractErrorMessage(error, 'No se pudo calcular qué se borrará.')),
    });
  }

  purge(): void {
    if (!this.canPurge()) return;
    this.busy.set(true);
    this.error.set(null);
    this.service.purgeQuotations(this.typed().trim()).subscribe({
      next: (result) => {
        this.busy.set(false);
        this.purged.emit(result);
      },
      error: (error: HttpErrorResponse) => {
        this.busy.set(false);
        this.error.set(extractErrorMessage(error, 'No se pudieron borrar las cotizaciones.'));
      },
    });
  }
}
