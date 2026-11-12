# Mapa de CatalogPhonesController

Módulo: **Catálogo de teléfonos (catalog)** · Fuente editable: [`catalogphonescontroller.mmd`](catalogphonescontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["CatalogPhoneService<br/><small>app/core/services/catalog-phone.service.ts</small>"]
  n3["CatalogPhoneFormModalComponent<br/><small>app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts</small>"]
  n4["CatalogPhonesPageComponent<br/><small>app/features/dashboard/catalog-phones/catalog-phones-page.component.ts</small>"]
  n5["CatalogPhoneImagesModalComponent<br/><small>app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.ts</small>"]
  end
  subgraph s6["CatalogPhonesController (api/catalog/presentation/controllers/catalog-phones.controller.ts)"]
  n7["POST /api/catalog/phones<br/><small>create() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n8["GET /api/catalog/phones<br/><small>findAll() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n9["GET /api/catalog/phones/:id<br/><small>findOne() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n10["PATCH /api/catalog/phones/:id<br/><small>update() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n11["POST /api/catalog/phones/:id/activate<br/><small>activate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n12["DELETE /api/catalog/phones/:id<br/><small>deactivate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n13["POST /api/catalog/phones/:id/publish<br/><small>publish() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n14["POST /api/catalog/phones/:id/unpublish<br/><small>unpublish() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n15["POST /api/catalog/phones/reorder<br/><small>reorder() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n16["POST /api/catalog/phones/:id/images<br/><small>addImage() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n17["DELETE /api/catalog/phones/:id/images/:imageId<br/><small>removeImage() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n18["POST /api/catalog/phones/:id/images/:imageId/primary<br/><small>setPrimaryImage() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  end
  subgraph s19["Aplicación"]
  n20["CreateCatalogPhoneUseCase<br/><small>api/catalog/application/use-cases/create-catalog-phone.use-case.ts</small>"]
  n21["ListCatalogPhonesUseCase<br/><small>api/catalog/application/use-cases/list-catalog-phones.use-case.ts</small>"]
  n22["GetCatalogPhoneByIdUseCase<br/><small>api/catalog/application/use-cases/get-catalog-phone-by-id.use-case.ts</small>"]
  n23["UpdateCatalogPhoneUseCase<br/><small>api/catalog/application/use-cases/update-catalog-phone.use-case.ts</small>"]
  n24["ActivateCatalogPhoneUseCase<br/><small>api/catalog/application/use-cases/activate-catalog-phone.use-case.ts</small>"]
  n25["DeactivateCatalogPhoneUseCase<br/><small>api/catalog/application/use-cases/deactivate-catalog-phone.use-case.ts</small>"]
  n26["PublishCatalogPhoneUseCase<br/><small>api/catalog/application/use-cases/publish-catalog-phone.use-case.ts</small>"]
  n27["UnpublishCatalogPhoneUseCase<br/><small>api/catalog/application/use-cases/unpublish-catalog-phone.use-case.ts</small>"]
  n28["ReorderCatalogPhonesUseCase<br/><small>api/catalog/application/use-cases/reorder-catalog-phones.use-case.ts</small>"]
  n29["AddCatalogPhoneImageUseCase<br/><small>api/catalog/application/use-cases/add-catalog-phone-image.use-case.ts</small>"]
  n30["RemoveCatalogPhoneImageUseCase<br/><small>api/catalog/application/use-cases/remove-catalog-phone-image.use-case.ts</small>"]
  n31["SetPrimaryCatalogPhoneImageUseCase<br/><small>api/catalog/application/use-cases/set-primary-catalog-phone-image.use-case.ts</small>"]
  end
  subgraph s32["Dominio · Infraestructura · PostgreSQL"]
  n33["CatalogPhoneRepository"]
  n34["TypeOrmCatalogPhoneRepository<br/><small>api/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts</small>"]
  n35["CompanySettingsRepository"]
  n36["TypeOrmCompanySettingsRepository<br/><small>api/company-settings/infrastructure/persistence/typeorm-company-settings.repository.ts</small>"]
  end
  n3 -->|submit→createPhone, submit→updatePhone| n2
  n4 -->|fetchPhones→getPhones, toggleActive→activatePhone, toggleActive→deactivatePhone …| n2
  n5 -->|refetch→getPhoneById, onFileSelected→addImage, removeImage→removeImage …| n2
  n2 -->|createPhone| n7
  n2 -->|getPhones| n8
  n2 -->|getPhoneById| n9
  n2 -->|updatePhone| n10
  n2 -->|activatePhone| n11
  n2 -->|deactivatePhone| n12
  n2 -->|publishPhone| n13
  n2 -->|unpublishPhone| n14
  n2 -->|reorderPhones| n15
  n2 -->|addImage| n16
  n2 -->|removeImage| n17
  n2 -->|setPrimaryImage| n18
  n7 --> n20
  n8 --> n21
  n9 --> n22
  n10 --> n23
  n11 --> n24
  n12 --> n25
  n13 --> n26
  n14 --> n27
  n15 --> n28
  n16 --> n29
  n17 --> n30
  n18 --> n31
  n20 -->|create| n33
  n33 -->|implementa| n34
  n20 -->|get| n35
  n35 -->|implementa| n36
  n21 -->|findAll| n33
  n21 -->|get| n35
  n22 -->|findById| n33
  n22 -->|get| n35
  n23 -->|findById, update| n33
  n23 -->|get| n35
  n24 -->|findById, setActive| n33
  n25 -->|findById, setPublished, setActive| n33
  n26 -->|findById, setPublished| n33
  n27 -->|findById, setPublished| n33
  n28 -->|findById, reorder| n33
  n29 -->|findById, addImage| n33
  n30 -->|findById, removeImage, listImages …| n33
  n31 -->|findById, setPrimaryImage| n33
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
  class n2,n3,n4,n5 fe
  class n7,n8,n9,n10,n11,n12,n13,n14,n15,n16,n17,n18 api
  class n20,n21,n22,n23,n24,n25,n26,n27,n28,n29,n30,n31 app
  class n33,n35 dom
  class n34,n36 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a CatalogPhonesController, sus 12 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts`](../../../../comercial-jhoel-api/src/modules/catalog/presentation/controllers/catalog-phones.controller.ts), [`comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/catalog-phone.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-form-modal/catalog-phone-form-modal.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/catalog-phones-page.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/catalog-phones/components/catalog-phone-images-modal/catalog-phone-images-modal.component.ts), [`comercial-jhoel-api/src/modules/catalog/application/use-cases/create-catalog-phone.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/create-catalog-phone.use-case.ts), [`comercial-jhoel-api/src/modules/catalog/application/use-cases/list-catalog-phones.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/list-catalog-phones.use-case.ts), [`comercial-jhoel-api/src/modules/catalog/application/use-cases/get-catalog-phone-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/get-catalog-phone-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/catalog/application/use-cases/update-catalog-phone.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/update-catalog-phone.use-case.ts), [`comercial-jhoel-api/src/modules/catalog/application/use-cases/activate-catalog-phone.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/activate-catalog-phone.use-case.ts), [`comercial-jhoel-api/src/modules/catalog/application/use-cases/deactivate-catalog-phone.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/deactivate-catalog-phone.use-case.ts), [`comercial-jhoel-api/src/modules/catalog/application/use-cases/publish-catalog-phone.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/publish-catalog-phone.use-case.ts), [`comercial-jhoel-api/src/modules/catalog/application/use-cases/unpublish-catalog-phone.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/unpublish-catalog-phone.use-case.ts), [`comercial-jhoel-api/src/modules/catalog/application/use-cases/reorder-catalog-phones.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/reorder-catalog-phones.use-case.ts), [`comercial-jhoel-api/src/modules/catalog/application/use-cases/add-catalog-phone-image.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/add-catalog-phone-image.use-case.ts), [`comercial-jhoel-api/src/modules/catalog/application/use-cases/remove-catalog-phone-image.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/remove-catalog-phone-image.use-case.ts), [`comercial-jhoel-api/src/modules/catalog/application/use-cases/set-primary-catalog-phone-image.use-case.ts`](../../../../comercial-jhoel-api/src/modules/catalog/application/use-cases/set-primary-catalog-phone-image.use-case.ts), [`comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts`](../../../../comercial-jhoel-api/src/modules/catalog/infrastructure/persistence/typeorm-catalog-phone.repository.ts), [`comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/typeorm-company-settings.repository.ts`](../../../../comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/typeorm-company-settings.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/catalog/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
