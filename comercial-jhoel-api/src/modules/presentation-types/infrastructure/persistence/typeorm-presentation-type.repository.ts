import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { PresentationType } from '../../domain/entities/presentation-type.entity';
import {
  CreatePresentationTypeData,
  FindPresentationTypesOptions,
  PresentationTypeListItem,
  PresentationTypeRepository,
  UpdatePresentationTypeData,
} from '../../domain/repositories/presentation-type.repository';
import { PresentationTypeNameAlreadyExistsError } from '../../domain/errors/presentation-type-name-already-exists.error';
import { PresentationTypeCodeAlreadyExistsError } from '../../domain/errors/presentation-type-code-already-exists.error';
import { PresentationTypeOrmEntity } from './presentation-type.orm-entity';
import { PresentationTypeMapper } from './presentation-type.mapper';

@Injectable()
export class TypeOrmPresentationTypeRepository
  implements PresentationTypeRepository
{
  constructor(
    @InjectRepository(PresentationTypeOrmEntity)
    private readonly repository: Repository<PresentationTypeOrmEntity>,
  ) {}

  /**
   * Raw, hand-selected columns + a correlated scalar subquery for
   * `usageCount` — the same "no relation-count-and-map helper in this
   * TypeORM version" pattern Reports' own `itemCount` already established
   * (`TypeOrmSalesReportRepository.findAll`). A join here would fan out one
   * row per `product_presentations` match and corrupt the result.
   */
  async findAll(
    options: FindPresentationTypesOptions,
  ): Promise<PresentationTypeListItem[]> {
    const qb = this.repository
      .createQueryBuilder('presentationType')
      .leftJoin('presentationType.createdByUser', 'createdByUser')
      .leftJoin('presentationType.updatedByUser', 'updatedByUser');

    if (options.activeOnly) {
      qb.andWhere('presentationType.isActive = true');
    }
    if (options.search) {
      qb.andWhere(
        '(presentationType.name ILIKE :search OR presentationType.code ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    qb.select('presentationType.id', 'id')
      .addSelect('presentationType.name', 'name')
      .addSelect('presentationType.code', 'code')
      .addSelect('presentationType.description', 'description')
      .addSelect('presentationType.isActive', 'isActive')
      .addSelect('presentationType.createdAt', 'createdAt')
      .addSelect('presentationType.updatedAt', 'updatedAt')
      .addSelect('presentationType.createdBy', 'createdBy')
      .addSelect('createdByUser.username', 'createdByUsername')
      .addSelect('presentationType.updatedBy', 'updatedBy')
      .addSelect('updatedByUser.username', 'updatedByUsername')
      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(*)', 'count')
            .from('product_presentations', 'pp')
            .where('pp.presentation_type_id = presentationType.id'),
        'usageCount',
      )
      .orderBy('presentationType.name', 'ASC');

    const rows = await qb.getRawMany<{
      id: string;
      name: string;
      code: string | null;
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
      code: row.code,
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

  async findById(id: string): Promise<PresentationType | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? PresentationTypeMapper.toDomain(orm) : null;
  }

  async findByActiveName(name: string): Promise<PresentationType | null> {
    const orm = await this.repository
      .createQueryBuilder('presentationType')
      .where('LOWER(presentationType.name) = LOWER(:name)', { name })
      .andWhere('presentationType.isActive = true')
      .getOne();
    return orm ? PresentationTypeMapper.toDomain(orm) : null;
  }

  async findByName(name: string): Promise<PresentationType | null> {
    const orm = await this.repository
      .createQueryBuilder('presentationType')
      .where('LOWER(presentationType.name) = LOWER(:name)', { name })
      .getOne();
    return orm ? PresentationTypeMapper.toDomain(orm) : null;
  }

  async findByActiveCode(code: string): Promise<PresentationType | null> {
    const orm = await this.repository
      .createQueryBuilder('presentationType')
      .where('LOWER(presentationType.code) = LOWER(:code)', { code })
      .andWhere('presentationType.isActive = true')
      .getOne();
    return orm ? PresentationTypeMapper.toDomain(orm) : null;
  }

  async create(data: CreatePresentationTypeData): Promise<PresentationType> {
    const orm = this.repository.create({
      name: data.name,
      code: data.code,
      description: data.description,
      createdBy: data.createdBy,
    });
    try {
      const saved = await this.repository.save(orm);
      const withRelations = await this.repository.findOneOrFail({
        where: { id: saved.id },
      });
      return PresentationTypeMapper.toDomain(withRelations);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name, data.code);
    }
  }

  async update(
    id: string,
    data: UpdatePresentationTypeData,
  ): Promise<PresentationType> {
    const { updatedBy, ...rest } = data;
    try {
      await this.repository.update({ id }, { ...rest, updatedBy });
    } catch (error) {
      throw this.translateUniqueViolation(
        error,
        data.name ?? '',
        data.code ?? null,
      );
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return PresentationTypeMapper.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }

  async countUsage(id: string): Promise<number> {
    const [row] = await this.repository.manager.query<{ count: string }[]>(
      'SELECT COUNT(*) AS count FROM product_presentations WHERE presentation_type_id = $1',
      [id],
    );
    return parseInt(row?.count ?? '0', 10);
  }

  /** Safety net for the create/update race the use case's own pre-check can't close — same pattern as `TypeOrmClientRepository.translateUniqueViolation`. */
  private translateUniqueViolation(
    error: unknown,
    name: string,
    code: string | null,
  ): unknown {
    if (error instanceof QueryFailedError) {
      const constraint = (
        error.driverError as { constraint?: string } | undefined
      )?.constraint;
      if (constraint === 'UQ_presentation_types_name_active') {
        return new PresentationTypeNameAlreadyExistsError(name);
      }
      if (constraint === 'UQ_presentation_types_code_active') {
        return new PresentationTypeCodeAlreadyExistsError(code ?? '');
      }
    }
    return error;
  }
}
