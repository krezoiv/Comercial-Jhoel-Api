# PATCH /api/users/me/preferences/theme

Módulo: **Usuarios (users)** · Fuente editable: [`patch-users-me-preferences-theme.mmd`](patch-users-me-preferences-theme.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta PATCH /api/users/me/preferences/theme"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["HTTP PATCH /api/users/me/preferences/theme<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n6["Respuesta 200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s7["API NestJS — presentación"]
  n8{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n9(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n10{"¿UpdateThemeRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n11(["400 Datos inválidos"])
  n12["UsersController.updateMyTheme<br/><small>api/users/presentation/controllers/users.controller.ts</small>"]
  end
  subgraph s13["Aplicación — caso de uso"]
  n14["UpdateUserThemeUseCase.execute<br/><small>api/users/application/use-cases/update-user-theme.use-case.ts</small>"]
  n15{"¿!user?<br/><small>L37</small>"}
  n16(["UserNotFoundError(userId)"])
  end
  subgraph s17["Dominio → Infraestructura"]
  n18["Puerto UserRepository.findById / update<br/>@Inject(USER_REPOSITORY)"]
  n19["TypeOrmUserRepository<br/><small>api/users/infrastructure/persistence/typeorm-user.repository.ts</small>"]
  n20[("findById: TypeORM Repository")]
  n21[("update: TypeORM Repository")]
  end
  n22(["Fin: la interfaz se actualiza"])
  n2 --> n3
  n1 --> n5
  n5 --> n8
  n8 -->|no| n9
  n9 --> n3
  n8 -->|sí| n10
  n10 -->|no| n11
  n11 --> n2
  n10 -->|sí| n12
  n12 --> n14
  n14 --> n15
  n15 -->|sí| n16
  n16 --> n2
  n15 -->|no| n18
  n18 -->|implementa| n19
  n19 --> n20
  n20 --> n6
  n19 --> n21
  n21 --> n6
  n6 --> n22
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
  class n2,n3,n9,n11,n16 err
  class n5 fe
  class n6,n22 ok
  class n8,n10,n15 dec
  class n12 api
  class n14 app
  class n18 dom
  class n19 infra
  class n20,n21 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de PATCH /api/users/me/preferences/theme: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** cliente HTTP → PATCH /api/users/me/preferences/theme
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts`](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts), [`comercial-jhoel-api/src/modules/users/application/use-cases/update-user-theme.use-case.ts`](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/update-user-theme.use-case.ts), [`comercial-jhoel-api/src/modules/users/domain/repositories/user.repository.ts`](../../../../comercial-jhoel-api/src/modules/users/domain/repositories/user.repository.ts), [`comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts`](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO UpdateThemeRequestDto | !user
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
