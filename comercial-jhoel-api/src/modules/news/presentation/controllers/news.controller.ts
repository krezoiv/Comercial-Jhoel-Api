import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { CreateNewsArticleUseCase } from '../../application/use-cases/create-news-article.use-case';
import { UpdateNewsArticleUseCase } from '../../application/use-cases/update-news-article.use-case';
import { ListNewsArticlesUseCase } from '../../application/use-cases/list-news-articles.use-case';
import { GetNewsArticleByIdUseCase } from '../../application/use-cases/get-news-article-by-id.use-case';
import { SetNewsArticleActiveUseCase } from '../../application/use-cases/set-news-article-active.use-case';
import { ReorderNewsArticlesUseCase } from '../../application/use-cases/reorder-news-articles.use-case';
import { SetNewsArticleImageUseCase } from '../../application/use-cases/set-news-article-image.use-case';
import { RemoveNewsArticleImageUseCase } from '../../application/use-cases/remove-news-article-image.use-case';
import { CreateNewsArticleRequestDto } from '../dtos/create-news-article.request.dto';
import { UpdateNewsArticleRequestDto } from '../dtos/update-news-article.request.dto';
import { ListNewsArticlesQueryDto } from '../dtos/list-news-articles.query.dto';
import { ReorderNewsArticlesRequestDto } from '../dtos/reorder-news-articles.request.dto';
import { NewsArticleResponseDto } from '../dtos/news-article.response.dto';

interface UploadedImageFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

/** Admin-only end to end — "Sistema → Noticias". */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('news')
export class NewsController {
  constructor(
    private readonly createNewsArticleUseCase: CreateNewsArticleUseCase,
    private readonly updateNewsArticleUseCase: UpdateNewsArticleUseCase,
    private readonly listNewsArticlesUseCase: ListNewsArticlesUseCase,
    private readonly getNewsArticleByIdUseCase: GetNewsArticleByIdUseCase,
    private readonly setNewsArticleActiveUseCase: SetNewsArticleActiveUseCase,
    private readonly reorderNewsArticlesUseCase: ReorderNewsArticlesUseCase,
    private readonly setNewsArticleImageUseCase: SetNewsArticleImageUseCase,
    private readonly removeNewsArticleImageUseCase: RemoveNewsArticleImageUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateNewsArticleRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<NewsArticleResponseDto> {
    return this.createNewsArticleUseCase.execute({
      title: dto.title,
      description: dto.description,
      publishedAt: dto.publishedAt,
      newsTypeId: dto.newsTypeId,
      userId,
    });
  }

  @Get()
  findAll(@Query() query: ListNewsArticlesQueryDto): Promise<NewsArticleResponseDto[]> {
    return this.listNewsArticlesUseCase.execute({
      includeInactive: query.includeInactive,
      search: query.search,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<NewsArticleResponseDto> {
    return this.getNewsArticleByIdUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNewsArticleRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<NewsArticleResponseDto> {
    return this.updateNewsArticleUseCase.execute(id, {
      title: dto.title,
      description: dto.description,
      publishedAt: dto.publishedAt,
      newsTypeId: dto.newsTypeId,
      userId,
    });
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  activate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.setNewsArticleActiveUseCase.execute(id, true, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.setNewsArticleActiveUseCase.execute(id, false, userId);
  }

  @Post('reorder')
  @HttpCode(HttpStatus.OK)
  reorder(@Body() dto: ReorderNewsArticlesRequestDto): Promise<void> {
    return this.reorderNewsArticlesUseCase.execute(dto.items);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  setImage(
    @Param('id', ParseUUIDPipe) newsArticleId: string,
    @UploadedFile() image: UploadedImageFile,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.setNewsArticleImageUseCase.execute({
      newsArticleId,
      image: { buffer: image.buffer, mimetype: image.mimetype, size: image.size },
      userId,
    });
  }

  @Delete(':id/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeImage(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.removeNewsArticleImageUseCase.execute(id, userId);
  }
}
