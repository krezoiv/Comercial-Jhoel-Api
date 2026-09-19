import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsTypesModule } from '../news-types/news-types.module';
import { NewsSubscriberOrmEntity } from './infrastructure/persistence/news-subscriber.orm-entity';
import { NewsSubscriberTypeOrmEntity } from './infrastructure/persistence/news-subscriber-type.orm-entity';
import { NewsSubscriberAuditLogOrmEntity } from './infrastructure/persistence/news-subscriber-audit-log.orm-entity';
import { TypeOrmNewsSubscriberRepository } from './infrastructure/persistence/typeorm-news-subscriber.repository';
import { NEWS_SUBSCRIBER_REPOSITORY } from './domain/repositories/news-subscriber.repository';
import { SubscribeToNewsUseCase } from './application/use-cases/subscribe-to-news.use-case';
import { GetSubscriptionByTokenUseCase } from './application/use-cases/get-subscription-by-token.use-case';
import { UpdateSubscriptionPreferencesUseCase } from './application/use-cases/update-subscription-preferences.use-case';
import { UnsubscribeUseCase } from './application/use-cases/unsubscribe.use-case';
import { ListNewsSubscribersUseCase } from './application/use-cases/list-news-subscribers.use-case';
import { GetNewsSubscriberByIdUseCase } from './application/use-cases/get-news-subscriber-by-id.use-case';
import { SetNewsSubscriberActiveUseCase } from './application/use-cases/set-news-subscriber-active.use-case';
import { NewsSubscribersController } from './presentation/controllers/news-subscribers.controller';
import { PublicNewsSubscriptionController } from './presentation/controllers/public-news-subscription.controller';

/**
 * Suscripción de clientes a Noticias — suscriptores, preferencias (M:N
 * normalizada contra `NewsTypesModule`), consentimiento y bitácora.
 *
 * El envío automático real por WhatsApp Cloud API (que existió en este
 * módulo — `WhatsAppSender`, `MetaCloudApiWhatsAppSender`,
 * `CreateNewsNotificationsForArticleUseCase`, `SendPendingNewsNotifications
 * UseCase`) fue removido deliberadamente a pedido del negocio — nunca se
 * completó la integración con Meta (la WABA quedó en un estado de cuenta
 * no resuelto del lado de Meta). La tabla `news_notifications` sigue
 * existiendo en la base de datos con su histórico intacto, pero ya no se
 * lee ni se escribe desde ningún lugar de la aplicación. Si en el futuro
 * se retoma el envío real, ese es el punto natural para reconstruirlo —
 * este módulo ya tiene todo lo necesario (suscriptores, preferencias,
 * consentimiento) para alimentarlo de nuevo.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([NewsSubscriberOrmEntity, NewsSubscriberTypeOrmEntity, NewsSubscriberAuditLogOrmEntity]),
    NewsTypesModule,
  ],
  controllers: [NewsSubscribersController, PublicNewsSubscriptionController],
  providers: [
    { provide: NEWS_SUBSCRIBER_REPOSITORY, useClass: TypeOrmNewsSubscriberRepository },
    SubscribeToNewsUseCase,
    GetSubscriptionByTokenUseCase,
    UpdateSubscriptionPreferencesUseCase,
    UnsubscribeUseCase,
    ListNewsSubscribersUseCase,
    GetNewsSubscriberByIdUseCase,
    SetNewsSubscriberActiveUseCase,
  ],
})
export class NewsSubscriptionsModule {}
