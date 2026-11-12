# POST /api/news-types/reorder

Módulo: **Tipos de noticia (news-types)** · Fuente editable: [`post-news-types-reorder.mmd`](post-news-types-reorder.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/news-types/reorder"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["NewsTypeService.reorderTypes<br/><small>app/core/services/news-type.service.ts</small>"]
  n6["NewsTypesPageComponent.swapOrder<br/><small>app/features/dashboard/news-types/news-types-page.component.ts</small>"]
  n7["HTTP POST /api/news-types/reorder<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿ReorderNewsTypesRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["NewsTypesController.reorder<br/><small>api/news-types/presentation/controllers/news-types.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["ReorderNewsTypesUseCase.execute<br/><small>api/news-types/application/use-cases/reorder-news-types.use-case.ts</small>"]
  n19{"¿!newsType?<br/><small>L16</small>"}
  n20(["NewsTypeNotFoundError(item.id)"])
  end
  subgraph s21["Dominio → Infraestructura"]
  n22["Puerto NewsTypeRepository.findById / reorder<br/>@Inject(NEWS_TYPE_REPOSITORY)"]
  n23["TypeOrmNewsTypeRepository<br/><small>api/news-types/infrastructure/persistence/typeorm-news-type.repository.ts</small>"]
  n24[("findById: TypeORM Repository")]
  n25[("reorder: TypeORM Repository")]
  end
  n26(["Fin: la interfaz se actualiza<br/>this.types.set<br/>this.notificationService.error"])
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
  n14 -->|no| n15
  n15 --> n2
  n14 -->|sí| n16
  n16 --> n18
  n18 --> n19
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
  class n2,n3,n11,n13,n15,n20 err
  class n5,n6,n7 fe
  class n8,n26 ok
  class n10,n12,n14,n19 dec
  class n16 api
  class n18 app
  class n22 dom
  class n23 infra
  class n24,n25 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/news-types/reorder: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** NewsTypesPageComponent.swapOrder (comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts`](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts), [`comercial-jhoel-app/src/app/core/services/news-type.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/news-type.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts), [`comercial-jhoel-api/src/modules/news-types/application/use-cases/reorder-news-types.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/reorder-news-types.use-case.ts), [`comercial-jhoel-api/src/modules/news-types/domain/repositories/news-type.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-types/domain/repositories/news-type.repository.ts), [`comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | DTO ReorderNewsTypesRequestDto | !newsType
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
