# PATCH /api/sales/current/pricing

Módulo: **Ventas (sales)** · Fuente editable: [`patch-sales-current-pricing.mmd`](patch-sales-current-pricing.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta PATCH /api/sales/current/pricing"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["SalesService.configurePricing<br/><small>app/core/services/sales.service.ts</small>"]
  n6["SalesDraftStore.configurePricing<br/><small>app/core/services/sales-draft.store.ts</small>"]
  n7["HTTP PATCH /api/sales/current/pricing<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿ConfigureSalePricingRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["SalesController.configurePricing<br/><small>api/sales/presentation/controllers/sales.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["ConfigureSalePricingUseCase.execute<br/><small>api/sales/application/use-cases/configure-sale-pricing.use-case.ts</small>"]
  n17{"¿!client #124;#124; !client.isActive?<br/><small>L37</small>"}
  n18(["InvalidClientError()"])
  end
  n19["Puerto ClientRepository<br/><small>findById</small>"]
  subgraph s20["Dominio → Infraestructura"]
  n21["Puerto SaleRepository.configureOpenSale<br/>@Inject(SALE_REPOSITORY)"]
  n22["TypeOrmSaleRepository<br/><small>api/sales/infrastructure/persistence/typeorm-sale.repository.ts</small>"]
  subgraph s23["PostgreSQL — función configure_open_sale"]
  n24[["SELECT configure_open_sale(…)<br/><small>configureOpenSale — una transacción</small>"]]
  n25["Otros RAISE de configure_open_sale (condición no extraída):<br/>PRICE_LIST_LOCKED"]
  n26[("Escribe:<br/>sales")]
  end
  end
  n27(["Fin: la interfaz se actualiza<br/>this.notificationService.error"])
  n2 --> n3
  n1 -->|acción del usuario| n6
  n6 --> n5
  n5 --> n7
  n7 --> n10
  n10 -->|no| n11
  n11 --> n3
  n10 -->|sí| n12
  n12 -->|no| n13
  n13 --> n2
  n12 -->|sí| n14
  n14 --> n16
  n16 --> n17
  n17 -->|sí| n18
  n18 --> n2
  n16 -.->|consulta| n19
  n17 -->|no| n21
  n21 -->|implementa| n22
  n22 -->|configureOpenSale| n24
  n24 -.->|también puede lanzar| n25
  n25 --> n2
  n24 --> n26
  n26 -->|COMMIT| n8
  n8 --> n27
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
  class n2,n3,n11,n13,n18,n25 err
  class n5,n6,n7 fe
  class n8,n27 ok
  class n10,n12,n17 dec
  class n14 api
  class n16 app
  class n19,n21 dom
  class n22 infra
  class n24,n26 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de PATCH /api/sales/current/pricing: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** SalesDraftStore.configurePricing (comercial-jhoel-app/src/app/core/services/sales-draft.store.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts`](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts), [`comercial-jhoel-app/src/app/core/services/sales.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts), [`comercial-jhoel-app/src/app/core/services/sales-draft.store.ts`](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/configure-sale-pricing.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/configure-sale-pricing.use-case.ts), [`comercial-jhoel-api/src/modules/clients/domain/repositories/client.repository.ts`](../../../../comercial-jhoel-api/src/modules/clients/domain/repositories/client.repository.ts), [`comercial-jhoel-api/src/modules/sales/domain/repositories/sale.repository.ts`](../../../../comercial-jhoel-api/src/modules/sales/domain/repositories/sale.repository.ts), [`comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts`](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO ConfigureSalePricingRequestDto | !client || !client.isActive
6. **¿Dónde se almacenan los datos?** configure_open_sale(), sales
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
