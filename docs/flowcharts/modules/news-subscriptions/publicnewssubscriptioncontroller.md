# Mapa de PublicNewsSubscriptionController

Módulo: **Suscripciones a noticias (Web Push) (news-subscriptions)** · Fuente editable: [`publicnewssubscriptioncontroller.mmd`](publicnewssubscriptioncontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["PublicNewsSubscriptionService<br/><small>app/core/services/public-news-subscription.service.ts</small>"]
  n3["PushNotificationService<br/><small>app/core/services/push-notification.service.ts</small>"]
  n4["NewsPreferencesPageComponent<br/><small>app/features/news-preferences/news-preferences-page.component.ts</small>"]
  end
  subgraph s5["PublicNewsSubscriptionController (api/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts)"]
  n6["GET /api/public-news-subscriptions/types<br/><small>listTypes()</small>"]
  n7["POST /api/public-news-subscriptions/subscribe<br/><small>subscribe()</small>"]
  n8["GET /api/public-news-subscriptions/push/vapid-public-key<br/><small>getVapidPublicKey()</small>"]
  n9["POST /api/public-news-subscriptions/push/subscribe<br/><small>registerPush()</small>"]
  n10["POST /api/public-news-subscriptions/push/unsubscribe<br/><small>unregisterPush()</small>"]
  n11["GET /api/public-news-subscriptions/:token<br/><small>getByToken()</small>"]
  n12["PATCH /api/public-news-subscriptions/:token<br/><small>updatePreferences()</small>"]
  n13["POST /api/public-news-subscriptions/:token/unsubscribe<br/><small>unsubscribe()</small>"]
  end
  subgraph s14["Aplicación"]
  n15["ListActiveNewsTypesUseCase<br/><small>api/news-types/application/use-cases/list-active-news-types.use-case.ts</small>"]
  n16["SubscribeToNewsUseCase<br/><small>api/news-subscriptions/application/use-cases/subscribe-to-news.use-case.ts</small>"]
  n17["RegisterPushSubscriptionUseCase<br/><small>api/news-subscriptions/application/use-cases/register-push-subscription.use-case.ts</small>"]
  n18["UnregisterPushSubscriptionUseCase<br/><small>api/news-subscriptions/application/use-cases/unregister-push-subscription.use-case.ts</small>"]
  n19["GetSubscriptionByTokenUseCase<br/><small>api/news-subscriptions/application/use-cases/get-subscription-by-token.use-case.ts</small>"]
  n20["UpdateSubscriptionPreferencesUseCase<br/><small>api/news-subscriptions/application/use-cases/update-subscription-preferences.use-case.ts</small>"]
  n21["UnsubscribeUseCase<br/><small>api/news-subscriptions/application/use-cases/unsubscribe.use-case.ts</small>"]
  end
  subgraph s22["Dominio · Infraestructura · PostgreSQL"]
  n23["NewsTypeRepository"]
  n24["TypeOrmNewsTypeRepository<br/><small>api/news-types/infrastructure/persistence/typeorm-news-type.repository.ts</small>"]
  n25["NewsSubscriberRepository"]
  n26["TypeOrmNewsSubscriberRepository<br/><small>api/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts</small>"]
  n27["NewsPushSubscriptionRepository"]
  n28["TypeOrmNewsPushSubscriptionRepository<br/><small>api/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts</small>"]
  end
  n3 -->|subscribe→getVapidPublicKey, subscribe→registerPush, unsubscribe→unregisterPush| n2
  n4 -->|save→updatePreferences, cancelSubscription→unsubscribe| n2
  n2 -->|getActiveTypes| n6
  n2 -->|subscribe| n7
  n2 -->|getVapidPublicKey| n8
  n2 -->|registerPush| n9
  n2 -->|unregisterPush| n10
  n2 -->|getByToken| n11
  n2 -->|updatePreferences| n12
  n2 -->|unsubscribe| n13
  n6 --> n15
  n7 --> n16
  n9 --> n17
  n10 --> n18
  n11 --> n19
  n12 --> n20
  n13 --> n21
  n15 -->|findAll| n23
  n23 -->|implementa| n24
  n16 -->|findActiveByWhatsapp, replaceTypes, setConsent …| n25
  n25 -->|implementa| n26
  n16 -->|findById| n23
  n17 -->|findByManageToken, replaceTypes, setConsent …| n25
  n17 -->|upsertByEndpoint| n27
  n27 -->|implementa| n28
  n17 -->|findById| n23
  n18 -->|deactivateByEndpoint| n27
  n19 -->|findByManageToken| n25
  n20 -->|findByManageToken, replaceTypes, recordAudit| n25
  n20 -->|findById| n23
  n21 -->|findByManageToken, setActive, recordAudit| n25
  classDef start fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20
  classDef fe fill:#e3f2fd,stroke:#1565c0,color:#0d47a1
  classDef api fill:#ede7f6,stroke:#4527a0,color:#311b92
  classDef app fill:#e0f2f1,stroke:#00695c,color:#004d40
  classDef dom fill:#fff8e1,stroke:#f9a825,color:#5d4037
  classDef infra fill:#f3e5f5,stroke:#6a1b9a,color:#4a148c
  classDef db fill:#eceff1,stroke:#455a64,color:#263238
  classDef dec fill:#fffde7,stroke:#f57f17,color:#3e2723
  classDef err fill:#ffebee,stroke:#c62828,color:#b71c1c
  classDef ok fill:#e8f5e9,stroke:#1b5e20,color:#1b5e20
  class n2,n3,n4 fe
  class n6,n7,n8,n9,n10,n11,n12,n13 api
  class n15,n16,n17,n18,n19,n20,n21 app
  class n23,n25,n27 dom
  class n24,n26,n28 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a PublicNewsSubscriptionController, sus 8 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts), [`comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts), [`comercial-jhoel-app/src/app/core/services/push-notification.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/push-notification.service.ts), [`comercial-jhoel-app/src/app/features/news-preferences/news-preferences-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/news-preferences/news-preferences-page.component.ts), [`comercial-jhoel-api/src/modules/news-types/application/use-cases/list-active-news-types.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/list-active-news-types.use-case.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/subscribe-to-news.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/subscribe-to-news.use-case.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/register-push-subscription.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/register-push-subscription.use-case.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/unregister-push-subscription.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/unregister-push-subscription.use-case.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/get-subscription-by-token.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/get-subscription-by-token.use-case.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/update-subscription-preferences.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/update-subscription-preferences.use-case.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/unsubscribe.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/unsubscribe.use-case.ts), [`comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/news-subscriptions/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
