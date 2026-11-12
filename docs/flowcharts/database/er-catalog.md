# Modelo entidad-relación — Catálogo de teléfonos

Módulo: **Catálogo de teléfonos (catalog)** · Fuente editable: [`er-catalog.mmd`](er-catalog.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  catalog_phone_images {
    uuid id PK
    uuid catalog_phone_id FK
    character_varying mime_type
    uuid created_by FK
  }
  catalog_phones {
    uuid id PK
    uuid created_by FK
    uuid updated_by FK
    timestamp_with_time_zone updated_at
  }
  catalog_requests {
    uuid id PK
    uuid catalog_phone_id FK
    character_varying request_type
    character_varying customer_name
    character_varying status
    timestamp_with_time_zone updated_at
    uuid updated_by FK
  }
  users {
    uuid id PK
  }
  catalog_phones ||--o{ catalog_phone_images : "catalog_phone_id"
  users ||--o{ catalog_phone_images : "created_by"
  users ||--o{ catalog_phones : "created_by"
  users |o--o{ catalog_phones : "updated_by"
  catalog_phones |o--o{ catalog_requests : "catalog_phone_id"
  users |o--o{ catalog_requests : "updated_by"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio catalog (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** catalog_phone_images, catalog_phones, catalog_requests
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
