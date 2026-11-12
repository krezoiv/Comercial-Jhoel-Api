# Arqueo de Caja (con conteo opcional de Bodega = arqueo de Bodega)

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`post-cash-control-counts.mmd`](post-cash-control-counts.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: Arqueo de Caja (con conteo opcional de Bodega = arqueo de Bodega)"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["CashCustodyService.registerCount<br/><small>app/core/services/cash-custody.service.ts</small>"]
  n6["CashCountModalComponent.save<br/><small>app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/cash-control/counts<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿RegisterCashCountRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["CashCustodyController.createCount<br/><small>api/cash-control/presentation/controllers/cash-custody.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["RegisterCashCountUseCase.execute<br/><small>api/cash-control/application/use-cases/cash-custody.use-cases.ts</small>"]
  n17["assertCashCustodyPermission()<br/><small>llamada en L268</small><br/><small>api/cash-control/domain/policies/cash-control.policy.ts</small>"]
  n18{"¿!(CASH_CUSTODY_PERMISSION_ROLES[permission] as readonly string[]).includes( role ?? '', )?<br/><small>L32</small>"}
  n19(["cashControlError('CASH_CUSTODY_FORBIDDEN')"])
  n20{"¿!input.correctionReason #124;#124; input.correctionReason.trim().length #lt; 5?<br/><small>L271</small>"}
  n21(["cashControlError('CASH_REASON_REQUIRED')"])
  n22{"¿!input.details?.length?<br/><small>L275</small>"}
  n23(["cashControlError('CASH_BREAKDOWN_REQUIRED')"])
  n24{"¿!count?<br/><small>L288</small>"}
  n25(["cashControlError('CASH_COUNT_NOT_FOUND')"])
  end
  subgraph s26["Dominio → Infraestructura"]
  n27["Puerto CashCustodyRepository.registerCount / findCountById<br/>@Inject(CASH_CUSTODY_REPOSITORY)"]
  n28["TypeOrmCashCustodyRepository<br/><small>api/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts</small>"]
  subgraph s29["PostgreSQL — función register_cash_count"]
  n30[["SELECT register_cash_count(…)<br/><small>registerCount — una transacción</small>"]]
  n31{"¿p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0?"}
  n32(["RAISE CASH_IDEMPOTENCY_KEY_REQUIRED<br/>(rollback)"])
  n33{"¿v_row.denomination IS NULL OR NOT cash_valid_denomination(v_row.denomination) OR v_row.quantity IS NULL OR v_row.quantity #lt; 0 OR v_row.quantity #lt;#gt; trunc(v_row.q?"}
  n34(["RAISE CASH_INVALID_DENOMINATION<br/>(rollback)"])
  n35{"¿p_warehouse_counted IS NOT NULL AND (p_warehouse_counted #lt; 0 OR p_warehouse_counted #lt;#gt; round(p_warehouse_counted, 2))?"}
  n36(["RAISE CASH_INVALID_AMOUNT<br/>(rollback)"])
  n37{"¿NOT FOUND?"}
  n38(["RAISE CASH_COUNT_NOT_FOUND<br/>(rollback)"])
  n39{"¿v_original.status #lt;#gt; 'VIGENTE'?"}
  n40(["RAISE CASH_COUNT_ALREADY_REPLACED<br/>(rollback)"])
  n41{"¿v_day.day_opening_id IS NULL?"}
  n42(["RAISE CASH_CUSTODY_DAY_NOT_OPEN<br/>(rollback)"])
  n43["Otros RAISE de register_cash_count (condición no extraída):<br/>CASH_BREAKDOWN_REQUIRED, CASH_REASON_REQUIRED"]
  n44[["cash_balance()"]]
  n45[["cash_custody_assert_role()"]]
  n46[["warehouse_cash_balance()"]]
  n47[("Escribe:<br/>cash_count_details<br/>cash_counts")]
  end
  n48[("findCountById: TypeORM Repository")]
  end
  n49(["Fin: la interfaz se actualiza<br/>this.isSaving.set<br/>this.errorMessage.set<br/>this.result.set<br/>this.saved.emit"])
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
  n20 -->|sí| n21
  n21 --> n2
  n20 -->|no| n22
  n22 -->|sí| n23
  n23 --> n2
  n22 -->|no| n24
  n24 -->|sí| n25
  n25 --> n2
  n24 -->|no| n27
  n27 -->|implementa| n28
  n28 -->|registerCount| n30
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
  n30 -.->|también puede lanzar| n43
  n43 --> n2
  n41 -->|no · llama| n44
  n41 -->|no · llama| n45
  n41 -->|no · llama| n46
  n41 -->|no| n47
  n47 -->|COMMIT| n8
  n28 --> n48
  n48 --> n8
  n8 --> n49
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
  class n2,n3,n11,n13,n19,n21,n23,n25,n32,n34,n36,n38,n40,n42,n43 err
  class n5,n6,n7 fe
  class n8,n49 ok
  class n10,n12,n18,n20,n22,n24,n31,n33,n35,n37,n39,n41 dec
  class n14 api
  class n16 app
  class n17,n27 dom
  class n28 infra
  class n30,n44,n45,n46,n47,n48 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/cash-control/counts: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** CashCountModalComponent.save (comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts), [`comercial-jhoel-app/src/app/core/services/cash-custody.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-custody.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-custody.repository.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO RegisterCashCountRequestDto | !(CASH_CUSTODY_PERMISSION_ROLES[permission] as readonly string[]).includes( role ?? '', ) | !input.correctionReason || input.correctionReason.trim().length < 5 | !input.details?.length | !count | SQL register_cash_count: p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0 | SQL register_cash_count: v_row.denomination IS NULL OR NOT cash_valid_denomination(v_row.denomination) OR v_row.quantity IS NULL OR v_row.quantity < 0 OR v_row.quantity <> trunc(v_row.q | SQL register_cash_count: p_warehouse_counted IS NOT NULL AND (p_warehouse_counted < 0 OR p_warehouse_counted <> round(p_warehouse_counted, 2)) | SQL register_cash_count: NOT FOUND | SQL register_cash_count: v_original.status <> 'VIGENTE' | SQL register_cash_count: v_day.day_opening_id IS NULL
6. **¿Dónde se almacenan los datos?** register_cash_count(), cash_count_details, cash_counts
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
