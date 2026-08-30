import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { DayOpening } from '../../domain/entities/day-opening.entity';
import { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
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
}
