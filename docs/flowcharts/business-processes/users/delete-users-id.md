# DELETE /api/users/:id

Módulo: **Usuarios (users)** · Fuente editable: [`delete-users-id.mmd`](delete-users-id.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta DELETE /api/users/:id"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["UserService.deleteUser<br/><small>app/core/services/user.service.ts</small>"]
  n6["UsersPageComponent.confirmDelete<br/><small>app/features/dashboard/users/users-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP DELETE /api/users/:id<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14["UsersController.deactivate<br/><small>api/users/presentation/controllers/users.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["DeactivateUserUseCase.execute<br/><small>api/users/application/use-cases/deactivate-user.use-case.ts</small>"]
  n17{"¿id === currentUserId?<br/><small>L19</small>"}
  n18(["CannotDeactivateSelfError()"])
  n19{"¿!user?<br/><small>L24</small>"}
  n20(["UserNotFoundError(id)"])
  end
  subgraph s21["Dominio → Infraestructura"]
  n22["Puerto UserRepository.findById / deactivate<br/>@Inject(USER_REPOSITORY)"]
  n23["TypeOrmUserRepository<br/><small>api/users/infrastructure/persistence/typeorm-user.repository.ts</small>"]
  n24[("findById: TypeORM Repository")]
  n25[("deactivate: TypeORM Repository")]
  end
  n26(["Fin: la interfaz se actualiza<br/>this.isDeleting.set<br/>this.isDeleteOpen.set<br/>this.deletingUser.set<br/>this.notificationService.success<br/>this.notificationService.error"])
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
  n17 -->|no| n19
  n19 -->|sí| n20
  n20 --> n2
  n19 -->|no| n22
  n22 -->|implementa| n23
  n23 --> n24
  n24 --> n8
  n23 --> n25
  n25 --> n8
  n8 --> n26
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
  class n2,n3,n11,n13,n18,n20 err
  class n5,n6,n7 fe
  class n8,n26 ok
  class n10,n12,n17,n19 dec
  class n14 api
  class n16 app
  class n22 dom
  class n23 infra
  class n24,n25 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de DELETE /api/users/:id: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** UsersPageComponent.confirmDelete (comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts`](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts), [`comercial-jhoel-app/src/app/core/services/user.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/user.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/users/users-page.component.ts), [`comercial-jhoel-api/src/modules/users/application/use-cases/deactivate-user.use-case.ts`](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/deactivate-user.use-case.ts), [`comercial-jhoel-api/src/modules/users/domain/repositories/user.repository.ts`](../../../../comercial-jhoel-api/src/modules/users/domain/repositories/user.repository.ts), [`comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts`](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | id === currentUserId | !user
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
