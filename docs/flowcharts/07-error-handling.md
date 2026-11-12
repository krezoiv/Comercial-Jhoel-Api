# 07 · Gestión de errores (de PostgreSQL a la pantalla)

Módulo: **Transversal** · Fuente editable: [`07-error-handling.mmd`](07-error-handling.mmd) · [Índice de diagramas](README.md)

```mermaid
flowchart TD
  subgraph SRC["Origen del error"]
    V["ValidationPipe<br/>DTO inválido o campo no permitido"]
    U["Caso de uso: throw new XError()<br/>(extends DomainError, status 400/403/404/409)"]
    S["Función PL/pgSQL:<br/>RAISE EXCEPTION 'CODIGO:detalle'"]
    T["Trigger financial_review_day_guard:<br/>FINANCIAL_REVIEW_DAY_LOCKED…"]
  end
  Q["QueryFailedError (TypeORM)"]
  TR["Repositorio: translate*Error · cashControlErrorFromMessage<br/>bankMovementErrorFromMessage · CuadreCashBreakdownError.fromMessage"]
  F{"GlobalExceptionFilter.resolve<br/>¿instanceof DomainError?"}
  F2{"¿message empieza con FINANCIAL_REVIEW_?"}
  F3{"¿instanceof HttpException?"}
  R1["status = error.status"]
  R2["financialDayReviewErrorFromMessage → status"]
  R3["status = getStatus()"]
  R4["500 Internal server error (se registra en el log)"]
  OUT(["{ success: false, statusCode, message, timestamp }"])
  FE{"Frontend: ¿status 401 con sesión?"}
  LG["authInterceptor: logout() → /login"]
  MSG(["Componente: extractErrorMessage(error, mensaje por defecto)<br/>→ NotificationService.error / errorMessage.set"])
  S --> Q --> TR -->|"DomainError"| F
  TR -->|"no reconocido"| F
  T --> Q
  U --> F
  V --> F
  F -->|"sí"| R1 --> OUT
  F -->|"no"| F2
  F2 -->|"sí"| R2 --> OUT
  F2 -->|"no"| F3
  F3 -->|"sí"| R3 --> OUT
  F3 -->|"no"| R4 --> OUT
  OUT --> FE
  FE -->|"sí"| LG
  FE -->|"no"| MSG
  classDef err fill:#ffebee,stroke:#c62828,color:#b71c1c
  classDef dec fill:#fffde7,stroke:#f57f17,color:#3e2723
  classDef infra fill:#f3e5f5,stroke:#6a1b9a,color:#4a148c
  classDef fe fill:#e3f2fd,stroke:#1565c0,color:#0d47a1
  class V,U,S,T,R4,OUT err
  class F,F2,F3,FE dec
  class Q,TR,R1,R2,R3 infra
  class LG,MSG fe
```

## Explicación

1. **¿Qué proceso representa?** Cómo un error de cualquier capa (validación del DTO, regla del caso de uso, RAISE EXCEPTION de una función SQL, trigger de revisión de días) se convierte en una respuesta JSON uniforme y en un mensaje en la pantalla.
2. **¿Dónde comienza?** Una regla que no se cumple en cualquier capa
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/shared/domain/domain-error.ts`](../../comercial-jhoel-api/src/shared/domain/domain-error.ts), [`comercial-jhoel-api/src/shared/filters/global-exception.filter.ts`](../../comercial-jhoel-api/src/shared/filters/global-exception.filter.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/errors/cash-control.errors.ts`](../../comercial-jhoel-api/src/modules/cash-control/domain/errors/cash-control.errors.ts), [`comercial-jhoel-api/src/modules/banks/domain/errors/bank-movement.errors.ts`](../../comercial-jhoel-api/src/modules/banks/domain/errors/bank-movement.errors.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-agent-reconciliation.repository.ts`](../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-agent-reconciliation.repository.ts), [`comercial-jhoel-app/src/app/core/interceptors/auth.interceptor.ts`](../../comercial-jhoel-app/src/app/core/interceptors/auth.interceptor.ts), [`comercial-jhoel-app/src/app/core/utils/extract-error-message.ts`](../../comercial-jhoel-app/src/app/core/utils/extract-error-message.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** GlobalExceptionFilter.resolve: ¿DomainError? → su status · ¿mensaje FINANCIAL_REVIEW_*? → error de revisión (409) · ¿HttpException? → su status · si no → 500
6. **¿Dónde se almacenan los datos?** No escribe; un RAISE revierte la transacción completa
7. **¿Cómo termina el proceso?** JSON { success: false, statusCode, message, timestamp }; la pantalla muestra message
8. **¿Qué sucede cuando ocurre un error?** Los 5xx se registran en el log (status >= 500)

> Diagrama escrito a mano a partir del código; ver la sección de archivos.
