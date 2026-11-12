# POST /api/bank-transfers/:id/void

Módulo: **Bancos y Agentes Bancarios (día, saldos, cuadre, transferencias) (banks)** · Fuente editable: [`post-bank-transfers-id-void.mmd`](post-bank-transfers-id-void.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/bank-transfers/:id/void"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["BankTransferService.voidTransfer<br/><small>app/core/services/bank-transfer.service.ts</small>"]
  n6["BankTransfersPageComponent.confirmVoid<br/><small>app/features/dashboard/bank-transfers/bank-transfers-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["BankTransfersReportPageComponent.confirmVoid<br/><small>app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n8["HTTP POST /api/bank-transfers/:id/void<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n9["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s10["API NestJS — presentación"]
  n11{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n12(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n13{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n14(["403 Sin permisos"])
  n15{"¿VoidBankTransferRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n16(["400 Datos inválidos"])
  n17["BankTransfersController.voidTransfer<br/><small>api/banks/presentation/controllers/bank-transfers.controller.ts</small>"]
  end
  subgraph s18["Aplicación — caso de uso"]
  n19["VoidBankTransferUseCase.execute<br/><small>api/banks/application/use-cases/void-bank-transfer.use-case.ts</small>"]
  n20{"¿!reason?<br/><small>L33</small>"}
  n21(["MovementReasonRequiredError()"])
  n22{"¿!transfer?<br/><small>L40</small>"}
  n23(["BankTransferNotFoundError(input.transferId)"])
  n24{"¿transfer.status === 'ANULADO'?<br/><small>L43</small>"}
  n25(["BankTransferAlreadyVoidedError()"])
  end
  subgraph s26["Dominio → Infraestructura"]
  n27["Puerto BankMovementRepository.findTransferById / voidTransfer<br/>@Inject(BANK_MOVEMENT_REPOSITORY)"]
  n28["TypeOrmBankMovementRepository<br/><small>api/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts</small>"]
  subgraph s29["PostgreSQL — función void_bank_transfer"]
  n30[["SELECT void_bank_transfer(…)<br/><small>voidTransfer — una transacción</small>"]]
  n31{"¿p_reason IS NULL OR btrim(p_reason) = ''?"}
  n32(["RAISE REASON_REQUIRED<br/>(rollback)"])
  n33{"¿v_total = 0?"}
  n34(["RAISE TRANSFER_NOT_FOUND<br/>(rollback)"])
  n35{"¿EXISTS ( SELECT 1 FROM bank_account_movements m JOIN banks b ON b.id = m.bank_id WHERE m.reference_type = 'BANK_TRANSFER' AND m.reference_id = p_transfer_id AND?"}
  n36(["RAISE LEGACY_CREDIT_LINE_TRANSFER<br/>(rollback)"])
  n37{"¿v_reversed = 0?"}
  n38(["RAISE TRANSFER_ALREADY_VOIDED<br/>(rollback)"])
  n39[["reverse_bank_account_movements()"]]
  end
  n40[("findTransferById: TypeORM Repository")]
  end
  n41(["Fin: la interfaz se actualiza<br/>this.isVoiding.set<br/>this.voidingTransferId.set<br/>this.notificationService.success<br/>this.notificationService.error"])
  n2 --> n3
  n1 -->|acción del usuario| n6
  n6 --> n5
  n1 -->|acción del usuario| n7
  n7 --> n5
  n5 --> n8
  n8 --> n11
  n11 -->|no| n12
  n12 --> n3
  n11 -->|sí| n13
  n13 -->|no| n14
  n14 --> n2
  n13 -->|sí| n15
  n15 -->|no| n16
  n16 --> n2
  n15 -->|sí| n17
  n17 --> n19
  n19 --> n20
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
  n28 -->|voidTransfer| n30
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
  n37 -->|no · llama| n39
  n37 -->|no| n9
  n28 --> n40
  n40 --> n9
  n9 --> n41
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
  class n2,n3,n12,n14,n16,n21,n23,n25,n32,n34,n36,n38 err
  class n5,n6,n7,n8 fe
  class n9,n41 ok
  class n11,n13,n15,n20,n22,n24,n31,n33,n35,n37 dec
  class n17 api
  class n19 app
  class n27 dom
  class n28 infra
  class n30,n39,n40 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/bank-transfers/:id/void: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** BankTransfersPageComponent.confirmVoid (comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts`](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts), [`comercial-jhoel-app/src/app/core/services/bank-transfer.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/bank-transfer.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/reports/bank-transfers/bank-transfers-report-page.component.ts), [`comercial-jhoel-api/src/modules/banks/application/use-cases/void-bank-transfer.use-case.ts`](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/void-bank-transfer.use-case.ts), [`comercial-jhoel-api/src/modules/banks/domain/repositories/bank-movement.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/bank-movement.repository.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | DTO VoidBankTransferRequestDto | !reason | !transfer | transfer.status === 'ANULADO' | SQL void_bank_transfer: p_reason IS NULL OR btrim(p_reason) = '' | SQL void_bank_transfer: v_total = 0 | SQL void_bank_transfer: EXISTS ( SELECT 1 FROM bank_account_movements m JOIN banks b ON b.id = m.bank_id WHERE m.reference_type = 'BANK_TRANSFER' AND m.reference_id = p_transfer_id AND | SQL void_bank_transfer: v_reversed = 0
6. **¿Dónde se almacenan los datos?** void_bank_transfer()
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
