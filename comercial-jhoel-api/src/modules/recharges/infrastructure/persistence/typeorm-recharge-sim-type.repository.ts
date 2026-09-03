import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RechargeSimType } from '../../domain/entities/recharge-sim-type.entity';
import { RechargeSimTypeRepository } from '../../domain/repositories/recharge-sim-type.repository';
import { RechargeSimTypeOrmEntity } from './recharge-sim-type.orm-entity';
import { RechargeSimTypeMapper } from './recharge-sim-type.mapper';

@Injectable()
export class TypeOrmRechargeSimTypeRepository implements RechargeSimTypeRepository {
  constructor(
    @InjectRepository(RechargeSimTypeOrmEntity)
    private readonly repository: Repository<RechargeSimTypeOrmEntity>,
  ) {}

  async findAll(options?: {
    activeOnly?: boolean;
  }): Promise<RechargeSimType[]> {
    const orms = await this.repository.find({
      where: options?.activeOnly ? { isActive: true } : {},
      order: { name: 'ASC' },
    });
    return orms.map((orm) => RechargeSimTypeMapper.toDomain(orm));
  }

  async findById(id: string): Promise<RechargeSimType | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? RechargeSimTypeMapper.toDomain(orm) : null;
  }
}
