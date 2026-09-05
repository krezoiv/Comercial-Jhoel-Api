import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { UnitOfMeasure } from '../../domain/entities/unit-of-measure.entity';
import {
  CreateUnitOfMeasureData,
  FindUnitsOfMeasureOptions,
  UnitOfMeasureListItem,
  UnitOfMeasureRepository,
  UpdateUnitOfMeasureData,
} from '../../domain/repositories/unit-of-measure.repository';
import { UnitOfMeasureNameAlreadyExistsError } from '../../domain/errors/unit-of-measure-name-already-exists.error';
import { UnitOfMeasureAbbreviationAlreadyExistsError } from '../../domain/errors/unit-of-measure-abbreviation-already-exists.error';
import { UnitOfMeasureOrmEntity } from './unit-of-measure.orm-entity';
import { UnitOfMeasureMapper } from './unit-of-measure.mapper';

@Injectable()
export class TypeOrmUnitOfMeasureRepository implements UnitOfMeasureRepository {
  constructor(
    @InjectRepository(UnitOfMeasureOrmEntity)
    private readonly repository: Repository<UnitOfMeasureOrmEntity>,
  ) {}

  /** Raw, hand-selected columns + a correlated scalar subquery for `usageCount` against `products` — same pattern as `TypeOrmPresentationTypeRepository.findAll`. */
  async findAll(
    options: FindUnitsOfMeasureOptions,
  ): Promise<UnitOfMeasureListItem[]> {
    const qb = this.repository
      .createQueryBuilder('unitOfMeasure')
      .leftJoin('unitOfMeasure.createdByUser', 'createdByUser')
      .leftJoin('unitOfMeasure.updatedByUser', 'updatedByUser');

    if (options.activeOnly) {
      qb.andWhere('unitOfMeasure.isActive = true');
    }
    if (options.search) {
      qb.andWhere(
        '(unitOfMeasure.name ILIKE :search OR unitOfMeasure.abbreviation ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    qb.select('unitOfMeasure.id', 'id')
      .addSelect('unitOfMeasure.name', 'name')
      .addSelect('unitOfMeasure.abbreviation', 'abbreviation')
      .addSelect('unitOfMeasure.description', 'description')
      .addSelect('unitOfMeasure.isActive', 'isActive')
      .addSelect('unitOfMeasure.createdAt', 'createdAt')
      .addSelect('unitOfMeasure.updatedAt', 'updatedAt')
      .addSelect('unitOfMeasure.createdBy', 'createdBy')
      .addSelect('createdByUser.username', 'createdByUsername')
      .addSelect('unitOfMeasure.updatedBy', 'updatedBy')
      .addSelect('updatedByUser.username', 'updatedByUsername')
      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(*)', 'count')
            .from('products', 'p')
            .where('p.unit_of_measure_id = unitOfMeasure.id'),
        'usageCount',
      )
      .orderBy('unitOfMeasure.name', 'ASC');

    const rows = await qb.getRawMany<{
      id: string;
      name: string;
      abbreviation: string;
      description: string | null;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      createdBy: string;
      createdByUsername: string | null;
      updatedBy: string | null;
      updatedByUsername: string | null;
      usageCount: string;
    }>();

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      abbreviation: row.abbreviation,
      description: row.description,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      createdBy: row.createdBy,
      createdByUsername: row.createdByUsername ?? '',
      updatedBy: row.updatedBy,
      updatedByUsername: row.updatedByUsername,
      usageCount: parseInt(row.usageCount, 10),
    }));
  }

  async findById(id: string): Promise<UnitOfMeasure | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? UnitOfMeasureMapper.toDomain(orm) : null;
  }

  async findByActiveName(name: string): Promise<UnitOfMeasure | null> {
    const orm = await this.repository
      .createQueryBuilder('unitOfMeasure')
      .where('LOWER(unitOfMeasure.name) = LOWER(:name)', { name })
      .andWhere('unitOfMeasure.isActive = true')
      .getOne();
    return orm ? UnitOfMeasureMapper.toDomain(orm) : null;
  }

  async findByName(name: string): Promise<UnitOfMeasure | null> {
    const orm = await this.repository
      .createQueryBuilder('unitOfMeasure')
      .where('LOWER(unitOfMeasure.name) = LOWER(:name)', { name })
      .getOne();
    return orm ? UnitOfMeasureMapper.toDomain(orm) : null;
  }

  async findByActiveAbbreviation(
    abbreviation: string,
  ): Promise<UnitOfMeasure | null> {
    const orm = await this.repository
      .createQueryBuilder('unitOfMeasure')
      .where('LOWER(unitOfMeasure.abbreviation) = LOWER(:abbreviation)', {
        abbreviation,
      })
      .andWhere('unitOfMeasure.isActive = true')
      .getOne();
    return orm ? UnitOfMeasureMapper.toDomain(orm) : null;
  }

  async create(data: CreateUnitOfMeasureData): Promise<UnitOfMeasure> {
    const orm = this.repository.create({
      name: data.name,
      abbreviation: data.abbreviation,
      description: data.description,
      createdBy: data.createdBy,
    });
    try {
      const saved = await this.repository.save(orm);
      const withRelations = await this.repository.findOneOrFail({
        where: { id: saved.id },
      });
      return UnitOfMeasureMapper.toDomain(withRelations);
    } catch (error) {
      throw this.translateUniqueViolation(
        error,
        data.name,
        data.abbreviation,
      );
    }
  }

  async update(
    id: string,
    data: UpdateUnitOfMeasureData,
  ): Promise<UnitOfMeasure> {
    const { updatedBy, ...rest } = data;
    try {
      await this.repository.update({ id }, { ...rest, updatedBy });
    } catch (error) {
      throw this.translateUniqueViolation(
        error,
        data.name ?? '',
        data.abbreviation ?? '',
      );
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return UnitOfMeasureMapper.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }

  async countUsage(id: string): Promise<number> {
    const [row] = await this.repository.manager.query<{ count: string }[]>(
      'SELECT COUNT(*) AS count FROM products WHERE unit_of_measure_id = $1',
      [id],
    );
    return parseInt(row?.count ?? '0', 10);
  }

  /** Safety net for the create/update race the use case's own pre-check can't close — same pattern as `TypeOrmClientRepository.translateUniqueViolation`. */
  private translateUniqueViolation(
    error: unknown,
    name: string,
    abbreviation: string,
  ): unknown {
    if (error instanceof QueryFailedError) {
      const constraint = (
        error.driverError as { constraint?: string } | undefined
      )?.constraint;
      if (constraint === 'UQ_units_of_measure_name_active') {
        return new UnitOfMeasureNameAlreadyExistsError(name);
      }
      if (constraint === 'UQ_units_of_measure_abbreviation_active') {
        return new UnitOfMeasureAbbreviationAlreadyExistsError(abbreviation);
      }
    }
    return error;
  }
}
