# Modelo entidad-relación — school-lists

Módulo: **school-lists (school-lists)** · Fuente editable: [`er-school-lists.mmd`](er-school-lists.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  school_dispatch_items {
    uuid id PK
    uuid dispatch_id FK
    uuid product_id FK
    character_varying product_name
  }
  school_dispatches {
    uuid id PK
    uuid quotation_id FK
    uuid dispatched_by FK
  }
  school_list_history {
    bigint id PK
    character_varying entity_type
    character_varying from_status
    character_varying to_status
    uuid created_by FK
  }
  school_list_template_items {
    uuid id PK
    uuid template_id FK
    uuid product_id FK
    character_varying product_name
    integer quantity
    numeric subtotal
  }
  school_list_templates {
    uuid id PK
    character_varying name
    uuid created_by FK
    uuid updated_by FK
    timestamp_with_time_zone updated_at
  }
  school_quotation_items {
    uuid id PK
    uuid quotation_id FK
    uuid template_item_id FK
    uuid product_id FK
    character_varying product_name
    integer quantity
    numeric subtotal
  }
  school_quotation_payments {
    uuid id PK
    uuid quotation_id FK
    character_varying receipt_number
    numeric amount
    uuid bank_id FK
    numeric balance_after
    character_varying status
    uuid reversal_of_id FK
    uuid received_by FK
    uuid voided_by FK
  }
  school_quotations {
    uuid id PK
    character_varying quotation_number
    uuid template_id FK
    character_varying template_name
    character_varying customer_name
    character_varying student_name
    date quotation_date
    date delivery_date
    numeric subtotal
    numeric total
    character_varying status
    uuid created_by FK
  }
  school_supply_allocations {
    uuid id PK
    uuid quotation_id FK
    uuid product_id FK
    integer quantity
    character_varying source_type
    uuid source_movement_id FK
    uuid purchase_id FK
    character_varying status
    uuid created_by FK
    uuid released_by FK
    uuid dispatch_id FK
  }
  school_supply_settings {
    smallint id PK
    uuid updated_by FK
    timestamp_with_time_zone updated_at
  }
  products {
    uuid id PK
  }
  users {
    uuid id PK
  }
  banks {
    uuid id PK
  }
  purchases {
    uuid id PK
  }
  inventory_movements {
    uuid id PK
  }
  school_dispatches ||--o{ school_dispatch_items : "dispatch_id"
  products |o--o{ school_dispatch_items : "product_id"
  users ||--o{ school_dispatches : "dispatched_by"
  school_quotations ||--o| school_dispatches : "quotation_id"
  users ||--o{ school_list_history : "created_by"
  products |o--o{ school_list_template_items : "product_id"
  school_list_templates ||--o{ school_list_template_items : "template_id"
  users |o--o{ school_list_templates : "created_by"
  users |o--o{ school_list_templates : "updated_by"
  products |o--o{ school_quotation_items : "product_id"
  school_quotations ||--o{ school_quotation_items : "quotation_id"
  school_list_template_items |o--o{ school_quotation_items : "template_item_id"
  banks |o--o{ school_quotation_payments : "bank_id"
  school_quotations ||--o{ school_quotation_payments : "quotation_id"
  users ||--o{ school_quotation_payments : "received_by"
  school_quotation_payments |o--o{ school_quotation_payments : "reversal_of_id"
  users |o--o{ school_quotation_payments : "voided_by"
  users |o--o{ school_quotations : "cancelled_by"
  users ||--o{ school_quotations : "created_by"
  users |o--o{ school_quotations : "delivered_by"
  users |o--o{ school_quotations : "finished_by"
  school_list_templates |o--o{ school_quotations : "template_id"
  users |o--o{ school_quotations : "updated_by"
  users ||--o{ school_supply_allocations : "created_by"
  school_dispatches |o--o{ school_supply_allocations : "dispatch_id"
  products ||--o{ school_supply_allocations : "product_id"
  purchases |o--o{ school_supply_allocations : "purchase_id"
  school_quotations ||--o{ school_supply_allocations : "quotation_id"
  users |o--o{ school_supply_allocations : "released_by"
  inventory_movements |o--o{ school_supply_allocations : "source_movement_id"
  users |o--o{ school_supply_settings : "updated_by"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio school-lists (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** school_dispatch_items, school_dispatches, school_list_history, school_list_template_items, school_list_templates, school_quotation_items, school_quotation_payments, school_quotations, school_supply_allocations, school_supply_settings
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
