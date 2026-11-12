# PATCH /api/catalog/phones/:id

Módulo: **Catálogo de teléfonos (catalog)** · Fuente editable: [`patch-catalog-phones-id.mmd`](patch-catalog-phones-id.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta PATCH /api/catalog/phones/:id"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["CatalogPhoneService.updatePhone<br/><small>app/core/services/catalog-phone.service.ts</small>"]
  n6["CatalogPhoneFormModalComponent.submit<br/><small>app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP PATCH /api/catalog/phones/:id<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14{"¿UpdateCatalogPhoneRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n15(["400 Datos inválidos"])
  n16["CatalogPhonesController.update<br/><small>api/catalog/presentation/controllers/catalog-phones.controller.ts</small>"]
  end
  subgraph s17["Aplicación — caso de uso"]
  n18["UpdateCatalogPhoneUseCase.execute<br/><small>api/catalog/application/use-cases/update-catalog-phone.use-case.ts</small>"]
  n19{"¿!existing?<br/><small>L51</small>"}
  n20(["CatalogPhoneNotFoundError(id)"])
  end
  n21["Puerto CompanySettingsRepository<br/><small>get</small>"]
  subgraph s22["Dominio → Infraestructura"]
  n23["Puerto CatalogPhoneRepository.findById / update<br/>@Inject(CATALOG_PHONE_REPOSITORY)"]
  n24["TypeOrmCatalogPhoneRepository<br/><small>api/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts</small>"]
  n25[("findById: TypeORM Repository")]
  n26[("update: TypeORM Repository")]
  end
  n27(["Fin: la interfaz se actualiza<br/>this.errorMessage.set<br/>this.isSubmitting.set<br/>this.saved.emit"])
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
  n18 -.->|consulta| n21
  n19 -->|no| n23
  n23 -->|implementa| n24
  n24 --> n25
  n25 --> n8
  n24 --> n26
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
  class n2,n3,n11,n13,n15,n20 err
  class n5,n6,n7 fe
  class n8,n27 ok
  class n10,n12,n14,n19 dec
  class n16 api
  class n18 app
  class n21,n23 dom
  class n24 infra
  class n25,n26 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de PATCH /api/catalog/phones/:id: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** CatalogPhoneFormModalComponent.submit (comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts`](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts), [`comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts), [`comercial-jhoel-api/src/modules/catalog/application/use-cases/update-catalog-phone.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/update-catalog-phone.use-case.ts), [`comercial-jhoel-api/src/modules/company-settings/domain/repositories/company-settings.repository.ts`](../../../../comercial-jhoel-api/src/modules/company-settings/domain/repositories/company-settings.repository.ts), [`comercial-jhoel-api/src/modules/catalog/domain/repositories/catalog-phone.repository.ts`](../../../../comercial-jhoel-api/src/modules/catalog/domain/repositories/catalog-phone.repository.ts), [`comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts`](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | DTO UpdateCatalogPhoneRequestDto | !existing
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
