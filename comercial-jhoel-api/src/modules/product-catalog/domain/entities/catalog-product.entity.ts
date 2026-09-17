export type CatalogProductSection = 'LIBRERIA' | 'VARIEDADES_ACCESORIOS';

export interface CatalogProductProps {
  id: string;
  productId: string;
  section: CatalogProductSection;
  catalogDescription: string | null;
  hasImage: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
  /**
   * Denormalizado desde el `Product` real (Inventario) vía la relación
   * `ManyToOne` de solo-lectura del ORM — NUNCA escrito por este módulo.
   * `INVENTARIO → PRODUCTO → PUBLICACIÓN EN CATÁLOGO`: el nombre/precio/
   * categoría/negocio siguen viviendo únicamente en `modules/products`;
   * esto es solo lo que la última lectura trajo, para no obligar a cada
   * caso de uso a hacer una segunda consulta.
   */
  productName: string;
  productPrice: number;
  productIsActive: boolean;
  categoryName: string;
  businessName: string;
  unitOfMeasureAbbreviation: string | null;
}

/**
 * Una "publicación de catálogo" — nunca un producto en sí. Referencia
 * `products.id` (ver `CatalogProductRepository`); Librería y Variedades y
 * Accesorios comparten esta misma entidad, distinguidas por `section` —
 * comparten ~95% de la forma (imagen, descripción, orden, activo), y lo
 * que no comparten (WhatsApp/solicitudes solo en Variedades) se aplica
 * como regla de negocio en la capa de aplicación, nunca aquí.
 */
export class CatalogProduct {
  private constructor(private readonly props: CatalogProductProps) {}

  static create(props: CatalogProductProps): CatalogProduct {
    return new CatalogProduct(props);
  }

  get id(): string {
    return this.props.id;
  }

  get productId(): string {
    return this.props.productId;
  }

  get section(): CatalogProductSection {
    return this.props.section;
  }

  get catalogDescription(): string | null {
    return this.props.catalogDescription;
  }

  get hasImage(): boolean {
    return this.props.hasImage;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get sortOrder(): number {
    return this.props.sortOrder;
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

  get productName(): string {
    return this.props.productName;
  }

  get productPrice(): number {
    return this.props.productPrice;
  }

  get productIsActive(): boolean {
    return this.props.productIsActive;
  }

  get categoryName(): string {
    return this.props.categoryName;
  }

  get businessName(): string {
    return this.props.businessName;
  }

  get unitOfMeasureAbbreviation(): string | null {
    return this.props.unitOfMeasureAbbreviation;
  }

  /** Visible públicamente solo si la publicación Y el producto subyacente siguen activos. */
  get isPubliclyVisible(): boolean {
    return this.props.isActive && this.props.productIsActive;
  }
}
