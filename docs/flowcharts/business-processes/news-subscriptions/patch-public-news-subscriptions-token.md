# PATCH /api/public-news-subscriptions/:token

Módulo: **Suscripciones a noticias (Web Push) (news-subscriptions)** · Fuente editable: [`patch-public-news-subscriptions-token.mmd`](patch-public-news-subscriptions-token.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta PATCH /api/public-news-subscriptions/:token"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["PublicNewsSubscriptionService.updatePreferences<br/><small>app/core/services/public-news-subscription.service.ts</small>"]
  n6["NewsPreferencesPageComponent.save<br/><small>app/features/news-preferences/news-preferences-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP PATCH /api/public-news-subscriptions/:token<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿UpdateSubscriptionPreferencesRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n11(["400 Datos inválidos"])
  n12["PublicNewsSubscriptionController.updatePreferences<br/><small>api/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts</small>"]
  end
  subgraph s13["Aplicación — caso de uso"]
  n14["UpdateSubscriptionPreferencesUseCase.execute<br/><small>api/news-subscriptions/application/use-cases/update-subscription-preferences.use-case.ts</small>"]
  n15{"¿!subscriber?<br/><small>L28</small>"}
  n16(["NewsSubscriberNotFoundError()"])
  n17{"¿uniqueTypeIds.length === 0?<br/><small>L33</small>"}
  n18(["AtLeastOneNewsTypeRequiredError()"])
  n19{"¿!type #124;#124; !type.isActive?<br/><small>L38</small>"}
  n20(["InvalidNewsTypeError()"])
  end
  n21["Puerto NewsTypeRepository<br/><small>findById</small>"]
  subgraph s22["Dominio → Infraestructura"]
  n23["Puerto NewsSubscriberRepository.findByManageToken / replaceTypes / recordAudit<br/>@Inject(NEWS_SUBSCRIBER_REPOSITORY)"]
  n24["TypeOrmNewsSubscriberRepository<br/><small>api/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts</small>"]
  n25[("findByManageToken: TypeORM Repository")]
  n26[("replaceTypes: TypeORM Repository")]
  n27[("recordAudit: TypeORM Repository")]
  end
  n28(["Fin: la interfaz se actualiza<br/>this.errorMessage.set<br/>this.successMessage.set<br/>this.isSaving.set<br/>this.subscription.set"])
  n2 --> n3
  n1 -->|acción del usuario| n6
  n6 --> n5
  n5 --> n7
  n7 -->|sí| n10
  n10 -->|no| n11
  n11 --> n2
  n10 -->|sí| n12
  n12 --> n14
  n14 --> n15
  n15 -->|sí| n16
  n16 --> n2
  n15 -->|no| n17
  n17 -->|sí| n18
  n18 --> n2
  n17 -->|no| n19
  n19 -->|sí| n20
  n20 --> n2
  n14 -.->|consulta| n21
  n19 -->|no| n23
  n23 -->|implementa| n24
  n24 --> n25
  n25 --> n8
  n24 --> n26
  n26 --> n8
  n24 --> n27
  n27 --> n8
  n8 --> n28
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
  class n2,n3,n11,n16,n18,n20 err
  class n5,n6,n7 fe
  class n8,n28 ok
  class n10,n15,n17,n19 dec
  class n12 api
  class n14 app
  class n21,n23 dom
  class n24 infra
  class n25,n26,n27 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de PATCH /api/public-news-subscriptions/:token: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** NewsPreferencesPageComponent.save (comercial-jhoel-app/src/app/features/news-preferences/news-preferences-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts), [`comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/public-news-subscription.service.ts), [`comercial-jhoel-app/src/app/features/news-preferences/news-preferences-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/news-preferences/news-preferences-page.component.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/update-subscription-preferences.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/update-subscription-preferences.use-case.ts), [`comercial-jhoel-api/src/modules/news-types/domain/repositories/news-type.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-types/domain/repositories/news-type.repository.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/domain/repositories/news-subscriber.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/domain/repositories/news-subscriber.repository.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** DTO UpdateSubscriptionPreferencesRequestDto | !subscriber | uniqueTypeIds.length === 0 | !type || !type.isActive
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
