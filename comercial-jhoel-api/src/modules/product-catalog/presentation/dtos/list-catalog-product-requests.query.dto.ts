import { IsDateString, IsIn, IsOptional } from 'class-validator';
import type { CatalogProductRequestStatus } from '../../domain/entities/catalog-product-request.entity';

const STATUSES: CatalogProductRequestStatus[] = [
  'NUEVA',
  'CONTACTADA',
  'EN_PROCESO',
  'ATENDIDA',
  'CANCELADA',
];

export class ListCatalogProductRequestsQueryDto {
  @IsOptional()
  @IsIn(STATUSES)
  status?: CatalogProductRequestStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
