import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Asset } from '../../domain/entities/asset.entity';
import {
  AssetRepository,
  AssetSortField,
  AssetStatement,
  AssetsReportSummary,
  CreateAssetData,
  FindAssetsOptions,
  FindAssetsReportSummaryOptions,
  GetAssetStatementOptions,
  PaginatedResult,
  RegisterAssetMovementData,
  StatementMovement,
  UpdateAssetData,
} from '../../domain/repositories/asset.repository';
import {
  InvalidMovementAmountError,
  InvalidMovementTypeError,
} from '../../domain/errors/invalid-movement.error';
import { AssetOrmEntity } from './asset.orm-entity';
import { AssetMapper } from './asset.mapper';

const SORT_COLUMN: Record<AssetSortField, string> = {
  date: 'record.date',
  amount: 'record.amount',
  createdAt: 'record.createdAt',
};

@Injectable()
export class TypeOrmAssetRepository implements AssetRepository {
  constructor(
    @InjectRepository(AssetOrmEntity)
    private readonly repository: Repository<AssetOrmEntity>,
  ) {}

  async findAll(options: FindAssetsOptions): Promise<PaginatedResult<Asset>> {
    const qb = this.repository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.client', 'client')
      .leftJoinAndSelect('record.createdByUser', 'createdByUser')
      .leftJoinAndSelect('record.updatedByUser', 'updatedByUser');

    if (options.isActive !== undefined) {
      qb.andWhere('record.isActive = :isActive', {
        isActive: options.isActive,
      });
    }
    if (options.clientId) {
      qb.andWhere('record.clientId = :clientId', {
        clientId: options.clientId,
      });
    }
    if (options.dateFrom) {
      qb.andWhere('record.date >= :dateFrom', { dateFrom: options.dateFrom });
    }
    if (options.dateTo) {
      qb.andWhere('record.date <= :dateTo', { dateTo: options.dateTo });
    }
    if (options.minAmount !== undefined) {
      qb.andWhere('record.amount >= :minAmount', {
        minAmount: options.minAmount,
      });
    }
    if (options.maxAmount !== undefined) {
      qb.andWhere('record.amount <= :maxAmount', {
        maxAmount: options.maxAmount,
      });
    }
    if (options.search) {
      qb.andWhere(
        '(record.description ILIKE :search OR client.name ILIKE :search)',
        {
          search: `%${options.search}%`,
        },
      );
    }

    qb.orderBy(
      SORT_COLUMN[options.sortBy],
      options.sortDirection === 'asc' ? 'ASC' : 'DESC',
    );
    qb.skip((options.page - 1) * options.limit).take(options.limit);

    const [orms, total] = await qb.getManyAndCount();
    return {
      items: orms.map((orm) => AssetMapper.toDomain(orm)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  /** A real SQL aggregate — never an in-memory sum over one fetched page, which would silently undercount whatever didn't fit the page (see Reports' own `getSummary()` lesson for Sales/Purchases). */
  async getReportSummary(
    options: FindAssetsReportSummaryOptions,
  ): Promise<AssetsReportSummary> {
    const qb = this.repository
      .createQueryBuilder('record')
      .leftJoin('record.client', 'client');

    if (options.isActive !== undefined) {
      qb.andWhere('record.isActive = :isActive', {
        isActive: options.isActive,
      });
    }
    if (options.clientId) {
      qb.andWhere('record.clientId = :clientId', {
        clientId: options.clientId,
      });
    }
    if (options.dateFrom) {
      qb.andWhere('record.date >= :dateFrom', { dateFrom: options.dateFrom });
    }
    if (options.dateTo) {
      qb.andWhere('record.date <= :dateTo', { dateTo: options.dateTo });
    }
    if (options.search) {
      qb.andWhere(
        '(record.description ILIKE :search OR client.name ILIKE :search)',
        {
          search: `%${options.search}%`,
        },
      );
    }

    // Signed sum, not a bare `SUM(amount)` — `amount` is always a positive
    // magnitude now (see migration `CreateFinancialKardexColumns`), the
    // sign comes from `movement_type`. This is the one caller-facing change
    // that migration required: `GetCuadreAgentesSummaryUseCase` reads
    // `.totalAmount` from here for its daily formula and must keep getting
    // the true signed balance, not an inflated always-positive sum.
    const raw = await qb
      .select('COUNT(*)', 'recordCount')
      .addSelect(
        `COALESCE(SUM(CASE WHEN record.movementType = 'ABONO' THEN -record.amount ELSE record.amount END), 0)`,
        'totalAmount',
      )
      .getRawOne<{ recordCount: string; totalAmount: string }>();

    return {
      recordCount: Number(raw?.recordCount ?? 0),
      totalAmount: Number(raw?.totalAmount ?? 0),
    };
  }

  async findById(id: string): Promise<Asset | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? AssetMapper.toDomain(orm) : null;
  }

  async create(data: CreateAssetData): Promise<Asset> {
    const orm = this.repository.create(data);
    let saved: AssetOrmEntity;
    try {
      saved = await this.repository.save(orm);
    } catch (error) {
      throw this.translateAmountCheckError(error);
    }
    const withRelations = await this.repository.findOneOrFail({
      where: { id: saved.id },
    });
    return AssetMapper.toDomain(withRelations);
  }

  async update(id: string, data: UpdateAssetData): Promise<Asset> {
    try {
      await this.repository.update({ id }, data);
    } catch (error) {
      throw this.translateAmountCheckError(error);
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return AssetMapper.toDomain(updated);
  }

  /**
   * `create()`/`update()` are this table's original, still-untouched admin
   * CRUD (see the migration's own doc comment for why they were
   * deliberately left alone) — but a plain negative `amount` through them
   * now violates `CHK_assets_amount_positive` (re-added by
   * `CreateFinancialKardexColumns`, since `amount` is a positive magnitude
   * again with the sign living in `movementType`). This translates that
   * constraint violation into a clear message pointing at the real
   * replacement — "Registrar Abono" — rather than letting a raw
   * `QueryFailedError` reach the client.
   */
  private translateAmountCheckError(error: unknown): unknown {
    if (
      error instanceof QueryFailedError &&
      (error.driverError as { constraint?: string } | undefined)
        ?.constraint === 'CHK_assets_amount_positive'
    ) {
      return new InvalidMovementAmountError();
    }
    return error;
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }

  /** Invokes `register_asset_movement` — see that function's own doc comment (migration `CreateFinancialKardexColumns`) for why Activos allows a negative balance and why this is the atomic, concurrency-safe replacement for the old plain `create()` INSERT. */
  async registerMovement(data: RegisterAssetMovementData): Promise<Asset> {
    let movementId: string;
    try {
      const rows = await this.repository.manager.query<
        { register_asset_movement: string }[]
      >('SELECT register_asset_movement($1, $2, $3, $4, $5, $6)', [
        data.clientId,
        data.movementType,
        data.amount,
        data.date,
        data.description,
        data.createdBy,
      ]);
      movementId = rows[0].register_asset_movement;
    } catch (error) {
      throw this.translateMovementError(error);
    }

    const asset = await this.findById(movementId);
    if (!asset) {
      throw new InternalServerErrorException(
        'No se pudo recuperar el movimiento recién registrado.',
      );
    }
    return asset;
  }

  /** A single bounded aggregate — never a full-history fetch summed in TypeScript. */
  async getCurrentBalance(clientId: string): Promise<number> {
    const [row] = await this.repository.manager.query<{ balance: string }[]>(
      `SELECT COALESCE(SUM(CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END), 0) AS balance
       FROM assets
       WHERE client_id = $1 AND is_active = true`,
      [clientId],
    );
    return Number(row?.balance ?? 0);
  }

  /**
   * `openingBalance` is the signed sum of every active movement strictly
   * before `dateFrom` (0 when `dateFrom` is omitted — the WHERE clause then
   * matches no rows). `balanceAfter` per row is computed with a window
   * function over `sequence` seeded with that opening balance — never
   * stored, always derived fresh (see the migration's own doc comment for
   * why), and never summed client-side.
   */
  async getStatement(
    clientId: string,
    options: GetAssetStatementOptions,
  ): Promise<AssetStatement> {
    const dateFrom = options.dateFrom ?? null;
    const dateTo = options.dateTo ?? null;

    const [header] = await this.repository.manager.query<
      { clientName: string | null; openingBalance: string }[]
    >(
      `SELECT
         (SELECT name FROM clients WHERE id = $1) AS "clientName",
         COALESCE((
           SELECT SUM(CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END)
           FROM assets
           WHERE client_id = $1 AND is_active = true
             AND $2::date IS NOT NULL AND date < $2::date
         ), 0) AS "openingBalance"`,
      [clientId, dateFrom],
    );

    const openingBalance = Number(header?.openingBalance ?? 0);

    const rows = await this.repository.manager.query<
      {
        id: string;
        date: string;
        movementType: 'CARGO' | 'ABONO';
        description: string | null;
        amount: string;
        createdAt: Date;
        createdByUsername: string;
        balanceAfter: string;
      }[]
    >(
      `WITH movements AS (
         SELECT
           a.id, a.date, a.movement_type AS "movementType", a.description,
           a.amount, a.sequence, a.created_at AS "createdAt",
           u.username AS "createdByUsername"
         FROM assets a
         JOIN users u ON u.id = a.created_by
         WHERE a.client_id = $1 AND a.is_active = true
           AND ($2::date IS NULL OR a.date >= $2::date)
           AND ($3::date IS NULL OR a.date <= $3::date)
       )
       SELECT
         m.id, m.date, m."movementType", m.description, m.amount,
         m."createdAt", m."createdByUsername",
         $4::numeric + SUM(CASE WHEN m."movementType" = 'ABONO' THEN -m.amount ELSE m.amount END)
           OVER (ORDER BY m.sequence) AS "balanceAfter"
       FROM movements m
       ORDER BY m.sequence`,
      [clientId, dateFrom, dateTo, openingBalance],
    );

    const movements: StatementMovement[] = rows.map((row) => ({
      id: row.id,
      date: row.date,
      movementType: row.movementType,
      description: row.description,
      amount: Number(row.amount),
      balanceAfter: Number(row.balanceAfter),
      createdByUsername: row.createdByUsername,
      createdAt: row.createdAt,
    }));

    const totalCargos = movements
      .filter((m) => m.movementType === 'CARGO')
      .reduce((sum, m) => sum + m.amount, 0);
    const totalAbonos = movements
      .filter((m) => m.movementType === 'ABONO')
      .reduce((sum, m) => sum + m.amount, 0);
    const closingBalance =
      movements.length > 0
        ? movements[movements.length - 1].balanceAfter
        : openingBalance;

    return {
      clientId,
      clientName: header?.clientName ?? '',
      openingBalance,
      movements,
      totalCargos,
      totalAbonos,
      closingBalance,
    };
  }

  /** `register_asset_movement` signals a business-rule failure via `RAISE EXCEPTION '<CODE>:<clientId>'` — same `'CODE:id'` convention as `translateSaleError`/`translatePurchaseError` elsewhere in this codebase. */
  private translateMovementError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;
    const [code] = message.split(':');

    switch (code) {
      case 'INVALID_MOVEMENT_TYPE':
        return new InvalidMovementTypeError();
      case 'INVALID_AMOUNT':
        return new InvalidMovementAmountError();
      default:
        return error;
    }
  }
}
