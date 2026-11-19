import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, Output, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject, catchError, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';

import { SchoolQuotationSummary } from '../../../../../core/models';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { IconComponent } from '../../../../../shared/ui';

/** A customer who already has school-list quotations. */
export interface CustomerSuggestion {
  name: string;
  phone: string;
  /** Last student and grade quoted for that customer (context only). */
  detail: string;
}

const MIN_QUERY = 3;
const MAX_SUGGESTIONS = 5;

/** Distinct customers (same name + phone digits) of a quotation page, most recent first. */
export function customerSuggestions(quotations: SchoolQuotationSummary[]): CustomerSuggestion[] {
  const seen = new Set<string>();
  const result: CustomerSuggestion[] = [];
  for (const q of quotations) {
    const key = `${q.customerName.trim().toLowerCase()}|${q.customerPhone.replace(/\D/g, '')}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push({
      name: q.customerName,
      phone: q.customerPhone,
      detail: [q.studentName, q.grade].filter(Boolean).join(' · '),
    });
    if (result.length === MAX_SUGGESTIONS) {
      break;
    }
  }
  return result;
}

/**
 * "Cliente o encargado" field of the POS quotation window with customer
 * search: while typing (3+ characters) it looks up earlier school-list
 * quotations through the existing list endpoint (`GET /school-lists/
 * quotations?search=`, no new API) and offers the customers found. Picking
 * one fills the name and phone; the student is shown only as context because
 * one family can buy lists for several children.
 *
 * Keyboard: ↑/↓ move, Enter picks, Escape closes the list (and is marked as
 * handled so the window behind does not close too). A failed lookup simply
 * shows no suggestions.
 */
@Component({
  selector: 'app-school-customer-field',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './school-customer-field.component.html',
  styleUrl: './school-customer-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCustomerFieldComponent {
  readonly name = model('');
  @Input() inputId = 'se-name';
  @Input() invalid = false;
  @Output() picked = new EventEmitter<CustomerSuggestion>();

  private readonly service = inject(SchoolListService);
  private readonly queries = new Subject<string>();

  readonly suggestions = signal<CustomerSuggestion[]>([]);
  readonly open = signal(false);
  readonly active = signal(-1);
  /** A late search result must not open the list after the user moved on. */
  private focused = false;

  constructor() {
    this.queries
      .pipe(
        map((q) => q.trim()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) =>
          q.length < MIN_QUERY
            ? of([])
            : this.service.getQuotations({ search: q, limit: 20, sortBy: 'date', sortDirection: 'desc' }).pipe(
                map((page) => customerSuggestions(page.items)),
                catchError(() => of([])),
              ),
        ),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe((list) => {
        this.suggestions.set(list);
        this.active.set(-1);
        this.open.set(this.focused && list.length > 0);
      });
  }

  onInput(value: string): void {
    this.focused = true;
    this.name.set(value);
    this.queries.next(value);
  }

  onFocus(): void {
    this.focused = true;
  }

  onBlur(): void {
    this.focused = false;
    this.close();
  }

  onKeydown(event: KeyboardEvent): void {
    const list = this.suggestions();
    if (!this.open() || !list.length) {
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      this.active.set((this.active() + delta + list.length) % list.length);
    } else if (event.key === 'Enter' && this.active() >= 0) {
      event.preventDefault();
      this.pick(list[this.active()]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  pick(suggestion: CustomerSuggestion): void {
    this.name.set(suggestion.name);
    this.picked.emit(suggestion);
    this.close();
  }

  close(): void {
    this.open.set(false);
    this.active.set(-1);
  }
}
