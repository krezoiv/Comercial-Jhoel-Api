export interface ProductProps {
  id: string;
  name: string;
  sku: string | null;
  categoryId: string;
  categoryName: string;
  businessId: string;
  businessName: string;
  unitOfMeasureId: string;
  unitOfMeasureName: string;
  unitOfMeasureAbbreviation: string;
  costPrice: number;
  publicPrice: number;
  wholesalePrice: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  private constructor(private readonly props: ProductProps) {}

  static create(props: ProductProps): Product {
    return new Product(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get sku(): string | null {
    return this.props.sku;
  }

  get categoryId(): string {
    return this.props.categoryId;
  }

  get categoryName(): string {
    return this.props.categoryName;
  }

  get businessId(): string {
    return this.props.businessId;
  }

  get businessName(): string {
    return this.props.businessName;
  }

  get unitOfMeasureId(): string {
    return this.props.unitOfMeasureId;
  }

  get unitOfMeasureName(): string {
    return this.props.unitOfMeasureName;
  }

  get unitOfMeasureAbbreviation(): string {
    return this.props.unitOfMeasureAbbreviation;
  }

  get costPrice(): number {
    return this.props.costPrice;
  }

  get publicPrice(): number {
    return this.props.publicPrice;
  }

  get wholesalePrice(): number {
    return this.props.wholesalePrice;
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
}
