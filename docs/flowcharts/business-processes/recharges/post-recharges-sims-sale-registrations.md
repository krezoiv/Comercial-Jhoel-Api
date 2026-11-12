# POST /api/recharges/sims/sale-registrations

Módulo: **Recargas electrónicas (recharges)** · Fuente editable: [`post-recharges-sims-sale-registrations.mmd`](post-recharges-sims-sale-registrations.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/recharges/sims/sale-registrations"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["RechargeSimsService.registerSaleRegistration<br/><small>app/core/services/recharge-sims.service.ts</small>"]
  n6["RegisterSimSaleRegistrationFormComponent.submit<br/><small>app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/recharges/sims/sale-registrations<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿RegisterRechargeSimSaleRegistrationRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["RechargeSimsController.registerSaleRegistration<br/><small>api/recharges/presentation/controllers/recharge-sims.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["RegisterRechargeSimSaleWithRegistrationUseCase.execute<br/><small>api/recharges/application/use-cases/register-recharge-sim-sale-with-registration.use-case.ts</small>"]
  n17["assertValidOperationDate()<br/><small>llamada en L58</small><br/><small>api/recharge-cash-box/application/utils/assert-valid-operation-date.ts</small>"]
  n18{"¿date #gt; maxAllowedOperationDate()?<br/><small>L13</small>"}
  n19(["InvalidMovementDateError()"])
  n20["assertRechargeDayWritable()<br/><small>llamada en L59</small><br/><small>api/recharges/application/utils/assert-recharge-day-writable.ts</small>"]
  n21{"¿date === todayIsoDate() #amp;#amp; !dayOpening?<br/><small>L20</small>"}
  n22(["RechargeDayNotOpenedError(date)"])
  n23{"¿dayOpening?.isClosed?<br/><small>L24</small>"}
  n24(["RechargeDayAlreadyClosedError(date)"])
  n25["assertValidDpiImage()<br/><small>llamada en L62</small><br/><small>api/phones/application/utils/assert-valid-dpi-image.ts</small>"]
  n26{"¿!ALLOWED_MIME_TYPES.has(file.mimetype)?<br/><small>L16</small>"}
  n27(["InvalidDpiImageError( 'La imagen del DPI debe ser JPG, PNG o WEBP.', )"])
  n28{"¿file.size #gt; MAX_DPI_IMAGE_SIZE_BYTES?<br/><small>L21</small>"}
  n29(["InvalidDpiImageError( 'La imagen del DPI no puede superar los 5 MB.', )"])
  n30{"¿file.size === 0?<br/><small>L26</small>"}
  n31(["InvalidDpiImageError('La imagen del DPI está vacía.')"])
  end
  subgraph s32["Dominio → Infraestructura"]
  n33["Puerto TransactionManager.runInTransaction<br/>@Inject(TRANSACTION_MANAGER)"]
  n34["TypeOrmTransactionManager<br/><small>api/shared/infrastructure/services/typeorm-transaction-manager.service.ts</small>"]
  n35[("runInTransaction: TypeORM Repository")]
  end
  subgraph s36["Dominio → Infraestructura"]
  n37["Puerto RechargeSimDailyStockRepository.registerSingleUnitSale<br/>@Inject(RECHARGE_SIM_DAILY_STOCK_REPOSITORY)"]
  n38["TypeOrmRechargeSimDailyStockRepository<br/><small>api/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts</small>"]
  subgraph s39["PostgreSQL — función register_recharge_sim_sale_unit"]
  n40[["SELECT register_recharge_sim_sale_unit(…)<br/><small>registerSingleUnitSale — una transacción</small>"]]
  n41{"¿NOT FOUND?"}
  n42(["RAISE SIM_TYPE_NOT_FOUND<br/>(rollback)"])
  n43{"¿NOT v_type.is_active?"}
  n44(["RAISE SIM_TYPE_INACTIVE<br/>(rollback)"])
  n45{"¿v_day_closed_at IS NOT NULL?"}
  n46(["RAISE RECHARGE_DAY_CLOSED<br/>(rollback)"])
  n47{"¿v_current_stock #lt; 1?"}
  n48(["RAISE INSUFFICIENT_SIM_STOCK<br/>(rollback)"])
  n49[["ensure_recharge_sim_daily_stock()"]]
  n50[("Escribe:<br/>recharge_sim_daily_stock<br/>recharge_sim_sales")]
  end
  end
  subgraph s51["Dominio → Infraestructura"]
  n52["Puerto RechargeSimSaleRegistrationRepository.saveDpiImage / create<br/>@Inject(RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY)"]
  n53["TypeOrmRechargeSimSaleRegistrationRepository<br/><small>api/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts</small>"]
  subgraph s54["PostgreSQL — función register_recharge_sim_sale_registration"]
  n55[["SELECT register_recharge_sim_sale_registration(…)<br/><small>create — una transacción</small>"]]
  n56{"¿NOT FOUND?"}
  n57(["RAISE RECHARGE_SIM_SALE_NOT_FOUND<br/>(rollback)"])
  n58{"¿p_sim_number IS NULL OR length(trim(p_sim_number)) = 0?"}
  n59(["RAISE SIM_NUMBER_REQUIRED<br/>(rollback)"])
  n60{"¿p_sku IS NULL OR length(trim(p_sku)) = 0?"}
  n61(["RAISE SIM_SALE_SKU_REQUIRED<br/>(rollback)"])
  n62{"¿p_client_dpi IS NULL OR length(trim(p_client_dpi)) = 0?"}
  n63(["RAISE CLIENT_DPI_REQUIRED<br/>(rollback)"])
  n64{"¿p_sale_price IS NULL OR p_sale_price #lt; 0?"}
  n65(["RAISE INVALID_SIM_SALE_PRICE<br/>(rollback)"])
  n66{"¿v_day_closed_at IS NOT NULL?"}
  n67(["RAISE RECHARGE_DAY_CLOSED<br/>(rollback)"])
  n68["Otros RAISE de register_recharge_sim_sale_registration (condición no extraída):<br/>SIM_SALE_CLIENT_INVALID"]
  n69[("Escribe:<br/>recharge_sim_sale_registrations")]
  end
  n70[("saveDpiImage: TypeORM Repository")]
  end
  n71(["Fin: la interfaz se actualiza<br/>this.isSubmitting.set<br/>this.notificationService.success<br/>this.registered.emit<br/>this.notificationService.error"])
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
  n23 -->|no| n25
  n25 --> n26
  n26 -->|sí| n27
  n27 --> n2
  n26 -->|no| n28
  n28 -->|sí| n29
  n29 --> n2
  n28 -->|no| n30
  n30 -->|sí| n31
  n31 --> n2
  n30 -->|no| n33
  n33 -->|implementa| n34
  n34 --> n35
  n35 --> n8
  n30 -->|no| n37
  n37 -->|implementa| n38
  n38 -->|registerSingleUnitSale| n40
  n40 --> n41
  n41 -->|sí| n42
  n42 --> n2
  n41 -->|no| n43
  n43 -->|sí| n44
  n44 --> n2
  n43 -->|no| n45
  n45 -->|sí| n46
  n46 --> n2
  n45 -->|no| n47
  n47 -->|sí| n48
  n48 --> n2
  n47 -->|no · llama| n49
  n47 -->|no| n50
  n50 -->|COMMIT| n8
  n30 -->|no| n52
  n52 -->|implementa| n53
  n53 -->|create| n55
  n55 --> n56
  n56 -->|sí| n57
  n57 --> n2
  n56 -->|no| n58
  n58 -->|sí| n59
  n59 --> n2
  n58 -->|no| n60
  n60 -->|sí| n61
  n61 --> n2
  n60 -->|no| n62
  n62 -->|sí| n63
  n63 --> n2
  n62 -->|no| n64
  n64 -->|sí| n65
  n65 --> n2
  n64 -->|no| n66
  n66 -->|sí| n67
  n67 --> n2
  n55 -.->|también puede lanzar| n68
  n68 --> n2
  n66 -->|no| n69
  n69 -->|COMMIT| n8
  n53 --> n70
  n70 --> n8
  n8 --> n71
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
  class n2,n3,n11,n13,n19,n22,n24,n27,n29,n31,n42,n44,n46,n48,n57,n59,n61,n63,n65,n67,n68 err
  class n5,n6,n7 fe
  class n8,n71 ok
  class n10,n12,n18,n21,n23,n26,n28,n30,n41,n43,n45,n47,n56,n58,n60,n62,n64,n66 dec
  class n14 api
  class n16 app
  class n17,n20,n25,n33,n37,n52 dom
  class n34,n38,n53 infra
  class n35,n40,n49,n50,n55,n69,n70 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/recharges/sims/sale-registrations: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** RegisterSimSaleRegistrationFormComponent.submit (comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts`](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharge-sims.controller.ts), [`comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/recharge-sims.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-sim-sale-registration-form/register-sim-sale-registration-form.component.ts), [`comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sim-sale-with-registration.use-case.ts`](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-sim-sale-with-registration.use-case.ts), [`comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/assert-valid-operation-date.ts`](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/assert-valid-operation-date.ts), [`comercial-jhoel-api/src/modules/recharges/application/utils/assert-recharge-day-writable.ts`](../../../../comercial-jhoel-api/src/modules/recharges/application/utils/assert-recharge-day-writable.ts), [`comercial-jhoel-api/src/modules/phones/application/utils/assert-valid-dpi-image.ts`](../../../../comercial-jhoel-api/src/modules/phones/application/utils/assert-valid-dpi-image.ts), [`comercial-jhoel-api/src/shared/application/ports/transaction-manager.port.ts`](../../../../comercial-jhoel-api/src/shared/application/ports/transaction-manager.port.ts), [`comercial-jhoel-api/src/shared/infrastructure/services/typeorm-transaction-manager.service.ts`](../../../../comercial-jhoel-api/src/shared/infrastructure/services/typeorm-transaction-manager.service.ts), [`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sim-daily-stock.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sim-daily-stock.repository.ts), [`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-daily-stock.repository.ts), [`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sim-sale-registration.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sim-sale-registration.repository.ts), [`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sim-sale-registration.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO RegisterRechargeSimSaleRegistrationRequestDto | date > maxAllowedOperationDate() | date === todayIsoDate() && !dayOpening | dayOpening?.isClosed | !ALLOWED_MIME_TYPES.has(file.mimetype) | file.size > MAX_DPI_IMAGE_SIZE_BYTES | file.size === 0 | SQL register_recharge_sim_sale_unit: NOT FOUND | SQL register_recharge_sim_sale_unit: NOT v_type.is_active | SQL register_recharge_sim_sale_unit: v_day_closed_at IS NOT NULL | SQL register_recharge_sim_sale_unit: v_current_stock < 1 | SQL register_recharge_sim_sale_registration: NOT FOUND | SQL register_recharge_sim_sale_registration: p_sim_number IS NULL OR length(trim(p_sim_number)) = 0
6. **¿Dónde se almacenan los datos?** register_recharge_sim_sale_unit(), register_recharge_sim_sale_registration(), recharge_sim_daily_stock, recharge_sim_sales, recharge_sim_sale_registrations
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
