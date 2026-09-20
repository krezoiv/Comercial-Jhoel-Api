import { Inject, Injectable } from '@nestjs/common';
import { SITE_VISITS_REPOSITORY } from '../../domain/repositories/site-visits.repository';
import type { SiteVisitsRepository } from '../../domain/repositories/site-visits.repository';
import { VisitCountOutput } from './register-visit.use-case';

@Injectable()
export class GetVisitCountUseCase {
  constructor(
    @Inject(SITE_VISITS_REPOSITORY)
    private readonly siteVisitsRepository: SiteVisitsRepository,
  ) {}

  async execute(): Promise<VisitCountOutput> {
    const total = await this.siteVisitsRepository.getTotal();
    return { total };
  }
}
