import { QuotationDetail } from './quotation-detail.entity';

export type QuotationStoredStatus = 'PENDIENTE' | 'ACEPTADA' | 'ANULADA';

export interface QuotationProps {
  id: string;
  quotationNumber: string;
  clientId: string;
  clientName: string;
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
  /** Always `null` today — the forward-compat hook for a future, explicit "Cotización -> Venta" conversion, not implemented by this module. */
  convertedToSaleId: string | null;
  items: QuotationDetail[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * A Cotización is explicitly NOT a sale — created in one shot (like a
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

  get clientId(): string {
    return this.props.clientId;
  }

  get clientName(): string {
    return this.props.clientName;
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
