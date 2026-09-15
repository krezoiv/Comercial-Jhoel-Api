export interface CompanySettingsProps {
  id: string;
  businessName: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  taxId: string | null;
  logoBase64: string | null;
  socialMedia: string | null;
  /** Separado de `phone` a propósito — un negocio puede llamar a un número y atender WhatsApp en otro. */
  whatsapp: string | null;
  website: string | null;
  /** Texto libre multilínea, tal como el admin lo escribe — no un modelo estructurado día-por-día. */
  businessHours: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  updatedAt: Date;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/** A genuine singleton — exactly one row always exists (seeded empty by migration `1760001000000-CreateDocumentsModule`). Holds the branding/contact data (business name, address, phone, email, NIT, logo, social media) every document PDF's letterhead needs (Venta, Compra, Ticket, Cotización) — never hardcoded per document type. */
export class CompanySettings {
  private constructor(private readonly props: CompanySettingsProps) {}

  static create(props: CompanySettingsProps): CompanySettings {
    return new CompanySettings(props);
  }

  get id(): string {
    return this.props.id;
  }

  get businessName(): string {
    return this.props.businessName;
  }

  get address(): string | null {
    return this.props.address;
  }

  get phone(): string | null {
    return this.props.phone;
  }

  get email(): string | null {
    return this.props.email;
  }

  get taxId(): string | null {
    return this.props.taxId;
  }

  get logoBase64(): string | null {
    return this.props.logoBase64;
  }

  get socialMedia(): string | null {
    return this.props.socialMedia;
  }

  get whatsapp(): string | null {
    return this.props.whatsapp;
  }

  get website(): string | null {
    return this.props.website;
  }

  get businessHours(): string | null {
    return this.props.businessHours;
  }

  get facebookUrl(): string | null {
    return this.props.facebookUrl;
  }

  get instagramUrl(): string | null {
    return this.props.instagramUrl;
  }

  get tiktokUrl(): string | null {
    return this.props.tiktokUrl;
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
