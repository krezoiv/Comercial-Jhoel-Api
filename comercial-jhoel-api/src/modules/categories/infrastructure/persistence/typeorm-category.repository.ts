import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Category } from '../../domain/entities/category.entity';
import {
  CategoryRepository,
  CreateCategoryData,
  UpdateCategoryData,
} from '../../domain/repositories/category.repository';
import { CategoryNameAlreadyExistsError } from '../../domain/errors/category-name-already-exists.error';
import { CategoryOrmEntity } from './category.orm-entity';
import { CategoryMapper } from './category.mapper';

@Injectable()
export class TypeOrmCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly repository: Repository<CategoryOrmEntity>,
  ) {}

  async findAll(options?: { activeOnly?: boolean }): Promise<Category[]> {
    const orms = await this.repository.find({
      where: options?.activeOnly ? { isActive: true } : {},
      order: { name: 'ASC' },
    });
    return orms.map((orm) => CategoryMapper.toDomain(orm));
  }

  async findById(id: string): Promise<Category | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? CategoryMapper.toDomain(orm) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const orm = await this.repository.findOne({ where: { name } });
    return orm ? CategoryMapper.toDomain(orm) : null;
  }

  async findByActiveName(name: string): Promise<Category | null> {
    const orm = await this.repository
      .createQueryBuilder('category')
      .where('LOWER(category.name) = LOWER(:name)', { name })
      .andWhere('category.isActive = true')
      .getOne();
    return orm ? CategoryMapper.toDomain(orm) : null;
  }

  async create(data: CreateCategoryData): Promise<Category> {
    const orm = this.repository.create({
      name: data.name,
      description: data.description,
    });
    try {
      const saved = await this.repository.save(orm);
      return CategoryMapper.toDomain(saved);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name);
    }
  }

  async update(id: string, data: UpdateCategoryData): Promise<Category> {
    try {
      await this.repository.update({ id }, data);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name ?? '');
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return CategoryMapper.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }

  /**
   * The use case already checks `findByName` before calling `create`/
   * `update` — this is the safety net for the race that pre-check can't
   * close (two requests creating the same name at nearly the same time),
   * backed by the DB's own `UQ_categories_name` constraint rather than an
   * application-level lock.
   */
  private translateUniqueViolation(error: unknown, name: string): unknown {
    if (error instanceof QueryFailedError) {
      const constraint = (
        error.driverError as { constraint?: string } | undefined
      )?.constraint;
      if (constraint === 'UQ_categories_name') {
        return new CategoryNameAlreadyExistsError(name);
      }
    }
    return error;
  }
}
