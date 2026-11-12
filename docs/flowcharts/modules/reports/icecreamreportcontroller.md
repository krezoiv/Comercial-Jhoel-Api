# Mapa de IceCreamReportController

Módulo: **Reportería (reports)** · Fuente editable: [`icecreamreportcontroller.mmd`](icecreamreportcontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["ReportsService<br/><small>app/core/services/reports.service.ts</small>"]
  n3["IceCreamReportPageComponent<br/><small>app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts</small>"]
  end
  subgraph s4["IceCreamReportController (api/reports/presentation/controllers/ice-cream-report.controller.ts)"]
  n5["GET /api/reports/ice-cream<br/><small>findAll() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n6["GET /api/reports/ice-cream/summary<br/><small>getSummary() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n7["GET /api/reports/ice-cream/export<br/><small>export() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  end
  subgraph s8["Aplicación"]
  n9["GetIceCreamReportUseCase<br/><small>api/reports/application/use-cases/get-ice-cream-report.use-case.ts</small>"]
  n10["GetIceCreamReportSummaryUseCase<br/><small>api/reports/application/use-cases/get-ice-cream-report-summary.use-case.ts</small>"]
  n11["ExportIceCreamReportPdfUseCase<br/><small>api/reports/application/use-cases/export-ice-cream-report-pdf.use-case.ts</small>"]
  end
  subgraph s12["Dominio · Infraestructura · PostgreSQL"]
  n13["GetIceCreamSalesReportUseCase"]
  n14["GetIceCreamPurchasesReportUseCase"]
  n15["GetIceCreamSalesReportSummaryUseCase"]
  n16["GetIceCreamPurchasesReportSummaryUseCase"]
  n17["IceCreamRepository"]
  n18["TypeOrmIceCreamRepository<br/><small>api/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts</small>"]
  n19["UserRepository"]
  n20["TypeOrmUserRepository<br/><small>api/users/infrastructure/persistence/typeorm-user.repository.ts</small>"]
  end
  n3 -->|fetchTable→getIceCreamReport, runQuery→getIceCreamReportSummary, exportPdf→exportIceCreamReportPdf| n2
  n2 -->|getIceCreamReport| n5
  n2 -->|getIceCreamReportSummary| n6
  n2 -->|exportIceCreamReportPdf| n7
  n5 --> n9
  n6 --> n10
  n7 --> n11
  n9 -->|execute| n13
  n9 -->|execute| n14
  n10 -->|execute| n15
  n10 -->|execute| n16
  n11 -->|execute| n13
  n11 -->|execute| n14
  n11 -->|execute| n15
  n11 -->|execute| n16
  n11 -->|findById| n17
  n17 -->|implementa| n18
  n11 -->|findById| n19
  n19 -->|implementa| n20
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
  class n9,n10,n11,n13,n14,n15,n16 app
  class n17,n19 dom
  class n18,n20 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a IceCreamReportController, sus 3 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/reports/presentation/controllers/ice-cream-report.controller.ts`](../../../../comercial-jhoel-api/src/modules/reports/presentation/controllers/ice-cream-report.controller.ts), [`comercial-jhoel-app/src/app/core/services/reports.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/reports.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/ice-cream/ice-cream-report-page.component.ts), [`comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-report.use-case.ts`](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-report.use-case.ts), [`comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-report-summary.use-case.ts`](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/get-ice-cream-report-summary.use-case.ts), [`comercial-jhoel-api/src/modules/reports/application/use-cases/export-ice-cream-report-pdf.use-case.ts`](../../../../comercial-jhoel-api/src/modules/reports/application/use-cases/export-ice-cream-report-pdf.use-case.ts), [`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream.repository.ts), [`comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts`](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/reports/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
