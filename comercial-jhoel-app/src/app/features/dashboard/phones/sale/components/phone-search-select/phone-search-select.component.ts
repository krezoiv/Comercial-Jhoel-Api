import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PHONE_OPERATOR_LABEL, Phone } from '../../../../../../core/models';
import { IconComponent } from '../../../../../../shared/ui';

let nextInstanceId = 0;

/**
 * Searchable phone select for Ventas — same search-box-plus-dropdown shape
 * as `ClientSearchSelectComponent` (parent owns the selection via an
 * `input()`, this component only searches/emits), but entirely client-side:
 * filters the already-fetched `phones` list (only `DISPONIBLE` units, passed
 * in by the parent) by a case-insensitive partial match against modelo,
 * IMEI, or SIM — exactly the three ways the user asked to be able to find a
 * phone to sell. No backend search endpoint, no debounce — the list is
 * already in memory, same "client-side filter over a fully-fetched list"
 * convention this app already uses for Inventario/Categorías/etc.
 */
@Component({
  selector: 'app-phone-search-select',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './phone-search-select.component.html',
  styleUrl: './phone-search-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneSearchSelectComponent {
  readonly phones = input<Phone[]>([]);
  /** The currently selected phone's id, or null — set by the parent (e.g. cleared after a sale/reset). */
  readonly selectedPhoneId = input<string | null>(null);
  @Input() placeholder = 'Buscar por modelo, IMEI o SIM…';

  @Output() selectionChange = new EventEmitter<Phone | null>();

  readonly inputId = `phone-search-select-${nextInstanceId++}`;

  readonly query = signal('');
  readonly open = signal(false);

  operatorLabel = PHONE_OPERATOR_LABEL;

  readonly selectedPhone = computed<Phone | null>(() => {
    const id = this.selectedPhoneId();
    if (!id) {
      return null;
    }
    return this.phones().find((phone) => phone.id === id) ?? null;
  });

  readonly filteredPhones = computed(() => {
    const term = this.query().trim().toLowerCase();
    const phones = this.phones();
    if (!term) {
      return phones;
    }
    return phones.filter(
      (phone) =>
        phone.model.toLowerCase().includes(term) ||
        phone.imei.toLowerCase().includes(term) ||
        phone.simNumber.toLowerCase().includes(term),
    );
  });

  constructor() {
    effect(() => {
      if (!this.selectedPhoneId()) {
        this.query.set('');
      }
    });
  }

  onInput(value: string): void {
    this.query.set(value);
    this.open.set(true);
  }

  onFocus(): void {
    this.open.set(true);
  }

  onBlur(): void {
    setTimeout(() => this.open.set(false), 150);
  }

  select(phone: Phone): void {
    this.selectionChange.emit(phone);
    this.query.set('');
    this.open.set(false);
  }

  clear(): void {
    this.selectionChange.emit(null);
    this.query.set('');
  }
}
