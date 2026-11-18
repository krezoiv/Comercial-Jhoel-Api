# Qué módulos usan las tablas — Control de Efectivo (Kardex, cortes, arqueos, Bodega)

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`table-usage-cash-control.mmd`](table-usage-cash-control.mmd) · [Índice de diagramas](../README.md)

```mermaid
flowchart LR
  n1[("cash_count_details")]
  n2["Control de Efectivo (Kardex, cortes, arqueos, Bodega)<br/><small>api/cash-control</small>"]
  n3[("cash_count_drafts")]
  n4[("cash_counts")]
  n5[("cash_cut_bank_reconciliations")]
  n6["Revisión de días operativos<br/><small>api/financial-day-review</small>"]
  n7[("cash_cut_count_details")]
  n8[("cash_cut_counts")]
  n9[("cash_cut_events")]
  n10[("cash_cut_periods")]
  n11["Cuentas por Cobrar<br/><small>api/accounts-receivable</small>"]
  n12[("cash_cut_schedule_changes")]
  n13[("cash_movement_details")]
  n14[("cash_operational_days")]
  n15[("cash_warehouse_transfers")]
  n16[("warehouse_cash_count_details")]
  n17[("warehouse_cash_counts")]
  n18[("warehouse_cash_movement_details")]
  n19[("warehouse_cash_movements")]
  n20[("warehouse_cash_withdrawals")]
  n2 -->|consulta · escribe vía register_cash_count()| n1
  n2 -->|consulta · escribe (SQL)| n3
  n2 -->|consulta · escribe vía register_cash_count()| n4
  n2 -->|consulta · escribe vía finish_cash_cut_period()| n5
  n6 -->|consulta · escribe vía correct_financial_day_snapshot()| n5
  n2 -->|consulta · escribe vía finish_cash_cut_period()| n7
  n2 -->|consulta · escribe vía finish_cash_cut_period() …| n8
  n6 -->|consulta · escribe vía correct_financial_day_snapshot()| n8
  n2 -->|consulta · escribe vía finish_cash_cut_period() …| n9
  n11 -->|consulta| n10
  n2 -->|consulta · escribe vía finish_cash_cut_period() …| n10
  n6 -->|consulta · escribe vía correct_financial_day_snapshot()| n10
  n2 -->|consulta · escribe vía update_cash_cut_schedule()| n12
  n2 -->|consulta · escribe vía register_cash_bank_deposit() …| n13
  n11 -->|consulta| n14
  n2 -->|consulta · escribe vía close_cash_operational_day() …| n14
  n6 -->|consulta · escribe vía correct_financial_day_snapshot()| n14
  n2 -->|consulta · escribe vía register_cash_warehouse_transfer() …| n15
  n2 -->|consulta · escribe vía register_warehouse_cash_count()| n16
  n2 -->|consulta · escribe vía register_warehouse_cash_count()| n17
  n2 -->|consulta · escribe vía register_warehouse_withdrawal()| n18
  n2 -->|consulta · escribe vía void_cash_warehouse_transfer() …| n19
  n2 -->|consulta · escribe vía register_warehouse_withdrawal() …| n20
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
  class n1,n3,n4,n5,n7,n8,n9,n10,n12,n13,n14,n15,n16,n17,n18,n19,n20 db
  class n2,n6,n11 app
```

## Explicación

1. **¿Qué proceso representa?** Módulos del backend que usan cada tabla y cómo: entidad TypeORM, consulta SQL, escritura SQL directa o escritura a través de una función PL/pgSQL
2. **¿Dónde comienza?** Código de comercial-jhoel-api/src/modules (sin migraciones ni pruebas)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules`](../../../comercial-jhoel-api/src/modules)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica
6. **¿Dónde se almacenan los datos?** cash_count_details, cash_count_drafts, cash_counts, cash_cut_bank_reconciliations, cash_cut_count_details, cash_cut_counts, cash_cut_events, cash_cut_periods, cash_cut_schedule_changes, cash_movement_details, cash_operational_days, cash_warehouse_transfers, warehouse_cash_count_details, warehouse_cash_counts, warehouse_cash_movement_details, warehouse_cash_movements, warehouse_cash_withdrawals
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** No aplica

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
