# Mapa de NewsSubscribersController

Módulo: **Suscripciones a noticias (Web Push) (news-subscriptions)** · Fuente editable: [`newssubscriberscontroller.mmd`](newssubscriberscontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["NewsSubscriberService<br/><small>app/core/services/news-subscriber.service.ts</small>"]
  n3["NewsSubscribersPageComponent<br/><small>app/features/dashboard/news-subscribers/news-subscribers-page.component.ts</small>"]
  end
  subgraph s4["NewsSubscribersController (api/news-subscriptions/presentation/controllers/news-subscribers.controller.ts)"]
  n5["GET /api/news-subscribers<br/><small>findAll() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n6["GET /api/news-subscribers/:id<br/><small>findOne() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n7["POST /api/news-subscribers/:id/activate<br/><small>activate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n8["DELETE /api/news-subscribers/:id<br/><small>deactivate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  end
  subgraph s9["Aplicación"]
  n10["ListNewsSubscribersUseCase<br/><small>api/news-subscriptions/application/use-cases/list-news-subscribers.use-case.ts</small>"]
  n11["GetNewsSubscriberByIdUseCase<br/><small>api/news-subscriptions/application/use-cases/get-news-subscriber-by-id.use-case.ts</small>"]
  n12["SetNewsSubscriberActiveUseCase<br/><small>api/news-subscriptions/application/use-cases/set-news-subscriber-active.use-case.ts</small>"]
  end
  subgraph s13["Dominio · Infraestructura · PostgreSQL"]
  n14["NewsSubscriberRepository"]
  n15["TypeOrmNewsSubscriberRepository<br/><small>api/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts</small>"]
  n16["NewsPushSubscriptionRepository"]
  n17["TypeOrmNewsPushSubscriptionRepository<br/><small>api/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts</small>"]
  end
  n3 -->|fetchSubscribers→getSubscribers, view→getSubscriberById, toggleActive→activateSubscriber …| n2
  n2 -->|getSubscribers| n5
  n2 -->|getSubscriberById| n6
  n2 -->|activateSubscriber| n7
  n2 -->|deactivateSubscriber| n8
  n5 --> n10
  n6 --> n11
  n7 --> n12
  n8 --> n12
  n10 -->|findAll| n14
  n14 -->|implementa| n15
  n11 -->|findById, findAuditLog| n14
  n11 -->|findBySubscriber| n16
  n16 -->|implementa| n17
  n12 -->|findById, setActive, recordAudit| n14
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
  class n2,n3 fe
  class n5,n6,n7,n8 api
  class n10,n11,n12 app
  class n14,n16 dom
  class n15,n17 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a NewsSubscribersController, sus 4 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/news-subscribers.controller.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/news-subscribers.controller.ts), [`comercial-jhoel-app/src/app/core/services/news-subscriber.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/news-subscriber.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/news-subscribers/news-subscribers-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/news-subscribers/news-subscribers-page.component.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/list-news-subscribers.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/list-news-subscribers.use-case.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/get-news-subscriber-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/get-news-subscriber-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/set-news-subscriber-active.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/set-news-subscriber-active.use-case.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts), [`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/news-subscriptions/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
