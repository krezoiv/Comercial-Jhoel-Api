# Mapa de IceCreamsController

Módulo: **Heladería (ice-creams)** · Fuente editable: [`icecreamscontroller.mmd`](icecreamscontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["IceCreamService<br/><small>app/core/services/ice-cream.service.ts</small>"]
  n3["IceCreamFormModalComponent<br/><small>app/features/dashboard/ice-creams/inventory/components/ice-cream-form-modal/ice-cream-form-modal.component.ts</small>"]
  n4["IceCreamProductSearchComponent<br/><small>app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.ts</small>"]
  n5["IceCreamInventoryPageComponent<br/><small>app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.ts</small>"]
  end
  subgraph s6["IceCreamsController (api/ice-creams/presentation/controllers/ice-creams.controller.ts)"]
  n7["POST /api/ice-creams<br/><small>create() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n8["GET /api/ice-creams<br/><small>findAll()</small>"]
  n9["GET /api/ice-creams/:id<br/><small>findOne()</small>"]
  n10["PATCH /api/ice-creams/:id<br/><small>update() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n11["DELETE /api/ice-creams/:id<br/><small>deactivate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  end
  subgraph s12["Aplicación"]
  n13["CreateIceCreamUseCase<br/><small>api/ice-creams/application/use-cases/create-ice-cream.use-case.ts</small>"]
  n14["ListIceCreamsUseCase<br/><small>api/ice-creams/application/use-cases/list-ice-creams.use-case.ts</small>"]
  n15["GetIceCreamByIdUseCase<br/><small>api/ice-creams/application/use-cases/get-ice-cream-by-id.use-case.ts</small>"]
  n16["UpdateIceCreamUseCase<br/><small>api/ice-creams/application/use-cases/update-ice-cream.use-case.ts</small>"]
  n17["DeactivateIceCreamUseCase<br/><small>api/ice-creams/application/use-cases/deactivate-ice-cream.use-case.ts</small>"]
  end
  subgraph s18["Dominio · Infraestructura · PostgreSQL"]
  n19["IceCreamRepository"]
  n20["TypeOrmIceCreamRepository<br/><small>api/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts</small>"]
  end
  n3 -->|submit→createIceCream, submit→updateIceCream| n2
  n4 -->|onBarcodeScanned→searchIceCreams| n2
  n5 -->|confirmDelete→deleteIceCream| n2
  n2 -->|createIceCream| n7
  n2 -->|getIceCreams| n8
  n2 -->|searchIceCreams| n8
  n2 -->|getIceCreamById| n9
  n2 -->|updateIceCream| n10
  n2 -->|deleteIceCream| n11
  n7 --> n13
  n8 --> n14
  n9 --> n15
  n10 --> n16
  n11 --> n17
  n13 -->|findByActiveProduct, findByActiveSku, create| n19
  n19 -->|implementa| n20
  n14 -->|findAll| n19
  n15 -->|findById| n19
  n16 -->|findById, findByActiveProduct, findByActiveSku …| n19
  n17 -->|findById, deactivate| n19
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
  class n2,n3,n4,n5 fe
  class n7,n8,n9,n10,n11 api
  class n13,n14,n15,n16,n17 app
  class n19 dom
  class n20 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a IceCreamsController, sus 5 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-creams.controller.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-creams.controller.ts), [`comercial-jhoel-app/src/app/core/services/ice-cream.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/ice-cream.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-form-modal/ice-cream-form-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/components/ice-cream-form-modal/ice-cream-form-modal.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/components/ice-cream-product-search/ice-cream-product-search.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-product-search/ice-cream-product-search.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/components/ice-cream-product-search/ice-cream-product-search.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/inventory/ice-cream-inventory-page.component.ts), [`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream.use-case.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream.use-case.ts), [`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/list-ice-creams.use-case.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/list-ice-creams.use-case.ts), [`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/get-ice-cream-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/get-ice-cream-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/update-ice-cream.use-case.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/update-ice-cream.use-case.ts), [`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/deactivate-ice-cream.use-case.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/deactivate-ice-cream.use-case.ts), [`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/ice-creams/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
