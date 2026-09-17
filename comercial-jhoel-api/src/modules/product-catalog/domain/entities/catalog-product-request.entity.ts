export type CatalogProductRequestStatus =
  | 'NUEVA'
  | 'CONTACTADA'
  | 'EN_PROCESO'
  | 'ATENDIDA'
  | 'CANCELADA';

export interface CatalogProductRequestProps {
  id: string;
  catalogProductId: string;
  /** Snapshot congelado al momento de la solicitud — nunca releído de la publicación después. */
  productName: string;
  price: number;
  customerName: string;
  customerPhone: string;
  status: CatalogProductRequestStatus;
  observation: string | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/**
 * Lead de "Lo quiero" para Variedades y Accesorios — deliberadamente SIN
 * nada de Krediya (sin `creditAvailable`, sin distinción compra/crédito):
 * Krediya es exclusiva de Teléfonos, nunca se copia esa lógica aquí. Nunca
 * se crea para una publicación de sección `LIBRERIA` (validado en
 * `CreateCatalogProductRequestUseCase`) — Librería es puramente
 * informativa.
 */
export class CatalogProductRequest {
  private constructor(private readonly props: CatalogProductRequestProps) {}

  static create(props: CatalogProductRequestProps): CatalogProductRequest {
    return new CatalogProductRequest(props);
  }

  get id(): string {
    return this.props.id;
  }

  get catalogProductId(): string {
    return this.props.catalogProductId;
  }

  get productName(): string {
    return this.props.productName;
  }

  get price(): number {
    return this.props.price;
  }

  get customerName(): string {
    return this.props.customerName;
  }

  get customerPhone(): string {
    return this.props.customerPhone;
  }

  get status(): CatalogProductRequestStatus {
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
