export type CatalogRequestType = 'INTERES_COMPRA' | 'INTERES_CREDITO';

export type CatalogRequestStatus =
  'NUEVA' | 'CONTACTADA' | 'EN_PROCESO' | 'ATENDIDA' | 'CANCELADA';

export interface CatalogRequestProps {
  id: string;
  catalogPhoneId: string | null;
  /** Snapshot frozen at creation time — never re-read from the phone later, same reasoning as `phone_sales.phone_model`/etc. */
  brand: string;
  model: string;
  price: number;
  /** Computed server-side at creation from the real price + `company_settings.krediyaMinAmount`, never from the client — see `CreateCatalogRequestUseCase`. */
  creditAvailable: boolean;
  requestType: CatalogRequestType;
  customerName: string;
  customerPhone: string;
  status: CatalogRequestStatus;
  observation: string | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/**
 * A lead captured from the public catalog — "Lo quiero" (INTERES_COMPRA) or
 * "Comprar a crédito con Krediya" (INTERES_CREDITO). Never a sale record:
 * creating one never touches inventory/sales anywhere in this codebase, it
 * only registers interest for an admin to follow up on manually (see
 * `catalog-requests` admin screen). No Krediya API integration exists in
 * this project — an `INTERES_CREDITO` row is exactly as "prepared for
 * future integration" as this gets: no rate/cuota/plazo/approval field
 * anywhere on this entity, on purpose.
 */
export class CatalogRequest {
  private constructor(private readonly props: CatalogRequestProps) {}

  static create(props: CatalogRequestProps): CatalogRequest {
    return new CatalogRequest(props);
  }

  get id(): string {
    return this.props.id;
  }

  get catalogPhoneId(): string | null {
    return this.props.catalogPhoneId;
  }

  get brand(): string {
    return this.props.brand;
  }

  get model(): string {
    return this.props.model;
  }

  get price(): number {
    return this.props.price;
  }

  get creditAvailable(): boolean {
    return this.props.creditAvailable;
  }

  get requestType(): CatalogRequestType {
    return this.props.requestType;
  }

  get customerName(): string {
    return this.props.customerName;
  }

  get customerPhone(): string {
    return this.props.customerPhone;
  }

  get status(): CatalogRequestStatus {
    return this.props.status;
  }

  get observation(): string | null {
    return this.props.observation;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get updatedBy(): string | null {
    return this.props.updatedBy;
  }

  get updatedByUsername(): string | null {
    return this.props.updatedByUsername;
  }
}
