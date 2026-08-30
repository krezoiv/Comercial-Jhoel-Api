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

@Injectable()
export class TypeOrmClientRepository implements ClientRepository {
  constructor(
    @InjectRepository(ClientOrmEntity)
    private readonly repository: Repository<ClientOrmEntity>,
  ) {}

  async findAll(options: FindClientsOptions): Promise<Client[]> {
    const orms = await this.repository.find({
      where: options.activeOnly ? { isActive: true } : {},
      order: { name: 'ASC' },
    });
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
