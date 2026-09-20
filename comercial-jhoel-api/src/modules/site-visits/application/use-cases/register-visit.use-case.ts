import { Inject, Injectable } from '@nestjs/common';
import { SITE_VISITS_REPOSITORY } from '../../domain/repositories/site-visits.repository';
import type { SiteVisitsRepository } from '../../domain/repositories/site-visits.repository';

export interface VisitCountOutput {
  total: number;
}

/** Incrementa el contador en +1 — nunca acepta ni confía en un valor del cliente. */
@Injectable()
export class RegisterVisitUseCase {
  constructor(
    @Inject(SITE_VISITS_REPOSITORY)
    private readonly siteVisitsRepository: SiteVisitsRepository,
  ) {}

  async execute(): Promise<VisitCountOutput> {
    const total = await this.siteVisitsRepository.increment();
    return { total };
  }
}
