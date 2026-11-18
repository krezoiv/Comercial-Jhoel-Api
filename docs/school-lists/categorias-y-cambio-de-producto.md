# Cotizaciones de Listas Escolares — categorías, "Cambiar producto" y rediseño

Sin migración: la relación `products.category_id → categories` ya existía y se reutiliza. Endpoints de productos y categorías existentes, sin duplicados. El código nuevo está documentado en inglés.

## 1. Diagnóstico

| Tema | Antes | Ahora |
|---|---|---|
| Categoría de cada línea | No se mostraba | Se lee de la relación real del producto (LEFT JOIN, sin texto escrito a mano) en plantillas, editor y detalle |
| "Cambiar producto" | Buscador sobre todo el inventario, dentro de la fila | Modal que abre en la categoría del producto actual, con búsqueda por nombre o SKU, cambio de categoría y paginación del servidor |
| Duplicados al cambiar | Podía quedar el mismo producto en dos líneas | Se avisa y se consolidan las cantidades en la línea existente |
| Listado | Sin orden por columna ni resumen | Tarjetas con cifras del backend, orden por columna en el servidor, estados con color, tarjetas en móvil |

## 2. Backend (`modules/school-lists`)

- **Líneas** (`getTemplate`, `getQuotation`): agregan `productSku`, `categoryId` y `categoryName`, todos null en líneas escritas a mano.
- **Listado** (`GET /school-lists/quotations`):
  - `sortBy`: `number`, `customer`, `grade`, `date`, `total`, `balance` o `status`.
  - `sortDirection`: `asc` o `desc`.
  - El DTO solo acepta esa lista (cualquier otro valor da 400) y cada campo se traduce a una expresión SQL fija.
  - `search` ahora también busca por número de cotización.
  - Cada fila trae `advance`: los anticipos aplicados.
- **Tablero** (`GET …/quotations/dashboard`): agrega `awaitingQuotations`, las cotizaciones en BORRADOR o COTIZADA.
- **Catálogo del modal**: reutiliza `GET /products?categoryId=&search=&page=&limit=` (solo activos, búsqueda por nombre o SKU) y `GET /categories` (activas). Las existencias vienen de `GET /school-lists/stock` (Bodega).
- **Guardar** sigue pasando por `update_school_quotation` con las mismas validaciones y permisos. Por ejemplo, un cajero no puede cambiar el precio de una línea de inventario.

## 3. Inventario (sin cambios de reglas)

- Cambiar un producto en el editor no llama a la API ni mueve inventario. Solo al **guardar** se aplica la regla vigente de Listas Escolares.
- Un **borrador** no mueve nada.
- En una lista **confirmada**, `school_quotation_sync_inventory` ajusta por diferencia: el producto anterior regresa a Bodega y el nuevo se descuenta una sola vez.
- Volver a guardar las mismas líneas no genera movimientos.
- Las cotizaciones del módulo **Cotizaciones** (no listas) siguen sin mover inventario hasta "Confirmar venta".

## 4. Frontend

| Archivo | Qué hace |
|---|---|
| `school-lists/school-line-rules.ts` (nuevo) | Reglas puras de las líneas: `EditorLine`, `lineSubtotal`, `lineError`, `findDuplicateLine`, `swapLineProduct`, `consolidateLines` |
| `components/school-product-swap-modal/*` (nuevo) | Modal "Cambiar producto" (detalle abajo); no se cierra al hacer clic fuera |
| `school-quotation-editor` | Categoría y SKU por línea; acciones con íconos (cambiar, observación, eliminar); abre el modal; `@Input swapItemId` |
| `school-quotation-edit-page` | `?cambiar=<itemId>` abre el modal en esa línea (enlace desde el detalle) |
| `school-quotation-detail-page` | Columnas SKU y Categoría; acciones por línea (Cambiar producto, Modificar); estado con color |
| `school-quotations-list` | Tarjetas de resumen, filtros con íconos, orden por columna, columna Anticipo, estados con color, tarjetas en móvil |
| `school-lists-page` | Encabezado con ícono, título, descripción, "Nueva cotización", "Abastecimiento" y "Plantillas" |
| `_school-ui.scss` (nuevo) | Mixins `cat-badge`, `status-pills` y `kpis`: cada componente incluye solo lo que usa (límite de 12 kB) |
| `core/models/school-list.model.ts`, `core/services/school-list.service.ts` | Tipos y `catalogProducts()` |
| `shared/ui/icon/icon-registry.ts` | Íconos `graduation-cap`, `calendar` y `message-square` |

**Modal "Cambiar producto"**:
- Producto actual con su categoría, cantidad, precio y SKU.
- Selector de categoría, ya posicionado en la categoría del producto actual.
- Buscador con espera de 250 ms.
- Tarjetas de resultados con nombre, SKU, categoría, precio y existencia en Bodega.
- Resumen "anterior → nuevo", cantidad y precio editables según el rol.

**Colores de estado** (sin estados nuevos):

| Estado | Color |
|---|---|
| Borrador | gris |
| Cotizada | azul |
| Anticipo recibido | morado |
| Pago parcial | naranja |
| Pagada | verde |
| En preparación | celeste |
| Terminada | índigo |
| Entregada | verde oscuro |
| Cancelada | rojo |

## 5. Pruebas

| Prueba | Resultado |
|---|---|
| `test/school-lists-catalog.e2e-spec.ts` (nueva, 5 casos sobre copia `_e2e`) | Pasa. Cubre: categoría y SKU reales, borrador sin movimientos, diferencia exacta en lista confirmada, catálogo por categoría y búsqueda por nombre o SKU, orden por columna, rechazo de columnas no permitidas, búsqueda por número, `awaitingQuotations` contra la BD, permisos |
| e2e relacionados (`school-lists`, `school-supply`, `quotations-sale` y la nueva) | 4 suites, 11 pruebas en verde |
| Jest | 427/427 |
| Karma | 272/272 (10 nuevas): reglas de línea, modal (categoría inicial, cambio de categoría, búsqueda con espera, cantidad conservada, precio del cajero, consolidación, validación), editor, tarjetas y orden del listado |
| Build de producción | OK; estilos: editor 11.89 kB, listado 11.69 kB, detalle 10.56 kB, modal 8.97 kB |
| Prueba en vivo (copia de la base, ya eliminada) | Ver detalle abajo |

**Prueba en vivo**:
- Recorrido completo del modal con los productos reales de "MARCADORES - RESALTADORES".
- Búsqueda "verde" y búsqueda por SKU.
- Cambio a "Papelería Escolar".
- Aviso de duplicado.
- Borrador guardado con 0 movimientos y Bodega sin cambio.
- Detalle con categorías y apertura del modal desde el detalle.
- Tarjetas iguales a la BD.
- Sin desplazamiento horizontal a 1440, 820 y 390 px.

## 6. Pendiente o posible mejora

- La plantilla oficial (pestaña Plantillas) no tiene todavía el modal por categoría; sigue con su buscador.
- Las tarjetas usan el periodo de los filtros de fecha; sin fechas muestran el año en curso (regla del tablero existente).
