# Mapa de IceCreamPurchasesController

Módulo: **Heladería (ice-creams)** · Fuente editable: [`icecreampurchasescontroller.mmd`](icecreampurchasescontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["IceCreamPurchasesService<br/><small>app/core/services/ice-cream-purchases.service.ts</small>"]
  n3["IceCreamPurchasesPageComponent<br/><small>app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts</small>"]
  end
  subgraph s4["IceCreamPurchasesController (api/ice-creams/presentation/controllers/ice-cream-purchases.controller.ts)"]
  n5["POST /api/ice-cream-purchases<br/><small>create()</small>"]
  n6["GET /api/ice-cream-purchases<br/><small>findAll()</small>"]
  n7["GET /api/ice-cream-purchases/:id<br/><small>findOne()</small>"]
  end
  subgraph s8["Aplicación"]
  n9["CreateIceCreamPurchaseUseCase<br/><small>api/ice-creams/application/use-cases/create-ice-cream-purchase.use-case.ts</small>"]
  n10["ListIceCreamPurchasesUseCase<br/><small>api/ice-creams/application/use-cases/list-ice-cream-purchases.use-case.ts</small>"]
  n11["GetIceCreamPurchaseByIdUseCase<br/><small>api/ice-creams/application/use-cases/get-ice-cream-purchase-by-id.use-case.ts</small>"]
  end
  subgraph s12["Dominio · Infraestructura · PostgreSQL"]
  n13["IceCreamPurchaseRepository"]
  n14["TypeOrmIceCreamPurchaseRepository<br/><small>api/ice-creams/infrastructure/persistence/typeorm-ice-cream-purchase.repository.ts</small>"]
  n15[["confirm_ice_cream_purchase()"]]
  n16[("ice_cream_purchase_details")]
  n17[("ice_cream_purchases")]
  n18[("ice_creams")]
  end
  n3 -->|confirmSave→createPurchase| n2
  n2 -->|createPurchase| n5
  n2 -->|getPurchases| n6
  n2 -->|getPurchaseById| n7
  n5 --> n9
  n6 --> n10
  n7 --> n11
  n9 -->|confirmPurchase| n13
  n13 -->|implementa| n14
  n14 -->|confirmPurchase| n15
  n15 -->|escribe| n16
  n15 -->|escribe| n17
  n15 -->|escribe| n18
  n10 -->|findAll| n13
  n11 -->|findById| n13
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
  class n5,n6,n7 api
  class n9,n10,n11 app
  class n13 dom
  class n14 infra
  class n15,n16,n17,n18 db
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a IceCreamPurchasesController, sus 3 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-purchases.controller.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-purchases.controller.ts), [`comercial-jhoel-app/src/app/core/services/ice-cream-purchases.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchases.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts), [`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream-purchase.use-case.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream-purchase.use-case.ts), [`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/list-ice-cream-purchases.use-case.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/list-ice-cream-purchases.use-case.ts), [`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/get-ice-cream-purchase-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/get-ice-cream-purchase-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-purchase.repository.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-purchase.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/ice-creams/
6. **¿Dónde se almacenan los datos?** ice_cream_purchase_details, ice_cream_purchases, ice_creams
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
