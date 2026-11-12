# DELETE /api/roles/:id

Módulo: **Roles (roles)** · Fuente editable: [`delete-roles-id.mmd`](delete-roles-id.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta DELETE /api/roles/:id"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["RoleService.deleteRole<br/><small>app/core/services/role.service.ts</small>"]
  n6["RolesPageComponent.confirmDelete<br/><small>app/features/dashboard/roles/roles-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP DELETE /api/roles/:id<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('SUPER_ADMIN', 'ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14["RolesController.deactivate<br/><small>api/roles/presentation/controllers/roles.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["DeactivateRoleUseCase.execute<br/><small>api/roles/application/use-cases/deactivate-role.use-case.ts</small>"]
  n17{"¿!role?<br/><small>L20</small>"}
  n18(["RoleNotFoundError(id)"])
  n19{"¿activeUsers #gt; 0?<br/><small>L25</small>"}
  n20(["RoleHasAssignedUsersError()"])
  end
  subgraph s21["Dominio → Infraestructura"]
  n22["Puerto RoleRepository.findById / countUsersByRoleId / deactivate<br/>@Inject(ROLE_REPOSITORY)"]
  n23["TypeOrmRoleRepository<br/><small>api/roles/infrastructure/persistence/typeorm-role.repository.ts</small>"]
  n24[("findById: TypeORM Repository")]
  n25[("deactivate: TypeORM Repository")]
  n26[("countUsersByRoleId: SQL / TypeORM sobre<br/>users")]
  end
  n27(["Fin: la interfaz se actualiza<br/>this.isDeleting.set<br/>this.isDeleteOpen.set<br/>this.deletingRole.set<br/>this.notificationService.success<br/>this.notificationService.error"])
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
  n23 --> n26
  n26 --> n8
  n8 --> n27
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
  class n8,n27 ok
  class n10,n12,n17,n19 dec
  class n14 api
  class n16 app
  class n22 dom
  class n23 infra
  class n24,n25,n26 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de DELETE /api/roles/:id: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** RolesPageComponent.confirmDelete (comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/roles/presentation/controllers/roles.controller.ts`](../../../../comercial-jhoel-api/src/modules/roles/presentation/controllers/roles.controller.ts), [`comercial-jhoel-app/src/app/core/services/role.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/role.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/roles/roles-page.component.ts), [`comercial-jhoel-api/src/modules/roles/application/use-cases/deactivate-role.use-case.ts`](../../../../comercial-jhoel-api/src/modules/roles/application/use-cases/deactivate-role.use-case.ts), [`comercial-jhoel-api/src/modules/roles/domain/repositories/role.repository.ts`](../../../../comercial-jhoel-api/src/modules/roles/domain/repositories/role.repository.ts), [`comercial-jhoel-api/src/modules/roles/infrastructure/persistence/typeorm-role.repository.ts`](../../../../comercial-jhoel-api/src/modules/roles/infrastructure/persistence/typeorm-role.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'SUPER_ADMIN', 'ADMIN' | !role | activeUsers > 0
6. **¿Dónde se almacenan los datos?** users
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
