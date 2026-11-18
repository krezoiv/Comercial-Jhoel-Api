import { Inject, Injectable } from '@nestjs/common';
import {
  SCHOOL_LIST_REPOSITORY,
  CancelInput,
  DashboardRow,
  FindQuotationsOptions,
  Paginated,
  PaymentInput,
  PreparationAssignmentInput,
  PurgeSummary,
  QuotationDetailRow,
  QuotationInput,
  QuotationSummaryRow,
  SchoolStatusAction,
  TemplateInput,
  TemplateRow,
  TemplateSummaryRow,
} from '../../domain/repositories/school-list.repository';
import type { SchoolListRepository } from '../../domain/repositories/school-list.repository';
import {
  assertSchoolListPermission,
  hasSchoolListPermission,
  SchoolListPermission,
  schoolListPermissionsFor,
} from '../../domain/policies/school-list.policy';
import { schoolListError } from '../../domain/errors/school-list.errors';
import {
  SCHOOL_PAYMENT_KIND_LABEL,
  SCHOOL_PAYMENT_METHOD_LABEL,
  SCHOOL_STATUS_LABEL,
} from '../../domain/school-list.labels';
import { COMPANY_SETTINGS_REPOSITORY } from '../../../company-settings/domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../../company-settings/domain/repositories/company-settings.repository';
import {
  buildSchoolQuotationPdf,
  buildSchoolReceiptPdf,
  SchoolListPdfCompany,
} from '../../infrastructure/pdf/school-list-pdf.builder';

/** Who is calling (from the JWT). */
export interface Actor {
  userId: string;
  role: string;
}

const GUATEMALA_TIME_ZONE = 'America/Guatemala';

/** `yyyy-MM-dd` of "today" in Guatemala. */
export function guatemalaToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: GUATEMALA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** Early, friendly check of a money amount (the SQL functions validate again). */
export function assertPositiveMoney(amount: number): void {
  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    Math.round(amount * 100) !== Number((amount * 100).toFixed(6))
  ) {
    throw schoolListError('SCHOOL_INVALID_AMOUNT');
  }
}

export function requireKey(
  clientRequestId: string | undefined,
  prefix: string,
): string {
  if (!clientRequestId || clientRequestId.length < 8) {
    throw schoolListError('SCHOOL_IDEMPOTENCY_KEY_REQUIRED');
  }
  return `${prefix}:${clientRequestId}`;
}

export abstract class SchoolListUseCase {
  constructor(
    @Inject(SCHOOL_LIST_REPOSITORY)
    protected readonly repository: SchoolListRepository,
  ) {}

  protected can(actor: Actor, permission: SchoolListPermission): void {
    assertSchoolListPermission(actor.role, permission);
  }

  protected async detail(id: string): Promise<QuotationDetailRow> {
    const quotation = await this.repository.getQuotation(id);
    if (!quotation) {
      throw schoolListError('SCHOOL_QUOTE_NOT_FOUND');
    }
    return quotation;
  }

  protected async template(id: string): Promise<TemplateRow> {
    const template = await this.repository.getTemplate(id);
    if (!template) {
      throw schoolListError('SCHOOL_TEMPLATE_NOT_FOUND');
    }
    return template;
  }
}

// ── Permissions ───────────────────────────────────────────────────────────
@Injectable()
export class GetSchoolListPermissionsUseCase {
  execute(actor: Actor): { permissions: SchoolListPermission[] } {
    return { permissions: schoolListPermissionsFor(actor.role) };
  }
}

// ── Templates ─────────────────────────────────────────────────────────────
@Injectable()
export class ListSchoolTemplatesUseCase extends SchoolListUseCase {
  execute(
    actor: Actor,
    includeInactive: boolean,
  ): Promise<TemplateSummaryRow[]> {
    this.can(actor, 'school_lists.view');
    // Inactive templates are an administration concern.
    return this.repository.listTemplates(
      includeInactive &&
        hasSchoolListPermission(actor.role, 'school_lists.templates.manage'),
    );
  }
}

@Injectable()
export class GetSchoolTemplateUseCase extends SchoolListUseCase {
  execute(actor: Actor, id: string): Promise<TemplateRow> {
    this.can(actor, 'school_lists.view');
    return this.template(id);
  }
}

@Injectable()
export class SaveSchoolTemplateUseCase extends SchoolListUseCase {
  /** Creates (`id` null) or replaces a template; `version` guards concurrent edits. */
  async execute(
    actor: Actor,
    id: string | null,
    input: TemplateInput,
    version: number | null,
  ): Promise<TemplateRow> {
    this.can(actor, 'school_lists.templates.manage');
    const savedId = await this.repository.saveTemplate(
      id,
      input,
      actor.userId,
      version,
    );
    return this.template(savedId);
  }
}

@Injectable()
export class SetSchoolTemplateActiveUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
    id: string,
    active: boolean,
  ): Promise<TemplateRow> {
    this.can(actor, 'school_lists.templates.manage');
    await this.repository.setTemplateActive(id, active, actor.userId);
    return this.template(id);
  }
}

@Injectable()
export class DuplicateSchoolTemplateUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
    id: string,
    name: string,
    grade: string | null,
  ): Promise<TemplateRow> {
    this.can(actor, 'school_lists.templates.manage');
    const copyId = await this.repository.duplicateTemplate(
      id,
      name,
      grade,
      actor.userId,
    );
    return this.template(copyId);
  }
}

// ── Quotations ────────────────────────────────────────────────────────────
@Injectable()
export class ListSchoolQuotationsUseCase extends SchoolListUseCase {
  execute(
    actor: Actor,
    options: FindQuotationsOptions,
  ): Promise<Paginated<QuotationSummaryRow>> {
    this.can(actor, 'school_lists.view');
    return this.repository.findQuotations(options);
  }
}

@Injectable()
export class GetSchoolQuotationUseCase extends SchoolListUseCase {
  /** Quotation, lines, history and its account statement. */
  execute(actor: Actor, id: string): Promise<QuotationDetailRow> {
    this.can(actor, 'school_lists.view');
    this.can(actor, 'school_lists.statements.view');
    return this.detail(id);
  }
}

@Injectable()
export class CreateSchoolQuotationUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
    input: QuotationInput,
    clientRequestId: string,
  ): Promise<QuotationDetailRow> {
    this.can(actor, 'school_lists.quotations.create');
    if (input.advance) {
      this.can(actor, 'school_lists.payments.register');
      assertPositiveMoney(input.advance.amount);
    }
    const id = await this.repository.createQuotation(
      { ...input, quotationDate: input.quotationDate ?? guatemalaToday() },
      actor.userId,
      requireKey(clientRequestId, 'SLQ'),
    );
    return this.detail(id);
  }
}

@Injectable()
export class UpdateSchoolQuotationUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
    id: string,
    input: QuotationInput,
    version: number,
  ): Promise<QuotationDetailRow> {
    this.can(actor, 'school_lists.quotations.edit');
    // Payments are never part of an edit; they have their own audited route.
    await this.repository.updateQuotation(
      id,
      { ...input, advance: null },
      actor.userId,
      version,
    );
    return this.detail(id);
  }
}

@Injectable()
export class UpdateSchoolQuotationObservationsUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
    id: string,
    observations: string | null,
    version: number,
  ): Promise<QuotationDetailRow> {
    this.can(actor, 'school_lists.quotations.edit');
    await this.repository.setObservations(
      id,
      observations,
      actor.userId,
      version,
    );
    return this.detail(id);
  }
}

@Injectable()
export class ChangeSchoolQuotationStatusUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
    id: string,
    action: SchoolStatusAction,
    version: number | null,
  ): Promise<QuotationDetailRow> {
    this.can(actor, 'school_lists.quotations.edit');
    await this.repository.changeStatus(id, action, actor.userId, version);
    return this.detail(id);
  }
}

@Injectable()
export class SaveSchoolPreparationUseCase extends SchoolListUseCase {
  /**
   * "Guardar preparación": which inventory products fulfil each requirement.
   * Moves no stock and never changes the requirement or its quoted price;
   * Bodega is discounted only by "Finalizar preparación" (TERMINAR).
   */
  async execute(
    actor: Actor,
    id: string,
    assignments: PreparationAssignmentInput[],
    version: number,
  ): Promise<QuotationDetailRow> {
    this.can(actor, 'school_lists.quotations.edit');
    const seen = new Set<string>();
    for (const a of assignments) {
      const key = `${a.itemId}:${a.productId}`;
      if (seen.has(key)) {
        throw schoolListError('SCHOOL_DUPLICATE_ASSIGNMENT');
      }
      seen.add(key);
    }
    await this.repository.savePreparation(
      id,
      assignments,
      actor.userId,
      version,
    );
    return this.detail(id);
  }
}

@Injectable()
export class CancelSchoolQuotationUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
    id: string,
    input: CancelInput,
    clientRequestId: string,
  ): Promise<QuotationDetailRow> {
    this.can(actor, 'school_lists.quotations.cancel');
    await this.repository.cancelQuotation(
      id,
      input,
      actor.userId,
      requireKey(clientRequestId, 'SLC'),
    );
    return this.detail(id);
  }
}

// ── Payments ──────────────────────────────────────────────────────────────
@Injectable()
export class RegisterSchoolPaymentUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
    quotationId: string,
    input: PaymentInput,
    clientRequestId: string,
  ): Promise<{ paymentId: string; quotation: QuotationDetailRow }> {
    this.can(actor, 'school_lists.payments.register');
    assertPositiveMoney(input.amount);
    const paymentId = await this.repository.registerPayment(
      quotationId,
      input,
      actor.userId,
      requireKey(clientRequestId, 'SLP'),
    );
    return { paymentId, quotation: await this.detail(quotationId) };
  }
}

@Injectable()
export class VoidSchoolPaymentUseCase extends SchoolListUseCase {
  async execute(
    actor: Actor,
    paymentId: string,
    reason: string,
    clientRequestId: string,
  ): Promise<{ reversalId: string; quotation: QuotationDetailRow }> {
    this.can(actor, 'school_lists.payments.void');
    const payment = await this.repository.findPayment(paymentId);
    if (!payment) {
      throw schoolListError('SCHOOL_PAYMENT_NOT_FOUND');
    }
    const reversalId = await this.repository.voidPayment(
      paymentId,
      reason,
      actor.userId,
      requireKey(clientRequestId, 'SLV'),
    );
    return { reversalId, quotation: await this.detail(payment.quotationId) };
  }
}

// ── Inventory ─────────────────────────────────────────────────────────────
@Injectable()
export class GetSchoolBodegaStockUseCase extends SchoolListUseCase {
  /** Bodega stock shown next to inventory lines; the SQL sync validates again under lock. */
  execute(
    actor: Actor,
    productIds: string[],
  ): Promise<{ productId: string; quantity: number }[]> {
    this.can(actor, 'school_lists.view');
    return this.repository.bodegaStock([...new Set(productIds)].slice(0, 300));
  }
}

// ── Purge ─────────────────────────────────────────────────────────────────
/** Phrase the user must type to confirm "Borrar todas las cotizaciones". */
export const PURGE_CONFIRMATION = 'BORRAR TODO';

@Injectable()
export class PreviewSchoolQuotationPurgeUseCase extends SchoolListUseCase {
  /** What the purge would delete and return to Bodega (super administrators only). */
  async execute(actor: Actor): Promise<PurgeSummary> {
    this.can(actor, 'school_lists.quotations.purge');
    return this.repository.purgePreview();
  }
}

@Injectable()
export class PurgeSchoolQuotationsUseCase extends SchoolListUseCase {
  /**
   * "Borrar todas las cotizaciones": HARD delete of every school-list
   * quotation with its payments, history, assignments, supply and inventory
   * movements; the units still discounted go back to Bodega. Templates and
   * numbering stay. The SQL function checks the role and the phrase again.
   */
  async execute(actor: Actor, confirmation: string): Promise<PurgeSummary> {
    this.can(actor, 'school_lists.quotations.purge');
    if (confirmation !== PURGE_CONFIRMATION) {
      throw schoolListError('SCHOOL_PURGE_CONFIRMATION');
    }
    return this.repository.purgeQuotations(actor.userId, confirmation);
  }
}

// ── Dashboard ─────────────────────────────────────────────────────────────
@Injectable()
export class GetSchoolListDashboardUseCase extends SchoolListUseCase {
  /** Defaults to the current calendar year (the school season). */
  async execute(
    actor: Actor,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<DashboardRow & { dateFrom: string; dateTo: string }> {
    this.can(actor, 'school_lists.view');
    const today = guatemalaToday();
    const from = dateFrom ?? `${today.slice(0, 4)}-01-01`;
    const to = dateTo ?? today;
    if (from > to) {
      throw schoolListError('SCHOOL_INVALID_DATE_RANGE');
    }
    const row = await this.repository.dashboard(from, to);
    return { ...row, dateFrom: from, dateTo: to };
  }
}

// ── Documents ─────────────────────────────────────────────────────────────
abstract class SchoolDocumentUseCase extends SchoolListUseCase {
  constructor(
    @Inject(SCHOOL_LIST_REPOSITORY) repository: SchoolListRepository,
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettings: CompanySettingsRepository,
  ) {
    super(repository);
  }

  protected async company(): Promise<SchoolListPdfCompany> {
    const company = await this.companySettings.get();
    return {
      businessName: company.businessName || 'Comercial Jhoel',
      address: company.address,
      phone: company.phone,
      email: company.email,
      taxId: company.taxId,
      logoBase64: company.logoBase64,
      whatsapp: company.whatsapp,
      website: company.website,
      businessHours: company.businessHours,
    };
  }
}

@Injectable()
export class GetSchoolQuotationPdfUseCase extends SchoolDocumentUseCase {
  async execute(
    actor: Actor,
    id: string,
  ): Promise<{ filename: string; pdf: Buffer }> {
    this.can(actor, 'school_lists.documents.generate');
    const q = await this.detail(id);
    const pdf = await buildSchoolQuotationPdf({
      company: await this.company(),
      quotationNumber: q.quotationNumber,
      quotationDate: q.quotationDate,
      deliveryDate: q.deliveryDate,
      statusLabel: SCHOOL_STATUS_LABEL[q.status],
      customerName: q.customerName,
      customerPhone: q.customerPhone,
      studentName: q.studentName,
      grade: q.grade,
      items: q.items,
      subtotal: q.subtotal,
      discount: q.discount,
      total: q.total,
      advance: q.account.advances,
      paid: q.account.paid,
      balance: q.account.balance,
      observations: q.observations,
    });
    return { filename: `${q.quotationNumber}.pdf`, pdf };
  }
}

@Injectable()
export class GetSchoolReceiptPdfUseCase extends SchoolDocumentUseCase {
  async execute(
    actor: Actor,
    paymentId: string,
  ): Promise<{ filename: string; pdf: Buffer }> {
    this.can(actor, 'school_lists.documents.generate');
    const payment = await this.repository.findPayment(paymentId);
    if (!payment) {
      throw schoolListError('SCHOOL_PAYMENT_NOT_FOUND');
    }
    const q = await this.detail(payment.quotationId);
    const title =
      payment.kind === 'DEVOLUCION'
        ? 'COMPROBANTE DE DEVOLUCIÓN'
        : payment.kind === 'ANULACION'
          ? 'CONSTANCIA DE ANULACIÓN'
          : 'COMPROBANTE DE PAGO';
    const pdf = await buildSchoolReceiptPdf({
      company: await this.company(),
      title,
      receiptNumber: payment.receiptNumber,
      receivedAt: new Date(payment.receivedAt),
      quotationNumber: q.quotationNumber,
      customerName: q.customerName,
      customerPhone: q.customerPhone,
      studentName: q.studentName,
      grade: q.grade,
      kindLabel:
        payment.kind === 'ANULACION'
          ? `Anulación del comprobante ${payment.reference ?? ''}`.trim()
          : SCHOOL_PAYMENT_KIND_LABEL[payment.kind],
      methodLabel: SCHOOL_PAYMENT_METHOD_LABEL[payment.paymentMethod],
      bankName: payment.bankName,
      reference: payment.kind === 'ANULACION' ? null : payment.reference,
      amount: payment.amount,
      quotationTotal: q.total,
      balanceAfter: payment.runningBalance,
      receivedBy: payment.receivedByUsername,
      observations: payment.observations,
      voided:
        payment.status === 'ANULADO' && payment.voidedAt
          ? {
              at: new Date(payment.voidedAt),
              by: payment.voidedByUsername,
              reason: payment.voidReason,
            }
          : null,
    });
    return { filename: `${payment.receiptNumber}.pdf`, pdf };
  }
}
