import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { DayOpening } from '../../domain/entities/day-opening.entity';
import {
  ClosedDaysFilters,
  ClosedDayViewRow,
  DayOpeningRepository,
} from '../../domain/repositories/day-opening.repository';
import { DayNotFoundError } from '../../domain/errors/day-not-found.error';
import { DayNotClosedError } from '../../domain/errors/day-not-closed.error';
import { DayCancelledError, DayAlreadyCancelledError } from '../../domain/errors/day-cancelled.error';
import { LaterDayExistsError } from '../../domain/errors/later-day-exists.error';
import { ReopenReasonRequiredError, CancelReasonRequiredError } from '../../domain/errors/reason-required.error';
import { DayOpeningOrmEntity } from './day-opening.orm-entity';
import { DayOpeningMapper } from './day-opening.mapper';

@Injectable()
export class TypeOrmDayOpeningRepository implements DayOpeningRepository {
  constructor(
    @InjectRepository(DayOpeningOrmEntity)
    private readonly repository: Repository<DayOpeningOrmEntity>,
  ) {}

  async findByDate(date: string): Promise<DayOpening | null> {
    const orm = await this.repository.findOne({ where: { date } });
    return orm ? DayOpeningMapper.toDomain(orm) : null;
  }

  /**
   * Idempotente: si `date` ya tiene una fila, la devuelve tal cual (nunca
   * crea una segunda). El `try/catch` sobre la violación de
   * `UQ_day_openings_date` es la red de seguridad ante la carrera de un
   * doble clic — el mismo patrón que `TypeOrmBankRepository.create` ya
   * usa para su propia unicidad — no la vía principal.
   */
  async open(date: string, userId: string): Promise<DayOpening> {
    const existing = await this.findByDate(date);
    if (existing) {
      return existing;
    }

    try {
      const orm = this.repository.create({ date, openedBy: userId });
      const saved = await this.repository.save(orm);
      const withRelations = await this.repository.findOneOrFail({ where: { id: saved.id } });
      return DayOpeningMapper.toDomain(withRelations);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const raced = await this.findByDate(date);
        if (raced) {
          return raced;
        }
      }
      throw error;
    }
  }

  /**
   * Lista solo fechas que alguna vez tuvieron un cierre — nunca un día en
   * curso (`NOT_OPENED`/`OPENED`/`BANK_BALANCES_SAVED`), que no es asunto
   * de este módulo administrativo. El total del cuadre viene de una
   * subconsulta correlacionada al ÚLTIMO `agent_reconciliations` de esa
   * fecha (mismo patrón de subconsulta que `findBalancesView` ya usa para
   * "el saldo anterior más reciente") — puede haber más de una fila
   * histórica si el día fue reabierto y vuelto a cerrar más de una vez.
   */
  async findClosedDays(filters: ClosedDaysFilters): Promise<ClosedDayViewRow[]> {
    const qb = this.repository
      .createQueryBuilder('day')
      .leftJoin('day.openedByUser', 'openedByUser')
      .leftJoin('day.closedByUser', 'closedByUser')
      .leftJoin('day.reopenedByUser', 'reopenedByUser')
      .leftJoin('day.cancelledByUser', 'cancelledByUser')
      .where('(day.closedAt IS NOT NULL OR day.reopenedAt IS NOT NULL OR day.isCancelled = true)');

    if (filters.dateFrom) {
      qb.andWhere('day.date >= :dateFrom', { dateFrom: filters.dateFrom });
    }
    if (filters.dateTo) {
      qb.andWhere('day.date <= :dateTo', { dateTo: filters.dateTo });
    }
    if (filters.userId) {
      qb.andWhere(
        '(day.openedBy = :userId OR day.closedBy = :userId OR day.reopenedBy = :userId)',
        { userId: filters.userId },
      );
    }
    if (filters.status === 'CANCELLED') {
      qb.andWhere('day.isCancelled = true');
    } else if (filters.status === 'REOPENED') {
      qb.andWhere('day.isCancelled = false AND day.reopenedAt IS NOT NULL AND day.closedAt IS NULL');
    } else if (filters.status === 'CLOSED') {
      qb.andWhere('day.isCancelled = false AND day.closedAt IS NOT NULL');
    }

    qb.select('day.date', 'date')
      .addSelect('day.isCancelled', 'isCancelled')
      .addSelect('day.openedAt', 'openedAt')
      .addSelect('openedByUser.username', 'openedByUsername')
      .addSelect('day.closedAt', 'closedAt')
      .addSelect('closedByUser.username', 'closedByUsername')
      .addSelect('day.reopenedAt', 'reopenedAt')
      .addSelect('reopenedByUser.username', 'reopenedByUsername')
      .addSelect('day.reopenReason', 'reopenReason')
      .addSelect('day.cancelledAt', 'cancelledAt')
      .addSelect('cancelledByUser.username', 'cancelledByUsername')
      .addSelect('day.cancelReason', 'cancelReason')
      .addSelect(
        (subQb) =>
          subQb
            .select('r.total_banks', 'value')
            .from('agent_reconciliations', 'r')
            .where('r.date = day.date')
            .orderBy('r.created_at', 'DESC')
            .limit(1),
        'totalBanks',
      )
      .addSelect(
        (subQb) =>
          subQb
            .select('r.total_cash', 'value')
            .from('agent_reconciliations', 'r')
            .where('r.date = day.date')
            .orderBy('r.created_at', 'DESC')
            .limit(1),
        'totalCash',
      )
      .addSelect(
        (subQb) =>
          subQb
            .select('r.total_accounts_receivable', 'value')
            .from('agent_reconciliations', 'r')
            .where('r.date = day.date')
            .orderBy('r.created_at', 'DESC')
            .limit(1),
        'totalAccountsReceivable',
      )
      .addSelect(
        (subQb) =>
          subQb
            .select('r.total_assets', 'value')
            .from('agent_reconciliations', 'r')
            .where('r.date = day.date')
            .orderBy('r.created_at', 'DESC')
            .limit(1),
        'totalAssets',
      )
      .addSelect(
        (subQb) =>
          subQb
            .select('r.result', 'value')
            .from('agent_reconciliations', 'r')
            .where('r.date = day.date')
            .orderBy('r.created_at', 'DESC')
            .limit(1),
        'result',
      )
      .orderBy('day.date', 'DESC');

    if (filters.resultSign) {
      const comparator = filters.resultSign === 'positive' ? '>' : filters.resultSign === 'negative' ? '<' : '=';
      qb.andWhere(
        `(SELECT r.result FROM agent_reconciliations r WHERE r.date = day.date ORDER BY r.created_at DESC LIMIT 1) ${comparator} 0`,
      );
    }

    const rows = await qb.getRawMany<{
      date: string;
      isCancelled: boolean;
      openedAt: Date;
      openedByUsername: string | null;
      closedAt: Date | null;
      closedByUsername: string | null;
      reopenedAt: Date | null;
      reopenedByUsername: string | null;
      reopenReason: string | null;
      cancelledAt: Date | null;
      cancelledByUsername: string | null;
      cancelReason: string | null;
      totalBanks: string | null;
      totalCash: string | null;
      totalAccountsReceivable: string | null;
      totalAssets: string | null;
      result: string | null;
    }>();

    return rows.map((row) => ({
      // `getRawMany()` no pasa por la hidratación normal de TypeORM para
      // columnas `date` (esa conversión a string plano solo ocurre en
      // `find()`/`findOne()`) — el driver de pg devuelve un `Date` real
      // para esta consulta cruda, hay que formatearlo a mano al mismo
      // `yyyy-MM-dd` que el resto de la app ya usa.
      date: this.formatDateOnly(row.date),
      status: row.isCancelled ? 'CANCELLED' : row.closedAt ? 'CLOSED' : 'REOPENED',
      openedAt: row.openedAt,
      openedByUsername: row.openedByUsername ?? '',
      closedAt: row.closedAt,
      closedByUsername: row.closedByUsername,
      reopenedAt: row.reopenedAt,
      reopenedByUsername: row.reopenedByUsername,
      reopenReason: row.reopenReason,
      cancelledAt: row.cancelledAt,
      cancelledByUsername: row.cancelledByUsername,
      cancelReason: row.cancelReason,
      totalBanks: row.totalBanks !== null ? parseFloat(row.totalBanks) : null,
      totalCash: row.totalCash !== null ? parseFloat(row.totalCash) : null,
      totalAccountsReceivable: row.totalAccountsReceivable !== null ? parseFloat(row.totalAccountsReceivable) : null,
      totalAssets: row.totalAssets !== null ? parseFloat(row.totalAssets) : null,
      result: row.result !== null ? parseFloat(row.result) : null,
    }));
  }

  async reopen(date: string, userId: string, reason: string): Promise<DayOpening> {
    try {
      await this.repository.manager.query('SELECT reopen_agent_day($1, $2, $3)', [date, userId, reason]);
    } catch (error) {
      throw this.translateError(error, date);
    }
    const updated = await this.repository.findOneOrFail({ where: { date } });
    return DayOpeningMapper.toDomain(updated);
  }

  async cancel(date: string, userId: string, reason: string): Promise<DayOpening> {
    try {
      await this.repository.manager.query('SELECT cancel_agent_day($1, $2, $3)', [date, userId, reason]);
    } catch (error) {
      throw this.translateError(error, date);
    }
    const updated = await this.repository.findOneOrFail({ where: { date } });
    return DayOpeningMapper.toDomain(updated);
  }

  /** Getters UTC a propósito — el driver de pg construye este `Date` a medianoche UTC para una columna `date`; usar los getters locales podría correr la fecha un día según el huso horario del servidor. */
  private formatDateOnly(value: string | Date): string {
    if (typeof value === 'string') {
      return value;
    }
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, '0');
    const day = String(value.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private translateError(error: unknown, date: string): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }
    const message = (error.driverError as { message?: string } | undefined)?.message ?? error.message;
    const [code] = message.split(':');

    switch (code) {
      case 'REOPEN_REASON_REQUIRED':
        return new ReopenReasonRequiredError();
      case 'CANCEL_REASON_REQUIRED':
        return new CancelReasonRequiredError();
      case 'DAY_NOT_FOUND':
        return new DayNotFoundError(date);
      case 'DAY_CANCELLED':
        return new DayCancelledError(date);
      case 'DAY_ALREADY_CANCELLED':
        return new DayAlreadyCancelledError(date);
      case 'DAY_NOT_CLOSED':
        return new DayNotClosedError(date);
      case 'LATER_DAY_EXISTS':
        return new LaterDayExistsError(date);
      default:
        return error;
    }
  }
}
