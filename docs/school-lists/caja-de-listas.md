# Caja de Listas Escolares

Caja independiente para el dinero de las listas escolares. No se mezcla con Control de Efectivo, Bodega, la Caja Guayacán ni el Cuadre de Agentes. Está en **Ventas y Compras → Caja de Listas** (`/dashboard/caja-listas`), con la migración `1760008700000-SchoolListCashBox`.

## Cómo fluye el dinero

| Pago del cliente | Qué pasa automáticamente |
|---|---|
| Efectivo (anticipo, abono o liquidación) | Entra a la Caja de Listas. |
| Transferencia o depósito | Sube el saldo de la cuenta elegida (obligatoria) y queda **pendiente de trasladar**. La caja no cambia. |
| Tarjeta u otro medio | Cuenta como recaudado, fuera de la caja y sin mover bancos. |
| Traslado banco → caja | La cuenta baja, la caja sube y el pendiente baja. No es un pago nuevo: lo recaudado no cambia. |

Cada pago genera un solo movimiento, ligado a la lista, al cliente y al recibo. Nada se registra dos veces.

## Reglas

- **Un solo libro (Kardex).** El efectivo de la caja es siempre el saldo del último movimiento; no hay otro saldo guardado. Ningún movimiento se edita ni se borra: una corrección es una reversión auditada.
- **Saldo nunca negativo.** No se puede sacar más efectivo del que hay, ni para una salida, ni para devolver en efectivo, ni para anular un pago en efectivo.
- **Traslados.**
  - Pueden ser parciales.
  - Un pago nunca se traslada por más de su pendiente, y nunca se traslada más de lo que tiene la cuenta.
  - Cada traslado sale de una sola cuenta.
- **Anulaciones.**
  - Un pago ya trasladado no se anula hasta anular primero su traslado.
  - Al anular un traslado, el dinero vuelve al banco y los pagos quedan otra vez pendientes.
- **Devoluciones al cancelar una lista.**
  - En efectivo, el dinero sale de la caja.
  - Por banco, sale de la cuenta elegida, usando primero lo que esa lista tenía pendiente en esa cuenta.
- **Salidas** (solo administradores).
  - Requieren motivo y destino: entrega a administración, depósito bancario, gasto autorizado u otro.
  - El depósito bancario sube el saldo de la cuenta.
  - Ninguna salida se registra como gasto de la empresa automáticamente.
- **Ajustes** (solo administradores): entrada o salida con motivo. El saldo inicial de la caja se carga así, después de contar el efectivo.
- **Arqueos.** Se cuentan las denominaciones de Q200 a Q0.01. Diferencia = contado − teórico. El arqueo nunca ajusta el saldo; la diferencia queda visible.
- **Borrado de listas.** Una lista con dinero en la caja ya no se puede borrar, ni sola ni con "Borrar todas"; se cancela con su devolución.
- **Pagos anteriores a la caja.** No se tocan: siguen sumando en "Total recaudado", pero no entran a la caja ni quedan pendientes.

## Cuadre de Agentes

El dinero de listas que todavía está en bancos aparece como **"Listas escolares por trasladar"** y se resta del resultado del cuadre. Así un pago de lista nunca descuadra a los agentes, ni al recibirse ni al trasladarse. El monto se guarda aparte en cada cierre, sin cambiar el "Total Bancos".

## Permisos

| Acción | Roles |
|---|---|
| Ver la caja, movimientos y reportes; hacer arqueos | Super administrador, administrador, supervisor de turno |
| Trasladar, registrar salidas y ajustes, anular | Super administrador, administrador |
| Registrar pagos de listas | Igual que antes (incluye cajeros) |

## Indicadores

Desde la migración `1760009000000` una cotización no es venta, deuda ni dinero. Ver "Solo listas aceptadas" al final.

| Indicador | Qué muestra |
|---|---|
| Total de listas aceptadas | Lo vendido: listas que el cliente aceptó (no es dinero recibido) |
| Total recaudado | Pagos reales de clientes, menos devoluciones (anticipos y abonos) |
| Total pendiente de pago | Lo que deben las listas aceptadas y no entregadas |
| Cotizaciones pendientes de decisión | Cotizaciones sin aceptar y su total; no suman a la caja ni a la deuda |
| Listas pagadas / con abonos | Listas aceptadas pagadas por completo / con pagos y saldo |
| Efectivo en Caja de Listas | Saldo teórico según el Kardex |
| En bancos por trasladar | Pagos bancarios que todavía están en el banco |
| Trasladado de bancos | Suma de los traslados banco → caja |

## Reportes

Se exportan a PDF y a Excel:

- Recaudación diaria, por cliente y por lista escolar
- Pagos en efectivo y pagos bancarios
- Traslados
- Dinero pendiente de trasladar
- Arqueos y diferencias
- Salidas de efectivo
- Saldos pendientes de clientes
- Kardex de la caja
- Cotizado, aceptado y cobrado por lista (etapa y estado de pago de cada lista)

## Al publicar en producción

1. Desplegar y correr `npm run migration:run:prod`.
2. Contar el efectivo de listas que haya y cargarlo con un **ajuste de entrada** ("Salidas y ajustes → Nuevo ajuste").
3. Desde ese momento, todo pago por transferencia o depósito exige elegir la cuenta que recibió el dinero.

## Estado de cuenta de clientes (ampliación)

- **Quién es un cliente.** Todas las listas con el mismo número de teléfono, aunque el nombre esté escrito distinto. El nombre que se muestra es el de la lista más reciente; los otros aparecen como "También registrado como".
- **Pestaña Clientes.** Muestra lo comprado, lo abonado, el saldo, el estado y el último pago de cada cliente.
  - Estados: **Solvente** (no debe), **Abonando** (pagó algo y todavía debe), **Pendiente** (debe y no ha pagado nada) y **Cancelado** (solo tiene listas canceladas). No hay estado "Atrasado" porque el sistema no maneja vencimientos ni mora.
  - Se busca por cliente, alumno, teléfono o número de lista. Se filtra por saldo, abonos, estado, grado y fechas, y se ordena por saldo, abonado, compra, último pago o nombre.
- **Expediente del cliente.**
  - Datos del cliente con sus alumnos y grados, y tarjetas de comprado, abonado, saldo y % pagado.
  - Cada lista por alumno, con "Ver lista" y "Abonar".
  - Historial de pagos con el destino del dinero (caja, banco y su estado de traslado, u otros medios).
  - Estado de cuenta cronológico (cargo, abono y saldo) armado solo con registros reales; si no cuadra con el saldo oficial, lo avisa.
- **Registrar abono.** Usa el mismo formulario y las mismas reglas de siempre. Si el cliente tiene varias listas con saldo, primero se elige a cuál se aplica; nunca se reparte solo. El efectivo entra a la caja y la transferencia o el depósito al banco elegido, pendiente de traslado. La fecha es la del registro: no se registran pagos con fecha anterior.
- **Ver / imprimir estado de cuenta.** PDF con el logo y los datos del negocio, el cliente, sus listas, sus pagos y el estado de cuenta cronológico, listo para entregar.
- **Acceso.** Los cajeros ven Clientes, el expediente y el PDF, y pueden registrar abonos. El resto de la caja es solo para supervisores y administradores.
- **Dashboard.**
  - Tarjetas: total vendido, abonado, pendiente de cobro, efectivo en caja, bancos por trasladar, clientes con saldo y solventes, trasladado, total de listas y abonos.
  - Gráficos: ventas vs. recaudación, recaudación por método, evolución por día, semana o mes, y estado de cartera.
  - El período (toda la temporada, este mes, últimos 30 días o personalizado) aplica a ventas, recaudación y traslados. Los saldos son siempre a hoy.

## Solo listas aceptadas y pagos reales (migración `1760009000000`)

- **Cotización.** Una lista nueva sin anticipo se guarda como **Cotizada**. No cuenta como venta, deuda ni dinero, y no recibe pagos: el sistema responde "Esta lista todavía es una cotización. Debe ser aceptada por el cliente antes de registrar pagos.".
- **Aceptar lista.** Cuando el cliente acepta, el botón **Aceptar lista** (en el detalle o en la fila del listado) la pasa a **Aceptada**.
  - Desde ese momento su total cuenta como venta y como pendiente de pago.
  - Aceptarla no registra ningún pago ni mueve la caja.
- **Con anticipo.** Si se guarda con anticipo, la lista queda aceptada de una vez (decisión del dueño). El anticipo entra a la caja o al banco como cualquier pago.
- **Pagos.** Cada anticipo o abono sube lo recaudado y baja lo pendiente. Al pagar todo, lo pendiente llega a Q0. Un mismo pago reintentado no se cuenta dos veces.
- **Listas anteriores.** Antes de este cambio las listas nuevas quedaban aceptadas al guardarse, aunque fueran solo cotizaciones. No se corrigió nada automáticamente.
  - El aviso de la Caja de Listas y el filtro **Aceptadas sin pagos** del listado muestran las aceptadas que no tienen pagos ni preparación.
  - Se revisan una por una. Si el cliente nunca aceptó, un supervisor o administrador usa **Devolver a cotización**, con motivo obligatorio.
  - Devolver a cotización queda en el historial, no toca pagos, caja ni inventario, y no se permite si la lista ya tiene pagos o preparación.
- **Clientes.** Lo comprado y el saldo solo cuentan listas aceptadas. Las cotizaciones se muestran aparte ("+ Q… cotizado"). Un cliente que solo tiene cotizaciones aparece como **Solo cotizaciones**, no como deudor.
- **Al publicar en producción.**
  1. Correr `npm run migration:run:prod`.
  2. Abrir Caja de Listas y, si aparece el aviso de listas aceptadas sin pagos, revisarlas con el filtro **Aceptadas sin pagos**.

