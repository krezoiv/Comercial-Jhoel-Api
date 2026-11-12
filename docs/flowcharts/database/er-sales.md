# Modelo entidad-relación — Ventas

Módulo: **Ventas (sales)** · Fuente editable: [`er-sales.mmd`](er-sales.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  inventory_stock {
    uuid id PK
    uuid product_id FK
    uuid location_id FK
    integer quantity
    timestamp_with_time_zone updated_at
  }
  products {
    uuid id PK
    character_varying name
    uuid category_id FK
    timestamp_with_time_zone updated_at
    uuid business_id FK
    uuid unit_of_measure_id FK
  }
  sale_details {
    uuid id PK
    uuid sale_id FK
    uuid product_id FK
    integer quantity
    numeric total
    uuid presentation_id FK
    uuid location_id FK
    integer quantity_base_units
    uuid business_id FK
  }
  sales {
    uuid id PK
    uuid user_id FK
    timestamp_with_time_zone sale_date
    numeric total
    timestamp_with_time_zone updated_at
    character_varying status
    uuid client_id FK
    character_varying invoice_number
    uuid voided_by FK
  }
  inventory_locations {
    uuid id PK
  }
  businesses {
    uuid id PK
  }
  categories {
    uuid id PK
  }
  units_of_measure {
    uuid id PK
  }
  product_presentations {
    uuid id PK
  }
  clients {
    uuid id PK
  }
  users {
    uuid id PK
  }
  inventory_locations ||--o{ inventory_stock : "location_id"
  products ||--o{ inventory_stock : "product_id"
  businesses ||--o{ products : "business_id"
  categories ||--o{ products : "category_id"
  units_of_measure ||--o{ products : "unit_of_measure_id"
  businesses ||--o{ sale_details : "business_id"
  inventory_locations |o--o{ sale_details : "location_id"
  product_presentations |o--o{ sale_details : "presentation_id"
  products ||--o{ sale_details : "product_id"
  sales ||--o{ sale_details : "sale_id"
  clients |o--o{ sales : "client_id"
  users ||--o{ sales : "user_id"
  users |o--o{ sales : "voided_by"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio sales (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** inventory_stock, products, sale_details, sales
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
