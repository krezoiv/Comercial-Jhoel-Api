# Secuencia — Venta: confirmar ("Guardar venta")

Módulo: **Ventas (sales)** · Fuente editable: [`venta-confirmar-guardar-venta.mmd`](venta-confirmar-guardar-venta.mmd) · [Índice de diagramas](../README.md)

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant C as SalesDraftStore
  participant S as SalesService
  participant G as API (guards y ValidationPipe)
  participant CT as SalesController
  participant UC0 as ConfirmOpenSaleUseCase
  participant R0 as TypeOrmSaleRepository
  participant DB as PostgreSQL
  U->>C: confirmSale()
  C->>S: confirmSale(…)
  S->>G: POST /api/sales/confirm + Bearer JWT
  alt falla JWT válido y usuario activo / DTO ConfirmOpenSaleRequestDto
    G-->>C: 400 / 401 / 403 / 429 con success false
  else permitido
  G->>CT: confirm(dto, usuario del JWT)
  CT->>UC0: execute(input)
  UC0->>R0: confirmOpenSale()
  R0->>DB: SELECT confirm_open_sale(…)
  Note over DB: escribe inventory_movements, sales
  alt RAISE EXCEPTION
    DB-->>R0: error con código
    R0-->>G: DomainError (traducido)
  else COMMIT
    DB-->>R0: resultado
  end
  R0-->>UC0: datos
  UC0-->>CT: salida
  CT-->>G: objeto
  G-->>C: success true con data
  end
  C-->>U: actualiza la interfaz (this.notificationService.success, this.notificationService.error)
```

## Explicación

1. **¿Qué proceso representa?** Interacción Usuario → Angular → API → caso de uso → repositorio → PostgreSQL para POST /api/sales/confirm, con las validaciones y la transacción
2. **¿Dónde comienza?** SalesService.confirmSale
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts`](../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts), [`comercial-jhoel-app/src/app/core/services/sales-draft.store.ts`](../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts), [`comercial-jhoel-app/src/app/core/services/sales.service.ts`](../../../comercial-jhoel-app/src/app/core/services/sales.service.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/confirm-open-sale.use-case.ts`](../../../comercial-jhoel-api/src/modules/sales/application/use-cases/confirm-open-sale.use-case.ts), [`comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts`](../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Bloques alt/opt = validaciones reales; flujo completo en business-processes/sales/post-sales-confirm.mmd
6. **¿Dónde se almacenan los datos?** PostgreSQL (ver notas "escribe")
7. **¿Cómo termina el proceso?** success true con data y actualización de la interfaz
8. **¿Qué sucede cuando ocurre un error?** Ramas alt/opt: el error vuelve a la pantalla como { success: false, message }

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
