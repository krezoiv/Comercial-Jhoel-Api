# Listas Escolares — inventario negativo, abastecimiento FIFO y despacho

Migración `1760008300000-SchoolListSupply`. El código nuevo y el modificado están documentados en inglés.

## 1. Decisiones del dueño

| Tema | Decisión |
|---|---|
| Asignación de compras | **Automática FIFO** al entrar unidades a Bodega (compra, traslado, devolución), con opción de modo manual |
| Despacho | **Despacho = entrega**: exige la lista abastecida y el saldo pagado; deja la lista DESPACHADA (abastecimiento) y ENTREGADA (comercial) |
| Líneas escritas a mano | Sin control de inventario; **no bloquean** el despacho |

## 2. Conceptos

| Concepto | Qué es | Dónde vive |
|---|---|---|
| **Comprometido** | Lo que una lista activa (confirmada, no anulada ni entregada) pidió de cada producto del inventario | vista `school_supply_commitments` |
| **Descontado** | Lo que la lista sacó de Bodega al confirmarse. Puede dejar la existencia negativa | `inventory_movements` (`SALIDA_LISTA_ESCOLAR`) |
| **Reservado (abastecido)** | Unidades físicas asignadas a una lista concreta, con su origen (existencia, compra o traslado) | `school_supply_allocations` (ASIGNADA) |
| **Pendiente** | Comprometido − reservado: lo que falta comprar | calculado en la vista |
| **Entregado** | Lo despachado al cliente | `school_dispatches` y sus líneas; reservas ENTREGADA |

Como la lista ya descontó sus unidades al confirmarse, en Bodega se cumple siempre:

```
existencia en Bodega = unidades libres − unidades pendientes
unidades libres      = existencia + pendientes     (school_supply_free_units)
```

Por eso reservar o despachar **nunca mueve inventario**. La existencia negativa y el pendiente son cifras distintas, y la pantalla las muestra por separado.

## 3. PostgreSQL

### Existencias negativas solo para Listas Escolares
- **Restricciones reemplazadas:** `CHK_inventory_stock_quantity_non_negative` y `CHK_products_stock_non_negative` pasan a ser triggers con la **misma regla y el mismo error** (código 23514 y el mismo nombre de restricción). Nada puede dejar una existencia negativa ni hundir más una que ya lo es.
- **Única excepción:** `school_quotation_sync_inventory` activa la bandera de transacción `cj.allow_negative_stock = 'SCHOOL_LIST'` solo alrededor de sus propias actualizaciones y la limpia de inmediato. La prueba S14 verifica que no queda activa.
- **`products.stock`:** es la suma de las ubicaciones, así que puede ser negativo solo hasta donde lo sean sus ubicaciones. Una venta legítima desde Vitrina nunca se bloquea por una lista pendiente en Bodega.
- **Los demás módulos no cambian:** Ventas, Cotizaciones, traslados y anulación de compras conservan sus propias validaciones. Probado: un traslado desde Bodega negativa se rechaza y Ventas no vende sin existencias en Vitrina.

### Tablas nuevas
- `school_supply_settings`: modo de asignación (`FIFO_AUTO` o `MANUAL`).
- `school_supply_allocations`:
  - Una fila por reserva: lista, producto y cantidad.
  - Origen: `EXISTENCIA`, `COMPRA`, `TRASLADO` o `DEVOLUCION`, más el movimiento y la compra de donde vinieron las unidades.
  - Modo: `AUTO`, `FIFO_MANUAL` o `MANUAL`. Estado: `ASIGNADA`, `LIBERADA` o `ENTREGADA`. Usuario, fechas y motivo.
  - Inmutable: solo pasa de ASIGNADA a LIBERADA o ENTREGADA.
- `school_dispatches` y `school_dispatch_items`: el despacho, uno por lista, con lo solicitado, abastecido y entregado por línea. Solo inserción.
- `school_quotations.confirmed_at`: fecha de confirmación, la referencia de FIFO.

### Funciones
| Función | Qué hace |
|---|---|
| `school_quotation_sync_inventory` (reescrita) | Descuenta o devuelve por diferencia (ya no rechaza por falta de existencias); libera las reservas que la lista ya no necesita, una sola vez; reparte FIFO las unidades libres |
| `school_supply_free_units(product)` | Unidades físicas sin reservar en Bodega |
| `school_supply_allocate_fifo(product, user, movement, mode)` | Asigna unidades libres a las listas pendientes por fecha de confirmación; si viene de un movimiento, nunca usa más de lo que ese movimiento aportó y no se ha asignado. Bloquea el producto |
| trigger `trg_school_supply_on_stock_in` | En modo automático, cada entrada a Bodega (compra, traslado) llama a FIFO dentro de la misma transacción de la compra |
| `run_school_supply_fifo`, `allocate_school_supply_purchase`, `allocate_school_supply_manual` | FIFO manual, "asignar esta compra" y asignación manual (con llave de idempotencia) |
| `set_school_supply_mode` | Cambio de modo (solo administradores) |
| `school_quotation_supply_status` | PENDIENTE / PARCIAL / DISPONIBLE / DESPACHADA (NO_APLICA para borradores y anuladas) |
| `dispatch_school_quotation` | Despacho: exige saldo pagado y nada pendiente; registra el despacho y sus líneas; marca las reservas ENTREGADA y la lista ENTREGADA. **Sin movimiento de inventario.** Idempotente |
| Parches | `change_school_quotation_status('ENTREGAR')` redirige al despacho (`SCHOOL_USE_DISPATCH`); permiso nuevo `school_lists.supply.manage` (supervisor y admin) |

`down` restaura las restricciones y la función anterior. Se niega a correr si existen reservas, despachos o existencias negativas.

## 4. FIFO

Se ordena por `confirmed_at`, luego `created_at` y luego el número de lista. Ejemplo con una compra de 12 cuadernos (prueba S6):

| Lista | Pendiente | Asignado | Queda |
|---|---:|---:|---:|
| A | 5 | 5 | 0 |
| B | 5 | 5 | 0 |
| C | 5 | 2 | 3 |

- **Sin sobreasignar:** nunca se asigna más que lo libre en Bodega, más que lo pendiente de cada lista, ni más de lo que trajo esa compra.
- **Sin duplicar:** el bloqueo por producto impide que dos procesos asignen las mismas unidades. Probado con dos compras simultáneas reales.

## 5. Despacho y anulación

- **Despacho:** valida el pago y que nada esté pendiente, y registra fecha, hora, usuario y cantidades entregadas. No descuenta de nuevo; el e2e verifica que no hay movimientos nuevos ni cambia Bodega.
- **Anulación:**
  - Devuelve exactamente lo descontado (`ENTRADA_ANULACION_LISTA`, con motivo y usuario) y libera sus reservas una sola vez.
  - En modo automático, las unidades liberadas pasan FIFO a la siguiente lista pendiente.
  - Anular de nuevo no hace nada.
  - Una lista despachada no se anula.

Ejemplo verificado en el navegador: una lista de 9 con 7 reservadas deja Bodega en −2; al anularla, Bodega vuelve a 7 y las 7 reservas quedan liberadas.

## 6. Endpoints (`/api/school-lists`)

| Ruta | Permiso |
|---|---|
| `GET supply/products` (filtros: search, categoryId, dateFrom, dateTo, quotationNumber, status) — tabla y tarjetas | view |
| `GET supply/products/:productId/lists` — listas que necesitan el producto | view |
| `GET supply/purchases?purchaseId=` — compras y listas abastecidas | view |
| `POST supply/purchases/:purchaseId/allocate` | supply.manage |
| `POST supply/fifo` · `POST supply/allocations` (manual, con `clientRequestId`) | supply.manage |
| `GET supply/settings` · `PUT supply/settings` | view · templates.manage |
| `POST quotations/:id/dispatch` — Preparar y despachar | quotations.edit |
| `GET quotations` (+`supplyStatus`), `GET quotations/:id` (+`supply`) | modificados |

## 7. Archivos

**API — creados**
- `src/database/migrations/1760008300000-SchoolListSupply.ts`
- `src/modules/school-lists/application/use-cases/school-supply.use-cases.ts`:
  - `ListSupplyProducts`, `ListSupplyProductLists`, `ListSupplyPurchases`
  - `GetSupplySettings`, `SetSupplySettings`
  - `RunSupplyFifo`, `AllocateSupplyPurchase`, `AllocateSupplyManual`
  - `DispatchSchoolQuotation`
- `sql/tests/school-supply.test.sql`
- `test/school-supply.e2e-spec.ts`

**API — modificados**
- `school-lists`: errores, política (`supply.manage`), puerto y repositorio (`supplyOf`, `supplyProducts`, `supplyProductLists`, `supplyPurchases`, modo, FIFO, asignaciones, despacho), DTO, controlador, módulo y las specs de casos de uso y errores.
- Pruebas: `sql/tests/school-lists.test.sql` (despacho y negativos), `sql/tests/school-lists-concurrency.sh` (dos compras simultáneas), `test/school-lists.e2e-spec.ts`.

**App — creados**
- `school-lists/components/school-supply/*`: Productos pendientes de abastecimiento y compras asignadas.
- `school-lists/components/school-quotation-supply/*`: Estado de abastecimiento y Preparar y despachar.

**App — modificados**
- `core/models/school-list.model.ts` y `core/services/school-list.service.ts`.
- Listas Escolares:
  - Página: pestaña "Abastecimiento" y `?compra=`.
  - Listado: columna y filtro de abastecimiento; la entrega lleva al despacho.
  - Detalle: pestaña Abastecimiento, despacho y resumen de anulación.
  - Editor: aviso no bloqueante de existencias insuficientes.
  - `school-lists.spec.ts`.
- Compras: `purchases-page.component.ts`. Solo un aviso después de guardar; el flujo no cambia.

## 8. Pruebas y resultados

| Prueba | Resultado |
|---|---|
| `sql/tests/school-supply.test.sql` (nueva) | **43/43**: cubre los 20 puntos pedidos, con las funciones reales de Compras, Traslados y Ventas |
| `sql/tests/school-lists.test.sql` | **79/79** |
| Las otras 15 suites SQL | sin errores |
| Concurrencia | **5/5**, incluida la de dos compras simultáneas: 16 asignadas, ninguna duplicada, 4 libres |
| Jest | **427/427** |
| e2e | **12/12 archivos**. `school-supply`: lista de 20 líneas → pendientes → compra por `POST /api/purchases` → FIFO → despacho sin movimientos; anulación parcial; Ventas sin cambios |
| Karma | **262/262** |
| Build de producción | OK; estilos por debajo de 12 kB |
| Migración | se revierte (restaura las restricciones y la función) y se vuelve a aplicar |
| **En vivo (frontend + PostgreSQL)** | Sobre una copia temporal de la base, ver la tabla siguiente. La copia se eliminó al terminar; la base de dev quedó sin datos de prueba |

Recorrido en vivo:

| Paso | Resultado en Bodega y en la lista |
|---|---|
| Lista con 5 lapiceros (2 en Bodega) y 3 resaltadores (0 en Bodega) | Confirmación con el aviso de existencias insuficientes; Bodega −3 y −3; 2 reservadas; estado PARCIAL |
| Pantalla de pendientes | 2 productos y 6 unidades pendientes |
| Compra de 10 y 10 desde la pantalla de Compras | Aviso "6 unidades asignadas a 1 lista"; Bodega 7 y 7; lista DISPONIBLE |
| Cobro y despacho | 0 movimientos nuevos; lista ENTREGADA y DESPACHADA |
| Segunda lista de 9 y anulación | La confirmación muestra 9 a devolver y 7 reservas a liberar; Bodega vuelve a 7; reservas LIBERADA |

## 9. Despliegue

Commit y push, luego `npm run migration:run:prod`. Queda activo el modo automático FIFO; un administrador puede cambiarlo en Listas Escolares → Abastecimiento.
