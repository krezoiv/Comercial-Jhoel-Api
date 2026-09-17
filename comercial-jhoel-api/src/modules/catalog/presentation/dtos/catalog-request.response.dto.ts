import {
  CatalogRequestStatus,
  CatalogRequestType,
} from '../../domain/entities/catalog-request.entity';

export class CatalogRequestResponseDto {
  id: string;
  catalogPhoneId: string | null;
  brand: string;
  model: string;
  price: number;
  creditAvailable: boolean;
  requestType: CatalogRequestType;
  customerName: string;
  customerPhone: string;
  status: CatalogRequestStatus;
  observation: string | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
  updatedByUsername: string | null;
}
