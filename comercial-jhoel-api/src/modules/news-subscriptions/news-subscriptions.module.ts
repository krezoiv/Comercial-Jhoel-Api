import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsTypesModule } from '../news-types/news-types.module';
import { NewsSubscriberOrmEntity } from './infrastructure/persistence/news-subscriber.orm-entity';
import { NewsSubscriberTypeOrmEntity } from './infrastructure/persistence/news-subscriber-type.orm-entity';
import { NewsSubscriberAuditLogOrmEntity } from './infrastructure/persistence/news-subscriber-audit-log.orm-entity';
import { NewsNotificationOrmEntity } from './infrastructure/persistence/news-notification.orm-entity';
import { TypeOrmNewsSubscriberRepository } from './infrastructure/persistence/typeorm-news-subscriber.repository';
import { TypeOrmNewsNotificationRepository } from './infrastructure/persistence/typeorm-news-notification.repository';
import { NEWS_SUBSCRIBER_REPOSITORY } from './domain/repositories/news-subscriber.repository';
import { NEWS_NOTIFICATION_REPOSITORY } from './domain/repositories/news-notification.repository';
import { SubscribeToNewsUseCase } from './application/use-cases/subscribe-to-news.use-case';
import { GetSubscriptionByTokenUseCase } from './application/use-cases/get-subscription-by-token.use-case';
import { UpdateSubscriptionPreferencesUseCase } from './application/use-cases/update-subscription-preferences.use-case';
import { UnsubscribeUseCase } from './application/use-cases/unsubscribe.use-case';
import { ListNewsSubscribersUseCase } from './application/use-cases/list-news-subscribers.use-case';
import { GetNewsSubscriberByIdUseCase } from './application/use-cases/get-news-subscriber-by-id.use-case';
import { SetNewsSubscriberActiveUseCase } from './application/use-cases/set-news-subscriber-active.use-case';
import { CreateNewsNotificationsForArticleUseCase } from './application/use-cases/create-news-notifications-for-article.use-case';
import { NewsSubscribersController } from './presentation/controllers/news-subscribers.controller';
import { PublicNewsSubscriptionController } from './presentation/controllers/public-news-subscription.controller';

/**
 * Suscripción de clientes a Noticias por WhatsApp — suscriptores,
 * preferencias (M:N normalizada contra `NewsTypesModule`), consentimiento,
 * bitácora, y la cola de notificaciones preparada para un futuro proveedor
 * real de WhatsApp (ver el diagnóstico del plan: hoy no existe esa
 * integración, así que `CreateNewsNotificationsForArticleUseCase` solo
 * deja filas en `PENDING`, nunca envía nada). `NewsModule` importa este
 * módulo para llamar a ese único use case justo después de crear una
 * noticia nueva — nunca desde el flujo de edición.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      NewsSubscriberOrmEntity,
      NewsSubscriberTypeOrmEntity,
      NewsSubscriberAuditLogOrmEntity,
      NewsNotificationOrmEntity,
    ]),
    NewsTypesModule,
  ],
  controllers: [NewsSubscribersController, PublicNewsSubscriptionController],
  providers: [
    { provide: NEWS_SUBSCRIBER_REPOSITORY, useClass: TypeOrmNewsSubscriberRepository },
    { provide: NEWS_NOTIFICATION_REPOSITORY, useClass: TypeOrmNewsNotificationRepository },
    SubscribeToNewsUseCase,
    GetSubscriptionByTokenUseCase,
    UpdateSubscriptionPreferencesUseCase,
    UnsubscribeUseCase,
    ListNewsSubscribersUseCase,
    GetNewsSubscriberByIdUseCase,
    SetNewsSubscriberActiveUseCase,
    CreateNewsNotificationsForArticleUseCase,
  ],
  exports: [CreateNewsNotificationsForArticleUseCase],
})
export class NewsSubscriptionsModule {}
