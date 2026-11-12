# Guardar saldos bancarios del día

Módulo: **Bancos y Agentes Bancarios (día, saldos, cuadre, transferencias) (banks)** · Fuente editable: [`post-banks-balances.mmd`](post-banks-balances.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: Guardar saldos bancarios del día"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["BankBalanceService.saveBalances<br/><small>app/core/services/bank-balance.service.ts</small>"]
  n6["BankAgentsPageComponent.confirmSaveChanges<br/><small>app/features/dashboard/bank-agents/bank-agents-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/banks/balances<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿SaveBankBalancesRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["BanksController.saveBalances<br/><small>api/banks/presentation/controllers/banks.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["SaveBankBalancesUseCase.execute<br/><small>api/banks/application/use-cases/save-bank-balances.use-case.ts</small>"]
  n17{"¿!input.operationDate #124;#124; !DATE_PATTERN.test(input.operationDate)?<br/><small>L47</small>"}
  n18(["InvalidBankBalanceDateError()"])
  n19{"¿!input.entries #124;#124; input.entries.length === 0?<br/><small>L51</small>"}
  n20(["NoBankBalancesToSaveError()"])
  n21{"¿input.operationDate === todayIsoDate() #amp;#amp; !dayOpening?<br/><small>L62</small>"}
  n22(["DayNotOpenedError(input.operationDate, 'balances')"])
  n23{"¿dayOpening?.isClosed?<br/><small>L70</small>"}
  n24(["DayAlreadyClosedError(input.operationDate)"])
  end
  n25["Puerto DayOpeningRepository<br/><small>findByDate</small>"]
  subgraph s26["Dominio → Infraestructura"]
  n27["Puerto BankBalanceRepository.saveBalances<br/>@Inject(BANK_BALANCE_REPOSITORY)"]
  n28["TypeOrmBankBalanceRepository<br/><small>api/banks/infrastructure/persistence/typeorm-bank-balance.repository.ts</small>"]
  subgraph s29["PostgreSQL — función save_bank_balance"]
  n30[["SELECT save_bank_balance(…)<br/><small>saveBalances — una transacción</small>"]]
  n31{"¿p_operation_date IS NULL?"}
  n32(["RAISE INVALID_OPERATION_DATE<br/>(rollback)"])
  n33{"¿NOT FOUND?"}
  n34(["RAISE BANK_NOT_FOUND<br/>(rollback)"])
  n35{"¿NOT v_bank.is_active?"}
  n36(["RAISE BANK_INACTIVE<br/>(rollback)"])
  n37{"¿v_final_balance #lt; 0 AND COALESCE(v_bank.special_account, '') NOT IN ('GENESIS', 'BI_CLUB')?"}
  n38(["RAISE INVALID_FINAL_BALANCE<br/>(rollback)"])
  n39[("Escribe:<br/>bank_balances")]
  end
  end
  n40(["Fin: la interfaz se actualiza<br/>this.isSaving.set<br/>this.isSaveConfirmModalOpen.set<br/>this.notificationService.success<br/>this.notificationService.error"])
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
  n16 -.->|consulta| n25
  n23 -->|no| n27
  n27 -->|implementa| n28
  n28 -->|saveBalances| n30
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
  n39 -->|COMMIT| n8
  n8 --> n40
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
  class n2,n3,n11,n13,n18,n20,n22,n24,n32,n34,n36,n38 err
  class n5,n6,n7 fe
  class n8,n40 ok
  class n10,n12,n17,n19,n21,n23,n31,n33,n35,n37 dec
  class n14 api
  class n16 app
  class n25,n27 dom
  class n28 infra
  class n30,n39 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/banks/balances: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** BankAgentsPageComponent.confirmSaveChanges (comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts`](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts), [`comercial-jhoel-app/src/app/core/services/bank-balance.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/bank-balance.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/bank-agents-page.component.ts), [`comercial-jhoel-api/src/modules/banks/application/use-cases/save-bank-balances.use-case.ts`](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/save-bank-balances.use-case.ts), [`comercial-jhoel-api/src/modules/banks/domain/repositories/day-opening.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/day-opening.repository.ts), [`comercial-jhoel-api/src/modules/banks/domain/repositories/bank-balance.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/bank-balance.repository.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-balance.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-balance.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO SaveBankBalancesRequestDto | !input.operationDate || !DATE_PATTERN.test(input.operationDate) | !input.entries || input.entries.length === 0 | input.operationDate === todayIsoDate() && !dayOpening | dayOpening?.isClosed | SQL save_bank_balance: p_operation_date IS NULL | SQL save_bank_balance: NOT FOUND | SQL save_bank_balance: NOT v_bank.is_active | SQL save_bank_balance: v_final_balance < 0 AND COALESCE(v_bank.special_account, '') NOT IN ('GENESIS', 'BI_CLUB')
6. **¿Dónde se almacenan los datos?** save_bank_balance(), bank_balances
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
