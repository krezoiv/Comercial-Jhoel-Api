# POST /api/ice-cream-sales

Módulo: **Heladería (ice-creams)** · Fuente editable: [`post-ice-cream-sales.mmd`](post-ice-cream-sales.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/ice-cream-sales"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["IceCreamSalesService.createSale<br/><small>app/core/services/ice-cream-sales.service.ts</small>"]
  n6["IceCreamSalesPageComponent.saveSale<br/><small>app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/ice-cream-sales<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿CreateIceCreamSaleRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["IceCreamSalesController.create<br/><small>api/ice-creams/presentation/controllers/ice-cream-sales.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["CreateIceCreamSaleUseCase.execute<br/><small>api/ice-creams/application/use-cases/create-ice-cream-sale.use-case.ts</small>"]
  n17{"¿!input.items #124;#124; input.items.length === 0?<br/><small>L29</small>"}
  n18(["IceCreamSaleEmptyError()"])
  n19{"¿!Number.isInteger(item.quantity) #124;#124; item.quantity #lt;= 0?<br/><small>L34</small>"}
  n20(["InvalidIceCreamQuantityError(item.iceCreamId)"])
  end
  subgraph s21["Dominio → Infraestructura"]
  n22["Puerto IceCreamSaleRepository.confirmSale<br/>@Inject(ICE_CREAM_SALE_REPOSITORY)"]
  n23["TypeOrmIceCreamSaleRepository<br/><small>api/ice-creams/infrastructure/persistence/typeorm-ice-cream-sale.repository.ts</small>"]
  subgraph s24["PostgreSQL — función confirm_ice_cream_sale"]
  n25[["SELECT confirm_ice_cream_sale(…)<br/><small>confirmSale — una transacción</small>"]]
  n26{"¿p_items IS NULL OR jsonb_array_length(p_items) = 0?"}
  n27(["RAISE SALE_EMPTY<br/>(rollback)"])
  n28{"¿v_quantity IS NULL OR v_quantity #lt;= 0?"}
  n29(["RAISE INVALID_QUANTITY<br/>(rollback)"])
  n30{"¿NOT FOUND?"}
  n31(["RAISE ICE_CREAM_NOT_FOUND<br/>(rollback)"])
  n32{"¿NOT v_ice_cream.is_active?"}
  n33(["RAISE ICE_CREAM_INACTIVE<br/>(rollback)"])
  n34{"¿v_ice_cream.stock #lt; v_quantity?"}
  n35(["RAISE INSUFFICIENT_STOCK<br/>(rollback)"])
  n36[("Escribe:<br/>ice_cream_sale_details<br/>ice_cream_sales<br/>ice_creams")]
  end
  end
  n37(["Fin: la interfaz se actualiza<br/>this.isSaving.set<br/>this.notificationService.success<br/>this.notificationService.error"])
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
  n17 -->|no| n19
  n19 -->|sí| n20
  n20 --> n2
  n19 -->|no| n22
  n22 -->|implementa| n23
  n23 -->|confirmSale| n25
  n25 --> n26
  n26 -->|sí| n27
  n27 --> n2
  n26 -->|no| n28
  n28 -->|sí| n29
  n29 --> n2
  n28 -->|no| n30
  n30 -->|sí| n31
  n31 --> n2
  n30 -->|no| n32
  n32 -->|sí| n33
  n33 --> n2
  n32 -->|no| n34
  n34 -->|sí| n35
  n35 --> n2
  n34 -->|no| n36
  n36 -->|COMMIT| n8
  n8 --> n37
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
  class n2,n3,n11,n13,n18,n20,n27,n29,n31,n33,n35 err
  class n5,n6,n7 fe
  class n8,n37 ok
  class n10,n12,n17,n19,n26,n28,n30,n32,n34 dec
  class n14 api
  class n16 app
  class n22 dom
  class n23 infra
  class n25,n36 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/ice-cream-sales: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** IceCreamSalesPageComponent.saveSale (comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-sales.controller.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-sales.controller.ts), [`comercial-jhoel-app/src/app/core/services/ice-cream-sales.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-sales.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/sales/ice-cream-sales-page.component.ts), [`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream-sale.use-case.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream-sale.use-case.ts), [`comercial-jhoel-api/src/modules/ice-creams/domain/repositories/ice-cream-sale.repository.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/repositories/ice-cream-sale.repository.ts), [`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-sale.repository.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-sale.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO CreateIceCreamSaleRequestDto | !input.items || input.items.length === 0 | !Number.isInteger(item.quantity) || item.quantity <= 0 | SQL confirm_ice_cream_sale: p_items IS NULL OR jsonb_array_length(p_items) = 0 | SQL confirm_ice_cream_sale: v_quantity IS NULL OR v_quantity <= 0 | SQL confirm_ice_cream_sale: NOT FOUND | SQL confirm_ice_cream_sale: NOT v_ice_cream.is_active | SQL confirm_ice_cream_sale: v_ice_cream.stock < v_quantity
6. **¿Dónde se almacenan los datos?** confirm_ice_cream_sale(), ice_cream_sale_details, ice_cream_sales, ice_creams
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
