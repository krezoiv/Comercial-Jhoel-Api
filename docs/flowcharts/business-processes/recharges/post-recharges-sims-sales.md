# POST /api/recharges/sims/sales

Módulo: **Recargas electrónicas (recharges)** · Fuente editable: [`post-recharges-sims-sales.mmd`](post-recharges-sims-sales.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/recharges/sims/sales"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["RechargeSimsService.registerSale<br/><small>app/core/services/recharge-sims.service.ts</small>"]
  n6["RegisterSimSaleFormComponent.submit<br/><small>app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/recharges/sims/sales<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿RegisterRechargeSimSaleRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["RechargeSimsController.registerSale<br/><small>api/recharges/presentation/controllers/recharge-sims.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["RegisterRechargeSimSaleUseCase.execute<br/><small>api/recharges/application/use-cases/register-recharge-sim-sale.use-case.ts</small>"]
  n17["assertValidOperationDate()<br/><small>llamada en L41</small><br/><small>api/recharge-cash-box/application/utils/assert-valid-operation-date.ts</small>"]
  n18{"¿date #gt; maxAllowedOperationDate()?<br/><small>L13</small>"}
  n19(["InvalidMovementDateError()"])
  n20["assertRechargeDayWritable()<br/><small>llamada en L42</small><br/><small>api/recharges/application/utils/assert-recharge-day-writable.ts</small>"]
  n21{"¿date === todayIsoDate() #amp;#amp; !dayOpening?<br/><small>L20</small>"}
  n22(["RechargeDayNotOpenedError(date)"])
  n23{"¿dayOpening?.isClosed?<br/><small>L24</small>"}
  n24(["RechargeDayAlreadyClosedError(date)"])
  end
  subgraph s25["Dominio → Infraestructura"]
  n26["Puerto RechargeSimDailyStockRepository.registerSale<br/>@Inject(RECHARGE_SIM_DAILY_STOCK_REPOSITORY)"]
  n27["TypeOrmRechargeSimDailyStockRepository<br/><small>api/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts</small>"]
  subgraph s28["PostgreSQL — función register_recharge_sim_sale"]
  n29[["SELECT register_recharge_sim_sale(…)<br/><small>registerSale — una transacción</small>"]]
  n30{"¿NOT FOUND?"}
  n31(["RAISE SIM_TYPE_NOT_FOUND<br/>(rollback)"])
  n32{"¿NOT v_type.is_active?"}
  n33(["RAISE SIM_TYPE_INACTIVE<br/>(rollback)"])
  n34{"¿p_quantity IS NULL OR p_quantity #lt;= 0?"}
  n35(["RAISE INVALID_SIM_QUANTITY<br/>(rollback)"])
  n36{"¿v_day_closed_at IS NOT NULL?"}
  n37(["RAISE RECHARGE_DAY_CLOSED<br/>(rollback)"])
  n38{"¿v_current_stock #lt; p_quantity?"}
  n39(["RAISE INSUFFICIENT_SIM_STOCK<br/>(rollback)"])
  n40[["ensure_recharge_sim_daily_stock()"]]
  n41[("Escribe:<br/>recharge_sim_daily_stock<br/>recharge_sim_sales")]
  end
  end
  n42(["Fin: la interfaz se actualiza<br/>this.isSubmitting.set<br/>this.notificationService.success<br/>this.registered.emit<br/>this.notificationService.error"])
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
  n23 -->|no| n26
  n26 -->|implementa| n27
  n27 -->|registerSale| n29
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
  n38 -->|no · llama| n40
  n38 -->|no| n41
  n41 -->|COMMIT| n8
  n8 --> n42
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
  class n2,n3,n11,n13,n19,n22,n24,n31,n33,n35,n37,n39 err
  class n5,n6,n7 fe
  class n8,n42 ok
  class n10,n12,n18,n21,n23,n30,n32,n34,n36,n38 dec
  class n14 api
  class n16 app
  class n17,n20,n26 dom
  class n27 infra
  class n29,n40,n41 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/recharges/sims/sales: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** RegisterSimSaleFormComponent.submit (comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts`](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts), [`comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-form/register-sim-sale-form.component.ts), [`comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sim-sale.use-case.ts`](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sim-sale.use-case.ts), [`comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/assert-valid-operation-date.ts`](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/assert-valid-operation-date.ts), [`comercial-jhoel-api/src/modules/recharges/application/utils/assert-recharge-day-writable.ts`](../../../../comercial-jhoel-api/src/modules/recharges/application/utils/assert-recharge-day-writable.ts), [`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sim-daily-stock.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sim-daily-stock.repository.ts), [`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO RegisterRechargeSimSaleRequestDto | date > maxAllowedOperationDate() | date === todayIsoDate() && !dayOpening | dayOpening?.isClosed | SQL register_recharge_sim_sale: NOT FOUND | SQL register_recharge_sim_sale: NOT v_type.is_active | SQL register_recharge_sim_sale: p_quantity IS NULL OR p_quantity <= 0 | SQL register_recharge_sim_sale: v_day_closed_at IS NOT NULL | SQL register_recharge_sim_sale: v_current_stock < p_quantity
6. **¿Dónde se almacenan los datos?** register_recharge_sim_sale(), recharge_sim_daily_stock, recharge_sim_sales
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
