# Listas Escolares — plantillas, cotizaciones y estado de cuenta

Migración `1760007900000-SchoolLists`. El código está documentado en inglés en sus propios archivos; este documento resume el módulo para el equipo.

## 1. Análisis previo y decisiones

| Tema | Encontrado | Decisión |
|---|---|---|
| Cotizaciones existentes (`quotations`) | Cotizaciones comerciales con cliente registrado, solo productos del inventario, PDF con pdfkit. Sin plantillas, pagos ni estado de cuenta. `converted_to_sale_id` nunca se usa. | Módulo nuevo `school-lists`, sin tocar Cotizaciones. Se reutilizan el buscador de productos (`QuotationProductSearchComponent`), el membrete del PDF (`pdf-helpers`) y los datos de `company_settings`. |
| Ventas (`confirm_sale`, `adjust_sale_item`) | Usan siempre el precio público o mayorista; no aceptan precios personalizados. Descuentan inventario por ubicación. | **No se crea venta.** La entrega solo cambia el estado (decisión del dueño). Ventas e inventario no se tocan. |
| Caja de ventas | Saldo = ventas + aportes − retiros por negocio. Las ventas no tienen método de pago. | Los pagos viven **solo** en el estado de cuenta de la cotización (decisión del dueño): no mueven la Caja de ventas, Control de Efectivo ni los saldos bancarios. |
| Permisos | RBAC por rol (SUPER_ADMIN, ADMIN, SUPERVISOR_DE_TURNO, USER) con un mapa de permisos en el API y la misma comprobación en SQL. | Mismo esquema: permisos `school_lists.*` (ver §6). |
| Productos de las listas | — | Cada línea puede venir del inventario (toma nombre y precio) o ser texto libre (decisión del dueño). |
| Cancelación con dinero recibido | — | Se registra una **DEVOLUCIÓN** por todo lo pagado; los pagos originales se conservan (decisión del dueño). |

## 2. Arquitectura

```
Angular (features/dashboard/school-lists)
   │  HTTP /api/school-lists/*
   ▼
NestJS SchoolListsModule
   presentation  → SchoolListsController + DTOs (class-validator)
   application   → casos de uso (verifican el permiso del rol)
   domain        → puerto SchoolListRepository, política de permisos, errores, etiquetas
   infrastructure→ TypeOrmSchoolListRepository (SQL parametrizado), PDF (pdfkit)
   ▼
PostgreSQL: funciones plpgsql que bloquean la cotización (FOR UPDATE),
validan todo de nuevo, comprueban el rol, auditan y son idempotentes.
```

El backend es la autoridad: totales, saldos y estados se calculan en SQL. El frontend solo muestra vistas previas.

## 3. Base de datos (migración `1760007900000`)

### Tablas
| Tabla | Contenido | Reglas |
|---|---|---|
| `school_list_templates` | Plantilla (nombre único, grado, descripción, activa, orden, `version`) | No se borra (trigger) |
| `school_list_template_items` | Líneas de la plantilla (producto opcional, nombre, descripción, cantidad, precio, `subtotal` generado, observaciones) | Configuración: se reemplazan al editar |
| `school_quotations` | Cotización: número `LE-000001`, plantilla y grado copiados, cliente, teléfono, estudiante, fechas, observaciones, subtotal/descuento/total, estado, `version`, datos de entrega y de cancelación | `total = subtotal − descuento`, entrega ≥ fecha, `idempotency_key` UNIQUE, no se borra |
| `school_quotation_items` | **Copia propia** de cada línea: origen (PLANTILLA/INVENTARIO/MANUAL), producto opcional, cantidad, precio, descuento, `subtotal` generado, observaciones | descuento ≤ cantidad × precio |
| `school_quotation_payments` | Movimientos: ANTICIPO, ABONO, DEVOLUCIÓN, ANULACIÓN. Comprobante `RLE-000001`, método, banco opcional, referencia, `balance_after`, quién recibió | Inmutables (solo APLICADO → ANULADO), `idempotency_key` UNIQUE, una sola anulación por pago |
| `school_list_history` | Historial de plantillas y cotizaciones (acción, estado anterior/nuevo, detalle JSON con los valores anteriores) | Solo inserción |

### Funciones
| Función | Qué hace |
|---|---|
| `school_list_assert_permission` / `school_list_has_permission` | Mapa de permisos por rol (igual que el API) |
| `save_school_list_template`, `set_school_list_template_active`, `duplicate_school_list_template` | Plantillas (solo administradores), con control de versión |
| `create_school_quotation(payload, user, key)` | Crea la cotización, valida cliente y líneas, calcula totales, registra el anticipo en la misma transacción. Misma llave → misma cotización |
| `update_school_quotation(id, payload, user, version)` | Edita cliente, fechas, observaciones y líneas. El total no puede quedar por debajo de lo pagado; guarda en el historial la versión anterior |
| `set_school_quotation_observations` | Cambia solo las observaciones |
| `change_school_quotation_status(id, CONFIRMAR/PREPARAR/ENTREGAR, …)` | Flujo de estados; ENTREGAR exige saldo cero |
| `register_school_quotation_payment` | ANTICIPO (el primero) o ABONO; nunca mayor al saldo; idempotente |
| `void_school_quotation_payment` | Reversa auditada: crea ANULACIÓN y marca el pago como ANULADO |
| `cancel_school_quotation` | Cancela; si hay dinero recibido registra la DEVOLUCIÓN |
| `school_quotation_paid`, `school_quotation_refresh_status`, `school_quotation_insert_items` | Pagado neto, estado según pagos, validación y copia de líneas |

**Siembra**: las plantillas "Primero Básico", "Segundo Básico" y "Tercero Básico", **vacías**. Las listas reales se configuran desde la pantalla; no se cargaron productos de ejemplo.

**`down`**: elimina las funciones; las tablas solo se eliminan si nunca se registró una cotización.

## 4. Reglas de negocio

1. **Copia independiente**: la cotización guarda sus propias líneas, cantidades y precios. Editar o desactivar la plantilla, o cambiar el precio de un producto, no la altera.
2. **Precios**: una línea de plantilla o de inventario conserva su precio de referencia. Cambiarlo o aplicar un descuento requiere `school_lists.prices.override` (supervisor o administrador). Las líneas escritas a mano tienen precio libre.
3. **Saldo pendiente = total − (anticipos + abonos aplicados − devoluciones)**, siempre calculado en SQL.
4. **Pagos**:
   - Monto mayor que cero, con dos decimales como máximo.
   - Nunca mayor al saldo. No existe "saldo a favor".
   - Un borrador, una cotización entregada o una cancelada no reciben pagos.
   - El mismo `clientRequestId` no duplica el pago, aunque se envíe dos veces a la vez (probado con sesiones reales).
5. **Correcciones**: un pago no se edita ni se borra (trigger). Se anula con motivo (solo administradores): queda el original como ANULADO y una ANULACIÓN que resta.
6. **Estados**:

| Estado | Cuándo |
|---|---|
| BORRADOR | Se guardó como borrador. No recibe pagos hasta "Confirmar". |
| COTIZADA | Sin pagos. |
| ANTICIPO RECIBIDO | Solo tiene el primer pago (o solo quedan anticipos). |
| PAGO PARCIAL | Tiene abonos y saldo pendiente. |
| PAGADA | Saldo cero. |
| EN PREPARACIÓN | Manual. Sigue recibiendo abonos. |
| ENTREGADA | Manual. Exige saldo cero. Cierra la cotización. |
| CANCELADA | Con motivo. Devuelve lo pagado y cierra la cotización. |

   Los estados de pago se recalculan con cada pago, anulación o edición.
7. **Concurrencia**: toda escritura bloquea la fila de la cotización. Las ediciones llevan `version`; si otro usuario guardó antes, se rechaza con 409 y un mensaje claro.
8. **Sin efecto en inventario, ventas ni cajas**. La prueba e2e lo comprueba con una huella de `products.stock`, `sales` y `sales_cash_box_movements`.

## 5. Endpoints (`/api/school-lists`, todos con JWT)

| Método y ruta | Permiso |
|---|---|
| `GET permissions` | — (permisos del rol que llama) |
| `GET templates?includeInactive=true` | view (las inactivas solo para administradores) |
| `GET templates/:id` | view |
| `POST templates` · `PUT templates/:id` (con `version`) | templates.manage |
| `PATCH templates/:id/status` · `POST templates/:id/duplicate` | templates.manage |
| `GET quotations` (search, phone, number, grade, status, dateFrom, dateTo, page, limit) | view |
| `GET quotations/dashboard?dateFrom&dateTo` | view |
| `POST quotations` (con `clientRequestId` y anticipo opcional) | quotations.create (+ payments.register si trae anticipo) |
| `GET quotations/:id` (detalle, líneas, pagos con saldo corrido, historial, resumen) | view + statements.view |
| `PUT quotations/:id` (con `version`) · `PATCH quotations/:id/observations` | quotations.edit |
| `POST quotations/:id/status` (CONFIRMAR/PREPARAR/ENTREGAR) | quotations.edit |
| `POST quotations/:id/cancel` | quotations.cancel |
| `POST quotations/:id/payments` | payments.register |
| `POST payments/:paymentId/void` | payments.void |
| `GET quotations/:id/pdf` · `GET payments/:paymentId/receipt` | documents.generate |

## 6. Permisos por rol

| Permiso | USER | SUPERVISOR_DE_TURNO | ADMIN / SUPER_ADMIN |
|---|:-:|:-:|:-:|
| Consultar listas, cotizaciones y tablero (`view`) | ✓ | ✓ | ✓ |
| Administrar plantillas (`templates.manage`) | | | ✓ |
| Crear cotizaciones (`quotations.create`) | ✓ | ✓ | ✓ |
| Modificar, preparar y entregar (`quotations.edit`) | ✓ | ✓ | ✓ |
| Cambiar precios y descuentos (`prices.override`) | | ✓ | ✓ |
| Registrar pagos (`payments.register`) | ✓ | ✓ | ✓ |
| Anular pagos (`payments.void`) | | | ✓ |
| Estado de cuenta (`statements.view`) | ✓ | ✓ | ✓ |
| Cancelar cotizaciones (`quotations.cancel`) | | ✓ | ✓ |
| Generar documentos (`documents.generate`) | ✓ | ✓ | ✓ |

Esta tabla es una propuesta razonable; se ajusta editando `SCHOOL_LIST_PERMISSION_ROLES` (API) y `school_list_assert_permission` (SQL).

## 7. Backend: archivos, clases y métodos

`comercial-jhoel-api/src/modules/school-lists/`
- `domain/policies/school-list.policy.ts`: `SCHOOL_LIST_PERMISSION_ROLES`, `hasSchoolListPermission`, `assertSchoolListPermission`, `schoolListPermissionsFor`.
- `domain/errors/school-list.errors.ts`: `SchoolListRuleError`, `schoolListError` y `schoolListErrorFromMessage`, que traducen los códigos `SCHOOL_*` de SQL a mensajes en español con detalle (saldo, producto, estado).
- `domain/repositories/school-list.repository.ts`: puerto `SchoolListRepository` y sus tipos.
- `domain/school-list.labels.ts`: etiquetas de estados, métodos y tipos de pago para los PDF.
- `infrastructure/persistence/typeorm-school-list.repository.ts`: `TypeOrmSchoolListRepository`.
  - Lecturas: plantillas, listado filtrado y paginado, detalle con saldo corrido y tablero.
  - Escrituras: solo llamando a las funciones SQL.
- `infrastructure/pdf/school-list-pdf.builder.ts`: `buildSchoolQuotationPdf` (A4) y `buildSchoolReceiptPdf` (A5, con marca de anulado).
- `application/use-cases/school-list.use-cases.ts`: 18 casos de uso.
  - Permisos: `GetSchoolListPermissions`.
  - Plantillas: `ListSchoolTemplates`, `GetSchoolTemplate`, `SaveSchoolTemplate`, `SetSchoolTemplateActive`, `DuplicateSchoolTemplate`.
  - Cotizaciones: `ListSchoolQuotations`, `GetSchoolQuotation`, `CreateSchoolQuotation`, `UpdateSchoolQuotation`, `UpdateSchoolQuotationObservations`, `ChangeSchoolQuotationStatus`, `CancelSchoolQuotation`.
  - Pagos: `RegisterSchoolPayment`, `VoidSchoolPayment`.
  - Tablero y documentos: `GetSchoolListDashboard`, `GetSchoolQuotationPdf`, `GetSchoolReceiptPdf`.
- `presentation/dtos/school-list.request.dto.ts`, `presentation/controllers/school-lists.controller.ts`, `school-lists.module.ts`.

**Modificado**: `src/app.module.ts`, solo para registrar `SchoolListsModule`.

## 8. Frontend: componentes

`comercial-jhoel-app/src/app/`
- `core/models/school-list.model.ts`: tipos, etiquetas, colores por estado y ayudantes.
  - Etiquetas y colores: verde = pagada, amarillo = parcial, rojo = pendiente.
  - Ayudantes: `isSchoolQuotationEditable`, `canReceiveSchoolPayment`, `roundMoney`, fechas.
- `core/services/school-list.service.ts`: `SchoolListService`, el cliente del API. Carga los permisos y los expone con `can()`.
- `core/utils/print-blob.ts`: imprime un PDF con el diálogo del navegador.
- `features/dashboard/school-lists/`
  - `school-lists-page`: encabezado y pestañas Tablero / Cotizaciones / Nueva cotización / Plantillas (`?tab=`).
  - `components/school-dashboard`: 6 tarjetas, dona "Cotizaciones por grado" y línea "Ingresos recibidos por período" (por día hasta dos meses, por mes en rangos más largos). Usa los componentes compartidos `app-summary-tile`, `app-donut-chart` y `app-line-chart`.
  - `components/school-quotations-list`:
    - Filtros por cliente, teléfono, número, grado, estado y fechas, con tabla paginada.
    - Acciones por fila: ver, editar, registrar abono, estado de cuenta, PDF, imprimir, registrar entrega e historial. Cada una aparece solo si el rol tiene el permiso.
  - `components/school-quotation-editor`: el editor de "Nueva" y "Editar".
    - 1) Cliente; 2) tarjetas de grado y tabla dinámica (cambiar producto, agregar del inventario o a mano, eliminar, cantidades, precios, descuentos, observaciones por línea); 3) anticipo u opción de borrador y observaciones generales.
    - Panel lateral con productos, total, anticipo y saldo en tiempo real.
    - Pide confirmación antes de guardar y envía un `clientRequestId` que se repite en los reintentos.
  - `components/school-templates`: tarjetas de plantillas y consulta de su contenido. Para administradores también el editor (agregar, eliminar, reordenar, cantidades y precios), duplicar y activar/desactivar.
  - `components/school-payment-modal`: registrar abono con vista previa "saldo actual → saldo después", bloqueo si supera el saldo y confirmación.
  - `components/school-reason-modal`: motivo obligatorio para anular un pago o cancelar, con el método de devolución.
  - `school-quotation-detail-page` (`/dashboard/listas-escolares/cotizaciones/:id`):
    - Encabezado con estado y acciones, y las 5 tarjetas financieras.
    - Pestañas Detalle (cliente, observaciones editables, productos), Estado de cuenta (movimientos con ingreso, egreso y saldo corrido; comprobante y anulación por pago) e Historial (línea de tiempo).
    - Después de registrar un abono ofrece el comprobante en PDF.
  - `school-quotation-edit-page` (`…/:id/editar`).
  - `school-documents.service.ts`: descargar o imprimir la cotización y los comprobantes.
  - `_school-lists.scss`: estilos compartidos.
- **Modificados**:
  - `app.routes.ts`: 3 rutas.
  - `core/data/dashboard-nav.data.ts`: "Ventas y Compras → Listas Escolares".
  - `core/models/index.ts`: exporta el modelo.
  - `shared/ui/icon/icon-registry.ts`: ícono `printer`.

## 9. PDF

- **Cotización (A4)**:
  - Logo y datos del negocio, número, estado, cliente, teléfono, estudiante, grado y fechas.
  - Tabla con cantidad, producto (descripción y observación), precio unitario, descuento y subtotal.
  - Recuadro con subtotal, descuentos, total, anticipo recibido, total pagado y saldo pendiente.
  - Observaciones y pie comercial (WhatsApp, horario y sitio de `company_settings`).
- **Comprobante (A5)** por anticipo, abono, devolución o anulación:
  - Monto destacado, cotización, cliente, método, banco, referencia, quién recibió y saldo después del movimiento.
  - Marca "ANULADO" si el pago fue anulado.

## 10. Pruebas y resultados

| Prueba | Resultado |
|---|---|
| `sql/tests/school-lists.test.sql` (nueva) | **62/62** |
| `sql/tests/school-lists-concurrency.sh` (nueva) | **OK**: dos abonos de Q60 a la vez sobre Q100 → entra uno; un abono enviado dos veces → un registro; lo pagado nunca supera el total |
| Jest `school-list.use-cases.spec.ts` y `school-list.errors.spec.ts` (nuevas) | **16/16** |
| `test/school-lists.e2e-spec.ts` (nueva, sobre copia temporal de la base) | **2/2**. Cubre plantillas (versión, duplicar, desactivar), cotización personalizada con anticipo, doble clic, plantilla intacta, abonos, saldo corrido, anulación, entrega, PDF, filtros, tablero, borrador, edición con versión, cancelación con devolución, RBAC e inventario, ventas y caja intactos |
| Karma `school-lists.spec.ts` (nueva) | **13/13**. Encontró y corrigió un error real: `computed()` sobre `@Input()` simples no se recalculaba |
| Regresión API | Build sin errores; Jest **415/415**; las 15 suites SQL sin errores; los 9 e2e pasan; las 4 pruebas de concurrencia OK |
| Regresión frontend | Karma **253/253**; build de producción OK. Los estilos nuevos pasan el aviso de 6 kB pero quedan bajo el límite de 12 kB |
| Revisión visual (navegador sin interfaz, sin escribir en la base de dev) | Tablero, plantillas, editor (Q50 − anticipo Q20 = saldo Q30 en vivo), listado, detalle con estado de cuenta y anulación, y el modal de abono rechazando un monto mayor al saldo |
| Migración | Se revierte y se vuelve a aplicar con las tres plantillas |

## 11. Despliegue

1. Commit y push.
2. `npm run migration:run:prod` en Railway.
3. Un administrador configura los productos de las tres plantillas en "Listas Escolares → Plantillas de Listas Escolares".
