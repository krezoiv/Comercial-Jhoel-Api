import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsTypesModule } from '../news-types/news-types.module';
import { NewsSubscriberOrmEntity } from './infrastructure/persistence/news-subscriber.orm-entity';
import { NewsSubscriberTypeOrmEntity } from './infrastructure/persistence/news-subscriber-type.orm-entity';
import { NewsSubscriberAuditLogOrmEntity } from './infrastructure/persistence/news-subscriber-audit-log.orm-entity';
import { NewsPushSubscriptionOrmEntity } from './infrastructure/persistence/news-push-subscription.orm-entity';
import { TypeOrmNewsSubscriberRepository } from './infrastructure/persistence/typeorm-news-subscriber.repository';
import { TypeOrmNewsPushSubscriptionRepository } from './infrastructure/persistence/typeorm-news-push-subscription.repository';
import { WebPushSenderService } from './infrastructure/services/web-push-sender.service';
import { NEWS_SUBSCRIBER_REPOSITORY } from './domain/repositories/news-subscriber.repository';
import { NEWS_PUSH_SUBSCRIPTION_REPOSITORY } from './domain/repositories/news-push-subscription.repository';
import { PUSH_SENDER } from './application/ports/push-sender.port';
import { SubscribeToNewsUseCase } from './application/use-cases/subscribe-to-news.use-case';
import { GetSubscriptionByTokenUseCase } from './application/use-cases/get-subscription-by-token.use-case';
import { UpdateSubscriptionPreferencesUseCase } from './application/use-cases/update-subscription-preferences.use-case';
import { UnsubscribeUseCase } from './application/use-cases/unsubscribe.use-case';
import { ListNewsSubscribersUseCase } from './application/use-cases/list-news-subscribers.use-case';
import { GetNewsSubscriberByIdUseCase } from './application/use-cases/get-news-subscriber-by-id.use-case';
import { SetNewsSubscriberActiveUseCase } from './application/use-cases/set-news-subscriber-active.use-case';
import { RegisterPushSubscriptionUseCase } from './application/use-cases/register-push-subscription.use-case';
import { UnregisterPushSubscriptionUseCase } from './application/use-cases/unregister-push-subscription.use-case';
import { SendPushForArticleUseCase } from './application/use-cases/send-push-for-article.use-case';
import { NewsSubscribersController } from './presentation/controllers/news-subscribers.controller';
import { PublicNewsSubscriptionController } from './presentation/controllers/public-news-subscription.controller';

/**
 * Suscripción de clientes a Noticias — suscriptores, preferencias (M:N
 * normalizada contra `NewsTypesModule`), consentimiento, bitácora, y
 * ahora Web Push (VAPID) multidispositivo (`news_push_subscriptions`) —
 * reemplaza, para avisar de una noticia nueva, al envío automático por
 * WhatsApp removido en 693299a. El mismo `NewsSubscriber`/`manageToken`/
 * `news_subscriber_types` sirve para ambos canales — un suscriptor
 * solo-push simplemente tiene `whatsappNumber: null`, nunca una tabla de
 * suscriptores paralela.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      NewsSubscriberOrmEntity,
      NewsSubscriberTypeOrmEntity,
      NewsSubscriberAuditLogOrmEntity,
      NewsPushSubscriptionOrmEntity,
    ]),
    NewsTypesModule,
  ],
  controllers: [NewsSubscribersController, PublicNewsSubscriptionController],
  providers: [
    { provide: NEWS_SUBSCRIBER_REPOSITORY, useClass: TypeOrmNewsSubscriberRepository },
    { provide: NEWS_PUSH_SUBSCRIPTION_REPOSITORY, useClass: TypeOrmNewsPushSubscriptionRepository },
    { provide: PUSH_SENDER, useClass: WebPushSenderService },
    SubscribeToNewsUseCase,
    GetSubscriptionByTokenUseCase,
    UpdateSubscriptionPreferencesUseCase,
    UnsubscribeUseCase,
    ListNewsSubscribersUseCase,
    GetNewsSubscriberByIdUseCase,
    SetNewsSubscriberActiveUseCase,
    RegisterPushSubscriptionUseCase,
    UnregisterPushSubscriptionUseCase,
    SendPushForArticleUseCase,
  ],
  exports: [SendPushForArticleUseCase],
})
export class NewsSubscriptionsModule {}
