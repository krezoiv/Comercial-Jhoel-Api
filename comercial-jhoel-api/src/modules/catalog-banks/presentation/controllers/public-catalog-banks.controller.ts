import { Controller, Get, Param, ParseUUIDPipe, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ListPublishedCatalogBanksUseCase } from '../../application/use-cases/list-published-catalog-banks.use-case';
import { GetPublishedCatalogBankByIdUseCase } from '../../application/use-cases/get-published-catalog-bank-by-id.use-case';
import { GetCatalogBankImageUseCase } from '../../application/use-cases/get-catalog-bank-image.use-case';
import { PublicCatalogBankResponseDto } from '../dtos/public-catalog-bank.response.dto';

/**
 * Público, sin guard — backs la sección "Bancos" de la landing. Mismo
 * header `Cross-Origin-Resource-Policy: cross-origin` que Teléfonos/
 * Librería/Variedades/Noticias para que `<img>` cargue entre orígenes.
 * Esta misma URL de imagen también la usa el admin para sus miniaturas/
 * vista previa — no hace falta una ruta de imagen separada.
 */
@Controller('public-catalog-banks')
export class PublicCatalogBanksController {
  constructor(
    private readonly listPublishedCatalogBanksUseCase: ListPublishedCatalogBanksUseCase,
    private readonly getPublishedCatalogBankByIdUseCase: GetPublishedCatalogBankByIdUseCase,
    private readonly getCatalogBankImageUseCase: GetCatalogBankImageUseCase,
  ) {}

  @Get()
  findAll(): Promise<PublicCatalogBankResponseDto[]> {
    return this.listPublishedCatalogBanksUseCase.execute();
  }

  @Get('images/:id')
  async getImage(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response): Promise<void> {
    const image = await this.getCatalogBankImageUseCase.execute(id);
    res.set({
      'Content-Type': image.mimeType,
      'Content-Length': String(image.data.length),
      'Cache-Control': 'public, max-age=86400',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    res.send(image.data);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PublicCatalogBankResponseDto> {
    return this.getPublishedCatalogBankByIdUseCase.execute(id);
  }
}
