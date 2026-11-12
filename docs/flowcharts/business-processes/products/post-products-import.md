# POST /api/products/import

Módulo: **Productos (products)** · Fuente editable: [`post-products-import.mmd`](post-products-import.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/products/import"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["InventoryService.importProductsExcel<br/><small>app/core/services/inventory.service.ts</small>"]
  n6["InventoryPageComponent.onImportFile<br/><small>app/features/dashboard/inventory/inventory-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/products/import<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14["ProductsController.importExcel<br/><small>api/products/presentation/controllers/products.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["ImportProductsFromExcelUseCase.execute<br/><small>api/products/application/use-cases/import-products-from-excel.use-case.ts</small>"]
  n17{"¿!sheet #124;#124; sheet.rowCount === 0?<br/><small>L109</small>"}
  n18(["BadRequestException('El archivo no contiene ninguna hoja con datos.')"])
  n19{"¿!headersMatch?<br/><small>L118</small>"}
  n20(["BadRequestException( 'Los encabezados del archivo no coinciden con la plantilla esperada. Descarga la plantilla e intenta de nuevo. Enca"])
  n21{"¿rawDataRowCount #gt; IMPORT_ROW_LIMIT?<br/><small>L125</small>"}
  n22(["BadRequestException( 'El archivo tiene ${rawDataRowCount} filas de datos — el máximo permitido por importación es ${IMPORT_ROW_LIMIT}. D"])
  end
  n23["Puerto CategoryRepository<br/><small>findByActiveName</small>"]
  n24["Puerto BusinessRepository<br/><small>findByActiveName</small>"]
  n25["Puerto UnitOfMeasureRepository<br/><small>findByActiveName</small>"]
  n26["Puerto PresentationTypeRepository<br/><small>findByActiveName</small>"]
  n27["Otro caso de uso: CreateProductUseCase.execute"]
  n28["Otro caso de uso: CreatePresentationUseCase.execute"]
  n29(["Fin: la interfaz se actualiza<br/>this.isImporting.set<br/>this.importResult.set<br/>this.isImportResultsOpen.set<br/>this.notificationService.error"])
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
  n19 -->|no| n21
  n21 -->|sí| n22
  n22 --> n2
  n16 -.->|consulta| n23
  n16 -.->|consulta| n24
  n16 -.->|consulta| n25
  n16 -.->|consulta| n26
  n21 -->|no| n27
  n21 -->|no| n28
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
  class n2,n3,n11,n13,n18,n20,n22 err
  class n5,n6,n7 fe
  class n8,n29 ok
  class n10,n12,n17,n19,n21 dec
  class n14 api
  class n16,n27,n28 app
  class n23,n24,n25,n26 dom
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/products/import: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** InventoryPageComponent.onImportFile (comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts`](../../../../comercial-jhoel-api/src/modules/products/presentation/controllers/products.controller.ts), [`comercial-jhoel-app/src/app/core/services/inventory.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/inventory.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/inventory/inventory-page.component.ts), [`comercial-jhoel-api/src/modules/products/application/use-cases/import-products-from-excel.use-case.ts`](../../../../comercial-jhoel-api/src/modules/products/application/use-cases/import-products-from-excel.use-case.ts), [`comercial-jhoel-api/src/modules/categories/domain/repositories/category.repository.ts`](../../../../comercial-jhoel-api/src/modules/categories/domain/repositories/category.repository.ts), [`comercial-jhoel-api/src/modules/businesses/domain/repositories/business.repository.ts`](../../../../comercial-jhoel-api/src/modules/businesses/domain/repositories/business.repository.ts), [`comercial-jhoel-api/src/modules/units-of-measure/domain/repositories/unit-of-measure.repository.ts`](../../../../comercial-jhoel-api/src/modules/units-of-measure/domain/repositories/unit-of-measure.repository.ts), [`comercial-jhoel-api/src/modules/presentation-types/domain/repositories/presentation-type.repository.ts`](../../../../comercial-jhoel-api/src/modules/presentation-types/domain/repositories/presentation-type.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | !sheet || sheet.rowCount === 0 | !headersMatch | rawDataRowCount > IMPORT_ROW_LIMIT
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
