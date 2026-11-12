# Modelo entidad-relación — Cuentas por Cobrar

Módulo: **Cuentas por Cobrar (accounts-receivable)** · Fuente editable: [`er-accounts-receivable.mmd`](er-accounts-receivable.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  account_receivable_payment_details {
    uuid id PK
    uuid payment_operation_id FK
    uuid account_receivable_id FK
    numeric amount_paid
    numeric previous_balance
    numeric new_balance
  }
  account_receivable_payment_operations {
    uuid id PK
    uuid client_id FK
    uuid bank_id FK
    character_varying reference_number
    numeric total_amount
    character_varying status
    uuid abono_id FK
    uuid cash_movement_id FK
    uuid bank_movement_id FK
    uuid operational_day_id FK
    uuid cut_period_id FK
    uuid created_by FK
  }
  accounts_receivable {
    uuid id PK
    uuid client_id FK
    date date
    numeric amount
    timestamp_with_time_zone updated_at
    uuid created_by FK
    uuid updated_by FK
    character_varying movement_type
    character_varying reference_type
  }
  cash_movements {
    uuid id PK
    date operational_date
    uuid operational_day_id FK
    uuid cut_period_id FK
    character_varying movement_type
    character_varying direction
    numeric amount
    numeric previous_balance
    numeric new_balance
    character_varying reference_type
    character_varying bank_name
    uuid reversal_of_id FK
  }
  banks {
    uuid id PK
  }
  bank_account_movements {
    uuid id PK
  }
  clients {
    uuid id PK
  }
  users {
    uuid id PK
  }
  cash_cut_periods {
    uuid id PK
  }
  cash_operational_days {
    uuid id PK
  }
  accounts_receivable ||--o{ account_receivable_payment_details : "account_receivable_id"
  account_receivable_payment_operations ||--o{ account_receivable_payment_details : "payment_operation_id"
  accounts_receivable |o--o{ account_receivable_payment_operations : "abono_id"
  banks |o--o{ account_receivable_payment_operations : "bank_id"
  bank_account_movements |o--o{ account_receivable_payment_operations : "bank_movement_id"
  cash_movements |o--o{ account_receivable_payment_operations : "cash_movement_id"
  clients ||--o{ account_receivable_payment_operations : "client_id"
  users ||--o{ account_receivable_payment_operations : "created_by"
  cash_cut_periods |o--o{ account_receivable_payment_operations : "cut_period_id"
  cash_operational_days |o--o{ account_receivable_payment_operations : "operational_day_id"
  users |o--o{ account_receivable_payment_operations : "voided_by"
  clients ||--o{ accounts_receivable : "client_id"
  users ||--o{ accounts_receivable : "created_by"
  users |o--o{ accounts_receivable : "updated_by"
  users ||--o{ cash_movements : "created_by"
  cash_cut_periods |o--o{ cash_movements : "cut_period_id"
  cash_operational_days |o--o{ cash_movements : "operational_day_id"
  cash_movements |o--o{ cash_movements : "reversal_of_id"
  users |o--o{ cash_movements : "voided_by"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio accounts-receivable (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** account_receivable_payment_details, account_receivable_payment_operations, accounts_receivable, cash_movements
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
