# Qué módulos usan las tablas — Visitas al sitio

Módulo: **Visitas al sitio (site-visits)** · Fuente editable: [`table-usage-site-visits.mmd`](table-usage-site-visits.mmd) · [Índice de diagramas](../README.md)

```mermaid
flowchart LR
  n1[("site_visits")]
  n2["Visitas al sitio<br/><small>api/site-visits</small>"]
  n2 -->|consulta · entidad ORM …| n1
  classDef start fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20
  classDef fe fill:#e3f2fd,stroke:#1565c0,color:#0d47a1
  classDef api fill:#ede7f6,stroke:#4527a0,color:#311b92
  classDef app fill:#e0f2f1,stroke:#00695c,color:#004d40
  classDef dom fill:#fff8e1,stroke:#f9a825,color:#5d4037
  classDef infra fill:#f3e5f5,stroke:#6a1b9a,color:#4a148c
  classDef db fill:#eceff1,stroke:#455a64,color:#263238
  classDef dec fill:#fffde7,stroke:#f57f17,color:#3e2723
  classDef err fill:#ffebee,stroke:#c62828,color:#b71c1c
  classDef ok fill:#e8f5e9,stroke:#1b5e20,color:#1b5e20
  class n1 db
  class n2 app
```

## Explicación

1. **¿Qué proceso representa?** Módulos del backend que usan cada tabla y cómo: entidad TypeORM, consulta SQL, escritura SQL directa o escritura a través de una función PL/pgSQL
2. **¿Dónde comienza?** Código de comercial-jhoel-api/src/modules (sin migraciones ni pruebas)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules`](../../../comercial-jhoel-api/src/modules)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica
6. **¿Dónde se almacenan los datos?** site_visits
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** No aplica

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
