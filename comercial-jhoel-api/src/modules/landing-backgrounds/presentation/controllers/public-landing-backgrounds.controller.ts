import { Controller, Get, Param, ParseUUIDPipe, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ListPublishedLandingBackgroundsUseCase } from '../../application/use-cases/list-published-landing-backgrounds.use-case';
import { GetLandingBackgroundImageUseCase } from '../../application/use-cases/get-landing-background-image.use-case';
import { PublicLandingBackgroundResponseDto } from '../dtos/public-landing-background.response.dto';

/**
 * Público, sin guard — backs la capa de fondos 3D de la landing. Mismo
 * header `Cross-Origin-Resource-Policy: cross-origin` que Teléfonos/
 * Librería/Variedades/Noticias/Catálogo de Bancos para que `<img>`/
 * `background-image` carguen entre orígenes. No expone `isActive`/audit/
 * usuarios — solo lo que la capa visual necesita para renderizarse.
 */
@Controller('public-landing-backgrounds')
export class PublicLandingBackgroundsController {
  constructor(
    private readonly listPublishedLandingBackgroundsUseCase: ListPublishedLandingBackgroundsUseCase,
    private readonly getLandingBackgroundImageUseCase: GetLandingBackgroundImageUseCase,
  ) {}

  @Get()
  findAll(): Promise<PublicLandingBackgroundResponseDto[]> {
    return this.listPublishedLandingBackgroundsUseCase.execute();
  }

  @Get('images/:id')
  async getImage(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response): Promise<void> {
    const image = await this.getLandingBackgroundImageUseCase.execute(id);
    res.set({
      'Content-Type': image.mimeType,
      'Content-Length': String(image.data.length),
      'Cache-Control': 'public, max-age=86400',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    res.send(image.data);
  }
}
