# Control de Efectivo — inventario por denominación, traslados con desglose y borradores del Arqueo de Caja

Migración `1760007800000-CashDenominationInventoryAndCountDrafts`. El código nuevo y el modificado están documentados en inglés en sus propios archivos. Este documento resume el cambio para el equipo.

## 1. Hallazgos del análisis previo

| Tema | Estado encontrado | Decisión |
|---|---|---|
| Caja → Bodega | Ya existía la "Entrega a Bodega" (`register_cash_warehouse_transfer`): una transacción, bloqueos, idempotencia, historial `ENT-000001` y reversa auditada. El desglose iba en `cash_movement_details`. Un administrador podía registrar sin desglose. | Se reutiliza (sin duplicar). Desde ahora el desglose es **obligatorio** y se valida por denominación. |
| Bodega → Caja | Ya existía el "Retiro de Bodega" con destino caja (`register_warehouse_withdrawal`, `RET-000001`). El desglose iba en `warehouse_cash_movement_details`. | Igual que arriba. |
| Inventario por denominación | No existía. Los saldos de caja y Bodega son **montos**, y varias entradas y salidas de caja nunca traen desglose: Transaccionar, CxC, Activos, retiros en banco y movimientos manuales. | Inventario **derivado** y anclado al último conteo físico (decisión del usuario). Lo que entró o salió sin desglose aparece como "sin desglosar". |
| Bodega sin conteo | El saldo inicial de Bodega se cargó sin desglose. | Nuevo **conteo de Bodega por denominación** (administrador), que debe sumar su saldo. |
| Arqueo de Caja | `CashCountModalComponent.ngOnChanges` reiniciaba las cantidades en cada apertura. No había borrador. | Borrador persistido en la base por usuario y día bancario, con autoguardado y una copia local. |

## 2. Cambios en PostgreSQL

### Tablas nuevas
- `warehouse_cash_counts` + `warehouse_cash_count_details`: conteo de Bodega por denominación.
  - `CHECK total_counted = warehouse_balance`.
  - Inmutables (`cash_custody_status_only_guard`).
  - `idempotency_key` UNIQUE.
- `cash_count_drafts`: borrador del arqueo, con `UNIQUE (user_id, day_opening_id)` y `payload JSONB`. No es un registro financiero: se actualiza y se borra.

### Funciones nuevas
| Función | Qué hace |
|---|---|
| `cash_location_anchor(location)` | Último conteo físico de la ubicación. **CAJA**: arqueo `VIGENTE` (`cash_counts.last_cash_sequence`) o el arqueo vigente de un corte `FINALIZADO` (`cash_cut_periods.closing_sequence`), el que sea más tardío en el Kardex. **BODEGA**: último `warehouse_cash_counts`. |
| `cash_location_inventory(location)` | 12 filas (Q200 … Q0.01). Parte del desglose del ancla y le suma o resta cada movimiento posterior con desglose. Una anulación aplica el desglose del original con su propia dirección. |
| `cash_location_inventory_summary(location)` | Ancla, saldo oficial, total conocido y `sin desglosar = saldo − total conocido`. |
| `cash_assert_denominations_available(location, details)` | Rechaza `CASH_COUNT_REQUIRED` / `WAREHOUSE_COUNT_REQUIRED` cuando no hay ancla, y `CASH_DENOMINATION_NOT_AVAILABLE:den:disp:sol` / `WAREHOUSE_DENOMINATION_NOT_AVAILABLE:…` cuando falta alguna denominación. |
| `register_warehouse_cash_count(details, observations, user, key)` | Conteo de Bodega. Rol `cash_custody.authorize`, día bancario abierto, bloqueo `warehouse_cash_main`. Si no coincide con el saldo, rechaza con `WAREHOUSE_COUNT_MISMATCH:contado:saldo`. |

### Funciones modificadas (parche con anclas verificadas; `down` las restaura idénticas)
- `register_cash_warehouse_transfer` y `register_warehouse_withdrawal`:
  - Sin desglose rechazan con `CASH_CUSTODY_BREAKDOWN_REQUIRED`; antes, un administrador podía omitirlo.
  - Después de tomar sus bloqueos de siempre, verifican la disponibilidad por denominación en el origen: CAJA para la entrega y BODEGA para el retiro.

## 3. Reglas de negocio implementadas

1. Todo traslado entre caja y Bodega lleva su desglose. Las cantidades deben ser enteras, mayores que cero y sin repetir denominación, y deben sumar el monto. Se valida en el DTO, en el caso de uso y en SQL.
2. No se puede enviar ni retirar más billetes o monedas de una denominación de los disponibles en el origen. La validación es atómica, bajo el bloqueo del origen, así que **dos usuarios nunca retiran a la vez el mismo billete** (probado con sesiones reales en `cash-control-concurrency.sh`).
3. Lo que no trae desglose no se inventa: queda como "sin desglosar" y se resuelve con el siguiente arqueo.
4. Se mantiene todo lo existente:
   - Día bancario abierto y saldo suficiente bajo bloqueo.
   - Personas identificadas.
   - Idempotencia: un doble clic devuelve el mismo registro.
   - Inmutabilidad y reversa auditada que restaura las existencias.
5. El borrador del arqueo:
   - Pertenece al usuario del JWT y al día bancario actual. Nadie más puede leerlo ni escribirlo.
   - Exige un día bancario abierto.
   - Lo borra el backend solo al confirmar un arqueo nuevo, no una corrección, o con "Reiniciar arqueo".
   - Si confirmar falla, se conserva.

## 4. Endpoints nuevos y modificados (`/api/cash-control`)

| Método y ruta | Permiso | Descripción |
|---|---|---|
| `GET inventory` | `cash_custody.view` | Inventario por denominación de caja y Bodega |
| `GET warehouse/counts` | `cash_custody.view` | Historial de conteos de Bodega |
| `POST warehouse/counts` | `cash_custody.authorize` | Conteo de Bodega por denominación |
| `GET custody/transfers` | `cash_custody.view` | Historial unificado de traslados con desglose. Filtros: `kind` (CAJA_A_BODEGA / BODEGA_A_CAJA / BODEGA_A_BANCO), `userId`, `dateFrom`, `dateTo`, `status` |
| `GET counts/draft` | `cash_custody.operate` | Borrador propio del día bancario actual |
| `PUT counts/draft` | `cash_custody.operate` | Autoguardado (upsert) |
| `DELETE counts/draft` | `cash_custody.operate` | "Reiniciar arqueo" |
| `POST warehouse/transfers`, `POST warehouse/withdrawals` | (sin cambio) | **Modificados**: desglose obligatorio y validación por denominación |
| `POST counts` | (sin cambio) | **Modificado**: al confirmar, borra el borrador del usuario |

## 5. Backend: clases y métodos

- `domain/repositories/cash-custody.repository.ts`: tipos `LocationInventory`, `WarehouseCashCountRow`, `CashCountDraft(Payload)`, `CustodyTransferRow`, `FindCustodyTransfersOptions`. Puerto: `getInventory`, `registerWarehouseCount`, `findWarehouseCounts`, `findWarehouseCountById`, `getCountDraft`, `saveCountDraft`, `deleteCountDraft`, `findCustodyTransfers`.
- `infrastructure/persistence/typeorm-cash-custody.repository.ts`: implementación con SQL parametrizado (`WAREHOUSE_COUNT_SELECT`, `CUSTODY_TRANSFERS_UNION`).
- `application/use-cases/cash-custody.use-cases.ts`:
  - Nuevos: `GetCashInventoryUseCase`, `RegisterWarehouseCashCountUseCase`, `ListWarehouseCashCountsUseCase`, `GetCashCountDraftUseCase`, `SaveCashCountDraftUseCase`, `DiscardCashCountDraftUseCase`, `ListCustodyTransfersUseCase` y el helper `requireBreakdown`.
  - Modificados: `RegisterWarehouseTransferUseCase`, `RegisterWarehouseWithdrawalUseCase` y `RegisterCashCountUseCase`.
- `domain/errors/cash-control.errors.ts`: códigos nuevos y mensajes con detalle (`DETAILED`), por ejemplo "No hay suficientes billetes o monedas de Q200 en caja: disponibles 5, solicitados 6…".
- `presentation/`: DTO `RegisterWarehouseCashCountRequestDto`, `SaveCashCountDraftRequestDto`, `DraftDenominationRequestDto`, `CustodyTransfersQueryDto`, `PageQueryDto`, y las rutas en `CashCustodyController`.

## 6. Frontend

- **Pestaña nueva "Inventario y traslados"** (`cash-control-page`). Tiene los botones "Enviar de Bodega a caja" y "Retirar de caja a Bodega", y estos componentes:
  - `CashInventoryPanelComponent`: dos tarjetas (Caja, Bodega) con cantidad y subtotal por denominación, punto de partida, "sin desglosar" y saldo oficial. El administrador ve "Registrar conteo de Bodega" y los últimos conteos.
  - `WarehouseCountModalComponent`: solo permite guardar si el conteo es igual al saldo de Bodega.
  - `CustodyTransfersPanelComponent`: filtros por tipo, usuario, fechas y estado, y un modal con el desglose de cada movimiento.
- **Modales de traslado** (`WarehouseTransferModalComponent`, `WarehouseWithdrawalModalComponent`):
  - Se eliminó la opción "sin desglose".
  - Cada denominación muestra "disp. N" del origen.
  - Se bloquea guardar si una cantidad supera lo disponible o si el origen no tiene conteo. Es solo de UX: el backend decide.
- **`CashBreakdownTableComponent`**: nuevo `@Input() available` opcional. Sin él, Transaccionar y los arqueos se ven igual que antes.
- **`CashCountModalComponent`**: borrador con autoguardado (800 ms) e indicador "Guardando…" / "Guardado correctamente" / "Error al guardar".
  - Copia local inmediata en `localStorage` (`cj_cash_count_draft:<usuario>:<día>`).
  - Al abrir gana la versión más reciente; si la copia local es más nueva que la del servidor, se resincroniza.
  - Al salir de la pantalla con un guardado pendiente, se envía en ese momento.
  - "Reiniciar arqueo" pide confirmación.
- **`cashMutationInterceptor`**: no difunde el autoguardado del borrador como "cambio de efectivo", para que las pantallas no se recarguen en cada tecla.

## 7. Relación con otros módulos

- **Transaccionar, CxC, Activos, retiros en banco y movimientos manuales:** no se tocaron. Siguen moviendo la caja por monto, y su efecto aparece como "sin desglosar" hasta el siguiente arqueo o corte.
- **Arqueo de Caja y cortes (`finish_cash_cut_period`):** su desglose es el punto de partida del inventario de caja. Su lógica no cambió.
- **Depósito de caja a banco:** guarda desglose y por eso resta del inventario de caja, pero **no se le agregó validación por denominación** (no se pidió). Si deposita billetes que el inventario no conoce, esa denominación puede mostrarse negativa (en rojo) hasta el siguiente arqueo.
- **Cuadre de Agentes, bancos y Kardex:** sin cambios. El inventario solo lee.

## 8. Pruebas

| Prueba | Resultado |
|---|---|
| `sql/tests/cash-denomination-inventory.test.sql` (nueva) | 31/31 |
| `cash-custody.test.sql`, `warehouse-withdrawals.test.sql` | 41/41 y 28/28, adaptadas a las reglas nuevas |
| Las otras 11 suites SQL | sin errores |
| `cash-control-concurrency.sh` | Caso Bodega reescrito: dos entregas simultáneas de 6×Q200 con 10 disponibles → una sola aplicada, quedan 4, nunca negativo |
| Jest API | 399/399; incluye los casos nuevos y `cash-control.errors.spec.ts` |
| `test/cash-inventory.e2e-spec.ts` (nuevo) | 2/2: borrador (autoguardado, recuperación con un token nuevo, aislamiento entre usuarios, limpieza al confirmar y al reiniciar) y traslados (billetes exactos, rechazos, historial con filtros, reversa) |
| Los otros 7 e2e | todos pasan (`cash-custody` adaptado) |
| Karma | 240/240: borrador, modales, tabla, conteo de Bodega, historial e interceptor |
| Build de producción del frontend | OK |
| Migración | Se revierte y se vuelve a aplicar con las funciones idénticas |

## 9. Despliegue

1. Commit y push.
2. `npm run migration:run:prod` en Railway.
3. Un administrador registra el **conteo inicial de Bodega**, en la pestaña "Inventario y traslados".
4. Conviene registrar un arqueo de caja o finalizar un corte para fijar el punto de partida de la caja.

Mientras no existan esos conteos, el sistema rechaza las entregas a Bodega (sin arqueo de caja) y los retiros de Bodega (sin conteo de Bodega), con un mensaje que explica qué hacer.
