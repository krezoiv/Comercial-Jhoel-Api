# Mapa de PublicCompanyController

Módulo: **Datos de la empresa (company-settings)** · Fuente editable: [`publiccompanycontroller.mmd`](publiccompanycontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["CompanySettingsService<br/><small>app/core/services/company-settings.service.ts</small>"]
  n3["ContactService<br/><small>app/core/services/contact.service.ts</small>"]
  end
  subgraph s4["PublicCompanyController (api/company-settings/presentation/controllers/public-company.controller.ts)"]
  n5["GET /api/company-info<br/><small>get()</small>"]
  end
  subgraph s6["Aplicación"]
  n7["GetPublicCompanyInfoUseCase<br/><small>api/company-settings/application/use-cases/get-public-company-info.use-case.ts</small>"]
  end
  subgraph s8["Dominio · Infraestructura · PostgreSQL"]
  n9["CompanySettingsRepository"]
  n10["TypeOrmCompanySettingsRepository<br/><small>api/company-settings/infrastructure/persistence/typeorm-company-settings.repository.ts</small>"]
  end
  n3 -->|getContactInfo→getPublicInfo| n2
  n2 -->|getPublicInfo| n5
  n5 --> n7
  n7 -->|get| n9
  n9 -->|implementa| n10
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
  class n5 api
  class n7 app
  class n9 dom
  class n10 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a PublicCompanyController, sus 1 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/company-settings/presentation/controllers/public-company.controller.ts`](../../../../comercial-jhoel-api/src/modules/company-settings/presentation/controllers/public-company.controller.ts), [`comercial-jhoel-app/src/app/core/services/company-settings.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/company-settings.service.ts), [`comercial-jhoel-app/src/app/core/services/contact.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/contact.service.ts), [`comercial-jhoel-api/src/modules/company-settings/application/use-cases/get-public-company-info.use-case.ts`](../../../../comercial-jhoel-api/src/modules/company-settings/application/use-cases/get-public-company-info.use-case.ts), [`comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/typeorm-company-settings.repository.ts`](../../../../comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/typeorm-company-settings.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/company-settings/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
