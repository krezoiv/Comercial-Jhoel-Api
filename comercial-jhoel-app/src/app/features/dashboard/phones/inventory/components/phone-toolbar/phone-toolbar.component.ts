import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PhoneOperator, PhoneStatus } from '../../../../../../core/models';
import { IconComponent } from '../../../../../../shared/ui';

export type PhoneOperatorFilter = 'all' | PhoneOperator;
export type PhoneStatusFilter = 'all' | PhoneStatus;

interface FilterOption<T> {
  value: T;
  label: string;
}

const OPERATOR_OPTIONS: FilterOption<PhoneOperatorFilter>[] = [
  { value: 'all', label: 'Todas' },
  { value: 'CLARO', label: 'Claro' },
  { value: 'TIGO', label: 'Tigo' },
];

const STATUS_OPTIONS: FilterOption<PhoneStatusFilter>[] = [
  { value: 'all', label: 'Todos' },
  { value: 'DISPONIBLE', label: 'Disponibles' },
  { value: 'VENDIDO', label: 'Vendidos' },
];

/** Client-side filters only — same "no volume yet that justifies server-side filtering" call as Categorías/Negocios/Proveedores. */
@Component({
  selector: 'app-phone-toolbar',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './phone-toolbar.component.html',
  styleUrl: './phone-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneToolbarComponent {
  @Input() searchTerm = '';
  @Input() operatorFilter: PhoneOperatorFilter = 'all';
  @Input() statusFilter: PhoneStatusFilter = 'all';
  @Input() purchaseDateFrom = '';
  @Input() purchaseDateTo = '';
  @Input() saleDateFrom = '';
  @Input() saleDateTo = '';

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() operatorFilterChange = new EventEmitter<PhoneOperatorFilter>();
  @Output() statusFilterChange = new EventEmitter<PhoneStatusFilter>();
  @Output() purchaseDateFromChange = new EventEmitter<string>();
  @Output() purchaseDateToChange = new EventEmitter<string>();
  @Output() saleDateFromChange = new EventEmitter<string>();
  @Output() saleDateToChange = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();

  readonly operatorOptions = OPERATOR_OPTIONS;
  readonly statusOptions = STATUS_OPTIONS;
}
