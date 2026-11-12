# POST /api/inventory/products/:productId/presentations

Módulo: **Inventario (inventory)** · Fuente editable: [`post-inventory-products-productid-presentations.mmd`](post-inventory-products-productid-presentations.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/inventory/products/:productId/presentations"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["InventoryLocationsService.createPresentation<br/><small>app/core/services/inventory-locations.service.ts</small>"]
  n6["PresentationFormModalComponent.submit<br/><small>app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["ProductFormModalComponent.createAdditionalPresentations<br/><small>app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts</small>"]
  n8["HTTP POST /api/inventory/products/:productId/presentations<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n9["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s10["API NestJS — presentación"]
  n11{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n12(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n13{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n14(["403 Sin permisos"])
  n15{"¿CreatePresentationRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n16(["400 Datos inválidos"])
  n17["InventoryController.createPresentation<br/><small>api/inventory/presentation/controllers/inventory.controller.ts</small>"]
  end
  subgraph s18["Aplicación — caso de uso"]
  n19["CreatePresentationUseCase.execute<br/><small>api/inventory/application/use-cases/create-presentation.use-case.ts</small>"]
  n20{"¿!product?<br/><small>L46</small>"}
  n21(["ProductNotFoundError(input.productId)"])
  n22{"¿!presentationType #124;#124; !presentationType.isActive?<br/><small>L53</small>"}
  n23(["InvalidPresentationDataError( 'El tipo de presentación seleccionado no existe o está inactivo.', )"])
  n24{"¿!Number.isInteger(input.conversionFactor) #124;#124; input.conversionFactor #lt;= 0?<br/><small>L59</small>"}
  n25(["InvalidPresentationDataError( 'El factor de conversión debe ser un número entero mayor que cero.', )"])
  n26{"¿input.costPrice #lt; 0 #124;#124; input.publicPrice #lt; 0?<br/><small>L67</small>"}
  n27(["InvalidPresentationDataError( 'Los precios no pueden ser negativos.', )"])
  end
  n28["Puerto ProductRepository<br/><small>findById</small>"]
  n29["Puerto PresentationTypeRepository<br/><small>findById</small>"]
  subgraph s30["Dominio → Infraestructura"]
  n31["Puerto ProductPresentationRepository.create<br/>@Inject(PRODUCT_PRESENTATION_REPOSITORY)"]
  n32["TypeOrmProductPresentationRepository<br/><small>api/inventory/infrastructure/persistence/typeorm-product-presentation.repository.ts</small>"]
  n33[("create: TypeORM Repository")]
  end
  n34(["Fin: la interfaz se actualiza<br/>this.errorMessage.set<br/>this.isSubmitting.set<br/>this.saved.emit"])
  n2 --> n3
  n1 -->|acción del usuario| n6
  n6 --> n5
  n1 -->|acción del usuario| n7
  n7 --> n5
  n5 --> n8
  n8 --> n11
  n11 -->|no| n12
  n12 --> n3
  n11 -->|sí| n13
  n13 -->|no| n14
  n14 --> n2
  n13 -->|sí| n15
  n15 -->|no| n16
  n16 --> n2
  n15 -->|sí| n17
  n17 --> n19
  n19 --> n20
  n20 -->|sí| n21
  n21 --> n2
  n20 -->|no| n22
  n22 -->|sí| n23
  n23 --> n2
  n22 -->|no| n24
  n24 -->|sí| n25
  n25 --> n2
  n24 -->|no| n26
  n26 -->|sí| n27
  n27 --> n2
  n19 -.->|consulta| n28
  n19 -.->|consulta| n29
  n26 -->|no| n31
  n31 -->|implementa| n32
  n32 --> n33
  n33 --> n9
  n9 --> n34
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
  class n2,n3,n12,n14,n16,n21,n23,n25,n27 err
  class n5,n6,n7,n8 fe
  class n9,n34 ok
  class n11,n13,n15,n20,n22,n24,n26 dec
  class n17 api
  class n19 app
  class n28,n29,n31 dom
  class n32 infra
  class n33 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/inventory/products/:productId/presentations: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** PresentationFormModalComponent.submit (comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts`](../../../../comercial-jhoel-api/src/modules/inventory/presentation/controllers/inventory.controller.ts), [`comercial-jhoel-app/src/app/core/services/inventory-locations.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/inventory-locations.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/presentation-form-modal/presentation-form-modal.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/components/product-form-modal/product-form-modal.component.ts), [`comercial-jhoel-api/src/modules/inventory/application/use-cases/create-presentation.use-case.ts`](../../../../comercial-jhoel-api/src/modules/inventory/application/use-cases/create-presentation.use-case.ts), [`comercial-jhoel-api/src/modules/products/domain/repositories/product.repository.ts`](../../../../comercial-jhoel-api/src/modules/products/domain/repositories/product.repository.ts), [`comercial-jhoel-api/src/modules/presentation-types/domain/repositories/presentation-type.repository.ts`](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/repositories/presentation-type.repository.ts), [`comercial-jhoel-api/src/modules/inventory/domain/repositories/product-presentation.repository.ts`](../../../../comercial-jhoel-api/src/modules/inventory/domain/repositories/product-presentation.repository.ts), [`comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-product-presentation.repository.ts`](../../../../comercial-jhoel-api/src/modules/inventory/infrastructure/persistence/typeorm-product-presentation.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | DTO CreatePresentationRequestDto | !product | !presentationType || !presentationType.isActive | !Number.isInteger(input.conversionFactor) || input.conversionFactor <= 0 | input.costPrice < 0 || input.publicPrice < 0
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
