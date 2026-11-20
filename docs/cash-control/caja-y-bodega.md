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

- **Caja → Bodega.** Baja Caja y sube Bodega.
- **Bodega → Caja.** Baja Bodega y sube Caja.
- **Efecto en los totales.** Ninguno de los dos cambia el total bajo resguardo, ni se registra como ingreso o gasto.
- **Kardex.** Cada traslado deja un solo renglón en el Kardex de caja y uno en el de Bodega.

## Al publicar en producción

1. Desplegar y correr `npm run migration:run:prod`.
2. Desde ese momento el Cuadre de Agentes pide el Arqueo de Caja (Caja + Bodega) antes de guardar.
