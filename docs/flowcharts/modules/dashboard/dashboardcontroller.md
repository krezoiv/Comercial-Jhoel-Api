# Mapa de DashboardController

Módulo: **Resumen (dashboard) (dashboard)** · Fuente editable: [`dashboardcontroller.mmd`](dashboardcontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["DashboardMetricsService<br/><small>app/core/services/dashboard-metrics.service.ts</small>"]
  end
  subgraph s3["DashboardController (api/dashboard/presentation/controllers/dashboard.controller.ts)"]
  n4["GET /api/dashboard/summary<br/><small>getSummary() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  end
  subgraph s5["Aplicación"]
  n6["GetDashboardSummaryUseCase<br/><small>api/dashboard/application/use-cases/get-dashboard-summary.use-case.ts</small>"]
  end
  subgraph s7["Dominio · Infraestructura · PostgreSQL"]
  n8["DashboardRepository"]
  n9["TypeOrmDashboardRepository<br/><small>api/dashboard/infrastructure/persistence/typeorm-dashboard.repository.ts</small>"]
  end
  n2 -->|getSummary| n4
  n4 --> n6
  n6 -->|getSummary| n8
  n8 -->|implementa| n9
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
  class n4 api
  class n6 app
  class n8 dom
  class n9 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a DashboardController, sus 1 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/dashboard/presentation/controllers/dashboard.controller.ts`](../../../../comercial-jhoel-api/src/modules/dashboard/presentation/controllers/dashboard.controller.ts), [`comercial-jhoel-app/src/app/core/services/dashboard-metrics.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/dashboard-metrics.service.ts), [`comercial-jhoel-api/src/modules/dashboard/application/use-cases/get-dashboard-summary.use-case.ts`](../../../../comercial-jhoel-api/src/modules/dashboard/application/use-cases/get-dashboard-summary.use-case.ts), [`comercial-jhoel-api/src/modules/dashboard/infrastructure/persistence/typeorm-dashboard.repository.ts`](../../../../comercial-jhoel-api/src/modules/dashboard/infrastructure/persistence/typeorm-dashboard.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/dashboard/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
