# Modelo entidad-relación — Control de Efectivo (Kardex, cortes, arqueos, Bodega)

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`er-cash-control.mmd`](er-cash-control.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  cash_count_details {
    uuid id PK
    uuid count_id FK
    integer quantity
    numeric subtotal
  }
  cash_counts {
    uuid id PK
    bigint number
    date business_date
    uuid day_opening_id FK
    numeric total_counted
    numeric warehouse_balance
    character_varying status
    uuid replaces_id FK
    uuid replaced_by_id FK
    uuid created_by FK
  }
  cash_cut_bank_reconciliations {
    uuid id PK
    uuid cut_period_id FK
    uuid count_id FK
    uuid bank_id FK
    character_varying bank_name
    numeric system_balance
    numeric verified_balance
    uuid created_by FK
  }
  cash_cut_count_details {
    uuid id PK
    uuid count_id FK
    integer quantity
    numeric subtotal
  }
  cash_cut_counts {
    uuid id PK
    uuid cut_period_id FK
    numeric total_counted
    uuid created_by FK
  }
  cash_cut_events {
    uuid id PK
    uuid cut_period_id FK
    uuid performed_by FK
  }
  cash_cut_periods {
    uuid id PK
    uuid operational_day_id FK
    smallint period_number
    character_varying status
    numeric total_in
    numeric total_out
    jsonb opening_bank_balances
    uuid opened_by FK
    uuid closed_by FK
  }
  cash_cut_schedule_changes {
    uuid id PK
    uuid cut_period_id FK
    uuid changed_by FK
  }
  cash_movement_details {
    uuid id PK
    uuid movement_id FK
    integer quantity
    numeric subtotal
  }
  cash_operational_days {
    uuid id PK
    date operational_date
    character_varying status
    uuid previous_day_id FK
    uuid previous_cut_id FK
    uuid opened_by FK
    numeric total_in
    numeric total_out
    uuid closed_by FK
  }
  cash_warehouse_transfers {
    uuid id PK
    bigint number
    character_varying reference_number
    numeric amount
    date business_date
    uuid day_opening_id FK
    uuid cash_movement_id FK
    uuid warehouse_movement_id FK
    character_varying status
    uuid voided_by FK
    uuid created_by FK
  }
  warehouse_cash_movement_details {
    uuid id PK
    uuid movement_id FK
    integer quantity
    numeric subtotal
  }
  warehouse_cash_movements {
    uuid id PK
    date business_date
    uuid day_opening_id FK
    character_varying movement_type
    character_varying direction
    numeric amount
    numeric previous_balance
    numeric new_balance
    character_varying reference_type
    uuid reversal_of_id FK
    character_varying status
    uuid voided_by FK
  }
  warehouse_cash_withdrawals {
    uuid id PK
    bigint number
    character_varying reference_number
    numeric amount
    uuid bank_id FK
    date business_date
    uuid day_opening_id FK
    uuid warehouse_movement_id FK
    uuid cash_movement_id FK
    uuid bank_movement_id FK
    character_varying status
    uuid voided_by FK
  }
  users {
    uuid id PK
  }
  day_openings {
    uuid id PK
  }
  banks {
    uuid id PK
  }
  cash_movements {
    uuid id PK
  }
  bank_account_movements {
    uuid id PK
  }
  cash_counts ||--o{ cash_count_details : "count_id"
  cash_counts |o--o{ cash_counts : "replaced_by_id"
  users ||--o{ cash_counts : "created_by"
  day_openings ||--o{ cash_counts : "day_opening_id"
  cash_counts |o--o{ cash_counts : "replaces_id"
  banks ||--o{ cash_cut_bank_reconciliations : "bank_id"
  cash_cut_counts ||--o{ cash_cut_bank_reconciliations : "count_id"
  users ||--o{ cash_cut_bank_reconciliations : "created_by"
  cash_cut_periods ||--o{ cash_cut_bank_reconciliations : "cut_period_id"
  cash_cut_counts ||--o{ cash_cut_count_details : "count_id"
  users ||--o{ cash_cut_counts : "created_by"
  cash_cut_periods ||--o{ cash_cut_counts : "cut_period_id"
  cash_cut_periods ||--o{ cash_cut_events : "cut_period_id"
  users ||--o{ cash_cut_events : "performed_by"
  users |o--o{ cash_cut_periods : "closed_by"
  users |o--o{ cash_cut_periods : "opened_by"
  cash_operational_days ||--o{ cash_cut_periods : "operational_day_id"
  users ||--o{ cash_cut_schedule_changes : "changed_by"
  cash_cut_periods ||--o{ cash_cut_schedule_changes : "cut_period_id"
  cash_movements ||--o{ cash_movement_details : "movement_id"
  cash_cut_periods |o--o{ cash_operational_days : "previous_cut_id"
  users |o--o{ cash_operational_days : "closed_by"
  users ||--o{ cash_operational_days : "opened_by"
  cash_operational_days |o--o{ cash_operational_days : "previous_day_id"
  cash_movements ||--o| cash_warehouse_transfers : "cash_movement_id"
  users ||--o{ cash_warehouse_transfers : "created_by"
  day_openings ||--o{ cash_warehouse_transfers : "day_opening_id"
  users |o--o{ cash_warehouse_transfers : "voided_by"
  warehouse_cash_movements ||--o| cash_warehouse_transfers : "warehouse_movement_id"
  warehouse_cash_movements ||--o{ warehouse_cash_movement_details : "movement_id"
  users ||--o{ warehouse_cash_movements : "created_by"
  day_openings |o--o{ warehouse_cash_movements : "day_opening_id"
  warehouse_cash_movements |o--o{ warehouse_cash_movements : "reversal_of_id"
  users |o--o{ warehouse_cash_movements : "voided_by"
  banks |o--o{ warehouse_cash_withdrawals : "bank_id"
  bank_account_movements |o--o{ warehouse_cash_withdrawals : "bank_movement_id"
  cash_movements |o--o{ warehouse_cash_withdrawals : "cash_movement_id"
  users ||--o{ warehouse_cash_withdrawals : "created_by"
  day_openings ||--o{ warehouse_cash_withdrawals : "day_opening_id"
  users |o--o{ warehouse_cash_withdrawals : "voided_by"
  warehouse_cash_movements ||--o| warehouse_cash_withdrawals : "warehouse_movement_id"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio cash-control (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** cash_count_details, cash_counts, cash_cut_bank_reconciliations, cash_cut_count_details, cash_cut_counts, cash_cut_events, cash_cut_periods, cash_cut_schedule_changes, cash_movement_details, cash_operational_days, cash_warehouse_transfers, warehouse_cash_movement_details, warehouse_cash_movements, warehouse_cash_withdrawals
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
