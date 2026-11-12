# POST /api/recharges/day-status/open

Módulo: **Recargas electrónicas (recharges)** · Fuente editable: [`post-recharges-day-status-open.mmd`](post-recharges-day-status-open.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/recharges/day-status/open"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["RechargesService.openDay<br/><small>app/core/services/recharges.service.ts</small>"]
  n6["RechargeDayStatusService.openDay<br/><small>app/core/services/recharge-day-status.service.ts</small>"]
  n7["HTTP POST /api/recharges/day-status/open<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿OpenRechargeDayRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["RechargesController.openDay<br/><small>api/recharges/presentation/controllers/recharges.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["OpenRechargeDayUseCase.execute<br/><small>api/recharges/application/use-cases/open-recharge-day.use-case.ts</small>"]
  n17["assertValidOperationDate()<br/><small>llamada en L33</small><br/><small>api/recharge-cash-box/application/utils/assert-valid-operation-date.ts</small>"]
  n18{"¿date #gt; maxAllowedOperationDate()?<br/><small>L13</small>"}
  n19(["InvalidMovementDateError()"])
  end
  n20["Caso de uso GetRechargeDayStatusUseCase<br/><small>execute</small>"]
  subgraph s21["Dominio → Infraestructura"]
  n22["Puerto RechargeDayOpeningRepository.findByDate / open<br/>@Inject(RECHARGE_DAY_OPENING_REPOSITORY)"]
  n23["TypeOrmRechargeDayOpeningRepository<br/><small>api/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts</small>"]
  n24[("findByDate: TypeORM Repository")]
  n25[("open: TypeORM Repository")]
  end
  subgraph s26["Dominio → Infraestructura"]
  n27["Puerto RechargeDayAuditLogRepository.record<br/>@Inject(RECHARGE_DAY_AUDIT_LOG_REPOSITORY)"]
  n28["TypeOrmRechargeDayAuditLogRepository<br/><small>api/recharges/infrastructure/persistence/typeorm-recharge-day-audit-log.repository.ts</small>"]
  n29[("record: TypeORM Repository")]
  end
  n30(["Fin: la interfaz se actualiza<br/>this.status.set"])
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
  n16 -.->|consulta| n20
  n18 -->|no| n22
  n22 -->|implementa| n23
  n23 --> n24
  n24 --> n8
  n23 --> n25
  n25 --> n8
  n18 -->|no| n27
  n27 -->|implementa| n28
  n28 --> n29
  n29 --> n8
  n8 --> n30
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
  class n2,n3,n11,n13,n19 err
  class n5,n6,n7 fe
  class n8,n30 ok
  class n10,n12,n18 dec
  class n14 api
  class n16,n20 app
  class n17,n22,n27 dom
  class n23,n28 infra
  class n24,n25,n29 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/recharges/day-status/open: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** RechargeDayStatusService.openDay (comercial-jhoel-app/src/app/core/services/recharge-day-status.service.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts`](../../../../comercial-jhoel-api/src/modules/recharges/presentation/controllers/recharges.controller.ts), [`comercial-jhoel-app/src/app/core/services/recharges.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/recharges.service.ts), [`comercial-jhoel-app/src/app/core/services/recharge-day-status.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/recharge-day-status.service.ts), [`comercial-jhoel-api/src/modules/recharges/application/use-cases/open-recharge-day.use-case.ts`](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/open-recharge-day.use-case.ts), [`comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/assert-valid-operation-date.ts`](../../../../comercial-jhoel-api/src/modules/recharge-cash-box/application/utils/assert-valid-operation-date.ts), [`comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-day-status.use-case.ts`](../../../../comercial-jhoel-api/src/modules/recharges/application/use-cases/get-recharge-day-status.use-case.ts), [`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-day-opening.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-day-opening.repository.ts), [`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-opening.repository.ts), [`comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-day-audit-log.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/domain/repositories/recharge-day-audit-log.repository.ts), [`comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-audit-log.repository.ts`](../../../../comercial-jhoel-api/src/modules/recharges/infrastructure/persistence/typeorm-recharge-day-audit-log.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO OpenRechargeDayRequestDto | date > maxAllowedOperationDate()
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
