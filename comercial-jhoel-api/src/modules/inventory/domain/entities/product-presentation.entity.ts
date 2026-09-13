export interface ProductPresentationProps {
  id: string;
  productId: string;
  presentationTypeId: string;
  /** Resolved from the master `PresentationType` catalog via join — never stored here as free text (see `CreateFinancialKardexColumns`-adjacent migration `CreatePresentationTypesAndUnitsOfMeasure` for the full reasoning). */
  name: string;
  conversionFactor: number;
  costPrice: number;
  publicPrice: number;
  /** Unique among active presentations, global (never scoped per-product) — mirrors `products.sku`'s own uniqueness. `null` when this presentation has no barcode of its own yet. */
  barcode: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * A product's sellable/purchasable unit ("Unidad", "Caja", "Paquete", ...).
 * `conversionFactor` is how many base units this presentation represents —
 * configured per product, never assumed (a "Caja" of one product is not
 * necessarily 12 units of another). Every product always has exactly one
 * "Unidad" presentation with `conversionFactor = 1`, auto-created — the
 * default every existing Compras/Ventas call resolves to when no
 * presentation is specified.
 *
 * `presentationTypeId` points at the master catalog (`presentation_types`,
 * module `presentation-types`) — the *name* ("Caja") is administered there,
 * once, and reused by every product; this entity never lets a caller type a
 * name directly, only pick a catalog id.
 */
export class ProductPresentation {
  private constructor(private readonly props: ProductPresentationProps) {}

  static create(props: ProductPresentationProps): ProductPresentation {
    return new ProductPresentation(props);
  }

  get id(): string {
    return this.props.id;
  }

  get productId(): string {
    return this.props.productId;
  }

  get presentationTypeId(): string {
    return this.props.presentationTypeId;
  }

  get name(): string {
    return this.props.name;
  }

  get conversionFactor(): number {
    return this.props.conversionFactor;
  }

  get costPrice(): number {
    return this.props.costPrice;
  }

  get publicPrice(): number {
    return this.props.publicPrice;
  }

  get barcode(): string | null {
    return this.props.barcode;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
