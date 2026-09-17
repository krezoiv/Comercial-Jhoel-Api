import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import type { CatalogRequestStatus } from '../../domain/entities/catalog-request.entity';

const CATALOG_REQUEST_STATUSES: CatalogRequestStatus[] = [
  'NUEVA',
  'CONTACTADA',
  'EN_PROCESO',
  'ATENDIDA',
  'CANCELADA',
];

export class UpdateCatalogRequestStatusRequestDto {
  @IsIn(CATALOG_REQUEST_STATUSES)
  status: CatalogRequestStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observation?: string | null;
}
