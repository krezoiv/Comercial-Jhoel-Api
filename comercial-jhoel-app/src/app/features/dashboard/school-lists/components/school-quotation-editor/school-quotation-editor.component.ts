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
  effect,
  forwardRef,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Bank,
  Product,
  SCHOOL_BANK_METHODS,
  SCHOOL_LINE_SOURCE_LABEL,
  SCHOOL_PAYMENT_METHOD_LABEL,
  SCHOOL_PAYMENT_METHODS,
  SCHOOL_STATUS_LABEL,
  SchoolLineSource,
  SchoolPaymentMethod,
  SchoolQuotation,
  SchoolQuotationItemInput,
  SchoolTemplate,
  SchoolTemplateSummary,
  formatCurrency,
  isSchoolCashBank,
  schoolPaymentDestination,
  guatemalaToday,
  roundMoney,
  schoolListHoldsStock,
} from '../../../../../core/models';
import { BankService } from '../../../../../core/services/bank.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { BadgeComponent, ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { QuotationProductSearchComponent } from '../../../quotations/components/quotation-product-search/quotation-product-search.component';
import { EditorLine, consolidateLines, lineError, lineSubtotal, swapLineProduct } from '../../school-line-rules';
import { CustomerSuggestion, SchoolCustomerFieldComponent } from '../school-customer-field/school-customer-field.component';
import { ProductSwapResult, SchoolProductSwapModalComponent } from '../school-product-swap-modal/school-product-swap-modal.component';
import { QuotationPreviewData } from '../school-quotation-preview/school-quotation-preview.component';
import { SCHOOL_QUOTATION_EDITOR, SchoolQuotationSummaryPanelComponent } from '../school-quotation-summary-panel/school-quotation-summary-panel.component';
import { RequirementEntry, SchoolRequirementEntryComponent } from '../school-requirement-entry/school-requirement-entry.component';

// Line rules live in school-line-rules.ts (shared with the change-product modal and the tests).
export type { EditorLine } from '../../school-line-rules';
export { lineError, lineSubtotal } from '../../school-line-rules';

const PHONE = /^[+0-9 ()-]{8,20}$/;

/** Icon of each payment method in the POS method picker. */
const METHOD_ICON: Record<SchoolPaymentMethod, string> = {
  EFECTIVO: 'wallet',
  TARJETA: 'credit-card',
  TRANSFERENCIA: 'arrow-left-right',
  DEPOSITO: 'bank',
  OTRO: 'receipt',
};

/** Duration of the "remove line" exit animation (kept in sync with the SCSS). */
const LEAVE_MS = 180;

function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Body of the POS quotation window ("Nueva cotización" / "Editar cotización",
 * hosted by `SchoolQuotationWorkspaceComponent`): customer and student, the
 * school template (grade), the requirement entry bar and list, and a side
 * panel with the summary, the initial payment and the pending balance. The
 * window's header and action bar read this component's state (`dirty`,
 * `saving`, `problems`, `previewData`) and call `save()`.
 *
 * The template is only read: every change lives in the quotation's own copy
 * of the lines. Live totals are a preview; the backend recomputes and
 * validates them when saving. Saving never discounts inventory for a list of
 * the requirements flow.
 *
 * Requirement mode (every new list, migration 1760008400000): lines are the
 * school's requirements — text, quantity and quoted price — with no inventory
 * product, no stock lookup and no stock movement; products are chosen later in
 * "Preparación". Lists saved with the previous flow (`CONFIRMACION`) keep the
 * inventory editor (product search, "Cambiar producto", Bodega stock).
 */
@Component({
  selector: 'app-school-quotation-editor',
  standalone: true,
  imports: [
    FormsModule,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    DecimalInputDirective,
    QuotationProductSearchComponent,
    SchoolProductSwapModalComponent,
    SchoolCustomerFieldComponent,
    SchoolRequirementEntryComponent,
    SchoolQuotationSummaryPanelComponent,
  ],
  // The side panel reads and updates this editor's state.
  providers: [{ provide: SCHOOL_QUOTATION_EDITOR, useExisting: forwardRef(() => SchoolQuotationEditorComponent) }],
  templateUrl: './school-quotation-editor.component.html',
  styleUrl: './school-quotation-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolQuotationEditorComponent implements OnChanges {
  /** Quotation to edit; null builds a new one (signal-backed so computeds react). */
  @Input() set quotation(value: SchoolQuotation | null) {
    this.current.set(value);
  }
  get quotation(): SchoolQuotation | null {
    return this.current();
  }
  private readonly current = signal<SchoolQuotation | null>(null);
  /** Saved line (item id) whose "Cambiar producto" modal opens as soon as the lines load. */
  @Input() swapItemId: string | null = null;
  @Output() saved = new EventEmitter<SchoolQuotation>();

  readonly service = inject(SchoolListService);
  private readonly banks = inject(BankService);
  private readonly confirm = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly sourceLabel = SCHOOL_LINE_SOURCE_LABEL;
  readonly methods = SCHOOL_PAYMENT_METHODS;
  readonly methodLabel = SCHOOL_PAYMENT_METHOD_LABEL;
  readonly methodIcon = METHOD_ICON;
  readonly lineSubtotal = lineSubtotal;
  readonly lineError = lineError;

  // Customer.
  readonly customerName = signal('');
  readonly customerPhone = signal('');
  readonly studentName = signal('');
  readonly quotationDate = signal(guatemalaToday());
  readonly deliveryDate = signal('');
  readonly observations = signal('');

  // Grade and lines.
  readonly templates = signal<SchoolTemplateSummary[]>([]);
  readonly templatesFailed = signal(false);
  /** Filter of the grade picker (shown when there are many templates). */
  readonly templateFilter = signal('');
  readonly filteredTemplates = computed(() => {
    const term = this.templateFilter().trim().toLowerCase();
    return term
      ? this.templates().filter((t) => `${t.grade} ${t.name}`.toLowerCase().includes(term))
      : this.templates();
  });
  readonly template = signal<SchoolTemplate | null>(null);
  readonly loadingTemplate = signal(false);
  readonly lines = signal<EditorLine[]>([]);
  /** Line open in the "Cambiar producto" modal. */
  readonly replacingKey = signal<string | null>(null);
  readonly replacing = computed(() => this.lines().find((l) => l.key === this.replacingKey()) ?? null);
  /** Lines whose observation field was opened with the note action. */
  readonly openNotes = signal<ReadonlySet<string>>(new Set());
  /** Lines playing their exit animation before being removed. */
  readonly leaving = signal<ReadonlySet<string>>(new Set());

  // Anticipo.
  readonly withAdvance = signal(false);
  readonly advanceAmount = signal<number | null>(null);
  readonly advanceMethod = signal<SchoolPaymentMethod>('EFECTIVO');
  readonly advanceBankId = signal('');
  readonly advanceReference = signal('');
  readonly asDraft = signal(false);
  readonly bankList = signal<Bank[]>([]);

  /** Bodega stock per product id (lists discount from Bodega). */
  readonly bodega = signal<Record<string, number>>({});

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly touched = signal(false);
  private requestId = crypto.randomUUID();
  private lineSeq = 0;

  readonly isEdit = computed(() => this.quotation !== null);
  /** Lines are school requirements (no inventory): every new list and lists of the new flow. */
  readonly requirementMode = computed(() => (this.quotation?.fulfillmentMode ?? 'PREPARACION') === 'PREPARACION');
  readonly canOverride = computed(() => this.service.can('school_lists.prices.override'));
  readonly canAdvance = computed(() => !this.isEdit() && this.service.can('school_lists.payments.register'));
  readonly gradeLabel = computed(() => this.quotation?.grade ?? this.template()?.grade ?? '');

  readonly itemCount = computed(() => this.lines().reduce((sum, l) => sum + (l.quantity || 0), 0));
  readonly subtotal = computed(() => roundMoney(this.lines().reduce((s, l) => s + (l.quantity || 0) * (l.unitPrice || 0), 0)));
  readonly discount = computed(() => roundMoney(this.lines().reduce((s, l) => s + (l.discount || 0), 0)));
  readonly total = computed(() => roundMoney(this.subtotal() - this.discount()));
  readonly paid = computed(() => (this.quotation ? this.quotation.account.paid : this.advance()));
  readonly advance = computed(() => (this.withAdvance() && !this.asDraft() ? (this.advanceAmount() ?? 0) : 0));
  readonly balance = computed(() => roundMoney(this.total() - this.paid()));
  readonly usesBank = computed(() => SCHOOL_BANK_METHODS.includes(this.advanceMethod()));
  /** Where the advance goes (Caja de Listas, bank pending transfer, or outside). */
  readonly advanceDestination = computed(() =>
    schoolPaymentDestination(this.advanceMethod(), this.bankList().find((b) => b.id === this.advanceBankId())?.name),
  );

  /** Whether saving will (re)discount inventory: only lists of the previous flow, never a draft. */
  readonly movesStock = computed(
    () => !this.requirementMode() && (this.quotation ? schoolListHoldsStock(this.quotation.status) : !this.asDraft()),
  );
  /** Units per inventory product requested by the list. */
  readonly needs = computed(() => {
    const needs: Record<string, number> = {};
    for (const line of this.lines()) {
      if (line.productId) needs[line.productId] = (needs[line.productId] ?? 0) + (line.quantity || 0);
    }
    return needs;
  });
  /** Units this saved list already took from Bodega (they come back if the line shrinks). */
  readonly alreadyDiscounted = computed(() => {
    const taken: Record<string, number> = {};
    const q = this.quotation;
    if (q && schoolListHoldsStock(q.status)) {
      for (const item of q.items) {
        if (item.productId) taken[item.productId] = (taken[item.productId] ?? 0) + item.quantity;
      }
    }
    return taken;
  });
  readonly inventoryUnits = computed(() => Object.values(this.needs()).reduce((sum, qty) => sum + qty, 0));
  readonly shortProducts = computed(() => {
    const stock = this.bodega();
    return this.lines()
      .filter((l, i, all) => l.productId && all.findIndex((o) => o.productId === l.productId) === i)
      .filter((l) => this.isShort(l.productId!, stock))
      .map((l) => l.productName);
  });

  readonly problems = computed(() => {
    const issues: string[] = [];
    if (this.customerName().trim().length < 3) issues.push('El nombre del cliente o encargado es obligatorio.');
    if (!PHONE.test(this.customerPhone().trim()) || this.customerPhone().replace(/\D/g, '').length < 8) {
      issues.push('El teléfono es obligatorio (mínimo 8 dígitos).');
    }
    if (!this.isEdit() && !this.template()) issues.push('Seleccione el grado escolar.');
    if (!this.lines().length) issues.push(this.requirementMode() ? 'Agregue al menos un requerimiento.' : 'Agregue al menos un producto.');
    if (this.lines().some((l) => lineError(l))) issues.push('Revise las líneas marcadas en rojo.');
    if (this.lines().length && this.total() <= 0) issues.push('El total debe ser mayor que cero.');
    if (this.deliveryDate() && this.deliveryDate() < this.quotationDate()) {
      issues.push('La fecha de entrega no puede ser anterior a la cotización.');
    }
    if (this.isEdit() && this.quotation && this.total() < this.quotation.account.paid) {
      issues.push(`El total no puede ser menor a lo ya pagado (${formatCurrency(this.quotation.account.paid)}).`);
    }
    if (this.advance() > 0 && this.advance() > this.total()) issues.push('El anticipo no puede superar el total.');
    if (this.withAdvance() && !this.asDraft()) {
      const amount = this.advanceAmount();
      if (amount === null || !(amount > 0) || roundMoney(amount) !== amount) {
        issues.push('Indique un anticipo mayor que cero.');
      }
      if (this.usesBank() && !this.advanceBankId()) {
        issues.push('Seleccione la cuenta bancaria que recibió el anticipo.');
      }
    }
    return issues;
  });

  readonly nameInvalid = computed(() => this.customerName().trim().length < 3);
  readonly phoneInvalid = computed(
    () => !PHONE.test(this.customerPhone().trim()) || this.customerPhone().replace(/\D/g, '').length < 8,
  );
  /** Discount column only for roles that may discount, or when a line already has one. */
  readonly showDiscount = computed(() => this.canOverride() || this.discount() > 0);
  /**
   * Status the quotation has (edit) or will have once saved (new). A new list
   * with an advance is accepted; without one it is a quotation the customer
   * still has to accept (migration 1760009000000).
   */
  readonly statusLabel = computed(() =>
    this.quotation
      ? SCHOOL_STATUS_LABEL[this.quotation.status]
      : this.asDraft()
        ? SCHOOL_STATUS_LABEL.BORRADOR
        : this.withAdvance()
          ? SCHOOL_STATUS_LABEL.ACEPTADA
          : SCHOOL_STATUS_LABEL.COTIZADA,
  );

  /**
   * Everything the user can change, serialized; compared with the state as
   * loaded to know whether closing the window would lose work.
   */
  private readonly signature = computed(() =>
    JSON.stringify([
      this.customerName(),
      this.customerPhone(),
      this.studentName(),
      this.quotationDate(),
      this.deliveryDate(),
      this.observations(),
      this.template()?.id ?? null,
      this.lines().map((l) => [l.itemId, l.templateItemId, l.productId, l.productName, l.description, l.quantity, l.unitPrice, l.discount, l.observations]),
      this.withAdvance(),
      this.advanceAmount(),
      this.advanceMethod(),
      this.advanceBankId(),
      this.advanceReference(),
      this.asDraft(),
    ]),
  );
  private readonly baseline = signal('');
  /** True when there are changes that saving would keep and closing would lose. */
  readonly dirty = computed(() => this.signature() !== this.baseline());

  /** The quotation as the customer document would show it (for "Vista previa"). */
  readonly previewData = computed<QuotationPreviewData>(() => ({
    number: this.quotation?.quotationNumber ?? null,
    statusLabel: this.statusLabel(),
    date: this.quotationDate(),
    deliveryDate: this.deliveryDate() || null,
    customerName: this.customerName().trim(),
    customerPhone: this.customerPhone().trim(),
    studentName: this.studentName().trim() || null,
    grade: this.gradeLabel(),
    observations: this.observations().trim() || null,
    lines: this.lines().map((l) => ({
      name: l.productName.trim(),
      quantity: l.quantity || 0,
      unitPrice: l.unitPrice || 0,
      discount: l.discount || 0,
      subtotal: lineSubtotal(l),
    })),
    subtotal: this.subtotal(),
    discount: this.discount(),
    total: this.total(),
    paid: this.paid(),
    paidLabel: this.isEdit() ? 'Pagado' : 'Anticipo',
    balance: this.balance(),
  }));

  constructor() {
    this.baseline.set(this.signature());
    this.service.getTemplates().subscribe({
      next: (templates) => this.templates.set(templates),
      error: () => this.templatesFailed.set(true),
    });
    // Fetch Bodega stock for every inventory product that appears in the list.
    effect(() => {
      const ids = Object.keys(this.needs());
      const missing = ids.filter((id) => !(id in untracked(this.bodega)));
      if (missing.length) {
        this.service.bodegaStock(missing).subscribe({
          next: (rows) =>
            this.bodega.update((map) => ({
              ...map,
              ...Object.fromEntries(rows.map((r) => [r.productId, r.quantity])),
            })),
          error: () => undefined,
        });
      }
    });
  }

  /** Bodega stock available to this list for a product (current stock + what it already holds). */
  available(productId: string, stock = this.bodega()): number | null {
    return productId in stock ? stock[productId] + (this.alreadyDiscounted()[productId] ?? 0) : null;
  }

  isShort(productId: string, stock = this.bodega()): boolean {
    const available = this.available(productId, stock);
    return available !== null && (this.needs()[productId] ?? 0) > available;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const q = this.quotation;
    if (changes['quotation'] && q) {
      this.customerName.set(q.customerName);
      this.customerPhone.set(q.customerPhone);
      this.studentName.set(q.studentName ?? '');
      this.quotationDate.set(q.quotationDate);
      this.deliveryDate.set(q.deliveryDate ?? '');
      this.observations.set(q.observations ?? '');
      this.lines.set(
        q.items.map((item) => ({
          key: this.nextKey(),
          itemId: item.id,
          templateItemId: item.templateItemId,
          productId: item.productId,
          productName: item.productName,
          sku: item.productSku,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          description: item.description ?? '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          observations: item.observations ?? '',
          source: item.source,
          referencePrice: item.unitPrice,
        })),
      );
      this.baseline.set(untracked(this.signature));
      const target = this.swapItemId ? this.lines().find((l) => l.itemId === this.swapItemId) : undefined;
      if (target) {
        this.replacingKey.set(target.key);
      }
    }
  }

  // ── Grade ────────────────────────────────────────────────────────────────
  async selectTemplate(summary: SchoolTemplateSummary): Promise<void> {
    if (this.template()?.id === summary.id) {
      return;
    }
    if (this.lines().length) {
      const ok = await this.confirm.confirm({
        type: 'UPDATE',
        title: 'Cambiar de grado',
        message: `Se reemplazará la lista actual por la plantilla de ${summary.grade}. Los cambios hechos a la lista se perderán.`,
        confirmText: 'Cambiar grado',
      });
      if (!ok) {
        return;
      }
    }
    this.loadingTemplate.set(true);
    this.service.getTemplate(summary.id).subscribe({
      next: (template) => {
        this.loadingTemplate.set(false);
        this.template.set(template);
        this.lines.set(
          template.items.map((item) => ({
            key: this.nextKey(),
            itemId: null,
            templateItemId: item.id,
            // Requirements only: a template line once linked to a product is copied as text.
            productId: null,
            productName: item.productName,
            sku: null,
            categoryId: null,
            categoryName: null,
            description: item.description ?? '',
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: 0,
            observations: item.observations ?? '',
            source: 'PLANTILLA',
            referencePrice: item.unitPrice,
          })),
        );
      },
      error: (error: HttpErrorResponse) => {
        this.loadingTemplate.set(false);
        this.notifications.error(extractErrorMessage(error, 'No se pudo cargar la plantilla.'));
      },
    });
  }

  // ── Lines ────────────────────────────────────────────────────────────────
  priceEditable(line: EditorLine): boolean {
    return this.canOverride() || line.referencePrice === null;
  }

  update(key: string, patch: Partial<EditorLine>): void {
    this.lines.update((lines) => lines.map((line) => (line.key === key ? { ...line, ...patch } : line)));
  }

  /**
   * A number typed in a line cell. An emptied cell keeps the previous value
   * while the user is still typing (so the field is not refilled under the
   * cursor); `settleEmpty` decides what an empty cell means when it loses focus.
   */
  setNumber(key: string, field: 'quantity' | 'unitPrice' | 'discount', value: unknown): void {
    if (value === '' || value === null || value === undefined) {
      return;
    }
    const parsed = Number(value);
    this.update(key, { [field]: Number.isFinite(parsed) ? parsed : 0 } as Partial<EditorLine>);
  }

  /** A cell left empty: a price or discount becomes Q0.00; a quantity shows its last value again. */
  settleEmpty(input: HTMLInputElement, line: EditorLine, field: 'quantity' | 'unitPrice' | 'discount'): void {
    if (input.value.trim() !== '') {
      return;
    }
    if (field === 'quantity') {
      input.value = String(line.quantity);
      return;
    }
    this.update(line.key, { [field]: 0 } as Partial<EditorLine>);
    input.value = '0.00';
  }

  step(line: EditorLine, delta: number): void {
    this.update(line.key, { quantity: Math.min(9999, Math.max(1, (line.quantity || 0) + delta)) });
  }

  remove(key: string): void {
    this.lines.update((lines) => lines.filter((line) => line.key !== key));
  }

  /** Removes a line after its exit animation (immediately with reduced motion). */
  removeAnimated(key: string): void {
    if (prefersReducedMotion()) {
      this.remove(key);
      return;
    }
    this.leaving.update((set) => new Set(set).add(key));
    setTimeout(() => {
      this.leaving.update((set) => {
        const next = new Set(set);
        next.delete(key);
        return next;
      });
      this.remove(key);
    }, LEAVE_MS);
  }

  /** Adds a requirement typed in the entry bar (an extra line, priced freely). */
  addRequirement(entry: RequirementEntry): void {
    this.lines.update((lines) => [
      ...lines,
      { ...this.blankLine(), productName: entry.productName, quantity: entry.quantity, unitPrice: entry.unitPrice },
    ]);
  }

  /** Copies a requirement right below it as an extra line (never a second template line). */
  duplicate(key: string): void {
    this.lines.update((lines) => {
      const index = lines.findIndex((l) => l.key === key);
      if (index === -1) {
        return lines;
      }
      const source = lines[index];
      const copy: EditorLine = {
        ...this.blankLine(),
        productName: source.productName,
        description: source.description,
        quantity: source.quantity,
        unitPrice: source.unitPrice,
        observations: source.observations,
      };
      return [...lines.slice(0, index + 1), copy, ...lines.slice(index + 1)];
    });
  }

  /** A customer picked from the search: name and phone (the student stays as typed). */
  pickCustomer(customer: CustomerSuggestion): void {
    this.customerName.set(customer.name);
    this.customerPhone.set(customer.phone);
  }

  /** Quick amounts of the initial payment: the whole total or half of it. */
  setAdvanceShare(share: 1 | 0.5): void {
    this.advanceAmount.set(roundMoney(this.total() * share));
  }

  addManual(): void {
    this.lines.update((lines) => [...lines, this.blankLine()]);
  }

  /** An empty extra line typed by hand (no template line, no inventory product). */
  private blankLine(): EditorLine {
    return {
      key: this.nextKey(),
      itemId: null,
      templateItemId: null,
      productId: null,
      productName: '',
      sku: null,
      categoryId: null,
      categoryName: null,
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      observations: '',
      source: 'MANUAL',
      referencePrice: null,
    };
  }

  /** Adds an inventory product (or one more unit if it is already a plain inventory line). */
  addProduct(product: Product): void {
    const existing = this.lines().find((l) => l.productId === product.id && l.source === 'INVENTARIO' && !l.itemId);
    if (existing) {
      this.step(existing, 1);
      return;
    }
    this.lines.update((lines) => [...lines, this.fromProduct(product)]);
  }

  /**
   * Applies the "Cambiar producto" modal result: a plain swap of the line, or —
   * when the product was already in the list — consolidation into that line so
   * the product is never duplicated. Only this quotation's copy changes (the
   * template is untouched) and no inventory moves until the list is saved.
   */
  onSwapped(key: string, result: ProductSwapResult): void {
    const before = this.lines().find((l) => l.key === key);
    if (result.consolidateWith) {
      const target = this.lines().find((l) => l.key === result.consolidateWith);
      this.lines.update((lines) => consolidateLines(lines, key, result.consolidateWith!, result.request.quantity));
      this.notifications.success(`${target?.productName ?? 'El producto'} ya estaba en la lista: se sumaron ${result.request.quantity} unidad(es) a esa línea.`);
    } else {
      this.lines.update((lines) => swapLineProduct(lines, key, result.request));
      this.notifications.success(`${before?.productName || 'Producto'} → ${result.request.product.name}.`);
    }
    this.replacingKey.set(null);
  }

  /** Shows/hides the observation field of a line (always shown when it has text). */
  toggleNote(key: string): void {
    this.openNotes.update((open) => {
      const next = new Set(open);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  /** Turns a line into a free-text product (e.g. "cuaderno grande" instead of the requested one). */
  makeManual(key: string): void {
    this.update(key, {
      itemId: null,
      templateItemId: null,
      productId: null,
      sku: null,
      categoryId: null,
      categoryName: null,
      source: 'MANUAL',
      referencePrice: null,
      discount: 0,
    });
    this.replacingKey.set(null);
  }

  private fromProduct(product: Product): EditorLine {
    return {
      key: this.nextKey(),
      itemId: null,
      templateItemId: null,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      categoryName: product.category,
      description: '',
      quantity: 1,
      unitPrice: product.publicPrice,
      discount: 0,
      observations: '',
      source: 'INVENTARIO',
      referencePrice: product.publicPrice,
    };
  }

  private nextKey(): string {
    this.lineSeq += 1;
    return `l${this.lineSeq}`;
  }

  // ── Anticipo ─────────────────────────────────────────────────────────────
  toggleAdvance(on: boolean): void {
    this.withAdvance.set(on);
    if (on && !this.bankList().length) {
      this.banks.getBanks().subscribe({
        next: (list) => this.bankList.set(list.filter(isSchoolCashBank)),
        error: () => this.bankList.set([]),
      });
    }
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  private items(): SchoolQuotationItemInput[] {
    return this.lines().map((line) => ({
      itemId: line.itemId,
      templateItemId: line.templateItemId,
      productId: this.requirementMode() ? null : line.productId,
      productName: line.productName.trim(),
      description: line.description.trim() || null,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      discount: line.discount || 0,
      observations: line.observations.trim() || null,
    }));
  }

  async save(): Promise<void> {
    this.touched.set(true);
    if (this.problems().length || this.saving()) {
      return;
    }
    const number = this.quotation?.quotationNumber ?? 'número nuevo (se asigna al guardar)';
    const summary =
      `Lista ${number} · ${this.customerName().trim()} · ${this.gradeLabel()}: ` +
      `${this.lines().length} ${this.requirementMode() ? 'requerimiento(s)' : 'producto(s)'}, ${this.itemCount()} artículo(s), total ${formatCurrency(this.total())}` +
      (this.advance() > 0 ? `, anticipo ${formatCurrency(this.advance())}, saldo ${formatCurrency(this.balance())}` : '') +
      '. ';
    const inventory = this.requirementMode()
      ? (this.isEdit() ? '' : this.asDraft() ? 'Queda como borrador; al confirmarlo pasa a "Aceptada". ' : 'La cotización se guarda como "Aceptada". ') +
        'No se consulta ni descuenta inventario: los productos se eligen al preparar el pedido.'
      : !this.movesStock()
      ? 'El borrador no descuenta inventario hasta que se confirme.'
      : this.isEdit()
        ? 'Se ajustará el inventario de Bodega solo por la diferencia con lo ya descontado.'
        : this.inventoryUnits() > 0
          ? `ATENCIÓN: se descontarán ${this.inventoryUnits()} unidad(es) de Bodega de los productos del inventario; los escritos a mano no mueven inventario.`
          : 'Ningún producto viene del inventario: no se descuenta Bodega.';
    // Informative only (migration 1760008300000): a list is never blocked by missing stock.
    const shortage =
      this.movesStock() && this.shortProducts().length
        ? ` Esta lista contiene productos con existencias insuficientes (${this.shortProducts().join(', ')}). ` +
          'Al confirmar, las cantidades solicitadas serán descontadas del inventario y podrán generar existencias negativas. ' +
          'Los productos quedarán identificados como pendientes de abastecimiento.'
        : '';
    const ok = await this.confirm.confirm({
      type: this.isEdit() ? 'UPDATE' : 'SAVE',
      title: this.isEdit() ? 'Guardar cambios de la lista' : this.asDraft() ? 'Guardar borrador' : 'Guardar lista escolar',
      message: summary + inventory + shortage,
      confirmText: this.isEdit()
        ? 'Guardar cambios'
        : this.asDraft()
          ? 'Guardar borrador'
          : this.requirementMode()
            ? 'Guardar cotización'
          : this.inventoryUnits() > 0
            ? 'Guardar y descontar inventario'
            : 'Guardar lista',
    });
    if (!ok) {
      return;
    }
    const base = {
      customerName: this.customerName().trim(),
      customerPhone: this.customerPhone().trim(),
      studentName: this.studentName().trim() || null,
      quotationDate: this.quotationDate() || undefined,
      deliveryDate: this.deliveryDate() || null,
      observations: this.observations().trim() || null,
      items: this.items(),
    };
    const advanceAmount = this.advance();
    const request = this.quotation
      ? this.service.updateQuotation(this.quotation.id, base, this.quotation.version)
      : this.service.createQuotation({
          ...base,
          templateId: this.template()?.id ?? null,
          asDraft: this.asDraft(),
          advance:
            advanceAmount > 0
              ? {
                  amount: advanceAmount,
                  paymentMethod: this.advanceMethod(),
                  bankId: this.usesBank() ? this.advanceBankId() : null,
                  reference: this.advanceReference().trim() || null,
                }
              : null,
          clientRequestId: this.requestId,
        });
    this.saving.set(true);
    this.error.set(null);
    request.subscribe({
      next: (quotation) => {
        this.saving.set(false);
        this.requestId = crypto.randomUUID();
        const moved = quotation.inventory.filter((m) => m.movementType === 'SALIDA_LISTA_ESCOLAR').reduce((s, m) => s + m.quantity, 0);
        this.notifications.success(
          this.isEdit()
            ? `Lista ${quotation.quotationNumber} actualizada.`
            : `Lista ${quotation.quotationNumber} guardada${moved ? `; se descontaron ${moved} unidad(es) de Bodega` : ''}.`,
        );
        this.saved.emit(quotation);
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(extractErrorMessage(error, 'No se pudo guardar la cotización.'));
      },
    });
  }
}
