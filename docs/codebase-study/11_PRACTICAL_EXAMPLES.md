# 11 · Ejemplos prácticos de lectura del código

Volver a la [guía principal](../../CODEBASE_STUDY_GUIDE.md). Cada ejemplo indica qué buscar en VS Code (`Ctrl+P` para abrir un archivo, `Ctrl+Shift+F` para buscar en todo el proyecto, `F12` para ir a la definición).

## A. Cómo se carga una pantalla (Cuadre de Agentes)

1. `Ctrl+Shift+F` → `agentes-bancarios-cuadre` en `comercial-jhoel-app/src/app/app.routes.ts`: la ruta hija de `dashboard` (`/dashboard/agentes-bancarios-cuadre`) hace `loadComponent` de `CuadreAgentesPageComponent`.
2. Abre `features/dashboard/bank-agents/cuadre-agentes-page.component.ts`. En el `constructor` se llaman `fetchSummary()` y `validateBankBalances()`.
3. `fetchSummary` → `cuadreAgentesService.getSummary()`. Con `F12` sobre `getSummary` llegas a `core/services/cuadre-agentes.service.ts`.
4. La plantilla `cuadre-agentes-page.component.html` usa `@if (isCheckingAccess())`, `@else if (dayClosed())`… Cada condición es un `computed` del componente.
5. Los datos llegan a `summary.set(...)` y la vista se vuelve a pintar sola, porque la estrategia es `OnPush` y usa signals.

## B. Cómo se ejecuta una petición HTTP

1. En el servicio: `this.http.get<ApiSuccessResponse<T>>(\`${BASE_URL}/...\`).pipe(map((r) => r.data))`. `BASE_URL` se arma con `environment.apiUrl`.
2. El pedido pasa por `authInterceptor` (agrega `Authorization`) y `cashMutationInterceptor` (solo escrituras de dinero).
3. En el backend: `main.ts` (prefijo `/api`) → guard → controlador. Para encontrar el controlador, busca la ruta en [12_API_ENDPOINTS.md](12_API_ENDPOINTS.md) o haz `Ctrl+Shift+F` con `@Controller('cash-control')`.

## C. Cómo se valida una solicitud

1. Abre `comercial-jhoel-api/src/modules/banks/presentation/dtos/create-agent-reconciliation.request.dto.ts`. Los decoradores (`@IsNumber`, `@IsIn(CUADRE_CASH_BREAKDOWN_SOURCES)`, `@ValidateNested`) los aplica `ValidationPipe` antes de llamar al controlador.
2. Después, el caso de uso vuelve a validar las reglas de negocio: `assertCuadreCashBreakdown` en `close-agent-day.use-case.ts`.
3. Por último, la función SQL `close_agent_day_with_cash_breakdown` valida todo otra vez dentro de la transacción. Búscala con `Ctrl+Shift+F` → `FUNCTION close_agent_day_with_cash_breakdown` en `src/database/migrations/`. La versión vigente es la de la migración más reciente que la define.

## D. Cómo se ejecuta un caso de uso

`GetLatestCashCountUseCase.execute` (`cash-control/application/use-cases/cash-custody.use-cases.ts`):

1. `assertCashCustodyPermission(input.role, 'cash_custody.view')` lanza `CASH_CUSTODY_FORBIDDEN` (403) si el rol no tiene ese permiso.
2. Valida el formato de `businessDate`.
3. `this.repository.findLatestValidCount(...)`: aquí `this.repository` es el **puerto**. Con `F12` sobre el tipo `CashCustodyRepository` llegas a la interfaz. Para la implementación, busca `implements CashCustodyRepository`.
4. Arma la salida (`completeBreakdown`, `isFromReferenceDay`) y la devuelve como objeto plano.

## E. Cómo se consulta PostgreSQL

En `TypeOrmCashCustodyRepository.findLatestValidCount`:

```ts
const [row] = await this.dataSource.query<SqlRow[]>(
  `SELECT *, to_char(business_date, 'YYYY-MM-DD') AS business_date_text
   FROM cash_latest_count_candidate($1::date)`,
  [referenceBusinessDate],
);
```

- `$1` es un parámetro, nunca texto concatenado.
- Las columnas `numeric` llegan como texto; el repositorio las convierte con `num()`.
- Para ver qué hace la función: `docker compose exec postgres psql -U <usuario> -d <db> -c "\sf cash_latest_count_candidate"`.

## F. Cómo se guarda un registro

`TypeOrmAgentReconciliationRepository.closeDayWithReconciliation`:

1. Arma los parámetros y llama `SELECT close_agent_day_with_cash_breakdown($1 … $11) AS id`.
2. Si la función lanza `RAISE EXCEPTION 'CUADRE_…'`, el `catch` llama a `translateCloseError`, que usa `CuadreCashBreakdownError.fromMessage` y devuelve un `DomainError` con su `status`.
3. Si todo sale bien, vuelve a leer la fila (`findOneOrFail`) y la convierte con `AgentReconciliationMapper.toDomain`.

## G. Cómo se devuelve la respuesta

El controlador retorna el objeto. `ResponseInterceptor.intercept` lo envuelve como `{ success: true, data }`. Si hubo excepción, `GlobalExceptionFilter.catch` responde `{ success: false, statusCode, message, timestamp }`. En el frontend, `extractErrorMessage` (`core/utils/extract-error-message.ts`) toma `message` para la notificación.

## H. Cómo se actualiza la interfaz

1. Tras un `POST` exitoso a `/cash-control/...`, `cashMutationInterceptor` llama a `CashControlSyncService.notifyChanged()`.
2. Ese servicio emite en `changed$` y publica `'changed'` en un `BroadcastChannel`, así otras pestañas abiertas también se enteran.
3. Las pantallas se suscriben con la función `onCashChanged(callback)` del mismo archivo. Además de esos avisos, consulta periódicamente con `setInterval` mientras la pestaña está visible, para captar cambios de otros usuarios. Para ver quién escucha: `Ctrl+Shift+F` → `onCashChanged(`.

## I. Buscar algo concreto rápidamente

| Quiero encontrar… | Dónde |
|---|---|
| Una clase o método por nombre | [index/backend.md](index/backend.md), [index/frontend.md](index/frontend.md) |
| Qué archivo llama a un endpoint | [12_API_ENDPOINTS.md](12_API_ENDPOINTS.md) |
| Qué tabla escribe una función SQL | Tabla de funciones de [05_DATABASE_REFERENCE.md](05_DATABASE_REFERENCE.md) |
| Quién usa un archivo | "Consumidores" en su ficha de [03_BACKEND_REFERENCE.md](03_BACKEND_REFERENCE.md) / [04_FRONTEND_REFERENCE.md](04_FRONTEND_REFERENCE.md) |
| Una regla de negocio probada | `comercial-jhoel-api/sql/tests/*.test.sql` (cada `OK` es una regla) |
