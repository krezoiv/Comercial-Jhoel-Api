import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ListActiveNewsTypesUseCase } from '../../../news-types/application/use-cases/list-active-news-types.use-case';
import { PublicNewsTypeResponseDto } from '../../../news-types/presentation/dtos/news-type.response.dto';
import { SubscribeToNewsUseCase } from '../../application/use-cases/subscribe-to-news.use-case';
import { GetSubscriptionByTokenUseCase } from '../../application/use-cases/get-subscription-by-token.use-case';
import { UpdateSubscriptionPreferencesUseCase } from '../../application/use-cases/update-subscription-preferences.use-case';
import { UnsubscribeUseCase } from '../../application/use-cases/unsubscribe.use-case';
import { SubscribeToNewsRequestDto } from '../dtos/subscribe-to-news.request.dto';
import { UpdateSubscriptionPreferencesRequestDto } from '../dtos/update-subscription-preferences.request.dto';
import { SubscriptionResponseDto } from '../dtos/news-subscriber.response.dto';

/**
 * Público, sin guard — backs la sección "Recibe nuestras noticias por
 * WhatsApp" de la landing y la página de autoservicio de preferencias
 * (`/noticias/preferencias/:token`). `:token` nunca es el número de
 * WhatsApp — es el `manageToken` opaco generado al suscribirse (punto 19
 * del pedido: no usar el número como autenticación).
 *
 * Rutas literales (`types`, `subscribe`) declaradas antes que `:token`
 * para que Nest nunca las confunda con un token — mismo criterio ya usado
 * en `SalesController` (`GET /sales/current` antes de `GET /sales/:id`).
 */
@Controller('public-news-subscriptions')
export class PublicNewsSubscriptionController {
  constructor(
    private readonly listActiveNewsTypesUseCase: ListActiveNewsTypesUseCase,
    private readonly subscribeToNewsUseCase: SubscribeToNewsUseCase,
    private readonly getSubscriptionByTokenUseCase: GetSubscriptionByTokenUseCase,
    private readonly updateSubscriptionPreferencesUseCase: UpdateSubscriptionPreferencesUseCase,
    private readonly unsubscribeUseCase: UnsubscribeUseCase,
  ) {}

  @Get('types')
  listTypes(): Promise<PublicNewsTypeResponseDto[]> {
    return this.listActiveNewsTypesUseCase.execute();
  }

  @Post('subscribe')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  subscribe(@Body() dto: SubscribeToNewsRequestDto): Promise<SubscriptionResponseDto> {
    return this.subscribeToNewsUseCase.execute(dto);
  }

  @Get(':token')
  getByToken(@Param('token') token: string): Promise<SubscriptionResponseDto> {
    return this.getSubscriptionByTokenUseCase.execute(token);
  }

  @Patch(':token')
  updatePreferences(
    @Param('token') token: string,
    @Body() dto: UpdateSubscriptionPreferencesRequestDto,
  ): Promise<SubscriptionResponseDto> {
    return this.updateSubscriptionPreferencesUseCase.execute(token, dto.typeIds);
  }

  @Post(':token/unsubscribe')
  @HttpCode(HttpStatus.OK)
  unsubscribe(@Param('token') token: string): Promise<void> {
    return this.unsubscribeUseCase.execute(token);
  }
}
