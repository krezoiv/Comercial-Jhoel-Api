# POST /api/catalog-banks/:id/image

Módulo: **Catálogo de bancos (catalog-banks)** · Fuente editable: [`post-catalog-banks-id-image.mmd`](post-catalog-banks-id-image.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/catalog-banks/:id/image"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["CatalogBankService.setImage<br/><small>app/core/services/catalog-bank.service.ts</small>"]
  n6["BankImageModalComponent.onFileSelected<br/><small>app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/catalog-banks/:id/image<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n13(["403 Sin permisos"])
  n14["CatalogBanksController.setImage<br/><small>api/catalog-banks/presentation/controllers/catalog-banks.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["SetCatalogBankImageUseCase.execute<br/><small>api/catalog-banks/application/use-cases/set-catalog-bank-image.use-case.ts</small>"]
  n17{"¿!bank?<br/><small>L22</small>"}
  n18(["CatalogBankNotFoundError(input.catalogBankId)"])
  n19["assertValidCatalogBankImage()<br/><small>llamada en L25</small><br/><small>api/catalog-banks/application/utils/assert-valid-catalog-bank-image.ts</small>"]
  n20{"¿!file #124;#124; file.size === 0?<br/><small>L15</small>"}
  n21(["InvalidCatalogBankImageError('La imagen está vacía.')"])
  n22{"¿!ALLOWED_MIME_TYPES.has(file.mimetype)?<br/><small>L18</small>"}
  n23(["InvalidCatalogBankImageError('La imagen debe ser JPG, PNG o WEBP.')"])
  n24{"¿file.size #gt; MAX_CATALOG_BANK_IMAGE_SIZE_BYTES?<br/><small>L21</small>"}
  n25(["InvalidCatalogBankImageError('La imagen no puede superar los 5 MB.')"])
  end
  subgraph s26["Dominio → Infraestructura"]
  n27["Puerto CatalogBankRepository.findById / setImage<br/>@Inject(CATALOG_BANK_REPOSITORY)"]
  n28["TypeOrmCatalogBankRepository<br/><small>api/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts</small>"]
  n29[("findById: TypeORM Repository")]
  n30[("setImage: TypeORM Repository")]
  end
  n31(["Fin: la interfaz se actualiza<br/>this.notificationService.error<br/>this.isUploading.set"])
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
  n19 --> n20
  n20 -->|sí| n21
  n21 --> n2
  n20 -->|no| n22
  n22 -->|sí| n23
  n23 --> n2
  n22 -->|no| n24
  n24 -->|sí| n25
  n25 --> n2
  n24 -->|no| n27
  n27 -->|implementa| n28
  n28 --> n29
  n29 --> n8
  n28 --> n30
  n30 --> n8
  n8 --> n31
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
  class n2,n3,n11,n13,n18,n21,n23,n25 err
  class n5,n6,n7 fe
  class n8,n31 ok
  class n10,n12,n17,n20,n22,n24 dec
  class n14 api
  class n16 app
  class n19,n27 dom
  class n28 infra
  class n29,n30 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/catalog-banks/:id/image: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** BankImageModalComponent.onFileSelected (comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts`](../../../../comercial-jhoel-api/src/modules/catalog-banks/presentation/controllers/catalog-banks.controller.ts), [`comercial-jhoel-app/src/app/core/services/catalog-bank.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/catalog-bank.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-banks/components/bank-image-modal/bank-image-modal.component.ts), [`comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/set-catalog-bank-image.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/use-cases/set-catalog-bank-image.use-case.ts), [`comercial-jhoel-api/src/modules/catalog-banks/application/utils/assert-valid-catalog-bank-image.ts`](../../../../comercial-jhoel-api/src/modules/catalog-banks/application/utils/assert-valid-catalog-bank-image.ts), [`comercial-jhoel-api/src/modules/catalog-banks/domain/repositories/catalog-bank.repository.ts`](../../../../comercial-jhoel-api/src/modules/catalog-banks/domain/repositories/catalog-bank.repository.ts), [`comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts`](../../../../comercial-jhoel-api/src/modules/catalog-banks/infrastructure/persistence/typeorm-catalog-bank.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | !bank | !file || file.size === 0 | !ALLOWED_MIME_TYPES.has(file.mimetype) | file.size > MAX_CATALOG_BANK_IMAGE_SIZE_BYTES
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
