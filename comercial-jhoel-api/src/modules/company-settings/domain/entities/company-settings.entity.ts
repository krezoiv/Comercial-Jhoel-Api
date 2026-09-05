export interface CompanySettingsProps {
  id: string;
  businessName: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  taxId: string | null;
  logoBase64: string | null;
  socialMedia: string | null;
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
