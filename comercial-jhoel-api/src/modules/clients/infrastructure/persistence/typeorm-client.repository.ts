import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Client } from '../../domain/entities/client.entity';
import {
  ClientRepository,
  CreateClientData,
  FindClientsOptions,
  UpdateClientData,
} from '../../domain/repositories/client.repository';
import { ClientNameAlreadyExistsError } from '../../domain/errors/client-name-already-exists.error';
import { ClientOrmEntity } from './client.orm-entity';
import { ClientMapper } from './client.mapper';
import { applySearchTerms } from '../../../../shared/infrastructure/persistence/apply-search-terms.util';

@Injectable()
export class TypeOrmClientRepository implements ClientRepository {
  constructor(
    @InjectRepository(ClientOrmEntity)
    private readonly repository: Repository<ClientOrmEntity>,
  ) {}

  async findAll(options: FindClientsOptions): Promise<Client[]> {
    const qb = this.repository.createQueryBuilder('client');
    if (options.activeOnly) {
      qb.andWhere('client.isActive = true');
    }
    if (options.search) {
      applySearchTerms(
        qb,
        options.search,
        (param) => `search_normalize(client.name) LIKE search_normalize(:${param})`,
      );
    }
    qb.orderBy('client.name', 'ASC');
    const orms = await qb.getMany();
    return orms.map((orm) => ClientMapper.toDomain(orm));
  }

  async findById(id: string): Promise<Client | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? ClientMapper.toDomain(orm) : null;
  }

  async findByActiveName(name: string): Promise<Client | null> {
    const orm = await this.repository
      .createQueryBuilder('client')
      .where('LOWER(client.name) = LOWER(:name)', { name })
      .andWhere('client.isActive = true')
      .getOne();
    return orm ? ClientMapper.toDomain(orm) : null;
  }

  async create(data: CreateClientData): Promise<Client> {
    const orm = this.repository.create({
      name: data.name,
      createdBy: data.createdBy,
    });
    try {
      const saved = await this.repository.save(orm);
      const withRelations = await this.repository.findOneOrFail({
        where: { id: saved.id },
      });
      return ClientMapper.toDomain(withRelations);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name);
    }
  }

  async update(id: string, data: UpdateClientData): Promise<Client> {
    const { updatedBy, ...rest } = data;
    try {
      await this.repository.update({ id }, { ...rest, updatedBy });
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name ?? '');
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return ClientMapper.toDomain(updated);
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
      if (constraint === 'UQ_clients_name_active') {
        return new ClientNameAlreadyExistsError(name);
      }
    }
    return error;
  }
}
