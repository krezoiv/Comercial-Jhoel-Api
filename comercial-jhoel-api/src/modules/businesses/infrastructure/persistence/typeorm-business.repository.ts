import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Business } from '../../domain/entities/business.entity';
import {
  BusinessRepository,
  CreateBusinessData,
  UpdateBusinessData,
} from '../../domain/repositories/business.repository';
import { BusinessNameAlreadyExistsError } from '../../domain/errors/business-name-already-exists.error';
import { BusinessOrmEntity } from './business.orm-entity';
import { BusinessMapper } from './business.mapper';

@Injectable()
export class TypeOrmBusinessRepository implements BusinessRepository {
  constructor(
    @InjectRepository(BusinessOrmEntity)
    private readonly repository: Repository<BusinessOrmEntity>,
  ) {}

  async findAll(options?: { activeOnly?: boolean }): Promise<Business[]> {
    const orms = await this.repository.find({
      where: options?.activeOnly ? { isActive: true } : {},
      order: { name: 'ASC' },
    });
    return orms.map((orm) => BusinessMapper.toDomain(orm));
  }

  async findById(id: string): Promise<Business | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? BusinessMapper.toDomain(orm) : null;
  }

  async findByName(name: string): Promise<Business | null> {
    const orm = await this.repository.findOne({ where: { name } });
    return orm ? BusinessMapper.toDomain(orm) : null;
  }

  async findByActiveName(name: string): Promise<Business | null> {
    const orm = await this.repository
      .createQueryBuilder('business')
      .where('LOWER(business.name) = LOWER(:name)', { name })
      .andWhere('business.isActive = true')
      .getOne();
    return orm ? BusinessMapper.toDomain(orm) : null;
  }

  async create(data: CreateBusinessData): Promise<Business> {
    const orm = this.repository.create({
      name: data.name,
      description: data.description,
    });
    try {
      const saved = await this.repository.save(orm);
      return BusinessMapper.toDomain(saved);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name);
    }
  }

  async update(id: string, data: UpdateBusinessData): Promise<Business> {
    try {
      await this.repository.update({ id }, data);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name ?? '');
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return BusinessMapper.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }

  /** Safety net for the create/update race the use case's own pre-check can't close — see `TypeOrmCategoryRepository.translateUniqueViolation`'s own doc comment. */
  private translateUniqueViolation(error: unknown, name: string): unknown {
    if (error instanceof QueryFailedError) {
      const constraint = (
        error.driverError as { constraint?: string } | undefined
      )?.constraint;
      if (constraint === 'UQ_businesses_name') {
        return new BusinessNameAlreadyExistsError(name);
      }
    }
    return error;
  }
}
