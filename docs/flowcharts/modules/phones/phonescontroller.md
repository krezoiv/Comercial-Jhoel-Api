# Mapa de PhonesController

Módulo: **Teléfonos (phones)** · Fuente editable: [`phonescontroller.mmd`](phonescontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["PhonesService<br/><small>app/core/services/phones.service.ts</small>"]
  n3["PhonesPurchasePageComponent<br/><small>app/features/dashboard/phones/purchase/phones-purchase-page.component.ts</small>"]
  n4["PhonesInventoryPageComponent<br/><small>app/features/dashboard/phones/inventory/phones-inventory-page.component.ts</small>"]
  n5["PhonesSalePageComponent<br/><small>app/features/dashboard/phones/sale/phones-sale-page.component.ts</small>"]
  end
  subgraph s6["PhonesController (api/phones/presentation/controllers/phones.controller.ts)"]
  n7["POST /api/phones<br/><small>create()</small>"]
  n8["GET /api/phones<br/><small>findAll()</small>"]
  n9["GET /api/phones/:id<br/><small>findOne()</small>"]
  end
  subgraph s10["Aplicación"]
  n11["CreatePhoneUseCase<br/><small>api/phones/application/use-cases/create-phone.use-case.ts</small>"]
  n12["ListPhonesUseCase<br/><small>api/phones/application/use-cases/list-phones.use-case.ts</small>"]
  n13["GetPhoneByIdUseCase<br/><small>api/phones/application/use-cases/get-phone-by-id.use-case.ts</small>"]
  end
  subgraph s14["Dominio · Infraestructura · PostgreSQL"]
  n15["PhoneRepository"]
  n16["TypeOrmPhoneRepository<br/><small>api/phones/infrastructure/persistence/typeorm-phone.repository.ts</small>"]
  end
  n3 -->|submit→createPhone| n2
  n4 -->|fetchAll→getPhones| n2
  n5 -->|fetchAll→getPhones| n2
  n2 -->|createPhone| n7
  n2 -->|getPhones| n8
  n2 -->|getPhoneById| n9
  n7 --> n11
  n8 --> n12
  n9 --> n13
  n11 -->|findByImei, findBySimNumber, create| n15
  n15 -->|implementa| n16
  n12 -->|findAll| n15
  n13 -->|findById| n15
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
  class n7,n8,n9 api
  class n11,n12,n13 app
  class n15 dom
  class n16 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a PhonesController, sus 3 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/phones/presentation/controllers/phones.controller.ts`](../../../../comercial-jhoel-api/src/modules/phones/presentation/controllers/phones.controller.ts), [`comercial-jhoel-app/src/app/core/services/phones.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/phones.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/phones/purchase/phones-purchase-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/purchase/phones-purchase-page.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/phones/inventory/phones-inventory-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/inventory/phones-inventory-page.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/phones/sale/phones-sale-page.component.ts), [`comercial-jhoel-api/src/modules/phones/application/use-cases/create-phone.use-case.ts`](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/create-phone.use-case.ts), [`comercial-jhoel-api/src/modules/phones/application/use-cases/list-phones.use-case.ts`](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/list-phones.use-case.ts), [`comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/phones/application/use-cases/get-phone-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone.repository.ts`](../../../../comercial-jhoel-api/src/modules/phones/infrastructure/persistence/typeorm-phone.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/phones/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
