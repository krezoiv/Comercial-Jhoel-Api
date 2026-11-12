# Mapa de PublicLandingBackgroundsController

Módulo: **Fondos de la landing (landing-backgrounds)** · Fuente editable: [`publiclandingbackgroundscontroller.mmd`](publiclandingbackgroundscontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["PublicLandingBackgroundService<br/><small>app/core/services/public-landing-background.service.ts</small>"]
  end
  subgraph s3["PublicLandingBackgroundsController (api/landing-backgrounds/presentation/controllers/public-landing-backgrounds.controller.ts)"]
  n4["GET /api/public-landing-backgrounds<br/><small>findAll()</small>"]
  n5["GET /api/public-landing-backgrounds/images/:id<br/><small>getImage()</small>"]
  end
  subgraph s6["Aplicación"]
  n7["ListPublishedLandingBackgroundsUseCase<br/><small>api/landing-backgrounds/application/use-cases/list-published-landing-backgrounds.use-case.ts</small>"]
  n8["GetLandingBackgroundImageUseCase<br/><small>api/landing-backgrounds/application/use-cases/get-landing-background-image.use-case.ts</small>"]
  end
  subgraph s9["Dominio · Infraestructura · PostgreSQL"]
  n10["LandingBackgroundRepository"]
  n11["TypeOrmLandingBackgroundRepository<br/><small>api/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts</small>"]
  end
  n2 -->|getPublishedBackgrounds| n4
  n4 --> n7
  n5 --> n8
  n7 -->|findPublished| n10
  n10 -->|implementa| n11
  n8 -->|getImage| n10
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
  class n2 fe
  class n4,n5 api
  class n7,n8 app
  class n10 dom
  class n11 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a PublicLandingBackgroundsController, sus 2 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/public-landing-backgrounds.controller.ts`](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/public-landing-backgrounds.controller.ts), [`comercial-jhoel-app/src/app/core/services/public-landing-background.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/public-landing-background.service.ts), [`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/list-published-landing-backgrounds.use-case.ts`](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/list-published-landing-backgrounds.use-case.ts), [`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/get-landing-background-image.use-case.ts`](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/get-landing-background-image.use-case.ts), [`comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts`](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/landing-backgrounds/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
