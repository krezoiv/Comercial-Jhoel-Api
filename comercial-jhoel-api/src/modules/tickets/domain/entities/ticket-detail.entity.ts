export interface TicketDetailProps {
  id: string;
  productId: string;
  productName: string;
  presentationName: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
  observation: string | null;
}

/** A frozen line item — `productName`/`unitPrice`/`total` are snapshotted at the moment the ticket was created, never recomputed from the live product. */
export class TicketDetail {
  private constructor(private readonly props: TicketDetailProps) {}

  static create(props: TicketDetailProps): TicketDetail {
    return new TicketDetail(props);
  }

  get id(): string {
    return this.props.id;
  }

  get productId(): string {
    return this.props.productId;
  }

  get productName(): string {
    return this.props.productName;
  }

  get presentationName(): string | null {
    return this.props.presentationName;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get unitPrice(): number {
    return this.props.unitPrice;
  }

  get total(): number {
    return this.props.total;
  }

  get observation(): string | null {
    return this.props.observation;
  }
}
