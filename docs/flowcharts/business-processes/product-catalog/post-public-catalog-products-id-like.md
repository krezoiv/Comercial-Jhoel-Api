# POST /api/public-catalog/products/:id/like

Módulo: **Catálogo de productos (product-catalog)** · Fuente editable: [`post-public-catalog-products-id-like.mmd`](post-public-catalog-products-id-like.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/public-catalog/products/:id/like"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["PublicProductCatalogService.likeProduct<br/><small>app/core/services/public-product-catalog.service.ts</small>"]
  n6["CatalogProductCardComponent.toggleLike<br/><small>app/features/landing/sections/shared/catalog-product-card/catalog-product-card.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/public-catalog/products/:id/like<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Dentro del límite de intentos?<br/>(ThrottlerGuard + @Throttle)"}
  n11(["429 Demasiadas solicitudes"])
  n12["PublicProductCatalogController.like<br/><small>api/product-catalog/presentation/controllers/public-product-catalog.controller.ts</small>"]
  end
  subgraph s13["Aplicación — caso de uso"]
  n14["LikeCatalogProductUseCase.execute<br/><small>api/product-catalog/application/use-cases/like-catalog-product.use-case.ts</small>"]
  n15{"¿!product #124;#124; !product.isPubliclyVisible?<br/><small>L35</small>"}
  n16(["CatalogProductNotVisibleError()"])
  end
  n17["Puerto CatalogProductRepository<br/><small>findById</small>"]
  subgraph s18["Dominio → Infraestructura"]
  n19["Puerto CatalogLikeRepository.like / unlike / getCount<br/>@Inject(CATALOG_LIKE_REPOSITORY)"]
  n20["TypeOrmCatalogLikeRepository<br/><small>api/likes/infrastructure/persistence/typeorm-catalog-like.repository.ts</small>"]
  n21[("like: TypeORM Repository")]
  n22[("unlike: TypeORM Repository")]
  n23[("getCount: TypeORM Repository")]
  end
  n24(["Fin: la interfaz se actualiza<br/>this.liked.set<br/>this.likeBusy.set<br/>this.likesCount.set"])
  n2 --> n3
  n1 -->|acción del usuario| n6
  n6 --> n5
  n5 --> n7
  n7 --> n10
  n10 -->|no| n11
  n11 --> n2
  n10 -->|sí| n12
  n12 --> n14
  n14 --> n15
  n15 -->|sí| n16
  n16 --> n2
  n14 -.->|consulta| n17
  n15 -->|no| n19
  n19 -->|implementa| n20
  n20 --> n21
  n21 --> n8
  n20 --> n22
  n22 --> n8
  n20 --> n23
  n23 --> n8
  n8 --> n24
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
  class n2,n3,n11,n16 err
  class n5,n6,n7 fe
  class n8,n24 ok
  class n10,n15 dec
  class n12 api
  class n14 app
  class n17,n19 dom
  class n20 infra
  class n21,n22,n23 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/public-catalog/products/:id/like: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** CatalogProductCardComponent.toggleLike (comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-card/catalog-product-card.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/public-product-catalog.controller.ts), [`comercial-jhoel-app/src/app/core/services/public-product-catalog.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/public-product-catalog.service.ts), [`comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-card/catalog-product-card.component.ts`](../../../../comercial-jhoel-app/src/app/features/landing/sections/shared/catalog-product-card/catalog-product-card.component.ts), [`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/like-catalog-product.use-case.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/like-catalog-product.use-case.ts), [`comercial-jhoel-api/src/modules/product-catalog/domain/repositories/catalog-product.repository.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/domain/repositories/catalog-product.repository.ts), [`comercial-jhoel-api/src/modules/likes/domain/repositories/catalog-like.repository.ts`](../../../../comercial-jhoel-api/src/modules/likes/domain/repositories/catalog-like.repository.ts), [`comercial-jhoel-api/src/modules/likes/infrastructure/persistence/typeorm-catalog-like.repository.ts`](../../../../comercial-jhoel-api/src/modules/likes/infrastructure/persistence/typeorm-catalog-like.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** límite de intentos (ThrottlerGuard) | !product || !product.isPubliclyVisible
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
