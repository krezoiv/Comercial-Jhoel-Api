export interface QuotationDetailProps {
  id: string;
  productId: string;
  productName: string;
  presentationName: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  total: number;
}

/** A frozen line item — every field is snapshotted at the moment the quotation was created, never recomputed from the live product. This is what guarantees a later price change on the product never alters an already-saved quotation. */
export class QuotationDetail {
  private constructor(private readonly props: QuotationDetailProps) {}

  static create(props: QuotationDetailProps): QuotationDetail {
    return new QuotationDetail(props);
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

  get discount(): number {
    return this.props.discount;
  }

  get subtotal(): number {
    return this.props.subtotal;
  }

  get total(): number {
    return this.props.total;
  }
}
