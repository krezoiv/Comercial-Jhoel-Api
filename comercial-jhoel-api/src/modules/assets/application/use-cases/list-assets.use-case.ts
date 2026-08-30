import { Inject, Injectable } from '@nestjs/common';
import {
  ASSET_REPOSITORY,
  AssetSortField,
  SortDirection,
} from '../../domain/repositories/asset.repository';
import type { AssetRepository } from '../../domain/repositories/asset.repository';
import { AssetOutput, toAssetOutput } from '../dtos/asset-output';

export interface ListAssetsInput {
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  sortBy?: AssetSortField;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
  /** undefined = both active and inactive ("Todos"); true/false = filtered to exactly one state. */
  isActive?: boolean;
}

export interface ListAssetsOutput {
  items: AssetOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

@Injectable()
export class ListAssetsUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,
  ) {}

  async execute(input: ListAssetsInput = {}): Promise<ListAssetsOutput> {
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const result = await this.assetRepository.findAll({
      isActive: input.isActive,
      clientId: input.clientId,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      minAmount: input.minAmount,
      maxAmount: input.maxAmount,
      search: input.search?.trim() || undefined,
      sortBy: input.sortBy ?? 'date',
      sortDirection: input.sortDirection ?? 'desc',
      page,
      limit,
    });

    return {
      items: result.items.map(toAssetOutput),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
