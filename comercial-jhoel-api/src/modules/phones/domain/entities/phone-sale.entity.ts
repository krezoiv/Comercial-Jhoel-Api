import { PhoneOperator } from './phone.entity';

export interface PhoneSaleProps {
  id: string;
  phoneId: string;
  phoneOperator: PhoneOperator;
  phoneModel: string;
  /** The número asignado AT THIS SALE — frozen in `phone_sales.phone_number`, independent of `phones.phone_number`'s current (possibly since-cleared) value. */
  phoneNumber: string;
  phoneImei: string;
  phoneSimNumber: string;
  phoneCostPrice: number;
  clientId: string | null;
  clientName: string | null;
  clientDpi: string;
  salePrice: number;
  /** `yyyy-MM-dd` — a calendar day, not a timestamp. */
  saleDate: string;
  /** `true` when a DPI photo was uploaded — the raw bytes/id are never exposed here, only through `GET /phone-sales/:id/dpi-image`. */
  hasDpiImage: boolean;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: Date;
}

/**
 * One sale of one physical phone — mirrors
 * `RechargeSimSaleRegistration`'s shape (identity capture at the moment of
 * sale, void-only correction). The phone's own operator/modelo/IMEI/SIM/
 * costo are denormalized onto this entity (via the repository's own JOIN,
 * read from `phones` — they never change after purchase) since every
 * consumer of a sale — the historial table, the detail view, the ganancia
 * calculation — needs them alongside the sale itself. `phoneNumber` is the
 * one exception: it's read from `phone_sales`' own column (frozen at the
 * moment of sale), never from `phones` — voiding later clears the phone's
 * own number, but this sale's history must keep showing what it assigned.
 */
export class PhoneSale {
  private constructor(private readonly props: PhoneSaleProps) {}

  static create(props: PhoneSaleProps): PhoneSale {
    return new PhoneSale(props);
  }

  get id(): string {
    return this.props.id;
  }

  get phoneId(): string {
    return this.props.phoneId;
  }

  get phoneOperator(): PhoneOperator {
    return this.props.phoneOperator;
  }

  get phoneModel(): string {
    return this.props.phoneModel;
  }

  get phoneNumber(): string {
    return this.props.phoneNumber;
  }

  get phoneImei(): string {
    return this.props.phoneImei;
  }

  get phoneSimNumber(): string {
    return this.props.phoneSimNumber;
  }

  get phoneCostPrice(): number {
    return this.props.phoneCostPrice;
  }

  get clientId(): string | null {
    return this.props.clientId;
  }

  get clientName(): string | null {
    return this.props.clientName;
  }

  get clientDpi(): string {
    return this.props.clientDpi;
  }

  get salePrice(): number {
    return this.props.salePrice;
  }

  get saleDate(): string {
    return this.props.saleDate;
  }

  get hasDpiImage(): boolean {
    return this.props.hasDpiImage;
  }

  get isVoided(): boolean {
    return this.props.isVoided;
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

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdByUsername(): string {
    return this.props.createdByUsername;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
