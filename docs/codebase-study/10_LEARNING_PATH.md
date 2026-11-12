# 10 · RUTA_DE_APRENDIZAJE

Volver a la [guía principal](../../CODEBASE_STUDY_GUIDE.md). Cada nivel indica **qué abrir y en qué orden**. Las rutas son relativas a la raíz del repositorio. Al lado de cada archivo, abre también su ficha en la referencia generada ([backend](03_BACKEND_REFERENCE.md), [frontend](04_FRONTEND_REFERENCE.md)): ahí están sus dependencias y consumidores.

## Nivel 1 · Conocer el proyecto

1. [01_PROJECT_OVERVIEW.md](01_PROJECT_OVERVIEW.md): tecnologías, carpetas, comandos.
2. `comercial-jhoel-api/CLAUDE.md` y `comercial-jhoel-app/CLAUDE.md`: decisiones de diseño escritas por los autores (largos; léelos por secciones).
3. `comercial-jhoel-api/src/main.ts`: cómo arranca la API (prefijo `api`, CORS, `ValidationPipe`).
4. `comercial-jhoel-api/src/app.module.ts`: qué módulos existen y qué piezas son globales.
5. `comercial-jhoel-app/src/main.ts` → `src/app/app.config.ts` → `src/app/app.routes.ts`.
6. [02_ARCHITECTURE.md](02_ARCHITECTURE.md): capas y el ejemplo §9.

**Ejercicio:** levanta el entorno (`docker compose up -d --build` en `comercial-jhoel-api`, `npm start` en `comercial-jhoel-app`) y recorre las pantallas del dashboard.

## Nivel 2 · Comprender el frontend

1. `comercial-jhoel-app/src/app/core/services/auth.service.ts` y `core/interceptors/auth.interceptor.ts`: la sesión.
2. `core/guards/auth.guard.ts`, `admin.guard.ts`: navegación protegida.
3. Un servicio HTTP simple: `core/services/category.service.ts`. Después uno complejo: `core/services/cash-custody.service.ts`.
4. Un modelo: `core/models/cuadre-agentes.model.ts` (interfaces y funciones puras de cálculo).
5. Una pantalla CRUD simple: `features/dashboard/categories/`.
6. Estado que sobrevive a la navegación: `core/services/sales-draft.store.ts` y `core/services/cuadre-agentes-state.service.ts`.
7. Componentes reutilizables: `shared/ui/index.ts` y `features/dashboard/transaccionar/components/cash-breakdown-table/` (la tabla de denominaciones que usan casi todos los formularios de efectivo).
8. Formularios y confirmaciones: `core/services/confirm-dialog.service.ts` y `shared/ui/confirm-dialog/`.
9. Sincronización entre pantallas: `core/interceptors/cash-mutation.interceptor.ts` → `core/services/cash-control-sync.service.ts`.
10. Una pantalla completa: `features/dashboard/bank-agents/cuadre-agentes-page.component.ts` + `.html` + `components/cuadre-cash-source/`.

## Nivel 3 · Comprender el backend

1. `comercial-jhoel-api/src/shared/domain/domain-error.ts`, `shared/filters/global-exception.filter.ts`, `shared/interceptors/response.interceptor.ts`.
2. Módulo pequeño de referencia: `src/modules/categories/`, en este orden:
   - `domain/entities` → `domain/repositories`
   - `application/use-cases`
   - `infrastructure/persistence` (orm-entity, mapper, repositorio)
   - `presentation` (DTO, controlador)
   - `categories.module.ts`
3. Autenticación: `src/modules/auth/` (ver [07_SECURITY_AND_AUTH.md](07_SECURITY_AND_AUTH.md)).
4. Módulo con funciones SQL: `src/modules/sales/` (`typeorm-sale.repository.ts` → `adjust_sale_item`, `confirm_open_sale`).
5. Módulo grande con permisos y SQL crudo: `src/modules/cash-control/`, en este orden:
   - `cash-control/domain/policies/cash-control.policy.ts`, `cash-control/domain/errors/cash-control.errors.ts`
   - `cash-control/domain/repositories/cash-custody.repository.ts`
   - `cash-control/application/use-cases/cash-custody.use-cases.ts`
   - `cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts`
   - `cash-control/presentation/controllers/cash-custody.controller.ts`
6. Transacción entre módulos: `src/shared/application/ports/transaction-manager.port.ts` → `src/modules/bank-deposits/application/use-cases/register-bank-deposit-operation.use-case.ts`.

## Nivel 4 · Comprender la base de datos

1. [05_DATABASE_REFERENCE.md](05_DATABASE_REFERENCE.md): tablas por dominio con diagramas ER.
2. Migraciones fundacionales: `src/database/migrations/` con prefijos `1756…` (usuarios, roles) y `1757100000000-CreateSalesTables.ts` (primera función `confirm_sale`).
3. Ledger bancario: `1760005100000-CreateBankAccountMovements.ts` (`apply_bank_account_movement`).
4. Kardex de efectivo: `1760006800000-CreateCashControlKardexAndCuts.ts` (`apply_cash_movement`, cortes).
5. Custodia (arqueos y Bodega): `1760007400000-CashCountsAndWarehouseCustody.ts`.
6. Pruebas SQL como documentación ejecutable: `comercial-jhoel-api/sql/tests/cash-custody.test.sql`, `cuadre-latest-cut.test.sql`. Cada caso `OK …` describe una regla.

**Ejercicio:** abre `psql` (`docker compose exec postgres psql -U <usuario> -d <db>`) y ejecuta `\d cash_movements`, `\df apply_cash_movement` y `SELECT cash_balance();`.

## Nivel 5 · Comprender los flujos completos

1. [06_BUSINESS_FLOWS.md](06_BUSINESS_FLOWS.md): diez flujos con su cadena real.
2. [11_PRACTICAL_EXAMPLES.md](11_PRACTICAL_EXAMPLES.md): cómo seguir una operación a mano en VS Code.
3. [12_API_ENDPOINTS.md](12_API_ENDPOINTS.md): ruta → controlador → servicio Angular.
4. [08_FILE_DEPENDENCIES.md](08_FILE_DEPENDENCIES.md): quién depende de quién.
5. Pruebas E2E como guion de flujo: `comercial-jhoel-api/test/cuadre-cash-breakdown.e2e-spec.ts`, `cash-custody.e2e-spec.ts`.

**Ejercicio final:** elige un endpoint de [12_API_ENDPOINTS.md](12_API_ENDPOINTS.md) y recórrelo de punta a punta: componente, servicio, controlador, caso de uso, repositorio, función SQL y tabla. Luego cambia un valor en la pantalla y comprueba con `psql` qué filas aparecieron.
