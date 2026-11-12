# Modelo entidad-relación — Recargas electrónicas

Módulo: **Recargas electrónicas (recharges)** · Fuente editable: [`er-recharges.mmd`](er-recharges.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  recharge_daily_balances {
    uuid id PK
    uuid recharge_type_id FK
    date date
    numeric previous_balance
    numeric daily_balance
    numeric final_balance
    uuid created_by FK
    uuid updated_by FK
    timestamp_with_time_zone updated_at
  }
  recharge_day_audit_logs {
    uuid id PK
    date date
    uuid performed_by FK
    character_varying previous_status
    character_varying new_status
  }
  recharge_day_openings {
    uuid id PK
    date date
    uuid opened_by FK
    uuid closed_by FK
    uuid reopened_by FK
    uuid cancelled_by FK
  }
  recharge_purchases {
    uuid id PK
    uuid recharge_type_id FK
    uuid daily_balance_id FK
    numeric amount
    date purchase_date
    uuid created_by FK
    numeric credited_amount
    uuid voided_by FK
  }
  recharge_sales {
    uuid id PK
    uuid recharge_type_id FK
    uuid daily_balance_id FK
    character_varying phone_number
    numeric amount
    date sale_date
    uuid created_by FK
    uuid updated_by FK
    timestamp_with_time_zone updated_at
  }
  recharge_sales_closures {
    uuid id PK
    date date
    numeric total_sales
    numeric total_collected
    uuid created_by FK
    uuid updated_by FK
    timestamp_with_time_zone updated_at
  }
  recharge_sim_daily_stock {
    uuid id PK
    uuid sim_type_id FK
    date date
    uuid created_by FK
    uuid updated_by FK
    timestamp_with_time_zone updated_at
  }
  recharge_sim_dpi_images {
    uuid id PK
    character_varying mime_type
    uuid created_by FK
  }
  recharge_sim_sale_registrations {
    uuid id PK
    uuid recharge_sim_sale_id FK
    character_varying sim_number
    uuid client_id FK
    date sale_date
    uuid dpi_image_id FK
    uuid voided_by FK
    uuid created_by FK
  }
  recharge_sim_sales {
    uuid id PK
    uuid sim_type_id FK
    uuid daily_stock_id FK
    integer quantity
    numeric total_amount
    date sale_date
    uuid created_by FK
    uuid voided_by FK
  }
  recharge_sim_types {
    uuid id PK
    character_varying name
    timestamp_with_time_zone updated_at
  }
  recharge_types {
    uuid id PK
    character_varying name
    timestamp_with_time_zone updated_at
    numeric min_balance
    numeric balance_limit
  }
  users {
    uuid id PK
  }
  clients {
    uuid id PK
  }
  users ||--o{ recharge_daily_balances : "created_by"
  recharge_types ||--o{ recharge_daily_balances : "recharge_type_id"
  users |o--o{ recharge_daily_balances : "updated_by"
  users ||--o{ recharge_day_audit_logs : "performed_by"
  users |o--o{ recharge_day_openings : "cancelled_by"
  users |o--o{ recharge_day_openings : "closed_by"
  users ||--o{ recharge_day_openings : "opened_by"
  users |o--o{ recharge_day_openings : "reopened_by"
  users ||--o{ recharge_purchases : "created_by"
  recharge_daily_balances ||--o{ recharge_purchases : "daily_balance_id"
  recharge_types ||--o{ recharge_purchases : "recharge_type_id"
  users |o--o{ recharge_purchases : "voided_by"
  users ||--o{ recharge_sales : "created_by"
  recharge_daily_balances ||--o{ recharge_sales : "daily_balance_id"
  recharge_types ||--o{ recharge_sales : "recharge_type_id"
  users |o--o{ recharge_sales : "updated_by"
  users ||--o{ recharge_sales_closures : "created_by"
  users |o--o{ recharge_sales_closures : "updated_by"
  users ||--o{ recharge_sim_daily_stock : "created_by"
  recharge_sim_types ||--o{ recharge_sim_daily_stock : "sim_type_id"
  users |o--o{ recharge_sim_daily_stock : "updated_by"
  users ||--o{ recharge_sim_dpi_images : "created_by"
  clients |o--o{ recharge_sim_sale_registrations : "client_id"
  users ||--o{ recharge_sim_sale_registrations : "created_by"
  recharge_sim_dpi_images |o--o{ recharge_sim_sale_registrations : "dpi_image_id"
  recharge_sim_sales ||--o{ recharge_sim_sale_registrations : "recharge_sim_sale_id"
  users |o--o{ recharge_sim_sale_registrations : "voided_by"
  users ||--o{ recharge_sim_sales : "created_by"
  recharge_sim_daily_stock ||--o{ recharge_sim_sales : "daily_stock_id"
  recharge_sim_types ||--o{ recharge_sim_sales : "sim_type_id"
  users |o--o{ recharge_sim_sales : "voided_by"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio recharges (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** recharge_daily_balances, recharge_day_audit_logs, recharge_day_openings, recharge_purchases, recharge_sales, recharge_sales_closures, recharge_sim_daily_stock, recharge_sim_dpi_images, recharge_sim_sale_registrations, recharge_sim_sales, recharge_sim_types, recharge_types
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
