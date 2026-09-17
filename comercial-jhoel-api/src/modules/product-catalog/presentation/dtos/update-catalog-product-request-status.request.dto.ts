import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import type { CatalogProductRequestStatus } from '../../domain/entities/catalog-product-request.entity';

const STATUSES: CatalogProductRequestStatus[] = [
  'NUEVA',
  'CONTACTADA',
  'EN_PROCESO',
  'ATENDIDA',
  'CANCELADA',
];

export class UpdateCatalogProductRequestStatusRequestDto {
  @IsIn(STATUSES)
  status: CatalogProductRequestStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observation?: string | null;
}
