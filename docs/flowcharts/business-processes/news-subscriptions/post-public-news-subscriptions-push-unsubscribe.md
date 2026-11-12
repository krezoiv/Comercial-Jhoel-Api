# POST /api/public-news-subscriptions/push/unsubscribe

Módulo: **Suscripciones a noticias (Web Push) (news-subscriptions)** · Fuente editable: [`post-public-news-subscriptions-push-unsubscribe.mmd`](post-public-news-subscriptions-push-unsubscribe.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/public-news-subscriptions/push/unsubscribe"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["PublicNewsSubscriptionService.unregisterPush<br/><small>app/core/services/public-news-subscription.service.ts</small>"]
  n6["PushNotificationService.unsubscribe<br/><small>app/core/services/push-notification.service.ts</small>"]
  n7["HTTP POST /api/public-news-subscriptions/push/unsubscribe<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿UnregisterPushSubscriptionRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n11(["400 Datos inválidos"])
  n12["PublicNewsSubscriptionController.unregisterPush<br/><small>api/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts</small>"]
  end
  subgraph s13["Aplicación — caso de uso"]
  n14["UnregisterPushSubscriptionUseCase.execute<br/><small>api/news-subscriptions/application/use-cases/unregister-push-subscription.use-case.ts</small>"]
  end
  subgraph s15["Dominio → Infraestructura"]
  n16["Puerto NewsPushSubscriptionRepository.deactivateByEndpoint<br/>@Inject(NEWS_PUSH_SUBSCRIPTION_REPOSITORY)"]
  n17["TypeOrmNewsPushSubscriptionRepository<br/><small>api/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts</small>"]
  n18[("deactivateByEndpoint: TypeORM Repository")]
  end
  n19(["Fin: la interfaz se actualiza<br/>this.isBusy.set<br/>this.isSubscribed.set"])
  n2 --> n3
  n1 -->|acción del usuario| n6
  n6 --> n5
  n5 --> n7
  n7 -->|sí| n10
  n10 -->|no| n11
  n11 --> n2
  n10 -->|sí| n12
  n12 --> n14
  n14 --> n16
  n16 -->|implementa| n17
  n17 --> n18
  n18 --> n8
  n8 --> n19
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
  class n1 start
  class n2,n3,n11 err
  class n5,n6,n7 fe
  class n8,n19 ok
  class n10 dec
  class n12 api
  class n14 app
  class n16 dom
  class n17 infra
  class n18 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/public-news-subscriptions/push/unsubscribe: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** PushNotificationService.unsubscribe (comercial-jhoel-app/src/app/core/services/push-notification.service.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts), [`comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts), [`comercial-jhoel-app/src/app/core/services/push-notification.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/push-notification.service.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/unregister-push-subscription.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/unregister-push-subscription.use-case.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/domain/repositories/news-push-subscription.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/domain/repositories/news-push-subscription.repository.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** DTO UnregisterPushSubscriptionRequestDto
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
