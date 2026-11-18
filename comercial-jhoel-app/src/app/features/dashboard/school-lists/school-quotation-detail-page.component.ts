import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, map } from 'rxjs';

import {
  SCHOOL_ACCOUNT_LABEL,
  SCHOOL_ACCOUNT_TONE,
  SCHOOL_HISTORY_LABEL,
  SCHOOL_INVENTORY_MOVEMENT_LABEL,
  SCHOOL_LINE_SOURCE_LABEL,
  SCHOOL_PAYMENT_KIND_LABEL,
  SCHOOL_PAYMENT_METHOD_LABEL,
  SCHOOL_STATUS_LABEL,
  SCHOOL_STATUS_COLOR,
  SCHOOL_STATUS_TONE,
  SchoolHistoryEntry,
  SchoolPayment,
  SchoolQuotation,
  SchoolStatusAction,
  canReceiveSchoolPayment,
  formatCurrency,
  formatSchoolDate,
  formatSchoolDateTime,
  isSchoolQuotationEditable,
} from '../../../core/models';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PdfPromptModalService } from '../../../core/services/pdf-prompt-modal.service';
import { SchoolListService } from '../../../core/services/school-list.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { BadgeComponent, ButtonComponent, IconComponent, SummaryTileComponent } from '../../../shared/ui';
import { SchoolPaymentModalComponent } from './components/school-payment-modal/school-payment-modal.component';
import { SchoolQuotationSupplyComponent } from './components/school-quotation-supply/school-quotation-supply.component';
import { SchoolReasonModalComponent, SchoolReasonResult } from './components/school-reason-modal/school-reason-modal.component';
import { SchoolDocumentsService } from './school-documents.service';

type DetailView = 'detalle' | 'abastecimiento' | 'cuenta' | 'historial';

const ACTION_COPY: Record<SchoolStatusAction, { title: string; message: string; done: string }> = {
  CONFIRMAR: {
    title: 'Confirmar cotización',
    message:
      'El borrador pasará a "Cotizada", podrá recibir anticipos y abonos, y se descontarán de Bodega los productos del inventario.',
    done: 'Cotización confirmada.',
  },
  PREPARAR: {
    title: 'Pasar a preparación',
    message: 'La cotización quedará "En preparación". Puede seguir recibiendo abonos hasta cancelar el saldo.',
    done: 'Cotización en preparación.',
  },
  TERMINAR: {
    title: 'Marcar como terminada',
    message: 'La lista queda despachada y lista para ser entregada. Puede seguir recibiendo abonos; la entrega exige el saldo completo.',
    done: 'Cotización terminada: lista para entregar.',
  },
  ENTREGAR: {
    title: 'Registrar entrega',
    message: 'Se registrará la entrega de los útiles y la cotización quedará cerrada. No descuenta inventario ni registra una venta.',
    done: 'Entrega registrada.',
  },
};

/** Copy of the requirements flow (migration 1760008400000) where it differs. */
const REQUIREMENT_ACTION_COPY: Partial<Record<SchoolStatusAction, { title: string; message: string; done: string }>> = {
  CONFIRMAR: {
    title: 'Confirmar cotización',
    message: 'El borrador pasará a "Aceptada" y podrá recibir anticipos y abonos. No se descuenta inventario.',
    done: 'Cotización aceptada.',
  },
  PREPARAR: {
    title: 'Iniciar preparación',
    message:
      'La lista pasará a "En preparación" para elegir los productos de inventario de cada requerimiento. No se descuenta inventario hasta finalizar la preparación.',
    done: 'Lista en preparación: asigne los productos de inventario.',
  },
};

/**
 * Detail of a school quotation: customer, grade, lines, financial cards,
 * account statement (with receipts and audited reversals), observations and
 * the change history. Every figure comes from the backend.
 */
@Component({
  selector: 'app-school-quotation-detail-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    SummaryTileComponent,
    SchoolPaymentModalComponent,
    SchoolReasonModalComponent,
    SchoolQuotationSupplyComponent,
  ],
  templateUrl: './school-quotation-detail-page.component.html',
  styleUrl: './school-quotation-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolQuotationDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly service = inject(SchoolListService);
  readonly documents = inject(SchoolDocumentsService);
  private readonly confirm = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);
  private readonly pdfPrompt = inject(PdfPromptModalService);

  readonly formatCurrency = formatCurrency;
  readonly formatDate = formatSchoolDate;
  readonly formatDateTime = formatSchoolDateTime;
  readonly statusLabel = SCHOOL_STATUS_LABEL;
  readonly statusTone = SCHOOL_STATUS_TONE;
  readonly statusColor = SCHOOL_STATUS_COLOR;
  readonly accountLabel = SCHOOL_ACCOUNT_LABEL;
  readonly accountTone = SCHOOL_ACCOUNT_TONE;
  readonly kindLabel = SCHOOL_PAYMENT_KIND_LABEL;
  readonly methodLabel = SCHOOL_PAYMENT_METHOD_LABEL;
  readonly sourceLabel = SCHOOL_LINE_SOURCE_LABEL;
  readonly historyLabel = SCHOOL_HISTORY_LABEL;
  readonly movementLabel = SCHOOL_INVENTORY_MOVEMENT_LABEL;
  /** Units the list currently holds from Bodega (what an annulment returns). */
  /** Opens "Preparar y despachar" in the supply section. */
  readonly openDispatch = signal(false);
  /** Units reserved for this list that an annulment releases back to free stock. */
  readonly reservedUnits = computed(() =>
    (this.quotation()?.supply.allocations ?? [])
      .filter((a) => a.status === 'ASIGNADA')
      .reduce((sum, a) => sum + a.quantity, 0),
  );
  readonly heldUnits = computed(() =>
    (this.quotation()?.inventory ?? []).reduce(
      (sum, m) => sum + (m.movementType === 'SALIDA_LISTA_ESCOLAR' ? m.quantity : -m.quantity),
      0,
    ),
  );
  readonly actionIcon: Record<SchoolStatusAction, string> = { CONFIRMAR: 'check', PREPARAR: 'package', TERMINAR: 'check-check', ENTREGAR: 'truck' };
  readonly actionLabel: Record<SchoolStatusAction, string> = {
    CONFIRMAR: 'Confirmar',
    PREPARAR: 'En preparación',
    TERMINAR: 'Marcar como terminada',
    ENTREGAR: 'Preparar y despachar lista',
  };

  readonly quotation = signal<SchoolQuotation | null>(null);
  readonly failed = signal<string | null>(null);
  readonly view = signal<DetailView>('detalle');
  readonly busy = signal(false);
  readonly paying = signal(false);
  readonly notes = signal('');
  readonly editingNotes = signal(false);

  readonly voiding = signal<SchoolPayment | null>(null);
  readonly cancelling = signal(false);
  readonly reasonBusy = signal(false);
  readonly reasonError = signal<string | null>(null);
  private reasonRequestId = crypto.randomUUID();

  readonly editable = computed(() => {
    const q = this.quotation();
    return !!q && isSchoolQuotationEditable(q.status, q.fulfillmentMode) && this.service.can('school_lists.quotations.edit');
  });
  /** Requirements flow: lines are school requirements; products are assigned in "Preparación". */
  readonly requirementMode = computed(() => this.quotation()?.fulfillmentMode === 'PREPARACION');
  /** "Preparación del pedido" is reachable once the list is being (or was) prepared. */
  readonly hasPreparation = computed(() => {
    const q = this.quotation();
    return !!q && q.fulfillmentMode === 'PREPARACION' && ['EN_PREPARACION', 'TERMINADA', 'ENTREGADA'].includes(q.status);
  });
  readonly canPay = computed(() => {
    const q = this.quotation();
    return !!q && canReceiveSchoolPayment(q.status) && q.balance > 0 && this.service.can('school_lists.payments.register');
  });
  readonly canCancel = computed(() => {
    const q = this.quotation();
    return !!q && isSchoolQuotationEditable(q.status) && this.service.can('school_lists.quotations.cancel');
  });
  readonly nextActions = computed<SchoolStatusAction[]>(() => {
    const q = this.quotation();
    if (!q || !this.service.can('school_lists.quotations.edit')) return [];
    const actions: SchoolStatusAction[] = [];
    if (q.status === 'BORRADOR') actions.push('CONFIRMAR');
    if (q.fulfillmentMode === 'PREPARACION') {
      // ACEPTADA → preparation; finishing happens on the preparation screen; delivery once finished and paid.
      if (q.status === 'ACEPTADA') actions.push('PREPARAR');
      if (q.status === 'TERMINADA' && q.balance <= 0 && !q.supply.dispatch) actions.push('ENTREGAR');
      return actions;
    }
    if (['COTIZADA', 'ANTICIPO_RECIBIDO', 'PAGO_PARCIAL', 'PAGADA'].includes(q.status)) actions.push('PREPARAR');
    if (['COTIZADA', 'ANTICIPO_RECIBIDO', 'PAGO_PARCIAL', 'PAGADA', 'EN_PREPARACION'].includes(q.status)) actions.push('TERMINAR');
    // Delivery = dispatch: only when paid and fully supplied (the dialog reviews the products).
    if (['PAGADA', 'EN_PREPARACION', 'TERMINADA'].includes(q.status) && q.balance <= 0 && q.supply.status === 'DISPONIBLE') {
      actions.push('ENTREGAR');
    }
    return actions;
  });

  constructor() {
    const vista = this.route.snapshot.queryParamMap.get('vista');
    if (vista === 'cuenta' || vista === 'historial' || vista === 'abastecimiento') {
      this.view.set(vista);
    }
    this.openDispatch.set(this.route.snapshot.queryParamMap.get('despachar') === '1');
    if (!this.service.permissionsLoaded()) {
      this.service.loadPermissions().subscribe({ error: () => undefined });
    }
    this.load();
  }

  private get id(): string {
    return this.route.snapshot.paramMap.get('id') ?? '';
  }

  load(): void {
    this.service.getQuotation(this.id).subscribe({
      next: (q) => this.apply(q),
      error: (error: HttpErrorResponse) => this.failed.set(extractErrorMessage(error, 'No se pudo cargar la cotización.')),
    });
  }

  apply(q: SchoolQuotation): void {
    this.quotation.set(q);
    this.failed.set(null);
    if (!this.editingNotes()) {
      this.notes.set(q.observations ?? '');
    }
  }

  setView(view: DetailView): void {
    this.view.set(view);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { vista: view }, replaceUrl: true });
  }

  edit(): void {
    void this.router.navigate(['/dashboard/listas-escolares/cotizaciones', this.id, 'editar']);
  }

  /** "Preparación del pedido": assign inventory products to each requirement. */
  openPreparation(): void {
    void this.router.navigate(['/dashboard/listas-escolares/cotizaciones', this.id, 'preparacion']);
  }

  /** Assigned products of a requirement, as one line of internal text. */
  assignedText(item: SchoolQuotation['items'][number]): string {
    return item.assignments.map((a) => `${a.productName} × ${a.quantity}`).join(' · ');
  }

  /** Opens the editor with the "Cambiar producto" modal already on this line (`?cambiar=`). */
  swapItem(itemId: string): void {
    void this.router.navigate(['/dashboard/listas-escolares/cotizaciones', this.id, 'editar'], {
      queryParams: { cambiar: itemId },
    });
  }

  pdf(mode: 'download' | 'print'): void {
    const q = this.quotation();
    if (q) this.documents.quotation(q.id, q.quotationNumber, mode);
  }

  receipt(p: SchoolPayment): void {
    this.documents.receipt(p.id, p.receiptNumber);
  }

  onPaid(result: { paymentId: string; quotation: SchoolQuotation }): void {
    this.paying.set(false);
    this.apply(result.quotation);
    const payment = result.quotation.payments.find((p) => p.id === result.paymentId);
    if (payment && this.service.can('school_lists.documents.generate')) {
      this.pdfPrompt.prompt({
        title: 'Comprobante de pago',
        message: `¿Desea generar el comprobante ${payment.receiptNumber}?`,
        generate: () => this.service.receiptPdf(payment.id),
        filename: `${payment.receiptNumber}.pdf`,
      });
    }
  }

  async runAction(action: SchoolStatusAction): Promise<void> {
    const q = this.quotation();
    if (!q || this.busy()) return;
    if (action === 'ENTREGAR') {
      this.view.set('abastecimiento');
      this.openDispatch.set(false);
      queueMicrotask(() => this.openDispatch.set(true));
      return;
    }
    const copy = q.fulfillmentMode === 'PREPARACION' ? { ...ACTION_COPY[action], ...REQUIREMENT_ACTION_COPY[action] } : ACTION_COPY[action];
    const ok = await this.confirm.confirm({ type: 'UPDATE', title: copy.title, message: `${q.quotationNumber}: ${copy.message}`, confirmText: copy.title });
    if (!ok) return;
    this.busy.set(true);
    this.service.changeStatus(q.id, action, q.version).subscribe({
      next: (updated) => {
        this.busy.set(false);
        this.apply(updated);
        this.notifications.success(copy.done);
        if (updated.fulfillmentMode === 'PREPARACION' && updated.status === 'EN_PREPARACION') {
          this.openPreparation();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.busy.set(false);
        this.notifications.error(extractErrorMessage(error, 'No se pudo cambiar el estado.'));
        this.load();
      },
    });
  }

  saveNotes(): void {
    const q = this.quotation();
    if (!q || this.busy()) return;
    this.busy.set(true);
    this.service.updateObservations(q.id, this.notes().trim(), q.version).subscribe({
      next: (updated) => {
        this.busy.set(false);
        this.editingNotes.set(false);
        this.apply(updated);
        this.notifications.success('Observaciones actualizadas.');
      },
      error: (error: HttpErrorResponse) => {
        this.busy.set(false);
        this.notifications.error(extractErrorMessage(error, 'No se pudieron guardar las observaciones.'));
      },
    });
  }

  startVoid(p: SchoolPayment): void {
    this.reasonError.set(null);
    this.reasonRequestId = crypto.randomUUID();
    this.voiding.set(p);
  }

  startCancel(): void {
    this.reasonError.set(null);
    this.reasonRequestId = crypto.randomUUID();
    this.cancelling.set(true);
  }

  closeReason(): void {
    this.voiding.set(null);
    this.cancelling.set(false);
  }

  onReason(result: SchoolReasonResult): void {
    const q = this.quotation();
    if (!q) return;
    const payment = this.voiding();
    this.reasonBusy.set(true);
    this.reasonError.set(null);
    const request: Observable<SchoolQuotation> = payment
      ? this.service.voidPayment(payment.id, result.reason, this.reasonRequestId).pipe(map((r) => r.quotation))
      : this.service.cancelQuotation(q.id, { ...result, clientRequestId: this.reasonRequestId });
    request.subscribe({
      next: (updated) => {
        this.reasonBusy.set(false);
        this.apply(updated);
        this.closeReason();
        this.notifications.success(payment ? `Pago ${payment.receiptNumber} anulado.` : 'Cotización cancelada.');
      },
      error: (error: HttpErrorResponse) => {
        this.reasonBusy.set(false);
        this.reasonError.set(extractErrorMessage(error, 'No se pudo completar la operación.'));
      },
    });
  }

  canVoid(p: SchoolPayment): boolean {
    const q = this.quotation();
    return (
      !!q &&
      (p.kind === 'ANTICIPO' || p.kind === 'ABONO') &&
      p.status === 'APLICADO' &&
      isSchoolQuotationEditable(q.status) &&
      this.service.can('school_lists.payments.void')
    );
  }

  historyDetail(entry: SchoolHistoryEntry): string {
    const d = entry.details as Record<string, unknown>;
    const money = (v: unknown) => formatCurrency(Number(v ?? 0));
    switch (entry.action) {
      case 'CREADA':
        return `Total ${money(d['total'])}${d['template'] ? ` · plantilla ${String(d['template'])}` : ''}`;
      case 'EDITADA':
        return `Total ${money(d['totalBefore'])} → ${money(d['totalAfter'])}`;
      case 'PAGO':
        return `${this.kindLabel[d['kind'] as SchoolPayment['kind']] ?? 'Pago'} de ${money(d['amount'])} · saldo ${money(d['balanceAfter'])}`;
      case 'PAGO_ANULADO':
        return `${String(d['receipt'] ?? '')} por ${money(d['amount'])} — ${String(d['reason'] ?? '')}`;
      case 'CANCELADA':
        return `${String(d['reason'] ?? '')}${Number(d['refunded'] ?? 0) > 0 ? ` · devolución ${money(d['refunded'])}` : ''}`;
      case 'ABASTECIMIENTO':
        return `${String(d['quantity'] ?? '')} unidad(es) reservadas (${d['source'] === 'COMPRA' ? 'compra' : String(d['source'] ?? '').toLowerCase()}, ${d['mode'] === 'MANUAL' ? 'manual' : 'FIFO'})`;
      case 'DESPACHO':
        return `${String(d['units'] ?? '')} unidad(es) entregadas${d['observations'] ? ' — ' + String(d['observations']) : ''}`;
      case 'OBSERVACIONES':
        return String(d['after'] ?? '(sin observaciones)');
      default:
        return '';
    }
  }
}
