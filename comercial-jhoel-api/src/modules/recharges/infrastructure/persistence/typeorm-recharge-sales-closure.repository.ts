import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { RechargeSalesClosure } from '../../domain/entities/recharge-sales-closure.entity';
import {
  RechargeSalesClosureRepository,
  RegisterRechargeSalesClosureData,
} from '../../domain/repositories/recharge-sales-closure.repository';
import { InvalidTotalCollectedError } from '../../domain/errors/invalid-total-collected.error';
import { PendingTypeClosureError } from '../../domain/errors/pending-type-closure.error';
import { SalesClosureEditForbiddenError } from '../../domain/errors/sales-closure-edit-forbidden.error';
import { RechargeSalesClosureOrmEntity } from './recharge-sales-closure.orm-entity';
import { RechargeSalesClosureMapper } from './recharge-sales-closure.mapper';

@Injectable()
export class TypeOrmRechargeSalesClosureRepository implements RechargeSalesClosureRepository {
  constructor(
    @InjectRepository(RechargeSalesClosureOrmEntity)
    private readonly repository: Repository<RechargeSalesClosureOrmEntity>,
  ) {}

  async findByDateAndSequence(
    date: string,
    sequence: number,
  ): Promise<RechargeSalesClosure | null> {
    const orm = await this.repository.findOne({ where: { date, sequence } });
    return orm ? RechargeSalesClosureMapper.toDomain(orm) : null;
  }

  async registerClosure(
    data: RegisterRechargeSalesClosureData,
  ): Promise<RechargeSalesClosure> {
    let closureId: string;
    try {
      const rows = await this.repository.manager.query<
        { register_recharge_sales_closure: string }[]
      >('SELECT register_recharge_sales_closure($1, $2, $3, $4)', [
        data.date,
        data.totalCollected,
        data.userId,
        data.isAdmin,
      ]);
      closureId = rows[0].register_recharge_sales_closure;
    } catch (error) {
      throw this.translateClosureError(error);
    }

    const closure = await this.repository.findOne({
      where: { id: closureId },
    });
    if (!closure) {
      // The function just committed it — this would only happen on a bug.
      throw new InternalServerErrorException(
        'No se pudo recuperar el cuadre recién guardado.',
      );
    }
    return RechargeSalesClosureMapper.toDomain(closure);
  }

  private translateClosureError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;

    const [code, id] = message.split(':');

    switch (code) {
      case 'INVALID_TOTAL_COLLECTED':
        return new InvalidTotalCollectedError();
      case 'PENDING_TYPE_CLOSURE':
        return new PendingTypeClosureError(id);
      case 'SALES_CLOSURE_EDIT_FORBIDDEN':
        return new SalesClosureEditForbiddenError();
      default:
        return error;
    }
  }
}
