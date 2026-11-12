# Secuencia — Arqueo de Caja (con conteo opcional de Bodega = arqueo de Bodega)

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`arqueo-de-caja-con-conteo-opcional-de-bodega-arqueo-de-bodega.mmd`](arqueo-de-caja-con-conteo-opcional-de-bodega-arqueo-de-bodega.mmd) · [Índice de diagramas](../README.md)

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant C as CashCountModalComponent
  participant S as CashCustodyService
  participant G as API (guards y ValidationPipe)
  participant CT as CashCustodyController
  participant UC0 as RegisterCashCountUseCase
  participant R0 as TypeOrmCashCustodyRepository
  participant DB as PostgreSQL
  U->>C: save()
  C->>S: registerCount(…)
  S->>G: POST /api/cash-control/counts + Bearer JWT
  alt falla JWT válido y usuario activo / DTO RegisterCashCountRequestDto
    G-->>C: 400 / 401 / 403 / 429 con success false
  else permitido
  G->>CT: createCount(dto, usuario del JWT)
  CT->>UC0: execute(input)
  opt !input.correctionReason #124;#124; input.correctionReason.trim().length #lt; 5
    UC0-->>G: cashControlError('CASH_REASON_REQUIRED')
  end
  opt !input.details?.length
    UC0-->>G: cashControlError('CASH_BREAKDOWN_REQUIRED')
  end
  opt !count
    UC0-->>G: cashControlError('CASH_COUNT_NOT_FOUND')
  end
  opt !(CASH_CUSTODY_PERMISSION_ROLES[permission] as readonly string[]).includes( role ?? '', )
    UC0-->>G: cashControlError('CASH_CUSTODY_FORBIDDEN')
  end
  UC0->>R0: registerCount / findCountById()
  R0->>DB: SELECT register_cash_count(…)
  Note over DB: valida 6 reglas (CASH_IDEMPOTENCY_KEY_REQUIRED, CASH_INVALID_DENOMINATION, CASH_INVALID_AMOUNT, …)
  Note over DB: escribe cash_count_details, cash_counts
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
  C-->>U: actualiza la interfaz (this.isSaving.set, this.errorMessage.set, this.result.set)
```

## Explicación

1. **¿Qué proceso representa?** Interacción Usuario → Angular → API → caso de uso → repositorio → PostgreSQL para POST /api/cash-control/counts, con las validaciones y la transacción
2. **¿Dónde comienza?** CashCustodyService.registerCount
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts`](../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts`](../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts), [`comercial-jhoel-app/src/app/core/services/cash-custody.service.ts`](../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts`](../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts`](../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Bloques alt/opt = validaciones reales; flujo completo en business-processes/cash-control/post-cash-control-counts.mmd
6. **¿Dónde se almacenan los datos?** PostgreSQL (ver notas "escribe")
7. **¿Cómo termina el proceso?** success true con data y actualización de la interfaz
8. **¿Qué sucede cuando ocurre un error?** Ramas alt/opt: el error vuelve a la pantalla como { success: false, message }

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
