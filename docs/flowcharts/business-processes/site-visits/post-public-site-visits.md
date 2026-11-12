# POST /api/public-site-visits

Módulo: **Visitas al sitio (site-visits)** · Fuente editable: [`post-public-site-visits.mmd`](post-public-site-visits.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/public-site-visits"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["SiteVisitsService.registerVisit<br/><small>app/core/services/site-visits.service.ts</small>"]
  n6["HTTP POST /api/public-site-visits<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n7["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s8["API NestJS — presentación"]
  n9{"¿Dentro del límite de intentos?<br/>(ThrottlerGuard + @Throttle)"}
  n10(["429 Demasiadas solicitudes"])
  n11["PublicSiteVisitsController.register<br/><small>api/site-visits/presentation/controllers/public-site-visits.controller.ts</small>"]
  end
  subgraph s12["Aplicación — caso de uso"]
  n13["RegisterVisitUseCase.execute<br/><small>api/site-visits/application/use-cases/register-visit.use-case.ts</small>"]
  end
  subgraph s14["Dominio → Infraestructura"]
  n15["Puerto SiteVisitsRepository.increment<br/>@Inject(SITE_VISITS_REPOSITORY)"]
  n16["TypeOrmSiteVisitsRepository<br/><small>api/site-visits/infrastructure/persistence/typeorm-site-visits.repository.ts</small>"]
  n17[("increment: SQL / TypeORM sobre<br/>site_visits")]
  end
  n18(["Fin: la interfaz se actualiza"])
  n2 --> n3
  n1 --> n5
  n5 --> n6
  n6 --> n9
  n9 -->|no| n10
  n10 --> n2
  n9 -->|sí| n11
  n11 --> n13
  n13 --> n15
  n15 -->|implementa| n16
  n16 --> n17
  n17 --> n7
  n7 --> n18
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
  class n2,n3,n10 err
  class n5,n6 fe
  class n7,n18 ok
  class n9 dec
  class n11 api
  class n13 app
  class n15 dom
  class n16 infra
  class n17 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/public-site-visits: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** SiteVisitsService.registerVisit
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/site-visits/presentation/controllers/public-site-visits.controller.ts`](../../../../comercial-jhoel-api/src/modules/site-visits/presentation/controllers/public-site-visits.controller.ts), [`comercial-jhoel-app/src/app/core/services/site-visits.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/site-visits.service.ts), [`comercial-jhoel-api/src/modules/site-visits/application/use-cases/register-visit.use-case.ts`](../../../../comercial-jhoel-api/src/modules/site-visits/application/use-cases/register-visit.use-case.ts), [`comercial-jhoel-api/src/modules/site-visits/domain/repositories/site-visits.repository.ts`](../../../../comercial-jhoel-api/src/modules/site-visits/domain/repositories/site-visits.repository.ts), [`comercial-jhoel-api/src/modules/site-visits/infrastructure/persistence/typeorm-site-visits.repository.ts`](../../../../comercial-jhoel-api/src/modules/site-visits/infrastructure/persistence/typeorm-site-visits.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** límite de intentos (ThrottlerGuard)
6. **¿Dónde se almacenan los datos?** site_visits
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
