# Secuencia — Transferencias bancarias y retiro de efectivo en banco

Módulo: **Bancos y Agentes Bancarios (día, saldos, cuadre, transferencias) (banks)** · Fuente editable: [`transferencias-bancarias-y-retiro-de-efectivo-en-banco.mmd`](transferencias-bancarias-y-retiro-de-efectivo-en-banco.mmd) · [Índice de diagramas](../README.md)

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant C as BankTransfersPageComponent
  participant S as BankTransferService
  participant G as API (guards y ValidationPipe)
  participant CT as BankTransfersController
  participant UC0 as RegisterBankTransferUseCase
  participant R0 as TypeOrmBankMovementRepository
  participant DB as PostgreSQL
  U->>C: confirmTransfer()
  C->>S: registerTransfer(…)
  S->>G: POST /api/bank-transfers + Bearer JWT
  alt falla JWT válido y usuario activo / DTO CreateBankTransferRequestDto
    G-->>C: 400 / 401 / 403 / 429 con success false
  else permitido
  G->>CT: create(dto, usuario del JWT)
  CT->>UC0: execute(input)
  opt !cashWithdrawal #amp;#amp; !destinationBankId
    UC0-->>G: BankTransferDestinationRequiredError()
  end
  opt !transfer
    UC0-->>G: InternalServerErrorException( 'No se pudo recuperar la transferencia recién registrada.', )
  end
  opt !dayOpening
    UC0-->>G: BankOperationDayNotOpenedError(businessDate)
  end
  opt dayOpening.isClosed
    UC0-->>G: BankOperationDayClosedError(businessDate)
  end
  UC0->>R0: registerTransfer / findTransferById()
  R0->>DB: SELECT register_bank_transfer(…)
  Note over DB: valida 7 reglas (INVALID_MOVEMENT_AMOUNT, SAME_ACCOUNT_TRANSFER, BANK_NOT_FOUND, …)
  alt RAISE EXCEPTION
    DB-->>R0: error con código
    R0-->>G: DomainError (traducido)
  else COMMIT
    DB-->>R0: resultado
  end
  R0-->>UC0: datos
  UC0-->>CT: salida
  CT-->>G: objeto
  G-->>C: success true con data
  end
  C-->>U: actualiza la interfaz (this.isSaving.set, this.isConfirmOpen.set, this.notificationService.success)
```

## Explicación

1. **¿Qué proceso representa?** Interacción Usuario → Angular → API → caso de uso → repositorio → PostgreSQL para POST /api/bank-transfers, con las validaciones y la transacción
2. **¿Dónde comienza?** BankTransferService.registerTransfer
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts`](../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/bank-transfers.controller.ts), [`comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts`](../../../comercial-jhoel-app/src/app/features/dashboard/bank-transfers/bank-transfers-page.component.ts), [`comercial-jhoel-app/src/app/core/services/bank-transfer.service.ts`](../../../comercial-jhoel-app/src/app/core/services/bank-transfer.service.ts), [`comercial-jhoel-api/src/modules/banks/application/use-cases/register-bank-transfer.use-case.ts`](../../../comercial-jhoel-api/src/modules/banks/application/use-cases/register-bank-transfer.use-case.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts`](../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-bank-movement.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Bloques alt/opt = validaciones reales; flujo completo en business-processes/banks/post-bank-transfers.mmd
6. **¿Dónde se almacenan los datos?** PostgreSQL (ver notas "escribe")
7. **¿Cómo termina el proceso?** success true con data y actualización de la interfaz
8. **¿Qué sucede cuando ocurre un error?** Ramas alt/opt: el error vuelve a la pantalla como { success: false, message }

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
