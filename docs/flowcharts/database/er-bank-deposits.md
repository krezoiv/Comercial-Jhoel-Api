# Modelo entidad-relación — Transaccionar (operaciones bancarias)

Módulo: **Transaccionar (operaciones bancarias) (bank-deposits)** · Fuente editable: [`er-bank-deposits.mmd`](er-bank-deposits.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  bank_deposit_cash_details {
    uuid id PK
    uuid operation_id FK
    integer quantity
    numeric subtotal
  }
  bank_deposit_operations {
    uuid id PK
    uuid transaction_bank_id FK
    numeric total_amount
    numeric total_cash
    numeric total_distributed
    date operation_date
    uuid user_id FK
    timestamp_with_time_zone updated_at
    character_varying client_name
    uuid transaction_type_id FK
    uuid voided_by FK
    uuid client_id FK
  }
  bank_deposit_transactions {
    uuid id PK
    uuid operation_id FK
    numeric amount
  }
  banks {
    uuid id PK
  }
  clients {
    uuid id PK
  }
  transaction_banks {
    uuid id PK
  }
  users {
    uuid id PK
  }
  transaction_types {
    uuid id PK
  }
  bank_deposit_operations ||--o{ bank_deposit_cash_details : "operation_id"
  banks |o--o{ bank_deposit_operations : "bank_account_id"
  clients |o--o{ bank_deposit_operations : "client_id"
  transaction_banks |o--o{ bank_deposit_operations : "transaction_bank_id"
  users ||--o{ bank_deposit_operations : "user_id"
  users |o--o{ bank_deposit_operations : "voided_by"
  transaction_types ||--o{ bank_deposit_operations : "transaction_type_id"
  bank_deposit_operations ||--o{ bank_deposit_transactions : "operation_id"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio bank-deposits (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** bank_deposit_cash_details, bank_deposit_operations, bank_deposit_transactions
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
