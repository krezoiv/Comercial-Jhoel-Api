import { Controller, Get, Param, ParseUUIDPipe, Res } from '@nestjs/common';
import type { Response } from 'express';
import { GetTransactionBankImageUseCase } from '../../application/use-cases/get-transaction-bank-image.use-case';

/**
 * Sin guard — un `<img>` no puede enviar el Bearer token. Solo sirve el logo
 * del banco agente (nada sensible), con el mismo header
 * `Cross-Origin-Resource-Policy: cross-origin` que las imágenes del Catálogo
 * de Bancos. El frontend agrega `?v=<updatedAt>` para invalidar la caché al
 * reemplazar la imagen.
 */
@Controller('public-transaction-banks')
export class TransactionBankImagesController {
  constructor(
    private readonly getTransactionBankImageUseCase: GetTransactionBankImageUseCase,
  ) {}

  @Get('images/:id')
  async getImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    const image = await this.getTransactionBankImageUseCase.execute(id);
    res.set({
      'Content-Type': image.mimeType,
      'Content-Length': String(image.data.length),
      'Cache-Control': 'public, max-age=86400',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    res.send(image.data);
  }
}
