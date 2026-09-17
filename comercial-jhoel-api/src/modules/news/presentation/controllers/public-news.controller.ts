import { Controller, Get, Param, ParseUUIDPipe, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ListPublishedNewsArticlesUseCase } from '../../application/use-cases/list-published-news-articles.use-case';
import { GetPublishedNewsArticleByIdUseCase } from '../../application/use-cases/get-published-news-article-by-id.use-case';
import { GetNewsArticleImageUseCase } from '../../application/use-cases/get-news-article-image.use-case';
import { PublicNewsArticleResponseDto } from '../dtos/public-news-article.response.dto';

/** Público, sin guard — backs "Noticias" en la landing. Mismo header `Cross-Origin-Resource-Policy` que Teléfonos/Librería/Variedades para que `<img>` cargue entre orígenes. */
@Controller('public-news')
export class PublicNewsController {
  constructor(
    private readonly listPublishedNewsArticlesUseCase: ListPublishedNewsArticlesUseCase,
    private readonly getPublishedNewsArticleByIdUseCase: GetPublishedNewsArticleByIdUseCase,
    private readonly getNewsArticleImageUseCase: GetNewsArticleImageUseCase,
  ) {}

  @Get()
  findAll(): Promise<PublicNewsArticleResponseDto[]> {
    return this.listPublishedNewsArticlesUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PublicNewsArticleResponseDto> {
    return this.getPublishedNewsArticleByIdUseCase.execute(id);
  }

  @Get('images/:id')
  async getImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    const image = await this.getNewsArticleImageUseCase.execute(id);
    res.set({
      'Content-Type': image.mimeType,
      'Content-Length': String(image.data.length),
      'Cache-Control': 'public, max-age=86400',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    res.send(image.data);
  }
}
