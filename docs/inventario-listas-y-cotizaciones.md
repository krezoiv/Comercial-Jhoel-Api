# Inventario de Listas Escolares y Cotizaciones con cliente manual y "Confirmar venta"

Migraciones `1760008100000-SchoolListInventory` y `1760008200000-QuotationsManualCustomerAndSale`. El código nuevo y el modificado están documentados en inglés.

Hay dos comportamientos de inventario **independientes**:

| | Listas Escolares | Cotizaciones |
|---|---|---|
| Al guardar | Descuenta de **Bodega** los productos del inventario | **No** toca inventario |
| Al anular | Devuelve a Bodega exactamente lo descontado, una sola vez | (no hay nada que devolver) |
| Venta | No crea venta (decisión anterior) | "Confirmar venta" crea **una** venta con Ventas y descuenta de **Vitrina** |
| Escritor único | `school_quotation_sync_inventory` | `confirm_sale` (Ventas), llamado por `convert_quotation_to_sale` |

## 1. Análisis y decisiones del dueño

- **Inventario:**
  - `products.stock` y `inventory_stock` por ubicación (Bodega y Vitrina).
  - `inventory_movements` registra tipo, presentación, ubicación, referencia al documento, usuario, motivo y fecha.
  - Ventas descuenta de Vitrina y `void_sale` devuelve lo vendido.
  - Se reutilizan las mismas tablas, los mismos ayudantes (`ensure_inventory_stock_row`, `ensure_product_presentation`) y el mismo orden de bloqueos por producto.
- **Decisiones:**
  - Listas: se descuenta de **Bodega**.
  - Listas: solo se mueven las líneas que vienen del inventario; las escritas a mano no.
  - Cotizaciones: la venta respeta los **precios cotizados**.
  - Cotizaciones: **no** reciben anticipos ni abonos; se cobran como cualquier venta, una sola vez, en la Caja de ventas.

## 2. Cambios en PostgreSQL

### `1760008100000-SchoolListInventory`
- `school_quotation_sync_inventory(quotation, user, reason)`:
  - Por producto calcula **objetivo − ya movido**. El objetivo es la suma de las líneas con producto si la lista no está en BORRADOR ni CANCELADA. "Ya movido" se lee de `inventory_movements` con referencia `SCHOOL_LIST` a esa lista.
  - Los movimientos son a la vez auditoría y libro mayor. Repetir el guardado, reintentar o anular dos veces da diferencia 0 y no escribe nada: **nunca hay descuentos ni devoluciones duplicadas**.
  - Bloquea `products` e `inventory_stock` en orden de id y valida existencias bajo el bloqueo. Nunca deja negativos y responde `SCHOOL_INSUFFICIENT_STOCK:disponibles:pedidas:producto`.
  - Tipos de movimiento: `SALIDA_LISTA_ESCOLAR`, `ENTRADA_AJUSTE_LISTA` (edición que reduce) y `ENTRADA_ANULACION_LISTA` (anulación, con el motivo).
- Parches con anclas verificadas, que llaman a la sincronización:
  - `create_school_quotation`: al guardar una lista confirmada.
  - `update_school_quotation`: al editar, solo mueve la diferencia.
  - `change_school_quotation_status`: al confirmar un borrador.
  - `cancel_school_quotation`: al anular, devuelve todo.
  - Una lista entregada no se puede anular (regla existente).
- `down`: restaura las funciones y se niega a correr si ya existen movimientos de listas.

### `1760008200000-QuotationsManualCustomerAndSale`
- **`quotations`:**
  - `client_id` pasa a ser opcional.
  - Columnas nuevas: `customer_name`, `customer_phone`, `student_name`, `grade`, `accepted_*`, `rejected_*`/`reject_reason` y `sold_*`.
  - Restricciones: `CHK_quotations_customer` (cliente registrado, o nombre y teléfono) y `CHK_quotations_sold` (VENDIDA ⇔ venta enlazada).
  - Índice único `UQ_quotations_converted_to_sale`: una venta por cotización.
- **Estados:** BORRADOR, COTIZADA, ACEPTADA, VENDIDA, RECHAZADA y CANCELADA.
  - Mapeo de las filas existentes: PENDIENTE → COTIZADA y ANULADA → CANCELADA. El `down` las devuelve.
  - VENCIDA sigue siendo derivada: una COTIZADA con la fecha de vencimiento pasada.
- **`create_quotation`:** recibe el cliente capturado a mano y la opción de borrador. Sigue sin tocar el inventario.
- **`change_quotation_status`:** CONFIRMAR, ACEPTAR, RECHAZAR (con motivo) y CANCELAR (con motivo; una VENDIDA no se cancela).
- **`convert_quotation_to_sale`:**
  - Bloquea la cotización. Si ya está VENDIDA devuelve la misma venta (doble clic o reintento).
  - Exige COTIZADA o ACEPTADA, no vencida.
  - Valida Vitrina por producto, con nombre en el mensaje.
  - Llama al **mismo** `confirm_sale` de Ventas, enlaza la venta y marca la cotización VENDIDA. Todo en una transacción: si algo falla, se revierte completo.
- **`confirm_sale`:** parche mínimo. Acepta `unitPrice` y `lineTotal` opcionales por línea, que solo usa la conversión. `POST /sales` no puede enviarlos (su DTO rechaza campos no permitidos, lo prueba el e2e), así que Ventas cobra igual que antes.
- **`down`:** restaura la función original y se niega a correr si hay estados nuevos o clientes capturados a mano.

## 3. Endpoints

| Ruta | Cambio |
|---|---|
| `POST /api/school-lists/quotations`, `PUT …/:id`, `POST …/:id/status`, `POST …/:id/cancel` | Ahora descuentan, ajustan o devuelven inventario de Bodega |
| `GET /api/school-lists/stock?productIds=` | **Nuevo:** existencias de Bodega para el editor |
| `GET /api/school-lists/quotations/:id` | Incluye `inventory` (movimientos de la lista) |
| `POST /api/quotations` | Cliente manual (`customerName`, `customerPhone`, `studentName`, `grade`, `asDraft`); `clientId` opcional |
| `GET /api/quotations` | Filtro por estados nuevos; búsqueda por nombre, teléfono, estudiante o número |
| `POST /api/quotations/:id/status` | **Nuevo:** CONFIRMAR, ACEPTAR, RECHAZAR |
| `GET /api/quotations/:id/sale-preview` | **Nuevo:** resumen con existencias de Vitrina |
| `POST /api/quotations/:id/confirm-sale` | **Nuevo:** Confirmar venta (idempotente) |
| `POST /api/quotations/:id/void` | Ahora pasa por SQL con bloqueo; rechaza una VENDIDA |

## 4. Archivos

**API — creados**
- Migraciones: `src/database/migrations/1760008100000-SchoolListInventory.ts` y `1760008200000-QuotationsManualCustomerAndSale.ts`.
- Cotizaciones:
  - `src/modules/quotations/domain/errors/quotation-rule.error.ts`
  - `src/modules/quotations/application/use-cases/quotation-sale.use-cases.ts`: `ChangeQuotationStatusUseCase`, `GetQuotationSalePreviewUseCase`, `ConvertQuotationToSaleUseCase` y su spec.
  - `src/modules/quotations/presentation/dtos/quotation-status.request.dto.ts`
- Pruebas: `sql/tests/quotations-sale.test.sql` y `test/quotations-sale.e2e-spec.ts`.

**API — modificados**
- `quotations`:
  - Entidad, ORM, mapeo, puerto y repositorio: `changeStatus`, `convertToSale` y `salePreview`; `voidQuotation` se sustituye por el cambio de estado.
  - Salida, DTO de creación, de listado y de respuesta.
  - Casos de uso de crear y anular, controlador, módulo y PDF (teléfono, estudiante y grado).
  - Las specs de crear y anular, adaptadas.
- `school-lists`:
  - Errores (`SCHOOL_INSUFFICIENT_STOCK`), puerto y repositorio (`bodegaStock` y movimientos en el detalle).
  - `GetSchoolBodegaStockUseCase`, `StockQueryDto`, controlador y módulo, más sus specs.
- Pruebas: `sql/tests/school-lists.test.sql` (inventario), `sql/tests/school-lists-concurrency.sh` (carrera por existencias) y `test/school-lists.e2e-spec.ts`.

**App — creados**
- `features/dashboard/quotations/components/quotation-sale-modal/*`: resumen, existencias en Vitrina y "Confirmar venta".
- `features/dashboard/quotations/quotations.spec.ts`.

**App — modificados**
- Cotizaciones:
  - `core/models/quotation.model.ts`: estados, campos y vista previa.
  - `core/services/quotations.service.ts`: `changeStatus`, `getSalePreview` y `confirmSale`.
  - `create-quotation-tab`: campos manuales en lugar del selector de clientes, aviso "no afecta el inventario" y opción de borrador.
  - `quotation-history-tab`: estados, búsqueda, y acciones Confirmar, Aceptar, Rechazar, Confirmar venta y Anular (esta última bloqueada si está vendida).
  - `quotation-detail-modal`: estado, cliente y venta.
  - `quotation-void-reason-modal`: textos configurables.
- Listas Escolares:
  - `core/models/school-list.model.ts` y `core/services/school-list.service.ts`: movimientos y `bodegaStock`.
  - `school-quotation-editor`:
    - Muestra "Bodega: N" por línea y bloquea si no alcanza (un borrador no bloquea).
    - La confirmación muestra el número de lista, los productos, los artículos, el monto y el aviso de descuento.
    - El botón dice "Guardar y descontar inventario".
  - `school-quotation-detail-page`:
    - Nueva tabla "Movimientos de inventario (Bodega)".
    - "Anular lista" avisa cuántas unidades vuelven a Bodega.
  - `school-lists.spec.ts`.

## 5. Pruebas y resultados

| Prueba | Resultado |
|---|---|
| `sql/tests/school-lists.test.sql` | **77/77**. Descontar al guardar; falta de existencias que nombra el producto sin cambiar nada; un borrador no descuenta; confirmarlo sí; editar mueve la diferencia; anular devuelve exactamente lo descontado, una vez, con usuario y motivo; resincronizar no mueve nada; no se anula una entregada |
| `sql/tests/quotations-sale.test.sql` (nueva) | **18/18**. Cliente a mano sin registro en clientes; guardar no toca inventario; estados; falta de existencias; venta con precios cotizados; Vitrina y movimiento; una sola venta al repetir; una vendida no se cancela; una vencida no se vende; Ventas normal sin cambios |
| `school-lists-concurrency.sh` | **OK**: dos listas compiten por 4 de 5 unidades → se guarda una y Bodega queda en 1 |
| Jest API | **425/425** (57 suites) |
| e2e | **11/11 archivos**. `school-lists` (descuento, falta de existencias, devolución) y `quotations-sale` (dos "Confirmar venta" **simultáneos** → una venta y un descuento; `POST /sales` rechaza precios) |
| Suites SQL restantes y concurrencia de Control de Efectivo | Sin errores |
| Karma | **259/259** |
| Build de producción | OK |
| Migraciones | `1760008100000` y `1760008200000` se revierten (restaurando las funciones originales) y se vuelven a aplicar |
| **Prueba en vivo: frontend y PostgreSQL** | Sobre una copia temporal de la base, con la API compilada y la app en el navegador. Lista: Bodega 10 → **6** al guardar → **10** al anular, con usuario, motivo y referencia. Cotización a mano: sin movimientos al guardar. "Confirmar venta" con **doble clic**: una venta, Vitrina 20 → **17**, VENDIDA y enlazada. Copia eliminada al terminar; la base de dev quedó sin datos de prueba |

## 6. Despliegue

Commit y push, luego `npm run migration:run:prod`. Antes de usarlo:
- **Listas:** necesitan existencias en **Bodega** de los productos enlazados.
- **"Confirmar venta":** usa las existencias de **Vitrina**, igual que Ventas.

Las cotizaciones ya existentes en producción pasan de PENDIENTE a COTIZADA y de ANULADA a CANCELADA automáticamente.
