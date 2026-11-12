# Modelo entidad-relación — Compras

Módulo: **Compras (purchases)** · Fuente editable: [`er-purchases.mmd`](er-purchases.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  purchase_details {
    uuid id PK
    uuid purchase_id FK
    uuid product_id FK
    integer quantity
    numeric total
    uuid presentation_id FK
    uuid location_id FK
    integer quantity_base_units
  }
  purchases {
    uuid id PK
    uuid supplier_id FK
    uuid user_id FK
    timestamp_with_time_zone purchase_date
    numeric total
    timestamp_with_time_zone updated_at
    character_varying payment_type
    date payment_due_date
    character_varying payment_status
    uuid paid_by FK
    character_varying invoice_number
    uuid voided_by FK
  }
  inventory_locations {
    uuid id PK
  }
  product_presentations {
    uuid id PK
  }
  products {
    uuid id PK
  }
  users {
    uuid id PK
  }
  suppliers {
    uuid id PK
  }
  inventory_locations |o--o{ purchase_details : "location_id"
  product_presentations |o--o{ purchase_details : "presentation_id"
  products ||--o{ purchase_details : "product_id"
  purchases ||--o{ purchase_details : "purchase_id"
  users |o--o{ purchases : "paid_by"
  suppliers ||--o{ purchases : "supplier_id"
  users ||--o{ purchases : "user_id"
  users |o--o{ purchases : "voided_by"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio purchases (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** purchase_details, purchases
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
