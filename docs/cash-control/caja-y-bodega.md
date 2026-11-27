# Caja y Bodega: dos ubicaciones del efectivo

Desde la migración `1760008800000-CuadreWarehouseCountAndCutCustody`, Control de Efectivo trata la **Caja** y la **Bodega** como dos lugares distintos, cada uno con su propio saldo. La suma de los dos es el **total bajo resguardo**.

| Ubicación | Qué es | De dónde sale su saldo |
|---|---|---|
| Caja | El efectivo de atención y operación diaria | Kardex de caja |
| Bodega | El efectivo trasladado y guardado aparte | Kardex de Bodega |
| Total bajo resguardo | Caja + Bodega | La suma; no es un saldo aparte |

## Arqueo de Caja (Control de Efectivo)

- **Qué se cuenta.** Solo el efectivo que está físicamente en Caja, por denominación de Q200 a Q0.01.
- **Bodega.** Ya no se pide contarla. Se muestra con su **saldo registrado** y el total bajo resguardo, solo como dato.
- **Diferencia.** Es contado en Caja menos el teórico de Caja. Bodega nunca entra en esa diferencia: un faltante de Caja sigue visible aunque Bodega tenga dinero.
- **Arqueos anteriores.** Los que traían un total de Bodega escrito a mano se siguen viendo igual, marcados como "registro anterior".

## Cortes del día

- **Qué muestra cada corte.**
  - Efectivo contado en Caja.
  - Saldo de Bodega a la hora de finalizar, tomado del sistema; Bodega no se cuenta.
  - Total bajo resguardo.
- **Diferencia del corte.** Sigue siendo solo de Caja.
- **Segundo corte.** Al finalizarlo se muestra el primer corte como referencia. El primero no se modifica y el segundo refleja los movimientos posteriores.
- **Reabrir.** Al reabrir un corte se borra su foto de Bodega; al finalizarlo otra vez se toma de nuevo.
- **Cortes anteriores.** Los que se finalizaron antes de este cambio dicen "No registrado" en Bodega.

## Cuadre de Agentes → Arqueo de Caja

- **Obligatorio.** Antes de guardar el cuadre se abre **Arqueo de Caja** y se cuentan a mano dos desgloses independientes: Caja y Bodega. Ninguno copia al otro.
- **Lo que muestra.** Teórico, físico y diferencia de cada ubicación, y la diferencia consolidada.
  - Ejemplo: Caja −Q100 y Bodega +Q100 dan un consolidado de Q0.
  - Aun así el sistema avisa que Caja tiene un faltante y Bodega un sobrante: las dos diferencias quedan registradas.
- **Resultado del cuadre.** Usa lo **contado** en Caja y en Bodega, así un faltante en Bodega también se ve en el resultado (decisión del dueño).
- **Qué se guarda con el cuadre.**
  - Cada denominación de Caja y de Bodega.
  - Los teóricos, los contados, las tres diferencias y las observaciones.
  - El usuario, la fecha y hora, y el día operativo.
- **Dónde se consulta.** En **Gestión de Días Cerrados → Ver detalle**.
- **Nada se ajusta.** Un faltante o sobrante se corrige con el ajuste autorizado de siempre, con motivo y auditoría.

## Traslados

### Caja → Bodega no necesita arqueo

- **Qué limita el traslado.** Solo el efectivo disponible en Caja según el sistema (el Kardex), sin importar si hay arqueo o cuándo se hizo.
  - Ejemplo: con Q5,000 se pueden trasladar Q3,000 y Caja queda en Q2,000.
  - Ejemplo: Q5,500 se rechaza con "No puedes trasladar más efectivo del disponible en Caja. Efectivo disponible: Q5,000.00.".
- **Monto.** Se ingresan los billetes y monedas que se envían, y el monto es el total de ese desglose; no se escribe aparte.
- **Confirmación.** Antes de confirmar se ve un resumen: disponible, total trasladado, lo que queda en Caja y lo que entra a Bodega.
- **Historial.** Guarda el desglose (inmutable), quién entrega y quién recibe, las observaciones, el día operativo y los saldos de Caja y Bodega antes y después.
- **Dos usuarios a la vez.** Nunca pueden pasar juntos del saldo disponible: el segundo traslado se rechaza.
- **El arqueo** sigue igual: solo dice si Caja está cuadrada, con faltante o con sobrante.

### Efectos en los saldos

- **Caja → Bodega.** Baja Caja y sube Bodega.
- **Bodega → Caja.** Baja Bodega y sube Caja.
- **Efecto en los totales.** Ninguno de los dos cambia el total bajo resguardo, ni se registra como ingreso o gasto.
- **Kardex.** Cada traslado deja un solo renglón en el Kardex de caja y uno en el de Bodega.

## Al publicar en producción

1. Desplegar y correr `npm run migration:run:prod`.
2. Desde ese momento el Cuadre de Agentes pide el Arqueo de Caja (Caja + Bodega) antes de guardar.

## Estado de Cuenta de Efectivo

Está en **Control de Efectivo → Estado de cuenta**. Funciona como un estado de cuenta bancario del efectivo físico.

- **Qué muestra.**
  - Saldo inicial, total de entradas, total de salidas y saldo teórico (saldo inicial + entradas − salidas).
  - El efectivo físico del último arqueo, la diferencia, la cantidad de movimientos y el último movimiento.
  - Cada movimiento con fecha y hora, número, tipo, descripción o beneficiario, referencia, usuario, entrada, salida y
    saldo después de aplicarlo.
- **Período.**
  - Por defecto, el día bancario en curso: desde la apertura en Agentes Bancarios hasta la siguiente apertura.
  - También se puede elegir un día anterior, una fecha o un rango.
  - El saldo inicial de un día es exactamente el cierre del día anterior según el Kardex. Un movimiento de hoy nunca
    cambia un día anterior.
- **Qué cuenta.** Solo lo que entra o sale físicamente de Caja. Las operaciones que solo mueven bancos, cuentas por
  cobrar o activos sin efectivo no aparecen. El efectivo de Listas Escolares, Guayacán, Ventas y Recargas tiene sus
  propias cajas.
- **Avisos.** Si el último arqueo antes del período tuvo faltante o sobrante, si hubo movimientos después del último
  arqueo, o si algo no cuadra con el Kardex, se avisa. Nunca se corrige solo.
- **Caja y Bodega.** Se ven por separado y con su total bajo custodia. Un faltante de Caja y un sobrante de Bodega
  nunca se compensan.
- **Arqueo de Bodega.**
  - Supervisores y administradores cuentan Bodega por denominación. Queda registrado el saldo teórico, el contado, la
    diferencia y si está cuadrado, con faltante o con sobrante.
  - No mueve efectivo ni ajusta nada.
  - Es distinto del "conteo de Bodega" exacto, que sigue siendo la base de los billetes disponibles en Bodega.
- **Acceso.** Todos ven los movimientos y saldos. El efectivo contado, las diferencias, Bodega y el total bajo custodia
  solo los ven supervisores y administradores, y lo mismo aplica al PDF y al Excel.
- **Exportar.** PDF y Excel con las mismas cifras y filtros de la pantalla.
- **Al publicar en producción.** Correr `npm run migration:run:prod` (migración `1760009100000`, solo agrega el Arqueo
  de Bodega). El Estado de Cuenta no necesita datos nuevos: lee el Kardex que ya existe.

## Control diario y auditoría de efectivo

Para tener certeza de que el efectivo físico coincide con el sistema, cada día:

1. **Arqueo de apertura.**
   - Al abrir, un supervisor o administrador cuenta la Caja. Se compara con el **cierre oficial de ayer** y con lo que
     se contó al cerrar.
   - Si hay diferencia, se piden motivo y responsable, y queda como evidencia.
   - Mientras no se haga, Control de Efectivo muestra un aviso, pero no bloquea la operación.
2. **Movimientos.** Cada movimiento ya guarda quién, cuándo, cuánto, de qué operación viene y el saldo antes y después.
3. **Arqueos durante el día y arqueo final** (cortes). Cada uno compara lo contado con el saldo teórico de ese momento.
4. **Auditoría** (Control de Efectivo → Auditoría, supervisores y administradores). Revisa:
   - Que el Kardex continúe sin saltos.
   - Que cada operación (Transaccionar, cuentas por cobrar, activos, retiros de banco, traslados a Bodega) haya movido
     Caja exactamente como debía: sin omitidas, montos distintos, signos invertidos ni movimientos que no
     correspondían.
   - Duplicados y posibles duplicados.
   - Que los saldos guardados por cortes y aperturas coincidan con el Kardex.
   - Entre dos arqueos seguidos, **cuánto cambió la diferencia**. Ahí empezó el faltante o sobrante, y con "Investigar"
     se ven los movimientos de ese tramo, con usuario y hora.
5. **No se oculta nada.**
   - Nada se cuadra solo ni se modifica.
   - Un administrador cierra una diferencia indicando la causa y una explicación. Si corresponde, en el mismo paso
     registra el ajuste autorizado por exactamente esa diferencia.
   - El arqueo conserva su diferencia original y queda como "resuelta".

La auditoría muestra hechos (operación, usuario, fecha, monto) y los clasifica como error de registro, error de
cálculo, duplicado, omitido, diferencia de arqueo, inconsistencia histórica o causa no determinada. Nunca afirma que hubo
pérdida o fraude.

**Al publicar en producción:** `npm run migration:run:prod` (migración `1760009200000`; solo agrega tablas y funciones
nuevas).

## Cuentas por Cobrar, Activos y Caja

Qué mueve la Caja (una sola regla para todo el sistema):

| Registro | Efectivo | Banco / transferencia |
|---|---|---|
| Cuenta por cobrar (cargo: el negocio entrega el dinero) | Sale de Caja | No mueve Caja |
| Abono de cuenta por cobrar | Entra a Caja | No mueve Caja |
| Activo (dinero del cliente que el negocio guarda) | Entra a Caja | No mueve Caja |
| Devolución de activo | Sale de Caja | No mueve Caja |

- **Corregir o eliminar.**
  - Cambiar el monto o el medio, o eliminar, pide un **motivo**.
  - Si el registro había movido Caja, el sistema registra la **reversa**, vinculada al movimiento original y con el
    motivo, y después el movimiento corregido. Así queda visible en el Estado de Cuenta de Efectivo.
  - Cambiar solo la fecha, el cliente o la descripción no mueve Caja, pero también queda en el historial.
- **Nada se borra.**
  - Un registro eliminado queda **anulado**: tachado en el estado de cuenta del cliente, con quién, cuándo y por qué.
  - "Historial" muestra cada cambio (antes → después) y sus movimientos de Caja.
- **Registros anteriores al Control de Efectivo.** Su efectivo ya estaba en el saldo inicial contado, así que
  corregirlos o eliminarlos **no mueve Caja**. El sistema lo avisa antes de confirmar.
- **Cargos que nacieron en Transaccionar** ("enviar a cuentas por cobrar/activos"):
  - Se corrigen anulando la operación, y al hacerlo se anula también el cargo.
  - Si ese cargo ya recibió pagos, primero se anulan los pagos.
- **Revisión histórica.** En Control de Efectivo → Auditoría → **Rango**, con las fechas de inicio a hoy, la tabla
  **"Conciliación por operación"** lista cada operación cuyo movimiento registrado no coincide con el esperado:
  - Columnas: fecha, módulo, operación, esperado, registrado, diferencia y causa probable.
  - Se puede bajar en CSV.
  - Incluye las operaciones de Transaccionar anuladas antes de esta corrección que dejaron su cargo vigente; se
    regularizan anulando ese cargo con su motivo.
  - Nada se corrige solo.

**Al publicar en producción:** `npm run migration:run:prod` (migración `1760009300000`). Agrega columnas, una tabla de
historial, funciones y triggers. No modifica ni borra registros existentes.

## Pagos grupales (Pago Varios y Préstamos Génesis)

1. **Habilitar el tipo.** En Sistema → Tipos de transacción, marque "Permite pago grupal" en el tipo (por ejemplo Pago
   Varios). En Transaccionar, ese tipo muestra **Pago individual / Pago grupal**.
2. **Crear el grupo.** Indique descripción, cantidad de transacciones, monto total autorizado y el monto de cada
   transacción (pueden ser distintos; su suma no supera lo autorizado).
   - Si el tipo **saca** efectivo (Pago Varios), el monto autorizado queda **reservado**:
     - el **saldo físico** de Caja no cambia;
     - el **disponible para operar** baja;
     - ninguna otra salida (retiros, salidas manuales, traslados a Bodega, cargos en efectivo) puede tomar ese dinero;
     - no se puede reservar más que el disponible.
   - Si el tipo **recibe** efectivo (Préstamos Génesis, cobro de cuotas), no se reserva nada.
3. **Procesar cada transacción.** En Transaccionar, abra el tipo (Pago Varios o Préstamos Génesis). La sección
   **Operaciones de <tipo>** lista las operaciones individuales y los grupos, con la columna **Modalidad**.
   - Filtre por Todas, Individuales o Grupales, y por fechas, estado, usuario o código del grupo.

   Abra el grupo con su botón. Cada transacción se trabaja por separado:
   - **Confirmar pago:** se entrega todo lo esperado.
   - **Pago parcial:** se entrega una parte y el resto sigue reservado.
   - **Sin pago:** se indica el motivo y no mueve Caja.
   - **Observación** e **Historial.**
   - Cada pago confirmado es una operación real de Transaccionar: baja Caja (o entra, si es cobro) solo por lo
     entregado y aparece en el Kardex y en el Estado de Cuenta con el código del grupo y el número de transacción.
4. **Cerrar (administrador).**
   - No se puede cerrar con transacciones pendientes.
   - Cada parcial o sin pago necesita su resolución escrita.
   - Al cerrar se libera lo no utilizado al disponible; los movimientos reales y el historial quedan intactos.
5. **Anular (administrador).**
   - Una transacción sin pagos solo libera su reserva.
   - Una ya pagada se anula únicamente si el dinero regresó físicamente: se registra la reversa. Si no regresó, se deja
     una observación; nunca se registra una entrada ficticia.

Control de Efectivo muestra "Reservado en pagos grupales" y "Disponible para operar" mientras haya grupos abiertos.

Una operación que salió de un grupo lo indica en su detalle ("Esta transacción pertenece a un PAGO GRUPAL", con el
código y el número de transacción) y lleva al grupo. En Reportes → Transacciones la columna Modalidad la marca como
GRUPAL; se anula desde el grupo, no desde el reporte. Las operaciones registradas antes siguen siendo individuales.

**Al publicar en producción:** `npm run migration:run:prod` (migración `1760009400000`). Después active "Permite pago
grupal" en los tipos que correspondan.
