# Pruebas E2E del backend

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [app.e2e-spec.ts](#f-comercial-jhoel-api-test-app-e2e-spec-ts) | .ts | Prueba E2E | Pruebas | Prueba E2E (sin comentario de documentación en el código). | 1 internas; ext.: @nestjs/testing, @nestjs/common, supertest | 0 | Soporte (pruebas) |
| [ar-settlements.e2e-spec.ts](#f-comercial-jhoel-api-test-ar-settlements-e2e-spec-ts) | .ts | Prueba E2E | Pruebas | Prueba E2E (sin comentario de documentación en el código). | 1 internas; ext.: @nestjs/testing, @nestjs/common, @nestjs/jwt, typeorm | 0 | Soporte (pruebas) |
| [bank-deposit-description.e2e-spec.ts](#f-comercial-jhoel-api-test-bank-deposit-description-e2e-spec-ts) | .ts | Prueba E2E | Pruebas | Prueba E2E (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/testing, @nestjs/common, @nestjs/jwt, typeorm | 0 | Soporte (pruebas) |
| [cash-control.e2e-spec.ts](#f-comercial-jhoel-api-test-cash-control-e2e-spec-ts) | .ts | Prueba E2E | Pruebas | Prueba E2E (sin comentario de documentación en el código). | 1 internas; ext.: @nestjs/testing, @nestjs/common, @nestjs/jwt, typeorm | 0 | Soporte (pruebas) |
| [cash-custody.e2e-spec.ts](#f-comercial-jhoel-api-test-cash-custody-e2e-spec-ts) | .ts | Prueba E2E | Pruebas | Prueba E2E (sin comentario de documentación en el código). | 1 internas; ext.: @nestjs/testing, @nestjs/common, @nestjs/jwt, typeorm | 0 | Soporte (pruebas) |
| [cash-daily-indicators.e2e-spec.ts](#f-comercial-jhoel-api-test-cash-daily-indicators-e2e-spec-ts) | .ts | Prueba E2E | Pruebas | Prueba E2E (sin comentario de documentación en el código). | 1 internas; ext.: @nestjs/testing, @nestjs/common, @nestjs/jwt, typeorm | 0 | Soporte (pruebas) |
| [cuadre-cash-breakdown.e2e-spec.ts](#f-comercial-jhoel-api-test-cuadre-cash-breakdown-e2e-spec-ts) | .ts | Prueba E2E | Pruebas | Prueba E2E (sin comentario de documentación en el código). | 1 internas; ext.: @nestjs/testing, @nestjs/common, @nestjs/jwt, typeorm | 0 | Soporte (pruebas) |
| [financial-day-review.e2e-spec.ts](#f-comercial-jhoel-api-test-financial-day-review-e2e-spec-ts) | .ts | Prueba E2E | Pruebas | Prueba E2E (sin comentario de documentación en el código). | 1 internas; ext.: @nestjs/testing, @nestjs/common, @nestjs/jwt, typeorm | 0 | Soporte (pruebas) |
| [jest-e2e.json](../../../../comercial-jhoel-api/test/jest-e2e.json) | .json | Configuración JSON | Pruebas | Configuración JSON | — | — | Media |
| [run-cash-control-e2e.sh](../../../../comercial-jhoel-api/test/run-cash-control-e2e.sh) | .sh | Script shell | Pruebas | !/usr/bin/env bash Runs test/cash-control.e2e-spec.ts (HTTP, full AppModule) against a TEMPORARY clone of the dev database — the Kardex is append-only, so the e2e flow must never write to the real database. Clones (pg_dump → &lt;db&gt;_e2e), runs jest inside the api container pointed at the clone, then drops only the clone.  | — | — | Media |

## Detalle por archivo

<a id="f-comercial-jhoel-api-test-app-e2e-spec-ts"></a>

### app.e2e-spec.ts

- **Ruta:** [app.e2e-spec.ts](../../../../comercial-jhoel-api/test/app.e2e-spec.ts) (`comercial-jhoel-api/test/app.e2e-spec.ts`, 23 líneas)
- **Tipo:** Prueba E2E · **Capa:** Pruebas · **Módulo:** Pruebas E2E del backend
- **Responsabilidad:** Prueba E2E (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)
- **Paquetes externos:** `@nestjs/testing`, `@nestjs/common`, `supertest`
- **Consumidores:** —
<a id="f-comercial-jhoel-api-test-ar-settlements-e2e-spec-ts"></a>

### ar-settlements.e2e-spec.ts

- **Ruta:** [ar-settlements.e2e-spec.ts](../../../../comercial-jhoel-api/test/ar-settlements.e2e-spec.ts) (`comercial-jhoel-api/test/ar-settlements.e2e-spec.ts`, 262 líneas)
- **Tipo:** Prueba E2E · **Capa:** Pruebas · **Módulo:** Pruebas E2E del backend
- **Responsabilidad:** Prueba E2E (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)
- **Paquetes externos:** `@nestjs/testing`, `@nestjs/common`, `@nestjs/jwt`, `typeorm`, `crypto`, `supertest`
- **Consumidores:** —
<a id="f-comercial-jhoel-api-test-bank-deposit-description-e2e-spec-ts"></a>

### bank-deposit-description.e2e-spec.ts

- **Ruta:** [bank-deposit-description.e2e-spec.ts](../../../../comercial-jhoel-api/test/bank-deposit-description.e2e-spec.ts) (`comercial-jhoel-api/test/bank-deposit-description.e2e-spec.ts`, 232 líneas)
- **Tipo:** Prueba E2E · **Capa:** Pruebas · **Módulo:** Pruebas E2E del backend
- **Responsabilidad:** Prueba E2E (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [today-iso-date.ts](bank-deposits.md#f-comercial-jhoel-api-src-modules-bank-deposits-application-utils-today-iso-date-ts)
- **Paquetes externos:** `@nestjs/testing`, `@nestjs/common`, `@nestjs/jwt`, `typeorm`, `supertest`
- **Consumidores:** —
<a id="f-comercial-jhoel-api-test-cash-control-e2e-spec-ts"></a>

### cash-control.e2e-spec.ts

- **Ruta:** [cash-control.e2e-spec.ts](../../../../comercial-jhoel-api/test/cash-control.e2e-spec.ts) (`comercial-jhoel-api/test/cash-control.e2e-spec.ts`, 220 líneas)
- **Tipo:** Prueba E2E · **Capa:** Pruebas · **Módulo:** Pruebas E2E del backend
- **Responsabilidad:** Prueba E2E (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)
- **Paquetes externos:** `@nestjs/testing`, `@nestjs/common`, `@nestjs/jwt`, `typeorm`, `crypto`, `supertest`
- **Consumidores:** —
<a id="f-comercial-jhoel-api-test-cash-custody-e2e-spec-ts"></a>

### cash-custody.e2e-spec.ts

- **Ruta:** [cash-custody.e2e-spec.ts](../../../../comercial-jhoel-api/test/cash-custody.e2e-spec.ts) (`comercial-jhoel-api/test/cash-custody.e2e-spec.ts`, 370 líneas)
- **Tipo:** Prueba E2E · **Capa:** Pruebas · **Módulo:** Pruebas E2E del backend
- **Responsabilidad:** Prueba E2E (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)
- **Paquetes externos:** `@nestjs/testing`, `@nestjs/common`, `@nestjs/jwt`, `typeorm`, `crypto`, `supertest`
- **Consumidores:** —
<a id="f-comercial-jhoel-api-test-cash-daily-indicators-e2e-spec-ts"></a>

### cash-daily-indicators.e2e-spec.ts

- **Ruta:** [cash-daily-indicators.e2e-spec.ts](../../../../comercial-jhoel-api/test/cash-daily-indicators.e2e-spec.ts) (`comercial-jhoel-api/test/cash-daily-indicators.e2e-spec.ts`, 197 líneas)
- **Tipo:** Prueba E2E · **Capa:** Pruebas · **Módulo:** Pruebas E2E del backend
- **Responsabilidad:** Prueba E2E (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)
- **Paquetes externos:** `@nestjs/testing`, `@nestjs/common`, `@nestjs/jwt`, `typeorm`, `crypto`, `supertest`
- **Consumidores:** —
<a id="f-comercial-jhoel-api-test-cuadre-cash-breakdown-e2e-spec-ts"></a>

### cuadre-cash-breakdown.e2e-spec.ts

- **Ruta:** [cuadre-cash-breakdown.e2e-spec.ts](../../../../comercial-jhoel-api/test/cuadre-cash-breakdown.e2e-spec.ts) (`comercial-jhoel-api/test/cuadre-cash-breakdown.e2e-spec.ts`, 378 líneas)
- **Tipo:** Prueba E2E · **Capa:** Pruebas · **Módulo:** Pruebas E2E del backend
- **Responsabilidad:** Prueba E2E (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)
- **Paquetes externos:** `@nestjs/testing`, `@nestjs/common`, `@nestjs/jwt`, `typeorm`, `crypto`, `supertest`
- **Consumidores:** —
<a id="f-comercial-jhoel-api-test-financial-day-review-e2e-spec-ts"></a>

### financial-day-review.e2e-spec.ts

- **Ruta:** [financial-day-review.e2e-spec.ts](../../../../comercial-jhoel-api/test/financial-day-review.e2e-spec.ts) (`comercial-jhoel-api/test/financial-day-review.e2e-spec.ts`, 389 líneas)
- **Tipo:** Prueba E2E · **Capa:** Pruebas · **Módulo:** Pruebas E2E del backend
- **Responsabilidad:** Prueba E2E (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)
- **Paquetes externos:** `@nestjs/testing`, `@nestjs/common`, `@nestjs/jwt`, `typeorm`, `crypto`, `supertest`
- **Consumidores:** —
