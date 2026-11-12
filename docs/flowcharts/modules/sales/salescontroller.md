# Mapa de SalesController

Módulo: **Ventas (sales)** · Fuente editable: [`salescontroller.mmd`](salescontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["SalesService<br/><small>app/core/services/sales.service.ts</small>"]
  n3["SalesAdminPageComponent<br/><small>app/features/dashboard/sales-admin/sales-admin-page.component.ts</small>"]
  n4["SalesDraftStore<br/><small>app/core/services/sales-draft.store.ts</small>"]
  n5["SalesDailyChartComponent<br/><small>app/features/dashboard/graphs/components/sales-daily-chart/sales-daily-chart.component.ts</small>"]
  n6["SalesWeeklyChartComponent<br/><small>app/features/dashboard/graphs/components/sales-weekly-chart/sales-weekly-chart.component.ts</small>"]
  n7["SalesYearlyChartComponent<br/><small>app/features/dashboard/graphs/components/sales-yearly-chart/sales-yearly-chart.component.ts</small>"]
  n8["SaleDetailModalComponent<br/><small>app/features/dashboard/sales-admin/components/sale-detail-modal/sale-detail-modal.component.ts</small>"]
  end
  subgraph s9["SalesController (api/sales/presentation/controllers/sales.controller.ts)"]
  n10["POST /api/sales<br/><small>create()</small>"]
  n11["GET /api/sales<br/><small>findAll()</small>"]
  n12["POST /api/sales/:id/void<br/><small>voidSale() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n13["POST /api/sales/items<br/><small>adjustItem()</small>"]
  n14["GET /api/sales/current<br/><small>getCurrent()</small>"]
  n15["PATCH /api/sales/current/pricing<br/><small>configurePricing()</small>"]
  n16["POST /api/sales/confirm<br/><small>confirm()</small>"]
  n17["DELETE /api/sales/current<br/><small>cancelCurrent()</small>"]
  n18["GET /api/sales/daily-stats<br/><small>dailyStats()</small>"]
  n19["GET /api/sales/weekly-stats<br/><small>weeklyStats()</small>"]
  n20["GET /api/sales/yearly-stats<br/><small>yearlyStats()</small>"]
  n21["GET /api/sales/:id/pdf<br/><small>getPdf()</small>"]
  n22["GET /api/sales/:id<br/><small>findOne()</small>"]
  end
  subgraph s23["Aplicación"]
  n24["CreateSaleUseCase<br/><small>api/sales/application/use-cases/create-sale.use-case.ts</small>"]
  n25["ListSalesUseCase<br/><small>api/sales/application/use-cases/list-sales.use-case.ts</small>"]
  n26["VoidSaleUseCase<br/><small>api/sales/application/use-cases/void-sale.use-case.ts</small>"]
  n27["AdjustSaleItemUseCase<br/><small>api/sales/application/use-cases/adjust-sale-item.use-case.ts</small>"]
  n28["GetOpenSalesUseCase<br/><small>api/sales/application/use-cases/get-open-sales.use-case.ts</small>"]
  n29["ConfigureSalePricingUseCase<br/><small>api/sales/application/use-cases/configure-sale-pricing.use-case.ts</small>"]
  n30["ConfirmOpenSaleUseCase<br/><small>api/sales/application/use-cases/confirm-open-sale.use-case.ts</small>"]
  n31["CancelOpenSaleUseCase<br/><small>api/sales/application/use-cases/cancel-open-sale.use-case.ts</small>"]
  n32["GetSalesDailyStatsUseCase<br/><small>api/sales/application/use-cases/get-sales-daily-stats.use-case.ts</small>"]
  n33["GetSalesWeeklyStatsUseCase<br/><small>api/sales/application/use-cases/get-sales-weekly-stats.use-case.ts</small>"]
  n34["GetSalesYearlyStatsUseCase<br/><small>api/sales/application/use-cases/get-sales-yearly-stats.use-case.ts</small>"]
  n35["GetSalePdfUseCase<br/><small>api/sales/application/use-cases/get-sale-pdf.use-case.ts</small>"]
  n36["GetSaleByIdUseCase<br/><small>api/sales/application/use-cases/get-sale-by-id.use-case.ts</small>"]
  end
  subgraph s37["Dominio · Infraestructura · PostgreSQL"]
  n38["SaleRepository"]
  n39["TypeOrmSaleRepository<br/><small>api/sales/infrastructure/persistence/typeorm-sale.repository.ts</small>"]
  n40[["confirm_sale()"]]
  n41[("inventory_movements")]
  n42[("inventory_stock")]
  n43[("products")]
  n44[("sale_details")]
  n45[("sales")]
  n46["ClientRepository"]
  n47["TypeOrmClientRepository<br/><small>api/clients/infrastructure/persistence/typeorm-client.repository.ts</small>"]
  n48[["void_sale()"]]
  n49[["adjust_sale_item()"]]
  n50[["configure_open_sale()"]]
  n51[["confirm_open_sale()"]]
  n52[["cancel_open_sale()"]]
  n53["CompanySettingsRepository"]
  n54["TypeOrmCompanySettingsRepository<br/><small>api/company-settings/infrastructure/persistence/typeorm-company-settings.repository.ts</small>"]
  end
  n3 -->|fetch→getSales, confirmVoid→voidSale| n2
  n4 -->|adjustItem→adjustSaleItem, restore→getCurrentSales, configurePricing→configurePricing …| n2
  n5 -->|fetch→getDailyStats| n2
  n6 -->|fetch→getWeeklyStats| n2
  n7 -->|fetch→getYearlyStats| n2
  n8 -->|ngOnChanges→getSaleById| n2
  n2 -->|createSale| n10
  n2 -->|getSales| n11
  n2 -->|voidSale| n12
  n2 -->|adjustSaleItem| n13
  n2 -->|getCurrentSales| n14
  n2 -->|configurePricing| n15
  n2 -->|confirmSale| n16
  n2 -->|cancelSale| n17
  n2 -->|getDailyStats| n18
  n2 -->|getWeeklyStats| n19
  n2 -->|getYearlyStats| n20
  n2 -->|exportSalePdf| n21
  n2 -->|getSaleById| n22
  n10 --> n24
  n11 --> n25
  n12 --> n26
  n13 --> n27
  n14 --> n28
  n15 --> n29
  n16 --> n30
  n17 --> n31
  n18 --> n32
  n19 --> n33
  n20 --> n34
  n21 --> n35
  n22 --> n36
  n24 -->|confirmSale| n38
  n38 -->|implementa| n39
  n39 -->|confirmSale| n40
  n40 -->|escribe| n41
  n40 -->|escribe| n42
  n40 -->|escribe| n43
  n40 -->|escribe| n44
  n40 -->|escribe| n45
  n24 -->|findById| n46
  n46 -->|implementa| n47
  n25 -->|findAll| n38
  n26 -->|findById, voidSale| n38
  n39 -->|voidSale| n48
  n48 -->|escribe| n41
  n48 -->|escribe| n42
  n48 -->|escribe| n43
  n48 -->|escribe| n45
  n27 -->|adjustItem| n38
  n39 -->|adjustItem| n49
  n49 -->|escribe| n42
  n49 -->|escribe| n43
  n49 -->|escribe| n44
  n49 -->|escribe| n45
  n28 -->|findOpenSalesByUserId| n38
  n29 -->|configureOpenSale| n38
  n39 -->|configureOpenSale| n50
  n50 -->|escribe| n45
  n29 -->|findById| n46
  n30 -->|confirmOpenSale| n38
  n39 -->|confirmOpenSale| n51
  n51 -->|escribe| n41
  n51 -->|escribe| n45
  n31 -->|cancelOpenSale| n38
  n39 -->|cancelOpenSale| n52
  n52 -->|escribe| n42
  n52 -->|escribe| n43
  n52 -->|escribe| n44
  n52 -->|escribe| n45
  n32 -->|getDailySalesTotals| n38
  n33 -->|getDailySalesTotals| n38
  n34 -->|getMonthlySalesTotals| n38
  n35 -->|findById| n38
  n35 -->|get| n53
  n53 -->|implementa| n54
  n36 -->|findById| n38
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
  class n2,n3,n4,n5,n6,n7,n8 fe
  class n10,n11,n12,n13,n14,n15,n16,n17,n18,n19,n20,n21,n22 api
  class n24,n25,n26,n27,n28,n29,n30,n31,n32,n33,n34,n35,n36 app
  class n38,n46,n53 dom
  class n39,n47,n54 infra
  class n40,n41,n42,n43,n44,n45,n48,n49,n50,n51,n52 db
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a SalesController, sus 13 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts`](../../../../comercial-jhoel-api/src/modules/sales/presentation/controllers/sales.controller.ts), [`comercial-jhoel-app/src/app/core/services/sales.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/sales.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/sales-admin-page.component.ts), [`comercial-jhoel-app/src/app/core/services/sales-draft.store.ts`](../../../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts), [`comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-daily-chart/sales-daily-chart.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-daily-chart/sales-daily-chart.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-weekly-chart/sales-weekly-chart.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-weekly-chart/sales-weekly-chart.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-yearly-chart/sales-yearly-chart.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/graphs/components/sales-yearly-chart/sales-yearly-chart.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/sale-detail-modal/sale-detail-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/sales-admin/components/sale-detail-modal/sale-detail-modal.component.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/create-sale.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/create-sale.use-case.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/list-sales.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/list-sales.use-case.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/void-sale.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/void-sale.use-case.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/adjust-sale-item.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/adjust-sale-item.use-case.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/get-open-sales.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-open-sales.use-case.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/configure-sale-pricing.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/configure-sale-pricing.use-case.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/confirm-open-sale.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/confirm-open-sale.use-case.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/cancel-open-sale.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/cancel-open-sale.use-case.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-daily-stats.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-daily-stats.use-case.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-weekly-stats.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-weekly-stats.use-case.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-yearly-stats.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sales-yearly-stats.use-case.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/get-sale-pdf.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sale-pdf.use-case.ts), [`comercial-jhoel-api/src/modules/sales/application/use-cases/get-sale-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/sales/application/use-cases/get-sale-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts`](../../../../comercial-jhoel-api/src/modules/sales/infrastructure/persistence/typeorm-sale.repository.ts), [`comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts`](../../../../comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts), [`comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/typeorm-company-settings.repository.ts`](../../../../comercial-jhoel-api/src/modules/company-settings/infrastructure/persistence/typeorm-company-settings.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/sales/
6. **¿Dónde se almacenan los datos?** inventory_movements, inventory_stock, products, sale_details, sales
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
