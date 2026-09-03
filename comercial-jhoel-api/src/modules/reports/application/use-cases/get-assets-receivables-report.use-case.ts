import { Inject, Injectable } from '@nestjs/common';
import { ListAccountsReceivableUseCase } from '../../../accounts-receivable/application/use-cases/list-accounts-receivable.use-case';
import { ListAssetsUseCase } from '../../../assets/application/use-cases/list-assets.use-case';
import { InvalidDateRangeError } from '../../domain/errors/invalid-date-range.error';
import { NoReportTypeSelectedError } from '../../domain/errors/no-report-type-selected.error';
import {
  ReportStatusFilter,
  parseReportStatus,
} from '../utils/parse-report-status';
import {
  AssetsReceivablesReportRowOutput,
  AssetsReceivablesReportType,
} from '../dtos/assets-receivables-report-output';

export interface GetAssetsReceivablesReportInput {
  types?: AssetsReceivablesReportType[];
  clientId?: string;
  startDate?: string;
  endDate?: string;
  status?: ReportStatusFilter;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetAssetsReceivablesReportOutput {
  items: AssetsReceivablesReportRowOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
/** Matches ListAccountsReceivableUseCase's/ListAssetsUseCase's own MAX_LIMIT — the ceiling either type's underlying repository already enforces per query. */
const PER_TYPE_FETCH_CAP = 200;

/**
 * Orchestrates `ListAccountsReceivableUseCase`/`ListAssetsUseCase` — the
 * exact same use cases the operational Cuentas por Cobrar/Activos screens
 * and their own (now-removed) standalone reports already used — rather
 * than querying either repository directly, so there is exactly one place
 * that knows how to filter/paginate each table.
 *
 * When only one type is selected, this delegates straight through with
 * real DB-level pagination (byte-identical behavior to before this
 * ticket). When both are selected, true cross-table pagination would need
 * a UNION query neither repository exposes; instead each type is fetched
 * up to `PER_TYPE_FETCH_CAP` rows, tagged with `type`, merged, sorted by
 * date desc, and paginated in memory — correct for this system's actual
 * scale, and still bounded (never an unbounded fetch).
 */
@Injectable()
export class GetAssetsReceivablesReportUseCase {
  constructor(
    private readonly listAccountsReceivableUseCase: ListAccountsReceivableUseCase,
    private readonly listAssetsUseCase: ListAssetsUseCase,
  ) {}

  async execute(
    input: GetAssetsReceivablesReportInput,
  ): Promise<GetAssetsReceivablesReportOutput> {
    const types = input.types ?? [];
    if (types.length === 0) {
      throw new NoReportTypeSelectedError();
    }
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidDateRangeError();
    }

    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, PER_TYPE_FETCH_CAP)
        : DEFAULT_LIMIT;

    const isActive = parseReportStatus(input.status);
    const wantsAssets = types.includes('assets');
    const wantsReceivables = types.includes('accounts_receivable');

    // Single type selected: delegate straight through with real DB-level pagination — no behavior change from the standalone report this replaces.
    if (wantsAssets && !wantsReceivables) {
      const result = await this.listAssetsUseCase.execute({
        clientId: input.clientId,
        dateFrom: input.startDate,
        dateTo: input.endDate,
        isActive,
        search: input.search,
        page,
        limit,
      });
      return {
        items: result.items.map((item) => this.toRow(item, 'assets')),
        total: result.total,
        page: result.page,
        limit: result.limit,
      };
    }

    if (wantsReceivables && !wantsAssets) {
      const result = await this.listAccountsReceivableUseCase.execute({
        clientId: input.clientId,
        dateFrom: input.startDate,
        dateTo: input.endDate,
        isActive,
        search: input.search,
        page,
        limit,
      });
      return {
        items: result.items.map((item) =>
          this.toRow(item, 'accounts_receivable'),
        ),
        total: result.total,
        page: result.page,
        limit: result.limit,
      };
    }

    // Both types selected: fetch each fully (bounded), merge, sort, paginate in memory.
    const [assetsResult, receivablesResult] = await Promise.all([
      this.listAssetsUseCase.execute({
        clientId: input.clientId,
        dateFrom: input.startDate,
        dateTo: input.endDate,
        isActive,
        search: input.search,
        page: 1,
        limit: PER_TYPE_FETCH_CAP,
      }),
      this.listAccountsReceivableUseCase.execute({
        clientId: input.clientId,
        dateFrom: input.startDate,
        dateTo: input.endDate,
        isActive,
        search: input.search,
        page: 1,
        limit: PER_TYPE_FETCH_CAP,
      }),
    ]);

    const merged = [
      ...assetsResult.items.map((item) => this.toRow(item, 'assets')),
      ...receivablesResult.items.map((item) =>
        this.toRow(item, 'accounts_receivable'),
      ),
    ].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

    const total = assetsResult.total + receivablesResult.total;
    const start = (page - 1) * limit;
    const items = merged.slice(start, start + limit);

    return { items, total, page, limit };
  }

  private toRow(
    item: {
      id: string;
      clientId: string;
      clientName: string;
      date: string;
      amount: number;
      description: string | null;
      isActive: boolean;
    },
    type: AssetsReceivablesReportType,
  ): AssetsReceivablesReportRowOutput {
    return {
      id: item.id,
      type,
      clientId: item.clientId,
      clientName: item.clientName,
      date: item.date,
      amount: item.amount,
      description: item.description,
      isActive: item.isActive,
    };
  }
}
