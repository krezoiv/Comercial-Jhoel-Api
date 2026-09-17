import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import type { CatalogProductSection } from '../../domain/entities/catalog-product.entity';

const CATALOG_PRODUCT_SECTIONS: CatalogProductSection[] = ['LIBRERIA', 'VARIEDADES_ACCESORIOS'];

export class ListCatalogProductsQueryDto {
  @IsIn(CATALOG_PRODUCT_SECTIONS)
  section: CatalogProductSection;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeInactive?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  search?: string;
}
