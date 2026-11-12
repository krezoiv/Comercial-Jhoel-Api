# Recargas: cuadre de ventas

Módulo: **Recargas electrónicas (recharges)** · Fuente editable: [`post-recharges-sales-closure.mmd`](post-recharges-sales-closure.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: Recargas: cuadre de ventas"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["RechargesService.registerSalesClosure<br/><small>app/core/services/recharges.service.ts</small>"]
  n6["SalesSummaryCardComponent.save<br/><small>app/features/dashboard/recharges/components/sales-summary-card/sales-summary-card.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/recharges/sales-closure<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿RegisterRechargeSalesClosureRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["RechargesController.registerSalesClosure<br/><small>api/recharges/presentation/controllers/recharges.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["RegisterRechargeSalesClosureUseCase.execute<br/><small>api/recharges/application/use-cases/register-recharge-sales-closure.use-case.ts</small>"]
  n17["assertValidOperationDate()<br/><small>llamada en L63</small><br/><small>api/recharge-cash-box/application/utils/assert-valid-operation-date.ts</small>"]
  n18{"¿date #gt; maxAllowedOperationDate()?<br/><small>L13</small>"}
  n19(["InvalidMovementDateError()"])
  n20["assertRechargeDayWritable()<br/><small>llamada en L64</small><br/><small>api/recharges/application/utils/assert-recharge-day-writable.ts</small>"]
  n21{"¿date === todayIsoDate() #amp;#amp; !dayOpening?<br/><small>L20</small>"}
  n22(["RechargeDayNotOpenedError(date)"])
  n23{"¿dayOpening?.isClosed?<br/><small>L24</small>"}
  n24(["RechargeDayAlreadyClosedError(date)"])
  end
  n25["Caso de uso GetRechargeSalesSummaryUseCase<br/><small>execute</small>"]
  subgraph s26["Dominio → Infraestructura"]
  n27["Puerto RechargeSalesClosureRepository.registerClosure<br/>@Inject(RECHARGE_SALES_CLOSURE_REPOSITORY)"]
  n28["TypeOrmRechargeSalesClosureRepository<br/><small>api/recharges/infrastructure/persistence/typeorm-recharge-sales-closure.repository.ts</small>"]
  subgraph s29["PostgreSQL — función register_recharge_sales_closure"]
  n30[["SELECT register_recharge_sales_closure(…)<br/><small>registerClosure — una transacción</small>"]]
  n31{"¿v_day_closed_at IS NOT NULL?"}
  n32(["RAISE RECHARGE_DAY_CLOSED<br/>(rollback)"])
  n33{"¿p_total_collected IS NULL OR p_total_collected #lt; 0?"}
  n34(["RAISE INVALID_TOTAL_COLLECTED<br/>(rollback)"])
  n35{"¿v_row.final_balance IS NULL?"}
  n36(["RAISE PENDING_TYPE_CLOSURE<br/>(rollback)"])
  n37["Otros RAISE de register_recharge_sales_closure (condición no extraída):<br/>SALES_CLOSURE_EDIT_FORBIDDEN"]
  n38[("Escribe:<br/>recharge_daily_balances<br/>recharge_sales_closures")]
  end
  end
  n39(["Fin: la interfaz se actualiza<br/>this.isSaving.set<br/>this.summary.set<br/>this.summaryLoaded.emit<br/>this.totalCollectedDraft.set<br/>this.notificationService.success<br/>this.closureSaved.emit"])
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
  n17 --> n18
  n18 -->|sí| n19
  n19 --> n2
  n18 -->|no| n20
  n20 --> n21
  n21 -->|sí| n22
  n22 --> n2
  n21 -->|no| n23
  n23 -->|sí| n24
  n24 --> n2
  n16 -.->|consulta| n25
  n23 -->|no| n27
  n27 -->|implementa| n28
  n28 -->|registerClosure| n30
  n30 --> n31
  n31 -->|sí| n32
  n32 --> n2
  n31 -->|no| n33
  n33 -->|sí| n34
  n34 --> n2
  n33 -->|no| n35
  n35 -->|sí| n36
  n36 --> n2
  n30 -.->|también puede lanzar| n37
  n37 --> n2
  n35 -->|no| n38
  n38 -->|COMMIT| n8
  n8 --> n39
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
  class n2,n3,n11,n13,n19,n22,n24,n32,n34,n36,n37 err
  class n5,n6,n7 fe
  class n8,n39 ok
  class n10,n12,n18,n21,n23,n31,n33,n35 dec
  class n14 api
  class n16,n25 app
  class n17,n20,n27 dom
  class n28 infra
  class n30,n38 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/recharges/sales-closure: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** SalesSummaryCardComponent.save (comercial-jhoel-app/src/app/features/dashboard/recharges/components/sales-summary-card/sales-summary-card.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts`](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts), [`comercial-jhoel-app/src/app/core/services/recharges.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/recharges/components/sales-summary-card/sales-summary-card.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/sales-summary-card/sales-summary-card.component.ts), [`comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sales-closure.use-case.ts`](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sales-closure.use-case.ts), [`comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/assert-valid-operation-date.ts`](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/assert-valid-operation-date.ts), [`comercial-jhoel-api/src/modules/recharges/application/utils/assert-recharge-day-writable.ts`](../../../../comercial-jhoel-api/src/modules/recharges/application/utils/assert-recharge-day-writable.ts), [`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sales-summary.use-case.ts`](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-sales-summary.use-case.ts), [`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sales-closure.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sales-closure.repository.ts), [`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sales-closure.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sales-closure.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO RegisterRechargeSalesClosureRequestDto | date > maxAllowedOperationDate() | date === todayIsoDate() && !dayOpening | dayOpening?.isClosed | SQL register_recharge_sales_closure: v_day_closed_at IS NOT NULL | SQL register_recharge_sales_closure: p_total_collected IS NULL OR p_total_collected < 0 | SQL register_recharge_sales_closure: v_row.final_balance IS NULL
6. **¿Dónde se almacenan los datos?** register_recharge_sales_closure(), recharge_daily_balances, recharge_sales_closures
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
