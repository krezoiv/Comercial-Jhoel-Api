import { QuotationDetail } from './quotation-detail.entity';

/** Commercial life cycle (migration 1760008200000). VENCIDA is derived, never stored. */
export type QuotationStoredStatus =
  'BORRADOR' | 'COTIZADA' | 'ACEPTADA' | 'VENDIDA' | 'RECHAZADA' | 'CANCELADA';

export interface QuotationProps {
  id: string;
  quotationNumber: string;
  /** Registered client (legacy quotations); null when the customer was typed in. */
  clientId: string | null;
  /** Customer name: typed in on the quotation, or the registered client's name. */
  clientName: string;
  customerPhone: string | null;
  studentName: string | null;
  grade: string | null;
  userId: string;
  username: string;
  quotationDate: Date;
  /** `yyyy-MM-dd` — a calendar date, not a timestamp (plain Postgres `DATE` column). */
  expirationDate: string;
  subtotal: number;
  discount: number;
  total: number;
  observations: string | null;
  commercialTerms: string | null;
  /** The stored value only — never `'VENCIDA'`, which is always derived at read time (see `toQuotationOutput`). */
  status: QuotationStoredStatus;
  voidedAt: Date | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  /** Sale created by "Confirmar venta" (status VENDIDA). */
  convertedToSaleId: string | null;
  acceptedAt: Date | null;
  rejectedAt: Date | null;
  rejectReason: string | null;
  soldAt: Date | null;
  soldByUsername: string | null;
  items: QuotationDetail[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * A Cotización is explicitly NOT a sale — saving it never touches inventory;
 * only "Confirmar venta" (`convert_quotation_to_sale`) creates a real sale
 * through Ventas. Original notes: a Cotización is explicitly NOT a sale — created in one shot (like a
 * Ticket/Purchase), never touches `products.stock`/`inventory_stock`/
 * `inventory_movements` (see `create_quotation()`), never appears in Sales
 * reports/dashboard. Every line item is historicized at creation time, so a
 * later product price change never alters an already-saved quotation.
 * Correction is anular-and-recreate, never a silent edit.
 */
export class Quotation {
  private constructor(private readonly props: QuotationProps) {}

  static create(props: QuotationProps): Quotation {
    return new Quotation(props);
  }

  get id(): string {
    return this.props.id;
  }

  get quotationNumber(): string {
    return this.props.quotationNumber;
  }

  get clientId(): string | null {
    return this.props.clientId;
  }

  get clientName(): string {
    return this.props.clientName;
  }

  get customerPhone(): string | null {
    return this.props.customerPhone;
  }

  get studentName(): string | null {
    return this.props.studentName;
  }

  get grade(): string | null {
    return this.props.grade;
  }

  get acceptedAt(): Date | null {
    return this.props.acceptedAt;
  }

  get rejectedAt(): Date | null {
    return this.props.rejectedAt;
  }

  get rejectReason(): string | null {
    return this.props.rejectReason;
  }

  get soldAt(): Date | null {
    return this.props.soldAt;
  }

  get soldByUsername(): string | null {
    return this.props.soldByUsername;
  }

  get userId(): string {
    return this.props.userId;
  }

  get username(): string {
    return this.props.username;
  }

  get quotationDate(): Date {
    return this.props.quotationDate;
  }

  get expirationDate(): string {
    return this.props.expirationDate;
  }

  get subtotal(): number {
    return this.props.subtotal;
  }

  get discount(): number {
    return this.props.discount;
  }

  get total(): number {
    return this.props.total;
  }

  get observations(): string | null {
    return this.props.observations;
  }

  get commercialTerms(): string | null {
    return this.props.commercialTerms;
  }

  get status(): QuotationStoredStatus {
    return this.props.status;
  }

  get voidedAt(): Date | null {
    return this.props.voidedAt;
  }

  get voidedBy(): string | null {
    return this.props.voidedBy;
  }

  get voidedByUsername(): string | null {
    return this.props.voidedByUsername;
  }

  get voidReason(): string | null {
    return this.props.voidReason;
  }

  get convertedToSaleId(): string | null {
    return this.props.convertedToSaleId;
  }

  get items(): QuotationDetail[] {
    return this.props.items;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
