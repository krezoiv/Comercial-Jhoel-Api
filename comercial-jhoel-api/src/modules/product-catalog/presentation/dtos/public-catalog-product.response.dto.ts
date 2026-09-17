import type { CatalogProductSection } from '../../domain/entities/catalog-product.entity';

/** Backs Librería/Variedades en la landing — sin costo/stock/proveedor/estado administrativo. */
export class PublicCatalogProductResponseDto {
  id: string;
  section: CatalogProductSection;
  name: string;
  price: number;
  categoryName: string;
  description: string | null;
  hasImage: boolean;
  unitOfMeasureAbbreviation: string | null;
}
