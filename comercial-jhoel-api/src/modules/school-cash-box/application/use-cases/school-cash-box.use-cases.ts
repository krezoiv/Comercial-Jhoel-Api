import { Inject, Injectable } from '@nestjs/common';
import {
  SCHOOL_CASH_BOX_REPOSITORY,
  AdjustmentInput,
  CashUser,
  CountInput,
  CustomerAccountStatus,
  CustomerFilters,
  CustomerListRow,
  CustomerPage,
  CustomerPaymentRow,
  CustomerRow,
  PaymentFilters,
  PaymentPage,
  SummaryGranularity,
  DateRangeFilters,
  ExitInput,
  MovementFilters,
  Page,
  ReceiptFilters,
  ReportRecord,
  SchoolCashCountRow,
  SchoolCashExitRow,
  SchoolCashMovementRow,
  SchoolCashReceiptRow,
  SchoolCashSummaryRow,
  SchoolCashTransferRow,
  TransferInput,
} from '../../domain/repositories/school-cash-box.repository';
import type { SchoolCashBoxRepository } from '../../domain/repositories/school-cash-box.repository';
import {
  assertSchoolListPermission,
  SchoolListPermission,
} from '../../../school-lists/domain/policies/school-list.policy';
import { schoolListError } from '../../../school-lists/domain/errors/school-list.errors';
import { SCHOOL_CASH_REPORT_LABELS } from '../../domain/school-cash.labels';
import {
  findReport,
  formatCell,
  formatDateTime,
  formatDay,
  formatMoney,
  reportTotals,
  SCHOOL_CASH_REPORTS,
  SchoolCashReportDefinition,
} from '../reports/school-cash-reports';
import { buildReportPdf } from '../../../reports/infrastructure/pdf/report-pdf.builder';
import { buildSchoolCashReportExcel } from '../../infrastructure/export/school-cash-report.excel';
import { buildCustomerStatementPdf } from '../../infrastructure/pdf/school-customer-statement.pdf';
import {
  buildCustomerLedger,
  CustomerLedger,
  paymentTypeLabel,
} from '../../domain/customer-ledger';
import {
  SCHOOL_PAYMENT_METHOD_LABEL,
  SCHOOL_STATUS_LABEL,
} from '../../../school-lists/domain/school-list.labels';
import type {
  SchoolPaymentMethod,
  SchoolQuotationStatus,
} from '../../../school-lists/domain/repositories/school-list.repository';
import { isAcceptedSchoolStatus } from '../../../school-lists/domain/repositories/school-list.repository';
import { COMPANY_SETTINGS_REPOSITORY } from '../../../company-settings/domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../../company-settings/domain/repositories/company-settings.repository';

/** Who is calling (from the JWT). */
export interface CashActor {
  userId: string;
  role: string;
  username: string;
}

const GUATEMALA_TIME_ZONE = 'America/Guatemala';
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const PDF_ROW_LIMIT = 500;
const EXCEL_ROW_LIMIT = 20_000;

/** `yyyy-MM-dd` of "today" in Guatemala. */
export function guatemalaToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: GUATEMALA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** Early, friendly money check (the SQL functions validate again). */
export function assertCashAmount(amount: number): void {
  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > 9_999_999.99 ||
    Math.abs(Math.round(amount * 100) - amount * 100) > 1e-6
  ) {
    throw schoolListError('SCHOOL_CASH_INVALID_AMOUNT');
  }
}

/** Mandatory reason of every authorized operation (5–500 characters). */
export function requireReason(reason: string | undefined): string {
  const value = (reason ?? '').trim();
  if (value.length < 5 || value.length > 500) {
    throw schoolListError('SCHOOL_REASON_REQUIRED');
  }
  return value;
}

/** One idempotency key per opened form: a double click returns the same record. */
export function cashKey(
  clientRequestId: string | undefined,
  prefix: string,
): string {
  if (!clientRequestId || clientRequestId.length < 8) {
    throw schoolListError('SCHOOL_IDEMPOTENCY_KEY_REQUIRED');
  }
  return `${prefix}:${clientRequestId}`;
}

/** Validated report range; defaults to the current month up to today. */
export function resolveRange(
  dateFrom: string | undefined,
  dateTo: string | undefined,
  today = guatemalaToday(),
) {
  const from = dateFrom || `${today.slice(0, 8)}01`;
  const to = dateTo || today;
  if (!ISO_DAY.test(from) || !ISO_DAY.test(to) || from > to) {
    throw schoolListError('SCHOOL_CASH_INVALID_RANGE');
  }
  return { from, to };
}

export abstract class SchoolCashUseCase {
  constructor(
    @Inject(SCHOOL_CASH_BOX_REPOSITORY)
    protected readonly repository: SchoolCashBoxRepository,
  ) {}

  protected can(actor: CashActor, permission: SchoolListPermission): void {
    assertSchoolListPermission(actor.role, permission);
  }
}

// ── Reads ────────────────────────────────────────────────────────────────

@Injectable()
export class GetSchoolCashSummaryUseCase extends SchoolCashUseCase {
  /**
   * Without a period: the whole season. With one, sales (by list date),
   * collected money and transfers are limited to it; cash, pending transfers,
   * debts and customers are always "as of now".
   */
  execute(
    actor: CashActor,
    period: {
      dateFrom?: string;
      dateTo?: string;
      granularity?: SummaryGranularity;
    } = {},
  ): Promise<SchoolCashSummaryRow> {
    this.can(actor, 'school_lists.cash.view');
    const check = (day?: string) => {
      if (day && !ISO_DAY.test(day)) {
        throw schoolListError('SCHOOL_CASH_INVALID_RANGE');
      }
    };
    check(period.dateFrom);
    check(period.dateTo);
    if (period.dateFrom && period.dateTo && period.dateFrom > period.dateTo) {
      throw schoolListError('SCHOOL_CASH_INVALID_RANGE');
    }
    return this.repository.summary(guatemalaToday(), {
      from: period.dateFrom,
      to: period.dateTo,
      granularity: period.granularity ?? 'day',
    });
  }
}

// ── Customers (account statements) ─────────────────────────────────────

export const CUSTOMER_STATUS_LABEL: Record<CustomerAccountStatus, string> = {
  SOLVENTE: 'Solvente',
  ABONANDO: 'Abonando',
  PENDIENTE: 'Pendiente',
  COTIZANDO: 'Solo cotizaciones',
  CANCELADO: 'Solo listas canceladas',
};

/**
 * Payment state of ONE list. Drafts, quotations not accepted yet and
 * cancelled lists never owe anything (migration 1760009000000).
 */
export function listAccountStatus(
  list: Pick<CustomerListRow, 'status' | 'total' | 'paid'>,
): string {
  if (list.status === 'BORRADOR') {
    return 'BORRADOR';
  }
  if (list.status === 'CANCELADA') {
    return 'CANCELADA';
  }
  if (!isAcceptedSchoolStatus(list.status)) {
    return 'COTIZACION';
  }
  if (list.paid >= list.total) {
    return 'PAGADA';
  }
  return list.paid > 0 ? 'PARCIAL' : 'PENDIENTE';
}

/** Phone digits of the customer key (8–15 digits, as the quotation phone rule). */
export function customerKey(raw: string): string {
  const key = (raw ?? '').replace(/\D/g, '');
  if (key.length < 8 || key.length > 15) {
    throw schoolListError('SCHOOL_CUSTOMER_NOT_FOUND');
  }
  return key;
}

export interface SchoolCustomerStatement {
  customer: CustomerRow & { percentPaid: number; statusLabel: string };
  lists: (CustomerListRow & { accountStatus: string; statusLabel: string })[];
  payments: (CustomerPaymentRow & { typeLabel: string; methodLabel: string })[];
  ledger: CustomerLedger;
}

@Injectable()
export class ListSchoolCustomersUseCase extends SchoolCashUseCase {
  execute(actor: CashActor, filters: CustomerFilters): Promise<CustomerPage> {
    this.can(actor, 'school_lists.customers.view');
    if (
      filters.dateFrom &&
      filters.dateTo &&
      filters.dateFrom > filters.dateTo
    ) {
      throw schoolListError('SCHOOL_CASH_INVALID_RANGE');
    }
    return this.repository.listCustomers(filters);
  }
}

@Injectable()
export class GetSchoolCustomerUseCase extends SchoolCashUseCase {
  async execute(
    actor: CashActor,
    rawKey: string,
    range: { dateFrom?: string; dateTo?: string } = {},
  ): Promise<SchoolCustomerStatement> {
    this.can(actor, 'school_lists.customers.view');
    if (range.dateFrom && range.dateTo && range.dateFrom > range.dateTo) {
      throw schoolListError('SCHOOL_CASH_INVALID_RANGE');
    }
    const raw = await this.repository.findCustomer(customerKey(rawKey));
    if (!raw) {
      throw schoolListError('SCHOOL_CUSTOMER_NOT_FOUND');
    }
    const method = (code: string) =>
      SCHOOL_PAYMENT_METHOD_LABEL[code as SchoolPaymentMethod] ?? code;
    const ledger = buildCustomerLedger(
      raw.lists,
      raw.history,
      raw.payments.map((p) => ({
        seq: p.seq,
        id: p.id,
        quotationId: p.quotationId,
        receiptNumber: p.receiptNumber,
        kind: p.kind,
        amount: p.amount,
        paymentMethodLabel: method(p.paymentMethod),
        bankName: p.bankName,
        reference: p.reference,
        balanceAfter: p.balanceAfter,
        reversedReceipt: p.reversedReceipt,
        receivedAt: p.receivedAt,
      })),
      { from: range.dateFrom, to: range.dateTo },
    );
    const c = raw.customer;
    return {
      customer: {
        ...c,
        percentPaid:
          c.purchased > 0
            ? Math.min(100, Math.round((c.paid / c.purchased) * 1000) / 10)
            : 0,
        statusLabel: CUSTOMER_STATUS_LABEL[c.status],
      },
      lists: raw.lists.map((list) => ({
        ...list,
        accountStatus: listAccountStatus(list),
        statusLabel:
          SCHOOL_STATUS_LABEL[list.status as SchoolQuotationStatus] ??
          list.status,
      })),
      payments: raw.payments.map((p) => ({
        ...p,
        typeLabel: paymentTypeLabel(p.kind, p.balanceAfter),
        methodLabel: method(p.paymentMethod),
      })),
      ledger,
    };
  }
}

@Injectable()
export class ExportSchoolCustomerStatementUseCase extends SchoolCashUseCase {
  constructor(
    @Inject(SCHOOL_CASH_BOX_REPOSITORY) repository: SchoolCashBoxRepository,
    private readonly statement: GetSchoolCustomerUseCase,
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettings: CompanySettingsRepository,
  ) {
    super(repository);
  }

  async execute(actor: CashActor, rawKey: string): Promise<ExportedFile> {
    this.can(actor, 'school_lists.customers.export');
    const data = await this.statement.execute(actor, rawKey);
    const company = await this.companySettings.get();
    const day = (iso: string) => formatDay(iso.slice(0, 10));
    const c = data.customer;
    const notes: string[] = [];
    if (c.nextDeliveryDate) {
      notes.push(
        `Próxima entrega programada con saldo pendiente: ${formatDay(c.nextDeliveryDate)}.`,
      );
    }
    if (!data.ledger.consistent) {
      notes.push(
        'El historial no reproduce exactamente el saldo actual; el saldo oficial es el de las listas.',
      );
    }
    notes.push(
      'Saldos calculados por el sistema con los pagos registrados a la fecha de generación.',
    );
    const buffer = await buildCustomerStatementPdf({
      company: {
        businessName: company.businessName || 'Comercial Jhoel',
        address: company.address,
        phone: company.phone,
        email: company.email,
        taxId: company.taxId,
        logoBase64: company.logoBase64,
        whatsapp: company.whatsapp,
        website: company.website,
        businessHours: company.businessHours,
      },
      generatedAt: new Date(),
      generatedBy: actor.username,
      customer: {
        name: c.name,
        phone: c.phone,
        otherNames: c.otherNames,
        students: c.students,
        grades: c.grades,
        since: day(guatemalaDayOf(c.firstAt)),
        statusLabel: c.statusLabel,
      },
      totals: {
        purchased: c.purchased,
        paid: c.paid,
        balance: c.balance,
        percentPaid: c.percentPaid,
      },
      lists: data.lists
        .filter((l) => l.status !== 'BORRADOR')
        .map((l) => ({
          number: l.quotationNumber,
          student: l.studentName ?? '—',
          grade: l.grade,
          date: formatDay(l.quotationDate),
          total: l.total,
          paid: l.status === 'CANCELADA' ? 0 : l.paid,
          balance: l.balance,
          status: l.statusLabel,
        })),
      payments: data.payments.map((p) => ({
        at: formatDateTime(p.receivedAt),
        list: p.quotationNumber,
        receipt: p.receiptNumber,
        type: p.typeLabel,
        method: p.bankName ? `${p.methodLabel} · ${p.bankName}` : p.methodLabel,
        amount: p.amount,
        status:
          p.kind === 'ANULACION' || p.kind === 'DEVOLUCION'
            ? '—'
            : p.status === 'ANULADO'
              ? 'Anulado'
              : 'Aplicado',
      })),
      ledger: data.ledger.rows.map((r) => ({
        at: formatDateTime(r.at),
        description: r.description,
        charge: r.charge,
        credit: r.credit,
        balance: r.balance,
      })),
      notes,
    });
    return {
      filename: `estado-de-cuenta-${c.key}-${guatemalaToday()}.pdf`,
      contentType: 'application/pdf',
      buffer,
    };
  }
}

function guatemalaDayOf(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: GUATEMALA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso));
}

@Injectable()
export class ListSchoolPaymentsUseCase extends SchoolCashUseCase {
  async execute(
    actor: CashActor,
    filters: PaymentFilters,
  ): Promise<PaymentPage> {
    this.can(actor, 'school_lists.cash.view');
    if (
      filters.dateFrom &&
      filters.dateTo &&
      filters.dateFrom > filters.dateTo
    ) {
      throw schoolListError('SCHOOL_CASH_INVALID_RANGE');
    }
    const page = await this.repository.listPayments(filters);
    return {
      ...page,
      items: page.items.map((p) => ({
        ...p,
        typeLabel: paymentTypeLabel(p.kind, p.balanceAfter),
        methodLabel:
          SCHOOL_PAYMENT_METHOD_LABEL[p.paymentMethod as SchoolPaymentMethod] ??
          p.paymentMethod,
      })),
    };
  }
}

@Injectable()
export class ListSchoolCashMovementsUseCase extends SchoolCashUseCase {
  execute(
    actor: CashActor,
    filters: MovementFilters,
  ): Promise<Page<SchoolCashMovementRow>> {
    this.can(actor, 'school_lists.cash.view');
    if (
      filters.dateFrom &&
      filters.dateTo &&
      filters.dateFrom > filters.dateTo
    ) {
      throw schoolListError('SCHOOL_CASH_INVALID_RANGE');
    }
    return this.repository.listMovements(filters);
  }
}

@Injectable()
export class GetSchoolCashMovementUseCase extends SchoolCashUseCase {
  async execute(actor: CashActor, id: string): Promise<SchoolCashMovementRow> {
    this.can(actor, 'school_lists.cash.view');
    const movement = await this.repository.findMovement(id);
    if (!movement) {
      throw schoolListError('SCHOOL_CASH_MOVEMENT_NOT_FOUND');
    }
    return movement;
  }
}

@Injectable()
export class ListSchoolCashReceiptsUseCase extends SchoolCashUseCase {
  execute(
    actor: CashActor,
    filters: ReceiptFilters,
  ): Promise<SchoolCashReceiptRow[]> {
    this.can(actor, 'school_lists.cash.view');
    return this.repository.listReceipts(filters);
  }
}

@Injectable()
export class ListSchoolCashTransfersUseCase extends SchoolCashUseCase {
  execute(
    actor: CashActor,
    filters: DateRangeFilters,
  ): Promise<Page<SchoolCashTransferRow>> {
    this.can(actor, 'school_lists.cash.view');
    return this.repository.listTransfers(filters);
  }
}

@Injectable()
export class GetSchoolCashTransferUseCase extends SchoolCashUseCase {
  async execute(actor: CashActor, id: string): Promise<SchoolCashTransferRow> {
    this.can(actor, 'school_lists.cash.view');
    const transfer = await this.repository.findTransfer(id);
    if (!transfer) {
      throw schoolListError('SCHOOL_CASH_TRANSFER_NOT_FOUND');
    }
    return transfer;
  }
}

@Injectable()
export class ListSchoolCashExitsUseCase extends SchoolCashUseCase {
  execute(
    actor: CashActor,
    filters: DateRangeFilters,
  ): Promise<Page<SchoolCashExitRow>> {
    this.can(actor, 'school_lists.cash.view');
    return this.repository.listExits(filters);
  }
}

@Injectable()
export class ListSchoolCashCountsUseCase extends SchoolCashUseCase {
  execute(
    actor: CashActor,
    filters: DateRangeFilters,
  ): Promise<Page<SchoolCashCountRow>> {
    this.can(actor, 'school_lists.cash.view');
    return this.repository.listCounts(filters);
  }
}

@Injectable()
export class GetSchoolCashCountUseCase extends SchoolCashUseCase {
  async execute(actor: CashActor, id: string): Promise<SchoolCashCountRow> {
    this.can(actor, 'school_lists.cash.view');
    const count = await this.repository.findCount(id);
    if (!count) {
      throw schoolListError('SCHOOL_CASH_COUNT_NOT_FOUND');
    }
    return count;
  }
}

@Injectable()
export class ListSchoolCashUsersUseCase extends SchoolCashUseCase {
  execute(actor: CashActor): Promise<CashUser[]> {
    this.can(actor, 'school_lists.cash.view');
    return this.repository.listUsers();
  }
}

// ── Writes (each one SQL function: permission, locks and rules again there) ─

@Injectable()
export class RegisterSchoolCashTransferUseCase extends SchoolCashUseCase {
  async execute(
    actor: CashActor,
    input: TransferInput,
    clientRequestId: string,
  ): Promise<SchoolCashTransferRow> {
    this.can(actor, 'school_lists.cash.transfer');
    if (!input.items.length) {
      throw schoolListError('SCHOOL_CASH_TRANSFER_EMPTY');
    }
    if (
      new Set(input.items.map((item) => item.movementId)).size !==
      input.items.length
    ) {
      throw schoolListError('SCHOOL_CASH_TRANSFER_DUPLICATE');
    }
    input.items.forEach((item) => assertCashAmount(item.amount));
    const id = await this.repository.registerTransfer(
      input,
      actor.userId,
      cashKey(clientRequestId, 'SCT'),
    );
    return (await this.repository.findTransfer(id)) as SchoolCashTransferRow;
  }
}

@Injectable()
export class VoidSchoolCashTransferUseCase extends SchoolCashUseCase {
  async execute(
    actor: CashActor,
    id: string,
    reason: string,
  ): Promise<SchoolCashTransferRow> {
    this.can(actor, 'school_lists.cash.authorize');
    await this.repository.voidTransfer(id, requireReason(reason), actor.userId);
    return (await this.repository.findTransfer(id)) as SchoolCashTransferRow;
  }
}

@Injectable()
export class RegisterSchoolCashExitUseCase extends SchoolCashUseCase {
  async execute(
    actor: CashActor,
    input: ExitInput,
    clientRequestId: string,
  ): Promise<SchoolCashExitRow> {
    this.can(actor, 'school_lists.cash.exit');
    assertCashAmount(input.amount);
    if ((input.destination === 'DEPOSITO_BANCARIO') !== Boolean(input.bankId)) {
      throw schoolListError('SCHOOL_CASH_BANK_REQUIRED');
    }
    const id = await this.repository.registerExit(
      { ...input, reason: requireReason(input.reason) },
      actor.userId,
      cashKey(clientRequestId, 'SCE'),
    );
    return (await this.repository.findExit(id)) as SchoolCashExitRow;
  }
}

@Injectable()
export class VoidSchoolCashExitUseCase extends SchoolCashUseCase {
  async execute(
    actor: CashActor,
    id: string,
    reason: string,
  ): Promise<SchoolCashExitRow> {
    this.can(actor, 'school_lists.cash.authorize');
    await this.repository.voidExit(id, requireReason(reason), actor.userId);
    return (await this.repository.findExit(id)) as SchoolCashExitRow;
  }
}

@Injectable()
export class RegisterSchoolCashAdjustmentUseCase extends SchoolCashUseCase {
  async execute(
    actor: CashActor,
    input: AdjustmentInput,
    clientRequestId: string,
  ): Promise<SchoolCashMovementRow> {
    this.can(actor, 'school_lists.cash.adjust');
    assertCashAmount(input.amount);
    const id = await this.repository.registerAdjustment(
      { ...input, reason: requireReason(input.reason) },
      actor.userId,
      cashKey(clientRequestId, 'SCA'),
    );
    return (await this.repository.findMovement(id)) as SchoolCashMovementRow;
  }
}

@Injectable()
export class VoidSchoolCashAdjustmentUseCase extends SchoolCashUseCase {
  async execute(
    actor: CashActor,
    movementId: string,
    reason: string,
  ): Promise<SchoolCashMovementRow> {
    this.can(actor, 'school_lists.cash.authorize');
    const id = await this.repository.voidAdjustment(
      movementId,
      requireReason(reason),
      actor.userId,
    );
    return (await this.repository.findMovement(id)) as SchoolCashMovementRow;
  }
}

@Injectable()
export class RegisterSchoolCashCountUseCase extends SchoolCashUseCase {
  async execute(
    actor: CashActor,
    input: CountInput,
    clientRequestId: string,
  ): Promise<SchoolCashCountRow> {
    this.can(actor, 'school_lists.cash.count');
    const id = await this.repository.registerCount(
      { ...input, details: input.details.filter((d) => d.quantity > 0) },
      actor.userId,
      cashKey(clientRequestId, 'SCC'),
    );
    return (await this.repository.findCount(id)) as SchoolCashCountRow;
  }
}

// ── Reports ──────────────────────────────────────────────────────────────

export interface SchoolCashReportOutput {
  kind: string;
  title: string;
  description: string;
  usesRange: boolean;
  dateFrom: string;
  dateTo: string;
  periodLabel: string;
  cashBalance: number;
  columns: { key: string; label: string; type: string; total: boolean }[];
  rows: ReportRecord[];
  totals: Record<string, number>;
}

function applyLabels(kind: string, rows: ReportRecord[]): ReportRecord[] {
  const labels = SCHOOL_CASH_REPORT_LABELS[kind];
  if (!labels) {
    return rows;
  }
  return rows.map((row) => {
    const copy = { ...row };
    for (const [key, dictionary] of Object.entries(labels)) {
      const value = copy[key];
      if (typeof value === 'string' && dictionary[value]) {
        copy[key] = dictionary[value];
      }
    }
    return copy;
  });
}

@Injectable()
export class ListSchoolCashReportsUseCase extends SchoolCashUseCase {
  execute(actor: CashActor) {
    this.can(actor, 'school_lists.cash.reports');
    return SCHOOL_CASH_REPORTS.map((report) => ({
      kind: report.kind,
      title: report.title,
      description: report.description,
      usesRange: report.usesRange,
    }));
  }
}

@Injectable()
export class GetSchoolCashReportUseCase extends SchoolCashUseCase {
  async execute(
    actor: CashActor,
    kind: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<SchoolCashReportOutput> {
    this.can(actor, 'school_lists.cash.reports');
    const definition = findReport(kind);
    if (!definition) {
      throw schoolListError('SCHOOL_CASH_INVALID_REPORT');
    }
    const range = resolveRange(dateFrom, dateTo);
    const [raw, cashBalance] = await Promise.all([
      this.repository.reportRows(kind, range.from, range.to),
      this.repository.balance(),
    ]);
    const rows = applyLabels(kind, raw);
    return {
      kind,
      title: definition.title,
      description: definition.description,
      usesRange: definition.usesRange,
      dateFrom: range.from,
      dateTo: range.to,
      periodLabel: periodLabel(definition, range.from, range.to),
      cashBalance,
      columns: definition.columns.map((c) => ({
        key: c.key,
        label: c.label,
        type: c.type,
        total: Boolean(c.total),
      })),
      rows,
      totals: reportTotals(definition, rows),
    };
  }
}

function periodLabel(
  definition: SchoolCashReportDefinition,
  from: string,
  to: string,
): string {
  if (!definition.usesRange) {
    return `Estado al ${formatDay(guatemalaToday())}`;
  }
  return from === to
    ? formatDay(from)
    : `${formatDay(from)} al ${formatDay(to)}`;
}

export interface ExportedFile {
  filename: string;
  contentType: string;
  buffer: Buffer;
}

@Injectable()
export class ExportSchoolCashReportUseCase extends SchoolCashUseCase {
  constructor(
    @Inject(SCHOOL_CASH_BOX_REPOSITORY) repository: SchoolCashBoxRepository,
    private readonly report: GetSchoolCashReportUseCase,
  ) {
    super(repository);
  }

  async execute(
    actor: CashActor,
    kind: string,
    format: 'pdf' | 'xlsx',
    dateFrom?: string,
    dateTo?: string,
  ): Promise<ExportedFile> {
    const output = await this.report.execute(actor, kind, dateFrom, dateTo);
    const definition = findReport(kind) as SchoolCashReportDefinition;
    const generatedAt = new Date();
    const base = `caja-listas-${kind}-${output.dateFrom}_${output.dateTo}`;
    if (format === 'xlsx') {
      return {
        filename: `${base}.xlsx`,
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: await buildSchoolCashReportExcel({
          definition,
          rows: output.rows.slice(0, EXCEL_ROW_LIMIT),
          totals: output.totals,
          periodLabel: output.periodLabel,
          generatedAt,
          generatedBy: actor.username,
          cashBalance: output.cashBalance,
        }),
      };
    }
    const moneyTotals = definition.columns
      .filter((c) => c.total && c.type === 'money')
      .slice(0, 4)
      .map((c) => ({
        label: c.label,
        value: formatMoney(output.totals[c.key] ?? 0),
      }));
    const rows = output.rows.slice(0, PDF_ROW_LIMIT);
    const tableRows = rows.map((row) =>
      definition.columns.map((c) => formatCell(c, row[c.key])),
    );
    if (definition.columns.some((c) => c.total) && rows.length) {
      tableRows.push(
        definition.columns.map((c, index) =>
          index === 0
            ? 'TOTALES'
            : c.total
              ? formatCell(c, output.totals[c.key] ?? 0)
              : '',
        ),
      );
    }
    return {
      filename: `${base}.pdf`,
      contentType: 'application/pdf',
      buffer: await buildReportPdf({
        reportTitle: `Caja de Listas — ${definition.title}`,
        periodLabel: output.periodLabel,
        filters: [
          {
            label: 'Saldo actual en caja',
            value: formatMoney(output.cashBalance),
          },
        ],
        summary: [
          { label: 'Registros', value: String(output.rows.length) },
          ...moneyTotals,
        ],
        columns: definition.columns.map((c) => ({
          header: c.label,
          width: c.width,
          align: c.type === 'money' || c.type === 'int' ? 'right' : 'left',
          wrap: c.wrap,
        })),
        rows: tableRows,
        generatedAt,
        generatedByUsername: actor.username,
        truncationNotice:
          output.rows.length > PDF_ROW_LIMIT
            ? `Se muestran los primeros ${PDF_ROW_LIMIT} de ${output.rows.length} registros; exporte a Excel para verlos todos.`
            : undefined,
        layout: 'landscape',
      }),
    };
  }
}
