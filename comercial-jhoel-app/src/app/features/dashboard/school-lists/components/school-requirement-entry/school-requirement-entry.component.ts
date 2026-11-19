import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, computed, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { formatCurrency, roundMoney } from '../../../../../core/models';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { IconComponent } from '../../../../../shared/ui';
import { MAX_LINE_QUANTITY } from '../../school-line-rules';

/** A school requirement typed in the entry bar (no inventory product). */
export interface RequirementEntry {
  productName: string;
  quantity: number;
  unitPrice: number;
}

/**
 * "Agregar requerimiento" bar of the POS quotation window: description,
 * quantity, unit price and the live total, added with the button or Enter.
 * After adding it clears itself and returns focus to the description, so a
 * whole list can be typed without touching the mouse.
 *
 * Requirements are free text: nothing here looks up the inventory. The rules
 * mirror `lineError` (2–300 characters, whole quantity 1–9,999, price ≥ 0
 * with cents); the backend validates every line again when saving.
 */
@Component({
  selector: 'app-school-requirement-entry',
  standalone: true,
  imports: [FormsModule, DecimalInputDirective, IconComponent],
  templateUrl: './school-requirement-entry.component.html',
  styleUrl: './school-requirement-entry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolRequirementEntryComponent {
  @Output() added = new EventEmitter<RequirementEntry>();

  readonly formatCurrency = formatCurrency;
  readonly description = signal('');
  readonly quantity = signal<number | null>(1);
  readonly unitPrice = signal<number | null>(null);
  /** Errors show only after a first attempt, not while typing. */
  readonly attempted = signal(false);

  private readonly descriptionInput = viewChild.required<ElementRef<HTMLInputElement>>('desc');

  readonly total = computed(() => roundMoney((this.quantity() ?? 0) * (this.unitPrice() ?? 0)));
  /** First problem of the entry, in field order; null when it can be added. */
  readonly problem = computed<{ field: 'desc' | 'qty' | 'price'; message: string } | null>(() => {
    if (this.description().trim().length < 2) {
      return { field: 'desc', message: 'Escriba la descripción del requerimiento (mínimo 2 caracteres).' };
    }
    const qty = this.quantity();
    if (qty === null || !Number.isInteger(qty) || qty < 1 || qty > MAX_LINE_QUANTITY) {
      return { field: 'qty', message: 'La cantidad debe ser un entero entre 1 y 9,999.' };
    }
    const price = this.unitPrice();
    if (price === null || !(price >= 0) || roundMoney(price) !== price) {
      return { field: 'price', message: 'Indique el precio unitario (Q0.00 o más).' };
    }
    return null;
  });

  step(delta: number): void {
    this.quantity.set(Math.min(MAX_LINE_QUANTITY, Math.max(1, (this.quantity() ?? 0) + delta)));
  }

  submit(): void {
    this.attempted.set(true);
    const problem = this.problem();
    if (problem) {
      document.getElementById(`re-${problem.field}`)?.focus();
      return;
    }
    this.added.emit({
      productName: this.description().trim(),
      quantity: this.quantity()!,
      unitPrice: this.unitPrice()!,
    });
    this.description.set('');
    this.quantity.set(1);
    this.unitPrice.set(null);
    this.attempted.set(false);
    this.descriptionInput().nativeElement.focus();
  }
}
