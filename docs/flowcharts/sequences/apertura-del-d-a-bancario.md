# Secuencia — Apertura del día bancario

Módulo: **Bancos y Agentes Bancarios (día, saldos, cuadre, transferencias) (banks)** · Fuente editable: [`apertura-del-d-a-bancario.mmd`](apertura-del-d-a-bancario.mmd) · [Índice de diagramas](../README.md)

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant C as DayStatusService
  participant S as CuadreAgentesService
  participant G as API (guards y ValidationPipe)
  participant CT as BanksController
  participant UC0 as OpenDayUseCase
  participant R0 as TypeOrmDayOpeningRepository
  participant R1 as TypeOrmDayAuditLogRepository
  participant DB as PostgreSQL
  U->>C: openDay()
  C->>S: openDay(…)
  S->>G: POST /api/banks/day-status/open + Bearer JWT
  alt falla JWT válido y usuario activo / DTO OpenDayRequestDto
    G-->>C: 400 / 401 / 403 / 429 con success false
  else permitido
  G->>CT: openDay(dto, usuario del JWT)
  CT->>UC0: execute(input)
  opt !input.date #124;#124; !DATE_PATTERN.test(input.date)
    UC0-->>G: InvalidBankBalanceDateError()
  end
  UC0->>R0: findByDate / open()
  R0-->>UC0: datos
  UC0->>R1: record()
  R1-->>UC0: datos
  UC0->>UC0: GetDayStatusUseCase.execute
  UC0-->>CT: salida
  CT-->>G: objeto
  G-->>C: success true con data
  end
  C-->>U: actualiza la interfaz (this.status.set)
```

## Explicación

1. **¿Qué proceso representa?** Interacción Usuario → Angular → API → caso de uso → repositorio → PostgreSQL para POST /api/banks/day-status/open, con las validaciones y la transacción
2. **¿Dónde comienza?** CuadreAgentesService.openDay
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts`](../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/banks.controller.ts), [`comercial-jhoel-app/src/app/core/services/day-status.service.ts`](../../../comercial-jhoel-app/src/app/core/services/day-status.service.ts), [`comercial-jhoel-app/src/app/core/services/cuadre-agentes.service.ts`](../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes.service.ts), [`comercial-jhoel-api/src/modules/banks/application/use-cases/open-day.use-case.ts`](../../../comercial-jhoel-api/src/modules/banks/application/use-cases/open-day.use-case.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts`](../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-audit-log.repository.ts`](../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-audit-log.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Bloques alt/opt = validaciones reales; flujo completo en business-processes/banks/post-banks-day-status-open.mmd
6. **¿Dónde se almacenan los datos?** PostgreSQL (ver notas "escribe")
7. **¿Cómo termina el proceso?** success true con data y actualización de la interfaz
8. **¿Qué sucede cuando ocurre un error?** Ramas alt/opt: el error vuelve a la pantalla como { success: false, message }

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
