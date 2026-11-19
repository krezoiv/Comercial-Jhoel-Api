# Listas Escolares — ventana POS de "Nueva cotización"

Cambio solo de interfaz (frontend). No hay migraciones ni endpoints nuevos, y no cambian la lógica de negocio, los cálculos ni los estados. La cotización se sigue guardando con `POST`/`PUT /school-lists/quotations`, y crearla nunca descuenta inventario.

## Qué ve el usuario

Al presionar **Nueva cotización** se abre una ventana de venta de pantalla completa. La aplicación de fondo queda visible, oscurecida y desenfocada, y no se puede usar mientras la ventana está abierta. **Editar cotización** abre la misma ventana con los datos de la lista y, al cerrar o guardar, vuelve al detalle.

| Zona | Contenido |
|---|---|
| Encabezado (fijo) | Ícono, título, número (o "Número al guardar"), estado con el que se guardará, indicador "Sin cambios / Cambios sin guardar / Guardando… / Guardada" y botón cerrar |
| Cliente y alumno | Cliente o encargado (con búsqueda de clientes anteriores), teléfono, alumno, grado, fecha de cotización, fecha de entrega y observaciones |
| Plantilla escolar | Tarjetas por grado (con buscador si hay más de 6). La plantilla solo se lee |
| Requerimientos | Barra para agregar (descripción, cantidad, precio, total y Enter). Debajo, la lista con número, cantidad (−/+), precio, descuento (si el rol puede), total y acciones: duplicar, observación y eliminar |
| Panel lateral | Resumen (requerimientos, artículos, subtotal, descuento, **total** en azul), pagos (pago inicial con monto, 50 % / Total, método, cuenta y referencia), **abonado** en verde, **saldo pendiente** en naranja y "Guardar como borrador" |
| Barra inferior (fija) | Conteo, total y saldo; Cancelar, Vista previa, Guardar y generar PDF, **Guardar cotización** |

## Comportamiento

- **Cerrar sin perder datos.** Hacer clic fuera nunca la cierra. Con cambios sin guardar, ✕, Cancelar o Esc preguntan: *Seguir editando*, *Descartar cambios* o *Guardar y salir*. Cerrar la pestaña del navegador también pide confirmación.
- **Teclado.** El foco empieza en "Cliente o encargado" y Tab no sale de la ventana. Esc cierra primero la vista previa. Al cerrar, el foco vuelve al botón que la abrió.
- **Guardar** usa la validación y el resumen de confirmación de siempre. El botón muestra "Guardando…" y no admite doble clic (además, `clientRequestId` es idempotente). "Guardar y generar PDF" descarga el PDF oficial que genera el backend con los datos guardados.
- **Totales.** El panel y la barra son una vista previa en vivo; el backend recalcula y valida al guardar.
- **Pagos.** Igual que antes: un solo pago inicial al crear. Los abonos posteriores se registran desde el estado de cuenta.
- **Vista previa.** Muestra el documento tal como lo verá el cliente (solo requerimientos), sin guardar nada.
- **Responsive.**
  - Escritorio: dos columnas con scroll independiente.
  - Menos de 1024 px: una columna; la barra inferior mantiene el total visible.
  - Teléfono: borde a borde y botones compactos.
  - Nunca hay scroll horizontal.
- Respeta `prefers-reduced-motion` y el modo oscuro.

## Campos

Solo los que ya existen en el backend (decisión del dueño): cliente o encargado, teléfono, alumno, grado (de la plantilla), fechas y observaciones. El establecimiento educativo y la sección no se agregaron.

## Archivos

- `components/school-quotation-workspace/`: la ventana (portal a `<body>`, capa `--z-workspace`, cierre seguro y barra de acciones).
- `components/school-quotation-editor/`: datos, líneas y guardado (el único que llama al API para guardar).
- `components/school-requirement-entry/`, `school-quotation-summary-panel/`, `school-customer-field/` y `school-quotation-preview/`.
- `shared/directives/focus-trap.directive.ts` (reutilizable).
- `styles/_tokens.scss`: `--z-workspace` (310) y `--z-dialog` (350). El diálogo global de confirmación ahora siempre queda encima de cualquier modal.
