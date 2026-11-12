# Mapa de PurchasesReportController

Módulo: **Reportería (reports)** · Fuente editable: [`purchasesreportcontroller.mmd`](purchasesreportcontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["ReportsService<br/><small>app/core/services/reports.service.ts</small>"]
  n3["PurchasesReportPageComponent<br/><small>app/features/dashboard/reports/purchases/purchases-report-page.component.ts</small>"]
  end
  subgraph s4["PurchasesReportController (api/reports/presentation/controllers/purchases-report.controller.ts)"]
  n5["GET /api/reports/purchases<br/><small>findAll() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n6["GET /api/reports/purchases/summary<br/><small>getSummary() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n7["GET /api/reports/purchases/by-product<br/><small>getByProduct() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n8["GET /api/reports/purchases/export<br/><small>export() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n9["GET /api/reports/purchases/:id<br/><small>findOne() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  end
  subgraph s10["Aplicación"]
  n11["GetPurchasesReportUseCase<br/><small>api/reports/application/use-cases/get-purchases-report.use-case.ts</small>"]
  n12["GetPurchasesReportSummaryUseCase<br/><small>api/reports/application/use-cases/get-purchases-report-summary.use-case.ts</small>"]
  n13["GetPurchasesByProductReportUseCase<br/><small>api/reports/application/use-cases/get-purchases-by-product-report.use-case.ts</small>"]
  n14["ExportPurchasesReportPdfUseCase<br/><small>api/reports/application/use-cases/export-purchases-report-pdf.use-case.ts</small>"]
  n15["GetPurchaseReportDetailUseCase<br/><small>api/reports/application/use-cases/get-purchase-report-detail.use-case.ts</small>"]
  end
  subgraph s16["Dominio · Infraestructura · PostgreSQL"]
  n17["PurchasesReportRepository"]
  n18["TypeOrmPurchasesReportRepository<br/><small>api/reports/infrastructure/persistence/typeorm-purchases-report.repository.ts</small>"]
  n19["CategoryRepository"]
  n20["TypeOrmCategoryRepository<br/><small>api/categories/infrastructure/persistence/typeorm-category.repository.ts</small>"]
  n21["BusinessRepository"]
  n22["TypeOrmBusinessRepository<br/><small>api/businesses/infrastructure/persistence/typeorm-business.repository.ts</small>"]
  n23["ProductRepository"]
  n24["TypeOrmProductRepository<br/><small>api/products/infrastructure/persistence/typeorm-product.repository.ts</small>"]
  n25["UserRepository"]
  n26["TypeOrmUserRepository<br/><small>api/users/infrastructure/persistence/typeorm-user.repository.ts</small>"]
  n27["SupplierRepository"]
  n28["TypeOrmSupplierRepository<br/><small>api/suppliers/infrastructure/persistence/typeorm-supplier.repository.ts</small>"]
  n29["PurchaseRepository"]
  n30["TypeOrmPurchaseRepository<br/><small>api/purchases/infrastructure/persistence/typeorm-purchase.repository.ts</small>"]
  end
  n3 -->|fetchTable→getPurchasesReport, fetchAll→getPurchasesReportSummary, fetchTable→getPurchasesByProductReport …| n2
  n2 -->|getPurchasesReport| n5
  n2 -->|getPurchasesReportSummary| n6
  n2 -->|getPurchasesByProductReport| n7
  n2 -->|exportPurchasesReportPdf| n8
  n2 -->|getPurchaseReportDetail| n9
  n5 --> n11
  n6 --> n12
  n7 --> n13
  n8 --> n14
  n9 --> n15
  n11 -->|findAll| n17
  n17 -->|implementa| n18
  n12 -->|getSummary| n17
  n13 -->|getByProduct| n17
  n14 -->|findAll, getSummary| n17
  n14 -->|findById| n19
  n19 -->|implementa| n20
  n14 -->|findById| n21
  n21 -->|implementa| n22
  n14 -->|findById| n23
  n23 -->|implementa| n24
  n14 -->|findById| n25
  n25 -->|implementa| n26
  n14 -->|findById| n27
  n27 -->|implementa| n28
  n15 -->|findById| n29
  n29 -->|implementa| n30
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
  class n5,n6,n7,n8,n9 api
  class n11,n12,n13,n14,n15 app
  class n17,n19,n21,n23,n25,n27,n29 dom
  class n18,n20,n22,n24,n26,n28,n30 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a PurchasesReportController, sus 5 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/reports/presentation/controllers/purchases-report.controller.ts`](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/purchases-report.controller.ts), [`comercial-jhoel-app/src/app/core/services/reports.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/purchases/purchases-report-page.component.ts), [`comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-report.use-case.ts`](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-report.use-case.ts), [`comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-report-summary.use-case.ts`](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-report-summary.use-case.ts), [`comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-by-product-report.use-case.ts`](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchases-by-product-report.use-case.ts), [`comercial-jhoel-api/src/modules/reports/application/use-cases/export-purchases-report-pdf.use-case.ts`](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-purchases-report-pdf.use-case.ts), [`comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchase-report-detail.use-case.ts`](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-purchase-report-detail.use-case.ts), [`comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-purchases-report.repository.ts`](../../../../comercial-jhoel-api/src/modules/reports/infrastructure/persistence/typeorm-purchases-report.repository.ts), [`comercial-jhoel-api/src/modules/categories/infrastructure/persistence/typeorm-category.repository.ts`](../../../../comercial-jhoel-api/src/modules/categories/infrastructure/persistence/typeorm-category.repository.ts), [`comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/typeorm-business.repository.ts`](../../../../comercial-jhoel-api/src/modules/businesses/infrastructure/persistence/typeorm-business.repository.ts), [`comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts`](../../../../comercial-jhoel-api/src/modules/products/infrastructure/persistence/typeorm-product.repository.ts), [`comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts`](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts), [`comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/typeorm-supplier.repository.ts`](../../../../comercial-jhoel-api/src/modules/suppliers/infrastructure/persistence/typeorm-supplier.repository.ts), [`comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/typeorm-purchase.repository.ts`](../../../../comercial-jhoel-api/src/modules/purchases/infrastructure/persistence/typeorm-purchase.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/reports/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
