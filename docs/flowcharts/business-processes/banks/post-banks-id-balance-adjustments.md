# POST /api/banks/:id/balance-adjustments

Módulo: **Bancos y Agentes Bancarios (día, saldos, cuadre, transferencias) (banks)** · Fuente editable: [`post-banks-id-balance-adjustments.mmd`](post-banks-id-balance-adjustments.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/banks/:id/balance-adjustments"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["BankService.adjustBalance<br/><small>app/core/services/bank.service.ts</small>"]
  n6["BankAgentsPageComponent.confirmAdjust<br/><small>app/features/dashboard/bank-agents/bank-agents-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/banks/:id/balance-adjustments<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿AdjustBankBalanceRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["BanksController.adjustBalance<br/><small>api/banks/presentation/controllers/banks.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["AdjustBankBalanceUseCase.execute<br/><small>api/banks/application/use-cases/adjust-bank-balance.use-case.ts</small>"]
  n19{"¿!reason?<br/><small>L32</small>"}
  n20(["MovementReasonRequiredError()"])
  end
  subgraph s21["Dominio → Infraestructura"]
  n22["Puerto BankMovementRepository.adjustBalance<br/>@Inject(BANK_MOVEMENT_REPOSITORY)"]
  n23["TypeOrmBankMovementRepository<br/><small>api/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts</small>"]
  subgraph s24["PostgreSQL — función adjust_bank_balance"]
  n25[["SELECT adjust_bank_balance(…)<br/><small>adjustBalance — una transacción</small>"]]
  n26{"¿p_reason IS NULL OR btrim(p_reason) = ''?"}
  n27(["RAISE REASON_REQUIRED<br/>(rollback)"])
  n28{"¿p_new_balance IS NULL?"}
  n29(["RAISE INVALID_MOVEMENT_AMOUNT<br/>(rollback)"])
  n30{"¿NOT FOUND?"}
  n31(["RAISE BANK_NOT_FOUND<br/>(rollback)"])
  n32{"¿v_current = p_new_balance?"}
  n33(["RAISE BALANCE_UNCHANGED<br/>(rollback)"])
  end
  end
  n34(["Fin: la interfaz se actualiza<br/>this.isAdjusting.set<br/>this.adjustingRow.set<br/>this.notificationService.success<br/>this.notificationService.error"])
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
  n19 -->|no| n22
  n22 -->|implementa| n23
  n23 -->|adjustBalance| n25
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
  n32 -->|no| n8
  n8 --> n34
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
  class n2,n3,n11,n13,n15,n20,n27,n29,n31,n33 err
  class n5,n6,n7 fe
  class n8,n34 ok
  class n10,n12,n14,n19,n26,n28,n30,n32 dec
  class n16 api
  class n18 app
  class n22 dom
  class n23 infra
  class n25 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/banks/:id/balance-adjustments: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** BankAgentsPageComponent.confirmAdjust (comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts`](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts), [`comercial-jhoel-app/src/app/core/services/bank.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/bank.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts), [`comercial-jhoel-api/src/modules/banks/application/use-cases/adjust-bank-balance.use-case.ts`](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/adjust-bank-balance.use-case.ts), [`comercial-jhoel-api/src/modules/banks/domain/repositories/bank-movement.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/bank-movement.repository.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | DTO AdjustBankBalanceRequestDto | !reason | SQL adjust_bank_balance: p_reason IS NULL OR btrim(p_reason) = '' | SQL adjust_bank_balance: p_new_balance IS NULL | SQL adjust_bank_balance: NOT FOUND | SQL adjust_bank_balance: v_current = p_new_balance
6. **¿Dónde se almacenan los datos?** adjust_bank_balance()
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
