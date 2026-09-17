import { IsDateString, IsIn, IsOptional } from 'class-validator';
import type {
  CatalogRequestStatus,
  CatalogRequestType,
} from '../../domain/entities/catalog-request.entity';

const CATALOG_REQUEST_STATUSES: CatalogRequestStatus[] = [
  'NUEVA',
  'CONTACTADA',
  'EN_PROCESO',
  'ATENDIDA',
  'CANCELADA',
];
const CATALOG_REQUEST_TYPES: CatalogRequestType[] = [
  'INTERES_COMPRA',
  'INTERES_CREDITO',
];

export class ListCatalogRequestsQueryDto {
  @IsOptional()
  @IsIn(CATALOG_REQUEST_STATUSES)
  status?: CatalogRequestStatus;

  @IsOptional()
  @IsIn(CATALOG_REQUEST_TYPES)
  requestType?: CatalogRequestType;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
