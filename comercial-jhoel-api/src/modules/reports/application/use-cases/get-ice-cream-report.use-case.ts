import { Injectable } from '@nestjs/common';
import { GetIceCreamSalesReportUseCase } from './get-ice-cream-sales-report.use-case';
import { GetIceCreamPurchasesReportUseCase } from './get-ice-cream-purchases-report.use-case';
import { NoIceCreamMovementTypeSelectedError } from '../../domain/errors/no-ice-cream-movement-type-selected.error';
import {
  IceCreamReportRowOutput,
  IceCreamReportType,
} from '../dtos/ice-cream-report-output';

export interface GetIceCreamReportInput {
  types?: IceCreamReportType[];
  startDate?: string;
  endDate?: string;
  iceCreamId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface GetIceCreamReportOutput {
  items: IceCreamReportRowOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
/** Matches GetIceCreamSalesReportUseCase's/GetIceCreamPurchasesReportUseCase's own MAX_LIMIT. */
const PER_TYPE_FETCH_CAP = 200;

/**
 * Orchestrates `GetIceCreamSalesReportUseCase`/`GetIceCreamPurchasesReportUseCase`
 * — the exact same use cases the two now-removed standalone reports already
 * used — rather than querying either repository directly. Same
 * single-type-delegates / both-types-merge-in-memory reasoning as
 * `GetAssetsReceivablesReportUseCase` (see its own doc comment).
 */
@Injectable()
export class GetIceCreamReportUseCase {
  constructor(
    private readonly getIceCreamSalesReportUseCase: GetIceCreamSalesReportUseCase,
    private readonly getIceCreamPurchasesReportUseCase: GetIceCreamPurchasesReportUseCase,
  ) {}

  async execute(
    input: GetIceCreamReportInput,
  ): Promise<GetIceCreamReportOutput> {
    const types = input.types ?? [];
    if (types.length === 0) {
      throw new NoIceCreamMovementTypeSelectedError();
    }

    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, PER_TYPE_FETCH_CAP)
        : DEFAULT_LIMIT;

    const wantsSales = types.includes('sales');
    const wantsPurchases = types.includes('purchases');

    if (wantsSales && !wantsPurchases) {
      const result = await this.getIceCreamSalesReportUseCase.execute({
        startDate: input.startDate,
        endDate: input.endDate,
        iceCreamId: input.iceCreamId,
        userId: input.userId,
        page,
        limit,
      });
      return {
        items: result.items.map((item) => this.toSaleRow(item)),
        total: result.total,
        page: result.page,
        limit: result.limit,
      };
    }

    if (wantsPurchases && !wantsSales) {
      const result = await this.getIceCreamPurchasesReportUseCase.execute({
        startDate: input.startDate,
        endDate: input.endDate,
        iceCreamId: input.iceCreamId,
        userId: input.userId,
        page,
        limit,
      });
      return {
        items: result.items.map((item) => this.toPurchaseRow(item)),
        total: result.total,
        page: result.page,
        limit: result.limit,
      };
    }

    const [salesResult, purchasesResult] = await Promise.all([
      this.getIceCreamSalesReportUseCase.execute({
        startDate: input.startDate,
        endDate: input.endDate,
        iceCreamId: input.iceCreamId,
        userId: input.userId,
        page: 1,
        limit: PER_TYPE_FETCH_CAP,
      }),
      this.getIceCreamPurchasesReportUseCase.execute({
        startDate: input.startDate,
        endDate: input.endDate,
        iceCreamId: input.iceCreamId,
        userId: input.userId,
        page: 1,
        limit: PER_TYPE_FETCH_CAP,
      }),
    ]);

    const merged = [
      ...salesResult.items.map((item) => this.toSaleRow(item)),
      ...purchasesResult.items.map((item) => this.toPurchaseRow(item)),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    const total = salesResult.total + purchasesResult.total;
    const start = (page - 1) * limit;
    const items = merged.slice(start, start + limit);

    return { items, total, page, limit };
  }

  private toSaleRow(item: {
    id: string;
    date: Date;
    product: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
    userId: string;
    username: string;
  }): IceCreamReportRowOutput {
    return { ...item, type: 'sales' };
  }

  private toPurchaseRow(item: {
    id: string;
    date: Date;
    product: string;
    sku: string;
    quantity: number;
    costPrice: number;
    total: number;
    userId: string;
    username: string;
  }): IceCreamReportRowOutput {
    return {
      id: item.id,
      type: 'purchases',
      date: item.date,
      product: item.product,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.costPrice,
      total: item.total,
      userId: item.userId,
      username: item.username,
    };
  }
}
