# Transaccionar: anular una operación

Módulo: **Transaccionar (operaciones bancarias) (bank-deposits)** · Fuente editable: [`post-bank-deposits-id-void.mmd`](post-bank-deposits-id-void.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: Transaccionar: anular una operación"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["BankDepositService.voidOperation<br/><small>app/core/services/bank-deposit.service.ts</small>"]
  n6["BankDepositsReportPageComponent.confirmVoid<br/><small>app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/bank-deposits/:id/void<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿VoidBankDepositOperationRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["BankDepositsController.voidOperation<br/><small>api/bank-deposits/presentation/controllers/bank-deposits.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["VoidBankDepositOperationUseCase.execute<br/><small>api/bank-deposits/application/use-cases/void-bank-deposit-operation.use-case.ts</small>"]
  n19{"¿!operation?<br/><small>L43</small>"}
  n20(["BankDepositOperationNotFoundError(input.id)"])
  n21{"¿operation.isVoided?<br/><small>L46</small>"}
  n22(["BankDepositOperationAlreadyVoidedError(input.id)"])
  end
  subgraph s23["Dominio → Infraestructura"]
  n24["Puerto BankDepositRepository.findById / voidOperation<br/>@Inject(BANK_DEPOSIT_REPOSITORY)"]
  n25["TypeOrmBankDepositRepository<br/><small>api/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts</small>"]
  n26[("findById: TypeORM Repository")]
  subgraph s27["PostgreSQL — función void_bank_deposit_operation"]
  n28[["SELECT void_bank_deposit_operation(…)<br/><small>voidOperation — una transacción</small>"]]
  n29{"¿NOT FOUND?"}
  n30(["RAISE BANK_DEPOSIT_OPERATION_NOT_FOUND<br/>(rollback)"])
  n31{"¿v_operation.is_voided?"}
  n32(["RAISE BANK_DEPOSIT_OPERATION_ALREADY_VOIDED<br/>(rollback)"])
  n33[["reverse_bank_account_movements()"]]
  n34[("Escribe:<br/>bank_deposit_operations")]
  end
  end
  n35(["Fin: la interfaz se actualiza<br/>this.isSavingVoid.set<br/>this.isVoidModalOpen.set<br/>this.notificationService.success<br/>this.notificationService.error"])
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
  n21 -->|no| n24
  n24 -->|implementa| n25
  n25 --> n26
  n26 --> n8
  n25 -->|voidOperation| n28
  n28 --> n29
  n29 -->|sí| n30
  n30 --> n2
  n29 -->|no| n31
  n31 -->|sí| n32
  n32 --> n2
  n31 -->|no · llama| n33
  n31 -->|no| n34
  n34 -->|COMMIT| n8
  n8 --> n35
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
  class n2,n3,n11,n13,n15,n20,n22,n30,n32 err
  class n5,n6,n7 fe
  class n8,n35 ok
  class n10,n12,n14,n19,n21,n29,n31 dec
  class n16 api
  class n18 app
  class n24 dom
  class n25 infra
  class n26,n28,n33,n34 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/bank-deposits/:id/void: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** BankDepositsReportPageComponent.confirmVoid (comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts`](../../../../comercial-jhoel-api/src/modules/bank-deposits/presentation/controllers/bank-deposits.controller.ts), [`comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/bank-deposit.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-deposits/bank-deposits-report-page.component.ts), [`comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/void-bank-deposit-operation.use-case.ts`](../../../../comercial-jhoel-api/src/modules/bank-deposits/application/use-cases/void-bank-deposit-operation.use-case.ts), [`comercial-jhoel-api/src/modules/bank-deposits/domain/repositories/bank-deposit.repository.ts`](../../../../comercial-jhoel-api/src/modules/bank-deposits/domain/repositories/bank-deposit.repository.ts), [`comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts`](../../../../comercial-jhoel-api/src/modules/bank-deposits/infrastructure/persistence/typeorm-bank-deposit.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | DTO VoidBankDepositOperationRequestDto | !operation | operation.isVoided | SQL void_bank_deposit_operation: NOT FOUND | SQL void_bank_deposit_operation: v_operation.is_voided
6. **¿Dónde se almacenan los datos?** void_bank_deposit_operation(), bank_deposit_operations
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
