import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';

import { SCHOOL_STATUS_COLOR, SCHOOL_STATUS_LABEL, SchoolQuotation, formatCurrency } from '../../../core/models';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SchoolListService } from '../../../core/services/school-list.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../shared/ui';
import { ProductSwapResult, SchoolProductSwapModalComponent } from './components/school-product-swap-modal/school-product-swap-modal.component';
import { EditorLine } from './school-line-rules';
import {
  REQUIREMENT_STATE_LABEL,
  RequirementDraft,
  RequirementState,
  assignProduct,
  assignedUnits,
  finishProblems,
  isShort,
  preparationSignature,
  preparationSummary,
  remainingUnits,
  removeAssignment,
  replaceAssignment,
  requirementState,
  requirementsFrom,
  saveProblems,
  setAssignmentQuantity,
  toPreparationPayload,
  unitsByProduct,
} from './school-preparation-rules';

/** Pill color (`_school-ui.scss` palette) of each requirement state. */
const STATE_COLOR: Record<RequirementState, string> = {
  PENDIENTE: 'gray',
  INCOMPLETO: 'orange',
  EXCEDIDO: 'red',
  SIN_STOCK: 'red',
  ASIGNADO: 'green',
  PREPARADO: 'darkgreen',
};

/** Which requirement (and which of its assignments, when changing one) the picker serves. */
interface Picking {
  itemId: string;
  /** Assignment being changed; null adds a new product to the requirement. */
  key: string | null;
}

/**
 * "Preparación del pedido" of a school list (requirements flow, migration
 * 1760008400000). One card per school requirement — original text, requested
 * quantity, quoted price and total — where the user picks the inventory
 * product(s) that fulfil it, possibly splitting the quantity among several.
 *
 * - "Guardar preparación" stores the assignments (no stock moves, the quoted
 *   price and the requirement never change).
 * - "Finalizar preparación" (TERMINAR) requires every requirement exactly
 *   covered; the backend then discounts Bodega once and blocks it when stock
 *   is insufficient.
 *
 * Everything shown here is a preview: the backend validates again.
 */
@Component({
  selector: 'app-school-quotation-preparation-page',
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent, IconComponent, SchoolProductSwapModalComponent],
  templateUrl: './school-quotation-preparation-page.component.html',
  styleUrl: './school-quotation-preparation-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolQuotationPreparationPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly service = inject(SchoolListService);
  private readonly confirm = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly statusLabel = SCHOOL_STATUS_LABEL;
  readonly statusColor = SCHOOL_STATUS_COLOR;
  readonly stateLabel = REQUIREMENT_STATE_LABEL;
  readonly stateColor = STATE_COLOR;
  readonly assignedUnits = assignedUnits;

  readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  readonly quotation = signal<SchoolQuotation | null>(null);
  readonly failed = signal<string | null>(null);
  readonly requirements = signal<RequirementDraft[]>([]);
  private readonly savedSignature = signal('');
  /** Bodega stock per product (lists take their stock from Bodega). */
  readonly stock = signal<Record<string, number>>({});
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly picking = signal<Picking | null>(null);

  readonly finished = computed(() => ['TERMINADA', 'ENTREGADA'].includes(this.quotation()?.status ?? ''));
  readonly editable = computed(() => {
    const q = this.quotation();
    return (
      !!q &&
      q.fulfillmentMode === 'PREPARACION' &&
      q.status === 'EN_PREPARACION' &&
      this.service.can('school_lists.quotations.edit')
    );
  });
  readonly canStart = computed(() => {
    const q = this.quotation();
    return !!q && q.fulfillmentMode === 'PREPARACION' && q.status === 'ACEPTADA' && this.service.can('school_lists.quotations.edit');
  });
  readonly units = computed(() => unitsByProduct(this.requirements()));
  readonly summary = computed(() => preparationSummary(this.requirements(), this.finished()));
  readonly dirty = computed(() => preparationSignature(this.requirements()) !== this.savedSignature());
  readonly saveIssues = computed(() => saveProblems(this.requirements()));
  readonly finishIssues = computed(() => finishProblems(this.requirements(), this.stock()));
  readonly cards = computed(() => {
    const s = this.summary();
    return [
      { label: 'Requerimientos', value: String(s.requirements), hint: 'De la lista del establecimiento', icon: 'book-open', color: 'blue' },
      { label: 'Asignados', value: String(s.assigned), hint: 'Cubiertos por completo', icon: 'check-circle', color: 'green' },
      { label: 'Pendientes', value: String(s.pending), hint: 'Sin cubrir', icon: 'alert-circle', color: s.pending ? 'orange' : 'gray' },
      { label: 'Productos seleccionados', value: String(s.products), hint: `${s.units} unidad(es) de inventario`, icon: 'package', color: 'indigo' },
    ];
  });

  /** The requirement in the picker as the modal's line (text, units to assign, quoted price). */
  readonly pickerLine = computed<EditorLine | null>(() => {
    const p = this.picking();
    const requirement = p ? this.requirements().find((r) => r.itemId === p.itemId) : undefined;
    if (!p || !requirement) return null;
    const current = p.key ? requirement.assignments.find((a) => a.key === p.key) : undefined;
    return {
      key: current?.key ?? `req:${requirement.itemId}`,
      itemId: null,
      templateItemId: null,
      productId: current?.productId ?? null,
      productName: requirement.description,
      sku: current?.sku ?? null,
      categoryId: current?.categoryId ?? null,
      categoryName: current?.categoryName ?? null,
      description: requirement.assignments.map((a) => `${a.productName} × ${a.quantity}`).join(', '),
      quantity: current?.quantity ?? Math.max(remainingUnits(requirement), 1),
      unitPrice: requirement.unitPrice,
      discount: 0,
      observations: '',
      source: 'MANUAL',
      referencePrice: null,
    };
  });
  /** Products already assigned to that requirement (duplicate check of the modal). */
  readonly pickerLines = computed<EditorLine[]>(() => {
    const p = this.picking();
    const requirement = p ? this.requirements().find((r) => r.itemId === p.itemId) : undefined;
    return (requirement?.assignments ?? []).map((a) => ({
      key: a.key,
      itemId: null,
      templateItemId: null,
      productId: a.productId,
      productName: a.productName,
      sku: a.sku,
      categoryId: a.categoryId,
      categoryName: a.categoryName,
      description: '',
      quantity: a.quantity,
      unitPrice: 0,
      discount: 0,
      observations: '',
      source: 'INVENTARIO',
      referencePrice: a.referencePrice,
    }));
  });

  constructor() {
    if (!this.service.permissionsLoaded()) {
      this.service.loadPermissions().subscribe({ error: () => undefined });
    }
    this.load();
  }

  /** Warns before closing the tab with unsaved assignments. */
  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event: BeforeUnloadEvent): void {
    if (this.dirty()) {
      event.preventDefault();
    }
  }

  load(): void {
    this.service.getQuotation(this.id).subscribe({
      next: (q) => this.apply(q),
      error: (error: HttpErrorResponse) => this.failed.set(extractErrorMessage(error, 'No se pudo cargar la cotización.')),
    });
  }

  private apply(q: SchoolQuotation): void {
    const requirements = requirementsFrom(q);
    this.quotation.set(q);
    this.failed.set(null);
    this.requirements.set(requirements);
    this.savedSignature.set(preparationSignature(requirements));
    this.stock.update((stock) => ({
      ...stock,
      ...Object.fromEntries(q.items.flatMap((i) => i.assignments.map((a) => [a.productId, a.bodegaStock]))),
    }));
  }

  stateOf(requirement: RequirementDraft): RequirementState {
    return requirementState(requirement, this.units(), this.stock(), this.finished());
  }

  isShort(productId: string): boolean {
    return !this.finished() && isShort(productId, this.units(), this.stock());
  }

  stockOf(productId: string): number | null {
    const stock = this.stock();
    return productId in stock ? stock[productId] : null;
  }

  /** Covered share of a requirement for its progress bar (0–100). */
  coverage(requirement: RequirementDraft): number {
    return requirement.quantity ? Math.min(100, Math.round((assignedUnits(requirement) / requirement.quantity) * 100)) : 0;
  }

  // ── Assignments (local until "Guardar preparación") ─────────────────────
  pick(itemId: string, key: string | null): void {
    this.error.set(null);
    this.picking.set({ itemId, key });
  }

  onPicked(result: ProductSwapResult): void {
    const p = this.picking();
    if (!p) return;
    const { product, quantity } = result.request;
    this.requirements.update((list) =>
      p.key ? replaceAssignment(list, p.itemId, p.key, product, quantity) : assignProduct(list, p.itemId, product, quantity),
    );
    this.picking.set(null);
    if (!(product.id in this.stock())) {
      this.service.bodegaStock([product.id]).subscribe({
        next: (rows) => this.stock.update((s) => ({ ...s, ...Object.fromEntries(rows.map((r) => [r.productId, r.quantity])) })),
        error: () => undefined,
      });
    }
  }

  setQuantity(itemId: string, key: string, value: unknown): void {
    this.requirements.update((list) => setAssignmentQuantity(list, itemId, key, Number(value)));
  }

  remove(itemId: string, key: string): void {
    this.requirements.update((list) => removeAssignment(list, itemId, key));
  }

  async discard(): Promise<void> {
    const ok = await this.confirm.confirm({
      type: 'UPDATE',
      title: 'Descartar cambios',
      message: 'Se volverá a la última preparación guardada.',
      confirmText: 'Descartar',
      variant: 'danger',
    });
    if (ok) {
      const q = this.quotation();
      if (q) this.apply(q);
    }
  }

  // ── Workflow ────────────────────────────────────────────────────────────
  async start(): Promise<void> {
    const q = this.quotation();
    if (!q || this.busy()) return;
    const ok = await this.confirm.confirm({
      type: 'UPDATE',
      title: 'Iniciar preparación',
      message: `${q.quotationNumber} pasará a "En preparación" para elegir los productos de inventario. No se descuenta inventario.`,
      confirmText: 'Iniciar preparación',
    });
    if (!ok) return;
    this.run(this.service.changeStatus(q.id, 'PREPARAR', q.version), 'Lista en preparación.');
  }

  async save(): Promise<void> {
    const q = this.quotation();
    if (!q || this.busy() || this.saveIssues().length || !this.dirty()) return;
    const s = this.summary();
    const ok = await this.confirm.confirm({
      type: 'SAVE',
      title: 'Guardar preparación',
      message:
        `${q.quotationNumber}: ${s.assigned} de ${s.requirements} requerimiento(s) cubiertos con ${s.units} unidad(es). ` +
        'No se descuenta inventario ni cambia el precio cotizado.',
      confirmText: 'Guardar preparación',
    });
    if (!ok) return;
    this.run(this.service.savePreparation(q.id, toPreparationPayload(this.requirements()), q.version), 'Preparación guardada.');
  }

  async finish(): Promise<void> {
    const q = this.quotation();
    if (!q || this.busy() || this.finishIssues().length) return;
    const s = this.summary();
    const ok = await this.confirm.confirm({
      type: 'UPDATE',
      title: 'Finalizar preparación',
      message:
        `${q.quotationNumber}: se descontarán de Bodega ${s.units} unidad(es) de ${s.products} producto(s), una sola vez. ` +
        'La lista quedará "Terminada" (lista para entregar) y ya no se podrán cambiar los productos.',
      confirmText: 'Finalizar y descontar inventario',
    });
    if (!ok) return;
    // Unsaved assignments are saved first; TERMINAR then works on the saved version.
    const request = (this.dirty()
      ? this.service.savePreparation(q.id, toPreparationPayload(this.requirements()), q.version)
      : of(q)
    ).pipe(switchMap((saved) => this.service.changeStatus(saved.id, 'TERMINAR', saved.version)));
    // On failure (e.g. Bodega ran short) reload: the assignments may already be saved.
    this.run(request, 'Preparación finalizada: inventario descontado de Bodega.', true);
  }

  private run(request: Observable<SchoolQuotation>, done: string, reloadOnError = false): void {
    this.busy.set(true);
    this.error.set(null);
    request.subscribe({
      next: (updated) => {
        this.busy.set(false);
        this.apply(updated);
        this.notifications.success(done);
      },
      error: (error: HttpErrorResponse) => {
        this.busy.set(false);
        this.error.set(extractErrorMessage(error, 'No se pudo completar la operación.'));
        if (reloadOnError) this.load();
      },
    });
  }

  back(): void {
    void this.router.navigate(['/dashboard/listas-escolares/cotizaciones', this.id]);
  }
}
