# POST /api/recharges/purchases/:id/void

Módulo: **Recargas electrónicas (recharges)** · Fuente editable: [`post-recharges-purchases-id-void.mmd`](post-recharges-purchases-id-void.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/recharges/purchases/:id/void"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["RechargesService.voidPurchase<br/><small>app/core/services/recharges.service.ts</small>"]
  n6["RechargesPageComponent.confirmVoidPurchase<br/><small>app/features/dashboard/recharges/recharges-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/recharges/purchases/:id/void<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿VoidRechargePurchaseRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["RechargesController.voidPurchase<br/><small>api/recharges/presentation/controllers/recharges.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["VoidRechargePurchaseUseCase.execute<br/><small>api/recharges/application/use-cases/void-recharge-purchase.use-case.ts</small>"]
  n19{"¿!reason?<br/><small>L42</small>"}
  n20(["VoidReasonRequiredError()"])
  n21{"¿!purchase?<br/><small>L47</small>"}
  n22(["RechargePurchaseNotFoundError()"])
  n23{"¿purchase.isVoided?<br/><small>L50</small>"}
  n24(["RechargePurchaseAlreadyVoidedError()"])
  end
  subgraph s25["Dominio → Infraestructura"]
  n26["Puerto RechargePurchaseRepository.findById / voidPurchase<br/>@Inject(RECHARGE_PURCHASE_REPOSITORY)"]
  n27["TypeOrmRechargePurchaseRepository<br/><small>api/recharges/infrastructure/persistence/typeorm-recharge-purchase.repository.ts</small>"]
  n28[("findById: TypeORM Repository")]
  subgraph s29["PostgreSQL — función void_recharge_purchase"]
  n30[["SELECT void_recharge_purchase(…)<br/><small>voidPurchase — una transacción</small>"]]
  n31{"¿p_reason IS NULL OR length(trim(p_reason)) = 0?"}
  n32(["RAISE VOID_REASON_REQUIRED<br/>(rollback)"])
  n33{"¿NOT FOUND?"}
  n34(["RAISE PURCHASE_NOT_FOUND<br/>(rollback)"])
  n35{"¿v_purchase.is_voided?"}
  n36(["RAISE PURCHASE_ALREADY_VOIDED<br/>(rollback)"])
  n37{"¿v_day_closed_at IS NOT NULL?"}
  n38(["RAISE RECHARGE_DAY_CLOSED<br/>(rollback)"])
  n39{"¿NOT FOUND?"}
  n40(["RAISE PURCHASE_NOT_FOUND<br/>(rollback)"])
  n41{"¿v_balance.final_balance IS NOT NULL?"}
  n42(["RAISE PURCHASE_CYCLE_ALREADY_CLOSED<br/>(rollback)"])
  n43{"¿v_balance.daily_balance - v_purchase.credited_amount #lt; 0?"}
  n44(["RAISE INSUFFICIENT_BALANCE_TO_REVERT<br/>(rollback)"])
  n45[("Escribe:<br/>recharge_daily_balances<br/>recharge_purchases")]
  end
  end
  n46(["Fin: la interfaz se actualiza<br/>this.isVoidingPurchase.set<br/>this.isVoidPurchaseModalOpen.set<br/>this.voidPurchaseTarget.set<br/>this.notificationService.success<br/>this.notificationService.error"])
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
  n14 -->|no| n15
  n15 --> n2
  n14 -->|sí| n16
  n16 --> n18
  n18 --> n19
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
  n27 --> n28
  n28 --> n8
  n27 -->|voidPurchase| n30
  n30 --> n31
  n31 -->|sí| n32
  n32 --> n2
  n31 -->|no| n33
  n33 -->|sí| n34
  n34 --> n2
  n33 -->|no| n35
  n35 -->|sí| n36
  n36 --> n2
  n35 -->|no| n37
  n37 -->|sí| n38
  n38 --> n2
  n37 -->|no| n39
  n39 -->|sí| n40
  n40 --> n2
  n39 -->|no| n41
  n41 -->|sí| n42
  n42 --> n2
  n41 -->|no| n43
  n43 -->|sí| n44
  n44 --> n2
  n43 -->|no| n45
  n45 -->|COMMIT| n8
  n8 --> n46
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
  class n2,n3,n11,n13,n15,n20,n22,n24,n32,n34,n36,n38,n40,n42,n44 err
  class n5,n6,n7 fe
  class n8,n46 ok
  class n10,n12,n14,n19,n21,n23,n31,n33,n35,n37,n39,n41,n43 dec
  class n16 api
  class n18 app
  class n26 dom
  class n27 infra
  class n28,n30,n45 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/recharges/purchases/:id/void: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** RechargesPageComponent.confirmVoidPurchase (comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts`](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts), [`comercial-jhoel-app/src/app/core/services/recharges.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/recharges-page.component.ts), [`comercial-jhoel-api/src/modules/recharges/application/use-cases/void-recharge-purchase.use-case.ts`](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/void-recharge-purchase.use-case.ts), [`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-purchase.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-purchase.repository.ts), [`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-purchase.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-purchase.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | DTO VoidRechargePurchaseRequestDto | !reason | !purchase | purchase.isVoided | SQL void_recharge_purchase: p_reason IS NULL OR length(trim(p_reason)) = 0 | SQL void_recharge_purchase: NOT FOUND | SQL void_recharge_purchase: v_purchase.is_voided | SQL void_recharge_purchase: v_day_closed_at IS NOT NULL | SQL void_recharge_purchase: NOT FOUND | SQL void_recharge_purchase: v_balance.final_balance IS NOT NULL | SQL void_recharge_purchase: v_balance.daily_balance - v_purchase.credited_amount < 0
6. **¿Dónde se almacenan los datos?** void_recharge_purchase(), recharge_daily_balances, recharge_purchases
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
