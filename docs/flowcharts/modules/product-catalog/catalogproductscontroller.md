# Mapa de CatalogProductsController

Módulo: **Catálogo de productos (product-catalog)** · Fuente editable: [`catalogproductscontroller.mmd`](catalogproductscontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["CatalogProductService<br/><small>app/core/services/catalog-product.service.ts</small>"]
  n3["CatalogProductFormModalComponent<br/><small>app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.ts</small>"]
  n4["CatalogProductsPageComponent<br/><small>app/features/dashboard/catalog-products/catalog-products-page.component.ts</small>"]
  n5["CatalogProductImageModalComponent<br/><small>app/features/dashboard/catalog-products/components/catalog-product-image-modal/catalog-product-image-modal.component.ts</small>"]
  end
  subgraph s6["CatalogProductsController (api/product-catalog/presentation/controllers/catalog-products.controller.ts)"]
  n7["POST /api/catalog/products<br/><small>create() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n8["GET /api/catalog/products<br/><small>findAll() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n9["GET /api/catalog/products/:id<br/><small>findOne() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n10["PATCH /api/catalog/products/:id<br/><small>update() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n11["POST /api/catalog/products/:id/activate<br/><small>activate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n12["DELETE /api/catalog/products/:id<br/><small>deactivate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n13["POST /api/catalog/products/reorder<br/><small>reorder() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n14["POST /api/catalog/products/:id/image<br/><small>setImage() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n15["DELETE /api/catalog/products/:id/image<br/><small>removeImage() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  end
  subgraph s16["Aplicación"]
  n17["CreateCatalogProductUseCase<br/><small>api/product-catalog/application/use-cases/create-catalog-product.use-case.ts</small>"]
  n18["ListCatalogProductsUseCase<br/><small>api/product-catalog/application/use-cases/list-catalog-products.use-case.ts</small>"]
  n19["GetCatalogProductByIdUseCase<br/><small>api/product-catalog/application/use-cases/get-catalog-product-by-id.use-case.ts</small>"]
  n20["UpdateCatalogProductUseCase<br/><small>api/product-catalog/application/use-cases/update-catalog-product.use-case.ts</small>"]
  n21["SetCatalogProductActiveUseCase<br/><small>api/product-catalog/application/use-cases/set-catalog-product-active.use-case.ts</small>"]
  n22["ReorderCatalogProductsUseCase<br/><small>api/product-catalog/application/use-cases/reorder-catalog-products.use-case.ts</small>"]
  n23["SetCatalogProductImageUseCase<br/><small>api/product-catalog/application/use-cases/set-catalog-product-image.use-case.ts</small>"]
  n24["RemoveCatalogProductImageUseCase<br/><small>api/product-catalog/application/use-cases/remove-catalog-product-image.use-case.ts</small>"]
  end
  subgraph s25["Dominio · Infraestructura · PostgreSQL"]
  n26["CatalogProductRepository"]
  n27["TypeOrmCatalogProductRepository<br/><small>api/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts</small>"]
  n28["ProductRepository"]
  n29["TypeOrmProductRepository<br/><small>api/products/infrastructure/persistence/typeorm-product.repository.ts</small>"]
  end
  n3 -->|submit→createProduct, submit→updateProduct| n2
  n4 -->|fetchProducts→getProducts, toggleActive→activateProduct, toggleActive→deactivateProduct …| n2
  n5 -->|refetch→getProductById, onFileSelected→setImage, removeImage→removeImage| n2
  n2 -->|createProduct| n7
  n2 -->|getProducts| n8
  n2 -->|getProductById| n9
  n2 -->|updateProduct| n10
  n2 -->|activateProduct| n11
  n2 -->|deactivateProduct| n12
  n2 -->|reorderProducts| n13
  n2 -->|setImage| n14
  n2 -->|removeImage| n15
  n7 --> n17
  n8 --> n18
  n9 --> n19
  n10 --> n20
  n11 --> n21
  n12 --> n21
  n13 --> n22
  n14 --> n23
  n15 --> n24
  n17 -->|create| n26
  n26 -->|implementa| n27
  n17 -->|findById| n28
  n28 -->|implementa| n29
  n18 -->|findAll| n26
  n19 -->|findById| n26
  n20 -->|findById, update| n26
  n21 -->|findById, setActive| n26
  n22 -->|findById, reorder| n26
  n23 -->|findById, setImage| n26
  n24 -->|findById, removeImage| n26
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
  class n7,n8,n9,n10,n11,n12,n13,n14,n15 api
  class n17,n18,n19,n20,n21,n22,n23,n24 app
  class n26,n28 dom
  class n27,n29 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a CatalogProductsController, sus 9 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/presentation/controllers/catalog-products.controller.ts), [`comercial-jhoel-app/src/app/core/services/catalog-product.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/catalog-product.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-form-modal/catalog-product-form-modal.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/catalog-products-page.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-image-modal/catalog-product-image-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-products/components/catalog-product-image-modal/catalog-product-image-modal.component.ts), [`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/create-catalog-product.use-case.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/create-catalog-product.use-case.ts), [`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/list-catalog-products.use-case.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/list-catalog-products.use-case.ts), [`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-catalog-product-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/get-catalog-product-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/update-catalog-product.use-case.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/update-catalog-product.use-case.ts), [`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/set-catalog-product-active.use-case.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/set-catalog-product-active.use-case.ts), [`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/reorder-catalog-products.use-case.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/reorder-catalog-products.use-case.ts), [`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/set-catalog-product-image.use-case.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/set-catalog-product-image.use-case.ts), [`comercial-jhoel-api/src/modules/product-catalog/application/use-cases/remove-catalog-product-image.use-case.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/application/use-cases/remove-catalog-product-image.use-case.ts), [`comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts`](../../../../comercial-jhoel-api/src/modules/product-catalog/infrastructure/persistence/typeorm-catalog-product.repository.ts), [`comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts`](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/product-catalog/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
