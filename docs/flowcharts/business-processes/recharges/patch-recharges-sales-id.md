# PATCH /api/recharges/sales/:id

Módulo: **Recargas electrónicas (recharges)** · Fuente editable: [`patch-recharges-sales-id.mmd`](patch-recharges-sales-id.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta PATCH /api/recharges/sales/:id"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["RechargesService.updateSale<br/><small>app/core/services/recharges.service.ts</small>"]
  n6["RechargeSaleFormModalComponent.submit<br/><small>app/features/dashboard/recharges/components/recharge-sale-form-modal/recharge-sale-form-modal.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP PATCH /api/recharges/sales/:id<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿UpdateRechargeSaleRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["RechargesController.updateSale<br/><small>api/recharges/presentation/controllers/recharges.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["UpdateRechargeSaleUseCase.execute<br/><small>api/recharges/application/use-cases/update-recharge-sale.use-case.ts</small>"]
  end
  subgraph s17["Dominio → Infraestructura"]
  n18["Puerto RechargeSaleRepository.update<br/>@Inject(RECHARGE_SALE_REPOSITORY)"]
  n19["TypeOrmRechargeSaleRepository<br/><small>api/recharges/infrastructure/persistence/typeorm-recharge-sale.repository.ts</small>"]
  subgraph s20["PostgreSQL — función update_recharge_sale"]
  n21[["SELECT update_recharge_sale(…)<br/><small>update — una transacción</small>"]]
  n22{"¿NOT FOUND?"}
  n23(["RAISE RECHARGE_SALE_NOT_FOUND<br/>(rollback)"])
  n24{"¿v_day_closed_at IS NOT NULL?"}
  n25(["RAISE RECHARGE_DAY_CLOSED<br/>(rollback)"])
  n26{"¿v_final_balance IS NOT NULL?"}
  n27(["RAISE RECHARGE_SALE_LOCKED<br/>(rollback)"])
  n28{"¿p_amount IS NULL OR p_amount #lt;= 0?"}
  n29(["RAISE INVALID_AMOUNT<br/>(rollback)"])
  n30{"¿p_phone_number IS NULL OR length(trim(p_phone_number)) = 0?"}
  n31(["RAISE INVALID_PHONE_NUMBER<br/>(rollback)"])
  n32[("Escribe:<br/>recharge_sales")]
  end
  end
  n33(["Fin: la interfaz se actualiza<br/>this.errorMessage.set<br/>this.isSubmitting.set<br/>this.notificationService.success<br/>this.saved.emit"])
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
  n19 -->|update| n21
  n21 --> n22
  n22 -->|sí| n23
  n23 --> n2
  n22 -->|no| n24
  n24 -->|sí| n25
  n25 --> n2
  n24 -->|no| n26
  n26 -->|sí| n27
  n27 --> n2
  n26 -->|no| n28
  n28 -->|sí| n29
  n29 --> n2
  n28 -->|no| n30
  n30 -->|sí| n31
  n31 --> n2
  n30 -->|no| n32
  n32 -->|COMMIT| n8
  n8 --> n33
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
  class n2,n3,n11,n13,n23,n25,n27,n29,n31 err
  class n5,n6,n7 fe
  class n8,n33 ok
  class n10,n12,n22,n24,n26,n28,n30 dec
  class n14 api
  class n16 app
  class n18 dom
  class n19 infra
  class n21,n32 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de PATCH /api/recharges/sales/:id: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** RechargeSaleFormModalComponent.submit (comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-form-modal/recharge-sale-form-modal.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts`](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts), [`comercial-jhoel-app/src/app/core/services/recharges.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-form-modal/recharge-sale-form-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/recharge-sale-form-modal/recharge-sale-form-modal.component.ts), [`comercial-jhoel-api/src/modules/recharges/application/use-cases/update-recharge-sale.use-case.ts`](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/update-recharge-sale.use-case.ts), [`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sale.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-sale.repository.ts), [`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sale.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-sale.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO UpdateRechargeSaleRequestDto | SQL update_recharge_sale: NOT FOUND | SQL update_recharge_sale: v_day_closed_at IS NOT NULL | SQL update_recharge_sale: v_final_balance IS NOT NULL | SQL update_recharge_sale: p_amount IS NULL OR p_amount <= 0 | SQL update_recharge_sale: p_phone_number IS NULL OR length(trim(p_phone_number)) = 0
6. **¿Dónde se almacenan los datos?** update_recharge_sale(), recharge_sales
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
