# Mapa de AlertSettingsController

Módulo: **Configuración de alertas (alert-settings)** · Fuente editable: [`alertsettingscontroller.mmd`](alertsettingscontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["AlertSettingsService<br/><small>app/core/services/alert-settings.service.ts</small>"]
  n3["AlertSettingsPageComponent<br/><small>app/features/dashboard/alert-settings/alert-settings-page.component.ts</small>"]
  end
  subgraph s4["AlertSettingsController (api/alert-settings/presentation/controllers/alert-settings.controller.ts)"]
  n5["GET /api/alert-settings<br/><small>get() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n6["PATCH /api/alert-settings<br/><small>update() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  end
  subgraph s7["Aplicación"]
  n8["GetAlertSettingsUseCase<br/><small>api/alert-settings/application/use-cases/get-alert-settings.use-case.ts</small>"]
  n9["UpdateAlertSettingsUseCase<br/><small>api/alert-settings/application/use-cases/update-alert-settings.use-case.ts</small>"]
  end
  subgraph s10["Dominio · Infraestructura · PostgreSQL"]
  n11["AlertSettingsRepository"]
  n12["TypeOrmAlertSettingsRepository<br/><small>api/alert-settings/infrastructure/persistence/typeorm-alert-settings.repository.ts</small>"]
  end
  n3 -->|fetchAll→getSettings, saveAlertDays→updateSettings| n2
  n2 -->|getSettings| n5
  n2 -->|updateSettings| n6
  n5 --> n8
  n6 --> n9
  n8 -->|get| n11
  n11 -->|implementa| n12
  n9 -->|update| n11
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
  class n5,n6 api
  class n8,n9 app
  class n11 dom
  class n12 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a AlertSettingsController, sus 2 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/alert-settings/presentation/controllers/alert-settings.controller.ts`](../../../../comercial-jhoel-api/src/modules/alert-settings/presentation/controllers/alert-settings.controller.ts), [`comercial-jhoel-app/src/app/core/services/alert-settings.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/alert-settings.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/alert-settings/alert-settings-page.component.ts), [`comercial-jhoel-api/src/modules/alert-settings/application/use-cases/get-alert-settings.use-case.ts`](../../../../comercial-jhoel-api/src/modules/alert-settings/application/use-cases/get-alert-settings.use-case.ts), [`comercial-jhoel-api/src/modules/alert-settings/application/use-cases/update-alert-settings.use-case.ts`](../../../../comercial-jhoel-api/src/modules/alert-settings/application/use-cases/update-alert-settings.use-case.ts), [`comercial-jhoel-api/src/modules/alert-settings/infrastructure/persistence/typeorm-alert-settings.repository.ts`](../../../../comercial-jhoel-api/src/modules/alert-settings/infrastructure/persistence/typeorm-alert-settings.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/alert-settings/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
