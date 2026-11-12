# Mapa de AssetsController

Módulo: **Activos (assets)** · Fuente editable: [`assetscontroller.mmd`](assetscontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["AssetService<br/><small>app/core/services/asset.service.ts</small>"]
  n3["AssetFormModalComponent<br/><small>app/features/dashboard/assets/components/asset-form-modal/asset-form-modal.component.ts</small>"]
  n4["AssetsPageComponent<br/><small>app/features/dashboard/assets/assets-page.component.ts</small>"]
  end
  subgraph s5["AssetsController (api/assets/presentation/controllers/assets.controller.ts)"]
  n6["POST /api/assets<br/><small>create() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n7["GET /api/assets<br/><small>findAll()</small>"]
  n8["GET /api/assets/summary<br/><small>getActiveBalanceSummary()</small>"]
  n9["GET /api/assets/:id<br/><small>findOne()</small>"]
  n10["PATCH /api/assets/:id<br/><small>update() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n11["DELETE /api/assets/:id<br/><small>deactivate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n12["POST /api/assets/:clientId/charges<br/><small>registerCharge() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n13["POST /api/assets/:clientId/payments<br/><small>registerPayment() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n14["GET /api/assets/:clientId/statement<br/><small>getStatement()</small>"]
  n15["GET /api/assets/:clientId/balance<br/><small>getCurrentBalance()</small>"]
  end
  subgraph s16["Aplicación"]
  n17["CreateAssetUseCase<br/><small>api/assets/application/use-cases/create-asset.use-case.ts</small>"]
  n18["ListAssetsUseCase<br/><small>api/assets/application/use-cases/list-assets.use-case.ts</small>"]
  n19["GetAssetActiveBalanceUseCase<br/><small>api/assets/application/use-cases/get-asset-active-balance.use-case.ts</small>"]
  n20["GetAssetByIdUseCase<br/><small>api/assets/application/use-cases/get-asset-by-id.use-case.ts</small>"]
  n21["UpdateAssetUseCase<br/><small>api/assets/application/use-cases/update-asset.use-case.ts</small>"]
  n22["DeactivateAssetUseCase<br/><small>api/assets/application/use-cases/deactivate-asset.use-case.ts</small>"]
  n23["RegisterAssetChargeUseCase<br/><small>api/assets/application/use-cases/register-asset-charge.use-case.ts</small>"]
  n24["RegisterAssetPaymentUseCase<br/><small>api/assets/application/use-cases/register-asset-payment.use-case.ts</small>"]
  n25["GetAssetStatementUseCase<br/><small>api/assets/application/use-cases/get-asset-statement.use-case.ts</small>"]
  n26["GetAssetCurrentBalanceUseCase<br/><small>api/assets/application/use-cases/get-asset-current-balance.use-case.ts</small>"]
  end
  subgraph s27["Dominio · Infraestructura · PostgreSQL"]
  n28["AssetRepository"]
  n29["TypeOrmAssetRepository<br/><small>api/assets/infrastructure/persistence/typeorm-asset.repository.ts</small>"]
  n30["ClientRepository"]
  n31["TypeOrmClientRepository<br/><small>api/clients/infrastructure/persistence/typeorm-client.repository.ts</small>"]
  n32[["register_asset_movement()"]]
  n33[("assets")]
  n34[("clients")]
  n35[("users")]
  n36[("movements")]
  end
  n3 -->|submit→createAsset, submit→updateAsset| n2
  n4 -->|fetchRecords→getAssets, fetchActiveBalance→getActiveBalance, confirmDelete→deleteAsset| n2
  n2 -->|createAsset| n6
  n2 -->|getAssets| n7
  n2 -->|getActiveBalance| n8
  n2 -->|getAssetById| n9
  n2 -->|updateAsset| n10
  n2 -->|deleteAsset| n11
  n2 -->|registerCharge| n12
  n2 -->|registerPayment| n13
  n2 -->|getStatement| n14
  n2 -->|getCurrentBalance| n15
  n6 --> n17
  n7 --> n18
  n8 --> n19
  n9 --> n20
  n10 --> n21
  n11 --> n22
  n12 --> n23
  n13 --> n24
  n14 --> n25
  n15 --> n26
  n17 -->|create| n28
  n28 -->|implementa| n29
  n17 -->|findById| n30
  n30 -->|implementa| n31
  n18 -->|findAll| n28
  n19 -->|getReportSummary| n28
  n20 -->|findById| n28
  n21 -->|findById, update| n28
  n21 -->|findById| n30
  n22 -->|findById, deactivate| n28
  n23 -->|registerMovement| n28
  n29 -->|registerMovement| n32
  n32 -->|escribe| n33
  n23 -->|findById| n30
  n24 -->|registerMovement| n28
  n24 -->|findById| n30
  n25 -->|getStatement| n28
  n29 -->|getStatement| n34
  n29 -->|getStatement| n33
  n29 -->|getStatement| n35
  n29 -->|getStatement| n36
  n25 -->|findById| n30
  n26 -->|getCurrentBalance| n28
  n29 -->|getCurrentBalance| n33
  n26 -->|findById| n30
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
  class n2,n3,n4 fe
  class n6,n7,n8,n9,n10,n11,n12,n13,n14,n15 api
  class n17,n18,n19,n20,n21,n22,n23,n24,n25,n26 app
  class n28,n30 dom
  class n29,n31 infra
  class n32,n33,n34,n35,n36 db
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a AssetsController, sus 10 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts`](../../../../comercial-jhoel-api/src/modules/assets/presentation/controllers/assets.controller.ts), [`comercial-jhoel-app/src/app/core/services/asset.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/asset.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-form-modal/asset-form-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/components/asset-form-modal/asset-form-modal.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/assets/assets-page.component.ts), [`comercial-jhoel-api/src/modules/assets/application/use-cases/create-asset.use-case.ts`](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/create-asset.use-case.ts), [`comercial-jhoel-api/src/modules/assets/application/use-cases/list-assets.use-case.ts`](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/list-assets.use-case.ts), [`comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-active-balance.use-case.ts`](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-active-balance.use-case.ts), [`comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/assets/application/use-cases/update-asset.use-case.ts`](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/update-asset.use-case.ts), [`comercial-jhoel-api/src/modules/assets/application/use-cases/deactivate-asset.use-case.ts`](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/deactivate-asset.use-case.ts), [`comercial-jhoel-api/src/modules/assets/application/use-cases/register-asset-charge.use-case.ts`](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/register-asset-charge.use-case.ts), [`comercial-jhoel-api/src/modules/assets/application/use-cases/register-asset-payment.use-case.ts`](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/register-asset-payment.use-case.ts), [`comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-statement.use-case.ts`](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-statement.use-case.ts), [`comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-current-balance.use-case.ts`](../../../../comercial-jhoel-api/src/modules/assets/application/use-cases/get-asset-current-balance.use-case.ts), [`comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts`](../../../../comercial-jhoel-api/src/modules/assets/infrastructure/persistence/typeorm-asset.repository.ts), [`comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts`](../../../../comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/assets/
6. **¿Dónde se almacenan los datos?** assets, clients, users, movements
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
