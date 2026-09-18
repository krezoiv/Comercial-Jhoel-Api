import {
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Response } from 'express';
import { ListPublishedNewsArticlesUseCase } from '../../application/use-cases/list-published-news-articles.use-case';
import { GetPublishedNewsArticleByIdUseCase } from '../../application/use-cases/get-published-news-article-by-id.use-case';
import { GetNewsArticleImageUseCase } from '../../application/use-cases/get-news-article-image.use-case';
import { LikeNewsArticleUseCase } from '../../application/use-cases/like-news-article.use-case';
import { PublicNewsArticleResponseDto } from '../dtos/public-news-article.response.dto';
import {
  parseOptionalVisitorId,
  parseRequiredVisitorId,
} from '../../../likes/application/utils/parse-visitor-id';

/** Público, sin guard — backs "Noticias" en la landing. Mismo header `Cross-Origin-Resource-Policy` que Teléfonos/Librería/Variedades para que `<img>` cargue entre orígenes. */
@Controller('public-news')
export class PublicNewsController {
  constructor(
    private readonly listPublishedNewsArticlesUseCase: ListPublishedNewsArticlesUseCase,
    private readonly getPublishedNewsArticleByIdUseCase: GetPublishedNewsArticleByIdUseCase,
    private readonly getNewsArticleImageUseCase: GetNewsArticleImageUseCase,
    private readonly likeNewsArticleUseCase: LikeNewsArticleUseCase,
  ) {}

  @Get()
  findAll(
    @Headers('x-visitor-id') visitorIdHeader?: string,
  ): Promise<PublicNewsArticleResponseDto[]> {
    return this.listPublishedNewsArticlesUseCase.execute(parseOptionalVisitorId(visitorIdHeader));
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-visitor-id') visitorIdHeader?: string,
  ): Promise<PublicNewsArticleResponseDto> {
    return this.getPublishedNewsArticleByIdUseCase.execute(id, parseOptionalVisitorId(visitorIdHeader));
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

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  like(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-visitor-id') visitorIdHeader?: string,
  ): Promise<{ likesCount: number; liked: boolean }> {
    return this.likeNewsArticleUseCase.execute(id, parseRequiredVisitorId(visitorIdHeader), 'LIKE');
  }

  @Post(':id/unlike')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  unlike(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('x-visitor-id') visitorIdHeader?: string,
  ): Promise<{ likesCount: number; liked: boolean }> {
    return this.likeNewsArticleUseCase.execute(id, parseRequiredVisitorId(visitorIdHeader), 'UNLIKE');
  }
}
