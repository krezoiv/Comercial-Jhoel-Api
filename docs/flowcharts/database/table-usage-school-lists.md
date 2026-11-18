# Qué módulos usan las tablas — school-lists

Módulo: **school-lists (school-lists)** · Fuente editable: [`table-usage-school-lists.mmd`](table-usage-school-lists.mmd) · [Índice de diagramas](../README.md)

```mermaid
flowchart LR
  n1[("school_dispatch_items")]
  n2["school-lists<br/><small>api/school-lists</small>"]
  n3[("school_dispatches")]
  n4[("school_list_history")]
  n5[("school_list_template_items")]
  n6[("school_list_templates")]
  n7[("school_quotation_items")]
  n8[("school_quotation_payments")]
  n9[("school_quotations")]
  n10[("school_supply_allocations")]
  n11[("school_supply_settings")]
  n2 -->|consulta · escribe vía dispatch_school_quotation()| n1
  n2 -->|consulta · escribe vía dispatch_school_quotation()| n3
  n2 -->|consulta · escribe vía allocate_school_supply_manual() …| n4
  n2 -->|consulta · escribe vía duplicate_school_list_template() …| n5
  n2 -->|consulta · escribe vía duplicate_school_list_template() …| n6
  n2 -->|consulta · escribe vía update_school_quotation()| n7
  n2 -->|consulta · escribe vía cancel_school_quotation() …| n8
  n2 -->|consulta · escribe vía cancel_school_quotation() …| n9
  n2 -->|consulta · escribe vía allocate_school_supply_manual() …| n10
  n2 -->|consulta · escribe vía set_school_supply_mode()| n11
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
  class n1,n3,n4,n5,n6,n7,n8,n9,n10,n11 db
  class n2 app
```

## Explicación

1. **¿Qué proceso representa?** Módulos del backend que usan cada tabla y cómo: entidad TypeORM, consulta SQL, escritura SQL directa o escritura a través de una función PL/pgSQL
2. **¿Dónde comienza?** Código de comercial-jhoel-api/src/modules (sin migraciones ni pruebas)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules`](../../../comercial-jhoel-api/src/modules)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica
6. **¿Dónde se almacenan los datos?** school_dispatch_items, school_dispatches, school_list_history, school_list_template_items, school_list_templates, school_quotation_items, school_quotation_payments, school_quotations, school_supply_allocations, school_supply_settings
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** No aplica

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
