# POST /api/presentation-types

Módulo: **Tipos de presentación (presentation-types)** · Fuente editable: [`post-presentation-types.mmd`](post-presentation-types.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/presentation-types"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["PresentationTypeService.createPresentationType<br/><small>app/core/services/presentation-type.service.ts</small>"]
  n6["PresentationTypesTabComponent.submit<br/><small>app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/presentation-types<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿CreatePresentationTypeRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["PresentationTypesController.create<br/><small>api/presentation-types/presentation/controllers/presentation-types.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["CreatePresentationTypeUseCase.execute<br/><small>api/presentation-types/application/use-cases/create-presentation-type.use-case.ts</small>"]
  n19{"¿existingByName?<br/><small>L45</small>"}
  n20(["PresentationTypeNameAlreadyExistsError( name, !existingByName.isActive, )"])
  n21{"¿existingByCode?<br/><small>L55</small>"}
  n22(["PresentationTypeCodeAlreadyExistsError(code)"])
  end
  subgraph s23["Dominio → Infraestructura"]
  n24["Puerto PresentationTypeRepository.findByName / findByActiveCode / create<br/>@Inject(PRESENTATION_TYPE_REPOSITORY)"]
  n25["TypeOrmPresentationTypeRepository<br/><small>api/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts</small>"]
  n26[("findByName: TypeORM Repository")]
  n27[("findByActiveCode: TypeORM Repository")]
  n28[("create: TypeORM Repository")]
  end
  n29(["Fin: la interfaz se actualiza<br/>this.formError.set<br/>this.isSubmitting.set<br/>this.isFormOpen.set<br/>this.notificationService.success"])
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
  n19 -->|no| n21
  n21 -->|sí| n22
  n22 --> n2
  n21 -->|no| n24
  n24 -->|implementa| n25
  n25 --> n26
  n26 --> n8
  n25 --> n27
  n27 --> n8
  n25 --> n28
  n28 --> n8
  n8 --> n29
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
  class n2,n3,n11,n13,n15,n20,n22 err
  class n5,n6,n7 fe
  class n8,n29 ok
  class n10,n12,n14,n19,n21 dec
  class n16 api
  class n18 app
  class n24 dom
  class n25 infra
  class n26,n27,n28 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/presentation-types: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** PresentationTypesTabComponent.submit (comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/presentation-types/presentation/controllers/presentation-types.controller.ts`](../../../../comercial-jhoel-api/src/modules/presentation-types/presentation/controllers/presentation-types.controller.ts), [`comercial-jhoel-app/src/app/core/services/presentation-type.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/presentation-type.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/presentation-units/components/presentation-types-tab/presentation-types-tab.component.ts), [`comercial-jhoel-api/src/modules/presentation-types/application/use-cases/create-presentation-type.use-case.ts`](../../../../comercial-jhoel-api/src/modules/presentation-types/application/use-cases/create-presentation-type.use-case.ts), [`comercial-jhoel-api/src/modules/presentation-types/domain/repositories/presentation-type.repository.ts`](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/repositories/presentation-type.repository.ts), [`comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts`](../../../../comercial-jhoel-api/src/modules/presentation-types/infrastructure/persistence/typeorm-presentation-type.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | DTO CreatePresentationTypeRequestDto | existingByName | existingByCode
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
