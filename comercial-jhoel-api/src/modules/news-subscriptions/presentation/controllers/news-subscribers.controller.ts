import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { ListNewsSubscribersUseCase } from '../../application/use-cases/list-news-subscribers.use-case';
import { GetNewsSubscriberByIdUseCase } from '../../application/use-cases/get-news-subscriber-by-id.use-case';
import { SetNewsSubscriberActiveUseCase } from '../../application/use-cases/set-news-subscriber-active.use-case';
import { NewsSubscriberDetailResponseDto, NewsSubscriberResponseDto } from '../dtos/news-subscriber.response.dto';

/**
 * "Sistema → Suscriptores de Noticias" — admin-only de punta a punta,
 * incluidos los `GET` (expone WhatsApp/consentimiento/preferencias de
 * clientes, nunca abierto ni siquiera a un rol autenticado no-admin) —
 * mismo criterio que `RolesController`.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('news-subscribers')
export class NewsSubscribersController {
  constructor(
    private readonly listNewsSubscribersUseCase: ListNewsSubscribersUseCase,
    private readonly getNewsSubscriberByIdUseCase: GetNewsSubscriberByIdUseCase,
    private readonly setNewsSubscriberActiveUseCase: SetNewsSubscriberActiveUseCase,
  ) {}

  @Get()
  findAll(@Query('includeInactive') includeInactive?: string): Promise<NewsSubscriberResponseDto[]> {
    return this.listNewsSubscribersUseCase.execute(includeInactive !== 'false');
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<NewsSubscriberDetailResponseDto> {
    return this.getNewsSubscriberByIdUseCase.execute(id);
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  activate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.setNewsSubscriberActiveUseCase.execute(id, true, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    return this.setNewsSubscriberActiveUseCase.execute(id, false, userId);
  }
}
