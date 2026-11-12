# POST /api/ice-cream-purchases

Módulo: **Heladería (ice-creams)** · Fuente editable: [`post-ice-cream-purchases.mmd`](post-ice-cream-purchases.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/ice-cream-purchases"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["IceCreamPurchasesService.createPurchase<br/><small>app/core/services/ice-cream-purchases.service.ts</small>"]
  n6["IceCreamPurchasesPageComponent.confirmSave<br/><small>app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/ice-cream-purchases<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿CreateIceCreamPurchaseRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["IceCreamPurchasesController.create<br/><small>api/ice-creams/presentation/controllers/ice-cream-purchases.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["CreateIceCreamPurchaseUseCase.execute<br/><small>api/ice-creams/application/use-cases/create-ice-cream-purchase.use-case.ts</small>"]
  n17{"¿!input.items #124;#124; input.items.length === 0?<br/><small>L41</small>"}
  n18(["IceCreamPurchaseEmptyError()"])
  n19{"¿Number.isNaN(input.purchaseDate.getTime()) #124;#124; input.purchaseDate.getTime() #gt; Date.now() + FUTURE_DATE_GRACE_MS?<br/><small>L45</small>"}
  n20(["InvalidIceCreamPurchaseDateError()"])
  n21{"¿!Number.isInteger(item.quantity) #124;#124; item.quantity #lt;= 0?<br/><small>L53</small>"}
  n22(["InvalidIceCreamQuantityError(item.iceCreamId)"])
  n23{"¿item.costPrice #lt; 0?<br/><small>L56</small>"}
  n24(["InvalidIceCreamPriceError(item.iceCreamId)"])
  end
  subgraph s25["Dominio → Infraestructura"]
  n26["Puerto IceCreamPurchaseRepository.confirmPurchase<br/>@Inject(ICE_CREAM_PURCHASE_REPOSITORY)"]
  n27["TypeOrmIceCreamPurchaseRepository<br/><small>api/ice-creams/infrastructure/persistence/typeorm-ice-cream-purchase.repository.ts</small>"]
  subgraph s28["PostgreSQL — función confirm_ice_cream_purchase"]
  n29[["SELECT confirm_ice_cream_purchase(…)<br/><small>confirmPurchase — una transacción</small>"]]
  n30{"¿p_items IS NULL OR jsonb_array_length(p_items) = 0?"}
  n31(["RAISE PURCHASE_EMPTY<br/>(rollback)"])
  n32{"¿NOT FOUND?"}
  n33(["RAISE SUPPLIER_NOT_FOUND<br/>(rollback)"])
  n34{"¿NOT v_supplier.is_active?"}
  n35(["RAISE SUPPLIER_INACTIVE<br/>(rollback)"])
  n36{"¿v_quantity IS NULL OR v_quantity #lt;= 0?"}
  n37(["RAISE INVALID_QUANTITY<br/>(rollback)"])
  n38{"¿v_cost_price IS NULL OR v_cost_price #lt; 0?"}
  n39(["RAISE INVALID_PRICE<br/>(rollback)"])
  n40{"¿NOT FOUND?"}
  n41(["RAISE ICE_CREAM_NOT_FOUND<br/>(rollback)"])
  n42{"¿NOT v_ice_cream.is_active?"}
  n43(["RAISE ICE_CREAM_INACTIVE<br/>(rollback)"])
  n44[("Escribe:<br/>ice_cream_purchase_details<br/>ice_cream_purchases<br/>ice_creams")]
  end
  end
  n45(["Fin: la interfaz se actualiza<br/>this.isSaving.set<br/>this.isSaveConfirmOpen.set<br/>this.notificationService.success<br/>this.notificationService.error"])
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
  n19 -->|no| n21
  n21 -->|sí| n22
  n22 --> n2
  n21 -->|no| n23
  n23 -->|sí| n24
  n24 --> n2
  n23 -->|no| n26
  n26 -->|implementa| n27
  n27 -->|confirmPurchase| n29
  n29 --> n30
  n30 -->|sí| n31
  n31 --> n2
  n30 -->|no| n32
  n32 -->|sí| n33
  n33 --> n2
  n32 -->|no| n34
  n34 -->|sí| n35
  n35 --> n2
  n34 -->|no| n36
  n36 -->|sí| n37
  n37 --> n2
  n36 -->|no| n38
  n38 -->|sí| n39
  n39 --> n2
  n38 -->|no| n40
  n40 -->|sí| n41
  n41 --> n2
  n40 -->|no| n42
  n42 -->|sí| n43
  n43 --> n2
  n42 -->|no| n44
  n44 -->|COMMIT| n8
  n8 --> n45
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
  class n2,n3,n11,n13,n18,n20,n22,n24,n31,n33,n35,n37,n39,n41,n43 err
  class n5,n6,n7 fe
  class n8,n45 ok
  class n10,n12,n17,n19,n21,n23,n30,n32,n34,n36,n38,n40,n42 dec
  class n14 api
  class n16 app
  class n26 dom
  class n27 infra
  class n29,n44 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/ice-cream-purchases: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** IceCreamPurchasesPageComponent.confirmSave (comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-purchases.controller.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/presentation/controllers/ice-cream-purchases.controller.ts), [`comercial-jhoel-app/src/app/core/services/ice-cream-purchases.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/ice-cream-purchases.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/ice-creams/purchases/ice-cream-purchases-page.component.ts), [`comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream-purchase.use-case.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/application/use-cases/create-ice-cream-purchase.use-case.ts), [`comercial-jhoel-api/src/modules/ice-creams/domain/repositories/ice-cream-purchase.repository.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/domain/repositories/ice-cream-purchase.repository.ts), [`comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-purchase.repository.ts`](../../../../comercial-jhoel-api/src/modules/ice-creams/infrastructure/persistence/typeorm-ice-cream-purchase.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO CreateIceCreamPurchaseRequestDto | !input.items || input.items.length === 0 | Number.isNaN(input.purchaseDate.getTime()) || input.purchaseDate.getTime() > Date.now() + FUTURE_DATE_GRACE_MS | !Number.isInteger(item.quantity) || item.quantity <= 0 | item.costPrice < 0 | SQL confirm_ice_cream_purchase: p_items IS NULL OR jsonb_array_length(p_items) = 0 | SQL confirm_ice_cream_purchase: NOT FOUND | SQL confirm_ice_cream_purchase: NOT v_supplier.is_active | SQL confirm_ice_cream_purchase: v_quantity IS NULL OR v_quantity <= 0 | SQL confirm_ice_cream_purchase: v_cost_price IS NULL OR v_cost_price < 0 | SQL confirm_ice_cream_purchase: NOT FOUND | SQL confirm_ice_cream_purchase: NOT v_ice_cream.is_active
6. **¿Dónde se almacenan los datos?** confirm_ice_cream_purchase(), ice_cream_purchase_details, ice_cream_purchases, ice_creams
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
