/**
 * "Heladería" inventory — structurally a clone of `Product`
 * (sku/name unique-only-among-active via the identical partial-unique-index
 * pattern, same cost/public price columns, same soft delete), but backed by
 * its own entirely separate `ice_creams` table/module, not a row in
 * `products` scoped by a "Heladería" `businessId`. Worth knowing: the
 * `businesses` module exists specifically to let a line of business like
 * Heladería share the one `products` catalog (see that module's own docs,
 * which name Heladería as an example addable business), but this module was
 * built as a fully independent catalog/sales/purchases stack instead — its
 * own stock, its own `confirm_ice_cream_sale`/`confirm_ice_cream_purchase`
 * functions, its own screens. A helado is never visible from Inventario or
 * counted in a regular product report, and vice versa.
 */
export interface IceCreamProps {
  id: string;
  sku: string;
  product: string;
  costPrice: number;
  publicPrice: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export class IceCream {
  private constructor(private readonly props: IceCreamProps) {}

  static create(props: IceCreamProps): IceCream {
    return new IceCream(props);
  }

  get id(): string {
    return this.props.id;
  }

  get sku(): string {
    return this.props.sku;
  }

  get product(): string {
    return this.props.product;
  }

  get costPrice(): number {
    return this.props.costPrice;
  }

  get publicPrice(): number {
    return this.props.publicPrice;
  }

  get stock(): number {
    return this.props.stock;
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

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdByUsername(): string {
    return this.props.createdByUsername;
  }

  get updatedBy(): string | null {
    return this.props.updatedBy;
  }

  get updatedByUsername(): string | null {
    return this.props.updatedByUsername;
  }
}
