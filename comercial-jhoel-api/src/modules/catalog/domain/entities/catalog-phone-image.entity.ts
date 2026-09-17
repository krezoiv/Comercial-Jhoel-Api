export interface CatalogPhoneImageProps {
  id: string;
  catalogPhoneId: string;
  mimeType: string;
  sizeBytes: number;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
}

/**
 * Metadata only — the raw bytes (`imageData`) are never loaded onto this
 * entity, only read directly off the ORM row inside
 * `GetCatalogPhoneImageUseCase`/`TypeOrmCatalogPhoneRepository.getImage()`.
 * Keeps every listing query (admin table, public catalog) cheap regardless
 * of how many/how large the underlying photos are.
 */
export class CatalogPhoneImage {
  private constructor(private readonly props: CatalogPhoneImageProps) {}

  static create(props: CatalogPhoneImageProps): CatalogPhoneImage {
    return new CatalogPhoneImage(props);
  }

  get id(): string {
    return this.props.id;
  }

  get catalogPhoneId(): string {
    return this.props.catalogPhoneId;
  }

  get mimeType(): string {
    return this.props.mimeType;
  }

  get sizeBytes(): number {
    return this.props.sizeBytes;
  }

  get isPrimary(): boolean {
    return this.props.isPrimary;
  }

  get sortOrder(): number {
    return this.props.sortOrder;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
