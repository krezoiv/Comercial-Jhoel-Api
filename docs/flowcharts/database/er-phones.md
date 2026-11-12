# Modelo entidad-relación — Teléfonos

Módulo: **Teléfonos (phones)** · Fuente editable: [`er-phones.mmd`](er-phones.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  phone_sale_dpi_images {
    uuid id PK
    character_varying mime_type
    uuid created_by FK
  }
  phone_sales {
    uuid id PK
    uuid phone_id FK
    uuid client_id FK
    date sale_date
    uuid dpi_image_id FK
    uuid voided_by FK
    uuid created_by FK
    character_varying phone_number
  }
  phones {
    uuid id PK
    character_varying phone_number
    character_varying status
    date purchase_date
    uuid created_by FK
    uuid updated_by FK
    timestamp_with_time_zone updated_at
    character_varying sim_number
  }
  users {
    uuid id PK
  }
  clients {
    uuid id PK
  }
  users ||--o{ phone_sale_dpi_images : "created_by"
  clients |o--o{ phone_sales : "client_id"
  users ||--o{ phone_sales : "created_by"
  phone_sale_dpi_images |o--o{ phone_sales : "dpi_image_id"
  phones ||--o{ phone_sales : "phone_id"
  users |o--o{ phone_sales : "voided_by"
  users ||--o{ phones : "created_by"
  users |o--o{ phones : "updated_by"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio phones (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** phone_sale_dpi_images, phone_sales, phones
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
