# Listas Escolares — requerimientos, aceptación y preparación del pedido

Migración `1760008400000-SchoolListRequirements`. El código nuevo está documentado en inglés.

**Regla fundamental:** el *requerimiento escolar* es lo acordado con el cliente (texto, cantidad, precio cotizado). El *producto de inventario* es el artículo físico que lo cumple. Ninguno sobrescribe al otro.

## 1. Cómo funcionaba antes

| Etapa | Antes (lo que se conserva para listas ya guardadas) |
|---|---|
| Plantilla | Líneas de inventario (`product_id`) o escritas a mano |
| Cotización | Copiaba las líneas; nacía COTIZADA (o BORRADOR) |
| Estados | Los pagos cambiaban el estado: COTIZADA → ANTICIPO_RECIBIDO → PAGO_PARCIAL → PAGADA |
| Inventario | Al **guardar/confirmar** se descontaba Bodega (incluso a negativo); editar movía la diferencia |
| Abastecimiento | Reservas FIFO de compras para cubrir negativos; despacho = entrega, sin mover inventario |

## 2. Cómo funciona ahora (listas nuevas)

| Etapa | Ahora |
|---|---|
| Plantilla | Solo requerimientos escritos a mano: descripción (hasta 300 caracteres), cantidad, precio unitario, total y observaciones. No consulta inventario. Se puede copiar de otra plantilla o duplicarla |
| Cotización | Copia los requerimientos, cantidades y precios; calcula subtotal/total; no consulta ni descuenta inventario |
| Estado inicial | **ACEPTADA** (o BORRADOR → al confirmar, ACEPTADA) |
| Pagos | Misma lógica de anticipos, abonos, saldo y estado de cuenta; **no cambian el estado** (el saldo se ve aparte) |
| EN PREPARACIÓN | Cada requerimiento se cumple con uno o varios productos de inventario; la cantidad se puede repartir. Guardar no mueve inventario ni cambia el precio cotizado |
| Finalizar preparación (TERMINADA) | Exige cada requerimiento cubierto exactamente; descuenta Bodega **una sola vez**; **se bloquea** si Bodega no alcanza |
| Entrega (ENTREGADA) | Requiere TERMINADA y saldo cero; no mueve inventario |
| Anulación | Devuelve exactamente lo descontado (si ya se finalizó), una sola vez |

Flujo: `BORRADOR? → ACEPTADA → EN_PREPARACION → TERMINADA → ENTREGADA` (o `CANCELADA`). Las transiciones se validan en la base de datos: no se puede finalizar desde ACEPTADA ni entregar sin finalizar.

## 3. Base de datos

- `school_quotations.fulfillment_mode`: `CONFIRMACION` (todas las listas existentes, sin cambios) o `PREPARACION` (toda lista nueva, valor por defecto).
- Estado nuevo `ACEPTADA` en el CHECK de estados.
- `product_name` (texto del requerimiento) pasa de 150 a 300 caracteres en plantillas, cotizaciones y despachos.
- Tabla nueva `school_quotation_item_assignments`: requerimiento (`item_id`), producto, cantidad, quién y cuándo creó/modificó.
  - Único por (requerimiento, producto): no hay asignaciones duplicadas.
  - Un trigger solo permite cambiarla mientras la lista está EN_PREPARACION.
  - La llave a la línea se verifica al confirmar la transacción: al editar la lista, las líneas se reinsertan y sus asignaciones las siguen.
- Funciones nuevas:
  - `save_school_quotation_preparation`: reemplaza las asignaciones. Valida permiso, estado, versión, que el producto exista y esté activo, cantidades enteras, que no se repita el producto y que no se asigne más de lo solicitado. Registra el antes/después en el historial.
  - `school_quotation_assert_prepared`: cada requerimiento cubierto exactamente.
  - `school_quotation_assert_requirements`: una lista nueva no acepta `productId` en sus líneas.
- Funciones existentes modificadas por parches verificados:
  - `create_school_quotation`
  - `update_school_quotation`
  - `change_school_quotation_status`
  - `school_quotation_refresh_status`
  - `school_quotation_insert_items`
  - `school_list_template_insert_items`
  - `school_quotation_sync_inventory`
  - `school_quotation_supply_status`
  - `dispatch_school_quotation`
  - vista `school_supply_commitments` (solo listas `CONFIRMACION`)
- `school_quotation_sync_inventory` sigue siendo el único que mueve inventario y su libro siguen siendo los movimientos de la lista (`reference_type 'SCHOOL_LIST'`). Para listas nuevas, el objetivo son las asignaciones, solo cuando la lista está TERMINADA o ENTREGADA. Repetir la operación no genera movimientos duplicados.
- `down` revierte todo y se niega si ya hay listas del flujo nuevo o descripciones de más de 150 caracteres.

## 4. API

- Nuevo: `PUT /school-lists/quotations/:id/preparation` con `{ version, assignments: [{ itemId, productId, quantity }] }` ("Guardar preparación"). Permiso `school_lists.quotations.edit`.
- "Finalizar preparación" es la acción existente `POST /school-lists/quotations/:id/status` con `TERMINAR`.
- El detalle trae `fulfillmentMode` y, en cada línea, `assignments` (producto, SKU, categoría, cantidad, precio de referencia, existencia en Bodega, quién y cuándo).
- El tablero cuenta ACEPTADA como pendiente.
- El selector usa endpoints existentes:
  - `GET /products?categoryId=&search=` (nombre, SKU o código de barras).
  - `GET /categories`.
  - `GET /school-lists/stock`.
- El PDF del cliente no cambió: muestra los requerimientos originales, nunca los productos asignados.

## 5. Frontend

| Archivo | Cambio |
|---|---|
| `school-templates` | Editor de requerimientos (sin buscador de inventario), total exacto al centavo, "Copiar requerimientos de" otra plantilla |
| `school-quotation-editor` | Modo requerimiento para listas nuevas: sin inventario ni "Cambiar producto"; el modo anterior se conserva al editar listas históricas |
| `school-quotation-preparation-page` (nuevo, ruta `…/cotizaciones/:id/preparacion`) | Resumen (requerimientos, asignados, pendientes, productos, avance %), una tarjeta por requerimiento con estado de color, seleccionar/cambiar/quitar producto, cantidad repartible, aviso de existencia insuficiente, Guardar / Descartar / Finalizar con confirmación |
| `school-preparation-rules.ts` (nuevo) | Reglas puras: asignar (fusiona el mismo producto), cambiar, quitar, estados, resumen, bloqueos para finalizar, carga útil |
| `school-product-swap-modal` | Modo `assign`: mismo catálogo por categoría y búsqueda, sin campo de precio (solo precio de referencia), aviso al repetir un producto |
| Detalle, listado, despacho | Estado ACEPTADA, "Iniciar preparación" / "Preparar pedido" / "Ver preparación", columna interna de productos asignados, entrega solo tras finalizar |

## 6. Pruebas

| Prueba | Resultado |
|---|---|
| `test/school-lists-requirements.e2e-spec.ts` (nueva, 3 casos sobre copia `_e2e`) | Pasa |
| e2e anteriores (`school-lists`, `school-supply`, `school-lists-catalog`, `quotations-sale`) con listas del flujo anterior | Pasan (5 suites, 14 pruebas en total) |
| Jest | 428/428 |
| Karma | 278/278 |
| Build de producción | OK |
| Migración `up` → `down` → `up` en una copia | OK; `down` deja las funciones idénticas (md5) |

La e2e nueva cubre las 16 pruebas pedidas:
- Plantilla con requerimientos que no existen en inventario.
- Precios manuales con decimales.
- Copiar una plantilla a otro grado.
- Cotización ACEPTADA sin movimientos de inventario.
- Pasar a EN_PREPARACION.
- Asignar un producto distinto al descrito.
- Repartir 5 unidades en 3 + 2.
- Rechazos: cantidad incompleta, excedida, producto repetido o inactivo.
- Inventario insuficiente bloquea la finalización sin mover nada.
- Cambiar el producto conserva el precio cotizado.
- Editar la lista conserva las asignaciones.
- El PDF conserva la descripción original.
- Finalizar descuenta exactamente lo asignado; repetir no duplica.
- Despachar no mueve inventario; anular devuelve una sola vez.
- Una lista del flujo anterior sigue descontando al confirmar.

## 7. Producción

1. Desplegar API y frontend y ejecutar `npm run migration:run:prod` (aplica `1760008400000` después de las pendientes `1760007800000`–`1760008300000`).
2. Las listas existentes no cambian: siguen descontando al confirmar y usando Abastecimiento FIFO.
3. Las plantillas con líneas vinculadas a productos siguen funcionando: al cotizar se copian como texto. Al editarlas y guardarlas se quita el vínculo.
4. Toda lista nueva debe finalizar la preparación antes de entregarse; si un requerimiento no tiene equivalente en inventario, no se puede finalizar (no hay preparación parcial autorizada).
