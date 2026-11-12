# POST /api/public-news-subscriptions/subscribe

Módulo: **Suscripciones a noticias (Web Push) (news-subscriptions)** · Fuente editable: [`post-public-news-subscriptions-subscribe.mmd`](post-public-news-subscriptions-subscribe.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/public-news-subscriptions/subscribe"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["PublicNewsSubscriptionService.subscribe<br/><small>app/core/services/public-news-subscription.service.ts</small>"]
  n6["HTTP POST /api/public-news-subscriptions/subscribe<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n7["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s8["API NestJS — presentación"]
  n9{"¿Dentro del límite de intentos?<br/>(ThrottlerGuard + @Throttle)"}
  n10(["429 Demasiadas solicitudes"])
  n11{"¿SubscribeToNewsRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n12(["400 Datos inválidos"])
  n13["PublicNewsSubscriptionController.subscribe<br/><small>api/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts</small>"]
  end
  subgraph s14["Aplicación — caso de uso"]
  n15["SubscribeToNewsUseCase.execute<br/><small>api/news-subscriptions/application/use-cases/subscribe-to-news.use-case.ts</small>"]
  n16{"¿!input.consent?<br/><small>L37</small>"}
  n17(["ConsentRequiredError()"])
  n18{"¿typeIds.length === 0?<br/><small>L41</small>"}
  n19(["AtLeastOneNewsTypeRequiredError()"])
  n20{"¿!type #124;#124; !type.isActive?<br/><small>L46</small>"}
  n21(["InvalidNewsTypeError()"])
  end
  n22["Puerto NewsTypeRepository<br/><small>findById</small>"]
  subgraph s23["Dominio → Infraestructura"]
  n24["Puerto NewsSubscriberRepository.findActiveByWhatsapp / replaceTypes / setConsent / recordAudit / findById / createWithTypes<br/>@Inject(NEWS_SUBSCRIBER_REPOSITORY)"]
  n25["TypeOrmNewsSubscriberRepository<br/><small>api/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts</small>"]
  n26[("findById: TypeORM Repository")]
  n27[("findActiveByWhatsapp: TypeORM Repository")]
  n28[("createWithTypes: TypeORM Repository")]
  n29[("replaceTypes: TypeORM Repository")]
  n30[("setConsent: TypeORM Repository")]
  n31[("recordAudit: TypeORM Repository")]
  end
  n32(["Fin: la interfaz se actualiza"])
  n2 --> n3
  n1 --> n5
  n5 --> n6
  n6 --> n9
  n9 -->|no| n10
  n10 --> n2
  n9 -->|sí| n11
  n11 -->|no| n12
  n12 --> n2
  n11 -->|sí| n13
  n13 --> n15
  n15 --> n16
  n16 -->|sí| n17
  n17 --> n2
  n16 -->|no| n18
  n18 -->|sí| n19
  n19 --> n2
  n18 -->|no| n20
  n20 -->|sí| n21
  n21 --> n2
  n15 -.->|consulta| n22
  n20 -->|no| n24
  n24 -->|implementa| n25
  n25 --> n26
  n26 --> n7
  n25 --> n27
  n27 --> n7
  n25 --> n28
  n28 --> n7
  n25 --> n29
  n29 --> n7
  n25 --> n30
  n30 --> n7
  n25 --> n31
  n31 --> n7
  n7 --> n32
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
  class n2,n3,n10,n12,n17,n19,n21 err
  class n5,n6 fe
  class n7,n32 ok
  class n9,n11,n16,n18,n20 dec
  class n13 api
  class n15 app
  class n22,n24 dom
  class n25 infra
  class n26,n27,n28,n29,n30,n31 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/public-news-subscriptions/subscribe: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** PublicNewsSubscriptionService.subscribe
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts), [`comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/subscribe-to-news.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/subscribe-to-news.use-case.ts), [`comercial-jhoel-api/src/modules/news-types/domain/repositories/news-type.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-types/domain/repositories/news-type.repository.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/domain/repositories/news-subscriber.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/domain/repositories/news-subscriber.repository.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** límite de intentos (ThrottlerGuard) | DTO SubscribeToNewsRequestDto | !input.consent | typeIds.length === 0 | !type || !type.isActive
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
