# DELETE /api/categories/:id

Módulo: **Categorías (categories)** · Fuente editable: [`delete-categories-id.mmd`](delete-categories-id.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta DELETE /api/categories/:id"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["CategoryService.deleteCategory<br/><small>app/core/services/category.service.ts</small>"]
  n6["CategoriesPageComponent.confirmDelete<br/><small>app/features/dashboard/categories/categories-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP DELETE /api/categories/:id<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14["CategoriesController.deactivate<br/><small>api/categories/presentation/controllers/categories.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["DeactivateCategoryUseCase.execute<br/><small>api/categories/application/use-cases/deactivate-category.use-case.ts</small>"]
  n17{"¿!category?<br/><small>L21</small>"}
  n18(["CategoryNotFoundError(id)"])
  end
  subgraph s19["Dominio → Infraestructura"]
  n20["Puerto CategoryRepository.findById / deactivate<br/>@Inject(CATEGORY_REPOSITORY)"]
  n21["TypeOrmCategoryRepository<br/><small>api/categories/infrastructure/persistence/typeorm-category.repository.ts</small>"]
  n22[("findById: TypeORM Repository")]
  n23[("deactivate: TypeORM Repository")]
  end
  n24(["Fin: la interfaz se actualiza<br/>this.isDeleting.set<br/>this.isDeleteOpen.set<br/>this.deletingCategory.set<br/>this.notificationService.success<br/>this.notificationService.error"])
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
  n17 -->|no| n20
  n20 -->|implementa| n21
  n21 --> n22
  n22 --> n8
  n21 --> n23
  n23 --> n8
  n8 --> n24
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
  class n8,n24 ok
  class n10,n12,n17 dec
  class n14 api
  class n16 app
  class n20 dom
  class n21 infra
  class n22,n23 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de DELETE /api/categories/:id: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** CategoriesPageComponent.confirmDelete (comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/categories/presentation/controllers/categories.controller.ts`](../../../../comercial-jhoel-api/src/modules/categories/presentation/controllers/categories.controller.ts), [`comercial-jhoel-app/src/app/core/services/category.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/category.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/categories/categories-page.component.ts), [`comercial-jhoel-api/src/modules/categories/application/use-cases/deactivate-category.use-case.ts`](../../../../comercial-jhoel-api/src/modules/categories/application/use-cases/deactivate-category.use-case.ts), [`comercial-jhoel-api/src/modules/categories/domain/repositories/category.repository.ts`](../../../../comercial-jhoel-api/src/modules/categories/domain/repositories/category.repository.ts), [`comercial-jhoel-api/src/modules/categories/infrastructure/persistence/typeorm-category.repository.ts`](../../../../comercial-jhoel-api/src/modules/categories/infrastructure/persistence/typeorm-category.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | !category
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
