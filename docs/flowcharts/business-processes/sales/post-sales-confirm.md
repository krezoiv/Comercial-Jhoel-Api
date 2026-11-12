# Venta: confirmar ("Guardar venta")

Módulo: **Ventas (sales)** · Fuente editable: [`post-sales-confirm.mmd`](post-sales-confirm.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: Venta: confirmar (#quot;Guardar venta#quot;)"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["SalesService.confirmSale<br/><small>app/core/services/sales.service.ts</small>"]
  n6["SalesDraftStore.confirmSale<br/><small>app/core/services/sales-draft.store.ts</small>"]
  n7["HTTP POST /api/sales/confirm<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿ConfirmOpenSaleRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["SalesController.confirm<br/><small>api/sales/presentation/controllers/sales.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["ConfirmOpenSaleUseCase.execute<br/><small>api/sales/application/use-cases/confirm-open-sale.use-case.ts</small>"]
  end
  subgraph s17["Dominio → Infraestructura"]
  n18["Puerto SaleRepository.confirmOpenSale<br/>@Inject(SALE_REPOSITORY)"]
  n19["TypeOrmSaleRepository<br/><small>api/sales/infrastructure/persistence/typeorm-sale.repository.ts</small>"]
  subgraph s20["PostgreSQL — función confirm_open_sale"]
  n21[["SELECT confirm_open_sale(…)<br/><small>confirmOpenSale — una transacción</small>"]]
  n22[("Escribe:<br/>inventory_movements<br/>sales")]
  end
  end
  n23(["Fin: la interfaz se actualiza<br/>this.notificationService.success<br/>this.notificationService.error"])
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
  n16 --> n18
  n18 -->|implementa| n19
  n19 -->|confirmOpenSale| n21
  n21 --> n22
  n22 -->|COMMIT| n8
  n8 --> n23
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
  class n2,n3,n11,n13 err
  class n5,n6,n7 fe
  class n8,n23 ok
  class n10,n12 dec
  class n14 api
  class n16 app
  class n18 dom
  class n19 infra
  class n21,n22 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/sales/confirm: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** SalesDraftStore.confirmSale (comercial-jhoel-app/src/app/core/services/sales-draft.store.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts`](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts), [`comercial-jhoel-app/src/app/core/services/sales.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts), [`comercial-jhoel-app/src/app/core/services/sales-draft.store.ts`](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/confirm-open-sale.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/confirm-open-sale.use-case.ts), [`comercial-jhoel-api/src/modules/sales/domain/repositories/sale.repository.ts`](../../../../comercial-jhoel-api/src/modules/sales/domain/repositories/sale.repository.ts), [`comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts`](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO ConfirmOpenSaleRequestDto
6. **¿Dónde se almacenan los datos?** confirm_open_sale(), inventory_movements, sales
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
