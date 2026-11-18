import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SchoolQuotation, isSchoolQuotationEditable } from '../../../core/models';
import { SchoolListService } from '../../../core/services/school-list.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { SchoolQuotationEditorComponent } from './components/school-quotation-editor/school-quotation-editor.component';

/**
 * "Editar cotización": the same editor as "Nueva cotización", loaded with the
 * quotation's own lines and its `version` (a concurrent edit is rejected by
 * the backend with a clear message). Delivered or cancelled quotations are
 * read-only.
 */
@Component({
  selector: 'app-school-quotation-edit-page',
  standalone: true,
  imports: [RouterLink, IconComponent, PageHeaderComponent, SchoolQuotationEditorComponent],
  template: `
    <div class="edit">
      <a class="back" [routerLink]="['/dashboard/listas-escolares/cotizaciones', id]"><app-icon name="chevron-left" [size]="16" /> Volver al detalle</a>
      @if (quotation(); as q) {
        <app-page-header icon="edit-2" [title]="'Editar ' + q.quotationNumber" [subtitle]="q.customerName + ' · ' + q.grade" />
        @if (editable()) {
          <app-school-quotation-editor [quotation]="q" (saved)="back()" (cancelled)="back()" />
        } @else {
          <p class="state">La cotización está {{ q.status === 'ENTREGADA' ? 'entregada' : 'cancelada' }} y ya no se puede modificar.</p>
        }
      } @else if (failed()) {
        <p class="state state--error" role="alert">{{ failed() }}</p>
      } @else {
        <p class="state">Cargando cotización…</p>
      }
    </div>
  `,
  styles: [
    `
      .edit { display: flex; flex-direction: column; gap: var(--space-5); min-width: 0; }
      .back { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--fs-sm); color: var(--color-primary-600); }
      .state { padding: var(--space-6); text-align: center; color: var(--color-text-on-light-muted); }
      .state--error { color: var(--color-danger); }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolQuotationEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(SchoolListService);

  readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  readonly quotation = signal<SchoolQuotation | null>(null);
  readonly failed = signal<string | null>(null);
  readonly editable = signal(false);

  constructor() {
    const load = () =>
      this.service.getQuotation(this.id).subscribe({
        next: (q) => {
          this.editable.set(isSchoolQuotationEditable(q.status) && this.service.can('school_lists.quotations.edit'));
          this.quotation.set(q);
        },
        error: (error: HttpErrorResponse) => this.failed.set(extractErrorMessage(error, 'No se pudo cargar la cotización.')),
      });
    if (this.service.permissionsLoaded()) {
      load();
    } else {
      this.service.loadPermissions().subscribe({ next: load, error: load });
    }
  }

  back(): void {
    void this.router.navigate(['/dashboard/listas-escolares/cotizaciones', this.id]);
  }
}
