import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SCHOOL_PURGE_CONFIRMATION, SchoolPurgeSummary, SchoolQuotationSummary, formatCurrency } from '../../../../../core/models';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * HARD delete of school-list quotations (super administrators only):
 * - without `quotation`: "Borrar todas las cotizaciones" (migration
 *   1760008500000), confirmed by typing "BORRAR TODO";
 * - with `quotation`: "Eliminar cotización" of that one list (migration
 *   1760008600000), confirmed by typing its number (e.g. "LE-000193").
 *
 * Shows what will be deleted and what returns to Bodega (preview endpoint)
 * and only enables the delete once the phrase matches. The button is disabled
 * while the request runs, so a double click cannot send it twice; the backend
 * checks role and phrase again. Like every dashboard modal it does not close
 * on a backdrop click.
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
  /** One quotation to delete; null deletes all of them. */
  @Input() quotation: SchoolQuotationSummary | null = null;
  @Output() closed = new EventEmitter<void>();
  /** Emits what was deleted once the purge committed. */
  @Output() purged = new EventEmitter<SchoolPurgeSummary>();

  private readonly service = inject(SchoolListService);

  readonly formatCurrency = formatCurrency;
  /** Text the user must type: the quotation number, or "BORRAR TODO". */
  phrase = SCHOOL_PURGE_CONFIRMATION;
  readonly preview = signal<SchoolPurgeSummary | null>(null);
  readonly typed = signal('');
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  private readonly target = signal<SchoolQuotationSummary | null>(null);
  readonly matches = computed(() => this.typed().trim() === (this.target()?.quotationNumber ?? SCHOOL_PURGE_CONFIRMATION));
  readonly canPurge = computed(() => this.matches() && !this.busy() && (this.preview()?.quotations ?? 0) > 0);

  ngOnChanges(): void {
    if (!this.open) return;
    this.target.set(this.quotation);
    this.phrase = this.quotation?.quotationNumber ?? SCHOOL_PURGE_CONFIRMATION;
    this.typed.set('');
    this.error.set(null);
    this.preview.set(null);
    const preview = this.quotation ? this.service.deletePreview(this.quotation.id) : this.service.purgePreview();
    preview.subscribe({
      next: (preview) => this.preview.set(preview),
      error: (error: HttpErrorResponse) => this.error.set(extractErrorMessage(error, 'No se pudo calcular qué se borrará.')),
    });
  }

  purge(): void {
    if (!this.canPurge()) return;
    this.busy.set(true);
    this.error.set(null);
    const target = this.target();
    const request = target
      ? this.service.deleteQuotation(target.id, this.typed().trim())
      : this.service.purgeQuotations(this.typed().trim());
    request.subscribe({
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
