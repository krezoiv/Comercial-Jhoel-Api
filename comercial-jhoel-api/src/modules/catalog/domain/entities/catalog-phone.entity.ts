import { CatalogPhoneImage } from './catalog-phone-image.entity';

/** One admin-configurable "otra especificación" row — the panel's own free-form spec fields beyond the fixed set below. */
export interface CatalogPhoneExtraSpec {
  label: string;
  value: string;
}

export interface CatalogPhoneProps {
  id: string;
  brand: string;
  model: string;
  description: string | null;
  price: number;
  screen: string | null;
  ram: string | null;
  storage: string | null;
  camera: string | null;
  battery: string | null;
  processor: string | null;
  operatingSystem: string | null;
  extraSpecs: CatalogPhoneExtraSpec[];
  isActive: boolean;
  isPublished: boolean;
  sortOrder: number;
  likesCount: number;
  images: CatalogPhoneImage[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/**
 * A publishable commercial listing for the public catalog — one row per
 * MODEL (marca/modelo/specs/precio/fotos), never per physical unit with an
 * IMEI (that's `modules/phones/`'s `Phone`, a completely separate domain
 * this module never touches). `isPublished` gates public visibility;
 * `isActive` is the usual soft-delete flag. A phone starts unpublished on
 * creation and can only be published once it has at least one image (see
 * `PublishCatalogPhoneUseCase`) — a vitrina without a photo is never shown.
 */
export class CatalogPhone {
  private constructor(private readonly props: CatalogPhoneProps) {}

  static create(props: CatalogPhoneProps): CatalogPhone {
    return new CatalogPhone(props);
  }

  get id(): string {
    return this.props.id;
  }

  get brand(): string {
    return this.props.brand;
  }

  get model(): string {
    return this.props.model;
  }

  get description(): string | null {
    return this.props.description;
  }

  get price(): number {
    return this.props.price;
  }

  get screen(): string | null {
    return this.props.screen;
  }

  get ram(): string | null {
    return this.props.ram;
  }

  get storage(): string | null {
    return this.props.storage;
  }

  get camera(): string | null {
    return this.props.camera;
  }

  get battery(): string | null {
    return this.props.battery;
  }

  get processor(): string | null {
    return this.props.processor;
  }

  get operatingSystem(): string | null {
    return this.props.operatingSystem;
  }

  get extraSpecs(): CatalogPhoneExtraSpec[] {
    return this.props.extraSpecs;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get isPublished(): boolean {
    return this.props.isPublished;
  }

  get sortOrder(): number {
    return this.props.sortOrder;
  }

  get likesCount(): number {
    return this.props.likesCount;
  }

  get images(): CatalogPhoneImage[] {
    return this.props.images;
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
