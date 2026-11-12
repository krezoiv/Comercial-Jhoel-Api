# Modelo entidad-relación — Caja Guayacán

Módulo: **Caja Guayacán (guayacan-cash-box)** · Fuente editable: [`er-guayacan-cash-box.mmd`](er-guayacan-cash-box.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  guayacan_cash_count_details {
    uuid id PK
    uuid count_id FK
    integer quantity
    numeric subtotal
  }
  guayacan_cash_counts {
    uuid id PK
    date business_date
    numeric total_counted
    numeric system_balance
    uuid created_by FK
    uuid last_movement_id FK
  }
  guayacan_cash_movement_details {
    uuid id PK
    uuid movement_id FK
    integer quantity
    numeric subtotal
  }
  guayacan_cash_movements {
    uuid id PK
    character_varying movement_type
    numeric amount
    numeric balance_before
    numeric balance_after
    date business_date
    character_varying reference_type
    uuid reversal_of_id FK
    character_varying status
    uuid voided_by FK
    uuid created_by FK
  }
  guayacan_commissions {
    uuid id PK
    uuid operation_id FK
    date business_date
    numeric amount
    character_varying status
    uuid voided_by FK
    uuid legacy_movement_id FK
    uuid created_by FK
  }
  users {
    uuid id PK
  }
  bank_deposit_operations {
    uuid id PK
  }
  guayacan_cash_counts ||--o{ guayacan_cash_count_details : "count_id"
  users ||--o{ guayacan_cash_counts : "created_by"
  guayacan_cash_movements |o--o{ guayacan_cash_counts : "last_movement_id"
  guayacan_cash_movements ||--o{ guayacan_cash_movement_details : "movement_id"
  users ||--o{ guayacan_cash_movements : "created_by"
  guayacan_cash_movements |o--o{ guayacan_cash_movements : "reversal_of_id"
  users |o--o{ guayacan_cash_movements : "voided_by"
  users ||--o{ guayacan_commissions : "created_by"
  guayacan_cash_movements |o--o{ guayacan_commissions : "legacy_movement_id"
  bank_deposit_operations ||--o| guayacan_commissions : "operation_id"
  users |o--o{ guayacan_commissions : "voided_by"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio guayacan-cash-box (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** guayacan_cash_count_details, guayacan_cash_counts, guayacan_cash_movement_details, guayacan_cash_movements, guayacan_commissions
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
