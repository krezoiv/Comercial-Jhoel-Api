import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import type { CatalogProductSection } from '../../domain/entities/catalog-product.entity';

const CATALOG_PRODUCT_SECTIONS: CatalogProductSection[] = ['LIBRERIA', 'VARIEDADES_ACCESORIOS'];

export class CreateCatalogProductRequestDto {
  @IsUUID()
  productId: string;

  @IsIn(CATALOG_PRODUCT_SECTIONS)
  section: CatalogProductSection;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  catalogDescription?: string | null;
}
