# Modelo entidad-relación — Suscripciones a noticias (Web Push)

Módulo: **Suscripciones a noticias (Web Push) (news-subscriptions)** · Fuente editable: [`er-news-subscriptions.mmd`](er-news-subscriptions.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  news_push_deliveries {
    uuid id PK
    uuid news_article_id FK
    uuid push_subscription_id FK
    character_varying status
  }
  news_push_subscriptions {
    uuid id PK
    uuid subscriber_id FK
    timestamp_with_time_zone updated_at
  }
  news_subscriber_audit_log {
    uuid id PK
    uuid subscriber_id FK
    uuid_ previous_type_ids
    uuid_ new_type_ids
    uuid performed_by FK
  }
  news_subscriber_types {
    uuid subscriber_id PK
    uuid news_type_id PK
  }
  news_subscribers {
    uuid id PK
    character_varying whatsapp_number
    character_varying name
    timestamp_with_time_zone updated_at
  }
  news_articles {
    uuid id PK
  }
  users {
    uuid id PK
  }
  news_types {
    uuid id PK
  }
  news_articles ||--o{ news_push_deliveries : "news_article_id"
  news_push_subscriptions ||--o{ news_push_deliveries : "push_subscription_id"
  news_subscribers ||--o{ news_push_subscriptions : "subscriber_id"
  users |o--o{ news_subscriber_audit_log : "performed_by"
  news_subscribers ||--o{ news_subscriber_audit_log : "subscriber_id"
  news_types ||--o{ news_subscriber_types : "news_type_id"
  news_subscribers ||--o{ news_subscriber_types : "subscriber_id"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio news-subscriptions (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** news_push_deliveries, news_push_subscriptions, news_subscriber_audit_log, news_subscriber_types, news_subscribers
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
