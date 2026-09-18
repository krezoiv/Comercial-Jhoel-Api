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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { CreateNewsTypeUseCase } from '../../application/use-cases/create-news-type.use-case';
import { ListNewsTypesUseCase } from '../../application/use-cases/list-news-types.use-case';
import { GetNewsTypeByIdUseCase } from '../../application/use-cases/get-news-type-by-id.use-case';
import { UpdateNewsTypeUseCase } from '../../application/use-cases/update-news-type.use-case';
import { DeactivateNewsTypeUseCase } from '../../application/use-cases/deactivate-news-type.use-case';
import { ReorderNewsTypesUseCase } from '../../application/use-cases/reorder-news-types.use-case';
import { CreateNewsTypeRequestDto } from '../dtos/create-news-type.request.dto';
import { UpdateNewsTypeRequestDto } from '../dtos/update-news-type.request.dto';
import { ListNewsTypesQueryDto } from '../dtos/list-news-types.query.dto';
import { ReorderNewsTypesRequestDto } from '../dtos/reorder-news-types.request.dto';
import { NewsTypeListResponseDto, NewsTypeResponseDto } from '../dtos/news-type.response.dto';

/** "Sistema → Tipos de Noticias" — CRUD es admin-only; cualquier rol autenticado puede leer (lo necesita el selector "Tipo de noticia" del form de Noticias). */
@UseGuards(JwtAuthGuard)
@Controller('news-types')
export class NewsTypesController {
  constructor(
    private readonly createNewsTypeUseCase: CreateNewsTypeUseCase,
    private readonly listNewsTypesUseCase: ListNewsTypesUseCase,
    private readonly getNewsTypeByIdUseCase: GetNewsTypeByIdUseCase,
    private readonly updateNewsTypeUseCase: UpdateNewsTypeUseCase,
    private readonly deactivateNewsTypeUseCase: DeactivateNewsTypeUseCase,
    private readonly reorderNewsTypesUseCase: ReorderNewsTypesUseCase,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateNewsTypeRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<NewsTypeResponseDto> {
    return this.createNewsTypeUseCase.execute({ ...dto, createdBy: userId });
  }

  @Get()
  findAll(@Query() query: ListNewsTypesQueryDto): Promise<NewsTypeListResponseDto[]> {
    return this.listNewsTypesUseCase.execute(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<NewsTypeResponseDto> {
    return this.getNewsTypeByIdUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNewsTypeRequestDto,
    @CurrentUser('userId') userId: string,
  ): Promise<NewsTypeResponseDto> {
    return this.updateNewsTypeUseCase.execute(id, { ...dto, updatedBy: userId });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deactivateNewsTypeUseCase.execute(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Post('reorder')
  @HttpCode(HttpStatus.OK)
  reorder(@Body() dto: ReorderNewsTypesRequestDto): Promise<void> {
    return this.reorderNewsTypesUseCase.execute(dto.items);
  }
}
