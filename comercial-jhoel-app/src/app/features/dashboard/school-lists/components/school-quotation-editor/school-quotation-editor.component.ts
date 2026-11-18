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
  Bank,
  Product,
  SCHOOL_BANK_METHODS,
  SCHOOL_LINE_SOURCE_LABEL,
  SCHOOL_PAYMENT_METHOD_LABEL,
  SCHOOL_PAYMENT_METHODS,
  SchoolLineSource,
  SchoolPaymentMethod,
  SchoolQuotation,
  SchoolQuotationItemInput,
  SchoolTemplate,
  SchoolTemplateSummary,
  formatCurrency,
  guatemalaToday,
  roundMoney,
} from '../../../../../core/models';
import { BankService } from '../../../../../core/services/bank.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { BadgeComponent, ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { QuotationProductSearchComponent } from '../../../quotations/components/quotation-product-search/quotation-product-search.component';

/** One editable line of the quotation being built. */
export interface EditorLine {
  key: string;
  itemId: string | null;
  templateItemId: string | null;
  productId: string | null;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  observations: string;
  source: SchoolLineSource;
  /** Price the line came with (template, product or saved line); null for free-text lines. */
  referencePrice: number | null;
}

const PHONE = /^[+0-9 ()-]{8,20}$/;

export function lineSubtotal(line: Pick<EditorLine, 'quantity' | 'unitPrice' | 'discount'>): number {
  return roundMoney((line.quantity || 0) * (line.unitPrice || 0) - (line.discount || 0));
}

/** Client-side echo of the backend rules (the backend validates again). */
export function lineError(line: EditorLine): string | null {
  if (line.productName.trim().length < 2) {
    return 'Escriba el nombre del producto.';
  }
  if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 9999) {
    return 'La cantidad debe ser un entero entre 1 y 9,999.';
  }
  if (!(line.unitPrice >= 0) || roundMoney(line.unitPrice) !== line.unitPrice) {
    return 'Precio no válido.';
  }
  if (!(line.discount >= 0) || line.discount > line.quantity * line.unitPrice) {
    return 'El descuento no puede superar el subtotal.';
  }
  return null;
}

/**
 * "Nueva cotización" / "Editar cotización": 1) customer, 2) grade + list
 * customization, 3) financial summary and anticipo. The template is only read:
 * every change lives in the quotation's own copy of the lines. Live totals are
 * a preview; the backend recomputes and validates them when saving.
 */
@Component({
  selector: 'app-school-quotation-editor',
  standalone: true,
  imports: [FormsModule, BadgeComponent, ButtonComponent, IconComponent, QuotationProductSearchComponent],
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
  @Output() saved = new EventEmitter<SchoolQuotation>();
  @Output() cancelled = new EventEmitter<void>();

  readonly service = inject(SchoolListService);
  private readonly banks = inject(BankService);
  private readonly confirm = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly sourceLabel = SCHOOL_LINE_SOURCE_LABEL;
  readonly methods = SCHOOL_PAYMENT_METHODS;
  readonly methodLabel = SCHOOL_PAYMENT_METHOD_LABEL;
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
  readonly template = signal<SchoolTemplate | null>(null);
  readonly loadingTemplate = signal(false);
  readonly lines = signal<EditorLine[]>([]);
  readonly replacingKey = signal<string | null>(null);

  // Anticipo.
  readonly withAdvance = signal(false);
  readonly advanceAmount = signal<number | null>(null);
  readonly advanceMethod = signal<SchoolPaymentMethod>('EFECTIVO');
  readonly advanceBankId = signal('');
  readonly advanceReference = signal('');
  readonly asDraft = signal(false);
  readonly bankList = signal<Bank[]>([]);

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly touched = signal(false);
  private requestId = crypto.randomUUID();
  private lineSeq = 0;

  readonly isEdit = computed(() => this.quotation !== null);
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

  readonly problems = computed(() => {
    const issues: string[] = [];
    if (this.customerName().trim().length < 3) issues.push('El nombre del cliente o encargado es obligatorio.');
    if (!PHONE.test(this.customerPhone().trim()) || this.customerPhone().replace(/\D/g, '').length < 8) {
      issues.push('El teléfono es obligatorio (mínimo 8 dígitos).');
    }
    if (!this.isEdit() && !this.template()) issues.push('Seleccione el grado escolar.');
    if (!this.lines().length) issues.push('Agregue al menos un producto.');
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
    }
    return issues;
  });

  constructor() {
    this.service.getTemplates().subscribe({
      next: (templates) => this.templates.set(templates),
      error: () => this.templatesFailed.set(true),
    });
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
          description: item.description ?? '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          observations: item.observations ?? '',
          source: item.source,
          referencePrice: item.unitPrice,
        })),
      );
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
            productId: item.productId,
            productName: item.productName,
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

  setNumber(key: string, field: 'quantity' | 'unitPrice' | 'discount', value: unknown): void {
    const parsed = value === '' || value === null ? 0 : Number(value);
    this.update(key, { [field]: Number.isFinite(parsed) ? parsed : 0 } as Partial<EditorLine>);
  }

  step(line: EditorLine, delta: number): void {
    this.update(line.key, { quantity: Math.min(9999, Math.max(1, (line.quantity || 0) + delta)) });
  }

  remove(key: string): void {
    this.lines.update((lines) => lines.filter((line) => line.key !== key));
  }

  addManual(): void {
    this.lines.update((lines) => [
      ...lines,
      {
        key: this.nextKey(),
        itemId: null,
        templateItemId: null,
        productId: null,
        productName: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        observations: '',
        source: 'MANUAL',
        referencePrice: null,
      },
    ]);
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

  /** "Cambiar producto": the line becomes the chosen inventory product; the template is untouched. */
  replaceWith(key: string, product: Product): void {
    this.lines.update((lines) =>
      lines.map((line) => (line.key === key ? { ...this.fromProduct(product), key, quantity: line.quantity, observations: line.observations } : line)),
    );
    this.replacingKey.set(null);
  }

  /** Turns a line into a free-text product (e.g. "cuaderno grande" instead of the requested one). */
  makeManual(key: string): void {
    this.update(key, { itemId: null, templateItemId: null, productId: null, source: 'MANUAL', referencePrice: null, discount: 0 });
    this.replacingKey.set(null);
  }

  private fromProduct(product: Product): EditorLine {
    return {
      key: this.nextKey(),
      itemId: null,
      templateItemId: null,
      productId: product.id,
      productName: product.name,
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
      this.banks.getBanks().subscribe({ next: (list) => this.bankList.set(list), error: () => this.bankList.set([]) });
    }
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  private items(): SchoolQuotationItemInput[] {
    return this.lines().map((line) => ({
      itemId: line.itemId,
      templateItemId: line.templateItemId,
      productId: line.productId,
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
    const summary = `${this.lines().length} producto(s), total ${formatCurrency(this.total())}` +
      (this.advance() > 0 ? `, anticipo ${formatCurrency(this.advance())}, saldo ${formatCurrency(this.balance())}` : '');
    const ok = await this.confirm.confirm({
      type: this.isEdit() ? 'UPDATE' : 'SAVE',
      title: this.isEdit() ? 'Guardar cambios de la cotización' : this.asDraft() ? 'Guardar borrador' : 'Guardar cotización',
      message: `${this.customerName().trim()} · ${this.gradeLabel()} — ${summary}.`,
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
                  bankId: this.usesBank() && this.advanceBankId() ? this.advanceBankId() : null,
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
        this.notifications.success(this.isEdit() ? 'Cotización actualizada.' : `Cotización ${quotation.quotationNumber} guardada.`);
        this.saved.emit(quotation);
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(extractErrorMessage(error, 'No se pudo guardar la cotización.'));
      },
    });
  }
}
