import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  SCHOOL_SUPPLY_LABEL,
  SCHOOL_SUPPLY_TONE,
  SUPPLY_SOURCE_LABEL,
  SchoolQuotation,
  formatCurrency,
  formatSchoolDateTime,
} from '../../../../../core/models';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { BadgeComponent, ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MODE_LABEL = { AUTO: 'FIFO automático', FIFO_MANUAL: 'FIFO manual', MANUAL: 'Manual' } as const;
const ALLOCATION_STATUS = { ASIGNADA: 'Reservada', LIBERADA: 'Liberada', ENTREGADA: 'Entregada' } as const;

/**
 * "Estado de abastecimiento" of one list: per product what was requested,
 * reserved for the list, still pending and delivered; the reservation history
 * (which purchase supplied what) and "Preparar y despachar lista". Dispatching
 * never discounts inventory again — the units were discounted when the list
 * was confirmed; the backend re-checks supply and payment under lock.
 */
@Component({
  selector: 'app-school-quotation-supply',
  standalone: true,
  imports: [FormsModule, BadgeComponent, ButtonComponent, IconComponent],
  templateUrl: './school-quotation-supply.component.html',
  styleUrl: './school-quotation-supply.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolQuotationSupplyComponent implements OnChanges {
  @Input({ required: true }) set quotation(value: SchoolQuotation) {
    this.current.set(value);
  }
  get quotation(): SchoolQuotation {
    return this.current()!;
  }
  /** Opens the dispatch dialog as soon as it is allowed (link "Preparar y despachar"). */
  @Input() openDispatch = false;
  @Output() dispatched = new EventEmitter<SchoolQuotation>();

  private readonly current = signal<SchoolQuotation | null>(null);
  readonly service = inject(SchoolListService);
  private readonly notifications = inject(NotificationService);

  readonly supplyLabel = SCHOOL_SUPPLY_LABEL;
  readonly supplyTone = SCHOOL_SUPPLY_TONE;
  readonly sourceLabel = SUPPLY_SOURCE_LABEL;
  readonly modeLabel = MODE_LABEL;
  readonly allocationStatus = ALLOCATION_STATUS;
  readonly formatDateTime = formatSchoolDateTime;
  readonly formatCurrency = formatCurrency;

  readonly dialog = signal(false);
  readonly observations = signal('');
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  private requestId = crypto.randomUUID();

  readonly supply = computed(() => this.current()?.supply);
  readonly totals = computed(() =>
    (this.supply()?.lines ?? []).reduce(
      (t, l) => ({
        requested: t.requested + l.requested,
        allocated: t.allocated + l.allocated,
        pending: t.pending + l.pending,
        delivered: t.delivered + l.delivered,
      }),
      { requested: 0, allocated: 0, pending: 0, delivered: 0 },
    ),
  );
  /** Why the list cannot be dispatched yet (null = it can). */
  readonly blocker = computed(() => {
    const q = this.current();
    if (!q) return 'Cargando…';
    if (q.supply.dispatch) return 'La lista ya fue despachada.';
    // Requirements flow: Bodega was discounted once, when the preparation was finished.
    if (q.fulfillmentMode === 'PREPARACION') {
      if (q.status !== 'TERMINADA') return 'Finalice la preparación del pedido antes de entregarlo.';
      return q.balance > 0 ? `Falta cobrar ${formatCurrency(q.balance)} antes de entregar.` : null;
    }
    if (!['PAGADA', 'EN_PREPARACION', 'TERMINADA'].includes(q.status) || q.balance > 0) {
      return q.balance > 0
        ? `Falta cobrar ${formatCurrency(q.balance)} antes de entregar.`
        : 'El estado de la lista no permite despacharla.';
    }
    if (q.supply.status !== 'DISPONIBLE') return 'Todavía hay productos pendientes de abastecimiento.';
    return null;
  });
  readonly canDispatch = computed(() => this.blocker() === null && this.service.can('school_lists.quotations.edit'));

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openDispatch'] && this.openDispatch && this.canDispatch()) {
      this.open();
    }
  }

  open(): void {
    this.observations.set('');
    this.error.set(null);
    this.requestId = crypto.randomUUID();
    this.dialog.set(true);
  }

  confirm(): void {
    const q = this.current();
    if (!q || !this.canDispatch() || this.saving()) return;
    this.saving.set(true);
    this.error.set(null);
    this.service.dispatch(q.id, this.observations().trim() || null, this.requestId).subscribe({
      next: (updated) => {
        this.saving.set(false);
        this.dialog.set(false);
        this.notifications.success(`Lista ${updated.quotationNumber} despachada y entregada. No se descontó inventario de nuevo.`);
        this.dispatched.emit(updated);
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(extractErrorMessage(error, 'No se pudo despachar la lista.'));
      },
    });
  }
}
