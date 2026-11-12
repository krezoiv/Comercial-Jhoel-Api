# Mapa de CatalogProductRequestsController

Módulo: **Catálogo de productos (product-catalog)** · Fuente editable: [`catalogproductrequestscontroller.mmd`](catalogproductrequestscontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["CatalogProductRequestService<br/><small>app/core/services/catalog-product-request.service.ts</small>"]
  n3["CatalogProductRequestsPageComponent<br/><small>app/features/dashboard/catalog-product-requests/catalog-product-requests-page.component.ts</small>"]
  n4["CatalogProductRequestDetailModalComponent<br/><small>app/features/dashboard/catalog-product-requests/components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component.ts</small>"]
  end
  subgraph s5["CatalogProductRequestsController (api/product-catalog/presentation/controllers/catalog-product-requests.controller.ts)"]
  n6["GET /api/catalog/product-requests<br/><small>findAll() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n7["GET /api/catalog/product-requests/:id<br/><small>findOne() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n8["PATCH /api/catalog/product-requests/:id/status<br/><small>updateStatus() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  end
  subgraph s9["Aplicación"]
  n10["ListCatalogProductRequestsUseCase<br/><small>api/product-catalog/application/use-cases/list-catalog-product-requests.use-case.ts</small>"]
  n11["GetCatalogProductRequestByIdUseCase<br/><small>api/product-catalog/application/use-cases/get-catalog-product-request-by-id.use-case.ts</small>"]
  n12["UpdateCatalogProductRequestStatusUseCase<br/><small>api/product-catalog/application/use-cases/update-catalog-product-request-status.use-case.ts</small>"]
  end
  subgraph s13["Dominio · Infraestructura · PostgreSQL"]
  n14["CatalogProductRequestRepository"]
  n15["TypeOrmCatalogProductRequestRepository<br/><small>api/product-catalog/infrastructure/persistence/typeorm-catalog-product-request.repository.ts</small>"]
  end
  n3 -->|fetchRequests→getRequests| n2
  n4 -->|save→updateStatus| n2
  n2 -->|getRequests| n6
  n2 -->|getRequestById| n7
  n2 -->|updateStatus| n8
  n6 --> n10
  n7 --> n11
  n8 --> n12
  n10 -->|findAll| n14
  n14 -->|implementa| n15
  n11 -->|findById| n14
  n12 -->|findById, updateStatus| n14
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
  class n6,n7,n8 api
  class n10,n11,n12 app
  class n14 dom
  class n15 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a CatalogProductRequestsController, sus 3 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-product-requests.controller.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-product-requests.controller.ts), [`comercial-jhoel-app/src/app/core/services/catalog-product-request.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/catalog-product-request.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/catalog-product-requests-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/catalog-product-requests-page.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-product-requests/components/catalog-product-request-detail-modal/catalog-product-request-detail-modal.component.ts), [`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/list-catalog-product-requests.use-case.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/list-catalog-product-requests.use-case.ts), [`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-catalog-product-request-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-catalog-product-request-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/update-catalog-product-request-status.use-case.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/update-catalog-product-request-status.use-case.ts), [`comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product-request.repository.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product-request.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/product-catalog/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
