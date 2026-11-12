# POST /api/public-news-subscriptions/push/subscribe

Módulo: **Suscripciones a noticias (Web Push) (news-subscriptions)** · Fuente editable: [`post-public-news-subscriptions-push-subscribe.mmd`](post-public-news-subscriptions-push-subscribe.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/public-news-subscriptions/push/subscribe"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["PublicNewsSubscriptionService.registerPush<br/><small>app/core/services/public-news-subscription.service.ts</small>"]
  n6["PushNotificationService.subscribe<br/><small>app/core/services/push-notification.service.ts</small>"]
  n7["HTTP POST /api/public-news-subscriptions/push/subscribe<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Dentro del límite de intentos?<br/>(ThrottlerGuard + @Throttle)"}
  n11(["429 Demasiadas solicitudes"])
  n12{"¿RegisterPushSubscriptionRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["PublicNewsSubscriptionController.registerPush<br/><small>api/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["RegisterPushSubscriptionUseCase.execute<br/><small>api/news-subscriptions/application/use-cases/register-push-subscription.use-case.ts</small>"]
  n17{"¿typeIds.length === 0?<br/><small>L53</small>"}
  n18(["AtLeastOneNewsTypeRequiredError()"])
  n19{"¿!type #124;#124; !type.isActive?<br/><small>L58</small>"}
  n20(["InvalidNewsTypeError()"])
  end
  n21["Puerto NewsTypeRepository<br/><small>findById</small>"]
  subgraph s22["Dominio → Infraestructura"]
  n23["Puerto NewsSubscriberRepository.findByManageToken / replaceTypes / setConsent / setActive / findById / createWithTypes / recordAudit<br/>@Inject(NEWS_SUBSCRIBER_REPOSITORY)"]
  n24["TypeOrmNewsSubscriberRepository<br/><small>api/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts</small>"]
  n25[("findById: TypeORM Repository")]
  n26[("findByManageToken: TypeORM Repository")]
  n27[("createWithTypes: TypeORM Repository")]
  n28[("replaceTypes: TypeORM Repository")]
  n29[("setConsent: TypeORM Repository")]
  n30[("setActive: TypeORM Repository")]
  n31[("recordAudit: TypeORM Repository")]
  end
  subgraph s32["Dominio → Infraestructura"]
  n33["Puerto NewsPushSubscriptionRepository.upsertByEndpoint<br/>@Inject(NEWS_PUSH_SUBSCRIPTION_REPOSITORY)"]
  n34["TypeOrmNewsPushSubscriptionRepository<br/><small>api/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts</small>"]
  n35[("upsertByEndpoint: TypeORM Repository")]
  end
  n36(["Fin: la interfaz se actualiza<br/>this.errorMessage.set<br/>this.isBusy.set<br/>this.isSubscribed.set"])
  n2 --> n3
  n1 -->|acción del usuario| n6
  n6 --> n5
  n5 --> n7
  n7 --> n10
  n10 -->|no| n11
  n11 --> n2
  n10 -->|sí| n12
  n12 -->|no| n13
  n13 --> n2
  n12 -->|sí| n14
  n14 --> n16
  n16 --> n17
  n17 -->|sí| n18
  n18 --> n2
  n17 -->|no| n19
  n19 -->|sí| n20
  n20 --> n2
  n16 -.->|consulta| n21
  n19 -->|no| n23
  n23 -->|implementa| n24
  n24 --> n25
  n25 --> n8
  n24 --> n26
  n26 --> n8
  n24 --> n27
  n27 --> n8
  n24 --> n28
  n28 --> n8
  n24 --> n29
  n29 --> n8
  n24 --> n30
  n30 --> n8
  n24 --> n31
  n31 --> n8
  n19 -->|no| n33
  n33 -->|implementa| n34
  n34 --> n35
  n35 --> n8
  n8 --> n36
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
  class n2,n3,n11,n13,n18,n20 err
  class n5,n6,n7 fe
  class n8,n36 ok
  class n10,n12,n17,n19 dec
  class n14 api
  class n16 app
  class n21,n23,n33 dom
  class n24,n34 infra
  class n25,n26,n27,n28,n29,n30,n31,n35 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/public-news-subscriptions/push/subscribe: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** PushNotificationService.subscribe (comercial-jhoel-app/src/app/core/services/push-notification.service.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts), [`comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts), [`comercial-jhoel-app/src/app/core/services/push-notification.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/push-notification.service.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/register-push-subscription.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/register-push-subscription.use-case.ts), [`comercial-jhoel-api/src/modules/news-types/domain/repositories/news-type.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-types/domain/repositories/news-type.repository.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/domain/repositories/news-subscriber.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/domain/repositories/news-subscriber.repository.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/domain/repositories/news-push-subscription.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/domain/repositories/news-push-subscription.repository.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** límite de intentos (ThrottlerGuard) | DTO RegisterPushSubscriptionRequestDto | typeIds.length === 0 | !type || !type.isActive
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
