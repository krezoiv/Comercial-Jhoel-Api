import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentReconciliation } from '../../domain/entities/agent-reconciliation.entity';
import {
  AgentReconciliationRepository,
  CreateAgentReconciliationData,
} from '../../domain/repositories/agent-reconciliation.repository';
import { AgentReconciliationOrmEntity } from './agent-reconciliation.orm-entity';
import { AgentReconciliationMapper } from './agent-reconciliation.mapper';

@Injectable()
export class TypeOrmAgentReconciliationRepository
  implements AgentReconciliationRepository
{
  constructor(
    @InjectRepository(AgentReconciliationOrmEntity)
    private readonly repository: Repository<AgentReconciliationOrmEntity>,
  ) {}

  async create(
    data: CreateAgentReconciliationData,
  ): Promise<AgentReconciliation> {
    const orm = this.repository.create({
      date: data.date,
      totalCash: data.totalCash,
      totalBanks: data.totalBanks,
      totalAssets: data.totalAssets,
      totalAccountsReceivable: data.totalAccountsReceivable,
      result: data.result,
      createdBy: data.createdBy,
    });
    const saved = await this.repository.save(orm);
    // `.save()` doesn't populate the eager `createdByUser` relation on the
    // object it returns — same re-fetch pattern `TypeOrmBankRepository`/
    // `TypeOrmProductRepository` already use for their own eager relations.
    const withRelations = await this.repository.findOneOrFail({
      where: { id: saved.id },
    });
    return AgentReconciliationMapper.toDomain(withRelations);
  }
}
