# Mapa de PublicCatalogBanksController

Módulo: **Catálogo de bancos (catalog-banks)** · Fuente editable: [`publiccatalogbankscontroller.mmd`](publiccatalogbankscontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["PublicCatalogBankService<br/><small>app/core/services/public-catalog-bank.service.ts</small>"]
  end
  subgraph s3["PublicCatalogBanksController (api/catalog-banks/presentation/controllers/public-catalog-banks.controller.ts)"]
  n4["GET /api/public-catalog-banks<br/><small>findAll()</small>"]
  n5["GET /api/public-catalog-banks/images/:id<br/><small>getImage()</small>"]
  n6["GET /api/public-catalog-banks/:id<br/><small>findOne()</small>"]
  end
  subgraph s7["Aplicación"]
  n8["ListPublishedCatalogBanksUseCase<br/><small>api/catalog-banks/application/use-cases/list-published-catalog-banks.use-case.ts</small>"]
  n9["GetCatalogBankImageUseCase<br/><small>api/catalog-banks/application/use-cases/get-catalog-bank-image.use-case.ts</small>"]
  n10["GetPublishedCatalogBankByIdUseCase<br/><small>api/catalog-banks/application/use-cases/get-published-catalog-bank-by-id.use-case.ts</small>"]
  end
  subgraph s11["Dominio · Infraestructura · PostgreSQL"]
  n12["CatalogBankRepository"]
  n13["TypeOrmCatalogBankRepository<br/><small>api/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts</small>"]
  end
  n2 -->|getPublishedBanks| n4
  n4 --> n8
  n5 --> n9
  n6 --> n10
  n8 -->|findPublished| n12
  n12 -->|implementa| n13
  n9 -->|getImage| n12
  n10 -->|findById| n12
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
  class n4,n5,n6 api
  class n8,n9,n10 app
  class n12 dom
  class n13 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a PublicCatalogBanksController, sus 3 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/public-catalog-banks.controller.ts`](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/public-catalog-banks.controller.ts), [`comercial-jhoel-app/src/app/core/services/public-catalog-bank.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/public-catalog-bank.service.ts), [`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/list-published-catalog-banks.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/list-published-catalog-banks.use-case.ts), [`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/get-catalog-bank-image.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/get-catalog-bank-image.use-case.ts), [`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/get-published-catalog-bank-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/get-published-catalog-bank-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts`](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/catalog-banks/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
