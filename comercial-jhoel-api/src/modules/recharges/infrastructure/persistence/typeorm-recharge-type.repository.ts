import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RechargeType } from '../../domain/entities/recharge-type.entity';
import { RechargeTypeRepository } from '../../domain/repositories/recharge-type.repository';
import { RechargeTypeNotFoundError } from '../../domain/errors/recharge-type-not-found.error';
import { RechargeTypeOrmEntity } from './recharge-type.orm-entity';
import { RechargeTypeMapper } from './recharge-type.mapper';

@Injectable()
export class TypeOrmRechargeTypeRepository implements RechargeTypeRepository {
  constructor(
    @InjectRepository(RechargeTypeOrmEntity)
    private readonly repository: Repository<RechargeTypeOrmEntity>,
  ) {}

  async findAll(options?: { activeOnly?: boolean }): Promise<RechargeType[]> {
    const orms = await this.repository.find({
      where: options?.activeOnly ? { isActive: true } : {},
      order: { name: 'ASC' },
    });
    return orms.map((orm) => RechargeTypeMapper.toDomain(orm));
  }

  async findById(id: string): Promise<RechargeType | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? RechargeTypeMapper.toDomain(orm) : null;
  }

  async updateMinBalance(
    id: string,
    minBalance: number,
  ): Promise<RechargeType> {
    const result = await this.repository.update({ id }, { minBalance });
    if (!result.affected) {
      throw new RechargeTypeNotFoundError(id);
    }
    const orm = await this.repository.findOne({ where: { id } });
    if (!orm) {
      throw new InternalServerErrorException(
        'No se pudo recuperar el tipo de recarga recién actualizado.',
      );
    }
    return RechargeTypeMapper.toDomain(orm);
  }
}
