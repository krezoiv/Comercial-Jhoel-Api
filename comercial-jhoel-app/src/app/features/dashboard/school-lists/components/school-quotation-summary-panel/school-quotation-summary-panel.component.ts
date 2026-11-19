import { ChangeDetectionStrategy, Component, InjectionToken, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { IconComponent } from '../../../../../shared/ui';
// Type-only import: no runtime cycle between the editor and this panel.
import type { SchoolQuotationEditorComponent } from '../school-quotation-editor/school-quotation-editor.component';

/** The editor that hosts the panel (provided by `SchoolQuotationEditorComponent` itself). */
export const SCHOOL_QUOTATION_EDITOR = new InjectionToken<SchoolQuotationEditorComponent>('SchoolQuotationEditor');

/**
 * Side panel of the POS quotation window: "Resumen de cotización" (lines,
 * articles, subtotal, discount, total), "Pagos" (initial payment with amount,
 * method, bank account and reference; amount paid; pending balance), the
 * "Guardar como borrador" option and the validation messages.
 *
 * It has no state of its own: it reads and updates the hosting editor's
 * signals, so totals, payment rules and saving stay in one place. It exists
 * as a separate component only to keep each stylesheet small.
 */
@Component({
  selector: 'app-school-quotation-summary-panel',
  standalone: true,
  imports: [FormsModule, DecimalInputDirective, IconComponent],
  templateUrl: './school-quotation-summary-panel.component.html',
  styleUrl: './school-quotation-summary-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolQuotationSummaryPanelComponent {
  readonly e = inject(SCHOOL_QUOTATION_EDITOR);
}
