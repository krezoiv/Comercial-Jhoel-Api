import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { GetVisitCountUseCase } from '../../application/use-cases/get-visit-count.use-case';
import { RegisterVisitUseCase } from '../../application/use-cases/register-visit.use-case';
import { VisitCountOutput } from '../../application/use-cases/register-visit.use-case';

/**
 * Público, sin autenticación — backs el contador anónimo y agregado del
 * Footer de la landing. Nunca acepta un valor: `POST` solo puede sumar
 * +1, `GET` solo puede leer. `Throttle` es la única protección contra
 * abuso pedida explícitamente ("protección razonable", no un sistema de
 * tracking) — suficiente para absorber una carga de página real (que
 * llama `POST` una sola vez) sin dejar que un script simple infle el
 * contador sin límite.
 */
@Controller('public-site-visits')
export class PublicSiteVisitsController {
  constructor(
    private readonly registerVisitUseCase: RegisterVisitUseCase,
    private readonly getVisitCountUseCase: GetVisitCountUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  register(): Promise<VisitCountOutput> {
    return this.registerVisitUseCase.execute();
  }

  @Get()
  getTotal(): Promise<VisitCountOutput> {
    return this.getVisitCountUseCase.execute();
  }
}
