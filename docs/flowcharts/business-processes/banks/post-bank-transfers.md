# Transferencias bancarias y retiro de efectivo en banco

Módulo: **Bancos y Agentes Bancarios (día, saldos, cuadre, transferencias) (banks)** · Fuente editable: [`post-bank-transfers.mmd`](post-bank-transfers.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: Transferencias bancarias y retiro de efectivo en banco"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["BankTransferService.registerTransfer<br/><small>app/core/services/bank-transfer.service.ts</small>"]
  n6["BankTransfersPageComponent.confirmTransfer<br/><small>app/features/dashboard/bank-transfers/bank-transfers-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/bank-transfers<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿CreateBankTransferRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["BankTransfersController.create<br/><small>api/banks/presentation/controllers/bank-transfers.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["RegisterBankTransferUseCase.execute<br/><small>api/banks/application/use-cases/register-bank-transfer.use-case.ts</small>"]
  n17["assertBankOperationDayOpen()<br/><small>llamada en L48</small><br/><small>api/banks/application/use-cases/assert-bank-operation-day-open.ts</small>"]
  n18{"¿!dayOpening?<br/><small>L19</small>"}
  n19(["BankOperationDayNotOpenedError(businessDate)"])
  n20{"¿dayOpening.isClosed?<br/><small>L22</small>"}
  n21(["BankOperationDayClosedError(businessDate)"])
  n22{"¿!cashWithdrawal #amp;#amp; !destinationBankId?<br/><small>L55</small>"}
  n23(["BankTransferDestinationRequiredError()"])
  n24{"¿!transfer?<br/><small>L71</small>"}
  n25(["InternalServerErrorException( 'No se pudo recuperar la transferencia recién registrada.', )"])
  end
  subgraph s26["Dominio → Infraestructura"]
  n27["Puerto BankMovementRepository.registerTransfer / findTransferById<br/>@Inject(BANK_MOVEMENT_REPOSITORY)"]
  n28["TypeOrmBankMovementRepository<br/><small>api/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts</small>"]
  subgraph s29["PostgreSQL — función register_bank_transfer"]
  n30[["SELECT register_bank_transfer(…)<br/><small>registerTransfer — una transacción</small>"]]
  n31{"¿p_amount IS NULL OR p_amount #lt;= 0 OR p_amount #lt;#gt; round(p_amount, 2)?"}
  n32(["RAISE INVALID_MOVEMENT_AMOUNT<br/>(rollback)"])
  n33{"¿p_source_bank_id = p_destination_bank_id?"}
  n34(["RAISE SAME_ACCOUNT_TRANSFER<br/>(rollback)"])
  n35{"¿NOT FOUND?"}
  n36(["RAISE BANK_NOT_FOUND<br/>(rollback)"])
  n37{"¿(v_source.special_account = 'BI_CLUB') y (p_destination_bank_id IS NULL)?"}
  n38(["RAISE TRANSFER_DESTINATION_NOT_ALLOWED<br/>(rollback)"])
  n39{"¿NOT FOUND?"}
  n40(["RAISE TRANSFER_DESTINATION_NOT_ALLOWED<br/>(rollback)"])
  n41{"¿v_destination.special_account = 'BI_CLUB' AND v_source.special_account IS DISTINCT FROM 'BANCO_INDUSTRIAL'?"}
  n42(["RAISE TRANSFER_ORIGIN_NOT_ALLOWED<br/>(rollback)"])
  n43{"¿v_destination.special_account = 'DISTRICOL' AND v_source.special_account IS DISTINCT FROM 'BANCO_AGROMERCANTIL'?"}
  n44(["RAISE TRANSFER_ORIGIN_NOT_ALLOWED<br/>(rollback)"])
  n45[["apply_bank_account_movement()"]]
  end
  n46[("findTransferById: TypeORM Repository")]
  end
  n47(["Fin: la interfaz se actualiza<br/>this.isSaving.set<br/>this.isConfirmOpen.set<br/>this.notificationService.success<br/>this.notificationService.error"])
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
  n28 -->|registerTransfer| n30
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
  n43 -->|no · llama| n45
  n43 -->|no| n8
  n28 --> n46
  n46 --> n8
  n8 --> n47
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
  class n2,n3,n11,n13,n19,n21,n23,n25,n32,n34,n36,n38,n40,n42,n44 err
  class n5,n6,n7 fe
  class n8,n47 ok
  class n10,n12,n18,n20,n22,n24,n31,n33,n35,n37,n39,n41,n43 dec
  class n14 api
  class n16 app
  class n17,n27 dom
  class n28 infra
  class n30,n45,n46 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/bank-transfers: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** BankTransfersPageComponent.confirmTransfer (comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts`](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts), [`comercial-jhoel-app/src/app/core/services/bank-transfer.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/bank-transfer.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts), [`comercial-jhoel-api/src/modules/banks/application/use-cases/register-bank-transfer.use-case.ts`](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/register-bank-transfer.use-case.ts), [`comercial-jhoel-api/src/modules/banks/application/use-cases/assert-bank-operation-day-open.ts`](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/assert-bank-operation-day-open.ts), [`comercial-jhoel-api/src/modules/banks/domain/repositories/bank-movement.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/domain/repositories/bank-movement.repository.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO CreateBankTransferRequestDto | !dayOpening | dayOpening.isClosed | !cashWithdrawal && !destinationBankId | !transfer | SQL register_bank_transfer: p_amount IS NULL OR p_amount <= 0 OR p_amount <> round(p_amount, 2) | SQL register_bank_transfer: p_source_bank_id = p_destination_bank_id | SQL register_bank_transfer: NOT FOUND | SQL register_bank_transfer: (v_source.special_account = 'BI_CLUB') y (p_destination_bank_id IS NULL) | SQL register_bank_transfer: NOT FOUND | SQL register_bank_transfer: v_destination.special_account = 'BI_CLUB' AND v_source.special_account IS DISTINCT FROM 'BANCO_INDUSTRIAL' | SQL register_bank_transfer: v_destination.special_account = 'DISTRICOL' AND v_source.special_account IS DISTINCT FROM 'BANCO_AGROMERCANTIL'
6. **¿Dónde se almacenan los datos?** register_bank_transfer()
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
