# POST /api/assets/:clientId/charges

Módulo: **Activos (assets)** · Fuente editable: [`post-assets-clientid-charges.mmd`](post-assets-clientid-charges.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/assets/:clientId/charges"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["AssetService.registerCharge<br/><small>app/core/services/asset.service.ts</small>"]
  n6["HTTP POST /api/assets/:clientId/charges<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n7["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s8["API NestJS — presentación"]
  n9{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n10(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n11{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n12(["403 Sin permisos"])
  n13{"¿RegisterMovementRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n14(["400 Datos inválidos"])
  n15["AssetsController.registerCharge<br/><small>api/assets/presentation/controllers/assets.controller.ts</small>"]
  end
  subgraph s16["Aplicación — caso de uso"]
  n17["RegisterAssetChargeUseCase.execute<br/><small>api/assets/application/use-cases/register-asset-charge.use-case.ts</small>"]
  n18{"¿!client?<br/><small>L38</small>"}
  n19(["ReferencedClientNotFoundError()"])
  n20{"¿!client.isActive?<br/><small>L41</small>"}
  n21(["ReferencedClientInactiveError()"])
  end
  n22["Puerto ClientRepository<br/><small>findById</small>"]
  subgraph s23["Dominio → Infraestructura"]
  n24["Puerto AssetRepository.registerMovement<br/>@Inject(ASSET_REPOSITORY)"]
  n25["TypeOrmAssetRepository<br/><small>api/assets/infrastructure/persistence/typeorm-asset.repository.ts</small>"]
  subgraph s26["PostgreSQL — función register_asset_movement"]
  n27[["SELECT register_asset_movement(…)<br/><small>registerMovement — una transacción</small>"]]
  n28{"¿p_type NOT IN ('CARGO', 'ABONO')?"}
  n29(["RAISE INVALID_MOVEMENT_TYPE<br/>(rollback)"])
  n30{"¿p_amount IS NULL OR p_amount #lt;= 0?"}
  n31(["RAISE INVALID_AMOUNT<br/>(rollback)"])
  n32[("Escribe:<br/>assets")]
  end
  end
  n33(["Fin: la interfaz se actualiza"])
  n2 --> n3
  n1 --> n5
  n5 --> n6
  n6 --> n9
  n9 -->|no| n10
  n10 --> n3
  n9 -->|sí| n11
  n11 -->|no| n12
  n12 --> n2
  n11 -->|sí| n13
  n13 -->|no| n14
  n14 --> n2
  n13 -->|sí| n15
  n15 --> n17
  n17 --> n18
  n18 -->|sí| n19
  n19 --> n2
  n18 -->|no| n20
  n20 -->|sí| n21
  n21 --> n2
  n17 -.->|consulta| n22
  n20 -->|no| n24
  n24 -->|implementa| n25
  n25 -->|registerMovement| n27
  n27 --> n28
  n28 -->|sí| n29
  n29 --> n2
  n28 -->|no| n30
  n30 -->|sí| n31
  n31 --> n2
  n30 -->|no| n32
  n32 -->|COMMIT| n7
  n7 --> n33
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
  class n2,n3,n10,n12,n14,n19,n21,n29,n31 err
  class n5,n6 fe
  class n7,n33 ok
  class n9,n11,n13,n18,n20,n28,n30 dec
  class n15 api
  class n17 app
  class n22,n24 dom
  class n25 infra
  class n27,n32 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/assets/:clientId/charges: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** AssetService.registerCharge
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts`](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts), [`comercial-jhoel-app/src/app/core/services/asset.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/asset.service.ts), [`comercial-jhoel-api/src/modules/assets/application/use-cases/register-asset-charge.use-case.ts`](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/register-asset-charge.use-case.ts), [`comercial-jhoel-api/src/modules/clients/domain/repositories/client.repository.ts`](../../../../comercial-jhoel-api/src/modules/clients/domain/repositories/client.repository.ts), [`comercial-jhoel-api/src/modules/assets/domain/repositories/asset.repository.ts`](../../../../comercial-jhoel-api/src/modules/assets/domain/repositories/asset.repository.ts), [`comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts`](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | DTO RegisterMovementRequestDto | !client | !client.isActive | SQL register_asset_movement: p_type NOT IN ('CARGO', 'ABONO') | SQL register_asset_movement: p_amount IS NULL OR p_amount <= 0
6. **¿Dónde se almacenan los datos?** register_asset_movement(), assets
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
