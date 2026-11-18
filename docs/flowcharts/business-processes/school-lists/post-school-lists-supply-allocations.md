# POST /api/school-lists/supply/allocations

Módulo: **school-lists (school-lists)** · Fuente editable: [`post-school-lists-supply-allocations.mmd`](post-school-lists-supply-allocations.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/school-lists/supply/allocations"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["SchoolListService.allocateManual<br/><small>app/core/services/school-list.service.ts</small>"]
  n6["SchoolSupplyComponent.allocateManual<br/><small>app/features/dashboard/school-lists/components/school-supply/school-supply.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/school-lists/supply/allocations<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿ManualAllocationRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["SchoolListsController.allocate<br/><small>api/school-lists/presentation/controllers/school-lists.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["AllocateSupplyManualUseCase.execute<br/><small>api/school-lists/application/use-cases/school-supply.use-cases.ts</small>"]
  n17{"¿!Number.isInteger(input.quantity) #124;#124; input.quantity #lt; 1?<br/><small>L128</small>"}
  n18(["schoolListError('SCHOOL_INVALID_QUANTITY')"])
  end
  n19(["Fin: la interfaz se actualiza<br/>this.busy.set<br/>this.notifications.success<br/>this.notifications.error"])
  n2 --> n3
  n1 -->|acción del usuario| n6
  n6 --> n5
  n5 --> n7
  n7 --> n10
  n10 -->|no| n11
  n11 --> n3
  n10 -->|sí| n12
  n12 -->|no| n13
  n13 --> n2
  n12 -->|sí| n14
  n14 --> n16
  n16 --> n17
  n17 -->|sí| n18
  n18 --> n2
  n17 -->|no| n8
  n8 --> n19
  classDef start fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20
  classDef fe fill:#e3f2fd,stroke:#1565c0,color:#0d47a1
  classDef api fill:#ede7f6,stroke:#4527a0,color:#311b92
  classDef app fill:#e0f2f1,stroke:#00695c,color:#004d40
  classDef dom fill:#fff8e1,stroke:#f9a825,color:#5d4037
  classDef infra fill:#f3e5f5,stroke:#6a1b9a,color:#4a148c
  classDef db fill:#eceff1,stroke:#455a64,color:#263238
  classDef dec fill:#fffde7,stroke:#f57f17,color:#3e2723
  classDef err fill:#ffebee,stroke:#c62828,color:#b71c1c
  classDef ok fill:#e8f5e9,stroke:#1b5e20,color:#1b5e20
  class n1 start
  class n2,n3,n11,n13,n18 err
  class n5,n6,n7 fe
  class n8,n19 ok
  class n10,n12,n17 dec
  class n14 api
  class n16 app
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/school-lists/supply/allocations: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** SchoolSupplyComponent.allocateManual (comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-supply/school-supply.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts`](../../../../comercial-jhoel-api/src/modules/school-lists/presentation/controllers/school-lists.controller.ts), [`comercial-jhoel-app/src/app/core/services/school-list.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/school-list.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-supply/school-supply.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/school-lists/components/school-supply/school-supply.component.ts), [`comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-supply.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/school-lists/application/use-cases/school-supply.use-cases.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO ManualAllocationRequestDto | !Number.isInteger(input.quantity) || input.quantity < 1
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
