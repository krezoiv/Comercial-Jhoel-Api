# DELETE /api/sales/current

Módulo: **Ventas (sales)** · Fuente editable: [`delete-sales-current.mmd`](delete-sales-current.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta DELETE /api/sales/current"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["SalesService.cancelSale<br/><small>app/core/services/sales.service.ts</small>"]
  n6["SalesDraftStore.cancelDraft<br/><small>app/core/services/sales-draft.store.ts</small>"]
  n7["HTTP DELETE /api/sales/current<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿CancelOpenSaleQueryDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["SalesController.cancelCurrent<br/><small>api/sales/presentation/controllers/sales.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["CancelOpenSaleUseCase.execute<br/><small>api/sales/application/use-cases/cancel-open-sale.use-case.ts</small>"]
  n17{"¿!cancelled?<br/><small>L18</small>"}
  n18(["NoOpenSaleError()"])
  end
  subgraph s19["Dominio → Infraestructura"]
  n20["Puerto SaleRepository.cancelOpenSale<br/>@Inject(SALE_REPOSITORY)"]
  n21["TypeOrmSaleRepository<br/><small>api/sales/infrastructure/persistence/typeorm-sale.repository.ts</small>"]
  subgraph s22["PostgreSQL — función cancel_open_sale"]
  n23[["SELECT cancel_open_sale(…)<br/><small>cancelOpenSale — una transacción</small>"]]
  n24[("Escribe:<br/>inventory_stock<br/>products<br/>sale_details<br/>sales")]
  end
  end
  n25(["Fin: la interfaz se actualiza<br/>this.notificationService.warning<br/>this.notificationService.error"])
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
  n17 -->|no| n20
  n20 -->|implementa| n21
  n21 -->|cancelOpenSale| n23
  n23 --> n24
  n24 -->|COMMIT| n8
  n8 --> n25
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
  class n2,n3,n11,n13,n18 err
  class n5,n6,n7 fe
  class n8,n25 ok
  class n10,n12,n17 dec
  class n14 api
  class n16 app
  class n20 dom
  class n21 infra
  class n23,n24 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de DELETE /api/sales/current: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** SalesDraftStore.cancelDraft (comercial-jhoel-app/src/app/core/services/sales-draft.store.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts`](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts), [`comercial-jhoel-app/src/app/core/services/sales.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts), [`comercial-jhoel-app/src/app/core/services/sales-draft.store.ts`](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/cancel-open-sale.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/cancel-open-sale.use-case.ts), [`comercial-jhoel-api/src/modules/sales/domain/repositories/sale.repository.ts`](../../../../comercial-jhoel-api/src/modules/sales/domain/repositories/sale.repository.ts), [`comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts`](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO CancelOpenSaleQueryDto | !cancelled
6. **¿Dónde se almacenan los datos?** cancel_open_sale(), inventory_stock, products, sale_details, sales
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
