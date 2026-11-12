# Secuencia — Recargas: compra de saldo

Módulo: **Recargas electrónicas (recharges)** · Fuente editable: [`recargas-compra-de-saldo.mmd`](recargas-compra-de-saldo.mmd) · [Índice de diagramas](../README.md)

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant C as RegisterPurchaseFormComponent
  participant S as RechargesService
  participant G as API (guards y ValidationPipe)
  participant CT as RechargesController
  participant UC0 as RegisterRechargePurchaseUseCase
  participant R0 as TypeOrmRechargeDailyBalanceRepository
  participant DB as PostgreSQL
  U->>C: submit()
  C->>S: registerPurchase(…)
  S->>G: POST /api/recharges/purchases + Bearer JWT
  alt falla JWT válido y usuario activo / DTO RegisterRechargePurchaseRequestDto
    G-->>C: 400 / 401 / 403 / 429 con success false
  else permitido
  G->>CT: registerPurchase(dto, usuario del JWT)
  CT->>UC0: execute(input)
  opt date #gt; maxAllowedOperationDate()
    UC0-->>G: InvalidMovementDateError()
  end
  opt date === todayIsoDate() #amp;#amp; !dayOpening
    UC0-->>G: RechargeDayNotOpenedError(date)
  end
  opt dayOpening?.isClosed
    UC0-->>G: RechargeDayAlreadyClosedError(date)
  end
  UC0->>R0: registerPurchase()
  R0->>DB: SELECT register_recharge_purchase(…)
  Note over DB: valida 6 reglas (RECHARGE_TYPE_NOT_FOUND, RECHARGE_TYPE_INACTIVE, INVALID_AMOUNT, …)
  Note over DB: escribe recharge_daily_balances, recharge_purchases
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
  C-->>U: actualiza la interfaz (this.isSubmitting.set, this.notificationService.success, this.registered.emit)
```

## Explicación

1. **¿Qué proceso representa?** Interacción Usuario → Angular → API → caso de uso → repositorio → PostgreSQL para POST /api/recharges/purchases, con las validaciones y la transacción
2. **¿Dónde comienza?** RechargesService.registerPurchase
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts`](../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts), [`comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-purchase-form/register-purchase-form.component.ts`](../../../comercial-jhoel-app/src/app/features/dashboard/recharges/components/register-purchase-form/register-purchase-form.component.ts), [`comercial-jhoel-app/src/app/core/services/recharges.service.ts`](../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts), [`comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-purchase.use-case.ts`](../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/register-recharge-purchase.use-case.ts), [`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts`](../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-daily-balance.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Bloques alt/opt = validaciones reales; flujo completo en business-processes/recharges/post-recharges-purchases.mmd
6. **¿Dónde se almacenan los datos?** PostgreSQL (ver notas "escribe")
7. **¿Cómo termina el proceso?** success true con data y actualización de la interfaz
8. **¿Qué sucede cuando ocurre un error?** Ramas alt/opt: el error vuelve a la pantalla como { success: false, message }

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
