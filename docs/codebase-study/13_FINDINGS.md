# 13 · Hallazgos del análisis (sin modificar código)

Volver a la [guía principal](../../CODEBASE_STUDY_GUIDE.md). Observaciones encontradas al documentar. **No se corrigió nada.** Son puntos a revisar o a tener en cuenta al estudiar.

## 1. Código sin consumidores (verificado con búsqueda de texto)

| Archivo | Qué es | Observación |
|---|---|---|
| `comercial-jhoel-app/src/app/features/dashboard/bank-agents/components/pending-balances-modal/pending-balances-modal.component.ts` | Componente Angular | Ninguna plantilla usa su selector ni otro archivo lo importa. Parece reemplazado por otra pantalla. |
| `comercial-jhoel-api/src/modules/transaction-banks/domain/errors/transaction-bank-inactive.error.ts` | Error de dominio `TransactionBankInactiveError` | No se lanza en ningún lugar. |
| `comercial-jhoel-api/src/modules/transaction-types/domain/errors/transaction-type-inactive.error.ts` | Error de dominio `TransactionTypeInactiveError` | No se lanza en ningún lugar. |

La lista se calcula automáticamente en [08_FILE_DEPENDENCIES.md](08_FILE_DEPENDENCIES.md#archivos-sin-consumidores-detectados-3).

## 2. Dependencias circulares (9 grupos)

- **8 de 9 son relaciones bidireccionales entre entidades ORM** (cabecera ↔ detalle: `sale.orm-entity.ts` ↔ `sale-detail.orm-entity.ts`, compras, helados, tickets, cotizaciones, catálogo, Transaccionar). Es el patrón normal de TypeORM (`@OneToMany` ↔ `@ManyToOne`) y funciona porque las relaciones usan funciones `() => Clase`.
- **1 es entre módulos Nest**: `inventory.module.ts` ↔ `products.module.ts`. Conviene revisar cómo se resuelve (por ejemplo con `forwardRef`) antes de reorganizar esos módulos.

## 3. Responsabilidades duplicadas

- **Lista de denominaciones de efectivo repetida en 5 lugares del backend**:
  - `cash-control/domain/cash-denominations.ts` (`CASH_DENOMINATIONS`, la más reciente)
  - `cash-control/presentation/dtos/cash-control.request.dto.ts` (`CASH_DENOMINATIONS`)
  - `cash-control/presentation/dtos/cash-custody.request.dto.ts` (`DENOMINATIONS`)
  - `cash-control/application/use-cases/register-cash-bank-deposit.use-case.ts` (`VALID_DENOMINATIONS`)
  - `guayacan-cash-box/application/utils/cash-denominations.ts` (`GUAYACAN_CASH_DENOMINATIONS`)

  En SQL hay dos funciones equivalentes: `cash_valid_denomination` y `guayacan_valid_denomination`. Al agregar Q0.01 hubo que tocar todas; si se agrega otra denominación hay que actualizar las siete.
- **En el frontend, dos listas**: `core/models/bank-deposit.model.ts` (`BANK_DEPOSIT_CASH_DENOMINATIONS`, la usa la tabla compartida de desglose) y `core/models/cuadre-agentes.model.ts` (`CASH_DENOMINATIONS`, Cuadre de Agentes).
- **Funciones `round2` locales** en varios archivos (por ejemplo `guayacan-cash-box/application/utils/cash-denominations.ts`, `register-cash-bank-deposit.use-case.ts`, `core/services/bank-deposit-draft.store.ts`), junto a utilidades de centavos enteros (`toCents` en `cash-control/domain/cash-denominations.ts`).

## 4. Endpoints sin llamada detectada desde el frontend

[12_API_ENDPOINTS.md](12_API_ENDPOINTS.md#endpoints-sin-llamada-detectada-desde-el-frontend-16) lista 16 rutas que ningún servicio Angular llama con una URL que el análisis pudo resolver:

- **8 son imágenes públicas** (`.../images/:id`). Se cargan desde plantillas con `<img src>`, no con `HttpClient`, así que no son llamadas sin uso.
- **2 las usa `ThemeService`** (`GET /users/me/preferences`, `PATCH /users/me/preferences/theme`). Sus URL se construyen en propiedades de clase (`this.preferencesUrl`, `this.updateThemeUrl`) que el análisis no resolvió.
- **Por diseño**: `GET /health` (monitoreo), el registro público `POST /users/register` y `GET /recharges/history`. Los dos últimos están documentados como "preparados para una pantalla futura" en `comercial-jhoel-api/CLAUDE.md`.
- **A revisar**: `GET /cash-control/warehouse/transfers/:id`, `GET /cash-control/warehouse/withdrawals/:id`, `GET /financial-day-reviews/sessions/:id`, `GET /keyboard-shortcuts/:id`, `GET /public-catalog-banks/:id`. Son lecturas por id que la interfaz actual no parece usar.

## 5. Inconsistencias y observaciones

- `tsc --noEmit -p tsconfig.json` sobre la API reporta errores de tipos en algunos **archivos de prueba**: `alerts/.../get-alerts.use-case.spec.ts`, `alerts/.../build-alerts.spec.ts`, `bank-deposits/.../register-bank-deposit-operation.use-case.spec.ts`, `inventory/.../register-inventory-transfer.use-case.spec.ts`, `purchases/.../mark-purchase-as-paid.use-case.spec.ts`, `sales/.../configure-sale-pricing.use-case.spec.ts` y `test/bank-deposit-description.e2e-spec.ts`. Son mocks desactualizados respecto de las interfaces actuales. Jest los ejecuta igual (ts-jest), pero el chequeo estricto falla.
- **Nombres con historia**: `close_agent_day_with_cash_breakdown` admite el origen `ARQUEO_CAJA` por compatibilidad, aunque la pantalla ya solo usa `CORTE_CAJA` (migración `1760007700000`).
- El frontend no es formateado con Prettier (sigue `.editorconfig`); el backend sí. Al leer el código verás estilos distintos.
- La base de desarrollo usada para generar [05_DATABASE_REFERENCE.md](05_DATABASE_REFERENCE.md) tiene **todas** las migraciones aplicadas, incluidas algunas que en el momento del análisis aún no estaban en producción (`1760007700000`).

## 6. Limitaciones del análisis automático

- El análisis es **sintáctico**: no usa el verificador de tipos. Los retornos sin anotación aparecen como "(inferido)", y los "consumidores" de un método se aproximan por nombre de llamada dentro de archivos que importan la clase. Un método muy común (`execute`, `findAll`) puede dar falsos positivos.
- Las tablas mencionadas por un archivo se detectan con expresiones regulares sobre el SQL (`FROM`, `JOIN`, `INTO`, `UPDATE`). El SQL generado dinámicamente puede no aparecer.
- Los métodos invocados por el framework (rutas Nest, ciclo de vida Angular, `ngOnChanges`) no tienen un "llamador" en el código. Se indica así en su ficha.
